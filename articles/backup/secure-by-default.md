---
title: Secure by Default with Soft Delete for Azure Backup
description: Learn how secure by default with soft delete works for Azure Backup.
ms.topic: overview
ms.date: 11/10/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24, ignite-2024, references_regions
# Customer intent: As a data administrator, I want to use soft-delete features in Azure Backup so that I can ensure the recoverability of deleted backup data for up to 180 days and protect against accidental or malicious deletions.
---


# Secure by default with soft delete for Azure Backup

You can use the *secure by default* feature with soft delete for Azure Backup to recover your backup data after it's deleted. This feature is useful when:

- You accidentally deleted backup data and you need it back.
- Ransomware or bad actors maliciously deleted backup data.

Soft delete is now enforced by default as part of secure-by-default assurance for Azure Backup. It provides guaranteed recovery from accidental or malicious deletions. This default enforcement is currently in preview across all public regions for Recovery Services vaults.

## Supported scenarios

- Now that soft delete is enforced by default, a soft-delete state can no longer be modified from the Azure portal. This enforcement ensures reliable recovery from any accidental or malicious deletions.
- With secure by default, soft delete is also applied at the vault level. When a vault is deleted, it automatically transitions into a soft-deleted state. You can then recover the vault if necessary.

## Supported regions

Secure by default with soft delete is available in the following regions:

| Vault type               | Availability type    | Regions                                      |
|--------------------------|----------------------|---------------------------------------------|
| Recovery Services vault  | General availability | West Central US                            |
| Recovery Services vault  | Preview              | All remaining Azure public regions         |
| Backup vault             | Preview              | Australia East, West Central US, East Asia |

For a Backup vault, in regions other than Australia East, West Central US, and East Asia, you still have the option to disable soft delete from the Azure portal.

## What's soft delete?

Soft delete delays permanent deletion of backup data and vaults (in preview for vaults) and gives you an opportunity to recover data after deletion. This deleted data is retained for the specified soft-delete retention period. The retention period is 14 days by default. You can extend it up to 180 days.

If you need data after it's deleted (that is, while the data is in soft-deleted state), you can restore it. This action returns the data to a **Stop protection with retain data** state. You can then use the data to perform other restore operations, or you can resume backups for this instance.

The following diagram shows the flow of a backup item (or a backup instance) that's deleted.

:::image type="content" source="./media/secure-by-default/backup-item-delete-flow.png" alt-text="Diagram that shows the flow of a backup item or a backup instance that's deleted." lightbox="./media/secure-by-default/backup-item-delete-flow.png":::

The key benefits of soft delete are:

- **Secure by default**: Soft delete is automatically enabled for recovery points, backup items, and vaults. It operates in a single, enforced state across all onboarded regions. This enforced state eliminates the need to disable soft delete under any circumstances. All newly created vaults have soft delete permanently enabled to provide enhanced protection and enforce a **Good** security level by default.

  > [!NOTE]
  > You can't disable soft delete in the regions where secure-by-default assurance is in preview or general availability (GA) for Recovery Services vaults and Backup vaults.

- **Data recoverability**: Azure Backup keeps your data recoverable for up to 14 days by default at no extra cost. You don't need to take any action to configure a secure-by-default state for your backup data.

- **Enhanced security posture**: In regions where secure by default with soft delete is generally available for Recovery Services vaults, all vaults benefit from built-in protection against ransomware attacks. As a result, the security level for all backup items and vaults in GA regions is elevated to a **Good** security level.

- **Configurable soft-delete retention**: You can specify the retention duration for deleted backup data to remain in a soft-deleted state. The duration can range from 14 to 180 days. By default, the retention duration is set to 14 days for the vault. You can extend it as required.

  You don't incur additional costs for 14 days. However, you're charged for any period beyond 14 days.

- **Soft delete for vaults**: You can move vaults with soft-deleted items into a soft-deleted state. If necessary, you can recover soft-deleted vaults within the configured retention period. Also during the retention period, you can create a new Recovery Services vault or Backup vault with the same name in the same resource group as the soft-deleted vault.

- **Reconfiguration of soft-deleted backup items**: You can configure backup for the items in a soft-deleted state with another vault of your choice. [Learn more](../business-continuity-center/tutorial-reconfigure-backup-alternate-vault.md).

- **Soft delete and re-registration of backup containers**: You can unregister the backup containers (which you can soft delete) if you deleted all backup items in the container. You can then register such soft-deleted containers to other vaults. This ability is applicable for supported workloads only, including backups for SQL Server on Azure Virtual Machines, SAP HANA on Azure Virtual Machines, and on-premises servers.

  > [!NOTE]
  > To unregister hybrid backups by using Microsoft Azure Recovery Services (MARS), System Center Data Protection Manager, or Microsoft Azure Backup Server (MABS), you don't need to disable soft delete. Backup data moves to a soft-deleted state and is deleted permanently after the retention period expires.

