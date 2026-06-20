
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SuccessPage() {
  const location = useLocation();
  const contrato = location.state?.contrato;

  if (!contrato) {
    return (
      <>
        <Helmet>
          <title>Pedido não encontrado - PassaFácil</title>
        </Helmet>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <p className="text-foreground/80 mb-8">Pedido não encontrado</p>
            <Button asChild>
              <Link to="/">Voltar para home</Link>
            </Button>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const selectedSubjects = contrato.materiasEscolhidas.startsWith('[') 
    ? JSON.parse(contrato.materiasEscolhidas)
    : contrato.materiasEscolhidas;

  return (
    <>
      <Helmet>
        <title>Pedido confirmado - PassaFácil</title>
        <meta name="description" content="Seu pedido foi confirmado com sucesso. Obrigado por escolher o PassaFácil." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="text-primary" size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Pedido confirmado com sucesso
              </h1>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Obrigado por escolher o PassaFácil. Seu acesso ao portal foi criado.
              </p>
            </div>

            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Detalhes do pedido</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  Guarde estas informações para acessar o portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-sm font-semibold text-card-foreground/60 block mb-2">Dados pessoais</span>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Nome:</span> {contrato.nomeCompleto}</p>
                    <p className="text-sm"><span className="font-medium">WhatsApp:</span> {contrato.whatsapp}</p>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div>
                  <span className="text-sm font-semibold text-card-foreground/60 block mb-2">Credenciais de acesso</span>
                  <div className="space-y-1 bg-muted p-4 rounded-lg">
                    <p className="text-sm"><span className="font-medium">Login:</span> {contrato.loginPortal}</p>
                    <p className="text-sm"><span className="font-medium">Senha:</span> {contrato.senhaPortal}</p>
                  </div>
                  <p className="text-xs text-card-foreground/60 mt-2">
                    Guarde estas informações em local seguro
                  </p>
                </div>

                <Separator className="bg-border" />

                <div>
                  <span className="text-sm font-semibold text-card-foreground/60 block mb-2">Plano contratado</span>
                  <p className="text-sm font-medium text-primary mb-2">{contrato.planoSelecionado}</p>
                  {Array.isArray(selectedSubjects) && selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSubjects.map((subject, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="bg-border" />

                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Valor pago</span>
                    <span className="text-2xl font-bold text-primary">
                      R$ {contrato.precoTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/">
                  Voltar para home <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}
