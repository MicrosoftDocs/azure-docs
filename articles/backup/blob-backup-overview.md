---
title: Overview of Azure Blobs backup
description: Learn about Azure Blobs backup.
ms.topic: conceptual
ms.date: 03/10/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Overview of Azure Blob backup

Azure Backup provides a simple, secure, cost-effective, and cloud-based backup solution to protect your business or application-critical data stored in Azure Blob.

This article gives you an understanding about configuring the following types of backups for your blobs:

- **Continuous backups**: You can configure operational backup, a managed local data protection solution, to protect your block blobs from accidental deletion or corruption. The data is stored locally within the source storage account  and not transferred to the backup vault. You don’t need to define any schedule for backups. All changes are retained, and you can restore them from the state at a selected point in time. 

- **Periodic backups (preview)**: You can configure vaulted backup, a managed offsite data protection solution, to get protection against any accidental or malicious deletion of blobs or storage account. The backup data using vaulted backups is copied and stored in the Backup vault as per the schedule and frequency you define via the backup policy and retained as per the retention configured in the policy.

You can choose to configure vaulted backups, operational backups, or both on your storage accounts using a single backup policy. The integration with [Backup center](backup-center-overview.md) enables you to govern, monitor, operate, and analyze backups at scale.

## How the operational backup works?

Operational backup uses blob platform capabilities to protect your data and allow recovery when required:

- **Point-in-time restore**: [Blob point-in-time restore](../storage/blobs/point-in-time-restore-overview.md) allows restoring blob data to an earlier state. This, in turn, uses **soft delete**, **change feed** and **blob versioning** to retain data for the specified duration. Operational backup takes care of enabling point-in-time restore as well as the underlying capabilities to ensure data is retained for the specified duration.

- **Delete lock**: Delete lock prevents the storage account from being deleted accidentally or by unauthorized users. Operational backup when configured also automatically applies a delete lock to reduce the possibilities of data loss because of storage account deletion.

For information about the limitations of the current solution, see the [support matrix](blob-backup-support-matrix.md).

## How the vaulted backup works?

Vaulted backup (preview) uses the platform capability of object replication to copy data to the Backup vault. Object replication asynchronously copies block blobs between a source storage account and a destination storage account. The contents of the blob, any versions associated with the blob, and the blob's metadata and properties are all copied from the source container to the destination container.

