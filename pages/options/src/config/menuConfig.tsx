import { GeneralConfig } from '../components/GeneralConfig';
import { HelpAndFeedback } from '../components/HelpAndFeedback';
import { ShortcutSettings } from '../components/ShortcutSettings';
import type { ReactElement } from 'react';

export interface MenuConfigItem {
  id: string;
  label: string;
  component: () => ReactElement;
}

export const menuConfig: MenuConfigItem[] = [
  {
    id: 'general',
    label: '通用',
    component: () => <GeneralConfig />,
  },
  {
    id: 'shortcuts',
    label: '快捷键设置',
    component: () => <ShortcutSettings />,
  },
  {
    id: 'help',
    label: '帮助与反馈',
    component: () => <HelpAndFeedback />,
  },
];
