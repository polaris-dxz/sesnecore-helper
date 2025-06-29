import { createStorage, StorageEnum } from '../base/index.js';
import type { BaseStorageType } from '../base/index.js';

interface ContentUIStateType {
  disabled: boolean;
}

type ContentUIStorageType = BaseStorageType<ContentUIStateType> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<ContentUIStateType>(
  'content-ui-storage-key',
  {
    disabled: false,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

const contentUIStorage: ContentUIStorageType = {
  ...storage,
  toggle: async () => {
    await storage.set(currentState => ({
      disabled: !currentState.disabled,
    }));
  },
};

export { contentUIStorage };
export type { ContentUIStateType, ContentUIStorageType };
