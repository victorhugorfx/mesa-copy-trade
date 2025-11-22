// Constantes da aplicação

export const ACCOUNT_SIZES = [
  { value: 10000, label: '10k', display: 'R$ 10.000' },
  { value: 25000, label: '25k', display: 'R$ 25.000' },
  { value: 50000, label: '50k', display: 'R$ 50.000' },
  { value: 100000, label: '100k', display: 'R$ 100.000' },
] as const;

export const PLAN_TYPES = {
  approval: {
    label: 'Plano de Aprovação',
    description: 'Suporte completo para aprovação em mesas proprietárias',
    icon: 'CheckCircle',
  },
  management: {
    label: 'Plano de Gestão',
    description: 'Acompanhe operações em tempo real estilo Copy Trade',
    icon: 'TrendingUp',
  },
} as const;

export const ORDER_STATUS = {
  pending: { label: 'Pendente', color: 'yellow' },
  paid: { label: 'Pago', color: 'green' },
  failed: { label: 'Falhou', color: 'red' },
  expired: { label: 'Expirado', color: 'gray' },
} as const;

export const CONNECTION_STATUS = {
  pending: { label: 'Pendente', color: 'yellow' },
  approved: { label: 'Aprovado', color: 'green' },
  rejected: { label: 'Rejeitado', color: 'red' },
} as const;

export const MESA_STATUS = {
  approved: { label: 'Aprovada', color: 'green' },
  in_progress: { label: 'Em Andamento', color: 'blue' },
  rejected: { label: 'Rejeitada', color: 'red' },
} as const;

// Cores do tema
export const THEME_COLORS = {
  primary: '#1FA65A',
  primaryDark: '#0F7A3A',
  secondary: '#2FAE4A',
  white: '#FFFFFF',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  grayDark: '#374151',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

// Configurações de PIX
export const PIX_EXPIRATION_MINUTES = 15;
export const PIX_POLLING_INTERVAL = 5000; // 5 segundos

// Limites e validações
export const PASSWORD_MIN_LENGTH = 8;
export const PHONE_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
