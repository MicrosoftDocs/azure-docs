---
 title: include file
 description: include file
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/15/2020
 ms.author: cynthn
 ms.custom: include file
---

Using Spot VMs allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Spot VMs. Therefore, Spot VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

The amount of available capacity can vary based on size, region, time of day, and more. When deploying Spot VMs, Azure will allocate the VMs if there is capacity available, but there is no SLA for these VMs. A Spot VM offers no high availability guarantees. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Spot VMs with 30 seconds notice. 


## Eviction policy

VMs can be evicted based on capacity or the max price you set. For virtual machines, the eviction policy is set to *Deallocate* which moves your evicted VMs to the stopped-deallocated state, allowing you to redeploy the evicted VMs at a later time. However, reallocating Spot VMs will be dependent on there being available Spot capacity. The deallocated VMs will count against your spot vCPU quota and you will be charged for your underlying disks. 

Users can opt-in to receive in-VM notifications through [Azure Scheduled Events](../articles/virtual-machines/linux/scheduled-events.md). This will notify you if your VMs are being evicted and you will have 30 seconds to finish any jobs and perform shutdown tasks prior to the eviction. 


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

The following VM sizes are not supported for Spot VMs:
 - B-series
 - Promo versions of any size (like Dv2, NV, NC, H promo sizes)

Spot VMs can be deployed to any region, except Microsoft Azure China 21Vianet.

Some subscription channels are not supported:

<a name="channel"></a>

| Azure Channels               | Azure Spot VMs Availability       |
|------------------------------|-----------------------------------|
| Enterprise Agreement         | Yes                               |
| Pay As You Go                | Yes                               |
| Cloud Service Provider (CSP) | [Contact your partner](https://docs.microsoft.com/partner-center/azure-plan-get-started) |
| Benefits                     | Not available                     |
| Sponsored                    | Not available                     |
| Free Trial                   | Not available                     |



## Pricing

Pricing for Spot VMs is variable, based on region and SKU. For more information, see VM pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). 


With variable pricing, you have option to set a max price, in US dollars (USD), using up to 5 decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the VM won't be evicted based on price. The price for the VM will be the current price for spot or the price for a standard VM, which ever is less, as long as there is capacity and quota available.


##  Frequently asked questions

**Q:** Once created, is a Spot VM the same as regular standard VM?

**A:** Yes, except there is no SLA for Spot VMs and they can be evicted at any time.


**Q:** What to do when you get evicted, but still need capacity?

**A:** We recommend you use standard VMs instead of Spot VMs if you need capacity right away.


**Q:** How is quota managed for Spot VMs?

**A:** Spot VMs will have a separate quota pool. Spot quota will be shared between VMs and scale-set instances. For more information, see [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits).


**Q:** Can I request for additional quota for Spot?

**A:** Yes, you will be able to submit the request to increase your quota for Spot VMs through the [standard quota request process](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests).


**Q:** Where can I post questions?

**A:** You can post and tag your question with `azure-spot` at [Q&A](https://docs.microsoft.com/answers/topics/azure-spot.html). 



