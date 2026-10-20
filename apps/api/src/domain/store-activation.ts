export type StoreActivationState = {
  status: string;
  activatedAt?: Date | null;
  trialEndsAt?: Date | null;
};

const TRIAL_DURATION_MS = 60 * 24 * 60 * 60 * 1000;

export function isStorePubliclyVisible(
  store: StoreActivationState,
  hasValidPaidSubscription = false,
): boolean {
  if (store.status !== 'ACTIVE') {
    return false;
  }

  if (!store.activatedAt) {
    return false;
  }

  if (hasValidPaidSubscription) {
    return true;
  }

  if (store.trialEndsAt && new Date() > new Date(store.trialEndsAt)) {
    return false;
  }

  return true;
}

export function activateStore(store: StoreActivationState): StoreActivationState {
  if (store.status === 'ACTIVE' && store.activatedAt && store.trialEndsAt) {
    return store;
  }

  const activatedAt = store.activatedAt ?? new Date();
  const trialEndsAt =
    store.trialEndsAt ?? new Date(activatedAt.getTime() + TRIAL_DURATION_MS);

  return {
    ...store,
    status: 'ACTIVE',
    activatedAt,
    trialEndsAt,
  };
}
