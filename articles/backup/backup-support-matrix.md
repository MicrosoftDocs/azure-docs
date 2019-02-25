---
title: Azure Backup support matrix
description: Provides a summary of support settings and limitations for the Azure Backup service.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 02/17/2019
ms.author: raynew
---

# Azure Backup support matrix

You can use the [Azure Backup service](backup-overview.md) to back up data to the Microsoft Azure cloud. This articles summarizes general support settings and limitations for Azure Backup scenarios and deployments.

Other support matrices are available:

[Support matrix](backup-support-matrix-iaas.md) for Azure VM backup
[Support matrix](backup-support-matrix-mabs-dpm.md) for backup using System Center DPM/Microsoft Azure Backup server (MABS)
[Support matrix](backup-support-matrix-mars-agent.md) for backing using the Microsoft Azure Recovery Services (MARS) agent

## Vault support

Azure Backups uses Recovery Services vaults to orchestrate and manage backups, and to store backed up data.

**Setting** | **Details**
--- | ---
**Vaults in subscription** | Up to 500 Recovery Services vaults in a single subscription.
**Machines in a vault** | Up to 1000 Azure VMs in a single vault.<br/><br/> Up to 50 MABS servers can be registered in a single vault.
**Data sources in vault storage** | Maximum 54400 GB. There's no limit for Azure VM backups.
**Backups to vault** | Azure VMs: once a day<br/><br/>Machines protected by DPM/MABS: twice a day<br/><br/> Machines backed up directly using MARS agent: three times a day. 
**Backups between vaults** | Backup is within a region.<br/><br/> You need a vault in every Azure region that contains VMs you want to back up. You can't back up to a different region. 
**Move vault** | You can [move vaults](https://review.docs.microsoft.com/azure/backup/backup-azure-move-recovery-services-vault) across subscriptions, or between resource groups in the same subscription.
**Move data between vaults** | Moving backed up data between vaults isn't supported.
**Modify vault storage type** | You can modify the storage replication type (GRS/LRS) for a vault before backups are stored. After backups begin in the vault, the replication type can't be modified.



## On-premises backup support

Here's what's supported if you want to back up on-premises machines.

**Machine** | **Backed up** | **Location** | **Features**
--- | --- | --- | ---
**Direct backup of Windows machine with MARS agent** | Files, folders, system state | Back up to Recovery services vault | Backup three times a day.<br/><br/> No app-aware backup.<br/><br/> Restore file, folder, volume.
**Direct backup of Linux machine with MARS agent** | Backup not supported.
**Backup to DPM** | Files, folders, volumes, system state, app data. | Back up to local DPM storage. DPM then backs up to vault. | App-aware snapshots<br/><br/> Full granularity for backup and recovery.<br/><br/> Linux supported for VMs (Hyper-V/VMware).<br/><br/>. Oracle not supported.
**Back to MABS** | Files, folders, volumes, system state, app data. | Back up to MABS local storage. MABS then backs up to the vault. | App-aware snapshots<br/><br/> Full granularity for backup and recovery.<br/><br/> Linux supported for VMs (Hyper-V/VMware).<br/><br/>. Oracle not supported.


## Azure VM backup support

### Azure VM limits

**Limit** | **Details**
--- | ---
Azure VM data disks | Limit of 16.
Azure VM data disk size | Individual disk can be up to 4095 GB.


### Azure VM backup options

Here's what's supported if you want to back up Azure VMs.

**Machine** | **Backed up** | **Location** | **Features**
--- | --- | --- | ---
**Azure VM backup using VM extension** | Entire VM | Backup to vault | Extension installed when you enable backup for a VM.<br/><br/> Backup once a day.<br/><br/> App-aware backup for Windows VMs, file-consistent backup for Linux VMs. You can configure app-consistency for Linux machines using custom scripts.<br/><br/> Restore VM/disk.<br/><br/> Can't back up on Azure VM to an on-premises location.
**Azure VM backup using MARS agent** | Files, folders | Backup to vault | Backup three times a day.<br/><br/> The MARS agent can run alongside the VM extension if you want to back up specific files/folders rather than the entire VM.
**Azure VM with DPM** | Files, folders, volumes, system state, app data. | Back up to local storage of Azure VM running DPM. DPM then backs up to vault. | App-aware snapshots<br/><br/> Full granularity for backup and recovery.<br/><br/> Linux supported for VMs (Hyper-V/VMware).<br/><br/>. Oracle not supported.
**Azure VM with MABS** | Files, folders, volumes, system state, app data. | Backed up to local storage of Azure VM running MABS. MABS then backs up to the vault. | App-aware snapshots<br/><br/> Full granularity for backup and recovery.<br/><br/> Linux supported for VMs (Hyper-V/VMware).<br/><br/> Oracle not supported.





## Linux backup support

Here's what's supported if you want to back up Linux machines.

**Backup** | **Linux (Azure endorsed)**
--- | ---
**Direct backup of on-premises machine running Linux**. | No. The MARS agent can only be installed on Windows machines.
**Back up Azure VM running Linux (using agent extension)** | App-consistent backup using [custom scripts](backup-azure-linux-app-consistent.md).<br/><br/> File-level recovery.<br/><br/> Restore by creating a VM from a recovery point or disk.
**Back up on-premises or Azure VM running Linux using DPM** | File-consistent backup of Linux Guest VMs on Hyper-V and VMWare<br/><br/> VM restore of Hyper-V and VMWare Linux Guest VMs</br></br> File-consistent backup not available for Azure VMs
**Back up on-premises machine/Azure VM running Linux using MABS** | File-consistent backup of Linux Guest VMs on Hyper-V and VMWare<br/><br/> VM restore of Hyper-V and VMWare Linux guest VMs</br></br> File-consistent backup not available for Azure VMs.

## Daylight saving support

Azure Backup doesn't support automatic clock adjustment for daylight-saving changes for Azure VM backups. Modify backup policies manually as required.


## Disk deduplication support

Disk deduplication support is as follows:
- Disk dedup is supported on-premises when you use DPM or MABs to back up Hyper-V VMs running Windows. Windows Server performs data deduplication (at the host level) on virtual hard disks (VHDs) that are attached to the virtual machine as backup storage.
- Deduplication isn't supported in Azure for any Backup component. When System Center DPM and Backup Server are deployed in Azure, the storage disks attached to the VM can't be deduplicated.


## Security/encryption support

Azure Backup supports encryption for in-transit and at-rest data:

Network traffic to Azure:
- Backup traffic from servers to the Recovery Services vault is encrypted using Advanced Encryption Standard 256.
- Backup data is sent over a secure HTTPS link.
- The backup data is stored in the Recovery Services vault in encrypted form.
- Only you have the passphrase to unlock this data. Microsoft can't decrypt the backup data at any point.
    > [!WARNING]
    > After setting up the vault, only you have access to the encryption key. Microsoft never maintains a copy and doesn't have access to the key. If the key is misplaced, Microsoft can't recover the backup data.
Data security:
- When backing up Azure VMs you need to set up encryption *within* the virtual machine.
- Azure Backup supports Azure Disk Encryption, which uses BitLocker on Windows virtual machines and **dm-crypt** on Linux virtual machines.
- On the back end, Azure Backup uses [Azure Storage Service encryption](../storage/common/storage-service-encryption.md), which protects data at rest.


**Machine** | **In transit** | **At rest**
--- | --- | ---
On-premises Windows machines without DPM/MABS | ![Yes][green] | ![Yes][green]
Azure VMs | ![Yes][green] | ![Yes][green]
On-premises/Azure VMs with DPM | ![Yes][green] | ![Yes][green]
On-premises/Azure VMs with MABS | ![Yes][green] | ![Yes][green]



## Compression support

Backup supports the compression of backup traffic, as summarized in the table below. 

- For Azure VMs, the VM extension reads the data directly from the Azure storage account over the storage network, so it is not necessary to compress this traffic.
- If you're using DPM or MABS, you can compress the data before it's backed up to DPM/MABS, to save bandwidth.

**Machine** | **Compress to MABS/DPM (TCP)** | **Compress (HTTPS) to vault**
--- | --- | ---
**Direct backup of on-premises Windows machines** | NA | Yes
**Back up Azure VMs using VM extension** | NA | NA
**Back up on on-premises/Azure machines using MABS/DPM | ![Yes][green] | ![Yes][green]



## Retention limits

**Setting** | **Limits**
--- | ---
Max recovery points per protected instance (machine/workload | 9999
Max expiry time for a recovery point | No limit
Maximum backup frequency to DPM/MABS | Every 15 minutes for SQL Server<br/><br/> Once a hour for other workloads.
Maximum backup frequency to vault | On-premises Windows machines/Azure VMs running MARS: three per day<br/><br/> DPM/MABS: Two per day<br/><br/> Azure VM backup: Once a day
Recovery point retention | Daily, weekly, monthly, yearly.
Maximum retention period | Depends on backup frequency.
Recovery points on DPM/MABS disk | 64 for file servers, 448 for app servers.<br/><br/> Tape recovery points are unlimited for on-premises DPM.

## Next steps

- [Review support matrix](backup-support-matrix-iaas.md) for Azure VM backup.


[green]: ./media/backup-support-matrix/green.png
[yellow]: ./media/backup-support-matrix/yellow.png
[red]: ./media/backup-support-matrix/red.png
