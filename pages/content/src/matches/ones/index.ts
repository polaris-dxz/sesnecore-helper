console.log('[CEB] ONES content script loaded');

// MR ID 收集功能
const TARGET_HASH = '#/team/JNwe8qUX/space/F5zdhken/page/WdvAAvAJ';

const postToLocalServer = (mrIds: string[]) => {
  chrome.runtime.sendMessage(
    {
      action: 'postMRs',
      mrIds: mrIds,
    },
    response => {
      console.log(response);

      const timestamp = new Date();
      if (response?.success) {
        console.log(timestamp + '✅ MR IDs posted via background:');
      } else {
        console.error('❌ Background post failed:', response?.error);
      }
    },
  );
};

const extractAndSendMergeRequestIdsOnce = () => {
  const links = document.querySelectorAll('[link*="/merge_requests/"]');
  const mrIds: string[] = [];

  links.forEach(el => {
    const url = el.getAttribute('link');
    if (url) {
      const match = url.match(/\/merge_requests\/(\d+)/);
      if (match) {
        mrIds.push(match[1]);
      }
    }
  });

  console.log('🧾 Merge Request IDs:', mrIds);

  if (mrIds.length > 0) {
    postToLocalServer(mrIds); // ✅ Post to localhost
  }
};

const waitForLinksAndExtract = () => {
  const maxWaitTime = 10000;
  const checkInterval = 500;
  let waited = 0;

  const intervalId = setInterval(() => {
    const found = document.querySelector('[link*="/merge_requests/"]');
    if (found) {
      clearInterval(intervalId);
      extractAndSendMergeRequestIdsOnce();
    } else {
      waited += checkInterval;
      if (waited >= maxWaitTime) {
        clearInterval(intervalId);
        console.warn('⏰ Timed out waiting for MR links.');
      }
    }
  }, checkInterval);
};

const initMRCollection = () => {
  // 检查是否在目标页面
  if (location.hash === TARGET_HASH) {
    console.log('✅ On target ONES page. Starting auto-reload + MR extraction...');
    waitForLinksAndExtract();

    // 每 5 分钟刷新页面
    setInterval(() => {
      console.log('🔄 Reloading page...');
      location.reload();
    }, 300 * 1000);
  } else {
    console.log('📍 On ONES platform but not target page. Current hash:', location.hash);
  }
};

// 初始化 MR 收集功能
initMRCollection();
