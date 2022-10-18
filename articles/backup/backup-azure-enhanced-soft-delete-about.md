---
title: Overview of enhanced soft delete for Azure Backup (preview)
description: This article gives an overview of enhanced soft delete for Azure Backup.
ms.topic: conceptual
ms.custom: references_regions
ms.date: 10/13/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# About Enhanced soft delete for Azure Backup (preview)

[Soft delete](backup-azure-security-feature-cloud.md) for Azure Backup enables you to recover your backup data even after it's deleted. This is useful when:

- You've accidentally deleted backup data and you need it back.
- Backup data is maliciously deleted by ransomware or bad actors.

*Basic soft delete* is available for Recovery Services vaults for a while; *enhanced soft delete* now provides additional data protection capabilities.

In this article, you'll learn about:

>[!div class="checklist"]
>- What's soft delete?
>- What's enhanced soft delete?
>- Supported regions
>- Supported scenarios
>- States of soft delete setting
>- Soft delete retention
>- Soft deleted items reregistration
>- Pricing

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
  >The soft delete doesn't cost you for first 14 days of retention; however, you're charged for the period beyond 14 days. [Learn more](#states-of-soft-delete-settings).
- **Re-registration of soft deleted items**: You can now register the items in soft deleted state with another vault. However, you can't register the same item with two vaults for active backups. 
- **Soft delete and reregistration of backup containers**: You can now unregister the backup containers (which you can soft delete) if you've deleted all backup items in the container. You can now register such soft deleted containers to other vaults. This is applicable for applicable workloads only, including SQL in Azure VM backup, SAP HANA in Azure VM backup and backup of on-premises servers.
- **Soft delete across workloads**: Enhanced soft delete applies to all vaulted workloads alike and is supported for Recovery Services vaults and Backup vaults. However, it currently doesn't support operational tier workloads, such as Azure Files backup, Operational backup for Blobs, Disk and VM snapshot backups.

## Supported regions

Enhanced soft delete is currently available in the following regions: West Central US, Australia East, and North Europe.

## Supported scenarios

- Enhanced soft delete is supported for Recovery Services vaults and Backup vaults. Also, it's supported for new and existing vaults.
- All existing Recovery Services vaults in the preview regions are upgraded with an option to use enhanced soft delete.

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
>You can't actively protect one item to two vaults simultaneously. So, if you start protecting a backup container using another vault, you can no longer re-protect the same backup container to the previous vault.

## Pricing

There is no retention cost for the default duration of *14* days, after which, it incurs regular backup charges. For soft delete retention *>14* days, the default period applies to the *last 14 days* of the continuous retention configured in soft delete, and then backups are permanently deleted.

For example, you've deleted backups for one of the instances in the vault that has soft delete retention of *60* days. If you want to recover the soft deleted data after *52* days of deletion, the pricing is:

- Standard rates (similar rates apply when the instance is in *stop protection with retain data* state) are applicable for the first *46* days (*60* days of soft delete retention configured minus *14* days of default soft delete retention).

- No charges for the last *6* days of soft delete retention.

## Next steps

[Configure and manage enhanced soft delete for Azure Backup (preview)](backup-azure-enhanced-soft-delete-configure-manage.md).