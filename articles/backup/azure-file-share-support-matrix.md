---
title: Support Matrix for Azure files backup by using Azure Backup
description: Provides a summary of support settings and limitations when backing up Azure files.
ms.topic: reference
ms.date: 05/23/2025
ms.custom: references_regions, engagement-fy24
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a cloud architect, I want to understand the supported configurations and limitations for backing up Azure files using Azure Backup, so that I can ensure my backup strategy meets compliance and operational requirements."
---

# Support matrix for Azure files backup

This article summarizes the supported settings and limitations when backing up Azure files by using Azure Backup.

You can use the [Azure Backup service](./backup-overview.md) to back up Azure files. This article summarizes support settings when you back up Azure files with Azure Backup.

> [!NOTE]
> Azure Backup currently doesn't support Network File Shares(NFS).

## Supported regions

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

Azure files backup is available in all regions, **except** for Germany Central (Sovereign), Germany Northeast (Sovereign), China East, China North, France South, and US Gov Iowa.

# [Vault-standard tier](#tab/vault-tier)

Vaulted backup for Azure Files is available in the following regions: UK South, UK West, Southeast Asia, East Asia, West Central US, Central US, Central India, North Europe, Australia East, West US, East US, South India, France Central, Canada Central, North Central US, East US 2, Australia Southeast, Germany North, France South, West US 2, Brazil South, Japan West, Germany West Central, Canada East, Korea South, Jio India West, Korea Central, South Africa West, Japan East, Norway East, Switzerland West, Norway West, South Africa North, UAE North, West Europe, Sweden Central, Switzerland North.

Cross Region Restore is currently supported in the following regions: Australia East, West US, North Central US, East US, East US2, West US2, South India, Australia Southeast, Brazil South, Canada East, Korea Central, Norway East, South Africa North, Switzerland North, France Central, Germany North, Japan West, Korea South, South Africa West, Switzerland West, Canada Central, France South, Germany West Central,  Japan East, Norway West, West Europe. This feature isn't supported in Sweden Central, UAE North, Jio India West.

Migration of  File Shares protected with snapshot backup to vaulted backup is supported in the following regions: UK South, UK West, Southeast Asia, East Asia, West Central US, and India Central.

>[!Note]
>Cross Subscription Backup and Restore are supported for vaulted backup.

---

## Supported storage accounts

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Storage  account details | Support                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Account  Kind            | Azure  Backup supports Azure files present in general-purpose v1, general-purpose v2, and file storage type storage accounts |
| Performance              | Azure  Backup supports File Shares in both standard and Premium Storage accounts |
| Replication              | Azure  files in storage accounts with any replication type are  supported |
| Firewall enabled         | Azure files in storage accounts with Firewall rules that allow Microsoft Azure Services to access storage account are supported|

# [Vault-standard tier](#tab/vault-tier)

| Storage account details | Support |
| --- | --- |
| Account Kind | Azure Backup supports Azure files present in general-purpose v2, and file storage type storage accounts. <br><br> Storage accounts configured with private endpoints are supported. However, a private endpoint on the vault doesn't apply to Azure Files backup scenarios.  |

>[!Important]
>The source Storage Account must have the **Allow storage account key access** setting enabled for successful Azure Files backup and restore.


---

## Supported File Shares

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| File  share type                                   | Support   |
| -------------------------------------------------- | --------- |
| Standard (with large File Shares enabled)                                   | Supported |
| Large                                              | Supported |
| Premium                                            | Supported |
| File Shares connected with Azure File Sync service | Supported |

# [Vault-standard tier](#tab/vault-tier)


| File Share type                                    | Support |
| -------------------------------------------------- | ------  |
| Standard                                           | Supported  |
| Large                                              | Supported |
| Premium                                            | Supported (in preview) |
| File Shares connected with Azure File Sync service | Supported |


---

## Protection limits

| Setting                                                      | Limit |
| ------------------------------------------------------------ | ----- |
| Maximum  number of File Shares that can be protected per vault per day| 200   |
| Maximum  number of storage accounts that can be registered per vault per day | 50    |
| Maximum  number of File Shares that can be protected  per vault | 2000   |
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

