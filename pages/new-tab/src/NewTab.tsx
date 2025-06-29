import '@src/NewTab.css';
import '@src/NewTab.scss';
import { t } from '@extension/i18n';
import { PROJECT_URL_OBJECT, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage, newTabStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner, ToggleButton } from '@extension/ui';

const NewTab = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const { disabled: newTabDisabled } = useStorage(newTabStorage);
  const logo = isLight ? 'new-tab/logo_horizontal.svg' : 'new-tab/logo_horizontal_dark.svg';

  const goGithubSite = () => chrome.tabs.create(PROJECT_URL_OBJECT);
  const goToOptions = () => chrome.runtime.openOptionsPage();

  // 如果 New Tab 被禁用，显示简单的提示页面
  if (newTabDisabled) {
    return (
      <div
        className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800', 'flex min-h-screen items-center justify-center')}>
        <div className={cn('text-center', isLight ? 'text-gray-900' : 'text-gray-100')}>
          <h1 className="mb-4 text-2xl font-bold">New Tab 页面已禁用</h1>
          <p className="mb-6 text-gray-500">您已禁用了插件的 New Tab 页面功能</p>
          <button
            onClick={goToOptions}
            className={cn(
              'rounded-lg px-6 py-3 font-medium transition-colors',
              isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600',
            )}>
            前往设置页面重新启用
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800')}>
      <header className={cn('App-header', isLight ? 'text-gray-900' : 'text-gray-100')}>
        <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button>
        <p>
          Edit <code>pages/new-tab/src/NewTab.tsx</code>
        </p>
        <h6>The color of this paragraph is defined using SASS.</h6>
        <ToggleButton onClick={exampleThemeStorage.toggle}>{t('toggleTheme')}</ToggleButton>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <LoadingSpinner />), ErrorDisplay);
