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
| **General availability** | East Asia, France South, Southeast US, Switzerland North, Switzerland West, UAE North, UK West, West India. |
| **Preview** | Australia East, Central India, Central US, East US, East US 2, Germany West Central, North Central US, North Europe, South India, Southeast Asia, West Central US, West US, West US 2, West US 3. |

## Supported storage accounts

The following table lists the supported storage account details:

| Storage  account details | Support |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Only block blobs in a standard general-purpose v2 HNS-enabled storage account. <br><br>*Accounts using Network File Shares (NFS) 3.0, and Secure File Transfer Protocol (SFTP) protocols for blobs are currently not supported*.|
| Redundancy              | Locally redundant storage (LRS), Zone-redundant storage (ZRS), Geo-redundant storage (GRS) enabled storage account. |
| Tier              | Hot, Cool, and Cold tier blobs are supported.<br><br>*Archive tier blob backup isn't supported*. |
| Upgraded storage accounts              | Accounts upgraded from Azure Blob Storage to Azure Data Lake Storage aren't supported*. |

## Protection limits

The following table lists the protection limits:

| **Setting** | **Limit**                                                      |
| ------------------------------------------------------------ | ----- |
| Maximum number of containers in a storage account that can be protected | 100 |
| Vault redundancy              | LRS/ZRS/GRS |

### Supported and unsupported scenarios for Azure Data Lake Storage protection

Azure Data Lake Storage protection has the following supported and unsupported scenarios:

- Any new containers that get created after backup configuration for the storage account aren't backed up automatically. To enable the backup operation for the new containers, modify the protection of the storage account. 
- The storage accounts to be backed up must contain a *minimum of one container*. If the storage account doesn't contain any containers or if no containers are selected, an error might appear when you configure backup.
- Object Replication fails to register changes when a storage account or container is deleted and recreated with the same name between two consecutive backups, causing recovery points to retain older blobs and versions.
- Blobs are excluded from recovery points if you rename any folder in their parent path when async copy in progress.
- The backup operation isn't supported for blobs created using async copy. 
- Backup vaults with User-Assigned Managed Identity (UAMI) aren't compatible with Azure Blob Vaulted backups. Only System-Assigned Managed Identity (SAMI) works, because the vault needs to access the storage account where the blobs are stored. The vault uses its system-assigned managed identity for this access.
- You can protect the storage account with the vault in another subscription but in the same region as storage account.
- Archive tier for vault is currently not supported.
- Azure Data Lake Storage accounts support both Blob and Data File System (DFS) APIs. The system captures operations through Change Feed and uses directory snapshots to ensure consistent recovery.
- Vaulted Backup doesn’t support cross-container data moves because backup policies are container-specific. If you move data between containers, the replication consistency breaks.
- When expiry is set on blobs via SetBlobExpiry API or PutBlob/PutBlock options. Once expired, expired blobs remain in restore points, creating inconsistencies in future restore points. Recommendation is to not use blob expiry.
- Storage accounts upgraded from FNS to HNS are not supported for backup.
- SFTP-enabled & NFS accounts are not supported for backup. Backup jobs may stall if SFTP-uploaded blobs encountered.
- $web container cannot be restored as $web on the target. Use the renameTo option and restore it with a different container name.
- $root container can be restored as $root on the target only if $root does not already exist there. If it already exists, use the renameTo option and restore it with a different container name.

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
