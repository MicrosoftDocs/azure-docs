---
title: Support Matrix for Azure file share backup by using Azure Backup
description: Provides a summary of support settings and limitations when backing up Azure file shares.
ms.topic: reference
ms.date: 02/03/2025
ms.custom: references_regions, engagement-fy24
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for Azure file share backup

This article summarizes the supported settings and limitations when backing up Azure file shares by using Azure Backup.

You can use the [Azure Backup service](./backup-overview.md) to back up Azure file shares. This article summarizes support settings when you back up Azure file shares with Azure Backup.

> [!NOTE]
> Azure Backup currently doesn't support NFS shares.

## Supported regions

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

Azure file shares backup is available in all regions, **except** for Germany Central (Sovereign), Germany Northeast (Sovereign), China East, China North, France South, and US Gov Iowa.

# [Vault-standard tier (preview)](#tab/vault-tier)

Vaulted backup for Azure Files (preview) is available in the following regions: UK South, UK West, Southeast Asia, East Asia, West Central US, Central US, Central India, North Europe, Australia East, West US, East US, South India, France Central, Canada Central, North Central US, East US 2, Australia Southeast, Germany North, France South, West US 2, Brazil South, Japan West, Germany West Central, Canada East, Korea South, Jio India West, Korea Central, South Africa West, Japan East, Norway East, Switzerland West, Norway West, South Africa North, UAE North, West Europe, Sweden Central, Switzerland North.

Cross Region Restore is currently not supported in Sweden Central, UAE North, Jio India West.

Migration of  File shares protected with snapshot backup to vaulted backup is supported in the following regions: UK South, UK West, Southeast Asia, East Asia, West Central US, and India Central.

---

### Supported regions for Cross Subscription Backup (preview)

Cross Subscription Backup (CSB) for Azure File share (preview) is currently available in the following regions: East Asia, Southeast Asia, UK South, UK West, Central India.

## Supported storage accounts

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Storage  account details | Support                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Azure  Backup supports Azure file shares present in general-purpose v1, general-purpose v2, and file storage type storage accounts |
| Performance              | Azure  Backup supports file shares in both standard and Premium Storage accounts |
| Replication              | Azure  file shares in storage accounts with any replication type are  supported |
| Firewall enabled         | Azure file shares in storage accounts with Firewall rules that allow Microsoft Azure Services to access storage account are supported|

# [Vault-standard tier (preview)](#tab/vault-tier)

| Storage account details | Support |
| --- | --- |
| Account Kind | Azure Backup supports Azure file shares present in general-purpose v2, and file storage type storage accounts. <br><br> Storage accounts configured with private endpoints are supported. However, a private endpoint on the vault doesn't apply to Azure Files backup scenarios.  |

>[!Important]
>The source Storage Account must have the **Allow storage account key access** setting enabled for successful Azure Files backup and restore.


>[!Note]
>Storage accounts with restricted network access aren't supported.   

---

## Supported file shares

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| File  share type                                   | Support   |
| -------------------------------------------------- | --------- |
| Standard (with large file shares enabled)                                   | Supported |
| Large                                              | Supported |
| Premium                                            | Supported |
| File shares connected with Azure File Sync service | Supported |

# [Vault-standard tier (preview)](#tab/vault-tier)


| File share type                                    | Support |
| -------------------------------------------------- | ------  |
| Standard                                           | Supported  |
| Large                                              | Supported |
| Premium                                            | Supported |
| File shares connected with Azure File Sync service | Supported |


---

## Protection limits

| Setting                                                      | Limit |
| ------------------------------------------------------------ | ----- |
| Maximum  number of file shares that can be protected per vault per day| 200   |
| Maximum  number of storage accounts that can be registered per vault per day | 50    |
| Maximum  number of file shares that can be protected  per vault | 2000   |
| Maximum  number of storage accounts that can be registered per vault | 200   |

## Backup limits

