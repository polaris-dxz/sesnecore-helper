import type {
  ReadAccountResponse,
  ReadAccountParams,
  AccountData,
  AccountMode,
  CreateAccountParams,
  UpdateAccountParams,
  DeleteAccountParams,
  ApiResponse,
} from './types.js';

const BASE_URL = 'https://fe-api.sensecore.dev';

/**
 * 读取账户数据
 */
export const readAccount = async (params?: ReadAccountParams): Promise<AccountData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/plugin/readAccount`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ReadAccountResponse = await response.json();

    // 默认从 dev 获取，也可以指定其他 mode
    const mode: AccountMode = params?.mode || 'dev';
    const accounts = data[mode] || [];

    // 返回完整的账户数据，包含 id 和 mode
    return accounts;
  } catch (error) {
    console.error('获取账户数据失败:', error);
    throw error;
  }
};

/**
 * 获取所有模式的账户数据
 */
export const readAllAccounts = async (): Promise<Record<AccountMode, AccountData[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/api/plugin/readAccount`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ReadAccountResponse = await response.json();

    return {
      dev: data.dev || [],
      tech: data.tech || [],
      prod: data.prod || [],
    };
  } catch (error) {
    console.error('获取所有账户数据失败:', error);
    throw error;
  }
};

/**
 * 创建账户
 */
export const createAccount = async (params: CreateAccountParams): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/plugin/createAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('创建账户失败:', error);
    throw error;
  }
};

/**
 * 更新账户
 */
export const updateAccount = async (params: UpdateAccountParams): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/plugin/updateAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('更新账户失败:', error);
    throw error;
  }
};

/**
 * 删除账户
 */
export const deleteAccount = async (params: DeleteAccountParams): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/plugin/deleteAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('删除账户失败:', error);
    throw error;
  }
};
