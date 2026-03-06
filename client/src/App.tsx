import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppDock } from "@/components/app-dock";
import { Package } from "lucide-react";
import { Link } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Stock from "@/pages/stock";
import Clients from "@/pages/clients";
import Sales from "@/pages/sales";
import Estimates from "@/pages/estimates";
import Orders from "@/pages/orders";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/stock" component={Stock} />
      <Route path="/clients" component={Clients} />
      <Route path="/sales" component={Sales} />
      <Route path="/estimates" component={Estimates} />
      <Route path="/orders" component={Orders} />
      <Route component={NotFound} />
    </Switch>
  );
}

const pageTitles: Record<string, string> = {
  "/": "Accueil",
  "/stock": "Produits",
  "/clients": "Clients",
  "/sales": "Ventes",
  "/estimates": "Devis",
  "/orders": "Commandes",
};

function AppLayout() {
  const [location] = useLocation();
  const pageTitle = pageTitles[location] || "StockPro";

  return (
    <div className="flex flex-col h-dvh h-screen w-full bg-muted/30 min-h-0">
      <header className="flex h-14 min-h-[3.5rem] items-center justify-between gap-3 border-b bg-background px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-semibold text-base hidden sm:inline">StockPro</span>
          </Link>
          <h1 className="text-base sm:text-lg font-semibold truncate">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 overflow-auto min-h-0 pb-20">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <Router />
        </div>
      </main>
      <AppDock />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="stockpro-theme">
        <TooltipProvider>
          <AppLayout />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
