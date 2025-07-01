// 账户类型
export interface AccountData {
  id: string;
  mode: AccountMode;
  type: string;
  username: string;
  password: string;
  desc: string;
  tenant_code?: string;
}

// 模式类型
export type AccountMode = string;

// API 响应类型
export interface ReadAccountResponse {
  dev?: AccountData[];
  tech?: AccountData[];
  prod?: AccountData[];
  [key: string]: AccountData[] | undefined;
}

// API 请求参数
export interface ReadAccountParams {
  mode?: AccountMode;
}

// 创建账户请求参数
export interface CreateAccountParams {
  username: string;
  password: string;
  desc?: string;
  mode: AccountMode;
  type?: string;
  tenant_code?: string;
}

// 更新账户请求参数
export interface UpdateAccountParams {
  id: string;
  password?: string;
  desc?: string;
  mode: AccountMode;
  type?: string;
  tenant_code?: string;
}

// 删除账户请求参数
export interface DeleteAccountParams {
  id: string;
  mode: AccountMode;
}

// API 响应基础类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