- **Soft delete across workloads**: Soft delete applies to all vaulted data sources, and it's supported for Recovery Services vaults and Backup vaults. Soft delete also applies to operational backups of disks and virtual machine (VM) backup snapshots used for instant restores. However, unlike vaulted backups, these snapshots can be directly accessed and deleted before the soft-delete period expires. Soft delete is currently not supported for operational backups of blobs and Azure Files shares.

- **Soft delete of recovery points**: You can recover data from recovery points that you deleted as part of making changes in a backup policy or changing the backup policy associated with a backup item. Soft delete of recovery points isn't supported for log recovery points in SQL Server and SAP HANA workloads.

## Soft delete for vaults

When you use the Azure portal to initiate the deletion of a Recovery Services vault or Backup vault that contains soft-deleted items, the vault automatically moves into a soft-deleted state instead of being permanently removed. You can recover soft-deleted vaults by restoring them within the configured retention period.

During the retention period, you can also create a new vault with the same name in the same resource group as the soft-deleted vault. Azure Backup allows multiple soft-deleted vaults with the same name within a single resource group, because naming constraints are enforced only for active vaults.

For a Recovery Services vault, you must follow these steps before you initiate the vault deletion:

1. Stop backups and soft delete all protected items.
1. Clean up associations of servers and storage accounts.
1. Disable replication for Azure Site Recovery replicated items.
1. Clean up dependencies related to your Site Recovery replicated items.
1. Remove private endpoint connections.

For a Backup vault, you must stop backups and soft delete all protected items before you initiate the vault deletion.

> [!NOTE]
> Azure Backup doesn't allow the reconfiguration of a backup item to the same vault if the backup item is already in a soft-deleted state. However, you can protect the item in a different vault or restore and resume backup in the same vault for Recovery Services vaults.

## Soft delete of recovery points

Soft delete of recovery points helps you recover any recovery points that are accidentally or maliciously deleted for some operations that could lead to deletion of one or more recovery points. For example, these activities can cause a loss of certain recovery points:

- Modification of a backup policy associated with a backup item to reduce the backup retention
- Assigning a new policy to a backed-up item that has a lower retention

This feature helps to retain these recovery points for an additional duration, in accordance with the soft-delete retention that you specified for the vault. The affected recovery points show up as soft deleted during this period.

You can restore the recovery points by increasing the retentions in the backup policy. You can also restore your data from soft-deleted state, if you don't choose to restore the recovery points.

Soft delete of recovery points is not supported for log recovery points in SQL Server and SAP HANA workloads.

## Soft-delete retention period

Soft-delete retention is the retention period (in days) of a deleted item in soft-deleted state. After the retention period elapses (from the date of deletion), the item is permanently deleted, and you can't restore it.

You can choose a soft-delete retention period of 14 to 180 days. Longer durations can help you recover data from threats that might take time to identify (for example, advanced persistent threats).

By default, soft-delete retention is set to 14 days. You can change it at any time. However, the soft-delete retention period that's active at the time of the deletion governs retention of the item in a soft-deleted state.

Soft-delete retention for 14 days involves no cost. Regular backup charges apply for additional retention days.

Soft-deleted operational backups aren't cleaned automatically after the retention period if the associated vault was also soft deleted. You must manually delete these soft-deleted operational backups.

## Pricing

There's no retention cost for the default soft-delete duration of 14 days for vaulted backups. After that, soft delete incurs regular backup charges. For soft-delete retention of more than 14 days, the default period applies to the last 14 days of the continuous retention configured in soft delete, and then backups are permanently deleted.

For example, assume that you deleted backups for one of the instances in a vault that has a soft-delete retention of 60 days. If you want to recover the soft-deleted data after 52 days of deletion:

- Standard rates apply for the first 46 days (60 days of configured soft-delete retention, minus 14 days of default soft-delete retention). Similar rates apply when the instance is in a **Stop protection with retain data** state.

- There are no charges for the last 6 days of soft-delete retention.

However, the preceding billing rule doesn't apply for soft-deleted operational backups of disks and VM backup snapshots. The billing continues according to the cost of the resource.

When you restore a soft-deleted backup item, it becomes active again. Standard pricing rates then apply.

## API considerations for soft delete

Secure by default with soft delete is enabled by default with the latest API versions during preview for both Recovery Services vaults and Backup vaults. In GA for Recovery Services vaults, the secure-by-default behavior is enforced across *all* API versions.

