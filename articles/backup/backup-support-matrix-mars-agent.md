---
title: Support matrix for backup of machines running the Microsoft Azure Recovery Services (MARS) agent with Azure Backup
description: This article summarizes Azure Backup support when you back up machines running the Microsoft Azure Recovery Services (MARS) agent.
services: backup
author: rayne-wiselman
ms.service: backup
ms.date: 02/17/2019
ms.topic: conceptual
ms.author: raynew
manager: carmonm
---

# Support matrix for backup with the Microsoft Azure Recovery Services (MARS) agent

You can use the [Azure Backup service](backup-overview.md) to back up on-premises machines and apps, and Azure VMs. This article summarizes support settings and limitations for backing up machines with the Microsoft Azure Recovery Services (MARS) agent.

## About the MARS agent

The MARS agent is used by Azure Backup to back up data from on-premises machines and Azure VMs to a backup Recovery Services vault in Azure. The MARS agent can be used as follows:
- Run the agent on on-premises Windows machines so that they can back up directly to a backup Recovery Services vault in Azure.
- Run the agent on Windows Azure VMs so that it can back up directly to a vault.
- Run the agent on a Microsoft Azure Backup Server (MABS) or a System Center Data Protection - Manager (DPM) server. In this scenario, machines and workloads back up to MABS/DPM, and then MABS/DPM is backed back up to a vault in Azure using the MARS agent. 

What you can back up depends on where the agent is installed.

