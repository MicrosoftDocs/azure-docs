<properties
	pageTitle="What is Azure Backup? | Microsoft Azure"
	description="With Azure Backup and recovery services you can backup and restore data and applications from Windows servers, Windows client machines, SCDPM servers or Azure virtual machines."
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor="tysonn"
	keywords="backup and restore; recovery services"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/15/2016"
	ms.author="trinadhk;jimpark"/>

# What is Azure Backup?
Azure Backup is the service you use to back up and restore your data in the Microsoft cloud. It replaces your existing on-premises or offsite backup solution with a cloud-based solution that is reliable, secure, and cost competitive. It also protects assets running in the cloud. Azure Backup provides recovery services built on a world class infrastructure that is scalable, durable and highly available.

[Watch a video overview of Azure Backup](https://azure.microsoft.com/documentation/videos/what-is-azure-backup/)

## Why use Azure Backup?
Traditional backup solutions have evolved to treat the cloud as an endpoint similar to disk or tape. While this approach is simple, it is limited and does not take full advantage of an underlying cloud platform. This translates to an inefficient, expensive solution.
Azure Backup, on the other hand, delivers all the advantages of a powerful & affordable cloud backup solution. Some of the key benefits that Azure Backup provides include:

| FEATURE | BENEFIT |
| ------- | ------- |
| Automatic storage management | No capital expenditure is needed for on-premises storage devices. Azure Backup automatically allocates and manages backup storage, with a pay-as-you-use consumption model. |
| Unlimited scaling | High availability guarantees without the overhead of maintenance and monitoring. Azure Backup uses the underlying power and scale of the Azure cloud, with non-intrusive auto scaling capabilities. |
| Multiple storage options | Choose the backup storage based on need: <li>LRS (Locally Redundant Storage) block blob is ideal for price-conscious customers while still protecting data against local hardware failures. <li>GRS (Geo Replication storage) block blob provides 3 additional copies in a paired data center, ensuring that your backup data is highly available even in the event of an Azure-site-level disaster. |
| Unlimited data transfer | No charge for any egress (outbound) data transfer cost during a restore operation from the Azure Backup vault. Data inbound to Azure is also free. |
| Central management | Simplicity and familiarity of the Azure portal. As the service evolves, features like central management will allow you to manage your backup infrastructure from a single location. |
| Data encryption | Secure transmission and storage of customer data in the public cloud. The encryption passphrase is stored at source and is never transmitted or stored in Azure. The encryption key is required to restore any of the data and only the customer has full access to the data in the service. |  
| VSS integration | Application consistent backups on Windows ensure that fix-up is not needed at the time of restore. This reduces the RTO and allows customers to return a running state quicker. |
| Long term retention | Rather than paying for offsite tape backup solutions, customers can backup to Azure which provides a compelling solution with tape-like-semantics at a very low cost. |

## Azure Backup components
As Azure Backup is a hybrid backup solution, it consists of multiple components that work together to enable the end-to-end backup and restore workflows.

![Azure Backup components](./media/backup-introduction-to-azure-backup/azure-backup-overview.png)

## Deployment scenarios

| Component | Can be deployed in Azure? | Can be deployed on-premises? | Target storage supported|
| --- | --- | --- | --- |
| Azure Backup agent | <p>**Yes**</p> <p>The Azure Backup agent can be deployed on any Windows Server VM running in Azure.</p> | <p>**Yes**</p> <p>The Azure Backup agent can be deployed on any Windows Server VM or physical machine.</p> | <p>Azure Backup vault</p> |
| System Center Data Protection Manager (SCDPM) | <p>**Yes**</p> <p>Learn more about [protecting workloads in Azure using SCDPM](http://blogs.technet.com/b/dpm/archive/2014/09/02/azure-iaas-workload-protection-using-data-protection-manager.aspx).</p> | <p>**Yes**</p> <p>Learn more about [protecting workloads and VMs in your datacenter](https://technet.microsoft.com/library/hh758173.aspx).</p> | <p>Locally attached disk,</p> <p>Azure Backup vault,</p> <p>Tape (on-premises only)</p> |
| Azure Backup Server | <p>**Yes**</p> <p>Learn more about [protecting workloads in Azure using Azure Backup Server](backup-azure-microsoft-azure-backup.md).</p> | <p>**Yes**</p> <p>Learn more about [protecting workloads in Azure using Azure Backup Server](backup-azure-microsoft-azure-backup.md).</p> | <p>Azure Backup vault</p> |
| Azure Backup (VM extension) | <p>Yes</p> <p>Specialized for [backup of Azure IaaS virtual machines](backup-azure-vms-introduction.md).</p> | <p>**No**</p> <p>Use SCDPM to backup virtual machines in your datacenter.</p> | <p>Azure Backup vault</p> |

## What applications and workloads can I backup?

| Workload | Source machine | Azure Backup solution |
| --- | --- |---|
| Files & folders | Windows Server | <p>[Azure Backup agent](backup-configure-vault.md),</p> <p>[System Center DPM](backup-azure-dpm-introduction.md),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p>  |
| Files & folders | Windows client | <p>[Azure Backup agent](backup-configure-vault.md),</p> <p>[System Center DPM](backup-azure-dpm-introduction.md),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p>  |
| Hyper-V Virtual machine (Windows) | Windows Server | <p>System Center DPM,</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p> |
| Hyper-V Virtual machine (Linux) | Windows Server |  <p>System Center DPM,</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p>  |
| Microsoft SQL Server | Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p>  |
| Microsoft SharePoint | Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p>   |
| Microsoft Exchange |  Windows Server | <p>[System Center DPM](backup-azure-backup-sql.md),</p> <p>[Azure Backup Server](backup-azure-microsoft-azure-backup.md)</p>   |
| Azure IaaS VMs (Windows)|  - | [Azure Backup (VM extension)](backup-azure-vms-introduction.md) |
| Azure IaaS VMs (Linux) | - | [Azure Backup (VM extension)](backup-azure-vms-introduction.md) |

## Functionality
These tables summarize how Azure Backup functionality is handled in each component:

### 1. Storage

| Feature | Azure Backup agent | SCDPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Azure Backup vault | ![Yes][green] | ![Yes][green] | ![Yes][green] | ![Yes][green] |
| Disk storage | | ![Yes][green] | ![Yes][green] |  |
| Tape storage | | ![Yes][green] |  | |
| Compression (in backup vault) | ![Yes][green] | ![Yes][green]| ![Yes][green] | |
| Incremental backup | ![Yes][green] | ![Yes][green] | ![Yes][green] | ![Yes][green] |
| Disk Deduplication | | ![Partially][yellow] | ![Partially][yellow]| | |

The Azure Backup vault is the preferred storage target across all components. SCDPM and the Azure Backup Server provide the option to have a local disk copy as well, but only SCDPM provides the option to write data to a tape storage device.

#### Incremental backup
Independent of the target storage (disk, tape, backup vault), every component supports incremental backups. This ensures that backups are storage efficient and time efficient by taking only the incremental changes since the last backup, and transferring those to the target storage. Furthermore, backups are compressed to reduce the storage footprint.

The component that does no compression is the VM extension. All backup data is copied from the customer storage account to the backup vault in the same region without compressing it. While this inflates the storage consumed a little, storing the data without compression allows for faster restore times.

#### Deduplication
Deduplication is supported for SCDPM and Azure Backup Server when [deployed within a Hyper-V virtual machine](http://blogs.technet.com/b/dpm/archive/2015/01/06/deduplication-of-dpm-storage-reduce-dpm-storage-consumption.aspx). Deduplication is performed at the host-level by leveraging the Windows Server Deduplication feature - on the VHDs attached as backup storage to the virtual machine.

>[AZURE.WARNING] Deduplication is not available in Azure for any of the Azure Backup components! When SCDPM and Azure Backup Server are deployed in Azure, the storage disks attached to the VM cannot be deduplicated.

### 2. Security

| Feature | Azure Backup agent | SCDPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Network security (to Azure) | ![Yes][green] |![Yes][green] | ![Yes][green] | ![Partially][yellow]|
| Data security (in Azure) | ![Yes][green] |![Yes][green] | ![Yes][green] | ![Partially][yellow]|

All backup traffic from your servers to the Azure Backup vault is encrypted using AES256, and the data is sent over a secure HTTPS link. The backup data is also stored in the backup vault in its encrypted form. Only the customer holds the passphrase to unlock this data - Microsoft cannot decrypt the backup data at any point.

>[AZURE.WARNING] The key used to encrypt the backup data is present only with the customer. Microsoft does not maintain a copy in Azure and does not have any access to the key. If the key is misplaced, Microsoft cannot recover the backup data.

For backup of Azure VMs, you must explicitly setup encryption *within* the virtual machine. Use BitLocker on Windows virtual machines and dm-crypt on Linux virtual machines. Azure Backup does not automatically encrypt backup data coming through this path.

### 3. Supported workloads

| Feature | Azure Backup agent | SCDPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Windows Server machine - files/folders | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Windows client machine - files/folders | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Hyper-V virtual machine (Windows) | | ![Yes][green] | ![Yes][green] | |
| Hyper-V virtual machine (Linux) | | ![Yes][green] | ![Yes][green] | |
| Microsoft SQL Server | | ![Yes][green] | ![Yes][green] | |
| Microsoft SharePoint | | ![Yes][green] | ![Yes][green] | |
| Microsoft Exchange  | | ![Yes][green] | ![Yes][green] | |
| Azure virtual machine (Windows) | | | | ![Yes][green] |
| Azure virtual machine (Linux) | | | | ![Yes][green] |

### 4. Network

| Feature | Azure Backup agent | SCDPM | Azure Backup Server | Azure Backup (VM extension) |
| ------- | --- | --- | --- | ---- |
| Network compression (to backup server) | | ![Yes][green] | ![Yes][green] | |
| Network compression (to backup vault) | ![Yes][green] | ![Yes][green] | ![Yes][green] | |
| Network protocol (to backup server) | | TCP | TCP | |
| Network protocol (to backup vault) | HTTPS | HTTPS | HTTPS | HTTPS |

Since the VM extension directly reads the data from the Azure Storage account over the storage network, optimizing this traffic is not necessary. The traffic is over the local storage network in the Azure DC, there is little need for compression that arises due to bandwidth considerations.

For customers protecting data to a backup server (SCDPM or Azure Backup Server), the traffic from the primary server to the backup server can also be compressed to save on bandwidth utilization.

## How does Azure Backup differ from Azure Site Recovery?
Many customers confuse backup and disaster recovery. Both capture data and provide restore semantics, but the core value proposition is different for each.

Azure Backup backs up data on-premises or in the cloud. Azure Site Recovery coordinates virtual machine and physical server replication, failover, and failback. You need both of these for a complete disaster recovery solution because your disaster recovery strategy needs to keep your data safe and recoverable (Azure Backup) AND keep your workloads available and accessible (Azure Site Recovery) when outages occur.

To make decisions around backup and disaster recovery, a few important concepts should be understood:

| CONCEPT | DETAILS | BACKUP | DISASTER RECOVERY (DR) |
| ------- | ------- | ------ | ----------------- |
| Recovery Point Objective (RPO) | The amount of data loss that is acceptable in case a recovery needs to be done. | Backup solutions have a large variance in the RPO that is acceptable. Virtual machine backups usually have an RPO of 1 day, while database backups have RPOs as low as 15 minutes. | Disaster Recovery solutions have extremely low RPOs. The DR copy can be behind by few seconds or a few minutes. |
| Recovery Time Objective (RTO) | The amount of time that it takes to complete a recovery/restore. | Because of the larger RPO, the amount of data that a backup solution needs to process is typically much higher - and this leads to longer RTOs. For example, restoring data from tapes can take days, depending on the time taken to transport the tape from an off-site location. | Disaster Recovery solutions have smaller RTOs as they are more in sync with the source, and fewer changes need to processed. |
| Retention | How long data needs to be stored | <p>For scenarios that require operational recovery (data corruption, inadvertent file deletion, OS failures), the backup data is typically retained for 30 days or less.</p> <p>From a compliance standpoint, data might have to be stored for months or even years. Backup data is ideally suited for archival in such cases.</p> | Disaster Recovery needs only operational recovery data - typically a few hours or up to a day. Because of the fine-grained data capture used in DR solutions, long term retention is not recommended using DR data. |

## Next steps

- [Try Azure Backup](backup-try-azure-backup-in-10-mins.md)
- Frequently asked question on the Azure Backup service is listed [here](backup-azure-backup-faq.md).
- Visit the [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933).


[green]: ./media/backup-introduction-to-azure-backup/green.png
[yellow]: ./media/backup-introduction-to-azure-backup/yellow.png
[red]: ./media/backup-introduction-to-azure-backup/red.png
