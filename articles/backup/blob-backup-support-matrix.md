---
title: Support matrix for Azure Blobs backup
description: Provides a summary of support settings and limitations when backing up Azure Blobs.
ms.topic: reference
ms.date: 12/27/2024
ms.custom: references_regions, engagement-fy24
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Blobs backup

This article summarizes the regional availability, supported scenarios, and limitations of operational and vaulted backups of blobs.

## Supported regions

**Choose a backup type**

# [Operational backup](#tab/operational-backup)

Operational backup for blobs is available in all public cloud regions, except France South and South Africa West. It's also available in sovereign cloud regions - all Azure Government regions and China regions (except China East).

# [Vaulted backup](#tab/vaulted-backup)

Vaulted backup for blobs is available in all public regions.


---

## Limitations

**Choose a backup type**

# [Operational backup](#tab/operational-backup)

Operational backup of blobs uses blob point-in-time restore, blob versioning, soft delete for blobs, change feed for blobs and delete lock to provide a local backup solution. Hence, the limitations that apply to these capabilities also apply to operational backup.

**Supported scenarios**:

- Operational backup supports block blobs in standard general-purpose v2 storage accounts only. Storage accounts with hierarchical namespace enabled (that is, ADLS Gen2 accounts) aren't supported.   <br><br>   Also, any page blobs, append blobs, and premium blobs in your storage account won't be restored and only block blobs will be restored.

- Blob backup is also supported when the storage account has private endpoints.

**Other limitations**:

- If you've deleted a container during the retention period, that container won't be restored with the point-in-time restore operation. If you attempt to restore a range of blobs that includes blobs in a deleted container, the point-in-time restore operation will fail. For more information about protecting containers from deletion, see [Soft delete for containers](../storage/blobs/soft-delete-container-overview.md).
- If a blob has moved between the hot and cool tiers in the period between the present moment and the restore point, the blob is restored to its previous tier. Restoring block blobs in the archive tier isn't supported. For example, if a blob in the hot tier was moved to the archive tier two days ago, and a restore operation restores to a point three days ago, the blob isn't restored to the hot tier. To restore an archived blob, first move it out of the archive tier. For more information, see [Rehydrate blob data from the archive tier](../storage/blobs/archive-rehydrate-overview.md).
- A block that has been uploaded via [Put Block](/rest/api/storageservices/put-block) or [Put Block from URL](/rest/api/storageservices/put-block-from-url), but not committed via [`Put Block List`](/rest/api/storageservices/put-block-list), isn't part of a blob and so isn't restored as part of a restore operation.
- A blob with an active lease can't be restored. If a blob with an active lease is included in the range of blobs to restore, the restore operation will fail automatically. Break any active leases before starting the restore operation.
- Snapshots aren't created or deleted as part of a restore operation. Only the base blob is restored to its previous state.
- If there are [immutable blobs](../storage/blobs/immutable-storage-overview.md#about-immutable-storage-for-blobs) among those being restored, such immutable blobs won't be restored to their state as per the selected recovery point. However, other blobs that don't have immutability enabled will be restored to the selected recovery point as expected.


# [Vaulted backup](#tab/vaulted-backup)

- You can back up only block blobs in a *standard general-purpose v2 storage account* using the vaulted backup solution for blobs.
- HNS-enabled storage accounts are currently not supported. This includes *ADLS Gen2 accounts*, *accounts using NFS 3.0*, and *SFTP protocols* for blobs.
- You can back up storage accounts with *up to 100 containers*, there is no limit on the number of blobs within those containers. You can also select a subset of containers to back up (up to 100 containers).
  - If your storage account contains more than 100 containers, you need to select *up to 100 containers* to back up.
  - To back up any new containers that get created after backup configuration for the storage account, modify the protection of the storage account. These containers aren't backed up automatically.
- The storage accounts to be backed up must contain *a minimum of one container*. If the storage account doesn't contain any containers or if no containers are selected, an error may appear when you configure backup.
- Currently, you can perform only *one backup* per day (that includes scheduled and on-demand backups). Backup fails if you attempt to perform more than one backup operation a day.
- If you stop protection (vaulted backup) on a storage account, it doesn't delete the object replication policy created on the storage account. In these scenarios, you need to manually delete the *OR policies*.
- Cool and archived blobs are currently not supported.
- The backup operation isn't supported for blobs that are uploaded by using [Data Lake Storage APIs](/rest/api/storageservices/data-lake-storage-gen2).
- When you delete and recreate a storage account with the same name, **Object Replication** doesn't recognize the change. As a result, future Recovery Points continue to include the older blobs and their versions.
- Similarly, if you delete and recreate a container with the same name, **Object Replication** doesn't track the change, and future Recovery Points still include the previous blobs and versions.
- If you suspend and resume protection or delete the **Object Replication policy** on the **source storage account**, the policy triggers a full backup.
- Backup vaults with User-Assigned Managed Identity (UAMI) aren't compatible with Azure Blob Vaulted backups. Only System-Assigned Managed Identity (SAMI) works, because the vault needs to access the storage account where the blobs are stored. The vault uses its system-assigned managed identity for this access.

- Enabling backups isn't supported for the blob container that are configured with native replication using data factory.
- The protection of  a container that is part of any object replication isn't supported, either as a source or destination. Attempting to back up such a container will result in backup failure.
 

---

## Next steps

[Overview of Azure Blobs backup for Azure Blobs](blob-backup-overview.md)

