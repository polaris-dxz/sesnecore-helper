import packageJson from '../../../../package.json';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { ExternalLinkIcon, InfoCircledIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text, Link, Avatar, Tooltip, Badge, Callout } from '@radix-ui/themes';
import type { FC } from 'react';

export const HelpAndFeedback: FC = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  const handleFeedbackClick = () => {
    window.open(
      'https://ones.ainewera.com/project/#/team/JNwe8qUX/project/A6ahUgi8cJmAmdVP/component/JsDZUcH2/view/7ow8WSjq',
      '_blank',
    );
  };

  const handleUpdateClick = () => {
    window.open('https://github.com/your-repo/releases', '_blank');
  };

  const authorImgUrl = chrome.runtime.getURL('options/author.jpg');
  const wechatQrUrl = chrome.runtime.getURL('options/wechat-qr.png');

  // 版本比较逻辑
  const currentVersion = packageJson.version;
  const latestVersion = '0.1.1';

  const compareVersions = (current: string, latest: string): boolean => {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;

      if (currentPart < latestPart) return true; // 需要更新
      if (currentPart > latestPart) return false; // 当前版本更新
    }
    return false; // 版本相同
  };

  const needsUpdate = compareVersions(currentVersion, latestVersion);

  return (
    <Flex direction="column" gap="4" className="w-full">
      {/* 版本信息 */}
      <Card size="4">
        <Flex direction="column" gap="4">
          <Flex align="center" justify="between">
            <Flex align="center" gap="3">
              <InfoCircledIcon width="20" height="20" />
              <Text size="4" weight="medium">
                版本信息
              </Text>
            </Flex>
            <Flex align="center" gap="2">
              <Text size="3" weight="bold" color={needsUpdate ? 'orange' : 'blue'}>
                v{currentVersion}
              </Text>
              {needsUpdate && (
                <Badge color="orange" size="1">
                  有更新
                </Badge>
              )}
            </Flex>
          </Flex>

          {needsUpdate ? (
            <Callout.Root color="orange" size="1">
              <Callout.Icon>
                <UpdateIcon />
              </Callout.Icon>
              <Callout.Text>
                <Flex align="center" justify="between" width="100%">
                  <Text style={{ flex: 1, marginRight: '16px' }}>
                    发现新版本 v{latestVersion}，建议更新以获得最佳体验
                  </Text>
                  <Link onClick={handleUpdateClick} style={{ flexShrink: 0 }}>
                    <Flex align="center" gap="1">
                      <Text size="2" weight="medium" color="orange" className="cursor-pointer">
                        立即更新
                      </Text>
                      <ExternalLinkIcon width="12" height="12" color="var(--orange-9)" className="cursor-pointer" />
                    </Flex>
                  </Link>
                </Flex>
              </Callout.Text>
            </Callout.Root>
          ) : (
            <Text size="2" color="gray">
              当前为最新版本
            </Text>
          )}
        </Flex>
      </Card>

      {/* 问题反馈 */}
      <Card size="4">
        <Flex align="center" justify="between">
          <Flex direction="column" gap="1">
            <Text size="4" weight="medium">
              问题反馈
            </Text>
            <Text size="2" color="gray">
              遇到问题或有建议？点击反馈给我们
            </Text>
          </Flex>
          <Link onClick={handleFeedbackClick} className="flex items-center gap-2 whitespace-nowrap">
            <Flex align="center" gap="2">
              <Text size="3" weight="medium" color="blue" className="cursor-pointer">
                反馈问题
              </Text>
              <ExternalLinkIcon width="14" height="14" color="var(--blue-9)" className="cursor-pointer" />
            </Flex>
          </Link>
        </Flex>
      </Card>

      {/* 作者信息 */}
      <Card size="4">
        <Flex direction="column" gap="4">
          <Flex align="center" justify="between">
            <div>
              <Text size="4" weight="medium" as="div">
                联系作者
              </Text>
              <Text size="2" color="gray" as="div">
                感谢使用，如有问题欢迎联系
              </Text>
            </div>
            <Tooltip
              content={
                <div className="p-2">
                  <img src={wechatQrUrl} alt="微信二维码" className="h-32 w-32 object-contain" />
                  <Text size="2" align="center" as="div" className="mt-2">
                    扫码添加微信
                  </Text>
                </div>
              }>
              <Flex
                align="center"
                gap="3"
                className={`cursor-pointer rounded-md p-2 transition-colors ${
                  isLight ? 'hover:bg-gray-100' : 'hover:bg-gray-800'
                }`}>
                <Avatar size="3" src={authorImgUrl} fallback="作者" radius="full" />
                <div>
                  <Text size="3" weight="medium" as="div">
                    杜翕之
                  </Text>
                  <Text size="2" color="gray" as="div">
                    悬停查看微信
                  </Text>
                </div>
              </Flex>
            </Tooltip>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
