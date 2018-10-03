---
title: Expand virtual hard disks on a Linux VM in Azure | Microsoft Docs
description: Learn how to expand virtual hard disks on a Linux VM with the Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: roygara
manager: jeconnoc
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/13/2017
ms.author: rogarana
---

# How to expand virtual hard disks on a Linux VM with the Azure CLI

The default virtual hard disk size for the operating system (OS) is typically 30 GB on a Linux virtual machine (VM) in Azure. You can [add data disks](add-disk.md) to provide for additional storage space, but you may also wish to expand an existing data disk. This article details how to expand managed disks for a Linux VM with the Azure CLI. 

> [!WARNING]
> Always make sure that you back up your data before you perform disk resize operations. For more information, see [Back up Linux VMs in Azure](tutorial-backup-vms.md).

## Expand Azure Managed Disk
Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index#az_login).

This article requires an existing VM in Azure with at least one data disk attached and prepared. If you do not already have a VM that you can use, see [Create and prepare a VM with data disks](tutorial-manage-disks.md#create-and-attach-disks).

In the following samples, replace example parameter names with your own values. Example parameter names include *myResourceGroup* and *myVM*.

1. Operations on virtual hard disks cannot be performed with the VM running. Deallocate your VM with [az vm deallocate](/cli/azure/vm#az_vm_deallocate). The following example deallocates the VM named *myVM* in the resource group named *myResourceGroup*:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

    > [!NOTE]
    > The VM must be deallocated to expand the virtual hard disk. `az vm stop` does not release the compute resources. To release compute resources, use `az vm deallocate`.

1. View a list of managed disks in a resource group with [az disk list](/cli/azure/disk#az_disk_list). The following example displays a list of managed disks in the resource group named *myResourceGroup*:

    ```azurecli
    az disk list \
        --resource-group myResourceGroup \
        --query '[*].{Name:name,Gb:diskSizeGb,Tier:accountType}' \
        --output table
    ```

    Expand the required disk with [az disk update](/cli/azure/disk#az_disk_update). The following example expands the managed disk named *myDataDisk* to be *200*Gb in size:

    ```azurecli
    az disk update \
        --resource-group myResourceGroup \
        --name myDataDisk \
        --size-gb 200
    ```

    > [!NOTE]
    > When you expand a managed disk, the updated size is mapped to the nearest managed disk size. For a table of the available managed disk sizes and tiers, see [Azure Managed Disks Overview - Pricing and Billing](../windows/managed-disks-overview.md#pricing-and-billing).

1. Start your VM with [az vm start](/cli/azure/vm#az_vm_start). The following example starts the VM named *myVM* in the resource group named *myResourceGroup*:

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```


## Expand disk partition and filesystem
To use the expanded disk, you need to expand the underlying partition and filesystem.

1. SSH to your VM with the appropriate credentials. You can obtain the public IP address of your VM with [az vm show](/cli/azure/vm#az_vm_show):

    ```azurecli
    az vm show --resource-group myResourceGroup --name myVM -d --query [publicIps] --o tsv
    ```

1. To use the expanded disk, you need to expand the underlying partition and filesystem.

    a. If already mounted, unmount the disk:

    ```bash
    sudo umount /dev/sdc1
    ```

    b. Use `parted` to view disk information and resize the partition:

    ```bash
    sudo parted /dev/sdc
    ```

    View information about the existing partition layout with `print`. The output is similar to the following example, which shows the underlying disk is 215Gb in size:

    ```bash
    GNU Parted 3.2
    Using /dev/sdc1
    Welcome to GNU Parted! Type 'help' to view a list of commands.
    (parted) print
    Model: Unknown Msft Virtual Disk (scsi)
    Disk /dev/sdc1: 215GB
    Sector size (logical/physical): 512B/4096B
    Partition Table: loop
    Disk Flags:
    
    Number  Start  End    Size   File system  Flags
        1      0.00B  107GB  107GB  ext4
    ```

    c. Expand the partition with `resizepart`. Enter the partition number, *1*, and a size for the new partition:

    ```bash
    (parted) resizepart
    Partition number? 1
    End?  [107GB]? 215GB
    ```

    d. To exit, enter `quit`

1. With the partition resized, verify the partition consistency with `e2fsck`:

    ```bash
    sudo e2fsck -f /dev/sdc1
    ```

1. Now resize the filesystem with `resize2fs`:

    ```bash
    sudo resize2fs /dev/sdc1
    ```

1. Mount the partition to the desired location, such as `/datadrive`:

    ```bash
    sudo mount /dev/sdc1 /datadrive
    ```

1. To verify the OS disk has been resized, use `df -h`. The following example output shows the data drive, */dev/sdc1*, is now 200 GB:

    ```bash
    Filesystem      Size   Used  Avail Use% Mounted on
    /dev/sdc1        197G   60M   187G   1% /datadrive
    ```

## Next steps
If you need additional storage, you also [add data disks to a Linux VM](add-disk.md). For more information about disk encryption, see [Encrypt disks on a Linux VM using the Azure CLI](encrypt-disks.md).
