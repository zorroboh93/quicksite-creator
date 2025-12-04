import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
<<<<<<< HEAD
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
=======
    {(() => {
      // Normalizza import.meta.env.BASE_URL per gestire sia './' che '/repo/'
      const rawBase = (import.meta.env.BASE_URL ?? "/").toString();
      const base = rawBase.startsWith("./") ? rawBase.replace(/^\.\//, "/") : rawBase;
      return (
        <BrowserRouter basename={base}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      );
    })()}
    
>>>>>>> 0a34aeb (chore: set vite base to /quicksite-creator/ and normalize BrowserRouter basename; rebuild docs)
  </TooltipProvider>
);

export default App;
