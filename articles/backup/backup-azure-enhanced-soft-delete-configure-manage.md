---
title: Configure and manage soft delete for Azure Backup
description: This article describes about how to configure and manage soft delete for Azure Backup.
ms.topic: how-to
ms.date: 05/26/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: references_regions
# Customer intent: As a backup administrator, I want to configure soft delete for my recovery services vault or backup vault, so that I can protect my backup data from accidental deletion and ensure its recoverability over a specified retention period.
---

# Configure and manage soft delete in Azure Backup

This article describes how to configure and use [soft delete](secure-by-default.md) to protect your data and recover backups, if they're deleted.

## Supported scenarios
- Soft delete is now enforced by default, and soft delete state can no longer be modified from the Azure portal. This enforcement ensures reliable recovery from any accidental or malicious deletions.
- With secure by default, soft delete is also applied at the vault level. When a vault is deleted, it automatically transitions into a soft-deleted state, enabling recovery if required. [Learn more](secure-by-default.md)

## Supported regions

**Secure by default with soft delete** is available in the following regions:

| Vault Type               | Availability Type    | Regions                                      |
|--------------------------|----------------------|---------------------------------------------|
| Recovery Services Vault  | General Availability | West Central US                            |
| Recovery Services Vault  | Preview              | All remaining Azure Public Regions         |
| Backup Vault             | Preview              | Australia East, West Central US, East Asia |

For **Backup Vault**, in regions other than **Australia East**, **West Central US**, and **East Asia**, you still have the option to **disable soft delete** from the Azure portal.

## Soft-Delete a backup item

With Secure by Default enabled, backup items can still be soft deleted and later permanently deleted based on configured retention period. However, when a backup item is deleted, it first enters a soft delete state and is retained for the configured retention period before permanent deletion. This retention window helps protect against accidental or malicious deletions by delaying permanent data removal for 14 to 180 days, allowing sufficient time to recover the deleted backup data if needed.

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

1. In the **Resiliency**, go to the *backup instance* that you want to delete.

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

   You can also use the **Resiliency** to go to the item by applying the filter **Protection status == Soft deleted** in the *Backup instances*.

1. Select **Undelete** corresponding to the *soft deleted item*.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/start-recover-backup-items-inline.png" alt-text="Screenshot showing how to start recovering backup items from soft delete state." lightbox="./media/backup-azure-enhanced-soft-delete/start-recover-backup-items-expanded.png":::

1. In the **Undelete** *backup item* blade, select **Undelete** to recover the deleted item.

   All recovery points now appear and the backup item changes to *Stop protection with retain data* state. However, backups don't resume automatically. To continue taking backups for this item, select **Resume backup**.

>[!Note]
>Undeleting a soft deleted item reinstates the backup item into Stop backup with retain data state and doesn't automatically restart scheduled backups. You need to explicitly [resume backups](backup-azure-manage-vms.md#resume-protection-of-a-vm) if you want to continue taking new backups. Resuming backup also cleans up expired recovery points, if any. 

# [Backup vault](#tab/backup-vault)

Follow these steps:

1. Go to the *deleted backup instance* that you want to recover.

   You can also use the **Resiliency** to go to the *instance* by applying the filter **Protection status == Soft deleted** in the *Backup instances*.

1. Select **Undelete** corresponding to the *soft deleted instance*.

   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/start-recover-deleted-backup-vault-items-inline.png" alt-text="Screenshot showing how to start recovering deleted backup vault items from soft delete state." lightbox="./media/backup-azure-enhanced-soft-delete/start-recover-deleted-backup-vault-items-expanded.png":::

1. In the **Undelete** *backup instance* blade, select **Undelete** to recover the item.

   All recovery points appear and the backup item changes to *Stop protection with retain data* state. However, backups don't resume automatically. To continue taking backups for this instance, select **Resume backup**.

>[!Note]
>Undeleting a soft deleted item reinstates the backup item into Stop backup with retain data state and doesn't automatically restart scheduled backups. You need to explicitly [resume backups](backup-azure-manage-vms.md#resume-protection-of-a-vm) if you want to continue taking new backups. Resuming backup will also clean up expired recovery points, if any. 

---

## Unregister containers 

In the case of workloads that group multiple backup items into a container, you can unregister a container if all its backup items are either deleted or soft deleted. 

Here are some points to note:

- You can unregister a container only if it has no protected items, that is, all backup items inside it are either deleted or soft deleted. 

- Unregistering a container while its backup items are soft deleted (not permanently deleted) will change the state of the container to Soft deleted. 

-  You can reregister containers in a soft deleted state to a different vault. However, their existing backups stay in the original vault and get permanently deleted after the soft delete retention period ends. This process doesn’t work with Immutable vaults because the **Delete** operation isn't allowed, and you can’t access items in the Soft Delete state. Learn about [restricted operations for Immutable vault](backup-azure-immutable-vault-concept.md?tabs=recovery-services-vault#restricted-operations).

- You can also *undelete* the container. Once undeleted, it's re-registered to the original vault.

  You can undelete a container only if it's not registered to another vault. If it's registered, then you need to unregister it with the vault before performing the *undelete* operation.

## Soft delete recovery points

