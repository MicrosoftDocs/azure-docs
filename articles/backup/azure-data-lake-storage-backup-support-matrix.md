---
title: Support matrix for Azure Data Lake Storage Vaulted Backup
description: Learn about the  regional availability, supported scenarios, and limitations for vaulted backups of Azure Data Lake Storage.
ms.topic: reference
ms.date: 11/18/2025
ms.custom:
  - references_regions
  - engagement-fy24
  - build-2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand the supported scenarios and limitations for backups of Azure Data Lake Storage, so that I can effectively configure and manage data protection for my storage accounts."
---

# Support matrix for Azure Data Lake Storage vaulted backup

This article summarizes the regional availability, supported scenarios, and limitations for vaulted backups of Azure Data Lake Storage.
Azure Backup now enables enhanced protection and recovery for Azure Data Lake Storage through vaulted backups that offer ransomware resilience, secure offsite storage, and long-term data retention. See the [Microsoft Community Hub blog](https://techcommunity.microsoft.com/blog/azurestorageblog/protect-azure-data-lake-storage-with-vaulted-backups/4410707).

For more insights on Azure Backup’s support for backups in Azure Data Lake Storage that enables secure, long-term, and isolated data protection, see the [Microsoft Community Hub blog](https://azure.microsoft.com/updates?id=488835).

## Supported regions

Vaulted backups of Azure Data Lake Storage are available in the following regions: 

| Availability type | Region |
| --- | --- |
| **General availability** |  Australia East, Central US, East Asia, France South, Germany West Central, Southeast US, Switzerland North, Switzerland West, UAE North, UK West, West India, Central India, North Central US, South India, UK South, West Central US, West US 3, West Europe, North Europe, West US, West US 2, East US, East US 2, Southeast Asia. |

## Supported storage accounts

The following table lists the supported storage account details:

| Storage  account details | Support |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Only block blobs in a standard general-purpose v2 HNS-enabled storage account. <br><br>*Accounts using Network File Shares (NFS) 3.0, and Secure File Transfer Protocol (SFTP) protocols for blobs are currently not supported*.|
| Redundancy              | Locally redundant storage (LRS), Zone-redundant storage (ZRS), Geo-redundant storage (GRS) enabled storage account. |
| Tier              | Hot, Cool, and Cold tier blobs are supported.<br><br>*Backup for the Archive tier blob in Azure Data Lake storage account isn't supported*. |
| Upgraded storage accounts              | Accounts upgraded from Azure Blob Storage to Azure Data Lake Storage aren't supported*. |

## Protection limits

The following table lists the protection limits:

| **Setting** | **Limit**                                                      |
| ------------------------------------------------------------ | ----- |
| Maximum number of containers in a storage account that can be protected | 100 |
| Vault redundancy              | LRS/ZRS/GRS |

### Supported scenarios for Azure Data Lake Storage protection

Azure Data Lake Storage protection has the following supported scenarios:

- Backup vaults with System-Assigned Managed Identity (SAMI) works for backup, because the vault needs to access the storage account where the blobs are stored. The vault uses its system-assigned managed identity for this access.
- You can protect the storage account with the vault in another subscription but in the same region as storage account.
- Azure Data Lake Storage accounts support both Blob and Data File System (DFS) APIs.
- `$web` container can't be restored as `$web` on the target. Use the **renameTo** option and restore it with a different container name.

### Unsupported scenarios and considerations for Azure Data Lake Storage protection

Azure Data Lake Storage protection has the following unsupported scenarios:

- Any new containers that get created after backup configuration for the storage account aren't backed up automatically. To enable the backup operation for the new containers, modify the protection of the storage account. 
- The storage accounts to be backed up must contain a *minimum of one container*. If the storage account doesn't contain any containers or if no containers are selected, an error might appear when you configure backup.
- Backup vaults with User-Assigned Managed Identity (UAMI) aren't compatible with Azure Blob Vaulted backups.
- When an Azure Data Lake Storage account or container in it is deleted and recreated with the same name between two consecutive backups, then recovery points retain older blobs and versions.
- Archive tier for the backup data in a vault is currently not supported.
- Storage accounts upgraded from FNS to HNS are not supported for backup.
- SFTP- and NFS-enabled accounts aren’t supported for Vaulted Backup. Backup jobs on these accounts fail or hang when processing blobs uploaded via SFTP.
- Vaulted Backup doesn’t support cross-container data moves because backup policies are container-specific. If you move data between containers, the replication consistency breaks.
- When blob in Data Lake Storage accounts have expiry configured—either during creation using PutBlob or PutBlockList, or later via the SetBlobExpiry API — the following behaviors apply for Azure Data Lake storage account with Vaulted Backup enabled:
  - Existing Blobs with Expiry Date: These blobs will continue to exhibit the current behavior: once expired, they remain in existing restore points, which can lead to inconsistencies in future restore points.
  - Future Expiry Settings: Any attempt to set expiry using SetBlobExpiry will fail for storage accounts configured with Vaulted Backup. This restriction ensures restore point integrity going forward.
- When Vaulted Backup is enabled:
  - Soft Delete: Blobs in Azure Data Lake storage account can still be soft-deleted as expected.
  - Undelete: Restore for blobs in Azure Data Lake storage account from soft-deleted state is not supported while Vaulted Backup is active. Undelete will only work if Vaulted Backup is disabled first. Re-enabling Vaulted Backup after disabling will trigger a full backup.
  
## Backup limits

The following table lists the Backup limits:

| **Setting** | **Limit**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Maximum number of on-demand backups per day             | 4|
| Maximum number of scheduled backups per day             | 1|

>[!Note]
>If you suspend and resume protection or delete the **Object Replication policy** on the **source storage account**, the policy triggers a full backup.

## Retention limits

The following table lists the Retention limits:

| **Setting** | **Limit**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Maximum retention of daily recovery points             | 3,650 days|
| Maximum retention of weekly recovery points             | 521 weeks|
| Maximum retention of monthly recovery points             | 120 months|
| Maximum retention of yearly recovery points             | 10 years|

## Restore method limits

The following table lists the restore method limits:

| **Setting** | **Limit**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Full restore             | You can restore the complete storage account to an alternate location.|
| Containers restore       | You can select one or more containers or use prefix to filter specific containers to restore.|

>[!Note]
>- Cool and Cold tier blobs are restored in Hot tier.
>- Restore to the source storage account is not supported. 
>- The target storage selected for restore should not have any container with same name.

## Next steps

- [Configure vaulted backup for Azure Data Lake Storage using Azure portal, PowerShell, or Azure CLI](azure-data-lake-storage-configure-backup.md).
- [Restore Azure Data Lake Storage using Azure portal](azure-data-lake-storage-restore.md).
- [Manage vaulted backup for Azure Data Lake Storage using Azure portal](azure-data-lake-storage-backup-manage.md).

## Related content

[Access tiers for blob data](/azure/storage/blobs/access-tiers-overview).
