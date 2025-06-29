import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn } from '@extension/ui';
import { Avatar, Flex, Text, Box } from '@radix-ui/themes';
import type { FC } from 'react';

interface SidebarMenuProps {
  menuItems: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export const SidebarMenu: FC<SidebarMenuProps> = ({ menuItems, selected, onSelect }) => {
  const { isLight } = useStorage(exampleThemeStorage);
  return (
    <Box
      style={{ minWidth: 260 }}
      height="100vh"
      className={cn('border-r', isLight ? 'border-gray-200 bg-blue-50' : 'border-gray-700 bg-gray-900')}>
      <Flex direction="column" align="start" gap="4" p="4">
        <Flex align="center" gap="3" mb="5">
          <Avatar
            className=""
            size="3"
            src="https://avatars.githubusercontent.com/u/1?v=4"
            fallback="设置"
            radius="full"
          />
          <Text size="5" weight="bold">
            设置
          </Text>
        </Flex>
        {menuItems.map(item => (
          <button
            key={item}
            type="button"
            tabIndex={0}
            aria-pressed={selected === item}
            onClick={() => onSelect(item)}
            className={cn(
              'w-full select-none appearance-none rounded-lg border-none py-2.5 pl-6 text-left outline-none transition-all duration-200',
              selected === item
                ? isLight
                  ? 'bg-indigo-100 font-semibold text-indigo-600'
                  : 'bg-indigo-900 font-semibold text-indigo-300'
                : isLight
                  ? 'bg-transparent font-normal text-gray-800 hover:bg-gray-100'
                  : 'bg-transparent font-normal text-gray-300 hover:bg-gray-800',
            )}>
            {item}
          </button>
        ))}
      </Flex>
    </Box>
  );
};
