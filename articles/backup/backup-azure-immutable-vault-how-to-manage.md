---
title: How to manage Azure Backup Immutable vault operations
description: This article explains how to manage Azure Backup Immutable vault operations.
ms.topic: how-to
ms.service: backup
ms.date: 05/25/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage Azure Backup Immutable vault operations

[Immutable vault](backup-azure-immutable-vault-concept.md) can help you protect your backup data by blocking any operations that could lead to loss of recovery points. Further, you can lock the Immutable vault setting to make it irreversible to prevent any malicious actors from disabling immutability and deleting backups.

In this article, you'll learn how to:

> [!div class="checklist"]
>
> - Enable Immutable vault
> - Perform operations on Immutable vault
> - Disable immutability

## Enable Immutable vault

You can enable immutability for a vault through its properties.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Go to the **Recovery Services vault** for which you want to enable immutability.

1. In the vault, go to **Properties** > **Immutable vault**, and then select **Settings**.

   :::image type="content" source="./media/backup-azure-immutable-vault/enable-immutable-vault-settings.png" alt-text="Screenshot showing how to open the Immutable vault settings.":::

1. On **Immutable vault**, select the **Enable vault immutability** checkbox to enable immutability for the vault.

   At this point, immutability of the vault is reversible, and it can be disabled, if needed.

1. Once you enable immutability, the option to lock the immutability for the vault appears.

   Once you enable this lock, it makes immutability setting for the vault irreversible. While this helps secure the backup data in the vault, we recommend you make a well-informed decision when opting to lock. You can also test and validate how the current settings of the vault, backup policies, and so on, meet your requirements and can lock the immutability setting later. 

1. Select **Apply** to save the changes.

   :::image type="content" source="./media/backup-azure-immutable-vault/backup-azure-enable-immutability.png" alt-text="Screenshot showing how to enable the Immutable vault settings.":::

# [Backup vault](#tab/backup-vault)

Follow these steps:

1.	Go to the **Backup vault** for which you want to enable immutability.

1. In the vault, go to **Properties** > **Immutable vault**, and then select **Settings**.

   :::image type="content" source="./media/backup-azure-immutable-vault/enable-immutable-vault-settings-backup-vault.png" alt-text="Screenshot showing how to open the Immutable vault settings for a Backup vault.":::

1. On **Immutable vault**, select the **Enable vault immutability** checkbox to enable immutability for the vault.

   At this point, immutability of the vault is reversible, and it can be disabled, if needed.

1. Once you enable immutability, the option to lock the immutability for the vault appears.

   Once you enable this lock, it makes immutability setting for the vault irreversible. While this helps secure the backup data in the vault, we recommend you to make a well-informed decision when opting to lock. You can also test and validate how the current settings of the vault, backup policies, and so on, meet your requirements, and can lock the immutability setting later.

1. Select **Apply** to save the changes.

   :::image type="content" source="./media/backup-azure-immutable-vault/backup-azure-enable-immutability.png" alt-text="Screenshot showing how to enable the Immutable vault settings for a Backup vault.":::

---

## Perform operations on Immutable vault

As per the [Restricted operations](backup-azure-immutable-vault-concept.md#restricted-operations), certain operations are restricted on Immutable vault. However, other operations on the vault or the items it contains remain unaffected.

### Perform restricted operations

[Restricted operations](backup-azure-immutable-vault-concept.md#restricted-operations) are disallowed on the vault. Consider the following example when trying to modify a policy to reduce its retention in a vault with immutability enabled. This example shows operation on the Recovery Services vaults; however, similar experiences apply for other operations and operations on the Backup vaults.

Consider a policy with a daily backup point retention of *35 days* and weekly backup point retention of *two weeks*, as shown in the following screenshot.

:::image type="content" source="./media/backup-azure-immutable-vault/view-backup-policy.png" alt-text="Screenshot showing how to view a backup policy for modification.":::

Now, let's try to reduce the retention of daily backup points to *30 days*, reducing by *5 days*, and save the policy.

You'll see that the operation fails with the information that the vault has immutability enabled, and therefore, any changes that could reduce retention of recovery points are disallowed.

:::image type="content" source="./media/backup-azure-immutable-vault/modify-policy-to-reduce-retention.png" alt-text="Screenshot showing how to modify backup policy to reduce backup retention.":::

Now, let's try to increase the retention of daily backup points to *40 days*, increasing by *5 days*, and save the policy.

This time, the operation successfully passes as no recovery points can be deleted as part of this update.

:::image type="content" source="./media/backup-azure-immutable-vault/modify-policy-to-increase-retention.png" alt-text="Screenshot showing how to modify backup policy to increase backup retention.":::

However, increasing the retention of backup items that are in suspended state isn't supported.

Let's try to stop backup on a VM and choose **Retain as per policy** for backup data retention.

:::image type="content" source="./media/backup-azure-immutable-vault/attempt-to-increase-retention-of-backup-items-in-suspended-state.png" alt-text="Screenshot shows an attempt to increase retention of backup items in suspended state.":::

Now, let's go to **Modify Policy** and try to increase the retention of daily backup points to *45 days*, increasing the value by *5 days*, and save the policy.

:::image type="content" source="./media/backup-azure-immutable-vault/error-on-attempt-to-increase-retention-of-backup-items-in-suspended-state.png" alt-text="Screenshot shows an error has occurred when you try to increase retention of backup items that are in suspended state.":::

When you try to update the policy, the operation fails with an error and you can't modify the policy as the backup is in suspended state.

## Disable immutability

You can disable immutability only for vaults that have immutability enabled, but not locked.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Go to the **Recovery Services** vault for which you want to disable immutability.

1. In the vault, go to **Properties** > **Immutable vault**, and then select **Settings**.

   :::image type="content" source="./media/backup-azure-immutable-vault/disable-immutable-vault-settings.png" alt-text="Screenshot showing how to open the Immutable vault settings to disable.":::

1. In the **Immutable vault** blade, clear the **Enable vault Immutability** checkbox.

1. Select **Apply** to save the changes.

   :::image type="content" source="./media/backup-azure-immutable-vault/backup-azure-disable-immutability.png" alt-text="Screenshot showing how to disable the Immutable vault settings.":::

# [Backup vault](#tab/backup-vault)

Follow these steps:

1. Go to the **Backup vault** for which you want to disable immutability.

1. In the vault, go to **Properties** > **Immutable vault**, and then select **Settings**.

   :::image type="content" source="./media/backup-azure-immutable-vault/disable-immutable-vault-settings-backup-vault.png" alt-text="Screenshot showing how to open the Immutable vault settings to disable for a Backup vault.":::

1. In the **Immutable vault** blade, clear the **Enable vault Immutability** checkbox.

1. Select **Apply** to save the changes.

   :::image type="content" source="./media/backup-azure-immutable-vault/backup-azure-disable-immutability.png" alt-text="Screenshot showing how to disable the Immutable vault settings for a Backup vault.":::

---

## Next steps

- Learn [about Immutable vault for Azure Backup](backup-azure-immutable-vault-concept.md).
