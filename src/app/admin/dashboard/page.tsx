"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  CreditCard,
  Database,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Copy,
  QrCode,
  Eye,
  EyeOff,
  BarChart3,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type TabType = 'dashboard' | 'users' | 'plans' | 'connections' | 'operations' | 'settings';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  subscription: string;
  balance: number;
  profit: number;
  drawdown: number;
  pnl: number;
}

interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  active: boolean;
}

interface Operation {
  id: number;
  mesa: string;
  asset: string;
  lot: number;
  entry: number;
  exit: number;
  profit: number;
  date: string;
}

interface Connection {
  id: number;
  user: string;
  account: string;
  login: string;
  password: string;
  server: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  date: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  
  // TODOS OS HOOKS NO TOPO - ANTES DE QUALQUER LÓGICA CONDICIONAL
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Modal states
  const [editUserModal, setEditUserModal] = useState<User | null>(null);
  const [viewUserModal, setViewUserModal] = useState<User | null>(null);
  const [editPlanModal, setEditPlanModal] = useState<Plan | null>(null);
  const [editOperationModal, setEditOperationModal] = useState<Operation | null>(null);
  const [newPlanModal, setNewPlanModal] = useState(false);
  const [newOperationModal, setNewOperationModal] = useState(false);
  const [editEmailModal, setEditEmailModal] = useState<EmailTemplate | null>(null);

  // PIX Gateway states
  const [pixClientId, setPixClientId] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [pixCopyPaste, setPixCopyPaste] = useState('');
  const [showPixConfig, setShowPixConfig] = useState(false);

  // Password visibility states
  const [visiblePasswords, setVisiblePasswords] = useState<{[key: number]: boolean}>({});

  // Mock data states
  const [mockUsers, setMockUsers] = useState<User[]>([
    { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'Cliente', status: 'Ativo', subscription: 'Plano 25k', balance: 27500.00, profit: 3250.50, drawdown: -850.00, pnl: 2400.50 },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'Cliente', status: 'Ativo', subscription: 'Plano 50k', balance: 54200.75, profit: 5890.25, drawdown: -1200.00, pnl: 4690.25 },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', role: 'Cliente', status: 'Pendente', subscription: 'Nenhum', balance: 0, profit: 0, drawdown: 0, pnl: 0 },
    { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', role: 'Cliente', status: 'Ativo', subscription: 'Plano 10k', balance: 11450.00, profit: 1850.00, drawdown: -350.00, pnl: 1500.00 },
  ]);

  const [mockPlans, setMockPlans] = useState<Plan[]>([
    { id: 1, name: 'Plano Aprovação 10k', type: 'Aprovação', price: 197.99, active: true },
    { id: 2, name: 'Plano Aprovação 25k', type: 'Aprovação', price: 297.99, active: true },
    { id: 3, name: 'Plano Gestão 50k', type: 'Gestão', price: 497.99, active: true },
    { id: 4, name: 'Plano Gestão 100k', type: 'Gestão', price: 797.99, active: false },
  ]);

  const [mockOperations, setMockOperations] = useState<Operation[]>([
    { id: 1, mesa: 'Mesa FTMO', asset: 'EURUSD', lot: 0.5, entry: 1.0850, exit: 1.0875, profit: 125.00, date: '2024-01-15' },
    { id: 2, mesa: 'Mesa FTMO', asset: 'GBPUSD', lot: 0.3, entry: 1.2650, exit: 1.2680, profit: 90.00, date: '2024-01-15' },
    { id: 3, mesa: 'Mesa MyFundedFX', asset: 'USDJPY', lot: 0.4, entry: 148.50, exit: 148.80, profit: 120.00, date: '2024-01-14' },
  ]);

