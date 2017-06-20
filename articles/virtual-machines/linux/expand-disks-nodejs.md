---
title: Expand OS disk on Linux VM with the Azure CLI 1.0 | Microsoft Docs
description: Learn how to expand the operating system (OS) virtual disk on a Linux VM using the Azure CLI 1.0 and the Resource Manager deployment model
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
ms.date: 02/10/2017
ms.author: iainfou

---

# Expand OS disk on a Linux VM using the Azure CLI with the Azure CLI 1.0
The default virtual hard disk size for the operating system (OS) is typically 30 GB on a Linux virtual machine (VM) in Azure. You can [add data disks](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to provide for additional storage space, but you may also wish to expand the OS disk. This article details how to expand the OS disk for a Linux VM using unmanaged disks with the Azure CLI 1.0

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#prerequisites) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](expand-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model

## Prerequisites
You need the [latest Azure CLI 1.0](../../cli-install-nodejs.md) installed and logged in to an [Azure account](https://azure.microsoft.com/pricing/free-trial/) using the Resource Manager mode as follows:

```azurecli
azure config mode arm
```

In the following samples, replace example parameter names with your own values. Example parameter names include `myResourceGroup` and `myVM`.

## Expand OS disk

1. Operations on virtual hard disks cannot be performed with the VM running. The following example stops and deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    azure vm deallocate --resource-group myResourceGroup --name myVM
    ```

    > [!NOTE]
    > `azure vm stop` does not release the compute resources. To release compute resources, use `azure vm deallocate`. The VM must be deallocated to expand the virtual hard disk.

2. Update the size of the OS unmanaged disk using the `azure vm set` command. The following example updates the VM named `myVM` in the resource group named `myResourceGroup` to be `50` GB:

    ```azurecli
    azure vm set --resource-group myResourceGroup --name myVM --new-os-disk-size 50
    ```

3. Start your VM as follows:

    ```azurecli
    azure vm start --resource-group myResourceGroup --name myVM
    ```

4. SSH to your VM with the appropriate credentials. To verify the OS disk has been resized, use `df -h`. The following example output shows the primary partition (`/dev/sda1`) is now 50 GB:

    ```bash
    Filesystem      Size  Used Avail Use% Mounted on
    udev            1.7G     0  1.7G   0% /dev
    tmpfs           344M  5.0M  340M   2% /run
    /dev/sda1        49G  1.3G   48G   3% /
    ```

## Next steps
If you need additional storage, you also [add data disks to a Linux VM](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). For more information about disk encryption, see [Encrypt disks on a Linux VM using the Azure CLI](encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
