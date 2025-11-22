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
  Save
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

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Modal states
  const [editUserModal, setEditUserModal] = useState<User | null>(null);
  const [editPlanModal, setEditPlanModal] = useState<Plan | null>(null);
  const [editOperationModal, setEditOperationModal] = useState<Operation | null>(null);
  const [newPlanModal, setNewPlanModal] = useState(false);
  const [newOperationModal, setNewOperationModal] = useState(false);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-[#1FA65A]">
          <TrendingUp className="w-12 h-12" />
        </div>
      </div>
    );
  }

  // Dados mockados para demonstração
  const stats = {
    totalUsers: 156,
    activeSubscriptions: 89,
    pendingConnections: 12,
    totalRevenue: 45780.50,
    approvedMesas: 34,
    pendingOrders: 8
  };

  const [mockUsers, setMockUsers] = useState<User[]>([
    { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'Cliente', status: 'Ativo', subscription: 'Plano 25k' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'Cliente', status: 'Ativo', subscription: 'Plano 50k' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', role: 'Cliente', status: 'Pendente', subscription: 'Nenhum' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', role: 'Cliente', status: 'Ativo', subscription: 'Plano 10k' },
  ]);

  const [mockPlans, setMockPlans] = useState<Plan[]>([
    { id: 1, name: 'Plano Aprovação 10k', type: 'Aprovação', price: 197.99, active: true },
    { id: 2, name: 'Plano Aprovação 25k', type: 'Aprovação', price: 297.99, active: true },
    { id: 3, name: 'Plano Gestão 50k', type: 'Gestão', price: 497.99, active: true },
    { id: 4, name: 'Plano Gestão 100k', type: 'Gestão', price: 797.99, active: false },
  ]);

  const mockConnections = [
    { id: 1, user: 'João Silva', account: '****1234', server: 'FTMO-Server1', status: 'Pendente', date: '2024-01-15' },
    { id: 2, user: 'Maria Santos', account: '****5678', server: 'FTMO-Server2', status: 'Pendente', date: '2024-01-14' },
    { id: 3, user: 'Carlos Souza', account: '****9012', server: 'MyFundedFX', status: 'Pendente', date: '2024-01-13' },
  ];

  const [mockOperations, setMockOperations] = useState<Operation[]>([
    { id: 1, mesa: 'Mesa FTMO', asset: 'EURUSD', lot: 0.5, entry: 1.0850, exit: 1.0875, profit: 125.00, date: '2024-01-15' },
    { id: 2, mesa: 'Mesa FTMO', asset: 'GBPUSD', lot: 0.3, entry: 1.2650, exit: 1.2680, profit: 90.00, date: '2024-01-15' },
    { id: 3, mesa: 'Mesa MyFundedFX', asset: 'USDJPY', lot: 0.4, entry: 148.50, exit: 148.80, profit: 120.00, date: '2024-01-14' },
  ]);

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
                <Badge className="bg-green-100 text-green-700">Operacional</Badge>
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
                onClick={() => toast.info('Funcionalidade em desenvolvimento')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Templates de E-mail
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info('Funcionalidade em desenvolvimento')}
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
              <CardDescription>Crie e edite planos de aprovação e gestão</CardDescription>
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
        <CardDescription>Gerencie solicitações de conexão de contas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockConnections.map((connection) => (
            <Card key={connection.id} className="border-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6B7280]" />
                      <span className="font-semibold">{connection.user}</span>
                    </div>
                    <div className="text-sm text-[#6B7280] space-y-1">
                      <p>Conta: {connection.account}</p>
                      <p>Servidor: {connection.server}</p>
                      <p>Data: {new Date(connection.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="bg-[#1FA65A] hover:bg-[#0F7A3A]"
                      onClick={() => toast.success('Conexão aprovada com sucesso!')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => toast.error('Conexão rejeitada')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
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
              <CardDescription>Gerencie e publique operações das mesas</CardDescription>
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F7A3A]">Lucro</th>
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
                        +R$ {op.profit.toFixed(2)}
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
                  <Label>Lucro (R$)</Label>
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
                  <Label>Ativo</Label>
                  <Input name="asset" placeholder="Ex: EURUSD" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lote</Label>
                    <Input name="lot" type="number" step="0.01" placeholder="0.5" required />
                  </div>
                  <div>
                    <Label>Lucro (R$)</Label>
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
          <CardTitle className="text-[#0F7A3A]">Configurações do Sistema</CardTitle>
          <CardDescription>Gerencie configurações gerais da plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#0F7A3A] mb-2 block">
              Gateway PIX - Chave API
            </label>
            <Input placeholder="Insira a chave da API PIX" type="password" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#0F7A3A] mb-2 block">
              Gateway PIX - Secret Key
            </label>
            <Input placeholder="Insira a secret key" type="password" />
          </div>
          <Button className="bg-[#1FA65A] hover:bg-[#0F7A3A]" onClick={() => toast.success('Configurações salvas com sucesso!')}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <Card className="border-[#1FA65A]/20">
        <CardHeader>
          <CardTitle className="text-[#0F7A3A]">Notificações por E-mail</CardTitle>
          <CardDescription>Configure templates de e-mail automáticos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">E-mail de boas-vindas</span>
              <Button size="sm" variant="outline" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>Editar</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Confirmação de pagamento</span>
              <Button size="sm" variant="outline" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>Editar</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Aprovação de conexão</span>
              <Button size="sm" variant="outline" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>Editar</Button>
            </div>
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
              <Button size="sm" variant="outline" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>Ver Logs</Button>
            </div>
          </div>
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
