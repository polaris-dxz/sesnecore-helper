import { readAccount } from '@extension/openapi';
import { PROJECT_URL_OBJECT, useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { ReloadIcon, CopyIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { Table, Button, Badge, Text, Flex, Spinner, Callout } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import type { AccountData, AccountMode } from '@extension/openapi';

export const SwitchAccount = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<AccountMode>('dev');

  const fetchAccounts = async (mode: AccountMode = selectedMode) => {
    try {
      setLoading(true);
      setError(null);
      const accountData = await readAccount({ mode });
      setAccounts(accountData);
    } catch (err) {
      console.error('获取账户数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedMode('dev');
  }, []);

  useEffect(() => {
    fetchAccounts(selectedMode);
  }, [selectedMode]);

  const handleUsernameClick = (account: AccountData) => {
    console.log('点击用户名:', account);
    console.log('用户名:', account.username);
    console.log('类型:', account.type);
    console.log('租户代码:', account.tenant_code);
    console.log('描述:', account.desc);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('复制成功:', text);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const goGithubSite = () => chrome.tabs.create(PROJECT_URL_OBJECT);

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '350px' }}>
        <Spinner size="3" />
        <Text size="3" color="gray">
          加载账户数据中...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" gap="4" style={{ minHeight: '350px' }}>
        <Callout.Root color="red">
          <Callout.Text>加载失败: {error}</Callout.Text>
        </Callout.Root>
        <Button onClick={() => fetchAccounts()} variant="solid">
          <ReloadIcon />
          重试
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4">
      {/* Header */}
      <Flex align="center" justify="between">
        <Text size="4" weight="bold">
          开发环境账户
        </Text>
        <Flex align="center" gap="2">
          <Button onClick={() => fetchAccounts()} variant="soft" size="1">
            <ReloadIcon />
            刷新
          </Button>
          <Button onClick={exampleThemeStorage.toggle} variant="outline" size="1">
            {isLight ? '🌙' : '☀️'}
          </Button>
        </Flex>
      </Flex>

      {/* Table */}
      {accounts.length > 0 ? (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>类型</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>用户名</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>租户代码</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>描述</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {accounts.map((account, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Badge color={account.type === 'tenant' ? 'blue' : 'green'} variant="soft">
                    {account.type}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button variant="ghost" size="1" onClick={() => handleUsernameClick(account)}>
                    {account.username}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" style={{ fontFamily: 'monospace' }}>
                    {account.tenant_code || '-'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" color="gray">
                    {account.desc || '-'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="1">
                    <Button onClick={() => copyToClipboard(account.password)} variant="soft" size="1" title="复制密码">
                      <CopyIcon />
                      密码
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(`${account.username}:${account.password}`)}
                      variant="soft"
                      size="1"
                      title="复制账密">
                      <CopyIcon />
                      账密
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '200px' }}>
          <Text size="3" color="gray">
            暂无账户数据
          </Text>
        </Flex>
      )}

      {/* Footer */}
      <Flex align="center" justify="between">
        <Text size="2" color="gray">
          共 {accounts.length} 个账户
        </Text>
        <Button onClick={goGithubSite} variant="ghost" size="1">
          <ExternalLinkIcon />
          访问项目主页
        </Button>
      </Flex>
    </Flex>
  );
};