> [!NOTE]
> In the preview regions, you can still use older API versions to immediately disable soft delete and delete backup items, if necessary.

The following sections outline the API behavior across scenarios for preview and GA types.

### Delete Protected Item action

The following table outlines the behavior of the **Delete Protected Item** action across various clients, based on the state of soft-delete configuration:

# [Preview](#tab/preview)

| Client | Soft delete enabled or always on | Soft delete disabled |
|-------------|----------------------------------------|-----------------------------|
| Azure portal | Backup items move to a soft-deleted state. | Backup items move to a soft-deleted state. |
| Azure PowerShell | Backup items move to a soft-deleted state. | For Azure PowerShell modules version 7.5.0 or later, backup items in a Recovery Services vault move to a soft-deleted state. For earlier versions, backup items are deleted immediately.<br><br>Backup vault actions are independent of the module version. |
| Azure CLI | Backup items move to a soft-deleted state. | For Azure CLI version 2.75.0 or later, backup items in a Recovery Services vault move to a soft-deleted state. For earlier versions, backup items are deleted immediately.<br><br>Backup vault actions are independent of the module version. |
| REST API | Backup items move to a soft-deleted state. | In a Recovery Services vault, for API version 2024-09-30-preview or later, backup items move to a soft-deleted state. In a Backup vault, for API version 2025-09-01 or later, backup items move to a soft-deleted state.<br><br>For earlier API versions, backup items are deleted immediately. |

# [General availability](#tab/general-availability)

| Client                                    | Soft delete enabled, always on, or disabled                |
|------------------------------------------------|---------------------------------------------------------|
| Azure portal, Azure PowerShell, Azure CLI, or REST API | Backup items go into a soft-deleted state for *all* module and API versions. |

---

### Delete Vault action

The following table outlines the behavior of the **Delete Vault** action across clients, based on the state of the soft-delete configuration:

# [Preview](#tab/preview)

| Client | Soft delete enabled, always on, or disabled |
|-------------|--------------------------------------------------|
| Azure portal | Soft delete of the vault is allowed when the vault is empty or it contains only soft-deleted backup items or containers. |
| Azure PowerShell | For Azure PowerShell module version 7.5.0 or later, soft delete of the Recovery Services vault is allowed when it's empty or it contains only soft-deleted backup items or containers. For earlier versions, vault deletion is allowed only when the vault is completely empty.<br><br>Backup vault actions are independent of the module version. |
| Azure CLI | For Azure CLI version 2.75.0 or later, soft delete of the Recovery Services vault is allowed when the vault is empty or it contains only soft-deleted backup items or containers. For earlier versions, vault deletion is allowed only when the vault is completely empty.<br><br>Backup vault actions are independent of the module version. |
| REST API | In a Recovery Services vault, for API version 2024-09-30-preview or later, soft delete of the vault is allowed when the vault is empty or it contains only soft-deleted backup items or containers. In a Backup vault, for API version 2025-09-01 or later, soft delete of the vault is allowed when the vault is empty or it contains only soft-deleted backup items or containers.<br><br>For earlier API versions, vault deletion is allowed only when the vault is completely empty. |

# [General availability](#tab/general-availability)

| Client                              | Soft delete enabled, always on, or disabled                |
|---------------------------------------|--------------------------------------------------------|
| Azure portal, Azure PowerShell, Azure CLI, or REST API | Soft delete of a vault is allowed when the vault is empty or it has only soft-deleted backup items or containers for *all* module and API versions. |

---

### Disable Soft Delete action

The following table describes the behavior of the **Disable Soft Delete** action across various clients and API versions:

# [Preview](#tab/preview)

| Client | Behavior |
|-------------|--------------|
| Azure portal | Not allowed. |
| Azure PowerShell | Not allowed for Azure PowerShell module version 7.5.0 or later in a Recovery Services vault. Allowed for earlier versions.<br><br>Backup vault actions are independent of the module version. |
| Azure CLI | Not allowed for Azure CLI version 2.75.0 or later in a Recovery Services vault. Allowed for earlier versions.<br><br>Backup vault actions are independent of the module version. |
| REST API | Not allowed for API version 2024-09-30-preview or later in a Recovery Services vault. Not allowed for API version 2025-09-01 or later in a Backup vault.<br><br>Allowed for earlier API versions. |

# [General availability](#tab/general-availability)

| Client                                    | Behavior                                                     |
|------------------------------------------------|------------------------------------------------------------------|
| Azure portal, Azure PowerShell, Azure CLI, or REST API | Disabling soft delete is *not allowed* for any module or API versions.   |

---

## Related content

- [Configure and manage soft delete in Azure Backup](backup-azure-enhanced-soft-delete-configure-manage.md)
