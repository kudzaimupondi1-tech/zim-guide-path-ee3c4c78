import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground leading-tight">
                EduGuide
              </span>
              <span className="text-xs text-secondary font-semibold -mt-1">Zimbabwe</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/guidance" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Get Guidance
            </Link>
            <Link to="/universities" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Universities
            </Link>
            <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Careers
            </Link>
            <Link to="/premium" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Premium
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/guidance">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fadeIn">
            <div className="flex flex-col gap-3">
              <Link
                to="/guidance"
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Guidance
              </Link>
              <Link
                to="/universities"
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Universities
              </Link>
              <Link
                to="/careers"
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                to="/premium"
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Premium
              </Link>
              <div className="flex gap-2 mt-2 px-4">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" className="flex-1" asChild>
                  <Link to="/guidance">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
