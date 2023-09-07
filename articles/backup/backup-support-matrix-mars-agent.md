---
title: Support matrix for the MARS agent
description: This article summarizes Azure Backup support when you back up machines that are running the Microsoft Azure Recovery Services (MARS) agent.
ms.date: 12/28/2022
ms.topic: conceptual
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for backup with the Microsoft Azure Recovery Services (MARS) agent

You can use the [Azure Backup service](backup-overview.md) to back up on-premises machines and apps and to back up Azure virtual machines (VMs). This article summarizes support settings and limitations when you use the Microsoft Azure Recovery Services (MARS) agent to back up machines.

## The MARS agent

Azure Backup uses the MARS agent to back up data from on-premises machines and Azure VMs to a backup Recovery Services vault in Azure. The MARS agent can:

- Run on on-premises Windows machines so that they can back up directly to a backup Recovery Services vault in Azure.
- Run on Windows VMs so that they can back up directly to a vault.
- Run on Microsoft Azure Backup Server (MABS) or a System Center Data Protection Manager (DPM) server. In this scenario, machines and workloads back up to MABS or to the DPM server. The MARS agent then backs up this server to a vault in Azure.

> [!NOTE]
>Azure Backup doesn't support automatic adjustment of clock for daylight savings time (DST). Modify the policy to ensure daylight savings is taken into account to prevent discrepancy between the actual time and scheduled backup time.

