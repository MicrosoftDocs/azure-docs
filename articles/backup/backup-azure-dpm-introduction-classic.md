<properties
	pageTitle="Introduction to Azure DPM backup | Microsoft Azure"
	description="An introduction to backing up DPM servers using the Azure Backup service"
	services="backup"
	documentationCenter=""
	authors="Nkolli1"
	manager="shreeshd"
	editor=""
	keywords="System Center Data Protection Manager, data protection manager, dpm backup"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/10/2016"
	ms.author="trinadhk;giridham;jimpark;markgal"/>

# Preparing to back up workloads to Azure with DPM

> [AZURE.SELECTOR]
- [Azure Backup Server](backup-azure-microsoft-azure-backup.md)
- [SCDPM](backup-azure-dpm-introduction.md)
- [Azure Backup Server (Classic)](backup-azure-microsoft-azure-backup-classic.md)
- [SCDPM (Classic)](backup-azure-dpm-introduction-classic.md)


This article provides an introduction to using Microsoft Azure Backup to protect your System Center Data Protection Manager (DPM) servers and workloads. By reading it, you’ll understand:

- How Azure DPM server backup works
- The prerequisites to achieve a smooth backup experience
- The typical errors encountered and how to deal with them
- Supported scenarios

System Center DPM backs up file and application data. Data backed up to DPM can be stored on tape, on disk, or backed up to Azure with Microsoft Azure Backup. DPM interacts with Azure Backup as follows:

- **DPM deployed as a physical server or on-premises virtual machine** — If DPM is deployed as a physical server or as an on-premises Hyper-V virtual machine you can back up data to an Azure Backup vault in addition to disk and tape backup.
- **DPM deployed as an Azure virtual machine** — From System Center 2012 R2 with Update 3, DPM can be deployed as an Azure virtual machine. If DPM is deployed as an Azure virtual machine you can back up data to Azure disks attached to the DPM Azure virtual machine, or you can offload the data storage by backing it up to an Azure Backup vault.

## Why backup your DPM servers?

The business benefits of using Azure Backup for backing up DPM servers include:

- For on-premises DPM deployment, you can use Azure backup as an alternative to long-term deployment to tape.
- For DPM deployments in Azure, Azure Backup allows you to offload storage from the Azure disk, allowing you to scale up by storing older data in Azure Backup and new data on disk.

## How does DPM server backup work?
To back up a virtual machine, first a point-in-time snapshot of the data is needed. The Azure Backup service initiates the backup job at the scheduled time, and triggers the backup extension to take a snapshot. The backup extension coordinates with the in-guest VSS service to achieve consistency, and invokes the blob snapshot API of the Azure Storage service once consistency has been reached. This is done to get a consistent snapshot of the disks of the virtual machine, without having to shut it down.

After the snapshot has been taken, the data is transferred by the Azure Backup service to the backup vault. The service takes care of identifying and transferring only the blocks that have changed from the last backup making the backups storage and network efficient. When the data transfer is completed, the snapshot is removed and a recovery point is created. This recovery point can be seen in the Azure management portal.

>[AZURE.NOTE] For Linux virtual machines, only file-consistent backup is possible.

## Prerequisites
Prepare Azure Backup to back up DPM data as follows:

1. **Create a Backup vault** — Create a vault in the Azure Backup console.
2. **Download vault credentials** — In Azure Backup, upload the management certificate you created to the vault.
3. **Install the Azure Backup Agent and register the server** — From Azure Backup, install the agent on each DPM server and register the DPM server in the backup vault.

[AZURE.INCLUDE [backup-create-vault](../../includes/backup-create-vault.md)]

[AZURE.INCLUDE [backup-download-credentials](../../includes/backup-download-credentials.md)]

[AZURE.INCLUDE [backup-install-agent](../../includes/backup-install-agent.md)]


## Requirements (and limitations)

- DPM can be running as a physical server or a Hyper-V virtual machine installed on System Center 2012 SP1 or System Center 2012 R2. It can also be running as an Azure virtual machine running on System Center 2012 R2 with at least DPM 2012 R2 Update Rollup 3 or a Windows virtual machine in VMWare running on System Center 2012 R2 with at least Update Rollup 5.
- If you’re running DPM with System Center 2012 SP1 you should install Update Roll up 2 for System Center Data Protection Manager SP1. This is required before you can install the Azure Backup Agent.
- The DPM server should have Windows PowerShell and .Net Framework 4.5 installed.
- DPM can back up most workloads to Azure Backup. For a full list of what’s supported see the Azure Backup support items below.
- Data stored in Azure Backup can’t be recovered with the “copy to tape” option.
- You’ll need an Azure account with the Azure Backup feature enabled. If you don't have an account, you can create a free trial account in just a couple of minutes. Read about [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
- Using Azure Backup requires the Azure Backup Agent to be installed on the servers you want to back up. Each server must have at least 10 % of the size of the data that is being backed up, available as local free storage. For example, backing up 100 GB of data requires a minimum of 10 GB of free space in the scratch location. While the minimum is 10%, 15% of free local storage space to be used for the cache location is recommended.
- Data will be stored in the Azure vault storage. There’s no limit to the amount of data you can back up to an Azure Backup vault but the size of a data source (for example a virtual machine or database) shouldn’t exceed 54400 GB.

These file types are supported for back up to Azure:

- Encrypted (Full backups only)
- Compressed (Incremental backups supported)
- Sparse (Incremental backups supported)
- Compressed and sparse (Treated as Sparse)

And these are unsupported:

- Servers on case-sensitive file systems aren’t supported.
- Hard links (Skipped)
- Reparse points (Skipped)
- Encrypted and compressed (Skipped)
- Encrypted and sparse (Skipped)
- Compressed stream
- Sparse stream

>[AZURE.NOTE] From in System Center 2012 DPM with SP1 onwards you can backup up workloads protected by DPM to Azure using Microsoft Azure Backup.
