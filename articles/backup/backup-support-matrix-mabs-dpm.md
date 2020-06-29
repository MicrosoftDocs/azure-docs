---
title: MABS & System Center DPM support matrix
description: This article summarizes Azure Backup support when you use Microsoft Azure Backup Server (MABS) or System Center DPM to back up on-premises and Azure VM resources.
ms.date: 02/17/2019
ms.topic: conceptual
---

# Support matrix for backup with Microsoft Azure Backup Server or System Center DPM

You can use the [Azure Backup service](backup-overview.md) to back up on-premises machines and workloads, and Azure virtual machines (VMs). This article summarizes support settings and limitations for backing up machines by using Microsoft Azure Backup Server (MABS) or System Center Data Protection Manager (DPM), and Azure Backup.

## About DPM/MABS

[System Center DPM](https://docs.microsoft.com/system-center/dpm/dpm-overview?view=sc-dpm-1807) is an enterprise solution that configures, facilitates, and manages backup and recovery of enterprise machines and data. It's part of the [System Center](https://www.microsoft.com/cloud-platform/system-center-pricing) suite of products.

MABS is a server product that can be used to back up on-premises physical servers, VMs, and apps running on them.

MABS is based on System Center DPM and provides similar functionality with a few differences:

- No System Center license is required to run MABS.
- For both MABS and DPM, Azure provides long-term backup storage. In addition, DPM allows you to back up data for long-term storage on tape. MABS doesn't provide this functionality.
- You can back up a primary DPM server with a secondary DPM server. The secondary server will protect the primary server database and the data source replicas stored on the primary server. If the primary server fails, the secondary server can continue to protect workloads that are protected by the primary server, until the primary server is available again.  MABS doesn't provide this functionality.

You download MABS from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57520). It can be run on-premises or on an Azure VM.

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
**Deployed on-premises** | Physical server<br/><br/>Hyper-V VM<br/><br/> VMware VM | If DPM/MABS is installed as a VMware VM, it only backs up VMware VMs and workloads that are running on those VMs.
**Deployed as an Azure Stack VM** | MABS only | DPM can't be used to back up Azure Stack VMs.
**Deployed as an Azure VM** | Protects Azure VMs and workloads that are running on those VMs | DPM/MABS running in Azure can't back up on-premises machines.

## Supported MABS and DPM operating systems

Azure Backup can back up DPM/MABS instances that are running any of the following operating systems. Operating systems should be running the latest service packs and updates.

