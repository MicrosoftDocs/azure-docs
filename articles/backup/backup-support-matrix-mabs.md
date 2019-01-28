---
title: Azure Backup support matrix for Azure Backup server
description: This article provides a support matrix for MARS that Azure Backup Server protects.
services: backup
author: rayne-wiselman
ms.service: backup
keywords:
ms.date: 01/11/2019
ms.topic: conceptual
ms.author: raynew
manager: vijayts
---

# Azure Backup Server protection matrix

You can use the [Azure Backup service](backup-overview.md) to back up Azure VMs. This article summarizes support settings and limitations for backing up machines using Microsoft Azure Backup Server (MABS).

## About MABS

MABS is a server product that can be used to back up on-premises physical servers, virtual machines (VMs) and apps running on them, and Azure VMs.

- MABS is based on System Center Data Protection Manager (DPM), and provides similar functionality with a couple of differences:
    - No System Center license is required to run MABS.
    - DPM allows you to back up data for long-term storage on tape. MABS doesn't provide this functionality. For MABS, Azure provides long-term storage.
- You download MABS server from the [Microsoft Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=57520). It can be run on-premises, or in Azure, on an Azure VM.
- MABS supports multiple backup scenarios:
    - You can back up at the machine level with system-state or bare-metal backup.
    - You can back up specific volumes, shares, folders, and files.
    - You can back up specific apps using optimized app-aware settings.
- Backup works as follows:
    - Machines/apps back up to local storage on the MABS server. Any machine backing up to the MABS server needs the MABS protection agent installed.
    - In turn the MABS server backs up to a backup Recovery Services vault. The Microsoft Azure Recovery Services (MARS) agent is installed on the MABS server so that it can back up to Azure using Azure Backup.

