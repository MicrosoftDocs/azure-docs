---
title: Quickstart - Enable enhanced soft delete for Azure Backup
description: This quickstart describes how to enable enhanced soft delete for Azure Backup.
ms.topic: quickstart
ms.date: 09/11/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Enable enhanced soft delete in Azure Backup

This quickstart describes how to enable enhanced soft delete to protect your data and recover backups, if they're deleted.

[Enhanced soft delete](backup-azure-enhanced-soft-delete-about.md) provides an improvement to the [soft delete](backup-azure-security-feature-cloud.md) capability in Azure Backup that enables you to recover your backup data in case of accidental or malicious deletion. With enhanced soft delete, you get the ability to make soft delete always-on, thus protecting it from being disabled by any malicious actors. So, enhanced soft delete provides better protection for your backups against various threats. This feature also allows you to provide a customizable soft delete retention period for which soft deleted data must be retained.

>[!Note]
>Once you enable the *always-on* state for soft delete, you can't disable it for that vault.

## Before you start
 
- Enhanced soft delete is supported for Recovery Services vaults and Backup vaults.
- Enhanced soft delete applies to all vaulted workloads alike in Recovery Services vaults and Backup vaults. However, it currently doesn't support operational tier workloads, such as Azure Files backup, Operational backup for Blobs, and Disk and VM snapshot backups.
- For hybrid backups (using MARS, DPM, or MABS), enabling always-on soft delete will disallow server deregistration and  deletion of backups via the Azure portal. If you don't want to retain the backed-up data, we recommend you not to enable the *always-on soft-delete* for the vault or perform *stop protection with delete data* before the server is decommissioned.
- There's no retention cost for the default soft delete duration of 14 days for vaulted backup, after which it incurs regular backup cost.

## Enable soft delete with always-on state

Soft delete is enabled by default for all new vaults you create. To make enabled settings irreversible, select **Enable Always-on Soft Delete**.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Go to **Recovery Services vault** > **Properties**.

1. Under **Soft Delete**, select **Update** to modify the soft delete setting.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/open-soft-delete-properties-blade-inline.png" alt-text="Screenshot showing you how to open Soft Delete blade." lightbox="./media/backup-azure-enhanced-soft-delete/open-soft-delete-properties-blade-expanded.png":::

   The soft delete settings for cloud and hybrid workloads are already enabled, unless you've explicitly disabled them earlier.

1. If soft delete settings are disabled for any workload type in the **Soft Delete** blade, select the respective checkboxes to enable them.

   >[!Note]
   >Enabling soft delete for hybrid workloads also enables other security settings, such as Multi-factor authentication and alert notification for back up of workloads running in the on-premises servers.

1. Choose the number of days between *14* and *180* to specify the soft delete retention period.

   >[!Note]
   >- There is no cost for soft delete for *14* days. However, deleted instances in soft delete state are charged if the soft delete retention period is *>14* days. Learn about [pricing details](backup-azure-enhanced-soft-delete-about.md#pricing).
   >- Once configured, the soft delete retention period applies to all soft deleted instances of cloud and hybrid workloads in the vault.

1. Select the **Enable Always-on Soft delete** checkbox to enable soft delete and make it irreversible.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/enable-always-on-soft-delete.png" alt-text="Screenshot showing you how to enable a;ways-on state of soft delete.":::

   >[!Note]
   >If you opt for *Enable Always-on Soft Delete*, select the *confirmation checkbox* to proceed. Once enabled, you can't disable the settings for this vault.

1. Select **Update** to save the changes.

# [Backup vault](#tab/backup-vault)

Follow these steps:

1. Go to **Backup vault** > **Properties**.

1. Under **Soft Delete**, select **Update** to modify the soft delete setting.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/open-soft-delete-properties.png" alt-text="Screenshot showing you how to open soft delete blade for Backup vault.":::

   Soft delete is enabled by default with the checkboxes selected.

1. If you've explicitly disabled soft delete for any workload type in the **Soft Delete** blade earlier, select the checkboxes to enable them.

1. Choose the number of days between *14* and *180* to specify the soft delete retention period.

   >[!Note]
   >There is no cost for enabling soft delete  for *14* days. However, you're charged for the soft delete instances if soft delete retention period is *>14* days. Learn about the [pricing details](backup-azure-enhanced-soft-delete-about.md#pricing).

1. Select the **Enable Always-on Soft Delete** checkbox to enable soft delete always-on and make it irreversible.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/enable-always-on-soft-delete-backup-vault.png" alt-text="Screenshot showing you how to enable always-on state for Backup vault.":::

   >[!Note]
   >If you opt for *Enable Always-on Soft Delete*, select the *confirmation checkbox* to proceed. Once enabled, you can't disable the settings for this vault.

1. Select **Update** to save the changes.

---

## Next steps

- Learn more about [enhanced soft delete for Azure Backup](backup-azure-enhanced-soft-delete-about.md).
- Learn more about [soft delete of recovery points](backup-azure-enhanced-soft-delete-about.md#soft-delete-of-recovery-points).
