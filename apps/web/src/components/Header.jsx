
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">PassaFácil</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/contratar" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/contratar') 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Contratar
            </Link>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/contratar">Contratar agora</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/contratar" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/contratar') 
                    ? 'text-primary' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Contratar
              </Link>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                <Link to="/contratar" onClick={() => setMobileMenuOpen(false)}>
                  Contratar agora
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
