import { readAccount, createAccount, updateAccount, deleteAccount } from '@extension/openapi';
import { PROJECT_URL_OBJECT } from '@extension/shared';
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  ReloadIcon,
  ExternalLinkIcon,
  Cross2Icon,
  DotsVerticalIcon,
  CopyIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import * as Toast from '@radix-ui/react-toast';
import {
  Table,
  Button,
  Badge,
  Text,
  Flex,
  Spinner,
  Callout,
  Card,
  TextField,
  TextArea,
  Select,
  DropdownMenu,
  AlertDialog,
} from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import type { AccountData, AccountMode, CreateAccountParams, UpdateAccountParams } from '@extension/openapi';

type ViewMode = 'list' | 'create' | 'edit';

const SwitchAccountContent = () => {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<AccountMode>('dev');
  const [creating, setCreating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);

  // Toast 状态
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<AccountData | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<CreateAccountParams>({
    username: '',
    password: '',
    desc: '',
    mode: 'dev',
    type: 'tenant',
    tenant_code: '',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const fetchAccounts = async (mode: AccountMode = selectedMode) => {
    try {
      setLoading(true);
      setError(null);
      const accountData = await readAccount({ mode });
      setAccounts(accountData);
    } catch (err) {
      console.error('获取账户数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
      showToast('获取账户数据失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAccounts();
  };

  useEffect(() => {
    fetchAccounts(selectedMode);
  }, [selectedMode]);

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      desc: '',
      mode: selectedMode,
      type: 'tenant',
      tenant_code: '',
    });
  };

  const showCreateForm = () => {
    resetForm();
    setViewMode('create');
    setEditingAccount(null);
  };

  const showEditForm = (account: AccountData) => {
    setFormData({
      username: account.username,
      password: account.password,
      desc: account.desc || '',
      mode: account.mode,
      type: account.type || 'tenant',
      tenant_code: account.tenant_code || '',
    });
    setEditingAccount(account);
    setViewMode('edit');
  };

  const cancelForm = () => {
    setViewMode('list');
    setEditingAccount(null);
    resetForm();
  };

  const handleCreate = async () => {
    if (!formData.username || !formData.password) {
      showToast('请填写用户名和密码', 'error');
      return;
    }

    try {
      setCreating(true);

      const createData = {
        ...formData,
        mode: selectedMode,
      };

      const result = await createAccount(createData);
      console.log('创建结果:', result);

      await fetchAccounts();
      showToast('账户创建成功');
      cancelForm();
    } catch (error) {
      console.error('创建失败:', error);
      showToast('创建失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingAccount) return;

    try {
      setCreating(true);

      const updateData: UpdateAccountParams = {
        id: editingAccount.id,
        password: formData.password,
        desc: formData.desc,
        mode: editingAccount.mode,
        type: formData.type,
      };

      // 只有当 tenant_code 有值时才添加该字段
      if (formData.tenant_code) {
        updateData.tenant_code = formData.tenant_code;
      }

      console.log('发送更新数据:', updateData);

      const result = await updateAccount(updateData);
      console.log('更新结果:', result);

      await fetchAccounts();
      showToast('账户更新成功');
      cancelForm();
    } catch (error) {
      console.error('更新失败:', error);
      showToast('更新失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const showDeleteConfirm = (account: AccountData) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;

    try {
      const deleteData = {
        id: accountToDelete.id,
        mode: accountToDelete.mode,
      };

      const result = await deleteAccount(deleteData);
      console.log('删除结果:', result);

      await fetchAccounts();
      showToast('账户删除成功');
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error('删除失败:', error);
      showToast('删除失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  const handleUsernameClick = (account: AccountData) => {
    console.log('点击用户名:', account);
    console.log('用户名:', account.username);
    console.log('类型:', account.type);
    console.log('租户代码:', account.tenant_code);
    console.log('描述:', account.desc);
  };

  const goGithubSite = () => chrome.tabs.create(PROJECT_URL_OBJECT);

  // 修正复制功能函数
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label}已复制到剪贴板`);
    } catch (err) {
      console.error('复制失败:', err);
      showToast('复制失败', 'error');
    }
  };

  const handleCopy = (account: AccountData) => {
    if (account.type === 'iam') {
      // IAM 类型复制：租户代码:用户名:密码
      const tenantCode = account.tenant_code || '';
      const content = `${tenantCode}:${account.username}:${account.password}`;
      copyToClipboard(content, 'IAM账密');
    } else {
      // tenant 类型复制：用户名:密码
      const content = `${account.username}:${account.password}`;
      copyToClipboard(content, '租户账密');
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '350px' }}>
        <Spinner size="3" />
        <Text size="3" color="gray">
          加载账户数据中...
        </Text>
      </Flex>
    );
  }

  // 表单视图
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <>
        <Flex direction="column" gap="4">
          {/* Header */}
          <Flex align="center" justify="between">
            <Text size="4" weight="bold">
              {viewMode === 'create' ? '新增账户' : '修改账户'}
            </Text>
            <Button onClick={cancelForm} variant="soft" size="1">
              <Cross2Icon />
              取消
            </Button>
          </Flex>

          {/* 表单 */}
          <Card>
            <Flex direction="column" gap="3">
              <Flex gap="2">
                <TextField.Root
                  placeholder="用户名"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  style={{ flex: 1 }}
                  disabled={viewMode === 'edit'}
                />
                <TextField.Root
                  placeholder="密码"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ flex: 1 }}
                />
              </Flex>

              <Flex gap="2">
                <Select.Root
                  value={formData.type}
                  onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                  <Select.Trigger style={{ flex: formData.type === 'iam' ? 1 : 2 }} />
                  <Select.Content>
                    <Select.Item value="tenant">租户</Select.Item>
                    <Select.Item value="iam">IAM</Select.Item>
                  </Select.Content>
                </Select.Root>
                {formData.type === 'iam' && (
                  <TextField.Root
                    placeholder="租户代码"
                    value={formData.tenant_code}
                    onChange={e => setFormData({ ...formData, tenant_code: e.target.value })}
                    style={{ flex: 1 }}
                  />
                )}
              </Flex>

              <TextArea
                placeholder="描述(可选)"
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                rows={3}
              />

              <Flex gap="2">
                <Button onClick={cancelForm} variant="soft" style={{ flex: 1 }}>
                  取消
                </Button>
                <Button
                  onClick={viewMode === 'create' ? handleCreate : handleUpdate}
                  disabled={creating}
                  style={{ flex: 1 }}>
                  <PlusIcon />
                  {creating
                    ? viewMode === 'create'
                      ? '创建中...'
                      : '更新中...'
                    : viewMode === 'create'
                      ? '创建账户'
                      : '更新账户'}
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Flex>

        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          duration={3000}
          className={`toast-root toast-${toastType}`}>
          <Flex align="center" gap="2">
            {toastType === 'success' ? (
              <CheckIcon style={{ color: '#10b981', flexShrink: 0 }} />
            ) : (
              <ExclamationTriangleIcon style={{ color: '#ef4444', flexShrink: 0 }} />
            )}
            <Flex direction="column" gap="1">
              <Toast.Title className="toast-title">{toastType === 'success' ? '成功' : '错误'}</Toast.Title>
              <Toast.Description className="toast-description">{toastMessage}</Toast.Description>
            </Flex>
          </Flex>
          <Toast.Close className="toast-close">
            <Cross2Icon />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="toast-viewport" />
      </>
    );
  }

  // 列表视图
  return (
    <>
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" justify="between">
          <Text size="4" weight="bold">
            账户管理
          </Text>
          <Flex align="center" gap="2">
            <Select.Root value={selectedMode} onValueChange={(value: AccountMode) => setSelectedMode(value)}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="dev">开发环境</Select.Item>
                <Select.Item value="tech">测试环境</Select.Item>
                <Select.Item value="cn-sh-02-dev">2.0 开发环境</Select.Item>
                <Select.Item value="cn-sh-03-dev">2.0 测试环境</Select.Item>
                <Select.Item value="prod">生产环境</Select.Item>
              </Select.Content>
            </Select.Root>
            <Button onClick={handleRefresh} variant="soft" size="1">
              <ReloadIcon />
              刷新
            </Button>
            <Button onClick={showCreateForm} variant="solid" size="1">
              <PlusIcon />
              新增
            </Button>
          </Flex>
        </Flex>

        {/* 错误提示 */}
        {error && (
          <Callout.Root color="red">
            <Callout.Text>加载失败: {error}</Callout.Text>
          </Callout.Root>
        )}

        {/* 账户列表 */}
        {accounts.length > 0 ? (
          <Card>
            <Flex direction="column" gap="3">
              <Text size="3" weight="bold">
                现有账户
              </Text>
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
                  {accounts.map(account => (
                    <Table.Row key={account.id}>
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
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button variant="soft" size="1">
                              <DotsVerticalIcon />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item onSelect={() => handleCopy(account)}>
                              <CopyIcon />
                              复制账密
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onSelect={() => showEditForm(account)}>
                              <Pencil1Icon />
                              修改账户
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onSelect={() => showDeleteConfirm(account)} color="red">
                              <TrashIcon />
                              删除账户
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Flex>
          </Card>
        ) : (
          <Card>
            <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '200px' }}>
              <Text size="3" color="gray">
                暂无账户数据
              </Text>
              <Button onClick={showCreateForm} variant="solid">
                <PlusIcon />
                创建第一个账户
              </Button>
            </Flex>
          </Card>
        )}

        {/* Footer */}
        <Flex align="center" justify="between">
          <Text size="2" color="gray">
            {selectedMode} 环境 · 共 {accounts.length} 个账户
          </Text>
          <Button onClick={goGithubSite} variant="ghost" size="1">
            <ExternalLinkIcon />
            访问项目主页
          </Button>
        </Flex>
      </Flex>

      {/* 删除确认对话框 */}
      <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>确认删除</AlertDialog.Title>
          <AlertDialog.Description size="2">
            确定要删除账户 <strong>{accountToDelete?.username}</strong> 吗？此操作无法撤销。
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" onClick={cancelDelete}>
                取消
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDelete}>
                删除账户
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        duration={3000}
        className={`toast-root toast-${toastType}`}>
        <Flex align="center" gap="2">
          {toastType === 'success' ? (
            <CheckIcon style={{ color: '#10b981', flexShrink: 0 }} />
          ) : (
            <ExclamationTriangleIcon style={{ color: '#ef4444', flexShrink: 0 }} />
          )}
          <Flex direction="column" gap="1">
            <Toast.Title className="toast-title">{toastType === 'success' ? '成功' : '错误'}</Toast.Title>
            <Toast.Description className="toast-description">{toastMessage}</Toast.Description>
          </Flex>
        </Flex>
        <Toast.Close className="toast-close">
          <Cross2Icon />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="toast-viewport" />
    </>
  );
};

// 导出包装了 ToastProvider 的组件
export const SwitchAccount = () => (
  <Toast.Provider>
    <SwitchAccountContent />
  </Toast.Provider>
);
