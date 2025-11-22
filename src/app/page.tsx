"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Shield, Zap, CheckCircle, ArrowRight, BarChart3, Users, Lock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - substituir por API real
const mockMesasAprovadas = [
  {
    id: '1',
    name: 'Mesa FTMO',
    server: 'FTMO-Server-01',
    account_size: 50000,
    return_percent: 12.5,
    approved_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mesa Prop Firm',
    server: 'PropFirm-Live',
    account_size: 100000,
    return_percent: 18.3,
    approved_at: '2024-01-20',
  },
  {
    id: '3',
    name: 'Mesa Elite',
    server: 'Elite-Server-03',
    account_size: 25000,
    return_percent: 9.7,
    approved_at: '2024-02-01',
  },
];

const faqData = [
  {
    question: 'Posso operar usando qualquer mesa proprietária (Prop Firm)?',
    answer: 'Sim! Você pode operar por qualquer mesa, desde que ela permita o uso das plataformas MT5 ou MT4. Nosso sistema é totalmente compatível com ambas.'
  },
  {
    question: 'Posso usar qualquer corretora?',
    answer: 'Sim, você pode usar qualquer corretora de sua preferência. No entanto, recomendamos sempre trabalhar com as principais e mais confiáveis do mercado, como: FTMO, The5ers, FundedNext, entre outras. Essas geralmente oferecem maior estabilidade e menor latência.'
  },
  {
    question: 'Existe risco de usar copy e perder a conta na mesa?',
    answer: 'Não. Nosso sistema foi desenvolvido para operar de forma extremamente segura. Ele utiliza uma tecnologia que simula operações manuais através da conexão MT5 Web e MT4 Web, garantindo: Execução natural, Comportamento humano, Zero padrão de automação detectável, Segurança para operar em contas de mesa.'
  },
  {
    question: 'O sistema atua como robô?',
    answer: 'Não. Apesar de usar inteligência artificial, o sistema se comporta como um trader humano, executando operações individualmente e sem padrões fixos de robô.'
  },
  {
    question: 'O copy funciona em contas demo e reais?',
    answer: 'Sim, o sistema funciona tanto em contas demo quanto em contas reais, sem limitações.'
  },
  {
    question: 'Preciso deixar meu computador ligado?',
    answer: 'Não. Toda a operação é feita em nossa estrutura em nuvem. Você não precisa manter computador, VPS ou plataforma aberta.'
  },
  {
    question: 'Qual o delay do copy?',
    answer: 'O delay é praticamente zero, pois toda a execução é feita via conexão web, oferecendo rapidez e estabilidade.'
  }
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1FA65A] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#0F7A3A]">MesaPro</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#mesas" className="text-[#6B7280] hover:text-[#1FA65A] transition-colors">
                Mesas
              </Link>
              <Link href="#planos" className="text-[#6B7280] hover:text-[#1FA65A] transition-colors">
                Planos
              </Link>
              <Link href="#sobre" className="text-[#6B7280] hover:text-[#1FA65A] transition-colors">
                Sobre
              </Link>
              <Link href="#faq" className="text-[#6B7280] hover:text-[#1FA65A] transition-colors">
                FAQ
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-[#1FA65A] hover:text-[#0F7A3A] hover:bg-[#1FA65A]/10">
                  Entrar
                </Button>
              </Link>
              <Link href="/planos">
                <Button className="bg-[#1FA65A] hover:bg-[#0F7A3A] text-white">
                  Ver Planos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1FA65A]/5 to-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[#1FA65A]/10 text-[#0F7A3A] border-[#1FA65A]/20">
              Plataforma Profissional de Trading
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F7A3A] mb-6 leading-tight">
              Opere com as Melhores
              <br />
              <span className="text-[#1FA65A]">Mesas Proprietárias</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
              Acompanhe operações em tempo real, obtenha aprovação em contas prop e gerencie seu trading com transparência total.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/planos">
                <Button size="lg" className="bg-[#1FA65A] hover:bg-[#0F7A3A] text-white w-full sm:w-auto">
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#mesas">
                <Button size="lg" variant="outline" className="border-[#1FA65A] text-[#1FA65A] hover:bg-[#1FA65A]/10 w-full sm:w-auto">
                  Ver Mesas Aprovadas
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-20 max-w-5xl mx-auto">
            {[
              { label: 'Mesas Ativas', value: '12+', icon: BarChart3 },
              { label: 'Clientes', value: '500+', icon: Users },
              { label: 'Aprovações', value: '98%', icon: CheckCircle },
              { label: 'Segurança', value: '100%', icon: Lock },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-[#1FA65A]/10">
                <stat.icon className="w-8 h-8 text-[#1FA65A] mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-[#0F7A3A]">{stat.value}</div>
                <div className="text-sm text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mesas Aprovadas */}
      <section id="mesas" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F7A3A] mb-4">
              Mesas Aprovadas
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Contas verificadas e aprovadas com histórico de performance transparente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mockMesasAprovadas.map((mesa) => (
              <Card key={mesa.id} className="border-[#1FA65A]/20 hover:shadow-xl transition-all duration-300 hover:border-[#1FA65A]/40">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-[#1FA65A]/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#1FA65A]" />
                    </div>
                    <Badge className="bg-[#1FA65A] text-white">
                      Aprovada
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-[#0F7A3A]">{mesa.name}</CardTitle>
                  <CardDescription className="text-[#6B7280]">{mesa.server}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Tamanho da Conta</span>
                      <span className="font-semibold text-[#0F7A3A]">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 0,
                        }).format(mesa.account_size)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Retorno</span>
                      <span className="font-bold text-[#1FA65A] text-lg">
                        +{mesa.return_percent}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1FA65A]/10">
                      <span className="text-xs text-[#6B7280]">Aprovada em</span>
                      <span className="text-xs text-[#6B7280]">
                        {new Date(mesa.approved_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/planos">
              <Button size="lg" className="bg-[#1FA65A] hover:bg-[#0F7A3A] text-white">
                Assinar para Ver Mais Detalhes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1FA65A]/5 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F7A3A] mb-4">
              Por Que Escolher a MesaPro?
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Tecnologia de ponta para traders profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Segurança Total',
                description: 'Dados criptografados e proteção em múltiplas camadas para suas informações.',
              },
              {
                icon: Zap,
                title: 'Tempo Real',
                description: 'Acompanhe operações instantaneamente com atualizações em tempo real.',
              },
              {
                icon: CheckCircle,
                title: 'Aprovação Garantida',
                description: 'Suporte completo para aprovação em mesas proprietárias renomadas.',
              },
            ].map((feature, index) => (
              <Card key={index} className="border-[#1FA65A]/20 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 bg-[#1FA65A] rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[#0F7A3A]">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#6B7280]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F7A3A] mb-4">
              FAQ — Sistema de Copy e Gestão de Conta
            </h2>
            <p className="text-lg text-[#6B7280]">
              Perguntas frequentes sobre nossa plataforma
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="border-[#1FA65A]/20 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#0F7A3A] pr-8">
                      📌 {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#1FA65A] transition-transform flex-shrink-0 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-[#1FA65A]/10">
                      <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0F7A3A]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de traders que já estão operando com as melhores mesas proprietárias
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/planos">
              <Button size="lg" className="bg-white text-[#0F7A3A] hover:bg-white/90 w-full sm:w-auto">
                Ver Planos e Preços
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#1FA65A]/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-[#1FA65A] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0F7A3A]">MesaPro</span>
            </div>
            <p className="text-[#6B7280] text-sm text-center md:text-left">
              © 2024 MesaPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
