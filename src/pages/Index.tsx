import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import UniversitiesSection from "@/components/UniversitiesSection";
import PremiumSection from "@/components/PremiumSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UniversitiesSection />
      <PremiumSection />
      <Footer />
    </div>
  );
};

export default Index;
