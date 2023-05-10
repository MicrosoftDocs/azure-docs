---
title: Use CLI to deploy Azure Spot Virtual Machines
description: Learn how to use the CLI to deploy Azure Spot Virtual Machines to save costs.
author: ju-shim
ms.service: virtual-machines
ms.subservice: spot
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/22/2021
ms.author: jushiman
ms.reviewer: cynthn
---

# Deploy Azure Spot Virtual Machines using the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Using [Azure Spot Virtual Machines](../spot-vms.md) allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Azure Spot Virtual Machines. Therefore, Azure Spot Virtual Machines are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

Pricing for Azure Spot Virtual Machines is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 

You have option to set a max price you are willing to pay, per hour, for the VM. The max price for an Azure Spot Virtual Machine can be set in US dollars (USD), using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for Azure Spot Virtual Machine or the price for a standard VM, which ever is less, as long as there is capacity and quota available. For more information about setting the max price, see [Azure Spot Virtual Machines - Pricing](../spot-vms.md#pricing).

The process to create an Azure Spot Virtual Machine using the Azure CLI is the same as detailed in the [quickstart article](./quick-create-cli.md). Just add the '--priority Spot' parameter, set the `--eviction-policy` to either Deallocate (this is the default) or `Delete`, and provide a max price or `-1`. 


## Install Azure CLI

To create Azure Spot Virtual Machines, you need to be running the Azure CLI version 2.0.74 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

Sign in to Azure using [az login](/cli/azure/reference-index#az-login).

```azurecli-interactive
az login
```

## Create an Azure Spot Virtual Machine

This example shows how to deploy a Linux Azure Spot Virtual Machine that will not be evicted based on price. The eviction policy is set to deallocate the VM, so that it can be restarted at a later time. If you want to delete the VM and the underlying disk when the VM is evicted, set `--eviction-policy` to `Delete`.

```azurecli-interactive
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

```azurecli-interactive
az vm list \
   -g mySpotGroup \
   --query '[].{Name:name, MaxPrice:billingProfile.maxPrice}' \
   --output table
```

## Simulate an eviction

You can simulate an eviction of an Azure Spot Virtual Machine using REST, PowerShell, or the CLI, to test how well your application will respond to a sudden eviction.

In most cases, you will want to use the REST API [Virtual Machines - Simulate Eviction](/rest/api/compute/virtualmachines/simulateeviction) to help with automated testing of applications. For REST, a `Response Code: 204` means the simulated eviction was successful. You can combine simulated evictions with the [Scheduled Event service](scheduled-events.md), to automate how your app will respond when the VM is evicted.

To see scheduled events in action, watch Azure Friday - [Using Azure Scheduled Events to prepare for VM maintenance](https://youtu.be/ApsoXLVg_0U).


### Quick test

For a quick test to show how a simulated eviction will work, let's walk through querying the scheduled event service to see what it looks like when you simulate an eviction using the Azure CLI.

The Scheduled Event service is enabled for your service the first time you make a request for events. 

Remote into your VM, and then open a command prompt. 

From the command prompt on your VM, type:

```
curl -H Metadata:true http://169.254.169.254/metadata/scheduledevents?api-version=2019-08-01
```

This first response could take up to 2 minutes. From now on, they should display output almost immediately.

From a computer that has the Azure CLI installed (like your local machine), simulate an eviction using [az vm simulate-eviction](/cli/azure/vm#az-vm-simulate-eviction). Replace the resource group name and VM name with your own. 

```azurecli-interactive
az vm simulate-eviction --resource-group mySpotRG --name mySpot
```

The response output will have `Status: Succeeded` if the request was successfully made.

Quickly go back to your remote connection to your Spot Virtual Machine and query the Scheduled Events endpoint again. Repeat the following command until you get an output that contains more information:

```
curl -H Metadata:true http://169.254.169.254/metadata/scheduledevents?api-version=2019-08-01
```

When the Scheduled Event Service gets the eviction notification, you will get a response that looks similar to this:

```output
{"DocumentIncarnation":1,"Events":[{"EventId":"A123BC45-1234-5678-AB90-ABCDEF123456","EventStatus":"Scheduled","EventType":"Preempt","ResourceType":"VirtualMachine","Resources":["myspotvm"],"NotBefore":"Tue, 16 Mar 2021 00:58:46 GMT","Description":"","EventSource":"Platform"}]}
```

You can see that `"EventType":"Preempt"`, and the resource is the VM resource `"Resources":["myspotvm"]`. 

You can also see when the VM will be evicted by checking the `"NotBefore"` - the VM will not be evicted before the time given, so that is your window for your application to gracefully close out.


## Next steps

You can also create an Azure Spot Virtual Machine using [Azure PowerShell](../windows/spot-powershell.md), [portal](../spot-portal.md), or a [template](spot-template.md).

Query current pricing information using the [Azure retail prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) for information about Azure Spot Virtual Machine. The `meterName` and `skuName` will both contain `Spot`.

If you encounter an error, see [Error codes](../error-codes-spot.md).
