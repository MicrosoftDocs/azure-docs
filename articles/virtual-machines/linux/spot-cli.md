---
title: Use CLI to deploy Azure Spot VMs
description: Learn how to use the CLI to deploy Azure Spot VMs to save costs.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 03/25/2020
ms.author: cynthn
ms.reviewer: jagaveer
---

# Deploy Spot VMs using the Azure CLI

Using [Azure Spot VMs](spot-vms.md) allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Spot VMs. Therefore, Spot VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

Pricing for Spot VMs is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 

You have option to set a max price you are willing to pay, per hour, for the VM. The max price for a Spot VM can be set in US dollars (USD), using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for Spot or the price for a standard VM, which ever is less, as long as there is capacity and quota available. For more information about setting the max price, see [Spot VMs - Pricing](spot-vms.md#pricing).

The process to create a VM with Spot using the Azure CLI is the same as detailed in the [quickstart article](/azure/virtual-machines/linux/quick-create-cli). Just add the '--priority Spot' parameter and provide a max price or `-1`.


## Install Azure CLI

To create Spot VMs, you need to be running the Azure CLI version 2.0.74 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

Sign in to Azure using [az login](/cli/azure/reference-index#az-login).

```azurecli
az login
```

## Create a Spot VM

This example shows how to deploy a Linux Spot VM that will not be evicted based on price. 

```azurecli
az group create -n mySpotGroup -l eastus
az vm create \
    --resource-group mySpotGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Spot \
    --max-price -1
```

After the VM is created, you can query to see the max billing price for all of the VMs in the resource group.

```azurecli
az vm list \
   -g mySpotGroup \
   --query '[].{Name:name, MaxPrice:billingProfile.maxPrice}' \
   --output table
```

**Next steps**

You can also create a Spot VM using [Azure PowerShell](../windows/spot-powershell.md) or a [template](spot-template.md).

If you encounter an error, see [Error codes](../error-codes-spot.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
