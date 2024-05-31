---
title: Standby pools for Virtual Machine Scale Sets
description: Learn how to utilize standby pools to reduce scale-out latency with Virtual Machine Scale Sets.
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

Standby pools for Virtual Machine Scale Sets enables you to increase scaling performance by creating a pool of pre-provisioned virtual machines from which the scale set can pull from when scaling out. 

Standby pools reduce the time to scale out by performing various initialization steps such as installing applications/ software or loading large amounts of data. These initialization steps are performed on the virtual machines in the standby pool before to being moved into the scale set.


## Scaling

When your scale set requires more instances, rather than creating new instances from scratch, the scale set instead uses virtual machines from the standby pool. This saves significant time as the virtual machines in the standby pool have already completed all post-provisioning steps. 

When scaling back down, the instances are deleted from your scale set based on the [scale-in policy](virtual-machine-scale-sets-scale-in-policy.md) and the standby pool refills to meet the max ready capacity configured. If at any point in time your scale set needs to scale beyond the number of instances you have in your standby pool, the scale set defaults to standard scale-out methods and creates new instances.

Standby pools only give out virtual machines from the pool that match the desired power state configured. For example, if your desired power state is set as deallocated, the standby pool will only give the scale set instances matching that current power state. If virtual machines are in a creating, failed or any other state than the expected state, the scale set defaults to new virtual machine creation instead.


## Virtual machine states

The virtual machines in the standby pool can be kept in a running or deallocated state. 

**Deallocated:** Deallocated virtual machines are shut down and keep any associated disks, network interfaces, and any static IPs. [Ephemeral OS disks](../virtual-machines/ephemeral-os-disks.md) don't support the deallocated state. 

:::image type="content" source="media/standby-pools/deallocated-vm-pool.png" alt-text="A screenshot showing the workflow when using deallocated virtual machine pools.":::

**Running:** Using virtual machines in a running state is recommended when latency and reliability requirements are strict. Virtual machines in a running state remain fully provisioned. 

:::image type="content" source="media/standby-pools/running-vm-pool.png" alt-text="A screenshot showing the workflow when using running virtual machine pools.":::

## Standby pool size
The number of virtual machines in a standby pool is calculated by the max ready capacity of the pool minus the virtual machines currently deployed in the scale set. 

| Setting | Description | 
|---|---|
| maxReadyCapacity | The maximum number of virtual machines to be created in the pool.|
| instanceCount | The current number of virtual machines already deployed in the scale set.|
| Standby pool size | Standby pool size = `maxReadyCapacity`– `instanceCount`. |

### Example
A Virtual Machine Scale Set with 10 instances and a standby pool with a max ready capacity of 15 would result in 5 instances in the standby pool.

- Max ready capacity (15) - Virtual Machine Scale Set instance count (10) = Standby pool size (5)

If the scale set reduces the instance count to 5, the standby pool would fill to 10 instances. 

- Max ready capacity (15) - Virtual Machine Scale Set instance count (5) = Standby pool size (10)


## Availability zones
When using standby pools with a Virtual Machine Scale Set spanning [availability zones](virtual-machine-scale-sets-use-availability-zones.md), the instances in the pool will be spread across the same zones the Virtual Machine Scale Set is using. 

When a scale out is triggered in one of the zones, a virtual machine in the pool in that same zone will be used. If a virtual machine is needed in a zone where you no longer have any pooled virtual machines left, the scale set creates a new virtual machine directly in the scale set. 

## Pricing

Users are charged based on the resources deployed in the standby pool. For example, virtual machines in a running state incur compute, networking, and storage costs. Virtual machines in a deallocated state doesn't incur any compute costs, but any persistent disks or networking configurations continue incur cost. Thus, a pool of running virtual machines will incur more cost than a pool of deallocated virtual machines. For more information on virtual machine billing, see [states and billing status of Azure Virtual Machines](../virtual-machines/states-billing.md).

## Unsupported configurations
- Creating or attaching a standby pool to a Virtual Machine Scale Set using Azure Spot instances.
- Creating or attaching a standby pool to a Virtual Machine Scale Set with Azure autoscale enabled. 
- Creating or attaching a standby pool to a Virtual Machine Scale Set with a fault domain greater than 1. 
- Creating or attaching a standby pool to a Virtual Machine Scale Set in a different region. 
- Creating or attaching a standby pool to a Virtual Machine Scale Set in a different subscription.  
- Creating or attaching a standby pool to a Virtual Machine Scale Set that already has a standby pool.
- Creating or attaching a standby pool to a Virtual Machine Scale Set using Uniform Orchestration. 

## Next steps

Learn how to [create a standby pool](standby-pools-create.md).