[Learn more](backup-architecture.md#architecture-back-up-to-dpmmabs) about MABS architecture.

## Supported scenarios 

**Scenario** | **Agent** | **Location**
--- | --- | --- | ---
**Back up of on-premises machines/workloads** | MABS protection agent on protected machine<br/><br/> MARS agent on MABS server | MABS server must be running on-premises
**Back up of Azure VMs/workloads** | MABS protection agent on protected machine<br/><br/> MARS agent on MABS server | MABS server must be running on an Azure VM.

## Supported MABS operating system

**Scenario** | **Install** | **Details**
--- | --- | ---
**Run MABS in Azure** | Windows Server 2012 R2<br/><br/> Windows 2016 or 2019 Datacenter. | We recommend you start with an image from the marketplace.<br/><br/> Minimum A2 Standard with two cores and 3.5 GB RAM.
**Run MABS on-premises** | Supported 64-bit operating systems:<br/><br/> - Windows Server 2019: Standard, Datacenter, Essentials (for MABS v3 onwards)<br/><br/> Windows Server 2016: Standard, Datacenter, Essentials (for MABS v2 onwards); Windows Server 2012 R2: Standard, Datacenter, Foundation<br/><br/> Windows Server 2012: Sandard, Datacenter, Foundation<br/><br/> Windows Storage Server 2012/2012 R2<br/><br/> Operating systems should be running the latest service packs and updates.



## Supported MABS installation/deployment

**Issue** | **Details**
--- | ---
**Installation** | MABS should be installed on a single purpose machine.<br/><br/> Don't install MABS on a domain controller, on a machine with the Application Server role installation, on a machine running Exchange Server or System Center Operations Manager, or on a cluster node.
**Domain** | The MABS server should be joined to a domain. Install first, and then join MABS to a domain. Moving MABS to a new domain after deployment isn't supported.
**Storage** | Modern backup storage (MBS) is supported from MABS v2 onwards. It isn't available for MABS v1.
**MABS upgrade** | You can directly install MABS v3, or upgrade to MABS v3 from MABS v2. [Learn more](backup-azure-microsoft-azure-backup.md#upgrade-mabs).
**Moving MABS** | Moving MABS to a new server while retaining the storage is supported if you're using MBS.<br/><br/> The server must have the same name as the original. You can't change the name if you want to keep the same storage pool, and use the same MABS database to store data recovery points.<br/><br/> You will need a backup of the MABS database because you'll need to restore it.

## MABS networking support

### URL access

The MABS server needs access to these URLs:

- http://www.msftncsi.com/ncsi.txt
- *.Microsoft.com
- *.WindowsAzure.com
- *.microsoftonline.com
- *.windows.net

### MABS connectivity to Azure Backup

Connectivity to the Azure Backup service is required for backups to function properly, and the Azure subscription should be active. The following table shows the behavior if these two things don't occur.

**MABS to Azure** | **Subscription** | **Backup** | **Restore**
--- | --- | --- | ---
Connected | Active | Backup to MABS disk<br/><br/> Backup to Azure | Restore from disk<br/><br/> Restore from Azure
Connected | Expired/deprovisioned | No backup to disk or Azure.<br/><br/> If the subscription is expired you can restore from disk or Azure.<br/><br/> If the subscription is decommissioned you can't restore from disk or Azure. The Azure recovery points are deleted.
No connectivity for more than 15 days | Active | No backup to disk or Azure.<br/><br/> You can restore from disk or Azure.
No connectivity for more than 15 days | Expired/deprovisioned | No backup to disk or Azure.<br/><br/> If the subscription is expired you can restore from disk or Azure.<br/><br/> If the subscription is decommissioned you can't restore from disk or Azure. The Azure recovery points are deleted.



## MABS storage support

Data backed up to MABS is stored on local disk storage. From MABS v2 (running on Windows Server 2016) onwards, you can take advantage of modern backup storage (MBS).

- MBS backups are stored on a Resilient File System (ReFS) disk.
- MBS uses ReFS block cloning and for faster backup and more efficient use of storage space.
- When you add volumes to the local MABS storage pool, you configured them with drive letters. You can then configure workload storage on different volumes.
- When you create protection groups to back up data to MABS, you select the drive you want to use. For example, you could store backups for SQL or other high IOPS workloads a high performance drive, and workloads that are backed up less frequently on a lower performance drive.

**Storage** | **Details**
--- | ---
**MBS** | Modern backup storage (MBS) is supported from MABS v2 onwards. It isn't available for MABS v1.
**MABS storage on Azure VM** | Data is stored on Azure disks attached to the MABS VM, and managed in MABS.The number of disks that can be used for MABS storage pool is limited by the size of the VM.<br/><br/> A2 VM: 4 disks; A3 VM: 8 disks; A4 VM: 16 disks, with a maximum size of 1 TB for each disk. This determines the total backup storage pool available.<br/><br/> The amount of data you can back up depends on the number and size of the attached disks.
**MABS data retention on Azure VM** | We recommend you retain data for one day on the MABS Azure disk, and back up from MABS to the vault for longer retention. You can thus protect a larger amount of data by offloading it to Azure Backup.



## What can MABS back up?

The following table summarizes what can be backed up to MABS, and what MABS in turn can back up to a vault in Azure.


### MABS on-premises backup

MABS can be installed on-premises as follows:

- As a physical server, or on a Hyper-V or VMware VM.
- If MABS is installed as a VMware VM it only protects VMware VMs, and workloads running on those VMs.
- In Azure Stack.
- Note that clustered workloads backed up by MABS should in the same domain as MABS, or in a child/trusted domain. 
- You can use NTLM/certificate authention to back up data in untrusted domains or workgroups.

MABS supported backup for on-premises machines and workload is summarized in the following table.

**Component** | **Details** | **MABS** | **Backup**
--- | --- | --- | ---
**Client machine** | 32/64-bit<br/><br/> Windows 10, 8.1, 8, 7 | MABS v3, v2, v1 | Volume/share/folder/file<br/><br/> Deduped volumes supported<br/><br/> Volumes must be at least 1 GB and NTFS.
**Server machine** | 32/64-bit<br/><br/> Windows Server 2016 (not Nano server)<br/><br/> Windows 2012 R2/2012/2012 (SP1) (Datacenter and Standard)<br/><br/> Windows 2008 R2 (SP1), 2008 (SP2)<br/><br/> Windows Storage Server 2008 | MABS v3, v2, V1 | Volume/share/folder/file; system-state, bare-metal. | MABS v1 can't be used to back up Windows Server 2016.<br/><br/> Deduped volumes supported.
**SQL Server**< | SQL Server 2017<br/><br/> SQL Server 2016, 2016 (SP1/SP2)<br/><br/> SQL Server 2014<br/><br/> SQL Server 2012 (SP1/SP2)<br/><br/> SQL Server 2008 R2/2008  | MABS v3, v2, V1<br/><br/> MABS v1 can't back up SQL Server 2016 onwards. | Back up SQL Server database.<br/><br/> You can back up SQL Server in a cluster.<br/><br/>You can't back up SQL Server databases stored on CSVs.
**Exchange** | Exchange 2016<br/><br/> Exchange 2013<br/><br/> Exchange 2010 | MABS v3, v2, V1 | Back up standalone Exchange server, database under a DAG<br/><br/> Recover mailbox, mailbox database under a DAG.<br/><br/> ReFS not supported.<br/><br/> You can back up non-shared disk clusters.<br/><br/> You can back up Exchange Server configured for continuous replication.
**SharePoint** | SharePoint 2016<br/><br/> Sharepoint 2013<br/><br/> SharePoint 2010 | MABS v3, v2, v1 | Back up farm, frontend web server.<br/><br/> Recover farm, database, web app, file or list item, SharePoint search, frontend web server.<br/><br/> You can't back up a farm using AlwaysOn for the content databases.
**Hyper-V** | Windows Server 2016<br/><br/> Windows Server 2012 R2/2012 (Datacenter/Standard)<br/><br/> Windows Server 2008 R2 (with SP1) | MABS v3, v2, v1 | MABS protection agent on Hyper-V host: Backup entire VMs and host data files. You can back up VMs with local storage, VMs in cluster with CSV storage, VMs with SMB file server storage.<br/><br/> MABS protection agent on guest VM: Back up workloads running on the VM. CSVs.<br/><br/> Recover VM, item-level recovery of VHD/volume/folders/files.<br/><br/> Linux VMs can be backed up when Hyper-V is running on Windows Server 2012 R2 onwards. Recovery for Linux VMs is for the entire machine.
**VMware** | VMs in vCenter/vSphere ESXi 5.5/6.0/6.5 | MABS v3, v2, v1<br/><Br/> MABS v1 need update rollup 1) | Back up VMware VMs on CSVs, NFS and SAN storage.<br/><br/> Recover entire VM.<br/><br/> Item-level recovery of folder/files on Windows VMs only.<br/><br/> VMware vApps aren't supported.<br/><br/> Linux VMs can be backed up. Recovery for Linux VMs is for the entire machine.


### MABS in Azure backup

MABS can be installed in Azure as an Azure VM.

- If MABS is installed as an Azure it only protects Azure VMs, and workloads running on those VMs.
- Note that clustered workloads backed up by MABS should in the same domain as MABS, or in a child/trusted domain. 
- You can use NTLM/certificate authention to back up data in untrusted domains or workgroups.

MABS supported backup for Azure VMs is summarized in the following table.

**Component** | **Details** | **MABS** | **Backup**
--- | --- | --- | ---
**Client machine** | 32/64-bit<br/><br/> Windows 10, 8.1, 8, 7 | MABS v3, v2, v1 | Volume/share/folder/file<br/><br/> Deduped volumes supported<br/><br/> Volumes must be at least 1 GB and NTFS.
**Server machine** | 32/64-bit<br/><br/> Windows Server 2016 (not Nano server)<br/><br/> Windows 2012 R2/2012/2012 (SP1) (Datacenter and Standard)<br/><br/> Windows 2008 R2 (SP1), 2008 (SP2)<br/><br/> Windows Storage Server 2008 | MABS v3, v2, V1 | Volume/share/folder/file; system-state, bare-metal. | MABS v1 can't be used to back up Windows Server 2016.<br/><br/> Deduped volumes supported.
**SQL Server**< | SQL Server 2017<br/><br/> SQL Server 2016, 2016 (SP1/SP2)<br/><br/> SQL Server 2014<br/><br/> SQL Server 2012 (SP1/SP2)<br/><br/> SQL Server 2008 R2/2008  | MABS v3, v2, V1<br/><br/> MABS v1 can't back up SQL Server 2016 onwards. | Back up SQL Server database.<br/><br/> You can back up SQL Server in a cluster.<br/><br/>You can't back up SQL Server databases stored on CSVs.
**Exchange** | Exchange 2016<br/><br/> Exchange 2013<br/><br/> Exchange 2010 | MABS v3, v2, V1 | Back up standalone Exchange server, database under a DAG<br/><br/> Recover mailbox, mailbox database under a DAG.<br/><br/> ReFS not supported.<br/><br/> You can back up non-shared disk clusters.<br/><br/> You can back up Exchange Server configured for continuous replication.
**SharePoint** | SharePoint 2016<br/><br/> Sharepoint 2013<br/><br/> SharePoint 2010 | MABS v3, v2, v1 | Back up farm, frontend web server.<br/><br/> Recover farm, database, web app, file or list item, SharePoint search, frontend web server.<br/><br/> You can't back up a farm using AlwaysOn for the content databases.
**Hyper-V** | Windows Server 2016<br/><br/> Windows Server 2012 R2/2012 (Datacenter/Standard)<br/><br/> Windows Server 2008 R2 (with SP1) | MABS v3, v2, v1 | MABS protection agent on Hyper-V host: Backup entire VMs and host data files. You can back up VMs with local storage, VMs in cluster with CSV storage, VMs with SMB file server storage.<br/><br/> MABS protection agent on guest VM: Back up workloads running on the VM. CSVs.<br/><br/> Recover VM, item-level recovery of VHD/volume/folders/files.<br/><br/> Linux VMs can be backed up when Hyper-V is running on Windows Server 2012 R2 onwards. Recovery for Linux VMs is for the entire machine.
**VMware** | VMs in vCenter/vSphere ESXi 5.5/6.0/6.5 | MABS v3, v2, v1<br/><Br/> MABS v1 need update rollup 1) | Back up VMware VMs on CSVs, NFS and SAN storage.<br/><br/> Recover entire VM.<br/><br/> Item-level recovery of folder/files on Windows VMs only.<br/><br/> VMware vApps aren't supported.<br/><br/> Linux VMs can be backed up. Recovery for Linux VMs is for the entire machine.

