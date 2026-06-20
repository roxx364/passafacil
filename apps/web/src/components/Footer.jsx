import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold text-primary mb-4">PassaFácil</div>
            <p className="text-sm text-card-foreground/80 leading-relaxed">
              Sua plataforma completa de profissionais responsáveis em facilitar sua jorna universitária
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold mb-4 block">Navegação</span>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">
                Home
              </Link>
              <Link to="/contratar" className="text-sm text-card-foreground/80 hover:text-primary transition-colors duration-200">
                Contratar
              </Link>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold mb-4 block">Contato</span>
            <div className="flex flex-col space-y-2 text-sm text-card-foreground/80">
              <p>Email: contato@passafacil.com</p>
              <p>WhatsApp: (11) 99999-9999</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-card-foreground/60">
              © 2026 PassaFácil. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-card-foreground/60 hover:text-primary transition-colors duration-200">
                Política de privacidade
              </Link>
              <Link to="/terms" className="text-sm text-card-foreground/60 hover:text-primary transition-colors duration-200">
                Termos de uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}