# [Vault-standard tier](#tab/vault-tier)

| Setting                                 | Limit     |
| --------------------------------------- | ------    |
| Maximum size of File Share              | 10 TB      |
| Maximum number of files in a File Share | 10 million |

>[!Note]
>If you have multiple backups scheduled per day, only the last scheduled snapshot of the day is transferred to the vault.

---

## Restore limits

| Setting | Limit |
| --- | --- |
| Maximum number of restore per day                           | 20      |

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                                      | Limit   |
| ------------------------------------------------------------ | ------- |
| Maximum size of a file (if the destination account is in a Vnet) | 1 TB |
| Maximum  number of individual files or folders per restore, if ILR (Item level recovery)                         | 99      |
| Maximum  recommended restore size per restore for large File Shares | 15  TiB |
| Maximum duration of a restore job                           | 7 days

# [Vault-standard tier](#tab/vault-tier)

| Setting | Limit |
| --- | --- |
| Maximum size of a file | 4 TB | 

---

## Retention limits

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Setting                                                      | Limit    |
| ------------------------------------------------------------ | -------- |
| Maximum total recovery points per  File Share at any point in time | 200      |
| Maximum retention of recovery  point created by on-demand backup | 10 years |
| Maximum retention of daily recovery points (snapshots) per File Share, if daily frequency | 200 days |
| Maximum retention of daily recovery points (snapshots) per File Share, if hourly frequency | Floor (200/number of snapshots according to the schedule)-1 |
| Maximum retention of weekly recovery points (snapshots) per File Share | 200 weeks |
| Maximum retention of monthly recovery points (snapshots) per File Share | 120 months |
| Maximum retention of  yearly recovery points (snapshots) per File Share | 10 years |

# [Vault-standard tier](#tab/vault-tier)


| Setting |                    Limit |
| --- | --- |
| Maximum retention of snapshot | 30 days |
| Maximum retention of recovery point created by on-demand backup | 99 years |
| Maximum retention of daily recovery points | 9,999 days |
| Maximum retention of weekly recovery points | 5,163 weeks |
| Maximum retention of monthly recovery points | 1,188 months |
| Maximum retention of yearly recovery points | 99 years |

---

## Supported restore methods

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot-tier)

| Restore method     | Details                                                      |
| ------------------ | ------------------------------------------------------------ |
| Full Share Restore | You can restore the complete file  share to the original or an alternate location |
| Item Level Restore | You can restore individual files and folders to the original or an alternate location |

# [Vault-standard tier](#tab/vault-tier)

| Restore method | Description |
| --- | --- |
| Full Share Restore | You can restore the complete File Share to an alternate location

>[!Note]
>Original location restores (OLR) and file-level recovery aren't supported. You can perform restore to an empty folder with the **Overwrite** option only.

---

## Daylight savings

Azure Backup doesn't support automatic clock adjustment for daylight saving time for Azure Virtual Machine (VM) backups. It doesn't shift the hour of the backup forward or backwards. To ensure the backup runs at the desired time, modify the backup policies manually as required.

## Support for customer-managed failover

This section describes how your backups and restores are affected after customer-managed failovers. 

The following table lists the behavior of backups due to customer-initiated failovers:

| Failover type | Backups | Restore | Enabling protection (reprotection) of failed over account in secondary region |
| --- | --- | --- | --- |
| Customer-managed planned failover | Supported | Supported | Not supported |
| Customer-managed unplanned failover | Not supported | Only cross-region restore from the vault is supported. | Not supported |

## Permitted scope for copy operations(preview)

The following table lists the scope for copy operation:

| Configuration | Support |
| --- | --- |
| From any storage account | Supported |
| From storage accounts in the same Microsoft Entra tenant | Supported |
| From storage accounts with a private endpoint to the same virtual network | Unsupported |

Azure Trusted Services are allowed, but private endpoints take priority; so, this won't work. 


## Next steps

* [Back up Azure Files using Azure portal](backup-afs.md).
* [Restore Azure Files using Azure portal](restore-afs.md).
* [Manage Azure Files backups using Azure portal](manage-afs-backup.md).

