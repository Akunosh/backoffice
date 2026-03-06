import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Users, ShoppingCart, FileText, ArrowRight, AlertTriangle } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalClients: number;
  totalSales: number;
  totalRevenue: number;
  pendingEstimates: number;
  recentSales: Array<{
    id: string;
    clientName: string;
    amount: string;
    date: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    totalStock: number;
  }>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-10 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate cursor-pointer" data-testid="card-stat-products">
          <Link href="/stock" className="block min-h-[7rem] sm:min-h-0">
            <CardContent className="pt-5 px-4 sm:pt-6 pb-4 sm:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats?.totalProducts ?? 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Produits</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{stats?.totalStock ?? 0} unités en stock</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="card-stat-clients">
          <Link href="/clients">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats?.totalClients ?? 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Clients</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Clients enregistrés</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="card-stat-sales">
          <Link href="/sales" className="block min-h-[7rem] sm:min-h-0">
            <CardContent className="pt-5 px-4 sm:pt-6 pb-4 sm:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{Number(stats?.totalRevenue ?? 0).toFixed(0)}€</p>
                  <p className="text-sm text-muted-foreground mt-1">Chiffre d'affaires</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{stats?.totalSales ?? 0} ventes</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="card-stat-estimates">
          <Link href="/estimates">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats?.pendingEstimates ?? 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Devis en attente</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">À traiter</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base font-semibold">Ventes récentes</CardTitle>
            <Link href="/sales">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Tout voir <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentSales && stats.recentSales.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSales.slice(0, 5).map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between py-2"
                    data-testid={`sale-item-${sale.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {(sale.clientName || "A").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{sale.clientName || "Anonyme"}</p>
                        <p className="text-xs text-muted-foreground">{sale.date}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      +{sale.amount}€
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Aucune vente récente</p>
                <Link href="/sales">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Créer une vente
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
            <CardTitle className="text-base font-semibold">Alertes stock</CardTitle>
            <Link href="/stock">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Gérer <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-2"
                    data-testid={`low-stock-${product.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                    <span className="text-sm px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                      {product.totalStock} restants
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Stock bien approvisionné</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/stock">
          <Card className="hover-elevate cursor-pointer border-dashed">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Ajouter un produit</p>
                <p className="text-xs text-muted-foreground">Nouveau produit</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/clients">
          <Card className="hover-elevate cursor-pointer border-dashed">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Nouveau client</p>
                <p className="text-xs text-muted-foreground">Ajouter un client</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/sales">
          <Card className="hover-elevate cursor-pointer border-dashed">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Nouvelle vente</p>
                <p className="text-xs text-muted-foreground">Enregistrer une vente</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/estimates">
          <Card className="hover-elevate cursor-pointer border-dashed">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Créer un devis</p>
                <p className="text-xs text-muted-foreground">Estimation client</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
