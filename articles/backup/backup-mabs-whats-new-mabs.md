---
title: What's new in Microsoft Azure Backup Server
description: Microsoft Azure Backup Server gives you enhanced backup capabilities for protecting VMs, files and folders, workloads, and more.
ms.topic: conceptual
ms.date: 05/24/2020
---

# What's new in Microsoft Azure Backup Server (MABS)

## What's new in MABS V3 UR1

Microsoft Azure Backup Server (MABS) version 3 UR1 is the latest update, and includes critical bug fixes and other features and enhancements. To view the list of bugs fixed and the installation instructions for MABS V3 UR1, see KB article [4534062](https://support.microsoft.com/help/4534062).

>[!NOTE]
>Support for the 32 bit protection agent is deprecated with MABS v3 UR1. See [32 Bit protection agent deprecation](#32-bit-protection-agent-deprecation).

### Faster backups with tiered storage using SSDs

MABS V2 introduced [Modern Backup Storage](backup-mabs-add-storage.md) (MBS), improving storage utilization and performance. MBS uses ReFS as underlying file system and is designed to make use of hybrid storage such as tiered storage.

To achieve the scale and performance by MBS we recommend using a small percentage (4% of overall storage) of flash storage (SSD) with MABS V3 UR1  as a tiered volume in combination with DPM HDD storage. MABS V3 UR1  with tiered storage delivers 50-70% faster backups. Refer to the DPM article [Set up MBS with Tiered Storage](https://docs.microsoft.com/system-center/dpm/add-storage?view=sc-dpm-2019#set-up-mbs-with-tiered-storage) for steps to configure tiered storage.

### Support for ReFS volumes and ReFS volumes with deduplication enabled

With MABS V3 UR1, you can back up the ReFS volumes and workloads deployed on the ReFS volume. You can back up the following workloads deployed on the ReFS volumes:

* Operating System (64 bit): Windows Server 2019, 2016, 2012 R2, 2012.
* SQL Server: SQL Server 2019, SQL Server 2017, 2016.
* Exchange: Exchange 2019, 2016.
* SharePoint: SharePoint 2019, 2016 with latest SP.

>[!NOTE]
> Backup of Hyper-V VMs stored on an ReFS volume is supported with MABS V3

### Azure VMware Solution protection support

With MABS v3 UR1, you can now protect virtual machines deployed in [Azure VMware Solution](https://docs.microsoft.com/azure/azure-vmware/).

### VMware parallel backups

With MABS V3 UR1, all your VMware VMs backups within a single protection group will be parallel, leading to 25% faster VM backups.
With earlier versions of MABS, parallel backups were performed only across protection groups. With MABS V3 UR1, VMware delta replication jobs run in parallel. By default, the number of jobs to run in parallel is set to 8. Learn more about [VMware parallel backups](backup-azure-backup-server-vmware.md#vmware-parallel-backups).

### Disk exclusion for VMware VM backup

With MABS V3 UR1, you can exclude specific disks from a VMware VM backup. Learn more about [excluding disks from VMware VM backup](backup-azure-backup-server-vmware.md#exclude-disk-from-vmware-vm-backup).  

### Support for additional layer of authentication to delete online backup

With MABS V3 UR1, an additional a layer of authentication is added for critical operations. You'll be prompted to enter a security PIN when you perform **Stop Protection with Delete data** operations.

### Offline backup improvements

MABS v3 UR1 improves the experience of offline backup with Azure Import/Export Service. For more information, see the updated steps [here](https://docs.microsoft.com/azure/backup/backup-azure-backup-server-import-export).

>[!NOTE]
>The update also brings the preview for Offline Backup using Azure Data Box in MABS. Contact [SystemCenterFeedback@microsoft.com](mailto:SystemCenterFeedback@microsoft.com) to learn more.

### New cmdlet parameter

MABS V3 UR1 includes a new parameter **[-CheckReplicaFragmentation]**. The new parameter calculates the fragmentation percentage for a replica, and is included in the **Copy-DPMDatasourceReplica** cmdlet.

### 32-Bit protection agent deprecation

With MABS v3 UR1, support for 32-bit protection agent is no longer supported. You won't be able to protect 32-bit workloads after upgrading the MABS v3 server to UR1. Any existing 32-bit protection agents will be in a disabled state and scheduled backups will fail with the **agent is disabled** error. If you want to retain backup data for these agents, you can stop the protection with the retain data option. Otherwise, the protection agent can be removed.

>[!NOTE]
>Review the [updated protection matrix](https://docs.microsoft.com/azure/backup/backup-mabs-protection-matrix) to learn the supported workloads for protection with MABS UR 1.

## What's new in MABS V3 RTM

Microsoft Azure Backup Server version 3 (MABS V3) includes critical bug fixes, Windows Server 2019 support, SQL 2017 support, and other features and enhancements. To view the list of bugs fixed and the installation instructions for MABS V3, see KB article [4457852](https://support.microsoft.com/help/4457852/microsoft-azure-backup-server-v3).

The following features are included in MABS V3:

### Volume to Volume migration

With Modern Backup Storage (MBS) in MABS V2, we announced Workload aware storage, where you configure certain workloads to be backed up to specific storage, based on storage properties. However, after configuration, you may find a need to move backups of certain data sources to other storage for optimized resource utilization. MABS V3 gives you the capability to migrate your backups and configure them to be stored to a different volume in [three steps](https://techcommunity.microsoft.com/t5/system-center-blog/sc-2016-dpm-ur4-migrate-backup-storage-in-3-simple-steps/ba-p/351842).

### Prevent unexpected data loss

In enterprises, MABS is managed by a team of administrators. While there are guidelines on storage that should be used for backups, an incorrect volume given to MABS as backup storage may lead to loss of critical data. With MABS V3, you can prevent such scenarios by configuring those volumes as the ones that aren't available for storage using [these PowerShell cmdlets](https://docs.microsoft.com/azure/backup/backup-mabs-add-storage).

### Custom size allocation

Modern Backup Storage (MBS) consumes storage thinly, as and when needed. To do so, MABS calculates the size of the data being backed up when it's configured for protection. However, if many files and folders are being backed up together, as in the case of a file server, size calculation can take long time. With MABS V3, you can configure MABS to accept the volume size as default, instead of calculating the size of each file, which saves time.

### Optimized CC for RCT VMs

MABS uses RCT (the native change tracking in Hyper-V), which decreases the need for time-consuming consistency checks in scenarios as VM crashes. RCT provides better resiliency than the change tracking provided by VSS snapshot-based backups. MABS V3 optimizes network and storage consumption further by transferring only the changed data during any consistency checks.

### Support to TLS 1.2

TLS 1.2  is the secure way of communication suggested by Microsoft with best-in class encryption. MABS now supports TLS 1.2 communication between MABS and the protected servers, for certificate-based authentication, and for cloud backups.

### VMware VM protection support

VMware VM backup is now supported for production deployments. MABS V3 offers the following for VMware VM protection:

* Support for vCenter and ESXi 6.5, along with support for 5.5 and 6.0.
* Auto-protection of VMware VMs to cloud. If new VMware VMs are added to a protected folder, they're automatically protected to disk and cloud.
* Recovery efficiency improvements for VMware alternative location recovery.

### SQL 2017 support

MABS V3 can be installed with SQL 2017 as the MABS database. You can upgrade the SQL server from SQL 2016 to SQL 2017, or install it freshly. You can also back up SQL 2017 workload both in clustered and non-clustered environment with MABS V3.

### Windows Server 2019 support

MABS V3 can be installed on Windows Server 2019. To use MABS V3 with WS2019, you can either upgrade your OS to WS2019 before installing/upgrading to MABS V3 or you can upgrade your OS post installing/upgrading V3 on WS2016.

MABS V3 is a full release, and can be installed directly on Windows Server 2016, Windows Server 2019, or can be upgraded from MABS V2. Before you upgrade to or install Backup Server V3, read about the installation prerequisites.
Find more information about the installation/upgrade steps for MABS [here](https://docs.microsoft.com/azure/backup/backup-azure-microsoft-azure-backup#software-package).

> [!NOTE]
>
> MABS has the same code base as System Center Data Protection Manager. MABS v3 is equivalent to Data Protection Manager 1807. MABS v3 UR1 is equivalent to Data Protection Manager 2019 UR1.

## Next steps

Learn how to prepare your server or begin protecting a workload:

* [Prepare Backup Server workloads](backup-azure-microsoft-azure-backup.md)
* [Use Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md)
* [Use Backup Server to back up SQL Server](backup-azure-sql-mabs.md)
* [Use Modern Backup Storage with Backup Server](backup-mabs-add-storage.md)
