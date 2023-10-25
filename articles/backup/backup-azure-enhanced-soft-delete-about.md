---
title: Overview of enhanced soft delete for Azure Backup
description: This article gives an overview of enhanced soft delete for Azure Backup.
ms.topic: conceptual
ms.custom: references_regions
ms.date: 09/11/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About enhanced soft delete for Azure Backup

[Soft delete](backup-azure-security-feature-cloud.md) for Azure Backup enables you to recover your backup data even after it's deleted. This is useful when:

- You've accidentally deleted backup data and you need it back.
- Backup data is maliciously deleted by ransomware or bad actors.

*Basic soft delete* is available for Recovery Services vaults for a while; *enhanced soft delete* now provides additional data protection capabilities.

>[!Note]
>Once you enable enhanced soft delete by enabling soft delete state to *always-on*, you can't disable it for that vault.

## What's soft delete?

[Soft delete](backup-azure-security-feature-cloud.md) primarily delays permanent deletion of backup data and gives you an opportunity to recover data after deletion. This deleted data is retained for a specified duration (*14*-*180* days) called soft delete retention period.

After deletion (while the data is in soft deleted state), if you need the deleted data, you can undelete. This returns the data to *stop protection with retain data* state. You can then use it to perform restore operations or you can resume backups for this instance.

The following diagram shows the flow of a backup item (or a backup instance) that gets deleted:

:::image type="content" source="./media/backup-azure-enhanced-soft-delete/enhanced-soft-delete-for-azure-backup-flow-diagram-inline.png" alt-text="Diagram showing the flow of backup items or instance that gets deleted from a vault with soft delete enabled." lightbox="./media/backup-azure-enhanced-soft-delete/enhanced-soft-delete-for-azure-backup-flow-diagram-expanded.png":::

## What's enhanced soft delete?

The key benefits of enhanced soft delete are:

