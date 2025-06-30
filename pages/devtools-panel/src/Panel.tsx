import '@src/Panel.css';
import '@radix-ui/themes/styles.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { Button, Text, Flex, Theme } from '@radix-ui/themes';

const Panel = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <Theme appearance={isLight ? 'light' : 'dark'}>
      <div className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800')}>
        <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '100vh' }}>
          <Text size="4" weight="bold">
            DevTools Panel 功能
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

export default withErrorBoundary(withSuspense(Panel, <LoadingSpinner />), ErrorDisplay);
