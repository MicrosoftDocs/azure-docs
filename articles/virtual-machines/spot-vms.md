---
title: Use Azure Spot Virtual Machines 
description: Learn how to use Azure Spot Virtual Machines to save on costs.
author: JagVeerappan
ms.author: jagaveer
ms.service: virtual-machines
ms.subservice: spot
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 10/05/2020
ms.reviewer: cynthn
---


# Use Azure Spot Virtual Machines 

Using Azure Spot Virtual Machines allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Azure Spot Virtual Machines. Therefore, Azure Spot Virtual Machines are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

The amount of available capacity can vary based on size, region, time of day, and more. When deploying Azure Spot Virtual Machines, Azure will allocate the VMs if there is capacity available, but there is no SLA for these VMs. A Azure Spot Virtual Machine offers no high availability guarantees. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Azure Spot Virtual Machines with 30 seconds notice. 


## Eviction policy

VMs can be evicted based on capacity or the max price you set. When creating a Azure Spot Virtual Machine, you can set the eviction policy to *Deallocate* (default) or *Delete*. 

The *Deallocate* policy moves your VM to the stopped-deallocated state, allowing you to redeploy it later. However, there is no guarantee that the allocation will succeed. The deallocated VMs will count against your quota and you will be charged storage costs for the underlying disks. 

If you would like your VM to be deleted when it is evicted, you can set the eviction policy to *delete*. The evicted VMs are deleted together with their underlying disks, so you will not continue to be charged for the storage. 

You can opt-in to receive in-VM notifications through [Azure Scheduled Events](./linux/scheduled-events.md). This will notify you if your VMs are being evicted and you will have 30 seconds to finish any jobs and perform shutdown tasks prior to the eviction. 


| Option | Outcome |
|--------|---------|
| Max price is set to >= the current price. | VM is deployed if capacity and quota are available. |
| Max price is set to < the current price. | The VM is not deployed. You will get an error message that the max price needs to be >= current price. |
| Restarting a stop/deallocate VM if the max price is >= the current price | If there is capacity and quota, then the VM is deployed. |
| Restarting a stop/deallocate VM if the max price is < the current price | You will get an error message that the max price needs to be >= current price. | 
| Price for the VM has gone up and is now > the max price. | The VM gets evicted. You get a 30s notification before actual eviction. | 
| After eviction the price for the VM goes back to being < the max price. | The VM will not be automatically re-started. You can restart the VM yourself, and it will be charged at the current price. |
| If the max price is set to `-1` | The VM will not be evicted for pricing reasons. The max price will be the current price, up to the price for standard VMs. You will never be charged above the standard price.| 
| Changing the max price | You need to deallocate the VM to change the max price. Deallocate the VM, set a new max price, then update the VM. |


## Limitations

The following VM sizes are not supported for Azure Spot Virtual Machines:
 - B-series
 - Promo versions of any size (like Dv2, NV, NC, H promo sizes)

Azure Spot Virtual Machines can be deployed to any region, except Microsoft Azure China 21Vianet.

<a name="channel"></a>

The following [offer types](https://azure.microsoft.com/support/legal/offer-details/) are currently supported:

-	Enterprise Agreement
-	Pay-as-you-go offer code 003P
-	Sponsored
- For Cloud Service Provider (CSP), contact your partner


## Pricing

Pricing for Azure Spot Virtual Machines is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 

You can also query pricing information using the [Azure retail prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) to query for information about Spot pricing. The `meterName` and `skuName` will both contain `Spot`.

With variable pricing, you have option to set a max price, in US dollars (USD), using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for spot or the price for a standard VM, which ever is less, as long as there is capacity and quota available.

## Pricing and eviction history

You can see historical pricing and eviction rates per size in a region in the portal. Select **View pricing history and compare prices in nearby regions** to see a table or graph of pricing for a specific size.  The pricing and eviction rates in the following images are only examples. 

**Chart**:

:::image type="content" source="./media/spot-chart.png" alt-text="Screenshot of the region options with the difference in pricing and eviction rates as a chart.":::

**Table**:

:::image type="content" source="./media/spot-table.png" alt-text="Screenshot of the region options with the difference in pricing and eviction rates as a table.":::



##  Frequently asked questions

**Q:** Once created, is a Azure Spot Virtual Machine the same as regular standard VM?

**A:** Yes, except there is no SLA for Azure Spot Virtual Machines and they can be evicted at any time.


**Q:** What to do when you get evicted, but still need capacity?

**A:** We recommend you use standard VMs instead of Azure Spot Virtual Machines if you need capacity right away.


**Q:** How is quota managed for Azure Spot Virtual Machines?

**A:** Azure Spot Virtual Machines will have a separate quota pool. Spot quota will be shared between VMs and scale-set instances. For more information, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).


**Q:** Can I request for additional quota for Azure Spot Virtual Machines?

**A:** Yes, you will be able to submit the request to increase your quota for Azure Spot Virtual Machines through the [standard quota request process](../azure-portal/supportability/per-vm-quota-requests.md).


**Q:** Where can I post questions?

**A:** You can post and tag your question with `azure-spot` at [Q&A](/answers/topics/azure-spot.html). 


**Q:** How can I change the max price for a spot VM?

**A:** Before you can change the max price, you need to deallocate the VM. Then you can change the max price in the portal, from the **Configuration** section for the VM. 

## Next steps
Use the [CLI](./linux/spot-cli.md), [portal](spot-portal.md), [ARM template](./linux/spot-template.md), or [PowerShell](./windows/spot-powershell.md) to deploy Azure Spot Virtual Machines.

You can also deploy a [scale set with Azure Spot Virtual Machine instances](../virtual-machine-scale-sets/use-spot.md).

If you encounter an error, see [Error codes](./error-codes-spot.md).
