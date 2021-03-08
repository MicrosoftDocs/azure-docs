---
title: Use CLI to deploy Azure Spot Virtual Machines
description: Learn how to use the CLI to deploy Azure Spot Virtual Machines to save costs.
author: cynthn
ms.service: virtual-machines
ms.subservice: spot
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 06/26/2020
ms.author: cynthn
ms.reviewer: jagaveer
---

# Deploy Azure Spot Virtual Machines using the Azure CLI

Using [Azure Spot Virtual Machines](../spot-vms.md) allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Azure Spot Virtual Machines. Therefore, Azure Spot Virtual Machines are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

Pricing for Azure Spot Virtual Machines is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 

You have option to set a max price you are willing to pay, per hour, for the VM. The max price for an Azure Spot Virtual Machine can be set in US dollars (USD), using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for Azure Spot Virtual Machine or the price for a standard VM, which ever is less, as long as there is capacity and quota available. For more information about setting the max price, see [Azure Spot Virtual Machines - Pricing](../spot-vms.md#pricing).

The process to create an Azure Spot Virtual Machine using the Azure CLI is the same as detailed in the [quickstart article](./quick-create-cli.md). Just add the '--priority Spot' parameter, set the `--eviction-policy` to either Deallocate (this is the default) or `Delete`, and provide a max price or `-1`. 


## Install Azure CLI

To create Azure Spot Virtual Machines, you need to be running the Azure CLI version 2.0.74 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

Sign in to Azure using [az login](/cli/azure/reference-index#az-login).

```azurecli
az login
```

## Create an Azure Spot Virtual Machine

This example shows how to deploy a Linux Azure Spot Virtual Machine that will not be evicted based on price. The eviction policy is set to deallocate the VM, so that it can be restarted at a later time. If you want to delete the VM and the underlying disk when the VM is evicted, set `--eviction-policy` to `Delete`.

```azurecli
az group create -n mySpotGroup -l eastus
az vm create \
    --resource-group mySpotGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Spot \
    --max-price -1 \
	--eviction-policy Deallocate
```



After the VM is created, you can query to see the max billing price for all of the VMs in the resource group.

```azurecli
az vm list \
   -g mySpotGroup \
   --query '[].{Name:name, MaxPrice:billingProfile.maxPrice}' \
   --output table
```

## Simulate an eviction

You can [simulate an eviction](/rest/api/compute/virtualmachines/simulateeviction) of an Azure Spot Virtual Machine, to testing how well your application will repond to a sudden eviction. 

Replace the following with your information: 

- `subscriptionId`
- `resourceGroupName`
- `vmName`


```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}/simulateEviction?api-version=2020-06-01
```
`Response Code: 204` means the simulated eviction was successful. 

**Next steps**

You can also create an Azure Spot Virtual Machine using [Azure PowerShell](../windows/spot-powershell.md), [portal](../spot-portal.md), or a [template](spot-template.md).

Query current pricing information using the [Azure retail prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) for information about Azure Spot Virtual Machine. The `meterName` and `skuName` will both contain `Spot`.

If you encounter an error, see [Error codes](../error-codes-spot.md).
