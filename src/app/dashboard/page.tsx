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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type TabType = 'overview' | 'operations' | 'connect';

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

export default function ClientDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'approved'>('none');

  // Form state para conectar conta
  const [connectForm, setConnectForm] = useState({
    accountNumber: '',
    password: '',
    server: ''
  });

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-[#1FA65A]">
          <TrendingUp className="w-12 h-12" />
        </div>
      </div>
    );
  }

  // Dados mockados de performance
  const performanceData = {
    totalProfit: 2450.75,
    totalOperations: 48,
    winRate: 68.5,
    averageProfit: 51.05,
    monthlyGrowth: 12.3
  };

  // Operações mockadas
  const operations: Operation[] = [
    { id: 1, asset: 'EURUSD', type: 'BUY', lot: 0.5, entry: 1.0850, exit: 1.0875, profit: 125.00, date: '2024-01-15', status: 'Fechada' },
    { id: 2, asset: 'GBPUSD', type: 'SELL', lot: 0.3, entry: 1.2680, exit: 1.2650, profit: 90.00, date: '2024-01-15', status: 'Fechada' },
    { id: 3, asset: 'USDJPY', type: 'BUY', lot: 0.4, entry: 148.50, exit: 148.80, profit: 120.00, date: '2024-01-14', status: 'Fechada' },
    { id: 4, asset: 'AUDUSD', type: 'BUY', lot: 0.6, entry: 0.6550, exit: 0.6580, profit: 180.00, date: '2024-01-14', status: 'Fechada' },
    { id: 5, asset: 'EURUSD', type: 'SELL', lot: 0.5, entry: 1.0900, exit: 1.0920, profit: -100.00, date: '2024-01-13', status: 'Fechada' },
    { id: 6, asset: 'GBPJPY', type: 'BUY', lot: 0.3, entry: 188.20, exit: 0, profit: 0, date: '2024-01-15', status: 'Aberta' },
  ];

  const renderOverview = () => (
    <>
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Lucro Total
            </CardTitle>
            <DollarSign className="w-5 h-5 text-[#1FA65A]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F7A3A]">
              R$ {performanceData.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{performanceData.monthlyGrowth}% este mês
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
            <div className="text-3xl font-bold text-[#0F7A3A]">{performanceData.totalOperations}</div>
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
            <div className="text-3xl font-bold text-[#0F7A3A]">{performanceData.winRate}%</div>
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
            <div className="text-3xl font-bold text-[#0F7A3A]">
              R$ {performanceData.averageProfit.toFixed(2)}
            </div>
            <p className="text-xs text-[#6B7280] mt-2">Por operação</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance */}
      <Card className="border-[#1FA65A]/20 mb-8">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Gráfico de Performance</CardTitle>
          <CardDescription>Evolução do lucro nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {[420, 580, 720, 650, 890, 1050, 980, 1200, 1380, 1520, 1680, 1850, 2100, 2250, 2450].map((value, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-[#1FA65A] to-[#0F7A3A] rounded-t-lg hover:opacity-80 transition-opacity" 
                   style={{ height: `${(value / 2450) * 100}%` }}
                   title={`R$ ${value.toFixed(2)}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-[#6B7280]">
            <span>Início</span>
            <span>Meio do mês</span>
            <span>Hoje</span>
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
          {connectionStatus === 'none' && (
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
          
          {connectionStatus === 'pending' && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aguardando Aprovação</h3>
              <p className="text-sm text-[#6B7280] mb-4">
                Sua solicitação de conexão está sendo analisada pelo administrador
              </p>
              <Badge className="bg-amber-100 text-amber-700">Pendente</Badge>
            </div>
          )}
          
          {connectionStatus === 'approved' && (
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

  const renderOperations = () => (
    <Card className="border-[#1FA65A]/20">
      <CardHeader>
        <CardTitle className="text-[#0F7A3A]">Histórico de Operações</CardTitle>
        <CardDescription>Todas as suas operações registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Data</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Ativo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Lote</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Entrada</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Saída</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Lucro/Perda</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Status</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-[#6B7280]">
                    {new Date(op.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{op.asset}</td>
                  <td className="py-3 px-4">
                    <Badge className={op.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {op.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{op.lot}</td>
                  <td className="py-3 px-4 text-sm">{op.entry.toFixed(4)}</td>
                  <td className="py-3 px-4 text-sm">{op.exit > 0 ? op.exit.toFixed(4) : '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    {op.status === 'Fechada' ? (
                      <span className={op.profit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {op.profit >= 0 ? '+' : ''}R$ {op.profit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[#6B7280]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={op.status === 'Fechada' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}>
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
          <CardTitle className="text-[#0F7A3A]">Conectar Conta de Trading</CardTitle>
          <CardDescription>
            Preencha os dados da sua conta para sincronizar operações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === 'pending' ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Solicitação Enviada</h3>
              <p className="text-[#6B7280] mb-6">
                Sua solicitação está sendo analisada. Você receberá uma notificação quando for aprovada.
              </p>
              <Badge className="bg-amber-100 text-amber-700 text-base px-4 py-2">
                Aguardando Aprovação
              </Badge>
            </div>
          ) : connectionStatus === 'approved' ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Conta Conectada!</h3>
              <p className="text-[#6B7280] mb-6">
                Sua conta está ativa e sincronizando operações automaticamente.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Conta:</span>
                    <span className="font-medium">****1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Servidor:</span>
                    <span className="font-medium">FTMO-Server1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Status:</span>
                    <Badge className="bg-green-100 text-green-700">Ativa</Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}
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

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-[#1FA65A]/10 text-[#0F7A3A] border-[#1FA65A]/30">
                Plano Ativo
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'connect'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Conectar Conta
              {connectionStatus === 'pending' && (
                <Badge className="ml-2 bg-amber-500 text-white">Pendente</Badge>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0F7A3A] mb-2">
                Bem-vindo ao seu Dashboard
              </h2>
              <p className="text-[#6B7280]">
                Acompanhe sua performance e gerencie suas operações
              </p>
            </div>
            {renderOverview()}
          </>
        )}
        {activeTab === 'operations' && renderOperations()}
        {activeTab === 'connect' && renderConnect()}
      </main>
    </div>
  );
}