## Protection support matrix

/>On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y<br /><br />You need to be running SP1 and install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)|Y<br /><br />You need to be running SP1 and install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)|Y|Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Server 2008 R2 SP1 - Standard and Enterprise|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y<br /><br />You need to be running SP1 and install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)|Y<br /><br />You need to be running SP1 and install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)|Y |Volume, share, folder, file|
|Servers (32-bit and 64-bit)|Windows Server 2008 R2 SP1 - Standard and Enterprise|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y<br /><br />You need to be running SP1 and install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)|Y<br /><br />You need to be running SP1 and install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)|Y |Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Server 2008 SP2|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|N|N|Y|Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Server 2008 SP2|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y |Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Storage Server 2008|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|Volume, share, folder, file, system state/bare metal|
|SQL Server|SQL Server 2017|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|N|N|All deployment scenarios: database|
|SQL Server|SQL Server 2016 SP2|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|N|All deployment scenarios: database|
|SQL Server|SQL Server 2016 SP1|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|N|All deployment scenarios: database|
|SQL Server|SQL Server 2016|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y |N|All deployment scenarios: database|
|SQL Server|SQL Server 2014|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2014|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2012 with SP2|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2012 with SP2|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2012 with SP2|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2012, SQL Server 2012 with SP1|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2012, SQL Server 2012 with SP1|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2012, SQL Server 2012 with SP1|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2008 R2|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2008 R2|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2008 R2|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y |All deployment scenarios: database|
|SQL Server|SQL Server 2008|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2008|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|SQL Server|SQL Server 2008|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y|All deployment scenarios: database|
|Exchange|Exchange 2016|Physical server<br/><br/> On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2016|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2013|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2013|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y |Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2010|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover  (all deployment scenarios):  Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2010|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y |Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios):  Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|SharePoint|SharePoint 2016|Physical server<br /><br />On-premises Hyper-V virtual machine<br /><br />Azure virtual machine (when workload is running as Azure virtual machine)<br /><br />Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y |N|Protect (all deployment scenarios):  Farm,  frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 AlwaysOn feature for the content databases isn't supported.|
|SharePoint|SharePoint 2013|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios):  Farm,  frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 AlwaysOn feature for the content databases isn't supported.|
|SharePoint|SharePoint 2013|Azure virtual machine (when workload is running as Azure virtual machine) - DPM 2012 R2 Update Rollup 3 onwards<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios):  Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 AlwaysOn feature for the content databases isn't supported.|
|SharePoint|SharePoint 2013|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y |Protect (all deployment scenarios):  Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 AlwaysOn feature for the content databases isn't supported.|
|SharePoint|SharePoint 2010|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios): Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios): Farm, database, web application, file or list item, SharePoint search, frontend web server|
|SharePoint|SharePoint 2010|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|Y|Y|Y |Protect (all deployment scenarios): Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios): Farm, database, web application, file or list item, SharePoint search, frontend web server|
|SharePoint|SharePoint 2010|Windows virtual machine in VMWare (protects workloads running in Windows virtual machine in VMWare)<br /> <br /> Azure Stack|Y|Y|Y|Protect (all deployment scenarios): Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios): Farm, database, web application, file or list item, SharePoint search, frontend web server|
|Hyper-V host - DPM protection agent on Hyper-V host server, cluster, or VM|Windows Server 2016|Physical server<br /><br />On-premises Hyper-V virtual machine|Y|Y|N|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - DPM protection agent on Hyper-V host server, cluster, or VM|Windows Server 2012 R2 - Datacenter and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine|Y|Y|Y|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - DPM protection agent on Hyper-V host server, cluster, or VM|Windows Server 2012 - Datacenter and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine|Y|Y|Y|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - DPM protection agent on Hyper-V host server, cluster, or VM|Windows Server 2008 R2 SP1 - Enterprise and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine|Y|Y|Y|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - DPM protection agent on Hyper-V host server, cluster, or VM|Windows Server 2008 SP2|Physical server<br /><br />On-premises Hyper-V virtual machine|N|N|N|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|VMware VMs|VMware vCenter/vSphere ESX/ESXi  licensed version 5.5/6.0/6.5 |Physical server, <br/>On-premises Hyper-V VM, <br/> Windows VM in VMWare|Y|Y|Y (with UR1)|VMware VMs on cluster-shared volumes (CSVs), NFS, and SAN storage<br /> Item-level recovery of files and folders is available only for Windows VMs, VMware vApps are not supported.|
|Linux|Linux running as Hyper-V or VMware guest|Physical server, <br/>On-premises Hyper-V VM, <br/> Windows VM in VMWare|Y|Y|Y|Hyper-V must be running on Windows Server 2012 R2 or Windows Server 2016. Protect: Entire virtual machine<br /><br />Recover: Entire virtual machine <br/><br/> For a complete list of supported Linux distributions and versions, see the article, [Linux on distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md).|

