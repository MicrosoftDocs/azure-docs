---
title: Secure by Default with Azure Backup (Preview)
description: Learn how to Secure by Default with Azure Backup (Preview).
ms.topic: overview
ms.date: 11/20/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24, ignite-2024
---

# Secure by Default with Azure Backup (Preview)

Secure by default with soft delete for Azure Backup enables you to recover your backup data even after it's deleted. This will help in scenarios where:

- You've accidentally deleted backup data and you need it back.

- Backup data is maliciously deleted by ransomware or bad actors.

*Soft delete* and *Enhanced Soft delete* are Generally available for Recovery Services vaults for a while; with enabling soft delete at vault level, we're now providing secure by default promise for all customers where all the backup data will be recoverable by default for 14 days. 

>[!Note]
>Secure by default and soft delete for vaults is currently in limited preview in the following region: East Asia.
>
>Since this is a preview feature, disabling soft delete is allowed from REST API, PS, CLI commands. A complete secure by default experience will be available from the GA of this feature.

## What's soft delete?

[Soft delete](backup-azure-security-feature-cloud.md) primarily delays permanent deletion of backup data and vaults (preview for vaults) and gives you an opportunity to recover data after deletion. This deleted data is retained for the specified soft delete retention period which is default set to 14 days and can be extended up to 180 days.

After deletion (while the data is in soft deleted state), if you need the deleted data, you can undelete. This returns the data to *stop protection with retain data* state. You can then use it to perform restore operations or you can resume backups for this instance.

The following diagram shows the flow of a backup item (or a backup instance) that gets deleted:

:::image type="content" source="./media/secure-by-default/backup-item-delete-flow.png" alt-text="Diagram showing the flow of a backup item (or a backup instance) that gets deleted." lightbox="./media/secure-by-default/backup-item-delete-flow.png":::

## What's secure by default?

The key benefits of secure by default with vault soft delete are:

- **Data recoverability**: Azure Backup promises to keep your data recoverable for up to 14 days by default at no extra cost. You need not take any action to configure secure by default state for your backup data.

- **Configurable soft delete retention**: You can specify the retention duration for deleted backup data, ranging from *14 to 180 days*. By default, the retention duration is set to 14 days for the vault, and you can extend it as required. You won't incur additional costs for *14 days*; however, you will be charged for the period beyond 14 days. [Learn more](backup-azure-enhanced-soft-delete-about.md#pricing).

    >[!Note]
    > - **Soft delete for vaults**: You can now move vaults with soft deleted items into a soft delete state. And also recover soft-deleted vaults by undeleting them. This feature is currently in preview for RSV vaults in limited regions.

- **Re-registration of soft deleted items**: You can now register the items in soft deleted state with another vault. However, you can't register the same item with two vaults for active backups.

- **Soft delete and reregistration of backup containers**: You can now unregister the backup containers (which you can soft delete) if you've deleted all backup items in the container. You can now register such soft deleted containers to other vaults. This is applicable for applicable workloads only, including SQL in Azure VM backup, SAP HANA in Azure VM backup and backup of on-premises servers. [Learn more](backup-azure-enhanced-soft-delete-about.md#soft-deleted-items-reregistration).

- **Soft delete across workloads**: Enhanced soft delete applies to all vaulted datasources alike and is supported for Recovery Services vaults and Backup vaults. Enhanced soft delete also applies to operational backups of disks and VM backup snapshots used for instant restores. However, unlike vaulted backups, these snapshots can be directly accessed and deleted before the soft delete period expires. Enhanced soft delete is currently not supported for operational backup for Blobs and Azure Files.

- **Soft delete of recovery points**: This feature allows you to recover data from recovery points that might have been deleted due to making changes in a backup policy or changing the backup policy associated with a backup item. Soft delete of recovery points isn't supported for log recovery points in SQL and SAP HANA workloads. [Learn more](manage-recovery-points.md#impact-of-expired-recovery-points-for-items-in-soft-deleted-state).

