---
title: MABS & System Center DPM support matrix
description: This article summarizes Azure Backup support when you use Microsoft Azure Backup Server (MABS) or System Center DPM to back up on-premises and Azure VM resources.
ms.date: 04/20/2023
ms.topic: conceptual
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for backup with Microsoft Azure Backup Server or System Center DPM

You can use the [Azure Backup service](backup-overview.md) to back up on-premises machines and workloads, and Azure virtual machines (VMs). This article summarizes support settings and limitations for backing up machines by using Microsoft Azure Backup Server (MABS) or System Center Data Protection Manager (DPM), and Azure Backup.

## About DPM/MABS

[System Center DPM](/system-center/dpm/dpm-overview) is an enterprise solution that configures, facilitates, and manages backup and recovery of enterprise machines and data. It's part of the [System Center](https://www.microsoft.com/system-center/pricing) suite of products.

MABS is a server product that can be used to back up on-premises physical servers, VMs, and apps running on them.

MABS is based on System Center DPM and provides similar functionality with a few differences:

- No System Center license is required to run MABS.
- For both MABS and DPM, Azure provides long-term backup storage. In addition, DPM allows you to back up data for long-term storage on tape. MABS doesn't provide this functionality.
- [You can back up a primary DPM server with a secondary DPM server](/system-center/dpm/back-up-the-dpm-server). The secondary server will protect the primary server database and the data source replicas stored on the primary server. If the primary server fails, the secondary server can continue to protect workloads that are protected by the primary server, until the primary server is available again.  MABS doesn't provide this functionality.

