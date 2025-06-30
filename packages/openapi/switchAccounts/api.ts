import type { ReadAccountResponse, ReadAccountParams, AccountData, AccountMode } from './types';

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

    // 过滤掉 mode 和 id 字段，只返回需要的数据
    return accounts.map(({ ...account }) => ({
      type: account.type,
      username: account.username,
      password: account.password,
      desc: account.desc,
      tenant_code: account.tenant_code,
    }));
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
