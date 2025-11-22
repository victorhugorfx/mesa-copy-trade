"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  Server,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  Mail,
  Save,
  Calendar,
  X,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type TabType = 'overview' | 'operations' | 'connect' | 'profile';

interface Operation {
  id: number;
  asset: string;
  type: 'BUY' | 'SELL';
  lot: number;
  entry: number;
  exit: number;
  profit: number;
  date: string;
  status: 'Fechada' | 'Aberta';
}

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  server: string;
  status: 'active' | 'pending' | 'inactive';
  balance: number;
  profit: number;
  expiresAt: string; // Data de expiração (30 dias após compra)
}

interface PerformancePoint {
  date: string;
  value: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'approved'>('none');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('account-1');
  const [showCheckout, setShowCheckout] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Form state para conectar conta
  const [connectForm, setConnectForm] = useState({
    accountNumber: '',
    password: '',
    server: ''
  });

  // Form state para perfil
  const [profileForm, setProfileForm] = useState({
    name: 'João Silva',
    email: 'joao@email.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Contas do cliente (mockadas - simula múltiplos planos com expiração)
  const [accounts] = useState<Account[]>([
    {
      id: 'account-1',
      name: 'Conta FTMO 10K',
      accountNumber: '****1234',
      server: 'FTMO-Server1',
      status: 'active',
      balance: 10450.75,
      profit: 2450.75,
      expiresAt: '2024-01-25' // Expirando em breve
    },
    {
      id: 'account-2',
      name: 'Conta FTMO 25K',
      accountNumber: '****5678',
      server: 'FTMO-Server2',
      status: 'active',
      balance: 27890.50,
      profit: 4890.50,
      expiresAt: '2024-01-15' // Expirado
    },
    {
      id: 'account-3',
      name: 'Conta MyFundedFX',
      accountNumber: '****9012',
      server: 'MyFundedFX',
      status: 'pending',
      balance: 0,
      profit: 0,
      expiresAt: '2024-03-01'
    }
  ]);

  // Dados de performance para gráfico de linhas (últimos 30 dias)
  const [performanceData] = useState<PerformancePoint[]>([
    { date: '01/01', value: 8000 },
    { date: '02/01', value: 8150 },
    { date: '03/01', value: 8280 },
    { date: '04/01', value: 8420 },
    { date: '05/01', value: 8380 },
    { date: '06/01', value: 8550 },
    { date: '07/01', value: 8720 },
    { date: '08/01', value: 8650 },
    { date: '09/01', value: 8890 },
    { date: '10/01', value: 9050 },
    { date: '11/01', value: 8980 },
    { date: '12/01', value: 9200 },
    { date: '13/01', value: 9380 },
    { date: '14/01', value: 9520 },
    { date: '15/01', value: 9680 },
    { date: '16/01', value: 9850 },
    { date: '17/01', value: 10100 },
    { date: '18/01', value: 10250 },
    { date: '19/01', value: 10450 },
  ]);

  const currentAccount = accounts.find(acc => acc.id === selectedAccount) || accounts[0];

  // Calcular dias restantes até expiração
  const getDaysRemaining = (expiresAt: string) => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Gerar QR Code PIX mockado
  const pixQRCode = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540550.005802BR5925MESAPRO TRADING SYSTEM6009SAO PAULO62070503***63041D3D";
  const pixCopyPaste = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540550.005802BR5925MESAPRO TRADING SYSTEM6009SAO PAULO62070503***63041D3D";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    setPixCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleRenewPlan = () => {
    setShowCheckout(true);
  };

  useEffect(() => {
    // Verificar autenticação do cliente
    const clientToken = localStorage.getItem('client_token');
    
    if (clientToken === 'client_authenticated') {
      setIsAuthenticated(true);
      // Verificar status de conexão
      const status = localStorage.getItem('connection_status') as 'none' | 'pending' | 'approved' || 'none';
      setConnectionStatus(status);
    } else {
      toast.error('Acesso negado. Faça login para continuar.');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('connection_status');
    toast.success('Logout realizado com sucesso');
    router.push('/');
  };

  const handleConnectAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectForm.accountNumber || !connectForm.password || !connectForm.server) {
      toast.error('Preencha todos os campos');
      return;
    }

    // Simular envio para aprovação
    localStorage.setItem('connection_status', 'pending');
    setConnectionStatus('pending');
    toast.success('Solicitação enviada! Aguarde aprovação do administrador.');
    
    // Limpar formulário
    setConnectForm({
      accountNumber: '',
      password: '',
      server: ''
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senha se estiver tentando alterar
    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
      if (profileForm.newPassword.length < 6) {
        toast.error('A senha deve ter no mínimo 6 caracteres');
        return;
      }
      if (!profileForm.currentPassword) {
        toast.error('Digite sua senha atual para alterar a senha');
        return;
      }
    }

    // Simular atualização
    toast.success('Perfil atualizado com sucesso!');
    
    // Limpar campos de senha
    setProfileForm({
      ...profileForm,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-[#1FA65A]">
          <TrendingUp className="w-12 h-12" />
        </div>
      </div>
    );
  }

  // Dados mockados de performance baseados na conta selecionada
  const performanceStats = {
    totalProfit: currentAccount.profit,
    totalOperations: 48,
    winRate: 68.5,
    averageProfit: currentAccount.profit / 48,
    monthlyGrowth: 12.3
  };

  // Operações mockadas (AGORA EM DÓLAR)
  const operations: Operation[] = [
    { id: 1, asset: 'EURUSD', type: 'BUY', lot: 0.5, entry: 1.0850, exit: 1.0875, profit: 125.00, date: '2024-01-15', status: 'Fechada' },
    { id: 2, asset: 'GBPUSD', type: 'SELL', lot: 0.3, entry: 1.2680, exit: 1.2650, profit: 90.00, date: '2024-01-15', status: 'Fechada' },
    { id: 3, asset: 'USDJPY', type: 'BUY', lot: 0.4, entry: 148.50, exit: 148.80, profit: 120.00, date: '2024-01-14', status: 'Fechada' },
    { id: 4, asset: 'AUDUSD', type: 'BUY', lot: 0.6, entry: 0.6550, exit: 0.6580, profit: 180.00, date: '2024-01-14', status: 'Fechada' },
    { id: 5, asset: 'EURUSD', type: 'SELL', lot: 0.5, entry: 1.0900, exit: 1.0920, profit: -100.00, date: '2024-01-13', status: 'Fechada' },
    { id: 6, asset: 'GBPJPY', type: 'BUY', lot: 0.3, entry: 188.20, exit: 0, profit: 0, date: '2024-01-15', status: 'Aberta' },
  ];

  const renderLineChart = () => {
    const maxValue = Math.max(...performanceData.map(p => p.value));
    const minValue = Math.min(...performanceData.map(p => p.value));
    const range = maxValue - minValue;
    const padding = range * 0.1;

    // Criar pontos para a linha
    const points = performanceData.map((point, i) => {
      const x = (i / (performanceData.length - 1)) * 100;
      const y = ((maxValue + padding - point.value) / (range + padding * 2)) * 100;
      return `${x},${y}`;
    }).join(' ');

    // Criar path para área preenchida
    const areaPath = `
      M 0,${((maxValue + padding - performanceData[0].value) / (range + padding * 2)) * 100}
      ${performanceData.map((point, i) => {
        const x = (i / (performanceData.length - 1)) * 100;
        const y = ((maxValue + padding - point.value) / (range + padding * 2)) * 100;
        return `L ${x},${y}`;
      }).join(' ')}
      L 100,100
      L 0,100
      Z
    `;

    return (
      <div className="relative h-64 md:h-80">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-gray-200" />
          ))}
        </div>

        {/* SVG Line Chart */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Gradient fill */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1FA65A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1FA65A" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area under line */}
          <path
            d={areaPath}
            fill="url(#lineGradient)"
          />

          {/* Continuous Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#1FA65A"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Points */}
          {performanceData.map((point, i) => {
            const x = (i / (performanceData.length - 1)) * 100;
            const y = ((maxValue + padding - point.value) / (range + padding * 2)) * 100;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="0.8"
                fill="#0F7A3A"
                vectorEffect="non-scaling-stroke"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${point.date}: U$ ${point.value.toFixed(2)}`}</title>
              </circle>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>U$ {maxValue.toFixed(0)}</span>
          <span>U$ {((maxValue + minValue) / 2).toFixed(0)}</span>
          <span>U$ {minValue.toFixed(0)}</span>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const daysRemaining = getDaysRemaining(currentAccount.expiresAt);
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
    const isExpired = daysRemaining === 0;

    return (
      <>
        {/* Seletor de Conta */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-[#6B7280] mb-2 block">Conta Selecionada</Label>
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="w-full md:w-auto min-w-[300px] flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 hover:border-[#1FA65A] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#1FA65A]/10 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#1FA65A]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{currentAccount.name}</p>
                  <p className="text-xs text-gray-500">{currentAccount.accountNumber} • {currentAccount.server}</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showAccountDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {accounts.map((account) => {
                  const accountDays = getDaysRemaining(account.expiresAt);
                  return (
                    <button
                      key={account.id}
                      onClick={() => {
                        setSelectedAccount(account.id);
                        setShowAccountDropdown(false);
                        toast.success(`Conta alterada para ${account.name}`);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedAccount === account.id ? 'bg-[#1FA65A]/5' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1FA65A]/10 rounded-lg flex items-center justify-center">
                          <Server className="w-5 h-5 text-[#1FA65A]" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{account.name}</p>
                          <p className="text-xs text-gray-500">{account.accountNumber} • {account.server}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${
                          accountDays === 0 ? 'text-red-600' : accountDays <= 7 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {accountDays}d
                        </span>
                        <Badge className={
                          account.status === 'active' ? 'bg-green-100 text-green-700' :
                          account.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {account.status === 'active' ? 'Ativa' : account.status === 'pending' ? 'Pendente' : 'Inativa'}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Temporizador de Expiração */}
        {currentAccount.status === 'active' && (
          <Card className={`mb-6 ${isExpired ? 'border-red-500 bg-red-50' : isExpiringSoon ? 'border-amber-500 bg-amber-50' : 'border-green-500 bg-green-50'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isExpired ? 'bg-red-100' : isExpiringSoon ? 'bg-amber-100' : 'bg-green-100'
                  }`}>
                    <Calendar className={`w-6 h-6 ${
                      isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Expiração do Plano</p>
                    <p className="text-xs text-gray-500">
                      {isExpired ? 'Plano expirado' : `Expira em ${new Date(currentAccount.expiresAt).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {daysRemaining}
                  </p>
                  <p className="text-xs text-gray-600">
                    {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                  </p>
                </div>
              </div>
              {(isExpiringSoon || isExpired) && (
                <div className={`mt-4 pt-4 border-t ${isExpired ? 'border-red-200' : 'border-amber-200'}`}>
                  <p className={`text-sm mb-2 ${isExpired ? 'text-red-700' : 'text-amber-700'}`}>
                    {isExpired ? '❌ Seu plano expirou. Renove para continuar operando.' : '⚠️ Seu plano está próximo da expiração!'}
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleRenewPlan}
                    className={isExpired ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#1FA65A] hover:bg-[#0F7A3A] text-white'}
                  >
                    {isExpired ? 'Renovar Agora' : 'Renovar Plano'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#6B7280]">
                Lucro Total
              </CardTitle>
              <DollarSign className="w-5 h-5 text-[#1FA65A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-[#0F7A3A]">
                U$ {performanceStats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{performanceStats.monthlyGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#6B7280]">
                Total de Operações
              </CardTitle>
              <Activity className="w-5 h-5 text-[#1FA65A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-[#0F7A3A]">{performanceStats.totalOperations}</div>
              <p className="text-xs text-[#6B7280] mt-2">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#6B7280]">
                Taxa de Acerto
              </CardTitle>
              <BarChart3 className="w-5 h-5 text-[#1FA65A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-[#0F7A3A]">{performanceStats.winRate}%</div>
              <p className="text-xs text-[#6B7280] mt-2">Win rate</p>
            </CardContent>
          </Card>

          <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#6B7280]">
                Lucro Médio
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-[#1FA65A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-[#0F7A3A]">
                U$ {performanceStats.averageProfit.toFixed(2)}
              </div>
              <p className="text-xs text-[#6B7280] mt-2">Por operação</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Performance em Linhas */}
        <Card className="border-[#1FA65A]/20 mb-8">
          <CardHeader>
            <CardTitle className="text-[#0F7A3A]">Gráfico de Performance</CardTitle>
            <CardDescription>Evolução do saldo nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            {renderLineChart()}
            <div className="flex justify-between mt-4 text-xs text-[#6B7280] px-2">
              <span>{performanceData[0].date}</span>
              <span className="hidden md:inline">{performanceData[Math.floor(performanceData.length / 2)].date}</span>
              <span>{performanceData[performanceData.length - 1].date}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status da Conexão */}
        <Card className="border-[#1FA65A]/20">
          <CardHeader>
            <CardTitle className="text-[#0F7A3A]">Status da Conta</CardTitle>
            <CardDescription>Informações sobre sua conexão</CardDescription>
          </CardHeader>
          <CardContent>
            {currentAccount.status === 'inactive' && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conta conectada</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Conecte sua conta de trading para começar a acompanhar suas operações
                </p>
                <Button 
                  className="bg-[#1FA65A] hover:bg-[#0F7A3A]"
                  onClick={() => setActiveTab('connect')}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Conectar Conta
                </Button>
              </div>
            )}
            
            {currentAccount.status === 'pending' && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aguardando Aprovação</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Sua solicitação de conexão está sendo analisada pelo administrador
                </p>
                <Badge className="bg-amber-100 text-amber-700">Pendente</Badge>
              </div>
            )}
            
            {currentAccount.status === 'active' && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conta Conectada</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Sua conta está ativa e sincronizando operações
                </p>
                <Badge className="bg-green-100 text-green-700">Aprovada</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </>
    );
  };

  const renderOperations = () => (
    <Card className="border-[#1FA65A]/20">
      <CardHeader>
        <CardTitle className="text-[#0F7A3A]">Histórico de Operações</CardTitle>
        <CardDescription>Todas as suas operações registradas na conta {currentAccount.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A]">Data</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A]">Ativo</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A]">Tipo</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A] hidden md:table-cell">Lote</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A] hidden md:table-cell">Entrada</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A] hidden md:table-cell">Saída</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A]">Lucro/Perda</th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-[#0F7A3A]">Status</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-[#6B7280]">
                    {new Date(op.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-2 md:px-4 text-xs md:text-sm font-medium">{op.asset}</td>
                  <td className="py-3 px-2 md:px-4">
                    <Badge className={op.type === 'BUY' ? 'bg-green-100 text-green-700 text-xs' : 'bg-red-100 text-red-700 text-xs'}>
                      {op.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-xs md:text-sm hidden md:table-cell">{op.lot}</td>
                  <td className="py-3 px-2 md:px-4 text-xs md:text-sm hidden md:table-cell">{op.entry.toFixed(4)}</td>
                  <td className="py-3 px-2 md:px-4 text-xs md:text-sm hidden md:table-cell">{op.exit > 0 ? op.exit.toFixed(4) : '-'}</td>
                  <td className="py-3 px-2 md:px-4 text-xs md:text-sm">
                    {op.status === 'Fechada' ? (
                      <span className={op.profit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {op.profit >= 0 ? '+' : ''}U$ {op.profit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[#6B7280]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <Badge className={op.status === 'Fechada' ? 'bg-gray-100 text-gray-700 text-xs' : 'bg-blue-100 text-blue-700 text-xs'}>
                      {op.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderConnect = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Conectar Nova Conta de Trading</CardTitle>
          <CardDescription>
            Preencha os dados da sua conta para sincronizar operações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConnectAccount} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Informações Seguras</p>
                  <p>Seus dados são criptografados e armazenados com segurança. Eles serão usados apenas para sincronizar suas operações.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Número da Conta</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Ex: 123456789"
                  className="pl-10"
                  value={connectForm.accountNumber}
                  onChange={(e) => setConnectForm({...connectForm, accountNumber: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha da Conta</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={connectForm.password}
                  onChange={(e) => setConnectForm({...connectForm, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1FA65A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="server">Servidor</Label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <select
                  id="server"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FA65A]"
                  value={connectForm.server}
                  onChange={(e) => setConnectForm({...connectForm, server: e.target.value})}
                  required
                >
                  <option value="">Selecione o servidor</option>
                  <option value="FTMO-Server1">FTMO Server 1</option>
                  <option value="FTMO-Server2">FTMO Server 2</option>
                  <option value="MyFundedFX">MyFundedFX</option>
                  <option value="FundedNext">FundedNext</option>
                  <option value="E8Funding">E8 Funding</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Aprovação Necessária</p>
                  <p>Após enviar, sua solicitação será analisada por um administrador. Você será notificado quando for aprovada.</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1FA65A] hover:bg-[#0F7A3A] text-white"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Enviar Solicitação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Configurações de Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais e segurança da conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Pessoais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alterar Senha */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Alterar Senha</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Segurança da Senha</p>
                    <p>Deixe os campos em branco se não quiser alterar sua senha.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                    className="pl-10"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Digite sua nova senha"
                    className="pl-10"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                  />
                </div>
                <p className="text-xs text-[#6B7280]">Mínimo de 6 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    className="pl-10"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1FA65A] hover:bg-[#0F7A3A] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1FA65A] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0F7A3A]">MesaPro</h1>
                <p className="text-xs text-[#6B7280]">Dashboard do Cliente</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Badge variant="outline" className="bg-[#1FA65A]/10 text-[#0F7A3A] border-[#1FA65A]/30 hidden md:inline-flex">
                {accounts.filter(a => a.status === 'active').length} Plano(s) Ativo(s)
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 md:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'operations'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Operações
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'connect'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <LinkIcon className="w-4 h-4 inline mr-2" />
              <span className="hidden md:inline">Conectar Conta</span>
              <span className="md:hidden">Conectar</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'profile'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Perfil
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'overview' && (
          <>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F7A3A] mb-2">
                Bem-vindo ao seu Dashboard
              </h2>
              <p className="text-sm md:text-base text-[#6B7280]">
                Acompanhe sua performance e gerencie suas operações
              </p>
            </div>
            {renderOverview()}
          </>
        )}
        {activeTab === 'operations' && renderOperations()}
        {activeTab === 'connect' && renderConnect()}
        {activeTab === 'profile' && renderProfile()}
      </main>

      {/* Modal de Checkout PIX */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#0F7A3A]">Renovar Plano</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Valor da Renovação</p>
                <p className="text-4xl font-bold text-[#0F7A3A]">R$ 50,00</p>
                <p className="text-xs text-gray-500 mt-1">Plano: {currentAccount.name}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                  Escaneie o QR Code com seu app de pagamento
                </p>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-xs text-gray-500 text-center px-4">
                      QR Code PIX<br/>
                      <span className="text-[10px]">(Simulação)</span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700 text-center">
                    Ou copie o código PIX Copia e Cola
                  </p>
                  <div className="bg-white border border-gray-300 rounded-lg p-3">
                    <p className="text-xs text-gray-600 break-all font-mono">
                      {pixCopyPaste.substring(0, 60)}...
                    </p>
                  </div>
                  <Button
                    onClick={handleCopyPix}
                    className="w-full bg-[#1FA65A] hover:bg-[#0F7A3A] text-white"
                  >
                    {pixCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Código PIX
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Pagamento Instantâneo</p>
                    <p>Após o pagamento, seu plano será renovado automaticamente por mais 30 dias.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
