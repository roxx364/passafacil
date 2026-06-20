
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function HomePage() {
  const benefits = [
    {
      icon: BookOpen,
      title: 'Apoio no prazo',
      description: 'Oferecemos suporte para que você organize e entregue suas atividades com mais tranquilidade.'
    },
    {
      icon: Target,
      title: 'Total sigilo',
      description: 'Seus dados de acesso ficam protegidos e sua privacidade é nossa prioridade.'
    },
    {
      icon: TrendingUp,
      title: 'Preço justo',
      description: 'Planos acessíveis com atendimento personalizado e acompanhamento contínuo.'
    }
  ];

  const pricingOptions = [
    {
      name: 'Matérias individuais',
      description: 'Escolha apenas as matérias que precisa',
      price: 'A partir de R$ 10',
      features: [
        'Matérias normais: R$ 10 cada',
        'Matérias transversais: R$ 15 cada',
        'Acesso ao portal',
        'Material didático'
      ]
    },
    {
      name: 'Portal completo',
      description: 'Acesso ilimitado a todas as matérias',
      price: 'R$ 135',
      features: [
        'Todas as matérias incluídas',
        'Acesso completo ao portal',
        'Todo material didático',
        'Suporte prioritário'
      ],
      highlighted: true
    },
    {
      name: 'Com indicação',
      description: 'Portal completo com desconto especial',
      price: 'R$ 100',
      features: [
        'Todas as matérias incluídas',
        'Desconto de R$ 35',
        'Acesso completo ao portal',
        'Ajude um amigo e economize'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>PassaFácil - Sua aprovação no vestibular começa aqui</title>
        <meta name="description" content="Plataforma completa de estudos para vestibular com acesso ao portal educacional, materiais de qualidade e planos flexíveis." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1690049104977-938673e707f7)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Chega de se preocupar com o <span className="text-primary">portal</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Nós fazemos suas matérias enquanto você foca no que realmente importa.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                <Link to="/contratar">
                  Contratar agora <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug" style={{ textWrap: 'balance' }}>
                Por que escolher o PassaFácil
              </h2>
              <p className="text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Uma plataforma completa pensada para maximizar seus resultados
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-background border-border hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <benefit.icon className="text-primary" size={24} />
                      </div>
                      <CardTitle className="text-xl font-semibold">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-foreground/80 leading-relaxed">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug" style={{ textWrap: 'balance' }}>
                Planos que cabem no seu bolso
              </h2>
              <p className="text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Escolha o plano ideal para suas necessidades
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={option.highlighted ? 'md:scale-105' : ''}
                >
                  <Card className={`h-full flex flex-col ${
                    option.highlighted 
                      ? 'bg-primary/5 border-primary shadow-lg ring-2 ring-primary' 
                      : 'bg-card border-border'
                  }`}>
                    <CardHeader>
                      {option.highlighted && (
                        <div className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit">
                          Mais popular
                        </div>
                      )}
                      <CardTitle className="text-xl font-semibold">{option.name}</CardTitle>
                      <CardDescription className={option.highlighted ? 'text-foreground/80' : ''}>
                        {option.description}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-primary">{option.price}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-3 flex-1">
                        {option.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckCircle2 className="text-primary mr-2 mt-0.5 flex-shrink-0" size={18} />
                            <span className="text-sm text-foreground/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        asChild 
                        className={`w-full mt-6 ${
                          option.highlighted 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        <Link to="/contratar">Escolher plano</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug" style={{ textWrap: 'balance' }}>
                Pronto para começar sua jornada
              </h2>
              <p className="text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Não perca mais tempo. Comece agora e dê o primeiro passo rumo à sua aprovação
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                <Link to="/contratar">
                  Contratar agora <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
