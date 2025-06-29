import { createStorage, StorageEnum } from '../base/index.js';
import type { BaseStorageType } from '../base/index.js';

interface NewTabStateType {
  disabled: boolean;
}

type NewTabStorageType = BaseStorageType<NewTabStateType> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<NewTabStateType>(
  'new-tab-storage-key',
  {
    disabled: false,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

const newTabStorage: NewTabStorageType = {
  ...storage,
  toggle: async () => {
    await storage.set(currentState => ({
      disabled: !currentState.disabled,
    }));
  },
};

export { newTabStorage };
export type { NewTabStateType, NewTabStorageType };
