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
- You can [use Azure Autoscale](./virtual-machine-scale-sets-autoscale-overview.md) to automatically add or remove instances based on a predefined schedule, metrics, or predictive AI.
- You can specify an [upgrade policy](./virtual-machine-scale-sets-upgrade-scale-set.md) to make it easy to roll out upgrades across VMs in your scale set. With individual VMs, you must orchestrate updates yourself.

### VM-specific features

Some features are currently only available in VMs:

- You can capture an image from a VM in a flexible scale set, but not from a VM in a uniform scale set.
- You can migrate an individual VM from classic disks to managed disks, but you cannot migrate VM instances in a uniform scale set.

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
