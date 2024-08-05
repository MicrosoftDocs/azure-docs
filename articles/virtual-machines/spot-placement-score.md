---
title: Use Azure Spot Virtual Machines
description: Learn how to use Azure Spot Virtual Machines to save on costs.
author: am4234m
ms.author: aparnamishra
ms.service: azure-virtual-machines
ms.subservice: azure-spot-vm
ms.topic: how-to
ms.date: 08/05/2024
ms.reviewer: ju-shim
---


# Use Azure Spot Virtual Machines 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets



## Eviction policy

Spot VMs can be stopped if Azure needs capacity for other pay-as-you-go workloads or when the price of the spot instance exceeds the maximum price that you have set. When creating an Azure Spot Virtual Machine, you can set the eviction policy to *Deallocate* (default) or *Delete*. 

The *Deallocate* policy moves your VM to the stopped-deallocated state, allowing you to redeploy it later. However, there's no guarantee that the allocation will succeed. The deallocated VMs will count against your quota and you'll be charged storage costs for the underlying disks. 

If you would like your VM to be deleted when it's evicted, you can set the eviction policy to *delete*. The evicted VMs are deleted together with their underlying disks, so you'll not continue to be charged for the storage. 

You can opt in to receive in-VM notifications through [Azure Scheduled Events](./linux/scheduled-events.md). These are delivered on a best effort basis up to 30 seconds prior to the eviction.


| Option | Outcome |
|--------|---------|
| Max price is set to >= the current price. | VM is deployed if capacity and quota are available. |
| Max price is set to < the current price. | The VM isn't deployed. You'll get an error message that the max price needs to be >= current price. |
| Restarting a stopped/deallocated VM if the max price is >= the current price | If there's capacity and quota, then the VM is deployed. |
| Restarting a stopped/deallocated VM if the max price is < the current price | You'll get an error message that the max price needs to be >= current price. | 
| Price for the VM has gone up and is now > the max price. | The VM gets evicted. Azure will attempt scheduled event delivery up to 30 seconds before actual eviction. | 
| After eviction, the price for the VM goes back to being < the max price. | The VM won't be automatically restarted. You can restart the VM yourself, and it will be charged at the current price. |
| If the max price is set to `-1` | The VM won't be evicted for pricing reasons. The max price will be the current price, up to the price for standard VMs. You'll never be charged above the standard price.| 
| Changing the max price | You need to deallocate the VM to change the max price. Deallocate the VM, set a new max price, then update the VM. |

> [!TIP]
> Check out our [Azure Virtual Machine Spot Eviction](/azure/architecture/guide/spot/spot-eviction) guide to learn how to create a reliable interruptible workload in Azure.

## Limitations

The following VM sizes aren't supported for Azure Spot Virtual Machines:
 - B-series
 - Promo versions of any size (like Dv2, NV, NC, H promo sizes)

Azure Spot Virtual Machines can be deployed to any region, except Microsoft Azure operated by 21Vianet.

<a name="channel"></a>

The following [offer types](https://azure.microsoft.com/support/legal/offer-details/) are currently supported:

-	Enterprise Agreement 
-	Pay-as-you-go offer code (003P)
-	Sponsored (0036P and 0136P) - not available in Fairfax
- For Cloud Service Provider (CSP), see the [Partner Center](/partner-center/azure-plan-get-started) or contact your partner directly.


## Pricing

Pricing for Azure Spot Virtual Machines is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 

You can also query pricing information using the [Azure retail prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) to query for information about Spot pricing. The `meterName` and `skuName` will both contain `Spot`.

With variable pricing, you have option to set a max price, in US dollars (USD), using up to five decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for spot or the price for a standard VM, which ever is less, as long as there's capacity and quota available.

## Pricing and eviction history

### Portal

You can see historical pricing and eviction rates per size in a region in the portal while you are creating the VM. After selecting the checkbox to **Run with Azure Spot discount**, a link will appear under the size selection of the VM titled **View pricing history and compare prices in nearby regions**. By selecting that link you will be able to see a table or graph of spot pricing for the specified VM size.   The pricing and eviction rates in the following images are only examples. 

> [!TIP]
> Eviction rates are quoted _per hour_. For example, an eviction rate of 10% means a VM has a 10% chance of being evicted within the next hour, based on historical eviction data of the last 7 days.

