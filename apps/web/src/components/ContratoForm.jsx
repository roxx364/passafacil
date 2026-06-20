
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NORMAL_SUBJECTS, 
  TRANSVERSAL_SUBJECTS, 
  PRICING, 
  getPlanName,
  calculateNormalSubjectPrice,
  calculateTransversalPrice,
  calculateTotalPrice
} from '@/hooks/usePriceCalculator.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ContratoForm() {
  const navigate = useNavigate();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loginPortal, setLoginPortal] = useState('');
  const [senhaPortal, setSenhaPortal] = useState('');
  const [indicacaoAmigo, setIndicacaoAmigo] = useState('');
  
  const [planType, setPlanType] = useState('individual'); // 'individual', 'full', 'fullWithReferral'
  const [selectedNormalSubject, setSelectedNormalSubject] = useState('');
  const [selectedTransversalSubject, setSelectedTransversalSubject] = useState('');

  // Derivação automática de preço baseada no estado atual
  let currentPrice = 0;
  if (planType === 'full') {
    currentPrice = PRICING.fullPortal;
  } else if (planType === 'fullWithReferral') {
    currentPrice = PRICING.fullPortalWithReferral;
  } else {
    currentPrice = calculateTotalPrice(selectedNormalSubject, selectedTransversalSubject);
  }

  // Tratamento de clique no rádio para permitir desmarcar se for opcional
  const handleNormalClick = (e, subject) => {
    if (selectedNormalSubject === subject) {
      e.preventDefault();
      setSelectedNormalSubject('');
    }
  };

  const handleTransversalClick = (e, subject) => {
    if (selectedTransversalSubject === subject) {
      e.preventDefault();
      setSelectedTransversalSubject('');
    }
  };

  const validateForm = () => {
    if (!nomeCompleto.trim()) {
      toast.error("Por favor, informe seu nome completo");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, informe um e-mail válido");
      return false;
    }

    if (currentPrice <= 0) {
      toast.error("Por favor, selecione pelo menos uma matéria");
      return false;
    }

    // Validações adicionais para garantir que o formulário não vá incompleto
    if (!whatsapp.trim() || !loginPortal.trim() || !senhaPortal.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return false;
    }

    if (planType === 'fullWithReferral' && !indicacaoAmigo.trim()) {
      toast.error("Por favor, informe o nome do amigo que indicou");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    let materias = [];
    if (planType === 'full' || planType === 'fullWithReferral') {
      materias.push('Portal completo');
    } else {
      if (selectedNormalSubject) {
        materias.push(`Normal: ${selectedNormalSubject}`);
      }
      if (selectedTransversalSubject) {
        materias.push(`Transversal: ${selectedTransversalSubject}`);
      }
    }
    
    const formData = {
      nomeCompleto,
      email,
      whatsapp,
      loginPortal,
      senhaPortal,
      materiasEscolhidas: materias.join(', '),
      indicacaoAmigo: indicacaoAmigo || '',
      planoSelecionado: getPlanName(planType),
      precoTotal: currentPrice
    };

    // Navigate to PIX Payment page with data
    navigate('/pagamento-pix', { state: formData });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-in fade-in duration-500">
      {/* DADOS PESSOAIS */}
      <Card className="bg-card text-card-foreground border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dados pessoais</CardTitle>
          <CardDescription className="text-card-foreground/80">
            Preencha seus dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nomeCompleto">Nome completo *</Label>
            <Input
              id="nomeCompleto"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              className="mt-1 bg-background text-foreground border-border focus-visible:ring-primary"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-background text-foreground border-border focus-visible:ring-primary"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="mt-1 bg-background text-foreground border-border focus-visible:ring-primary"
              placeholder="(11) 99999-9999"
            />
          </div>
        </CardContent>
      </Card>

      {/* ACESSO AO PORTAL */}
      <Card className="bg-card text-card-foreground border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Acesso ao portal</CardTitle>
          <CardDescription className="text-card-foreground/80">
            Crie suas credenciais de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="loginPortal">Login do portal *</Label>
            <Input
              id="loginPortal"
              value={loginPortal}
              onChange={(e) => setLoginPortal(e.target.value)}
              className="mt-1 bg-background text-foreground border-border focus-visible:ring-primary"
              placeholder="Escolha seu login"
            />
          </div>

          <div>
            <Label htmlFor="senhaPortal">Senha do portal *</Label>
            <Input
              id="senhaPortal"
              type="password"
              value={senhaPortal}
              onChange={(e) => setSenhaPortal(e.target.value)}
              className="mt-1 bg-background text-foreground border-border focus-visible:ring-primary"
              placeholder="Escolha sua senha"
            />
          </div>
        </CardContent>
      </Card>

      {/* PLANO E MATÉRIAS */}
      <Card className="bg-card text-card-foreground border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Escolha seu plano</CardTitle>
          <CardDescription className="text-card-foreground/80">
            Selecione sua matéria ou opte pelo portal completo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors duration-200 cursor-pointer ${planType === 'individual' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
              <input 
                type="radio" 
                name="planType"
                value="individual"
                checked={planType === 'individual'}
                onChange={() => setPlanType('individual')}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="flex-1 font-medium">Matérias individuais</span>
            </label>

            <label className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors duration-200 cursor-pointer ${planType === 'full' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
              <input 
                type="radio" 
                name="planType"
                value="full"
                checked={planType === 'full'}
                onChange={() => setPlanType('full')}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="flex-1 font-medium">Portal completo - R$ 135,00</span>
            </label>

            <label className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors duration-200 cursor-pointer ${planType === 'fullWithReferral' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
              <input 
                type="radio" 
                name="planType"
                value="fullWithReferral"
                checked={planType === 'fullWithReferral'}
                onChange={() => setPlanType('fullWithReferral')}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="flex-1 font-medium">Portal completo com indicação - R$ 100,00</span>
            </label>
          </div>

          {planType === 'individual' && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div>
                <span className="text-sm font-semibold mb-3 block text-primary">Matérias normais (Selecione apenas uma)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NORMAL_SUBJECTS.map((subject) => {
                    const subjectPrice = calculateNormalSubjectPrice(subject);
                    return (
                      <label 
                        key={`normal-${subject}`} 
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-200 cursor-pointer ${selectedNormalSubject === subject ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                      >
                        <input 
                          type="radio"
                          name="normalGroup"
                          className="w-4 h-4 accent-primary cursor-pointer"
                          checked={selectedNormalSubject === subject}
                          onChange={() => setSelectedNormalSubject(subject)}
                          onClick={(e) => handleNormalClick(e, subject)}
                        />
                        <span className="text-sm flex-1">
                          {subject} <span className="font-semibold text-primary block mt-0.5">R$ {subjectPrice.toFixed(2).replace('.', ',')}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold mb-3 block text-primary">Matéria transversal (Opcional, selecione até uma)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TRANSVERSAL_SUBJECTS.map((subject) => {
                    const subjectPrice = calculateTransversalPrice(subject);
                    return (
                      <label 
                        key={`transversal-${subject}`} 
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-200 cursor-pointer ${selectedTransversalSubject === subject ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                      >
                        <input 
                          type="radio"
                          name="transversalGroup"
                          className="w-4 h-4 accent-primary cursor-pointer"
                          checked={selectedTransversalSubject === subject}
                          onChange={() => setSelectedTransversalSubject(subject)}
                          onClick={(e) => handleTransversalClick(e, subject)}
                        />
                        <span className="text-sm flex-1">
                          {subject} <span className="font-semibold text-primary block mt-0.5">R$ {subjectPrice.toFixed(2).replace('.', ',')}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {planType === 'fullWithReferral' && (
            <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <Label htmlFor="indicacaoAmigo">Nome do amigo que indicou *</Label>
              <Input
                id="indicacaoAmigo"
                value={indicacaoAmigo}
                onChange={(e) => setIndicacaoAmigo(e.target.value)}
                className="mt-1 bg-background text-foreground border-border focus-visible:ring-primary"
                placeholder="Digite o nome completo do amigo"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* PRICE SUMMARY DISPLAY */}
      <Card className="bg-primary/10 border-primary shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider block">Total do Pedido</span>
              {planType === 'individual' && (selectedNormalSubject || selectedTransversalSubject) && (
                <div className="text-sm text-foreground/80 mt-1 flex flex-col">
                  {selectedNormalSubject && (
                    <span>
                      1 Normal ({selectedNormalSubject})
                    </span>
                  )}
                  {selectedTransversalSubject && <span>1 Transversal ({selectedTransversalSubject})</span>}
                </div>
              )}
              {planType !== 'individual' && (
                <p className="text-sm text-foreground/80 mt-1">
                  {getPlanName(planType)}
                </p>
              )}
            </div>
            <span className="text-4xl font-bold text-primary tracking-tight">
              R$ {currentPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-lg py-6 shadow-lg shadow-primary/20"
      >
        Contratar agora
      </Button>
    </form>
  );
}
