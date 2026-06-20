
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, CheckCircle2, Loader2, AlertCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function PIXPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  const [status, setStatus] = useState('generating'); // 'generating' | 'qr' | 'saving' | 'success' | 'error'
  const [pixData, setPixData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const hasGeneratedRef = useRef(false);

  const generatePix = async () => {
    if (!formData) return;
    
    // Validations before generating PIX
    if (!formData.nomeCompleto?.trim()) {
      toast.error("Por favor, informe seu nome completo");
      setErrorMessage("Por favor, informe seu nome completo");
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error("Por favor, informe um e-mail válido");
      setErrorMessage("Por favor, informe um e-mail válido");
      setStatus('error');
      return;
    }

    if (!formData.precoTotal || formData.precoTotal <= 0) {
      toast.error("Por favor, selecione pelo menos uma matéria");
      setErrorMessage("Por favor, selecione pelo menos uma matéria");
      setStatus('error');
      return;
    }
    
    setStatus('generating');
    setErrorMessage('');
    
    try {
      const res = await apiServerClient.fetch('/pix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          precoTotal: formData.precoTotal
        })
      });

      if (!res.ok) {
        throw new Error('Falha na comunicação com o servidor de pagamento');
      }

      const data = await res.json();
      
      if (!data.qrCode) {
        throw new Error('Dados do PIX inválidos recebidos');
      }

      setPixData(data);
      setStatus('qr');
    } catch (err) {
      console.error('Erro ao gerar PIX:', err);
      setErrorMessage(err.message || 'Não foi possível gerar o PIX. Tente novamente.');
      setStatus('error');
    }
  };

  // Check state and trigger generate on mount
  useEffect(() => {
    if (!formData) {
      navigate('/contratar', { replace: true });
      return;
    }

    if (!hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generatePix();
    }
  }, [formData, navigate]);

  // Polling logic for payment confirmation
  useEffect(() => {
    let intervalId;
    if (status === 'qr' && pixData?.transactionId) {
      intervalId = setInterval(async () => {
        try {
          const res = await apiServerClient.fetch(`/mercadopago/check-payment/${pixData.transactionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'approved') {
              clearInterval(intervalId);
              handlePaymentSuccess();
            } else if (data.status === 'rejected' || data.status === 'cancelled') {
              clearInterval(intervalId);
              setErrorMessage('O pagamento foi rejeitado ou cancelado.');
              setStatus('error');
            }
          }
        } catch (err) {
          console.error('Erro ao verificar pagamento:', err);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(intervalId);
  }, [status, pixData]);

  const handlePaymentSuccess = async () => {
    setStatus('saving');
    try {
      // Removemos o email pois ele não faz parte do schema de Contratos, foi usado apenas para o Mercado Pago
      const { email, ...dataToSave } = formData;
      
      await pb.collection('contratos').create({
        ...dataToSave,
        paymentStatus: 'confirmed'
      }, { $autoCancel: false });
      
      setStatus('success');
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      toast.error('Pagamento confirmado, mas houve um erro ao registrar contrato. Contate o suporte.');
      setStatus('success'); // Still show success for payment
    }
  };

  const copyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      toast.success('Código PIX copiado!');
    }
  };

  const getQrSrc = () => {
    if (!pixData?.qrCodeUrl) return '';
    if (pixData.qrCodeUrl.startsWith('http') || pixData.qrCodeUrl.startsWith('data:')) {
      return pixData.qrCodeUrl;
    }
    return `data:image/png;base64,${pixData.qrCodeUrl}`;
  };

  if (!formData) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 md:px-8">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-start">
          
          {/* Resumo do Pedido */}
          <div className="md:col-span-5 w-full">
            <Card className="bg-card border-border shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Resumo do Pedido</CardTitle>
                <CardDescription>Confira os detalhes da sua contratação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground block">Aluno</span>
                    <span className="font-medium text-foreground">{formData.nomeCompleto}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground block">E-mail</span>
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground block">Plano</span>
                    <span className="font-medium text-foreground">{formData.planoSelecionado}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground block">Matérias</span>
                    <span className="font-medium text-foreground">{formData.materiasEscolhidas}</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider block mb-1">Total a pagar</span>
                  <span className="text-4xl font-extrabold text-primary tracking-tight">
                    R$ {formData.precoTotal?.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área de Pagamento */}
          <div className="md:col-span-7 w-full flex flex-col justify-center">
            {status === 'generating' && (
              <Card className="bg-card border-border shadow-lg py-16 text-center h-full flex flex-col justify-center animate-in fade-in">
                <CardContent className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-lg font-medium">Gerando seu QR Code PIX...</p>
                  <p className="text-sm text-muted-foreground">Conectando ao Mercado Pago</p>
                </CardContent>
              </Card>
            )}

            {status === 'error' && (
              <Card className="bg-card border-border shadow-lg py-12 text-center h-full flex flex-col justify-center animate-in zoom-in-95 duration-300">
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Ocorreu um erro</h3>
                  <p className="text-muted-foreground max-w-sm">{errorMessage}</p>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => navigate('/contratar')}>
                      Voltar
                    </Button>
                    <Button onClick={generatePix} className="gap-2">
                      <RefreshCcw className="h-4 w-4" /> Tentar novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {status === 'qr' && (
              <Card className="bg-card border-border shadow-lg h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                    <QrCode className="text-primary h-6 w-6" /> Pagamento via PIX
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Escaneie o QR Code com o app do seu banco ou copie o código Pix copia e cola.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex flex-col items-center py-6 space-y-6">
                  {pixData?.qrCodeUrl ? (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-border">
                      <img src={getQrSrc()} alt="QR Code PIX" className="w-56 h-56 object-contain" />
                    </div>
                  ) : (
                    <div className="w-56 h-56 bg-muted rounded-2xl flex items-center justify-center border border-border">
                      <QrCode className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}

                  <div className="w-full space-y-3">
                    <span className="text-sm font-semibold text-muted-foreground block text-center">Código PIX (Copia e Cola)</span>
                    <div className="flex gap-2">
                      <code className="flex-1 bg-muted px-4 py-3 rounded-xl text-sm truncate border border-border select-all font-mono">
                        {pixData?.qrCode || 'Código não disponível'}
                      </code>
                      <Button variant="secondary" size="icon" onClick={copyPix} className="shrink-0 h-auto w-12 rounded-xl" aria-label="Copiar Código">
                        <Copy className="h-5 w-5 text-foreground" />
                      </Button>
                    </div>
                    {pixData?.transactionId && (
                      <p className="text-xs text-center text-muted-foreground mt-2 font-mono">
                        ID: {pixData.transactionId}
                      </p>
                    )}
                    <Button variant="outline" className="w-full mt-2" onClick={copyPix}>
                      Copiar Código
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-sm font-medium text-primary bg-primary/10 px-6 py-4 rounded-full w-full">
                    <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                    <span>Aguardando pagamento...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {status === 'saving' && (
              <Card className="bg-card border-border shadow-lg py-16 text-center h-full flex flex-col justify-center animate-in fade-in duration-300">
                <CardContent className="flex flex-col items-center space-y-6">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">Pagamento confirmado!</p>
                    <p className="text-muted-foreground text-lg">Registrando seu contrato no sistema...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {status === 'success' && (
              <Card className="bg-card border-border shadow-lg py-12 h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
                <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">
                      Pagamento confirmado com sucesso!
                    </h3>
                    <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                      Aguarde contato via WhatsApp para ativar seu acesso ao portal PassaFácil.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/contratar')}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Formulário
                    </Button>
                    <Button className="flex-1" onClick={() => navigate('/')}>
                      Ir para Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
