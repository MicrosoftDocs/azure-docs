---
title: What is Azure Backup?
description: Provides an overview of the Azure Backup service, and how to deploy it as part of your business continuity and disaster recovery (BCDR) strategy.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: overview
ms.date: 04/05/2019
ms.author: raynew
ms.custom: mvc
---
# What is Azure Backup?

The Azure Backup service backs up data to the Microsoft Azure cloud. You can back up on-premises machines and workloads, and Azure virtual machines (VMs).


## Why use Azure Backup?

Azure Backup delivers these key benefits:

- **Offload on-premises backup**: Azure Backup offers a simple solution for backing up your on-premises resources to the cloud. Get short and long-term backup without the need to deploy complex on-premises backup solutions.
- **Back up Azure IaaS VMs**: Azure Backup provides independent and isolated backups to guard against accidental destruction of original data. Backups are stored in a Recovery Services vault with built-in managed of recovery points. Configuration and scalability are simple, backups are optimized, and you can easily restore as needed.
- **Scale easily** - Azure Backup uses the underlying power and unlimited scale of the Azure cloud to deliver high-availability with no maintenance or monitoring overhead.
- **Get unlimited data transfer**: Azure Backup does not limit the amount of inbound or outbound data you transfer, or charge for the data that is transferred.
    - Outbound data refers to data transferred from a Recovery Services vault during a restore operation.
    - If you perform an offline initial backup using the Azure Import/Export service to import large amounts of data, there is a cost associated with inbound data.  [Learn more](backup-azure-backup-import-export.md).
- **Keep data secure**:
    - On-premises, data in transit is encrypted on the on-premises machine using AES256. The data transmitted is protected by HTTPS between storage and backup. The iSCSI protocol secures the data transmitted between backup and the user machine. Secure tunneling is used to protect the iSCSI channel.
    - For on-premises to Azure backup, data in Azure is encrypted at-rest using the passphrase you provide when you set up backup. The passphrase or key it is never transmitted or stored in Azure. If it is necessary to restore any of the data, only you have encryption passphrase, or key.
    - For Azure VMs, data is encrypted at-reset using Storage Service Encryption (SSE). Backup automatically encrypts data before storing it. Azure Storage decrypts data before retrieving it.
    - Backup also supports Azure VMs encrypted using Azure Disk Encryption (ADE). [Learn more](backup-azure-vms-introduction.md#encryption-of-azure-vm-backups).
- **Get app-consistent backups**: An application-consistent backup means a recovery point has all required data to restore the backup copy. Azure Backup provides application-consistent backups, which ensure additional fixes are not required to restore the data. Restoring application-consistent data reduces the restoration time, allowing you to quickly return to a running state.
- **Retain short and long-term data**: You can use Recovery Services vaults for short-term and long-term data retention. Azure doesn't limit the length of time data can remain in a Recovery Services vault. You can keep it for as long as you like. Azure Backup has a limit of 9999 recovery points per protected instance. [Learn more](backup-introduction-to-azure-backup.md#backup-and-retention)about how this limit impacts your backup needs.
- **Automatic storage management** - Hybrid environments often require heterogeneous storage - some on-premises and some in the cloud. With Azure Backup, there is no cost for using on-premises storage devices. Azure Backup automatically allocates and manages backup storage, and it uses a pay-as-you-use model, so that you only pay for the storage you consume. [Learn more](https://azure.microsoft.com/pricing/details/backup) about pricing.
- **Multiple storage options** - Azure Backup offers two types of replication to keep your storage/data highly available.
    - [Locally redundant storage (LRS)](../storage/common/storage-redundancy-lrs.md) replicates your data three times (it creates three copies of your data) in a storage scale unit in a datacenter. All copies of the data exist within the same region. LRS is a low-cost option for protecting your data from local hardware failures.
    - [Geo-redundant storage (GRS)](../storage/common/storage-redundancy-grs.md) is the default and recommended replication option. GRS replicates your data to a secondary region (hundreds of miles away from the primary location of the source data). GRS costs more than LRS, but GRS provides a higher level of durability for your data, even if there is a regional outage.


## What's the difference between Azure Backup and Azure Site Recovery?

Both the Azure Backup and Azure Site Recovery services contribute to a business continuity and disaster recovery (BCDR) strategy in your business. BCDR consists of two broad aims:

- Keep your business data safe and recoverable when outages occur.
- Keep your apps and workloads up and running during planned and unplanned downtimes.

Both services provide complementary but different functionality.

- **Azure Site Recovery**: Site Recovery provides a disaster recovery solution for on-premises machines, and for Azure VMs. You replicate machines from a primary location to a secondary. When disaster strikes, you fail machines over to the secondary location, and access them from there. When everything's up and running normally again, you fail machines back to recover them in the primary site.
- **Azure Backup**: The Azure Backup service backs up data from on-premises machines, and Azure VMs. Data can be backed up and recovered at a granular level, including backup of files, folders, machine system state, and app-aware data backup. Azure Backup handles data at a more granular level than Site Recovery. As an example, if a presentation on your laptop became corrupted, you could use Azure Backup to restore the presentation. If you want to keep a VM configuration and data safe and accessible, you could use Site Recovery.  

Use the table points to help figure out your BCDR needs.

**Objective** | **Details** | **Comparison**
--- | --- | ---
**Data backup/retention** | Backup data can be retained and stored for days, months, or even years if required from a compliance perspective. | Backup solutions like Azure Backup allow you to finely pick data you want to back up, and finely tune backup and retention policies.<br/><br/> Site Recovery doesn't allow the same fine-tuning.
**Recovery point objective (RPO)** | The amount of acceptable data loss if a recovery needs to be done. | Backups have more variable RPO.<br/><br/> VM backups usually have an RPO of a day, while database backups have RPOs as low as 15 minutes.<br/><br/> Site Recovery provides a low RPO since replication is continuous or frequent, so that the delta between the source and replica copy is small.
**Recovery time objective (RTO)** |The amount of time that it takes to complete a recovery or restore. | Because of the larger RPO, the amount of data that a backup solution needs to process is typically much higher, which leads to longer RTOs. For example, it can take days to restore data from tapes, depending on the time it takes to transport the tape from an off-site location.

## What backup scenarios are supported?

Azure Backup can back up both on-premises machines, and Azure VMs.

**Machine** | **Back up scenario**
--- | ---
**On-premises backup** |  1) Run the Azure Backup Microsoft Azure Recovery Services (MARS) agent on on-premises Windows machines to back up individual files and system state. <br/><br/>2) Back up on-premises machines to a backup server (System Center Data Protection Manager (DPM) or Microsoft Azure Backup Server (MABS)), and then configure the backup server to back up to an Azure Backup Recovery Services vault in Azure.
**Azure VMs** | 1) Enable backup for individual Azure VMs. When you enable backup, Azure Backup installs an extension to the Azure VM agent that's running on the VM. The agent backs up the entire VM.<br/><br/> 2) Run the MARS agent on an Azure VM. This is useful if you want to back up individual files and folders on the VM.<br/><br/> 3) Back up an Azure VM to a DPM server or MABS running in Azure. Then back up the DPM server/MABS to a vault using Azure Backup.


