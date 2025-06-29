import { Avatar, Flex, Text, Box } from '@radix-ui/themes';
import type { FC } from 'react';

interface UserInfoCardProps {
  avatar: string;
  name: string;
  id: string;
}

export const UserInfoCard: FC<UserInfoCardProps> = ({ avatar, name, id }) => (
  <Flex align="center" gap="4">
    <Avatar size="6" src={avatar} fallback={name} radius="full" />
    <Box>
      <Text size="5" weight="bold">
        {name}
      </Text>
      <Text size="3" color="gray" as="div">
        {id}
      </Text>
    </Box>
  </Flex>
);
