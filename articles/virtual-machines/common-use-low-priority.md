---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/09/2019
 ms.author: cynthn
 ms.custom: include file
---


Using low-priority VMs on scale sets allows you to take advantage of our unutilized capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict low-priority VMs. Therefore, low-priority VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

The amount of available unutilized capacity can vary based on size, region, time of day, and more. When deploying low-priority VMs on scale sets, Azure will allocate the VMs if there is capacity available, but there is no SLA for these VMs. A low-priority scale set is deployed in a single fault domain and offers no high availability guarantees.

## Eviction Policy

When deploying Low-priority VMs, Azure will allocate the VMs if there is capacity available, but there are no SLA guarantees. At any point in time when Azure needs the capacity back, we will evict low-priority VMs with 30 seconds notice. 


For the preview, VMs will be evicted based on capacity. When creating low-priority virtual machines, the eviction policy is set to *Deallocate*. The *Deallocate* policy moves your evicted VMs to the stopped-deallocated state allowing you to redeploy evicted instances. However, there is no guarantee that the allocation will succeed. The deallocated VMs will count against your vCPU quota and you will be charged for your underlying disks. 

You will be notified 30 seconds before the eviction policy deallocated the VM.

## Pricing

Pricing for low-priority VMs is variable based on region and SKU. For more information, see [Low-priority VM pricing]().

