<properties
	pageTitle="What is Azure Backup? | Microsoft Azure"
	description="By using Azure Backup and Recovery Services, you can back up and restore data and applications from Windows Servers, Windows client machines, System Center DPM servers and Azure virtual machines."
	services="backup"
	documentationCenter=""
	authors="markgalioto"
	manager="cfreeman"
	editor="tysonn"
	keywords="backup and restore; recovery services; backup solutions"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="10/31/2016"
	ms.author="jimpark; trinadhk"/>

# What is Azure Backup?
Azure Backup is the Azure-based service you can use to back up (or protect) and restore your data in the Microsoft cloud. Azure Backup replaces your existing on-premises or off-site backup solution with a cloud-based solution that is reliable, secure, and cost-competitive. Azure Backup offers multiple components that you download and deploy on the appropriate computer, server, or in the cloud. The component, or agent, that you deploy depends on what you want to protect. All Azure Backup components (no matter whether you're protecting data on-premises or in the cloud) can be used to back up data to a Backup vault in Azure. See the [Azure Backup components table](backup-introduction-to-azure-backup.md#azure-backup-components) (later in this article) for information about which component to use to protect specific data, applications, or workloads.

[Watch a video overview of Azure Backup](https://azure.microsoft.com/documentation/videos/what-is-azure-backup/)

## Why use Azure Backup?
Traditional backup solutions have evolved to treat the cloud as an endpoint, or static storage destination, similar to disks or tape. While this approach is simple, it is limited and doesn't take full advantage of an underlying cloud platform, which translates to an expensive, inefficient solution. Other solutions are expensive because you end up paying for the wrong type of storage, or storage that you don't need. Other solutions are often inefficient because they don't offer you the type or amount of storage you need, or administrative tasks require too much time. In contrast, Azure Backup delivers these key benefits:

**Automatic storage management** - Hybrid environments often require heterogeneous storage - some on-premises and some in the cloud. With Azure Backup, there is no cost for using on-premises storage devices. Azure Backup automatically allocates and manages backup storage, and it uses a pay-as-you-use model. Pay-as-you-use means that you only pay for the storage that you consume. For more information, see the [Azure pricing article](https://azure.microsoft.com/pricing/details/backup).

**Unlimited scaling** - Azure Backup uses the underlying power and unlimited scale of the Azure cloud to deliver high-availability - with no maintenance or monitoring overhead. You can set up alerts to provide information about events, but you don't need to worry about high-availability for your data in the cloud.

**Multiple storage options** - An aspect of high-availability is storage replication. Azure Backup offers two types of replication: [locally-redundant storage] (../storage/storage-redundancy.md#locally-redundant-storage) and [geo-replicated storage](../storage/storage-redundancy.md#geo-redundant-storage). Choose the backup storage option based on need:

- Locally-redundant storage (LRS) replicates your data three times (it creates three copies of your data) in a paired datacenter in the same region. LRS is a low-cost option and is ideal for price-conscious customers because it protects data against local hardware failures.
- Geo-replication storage (GRS) replicates your data to a secondary region (hundreds of miles away from the primary location of the source data). GRS costs more than LRS, but it provides a higher level of durability for your data, even if there is a regional outage.

**Unlimited data transfer** - Azure Backup does not limit the amount of inbound or outbound data you transfer. Azure Backup also does not charge for the data that is transferred. However, if you use the Azure Import/Export service to import large amounts of data, there is a cost associated with inbound data. For more information about this cost, see [Offline-backup workflow in Azure Backup](./backup-azure-backup-import-export.md). Outbound data refers to data transferred from a Backup vault during a restore operation.

**Data encryption** - Data encryption allows for secure transmission and storage of your data in the public cloud. You store the encryption passphrase locally, and it is never transmitted or stored in Azure. If it is necessary to restore any of the data, only you have encryption passphrase, or key.

**Application-consistent backup** - Whether backing up a file server, virtual machine, or SQL database, you need to know that a recovery point has all required data to restore the backup copy. Azure Backup provides application-consistent backups, which ensured additional fixes are not needed to restore the data. Restoring application consistent data reduces the restoration time, allowing you to quickly return to a running state.

**Long-term retention** -  You can back up data to Azure for 99 years. Instead of switching backup copies from disk to tape, and then moving the tape to an off-site location for long-term storage, you can use Azure for short-term and long-term retention.



## Which Azure Backup components should I use?
If you aren't sure which Azure Backup component works for your needs, see the following table for information about what you can protect with each component. The Azure portal provides a wizard, which is built into the portal, to guide you through choosing the component to download and deploy. The wizard, which is part of the Recovery Services vault creation, leads you through the steps for selecting a backup goal, and choosing the data or application to protect.


|Component|Benefits|Limits|What is protected?|Where are backups stored?|
|---------|-------|----------|------------------|---------------|
|Azure Backup (MARS) agent|<li>Back up files and folders on physical or virtual Windows OS, (VMs can be on-premises or in Azure)<li>No separate backup server required.|<li>Backup 3x per day <li>Not application aware; file, folder, and volume-level restore only, <li>  No support for Linux.|<li>Files, <li>Folders  |Azure Backup vault |
|System Center DPM| <li>App aware snapshots (VSS)<li>Full flexibility for when to take backups<li>Recovery granularity (all)<li>Can use Azure Backup vault<li>Linux support (if hosted on Hyper-V) | Lack of heterogeneous support (VMware VM back up, Oracle workload back up). |<li>Files, <li>Folders,<li> Volumes, <li>VMs,<li> Applications,<li> Workloads|<li>Azure Backup vault,<li> Locally attached disk,<li>  Tape (on-premises only) |
|Azure Backup Server| <li>App aware snapshots (VSS)<li>Full flexibility for when to take backups<li>Recovery granularity (all)<li>Can use Azure Backup vault<li>Linux support (if hosted on Hyper-V)<li>Does not require a System Center license | <li>Lack of heterogeneous support (VMware VM back up, Oracle workload back up).<li>Always requires live Azure subscription<li>No support for tape backup |<li>Files, <li>Folders,<li> Volumes, <li>VMs,<li> Applications,<li> Workloads|<li>Azure Backup vault,<li> Locally attached disk|
|Azure IaaS VM Backup| <li>Native backups for Windows/Linux<li>No specific agent installation required<li>Fabric level backup with no backup infrastructure needed | <li>Once a day back up/disk level restore<li>Cannot back up on-premises|<li>VMs, <li>All disks (using PowerShell)| <p>Azure Backup vault</p>|


## What are the deployment scenarios for each component?

| Component | Can be deployed in Azure? | Can be deployed on-premises? | Target storage supported|
| --- | --- | --- | --- |
| Azure Backup (MARS) agent | <p>**Yes**</p> <p>The Azure Backup agent can be deployed on any Windows Server VM that runs in Azure.</p> | <p>**Yes**</p> <p>The Backup agent can be deployed on any Windows Server VM or physical machine.</p> | <p>Azure Backup vault</p> |
| System Center DPM | <p>**Yes**</p><p>Learn more about [how to protect workloads in Azure by using System Center DPM](./backup-azure-dpm-introduction.md).</p> | <p>**Yes**</p> <p>Learn more about [how to protect workloads and VMs in your datacenter](https://technet.microsoft.com/en-us/system-center-docs/dpm/data-protection-manager).</p> | <p>Locally attached disk,</p> <p>Azure Backup vault,</p> <p>tape (on-premises only)</p> |
| Azure Backup Server | <p>**Yes**</p><p>Learn more about [how to protect workloads in Azure by using Azure Backup Server](backup-azure-microsoft-azure-backup.md).</p> | <p>**Yes**</p> <p>Learn more about [how to protect workloads in Azure by using Azure Backup Server](backup-azure-microsoft-azure-backup.md).</p> | <p>Locally attached disk,</p> <p>Azure Backup vault</p> |
| Azure IaaS VM Backup | <p>**Yes**</p><p>Part of Azure fabric</p><p>Specialized for [backup of Azure infrastructure as a service (IaaS) virtual machines](backup-azure-vms-introduction.md).</p> | <p>**No**</p> <p>Use System Center DPM to back up virtual machines in your datacenter.</p> | <p>Azure Backup vault</p> |


## Which applications and workloads can be backed up?

The following table provides a matrix of the data and workloads that can be protected using Azure Backup. The Azure Backup solution column has links to the deployment documentation for that solution. Each Azure Backup component can be deployed in a Classic (Service Manager-deployment) or Resource Manager-deployment model environment.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)]

| Data or Workload | Source environment | Azure Backup solution |
| -------- |--------- |---------|
| Files and folders | Windows Server | <p>[Azure Backup agent](backup-configure-vault.md),</p> <p>[System Center DPM](backup-azure-dpm-introduction.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p>  |
| Files and folders | Windows computer | <p>[Azure Backup agent](backup-configure-vault.md),</p> <p>[System Center DPM](backup-azure-dpm-introduction.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p>  |
| Hyper-V virtual machine (Windows) | Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p> |
| Hyper-V virtual machine (Linux) | Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p>  |
| Microsoft SQL Server | Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p>  |
| Microsoft SharePoint | Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p>   |
| Microsoft Exchange |  Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md) (+ the Azure Backup agent),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md) (includes the Azure Backup agent)</p>   |
| Azure IaaS VMs (Windows) | running in Azure | [Azure Backup (VM extension)](backup-azure-vms-introduction.md) |
| Azure IaaS VMs (Linux) | running in Azure | [Azure Backup (VM extension)](backup-azure-vms-introduction.md) |

## Linux support

The following table shows the Azure Backup components that have support for Linux.  

| Component| Linux (Azure endorsed) Support |
| --- | ------ |
| Azure Backup (MARS) agent | No (Only Windows based agent) |
| System Center DPM | File-consistent backup on Hyper-V only<br/> (not available for Azure VM) |
| Azure Backup Server | File-consistent backup on Hyper-V only<br/> (not available for Azure VM) |
| Azure IaaS VM Backup | Yes |



## Using Premium Storage VMs with Azure Backup

Azure Backup protects Premium Storage VMs. Azure Premium Storage is solid-state drive (SSD)-based storage designed to support I/O-intensive workloads. Premium Storage is attractive for virtual machine (VM) workloads. For more information about Premium Storage, see the article, [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../storage/storage-premium-storage.md)

### Back up Premium Storage VMs

While backing up Premium Storage VMs, the Backup service creates a temporary staging location in the Premium Storage account. The staging location, named "AzureBackup-", is equal to the total data size of the premium disks attached to the VM.

>[AZURE.NOTE] Do not modify or edit the staging location.

Once the backup job finishes, the staging location is deleted. The price of storage used for the staging location is consistent with all [Premium storage pricing](../storage/storage-premium-storage.md#pricing-and-billing).

### Restore Premium Storage VMs

Premium Storage VMs can be restored to either Premium Storage or to normal storage. Restoring a Premium Storage VM recovery point back to Premium Storage is the typical process of restoration. However, it can be cost effective to restore a Premium Storage VM recovery point to standard storage. This type of restoration can be used if you need a subset of files from the VM.

## What are the features of each Backup component?
The following sections provide tables that summarize the availability or support of various features in each Azure Backup component. See the information following each table for additional support or details.

### Storage

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure IaaS VM Backup |
| ------- | --- | --- | --- | ---- |
| Azure Backup vault | ![Yes][green] | ![Yes][green] | ![Yes][green] | ![Yes][green] |
| Disk storage | | ![Yes][green] | ![Yes][green] |  |
| Tape storage | | ![Yes][green] |  | |
| Compression <br/>(in Backup vault) | ![Yes][green] | ![Yes][green]| ![Yes][green] | |
| Incremental backup | ![Yes][green] | ![Yes][green] | ![Yes][green] | ![Yes][green] |
| Disk deduplication | | ![Partially][yellow] | ![Partially][yellow]| | |

![table key](./media/backup-introduction-to-azure-backup/table-key.png)

The Backup vault is the preferred storage target across all components. System Center DPM and Backup Server also provide the option to have a local disk copy. However, only System Center DPM provides the option to write data to a tape storage device.

#### Compression
Backups are compressed to reduce the required storage space. The only component that does not use compression is the VM extension. When using the VM extension, all backup data is copied from your storage account to the Backup vault in the same region without compressing it. Going without compression slightly inflates the storage used. However, storing the data without compression allows for faster restore times.

#### Incremental backup
Every component supports incremental backup regardless of the target storage (disk, tape, backup vault). Incremental backup ensures that backups are storage and time efficient, by transferring only those changes made since the last backup.

#### Disk Deduplication
You can take advantage of deduplication when you deploy System Center DPM or Azure Backup Server [on a Hyper-V virtual machine](http://blogs.technet.com/b/dpm/archive/2015/01/06/deduplication-of-dpm-storage-reduce-dpm-storage-consumption.aspx). Windows Server performs data deduplication (at the host level) on virtual hard disks (VHDs) that are attached to the virtual machine as backup storage.

>[AZURE.NOTE] Deduplication is not available in Azure for any Backup component. When System Center DPM and Backup Server are deployed in Azure, the storage disks attached to the VM cannot be deduplicated.

### Security

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure IaaS VM Backup |
| ------- | --- | --- | --- | ---- |
| Network security<br/> (to Azure) | ![Yes][green] |![Yes][green] | ![Yes][green] | ![Partially][yellow]|
| Data security<br/> (in Azure) | ![Yes][green] |![Yes][green] | ![Yes][green] | ![Partially][yellow]|

![table key](./media/backup-introduction-to-azure-backup/table-key.png)

#### Network security
All backup traffic from your servers to the Backup vault is encrypted using Advanced Encryption Standard 256. The backup data is sent over a secure HTTPS link. The backup data is also stored in the Backup vault in encrypted form. Only you, the Azure customer, have the passphrase to unlock this data. Microsoft cannot decrypt the backup data at any point.

>[AZURE.WARNING] Once you establish the Backup vault, only you have access to the encryption key. Microsoft never maintains a copy of your encryption key, and does not have access to the key. If the key is misplaced, Microsoft cannot recover the backup data.

#### Data security
Backing up Azure VMs requires setting up encryption *within* the virtual machine. Use BitLocker on Windows virtual machines and **dm-crypt** on Linux virtual machines. Azure Backup does not automatically encrypt backup data that comes through this path.


### Network

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure IaaS VM Backup |
| ------- | --- | --- | --- | ---- |
| Network compression <br/>(to **backup server**) | | ![Yes][green] | ![Yes][green] | |
| Network compression <br/>(to **backup vault**) | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Network protocol <br/>(to **backup server**) | | TCP | TCP | |
| Network protocol <br/>(to **backup vault**) | HTTPS | HTTPS | HTTPS | HTTPS |

![table key](./media/backup-introduction-to-azure-backup/table-key-2.png)

The VM extension (on the IaaS VM) reads the data directly from the Azure storage account over the storage network, so it is not necessary to compress this traffic.

If you are backing up your data to a System Center DPM or Azure Backup Server, compress data going from the primary server to the backup server. This saves bandwidth.

#### Network Throttling
The Azure Backup agent offers network throttling, which allows you to control how network bandwidth is used during data transfer. Throttling can be helpful if you need to back up data during work hours but do not want the backup process to interfere with other internet traffic. Throttling for data transfer applies to back up and restore activities.

### Backup and retention

|  | Azure Backup agent | System Center DPM | Azure Backup Server | Azure IaaS VM Backup |
| --- | --- | --- | --- | --- |
| Backup frequency<br/> (to Backup vault) | Three backups per day | Two backups per day |Two backups per day | One backup per day |
| Backup frequency<br/> (to disk) | Not applicable | <li>Every 15 minutes for SQL Server <li>Every hour for other workloads | <li>Every 15 minutes for SQL Server <li>Every hour for other workloads</p> |Not applicable |
| Retention options | Daily, weekly, monthly, yearly | Daily, weekly, monthly, yearly | Daily, weekly, monthly, yearly |Daily, weekly, monthly, yearly |
| Retention period | Up to 99 years | Up to 99 years | Up to 99 years | Up to 99 years |
| Recovery points in Backup vault | Unlimited | Unlimited | Unlimited | Unlimited |
| Recovery points on local disk | Not applicable | <li>64 for File Servers,<li>448 for Application Servers | <li>64 for File Servers,<li>448 for Application Servers |Not applicable |
| Recovery points on tape | Not applicable | Unlimited | Not applicable | Not applicable |

## What is the vault credential file?

The vault credentials file is a certificate generated by the portal for each Backup vault. The portal then uploads the public key to the Access Control Service (ACS). The private key is provided to you when downloading the credentials. You use it to register the computers you'll protect. The private key is what allows you to authenticate the servers or computers to send backup data to a particular Backup vault.

You only use the vault credential to register the servers or computers. However, take care with the vault credentials, if it is lost or obtained by others, the vault credentials can be used to register other machines against the same vault. Since the backup data is encrypted using a passphrase, that only you can access, existing backup data cannot be compromised. Vault credentials expire after 48 hours. While you can download the Backup vault's vault credentials as often as you like, only the latest credentials can be used for registration.

## How does Azure Backup differ from Azure Site Recovery?
Azure Backup and Azure Site Recovery are related in that both services back up data and can restore that data, but their core value propositions are different.

Azure Backup protects data on-premises and in the cloud. Azure Site Recovery coordinates virtual-machine and physical-server replication, failover, and failback. Both services are important because your disaster recovery solution needs to keep your data safe and recoverable (Backup) *and* keep your workloads available (Site Recovery) when outages occur.

The following concepts can help you make important decisions around backup and disaster recovery.

| Concept | Details | Backup | Disaster recovery (DR) |
| ------- | ------- | ------ | ----------------- |
| Recovery point objective (RPO) | The amount of acceptable data loss if a recovery needs to be done. | Backup solutions have wide variability in their acceptable RPO. Virtual machine backups usually have an RPO of one day, while database backups have RPOs as low as 15 minutes. | Disaster recovery solutions have low RPOs. The DR copy can be behind by a few seconds or a few minutes. |
| Recovery time objective (RTO) | The amount of time that it takes to complete a recovery or restore. | Because of the larger RPO, the amount of data that a backup solution needs to process is typically much higher, which leads to longer RTOs. For example, it can take days to restore data from tapes, depending on the time it takes to transport the tape from an off-site location. | Disaster recovery solutions have smaller RTOs because they are more in sync with the source. Fewer changes need to be processed. |
| Retention | How long data needs to be stored | For scenarios that require operational recovery (data corruption, inadvertent file deletion, OS failure), backup data is typically retained for 30 days or less.<br>From a compliance standpoint, data might need to be stored for months or even years. Backup data is ideally suited for archiving in such cases. | Disaster recovery needs only operational recovery data, which typically takes a few hours or up to a day. Because of the fine-grained data capture used in DR solutions, using DR data for long-term retention is not recommended. |


## Next steps

Use one of the following tutorials for detailed, step-by-step, instructions for protecting data on Windows Server, or protecting a virtual machine in Azure:

- [Try Azure Backup](backup-try-azure-backup-in-10-mins.md)
- [Try Azure VM Backup](backup-azure-vms-first-look.md)

For details about protecting other workloads, try one of these articles:

- [Back up Windows machine](backup-configure-vault.md)
- [Back up application workloads](backup-azure-microsoft-azure-backup.md)
- [Backup Azure IaaS VMs](backup-azure-vms-prepare.md)



[green]: ./media/backup-introduction-to-azure-backup/green.png
[yellow]: ./media/backup-introduction-to-azure-backup/yellow.png
[red]: ./media/backup-introduction-to-azure-backup/red.png
