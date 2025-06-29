import inlineCss from '../../../dist/example/index.css?inline';
import { initAppWithShadow } from '@extension/shared';
import { contentUIStorage } from '@extension/storage';
import App from '@src/matches/example/App';

// 检查是否禁用了 Content UI
contentUIStorage.get().then(({ disabled }) => {
  if (!disabled) {
    initAppWithShadow({ id: 'CEB-extension-example', app: <App />, inlineCss });
  }
});