- [Learn more](backup-architecture.md#architecture-direct-backup-of-on-premises-windows-machinesazure-vm-filesfolders) about backup architecture using the MARS agent.
- Learn more about MABS/DPM [backup architecture](backup-architecture.md#architecture-back-up-to-dpmmabs)and [requirements](backup-support-matrix-mabs-dpm.md).


## Supported installation

**Install** | **Details**
--- | ---
**Download latest MARS agent** | You can download the latest version of the agent from the vault, or [download it directly](https://aka.ms/azurebackup_agent).
**Install directly on a machine** | You can install the MARS agent directly on an on-premises Windows server, or Windows Azure VM running any of the [supported operating systems](backup-support-matrix-mabs-dpm.md#supported-mabs-and-dpm-operating-systems).
**Install on a backup server** | When you set up DPM or MABS to back up to Azure, you download and install the MARS agent on the server. The agent can be installed in accordance with the [supported operating systems](backup-support-matrix-mabs-dpm.md#supported-mabs-and-dpm-operating-systems) in the backup server support matrix.

> [!NOTE]
> By default Azure VMs enabled for backup have an Azure Backup extension installation. This extension backs up the entire VM. You can install and run the MARS agent on an Azure VM alongside the extension if you want to back up specific folders and files, rather than the complete VM.
> When you run the MARS agent on an Azure VM, it backs up files/folders located in temporary storage on the VM. Backups will fail if the files/folders are removed from the temporary storage, or if the temporary storage is removed.


## Cache folder support

When you back up with the MARS agent, the agent takes a snapshot of the data and stores it in a local cache folder before sending it to Azure. The cache (scratch) folder has a number of requirements.

**Cache** | **Details**
--- | ---
**Cache size** |  Free space on cache folder size should be at least 5-10% of the overall size of your backup data. 
**Cache location** | The cache folder must be local to the machine being backed up, and must be online.<br/><br/> The cache folder shouldn't be located on a network share, on removable media, or on an offline volume. 
**Cache folder** | The cache folder should be encrypted, on a deduplicated volume, or on a folder that's compressed/sparse/reparse-point
**Modify cache location** | You can change the cache location by stopping the backup engine (net stop bengine), and copying the cache folder to a new drive (ensure it has sufficient space). Then you update two registry entries under  HKLM\SOFTWARE\Microsoft\Windows Azure Backup (Config/ScratchLocation and Config/CloudBackupProvider/ScratchLocation) to the new location, and restart the engine.

## Networking and access support

### URL access

The MARS agent needs access to these URLs:

- http://www.msftncsi.com/ncsi.txt
- *.Microsoft.com
- *.WindowsAzure.com
- *.microsoftonline.com
- *.windows.net

### Throttling support

**Feature** | **Details**
--- | ---
Bandwidth control | Supported<br/><br/> Use **Change Properties** in the MARS agent to adjust bandwidth.
Network throttling | Not available for backed up machines running Windows Server 2008 R2, Windows Server 2008 SP2, or Windows 7.

## Support for direct backups

The following table summarizes which operating systems running on on-premises machines and Azure VMs can be backed up directly to Azure with the MARS agent.

- All operating systems are 64-bit.
- All operating systems should be running the latest services packs and updates.
- For details about which DPM and MABS servers can be backed up with the MARS agent, review [this table](backup-support-matrix-mabs-dpm.md#supported-mabs-and-dpm-operating-systems).

**Operating system** | **Files/folders** | **System state**
--- | --- | ---
Windows 10 (Enterprise, Pro, Home) | Yes | No
Windows 8.1 (Enterprise, Pro)| Yes |No
Windows 8 (Enterprise, Pro) | Yes | No
Windows 7 (Ultimate, Enterprise, Pro, Home Premium/Basic, Starter) | Yes | No
Windows Server 2016 (Standard, Datacenter, Essentials) | Yes | Yes
Windows Server 2012 R2 (Standard, Datacenter, Foundation, Essentials) | Yes | Yes
Windows Server 2012 (Standard, Datacenter, Foundation) | Yes | Yes
Windows Server 2008 R2 (Standard, Enterprise, Datacenter, Foundation) | Yes | Yes
Windows Server 2008 SP2 (Standard, Datacenter, Foundation) | Yes | No
Windows Storage Server 2016/2012 R2/2012(Standard, Workgroup | Yes | No


## Backup limits

Azure Backup places a limit on the size of a file/folder data source that can be backed up. The size of items selected for backup from a single volume can't exceed the sizes summarized in the table.

**Operating system** | **Size limit**
--- | ---
Windows Server 2012 or later |	54,400 GB
Windows Server 2008 R2 SP1 |	1700 GB
Windows Server 2008 SP2	| 1700 GB
Windows 8 or later	| 54,400 GB
Windows 7	| 1700 GB


## Supported file types for backup

**Type** | **Supported** 
--- | --- 
Encrypted	| Yes 
Compressed | Yes
Sparse | Yes 
Compressed and sparse |	Yes
Hard links	| Not supported<br/><br/> Skipped
Reparse point	| Not supported<br/><br/> Skipped
Encrypted and sparse |	Not supported<br/><br/> Skipped
Compressed stream	| Not supported<br/><br/> Skipped
Sparse stream	| Not supported<br/><br/> Skipped
One Drive (synched files are sparse streams)	| Not supported 

## Supported drives/volumes for backup

**Drive/volume** | **Supported** | **Details**
--- | --- | ---
Read-only volumes	| Not supported | The volume must be writable for the VSS to work.
Offline volumes	| Not supported |	The volume must be online for VSS to work.
Network share	| Not supported |	The volume must be local on the server for backup.
Bitlocker-protected volumes	| Not supported |	The volume must be unlocked before for backup to work.
File System Identification	| Not supported |	NTFS only.
Removable media	| Not supported |	All backup item sources must have status of fixed.
Deduplicated drives | Supported.<br/><br/> Azure Backup converts deduplicated data to normal data. It the optimizes the data, encrypts it, stores and sends it to the vault.

## Support for initial offline backup

Azure Backup supports "offline seeding" to transfer initial backup data to Azure using disks. This is helpful if your initial backup is likely to be in the range of terabytes (TBs). Offline backup is supported for:

- Direct backup of files and folders on on-premises machines running the MARS agent.
- Backup of workloads and files from a DPM server or MABS.
- Offline backup cna't be used for system state files.


## Support for restore

- The new [instant restore](backup-instant-restore-capability.md) release of Azure Backup allows you to restore data before it's been copied to the vault.<br/><br/> To use this feature the machine being backed up must be running .NET Framework 4.5.2 or higher.
- Backups can't be restored to a target machine running an earlier version of the operating system. For example, a backup taken from a Windows 7 computer can be restored on Windows 8 or later. However, a backup taken from a Windows 8 computer can't be restored to a Windows 7 computer.


## Next steps
- [Learn more](backup-architecture.md#architecture-direct-backup-of-on-premises-windows-machinesazure-vm-filesfolders) about backup architecture with the MARS agent.
- [Learn](backup-support-matrix-mabs-dpm.md) what's supported when you run the MARS agent on Microsoft Azure Backup Server (MABS) or System Center DPM.


