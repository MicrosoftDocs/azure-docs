---
title: Support Matrix for Azure file share backup
description: Provides a summary of support settings and limitations when backing up Azure file shares.
ms.topic: conceptual
ms.date: 10/14/2022
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure file share backup

You can use the [Azure Backup service](./backup-overview.md) to back up Azure file shares. This article summarizes support settings when you back up Azure file shares with Azure Backup.

> [!NOTE]
> Azure Backup currently doesn't support NFS shares.

## Supported regions

Azure file shares backup is available in all regions, **except** for Germany Central (Sovereign), Germany Northeast (Sovereign), China East, China North, France South, and US Gov Iowa.

## Supported storage accounts

| Storage  account details | Support                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Azure  Backup supports Azure file shares present in general-purpose v1, general-purpose v2, and file storage type storage accounts |
| Performance              | Azure  Backup supports file shares in both standard and Premium Storage accounts |
| Replication              | Azure  file shares in storage accounts with any replication type are  supported |
| Firewall enabled         | Azure file shares in storage accounts with Firewall rules that allow Microsoft Azure Services to access storage account are supported|

## Supported file shares

| File  share type                                   | Support   |
| -------------------------------------------------- | --------- |
| Standard                                           | Supported |
| Large                                              | Supported |
| Premium                                            | Supported |
| File shares connected with Azure File Sync service | Supported |

## Protection limits

| Setting                                                      | Limit |
| ------------------------------------------------------------ | ----- |
| Maximum  number of file shares that can be protected per vault per day| 200   |
| Maximum  number of storage accounts that can be registered per vault per day | 50    |
| Maximum  number of file shares that can be protected  per vault | 2000   |
| Maximum  number of storage accounts that can be registered per vault | 200   |

## Backup limits

| Setting                                      | Limit |
| -------------------------------------------- | ----- |
| Maximum  number of on-demand backups per day | 10   |
| Maximum  number of scheduled backups per day | 6    |

## Restore limits

| Setting                                                      | Limit   |
| ------------------------------------------------------------ | ------- |
| Maximum number of restore per day                           | 10      |
| Maximum  number of individual files or folders per restore, if ILR (Item level recovery)                         | 99      |
| Maximum  recommended restore size per restore for large file shares | 15  TiB |
| Maximum duration of a restore job                           | 15 days

## Retention limits

| Setting                                                      | Limit    |
| ------------------------------------------------------------ | -------- |
| Maximum total recovery points per  file share at any point in time | 200      |
| Maximum retention of recovery  point created by on-demand backup | 10 years |
| Maximum retention of daily recovery points (snapshots) per file share, if daily frequency | 200 days |
| Maximum retention of daily recovery points (snapshots) per file share, if hourly frequency | Floor (200/number of snapshots according to the schedule)-1 |
| Maximum retention of weekly recovery points (snapshots) per file share | 200 weeks |
| Maximum retention of monthly recovery points (snapshots) per file share | 120 months |
| Maximum retention of  yearly recovery points (snapshots) per file share | 10 years |

## Supported restore methods

| Restore method     | Details                                                      |
| ------------------ | ------------------------------------------------------------ |
| Full Share Restore | You can restore the complete file  share to the original or an alternate location |
| Item Level Restore | You can restore individual files and folders to the original or an alternate location |

## Next steps

* Learn how to [Back up Azure file shares](backup-afs.md)
* Learn how to [Restore Azure file shares](restore-afs.md)
* Learn how to [Manage Azure file share backups](manage-afs-backup.md)

