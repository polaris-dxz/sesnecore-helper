import '@src/NewTab.css';
import '@src/NewTab.scss';
import '@radix-ui/themes/styles.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage, newTabStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { Text, Flex, Theme, Tabs, Table, Link, Card, Badge, Button, Tooltip } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

interface MRItem {
  id: number;
  status: string;
  author: string;
  title: string;
  lgtmcommenter?: string;
  create_time: string;
  update_time: string;
}

const NewTab = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const { disabled: newTabDisabled } = useStorage(newTabStorage);
  const [unfinishedMRs, setUnfinishedMRs] = useState<MRItem[]>([]);
  const [finishedMRs, setFinishedMRs] = useState<MRItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const goToOptions = () => chrome.runtime.openOptionsPage();

  const stmImageUrl = chrome.runtime.getURL('new-tab/stm.svg');

  // 时间格式化函数
  const timeAgo = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    let result = '';
    if (days > 0) result += `${days} 天 `;
    if (hours > 0) result += `${hours} 小时 `;
    if (minutes > 0 || result === '') result += `${minutes} 分钟`;

    return result.trim() + '前';
  };

  // 状态转换为 emoji
  const statusToEmoji = (status: string) => {
    switch (status) {
      case 'queue':
        return '⏳';
      case 'backlog':
        return '📦';
      case 'failed':
        return '❌';
      case 'nolgtm':
        return '👀';
      case 'success':
        return '✅';
      case 'closed':
        return '🚫';
      case 'locked':
        return '🔒';
      case 'draft':
        return '📝';
      default:
        return ' ';
    }
  };

  // 获取数据的函数
  const fetchMRData = async (isManual = false) => {
    try {
      if (isManual) {
        setManualRefreshing(true);
      }

      // 获取未完成的 MRs
      const unfinishedRes = await fetch('http://10.53.4.58:8080/api/umrs');
      if (unfinishedRes.ok) {
        const unfinishedData = await unfinishedRes.json();
        setUnfinishedMRs(unfinishedData);
      }

      // 获取已完成的 MRs
      const finishedRes = await fetch('http://10.53.4.58:8080/api/fmrs');
      if (finishedRes.ok) {
        const finishedData = await finishedRes.json();
        setFinishedMRs(finishedData);
      }
    } catch (error) {
      console.error('Error fetching MR data:', error);
    } finally {
      if (isManual) {
        setManualRefreshing(false);
      }
      setLoading(false);
    }
  };

  // 手动刷新
  const handleManualRefresh = () => {
    fetchMRData(true);
  };

  // 初始化和定时刷新
  useEffect(() => {
    fetchMRData();
    const interval = setInterval(() => fetchMRData(false), 10000);
    return () => clearInterval(interval);
  }, []);

  // 渲染 MR 表格
  const renderMRTable = (data: MRItem[]) => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>作者</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ width: '250px' }}>标题</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>LGTM 评论者</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>入队时间</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>更新时间</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(item => (
          <Table.Row key={item.id}>
            <Table.Cell>
              <Text size="2">{statusToEmoji(item.status)}</Text>
            </Table.Cell>
            <Table.Cell>
              <Link
                href={`https://gitlab.bj.sensetime.com/elementary/charm/-/merge_requests/${item.id}`}
                target="_blank"
                color="blue">
                {item.id}
              </Link>
            </Table.Cell>
            <Table.Cell>
              <Link href={`https://gitlab.bj.sensetime.com/${item.author}`} target="_blank" color="blue">
                {item.author}
              </Link>
            </Table.Cell>
            <Table.Cell style={{ width: '250px' }}>
              <Tooltip content={item.title}>
                <Text
                  size="2"
                  style={{
                    maxWidth: '250px',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {item.title}
                </Text>
              </Tooltip>
            </Table.Cell>
            <Table.Cell>
              <Text size="2" color="gray">
                {item.lgtmcommenter || 'n/a'}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="2" color="gray">
                {timeAgo(item.create_time)}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="2" color="gray">
                {timeAgo(item.update_time)}
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );

  // 如果 New Tab 被禁用，显示简单的提示页面
  if (newTabDisabled) {
    return (
      <Theme appearance={isLight ? 'light' : 'dark'}>
        <div
          className={cn(
            'App',
            isLight ? 'bg-slate-50' : 'bg-gray-800',
            'flex min-h-screen items-center justify-center',
          )}>
          <div className={cn('text-center', isLight ? 'text-gray-900' : 'text-gray-100')}>
            <h1 className="mb-4 text-2xl font-bold">New Tab 页面已禁用</h1>
            <p className="mb-6 text-gray-500">您已禁用了插件的 New Tab 页面功能</p>
            <button
              onClick={goToOptions}
              className={cn(
                'rounded-lg px-6 py-3 font-medium transition-colors',
                isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600',
              )}>
              前往设置页面重新启用
            </button>
          </div>
        </div>
      </Theme>
    );
  }

  return (
    <Theme appearance={isLight ? 'light' : 'dark'}>
      <div className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800', 'min-h-screen p-6')}>
        <div className="mx-auto max-w-7xl">
          {/* 标题 */}
          <Flex direction="column" align="center" gap="4" className="mb-6">
            <Text size="8" weight="bold">
              🚦 Merge Request Dashboard
            </Text>
            <Button onClick={handleManualRefresh} disabled={manualRefreshing} variant="soft" size="2">
              {manualRefreshing ? '刷新中...' : '🔄 手动刷新'}
            </Button>
          </Flex>

          {/* 标签页 */}
          <Tabs.Root defaultValue="unfinished">
            <Tabs.List>
              <Tabs.Trigger value="unfinished">未完成</Tabs.Trigger>
              <Tabs.Trigger value="finished">已完成</Tabs.Trigger>
              <Tabs.Trigger value="about">关于</Tabs.Trigger>
            </Tabs.List>

            {/* 未完成的 MRs */}
            <Tabs.Content value="unfinished">
              <Card className="mt-4">
                {loading ? (
                  <Flex align="center" justify="center" className="p-8">
                    <LoadingSpinner />
                  </Flex>
                ) : manualRefreshing ? (
                  <Flex align="center" justify="center" className="p-8">
                    <LoadingSpinner />
                    <Text className="ml-2">正在刷新数据...</Text>
                  </Flex>
                ) : (
                  <div className="overflow-x-auto">{renderMRTable(unfinishedMRs)}</div>
                )}
              </Card>
            </Tabs.Content>

            {/* 已完成的 MRs */}
            <Tabs.Content value="finished">
              <Card className="mt-4">
                {loading ? (
                  <Flex align="center" justify="center" className="p-8">
                    <LoadingSpinner />
                  </Flex>
                ) : manualRefreshing ? (
                  <Flex align="center" justify="center" className="p-8">
                    <LoadingSpinner />
                    <Text className="ml-2">正在刷新数据...</Text>
                  </Flex>
                ) : (
                  <div className="overflow-x-auto">{renderMRTable(finishedMRs)}</div>
                )}
              </Card>
            </Tabs.Content>

            {/* 关于页面 */}
            <Tabs.Content value="about">
              <Card className="mt-4 p-6">
                <Flex direction="column" align="center" gap="4">
                  <Text size="5" weight="bold">
                    相关链接
                  </Text>
                  <Flex gap="4" wrap="wrap" justify="center">
                    <Link
                      href="https://ones.ainewera.com/wiki/#/team/JNwe8qUX/space/F5zdhken/page/TT7s24Tz"
                      target="_blank"
                      color="blue">
                      MR Guidelines
                    </Link>
                    <Link
                      href="https://ones.ainewera.com/wiki/#/team/JNwe8qUX/space/F5zdhken/page/WdvAAvAJ"
                      target="_blank"
                      color="blue">
                      Weekly Log
                    </Link>
                    <Link
                      href="https://gitlab.bj.sensetime.com/elementary/charm/-/merge_requests"
                      target="_blank"
                      color="blue">
                      MR List
                    </Link>
                    <Link
                      href="https://gitlab.bj.sensetime.com/elementary/charm/-/commits/dev/?ref_type=HEADS"
                      target="_blank"
                      color="blue">
                      MR History
                    </Link>
                  </Flex>

                  <Text size="4" weight="bold" className="mt-6">
                    状态说明
                  </Text>

                  <Flex direction="column" gap="2" align="center">
                    <Flex gap="6" wrap="wrap" justify="center">
                      <Badge color="gray">⏳ queue</Badge>
                      <Badge color="gray">📦 backlog</Badge>
                      <Badge color="red">❌ failed</Badge>
                      <Badge color="orange">👀 nolgtm</Badge>
                    </Flex>
                    <Flex gap="6" wrap="wrap" justify="center">
                      <Badge color="blue">📝 draft</Badge>
                      <Badge color="green">✅ success</Badge>
                      <Badge color="gray">🚫 closed</Badge>
                      <Badge color="gray">🔒 locked</Badge>
                    </Flex>
                  </Flex>
                  <div className="mt-8">
                    <img src={stmImageUrl} alt="MR State Transition Diagram" style={{ width: '100%' }} />
                  </div>
                </Flex>
              </Card>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </Theme>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <LoadingSpinner />), ErrorDisplay);
