---
title: Standby pools for Virtual Machine Scale Sets
description: Learn how to utilize standby pools to reduce scale-out latency with Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 04/03/2024
ms.reviewer: ju-shim
---

# Standby pools for Virtual Machine Scale Sets

> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Standby pools for Virtual Machine Scale Sets allow you to increase scaling performance by creating a pool of pre-provisioned virtual machines from which the scale set can draw from when scaling out. 

Standby pools reduce the time to scale out by performing various initialization steps such as installing applications/ software or loading large amounts of data. These initialization steps are performed on the virtual machines in the standby pool before to being put into the scale set and before the instances begin taking traffic.

## Standby pool Size
The number of virtual machines in a standby pool are determined by the number of virtual machines in your scale set and the total max ready capacity configured. 

| Setting | Description | 
|---|---|
| `MaxReadyCapacity` | The maximum number of virtual machines you want to have ready.|
| `instanceCount` | The current number of virtual machines already deployed in your scale set.|
| Standby pool Size | `MaxReadyCapacity`– `InstanceCount` 

## Scaling

When your scale set requires more instances, rather than creating new instances and placing them directly into the scale set, the scale set can instead pull virtual machines from the standby pool. Standby pools reduce the time it takes to scale out and have the instances ready to take traffic. 

When your scale set scales back down, the instances are deleted from your scale set based on the [scale-in policy](virtual-machine-scale-sets-scale-in-policy.md) you have configured and your standby pool will refill to meet the `MaxReadyCapacity` configured.  

If at any point in time your scale set needs to scale beyond the number of instances you have in your standby pool, the scale set defaults to standard scale-out methods and creates new instances directly in the Scale Set

## Virtual Machine States

The virtual machines in the standby pool can be created in a Running State or a Stopped (deallocated) state. The states of the virtual machines in the standby pool are configured using the `virtualMachineState` parameter.

```
"virtualMachineState":"Running"

"virtualMachineState":"Deallocated"
```

**Stopped (Deallocated) virtual machine State:** Deallocated virtual machines are shut down and keep any associated data disks, NICs, and any static IPs remain unchanged. 

**Running virtual machine State:** Using virtual machines in a Running state is recommended when latency and reliability 
requirements are strict.

## Pricing

>[!IMPORTANT]
>The `VirtualMachineState` you choose will impact the cost of your standby pool. You can update the desired state at any point in time. 

There's no direct cost associated with using standby pools. Users are charged based on the resources deployed into the standby pool. For more information on Virtual Machine billing, see [virtual machine power states and billing documentation](../virtual-machines/states-billing.md)

| State | Description |
|---|---|
|**Stopped (deallocated) virtual machine State:** | Using a standby pool with virtual machines in the Stopped (deallocated) state is a great way to reduce the cost while keeping your scale-out times fast. virtual machines in the Stopped (deallocated) state don't incur any compute costs, only the associated resources incur costs. |
| **Running virtual machine State:** | Running virtual machines incur a higher cost due to compute resources being consumed. |

## Considerations
- The total capacity of the standby pool and the Virtual Machine Scale Set together can't exceed 1000 instances. 
- Creation of pooled resources is subject to the resource availability in each region.

## Unsupported configurations
- Attaching a standby pool to a Virtual Machine Scale Set using Azure Spot instances.
- Attaching a standby pool to a Virtual Machine Scale Set with Azure autoscale enabled. 
- Attaching a standby pool to a Virtual Machine Scale Set with a fault domain greater than 1. 

## Next steps

Learn how to [create a standby pool](standby-pools-create.md)
