---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/14/2019
 ms.author: cynthn
 ms.custom: include file
---

Using spot VMs allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict spot VMs. Therefore, spot VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

The amount of available capacity can vary based on size, region, time of day, and more. When deploying spot VMs, Azure will allocate the VMs if there is capacity available, but there is no SLA for these VMs. A spot VM offers no high availability guarantees.

At any point in time when Azure needs the capacity back, the Azure infrastructure will evict spot VMs. Therefore, spot VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.



## Eviction Policy

When deploying spot VMs, Azure will allocate the VMs if there is capacity available, but there are no SLA guarantees. At any point in time when Azure needs the capacity back, we will evict spot VMs with 30 seconds notice. 

VMs can be evicted based on capacity or the max price you set. For virtual machines, the eviction policy is set to *Deallocate* which moves your evicted VMs to the stopped-deallocated state, allowing you to redeploy the evicted VMs at a later time. However, there is no guarantee that the allocation will succeed. The deallocated VMs will count against your spot vCPU quota and you will be charged for your underlying disks. 

> [!IMPORTANT]
> For the early part of the public preview, you can set a max price, but it will be ignored. spot VMs will have a fixed price, so there will not be any price-based evictions.


| Option | Outcome |
|--------|---------|
| Max price is set to >= the current price. | VM is deployed if capacity and quota are available. |
| Max price is set to < the current price. | The VM is not deployed. You will get an error message that the max price needs to be >= current price. |
| Restarting a stop/deallocate VM if the max price is >= the current price | If there is capacity and quota, then the VM is deployed. |
| Restarting a stop/deallocate VM if the max price is < the current price | You will get an error message that the max price needs to be >= current price. | 
| Price for the VM has gone up and is now > the max price. | The VM gets evicted. You get a 30s notification before actual eviction. | 
| After eviction the price for the VM goes back to being < the max price. | The VM will not be automatically re-started. You can restart the VM yourself, and it will be charged at the current price. |
| If the max price is set to `-1` | The VM will not be evicted for pricing reasons. The max price will be the current price, up to the price for on-demand VMs. You will never be charged above the on-demand price.| 

## Limitations

The following VM sizes are not supported for spot VMs:
 - B-series
 - Promo versions of any size (like Dv2, NV, NC, H promo sizes)
 - The original A-series (like Basic_A1 and Standard_A1)
 - The original D-series (like Standard_D1)
 
spot VMs can be deployed to any region, except Microsoft Azure China 21Vianet and Department of Defense (DoD) in the Azure Government region.

## Pricing

Pricing for spot VMs is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/). 


With variable pricing, you have option to set a max price, in USD, using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for spot or the price for an on-demand VM, which ever is less, as long as there is capacity and quota available.

> [!IMPORTANT]
> spot VMs are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> For the early part of the public preview, you can set a max price, but it will be ignored. spot VMs will have a fixed price, so there will not be any price-based evictions.



##  Frequently asked questions

**Q:** Once created, is a spot VM the same as regular on-demand VM?

**A:** Yes, except there is no SLA for spot VMs.


**Q:** What to do when you get evicted, but still need capacity?

**A:** We recommend you use on-demand VMs instead of spot VMs if you need capacity right away.


**Q:** How is quota managed for spot VMs?

**A:** spot VMs and regular VMs will have separate quota pools. 

> [!IMPORTANT]
> For the early part of the public preview, regular VMs and spot VMs will share quota.


**Q:** Can I request for additional quota for spot?

**A:** Yes, you will be able to submit the request to increase your quota for spot VMs through the automation tool.


**Q:** Can I use spot VMs with AKS?

**A:** Not yet. We are working with AKS team to introduce spot VM option in AKS.


**Q:** Where can I post questions?

**A:** You can post and tag your question with `azurelowpri` at [http://aka.ms/stackoverflow](https://stackoverflow.microsoft.com/questions/tagged/azurelowpri). 