## Why use a backup server?
The advantages of backing up machines and apps to MABS/DPM storage, and then backing up DPM/MABS storage to a vault are as follows:

- Backing up to MABS/DPM provides app-aware backups optimized for common apps such as SQL Server, Exchange, and SharePoint, in additional to file/folder/volume backups, and machine state backups (bare-metal, system state).
- For on-premises machines, you don't need to install the MARS agent on each machine you want to back up. Each machine runs the DPM/MABS protection agent, and the MARS agent runs on the MABS/DPM only.
- You have more flexibility and granular scheduling options for running backups.
- You can manage backups for multiple machines that you gather into protection groups in a single console. This is particularly useful when apps are tiered over multiple machines and you want to back them up together.

Learn more about [how backup works](backup-architecture.md#architecture-back-up-to-dpmmabs) when using a backup server, and the [support requirements](backup-support-matrix-mabs-dpm.md) for backup servers.

## What can I back up?

**Machine** | **Backup method** | **Back up**
--- | --- | ---
**On-premises Windows VMs** | Run MARS agent | Back up files, folders, system state.<br/><br/> Linux machines not supported.
**On-premises machines** | Back up to DPM/MABS | Back up anything that's protected by [DPM](backup-support-matrix-mabs-dpm.md#supported-backups-to-dpm) or [MABS](backup-support-matrix-mabs-dpm.md#supported-backups-to-mabs), including files/folders/shares/volumes, and app-specific data.
**Azure VMs** | Run Azure VM agent backup extension | Back up entire VM
**Azure VMs** | Run MARS agent | Back up files, folders, system state.<br/><br/> Linux machines not supported.
**Azure VMs** | Back up to MABS/DPM running in Azure | Back up anything that's protected by [MABS](backup-support-matrix-mabs-dpm.md#supported-backups-to-mabs) or [DPM](https://docs.microsoft.com/system-center/dpm/dpm-protection-matrix?view=sc-dpm-1807) including files/folders/shares/volumes, and app-specific data.

## What backup agents do I need?

**Scenario** | **Agent**
--- | ---
**Back up Azure VMs** | No agent needed. Azure VM extension for backup is installed on the Azure VM when you run the first Azure VM backup.<br/><br/> Support for Windows and Linux support.
**Back up of on-premises Windows machines** | Download, install and run the MARS agent directly on the machine.
**Backup Azure VMs with the MARS agent** | Download, install, and run the MARS agent directly on the machine. The MARS agent can run alongside the backup extension.
**Back up on-premises machines and Azure VMs to DPM/MABS** | The DPM or MABS protection agent runs on the machines you want to protect. The MARS agent runs on the DPM server/MABS to back up to Azure.

## Which backup agent should I use?

**Backup** | **Solution** | **Limitation**
--- | --- | ---
**I want to back up an entire Azure VM** | Enable backup for the VM. The backup extension will automatically be configured on the Windows or Linux Azure VM. | Entire VM is backed up <br/><br/> For Windows VMs the backup is app-consistent. for Linux the backup is file-consistent. If you need app-aware for Linux VMs you have to configure this with custom scripts.
**I want to back up specific files/folders on Azure VM** | Deploy the MARS agent on the VM.
**I want to directly back on-premises Windows machines** | Install the MARS agent on the machine. | You can back up files, folders, and system state to Azure. Backups aren't app-aware.
**I want to directly back up on-premises Linux machines** | You need to deploy DPM or MABS to back up to Azure. | Backup of Linux host is not supported, you can only backup Linux guest machine hosted on Hyper-V or VMWare.
**I want to back up apps running on on-premises** | For app-aware backups machines must be protected by DPM or MABS.
**I want granular and flexible backup and recovery settings for Azure VMs** | Protect Azure VMs with MABS/DPM running in Azure for additional flexibility in backup scheduling, and full flexibility for protecting and restoring files, folder, volumes, apps, and system state.


## Next steps

- [Review](backup-architecture.md) the architecture and components for different backup scenarios.
- [Verify](backup-support-matrix.md) supported features and settings for backup.

[green]: ./media/backup-introduction-to-azure-backup/green.png
[yellow]: ./media/backup-introduction-to-azure-backup/yellow.png
[red]: ./media/backup-introduction-to-azure-backup/red.png
