import inlineCss from '../../../dist/all/index.css?inline';
import { initAppWithShadow } from '@extension/shared';
import { contentUIStorage } from '@extension/storage';
import App from '@src/matches/all/App';

// 检查是否禁用了 Content UI
contentUIStorage.get().then(({ disabled }: { disabled: boolean }) => {
  if (!disabled) {
    initAppWithShadow({ id: 'CEB-extension-all', app: <App />, inlineCss });
  }
});