## Supported scenarios

- Secure by default and soft delete for vaults is currently supported for Recovery Services vaults and is in limited public preview. It's also supported for new and existing vaults.

- Secure by default is applicable to the following workload backups: Azure Virtual Machines, SQL in IaasVM, HANA in IaaSVM, Azure Files. It's currently not applicable for Hybrid workloads: Azure Backup Server, Azure Backup Agent, DPM.

## Soft delete for vaults

When a Recovery Services vault is deleted, it will also move into a soft deleted state. To soft delete a recovery services vault, you have to stop backup and soft delete all the backup items in the vault before deleting the vault.

## Soft delete retention

Soft delete retention is the retention period (in days) of a deleted item in soft deleted state. Once the soft delete retention period elapses (from the date of deletion), the item is permanently deleted, and you can't undelete. You can choose the soft delete retention period between *14 and 180 days*. Longer durations allow you to recover data from threats that can take time to identify (for example, Advanced Persistent Threats).

>[!Note]
> Soft delete retention for *14 days* involves no cost. However, [regular backup charges apply for additional retention days](backup-azure-enhanced-soft-delete-about.md#pricing).<br>
> By default, soft delete retention is set to 14 days, and you can change it any time. However, the *soft delete retention period* that is active at the time of the deletion governs retention of the item in soft deleted state.

## Soft deleted items re-registration

If a backup item/container is in soft deleted state, you can register it to a vault different from the original one where the soft deleted data belongs.

>[!Note]
> - You can't actively protect one item to two vaults simultaneously. So, if you start protecting a backup container using another vault, you can no longer re-protect the same backup container to the previous vault.<br>
> - Re-registration is currently not supported with Always on availability group (AAG) or SAP HANA System Replication (HSR) configuration.

## Soft delete of recovery points

Soft delete of recovery points helps you recover any recovery points that are accidentally or maliciously deleted for some operations that could lead to deletion of one or more recovery points. For example, modification of a backup policy associated with a backup item to reduce the backup retention or assigning a new policy to a backed-up item that has a lower retention can cause a loss of certain recovery points.

This feature helps to retain these recovery points for an additional duration, as per the soft delete retention specified for the vault (the impacted recovery points show up as soft deleted during this period). You can undelete the recovery points by increasing the retentions in the backup policy. You can also restore your data from soft deleted state, if you don't choose to undelete them.

>[!Note]
> - Soft delete of recovery points is not supported for log recovery points in SQL and SAP HANA workloads.<br>
> - This feature is currently available in selected Azure regions only. [Learn more](backup-azure-enhanced-soft-delete-about.md#supported-scenarios).

## Pricing

There's no retention cost for the default soft delete duration of *14 days* for vaulted backup, after which, it incurs regular backup charges. For soft delete retention >14 days, the default period applies to the *last 14 days* of the continuous retention configured in soft delete, and then backups are permanently deleted.

For example, you've deleted backups for one of the instances in the vault that has soft delete retention of 60 days. If you want to recover the soft deleted data after 52 days of deletion, the pricing is:

- Standard rates (similar rates apply when the instance is in *stop protection with retain data* state) are applicable for the first *46 days* (60 days of soft delete retention configured minus *14 days* of default soft delete retention).

- No charges for the last 6 days of soft delete retention.

However, the above billing rule doesn't apply for soft deleted operational backups of disks and VM backup snapshots, and the billing will continue as per the cost of the resource.

## Soft delete with multi-user authorization

You can also use multi-user authorization (MUA) to add an additional layer of protection against disabling soft delete. [Learn more](multi-user-authorization-concept.md).
 
>[!Note]
> MUA for soft delete is currently supported for Recovery Services vaults only.

## Next steps

- [Configure and manage enhanced soft delete for Azure Backup](backup-azure-enhanced-soft-delete-configure-manage.md).
