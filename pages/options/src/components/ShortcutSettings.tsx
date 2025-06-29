import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text, TextField, IconButton, Box, Callout } from '@radix-ui/themes';
import { useState } from 'react';
import type { FC } from 'react';

interface ShortcutItem {
  label: string;
  value: string;
}

const shortcutList = [
  { label: '唤起侧边栏', value: 'Cmd + K' },
  { label: '唤起输入框', value: 'Opt + K' },
  { label: '双击唤起语音输入', value: '' },
];

const ShortcutInput: FC<{ value: string; onChange: (value: string) => void; onClear: () => void }> = ({
  value,
  onChange,
  onClear,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecording) return;

    e.preventDefault();

    const keys = [];
    if (e.metaKey) keys.push('Cmd');
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');

    if (e.key && !['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
      keys.push(e.key.toUpperCase());
    }

    if (keys.length > 1) {
      const shortcut = keys.join(' + ');
      setDisplayValue(shortcut);
      onChange(shortcut);
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    setIsRecording(true);
    setDisplayValue('按下快捷键...');
  };

  const handleBlur = () => {
    setIsRecording(false);
    setDisplayValue(value);
  };

  const handleClear = () => {
    setDisplayValue('');
    onChange('');
    onClear();
  };

  return (
    <TextField.Root
      value={displayValue}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      readOnly
      placeholder="点击设置快捷键"
      style={{ width: '200px' }}>
      {value && (
        <TextField.Slot>
          <IconButton size="1" variant="ghost" onClick={handleClear}>
            <Cross2Icon width="12" height="12" />
          </IconButton>
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

export const ShortcutSettings: FC = () => {
  const [shortcuts, setShortcuts] = useState(shortcutList);

  const handleShortcutChange = (index: number, newValue: string) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index].value = newValue;
    setShortcuts(newShortcuts);
  };

  const handleShortcutClear = (index: number) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index].value = '';
    setShortcuts(newShortcuts);
  };

  return (
    <Flex direction="column" gap="4" className="w-full">
      <Callout.Root>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>点击输入框并按下快捷键组合来设置快捷键。某些系统快捷键可能无法被覆盖。</Callout.Text>
      </Callout.Root>
      <Card size="4" style={{ minWidth: 600, width: '100%' }}>
        <Flex direction="column" gap="4">
          {shortcuts.map((item: ShortcutItem, index) => (
            <Flex key={item.label} align="center" justify="between">
              <Box>
                <Text size="4" weight="medium" as="div">
                  {item.label}
                </Text>
                <Text size="2" color="gray" as="div">
                  设置该功能的快捷键
                </Text>
              </Box>
              <ShortcutInput
                value={item.value}
                onChange={value => handleShortcutChange(index, value)}
                onClear={() => handleShortcutClear(index)}
              />
            </Flex>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};
