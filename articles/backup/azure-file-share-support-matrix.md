---
title: Support Matrix for Azure file share backup
description: Provides a summary of support settings and limitations when backing up Azure file shares.
ms.topic: conceptual
ms.date: 5/07/2020
ms.custom: references_regions
---

# Support matrix for Azure file share backup

You can use the [Azure Backup service](https://docs.microsoft.com/azure/backup/backup-overview) to back up Azure file shares. This article summarizes support settings when you back up Azure file shares with Azure Backup.

## Supported regions

### GA regions for Azure file shares backup

Azure file shares backup is available in all regions **except** for: Germany Central (Sovereign), Germany Northeast (Sovereign), China East, China East 2, China North, China North 2, US Gov Iowa

### Supported regions for accidental delete protection

West Central US, Australia South East , Canada Central

## Supported storage accounts

| Storage  account details | Support                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Azure  Backup supports Azure file shares present in general-purpose v1, general-purpose v2 and file storage type storage accounts |
| Performance              | Azure  Backup supports file shares in both standard and Premium Storage accounts |
| Replication              | Azure  file shares in storage accounts with any replication type are  supported |
| Firewall enabled         | Azure file shares in storage accounts with Firewall rules that allow Microsoft Azure Services to access storage account are supported|

## Supported file shares

| File  share type                                   | Support   |
| -------------------------------------------------- | --------- |
| Standard                                           | Supported |
| Large                                              | Supported |
| Premium                                            | Supported |
| File shares connected with Azure File sync service | Supported |

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
| Maximum  number of scheduled backups per day | 1     |

## Restore limits

| Setting                                                      | Limit   |
| ------------------------------------------------------------ | ------- |
| Maximum number of restores per day                           | 10      |
| Maximum  number of files per restore                         | 10      |
| Maximum  recommended restore size per restore for large file shares | 15  TiB |

## Retention limits

| Setting                                                      | Limit    |
| ------------------------------------------------------------ | -------- |
| Maximum total recovery points per  file share at any point in time | 200      |
| Maximum retention of recovery  point created by on-demand backup | 10 years |
| Maximum retention of daily recovery points (snapshots) per file share| 200 days |
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