**Scenario** | **DPM/MABS**
--- | ---
**MABS on an Azure VM** |  Windows 2016 Datacenter.<br/><br/> Windows 2019 Datacenter.<br/><br/> We recommend that you start with an image from the marketplace.<br/><br/> Minimum Standard_A4_v2 with four cores and 8-GB RAM.
**DPM on an Azure VM** | System Center 2012 R2 with Update 3 or later.<br/><br/> Windows operating system as [required by System Center](https://docs.microsoft.com/system-center/dpm/prepare-environment-for-dpm?view=sc-dpm-1807#dpm-server).<br/><br/> We recommend that you start with an image from the marketplace.<br/><br/> Minimum Standard_A4_v2 with four cores and 8-GB RAM.
**MABS on-premises** |  MABS v3 and later: Windows Server 2016 or Windows Server 2019
**DPM on-premises** | Physical server/Hyper-V VM: System Center 2012 SP1 or later.<br/><br/> VMware VM: System Center 2012 R2 with Update 5 or later.

>[!NOTE]
>Installing Azure Backup Server is not supported on Windows Server Core or Microsoft Hyper-V Server.

## Management support

**Issue** | **Details**
--- | ---
**Installation** | Install DPM/MABS on a single-purpose machine.<br/><br/> Don't install DPM/MABS on a domain controller, on a machine with the Application Server role installation, on a machine that is running Microsoft Exchange Server or System Center Operations Manager, or on a cluster node.<br/><br/> [Review all DPM system requirements](https://docs.microsoft.com/system-center/dpm/prepare-environment-for-dpm?view=sc-dpm-1807#dpm-server).
**Domain** | DPM/MABS should be joined to a domain. Install first, and then join DPM/MABS to a domain. Moving DPM/MABS to a new domain after deployment isn't supported.
**Storage** | Modern backup storage (MBS) is supported from DPM 2016/MABS v2 and later. It isn't available for MABS v1.
**MABS upgrade** | You can directly install MABS v3, or upgrade to MABS v3 from MABS v2. [Learn more](backup-azure-microsoft-azure-backup.md#upgrade-mabs).
**Moving MABS** | Moving MABS to a new server while retaining the storage is supported if you're using MBS.<br/><br/> The server must have the same name as the original. You can't change the name if you want to keep the same storage pool, and use the same MABS database to store data recovery points.<br/><br/> You will need a backup of the MABS database because you'll need to restore it.

## MABS support on Azure Stack

You can deploy MABS on an Azure Stack VM so that you can manage backup of Azure Stack VMs and workloads from a single location.

**Component** | **Details**
--- | ---
**MABS on Azure Stack VM** | At least size A2. We recommend you start with a Windows Server 2012 R2 or Windows Server 2016 image from the Azure Marketplace.<br/><br/> Don't install anything else on the MABS VM.
**MABS storage** | Use a separate storage account for the MABS VM. The MARS agent running on MABS needs temporary storage for a cache location and to hold data restored from the cloud.
**MABS storage pool** | The size of the MABS storage pool is determined by the number and size of disks that are attached to the MABS VM. Each Azure Stack VM size has a maximum number of disks. For example, A2 is four disks.
**MABS retention** | Don't retain backed up data on the local MABS disks for more than five days.
**MABS scale up** | To scale up your deployment, you can increase the size of the MABS VM. For example, you can change from A to D series.<br/><br/> You can also ensure that you're offloading data with backup to Azure regularly. If necessary, you can deploy additional MABS servers.
**.NET Framework on MABS** | The MABS VM needs .NET Framework 3.3 SP1 or later installed on it.
**MABS domain** | The MABS VM must be joined to a domain. A domain user with admin privileges must install MABS on the VM.
**Azure Stack VM data backup** | You can back up files, folders, and apps.
**Supported backup** | These operating systems are supported for VMs that you want to back up:<br/><br/> Windows Server Semi-Annual Channel (Datacenter, Enterprise, Standard)<br/><br/> Windows Server 2016, Windows Server 2012 R2, Windows Server 2008 R2
**SQL Server support for Azure Stack VMs** | Back up SQL Server 2016, SQL Server 2014, SQL Server 2012 SP1.<br/><br/> Back up and recover a database.
**SharePoint support for Azure Stack VMs** | SharePoint 2016, SharePoint 2013, SharePoint 2010.<br/><br/> Back up and recover a farm, database, front end, and web server.
**Network requirements for backed up VMs** | All VMs in Azure Stack workload must belong to the same virtual network and belong to the same subscription.

## DPM/MABS networking support

### URL access

The DPM server/MABS needs access to these URLs:

- `http://www.msftncsi.com/ncsi.txt`
- *.Microsoft.com
- *.WindowsAzure.com
- *.microsoftonline.com
- *.windows.net

### Azure ExpressRoute support

You can back up your data over Azure ExpressRoute with public peering (available for old circuits) and Microsoft peering. Backup over private peering is not supported.

With public peering: Ensure access to the following domains/addresses:

- `http://www.msftncsi.com/ncsi.txt`
- `microsoft.com`
- `.WindowsAzure.com`
- `.microsoftonline.com`
- `.windows.net`

With Microsoft peering, please select the following services/regions and relevant community values:

- Azure Active Directory (12076:5060)
- Microsoft Azure Region (according to the location of your Recovery Services vault)
- Azure Storage (according to the location of your Recovery Services vault)

For more details, see the [ExpressRoute routing requirements](https://docs.microsoft.com/azure/expressroute/expressroute-routing).

>[!NOTE]
>Public Peering is deprecated for new circuits.

### DPM/MABS connectivity to Azure Backup

Connectivity to the Azure Backup service is required for backups to function properly, and the Azure subscription should be active. The following table shows the behavior if these two things don't occur.

**MABS to Azure** | **Subscription** | **Backup/Restore**
--- | --- | ---
Connected | Active | Back up to DPM/MABS disk.<br/><br/> Back up to Azure.<br/><br/> Restore from disk.<br/><br/> Restore from Azure.
Connected | Expired/deprovisioned | No backup to disk or Azure.<br/><br/> If the subscription is expired, you can restore from disk or Azure.<br/><br/> If the subscription is decommissioned, you can't restore from disk or Azure. The Azure recovery points are deleted.
No connectivity for more than 15 days | Active | No backup to disk or Azure.<br/><br/> You can restore from disk or Azure.
No connectivity for more than 15 days | Expired/deprovisioned | No backup to disk or Azure.<br/><br/> If the subscription is expired, you can restore from disk or Azure.<br/><br/> If the subscription is decommissioned, you can't restore from disk or Azure. The Azure recovery points are deleted.

## DPM/MABS storage support

Data that is backed up to DPM/MABS is stored on local disk storage.

**Storage** | **Details**
--- | ---
**MBS** | Modern backup storage (MBS) is supported from DPM 2016/MABS v2 and later. It isn't available for MABS v1.
**MABS storage on Azure VM** | Data is stored on Azure disks that are attached to the DPM/MABS VM, and that are managed in DPM/MABS. The number of disks that can be used for DPM/MABS storage pool is limited by the size of the VM.<br/><br/> A2 VM: 4 disks; A3 VM: 8 disks; A4 VM: 16 disks, with a maximum size of 1 TB for each disk. This determines the total backup storage pool that is available.<br/><br/> The amount of data you can back up depends on the number and size of the attached disks.
**MABS data retention on Azure VM** | We recommend that you retain data for one day on the DPM/MABS Azure disk, and back up from DPM/MABS to the vault for longer retention. You can thus protect a larger amount of data by offloading it to Azure Backup.

### Modern backup storage (MBS)

From DPM 2016/MABS v2 (running on Windows Server 2016) and later, you can take advantage of modern backup storage (MBS).

- MBS backups are stored on a Resilient File System (ReFS) disk.
- MBS uses ReFS block cloning for faster backup and more efficient use of storage space.
- When you add volumes to the local DPM/MABS storage pool, you configure them with drive letters. You can then configure workload storage on different volumes.
- When you create protection groups to back up data to DPM/MABS, you select the drive you want to use. For example, you might store backups for SQL or other high IOPS workloads on a high-performance drive, and store workloads that are backed up less frequently on a lower performance drive.

## Supported backups to MABS

For information on the various servers and workloads that you can protect with Azure Backup Server, refer to the [Azure Backup Server Protection Matrix](https://docs.microsoft.com/azure/backup/backup-mabs-protection-matrix#protection-support-matrix).

## Supported backups to DPM

For information on the various servers and workloads that you can protect with Data Protection Manager, refer to the article [What can DPM back up?](https://docs.microsoft.com/system-center/dpm/dpm-protection-matrix?view=sc-dpm-2019).

- Clustered workloads backed up by DPM/MABS should be in the same domain as DPM/MABS or in a child/trusted domain.
- You can use NTLM/certificate authentication to back up data in untrusted domains or workgroups.

## Next steps

- [Learn more](backup-architecture.md#architecture-back-up-to-dpmmabs) about MABS architecture.
- [Review](backup-support-matrix-mars-agent.md) what's supported for the MARS agent.
- [Set up](backup-azure-microsoft-azure-backup.md) a MABS server.
- [Set up DPM](https://docs.microsoft.com/system-center/dpm/install-dpm?view=sc-dpm-180).
