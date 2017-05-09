---
title: Expand virtual hard disks on Linux VM in Azure | Microsoft Docs
description: Learn how to expand virtual hard disks on a Linux VM with the Azure CLI 2.0
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/22/2017
ms.author: iainfou
---

# How to expand virtual hard disks on a Linux VM with the Azure CLI 2.0
The default virtual hard disk size for the operating system (OS) is typically 30 GB on a Linux virtual machine (VM) in Azure. You can [add data disks](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to provide for additional storage space, but you may also wish to expand the OS disk or existing data disk. This article details how to expand managed disks for a Linux VM with the Azure CLI 2.0. You can also expand the unmanaged OS disk with the [Azure CLI 1.0](expand-disks-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Expand managed disk
Make sure that you have the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).

In the following samples, replace example parameter names with your own values. Example parameter names include `myResourceGroup` and `myVM`.

1. Operations on virtual hard disks cannot be performed with the VM running. Deallocate your VM with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

    > [!NOTE]
    > `az vm stop` does not release the compute resources. To release compute resources, use `az vm deallocate`. The VM must be deallocated to expand the virtual hard disk.

2. View a list of managed disks in a resource group with [az disk list](/cli/azure/disk#list). The following example displays a list of managed disks in the resource group named `myResourceGroup`:

    ```azurecli
    az disk list -g myResourceGroup \
        --query '[*].{Name:name,Gb:diskSizeGb,Tier:accountType}' \
        --output table
    ```

    Expand the required disk with [az disk update](/cli/azure/disk#update). The following example expands the managed disk named `myDataDisk` to be `200`Gb in size:

    ```azurecli
    az disk update --resource-group myResourceGroup --name myDataDisk --size-gb 200
    ```

    > [!NOTE]
    > When you expand a managed disk, the updated size is mapped to the nearest managed disk size. For a table of the available managed disk sizes and tiers, see [Azure Managed Disks Overview - Pricing and Billing](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#pricing-and-billing).

3. Start your VM with [az vm start](/cli/azure/vm#start). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

4. SSH to your VM with the appropriate credentials. To verify the OS disk has been resized, use `df -h`. The following example output shows the primary partition (`/dev/sda1`) is now 200 GB:

    ```bash
    Filesystem      Size   Used  Avail Use% Mounted on
    /dev/sdc1        194G   52M   193G   1% /datadrive
    ```

## Next steps
If you need additional storage, you also [add data disks to a Linux VM](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). For more information about disk encryption, see [Encrypt disks on a Linux VM using the Azure CLI](encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
