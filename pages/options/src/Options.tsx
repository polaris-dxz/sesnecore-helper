import '@src/Options.css';
import '@radix-ui/themes/styles.css';
import { SidebarMenu } from './components/SidebarMenu';
import { menuConfig } from './config/menuConfig';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { Theme, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';

const Options = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const [selectedId, setSelectedId] = useState(menuConfig[0].id);

  // 获取当前选中的菜单项
  const selectedMenu = menuConfig.find(menu => menu.id === selectedId) || menuConfig[0];
  const menuLabels = menuConfig.map(menu => menu.label);

  const handleMenuSelect = (label: string) => {
    const menu = menuConfig.find(menu => menu.label === label);
    if (menu) {
      setSelectedId(menu.id);
    }
  };

  return (
    <Theme appearance={isLight ? 'light' : 'dark'}>
      <div className="mx-auto flex h-screen w-full max-w-[1200px]">
        <SidebarMenu menuItems={menuLabels} selected={selectedMenu.label} onSelect={handleMenuSelect} />
        <Flex
          direction="column"
          flexGrow="1"
          align="center"
          justify="start"
          p="9"
          className={cn(isLight ? 'bg-white' : 'bg-gray-950')}>
          <div className="mx-auto w-full max-w-[1200px]">
            <Flex align="center" justify="between">
              <Text size="6" weight="bold" mb="6" align="left" className="w-full">
                {selectedMenu.label}
              </Text>
            </Flex>
            <Flex direction="column" align="center" gap="5" width="100%">
              <selectedMenu.component />
            </Flex>
          </div>
        </Flex>
      </div>
    </Theme>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingSpinner />), ErrorDisplay);
