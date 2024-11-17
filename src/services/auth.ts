import api from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials);
  return data;
};