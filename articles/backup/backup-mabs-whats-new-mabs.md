---
title: What's new in Microsoft Azure Backup Server
description: Microsoft Azure Backup Server gives you enhanced backup capabilities for protecting VMs, files and folders, workloads, and more.
ms.topic: conceptual
ms.date: 11/23/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# What's new in Microsoft Azure Backup Server (MABS)?

Microsoft Azure Backup Server gives you enhanced backup capabilities to protect VMs, files and folders, workloads, and more.



## What's new in MABS V4 Update Rollup 1 (UR1)?

**Microsoft Azure Backup Server version 4 (MABS V4) Update Rollup 1** includes critical bug fixes and feature enhancements. To view the list of bugs fixed and the installation instructions for MABS V4 UR1, see [KB article 5032421](https://support.microsoft.com/help/5032421/).

The following table lists the new features added in MABS V4 UR1:

| Feature | Supportability |
| --- | --- |
| Item-level recovery for VMware VMs running Windows directly from online recovery points. |  Note that you need *MARS version 2.0.9251.0 or above* to use this feature.   | 
| Windows and Basic SMTP Authentication for MABS email reports and alerts.    |  This enables MABS to send reports and alerts using any vendor supporting SMTP Basic Authentication. [Learn more](/system-center/dpm/monitor-dpm?view=sc-dpm-2022&preserve-view=true#configure-email-for-dpm).            <br><br>     Note that if you are using Microsoft 365 SMTP with a MABS V4 private fix, reenter the credential using Basic Authentication.       | 
| Fall back to crash consistent backups for VMware VMs.    |     Use a registry key for VMware VMs when backups fail with ApplicationQuiesceFault. [Learn more](backup-azure-backup-server-vmware.md#applicationquiescefault).  |
| **Experience improvements for MABS backups to Azure.** |                 |
| List online recovery points for a data source along with the expiry time and soft-delete status. |     To view the list of recovery points along with their expiration dates, right-click a data source and select **List recovery points**.    |
| Stop protection and retaining data using the policy duration for immutable vaults directly from the console.  |  This helps you to save the backup costs when stopping protection for a data source backed up to an immutable vault. [Learn more](backup-azure-security-feature.md#immutability-support).      |


>[!Important]
>We're temporarily pausing the release of Update Rollup 1 for Microsoft Azure Backup Server V4 due to tbe following known issue - **Hyper-V scheduled backups take a long time to complete because each backup job triggers a consistency check.**
>
>**Error message**: The replica of Microsoft Hyper-V RCT on `<Machine Name>` is not consistent with the protected data source. DPM has detected changes in file locations or volume configurations of protected objects since the data source was configured for protection. (ID 30135).
>
>**Resolution**: This will be resolved in the new version planned to be released soon.
>
>- If you haven't installed UR1 for MABS V4 already, wait for the new release.
>- If you have already installed UR1 for MABS V4, this new build will install on top of UR1 for MABS V4 to fix the known issues.
>
>For additional information, reach out to Microsoft Support.


## What's new in MABS V4 RTM

Microsoft Azure Backup Server version 4 (MABS V4) includes critical bug fixes and the support for Windows Server 2022, SQL 2022, Azure Stack HCI 22H2, and other features and enhancements. To view the list of bugs fixed and the installation instructions for MABS V4, see [KB article 5024199](https://support.microsoft.com/help/5024199/).

The following table lists the included features in MABS V4:

| Supported feature | Description |
| --- | --- |
| Windows Server 2022 support | You can install MABS V4 on and protect Windows Server 2022. To use MABS V4 with *WS2022*, you can either upgrade your operation system (OS) to *WS2022* before installing/upgrading to MABS V4, or you can upgrade your OS after installing/upgrading V4 on *WS2019*. <br><br> MABS V4 is a full release, and can be installed directly on Windows Server 2022, Windows Server 2019, or can be upgraded from MABS V3. Learn more [about the installation prerequisites](backup-azure-microsoft-azure-backup.md#software-package) before you upgrade to or install Backup Server V4. |
| SQL Server 2022 support | You can install MABS V4 with SQL 2022 as the MABS database. You can upgrade the SQL Server from SQL 2017 to SQL 2022, or install it fresh. You can also back up SQL 2022 workload with MABS V4. |
| Private Endpoint Support | With MABS V4, you can use private endpoints to send your online backups to Azure Backup Recovery Services vault. [Learn more](backup-azure-private-endpoints-concept.md). |
| Azure Stack HCI 22H2 support | MABS V4 now supports protection of workloads running in Azure Stack HCI from V1 to 22H2. [Learn more](back-up-azure-stack-hyperconverged-infrastructure-virtual-machines.md). |
| VMware 8.0 support | MABS V4 can now back up VMware VMs running on VMware 8.0. MABS V4 supports VMware, version 6.5 to 8.0. [Learn more](backup-azure-backup-server-vmware.md). <br><br> Note that MABS V4 doesn't support the DataSets feature added in vSphere 8.0. |
| Item-level recovery from online recovery points for Hyper-V and Stack HCI VMs running Windows Server | With MABS V4, you can perform item-level recovery of files and folders from your online recovery point for VMs running Windows Server on Hyper-V or Stack HCI without downloading the entire recovery point. <br><br> Go to the *Recovery* pane, select a *VM online recovery point* and double-click the *recoverable item* to browse and recover its contents at a file/folder level. <br><br> [Learn more](back-up-hyper-v-virtual-machines-mabs.md). |
| Parallel Restore of VMware and Hyper-V VMs | MABS V4 supports parallel restore of [VMware](restore-azure-backup-server-vmware.md) and [Hyper-V](back-up-hyper-v-virtual-machines-mabs.md) virtual machines. With earlier versions of MABS, restore of VMware VM and Hyper-V virtual machine was restricted to only one restore job at a time. With MABS V4, by default you can restore *eight* VMs in parallel and this number can be increased using a registry key. |
| Parallel online backup jobs - limit enhancement | MABS V4 supports increasing the maximum parallel online backup jobs from *eight* to a configurable limit based on your hardware and network limitations through a registry key for faster online backups. [Learn more](backup-azure-microsoft-azure-backup.md). |
| Faster Item Level Recoveries | MABS V4 moves away from File Catalog for online backup of file/folder workloads. File Catalog was necessary to restore individual files and folders from online recovery points, but increased backup time by uploading file metadata. <br><br> MABS V4 uses an *iSCSI mount* to provide faster individual file restores and reduces backup time, because file metadata doesn't need to be uploaded. |

## What’s new in MABS v3 UR2?

Microsoft Azure Backup Server (MABS) version 3 UR2 supports the following new features/feature updates.

For information about the UR2 issues fixes and the installation instructions, see the [KB article](https://support.microsoft.com/topic/update-rollup-2-for-microsoft-azure-backup-server-v3-350de164-0ae4-459a-8acf-7777dbb7fd73).

### Support for Azure Stack HCI

With MABS v3 UR2, you can back up Virtual Machines on Azure Stack HCI. [Learn more](./back-up-azure-stack-hyperconverged-infrastructure-virtual-machines.md).

### Support for VMware 7.0

With MABS v3 UR2, you can back up VMware 7.0 VMs. [Learn more](./backup-azure-backup-server-vmware.md).

### Support for SQL Server Failover Cluster Instance (FCI) using Cluster Shared Volume (CSV)

MABS v3 UR2 supports SQL Server Failover Cluster Instance (FCI) using Cluster Shared Volume (CSV). With CSV, the management of your SQL Server Instance is simplified. This helps you to manage the underlying storage from any node as there is an abstraction to which node owns the disk. [Learn more](./backup-azure-sql-mabs.md).

### Optimized Volume Migration

MABS v3 UR2 supports optimized volume migration. The optimized volume migration allows you to move data sources to the new volume much faster. The enhanced migration process migrates only the active backup copy (Active Replica) to the new volume. All new recovery points are created on the new volume, while existing recovery points are maintained on the existing volume and are purged based on the retention policy. [Learn more](/system-center/dpm/volume-to-volume-migration?view=sc-dpm-2019&preserve-view=true).

### Offline Backup using Azure Data Box

MABS v3 UR2 supports Offline backup using Azure Data Box. With Microsoft Azure Data Box integration, you can overcome the challenge of moving terabytes of backup data from on-premises to Azure storage. Azure Data Box saves the effort required to procure your own Azure-compatible disks and connectors or to provision temporary storage as a staging location. Microsoft also handles the end-to-end transfer logistics, which you can track through the Azure portal. [Learn more](./offline-backup-azure-data-box-dpm-mabs.md).

## What's new in MABS V3 UR1?

Microsoft Azure Backup Server (MABS) version 3 UR1 is the latest update, and includes critical bug fixes and other features and enhancements. To view the list of bugs fixed and the installation instructions for MABS V3 UR1, see KB article [4534062](https://support.microsoft.com/help/4534062).

>[!NOTE]
>Support for the 32 bit protection agent is deprecated with MABS v3 UR1. See [32 Bit protection agent deprecation](#32-bit-protection-agent-deprecation).

### Faster backups with tiered storage using SSDs

MABS V2 introduced [Modern Backup Storage](backup-mabs-add-storage.md) (MBS), improving storage utilization and performance. MBS uses ReFS as underlying file system and is designed to make use of hybrid storage such as tiered storage.

To achieve the scale and performance by MBS we recommend using a small percentage (4% of overall storage) of flash storage (SSD) with MABS V3 UR1  as a tiered volume in combination with DPM HDD storage. MABS V3 UR1  with tiered storage delivers 50-70% faster backups. Refer to the DPM article [Set up MBS with Tiered Storage](/system-center/dpm/add-storage#set-up-mbs-with-tiered-storage) for steps to configure tiered storage.

### Support for ReFS volumes

With MABS V3 UR1, you can back up the ReFS volumes and workloads deployed on the ReFS volume. You can back up the following workloads deployed on the ReFS volumes:

* Operating System (64 bit): Windows Server 2019, 2016, 2012 R2, 2012.
* SQL Server: SQL Server 2019, SQL Server 2017, 2016.
* Exchange: Exchange 2019, 2016.
* SharePoint: SharePoint 2019, 2016 with latest SP.

>[!NOTE]
> Backup of Hyper-V VMs stored on an ReFS volume is supported with MABS V3

>[IMPORTANT]
>We've identified a few issues with backup of deduplicated ReFS volumes. We're working on fixing these, and will update this section as soon as we have a fix available. Until then, we're removing the support for backup of deduplicated ReFS volumes from MABSv3 UR1.

### Azure VMware Solution protection support

With MABS v3 UR1, you can now protect virtual machines deployed in [Azure VMware Solution](../azure-vmware/index.yml).

### VMware parallel backups

With MABS V3 UR1, all your VMware VMs backups within a single protection group will be parallel, leading to 25% faster VM backups.
With earlier versions of MABS, parallel backups were performed only across protection groups. With MABS V3 UR1, VMware delta replication jobs run in parallel. By default, the number of jobs to run in parallel is set to 8. Learn more about [VMware parallel backups](backup-azure-backup-server-vmware.md#vmware-parallel-backups).

### Disk exclusion for VMware VM backup

With MABS V3 UR1, you can exclude specific disks from a VMware VM backup. Learn more about [excluding disks from VMware VM backup](backup-azure-backup-server-vmware.md#exclude-disk-from-vmware-vm-backup).  

### Support for additional layer of authentication to delete online backup

With MABS V3 UR1, an additional a layer of authentication is added for critical operations. You'll be prompted to enter a security PIN when you perform **Stop Protection with Delete data** operations.

### Offline backup improvements

MABS v3 UR1 improves the experience of offline backup with Azure Import/Export Service. For more information, see the updated steps [here](./backup-azure-backup-server-import-export.md).

>[!NOTE]
>From MABS v3 UR2, MABS can perform offline backup using Azure Data Box. [Learn more](./offline-backup-azure-data-box-dpm-mabs.md).

### New cmdlet parameter

MABS V3 UR1 includes a new parameter **[-CheckReplicaFragmentation]**. The new parameter calculates the fragmentation percentage for a replica, and is included in the **Copy-DPMDatasourceReplica** cmdlet.

### 32-Bit protection agent deprecation

With MABS v3 UR1, support for 32-bit protection agent is no longer supported. You won't be able to protect 32-bit workloads after upgrading the MABS v3 server to UR1. Any existing 32-bit protection agents will be in a disabled state and scheduled backups will fail with the **agent is disabled** error. If you want to retain backup data for these agents, you can stop the protection with the retain data option. Otherwise, the protection agent can be removed.

>[!NOTE]
>Review the [updated protection matrix](./backup-mabs-protection-matrix.md) to learn the supported workloads for protection with MABS UR 1.

## What's new in MABS V3 RTM?

Microsoft Azure Backup Server version 3 (MABS V3) includes critical bug fixes, Windows Server 2019 support, SQL 2017 support, and other features and enhancements. To view the list of bugs fixed and the installation instructions for MABS V3, see KB article [4457852](https://support.microsoft.com/help/4457852/microsoft-azure-backup-server-v3).

The following features are included in MABS V3:

### Volume to Volume migration

With Modern Backup Storage (MBS) in MABS V2, we announced Workload aware storage, where you configure certain workloads to be backed up to specific storage, based on storage properties. However, after configuration, you may find a need to move backups of certain data sources to other storage for optimized resource utilization. MABS V3 gives you the capability to migrate your backups and configure them to be stored to a different volume in [three steps](https://techcommunity.microsoft.com/t5/system-center-blog/sc-2016-dpm-ur4-migrate-backup-storage-in-3-simple-steps/ba-p/351842).

### Prevent unexpected data loss

In enterprises, MABS is managed by a team of administrators. While there are guidelines on storage that should be used for backups, an incorrect volume given to MABS as backup storage may lead to loss of critical data. With MABS V3, you can prevent such scenarios by configuring those volumes as the ones that aren't available for storage using [these PowerShell cmdlets](./backup-mabs-add-storage.md).

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

MABS V3 can be installed on Windows Server 2019. To use MABS V3 with WS2019, you can either upgrade your OS to WS2019 before installing/upgrading to MABS V3 or you can upgrade your OS after installing/upgrading V3 on WS2016.

MABS V3 is a full release, and can be installed directly on Windows Server 2016, Windows Server 2019, or can be upgraded from MABS V2. Before you upgrade to or install Backup Server V3, read about the installation prerequisites.
Find more information about the installation/upgrade steps for MABS [here](./backup-azure-microsoft-azure-backup.md#software-package).

> [!NOTE]
>
> MABS has the same code base as System Center Data Protection Manager. MABS v3 is equivalent to Data Protection Manager 1807. MABS v3 UR1 is equivalent to Data Protection Manager 2019 UR1.

## Next steps

Learn how to prepare your server or begin protecting a workload:

* [Prepare Backup Server workloads](backup-azure-microsoft-azure-backup.md)
* [Use Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md)
* [Use Backup Server to back up SQL Server](backup-azure-sql-mabs.md)
* [Use Modern Backup Storage with Backup Server](backup-mabs-add-storage.md)