When you configure protection, Azure Backup allocates a destination storage account (Backup vault's storage account managed by Azure Backup) and enables object replication policy at container level on both destination and source storage account. When a backup job is triggered, the Azure Backup service creates a recovery point marker on the source storage account and polls the destination account for the recovery point marker replication. Once the replication point marker is present on the destination, a recovery point is created.

For information about the limitations of the current solution, see the [support matrix](blob-backup-support-matrix.md).

## Protection

### Protection using operational backup

Operational backup is configured and managed at the **storage account** level, and applies to all block blobs within the storage account. Operational backup uses a **backup policy** to manage the duration for which the backup data (including older versions and deleted blobs) is to be retained, in that way defining the period up to which you can restore your data from. The backup policy can have a maximum retention of 360 days, or equivalent number of complete weeks (51) or months (11).

When you configure backup for a storage account and assign a backup policy with a retention of ‘n’ days, the underlying properties are set as described below. You can view these properties in the **Data protection** tab of the blob service in your storage account.

- **Point-in-time restore**: Set to ‘n’ days, as defined in the backup policy. If the storage account already had point-in-time enabled with a retention of, say ‘x’ days, before configuring backup, the point-in-time restore duration will be set to the greater of the two values that is max(n,x). If you had already enabled point-in-time restore and specified the retention to be greater than that in the backup policy, it will remain unchanged.

- **Soft delete**: Set to ‘n+5’ days, that is, five days in addition to the duration specified in the backup policy. If the storage account that is being configured for operational backup already had soft delete enabled with a retention of, say ‘y’ days, then the soft delete retention will be set to the maximum of the two values, that is, maximum (n+5, y). If you had already enabled soft delete and specified the retention to be greater than that according to the backup policy, it will remain unchanged.

- **Versioning for blobs and blob change feed**: Versioning and change feed are enabled for storage accounts that have been configured for operational backup.

- **Delete Lock**: Configuring operational backup on a storage account also applies a Delete Lock on the storage account. The Delete Lock applied by Backup can be viewed under the **Locks** tab of the storage account.

To allow Backup to enable these properties on the storage accounts to be protected, the Backup vault must be granted the **Storage Account Backup Contributor** role on the respective storage accounts.

>[!NOTE]
>Operational backup supports operations on block blobs only and operations on containers can’t be restored. If you delete a container from the storage account by calling the **Delete Container** operation, that container can’t be restored with a restore operation. It’s suggested you enable soft delete to enhance data protection and recovery.

### Protection using vaulted backup (in preview)

Vaulted backup is configured at the storage account level. However, you can exclude containers that don't need backup. If your storage account has *>100* containers, you need to mandatorily exclude containers to reduce the count to *100* or below. For vaulted backups, the schedule and retention are managed via backup policy. You can set the frequency as *daily* or *weekly*, and specify when the backup recovery points need to be created. You can also configure different retention values for backups taken every day, week, month, or year. The retention rules are evaluated in a predetermined order of priority. The *yearly* rule has the priority compared to *monthly* and *weekly* rule. Default retention settings are applied if other rules don't qualify.

In storage accounts (for which vaulted backups are configured), the object replication rules get created under the *object replication* item on the *TOC* blade of the source storage account.

You can enable operational backup and vaulted backup (or both) of blobs on a storage account that is independent of each other using the same backup policy. The vaulted blob backup solution allows you to retain your data for up to *10 years*. Restoring data from older recovery points may lead to longer time taken (longer RTO) during the restore operation. You can currently use the vaulted backup solution to perform restores to a different storage account only. For restoring to the same account, you may use operational backups.

## Management

Once you have enabled backup on a storage account, a Backup Instance is created corresponding to the storage account in the Backup vault. You can perform any Backup-related operations for a storage account like initiating restores, monitoring, stopping protection, and so on, through its corresponding Backup Instance.

Both operational and vaulted backups integrate directly with Backup Center to help you manage the protection of all your storage accounts centrally, along with all other Backup supported workloads. Backup Center is your single pane of glass for all your Backup requirements like monitoring jobs and state of backups and restores, ensuring compliance and governance, analyzing backup usage, and performing operations pertaining to back up and restore of data.

## Restore

You can restore data from any point in time for which a recovery point exists. A recovery point is created when a storage account is in protected state, and can be used to restore data as long as it falls in the retention period defined by the backup policy (and so the point-in-time restore capability of the blob service in the storage account). Operational backup uses blob point-in-time restore to restore data from a recovery point.

Operational backup gives you the option to restore all block blobs in the storage account, browse and restore specific containers, or use prefix matches to restore a subset of blobs. All restores can be performed to the source storage account only.

## Pricing

### Operational backup

You won't incur any management charges or instance fee when using operational backup for blobs. However, you'll incur the following charges:

- Restores are done using blob point-in-time restore and attract charges based on the amount of data processed. For more information, see [point-in-time restore pricing](../storage/blobs/point-in-time-restore-overview.md#pricing-and-billing).

- Retention of data because of [Soft delete for blobs](../storage/blobs/soft-delete-blob-overview.md), [Change feed support in Azure Blob Storage](../storage/blobs/storage-blob-change-feed.md), and [Blob versioning](../storage/blobs/versioning-overview.md).

### Vaulted backup (preview)

You won't incur backup storage charges or instance fees during the preview. However, you'll incur the source side cost, [associated with Object replication](../storage/blobs/object-replication-overview.md#billing), on the backed-up source account.

## Next steps

- [Configure and manage Azure Blobs backup](blob-backup-configure-manage.md)
