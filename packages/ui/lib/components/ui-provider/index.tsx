import { HeroUIProvider, ToastProvider } from '../../hero-ui';
import type { FC, PropsWithChildren } from 'react';

export const UIProvider: FC<PropsWithChildren> = ({ children }) => (
  <HeroUIProvider>
    <ToastProvider placement="top-right" />
    {children}
  </HeroUIProvider>
);
