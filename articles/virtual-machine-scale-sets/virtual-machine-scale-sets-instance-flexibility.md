---
title: Use Multiple VM Sizes with Instance Flexibility
description: Use multiple VM sizes in a scale set using VMSS Instance Flexibility. Optimize deployments using allocation strategies. 
author: brittanyrowe 
ms.author: brittanyrowe
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 06/17/2024
ms.reviewer: jushiman
---

# Use Multiple VM Sizes with Instance Flexibility (Preview)
> [!IMPORTANT]
> Instance Flexibility for Virtual Machine Scale Sets with Flexible Orchestration Mode is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Instance Flexibility enables you to specify multiple different VM sizes in your Virtual Machine Scale Set with Flexible Orchestration Mode, as well as an allocation strategy to further optimize your deployments. 

Instance Flexibility is best suited for workloads that are flexible in compute requirements and can be run on various different sized VMs. Using Instance Flexibility you can:
- Deploy a heterogeneous mix of VM sizes in a single scale set, up to the instance size limit. You can view max scale set instance counts in the [documentation](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#what-has-changed-with-flexible-orchestration-mode).
- Optimize your deployments for cost or capacity through allocation strategies.
- Continue to make use of scale set features, like [Spot Priority Mix](/articles/virtual-machine-scale-sets/spot-priority-mix.md), [Autoscale](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md), or [Upgrade Policies](/articles/virtual-machine-scale-sets/virtual-machine-scale-sets-set-upgrade-policy.md).
- Spread a heterogeneous mix of VMs across Availability Zones and Fault Domains for high availability and reliability.

## Enroll in the Preview
Register for the `FlexVMScaleSetSkuProfileEnabled` feature flag using the [az feature register](/cli/azure/feature#az-feature-register) command:

```azurecli-interactive
az feature register --namespace "Microsoft.Compute" --name "FlexVMScaleSetSkuProfileEnabled"
```

It takes a few moments for the feature to register. Verify the registration status by using the [az feature show](/cli/azure/feature#az-feature-register) command:

```azurecli-interactive
az feature show --namespace "Microsoft.Compute" --name "FlexVMScaleSetSkuProfileEnabled"
```

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
- Instance Flexibility is only available for scale sets using Flexible Orchestration Mode.
- Instance Flexibility is currently only available through ARM template and in the Azure portal.
- You must have quota for the VM sizes you're requesting with Instance Flexibility.
- You can specify **up to** five VM sizes with Instance Flexibility at this time.
- Existing scale sets cannot be updated to use Instance Flexibility. 
- VM sizes cannot be changed once the scale set is deployed.
- For REST API deployments, you must have an existing virtual network inside of the resource group that you'll be deploying your scale set with Instance Flexibility in.

## Deploy a scale set using Instance Flexibility
The following example can be used to deploy a scale set using Instance Flexibility:


### [Azure portal](#tab/portal-2)
1. Go to **Virtual machine scale sets**.
2. Select the **Create** button to go to the **Create a virtual machine scale set** view.
3. In the **Basics** tab, fill out the required fields. If the field isn't called out below, you can set fields to what works best for your scale set.
4. Ensure that you select a region that Instance Flexibility is supported in.
5. Be sure **Orchestration mode** is set to **Flexible**.
6. In the **Size** section, click **Select up to 5 sizes (preview)** and the **Select a VM size** page will appear.
7. Use the size picker to select up to 5 VM sizes. Once you have selected your VM sizes, click the **Select** button at the bottom of the page to return to the scale set Basics tab.
8. In the **Allocation strategy (preview)** field, select your allocation strategy.
9. You can specify other properties in subsequent tabs, or you can go to **Review + create** and select the **Create** button at the bottom of the page to start your Instance Flexible scale set deployment.

## Troubleshooting

## FAQs
### Can I use Spot and Standard VMs with Instance Flexibility?
Yes, you can use both Spot and Standard VMs in your scale set deployments using Instance Flexibility. To do so, use [Spot Priority Mix](/articles/virtual-machine-scale-sets/spot-priority-mix.md) to define a percentage split of Spot and Standard VMs. 

## My region doesn't support Instance Flexibility today, will it support Instance Flexibility in the future?
Instance Flexibility will be rolling out to all public Azure regions during Public Preview. The documentation will be updated as more regions are supported. Instance Flexibility is currently available in West US, West US2, West US3, East US, East US2, CentralUS, South Central US, North Central US, West Europe, North Europle, UK South, and France Central.