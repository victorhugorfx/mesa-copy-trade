"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// E-mail do administrador
const ADMIN_EMAIL = 'admin@mesapro.com';
const ADMIN_PASSWORD = 'admin123';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verifica se é o admin
      if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', 'admin_authenticated');
          localStorage.setItem('user_role', 'admin'); // CORREÇÃO: Salvar o role
        }
        
        toast.success('Login administrativo realizado com sucesso!');
        router.push('/admin/dashboard');
      } else {
        // Login de cliente normal
        // Aqui você pode adicionar a lógica de autenticação do Supabase para clientes
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_role', 'client'); // Salvar role de cliente
        }
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard'); // Redireciona para dashboard do cliente
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Detecta se é admin baseado no email digitado
  const isAdminEmail = loginData.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className={`w-12 h-12 bg-gradient-to-br ${isAdminEmail ? 'from-[#1FA65A] to-[#0F7A3A]' : 'from-blue-500 to-blue-700'} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300`}>
            {isAdminEmail ? (
              <Shield className="w-7 h-7 text-white" />
            ) : (
              <User className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-white block">MesaPro</span>
            <span className={`text-xs font-semibold transition-all duration-300 ${isAdminEmail ? 'text-[#1FA65A]' : 'text-blue-400'}`}>
              {isAdminEmail ? 'Painel Administrativo' : 'Área do Cliente'}
            </span>
          </div>
        </div>

        <Card className={`border-opacity-30 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 ${isAdminEmail ? 'border-[#1FA65A]' : 'border-blue-500'}`}>
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              {isAdminEmail ? (
                <>
                  <Shield className="w-6 h-6 text-[#1FA65A]" />
                  Acesso Administrativo
                </>
              ) : (
                <>
                  <User className="w-6 h-6 text-blue-400" />
                  Entrar na sua conta
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isAdminEmail 
                ? 'Entre com suas credenciais de administrador'
                : 'Acesse sua conta para fazer reservas'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${isAdminEmail ? 'hover:text-[#1FA65A]' : 'hover:text-blue-400'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className={`w-full font-semibold transition-all duration-300 ${
                  isAdminEmail 
                    ? 'bg-[#1FA65A] hover:bg-[#0F7A3A]' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                disabled={isLoading}
              >
                {isLoading ? 'Autenticando...' : isAdminEmail ? 'Entrar como Administrador' : 'Entrar'}
              </Button>

              {isAdminEmail && (
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-center text-slate-400">
                    Credenciais de teste: admin@mesapro.com / admin123
                  </p>
                </div>
              )}

              {!isAdminEmail && (
                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <p className="text-sm text-center text-slate-400">
                    Não tem uma conta?{' '}
                    <Link href="/cadastro" className="text-blue-400 hover:text-blue-300">
                      Cadastre-se
                    </Link>
                  </p>
                  <p className="text-xs text-center text-slate-500">
                    <Link href="/recuperar-senha" className="hover:text-slate-400">
                      Esqueceu sua senha?
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-400 mt-6">
          <Link href="/" className={`transition-colors ${isAdminEmail ? 'text-[#1FA65A] hover:text-[#0F7A3A]' : 'text-blue-400 hover:text-blue-300'}`}>
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
