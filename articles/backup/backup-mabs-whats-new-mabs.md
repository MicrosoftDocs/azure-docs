---
title: What's new in Microsoft Azure Backup Server
description: Microsoft Azure Backup Server gives you enhanced backup capabilities for protecting VMs, files and folders, workloads, and more. Learn how to install or upgrade to Azure Backup Server V3.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: adigan
---

# What's new in Microsoft Azure Backup Server

Microsoft Azure Backup Server version 3 (MABS V3) is the latest upgrade, and includes critical bug fixes, Windows Server 2019 support, SQL 2017 support and other features and enhancements. To view the list of bugs fixed and the installation instructions for MABS V3, see KB article [4457852](https://support.microsoft.com/en-us/help/4457852/microsoft-azure-backup-server-v3).

The following features are included in MABS V3:

## Volume to Volume migration
With Modern Backup Storage (MBS) in MABS V2, we announced Workload aware storage, where you configure certain workloads to be backed up to specific storage, based on storage properties. However, after configuration, you may find a need to move backups of certain data sources to other storage for optimized resource utilization. MABS V3 gives you the capability to migrate your backups and configure them to be stored to a different volume in [3 steps](https://blogs.technet.microsoft.com/dpm/2017/10/24/storage-migration-with-dpm-2016-mbs/).

## Prevent unexpected data loss
In enterprises, MABS is managed by a team of administrators. While there are guidelines on storage that should be used for backups, an incorrect volume given to MABS as backup storage may lead to loss of critical data. With MABS V3, you can prevent such scenarios by configuring those volumes as the ones that are not available for storage using [these PowerShell cmdlets](https://docs.microsoft.com/system-center/dpm/add-storage#volume-exclusion).

## Custom Size Allocation
Modern Backup Storage (MBS) consumes storage thinly, as and when needed. To do so, MABS calculates the size of the data being backed up when it is configured for protection. However, if many files and folders are being backed up together, as in the case of a file server, size calculation can take long time. With MABS V3, you can configure MABS to accept the volume size as default, instead of calculating the size of each file, hence saving time.

## Optimized CC for RCT VMs
MABS uses RCT (the native change tracking in Hyper-V), which decreases the need for time-consuming consistency checks in scenarios as VM crashes. RCT provides better resiliency than the change tracking provided by VSS snapshot-based backups. MABS V3 optimizes network and storage consumption further by transferring only the changed data during any consistency checks.

## Support to TLS 1.2
TLS 1.2  is the secure way of communication suggested by Microsoft with best-in class encryption. MABS now supports TLS 1.2 communication between MABS and the protected servers, for certificate-based authentication, and for cloud backups.

## VMware VM protection support
VMware VM backup is now supported for production deployments. MABS V3 offers the following for VMware VM protection:

-	Support for vCenter and ESXi 6.5, along with support for 5.5 and 6.0.
- Auto-protection of VMware VMs to cloud. If new VMware VMs are added to a protected folder, they are automatically protected to disk and cloud.
- Recovery efficiency improvements for VMware alternative location recovery.

## SQL 2017 support
MABS V3 can be installed with SQL 2017 as the MABS database. You can upgrade the SQL server from SQL 2016 to SQL 2017, or install it freshly. You can also back up SQL 2017 workload both in clustered and non-clustered environment with MABS V3.

## Windows Server 2019 support
MABS V3 can be installed on Windows Server 2019. To use MABS V3 with WS2019, you can either upgrade your OS to WS2019 before installing/upgrading to MABS V3 or you can upgrade your OS post installing/upgrading V3 on WS2016.

MABS V3 is a full release, and can be installed directly on Windows Server 2016, Windows Server 2019, or can be upgraded from MABS V2. Before you upgrade to or install Backup Server V3, read about the installation prerequisites.
Find more information about the installation/upgrade steps for MABS [here](https://docs.microsoft.com/azure/backup/backup-azure-microsoft-azure-backup#software-package).


> [!NOTE]
> 
> MABS has the same code base as System Center Data Protection Manager. MABS v3 is equivalent to Data Protection Manager 1807.

## Next steps

Learn how to prepare your server or begin protecting a workload:
- [Known issues in MABS V3](backup-mabs-release-notes-v3.md)
- [Prepare Backup Server workloads](backup-azure-microsoft-azure-backup.md)
- [Use Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md)
- [Use Backup Server to back up SQL Server](backup-azure-sql-mabs.md)
- [Use Modern Backup Storage with Backup Server](backup-mabs-add-storage.md)
