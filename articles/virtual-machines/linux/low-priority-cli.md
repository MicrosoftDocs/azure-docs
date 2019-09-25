---
title: Use CLI to deploy low-priority VMs (Preview) in Azure | Microsoft Docs
description: Learn how to use the Azure CLI to deploy low-priority VMs to save costs.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: gwallace
editor:
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/23/2019
ms.author: cynthn
---

# Preview: Deploy low-priority VMs using the Azure CLI

Using [low-priority VMs](low-priority-vms.md) allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict low-priority VMs. Therefore, low-priority VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

Pricing for low-priority VMs is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/). 

You have option to set a max price you are willing to pay, per hour, for the VM. The max price for a low-priority VM can be set in USD, using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for low-priority or the price for an on-demand VM, which ever is less, as long as there is capacity and quota available. For more information about setting the max price, see [Low-priority VMs - Pricing](low-priority-vms.md#pricing).

The process to create a VM with low-priority using the Azure CLI is the same as detailed in the [quickstart article](/azure/virtual-machines/linux/quick-create-cli). Just add the '--priority Low' parameter and provide a max price or `-1`.

> [!IMPORTANT]
> Low-priority VMs are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> For the early part of the public preview, you can set a max price, but it will be ignored. Low-priority VMs will have a fixed price, so there will not be any price-based evictions.


## Install Azure CLI

To create low-priority VMs, you need to be running the Azure CLI version 2.0.74 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

Sign in to Azure using [az login](/cli/azure/reference-index#az-login).

```azurecli
az login
```

## Create a low-priority VM

This example shows how to deploy a Linux low-priority VM that will not be evicted based on price. 

```azurecli
az group create -n myLowPriGroup -l eastus
az vm create \
    --resource-group myLowPriGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Low \
    --max-billing -1
```

After the VM is created, you can query to see the max billing price for all of the VMs in the resource group.

```azurecli
az vm list \
   -g myLowPriGroup \
   --query '[].{Name:name, MaxPrice:billingProfile.maxPrice}' \
   --output table
```

**Next steps**

You can also create a low-priority VM using [Azure PowerShell](../windows/low-priority-powershell.md) or a [template](low-priority-template.md).

If you encounter an error, see [Error codes](../error-codes-low-priority.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).