---
title: Best practices for high availability with Azure VMs and managed disks
description: Learn the steps you can take to get the best availability with your Azure virtual machines and managed disks.
author: roygara
ms.author: rogarana
ms.date: 04/25/2024
ms.topic: conceptual
ms.service: azure-disk-storage
---

# Best practices for achieving Azure virtual machines and managed disks with high availability

Azure offers several configuration options for ensuring high availability of Azure virtual machines (VMs) and Azure managed disks. This article covers the resiliency, durability, and availability of these options, and provides recommendations on which of these configurations to use based on your application.

## At a glance

|Configuration  |Recommendation  |Benefits  |
|---------|---------|---------|
|Applications running on a single VM     |Use Ultra Disks, Premium SSD v2, and Premium SSD disks.         |Single VMs using only Ultra Disks, Premium SSD v2, or Premium SSD disks have the highest uptime service level agreement (SLA), and these disk types offer the best performance.         |
|     |Use zone-redundant storage (ZRS) disks.         |Access to your data even if an entire zone experiences an outage.         |
|Applications running on multiple VMs     |Deploy VMs across multiple availability zones using a zone redundant Virtual Machine Scale Set with flexible orchestration mode or by deploying VMs across three availability zones.         |Multiple VMs have the highest uptime SLA when deployed across multiple zones.         |
|     |Deploy VMs across multiple fault domains with either regional Virtual Machine Scale Sets with flexible orchestration mode or availability sets.         |Multiple VMs have the second highest uptime SLA when deployed across fault domains.         |
|     |Use ZRS shared disks.         |Improves availability of data and reduces potential for failure.         |


## Intro

Durability of data is critical for a persistent storage platform. You have important business applications that depend on the persistence of the data. 

All managed disks are designed for 99.999% availability and provide at least 99.999999999% (11 9’s) of durability. With managed disks, your data is replicated three times. If one of the three copies becomes unavailable, Azure automatically spawns a new copy of the data in the background. This ensures the persistence of your data and allows a high tolerance against failures. 

