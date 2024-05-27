---
title: Support Matrix for Azure file share backup by using Azure Backup
description: Provides a summary of support settings and limitations when backing up Azure file shares.
ms.topic: conceptual
ms.date: 03/29/2024
ms.custom: references_regions, engagement-fy24
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
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

Vaulted backup for Azure Files (preview) is available in West Central US, Southeast Asia, UK South, East Asia, UK West, India Central.

---

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
| Account Kind | Azure Backup supports Azure file shares present in general-purpose v2, and file storage type storage accounts. |

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

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                      | Limit |
| -------------------------------------------- | ----- |
| Maximum  number of on-demand backups per day | 10   |
| Maximum  number of scheduled backups per day | 6    |

# [Vault-standard tier (preview)](#tab/vault-tier)

| Setting                                 | Limit     |
| --------------------------------------- | ------    |
| Maximum size of file share              | 8 TB      |
| Maximum number of files in a file share | 8 million |

---

## Restore limits

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                                      | Limit   |
| ------------------------------------------------------------ | ------- |
| Maximum number of restore per day                           | 20      |
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

## Next steps

* Learn how to [Back up Azure file shares](backup-afs.md)
* Learn how to [Restore Azure file shares](restore-afs.md)
* Learn how to [Manage Azure file share backups](manage-afs-backup.md)

