---
title: Convert a Linux virtual machine in Azure from unmanaged disks to managed disks - Azure Managed Disks  | Microsoft Docs
description: How to convert a Linux VM from unmanaged disks to managed disks by using Azure CLI in the Resource Manager deployment model
services: virtual-machines-linux
documentationcenter: ''
author: roygara
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 12/15/2017
ms.author: rogarana
---

# Convert a Linux virtual machine from unmanaged disks to managed disks

If you have existing Linux virtual machines (VMs) that use unmanaged disks, you can convert the VMs to use [Azure Managed Disks](../linux/managed-disks-overview.md). This process converts both the OS disk and any attached data disks.

This article shows you how to convert VMs by using the Azure CLI. If you need to install or upgrade it, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Before you begin
* Review [the FAQ about migration to Managed Disks](faq-for-disks.md#migrate-to-managed-disks).

[!INCLUDE [virtual-machines-common-convert-disks-considerations](../../../includes/virtual-machines-common-convert-disks-considerations.md)]


## Convert single-instance VMs
This section covers how to convert single-instance Azure VMs from unmanaged disks to managed disks. (If your VMs are in an availability set, see the next section.) You can use this process to convert the VMs from premium (SSD) unmanaged disks to premium managed disks, or from standard (HDD) unmanaged disks to standard managed disks.

1. Deallocate the VM by using [az vm deallocate](/cli/azure/vm#az_vm_deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

2. Convert the VM to managed disks by using [az vm convert](/cli/azure/vm#az_vm_convert). The following process converts the VM named `myVM`, including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group myResourceGroup --name myVM
    ```

3. Start the VM after the conversion to managed disks by using [az vm start](/cli/azure/vm#az_vm_start). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`.

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Convert VMs in an availability set

If the VMs that you want to convert to managed disks are in an availability set, you first need to convert the availability set to a managed availability set.

All VMs in the availability set must be deallocated before you convert the availability set. Plan to convert all VMs to managed disks after the availability set itself has been converted to a managed availability set. Then, start all the VMs and continue operating as normal.

1. List all VMs in an availability set by using [az vm availability-set list](/cli/azure/vm/availability-set#az_vm_availability_set_list). The following example lists all VMs in the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set show \
        --resource-group myResourceGroup \
        --name myAvailabilitySet \
        --query [virtualMachines[*].id] \
        --output table
    ```

2. Deallocate all the VMs by using [az vm deallocate](/cli/azure/vm#az_vm_deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

3. Convert the availability set by using [az vm availability-set convert](/cli/azure/vm/availability-set#az_vm_availability_set_convert). The following example converts the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set convert \
        --resource-group myResourceGroup \
        --name myAvailabilitySet
    ```

4. Convert all the VMs to managed disks by using [az vm convert](/cli/azure/vm#az_vm_convert). The following process converts the VM named `myVM`, including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group myResourceGroup --name myVM
    ```

5. Start all the VMs after the conversion to managed disks by using [az vm start](/cli/azure/vm#az_vm_start). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Next steps
For more information about storage options, see [Azure Managed Disks overview](../windows/managed-disks-overview.md).
