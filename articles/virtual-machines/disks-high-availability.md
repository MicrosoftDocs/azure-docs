---
title: Best practices for high availability with Azure VMs and managed disks
description: Learn the steps you can take to get the best availability with your Azure virtual machines and managed disks.
author: roygara
ms.author: rogarana
ms.date: 05/21/2024
ms.topic: conceptual
ms.service: azure-disk-storage
---

# Best practices for achieving high availability with Azure virtual machines and managed disks

Azure offers several configuration options for ensuring high availability of Azure virtual machines (VMs) and Azure managed disks. This article covers the default availability and durability of managed disks and provides recommendations to further increase your application's availability and resiliency.

## At a glance

|Configuration  |Recommendation  |Benefits  |
|---------|---------|---------|
|[Applications running on a single VM](#recommendations-for-applications-running-on-a-single-vm)     |[Use Ultra Disks, Premium SSD v2, and Premium SSD disks](#use-ultra-disks-premium-ssd-v2-or-premium-ssd).         |Single VMs using only Premium SSD disks as the OS disks, and either Ultra Disks, Premium SSD v2, or Premium SSD disks as data disks have the highest uptime service level agreement (SLA), and these disk types offer the best performance.         |
|     |[Use zone-redundant storage (ZRS) disks](#use-zone-redundant-storage-disks).         |Access to your data even if an entire zone experiences an outage.         |
|[Applications running on multiple VMs](#recommendations-for-applications-running-on-multiple-vms)    |Distribute VMs and disks across multiple availability zones using a [zone redundant Virtual Machine Scale Set with flexible orchestration mode](#use-zone-redundant-virtual-machine-scale-sets-with-flexible-orchestration) or by deploying VMs and disks across [three availability zones](#deploy-vms-and-disks-across-three-availability-zones).        |Multiple VMs have the highest uptime SLA when deployed across multiple zones.         |
|     |Deploy VMs and disks across multiple fault domains with either [regional Virtual Machine Scale Sets with flexible orchestration mode](#use-regional-virtual-machine-scale-sets-with-flexible-orchestration) or [availability sets](#use-availability-sets).         |Multiple VMs have the second highest uptime SLA when deployed across fault domains.         |
|     |[Use ZRS disks when sharing disks between VMs](#use-zrs-disks-when-sharing-disks-between-vms).         |Prevents a shared disk from becoming a single point of failure.         |


## Availability and durability of managed disks

Before going over recommendations for achieving higher availability, you should understand the default availability and durability of managed disks.

Managed disks are designed for 99.999% availability and provide at least 99.999999999% (11 9’s) of durability. With managed disks, your data is replicated three times. If one of the three copies becomes unavailable, Azure automatically spawns a new copy of the data in the background. This ensures the persistence of your data and high fault tolerance.

Managed disks have two redundancy models, locally redundant storage (LRS) disks, and zone-redundant storage (ZRS) disks. The following diagram depicts how data is replicated with either model.

:::image type="content" source="media/disks-high-availability/disks-lrs-zrs-diagram.png" alt-text="Diagram showing that LRS replicates data in one availability zone while ZRS replicates data in three different availability zones." lightbox="media/disks-high-availability/disks-lrs-zrs-diagram.png":::

LRS disks provide at least 99.999999999% (11 9's) of durability over a given year and ZRS disks provide at least 99.9999999999% (12 9's) of durability over a given year. This architecture helps Azure consistently deliver enterprise-grade durability for infrastructure as a service (IaaS) disks, with an industry-leading zero percent [annualized failure rate](https://en.wikipedia.org/wiki/Annualized_failure_rate).

## Recommendations for applications running on a single VM

Legacy applications, traditional web servers, line-of-business applications, development and testing environments, and small workloads are all examples of applications that may run on a single VM. These applications can't benefit from replication across multiple VMs, but the data on the disks is still replicated three times, and you can take the following steps to further increase availability.

### Use Ultra Disks, Premium SSD v2, or Premium SSD

Single VMs using only [Premium SSD disks](disks-types.md#premium-ssds) as the OS disk, and either [Ultra Disks](disks-types.md#ultra-disks), [Premium SSD v2](disks-types.md#premium-ssd-v2), or [Premium SSD disks](disks-types.md#premium-ssds) as data disks have the [highest single VM uptime SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1), and these disk types offer the best performance.

### Use zone-redundant storage disks

Zone-redundant storage (ZRS) disks synchronously replicate data across three availability zones, which are separated groups of data centers in a region that have independent power, cooling, and networking infrastructure. With ZRS disks, your data is accessible even in the event of a zonal outage. ZRS disks have limitations, see [Zone-redundant storage for managed disks](disks-redundancy.md#zone-redundant-storage-for-managed-disks) for details.

## Recommendations for applications running on multiple VMs

Quorum-based applications, clustered databases (SQL, MongoDB), enterprise-grade web applications, and gaming applications are all examples of applications running on multiple VMs. Applications running on multiple VMs can designate a primary VM and multiple secondary VMs and replicate data across these VMs. This setup enables failover to a secondary VM if the primary VM goes down.

Multiple VMs have the highest uptime service level agreement (SLA) when deployed across multiple availability zones, and they have the second highest uptime SLA when deployed across multiple storage and compute fault domains.

### Distribute VMs and disks across availability zones

Availability zones are separated groups of data centers within a region that have independent power, cooling, and networking infrastructure. They're close enough to have low-latency connections to other availability zones but far enough to reduce the possibility that more than one is affected by local outages or weather. See [What are availability zones?](../reliability/availability-zones-overview.md) for details.

Multiple VMs have the highest [SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) when distributed across three availability zones. For VMs and disks distributed across multiple availability zones, the disks and their parent VMs are respectively collocated in the same zone, which prevents multiple VMs from going down even if an entire zone experiences an outage. Availability zones aren't currently available in every region, see [Azure regions with availability zone support](../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support).

VMs distributed across multiple availability zones may have higher network latency than VMs distributed in a single availability zone, which could be a concern for workloads that require ultra-low latency. If low latency is your top priority, consider the methods described in [Deploy VMs and disks across multiple fault domains](#deploy-vms-and-disks-across-multiple-fault-domains).

To deploy resources across availability zones, you can either use [zone-redundant Virtual Machine Scale Sets](#use-zone-redundant-virtual-machine-scale-sets-with-flexible-orchestration) or [deploy resources across availability zones](#deploy-vms-and-disks-across-three-availability-zones).

The following diagram depicts how VMs and disks are collocated in the same zones when deployed across availability zones directly or using zone-redundant Virtual Machine Scale Sets.

:::image type="content" source="media/disks-high-availability/disks-availability-zones.png" alt-text="Diagram depicting VM and disk collocation in availability zones." lightbox="media/disks-high-availability/disks-availability-zones.png":::

#### Use zone-redundant Virtual Machine Scale Sets with flexible orchestration

[Virtual Machine Scale Sets](../virtual-machine-scale-sets/overview.md) let you create and manage a group of load balanced VMs. The number of VM instances can automatically adjust in response to demand or follow a schedule you define. A zone-redundant Virtual Machine Scale Set is a Virtual Machine Scale Set that has been deployed across multiple availability zones. See [Zone redundant or zone spanning](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-redundant-or-zone-spanning).

With zone-redundant Virtual Machine Scale Sets using the flexible orchestration mode, VMs, and their disks are replicated to one or more zones within the region they're deployed in to improve the resiliency and availability of your applications and data. This configuration spreads VMs across selected zones in a best effort approach by default but also provides the ability to specify strict zone balance in the deployment.


#### Deploy VMs and disks across three availability zones

Another method to distribute VMs and disks across availability zones is to deploy the VMs and disks across three availability zones. This deployment provides redundancy in VMs and disks across multiple data centers in a region, allowing you to fail over to another zone if there's a data center or zonal outage.


### Deploy VMs and disks across multiple fault domains


If you can't deploy your VMs and disks across availability zones or have ultra-low latency requirements, you can deploy them across fault domains instead. Fault domains define groups of VMs that share a common power source and a network switch. For details, see [How do availability sets work?](availability-set-overview.md#how-do-availability-sets-work).

For VMs and disks deployed across fault domains via the following methods, the storage fault domains of the disks are aligned with the compute fault domains of their respective parent VMs, which prevents multiple VMs from going down if a single storage fault domain experiences an outage.

Multiple VMs have the second highest uptime SLA when deployed across fault domains. To learn more, see the Virtual Machines section of the [SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

To deploy resources across multiple fault domains, you can either use [regional Virtual Machine Scale Sets](#use-regional-virtual-machine-scale-sets-with-flexible-orchestration) or [availability sets](#use-availability-sets).

The following diagram depicts the alignment of compute and storage fault domains when using either regional Virtual Machine Scale Sets or availability sets.

:::image type="content" source="media/disks-high-availability/disks-availability-set.png" alt-text="Diagram of fault domain alignment with regional virtual machine scale sets and availability sets." lightbox="media/disks-high-availability/disks-availability-set.png":::

#### Use regional Virtual Machine Scale Sets with flexible orchestration

A regional Virtual Machine Scale Set is a Virtual Machine Scale Set that has no explicitly defined availability zones. With regional virtual machine scale sets, VM resources are replicated across fault domains within the region they're deployed in to improve the resiliency and availability of applications and data. This configuration spreads VMs across fault domains by default but also provides the ability to assign fault domains on VM creation. See [this section](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#regional) for details.

Regional Virtual Machine Scale Sets don't protect against large-scale outages like a data center or region outage, and don't currently support Ultra Disks or Premium SSD v2 disks.

#### Use availability sets

[Availability sets](availability-set-overview.md) are logical groupings of VMs that place VMs in different fault domains to limit the chance of correlated failures bringing related VMs down at the same time. Availability sets also have better VM to VM latencies compared to availability zones.

Availability sets don't let you select the fault domains for your VMs, can't be used with availability zones, don't protect against data center or region-wide outages, and don't currently support Ultra Disks or Premium SSD v2 disks.

### Use ZRS disks when sharing disks between VMs

You should use ZRS when sharing a disk between multiple VMs. If you use LRS, the shared disk becomes a single point of failure for your clustered application. This means that if your shared LRS disk experiences an outage, all the VMs to which this disk is attached will experience downtime. Using a ZRS disk mitigates this, since the disk's data is in three different availability zones. To learn more about shared disks, see [Share an Azure managed disk](disks-shared.md).

## Next steps

- [Zone-redundant storage for managed disks](disks-redundancy.md#zone-redundant-storage-for-managed-disks)
- [What are availability zones?](../reliability/availability-zones-overview.md)
- [Create a Virtual Machine Scale Set that uses Availability Zones](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)