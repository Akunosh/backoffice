import { useLocation, Link } from "wouter";
import { Package, Users, ShoppingCart, FileText, Home, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const dockItems = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Produits", url: "/stock", icon: Package },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Ventes", url: "/sales", icon: ShoppingCart },
  { title: "Commandes", url: "/orders", icon: ShoppingBag },
  { title: "Devis", url: "/estimates", icon: FileText },
];

export function AppDock() {
  const [location] = useLocation();

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-1 px-3 py-2 rounded-2xl h-[70px] bg-background/95 dark:bg-card border border-border shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Navigation principale"
    >
      <div className="flex items-center justify-center gap-1">
        {dockItems.map((item) => {
          const isActive = location === item.url;
          const testId = `nav-${item.url.slice(1) || "home"}`;
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  data-testid={testId}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 min-w-12 min-h-12 rounded-xl transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" aria-hidden />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}