  const [mockConnections, setMockConnections] = useState<Connection[]>([
    { 
      id: 1, 
      user: 'João Silva', 
      account: '1234567890', 
      login: 'joao.silva@ftmo',
      password: 'Senha123!@#',
      server: 'FTMO-Server1-Live', 
      status: 'Pendente', 
      date: '2024-01-15' 
    },
    { 
      id: 2, 
      user: 'Maria Santos', 
      account: '9876543210', 
      login: 'maria.santos@ftmo',
      password: 'SecurePass456',
      server: 'FTMO-Server2-Demo', 
      status: 'Pendente', 
      date: '2024-01-14' 
    },
    { 
      id: 3, 
      user: 'Carlos Souza', 
      account: '5555666677', 
      login: 'carlos.souza@myfx',
      password: 'MyPass789!',
      server: 'MyFundedFX-Live', 
      status: 'Pendente', 
      date: '2024-01-13' 
    },
  ]);

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    { id: 1, name: 'E-mail de boas-vindas', subject: 'Bem-vindo à MesaPro!', content: 'Olá {nome}, seja bem-vindo...' },
    { id: 2, name: 'Confirmação de pagamento', subject: 'Pagamento confirmado', content: 'Seu pagamento foi confirmado...' },
    { id: 3, name: 'Aprovação de conexão', subject: 'Conta aprovada', content: 'Sua conta foi aprovada...' },
  ]);

  useEffect(() => {
    // Verificar autenticação admin
    const adminToken = localStorage.getItem('admin_token');
    const userRole = localStorage.getItem('user_role');

    if (adminToken === 'admin_authenticated' && userRole === 'admin') {
      setIsAuthenticated(true);
    } else {
      toast.error('Acesso negado. Faça login como administrador.');
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    toast.success('Logout realizado com sucesso');
    router.push('/admin/login');
  };

  // Dados mockados para demonstração
  const stats = {
    totalUsers: 156,
    activeSubscriptions: 89,
    pendingConnections: mockConnections.filter(c => c.status === 'Pendente').length,
    totalRevenue: 45780.50,
    approvedMesas: 34,
    pendingOrders: 8
  };

  // Handlers para edição e exclusão
  const handleSaveUser = () => {
    if (editUserModal) {
      setMockUsers(mockUsers.map(u => u.id === editUserModal.id ? editUserModal : u));
      toast.success('Usuário atualizado com sucesso!');
      setEditUserModal(null);
    }
  };

  const handleDeleteUser = (id: number) => {
    setMockUsers(mockUsers.filter(u => u.id !== id));
    toast.success('Usuário removido com sucesso!');
  };

  const handleSavePlan = () => {
    if (editPlanModal) {
      setMockPlans(mockPlans.map(p => p.id === editPlanModal.id ? editPlanModal : p));
      toast.success('Plano atualizado com sucesso!');
      setEditPlanModal(null);
    }
  };

  const handleCreatePlan = (newPlan: Omit<Plan, 'id'>) => {
    const id = Math.max(...mockPlans.map(p => p.id)) + 1;
    setMockPlans([...mockPlans, { ...newPlan, id }]);
    toast.success('Plano criado com sucesso!');
    setNewPlanModal(false);
  };

  const handleDeletePlan = (id: number) => {
    setMockPlans(mockPlans.filter(p => p.id !== id));
    toast.success('Plano removido com sucesso!');
  };

  const handleSaveOperation = () => {
    if (editOperationModal) {
      setMockOperations(mockOperations.map(o => o.id === editOperationModal.id ? editOperationModal : o));
      toast.success('Operação atualizada com sucesso!');
      setEditOperationModal(null);
    }
  };

  const handleCreateOperation = (newOp: Omit<Operation, 'id'>) => {
    const id = Math.max(...mockOperations.map(o => o.id)) + 1;
    setMockOperations([...mockOperations, { ...newOp, id }]);
    toast.success('Operação publicada com sucesso!');
    setNewOperationModal(false);
  };

  const handleDeleteOperation = (id: number) => {
    setMockOperations(mockOperations.filter(o => o.id !== id));
    toast.success('Operação removida com sucesso!');
  };

  // Handlers para conexões
  const handleApproveConnection = (id: number) => {
    setMockConnections(mockConnections.map(c => 
      c.id === id ? { ...c, status: 'Aprovado' as const } : c
    ));
    toast.success('Conexão aprovada com sucesso!');
  };

  const handleRejectConnection = (id: number) => {
    setMockConnections(mockConnections.map(c => 
      c.id === id ? { ...c, status: 'Rejeitado' as const } : c
    ));
    toast.error('Conexão rejeitada');
  };

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handler para configurar PIX
  const handleConfigurePixGateway = () => {
    if (!pixClientId.trim()) {
      toast.error('Por favor, insira o Client ID da API PIX');
      return;
    }

    // Simular geração de QR Code e Copia e Cola
    const mockQrCode = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='white'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14' fill='black'%3EQR Code PIX%3C/text%3E%3C/svg%3E`;
    const mockCopyPaste = `00020126580014br.gov.bcb.pix0136${pixClientId}52040000530398654040.005802BR5925MesaPro Trading Platform6009SAO PAULO62070503***6304ABCD`;

    setPixQrCode(mockQrCode);
    setPixCopyPaste(mockCopyPaste);
    setShowPixConfig(true);

    toast.success('Gateway PIX configurado com sucesso!');
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    toast.success('Código PIX copiado para área de transferência!');
  };

  const handleSaveEmailTemplate = () => {
    if (editEmailModal) {
      setEmailTemplates(emailTemplates.map(t => t.id === editEmailModal.id ? editEmailModal : t));
      toast.success('Template de e-mail atualizado com sucesso!');
      setEditEmailModal(null);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Total de Usuários
            </CardTitle>
            <Users className="w-5 h-5 text-[#1FA65A]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F7A3A]">{stats.totalUsers}</div>
            <p className="text-xs text-[#6B7280] mt-1">+12 novos este mês</p>
          </CardContent>
        </Card>

        <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Assinaturas Ativas
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-[#1FA65A]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F7A3A]">{stats.activeSubscriptions}</div>
            <p className="text-xs text-[#6B7280] mt-1">57% de conversão</p>
          </CardContent>
        </Card>

        <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Receita Total
            </CardTitle>
            <DollarSign className="w-5 h-5 text-[#1FA65A]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F7A3A]">
              R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#6B7280] mt-1">+18% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Conexões Pendentes
            </CardTitle>
            <Clock className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.pendingConnections}</div>
            <p className="text-xs text-[#6B7280] mt-1">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="border-[#1FA65A]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Mesas Aprovadas
            </CardTitle>
            <Activity className="w-5 h-5 text-[#1FA65A]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0F7A3A]">{stats.approvedMesas}</div>
            <p className="text-xs text-[#6B7280] mt-1">Operando ativamente</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              Pedidos Pendentes
            </CardTitle>
            <CreditCard className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.pendingOrders}</div>
            <p className="text-xs text-[#6B7280] mt-1">Aguardando pagamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-[#1FA65A]/20 mb-8">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Atividade Recente</CardTitle>
          <CardDescription>Últimas ações na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: CheckCircle, text: 'Conexão aprovada para João Silva', time: '5 min atrás', color: 'text-green-600' },
              { icon: Users, text: 'Novo usuário cadastrado: Maria Santos', time: '12 min atrás', color: 'text-blue-600' },
              { icon: DollarSign, text: 'Pagamento confirmado - Plano 25k', time: '23 min atrás', color: 'text-green-600' },
              { icon: Activity, text: 'Nova operação publicada em Mesa FTMO', time: '1 hora atrás', color: 'text-[#1FA65A]' },
              { icon: XCircle, text: 'Conexão rejeitada - dados inválidos', time: '2 horas atrás', color: 'text-red-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-[#6B7280]">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#1FA65A]/20">
          <CardHeader>
            <CardTitle className="text-[#0F7A3A] flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Status do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">API Gateway</span>
                <Badge className="bg-green-100 text-green-700">Operacional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Banco de Dados</span>
                <Badge className="bg-green-100 text-green-700">Operacional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Gateway PIX</span>
                <Badge className={showPixConfig ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                  {showPixConfig ? 'Configurado' : 'Pendente'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">WebSocket</span>
                <Badge className="bg-green-100 text-green-700">Operacional</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1FA65A]/20">
          <CardHeader>
            <CardTitle className="text-[#0F7A3A] flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configurações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Configurar Gateway PIX
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Templates de E-mail
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Segurança e Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#0F7A3A]">Gerenciar Usuários</CardTitle>
              <CardDescription>Visualize e gerencie todos os usuários da plataforma</CardDescription>
            </div>
            <Button className="bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar usuários..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Função</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Assinatura</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.role}</td>
                    <td className="py-3 px-4">
                      <Badge className={user.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.subscription}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewUserModal(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditUserModal(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Visualização de Usuário */}
      {viewUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalhes do Usuário: {viewUserModal.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setViewUserModal(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[#0F7A3A]">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{viewUserModal.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{viewUserModal.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={viewUserModal.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                      {viewUserModal.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assinatura</p>
                    <p className="font-medium">{viewUserModal.subscription}</p>
                  </div>
                </div>
              </div>

              {/* Estatísticas Financeiras */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[#0F7A3A]">Estatísticas Financeiras</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-[#1FA65A]/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-5 h-5 text-[#1FA65A]" />
                      </div>
                      <p className="text-2xl font-bold text-[#0F7A3A]">
                        U$ {viewUserModal.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Saldo da Conta</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        +U$ {viewUserModal.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Lucro Total</p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        U$ {viewUserModal.drawdown.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Rebaixamento</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        U$ {viewUserModal.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNL</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Gráfico de Performance Simplificado */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[#0F7A3A]">Gráfico de Performance</h3>
                <Card className="border-[#1FA65A]/20">
                  <CardContent className="pt-6">
                    <div className="h-48 flex items-end justify-between gap-2">
                      {[65, 72, 68, 85, 90, 88, 95, 92, 100, 98, 105, 110].map((value, i) => (
                        <div key={i} className="flex-1 bg-[#1FA65A] rounded-t" style={{ height: `${value}%` }} />
                      ))}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-4">Últimos 12 meses</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                className="w-full bg-[#1FA65A] hover:bg-[#0F7A3A]"
                onClick={() => setViewUserModal(null)}
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Edição de Usuário */}
      {editUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Usuário</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditUserModal(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={editUserModal.name} onChange={(e) => setEditUserModal({...editUserModal, name: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={editUserModal.email} onChange={(e) => setEditUserModal({...editUserModal, email: e.target.value})} />
              </div>
              <div>
                <Label>Status</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={editUserModal.status}
                  onChange={(e) => setEditUserModal({...editUserModal, status: e.target.value})}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={handleSaveUser}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditUserModal(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  const renderPlans = () => (
    <>
      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#0F7A3A]">Gerenciar Planos</CardTitle>
              <CardDescription>Crie e edite planos de aprovação e gestão (Pagamentos em R$)</CardDescription>
            </div>
            <Button className="bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={() => setNewPlanModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPlans.map((plan) => (
              <Card key={plan.id} className="border-[#1FA65A]/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge className="mt-2" variant="outline">{plan.type}</Badge>
                    </div>
                    <Badge className={plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {plan.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-[#0F7A3A]">
                        R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-[#6B7280]">por mês</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditPlanModal(plan)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeletePlan(plan.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição de Plano */}
      {editPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Plano</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditPlanModal(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome do Plano</Label>
                <Input value={editPlanModal.name} onChange={(e) => setEditPlanModal({...editPlanModal, name: e.target.value})} />
              </div>
              <div>
                <Label>Tipo</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={editPlanModal.type}
                  onChange={(e) => setEditPlanModal({...editPlanModal, type: e.target.value})}
                >
                  <option value="Aprovação">Aprovação</option>
                  <option value="Gestão">Gestão</option>
                </select>
              </div>
              <div>
                <Label>Preço (R$)</Label>
                <Input type="number" step="0.01" value={editPlanModal.price} onChange={(e) => setEditPlanModal({...editPlanModal, price: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label>Status</Label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={editPlanModal.active ? 'true' : 'false'}
                  onChange={(e) => setEditPlanModal({...editPlanModal, active: e.target.value === 'true'})}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={handleSavePlan}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditPlanModal(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Novo Plano */}
      {newPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Criar Novo Plano</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setNewPlanModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreatePlan({
                  name: formData.get('name') as string,
                  type: formData.get('type') as string,
                  price: parseFloat(formData.get('price') as string),
                  active: formData.get('active') === 'true'
                });
              }} className="space-y-4">
                <div>
                  <Label>Nome do Plano</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <select name="type" className="w-full border rounded-md p-2" required>
                    <option value="Aprovação">Aprovação</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                </div>
                <div>
                  <Label>Preço (R$)</Label>
                  <Input name="price" type="number" step="0.01" required />
                </div>
                <div>
                  <Label>Status</Label>
                  <select name="active" className="w-full border rounded-md p-2" required>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#1FA65A] hover:bg-[#0F7A3A]">
                    <Save className="w-4 h-4 mr-2" />
                    Criar
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setNewPlanModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  const renderConnections = () => (
    <Card className="border-[#1FA65A]/20">
      <CardHeader>
        <CardTitle className="text-[#0F7A3A]">Aprovar Conexões</CardTitle>
        <CardDescription>Gerencie solicitações de conexão de contas - Dados completos visíveis para aprovação manual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockConnections.map((connection) => (
            <Card key={connection.id} className={`border-2 ${
              connection.status === 'Aprovado' ? 'border-green-500/30 bg-green-50/50' :
              connection.status === 'Rejeitado' ? 'border-red-500/30 bg-red-50/50' :
              'border-amber-500/30 bg-amber-50/50'
            }`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-semibold text-lg">{connection.user}</span>
                    </div>
                    <Badge className={
                      connection.status === 'Aprovado' ? 'bg-green-100 text-green-700' :
                      connection.status === 'Rejeitado' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }>
                      {connection.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-[#6B7280] font-medium">CONTA COMPLETA</p>
                        <p className="text-sm font-mono font-semibold text-[#0F7A3A]">{connection.account}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] font-medium">LOGIN</p>
                        <p className="text-sm font-mono font-semibold text-[#0F7A3A]">{connection.login}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-[#6B7280] font-medium">SENHA</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono font-semibold text-[#0F7A3A]">
                            {visiblePasswords[connection.id] ? connection.password : '••••••••••'}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePasswordVisibility(connection.id)}
                            className="h-6 w-6 p-0"
                          >
                            {visiblePasswords[connection.id] ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] font-medium">SERVIDOR</p>
                        <p className="text-sm font-mono font-semibold text-blue-600">{connection.server}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-[#6B7280]">
                      Solicitado em: {new Date(connection.date).toLocaleDateString('pt-BR')}
                    </p>
                    
                    {connection.status === 'Pendente' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-[#1FA65A] hover:bg-[#0F7A3A]"
                          onClick={() => handleApproveConnection(connection.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRejectConnection(connection.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderOperations = () => (
    <>
      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#0F7A3A]">Publicar Operações</CardTitle>
              <CardDescription>Gerencie e publique operações das mesas (Forex e Futuros Americanos em U$)</CardDescription>
            </div>
            <Button className="bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={() => setNewOperationModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Operação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Mesa</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Ativo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Lote</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Entrada</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Saída</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Lucro (U$)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Data</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockOperations.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{op.mesa}</td>
                    <td className="py-3 px-4 text-sm">{op.asset}</td>
                    <td className="py-3 px-4 text-sm">{op.lot}</td>
                    <td className="py-3 px-4 text-sm">{op.entry.toFixed(4)}</td>
                    <td className="py-3 px-4 text-sm">{op.exit.toFixed(4)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="text-green-600 font-semibold">
                        +U$ {op.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">
                      {new Date(op.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditOperationModal(op)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteOperation(op.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição de Operação */}
      {editOperationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Operação</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditOperationModal(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Mesa</Label>
                <Input value={editOperationModal.mesa} onChange={(e) => setEditOperationModal({...editOperationModal, mesa: e.target.value})} />
              </div>
              <div>
                <Label>Ativo</Label>
                <Input value={editOperationModal.asset} onChange={(e) => setEditOperationModal({...editOperationModal, asset: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Lote</Label>
                  <Input type="number" step="0.01" value={editOperationModal.lot} onChange={(e) => setEditOperationModal({...editOperationModal, lot: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <Label>Lucro (U$)</Label>
                  <Input type="number" step="0.01" value={editOperationModal.profit} onChange={(e) => setEditOperationModal({...editOperationModal, profit: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entrada</Label>
                  <Input type="number" step="0.0001" value={editOperationModal.entry} onChange={(e) => setEditOperationModal({...editOperationModal, entry: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <Label>Saída</Label>
                  <Input type="number" step="0.0001" value={editOperationModal.exit} onChange={(e) => setEditOperationModal({...editOperationModal, exit: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={handleSaveOperation}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditOperationModal(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Nova Operação */}
      {newOperationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Publicar Nova Operação</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setNewOperationModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateOperation({
                  mesa: formData.get('mesa') as string,
                  asset: formData.get('asset') as string,
                  lot: parseFloat(formData.get('lot') as string),
                  entry: parseFloat(formData.get('entry') as string),
                  exit: parseFloat(formData.get('exit') as string),
                  profit: parseFloat(formData.get('profit') as string),
                  date: new Date().toISOString().split('T')[0]
                });
              }} className="space-y-4">
                <div>
                  <Label>Mesa</Label>
                  <Input name="mesa" placeholder="Ex: Mesa FTMO" required />
                </div>
                <div>
                  <Label>Ativo (Forex/Futuros)</Label>
                  <Input name="asset" placeholder="Ex: EURUSD, NQ, ES" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lote</Label>
                    <Input name="lot" type="number" step="0.01" placeholder="0.5" required />
                  </div>
                  <div>
                    <Label>Lucro (U$)</Label>
                    <Input name="profit" type="number" step="0.01" placeholder="125.00" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entrada</Label>
                    <Input name="entry" type="number" step="0.0001" placeholder="1.0850" required />
                  </div>
                  <div>
                    <Label>Saída</Label>
                    <Input name="exit" type="number" step="0.0001" placeholder="1.0875" required />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#1FA65A] hover:bg-[#0F7A3A]">
                    <Save className="w-4 h-4 mr-2" />
                    Publicar
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setNewOperationModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A] flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Gateway de Pagamento PIX
          </CardTitle>
          <CardDescription>Configure o Client ID da API PIX para gerar QR Code e método de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-[#0F7A3A] mb-2 block">
              Client ID da API PIX
            </Label>
            <Input 
              placeholder="Insira o Client ID fornecido pelo gateway PIX" 
              value={pixClientId}
              onChange={(e) => setPixClientId(e.target.value)}
            />
          </div>
          
          <Button 
            className="bg-[#1FA65A] hover:bg-[#0F7A3A] w-full"
            onClick={handleConfigurePixGateway}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Gerar QR Code e Configurar PIX
          </Button>

          {showPixConfig && (
            <div className="mt-6 space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <CheckCircle className="w-5 h-5" />
                Gateway PIX Configurado com Sucesso!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">QR Code PIX</Label>
                  <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
                    <img src={pixQrCode} alt="QR Code PIX" className="w-48 h-48" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Código Copia e Cola</Label>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-xs font-mono break-all text-gray-700 mb-3">
                      {pixCopyPaste}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleCopyPixCode}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Notificações por E-mail</CardTitle>
          <CardDescription>Configure templates de e-mail automáticos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {emailTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{template.name}</span>
                <Button size="sm" variant="outline" onClick={() => setEditEmailModal(template)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Segurança e Logs</CardTitle>
          <CardDescription>Visualize logs de atividades e configurações de segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Autenticação de dois fatores</p>
                <p className="text-xs text-[#6B7280]">Adicione uma camada extra de segurança</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700">Em breve</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Logs de auditoria</p>
                <p className="text-xs text-[#6B7280]">Visualize todas as ações administrativas</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success('Logs carregados com sucesso!')}>
                <Eye className="w-4 h-4 mr-2" />
                Ver Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição de Template de Email */}
      {editEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Template: {editEmailModal.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditEmailModal(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Assunto do E-mail</Label>
                <Input 
                  value={editEmailModal.subject} 
                  onChange={(e) => setEditEmailModal({...editEmailModal, subject: e.target.value})} 
                />
              </div>
              <div>
                <Label>Conteúdo do E-mail</Label>
                <textarea 
                  className="w-full border rounded-md p-2 min-h-[200px]"
                  value={editEmailModal.content}
                  onChange={(e) => setEditEmailModal({...editEmailModal, content: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{nome}'} para inserir o nome do usuário dinamicamente
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={handleSaveEmailTemplate}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Template
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditEmailModal(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // RENDERIZAÇÃO CONDICIONAL APÓS TODOS OS HOOKS
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-[#1FA65A]">
          <TrendingUp className="w-12 h-12" />
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-[#0F7A3A]">MesaPro Admin</h1>
                <p className="text-xs text-[#6B7280]">Painel Administrativo</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-[#1FA65A]/10 text-[#0F7A3A] border-[#1FA65A]/30">
                <Shield className="w-3 h-3 mr-1" />
                Administrador
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
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'users'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'plans'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Planos
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'connections'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Conexões
              {stats.pendingConnections > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white">{stats.pendingConnections}</Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'operations'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Operações
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#1FA65A] text-[#0F7A3A]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0F7A3A] hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configurações
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0F7A3A] mb-2">
                Bem-vindo, Administrador
              </h2>
              <p className="text-[#6B7280]">
                Gerencie usuários, planos, operações e configurações da plataforma
              </p>
            </div>
            {renderDashboard()}
          </>
        )}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'plans' && renderPlans()}
        {activeTab === 'connections' && renderConnections()}
        {activeTab === 'operations' && renderOperations()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
}
