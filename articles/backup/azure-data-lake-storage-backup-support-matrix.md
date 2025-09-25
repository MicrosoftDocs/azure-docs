---
title: Support matrix for Azure Data Lake Storage Vaulted Backup (preview)
description: Learn about the  regional availability, supported scenarios, and limitations for vaulted backups of Azure Data Lake Storage (preview).
ms.topic: reference
ms.date: 08/26/2025
ms.custom:
  - references_regions
  - engagement-fy24
  - build-2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand the supported scenarios and limitations for vaulted backups of Azure Data Lake Storage, so that I can effectively configure and manage data protection for my storage accounts."
---

# Support matrix for Azure Data Lake Storage vaulted backup (preview)

This article summarizes the regional availability, supported scenarios, and limitations for vaulted backups of Azure Data Lake Storage (preview).

For more insights on Azure Backup’s support for vaulted backups in Azure Data Lake Storage (preview) that enables secure, long-term, and isolated data protection, see the [Microsoft Community Hub blog](https://azure.microsoft.com/updates?id=488835).

## Supported regions

Vaulted backups of Azure Data Lake Storage are available in the following regions: France South, India West, West Central US, East Asia, India Central, South East Asia.

>[!Note]
>- This feature is currently in limited preview and is available in specific regions only. See the [supported regions](azure-data-lake-storage-backup-support-matrix.md#supported-regions).
>- To enroll in this preview feature, fill [this form](https://forms.office.com/r/sixidTkYb4)  and write to [AskAzureBackupTeam@microsoft.com](mailto:AskAzureBackupTeam@microsoft.com).

## Supported storage accounts

The following table lists the supported storage account details:

| Storage  account details | Support |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Only block blobs in a standard general-purpose v2 HNS-enabled storage account. <br><br>*Accounts using Network File Shares (NFS) 3.0, and Secure File Transfer Protocol (SFTP) protocols for blobs are currently not supported*.|
| Redundancy              | Locally redundant storage (LRS), Zone-redundant storage (ZRS), Geo-redundant storage (GRS) enabled storage account. |
| Tier              | Hot, Cool, and Cold tier blobs are supported.<br><br>*Archive tier blob backup isn't supported*. |
| Upgraded storage accounts              | Accounts upgraded from Azure Blob Storage to Azure Data Lake Storage are not supported*. |

## Protection limits

The following table lists the protection limits:

| **Setting** | **Limit**                                                      |
| ------------------------------------------------------------ | ----- |
| Maximum number of containers in a storage account that can be protected | 100 |
| Vault redundancy              | LRS/ZRS/GRS |

### Supported and unsupported scenarios for Azure Data Lake Storage protection (preview)

Azure Data Lake Storage protection (preview) has the following supported and unsupported scenarios:

- Any new containers that get created after backup configuration for the storage account aren't backed up automatically. To enable the backup operation for the new containers, modify the protection of the storage account. 
- The storage accounts to be backed up must contain a *minimum of one container*. If the storage account doesn't contain any containers or if no containers are selected, an error might appear when you configure backup.
- Object Replication fails to register changes when a storage account or container is deleted and recreated with the same name between two consecutive backups, causing recovery points to retain older blobs and versions.
- Blobs are excluded from recovery points if you rename any folder in their parent path when async copy in progress.
- The backup operation isn't supported for blobs created using async copy. 
- Backup vaults with User-Assigned Managed Identity (UAMI) aren't compatible with Azure Blob Vaulted backups. Only System-Assigned Managed Identity (SAMI) works, because the vault needs to access the storage account where the blobs are stored. The vault uses its system-assigned managed identity for this access.
- You can protect the storage account with the vault in another subscription but in the same region as storage account.
- Archive tier for vault is currently not supported.
- Azure Data Lake Storage accounts support both Blob and Data File System (DFS) APIs. The system captures operations through Change Feed and uses directory snapshots to ensure consistent recovery.

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

- [Configure vaulted backup for Azure Data Lake Storage using Azure portal (preview)](azure-data-lake-storage-configure-backup.md).
- [Restore Azure Data Lake Storage using Azure portal (preview)](azure-data-lake-storage-restore.md).
