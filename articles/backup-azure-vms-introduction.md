<properties
	pageTitle="Introduction to Azure machine virtual backup"
	description="An introduction to backing up virtual machines in Azure using the Azure Backup service"
	services="backup"
	documentationCenter=""
	authors="aashishr"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/30/2015"
	ms.author="aashishr"/>

# Azure virtual machine backup - Introduction

This section provides an introduction to using Microsoft Azure Backup to protect your Azure virtual machines. By reading it you’ll learn about:

+ How Azure virtual machine backup works

+ The procedure to back up your Azure virtual machine

+ The prerequisites to achieve a smooth backup experience

+ The typical errors encountered and how to deal with them

+ The list of unsupported scenarios and how to influence changes to the product

To learn more about Azure virtual machines quickly, see the [Virtual Machine documentation][vm-doc].

## Why backup the Azure virtual machine?
Cloud computing enables applications to execute in a scalable and highly available environment – which is why Microsoft developed Azure virtual machines. The data generated from these Azure virtual machines is important, and requires backup for safekeeping. Typical scenarios that require data to be restored from backups are:

+ Accidental or malicious deletion of files

+ Corruption of the virtual machine during a patch update

+ Accidental or malicious deletion of the entire virtual machine

Data can be backed up from these virtual machines in two distinct ways:

+ Back up the individual sources of data from within the virtual machine

+ Back up the whole virtual machine


Back up of the entire virtual machine is popular because it is far simpler to manage and it also facilitates easy restores of the entire application and operating system. Azure Backup can be used for in-guest data backup or backup of the complete virtual machine.

The business benefits of using Azure Backup for virtual machine backup are:

+ Automation of the backup and recovery workflows for your virtual machines

+ Application-consistent backups to ensure that recovered data starts from a consistent state.

+ No downtime involved during virtual machine backup.

+ Windows or Linux virtual machines can be backed up.

+ Recovery points are available for easy restore in the Azure Backup vault.

+ Automatic pruning and garbage collection of older recovery points.

## How does Azure virtual machine backup work?
To back up a virtual machine, first a point-in-time snapshot of the data is needed. The Azure Backup service initiates the backup job at the scheduled time, and triggers the backup extension to take a snapshot. The backup extension coordinates with the in-guest VSS service to achieve consistency, and invokes the blob snapshot API of the Azure Storage service once consistency has been reached. This is done to get a consistent snapshot of the disks of the virtual machine, without having to shut it down.


After the snapshot has been taken, the data is transferred by the Azure Backup service to the backup vault. The service takes care of identifying and transferring only the blocks that have changed from the last backup – making the backups storage efficient. When the data transfer is completed, the snapshot is removed and a recovery point is created. This recovery point can be seen in the Azure management portal.

![Azure virtual machine backup architecture][vm-backup-arch]

>  
>[AZURE.NOTE] For Linux virtual machines, only file-consistent backup is possible.


## Calculating protected instances
Azure virtual machines that are backed up using Azure Backup will be subject to [Azure Backup pricing][azure-backup-pricing]. The Protected Instances calculation is based on the *actual* size of the virtual machine, which is the sum of all the data in the virtual machine – excluding the “resource disk”. You are *not* billed based on the maximum size supported for each data disk attached to the virtual machine, but on the actual data stored in the data disk. Similarly, the backup storage bill is based on the amount of data stored with Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2-Standard sized virtual machine that has two additional data disks with a maximum size of 1TB each. The table below gives the actual data stored on each of these disks:

|Disk type|Max size|Actual data present|
|---------|--------|------|
| OS disk | 1023GB | 17GB |
| Local disk / Resource disk | 135GB | 5GB (not included for backup) |
| Data disk 1 |	1023GB | 30GB |
| Data disk 2 | 1023GB | 0GB |

The *actual* size of the virtual machine in this case is 17GB + 30GB + 0GB = 47GB. This becomes the Protected Instance size that the monthly bill is based on. As the amount of data in the virtual machine grows, the Protected Instance size used for billing also will change appropriately.


## Prerequisites
### 1. Backup vault
To start backing up your Azure virtual machines, you need to first create a backup vault. The vault is an entity that stores all the backups and recovery points that have been created over time. The vault also contains the backup policies that will be applied to the virtual machines being backed up.

The image below shows the relationships between the various Azure Backup entities:
![Azure Backup entities and relationship][backup-entities]

