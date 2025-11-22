"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Credenciais padrão do admin (desenvolvimento)
      const ADMIN_EMAIL = 'admin@mesapro.com';
      const ADMIN_PASSWORD = 'admin123';

      // Validação simples (em produção, usar API com bcrypt)
      if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
        // Salvar token de admin no localStorage
        localStorage.setItem('admin_token', 'admin_authenticated');
        localStorage.setItem('user_role', 'admin');
        
        toast.success('Login administrativo realizado com sucesso!');
        
        // Redirecionar para painel admin
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      } else {
        toast.error('Credenciais administrativas inválidas');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F7A3A]/10 via-[#1FA65A]/5 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Badge Admin */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-[#1FA65A] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0F7A3A]">MesaPro</span>
          </Link>
          
          <div className="flex items-center space-x-2 bg-[#0F7A3A] text-white px-4 py-2 rounded-full">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Acesso Administrativo</span>
          </div>
        </div>

        <Card className="border-[#0F7A3A]/30 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[#0F7A3A]">
              Painel Administrativo
            </CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">E-mail Administrativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@mesapro.com"
                    className="pl-10 border-[#1FA65A]/30 focus:border-[#1FA65A]"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 border-[#1FA65A]/30 focus:border-[#1FA65A]"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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

              {/* Credenciais de desenvolvimento */}
              <div className="bg-[#1FA65A]/10 border border-[#1FA65A]/30 rounded-lg p-3 text-sm">
                <p className="font-semibold text-[#0F7A3A] mb-1">
                  🔑 Credenciais de Desenvolvimento:
                </p>
                <p className="text-[#6B7280]">
                  <strong>Email:</strong> admin@mesapro.com<br />
                  <strong>Senha:</strong> admin123
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0F7A3A] hover:bg-[#1FA65A] text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin">⏳</span>
                    <span>Autenticando...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Acessar Painel Admin</span>
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#1FA65A]/20">
              <p className="text-center text-sm text-[#6B7280]">
                <Link href="/login" className="text-[#1FA65A] hover:text-[#0F7A3A] font-medium">
                  ← Voltar para login de cliente
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Aviso de Segurança */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="text-amber-800">
            <strong>⚠️ Aviso de Segurança:</strong> Este é um ambiente de desenvolvimento. 
            Em produção, implemente autenticação com hash bcrypt, JWT e 2FA.
          </p>
        </div>
      </div>
    </div>
  );
}
