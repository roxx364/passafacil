
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { calculateNormalSubjectPrice, calculateTransversalPrice } from '@/hooks/usePriceCalculator.js';

export default function OrderSummary({ 
  open, 
  onOpenChange, 
  formData, 
  planName, 
  totalPrice,
  selectedNormalSubject,
  selectedTransversalSubject,
  onConfirm,
  isSubmitting 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Confirmar pedido</DialogTitle>
          <DialogDescription className="text-card-foreground/80">
            Revise os detalhes do seu pedido antes de confirmar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider block mb-3">Dados pessoais</span>
            <div className="space-y-2 bg-background/50 p-3 rounded-lg border border-border/50">
              <p className="text-sm flex justify-between"><span className="font-medium text-muted-foreground">Nome:</span> <span className="font-medium">{formData.nomeCompleto}</span></p>
              <p className="text-sm flex justify-between"><span className="font-medium text-muted-foreground">WhatsApp:</span> <span className="font-medium">{formData.whatsapp}</span></p>
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider block mb-3">Acesso ao portal</span>
            <div className="space-y-2 bg-background/50 p-3 rounded-lg border border-border/50">
              <p className="text-sm flex justify-between"><span className="font-medium text-muted-foreground">Login:</span> <span className="font-medium">{formData.loginPortal}</span></p>
              <p className="text-sm flex justify-between"><span className="font-medium text-muted-foreground">Senha:</span> <span className="font-medium">{formData.senhaPortal}</span></p>
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider block mb-3">Plano selecionado</span>
            <div className="bg-background/50 p-4 rounded-lg border border-border/50">
              <p className="text-base font-semibold text-foreground">{planName}</p>
              
              {planName === 'Matérias individuais' && (selectedNormalSubject || selectedTransversalSubject) && (
                <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                  {selectedNormalSubject && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Matéria Normal: <span className="text-foreground font-medium">{selectedNormalSubject}</span></span>
                      <span className="font-medium">R$ {calculateNormalSubjectPrice(selectedNormalSubject).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {selectedTransversalSubject && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Matéria Transversal: <span className="text-foreground font-medium">{selectedTransversalSubject}</span></span>
                      <span className="font-medium">R$ {calculateTransversalPrice(selectedTransversalSubject).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {formData.indicacaoAmigo && (
            <>
              <Separator className="bg-border" />
              <div>
                <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider block mb-3">Indicação</span>
                <p className="text-sm bg-background/50 p-3 rounded-lg border border-border/50 font-medium">{formData.indicacaoAmigo}</p>
              </div>
            </>
          )}

          <div className="bg-primary/10 rounded-xl p-5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-3xl font-bold text-primary">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto border-border hover:bg-muted"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
          >
            {isSubmitting ? 'Processando...' : 'Confirmar pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
