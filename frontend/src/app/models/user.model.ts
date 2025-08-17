export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}