[Soft delete of recovery points](secure-by-default.md#soft-delete-of-recovery-points) helps you recover any recovery points that are accidentally or maliciously deleted for some operations that could lead to deletion of one or more recovery points. Recovery points don't move to soft-deleted state immediately and have a *24 hour SLA* (same as before). The example here shows recovery points that were deleted as part of backup policy modifications.

Follow these steps:

1. Go to your *vault* > **Backup policies**.

2. Select the *backup policy* you want to modify.

3. Reduce the retention duration in the backup policy, and then select **Update**.

4. Go to *vault* > **Backup items**.

5. Select a *backup item* that is backed up using the modified policy, and view its details.

6.	To view all recovery points for this item, select **Restore**, and then filter for the impacted recovery points.

   The impacted recovery points are labeled as *being soft deleted* in the **Recovery type** column and will be retained as per the soft delete retention of the vault.
 
   :::image type="content" source="./media/backup-azure-enhanced-soft-delete/select-restore-point-for-soft-delete.png" alt-text="Screenshot shows how to filter recovery points for soft delete.":::

## Undelete recovery points

You can *undelete* recovery points that are in soft deleted state so that they can last until their expiry by modifying the policy again to increase the retention of backups.

Follow these steps:

1. Go to your *vault* > **Backup policies**.

2. Select the *backup policy* you want to modify.

3. Increase the retention duration in the backup policy, and then select **Update**.

4.	Go to *vault* > **Backup items**, select a *backup item* that is backed up using the modified policy, and then view its details.

5.	To view all recovery points for this item, select **Restore**, and then filter for the impacted recovery points.

   The impacted recovery points don't have the *soft deleted* label and can't in soft-deleted state. If there are recovery points that are still beyond the increased retention duration, these would continue to be in the soft-deleted state unless the retention is further increased.

## Manage soft deleted vaults

When vaults are moved to a soft deleted state, you can view, manage and undelete them before its permanently deleted.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Go to the *Recovery Services Vaults* in Azure portal.

2. Go to *Manage Deleted Vaults* in the top menu to view the list of soft deleted vaults with their scheduled purge time.

3. Select the vault of your choice to view the overview and the soft deleted backup items inside the vault.

# [Backup vault](#tab/backup-vault)

Follow these steps:

1. Go to the *Backup Vaults* in Azure portal.

2. Go to *Manage Deleted Vaults* in the top menu to view the list of soft deleted vaults with their scheduled purge time.

3. Select the vault of your choice to view the overview and the soft deleted backup items inside the vault.

---

## Recover soft deleted vaults

If a vault and its backup items are soft-deleted, you can recover them by undeleting the vault and then restoring the backup items before permanent deletion.

# [Recovery Services vault](#tab/recovery-services-vault)

Follow these steps:

1. Navigate to *Recovery Services Vaults* in Azure portal.

2. Select  **Manage Deleted Vaults** from the top menu to view the list of soft-deleted vaults along with their scheduled purge time.

3. Select the vault you want to undelete and review its overview and soft-deleted backup items.

4. Click **Undelete Vault** and confirm the vault details. This action moves the vault back to an active state.

5. After undeleting the vault, you must recover and undelete the backup items separately.

>[!Note]
> - System-assigned and user-assigned managed identities are **not restored** after undeleting the Recovery Services vault. You must reassign these identities manually.
> - Private endpoint connections are removed during vault deletion. After undeleting the vault, you must recreate private endpoints in the required VNet before performing operations on backup data sources or containers


# [Backup vault](#tab/backup-vault)

1. Navigate to *Backup Vaults* in Azure portal.

2. Select  **Manage Deleted Vaults** from the top menu to view the list of soft-deleted vaults along with their scheduled purge time.

3. Select the vault you want to undelete and review its overview and soft-deleted backup items.

4. Click **Undelete Vault** and confirm the vault details. This action moves the vault back to an active state.

>[!Note]
> - When a vault is deleted, its associated **system-assigned** and **user-assigned managed identities** are removed permanently.
> - During the undelete process, you have an option to assign a system-managed identity by default.
>    -    If you **leave the checkbox selected**, the vault will regain its system identity automatically.
>    -    If you **uncheck the checkbox**, the undelete action will succeed, but any attempt to resume backups will fail because the vault lacks an identity. In this case, you can manually assign a new managed identity to the vault after the undelete operation.

5. After undeleting the vault, you must recover and undelete the backup items separately.

---

## Manage customer-managed keys (CMKs) after undeletion

To ensure CMKs are enabled after undeleting the vault, follow these steps:

1. To reapply CMK settings, perform one of the following actions to activate CMK:

   - Choose a different key and apply CMK settings and then revert back to the original CMK key.

   - Choose a different managed identity than the identity used for CMK encryption before vault undeletion and reapply CMK settings.

These actions will reactivate CMK on the vault after it is undeleted.

## Resume backup for a soft-deleted backup item

To resume backup for a soft-deleted backup item, follow these steps:

1. Navigate to the backup instance and select **Resume Backup**.
2. Choose **Grant Permissions** to ensure the associated managed identity has the required permissions.
> [!NOTE]
> - If permissions are not granted, the backup operation will fail.  
> - The **Grant Permissions** option will not be available if the vault associated with the backup instance does not have a managed identity assigned.  
>
> To resolve this, assign the identity and configure permissions from **Identity** under the vault properties.


## Related content

For implementing other security measures on the vaults, see the following articles:

- [Multi-user authorization using Resource Guard](multi-user-authorization-concept.md).
- [Immutable vault for Azure Backup](backup-azure-immutable-vault-concept.md).
- [Private endpoints (v1 experience) for Azure Backup](private-endpoints-overview.md).
- [Private endpoints (v2 experience) for Azure Backup](backup-azure-private-endpoints-concept.md).
- [Secure by Default with Azure Backup ](secure-by-default.md).
