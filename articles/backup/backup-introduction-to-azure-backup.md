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
	ms.date="10/27/2016"
	ms.author="jimpark; trinadhk"/>

# What is Azure Backup?
Azure Backup is the service you can use to back up (or protect) and restore your data in the Microsoft cloud. Azure Backup replaces your existing on-premises or off-site backup solution with a cloud-based solution that is reliable, secure, and cost-competitive. To enable the on-premises or cloud-based data to be backed up to Azure, Azure Backup provides multiple components that you download and deploy on the appropriate server or computer. The component or agent that you deploy depends on what you want to protect. See the [Azure Backup components table](backup-introduction-to-azure-backup.md#azure-backup-components) (later in this article) for information about which component to use to protect specific data, applications, or workloads.

[Watch a video overview of Azure Backup](https://azure.microsoft.com/documentation/videos/what-is-azure-backup/)

## Why use Azure Backup?
Traditional backup solutions have evolved to treat the cloud as an endpoint, or static storage destination, similar to disks or tape. While this approach is simple, it is limited and doesn't take full advantage of an underlying cloud platform, which translates to an expensive, inefficient solution. Expensive because you end up paying for the wrong type of storage, or storage that you don't need. Inefficient because it is the wrong type of storage, or administrative tasks require too much time. In contrast, Azure Backup delivers these key benefits:

**Automatic storage management** - Hybrid environments often require heterogeneous storage - some on-premises and some in the cloud. There is no cost for using on-premises storage devices. Azure Backup automatically allocates and manages backup storage, and it uses a pay-as-you-use model. Pay-as-you-use means that you only pay for the storage that you consume. For more information, see the [Azure pricing article](https://azure.microsoft.com/pricing/details/backup).

**Unlimited scaling** - Azure Backup uses the underlying power and unlimited scale of the Azure cloud to deliver high-availability - with no maintenance or monitoring overhead. You can set up alerts to provide information about events, but you don't need to worry about high-availability for your data in the cloud.

**Multiple storage options** - An aspect of high-availability is storage replication. Azure Backup offers two types of replication: [locally-redundant storage]() (../storage/storage-redundancy.md#locally-redundant-storage) and [geo-replicated storage](../storage/storage-redundancy.md#geo-redundant-storage). Choose the backup storage option based on need:

- Locally-redundant storage (LRS) replicates your data three times (it creates three copies of your data) in a paired datacenter in the same region. LRS is a low-cost option and is ideal for price-conscious customers because it protects data against local hardware failures.
- Geo-replication storage (GRS) replicates your data to a secondary region (hundreds of miles away from the primary location of the source data). GRS costs more than LRS, but it provides a higher  level of durability for your data, even in the event of regional outage.

**Unlimited data transfer** - Azure Backup does not limit the amount of inbound or outbound data you transfer. Azure Backup also does not charge for the data that is transferred. However, if you use the Azure Import/Export service to import large amounts of data, there is a cost associated with inbound data. For more information about this cost, see [Offline-backup workflow in Azure Backup](./backup-azure-backup-import-export/). Outbound data refers to data transferred from a Backup vault during a restore operation.

**Data encryption** - Data encryption allows for secure transmission and storage of your data in the public cloud. You store the encryption passphrase locally, and it is never transmitted or stored in Azure. If it is necessary to restore any of the data, only you have encryption passphrase, or key.

**Application-consistent backup** - Whether you are backing up a file server, virtual machine, or SQL database, you need to know that a back up copy, or recovery point, has all required data to correctly restore that back up copy. Azure Backup provides application-consistent backups, which ensures that additional fixes are not needed at the time of restore. Restoring application consistent data reduces the restoration time, allowing you to quickly return to a running state.

**Long-term retention** -  You can back up data to Azure for 99 years. Instead of switching backup copies from disk to tape, and then moving the tape to an off-site location for long-term storage, you can use Azure for short-term and long-term retention.



## Azure Backup components
You may wonder which component you need. All Azure Backup components can be deployed in Azure or on-premises. Use the following table to help determine which component you need. When it comes to choosing which component to download and deploy, the Azure portal provides a wizard to help you make the right choice. You choose which component to deploy when you configure the Recovery Services vault. A Recovery Services vault is the version of Backup vault used in the Azure portal. The first step in backing up data with Azure Backup is create a Recovery Services vault. Once you create the vault, you then configure the vault. Configuring the vault is where you specify the Backup goalIn the Azure portal, you  fiEach time you cIf you want to back up on-premises virtual machines to your datacenter, use System Center DPM.

![Azure Backup components](./media/backup-introduction-to-azure-backup/azure-backup-overview.png)


|Component|Benefits|Limits|What is protected?|Where are backups stored?|
|---------|-------|----------|------------------|---------------|
|Azure Backup (MARS) agent|<li>Can backup files and folders on a Windows OS machine, be it physical or virtual (VMs can be anywhere on-premises or Azure)<li>No separate backup server required.|<li>Backup 3x per day <li>Not application aware; file, folder, and volume-level restore only, <li>  No support for Linux.|Files and folders on Windows Server (physical or virtual) and Windows 8.1, 10 |Azure Backup vault |
|System Center DPM| <li>App aware snapshots (VSS)<li>Full flexibility for when to take backups<li>Recovery granularity (all)<li>Can use Azure Backup vault<li>Linux support (if hosted on Hyper-V) | Lack of heterogeneous support (VMware VM back up, Oracle workload back up). | Files, folders, volumes, VMs, application, workloads|Azure Backup vault,<br/> Locally attached disk,<br/>  Tape (on-premises only) |
|Azure Backup Server| <li>App aware snapshots (VSS)<li>Full flexibility for when to take backups<li>Recovery granularity (all)<li>Can use Azure Backup vault<li>Linux support (if hosted on Hyper-V)<li>Does not require a System Center license | <li>Lack of heterogeneous support (VMware VM back up, Oracle workload back up).<li>Always requires live Azure subscription<li>No support for tape backup |Files, folders, volumes, VMs, applications, workloads|Azure Backup vault,<br/> Locally attached disk|
|Azure Iaas VM Backup| <li>Native backups for Windows/Linux<li>No specific agent installation required<li>Fabric level backup with no backup infrastructure needed | <li>Once a day back up/disk level restore<li>Cannot back up on-premises|VMs, all disks (using PowerShell)| <p>Azure Backup vault</p>|


### Deployment scenarios

| Component | Can be deployed in Azure? | Can be deployed on-premises? | Target storage supported|
| --- | --- | --- | --- |
| Azure Backup agent | <p>**Yes**</p> <p>The Azure Backup agent can be deployed on any Windows Server VM that runs in Azure.</p> | <p>**Yes**</p> <p>The Backup agent can be deployed on any Windows Server VM or physical machine.</p> | <p>Azure Backup vault</p> |
| System Center Data Protection Manager (DPM) | <p>**Yes**</p><p>Learn more about [how to protect workloads in Azure by using System Center DPM](http://blogs.technet.com/b/dpm/archive/2014/09/02/azure-iaas-workload-protection-using-data-protection-manager.aspx).</p> | <p>**Yes**</p> <p>Learn more about [how to protect workloads and VMs in your datacenter](https://technet.microsoft.com/library/hh758173.aspx).</p> | <p>Locally attached disk,</p> <p>Azure Backup vault,</p> <p>tape (on-premises only)</p> |
| Azure Backup Server | <p>**Yes**</p><p>Learn more about [how to protect workloads in Azure by using Azure Backup Server](backup-azure-microsoft-azure-backup.md).</p> | <p>**Yes**</p> <p>Learn more about [how to protect workloads in Azure by using Azure Backup Server](backup-azure-microsoft-azure-backup.md).</p> | <p>Locally attached disk,</p> <p>Azure Backup vault</p> |
| Azure Backup (VM extension) | <p>**Yes**</p><p>Part of Azure fabric</p><p>Specialized for [backup of Azure infrastructure as a service (IaaS) virtual machines](backup-azure-vms-introduction.md).</p> | <p>**No**</p> <p>Use System Center DPM to back up virtual machines in your datacenter.</p> | <p>Azure Backup vault</p> |


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
| Azure IaaS VMs (Windows)<br/>running in Azure | - | [Azure Backup (VM extension)](backup-azure-vms-introduction.md) |
| Azure IaaS VMs (Linux) <br/>running in Azure| - | [Azure Backup (VM extension)](backup-azure-vms-introduction.md) |

## Linux support

| Component| Linux (Azure endorsed) Support |
| --- | ------ |
| Azure Backup (MARS) agent | No (Only Windows based agent) |
| System Center Data Protection Manager | Only Hyper-V (Not Azure VM) Only file-consistent backup is possible |
| Azure Backup Server (MABS) | Only Hyper-V (Not Azure VM) Only file-consistent backup is possible (Same as DPM) |
| Azure IaaS VM Backup | Yes |



## Back up and Restore Premium Storage VMs

The Azure Backup service now protects Premium Storage VMs.

### Back up Premium Storage VMs

While backing up Premium Storage VMs, the Backup service creates a temporary staging location in the Premium Storage account. The staging location, named "AzureBackup-", is equal to the total data size of the premium disks attached to the VM.

>[AZURE.NOTE] Do not modify or edit the staging location.

Once the backup job finishes, the staging location is deleted. The price of storage used for the staging location is consistent with all [Premium storage pricing](../storage/storage-premium-storage.md#pricing-and-billing).

### Restore Premium Storage VMs

Premium Storage VMs can be restored to either Premium Storage or to normal storage. Restoring a Premium Storage VM recovery point back to Premium Storage is the typical process of restoration. However, it can be cost effective to restore a Premium Storage VM recovery point to standard storage. This type of restoration can be used if you need a subset of files from the VM.

## Functionality
These five tables summarize how backup functionality is handled in each component.

### Storage

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Azure Backup vault | ![Yes][green] | ![Yes][green] | ![Yes][green] | ![Yes][green] |
| Disk storage | | ![Yes][green] | ![Yes][green] |  |
| Tape storage | | ![Yes][green] |  | |
| Compression (in backup vault) | ![Yes][green] | ![Yes][green]| ![Yes][green] | |
| Incremental backup | ![Yes][green] | ![Yes][green] | ![Yes][green] | ![Yes][green] |
| Disk deduplication | | ![Partially][yellow] | ![Partially][yellow]| | |

![table key](./media/backup-introduction-to-azure-backup/table-key.png)

The Backup vault is the preferred storage target across all components. System Center DPM and Backup Server also provide the option to have a local disk copy. However, only System Center DPM provides the option to write data to a tape storage device.

#### Incremental backup
Every component supports incremental backup regardless of the target storage (disk, tape, backup vault). Incremental backup ensures that backups are storage and time efficient, by transferring only those changes made since the last backup.

#### Compression
Backups are compressed to reduce the required storage space. The only component that does not use compression is the VM extension. With VM extension, all backup data is copied from the customer storage account to the backup vault in the same region without compressing it. While going without compression slightly inflates the storage used, storing the data without compression allows for faster restore times.

#### Deduplication
Deduplication is supported for System Center DPM and Backup Server when it is [deployed in a Hyper-V virtual machine](http://blogs.technet.com/b/dpm/archive/2015/01/06/deduplication-of-dpm-storage-reduce-dpm-storage-consumption.aspx). Deduplication is performed at the host level by using Windows Server deduplication on virtual hard disks (VHDs) that are attached to the virtual machine as backup storage.

>[AZURE.WARNING] Deduplication is not available in Azure for any of the Backup components. When System Center DPM and Backup Server are deployed in Azure, the storage disks attached to the VM cannot be deduplicated.

### Security

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Network security (to Azure) | ![Yes][green] |![Yes][green] | ![Yes][green] | ![Partially][yellow]|
| Data security (in Azure) | ![Yes][green] |![Yes][green] | ![Yes][green] | ![Partially][yellow]|

![table key](./media/backup-introduction-to-azure-backup/table-key.png)

All backup traffic from your servers to the Backup vault is encrypted by using Advanced Encryption Standard 256. The data is sent over a secure HTTPS link. The backup data is also stored in the Backup vault in encrypted form. Only the customer holds the passphrase to unlock this data. Microsoft cannot decrypt the backup data at any point.

>[AZURE.WARNING] The key used to encrypt the backup data is present only with the customer. Microsoft does not maintain a copy in Azure and does not have any access to the key. If the key is misplaced, Microsoft cannot recover the backup data.

Backing up Azure VMs requires setting up encryption *within* the virtual machine. Use BitLocker on Windows virtual machines and **dm-crypt** on Linux virtual machines. Azure Backup does not automatically encrypt backup data that comes through this path.

### Supported workloads

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Windows Server machine--files and folders | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Windows client machine--files and folders | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Hyper-V virtual machine (Windows) | | ![Yes][green] | ![Yes][green] | |
| Hyper-V virtual machine (Linux) | | ![Yes][green] | ![Yes][green] | |
| Microsoft SQL Server | | ![Yes][green] | ![Yes][green] | |
| Microsoft SharePoint | | ![Yes][green] | ![Yes][green] | |
| Microsoft Exchange  | | ![Yes][green] | ![Yes][green] | |
| Azure virtual machine (Windows) | | | | ![Yes][green] |
| Azure virtual machine (Linux) | | | | ![Yes][green] |

![table key](./media/backup-introduction-to-azure-backup/table-key-2.png)

### Network

| Feature | Azure Backup agent | System Center DPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Network compression (to the backup server) | | ![Yes][green] | ![Yes][green] | |
| Network compression (to the backup vault) | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Network protocol (to the backup server) | | TCP | TCP | |
| Network protocol (to the backup vault) | HTTPS | HTTPS | HTTPS | HTTPS |

![table key](./media/backup-introduction-to-azure-backup/table-key-2.png)

Because the VM extension reads the data directly from the Azure storage account over the storage network, it is not necessary to optimize this traffic. The traffic is over the local storage network in the Azure datacenter, so there is little need for compression because of bandwidth considerations.

If you are backing up your data to a backup server (DPM or Backup Server), traffic from the primary server to the backup server can be compressed to save on bandwidth.

#### Network Throttling
The Azure Backup agent provides throttling capability, which allows you to control how network bandwidth is used during data transfer. Throttling can be helpful if you need to back up data during work hours but do not want the backup process to interfere with other internet traffic. Throttling for data transfer applies to back up and restore activities.

### Backup and retention

|  | Azure Backup agent | System Center DPM | Azure Backup Server | Azure Backup (VM extension) |
| --- | --- | --- | --- | --- |
| Backup frequency (to the backup vault) | Three backups per day | Two backups per day |Two backups per day | One backup per day |
| Backup frequency (to disk) | Not applicable | <p>Every 15 minutes for SQL Server</p> <p>Every hour for other workloads</p> | <p>Every 15 minutes for SQL Server</p> <p>Every hour for other workloads</p> |Not applicable |
| Retention options | Daily, weekly, monthly, yearly | Daily, weekly, monthly, yearly | Daily, weekly, monthly, yearly |Daily, weekly, monthly, yearly |
| Retention period | Up to 99 years | Up to 99 years | Up to 99 years | Up to 99 years |
| Recovery points in Backup vault | Unlimited | Unlimited | Unlimited | Unlimited |
| Recovery points on local disk | Not applicable | 64 for File Servers,<br><br>448 for Application Servers | 64 for File Servers,<br><br>448 for Application Servers |Not applicable |
| Recovery points on tape | Not applicable | Unlimited | Not applicable | Not applicable |

## What is the vault credential file?

The vault credentials file is a certificate generated by the portal for each backup vault. The portal then uploads the public key to the Access Control Service (ACS). The private key is provided to the user when downloading the credentials and then entered during the machine registration. The private key authenticates the machine to send backup data to an identified vault in the Azure Backup service.

The vault credential is used only during the registration workflow. It is your responsibility to ensure that the vault credentials file is not compromised. If it falls in the hands of any rogue-user, the vault credentials file can be used to register other machines against the same vault. However, since the backup data is encrypted using a passphrase belonging only to the customer, existing backup data cannot be compromised. To mitigate this concern, vault credentials are set to expire in 48 hours. While you can download the vault credentials of a backup vault any number of times, only the latest file is applicable during the registration workflow.

## How does Azure Backup differ from Azure Site Recovery?
Azure Backup and Azure Site Recovery are related in that both services back up data and provide an ability to restore that data, but their core value propositions are different.

Azure Backup backs up data on-premises and in the cloud. Azure Site Recovery coordinates virtual-machine and physical-server replication, failover, and failback. Both services are important because your disaster recovery solution needs to keep your data safe and recoverable (Backup) *and* keep your workloads available (Site Recovery) when outages occur.

The following concepts can help you make important decisions around backup and disaster recovery.

| Concept | Details | Backup | Disaster recovery (DR) |
| ------- | ------- | ------ | ----------------- |
| Recovery point objective (RPO) | The amount of acceptable data loss if a recovery needs to be done. | Backup solutions have wide variability in their acceptable RPO. Virtual machine backups usually have an RPO of one day, while database backups have RPOs as low as 15 minutes. | Disaster recovery solutions have low RPOs. The DR copy can be behind by a few seconds or a few minutes. |
| Recovery time objective (RTO) | The amount of time that it takes to complete a recovery or restore. | Because of the larger RPO, the amount of data that a backup solution needs to process is typically much higher, which leads to longer RTOs. For example, it can take days to restore data from tapes, depending on the time it takes to transport the tape from an off-site location. | Disaster recovery solutions have smaller RTOs because they are more in sync with the source. Fewer changes need to be processed. |
| Retention | How long data needs to be stored | For scenarios that require operational recovery (data corruption, inadvertent file deletion, OS failure), backup data is typically retained for 30 days or less.<br>From a compliance standpoint, data might need to be stored for months or even years. Backup data is ideally suited for archiving in such cases. | Disaster recovery needs only operational recovery data, which typically takes a few hours or up to a day. Because of the fine-grained data capture used in DR solutions, using DR data for long-term retention is not recommended. |


## Next steps

Try out a simple Azure Backup. For instructions, see one of these tutorials:

- [Try Azure Backup](backup-try-azure-backup-in-10-mins.md)
- [Try Azure VM Backup](backup-azure-vms-first-look.md)

Because those tutorials help you back up quickly, they show you only the most direct path for backing up your data. For additional information about the type of back up you want to do, see:

- [Back up Windows machine](backup-configure-vault.md)
- [Back up application workloads](backup-azure-microsoft-azure-backup.md)
- [Backup Azure IaaS VMs](backup-azure-vms-prepare.md)



[green]: ./media/backup-introduction-to-azure-backup/green.png
[yellow]: ./media/backup-introduction-to-azure-backup/yellow.png
[red]: ./media/backup-introduction-to-azure-backup/red.png
