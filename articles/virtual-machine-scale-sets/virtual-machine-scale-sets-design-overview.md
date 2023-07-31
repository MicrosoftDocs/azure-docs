---
title: Design Considerations for Azure Virtual Machine Scale Sets
description: Learn about the design considerations for your Azure Virtual Machine Scale Sets. Compare scale sets features with VM features.
keywords: linux virtual machine,Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt
---

# Design Considerations For Scale Sets

This article discusses design considerations for Virtual Machine Scale Sets. For information about what Virtual Machine Scale Sets are, refer to [Virtual Machine Scale Sets Overview](./overview.md).

## When to use scale sets instead of virtual machines?
Generally, scale sets are useful for any multi-VM deployment, as it allows you to define whether instances are spread across availability zones or fault domains, whether platform updates should be coordinated to reduce or eliminate full application downtime, and provides orchestrations and batch instance management. However, some features are only available in scale sets while other features are only available in VMs. In order to make an informed decision about when to use each technology, you should first take a look at some of the commonly used features that are available in scale sets but not VMs:

### Scale set-specific features

- Once you specify the scale set configuration, you can update the *capacity* property to deploy more VMs in parallel. This process is better than writing a script to orchestrate deploying many individual VMs in parallel.
- You can [use Azure Autoscale to automatically ](./virtual-machine-scale-sets-autoscale-overview.md)add or remove instances based on a predefined schedule, metrics, or predictive AI.
- You can specify an [upgrade policy](./virtual-machine-scale-sets-upgrade-scale-set.md) to make it easy to roll out upgrades across VMs in your scale set. With individual VMs, you must orchestrate updates yourself.

### VM-specific features

Some features are currently only available in VMs:

- You can capture an image from a VM in a flexible scale set, but not from a VM in a uniform scale set.
- You can migrate an individual VM from classic disks to managed disks, but you cannot migrate VM instances in a uniform scale set.

## Design considerations for high availability

Virtual machine scale sets supports 3 zonal deployment models:

- Zone redundant or zone spanning (recommended)

- Zonal or zone aligned (single zone)

- Regional

### Zone redundant or zone spanning 

A zone redundant or zone spanning scale set will spread instances across all selected zones `"zones": ["1","2","3"]`. By default the scale set will perform a best effort approach to evenly spread instances across selected zones, however you can specify that you want strict zone balance by specifying `"zoneBalance": "true"` in your deployment. Each VM and its disks are zonal, so they will be pinned to a specific zone. Instances between zones are connected by high-performance network with low latency. In the event of a zonal outage or connectivity issue, connectivity to instances within the affected zone may be compromised, while instances in other availability zones should be unaffected. You may add capacity to the scale set during a zonal outage, and the scale set will add additonal instances to the unaffected zones. When the zone is restored, you many need to scale down your scale set to the original capacity (or set up autoscale rules to do this automatically based on metrics). 

Spreading instances across availability zones meets the 99.99% SLA for instances spread across availability zones, and is recommended for most workloads in Azure.

### Zonal or zone aligned (single zone)

A zonal or zone aligned scale set will place instances in a single availability zone `"zones": ['1']`. Each VM and its disks are zonal, so they will be pinned to a specific zone. This configuration is primarily used when you need lower latency between instances.

### Regional

A regional VMSS is when the zone assignment is not explicitly set (zones=[] or zones=null). In this configuration, the scale set will create Regional (not-zone pinned) instances and will implicitly place instances throughout the region. There is no guarantee for balance or spread across zones, or that instances will land in the same availability zone. Disk colocation is guaranteed for Ultra and Premium v2 disks, best effort for Premium V1 disks, and not guaranteed for Standard sku (SSD or HDD) disks. 

In the rare case of a full zonal outage, any or all instances within the scale set may be impacted.

## Overprovisioning

> [!IMPORTANT]
> Overprovisioning is supported for Uniform Orchestration mode only; it is not supported for Flexible Orchestration mode.
With overprovisioning turned on, the scale set actually spins up more VMs than you asked for, then deletes the extra VMs once the requested number of VMs are successfully provisioned. Overprovisioning improves provisioning success rates and reduces deployment time. You are not billed for the extra VMs, and they do not count toward your quota limits.

While overprovisioning does improve provisioning success rates, it can cause confusing behavior for an application that is not designed to handle extra VMs appearing and then disappearing. To turn overprovisioning off, ensure you have the following string in your template: `"overprovision": "false"`. More details can be found in the [Scale Set REST API documentation](/rest/api/virtualmachinescalesets/create-or-update-a-set).

If your scale set uses user-managed storage, and you turn off overprovisioning, you can have more than 20 VMs per storage account, but it is not recommended to go above 40 for IO performance reasons. 

## Limits
A scale set built on a Marketplace image (also known as a platform image) or a user-defined custom image in an Azure Compute Gallery and configured to use Azure Managed Disks supports a capacity of up to 1,000 VMs. If you configure your scale set to support more than 100 VMs, not all scenarios work the same (for example load balancing). For more information, see [Working with large Virtual Machine Scale Sets](virtual-machine-scale-sets-placement-groups.md). 

A scale set configured with user-managed storage accounts is currently limited to 100 VMs (and 5 storage accounts are recommended for this scale).

A scale set built on the legacy managed image can have a capacity of up to 600 VMs when configured with Azure Managed disks. If the scale set is configured with user-managed storage accounts, it must create all OS disk VHDs within one storage account. As a result, the maximum recommended number of VMs in a scale set built on a custom image and user-managed storage is 20. If you turn off overprovisioning, you can go up to 40.


