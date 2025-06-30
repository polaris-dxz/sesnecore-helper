// 账户类型
export interface AccountData {
  type: string;
  username: string;
  password: string;
  desc: string;
  tenant_code?: string;
}

// 模式类型
export type AccountMode = 'dev' | 'tech' | 'prod';

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
