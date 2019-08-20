---

title: Use a Linux troubleshooting VM with the Azure CLI | Microsoft Docs
description: Learn how to troubleshoot Linux VM issues by connecting the OS disk to a recovery VM using the Azure CLI
services: virtual-machines-linux
documentationCenter: ''
author: genlin
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/16/2017
ms.author: genli

---

# Troubleshoot a Linux VM by attaching the OS disk to a recovery VM with the Azure CLI
If your Linux virtual machine (VM) encounters a boot or disk error, you may need to perform troubleshooting steps on the virtual hard disk itself. A common example would be an invalid entry in `/etc/fstab` that prevents the VM from being able to boot successfully. This article details how to use the Azure CLI to connect your virtual hard disk to another Linux VM to fix any errors, then re-create your original VM. 

## Recovery process overview
The troubleshooting process is as follows:

1. Stop the affected VM.
1. Take a snapshot from the OS disk of the VM.
1. Create a disk from the OS disk snapshot.
1. Attach and mount the new OS disk to another Linux VM for troubleshooting purposes.
1. Connect to the troubleshooting VM. Edit files or run any tools to fix issues on the new OS disk.
1. Unmount and detach the new OS disk from the troubleshooting VM.
1. Change the OS disk for the affected VM.

To perform these troubleshooting steps, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

> [!Important]
> The scripts in this article only apply to the VMs that use [Managed Disk](../linux/managed-disks-overview). 

In the following examples, replace parameter names with your own values. Example parameter names include `myResourceGroup` and `myVM`.

## Determine boot issues
Examine the serial output to determine why your VM is not able to boot correctly. A common example is an invalid entry in `/etc/fstab`, or the underlying virtual hard disk being deleted or moved.

Get the boot logs with [az vm boot-diagnostics get-boot-log](/cli/azure/vm/boot-diagnostics). The following example gets the serial output from the VM named `myVM` in the resource group named `myResourceGroup`:

```azurecli
az vm boot-diagnostics get-boot-log --resource-group myResourceGroup --name myVM
```

Review the serial output to determine why the VM is failing to boot. If the serial output isn't providing any indication, you may need to review log files in `/var/log` once you have the virtual hard disk connected to a troubleshooting VM.

## Stop the VM

The following example stops the VM named `myVM` from the resource group named `myResourceGroup`:

```powershell
Stop-AzVM -ResourceGroupName "myResourceGroup" -Name "myVM"
```

Wait until the VM has finished deleting before you process to the next step.

## Create a snapshot from the OS Disk of the VM

A snapshot is a full, read-only copy of a VHD. It cannot be attached to a VM. In the next step, we will create a disk from this snapshot. The following example creates a snapshot with name `mySnapshot` from the OS disk of the VM named `myVM'. 

```powershell
$resourceGroupName = 'myResourceGroup' 
$location = 'eastus' 
$vmName = 'myVM'
$snapshotName = 'mySnapshot'  

#Get the VM
$vm = get-azvm `
-ResourceGroupName $resourceGroupName `
-Name $vmName

#Create the snapshot configuration for the OS disk
$snapshot =  New-AzSnapshotConfig `
-SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id `
-Location $location `
-CreateOption copy

#Take the snapshot
New-AzSnapshot `
   -Snapshot $snapshot `
   -SnapshotName $snapshotName `
   -ResourceGroupName $resourceGroupName 
```
## Create a disk from the snapshot

This script creates a managed disk with name `newOSDisk` from the snapshot named `mysnapshot`.  

```powershell
#Set the context to the subscription Id where Managed Disk will be created
#You can skip this step if the subscription is already selected

$subscriptionId = 'yourSubscriptionId'

Select-AzSubscription -SubscriptionId $SubscriptionId

#Provide the name of your resource group
$resourceGroupName ='myResourceGroup'

#Provide the name of the snapshot that will be used to create Managed Disks
$snapshotName = 'mySnapshot' 

#Provide the name of the Managed Disk
$diskName = 'newOSDisk'

#Provide the size of the disks in GB. It should be greater than the VHD file size.
$diskSize = '128'

#Provide the storage type for Managed Disk. PremiumLRS or StandardLRS.
$storageType = 'StandardLRS'

#Provide the Azure region (e.g. westus) where Managed Disks will be located.
#This location should be same as the snapshot location
#Get all the Azure location using command below:
#Get-AzLocation
$location = 'eastus'

$snapshot = Get-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $snapshotName 
 
$diskConfig = New-AzDiskConfig -AccountType $storageType -Location $location -CreateOption Copy -SourceResourceId $snapshot.Id
 
New-AzDisk -Disk $diskConfig -ResourceGroupName $resourceGroupName -DiskName $diskName
```
Now you have a copy of the original OS disk. You can mount this new disk to another Windows VM for troubleshooting purposes.

## Attach the new virtual hard disk to another VM
For the next few steps, you use another VM for troubleshooting purposes. You attach the disk to this troubleshooting VM to browse and edit the disk's content. This process allows you to correct any configuration errors or review additional application or system log files, for example. Choose or create another VM to use for troubleshooting purposes.

Attach the existing virtual hard disk with [az vm unmanaged-disk attach](/cli/azure/vm/unmanaged-disk). When you attach the existing virtual hard disk, specify the URI to the disk obtained in the preceding `az vm show` command. The following example attaches an existing virtual hard disk to the troubleshooting VM named `myVMRecovery` in the resource group named `myResourceGroup`:

```azurecli
az vm unmanaged-disk attach --resource-group myResourceGroup --vm-name myVMRecovery \
    --vhd-uri https://mystorageaccount.blob.core.windows.net/vhds/myVM.vhd