### To create a backup vault

1. Sign in to the [Management Portal][mgmt-portal].

2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault** > **Quick Create**. If you have multiple subscriptions associated with your organizational account, choose the correct subscription to associate with the backup vault. In each Azure subscription you can have multiple backup vaults to organize the virtual machines being protected.

3. In **Name**, enter a friendly name to identify the vault. This needs to be unique for each subscription.

4. In **Region**, select the geographic region for the vault. Note that the vault must be in the same region as the virtual machines you want to protect. If you have virtual machines in different regions create a vault in each one. There is no need to specify storage accounts to store the backup data – the backup vault and the Azure Backup service will handle this automatically.
  	![Create backup vault][create-vault]

  	> [AZURE.NOTE] Virtual machine backup using the Azure Backup service is only supported in select regions. Check list of [supported regions](http://azure.microsoft.com/regions/#services). If the region you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.

5. Click on **Create Vault**.
It can take a while for the backup vault to be created. Monitor the status notifications at the bottom of the portal.
![Create vault toast notification][create-vault-toast]

6. A message confirms that the vault has been successfully created and it will be listed in the Recovery Services page as Active.
![List of backup vaults][vault-list]

7. Clicking on the backup vault goes to the **Quick Start** page, where the instructions for backup of Azure virtual machines are shown.
![Virtual machine backup instructions in the Dashboard page][vmbackup-instructions]

  	> [AZURE.NOTE] Ensure that the appropriate storage redundancy option is chosen right after the vault has been created. Read more about [setting the storage redundancy option in the backup vault][vault-storage-redundancy].

### 2. VM Agent
Before you can start to backup the Azure virtual machine, ensure that the Azure VM Agent is correctly installed on the virtual machine. In order to backup the virtual machine, the Azure Backup service installs an extension to the VM Agent. Since the VM agent is an optional component at the time that the virtual machine is created, you need to ensure that the checkbox for the VM agent is selected before the virtual machine is provisioned.

Learn about the [VM Agent][vmagent-doc] and [how to install it][vmagent-howtoinstall].

> [AZURE.NOTE] If you are planning to migrate your virtual machine from your on-premises datacenter to Azure, ensure that you download and install the VM agent MSI before your start the migration process. This also applies to virtual machines protected to Azure using Azure Site Recovery.

## Limitations during Preview

+ Backup of virtual machines with more than 6 disks is not supported.

+ Backup of virtual machines using Premium storage is not supported.

+ Replacing an existing virtual machine during restore is not supported. First delete the existing virtual machine and any associated disks, and then restore the data from backup.

+ Backup of virtual machines restored using Azure Site Recovery.

+ Cross-region backup and restore is not supported.

+ Virtual machine backup using the Azure Backup service is only supported in select regions. Check list of [supported regions](http://azure.microsoft.com/regions/#services). If the region you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.

+ Registration of offline virtual machines will fail. The virtual machine must be running for the registration process to succeed.


If there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).


## Next steps
To get started with virtual machine backup, learn how to:

- [Discover, register and protect virtual machines](backup-azure-vms.md)

- [Restore virtual machines](backup-azure-restore-vms.md)

+ Monitor the backup jobs




[mgmt-portal]: http://manage.windowsazure.com/
[vm-doc]: https://azure.microsoft.com/documentation/services/virtual-machines/
[azure-backup-pricing]: http://azure.microsoft.com/pricing/details/backup/
[vault-storage-redundancy]: http://azure.microsoft.com/documentation/articles/backup-azure-backup-create-vault/#azure-backup---storage-redundancy-options
[vmagent-doc]: https://go.microsoft.com/fwLink/?LinkID=390493&clcid=0x409
[vmagent-howtoinstall]: http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/

[vm-backup-arch]: ./media/backup-azure-vms-introduction/vmbackup-architecture.png
[backup-entities]: ./media/backup-azure-vms-introduction/vault-policy-vm.png
[create-vault]: ./media/backup-azure-vms-introduction/backup_vaultcreate.png
[create-vault-toast]: ./media/backup-azure-vms-introduction/creating-vault.png
[vault-list]: ./media/backup-azure-vms-introduction/backup_vaultslist.png
[vmbackup-instructions]: ./media/backup-azure-vms-introduction/vmbackup-instructions.png