- **Always-on soft delete**: You can now opt to set soft delete always-on (irreversible). Once opted, you can't disable the soft delete settings for the vault. [Learn more](#states-of-soft-delete-settings).
- **Configurable soft delete retention**: You can now specify the retention duration for deleted backup data, ranging from *14* to *180* days. By default, the retention duration is set to *14* days (as per basic soft delete) for the vault, and you can extend it as required.

  >[!Note]
  >The soft delete doesn't cost you for 14 days of retention; however, you're charged for the period beyond 14 days. [Learn more](#pricing).
- **Re-registration of soft deleted items**: You can now register the items in soft deleted state with another vault. However, you can't register the same item with two vaults for active backups. 
- **Soft delete and reregistration of backup containers**: You can now unregister the backup containers (which you can soft delete) if you've deleted all backup items in the container. You can now register such soft deleted containers to other vaults. This is applicable for applicable workloads only, including SQL in Azure VM backup, SAP HANA in Azure VM backup and backup of on-premises servers. [Learn more](#soft-deleted-items-reregistration).
- **Soft delete across workloads**: Enhanced soft delete applies to all vaulted datasources alike and is supported for Recovery Services vaults and Backup vaults. Enhanced soft delete also applies to operational backups of disks and VM backup snapshots used for instant restores. However, unlike vaulted backups, these snapshots can be directly accessed and deleted before the soft delete period expires. Enhanced soft delete is currently not supported for operational backup for Blobs and Azure Files.
- **Soft delete of recovery points**: This feature allows you to recover data from recovery points that might have been deleted due to making changes in a backup policy or changing the backup policy associated with a backup item. Soft delete of recovery points isn't supported for log recovery points in SQL and SAP HANA workloads. [Learn more](manage-recovery-points.md#impact-of-expired-recovery-points-for-items-in-soft-deleted-state).

## Supported scenarios

- Enhanced soft delete is supported for Recovery Services vaults and Backup vaults. Also, it's supported for new and existing vaults.
- Enhanced soft delete applies to all vaulted workloads alike and is supported for Recovery Services vaults and Backup vaults. However, it currently doesn't support operational tier workloads, such as Azure Files backup, Operational backup for Blobs, Disk and VM snapshot backups.

## States of soft delete settings

The following table lists the soft delete properties for vaults:

| State | Description |
| --- | --- |
| **Disabled** | Deleted items aren't retained in the soft deleted state, and are permanently deleted. |
| **Enabled** | This is the default state for a new vault. <br><br> Deleted items are retained for the specified soft delete retention period, and are permanently deleted after the expiry of the soft delete retention duration. <br><br> Disabling soft delete immediate purges deleted data. |
| **Enabled and always-on** | Deleted items are retained for the specified soft delete retention period, and are permanently deleted after the expiry of the soft delete retention duration. <br><br> Once you opt for this state, soft delete can't be disabled. |

## Soft delete retention

Soft delete retention is the retention period (in days) of a deleted item in soft deleted state. Once the soft delete retention period elapses (from the date of deletion), the item is permanently deleted, and you can't undelete. You can choose the soft delete retention period between *14* and *180* days. Longer durations allow you to recover data from threats that may take time to identify (for example, Advanced Persistent Threats).

>[!Note]
>Soft delete retention for *14* days involves no cost. However, [regular backup charges apply for additional retention days](#pricing).
>
>By default, soft delete retention is set to *14* days and you can change it any time. However, the *soft delete retention period* that is active at the time of the deletion governs retention of the item in soft deleted state.

## Soft deleted items reregistration

If a backup item/container is in soft deleted state, you can register it to a vault different from the original one where the soft deleted data belongs.

>[!Note]
>- You can't actively protect one item to two vaults simultaneously. So, if you start protecting a backup container using another vault, you can no longer re-protect the same backup container to the previous vault.
>- Reregistration is currently not supported with Always on availability group (AAG) or SAP HANA System Replication (HSR) configuration.

## Soft delete of recovery points

Soft delete of recovery points helps you recover any recovery points that are accidentally or maliciously deleted for some operations that could lead to deletion of one or more recovery points. For example, modification of a backup policy associated with a backup item to reduce the backup retention or assigning a new policy to a backed-up item that has a lower retention can cause a loss of certain recovery points.

This feature helps to retain these recovery points for an additional duration, as per the soft delete retention specified for the vault (the impacted recovery points show up as soft deleted during this period). You can undelete the recovery points by increasing the retentions in the backup policy. You can also restore your data from soft deleted state, if you don't choose to undelete them.

>[!Note]
>- Soft delete of recovery points is not supported for log recovery points in SQL and SAP HANA workloads.
>- This feature is currently available in selected Azure regions only. [Learn more](#supported-scenarios).

## Pricing

There is no retention cost for the default soft delete duration of *14* days for vaulted backup, after which, it incurs regular backup charges. For soft delete retention *>14* days, the default period applies to the *last 14 days* of the continuous retention configured in soft delete, and then backups are permanently deleted.

For example, you've deleted backups for one of the instances in the vault that has soft delete retention of *60* days. If you want to recover the soft deleted data after *52* days of deletion, the pricing is:

- Standard rates (similar rates apply when the instance is in *stop protection with retain data* state) are applicable for the first *46* days (*60* days of soft delete retention configured minus *14* days of default soft delete retention).

- No charges for the last *6* days of soft delete retention.

However, the above billing rule doesn't apply for soft deleted operational backups of disks and VM backup snapshots, and the billing will continue as per the cost of the resource. 

## Soft delete with multi-user authorization

You can also use multi-user authorization (MUA) to add an additional layer of protection against disabling soft delete. [Learn more](multi-user-authorization-concept.md).

>[!Note]
>MUA for soft delete is currently supported for Recovery Services vaults only.

## Next steps

[Configure and manage enhanced soft delete for Azure Backup](backup-azure-enhanced-soft-delete-configure-manage.md).