---
title: Overview of Enhanced Soft Delete for Azure Backup
description: This article gives an overview of enhanced soft delete for Azure Backup.
ms.topic: overview
ms.custom: references_regions
ms.date: 03/05/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a backup administrator, I want to implement enhanced soft delete for Azure Backup so that I can ensure additional protection and recovery options for deleted backup data against accidental or malicious deletions.
---

# Enhanced soft delete for Azure Backup

[Soft delete](backup-azure-security-feature-cloud.md) for Azure Backup enables the recovery of your backup data even after the data is deleted. This feature is useful when:

- You accidentally deleted backup data and you need it back.
- Ransomware or bad actors maliciously deleted backup data.

*Basic* soft delete is available for Recovery Services vaults. *Enhanced* soft delete provides more capabilities for data protection.

> [!NOTE]
> After you enable enhanced soft delete by changing the soft-delete state to **Enabled and always-on**, you can't disable it for that vault.

## What's basic soft delete?

Basic soft delete delays permanent deletion of backup data and gives you an opportunity to recover data after deletion. This deleted data is retained for a specified period (14 to 180 days).

If you need data after it's deleted (that is, while the data is in soft-deleted state), you can restore it. This action returns the data to a **Stop protection with retain data** state. You can then use the data to perform other restore operations, or you can resume backups for this instance.

The following diagram shows the flow of a backup item (or a backup instance) that's deleted.

:::image type="content" source="./media/backup-azure-enhanced-soft-delete/enhanced-soft-delete-for-azure-backup-flow-diagram-inline.png" alt-text="Diagram that shows the flow of a backup item or instance that's deleted from a vault where soft delete is enabled." lightbox="./media/backup-azure-enhanced-soft-delete/enhanced-soft-delete-for-azure-backup-flow-diagram-expanded.png":::

## What's enhanced soft delete?

The key benefits of enhanced soft delete are:

- **Always-on soft delete**: You can opt to set soft delete as always on. This action is irreversible. If you opt to do it, you can't disable the soft-delete settings for the vault.

- **Configurable soft-delete retention**: You can specify the retention duration for deleted backup data, with a range of 14 to 180 days. By default, the retention duration is set to 14 days (the setting for basic soft delete) for the vault. You can extend it as required. However, you're charged for any period beyond 14 days.

- **Re-registration of soft-deleted items**: You can register the items in a soft-deleted state to another vault. However, you can't register the same item to two vaults for active backups.

- **Soft delete and re-registration of backup containers**: You can unregister the backup containers (which you can soft delete) if you deleted all backup items in the container. You can register such soft-deleted containers to other vaults. This ability is supported for applicable workloads only, including backup of SQL Server on Azure Virtual Machines, SAP HANA on Azure Virtual Machines, and on-premises servers.

- **Soft delete across workloads**: Enhanced soft delete applies to all vaulted data sources. Enhanced soft delete also applies to operational backups of disks, blobs, Azure Files shares, and virtual machine (VM) backup snapshots used for instant restores. However, unlike vaulted backups, these snapshots can be directly accessed and deleted before the soft-delete period expires.

- **Soft delete of recovery points**: You can recover data from recovery points that you might have deleted as part of making changes in a backup policy or changing the backup policy associated with a backup item. Soft delete of recovery points isn't supported for log recovery points in SQL Server and SAP HANA workloads.

## Supported scenarios

- Enhanced soft delete is supported for Recovery Services vaults and Backup vaults. Also, it's supported for new and existing vaults.

- Enhanced soft delete applies to all vaulted workloads. However, for workloads at the operational tier, soft delete isn't completely applicable because you can delete the underlying storage account that's part of your own subscription. These workloads include operational backup of [Azure Files shares](azure-file-share-backup-overview.md?tabs=snapshot#architecture-for-azure-files-backup), [Azure blobs](blob-backup-overview.md?tabs=operational-backup#how-the-azure-blobs-backup-works), or [Azure disks](disk-backup-overview.md).

## Soft-delete states for vaults

| State | Description |
| --- | --- |
| **Disabled** | Deleted items aren't retained in the soft-deleted state. The items are permanently deleted. |
| **Enabled** | This is the default state for a new vault. <br><br> Deleted items are retained for the specified soft-delete retention period. They're permanently deleted after the retention period expires. <br><br> Disabling soft delete immediately removes deleted data. |
| **Enabled and always-on** | Deleted items are retained for the specified soft-delete retention period. They're permanently deleted after the retention period expires. <br><br> After you opt for this state, you can't disable soft delete. |

## Soft-delete retention

Soft-delete retention is the retention period (in days) of a deleted item in a soft-deleted state. After the retention period elapses (from the date of deletion), the item is permanently deleted, and you can't restore it.

You can choose a soft-delete retention period of 14 to 180 days. Longer durations can help you recover data from threats that might take time to identify (for example, advanced persistent threats).

By default, soft-delete retention is set to 14 days. You can change it at any time. However, the soft-delete retention period that's active at the time of the deletion governs retention of the item in soft-deleted state.

Soft-delete retention for 14 days involves no cost. Regular backup charges apply for additional retention days.

## Re-registration of soft-deleted items

If a backup item or container is in soft-deleted state, you can register it to a vault that's different from the original one where the soft-deleted data belongs.

You can't actively protect one item in two vaults simultaneously. If you start protecting a backup container by using another vault, you can no longer protect the same backup container in the previous vault.

Re-registration is currently not supported with SQL Server Always On availability groups or SAP HANA System Replication configuration.

## Soft delete of recovery points

Soft delete of recovery points helps you restore any recovery points that are accidentally or maliciously deleted for some operations that could lead to deletion of one or more recovery points. For example, these activities can cause a loss of certain recovery points:

- Modification of a backup policy associated with a backup item to reduce the backup retention
- Assigning a new policy to a backed-up item that has a lower retention

This feature helps to retain these recovery points for an additional duration, in accordance with the soft-delete retention that you specified for the vault. The affected recovery points show up as soft deleted during this period.

You can restore the recovery points by increasing the retentions in the backup policy. You can also restore your data from soft-deleted state, if you don't choose to restore the recovery points.

Soft delete of recovery points is not supported for log recovery points in SQL Server and SAP HANA workloads. This feature is currently available in selected Azure regions only.

## Pricing

There's no retention cost for the default soft-delete duration of 14 days for vaulted backups. After that, soft delete incurs regular backup charges. For soft-delete retention of more than 14 days, the default period applies to the last 14 days of the continuous retention configured in soft delete, and then backups are permanently deleted.

For example, assume that you deleted backups for one of the instances in a vault that has a soft-delete retention of 60 days. If you want to recover the soft-deleted data after 52 days of deletion:

- Standard rates apply for the first 46 days (60 days of configured soft-delete retention, minus 14 days of default soft-delete retention). Similar rates apply when the instance is in a **Stop protection with retain data** state.

- There are no charges for the last 6 days of soft-delete retention.

However, the preceding billing rule doesn't apply for soft-deleted operational backups of disks and VM backup snapshots. The billing continues according to the cost of the resource.

## Soft delete with multiuser authorization

You can use multiuser authorization (MUA) to add a layer of protection against disabling soft delete. [Learn more](multi-user-authorization-concept.md).

MUA for soft delete is currently supported for Recovery Services vaults only.

## Related content

- [Configure and manage soft delete in Azure Backup](backup-azure-enhanced-soft-delete-configure-manage.md)
