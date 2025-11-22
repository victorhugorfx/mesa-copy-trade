// Tipos de dados da aplicação

export type UserRole = 'admin' | 'client' | 'subscriber';

export type PlanType = 'approval' | 'management';

export type AccountSize = 10000 | 25000 | 50000 | 100000;

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired';

export type ConnectionStatus = 'pending' | 'approved' | 'rejected';

export type MesaAccountStatus = 'approved' | 'in_progress' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  description: string;
  features: string[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface PlanOption {
  id: string;
  plan_id: string;
  account_size: AccountSize;
  price: number;
  created_at: Date;
}

export interface Order {
  id: string;
  user_id: string;
  plan_option_id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  pix_payload?: string;
  pix_qr_code?: string;
  tx_id?: string;
  expires_at?: Date;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface MesaAccount {
  id: string;
  user_id: string;
  name: string;
  server: string;
  account_size: AccountSize;
  status: MesaAccountStatus;
  return_percent: number;
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ConnectionRequest {
  id: string;
  user_id: string;
  account_number: string;
  account_password_encrypted: string;
  server: string;
  mesa_account_id?: string;
  status: ConnectionStatus;
  ip_address: string;
  approved_by?: string;
  approved_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OperationPost {
  id: string;
  admin_id: string;
  mesa_account_id: string;
  asset: string;
  lot: number;
  entry_price: number;
  exit_price?: number;
  profit_loss?: number;
  open_timestamp: Date;
  close_timestamp?: Date;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentWebhookLog {
  id: string;
  gateway_response: any;
  order_id: string;
  status: string;
  created_at: Date;
}

export interface PaymentConfig {
  id: string;
  pix_api_key_encrypted: string;
  pix_secret_encrypted: string;
  gateway_url: string;
  created_at: Date;
  updated_at: Date;
}

// DTOs para API
export interface RegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateOrderDTO {
  plan_option_id: string;
}

export interface ConnectAccountDTO {
  account_number: string;
  account_password: string;
  server: string;
}

export interface PublishOperationDTO {
  mesa_account_id: string;
  asset: string;
  lot: number;
  entry_price: number;
  exit_price?: number;
  open_timestamp: string;
  close_timestamp?: string;
}

export interface ApproveConnectionDTO {
  connection_id: string;
  approved: boolean;
  rejection_reason?: string;
}
