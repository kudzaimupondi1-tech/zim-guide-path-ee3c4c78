import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GuidancePage from "./pages/GuidancePage";
import UniversitiesPage from "./pages/UniversitiesPage";
import CareersPage from "./pages/CareersPage";
import PremiumPage from "./pages/PremiumPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import MySubjects from "./pages/MySubjects";
import Recommendations from "./pages/Recommendations";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-subjects" element={<MySubjects />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
