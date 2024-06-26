---
title: Use Multiple VM Sizes with Flex Mix
description: Use multiple VM sizes in a scale set using VMSS Flex Mix. Optimize deployments using allocation strategies. 
author: brittanyrowe 
ms.author: brittanyrowe
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 06/17/2024
ms.reviewer: jushiman
---

# Use Multiple VM Sizes with Instance Flexibility
> [!IMPORTANT]
> Instance Flexibility for Virtual Machine Scale Sets with Flexible Orchestration Mode is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Instance Flexibility enables you to specify multiple different VM sizes in your Virtual Machine Scale Set with Flexible Orchestration Mode, as well as an allocation strategy to further optimize your deployments. 

Instance Flexibility is best suited for workloads that are flexible in compute requirements and can be run on various different sized VMs. Using Instance Flexibility you can:
- Deploy a heterogeneous mix of VM sizes in a single scale set, up to the instance size limit. You can view max scale set instance counts in the [documentation](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#what-has-changed-with-flexible-orchestration-mode).
- Optimize your deployments for cost or capacity through allocation strategies.
- Continue to make use of scale set features, like [Spot Priority Mix](/articles/virtual-machine-scale-sets/spot-priority-mix.md), [Autoscale](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md), or [Upgrade Policies](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-set-upgrade-policy.md).
- Spread a heterogeneous mix of VMs across Availability Zones and Fault Domains for high availability and reliability.

## Changes to existing scale set properties
### sku.tier
The `sku.tier` property is currently an optional scale set property and will be `null` for Instance Flexibility scenarios.

### sku.capacity
The `sku.capacity` property will continue to represent the overall size of the scale set in terms of the total number of VMs.

### scaleInPolicy
The optaional scale-in property is not needed for VMSS deployments using Instance Flexibility. When scaling in, the scale set will utilize the allocation strategy to inform the decision on which VMs should be scaled in. For example, when using `LowestPrice`, the scale set will scale in by removing the more expensive VMs first.

## New scale set properties
### skuProfile
The `skuProfile` property represents the umbrella property for all properties related to Instance Flexibility, including VM sizes and allocation strategy.

### vmSizes
The `vmSizes` property is where you'll specify the specific VM sizes that you'll be using as part of your scale set deployment with Instance Flexibility.

### allocationStrategy
Instance Flexibility introduces the ability to set allocation strategies for your scale set. The `allocationStrategy` property is where you specify which allocation strategy you'd like to use for your Instance Flexibile scale set deployment. There are two options for allocation strategies, `lowestPrice` and `capacityOptimized`. Allocation strategies apply to both Spot and Standard VMs.

#### lowestPrice (default)
This allocation strategy is focused on workloads where cost and cost-optimization is most important. When evaluting what VM split to use, Azure will look at the lowest priced VMs of those specified. Azure will also consider capacity as part of this allocation strategy. When using this allocation strategy, the scale set will deploy as many of the lowest priced VMs as it can, depending on available capacity, before moving on to the next lowest priced VM size specified.

#### capacityOptimized
This allocation strategy is focused on workloads where attaining capacity is the primary concern. When evaluating what VM size split to deploy in the scale set, Azure will look only at the underlying capacity available. It will not take price into account when determining what VMs to deploy. This can result in the scale set deploying the most expensive, but most readily available VMs. 

## Cost
Following the scale set cost model, usage of Instance Flexibility is free. You'll continue to only pay for the underlying resources, like the VM, disk, and networking.

## Limitations
- Instance Flexibility is currently available in West US, West US2, West US3, East US, East US2, CentralUS, South Central US, North Central US, West Europe, North Europle, UK South, and France Central. More regions will be added during Public Preview.
-  Instance Flexibility is currently only available through ARM template and in the Azure portal.
- You must have quota for the VM sizes you're requesting with Instance Flexibility.
- You can specify **up to** five VM sizes with Instance Flexibility at this time.
- Existing scale sets cannot be updated to use Instance Flexibility. 
- VM sizes cannot be changed once the scale set is deployed.

## FAQs
### Can I use Spot and Standard VMs with Instance Flexibility?

## My region doesn't support Instance Flexibility today, will it support Instance Flexibility in the future?