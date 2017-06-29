---
title: Convert a Linux VM in Azure from unmanaged to Managed Disks | Microsoft Docs
description: How to convert a virtual machine from unmanaged disks to Azure Managed Disks with the Azure CLI 2.0
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 06/22/2017
ms.author: iainfou
---

# How to convert a Linux virtual machine from unmanaged disks to Azure Managed Disks

If you have existing Linux virtual machines (VMs) that use unmanaged disks, you can convert the VMs to use [Azure Managed Disks](../../storage/storage-managed-disks-overview.md). This process converts both the OS disk and any attached data disks. As the conversion process requires a restart of the VM, we recommend that you schedule this process during a pre-existing maintenance window. The conversion process is not reversible. Be sure to test the process by converting a test VM.

> [!IMPORTANT]
> During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If needed, you can [assign a static IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) to the VM.

You cannot convert an unmanaged disk into a managed disk if the unmanaged disk is in a storage account that is, or has at any time been, encrypted using [Azure Storage Service Encryption (SSE)](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). The following steps detail how to convert unmanaged disks that are, or have been, in an encrypted storage account:

- Copy the virtual hard disk (VHD) with [az storage blob copy start](/cli/azure/storage/blob/copy#start) to a storage account that has never been enabled for Azure Storage Service Encryption.
- Create a VM that uses Managed Disks and specify that VHD file during creation with [az vm create --attach-os-disk](/cli/azure/vm#create), or
- Attach the copied VHD with [az vm disk attach](/cli/azure/vm/disk#attach) to a running VM with Managed Disks.

## Convert VM to Azure Managed Disks
This section covers how to convert your existing Azure VMs from unmanaged disks to managed disks. You can use this process to convert from Premium (SSD) unmanaged disks to Premium managed disks, or from standard (HDD) unmanaged disks to standard managed disks.

1. Deallocate the VM with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

2. Convert the VM to managed disks with [az vm convert](/cli/azure/vm#convert). The following process converts the VM named `myVM` including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group myResourceGroup --name myVM
    ```

3. Start the VM after the conversion to managed disks with [az vm start](/cli/azure/vm#start). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`.

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Convert VM in an availability set to managed disks

If the VMs that you want to convert to managed disks are in an availability set, you first need to convert the availability set to a managed availability set.

All VMs in the availability set must be deallocated before you convert the availability set. Plan to convert all VMs to managed disks once the availability itself has been converted to a managed availability set. You can then start all the VMs and continue operating as normal.

1. List all VMs in an availability set with [az vm availability-set list](/cli/azure/vm/availability-set#list). The following example lists all VMs in the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set show \
        --resource-group myResourceGroup \
        --name myAvailabilitySet \
        --query [virtualMachines[*].id] \
        --output table
    ```

2. Deallocate all the VMs with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

3. Convert the availability set with [az vm availability-set convert](/cli/azure/vm/availability-set#convert). The following example converts the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set convert \
        --resource-group myResourceGroup \
        --name myAvailabilitySet
    ```

4. Convert all the VMs to managed disks with [az vm convert](/cli/azure/vm#convert). The following process converts the VM named `myVM` including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group myResourceGroup --name myVM
    ```

5. Start all the VMs after the conversion to managed disks with [az vm start](/cli/azure/vm#start). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`.

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Next steps
For more information about storage options, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md)