Your backup options depend on where the agent is installed. For more information, see [Azure Backup architecture using the MARS agent](backup-architecture.md#architecture-direct-backup-of-on-premises-windows-server-machines-or-azure-vm-files-or-folders). For information about MABS and DPM backup architecture, see [Back up to DPM or MABS](backup-architecture.md#architecture-back-up-to-dpmmabs). Also see [requirements](backup-support-matrix-mabs-dpm.md) for the backup architecture.

**Installation** | **Details**
--- | ---
Download the latest MARS agent | You can download the latest version of the agent from the vault, or [download it directly](https://aka.ms/azurebackup_agent).
Install directly on a machine | You can install the MARS agent directly on an on-premises Windows server or on a Windows VM that's running any of the [supported operating systems](./backup-support-matrix-mabs-dpm.md#supported-mabs-and-dpm-operating-systems).
Install on a backup server | When you set up DPM or MABS to back up to Azure, you download and install the MARS agent on the server. You can install the agent on [supported operating systems](backup-support-matrix-mabs-dpm.md#supported-mabs-and-dpm-operating-systems) in the backup server support matrix.

> [!NOTE]
> By default, Azure VMs that are enabled for backup have an Azure Backup extension installation. This extension backs up the entire VM. You can install and run the MARS agent on an Azure VM alongside the extension if you want to back up specific folders and files, rather than the complete VM.
> When you run the MARS agent on an Azure VM, it backs up files or folders that are in temporary storage on the VM. Backups fail if the files or folders are removed from the temporary storage or if the temporary storage is removed.

## Cache folder support

When you use the MARS agent to back up data, the agent takes a snapshot of the data and stores it in a local cache folder before it sends the data to Azure. The cache (scratch) folder has several requirements:

**Cache** | **Details**
--- | ---
Size |  Free space in the cache folder should be at least 5 to 10 percent of the overall size of your backup data.
Location | The cache folder must be locally stored on the machine that's being backed up, and it must be online. The cache folder shouldn't be on a network share, on removable media, or on an offline volume.
Folder | The cache folder shouldn't be encrypted on a deduplicated volume or in a folder that's compressed, that's sparse, or that has a reparse point.
Location changes | You can change the cache location by stopping the backup engine (`net stop obengine`) and copying the cache folder to a new drive. (Ensure the new drive has sufficient space.) Then update two registry entries under **HKLM\SOFTWARE\Microsoft\Windows Azure Backup** (**Config/ScratchLocation** and **Config/CloudBackupProvider/ScratchLocation**) to the new location and restart the engine.

## Networking and access support

[!INCLUDE [Configuring network connectivity](../../includes/backup-network-connectivity.md)]

## Supported operating systems

>[!NOTE]
> The MARS agent does not support Windows Server Core SKUs.

You can use the MARS agent to back up directly to Azure on the operating systems listed below that run on:

1. On-premises Windows or Windows Servers
2. Azure VMs running Windows

The operating systems must be 64 bit and should be running the latest services packs and updates. The following table summarizes these operating systems:

**Operating system** | **Files/folders** | **System state** | **Software/Module requirements**
--- | --- | --- | ---
Windows 11 (Enterprise, Pro, Home, IoT Enterprise) | Yes | No |  Check the corresponding server version for software/module requirements
Windows 10 (Enterprise, Pro, Home, IoT Enterprise) | Yes | No |  Check the corresponding server version for software/module requirements
Windows 8.1 (Enterprise, Pro)| Yes |No | Check the corresponding server version for software/module requirements
Windows 8 (Enterprise, Pro) | Yes | No | Check the corresponding server version for software/module requirements
Windows Server 2022 (Standard, Datacenter, Essentials, Server IoT) | Yes | Yes |  Check the corresponding server version for software/module requirements
Windows Server 2019 (Standard, Datacenter, Essentials, Server IoT) | Yes | Yes | - .NET 4.5 <br> - Windows PowerShell <br> - Latest Compatible Microsoft VC++ Redistributable <br> - Microsoft Management Console (MMC) 3.0
Windows Server 2016 (Standard, Datacenter, Essentials) | Yes | Yes | - .NET 4.5 <br> - Windows PowerShell <br> - Latest Compatible Microsoft VC++ Redistributable <br> - Microsoft Management Console (MMC) 3.0
Windows Storage Server 2016/2012 R2/2012 (Standard, Workgroup) | Yes | No | - .NET 4.5 <br> - Windows PowerShell <br> - Latest Compatible Microsoft VC++ Redistributable <br> - Microsoft Management Console (MMC) 3.0
Windows Server 2012 R2 (Standard, Datacenter, Foundation, Essentials) | Yes | Yes | - .NET 4.5 <br> - Windows PowerShell <br> - Latest Compatible Microsoft VC++ Redistributable <br> - Microsoft Management Console (MMC) 3.0
Windows Server 2012 (Standard, Datacenter, Foundation) | Yes | Yes |- .NET 4.5 <br> -Windows PowerShell <br> - Latest Compatible Microsoft VC++ Redistributable <br> - Microsoft Management Console (MMC) 3.0 <br> - Deployment Image Servicing and Management (DISM.exe)


For more information, see [Supported MABS and DPM operating systems](backup-support-matrix-mabs-dpm.md#supported-mabs-and-dpm-operating-systems).

### Operating Systems at end of support

The following operating systems are at the end of support and it's strongly recommended to upgrade the operating system to continue to stay protected.

If existing commitments prevent upgrading the operating system, consider migrating the Windows servers to Azure VMs and leverage Azure VM backups to continue staying protected. Visit the [migration page here](https://azure.microsoft.com/migration/windows-server/) for more information about migrating your Windows server.

For on-premises or hosted environments, where you can't upgrade the operating system or migrate to Azure, activate Extended Security Updates for the machines to continue staying protected and supported. Notice that only specific editions are eligible for Extended Security Updates. Visit the [FAQ page](https://www.microsoft.com/windows-server/extended-security-updates) to learn more.

| **Operating   system**                                       | **Files/folders** | **System   state** | **Software/Module   requirements**                           |
| ------------------------------------------------------------ | ----------------- | ------------------ | ------------------------------------------------------------ |
| Windows 7 (Ultimate,  Enterprise, Pro, Home Premium/Basic, Starter) | Yes               | No                 | Check the corresponding  server version for software/module requirements |
| Windows Server 2008 R2  (Standard, Enterprise, Datacenter, Foundation) | Yes               | Yes                | - .NET 3.5, .NET 4.5 <br>  - Windows PowerShell <br>  - Compatible Microsoft VC++ Redistributable <br>  - Microsoft Management Console (MMC) 3.0 <br>  - Deployment Image Servicing and Management (DISM.exe) |
| Windows Server 2008 SP2  (Standard, Datacenter, Foundation)  | Yes               | No                 | - .NET 3.5, .NET 4.5 <br>  - Windows PowerShell <br>  - Compatible Microsoft VC++ Redistributable <br>  - Microsoft Management Console (MMC) 3.0 <br>  - Deployment Image Servicing and Management (DISM.exe) <br>  - Virtual Server 2005 base + KB KB948515 |

## Backup limits

### Size limits

Azure Backup limits the size of a file or folder data source that can be backed up. The items that you back up from a single volume can't exceed the sizes summarized in this table:

**Operating system** | **Size limit**
--- | ---
Windows Server 2012 or later |54,400 GB
Windows Server 2008 R2 SP1 |1,700 GB
Windows Server 2008 SP2| 1,700 GB
Windows 8 or later| 54,400 GB
Windows 7| 1,700 GB

### Retention limits

The following are the retention durations that can be set for the different recovery points:

|Recovery point |Minimum  | Maximum
|---------|---------| ---------
|Daily recovery point    |   7 days      | 9999 days
|Weekly recovery point     |    4 weeks     | 5163 weeks
|Monthly recovery point    |   3 months      | 1188 months
|Yearly recovery point  |      1 year   | 99 years

### Other limitations

- MARS doesn't support protection of multiple machines with the same name to a single vault.

## Supported file types for backup

**Type** | **Support**
--- | ---
Encrypted<sup>*</sup>| Supported.
Compressed | Supported.
Sparse | Supported.
Compressed and sparse |Supported.
Hard links| Not supported. Skipped.
Reparse point| Not supported. Skipped.
Encrypted and sparse |Not supported. Skipped.
Compressed stream| Not supported. Skipped.
Sparse stream| Not supported. Skipped.
OneDrive (synced files are sparse streams)| Not supported.
Folders with DFS Replication enabled | Not supported.

\* Ensure that the MARS agent has access to the required certificates to access the encrypted files. Inaccessible files will be skipped.

## Supported drives or volumes for backup

**Drive/volume** | **Support** | **Details**
--- | --- | ---
Read-only volumes| Not supported | Volume Copy Shadow Service (VSS) works only if the volume is writable.
Offline volumes| Not supported |VSS works only if the volume is online.
Network share| Not supported |The volume must be local on the server.
BitLocker-locked volumes| Not supported |The volume must be unlocked before the backup starts.
File system identification| Not supported |Only NTFS is supported.
Removable media| Not supported |All backup item sources must have a *fixed* status.
Deduplicated drives | Supported | Azure Backup converts deduplicated data to normal data. It optimizes, encrypts, stores, and sends the data to the vault.

## Support for initial offline backup

Azure Backup supports *offline seeding* to transfer initial backup data to Azure by using disks. This support is helpful if your initial backup is likely to be in the size range of terabytes (TBs). Offline backup is supported for:

- Direct backup of files and folders on on-premises machines that are running the MARS agent.
- Backup of workloads and files from a DPM server or MABS.

Offline backup can't be used for system state files.

## Support for data restoration

By using the [Instant Restore](backup-instant-restore-capability.md) feature of Azure Backup, you can restore data before it's copied to the vault. The machine you're backing up must be running .NET Framework 4.5.2 or higher.

Backups can't be restored to a target machine that's running an earlier version of the operating system. For example, a backup taken from a computer that's running Windows 7 can be restored on Windows 8 or later. But a backup taken from a computer that's running Windows 8 can't be restored on a computer that's running Windows 7.

## Previous MARS agent versions

The following table lists the previous versions of the agent with their download links. We recommend you to upgrade the agent version to the latest, so you can leverage the latest features and optimal performance.

**Versions** | **KB Articles**
--- | ---
[2.0.9145.0](https://download.microsoft.com/download/4/5/E/45EB38B4-2DA7-45FA-92E1-5CA1E23D18D1/MARSAgentInstaller.exe) | Not available
[2.0.9151.0](https://download.microsoft.com/download/7/1/7/7177B70A-51E8-434D-BDF2-FA3A09E917D6/MARSAgentInstaller.exe) | Not available
[2.0.9153.0](https://download.microsoft.com/download/3/D/D/3DD8A2FF-AC48-4A62-8566-B2C05F0BCCD0/MARSAgentInstaller.exe) | Not available
[2.0.9162.0](https://download.microsoft.com/download/0/1/0/010E598E-6289-47DB-872A-FFAF5030E6BE/MARSAgentInstaller.exe) | Not available
[2.0.9169.0](https://download.microsoft.com/download/f/7/1/f716c719-24bc-4337-af48-113baddc14d8/MARSAgentInstaller.exe) | [4515971](https://support.microsoft.com/help/4538314)
[2.0.9170.0](https://download.microsoft.com/download/1/8/7/187ca9a9-a6e5-45f0-928f-9a843d84aed5/MARSAgentInstaller.exe) | Not available
[2.0.9173.0](https://download.microsoft.com/download/7/9/2/79263a35-de87-4ba6-9732-65563a4274b6/MARSAgentInstaller.exe) | [4538314](https://support.microsoft.com/help/4538314)
[2.0.9177.0](https://download.microsoft.com/download/3/0/4/304d3cdf-b123-42ee-ad03-98fb895bc38f/MARSAgentInstaller.exe) | Not available
[2.0.9181.0](https://download.microsoft.com/download/6/6/9/6698bc49-e30b-4a3e-a1f4-5c859beafdcc/MARSAgentInstaller.exe) | Not available
[2.0.9190.0](https://download.microsoft.com/download/a/c/e/aceffec0-794e-4259-8107-92a3f6c10f55/MARSAgentInstaller.exe) | [4575948](https://support.microsoft.com/help/4575948)
[2.0.9195.0](https://download.microsoft.com/download/6/1/3/613b70a7-f400-4806-9d98-ae26aeb70be9/MARSAgentInstaller.exe) | [4582474](https://support.microsoft.com/help/4582474)
[2.0.9197.0](https://download.microsoft.com/download/2/7/5/27531ace-3100-43bc-b4af-7367680ea66b/MARSAgentInstaller.exe) | [4589598](https://support.microsoft.com/help/4589598)
[2.0.9207.0](https://download.microsoft.com/download/b/5/a/b5a29638-1cef-4906-b704-4d3d914af76e/MARSAgentInstaller.exe) | [5001305](https://support.microsoft.com/help/5001305)

>[!NOTE]
>MARS agent versions with minor reliability and performance improvements don't have a KB article.

## Next steps

- Learn more about [backup architecture that uses the MARS agent](backup-architecture.md#architecture-direct-backup-of-on-premises-windows-server-machines-or-azure-vm-files-or-folders).
- Learn what's supported when you [run the MARS agent on MABS or a DPM server](backup-support-matrix-mabs-dpm.md).