```
## Mount the attached data disk

> [!NOTE]
> The following examples detail the steps required on an Ubuntu VM. If you are using a different Linux distro, such as Red Hat Enterprise Linux or SUSE, the log file locations and `mount` commands may be a little different. Refer to the documentation for your specific distro for the appropriate changes in commands.

1. SSH to your troubleshooting VM using the appropriate credentials. If this disk is the first data disk attached to your troubleshooting VM, the disk is likely connected to `/dev/sdc`. Use `dmseg` to view attached disks:

    ```bash
    dmesg | grep SCSI
    ```

    The output is similar to the following example:

    ```bash
    [    0.294784] SCSI subsystem initialized
    [    0.573458] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 252)
    [    7.110271] sd 2:0:0:0: [sda] Attached SCSI disk
    [    8.079653] sd 3:0:1:0: [sdb] Attached SCSI disk
    [ 1828.162306] sd 5:0:0:0: [sdc] Attached SCSI disk
    ```

    In the preceding example, the OS disk is at `/dev/sda` and the temporary disk provided for each VM is at `/dev/sdb`. If you had multiple data disks, they should be at `/dev/sdd`, `/dev/sde`, and so on.

2. Create a directory to mount your existing virtual hard disk. The following example creates a directory named `troubleshootingdisk`:

    ```bash
    sudo mkdir /mnt/troubleshootingdisk
    ```

3. If you have multiple partitions on your existing virtual hard disk, mount the required partition. The following example mounts the first primary partition at `/dev/sdc1`:

    ```bash
    sudo mount /dev/sdc1 /mnt/troubleshootingdisk
    ```

    > [!NOTE]
    > Best practice is to mount data disks on VMs in Azure using the universally unique identifier (UUID) of the virtual hard disk. For this short troubleshooting scenario, mounting the virtual hard disk using the UUID is not necessary. However, under normal use, editing `/etc/fstab` to mount virtual hard disks using device name rather than UUID may cause the VM to fail to boot.


## Fix issues on the new OS disk
With the existing virtual hard disk mounted, you can now perform any maintenance and troubleshooting steps as needed. Once you have addressed the issues, continue with the following steps.


## Unmount and detach the new OS disk
Once your errors are resolved, you unmount and detach the existing virtual hard disk from your troubleshooting VM. You cannot use your virtual hard disk with any other VM until the lease attaching the virtual hard disk to the troubleshooting VM is released.

1. From the SSH session to your troubleshooting VM, unmount the existing virtual hard disk. Change out of the parent directory for your mount point first:

    ```bash
    cd /
    ```

    Now unmount the existing virtual hard disk. The following example unmounts the device at `/dev/sdc1`:

    ```bash
    sudo umount /dev/sdc1
    ```

2. Now detach the virtual hard disk from the VM. Exit the SSH session to your troubleshooting VM. List the attached data disks to your troubleshooting VM with [az vm unmanaged-disk list](/cli/azure/vm/unmanaged-disk). The following example lists the data disks attached to the VM named `myVMRecovery` in the resource group named `myResourceGroup`:

    ```azurecli
    azure vm unmanaged-disk list --resource-group myResourceGroup --vm-name myVMRecovery \
        --query '[].{Disk:vhd.uri}' --output table
    ```

    Note the name for your existing virtual hard disk. For example, the name of a disk with the URI of **https://mystorageaccount.blob.core.windows.net/vhds/myVM.vhd** is **myVHD**. 

    Detach the data disk from your VM [az vm unmanaged-disk detach](/cli/azure/vm/unmanaged-disk). The following example detaches the disk named `myVHD` from the VM named `myVMRecovery` in the `myResourceGroup` resource group:

    ```azurecli
    az vm unmanaged-disk detach --resource-group myResourceGroup --vm-name myVMRecovery \
        --name myVHD
    ```

## Change the OS disk for the affected VM

You can use Azure PowerShell to swap the OS disks. You don't have to delete and recreate the VM.

This example stops the VM named `myVM` and assigns the disk named `newOSDisk` as the new OS disk. 

```powershell
# Get the VM 
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM 

# Make sure the VM is stopped\deallocated
Stop-AzVM -ResourceGroupName myResourceGroup -Name $vm.Name -Force

# Get the new disk that you want to swap in
$disk = Get-AzDisk -ResourceGroupName myResourceGroup -Name newDisk

# Set the VM configuration to point to the new disk  
Set-AzVMOSDisk -VM $vm -ManagedDiskId $disk.Id -Name $disk.Name  -sto

# Update the VM with the new OS disk. Possible values of StorageAccountType include: 'Standard_LRS' and 'Premium_LRS'
Update-AzVM -ResourceGroupName myResourceGroup -VM $vm -StorageAccountType <Type of the storage account >

# Start the VM
Start-AzVM -Name $vm.Name -ResourceGroupName myResourceGroup
```

## Next steps
If you are having issues connecting to your VM, see [Troubleshoot SSH connections to an Azure VM](troubleshoot-ssh-connection.md). For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Linux VM](troubleshoot-app-connection.md).

