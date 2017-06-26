---
title: Convert Linux VM in Azure from unmanaged to managed disks | Microsoft Docs
description: How to convert a Linux VM from unmanaged disks to Azure managed disks using the Azure CLI 2.0 in the Resource Manager deployment model
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
ms.date: 06/23/2017
ms.author: iainfou
---

# Convert a Linux VM from unmanaged disks to Azure managed disks

If you have existing Linux VMs in Azure that use unmanaged disks in storage accounts and you want those VMs to take advantage of managed disks, you can convert the VMs. This process converts both the OS disk and any attached data disks. 

This article shows you how to convert VMs with the Azure CLI. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli.md). 

## Planning considerations

* Before starting, review the [migration scenarios](migrate-to-managed-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

* The conversion requires a restart of the VM, so schedule the migration of your VMs during a pre-existing maintenance window. 

* The conversion is not reversible. 

* Be sure to test the conversion. Migrate a test virtual machine before performing the migration in production.

* During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, use a reserved IP.

* You can't convert an unmanaged disk into a managed disk if the unmanaged disk is in a storage account previously encrypted using Azure Storage Service Encryption. For steps to copy and use these VHDs in managed disks, see [later in this article](#managed-disks-and-azure-storage-service-encryption).



## Convert VM to managed disks
This section covers how to convert single-instance Azure VMs from unmanaged disks to managed disks. (See the next section if your VMs are in an availablity set.) You can use this process to convert from Premium (SSD) unmanaged disks to Premium managed disks, or from standard (HDD) unmanaged disks to standard managed disks.

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

All VMs in the availability set must be deallocated before you convert the availability set. Plan to convert all VMs to managed disks once the availability itself has been converted to a managed availability set. Then, start all the VMs and continue operating as normal.

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

## Managed disks and Azure Storage Service Encryption
You can't use the preceding steps to convert an unmanaged disk into a managed disk if the unmanaged disk is in a storage account that has ever been encrypted using [Azure Storage Service Encryption](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). The following steps detail how to copy and use unmanaged disks that have been in an encrypted storage account:

1. Copy the virtual hard disk (VHD) with [az storage blob copy start](/cli/azure/storage/blob/copy#start) to a storage account that has never been enabled for Azure Storage Service Encryption.

2. Use the copied VM in one of the following ways:

* Create a VM that uses managed disks, and specify that VHD file during creation with [az vm create](/cli/azure/vm#create)

* Attach the copied VHD with [az vm disk attach](/cli/azure/vm/disk#attach) to a running VM with managed disks.

## Next steps
For more information about storage options, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md)
