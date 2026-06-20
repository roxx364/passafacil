
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ContratoForm from '@/components/ContratoForm.jsx';

export default function ContratoPage() {
  return (
    <>
      <Helmet>
        <title>Contratar - PassaFácil</title>
        <meta name="description" content="Contrate seu plano PassaFácil e comece sua jornada rumo à aprovação no vestibular." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Contrate seu plano <span className="text-primary">PassaFácil</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Preencha o formulário abaixo para criar sua conta e começar seus estudos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ContratoForm />
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}
