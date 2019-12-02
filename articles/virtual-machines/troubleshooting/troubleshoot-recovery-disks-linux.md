---

title: Use a Linux troubleshooting VM with the Azure CLI | Microsoft Docs
description: Learn how to troubleshoot Linux VM issues by connecting the OS disk to a recovery VM using the Azure CLI
services: virtual-machines-linux
documentationCenter: ''
author: genlin
manager: dcscontentpm
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
> The scripts in this article only apply to the VMs that use [Managed Disk](../linux/managed-disks-overview.md). 

In the following examples, replace parameter names with your own values, such as `myResourceGroup` and `myVM`.

## Determine boot issues
Examine the serial output to determine why your VM is not able to boot correctly. A common example is an invalid entry in `/etc/fstab`, or the underlying virtual hard disk being deleted or moved.

Get the boot logs with [az vm boot-diagnostics get-boot-log](/cli/azure/vm/boot-diagnostics). The following example gets the serial output from the VM named `myVM` in the resource group named `myResourceGroup`:

```azurecli
az vm boot-diagnostics get-boot-log --resource-group myResourceGroup --name myVM
```

Review the serial output to determine why the VM is failing to boot. If the serial output isn't providing any indication, you may need to review log files in `/var/log` once you have the virtual hard disk connected to a troubleshooting VM.

## Stop the VM

The following example stops the VM named `myVM` from the resource group named `myResourceGroup`:

```azurecli
az vm stop --resource-group MyResourceGroup --name MyVm
```
## Take a snapshot from the OS Disk of the affected VM

A snapshot is a full, read-only copy of a VHD. It cannot be attached to a VM. In the next step, we will create a disk from this snapshot. The following example creates a snapshot with name `mySnapshot` from the OS disk of the VM named `myVM'. 

```azurecli
#Get the OS disk Id 
$osdiskid=(az vm show -g myResourceGroup -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)

#creates a snapshot of the disk
az snapshot create --resource-group myResourceGroupDisk --source "$osdiskid" --name mySnapshot
```
## Create a disk from the snapshot

This script creates a managed disk with name `myOSDisk` from the snapshot named `mySnapshot`.  

```azurecli
#Provide the name of your resource group
$resourceGroup=myResourceGroup

#Provide the name of the snapshot that will be used to create Managed Disks
$snapshot=mySnapshot

#Provide the name of the Managed Disk
$osDisk=myNewOSDisk

#Provide the size of the disks in GB. It should be greater than the VHD file size.
$diskSize=128

#Provide the storage type for Managed Disk. Premium_LRS or Standard_LRS.
$storageType=Premium_LRS

#Provide the OS type
$osType=linux

#Provide the name of the virtual machine
$virtualMachine=myVM

#Get the snapshot Id 
$snapshotId=(az snapshot show --name $snapshot --resource-group $resourceGroup --query [id] -o tsv)

# Create a new Managed Disks using the snapshot Id.

az disk create --resource-group $resourceGroup --name $osDisk --sku $storageType --size-gb $diskSize --source $snapshotId

```

If the resource group and the source snapshot is not in the same region, you will receive the "Resource is not found" error when you run `az disk create`. In this case, you must specify `--location <region>` to create the disk into the same region as the source snapshot.

Now you have a copy of the original OS disk. You can mount this new disk to another Windows VM for troubleshooting purposes.

## Attach the new virtual hard disk to another VM
For the next few steps, you use another VM for troubleshooting purposes. You attach the disk to this troubleshooting VM to browse and edit the disk's content. This process allows you to correct any configuration errors or review additional application or system log files.

This script attach the disk `myNewOSDisk` to the VM `MyTroubleshootVM`:

```azurecli
# Get ID of the OS disk that you just created.
$myNewOSDiskid=(az vm show -g myResourceGroupDisk -n myNewOSDisk --query "storageProfile.osDisk.managedDisk.id" -o tsv)

# Attach the disk to the troubleshooting VM
az vm disk attach --disk $diskId --resource-group MyResourceGroup --size-gb 128 --sku Standard_LRS --vm-name MyTroubleshootVM
```
## Mount the attached data disk

> [!NOTE]
> The following examples detail the steps required on an Ubuntu VM. If you are using a different Linux distro, such as Red Hat Enterprise Linux or SUSE, the log file locations and `mount` commands may be a little different. Refer to the documentation for your specific distro for the appropriate changes in commands.

1. SSH to your troubleshooting VM using the appropriate credentials. If this disk is the first data disk attached to your troubleshooting VM, the disk is likely connected to `/dev/sdc`. Use `dmesg` to view attached disks:

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

2. Now detach the virtual hard disk from the VM. Exit the SSH session to your troubleshooting VM:

    ```azurecli
    az vm disk detach -g MyResourceGroup --vm-name MyTroubleShootVm --name myNewOSDisk
    ```

## Change the OS disk for the affected VM

You can use Azure CLI to swap the OS disks. You don't have to delete and recreate the VM.

This example stops the VM named `myVM` and assigns the disk named `myNewOSDisk` as the new OS disk.

```azurecli
# Stop the affected VM
az vm stop -n myVM -g myResourceGroup

# Get ID of the OS disk that is repaired.
$myNewOSDiskid=(az vm show -g myResourceGroupDisk -n myNewOSDisk --query "storageProfile.osDisk.managedDisk.id" -o tsv)

# Change the OS disk of the affected VM to "myNewOSDisk"
az vm update -g myResourceGroup -n myVM --os-disk $myNewOSDiskid

# Start the VM
az vm start -n myVM -g myResourceGroup
```

## Next steps
If you are having issues connecting to your VM, see [Troubleshoot SSH connections to an Azure VM](troubleshoot-ssh-connection.md). For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Linux VM](troubleshoot-app-connection.md).