Locally redundant storage (LRS) disks provide at least 99.999999999% (11 9's) of durability over a given year and zone-redundant storage (ZRS) disks provide at least 99.9999999999% (12 9's) of durability over a given year. This architecture helped Azure consistently deliver enterprise-grade durability for infrastructure as a service (IaaS) disks, with an industry-leading zero% [annualized failure rate](https://en.wikipedia.org/wiki/Annualized_failure_rate). 


## Applications running on a single VM

Legacy applications, traditional web servers, line-of-business applications, development and testing environments, and small workloads are all examples of applications that may run on a single VM. These applications can't benefit from replication across multiple VMs in different fault domains or availability zones, but you can take steps to increase their availability.

### Use Ultra Disks, Premium SSD v2, or Premium SSD

Single VMs using only [Ultra Disks](disks-types.md#ultra-disks), [Premium SSD v2](disks-types.md#premium-ssd-v2), or [Premium SSD disks](disks-types.md#premium-ssds) have the [highest single VM uptime SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) and the best performance of all Azure disk types. But, [Ultra Disks](disks-enable-ultra-ssd.md#ga-scope-and-limitations) and [Premium SSD v2](disks-deploy-premium-v2.md#limitations) currently have limitations.

### Use zone-redundant storage disks

Zone-redundant storage (ZRS) disks synchronously replicate data across three availability zones in the region they're deployed in. With ZRS disks, your data is accessible even in the event of a zonal outage. ZRS disks have limitations, see [Zone-redundant storage for managed disks](disks-redundancy.md#zone-redundant-storage-for-managed-disks) for details.

## Applications running on multiple VMs

Quorum-based applications, clustered databases (SQL, MongoDB), enterprise-grade web applications, and gaming applications are all examples of applications running on multiple VMs. Multiple VMs have the highest uptime service level agreement (SLA) when deployed across multiple availability zones, and they have the second highest uptime SLA when deployed across multiple fault domains.

### Deploy VMs across multiple availability zones

Availability zones are separated groups of data centers within a region that have independent power, cooling, and networking infrastructure. They're close enough to have low-latency connections to other availability zones but far enough to reduce the possibility that more than one is affected by local outages or weather. See [What are availability zones?](../reliability/availability-zones-overview.md) for details.

VMs deployed across three availability zones have the highest uptime [SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1). Availability zones aren't currently available in every region, see [Azure regions with availability zone support](../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support).

#### Use zone-redundant Virtual Machine Scale Sets with flexible orchestration

[Virtual Machine Scale Sets](../virtual-machine-scale-sets/overview.md) let you create and manage a group of load balanced VMs. The number of VM instances can automatically adjust in response to demand or follow a schedule you define. A zone-redundant Virtual Machine Scale Set is a Virtual Machine Scale Set that has been deployed across multiple availability zones. See [Zone redundant or zone spanning](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-redundant-or-zone-spanning).

With zone-redundant Virtual Machine Scale Sets using the flexible orchestration mode, VMs and their disks are replicated to one or more zones within the region they're deployed in to improve the resiliency and availability of your applications and data. This configuration spreads VMs across selected zones in a best effort approach by default but also provides the ability to specify strict zone balance in the deployment.  With this configuration, the storage fault domains of disks are aligned to the VM fault domains, preventing VMs from going down if a single storage fault domain has an outage. You should use this or [Deploy VMs across three availability zones](#deploy-vms-across-three-availability-zones) configurations to maximize your environment's availability.

There might be higher network latency between several availability zones than within a single availability zone, which could be a concern for workloads that require ultra-low latency. If low latency is your top priority, consider [regional Virtual Machine Scale Sets with flexible orchestration](#use-regional-virtual-machine-scale-sets-with-flexible-orchestration) or [availability sets](#use-availability-sets).

#### Deploy VMs across three availability zones

This deployment provides redundancy in VMs across multiple data centers in a region, and allows you to failover to another zone if there's a data center or zonal outage. You should use this or [zone-redundant Virtual Machine Scale Sets with flexible orchestration](#use-zone-redundant-virtual-machine-scale-sets-with-flexible-orchestration) configurations to maximize your environment's availability.

There might be higher network latency between several availability zones than within a single availability zone, which could be a concern for workloads that require ultra-low latency. If low latency is your top priority, consider [regional Virtual Machine Scale Sets with flexible orchestration](#use-regional-virtual-machine-scale-sets-with-flexible-orchestration) or [availability sets](#use-availability-sets).

### Deploy VMs across multiple fault domains

Fault domains define groups of VMs that share a common power source and a network switch. For details, see [How do availability sets work?](availability-set-overview.md#how-do-availability-sets-work).

If you can't deploy your VMs across availability zones, you can deploy them across fault domains instead. Multiple VMs have the second highest uptime SLA when deployed across fault domains. To learn more, see the Virtual Machines section of the [SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

#### Use regional Virtual Machine Scale Sets with flexible orchestration

A regional Virtual Machine Scale Set is a Virtual Machine Scale Set that has no explicitly defined availability zones. With regional virtual machine scale sets, VM resources are replicated across fault domains within the region they're deployed in to improve the resiliency and availability of applications and data. This configuration spreads VMs across fault domains by default but also provides the ability to assign fault domains on VM creation. See [this section](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#regional) for details.

Regional Virtual Machine Scale Sets don't currently support Ultra Disks or Premium SSD v2 disks, and doesn't protect against large-scale outages like a data center or region outage.

#### Use availability sets

[Availability sets](availability-set-overview.md) are logical groupings of VMs that place VMs in different fault domains to limit the chance of correlated failures bringing related VMs down at the same time. Availability sets also have better VM to VM latencies compared to availability zones.

Availability sets don't let you select the fault domains for your VMs, can't be used with availability zones, don't currently support Ultra Disks or Premium SSD v2 disks, and doesn't protect against large-scale outages like a data center or region-wide outages.

#### Use ZRS disks when sharing disks

## Next steps

- [What are availability zones?](../reliability/availability-zones-overview.md)
- [Create a Virtual Machine Scale Set that uses Availability Zones](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)
- [Availability sets overview](availability-set-overview.md)