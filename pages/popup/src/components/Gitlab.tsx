import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Button, Text, Flex } from '@radix-ui/themes';

export const Gitlab = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <Flex direction="column" gap="4">
      <Flex align="center" justify="between">
        <Text size="4" weight="bold">
          Gitlab 工具
        </Text>
        <Button onClick={exampleThemeStorage.toggle} variant="outline" size="1">
          {isLight ? '🌙' : '☀️'}
        </Button>
      </Flex>

      <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '300px' }}>
        <Text size="3" color="gray">
          Gitlab 功能正在开发中...
        </Text>
        <Button variant="soft" disabled>
          敬请期待
        </Button>
      </Flex>
    </Flex>
  );
};
