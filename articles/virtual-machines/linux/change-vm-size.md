---
title: How to resize a Linux VM with the Azure CLI | Microsoft Docs
description: How to scale up or scale down a Linux virtual machine, by changing the VM size.
services: virtual-machines-linux
documentationcenter: na
author: mikewasson
manager: gwallace
editor: ''
tags: ''

ms.assetid: e163f878-b919-45c5-9f5a-75a64f3b14a0
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/10/2017
ms.author: mwasson
ms.custom: H1Hack27Feb2017

---
# Resize a Linux virtual machine using Azure CLI 

After you provision a virtual machine (VM), you can scale the VM up or down by changing the [VM size][vm-sizes]. In some cases, you must deallocate the VM first. You need to deallocate the VM if the desired size is not available on the hardware cluster that is hosting the VM. This article details how to resize a Linux VM with the Azure CLI. 

## Resize a VM
To resize a VM, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

1. View the list of available VM sizes on the hardware cluster where the VM is hosted with [az vm list-vm-resize-options](/cli/azure/vm). The following example lists VM sizes for the VM named `myVM` in the resource group `myResourceGroup` region:
   
    ```azurecli
    az vm list-vm-resize-options --resource-group myResourceGroup --name myVM --output table
    ```

2. If the desired VM size is listed, resize the VM with [az vm resize](/cli/azure/vm). The following example resizes the VM named `myVM` to the `Standard_DS3_v2` size:
   
    ```azurecli
    az vm resize --resource-group myResourceGroup --name myVM --size Standard_DS3_v2
    ```
   
    The VM restarts during this process. After the restart, your existing OS and data disks are remapped. Anything on the temporary disk is lost.

3. If the desired VM size is not listed, you need to first deallocate the VM with [az vm deallocate](/cli/azure/vm). This process allows the VM to then be resized to any size available that the region supports and then started. The following steps deallocate, resize, and then start the VM named `myVM` in the resource group named `myResourceGroup`:
   
    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    az vm resize --resource-group myResourceGroup --name myVM --size Standard_DS3_v2
    az vm start --resource-group myResourceGroup --name myVM
    ```
   
   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.

## Next steps
For additional scalability, run multiple VM instances and scale out. For more information, see [Automatically scale Linux machines in a Virtual Machine Scale Set][scale-set]. 

<!-- links -->
[boot-diagnostics]: https://azure.microsoft.com/blog/boot-diagnostics-for-virtual-machines-v2/
[scale-set]: ../../virtual-machine-scale-sets/virtual-machine-scale-sets-linux-autoscale.md 
[vm-sizes]:sizes.md
