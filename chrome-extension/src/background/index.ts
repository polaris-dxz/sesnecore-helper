import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

// MR ID 收集功能 - 消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'postMRs') {
    const mrIds = message.mrIds;

    fetch('http://10.53.4.58:8080/api/mrs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer rwmqvkgtwknwwzxsdxofevqvfvexcfg',
      },
      body: JSON.stringify({
        ids: mrIds,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('📬 Posted MR IDs successfully:', data);
        sendResponse({ success: true, data });
      })
      .catch(err => {
        console.error('❌ Failed to post MR IDs:', err);
        sendResponse({ success: false, error: err.toString() });
      });

    // Required for async response
    return true;
  }

  // 其他消息类型不需要异步处理
  return false;
});
