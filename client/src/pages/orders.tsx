import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Search, CreditCard, Phone, Mail } from "lucide-react";
import type { Order, OrderWithDetails } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Orders() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [detailOrder, setDetailOrder] = useState<OrderWithDetails | null>(null);
  const [additionalPayment, setAdditionalPayment] = useState("");

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    refetchOnWindowFocus: true,
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ orderId, additionalAmount }: { orderId: string; additionalAmount: number }) => {
      const res = await apiRequest("PATCH", `/api/orders/${orderId}/payment`, { additionalAmount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      if (detailOrder) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders/" + detailOrder.id] });
      }
      setAdditionalPayment("");
      setDetailOrder(null);
      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été ajouté à la commande",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive",
      });
    },
  });

  const openDetail = async (order: Order) => {
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      if (!res.ok) throw new Error();
      const data: OrderWithDetails = await res.json();
      setDetailOrder(data);
      setAdditionalPayment("");
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger la commande",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders?.filter((o) => {
    const name = (o.firstName ?? "").toLowerCase();
    const phone = (o.phone ?? "").toLowerCase();
    const email = (o.email ?? "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return !q || name.includes(q) || phone.includes(q) || email.includes(q);
  });

  const getStatusLabel = (status: string, order: Order) => {
    const total = Number(order.totalAmount);
    const paid = Number(order.paidAmount);
    const remaining = total - paid;
    const percentLeft = total > 0 ? Math.round((remaining / total) * 100) : 0;
    if (status === "paid") return { label: "Payé", className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" };
    if (status === "partial") return { label: `Partiel (${percentLeft} % restant)`, className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" };
    return { label: "Non payé", className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 py-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 w-full min-w-0 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher par nom, téléphone, email..."
            className="pl-10 min-h-11 sm:min-h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const total = Number(order.totalAmount);
            const paid = Number(order.paidAmount);
            const remaining = total - paid;
            const statusInfo = getStatusLabel(order.paymentStatus, order);
            return (
              <Card
                key={order.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => openDetail(order)}
              >
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{order.firstName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                        </p>
                        {(order.phone || order.email) && (
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                            {order.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {order.phone}
                              </span>
                            )}
                            {order.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {order.email}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="font-medium">Total : {total.toFixed(2)} €</span>
                      <span className="text-muted-foreground">Payé : {paid.toFixed(2)} €</span>
                      {remaining > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Reste : {remaining.toFixed(2)} €
                        </span>
                      )}
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openDetail(order); }}>
                    Détails
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {searchQuery
                ? "Aucune commande ne correspond à votre recherche"
                : "Les commandes passées sur la boutique apparaîtront ici"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detailOrder} onOpenChange={(open) => !open && setDetailOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {detailOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Commande #{detailOrder.id.slice(0, 8)}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{detailOrder.firstName}</p>
                  {detailOrder.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {detailOrder.phone}
                    </p>
                  )}
                  {detailOrder.email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {detailOrder.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(detailOrder.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                  </p>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead className="text-center w-16">Taille</TableHead>
                        <TableHead className="text-center w-16">Qté</TableHead>
                        <TableHead className="text-right">Prix unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.productName ?? "—"}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{item.size ?? "—"}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{Number(item.priceAtTime).toFixed(2)} €</TableCell>
                          <TableCell className="text-right">
                            {(Number(item.priceAtTime) * item.quantity).toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total commande</span>
                  <span>{Number(detailOrder.totalAmount).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Déjà payé</span>
                  <span>{Number(detailOrder.paidAmount).toFixed(2)} €</span>
                </div>
                {Number(detailOrder.totalAmount) - Number(detailOrder.paidAmount) > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                    <span>Reste à payer</span>
                    <span>{(Number(detailOrder.totalAmount) - Number(detailOrder.paidAmount)).toFixed(2)} €</span>
                  </div>
                )}

                {Number(detailOrder.totalAmount) - Number(detailOrder.paidAmount) > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Enregistrer un paiement
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Montant (€)"
                        value={additionalPayment}
                        onChange={(e) => setAdditionalPayment(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          const amount = parseFloat(additionalPayment);
                          if (isNaN(amount) || amount <= 0) {
                            toast({
                              title: "Montant invalide",
                              variant: "destructive",
                            });
                            return;
                          }
                          updatePaymentMutation.mutate({
                            orderId: detailOrder.id,
                            additionalAmount: amount,
                          });
                        }}
                        disabled={updatePaymentMutation.isPending}
                      >
                        {updatePaymentMutation.isPending ? "..." : "Ajouter"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
