<properties
	pageTitle="Preparing your environment to back up Azure virtual machines | Microsoft Azure"
	description="Make sure your environment is prepared to back up Azure virtual machines"
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/23/2015"
	ms.author="trinadhk; aashishr; jimpark; markgal"/>

# Preparing your environment to back up Azure virtual machines
Before you back up an Azure virtual machine, you need to complete these prerequisites to prepare your environment. If you've already done this, you can start [backing up your VMs](backup-azure-vms.md), otherwise, continue through the steps below to make sure your environment is ready.

## 1. Backup vault
To start backing up your Azure virtual machines, you first need to create a backup vault. A vault is an entity that stores all the backups and recovery points that have been created over time. The vault also contains the backup policies that will be applied to the virtual machines being backed up.

This image shows the relationships between the various Azure Backup entities:
![Azure Backup entities and relationship](./media/backup-azure-vms-prepare/vault-policy-vm.png)

To create a backup vault:

1. Sign in to the [Management Portal](http://manage.windowsazure.com/).

2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault** > **Quick Create**. If you have multiple subscriptions associated with your organizational account, choose the correct subscription to associate with the backup vault. In each Azure subscription you can have multiple backup vaults to organize the virtual machines being protected.

3. In **Name**, enter a friendly name to identify the vault. This needs to be unique for each subscription.

4. In **Region**, select the geographic region for the vault. The vault must be in the same region as the virtual machines you want to protect. If you have virtual machines in different regions create a vault in each one. There is no need to specify storage accounts to store the backup data – the backup vault and the Azure Backup service handle this automatically.

    ![Create backup vault](./media/backup-azure-vms-prepare/backup_vaultcreate.png)

5. Click **Create Vault**. It can take a while for the backup vault to be created. Monitor the status notifications at the bottom of the portal.

    ![Create vault toast notification](./media/backup-azure-vms-prepare/creating-vault.png)

6. A message confirms that the vault has been successfully created and it will be listed in the Recovery Services page as Active. Make sure that the appropriate storage redundancy option is chosen right after the vault has been created. Read more about [setting the storage redundancy option in the backup vault](backup-configure-vault.md#azure-backup---storage-redundancy-options).

    ![List of backup vaults](./media/backup-azure-vms-prepare/backup_vaultslist.png)

7. Click the backup vault to go to the **Quick Start** page, where the instructions for backing up Azure virtual machines are shown.

    ![Virtual machine backup instructions in the Dashboard page](./media/backup-azure-vms-prepare/vmbackup-instructions.png)

## 2. VM Agent
Before you can back up the Azure virtual machine, you should ensure that the Azure VM Agent is correctly installed on the virtual machine. Since the VM agent is an optional component at the time that the virtual machine is created, ensure that the checkbox for the VM agent is selected before the virtual machine is provisioned.

Learn about the [VM Agent](https://go.microsoft.com/fwLink/?LinkID=390493&clcid=0x409) and [how to install it](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/).

### Backup extension
To back up the virtual machine, the Azure Backup service installs an extension to the VM Agent. The Azure Backup service seamlessly upgrades and patches the backup extension without additional user intervention.

The backup extension is installed if the VM is running. A running VM also provides the greatest chance of getting an application consistent recovery point. However, the Azure Backup service will continue to back up the VM even if it is turned off and the extension could not be installed (aka Offline VM). In this case, the recovery point will be *Crash consistent* as discussed above.

## 3. Network connection
The backup extension needs connectivity to the internet to function correctly, because it sends commands to an Azure Storage endpoint (HTTP URL) to manage the snapshots of the VM. Without internet connectivity, these HTTP requests from the VM will time out and the backup operation will fail.

## Limitations

- Back up of Azure Resource Manager based (aka IaaS V2) virtual machines is not supported.
- Back up of virtual machines with more than 16 data disks is not supported.
- Back up of virtual machines using Premium storage is not supported.
- Back up of virtual machines with multiple reserved IPs is not supported.
- Back up of virtual machines with a reserved IP and no end-point defined is not supported.
- Back up of virtual machines using multiple NICs is not supported.
- Back up of virtual machines in a load-balanced configuration (internal and internet-facing) is not supported.
- Replacing an existing virtual machine during restore is not supported. First delete the existing virtual machine and any associated disks, and then restore the data from backup.
- Cross-region backup and restore is not supported.
- Virtual machine back up using the Azure Backup service is supported in all public regions of Azure. Here is a [checklist](http://azure.microsoft.com/regions/#services) of supported regions. If the region you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.
- Virtual machine back up using the Azure Backup service is only supported only for select Operating System versions:
  - **Linux**: The list of distributions endorsed by Azure is available [here](../virtual-machines-linux-endorsed-distributions.md). Other Bring-Your-Own-Linux distributions also should work as long as the VM Agent is available on the virtual machine.
  - **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.
- Restoring a domain controller VM that is part of a multi-DC configuration is supported only through PowerShell. Read more about [restoring a multi-DC domain controller](backup-azure-restore-vms.md#restoring-domain-controller-vms)

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps

- [Plan your VM backup infrastructure](backup-azure-vms-introduction.md)
- [Back up virtual machines](backup-azure-vms.md)
- [Manage virtual machine backup](backup-azure-manage-vms.md)
