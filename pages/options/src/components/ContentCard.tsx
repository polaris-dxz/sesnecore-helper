import { useStorage } from '@extension/shared';
import { exampleThemeStorage, newTabStorage, contentUIStorage } from '@extension/storage';
import { Card, Text, Switch, Box, Flex } from '@radix-ui/themes';
import type { FC, ReactNode } from 'react';

interface ContentCardProps {
  children?: ReactNode;
  style?: React.CSSProperties;
}

export const ContentCard: FC<ContentCardProps> = ({ children, style }) => {
  const { isLight } = useStorage(exampleThemeStorage);
  const { disabled: newTabDisabled } = useStorage(newTabStorage);
  const { disabled: contentUIDisabled } = useStorage(contentUIStorage);

  return (
    <Card size="4" style={{ minWidth: 600, width: '100%', ...style }}>
      <Flex direction="column" gap="4">
        <Flex align="center" justify="between">
          <Box>
            <Text size="4" weight="medium" as="div">
              暗黑模式
            </Text>
            <Text size="2" color="gray" as="div">
              切换亮色和暗色主题
            </Text>
          </Box>
          <Switch checked={!isLight} onCheckedChange={exampleThemeStorage.toggle} />
        </Flex>

        <Flex align="center" justify="between">
          <Box>
            <Text size="4" weight="medium" as="div">
              禁用 New Tab 页
            </Text>
            <Text size="2" color="gray" as="div">
              禁用 New Tab 页，恢复浏览器默认标签页
            </Text>
          </Box>
          <Switch checked={newTabDisabled} onCheckedChange={newTabStorage.toggle} />
        </Flex>

        <Flex align="center" justify="between">
          <Box>
            <Text size="4" weight="medium" as="div">
              禁用 Content UI
            </Text>
            <Text size="2" color="gray" as="div">
              禁用第三方脚本注入
            </Text>
          </Box>
          <Switch checked={contentUIDisabled} onCheckedChange={contentUIStorage.toggle} />
        </Flex>

        <Flex align="center" justify="between">
          <Box>
            <Text size="4" weight="medium" as="div">
              通知提醒
            </Text>
            <Text size="2" color="gray" as="div">
              接收重要通知和提醒
            </Text>
          </Box>
          <Switch />
        </Flex>
      </Flex>
      {children}
    </Card>
  );
};
