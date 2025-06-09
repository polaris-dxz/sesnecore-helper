import globalConfig from '@extension/tailwindcss-config';
import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

export default {
  content: ['lib/**/*.tsx', './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}'],
  presets: [globalConfig],
  plugins: [heroui()],
} satisfies Config;
