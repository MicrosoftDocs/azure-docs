---
title: Expand OS disk on Linux VM in Azure | Microsoft Docs
description: Learn how to expand the operating system (OS) virtual disk on a Linux VM using the Azure CLI and the Resource Manager deployment model
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/21/2016
ms.author: iainfou

---

# Expand OS disk on a Linux VM using the Azure CLI
The default virtual hard disk for the operating system (OS) is typically 30Gb on a Linux virtual machine (VM) in Azure. You can [add data disks](virtual-machines-linux-add-disk?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to provide for additional storage space, but you may also wish to expand the operating system (OS) disk. This article details how to resize the OS disk for a Linux VM using the Azure CLI.


## Prerequisites
This article requires the following:

* an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)).
* the latest [Azure CLI](../xplat-cli-install.md) logged in with `azure login`
* the Azure CLI *must be* in Azure Resource Manager mode using `azure config mode arm`

In the following examples, replace example parameter names with your own values. Example parameter names include `myResourceGroup` and `myVM`.


## Expand OS disk

1. Operations on virtual hard disks cannot be performed with the VM running. The following example stop and deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    azure vm deallocate --resource-group myResourceGroup --name myVM
    ```

    > [!NOTE]
    > In general, `azure vm stop` does not release the compute resources. You are still billed for compute resources when the VM is stopped. To release compute resources, use `azure vm deallocate`. For the purposes of resizing the virtual hard disk, the VM must be deallocated to adjust the virtual hard disks.

2. Update the size of the OS disk using the `azure vm set` command. The following example updates the VM named `myVM` in the resource group named `myResourceGroup` to be `50`GB in size:

    ```azurecli
    azure vm set --resource-group myResourceGroup --name myVM --new-os-disk-size 50
    ```

3. Start your VM as follows:

    ```azurecli
    azure vm start --resource-group myResourceGroup --name myVM
    ```

4. SSH to your VM with the appropriate credentials. To verify the OS disk has been resized, use `df -h`. The following example output shows the primary partition (`/dev/sda1`) is now 50Gb:

    ```bash
    Filesystem      Size  Used Avail Use% Mounted on
    udev            1.7G     0  1.7G   0% /dev
    tmpfs           344M  5.0M  340M   2% /run
    /dev/sda1        49G  1.3G   48G   3% /
    ```

## Next steps
If you need additional storage, you also [add data disks to a Linux VM](virtual-machines-linux-add-disk?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). For more information about disk encryption, see [Encrypt disks on a Linux VM using the Azure CLI](virtual-machines-linux-encrypt-disks?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
