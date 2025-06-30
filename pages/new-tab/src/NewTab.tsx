import '@src/NewTab.css';
import '@src/NewTab.scss';
import '@radix-ui/themes/styles.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage, newTabStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { Button, Text, Flex, Theme } from '@radix-ui/themes';

const NewTab = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const { disabled: newTabDisabled } = useStorage(newTabStorage);

  const goToOptions = () => chrome.runtime.openOptionsPage();

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
      <div
        className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800', 'flex min-h-screen items-center justify-center')}>
        <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '300px' }}>
          <Text size="4" weight="bold">
            New Tab 功能
          </Text>
          <Text size="3" color="gray">
            功能正在开发中...
          </Text>
          <Button variant="soft" disabled>
            敬请期待
          </Button>
        </Flex>
      </div>
    </Theme>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <LoadingSpinner />), ErrorDisplay);
