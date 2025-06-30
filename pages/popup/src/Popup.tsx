import '@src/Popup.css';
import '@radix-ui/themes/styles.css';
import { SwitchAccount, Gitlab } from './components';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { Card, Theme, Tabs } from '@radix-ui/themes';

const Popup = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <Theme appearance={isLight ? 'light' : 'dark'}>
      <Card size="4" style={{ minHeight: '400px', minWidth: '700px' }}>
        <Tabs.Root defaultValue="switchAccount">
          <Tabs.List>
            <Tabs.Trigger value="switchAccount">SwitchAccount</Tabs.Trigger>
            <Tabs.Trigger value="gitlab">Gitlab</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="switchAccount" style={{ paddingTop: '16px' }}>
            <SwitchAccount />
          </Tabs.Content>

          <Tabs.Content value="gitlab" style={{ paddingTop: '16px' }}>
            <Gitlab />
          </Tabs.Content>
        </Tabs.Root>
      </Card>
    </Theme>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
