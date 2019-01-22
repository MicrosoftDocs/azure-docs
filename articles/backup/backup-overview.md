---
title: What is Azure Backup?
description: Provides an overview of the Azure Backup service, and how to deploy it as part of your business continuity and disaster recovery (BCDR) strategy.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: overview
ms.date: 01/09/2019
ms.author: raynew
ms.custom: mvc
---
# What is Azure Backup?

The Azure Backup service backs up data to the Microsoft Azure cloud. You can back up on-premises machines and workloads, and Azure virtual machines (VMs).


## Why use Azure Backup?

Azure Backup delivers these key benefits:

- **Offload on-premises backup**: Azure Backup offers a simple solution for backing up your on-premises resources to the cloud. Get short and long-term backup without the need to deploy complex on-premises backup solutions. Eliminate the need for tape or an offsite backup.
- **Back up Azure IaaS VMs**: Azure Backup provides independent and isolated backups to guard against accidental destruction of original data. Backups are stored in a Recovery Services vault with built-in managed of recovery points. Configuration and scalability is simple, backups are optimized, and you can easily restore as needed.
- **Scale easily** - Azure Backup uses the underlying power and unlimited scale of the Azure cloud to deliver high-availability - with no maintenance or monitoring overhead. You can set up alerts to provide information about events, but you don't need to worry about high-availability for your data in the cloud.
- **Get unlimited data transfer** - Azure Backup does not limit the amount of inbound or outbound data you transfer. Azure Backup also does not charge for the data that is transferred. However, if you use the Azure Import/Export service to import large amounts of data, there is a cost associated with inbound data. For more information about this cost, see [Offline-backup workflow in Azure Backup](backup-azure-backup-import-export.md). Outbound data refers to data transferred from a Recovery Services vault during a restore operation.
- **Keep data secure**: Data encryption allows for secure transmission and storage of your data in the public cloud. You store the encryption passphrase locally, and it is never transmitted or stored in Azure. If it is necessary to restore any of the data, only you have encryption passphrase, or key.
- **Get app-consistent backups**: An application-consistent backup means a recovery point has all required data to restore the backup copy. Azure Backup provides application-consistent backups, which ensure additional fixes are not required to restore the data. Restoring application-consistent data reduces the restoration time, allowing you to quickly return to a running state.
- **Get short and long-term retention**: **Long-term retention** - You can use Recovery Services vaults for short-term and long-term data retention. Azure doesn't limit the length of time data can remain in a Recovery Services vault. You can keep data in a vault for as long as you like. Azure Backup has a limit of 9999 recovery points per protected instance. See the [Backup and retention](backup-introduction-to-azure-backup.md#backup-and-retention) section in this article for an explanation of how this limit may impact your backup needs.
- **Automatic storage management** - Hybrid environments often require heterogeneous storage - some on-premises and some in the cloud. With Azure Backup, there is no cost for using on-premises storage devices. Azure Backup automatically allocates and manages backup storage, and it uses a pay-as-you-use model. Pay-as-you-use means that you only pay for the storage that you consume. For more information, see the [Azure pricing article](https://azure.microsoft.com/pricing/details/backup).
- **Multiple storage options** - An aspect of high-availability is storage replication. Azure Backup offers two types of replication: [locally redundant storage](../storage/common/storage-redundancy-lrs.md) and [geo-redundant storage](../storage/common/storage-redundancy-grs.md). Choose the backup storage option based on need:
    - Locally redundant storage (LRS) replicates your data three times (it creates three copies of your data) in a storage scale unit in a datacenter. All copies of the data exist within the same region. LRS is a low-cost option for protecting your data from local hardware failures.
    - Geo-redundant storage (GRS) is the default and recommended replication option. GRS replicates your data to a secondary region (hundreds of miles away from the primary location of the source data). GRS costs more than LRS, but GRS provides a higher level of durability for your data, even if there is a regional outage.


## What's the difference between Azure Backup and Azure Site Recovery?

Both the Azure Backup and Azure Site Recovery services contribute to a business continuity and disaster recovery (BCDR) strategy in your business. BCDR consists of two broad aims:

- Keep your business data safe and recoverable when outages occur.
- Keep your apps and workloads up and running during planned and unplanned downtimes.

Both services provide complementary but different functionality.

- **Azure Site Recovery**: Site Recovery provides a disaster recovery solution for on-premises machines, and for Azure VMs. You replicate machines from a primary location to a secondary. When disaster strikes, ou fail machines over to the secondary location, and access them from there. When everything's up and running normally again, you fail machines back to recovery them in the primary site.
- **Azure Backup**: The Azure Backup service backs up data from on-premises machines, and Azure VMs. Data can be backed up and recovered at a granular level, including back up of files, folders, machine system state, and app-aware data backup. Azure Backup handles data at a more granular level than Site Recovery. As an example, if a presentation on your laptop became corrupted, you could use Azure Backup to restore the presentation. If you want to keep a VM configuration and data safe and accessible, you could use Site Recovery.  

Use the table points to help figure out your BCDR needs. 

**Objective** | **Details** | **Comparison**
--- | --- | --- | --- |
**Data backup/retention** | Backup data can be retained and stored for days, months, or even years if required from a compliance perspective. | Backup solutions like Azure Backup allow you to finely pick data you want to back up, and finely tune backup and retention policies.<br/><br/> Site Recovery doesn't allow the same fine tuning.
**Recovery point objective (RPO)** | The amount of acceptable data loss if a recovery needs to be done. | Backups have more variable RPO.<br/><br/> VM backups usually have an RPO of a day, while database backups have RPOs as low as 15 minutes.<br/><br/> Site Recovery provides a low RPO since replication is continuous or frequent, so that the delta between the source and replica copy is small.
**Recovery time objective (RTO)** |The amount of time that it takes to complete a recovery or restore. | Because of the larger RPO, the amount of data that a backup solution needs to process is typically much higher, which leads to longer RTOs. For example, it can take days to restore data from tapes, depending on the time it takes to transport the tape from an off-site location. | Disaster recovery solutions such as Site Recovery have a low RPO since continuous/frequent replication generally means that the target is more highly synchronized with the source. |

## What backup scenarios are supported?

Azure Backup can back up both on-premises machines, and Azure VMs.

**Machine** | **Back up scenario**
--- | ---
**On-premises machines (physical/virtual)** |  You can back up individual on-premises machines.<br/><br/>You can back up on-premises machines that are protected by System Center Data Protection Manager (DPM)<br/><br/> You can back up on-premises machines protected by Microsoft Azure Backup Server (MABS)..
**Azure VMs** | You can back up individual Azure VMs.<br/><br/> You can back up Azure VMs protected by DPM or MABS.

### Back up servers

You might want to back up on-premises servers and workloads, or Azure VMs and their workloads, first to a backup server, and then to a Recovery Services vault. 

**Backup server** | **Details**
--- | ---
**System Center Data Protection Manager (DPM)** | You can use Azure Backup to back up data that's protected by DPM:<br/><br/> - DPM can be running on-premises (physical or virtual) or in Azure.<br/><br/> - You can protect different types of data running on on-premises machines and Azure VMs by backing the data up to the DPM server.<br/><br/> In turn the DPM server can be backed up to a Recovery Services vault using the Azure Backup service.<br/><br/> The DPM server and the machines it protects must be in the same network. On-premises machines can only be protected by an on-premises DPM server. Likewise, Azure VMs can only be protected by DPM running in Azure.
**Microsoft Azure Backup server (MABS)** | You can use Azure Backup to back up data that's protected by MABS:<br/><br/> - MABS can be running on-premises (physical or virtual) or in Azure.<br/><br/> - You protect different types of data running on on-premises machines and Azure VMs by backing the data up to MABS.<br/><br/> - In turn MABS can be backed up to a Recovery Services vault using the Azure Backup service.<br/><br/> - MABS provides similar functionality to DPM, except that you can't back up to tape using MABS. MABS doesn't require a System Center license.<br/><br/> Like DPM, on-premises machines can only be protected by an  on-premises MABS. Azure VMs can only be protected by a MABS in Azure.

The advantages of backing up first to DPM/MABS and then to a vault are as follows:

- Backing up to DPM/MAB provides app-aware backups optimized for common apps such as SQL Server, Exchange, and SharePoint, in additional to file/folder/volume backups, and machine state backups (bare-metal, system state).
- You don't need to install the Azure Backup agent on each machine you want to back up. Each machines runs the DPM/MABS protection agent, and the Azure Backup Microsoft Azure Recovery Services agent runs on the DPM server/MABS only.
- You have more flexibility and granular scheduling options for running backups.
- You can manage backups for multiple machines that you gather into protection groups in a single console. This is particularly useful when apps are tiered over multiple machines and you want to back them up together.

## What can be backed up?

**Machine** | **Backup server** | **Back up**
--- | --- | ---
On-premises Windows VMs | Not backed up to DPM or MABS | Back up files, folders, system state.
Azure VMs (Windows and Linux) | Not backed up to DPM or MABS | Back up files, folders, system state.<br/><br/> Backups are app-aware for Windows machines, and file-aware for Linux machines.
On-premises VMs/Azure VMs | Protected by DPM | Back up anything that's protected by DPM, including files/folders/shares/volumes, and app-specific data. [Learn](https://docs.microsoft.com/system-center/dpm/dpm-protection-matrix?view=sc-dpm-1807) what DPM can back up.
On-premises VMs/Azure VMs | Protected by MABS | Back up anything that's protected by MABS, including files/folders/shares/volumes, and app-specific data. [Learn](backup-mabs-protection-matrix.md) what MABS can back up.

## What backup agents do I need?
**Scenario** | **Agent** | **Details**
--- | --- | ---
On-premises machines (no backup server) | Microsoft Azure Recovery Services (MARS) agent runs on the Windows machine. | You download and install the MARS agent during Azure Backup deployment.<br/><br/> Support for Windows machines only.
Azure VMs (no backup server) | No explicit agent required. Azure VM extension for backup runs on the Azure VM. | The extension is installed when you run the first Azure VM backup.<br/><br/> Support for Windows and Linux support.
On-premises machines/Azure VMs protected by DPM. | The MARS agent runs on the DPM server. | You don't need the MARS agent on individual machines.<br/><br/> When you deploy DPM, the DPM protection agent is installed on each machine you protect. 
Back up on-premises machines and Azure VMs protected by MABS | The MARS agent runs on the MABS. | You don't need the MARS agent on individual machines.<br/><br/> When you deploy MABS, the MABS protection agent is installed on each machine you protect. 


## Which backup agent should I use?

**Backup** | **Solution** | **Limitation**
--- | --- | ---
I want to back on-premises Windows machines. Machines aren't protected by DPM or MABS | Install the MARS agent on the machine. | You can back up files, folders, and system state to Azure. Backups aren't app-aware.
I want to back up on-premises Linux machines. Machines aren't protected by DPM or MABS. | You need to deploy DPM or MABS to back up to Azure.
I want to back up apps running on on-premises Windows machines | For app-aware backups Windows machines must be protected by DPM or MABS.
I want to back up Azure VMs | Run a backup using Azure Backup. The backup extension will automatically be configured on the Windows or Linux Azure VM. | The VM disks are backed up.<br/><br/> For Windows VMs the backup is app-consistent. for Linux the backup is file-consistent. If you need app-aware you have to configure this with custom scripts.
I want to back up Azure VMs with granular flexibility of backup and recovery settings | Protect Azure VMs with DPM or MABS running in Azure for additional flexibility for backup scheduling, and full flexibility for protecting and restoring files, folder, volumes, apps, and system state.


## Next steps

- [Review](backup-architecture.md) the architecture and components for different backup scenarios.
- [Verify](backup-support-matrix.md) supported features and settings for backup.

[green]: ./media/backup-introduction-to-azure-backup/green.png
[yellow]: ./media/backup-introduction-to-azure-backup/yellow.png
[red]: ./media/backup-introduction-to-azure-backup/red.png

