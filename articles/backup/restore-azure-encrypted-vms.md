---
title: Restore encrypted Azure VMs
description: Describes how to restore encrypted Azure VMs with the Azure Backup service.
ms.topic: conceptual
ms.date: 08/17/2021
---
# Restore encrypted Azure virtual machines

This article describes how to restore Windows or Linux Azure virtual machines (VMs) with encrypted disks using the [Azure Backup](backup-overview.md) service. For more information, see [Encryption of Azure VM backups](backup-azure-vms-introduction.md#encryption-of-azure-vm-backups).

## Restore an encrypted VM

Encrypted VMs can only be restored by restoring the VM disk and creating a virtual machine instance as explained below. **Replace existing disk on the existing VM**, **creating a VM from restore points** and **files or folder level restore** are currently not supported.
 
Follow below steps to restore encrypted VMs:

- **Step 1**: Restore the VM disk

1. In **Restore configuration** > **Create new** > **Restore Type**, select **Restore disks**.
1. In **Resource group**, select an existing resource group for the restored disks, or create a new one with a globally unique name.
1. In **Staging location**, specify the storage account to which to copy the VHDs. [Learn more](#storage-accounts).

    ![Select Resource group and Staging location](./media/backup-azure-arm-restore-vms/trigger-restore-operation1.png)

1. Select **Restore** to trigger the restore operation.

When your virtual machine uses managed disks and you select the **Create virtual machine** option, Azure Backup doesn't use the specified storage account. In the case of **Restore disks** and **Instant Restore**, the storage account is used only for storing the template. Managed disks are created in the specified resource group.
When your virtual machine uses unmanaged disks, they're restored as blobs to the storage account.

   > [!NOTE]
   > After you restore the VM disk, you can manually swap the OS disk of the original VM with the restored VM disk without re-creating it. [Learn more](https://azure.microsoft.com/blog/os-disk-swap-managed-disks/).

- **Step 2**. Recreate the virtual machine instance by doing one of the following actions:
    1. Use the template that's generated during the restore operation to customize VM settings and trigger VM deployment. [Learn more](backup-azure-arm-restore-vms.md#use-templates-to-customize-a-restored-vm).
       >[!NOTE]
       >While deploying the template, verify the storage account containers and the public/private settings.
    1. Create a new VM from the restored disks using PowerShell. [Learn more](backup-azure-vms-automation.md#create-a-vm-from-restored-disks).
    1. For Linux VMs, reinstall the ADE extension so the data disks are open and mounted.




