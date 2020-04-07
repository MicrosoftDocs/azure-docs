---
title: Support Matrix for Azure File shares backup
description: Provides a summary of support settings and limitations when backing up Azure file shares.
ms.topic: conceptual
ms.date: 1/26/2020
---

# Support Matrix for Azure file shares backup

You can use the [Azure Backup service](https://docs.microsoft.com/azure/backup/backup-overview) to back up Azure file shares. This article summarizes support settings when you back up Azure file shares with Azure Backup.

## Supported GEOS

Backup for Azure file shares is available in the following GEOS:

| [Soft Delete](https://docs.microsoft.com/azure/backup/backup-azure-security-feature-cloud) (Protection against accidental delete of backed up file share) | Regions                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Enabled                                                      | Australia South East (ASE), Canada Central (CNC)                   |
| Disabled                                                     | Australia  East (AE), Brazil  South (BRS), Canada East (CE),Central US (CUS),East Asia (EA),East US  (EUS),East US 2 (EUS2),Japan East (JPE),Japan West (JPW),India Central  (INC),India South (INS),Korea Central (KRC),Korea South (KRS),North Central  US (NCUS),North Europe (NE),South Central US (SCUS),South East Asia (SEA),UK  South (UKS),UK West (UKW),West Europe (WE),West US (WUS),West Central US  (WCUS),West US 2 (WUS 2),US Gov Arizona (UGA),US Gov Texas (UGT),US Gov  Virginia (UGV),Australia Central (ACL),India West(INW),South Africa  North(SAN),UAE North(UAN),France Central (FRC),Germany North (GN),Germany  West Central (GWC),South Africa West (SAW),UAE Central (UAC),Norway East  (NWE),Norway West (NWW),Switzerland North (SZN) |

## Supported storage accounts

| Storage  account details | Support                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Azure  Backup supports Azure file shares in both general-purpose v1 and general-purpose v2 storage accounts |
| Performance              | Azure  Backup supports file shares in both standard and Premium Storage accounts |
| Replication              | Azure  files shares in Storage Accounts with any replication type are  supported |

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
| Maximum  number of file shares that can be protected per day per vault | 200   |
| Maximum  number of storage accounts that can be registered per vault per day | 50    |

## Backup limits

| Setting                                      | Limit |
| -------------------------------------------- | ----- |
| Maximum  number of on-demand backups per day | 4     |
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
