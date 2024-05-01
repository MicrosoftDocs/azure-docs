---
title: Standby pools for Virtual Machine Scale Sets
description: Learn how to utilize standby pools to reduce scale-out latency with Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 04/22/2024
ms.reviewer: ju-shim
---

# Standby pools for Virtual Machine Scale Sets (Preview)

> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Standby pools for Virtual Machine Scale Sets enables you to increase scaling performance by creating a pool of pre-provisioned virtual machines from which the scale set can draw from when scaling out. 

Standby pools reduce the time to scale out by performing various initialization steps such as installing applications/ software or loading large amounts of data. These initialization steps are performed on the virtual machines in the standby pool before to being put into the scale set and before the instances begin taking traffic.

## Standby pool size
The number of virtual machines in a standby pool are determined by the number of virtual machines in your scale set and the total max ready capacity configured.

For example, a Virtual Machine Scale Set with 10 instances and a standby pool with a max ready capacity of 15 would result in their being 5 instances in the standby pool.

- Max ready capacity (15) - Virtual Machine Scale Set instance count (10) = Standby pool size (5)

If the scale set reduces the instance count to 5, the standby pool would fill to 10 instances. 

- Max ready capacity (15) - Virtual Machine Scale Set instance count (5) = Standby pool size (10)

| Setting | Description | 
|---|---|
| maxReadyCapacity | The maximum number of virtual machines you want to have ready.|
| instanceCount | The current number of virtual machines already deployed in your scale set.|
| Standby pool Size | Standby pool size = `maxReadyCapacity`– `instanceCount` |

## Scaling

When your scale set requires more instances, rather than creating new instances from scratch, the scale set can instead pull virtual machines from the standby pool. This saves significant time as the virtual machines in the standby pool have already completed all post-provisioning steps. 

When your scale set scales back down, the instances are deleted from your scale set based on the [scale-in policy](virtual-machine-scale-sets-scale-in-policy.md) and your standby pool will refill to meet the max ready capacity configured.  

If at any point in time your scale set needs to scale beyond the number of instances you have in your standby pool, the scale set defaults to standard scale-out methods and creates new instances directly in the Scale Set

## Virtual machine states

The virtual machines in the standby pool can be kept in a running state or a deallocated state. 

**Deallocated:** Deallocated virtual machines are shut down and keep any associated disks, NICs, and any static IPs remain unchanged. [Ephemeral OS disks](../virtual-machines/ephemeral-os-disks.md) do not support the deallocated state. 

:::image type="content" source="media/standby-pools/deallocated-vm-pool.png" alt-text="A screenshot showing the workflow when using deallocated VM pools.":::

**Running:** Using virtual machines in a running state is recommended when latency and reliability requirements are strict. 

:::image type="content" source="media/standby-pools/running-vm-pool.png" alt-text="A screenshot showing the workflow when using running VM pools.":::

## Pricing

There's no direct cost associated with using standby pools. Users are charged based on the resources deployed. For example, keeping virtual machines in a running state incurs compute, networking, and storage costs. While keeping virtual machines in a deallocated state does not incur any compute costs, but any persistent disks or networking configurations do incur cost. For more information on Virtual Machine billing, see [states and billing status of Azure Virtual Machines](../virtual-machines/states-billing.md).

| State | Description |
|---|---|
|**Deallocated virtual machine state:** | Using a standby pool with virtual machines in the deallocated state is a great way to reduce the cost while keeping your scale-out times fast. Virtual machines in the deallocated state don't incur any compute costs, only the associated persistent resources incur costs. |
| **Running virtual machine state:** | Running virtual machines incur a higher cost due to compute resources being consumed. |

## Considerations
- The total capacity of the standby pool and the Virtual Machine Scale Set together can't exceed 1000 instances. 
- Creation of pooled resources is subject to the resource availability in each region.
- Instances in the standby pool are automatically placed into the same resource group that the associated scale set is part of. 

## Unsupported configurations
- Attaching a standby pool to a Virtual Machine Scale Set using Azure Spot instances.
- Attaching a standby pool to a Virtual Machine Scale Set with Azure autoscale enabled. 
- Attaching a standby pool to a Virtual Machine Scale Set with a fault domain greater than 1. 
- Creating a standby pool in a different region than the Virtual Machine Scale Set. 
- Creating a standby pool in a different subscription than the Virtual Machine Scale Set. 
- Creating a standby pool without specifying a Virtual Machine Scale Set. 
- Creating a standby pool with a Virtual Machine Scale Set that already has a standby pool attached. 

## Next steps

Learn how to [create a standby pool](standby-pools-create.md).
