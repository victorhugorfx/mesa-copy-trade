"use client";

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, CheckCircle, BarChart3, ArrowRight, Shield, Zap, X, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type AccountSize = 10000 | 25000 | 50000 | 100000;
type PlanType = 'approval' | 'management';

const ACCOUNT_SIZES = [
  { value: 10000, label: '10k', display: 'R$ 10.000' },
  { value: 25000, label: '25k', display: 'R$ 25.000' },
  { value: 50000, label: '50k', display: 'R$ 50.000' },
  { value: 100000, label: '100k', display: 'R$ 100.000' },
];

const PLANS = {
  approval: {
    name: 'Plano de Aprovação',
    description: 'Suporte completo para aprovação em mesas proprietárias',
    icon: CheckCircle,
    color: '#1FA65A',
    features: [
      'Suporte especializado para aprovação',
      'Estratégias comprovadas',
      'Acompanhamento personalizado',
      'Análise de risco',
      'Relatórios detalhados',
    ],
    prices: {
      10000: 197.99,
      25000: 297.99,
      50000: 497.99,
      100000: 797.99,
    },
  },
  management: {
    name: 'Plano de Gestão',
    description: 'Acompanhe operações em tempo real estilo Copy Trade',
    icon: BarChart3,
    color: '#2FAE4A',
    features: [
      'Operações em tempo real',
      'Histórico completo de trades',
      'Estatísticas avançadas',
      'Notificações instantâneas',
      'Dashboard personalizado',
    ],
    prices: {
      10000: 247.99,
      25000: 397.99,
      50000: 647.99,
      100000: 997.99,
    },
  },
};

