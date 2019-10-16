---
title: Use CLI to deploy spot VMs (Preview) in Azure | Microsoft Docs
description: Learn how to use the Azure CLI to deploy spot VMs to save costs.
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
ms.date: 10/14/2019
ms.author: cynthn
---

# Preview: Deploy spot VMs using the Azure CLI

Using [spot VMs](spot-vms.md) allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict spot VMs. Therefore, spot VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

Pricing for spot VMs is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 

You have option to set a max price you are willing to pay, per hour, for the VM. The max price for a spot VM can be set in USD, using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for spot or the price for an on-demand VM, which ever is less, as long as there is capacity and quota available. For more information about setting the max price, see [spot VMs - Pricing](spot-vms.md#pricing).

The process to create a VM with spot using the Azure CLI is the same as detailed in the [quickstart article](/azure/virtual-machines/linux/quick-create-cli). Just add the '--priority Spot' parameter and provide a max price or `-1`.

> [!IMPORTANT]
> Spot VMs are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> For the early part of the public preview, you can set a max price, but it will be ignored. spot VMs will have a fixed price, so there will not be any price-based evictions.


## Install Azure CLI

To create spot VMs, you need to be running the Azure CLI version 2.0.74 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

Sign in to Azure using [az login](/cli/azure/reference-index#az-login).

```azurecli
az login
```

## Register the feature

For the public preview, you first need to register the feature.

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name LowPrioritySingleVM
```

Check the status of the feature registration.

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name LowPrioritySingleVM | grep state
```

When this returns `"state": "Registered"`, you can move on to the next step.

## Create a spot VM

This example shows how to deploy a Linux spot VM that will not be evicted based on price. 

```azurecli
az group create -n mySpotGroup -l eastus
az vm create \
    --resource-group mySpotGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Spot \
    --max-billing -1
```

After the VM is created, you can query to see the max billing price for all of the VMs in the resource group.

```azurecli
az vm list \
   -g mySpotGroup \
   --query '[].{Name:name, MaxPrice:billingProfile.maxPrice}' \
   --output table
```

**Next steps**

You can also create a spot VM using [Azure PowerShell](../windows/spot-powershell.md) or a [template](spot-template.md).

If you encounter an error, see [Error codes](../error-codes-spot.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
