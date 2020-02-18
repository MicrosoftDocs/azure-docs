---
title: About Azure Virtual Machine restore
description: Learn how the Azure Backup service restores Azure virtual machines
ms.topic: conceptual
ms.date: 02/18/2020
---

# About Azure VM restore

This article describes how the [Azure Backup service](https://docs.microsoft.com/azure/backup/backup-overview) restores Azure virtual machines (VMs).

## Concepts

### Recovery Point (RP) or PIT (Point In Time)

### Tiers (snapshot vs. vault)

### Role of storage architecture in restore

## Understand restore scenarios

| Scenario             | What is done                                                 | When to use                                                  |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Entire VM            | Restore the complete VM                                      | If the entire VM is lost <br>   Drill for audit or compliance  <br> To create a copy of the VM |
| Disk                 | Restore all the attached disks to the VM from the  point in time that you choose. | If the disk is lost or corrupted <br> To create a new VM from that disk <br> To create a copy of the disk |
| Files                | Choose restore point, browse, pick and restore               | Specific files need to be restored                           |
| Encrypted            | Restore the VM disk, and recreate the VM                     | If the entire VM is lost  <br>  Drill for audit or compliance <br>  To create a copy of the VM |
| Cross Region Restore | Restore VM in a secondary region                             | If primary region isn’t available due to outage or  drill    |

### Restore entire VM

#### Replace source VM

You can restore a disk, and use it to replace a disk on the existing VM. The current VM must exist. If it's been deleted, this option can't be used.

Azure Backup takes a snapshot of the existing VM before replacing the disk, and stores it in the staging location you specify. Existing disks connected to the VM are replaced with the selected restore point. The snapshot is copied to the vault, and retained in accordance with the retention policy.

After the replace disk operation, the original disk is retained in the resource group. You can choose to manually delete the original disks if they are not needed. If the restore point has more or less disks than the current VM, then the number of disks in the restore point will only reflect the VM configuration.

Replace existing is supported for unencrypted managed VMs. It's not supported for unmanaged disks, generalized VMs, or for VMs created using custom images. It also isn't supported for VMs with linked resources (like user-assigned managed-identity or Key Vault) because the backup client-app doesn't have permissions on these resources while performing the restore.

#### Create new VM in alternate location

This quickly creates and gets a basic VM up and running from a restore point.

You specify a name for the VM, select the resource group and virtual network (VNet) in which it will be placed, and specify a storage account for the restored VM. The new VM must be created in the same region as the source VM.

### Restore disks of the VM

This restores a VM disk, which can then be used to create a new VM. The restore job generates a template that you can download and use to specify custom VM settings, and create a VM.

The disks are copied to the Resource Group you specify.

Alternatively, you can attach the disk to an existing VM, or create a new VM using PowerShell.

### Restore files within the VM

You can also restore files and folders from a backed-up VM, if that VM was deployed using the Resource Manager model and protected to a Recovery services vault. For more information, see [Recover files from Azure virtual machine backup](backup-azure-restore-files-from-vm.md).

### Restore encrypted VM

#### Restore disk from encrypted VM

Restoring an disk from an encrypted VM follows the same process as restoring from an unencrypted VM.

#### Restore entire encrypted VM at alternate location

For encrypted VMs, replacing source VMs is not an option. To restore an encrypted VM in an alternate location follow these steps:

You restore encrypted VMs as follows:

1. Restore the VM disk.
2. Recreate the virtual machine instance by doing one of the following:
    1. Use the template that's generated during the restore operation to customize VM settings, and trigger VM deployment.
    2. Create a new VM from the restored disks using PowerShell. 
3. For Linux VMs, reinstall the ADE extension so the data disks are open and mounted.

For more information about backing up and restoring encrypted VMs, see [here](backup-azure-vms-encryption.md).

### Restore VM to another region

#### Restore entire VM to another region at alternate location

When a VM is restored to another region, replacing the source VM is not an option.

#### Restore disk from VM to another region

## How restore works

Before we explain how restore works, refer to the articles about [how backup works](backup-azure-vms-introduction.md).

### How full VM restore works

### How disk restore works

### How restore files within VM works

### How encrypted VM restore works

## Restore tool and client choices

### Azure portal

### Powershell

### Azure CLI

### SDK / REST API

### Template

## Guidance and best practices

### Before, during and after

### When to use what

### Preparedness

#### Educate

Education is important before disaster strikes.

##### Choices

##### Limitations

##### Resources for troubleshooting and common issues

#### Conduct Business continuity and disaster recovery (BCDR) drills

##### Identify known post-restore challenges

##### Identify unknown challenges

#### Sample BCDR plan