You can download MABS from the [Microsoft Download Center](https://go.microsoft.com/fwLink/?LinkId=626082). It can be run on-premises or on an Azure VM.

DPM and MABS support backing up a wide variety of apps, and server and client operating systems. They provide multiple backup scenarios:

- You can back up at the machine level with system-state or bare-metal backup.
- You can back up specific volumes, shares, folders, and files.
- You can back up specific apps by using optimized app-aware settings.

## DPM/MABS backup

Backup using DPM/MABS and Azure Backup works as follows:

1. DPM/MABS protection agent is installed on each machine that will be backed up.
1. Machines and apps are backed up to local storage on DPM/MABS.
1. The Microsoft Azure Recovery Services (MARS) agent is installed on the DPM server/MABS.
1. The MARS agent backs up the DPM/MABS disks to a backup Recovery Services vault in Azure by using Azure Backup.

For more information:

- [Learn more](backup-architecture.md#architecture-back-up-to-dpmmabs) about MABS architecture.
- [Review what's supported](backup-support-matrix-mars-agent.md) for the MARS agent.

## Supported scenarios

**Scenario** | **Agent** | **Location**
--- | --- | ---
**Back up on-premises machines/workloads** | DPM/MABS protection agent runs on the machines that you want to back up.<br/><br/> The MARS agent on DPM/MABS server.<br/> The minimum version of the Microsoft Azure Recovery Services agent, or Azure Backup agent, required to enable this feature is 2.0.8719.0.  | DPM/MABS must be running on-premises.

## Supported deployments

DPM/MABS can be deployed as summarized in the following table.

**Deployment** | **Support** | **Details**
--- | --- | ---
**Deployed on-premises** | Physical server, but not in a physical cluster.<br/><br/>Hyper-V VM. You can deploy MABS as a guest machine on a standalone hypervisor or cluster. It can’t be deployed on a node of a cluster or standalone hypervisor. The Azure Backup Server is designed to run on a dedicated, single-purpose server.<br/><br/> As a Windows virtual machine in a VMware environment. | On-premises MABS servers can't protect Azure-based workloads. <br><br> For more information, see [protection matrix](backup-mabs-protection-matrix.md).
**Deployed as an Azure Stack VM** | MABS only | DPM can't be used to back up Azure Stack VMs.
**Deployed as an Azure VM** | Protects Azure VMs and workloads that are running on those VMs | DPM/MABS running in Azure can't back up on-premises machines. It can only protect workloads that are running in Azure IaaS VMs.

## Supported MABS and DPM operating systems

Azure Backup can back up DPM/MABS instances that are running any of the following operating systems. Operating systems should be running the latest service packs and updates.

**Scenario** | **DPM/MABS**
--- | ---
**MABS on an Azure VM** |  MABS v4 and later: Windows 2022 Datacenter, Windows 2019 Datacenter <br><br> MABS v3, UR1 and UR2: Windows 2019 Datacenter, Windows 2016 Datacenter <br/><br/> We recommend that you start with an image from the marketplace.<br/><br/> Minimum Standard_A4_v2 with four cores and 8-GB RAM.
**DPM on an Azure VM** | System Center 2012 R2 with Update 3 or later<br/><br/> Windows operating system as [required by System Center](/system-center/dpm/prepare-environment-for-dpm#dpm-server).<br/><br/> We recommend that you start with an image from the marketplace.<br/><br/> Minimum Standard_A4_v2 with four cores and 8-GB RAM.
**MABS on-premises** |  MABS v4 and later: Windows Server 2022 or Windows Server 2019 <br><br> MABS v3, UR1 and UR2: Windows Server 2019 and Windows Server 2016
**DPM on-premises** | Physical server/Hyper-V VM: System Center 2012 SP1 or later.<br/><br/> VMware VM: System Center 2012 R2 with Update 5 or later.

>[!NOTE]
>Installing Azure Backup Server isn't supported on Windows Server Core or Microsoft Hyper-V Server.

## Management support

**Issue** | **Details**
--- | ---
**Installation** | Install DPM/MABS on a single-purpose machine.<br/><br/> Don't install DPM/MABS on a domain controller, on a machine with the Application Server role installation, on a machine that's running Microsoft Exchange Server or System Center Operations Manager, or on a cluster node.<br/><br/> [Review all DPM system requirements](/system-center/dpm/prepare-environment-for-dpm#dpm-server).
**Domain** | The server on which DPM/MABS will be installed should be joined to a domain before the installation begins. Moving DPM/MABS to a new domain after deployment isn't supported.
**Storage** | Modern backup storage (MBS) is supported from DPM 2016/MABS v2 and later. It isn't available for MABS v1.
**MABS upgrade** | You can directly install MABS v4, or upgrade to MABS v4 from MABS v3 UR1 and UR2. [Learn more](backup-azure-microsoft-azure-backup.md#upgrade-mabs).
**Moving MABS** | Moving MABS to a new server while retaining the storage is supported if you're using MBS.<br/><br/> The server must have the same name as the original. You can't change the name if you want to keep the same storage pool, and use the same MABS database to store data recovery points.<br/><br/> You'll need a backup of the MABS database because you'll need to restore it.

>[!NOTE]
>Renaming the DPM/MABS server isn't supported.

## MABS support on Azure Stack

You can deploy MABS on an Azure Stack VM so that you can manage backup of Azure Stack VMs and workloads from a single location.

**Component** | **Details**
--- | ---
**MABS on Azure Stack VM** | At least size A2. We recommend you start with a Windows Server 2019 or Windows Server 2022 image from Azure Marketplace.<br/><br/> Don't install anything else on the MABS VM.
**MABS storage** | Use a separate storage account for the MABS VM. The MARS agent running on MABS needs temporary storage for a cache location and to hold data restored from the cloud.
**MABS storage pool** | The size of the MABS storage pool is determined by the number and size of disks that are attached to the MABS VM. Each Azure Stack VM size has a maximum number of disks. For example, A2 is four disks.
**MABS retention** | Don't retain backed up data on the local MABS disks for more than five days.
**MABS scale up** | To scale up your deployment, you can increase the size of the MABS VM. For example, you can change from A to D series.<br/><br/> You can also ensure that you're offloading data with backup to Azure regularly. If necessary, you can deploy additional MABS servers.
**.NET Framework on MABS** | The MABS VM needs .NET Framework 4.5 or later installed on it.
**MABS domain** | The MABS VM must be joined to a domain. A domain user with admin privileges must install MABS on the VM.
**Azure Stack VM data backup** | You can back up files, folders, and apps.
**Supported backup** | These operating systems are supported for VMs that you want to back up: <br/><br/>  Windows Server 2022, Windows Server 2019, Windows Server 20016, Windows Server 2012, Windows Server 2012 R2
**SQL Server support for Azure Stack VMs** | Back up SQL Server 2022, SQL Server 2019, SQL Server 2017, SQL Server 2016 (SPs), and SQL Server 2014 (SPs).<br/><br/> Back up and recover a database.
**SharePoint support for Azure Stack VMs** | SharePoint 2019, SharePoint 2016 with latest SPs.<br/><br/> Back up and recover a farm, database, front end, and web server.
**Network requirements for backed up VMs** | All VMs in Azure Stack workload must belong to the same virtual network and belong to the same subscription.

## Networking and access support

[!INCLUDE [Configuring network connectivity](../../includes/backup-network-connectivity.md)]

### DPM/MABS connectivity to Azure Backup

Connectivity to the Azure Backup service is required for backups to function properly, and the Azure subscription should be active. The following table shows the behavior if these two things don't occur.

**MABS to Azure** | **Subscription** | **Backup/Restore**
--- | --- | ---
Connected | Active | Back up to DPM/MABS disk.<br/><br/> Back up to Azure.<br/><br/> Restore from disk.<br/><br/> Restore from Azure.
Connected | Expired/deprovisioned | No backup to disk or Azure.<br/><br/> If the subscription is expired, you can restore from disk or Azure.<br/><br/> If the subscription is decommissioned, you can't restore from disk or Azure. The Azure recovery points are deleted.
No connectivity for more than 15 days | Active | No backup to disk or Azure.<br/><br/> You can restore from disk or Azure.
No connectivity for more than 15 days | Expired/deprovisioned | No backup to disk or Azure.<br/><br/> If the subscription is expired, you can restore from disk or Azure.<br/><br/> If the subscription is decommissioned, you can't restore from disk or Azure. The Azure recovery points are deleted.

## Domain and Domain trusts support

|Requirement |Details |
|---------|---------|
|Domain    | The DPM/MABS server should be in a Windows Server 2022, Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012 domain.        |
|Domain trust   |  DPM/MABS supports data protection across forests, as long as you establish a forest-level, two-way trust between the separate forests.   <BR><BR>   DPM/MABS can protect servers and workstations across domains, within a forest that has a two-way trust relationship with the DPM/MABS server domain. To protect computers in workgroups or untrusted domains, see [Back up and restore workloads in workgroups and untrusted domains.](/system-center/dpm/back-up-machines-in-workgroups-and-untrusted-domains) <br><br> To back up Hyper-V server clusters, they must be located in the same domain as the MABS server or in a trusted or child domain. You can back up servers and clusters in an untrusted domain or workload using NTLM or certificate authentication for a single server, or certificate authentication only for a cluster.  |

## DPM/MABS storage support

Data that's backed up to DPM/MABS is stored on local disk storage.

USB or removable drives aren't supported.

NTFS compression isn't supported on DPM/MABS volumes.

BitLocker can only be enabled after you add the disk the storage pool. Don't enable BitLocker before adding it.

Network-attached storage (NAS) isn't supported for use in the DPM storage pool.

**Storage** | **Details**
--- | ---
**MBS** | Modern backup storage (MBS) is supported from DPM 2016/MABS v2 and later. It isn't available for MABS v1.
**MABS storage on Azure VM** | Data is stored on Azure disks that are attached to the DPM/MABS VM, and that are managed in DPM/MABS. The number of disks that can be used for DPM/MABS storage pool is limited by the size of the VM.<br/><br/> A2 VM: 4 disks; A3 VM: 8 disks; A4 VM: 16 disks, with a maximum size of 1 TB for each disk. This determines the total backup storage pool that's available.<br/><br/> The amount of data you can back up depends on the number and size of the attached disks.
**MABS data retention on Azure VM** | We recommend that you retain data for one day on the DPM/MABS Azure disk, and back up from DPM/MABS to the vault for longer retention. This way you can protect a larger amount of data by offloading it to Azure Backup.

### Modern backup storage (MBS)

From DPM 2016/MABS v2 (running on Windows Server 2016) and later, you can take advantage of modern backup storage (MBS).

- MBS backups are stored on a Resilient File System (ReFS) disk.
- MBS uses ReFS block cloning for faster backup and more efficient use of storage space.
- When you add volumes to the local DPM/MABS storage pool, you configure them with drive letters. You can then configure workload storage on different volumes.
- When you create protection groups to back up data to DPM/MABS, you select the drive you want to use. For example, you might store backups for SQL or other high IOPS workloads on a high-performance drive, and store workloads that are backed up less frequently on a lower performance drive.

## Supported backups to MABS

For information on the various servers and workloads that you can protect with Azure Backup Server, refer to the [Azure Backup Server Protection Matrix](./backup-mabs-protection-matrix.md#protection-support-matrix).

## Supported backups to DPM

For information on the various servers and workloads that you can protect with Data Protection Manager, refer to the article [What can DPM back up?](/system-center/dpm/dpm-protection-matrix).

- Clustered workloads backed up by DPM/MABS should be in the same domain as DPM/MABS or in a child/trusted domain.
- You can use NTLM/certificate authentication to back up data in untrusted domains or workgroups.

## Deduplicated volumes support

Deduplication support for MABS depends on operating system support.

### For NTFS volumes with MABS v4

| Operating system of protected server | Operating system of MABS server | MABS version | Dedupe support |
| --- | --- | --- | --- |
| Windows Server 2022 | Windows Server 2022 | MABS v4 | Y  |
| Windows Server 2019 | Windows Server 2022 | MABS v4 | Y  |
| Windows Server 2016 | Windows Server 2022 | MABS v4 | Y* |
| Windows Server 2022 | Windows Server 2019 | MABS v4 | N  |
| Windows Server 2019 | Windows Server 2019 | MABS v4 | Y  |
| Windows Server 2016 | Windows Server 2019 | MABS v4 | Y* |

**Deduped NTFS volumes in Windows Server 2016 Protected Servers are non-deduplicated during restore.*


### For NTFS volumes with MABS v3

| Operating   system of protected server  | Operating   system of MABS server  | MABS version  | Dedupe support |
| ------------------------------------------ | ------------------------------------- | ------------------ | -------------------- |
| Windows  Server 2019                       | Windows  Server 2019                  | MABS v3            | Y                    |
| Windows  Server 2016                       | Windows  Server 2019                  | MABS v3            | Y*                   |
| Windows  Server 2012 R2                    | Windows  Server 2019                  | MABS v3            | N                    |
| Windows  Server 2012                       | Windows Server  2019                  | MABS v3            | N                    |
| Windows  Server 2019                       | Windows  Server 2016                  | MABS v3            | Y**                  |
| Windows  Server 2016                       | Windows  Server 2016                  | MABS v3            | Y                    |
| Windows  Server 2012 R2                    | Windows  Server 2016                  | MABS v3            | Y                    |
| Windows  Server 2012                       | Windows  Server 2016                  | MABS v3            | Y                    |

- \* When protecting a WS 2016 NTFS deduped volume with MABS v3 running on WS 2019, the recoveries may be affected. We have a fix for doing recoveries in a non-deduped way. Reach out to MABS support if you need this fix on MABS v3 UR1.
- \** When protecting a WS 2019 NTFS deduped volume with MABS v3 on WS 2016, the backups and restores will be non-deduped. This means that the backups will consume more space on the MABS server than the original NTFS deduped volume.

**Issue**: If you upgrade the protected server operating system from Windows Server 2016 to Windows Server 2019, then the backup of the NTFS deduped volume will be affected due to changes in the deduplication logic.

**Workaround**: Reach out to MABS support in case you need this fix for MABS v3 UR1.

### For ReFS Volumes

- We've identified a few issues with backups of deduplicated ReFS volumes. We're working on fixing these, and will update this section as soon as we have a fix available. Until then, we're removing the support for backup of deduplicated ReFS volumes from MABS v3 and v4.

- MABS v3 UR1, MABS v4, and later continues to support protection and recovery of normal ReFS volumes.

## Next steps

- [Learn more](backup-architecture.md#architecture-back-up-to-dpmmabs) about MABS architecture.
- [Review](backup-support-matrix-mars-agent.md) what's supported for the MARS agent.
- [Set up](backup-azure-microsoft-azure-backup.md) a MABS server.
- [Set up DPM](/system-center/dpm/install-dpm).
