ALTER TABLE `stores`
  MODIFY `status` ENUM('PENDING_ACTIVATION', 'ACTIVE', 'SUSPENDED', 'CLOSED') NOT NULL DEFAULT 'PENDING_ACTIVATION';

ALTER TABLE `stores`
  ADD COLUMN `activated_at` DATETIME(3) NULL,
  ADD COLUMN `trial_ends_at` DATETIME(3) NULL;

CREATE INDEX `stores_activated_at_idx` ON `stores` (`activated_at`);
CREATE INDEX `stores_trial_ends_at_idx` ON `stores` (`trial_ends_at`);
