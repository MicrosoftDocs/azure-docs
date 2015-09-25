<properties
	pageTitle="Introduction to Azure machine virtual backup | Microsoft Azure"
	description="An introduction to backing up virtual machines in Azure using the Azure Backup service"
	services="backup"
	documentationCenter=""
	authors="trinadhk"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/24/2015"
	ms.author="trinadhk";"aashishr";"jimpark"/>

# Azure virtual machine backup

This section provides an introduction to using Microsoft Azure Backup to protect your Azure virtual machines. By reading it you’ll learn about:

- How Azure virtual machine backup works
- The procedure to back up your Azure virtual machine
- The prerequisites to achieve a smooth backup experience
- The typical errors encountered and how to deal with them
- The list of unsupported scenarios and how to influence changes to the product

To learn more about Azure virtual machines quickly, see the [Virtual Machine documentation](https://azure.microsoft.com/documentation/services/virtual-machines/).

## Why backup the Azure virtual machine?
Cloud computing enables applications to execute in a scalable and highly available environment – which is why Microsoft developed Azure virtual machines. The data generated from these Azure virtual machines is important, and requires backup for safekeeping. Typical scenarios that require data to be restored from backups are:

- Accidental or malicious deletion of files
- Corruption of the virtual machine during a patch update
- Accidental or malicious deletion of the entire virtual machine

Data can be backed up from these virtual machines in two distinct ways:

- Back up the individual sources of data from within the virtual machine
- Back up the whole virtual machine

Back up of the entire virtual machine is popular because it is far simpler to manage and it also facilitates easy restores of the entire application and operating system. Azure Backup can be used for in-guest data backup or backup of the complete virtual machine.

The business benefits of using Azure Backup for virtual machine backup are:

- Automation of the backup and recovery workflows for your virtual machines
- Application-consistent backups to ensure that recovered data starts from a consistent state.
- No downtime involved during virtual machine backup.
- Windows or Linux virtual machines can be backed up.
- Recovery points are available for easy restore in the Azure Backup vault.
- Automatic pruning and garbage collection of older recovery points.

## How does Azure virtual machine backup work?
To back up a virtual machine, first a point-in-time snapshot of the data is needed. The Azure Backup service initiates the backup job at the scheduled time, and triggers the backup extension to take a snapshot. The backup extension coordinates with the in-guest VSS service to achieve consistency, and invokes the blob snapshot API of the Azure Storage service once consistency has been reached. This is done to get a consistent snapshot of the disks of the virtual machine, without having to shut it down.

After the snapshot has been taken, the data is transferred by the Azure Backup service to the backup vault. The service takes care of identifying and transferring only the blocks that have changed from the last backup – making the backups storage efficient. When the data transfer is completed, the snapshot is removed and a recovery point is created. This recovery point can be seen in the Azure management portal.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

>[AZURE.NOTE] For Linux virtual machines, only file-consistent backup is possible.

## Calculating protected instances
Azure virtual machines that are backed up using Azure Backup will be subject to [Azure Backup pricing](http://azure.microsoft.com/pricing/details/backup/). The Protected Instances calculation is based on the *actual* size of the virtual machine, which is the sum of all the data in the virtual machine – excluding the “resource disk”. You are *not* billed based on the maximum size supported for each data disk attached to the virtual machine, but on the actual data stored in the data disk. Similarly, the backup storage bill is based on the amount of data stored with Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2-Standard sized virtual machine that has two additional data disks with a maximum size of 1TB each. The table below gives the actual data stored on each of these disks:

|Disk type|Max size|Actual data present|
|---------|--------|------|
| OS disk | 1023GB | 17GB |
| Local disk / Resource disk | 135GB | 5GB (not included for backup) |
| Data disk 1 |	1023GB | 30GB |
| Data disk 2 | 1023GB | 0GB |

The *actual* size of the virtual machine in this case is 17GB + 30GB + 0GB = 47GB. This becomes the Protected Instance size that the monthly bill is based on. As the amount of data in the virtual machine grows, the Protected Instance size used for billing also will change appropriately.

The billing does not start until the first successful backup is completed. At this point the billing for both Storage and Protected Instances will begin. The billing continues as long as there is *any backup data stored with Azure Backup* for the virtual machine. Performing the Stop Protection operation does not stop the billing if the backup data is retained. The billing for a specified virtual machine will be discontinued only if the protection is stopped *and* any backup data is deleted. When there are no active backup jobs (when protection has been stopped), the size of the virtual machine at the time of the last successful backup becomes the Protected Instance size that the monthly bill is based on.

## Prerequisites
### 1. Backup vault
To start backing up your Azure virtual machines, you need to first create a backup vault. The vault is an entity that stores all the backups and recovery points that have been created over time. The vault also contains the backup policies that will be applied to the virtual machines being backed up.

The image below shows the relationships between the various Azure Backup entities:
![Azure Backup entities and relationship](./media/backup-azure-vms-introduction/vault-policy-vm.png)

### To create a backup vault

1. Sign in to the [Management Portal](http://manage.windowsazure.com/).

2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault** > **Quick Create**. If you have multiple subscriptions associated with your organizational account, choose the correct subscription to associate with the backup vault. In each Azure subscription you can have multiple backup vaults to organize the virtual machines being protected.

3. In **Name**, enter a friendly name to identify the vault. This needs to be unique for each subscription.

4. In **Region**, select the geographic region for the vault. Note that the vault must be in the same region as the virtual machines you want to protect. If you have virtual machines in different regions create a vault in each one. There is no need to specify storage accounts to store the backup data – the backup vault and the Azure Backup service will handle this automatically.
    ![Create backup vault](./media/backup-azure-vms-introduction/backup_vaultcreate.png)

5. Click on **Create Vault**.
It can take a while for the backup vault to be created. Monitor the status notifications at the bottom of the portal.
![Create vault toast notification](./media/backup-azure-vms-introduction/creating-vault.png)

6. A message confirms that the vault has been successfully created and it will be listed in the Recovery Services page as Active. Ensure that the appropriate storage redundancy option is chosen right after the vault has been created. Read more about [setting the storage redundancy option in the backup vault](../backup-azure-backup-create-vault.md#storage-redundancy-options).
![List of backup vaults](./media/backup-azure-vms-introduction/backup_vaultslist.png)

7. Clicking on the backup vault goes to the **Quick Start** page, where the instructions for backup of Azure virtual machines are shown.
![Virtual machine backup instructions in the Dashboard page](./media/backup-azure-vms-introduction/vmbackup-instructions.png)


### 2. VM Agent
Before you can start to back up the Azure virtual machine, ensure that the Azure VM Agent is correctly installed on the virtual machine. In order to back up the virtual machine, the Azure Backup service installs an extension to the VM Agent. Since the VM agent is an optional component at the time that the virtual machine is created, you need to ensure that the checkbox for the VM agent is selected before the virtual machine is provisioned.

Learn about the [VM Agent](https://go.microsoft.com/fwLink/?LinkID=390493&clcid=0x409) and [how to install it](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/).

## Limitations

- Backup of Azure Resource Manager based (aka IaaS V2) virtual machines is not supported.
- Backup of virtual machines with more than 16 data disks is not supported.
- Backup of virtual machines using Premium storage is not supported.
- Backup of virtual machines with multiple reserved IPs is not supported.
- Backup of virtual machines with a reserved IP and no end-point defined is not supported.
- Backup of virtual machines using multiple NICs or in a load-balanced configuration is not supported.
- Replacing an existing virtual machine during restore is not supported. First delete the existing virtual machine and any associated disks, and then restore the data from backup.
- Cross-region backup and restore is not supported.
- Virtual machine backup using the Azure Backup service is supported in all public regions of Azure. Here is a [checklist](http://azure.microsoft.com/regions/#services) of supported regions. If the region you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.
- Virtual machine backup using the Azure Backup service is only supported only for select Operating System versions:
  - **Linux**: The list of distributions endorsed by Azure is available [here](../virtual-machines-linux-endorsed-distributions.md). Other Bring-Your-Own-Linux distributions also should work as long as the VM Agent is available on the virtual machine.
  - **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.
- Restoring a domain controller VM that is part of a multi-DC configuration is supported only through PowerShell. Read more about [restoring a multi-DC domain controller](backup-azure-restore-vms.md#restoring-domain-controller-vms)

If there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps
To get started with virtual machine backup, learn how to:

- [Backup virtual machines](backup-azure-vms.md)
- [Restore virtual machines](backup-azure-restore-vms.md)
- [Manage virtual machine backup](backup-azure-manage-vms.md)
