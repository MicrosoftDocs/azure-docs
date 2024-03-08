---
title: Migrate a Linux VM from unmanaged disks to managed disks
description: How to Migrate a Linux VM from unmanaged disks to managed disks by using Azure CLI.
author: roygara
ms.service: azure-disk-storage
ms.collection: linux
ms.topic: how-to
ms.date: 12/15/2017
ms.author: rogarana
ms.custom: devx-track-azurecli
---

# Migrate a Linux virtual machine from unmanaged disks to managed disks

**Applies to:** :heavy_check_mark: Linux VMs 

If you have existing Linux virtual machines (VMs) that use unmanaged disks, you can migrate the VMs to use [Azure Managed Disks](../managed-disks-overview.md). This process converts both the OS disk and any attached data disks.

This article shows you how to migrate VMs by using the Azure CLI. If you need to install or upgrade it, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Before you begin
* Review [the FAQ about migration to Managed Disks](../faq-for-disks.yml).

[!INCLUDE [virtual-machines-common-convert-disks-considerations](../../../includes/virtual-machines-common-convert-disks-considerations.md)]

* The original VHDs and the storage account used by the VM before migration are not deleted. They continue to incur charges. To avoid being billed for these artifacts, delete the original VHD blobs after you verify that the migration is complete. If you need to find these unattached disks in order to delete them, see our article [Find and delete unattached Azure managed and unmanaged disks](find-unattached-disks.md).

## Migrate single-instance VMs
This section covers how to migrate single-instance Azure VMs from unmanaged disks to managed disks. (If your VMs are in an availability set, see the next section.) You can use this process to migrate the VMs from premium (SSD) unmanaged disks to premium managed disks, or from standard (HDD) unmanaged disks to standard managed disks.

1. Deallocate the VM by using [az vm deallocate](/cli/azure/vm). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

2. Migrate the VM to managed disks by using [az vm convert](/cli/azure/vm). The following process converts the VM named `myVM`, including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group myResourceGroup --name myVM
    ```

3. Start the VM after the migration to managed disks by using [az vm start](/cli/azure/vm). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`.

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Migrate VMs in an availability set

If the VMs that you want to migrate to managed disks are in an availability set, you first need to migrate the availability set to a managed availability set.

All VMs in the availability set must be deallocated before you migrate the availability set. Plan to migrate all VMs to managed disks after the availability set itself has been converted to a managed availability set. Then, start all the VMs and continue operating as normal.

1. List all VMs in an availability set by using [az vm availability-set list](/cli/azure/vm/availability-set). The following example lists all VMs in the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set show \
        --resource-group myResourceGroup \
        --name myAvailabilitySet \
        --query [virtualMachines[*].id] \
        --output table
    ```

2. Deallocate all the VMs by using [az vm deallocate](/cli/azure/vm). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

3. Migrate the availability set by using [az vm availability-set convert](/cli/azure/vm/availability-set). The following example converts the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm availability-set convert \
        --resource-group myResourceGroup \
        --name myAvailabilitySet
    ```

4. Migrate all the VMs to managed disks by using [az vm convert](/cli/azure/vm). The following process converts the VM named `myVM`, including the OS disk and any data disks:

    ```azurecli
    az vm convert --resource-group myResourceGroup --name myVM
    ```

5. Start all the VMs after the migration to managed disks by using [az vm start](/cli/azure/vm). The following example starts the VM named `myVM` in the resource group named `myResourceGroup`:

    ```azurecli
    az vm start --resource-group myResourceGroup --name myVM
    ```

## Migrate using the Azure portal

You can also migrate unmanaged disks to managed disks using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the VM from the list of VMs in the portal.
1. In the blade for the VM, select **Disks** from the menu.
1. At the top of the **Disks** blade, select **Migrate to managed disks**.
1. If your VM is in an availability set, there will be a warning on the **Migrate to managed disks** blade that you need to migrate the availability set first. The warning should have a link you can click to migrate the availability set. Once the availability set is converted or if your VM is not in an availability set, click **Migrate** to start the process of migrating your disks to managed disks.

The VM will be stopped and restarted after migration is complete.

## Next steps

For more information about storage options, see [Azure Managed Disks overview](../managed-disks-overview.md).