## Cluster support
Azure Backup Server can protect data in the following clustered applications:

-   File servers

-   SQL Server

-   Hyper-V - If you protect a Hyper-V cluster using scaled-out DPM protection, you can't add secondary protection for the protected Hyper-V workloads.

    If you run Hyper-V on Windows Server 2008 R2, make sure to install the update described in KB [975354](https://support.microsoft.com/en-us/kb/975354).
    If you run Hyper-V on Windows Server 2008 R2 in a cluster configuration, make sure you install SP2 and KB [971394](https://support.microsoft.com/en-us/kb/971394).

-   Exchange Server - Azure Backup Server can protect non-shared disk clusters for supported Exchange Server versions (cluster-continuous replication), and can also protect Exchange Server configured for local continuous replication.

-   SQL Server - Azure Backup Server doesn't support backing up SQL Server databases hosted on cluster-shared volumes (CSVs).

Azure Backup Server can protect cluster workloads that are located in the same domain as the DPM server, and in a child or trusted domain. If you want to protect data sources in untrusted domains or workgroups, use NTLM or certificate authentication for a single server, or certificate authentication only for a cluster.





## System Requirement
Cache/Scratch folder space

* For MARS (Files and Folder backup) agent installation and registration below is the system requirement:
* To install the MARS agent the cache/scratch folder volume should have at least 5-10% free space, when compared to the total size of backup data.

## Supported OS versions for MARS agent backup
Azure Backup supports the following list of operating systems for backing up files and folders.

**Operating System** | **Platform** | **SKU**
--- | --- | ---
Windows 8 and latest SPs |	64 bit |	Enterprise, Pro
Windows 7 and latest SPs |	64 bit | Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter
Windows 8.1 and latest SPs |	64 bit |	Enterprise, Pro
Windows 10	| 64 bit	| Enterprise, Pro, Home
Windows Server 2016	| 64 bit |	Standard, Datacenter, Essentials
Windows Server 2012 R2 and latest SPs |	64 bit	| Standard, Datacenter, Foundation
Windows Server 2012 and latest SPs |	64 bit |	Datacenter, Foundation, Standard
Windows Storage Server 2016 and latest SPs	| 64 bit	| Standard, Workgroup
Windows Storage Server 2012 R2 and latest SPs |	64 bit |	Standard, Workgroup
Windows Storage Server 2012 and latest SPs | 64 bit | Standard, Workgroup
Windows Server 2012 R2 and latest SPs |	64 bit	| Essential
Windows Server 2008 R2 SP1	| 64 bit |	Standard, Enterprise, Datacenter, Foundation
Windows Server 2008 SP2 |	64 bit |	Standard, Datacenter, Foundation

Azure Backup supports the following list of operating systems for backing up Windows Server System State.
**Operating System** | **Platform** | **SKU**
--- | --- | ---
Windows Server 2016	| 64 bit	| Standard, Datacenter, Essentials
Windows Server 2012 R2 and latest SPs |	64 bit |	Standard, Datacenter, Foundation
Windows Server 2012 and latest SPs	| 64 bit	| Datacenter, Foundation, Standard
Windows Storage Server 2016 and latest SPs	| 64 bit |	Standard, Workgroup
Windows Storage Server 2012 R2 and latest SPs	| 64 bit	| Standard, Workgroup
Windows Storage Server 2012 and latest SPs	| 64 bit |	Standard, Workgroup
Windows Server 2012 R2 and latest SPs |	64 bit |	Essential
Windows Server 2008 R2 SP1	| 64 bit |	Standard, Enterprise, Datacenter, Foundation

>
> [Note]
* You can back up System State on Windows Server 2008 R2 through Windows Server 2016. System State back up is not supported on client SKUs. System State is not shown as an option for Windows clients, or Windows Server 2008 SP2 machines
* Backups can't be restored to a target machine running an earlier version of the operating system. For example, a backup taken from a Windows 7 computer can be restored on a Windows 8, or later, computer. A backup taken from a Windows 8 computer cannot be restored to a Windows 7 computer.

## Supported limit on the size of each data source (files and folders) being backed up
Azure Backup enforces a maximum size for a file-folder data source. This essentially means the size of items selected for backup from a single volume cannot exceed this limit. The maximum size for a data source for the supported operating systems are:

**Operating System** | **Maximum size of data source**
--- | ---
Windows Server 2012 or later |	54,400 GB
Windows 8 or later	| 54,400 GB
Windows Server 2008 R2 SP1 |	1700 GB
Windows Server 2008 SP2	| 1700 GB
Windows 7	| 1700 GB

## Unsupported Drives/Volumes for MARS backup
**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Read-only Volumes	| Not supported | The volume must be writable for the volume shadow copy service (VSS) to function.
Offline Volumes	| Not supported |	The volume must be online for VSS to function.
Network share	| Not supported |	The volume must be local to the server to be backed up using online backup.
Bitlocker-protected volumes	| Not supported |	The volume must be unlocked before the backup can occur.
File System Identification	| Not supported |	NTFS is the only file system supported.
Removable Media	| Not supported |	All backup item sources must report as fixed.

>
> [Note]
Check Supported Drives for Offline seeding using MARS agent.  

## Supported files and folders for backup

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Encrypted	| Supported
Compressed | Supported
Sparse | Supported
Compressed + Sparse |	Supported
Hard Links	| Not supported	| Skipped
Reparse Point	| Not supported	| Skipped
Encrypted + Sparse |	Not supported | Skipped
Compressed Stream	| Not supported | 	Skipped
Sparse Stream	| Not supported | Skipped
One Drive (sync'd files are Sparse Streams)	| Not supported |	Not supported

## Supported locations for Cache Folder

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Network Share or Removable Media	| Not supported	| Network locations or removable media like USB drives are not supported
Local Volume	| Recommended	| The cache folder must be local to the server that needs backing up using online backup
Offline Volumes	| Not supported	| The cache folder must be online for expected backup using Azure Backup Agent

###  Un-supported attributes of cache folder

**Configuration** | **Supported/Not supported**
--- | ---
Encrypted	| Not Supported
De-duplicated	| Not Supported
Compressed	| Not Supported
Sparse	| Not Supported
Reparse-Point |	Not Supported


## Supported OS for network throttling

Network throttling is not available on Windows Server 2008 R2 SP1, Windows Server 2008 SP2, or Windows 7 (with service packs).