export default function PlanosPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('approval');
  const [selectedSize, setSelectedSize] = useState<AccountSize>(25000);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pixQrCode, setPixQrCode] = useState('');
  const [pixCopyPaste, setPixCopyPaste] = useState('');

  const currentPlan = PLANS[selectedPlan];
  const currentPrice = currentPlan.prices[selectedSize];

  const handleCheckout = () => {
    // Simular busca do Client ID configurado no admin
    const pixClientId = localStorage.getItem('pix_client_id') || 'demo-client-id-12345';

    // Gerar QR Code e Código Copia e Cola baseado no Client ID
    const mockQrCode = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='white'/%3E%3Cg transform='translate(50,50)'%3E%3Crect width='200' height='200' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='20' y='20' width='40' height='40' fill='black'/%3E%3Crect x='140' y='20' width='40' height='40' fill='black'/%3E%3Crect x='20' y='140' width='40' height='40' fill='black'/%3E%3Crect x='80' y='80' width='40' height='40' fill='black'/%3E%3C/g%3E%3Ctext x='150' y='280' text-anchor='middle' font-size='12' fill='gray'%3EPIX QR Code%3C/text%3E%3C/svg%3E`;
    
    const mockCopyPaste = `00020126580014br.gov.bcb.pix0136${pixClientId}5204000053039865406${currentPrice.toFixed(2)}5802BR5925MesaPro Trading Platform6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setPixQrCode(mockQrCode);
    setPixCopyPaste(mockCopyPaste);
    setShowCheckout(true);
    
    toast.success('Checkout gerado! Escaneie o QR Code ou copie o código PIX.');
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    toast.success('Código PIX copiado para área de transferência!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#1FA65A]/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1FA65A] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#0F7A3A]">MesaPro</span>
            </Link>

            <Link href="/login">
              <Button variant="ghost" className="text-[#1FA65A] hover:text-[#0F7A3A] hover:bg-[#1FA65A]/10">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1FA65A]/5 to-white">
        <div className="container mx-auto text-center max-w-3xl">
          <Badge className="mb-4 bg-[#1FA65A]/10 text-[#0F7A3A] border-[#1FA65A]/20">
            Planos Flexíveis
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F7A3A] mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-lg text-[#6B7280]">
            Selecione o tipo de plano e o tamanho da conta que melhor se adequa aos seus objetivos
          </p>
        </div>
      </section>

      {/* Plan Selection */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Plan Type Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#0F7A3A] mb-6 text-center">
              Tipo de Plano
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {(Object.keys(PLANS) as PlanType[]).map((planType) => {
                const plan = PLANS[planType];
                const Icon = plan.icon;
                const isSelected = selectedPlan === planType;

                return (
                  <Card
                    key={planType}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-[#1FA65A] shadow-xl ring-2 ring-[#1FA65A]/20'
                        : 'border-[#1FA65A]/20 hover:border-[#1FA65A]/40'
                    }`}
                    onClick={() => setSelectedPlan(planType)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${plan.color}15` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: plan.color }} />
                        </div>
                        {isSelected && (
                          <Badge className="bg-[#1FA65A] text-white">
                            Selecionado
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-[#0F7A3A]">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-[#6B7280]">
                            <CheckCircle className="w-4 h-4 text-[#1FA65A] mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Account Size Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#0F7A3A] mb-6 text-center">
              Tamanho da Conta
            </h2>
            <RadioGroup
              value={selectedSize.toString()}
              onValueChange={(value) => setSelectedSize(Number(value) as AccountSize)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {ACCOUNT_SIZES.map((size) => (
                <div key={size.value}>
                  <RadioGroupItem
                    value={size.value.toString()}
                    id={`size-${size.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`size-${size.value}`}
                    className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-[#1FA65A] peer-data-[state=checked]:bg-[#1FA65A]/5 hover:border-[#1FA65A]/40"
                  >
                    <span className="text-2xl font-bold text-[#0F7A3A] mb-1">{size.label}</span>
                    <span className="text-sm text-[#6B7280]">{size.display}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Summary Card */}
          <Card className="max-w-2xl mx-auto border-[#1FA65A]/20 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-[#1FA65A]/5 to-white">
              <CardTitle className="text-2xl text-[#0F7A3A]">Resumo do Plano</CardTitle>
              <CardDescription>Confira os detalhes da sua seleção</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Plan Details */}
                <div className="flex items-start justify-between pb-6 border-b border-[#1FA65A]/10">
                  <div>
                    <h3 className="font-semibold text-[#0F7A3A] mb-1">{currentPlan.name}</h3>
                    <p className="text-sm text-[#6B7280] mb-3">{currentPlan.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                      <Shield className="w-4 h-4 text-[#1FA65A]" />
                      <span>Conta de {ACCOUNT_SIZES.find(s => s.value === selectedSize)?.display}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-[#0F7A3A] mb-3">Recursos inclusos:</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-[#6B7280]">
                        <CheckCircle className="w-4 h-4 text-[#1FA65A] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="pt-6 border-t border-[#1FA65A]/10">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-sm text-[#6B7280] mb-1">Valor total</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-[#0F7A3A]">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(currentPrice)}
                        </span>
                        <span className="text-[#6B7280]">/mês</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[#1FA65A]">
                      <Zap className="w-5 h-5" />
                      <span className="text-sm font-medium">Pagamento via PIX</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#1FA65A] hover:bg-[#0F7A3A] text-white text-lg h-12"
                  >
                    Continuar para Pagamento
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <p className="text-xs text-center text-[#6B7280] mt-4">
                    Pagamento seguro via PIX • Ativação instantânea
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#0F7A3A]">Checkout - Pagamento PIX</CardTitle>
                  <CardDescription>Escaneie o QR Code ou copie o código para pagar</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo do Pedido */}
              <div className="bg-[#1FA65A]/5 p-4 rounded-lg border border-[#1FA65A]/20">
                <h3 className="font-semibold text-[#0F7A3A] mb-3">Resumo do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Plano:</span>
                    <span className="font-medium text-[#0F7A3A]">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Tamanho da Conta:</span>
                    <span className="font-medium text-[#0F7A3A]">
                      {ACCOUNT_SIZES.find(s => s.value === selectedSize)?.display}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#1FA65A]/20">
                    <span className="font-semibold text-[#0F7A3A]">Total:</span>
                    <span className="font-bold text-xl text-[#1FA65A]">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(currentPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code e Código Copia e Cola */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#0F7A3A] font-semibold">
                    <QrCode className="w-5 h-5" />
                    <span>QR Code PIX</span>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-2 border-[#1FA65A]/20 flex items-center justify-center">
                    <img src={pixQrCode} alt="QR Code PIX" className="w-full max-w-[250px] h-auto" />
                  </div>
                  <p className="text-xs text-center text-[#6B7280]">
                    Abra o app do seu banco e escaneie o QR Code
                  </p>
                </div>

                {/* Código Copia e Cola */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#0F7A3A] font-semibold">
                    <Copy className="w-5 h-5" />
                    <span>Código Copia e Cola</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-[#1FA65A]/20">
                    <p className="text-xs font-mono break-all text-gray-700 mb-4 max-h-[200px] overflow-y-auto">
                      {pixCopyPaste}
                    </p>
                    <Button 
                      className="w-full bg-[#1FA65A] hover:bg-[#0F7A3A]"
                      onClick={handleCopyPixCode}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código PIX
                    </Button>
                  </div>
                  <p className="text-xs text-center text-[#6B7280]">
                    Ou copie o código e cole no app do seu banco
                  </p>
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">📱 Como pagar:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Escolha a opção PIX</li>
                  <li>Escaneie o QR Code ou cole o código</li>
                  <li>Confirme o pagamento de {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(currentPrice)}</li>
                  <li>Sua conta será ativada automaticamente!</li>
                </ol>
              </div>

              {/* Botão de Fechar */}
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowCheckout(false)}
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1FA65A]/5 to-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F7A3A] mb-8 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Como funciona o pagamento via PIX?',
                a: 'Após selecionar seu plano, você receberá um QR Code PIX para pagamento. A confirmação é automática e sua conta é ativada instantaneamente.',
              },
              {
                q: 'Posso mudar de plano depois?',
                a: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do painel de controle.',
              },
              {
                q: 'Qual a diferença entre os planos?',
                a: 'O Plano de Aprovação foca em suporte para aprovação em mesas proprietárias, enquanto o Plano de Gestão oferece acompanhamento de operações em tempo real.',
              },
            ].map((faq, index) => (
              <Card key={index} className="border-[#1FA65A]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0F7A3A]">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#6B7280]">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
