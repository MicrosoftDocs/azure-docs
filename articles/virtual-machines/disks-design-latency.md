---
title: Best practices for availability
description: Learn the steps you can take to get the best availability with your Azure virtual machines and managed disks
author: roygara
ms.author: rogarana
ms.date: 05/02/2023
ms.topic: conceptual
ms.service: azure-disk-storage
---

# Best practices for availability with Virtual Machines and Disks

Ensuring availability of Azure virtual machines (VMs) and Azure Disk Storage is critical for maintaining steady application performance. This article outlines best practices for achieving optimal availability.


At a high level:

- Applications running on a single VM
    - Use Ultra Disks, Premium SSD v2, or Premium SSD disks. These disk types have the highest uptime SLA for single VMs and offer the best performance.
    - Use zone-redundant storage (ZRS) disks to automatically replicate your data across multiple zones.
    - Use locally redundant storage (LRS) disks to automatically replicate data across multiple fault domains.
- Cluster applications
    - Deploy VMs across multiple availability zones. VMs with this configuration have the highest uptime SLA.
        - This config can be achieved with either zone-redundant virtual machine scale sets (VMSS) flex or by deploying VMs across three availability zones.
    - Deploy VMs across multiple fault domains for another layer of redundancy. You can do this using regional virtual machine scale sets flex or by using availability sets.

## Applications running on a single VM

Legacy applications, traditional web servers, line-of-business applications, development and testing environments, and small workloads are all examples of applications that may run on a single VM. These applications can't benefit from replication across multiple VMs in different fault domains or availability zones. However, you have options to increase their availability.

The following recommendations aren't exclusive and you can combine them.

### Use Ultra Disks, Premium SSD v2, or Premium SSD

VMs using [Ultra Disks](disks-types.md#ultra-disks), [Premium SSD v2](disks-types.md#premium-ssd-v2), or [Premium SSD disks](disks-types.md#premium-ssds) have the highest single VM uptime SLA. See the virtual machines section of Microsoft's [service level agreements](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) for details.

### Use ZRS disks

ZRS disks synchronously replicate data across three availability zones in the region they're deployed in. See [Zone-redundant storage for managed disks](disks-redundancy.md#zone-redundant-storage-for-managed-disks) for details.

### Use LRS disks

If you can't use ZRS disks, you can take steps to protect LRS disks from zonal failures. See [Locally redundant storage for managed disks](disks-redundancy.md#locally-redundant-storage-for-managed-disks) for details.

## Cluster applications

Applications running on multiple VMs are cluster applications. These applications can benefit from storage availability and redundancy, as well as replication across multiple VMs in various availability zones or fault domains.

The following options are mutually exclusive, and are ordered by options with the highest availability.

### Deploy VMs across multiple availability zones

VMs deployed across multiple availability zones have the highest uptime SLA. See the virtual machines section of Microsoft's [service level agreements](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) for more information.

#### Use zone-redundant virtual machine scale sets flex

With zone-redundant virtual machine scale sets, VM resources replicate to one or more zones within the region they're deployed in to improve the resiliency and availability of your applications and data. See [Zone redundant or zone spanning](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-redundant-or-zone-spanning).

### Deploy VMs across multiple fault domains

If you can't deploy your applications across availability zones, you can deploy multiple VMs across fault domains instead.

#### Use regional virtual machine scale sets flex

With regional virtual machine scale sets flex, VM resources are replicated across fault domains within the region they're deployed in to improve the resiliency and availability of applications and data. See [Regional](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#regional).

#### Use availability sets

If you can't use regional virtual machine scale sets flex, you can use [availability sets](availability-set-overview.md) to reduce the chance of correlated failures bringing down related VMs at the same time.