---
title: Support Matrix for Azure file share backup
description: Provides a summary of support settings and limitations when backing up Azure file shares.
ms.topic: conceptual
ms.date: 5/07/2020
---

# Support matrix for Azure file share backup

You can use the [Azure Backup service](https://docs.microsoft.com/azure/backup/backup-overview) to back up Azure file shares. This article summarizes support settings when you back up Azure file shares with Azure Backup.

## Supported GEOS

Backup for Azure file shares is available in the following GEOS:

| GA regions | Supported regions (as part of preview) but not yet GA                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Australia South East (ASE), Canada Central (CNC), West Central US (WCUS), West US 2 (WUS 2), India South (INS), North Central US (NCUS), Japan East (JPE), Brazil South (BRS), South East Asia (SEA),Switzerland West (SZW), UAE Central (UAC), Norway East (NWE),India West (INW), Australia Central (ACL), Korea Central (KRC), Japan West (JPW), South Africa North (SAN), UK West (UKW), Korea South (KRS), Germany North (GN), Norway West (NWW), South Africa West (SAW), Switzerland North (SZN), Germany West Central (GWC), UAE North(UAN), France Central (FRC), India Central (INC), Canada East (CNE), East Asia (EA), Australia East (AE),  Central US (CUS), West US (WUS)                                                  |  East US (EUS), East US 2 (EUS2), North Europe (NE), South Central US (SCUS), UK South (UKS), West Europe (WE),  US Gov Arizona (UGA), US Gov Texas (UGT), US Gov Virginia (UGV)           |

## Supported storage accounts

| Storage  account details | Support                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Azure  Backup supports Azure file shares present in general-purpose v1, general-purpose v2 and file storage type storage accounts |
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
