---
title: Tutorial - Recover soft deleted data and recovery points using enhanced soft delete in Azure Backup
description: Learn how to enable enhanced soft delete and recover your data and recover backups, if they're deleted.
ms.topic: tutorial
ms.date: 09/11/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Recover soft deleted data and recovery points using enhanced soft delete in Azure Backup

This tutorial describes how to enable enhanced soft delete and recover your data and recover backups, if they're deleted.

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

## Delete a backup item

You can delete backup items/instances even if the soft delete settings are enabled. However, if the soft delete is enabled, the deleted items don't get permanently deleted immediately and stays in soft deleted state as per [configured retention period](#enable-soft-delete-with-always-on-state). Soft delete delays permanent deletion of backup data by retaining deleted data for *14*-*180* days.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Go to the *backup item* that you want to delete.
1. Select **Stop backup**.
1. On the **Stop Backup** page, select **Delete Backup Data** from the drop-down list to delete all backups for the instance.
1. Provide the applicable information, and then select  **Stop backup** to delete all backups for the instance.

   Once the *delete* operation completes, the backup item is moved to soft deleted state. In **Backup items**, the soft deleted item is marked in *Red*, and the last backup status shows that backups are disabled for the item.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/soft-deleted-backup-items-marked-red-inline.png" alt-text="Screenshot showing the soft deleted backup items marked red." lightbox="./media/backup-azure-enhanced-soft-delete/soft-deleted-backup-items-marked-red-expanded.png":::

   In the item details, the soft deleted item shows no recovery point. Also, a notification appears to mention the state of the item, and the number of days left before the item is permanently deleted. You can select **Undelete** to recover the soft deleted items.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/soft-deleted-item-shows-no-recovery-point-inline.png" alt-text="Screenshot showing the soft deleted backup item that shows no recovery point." lightbox="./media/backup-azure-enhanced-soft-delete/soft-deleted-item-shows-no-recovery-point-expanded.png":::

>[!Note]
>When the item is in soft deleted state, no recovery points are cleaned on their expiry as per the backup policy.

# [Backup vault](#tab/backup-vault)

Follow these steps:

1. In the **Backup center**, go to the *backup instance* that you want to delete.

1. Select **Stop backup**.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/stop-backup-for-backup-vault-items-inline.png" alt-text="Screenshot showing how to initiate the stop backup process for backup items in Backup vault." lightbox="./media/backup-azure-enhanced-soft-delete/stop-backup-for-backup-vault-items-expanded.png":::

   You can also select **Delete** in the instance view to delete backups.

1. On the **Stop Backup** page, select **Delete Backup Data** from the drop-down list to delete all backups for the instance.

1. Provide the applicable information, and then select **Stop backup** to initiate the deletion of the backup instance.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/start-stop-backup-process.png" alt-text="Screenshot showing how to stop the backup process.":::

   Once deletion completes, the instance appears as *Soft deleted*.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/deleted-backup-items-marked-soft-deleted-inline.png" alt-text="Screenshot showing the deleted backup items marked as Soft Deleted." lightbox="./media/backup-azure-enhanced-soft-delete/deleted-backup-items-marked-soft-deleted-expanded.png":::

---

## Recover a soft-deleted backup item

If a backup item/ instance is soft deleted, you can recover it before it's permanently deleted.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Go to the *backup item* that you want to retrieve from the *soft deleted* state.

   You can also use the **Backup center** to go to the item by applying the filter **Protection status == Soft deleted** in the *Backup instances*.

1. Select **Undelete** corresponding to the *soft deleted item*.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/start-recover-backup-items-inline.png" alt-text="Screenshot showing how to start recovering backup items from soft delete state." lightbox="./media/backup-azure-enhanced-soft-delete/start-recover-backup-items-expanded.png":::

1. In the **Undelete** *backup item* blade, select **Undelete** to recover the deleted item.

   All recovery points now appear and the backup item changes to *Stop protection with retain data* state. However, backups don't resume automatically. To continue taking backups for this item, select **Resume backup**.

# [Backup vault](#tab/backup-vault)

Follow these steps:

1. Go to the *deleted backup instance* that you want to recover.

   You can also use the **Backup center** to go to the *instance* by applying the filter **Protection status == Soft deleted** in the *Backup instances*.

1. Select **Undelete** corresponding to the *soft deleted instance*.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/start-recover-deleted-backup-vault-items-inline.png" alt-text="Screenshot showing how to start recovering deleted backup vault items from soft delete state." lightbox="./media/backup-azure-enhanced-soft-delete/start-recover-deleted-backup-vault-items-expanded.png":::

1. In the **Undelete** *backup instance* blade, select **Undelete** to recover the item.

   All recovery points appear and the backup item changes to *Stop protection with retain data* state. However, backups don't resume automatically. To continue taking backups for this instance, select **Resume backup**.

>[!Note]
>Undeleting a soft deleted item reinstates the backup item into Stop backup with retain data state and doesn't automatically restart scheduled backups. You need to explicitly [resume backups](backup-azure-manage-vms.md#resume-protection-of-a-vm) if you want to continue taking new backups. Resuming backup will also clean up expired recovery points, if any. 

---


>- MUA for soft delete is currently supported for Recovery Services vaults only.

## Next steps

- Learn more about [enhanced soft delete for Azure Backup](backup-azure-enhanced-soft-delete-about.md).
- Learn more about [soft delete of recovery points](backup-azure-enhanced-soft-delete-about.md#soft-delete-of-recovery-points).
