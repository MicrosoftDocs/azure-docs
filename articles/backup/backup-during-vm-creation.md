---
title: Enable Azure VM backup during creation
description: How to enable Azure virtual machine backup during the creation process.
services: backup, virtual-machines
author: rayne-wiselman
manager: carmonm
tags: azure-resource-manager, virtual-machine-backup
ms.service: backup
ms.topic: conceptual
ms.date: 01/08/2018
ms.author: trinadhk
---

# Enable backup when you create an Azure virtual machine

Use the Azure Backup service to back up Azure virtual machines (VMs). VMs are backed up according to a schedule specified in a backup policy, and recovery points are created from backups. Recovery points are stored in Recovery Services vaults.

This article details how to enable backup while you're creating a virtual machine (VM) in the Azure portal.  

## Sign in to Azure

If you aren't already signed in to your account, sign in to the [Azure portal](https://portal.azure.com).
 
## Create a VM with Backup configured 

1. In the upper-left corner of the Azure portal, select **New**.

1. Select **Compute**, and then select an image of the VM.

1. Enter the information for the VM. The username and password that you provide will be used to sign in to the VM. When you're finished, select **OK**. 

1. Select a size for the VM.  

1. Under **Settings** > **Backup**, select **Enabled** to open the backup configuration settings.

   - To accept the default values, select **OK** on the **Settings** page. You'll then go to the **Summary** page to create the VM. Skip steps 6-8.
   - To change the backup configuration values, follow the next steps.  

1. Create or select a Recovery Services vault to hold the backups of the VM. If you're creating a Recovery Services vault, you can choose a resource group for the vault.  

    ![Backup configuration settings in the VM creation page](./media/backup-during-vm-creation/create-vm-backup-config.png) 

    > [!NOTE] 
    > The resource group for the Recovery Services vault can be different than the resource group for the VM.  

1. By default, a backup policy is selected for you to protect the VM. A backup policy specifies how frequently to take backup snapshots and how long to keep those backup copies. 

   - You can accept the default policy, or you can create or select a different backup policy. 
   - To edit the backup policy, select **Backup policy** and change the values.  

1. When you're finished setting the backup configuration values, select **OK** on the **Settings** page.  

1. On the **Summary** page, after validation has passed, select **Create** to create a VM that uses the configured backup settings. 

## Start a backup after creating the VM 

Even though you've configured a Backup policy for your VM, it's a good practice to create an initial backup. 

After the VM creation template finishes, go to **Operations** in the left menu and select **Backup** to view the backup details for the virtual machine. You can use this page to:

- Trigger an on-demand backup.
- Restore a full VM or all its disks.
- Restore files from a VM backup.
- Change the backup policy associated with the VM.  

## Use a Resource Manager template to deploy a protected VM

The previous steps explain how to use the Azure portal to create a virtual machine and protect it in a Recovery Services vault. To quickly deploy one or more virtual machines and protect them in a Recovery Services vault, see the template [Deploy a Windows VM and enable backup](https://azure.microsoft.com/resources/templates/101-recovery-services-create-vm-and-configure-backup/).

## Frequently asked questions 

### Which VM images support backup configuration during VM creation?

The following core images published by Microsoft are supported for enabling backup during VM creation. For other VMs, you can enable backup after the VM is created. To learn more, see [Enable backup after VM is created](quick-backup-vm-portal.md).

- **Windows** - Windows Server 2016 Datacenter, Windows Server 2016 Datacenter Core, Windows Server 2012 Datacenter, Windows Server 2012 R2 Datacenter, Windows Server 2008 R2 SP1 
- **Ubuntu** - Ubuntu Server 17.10, Ubuntu Server 17.04, Ubuntu Server 16.04 (LTS), Ubuntu Server 14.04 (LTS) 
- **Red Hat** - RHEL 6.7, 6.8, 6.9, 7.2, 7.3, 7.4 
- **SUSE** - SUSE Linux Enterprise Server 11 SP4, 12 SP2, 12 SP3 
- **Debian** - Debian 8, Debian 9 
- **CentOS** - CentOS 6.9, CentOS 7.3 
- **Oracle Linux** - Oracle Linux 6.7, 6.8, 6.9, 7.2, 7.3 
 
### Is the backup cost included in the VM cost? 

No. Backup costs are separate from a VM's costs. For more information about backup pricing, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).
 
### Which permissions are required to enable backup on a VM? 

If you're a VM contributor, you can enable backup on the VM. If you're using a custom role, you need the following permissions to enable backup on the VM: 

- Microsoft.RecoveryServices/Vaults/write 
- Microsoft.RecoveryServices/Vaults/read 
- Microsoft.RecoveryServices/locations/* 
- Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/*/read 
- Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read 
- Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write 
- Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write 
- Microsoft.RecoveryServices/Vaults/backupPolicies/read 
- Microsoft.RecoveryServices/Vaults/backupPolicies/write 
 
If your Recovery Services vault and VM have different resource groups, make sure you have write permissions in the resource group for the Recovery Services vault.  

## Next steps 

Now that you've protected your VM, see the following articles to learn how to manage and restore VMs:

- [Manage and monitor your virtual machines](backup-azure-manage-vms.md) 
- [Restore virtual machines](backup-azure-arm-restore-vms.md) 
