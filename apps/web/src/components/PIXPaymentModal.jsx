
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export default function PIXPaymentModal({ pixData, formData, onCancel, onSuccess }) {
  const [step, setStep] = useState('qr'); // 'qr' | 'saving' | 'success'

  useEffect(() => {
    let intervalId;
    if (step === 'qr' && pixData?.transactionId) {
      intervalId = setInterval(async () => {
        try {
          const res = await apiServerClient.fetch(`/mercadopago/payment/${pixData.transactionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'approved') {
              clearInterval(intervalId);
              handlePaymentSuccess();
            } else if (data.status === 'rejected' || data.status === 'cancelled') {
              clearInterval(intervalId);
              toast.error('O pagamento foi rejeitado ou cancelado. Tente novamente.');
              onCancel();
            }
          }
        } catch (err) {
          console.error('Erro ao verificar pagamento:', err);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(intervalId);
  }, [step, pixData, onCancel]);

  const handlePaymentSuccess = async () => {
    setStep('saving');
    try {
      await pb.collection('contratos').create(formData, { $autoCancel: false });
      setStep('success');
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      toast.error('Pagamento confirmado, mas houve um erro ao registrar. Contate o suporte.');
      setStep('success'); // Still move to success as payment was received
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

  if (step === 'success') {
    return (
      <Card className="bg-card text-card-foreground border-border shadow-lg py-12 animate-in fade-in zoom-in-95 duration-500">
        <CardContent className="flex flex-col items-center justify-center space-y-6 pt-6 text-center">
          <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground tracking-tight">Pagamento confirmado!</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              Seu contrato foi registrado com sucesso. Aguarde contato via WhatsApp para ativar seu acesso.
            </p>
          </div>
          <Button onClick={onSuccess} size="lg" className="w-full max-w-[250px] mt-6 text-lg py-6">
            Voltar ao início
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'saving') {
    return (
      <Card className="bg-card text-card-foreground border-border shadow-lg py-16 text-center">
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          <div className="space-y-2">
            <p className="text-2xl font-bold">Pagamento confirmado!</p>
            <p className="text-muted-foreground text-lg">Registrando seu contrato no sistema...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card text-card-foreground border-border shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-500">
      <CardHeader className="text-center pb-4 pt-8">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
          <QrCode className="text-primary h-8 w-8" /> Pagamento via PIX
        </CardTitle>
        <CardDescription className="text-lg mt-3">
          Abra o app do seu banco e escaneie o QR Code ou copie o código Pix copia e cola abaixo.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center py-6 space-y-8">
        <div className="bg-primary/5 w-full max-w-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-primary/20">
          <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">Total a pagar</span>
          <span className="text-5xl font-extrabold text-primary tracking-tight">
            R$ {formData?.precoTotal?.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {pixData?.qrCodeUrl ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
            <img src={getQrSrc()} alt="QR Code PIX" className="w-64 h-64 object-contain" />
          </div>
        ) : (
          <div className="w-64 h-64 bg-muted rounded-3xl flex items-center justify-center border border-border">
            <QrCode className="h-20 w-20 text-muted-foreground/50" />
          </div>
        )}

        <div className="w-full max-w-md space-y-3">
          <span className="text-sm font-semibold text-muted-foreground block text-center">Código PIX (Copia e Cola)</span>
          <div className="flex gap-2">
            <code className="flex-1 bg-muted px-4 py-4 rounded-xl text-sm truncate border border-border select-all font-mono">
              {pixData?.qrCode || 'Código não disponível'}
            </code>
            <Button variant="secondary" size="icon" onClick={copyPix} className="shrink-0 h-auto w-14 rounded-xl" aria-label="Copiar PIX">
              <Copy className="h-6 w-6 text-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-sm font-medium text-primary bg-primary/10 px-6 py-4 rounded-full w-full max-w-md">
          <Loader2 className="h-5 w-5 animate-spin shrink-0" />
          <span>Aguardando confirmação do pagamento...</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 pb-8 px-8 justify-center">
        <Button variant="ghost" onClick={onCancel} className="w-full max-w-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar e voltar ao formulário
        </Button>
      </CardFooter>
    </Card>
  );
}