| Setting                                                      | Limit |
| --- | --- |
| Maximum number of discoveries of containers that can be backed up to Recovery Services Vault per day  | 50 |
| Maximum number of inquiries for protectable items under the given container per day | 25 |
| Maximum number of Configure backup per day | 200 |
| Maximum number of on-demand backups per day | 10 |

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                      | Limit |
| -------------------------------------------- | ----- |
| Maximum  number of scheduled backups per day | 6    |

# [Vault-standard tier (preview)](#tab/vault-tier)

| Setting                                 | Limit     |
| --------------------------------------- | ------    |
| Maximum size of file share              | 8 TB      |
| Maximum number of files in a file share | 8 million |

>[!Note]
>If you have multiple backups scheduled per day, only the last scheduled backup of the day is transferred to the vault.

---

## Restore limits

| Setting | Limit |
| --- | --- |
| Maximum number of restore per day                           | 20      |

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                                      | Limit   |
| ------------------------------------------------------------ | ------- |
| Maximum size of a file (if the destination account is in a Vnet) | 1TB |
| Maximum  number of individual files or folders per restore, if ILR (Item level recovery)                         | 99      |
| Maximum  recommended restore size per restore for large file shares | 15  TiB |
| Maximum duration of a restore job                           | 15 days

# [Vault-standard tier (preview)](#tab/vault-tier)

| Setting | Limit |
| --- | --- |
| Maximum size of a file | 1 TB | 

>[!Note]
>Restore to file shares connected with Azure File sync service or with restricted network access isn't supported.	

---

## Retention limits

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                                      | Limit    |
| ------------------------------------------------------------ | -------- |
| Maximum total recovery points per  file share at any point in time | 200      |
| Maximum retention of recovery  point created by on-demand backup | 10 years |
| Maximum retention of daily recovery points (snapshots) per file share, if daily frequency | 200 days |
| Maximum retention of daily recovery points (snapshots) per file share, if hourly frequency | Floor (200/number of snapshots according to the schedule)-1 |
| Maximum retention of weekly recovery points (snapshots) per file share | 200 weeks |
| Maximum retention of monthly recovery points (snapshots) per file share | 120 months |
| Maximum retention of  yearly recovery points (snapshots) per file share | 10 years |

# [Vault-standard tier (preview)](#tab/vault-tier)


| Setting |                    Limit |
| --- | --- |
| Maximum retention of snapshot | 30 days |
| Maximum retention of recovery point created by on-demand backup | 99 years |
| Maximum retention of daily recovery points | 9999 days |
| Maximum retention of weekly recovery points | 5163 weeks |
| Maximum retention of monthly recovery points | 1188 months |
| Maximum retention of yearly recovery points | 99 years |

---

## Supported restore methods

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Restore method     | Details                                                      |
| ------------------ | ------------------------------------------------------------ |
| Full Share Restore | You can restore the complete file  share to the original or an alternate location |
| Item Level Restore | You can restore individual files and folders to the original or an alternate location |

# [Vault-standard tier (preview)](#tab/vault-tier)

| Restore method | Description |
| --- | --- |
| Full Share Restore | You can restore the complete file share to an alternate location

>[!Note]
>Original location restores (OLR) and file-level recovery aren't supported. You can perform restore to an empty folder with the **Overwrite** option only.

---

## Daylight savings

Azure Backup doesn't support automatic clock adjustment for daylight saving time for Azure VM backups. It doesn't shift the hour of the backup forward or backwards. To ensure the backup runs at the desired time, modify the backup policies manually as required.

## Support for customer-managed failover

This section describes how your backups and restores are affected after customer-managed failovers. 

The following table lists the behavior of backups due to customer-initiated failovers:

| Failover type | Backups | Restore | Enabling protection (re-protection) of failed over account in secondary region |
| --- | --- | --- | --- |
| Customer-managed planned failover | Supported | Supported | Not supported |
| Customer-managed unplanned failover | Not supported | Only cross-region restore from the vault is supported. | Not supported |


## Next steps

* Learn how to [Back up Azure file shares](backup-afs.md)
* Learn how to [Restore Azure file shares](restore-afs.md)
* Learn how to [Manage Azure file share backups](manage-afs-backup.md)

