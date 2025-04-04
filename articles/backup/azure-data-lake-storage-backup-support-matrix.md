---
title: Support matrix for Azure Data Lake Storage Gen2 backup
description: Provides a summary of support settings and limitations when backing up Azure Data Lake Storage Gen2 files.
ms.topic: reference
ms.date: 04/03/2025
ms.custom: references_regions, engagement-fy24
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for Azure Data Lake Storage Gen2 backup

This article summarizes the regional availability, supported scenarios, and limitations of vaulted backups of Azure Data Lake Storage Gen2.

## Supported regions

Vaulted backups of Azure Data Lake Storage Gen2 is available in the following regions: France South, India Central, India West, East Asia, and Southeast Asia.

## Supported storage accounts

The following table lists the supported storage account details:

| **Storage  account details** | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Support**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | <ul><li>Only block blobs in a *standard general-purpose v2 HNS-enabled storage accounts*.<br><li>*Accounts using NFS 3.0, and SFTP protocols* for blobs are currently not supported.</ul>|
| Redundancy              | <ul><li>Only LRS & ZRS enabled storage account.</ul> |
| Tier              | <ul><li>Hot, Cool, and Cold tier blobs are supported.<br><li>Archive tier blob backup isn't supported.</ul> |

## Protection limits

The following table lists the protection setting limits:

| **Setting** | **Limit**                                                      |
| ------------------------------------------------------------ | ----- |
| Maximum number of containers in a storage account that can be protected | 100 |
| Vault redundancy              | LRS/ZRS|


- To back up any new containers that get created after backup configuration for the storage account, modify the protection of the storage account. These containers aren't backed up automatically.
- The storage accounts to be backed up must contain a *minimum of one container*. If the storage account doesn't contain any containers or if no containers are selected, an error may appear when you configure backup.
- The backup operation isn't supported for blobs that are uploaded by using [Data Lake Storage APIs](https://learn.microsoft.com/rest/api/storageservices/data-lake-storage-gen2). 
- Similarly, if you delete and recreate a container with the same name, **Object Replication** doesn't track the change, and future Recovery Points still include the previous blobs and versions.
- Backup vaults with User-Assigned Managed Identity (UAMI) aren't compatible with Azure Blob Vaulted backups. Only System-Assigned Managed Identity (SAMI) works, because the vault needs to access the storage account where the blobs are stored. The vault uses its system-assigned managed identity for this access.
- Enabling backups isn't supported for the blob container that are configured with native replication using data factory.
- You can protect the storage account with the vault in another subscription but in the same region as storage account.
- Archive tier for vault is currently not supported.


## Backup limits

The following table lists the Backup setting limits:

| **Setting** | **Limit**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Maximum number of on-demand backups per day             | 4|
| Maximum number of scheduled backups per day             | 1|

- If you suspend and resume protection or delete the **Object Replication policy** on the **source storage account**, the policy triggers a full backup.

## Retention limits

The following table lists the Retention setting limits:

| **Setting** | **Limit**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Maximum retention of daily recovery points             | 3650 days|
| Maximum retention of weekly recovery points             | 521 weeks|
| Maximum retention of monthly recovery points             | 120 months|
| Maximum retention of yearly recovery points             | 10 years|

## Supported restore methods

The following table lists the Retention setting limits:

| **Setting** | **Limit**                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Full restore             | You can restore the complete storage account to an alternate location.|
| Containers restore       | You can select one or more containers or use prefix to filter specific containers to restore.|

- Cool and Cold tier blobs are restored in Hot tier.
- Restore to the source storage account is not supported. 
- The target storage selected for restore should not have any container with same name.

