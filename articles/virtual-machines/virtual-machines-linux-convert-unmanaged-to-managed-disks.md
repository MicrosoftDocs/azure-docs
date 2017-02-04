---
title: Convert a Linux VM in Azure from unmanaged to managed disks | Microsoft Docs
description: How to convert a VM from unmanaged disks to Azure managed disks using the Azure CLI 2.0 (Preview)
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
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: iainfou
---

# How to convert a Linux VM from unmanaged disks to Azure Managed Disks

If you have existing Linux VMs in Azure that use unmanaged disks in storage accounts and you want those VMs to be able to take advantage of managed disks, you can convert the VMs. This process converts both the OS disk and any attached data disks. The conversion process requires a restart of the VM, so schedule the migration of your VMs during a pre-existing maintenance window. The migration process is not reversible. Be sure to test the migration process by migrating a test virtual machine before performing the migration in production.

> [!IMPORTANT] 
> During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, use a reserved IP.

## Convert VM to Azure Managed Disks
This section covers how to convert your existing Azure VMs from unmanaged disks to managed disks. You can use this process to convert from Premium (SDD) unmanaged disks to Premium managed disks, or from standard (HDD) unmanaged disks to standard managed disks. 

1. Deallocate the VM with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocate the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

2. Convert the VM to managed disks with [az vm convert](/cli/azure/vm#convert). The following process converst the VM named `myVM` including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group-myResourceGroup --name myVM
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
    az vm availability-set list --resource-group myResourceGroup \
        --name myAvailabilitySet --query '[].{}
    ```

2. Deallocate all the VMs with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocate the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

3. Convert the availability set with [az vm availability-set update](/cli/azure/vm/availability-set#update). The following example converts the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set update -g myResourceGroup -n myAvailabilitySet --set sku.name=Aligned
    ```

4. Convert all the VMs to managed disks with [az vm convert](/cli/azure/vm#convert). The following process converst the VM named `myVM` including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group-myResourceGroup --name myVM
    ```

5. Start all the VMs after the conversion to managed disks with [az vm start](/cli/azure/vm#start). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`.

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```