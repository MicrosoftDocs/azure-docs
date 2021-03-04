---
title: Overview of operational backup for Azure Blobs
description: Learn about operational backup for Azure Blobs (in preview).
ms.topic: conceptual
ms.date: 02/16/2021

---

# Overview of operational backup for Azure Blobs (in preview)

Operational backup for Blobs is a managed, local data protection solution that lets you protect your block blobs from various data loss scenarios like corruptions, blob deletions, and accidental storage account deletion. The data is stored locally within the source storage account itself and can be recovered to a selected point in time whenever needed. So it provides a simple, secure, and cost-effective means to protect your blobs.

Operational backup for Blobs integrates with [Backup Center](backup-center-overview.md), among other Backup management capabilities, to provide a single pane of glass that can help you govern, monitor, operate, and analyze backups at scale.

## How operational backup works

Operational backup of blobs is a **local backup** solution. So the backup data isn't transferred to the Backup vault, but is stored in the source storage account itself. However, the Backup vault still serves as the unit of managing backups. Also, this is a **continuous backup** solution, which means that you don’t need to schedule any backups and all changes will be retained and restorable from the state at a selected point in time.

Operational backup uses blob platform capabilities to protect your data and allow recovery when required:

- **Point-in-time restore**: [Blob point-in-time restore](https://docs.microsoft.com/azure/storage/blobs/point-in-time-restore-overview) allows restoring blob data to an earlier state. This, in turn, uses **soft delete**, **change feed** and **blob versioning** to retain data for the specified duration. Operational backup takes care of enabling point-in-time restore as well as the underlying capabilities to ensure data is retained for the specified duration.

- **Delete lock**: Delete lock prevents the storage account from being deleted accidentally or by unauthorized users. Operational backup when configured also automatically applies a delete lock to reduce the possibilities of data loss because of storage account deletion.

Refer to the [support matrix](blob-backup-support-matrix.md) to learn about the limitations of the current solution.

### Protection

Operational backup is configured and managed at the **storage account** level, and applies to all block blobs within the storage account. Operational backup uses a **backup policy** to manage the duration for which the backup data (including older versions and deleted blobs) is to be retained, in that way defining the period up to which you can restore your data from. The backup policy can have a maximum retention of 360 days, or equivalent number of complete weeks (51) or months (11).

When you configure backup for a storage account and assign a backup policy with a retention of ‘n’ days, the underlying properties are set as described below. You can view these properties in the **Data protection** tab of the blob service in your storage account.

- **Point-in-time restore**: Set to ‘n’ days, as defined in the backup policy. If the storage account already had point-in-time enabled with a retention of, say ‘x’ days, before configuring backup, the point-in-time restore duration will be set to the greater of the two values, that is max(n,x). If you had already enabled point-in-time restore and specified the retention to be greater than that in the backup policy, it will remain unchanged.

- **Soft delete**: Set to ‘n+5’ days, that is, five days in addition to the duration specified in the backup policy. If the storage account that is being configured for operational backup already had soft delete enabled with a retention of, say ‘y’ days, then the soft delete retention will be set to the maximum of the two values, that is, max(n+5,y). If you had already enabled soft delete and specified the retention to be greater than that according to the backup policy, it will remain unchanged.

- **Versioning for blobs and blob change feed**: Versioning and change feed are enabled for storage accounts that have been configured for operational backup.

- **Delete Lock**: Configuring operational backup on a storage account also applies a Delete Lock on the storage account. The Delete Lock applied by Backup can be viewed under the **Locks** tab of the storage account.

To allow Backup to enable these properties on the storage accounts to be protected, the Backup vault must be granted the **Storage Account Backup Contributor** role on the respective storage accounts.

>[!NOTE]
>Operational backup supports operations on block blobs only and operations on containers can’t be restored. If you delete a container from the storage account by calling the **Delete Container** operation, that container can’t be restored with a restore operation. It’s suggested you enable soft delete to enhance data protection and recovery.

### Management

Once you have enabled backup on a storage account, a Backup Instance is created corresponding to the storage account in the Backup vault. You can perform any Backup-related operations for a storage account like initiating restores, monitoring, stopping protection, and so on, through its corresponding Backup Instance.

Operational backup also integrates directly with Backup Center to help you manage the protection of all your storage accounts centrally, along with all other Backup supported workloads. Backup Center is your single pane of glass for all your Backup requirements like monitoring jobs and state of backups and restores, ensuring compliance and governance, analyzing backup usage, and performing operations pertaining to backup and restore of data.

### Restore

You can restore data from any point in time for which a recovery point exists. A recovery point is created when a storage account is in protected state, and can be used to restore data as long as it falls in the retention period defined by the backup policy (and so the point-in-time restore capability of the blob service in the storage account). Operational backup uses blob point-in-time restore to restore data from a recovery point.

Operational backup gives you the option to restore all block blobs in the storage account, browse and restore specific containers, or use prefix matches to restore a subset of blobs. All restores can be performed to the source storage account only.

## Pricing

You won't incur any management charges or instance fee when using operational backup for blobs. However, you will incur the following charges:

- Restores are done using blob point-in-time restore and attract charges based on the amount of data processed. For more information, see [point-in-time restore pricing](https://docs.microsoft.com/azure/storage/blobs/point-in-time-restore-overview#pricing-and-billing).

- Retention of data because of [Soft delete for blobs](https://docs.microsoft.com/azure/storage/blobs/soft-delete-blob-overview), [Change feed support in Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-change-feed), and [Blob versioning](https://docs.microsoft.com/azure/storage/blobs/versioning-overview).

## Next steps

- [Configure and manage Azure Blobs backup](blob-backup-configure-manage.md)
