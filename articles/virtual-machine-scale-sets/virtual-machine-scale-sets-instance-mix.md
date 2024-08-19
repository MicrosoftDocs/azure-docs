---
title: Use multiple Virtual Machine sizes with Instance Mix
description: Use multiple Virtual Machine sizes in a scale set using Instance Mix. Optimize deployments using allocation strategies. 
author: brittanyrowe 
ms.author: brittanyrowe
ms.topic: conceptual
ms.service: azure-virtual-machine-scale-sets
ms.date: 06/26/2024
ms.reviewer: jushiman
---

# Use multiple Virtual Machine sizes with Instance Mix (Preview)
> [!IMPORTANT]
> Instance Mix for Virtual Machine Scale Sets with Flexible Orchestration Mode is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Instance Mix enables you to specify multiple different Virtual Machine (VM) sizes in your Virtual Machine Scale Set with Flexible Orchestration Mode, and an allocation strategy to further optimize your deployments. 

Instance Mix is best suited for workloads that are flexible in compute requirements and can be run on various different sized VMs. Using Instance Mix you can:
- Deploy a heterogeneous mix of VM sizes in a single scale set. You can view max scale set instance counts in the [documentation](./virtual-machine-scale-sets-orchestration-modes.md#what-has-changed-with-flexible-orchestration-mode).
- Optimize your deployments for cost or capacity through allocation strategies.
- Continue to make use of scale set features, like [Spot Priority Mix](./spot-priority-mix.md), [Autoscale](./virtual-machine-scale-sets-autoscale-overview.md), or [Upgrade Policies](./virtual-machine-scale-sets-set-upgrade-policy.md).
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
The `sku.tier` property is currently an optional scale set property and should be set to `null` for Instance Mix scenarios.

### sku.capacity
The `sku.capacity` property continues to represent the overall size of the scale set in terms of the total number of VMs.

### scaleInPolicy
The optional scale-in property isn't needed for scale set deployments using Instance Mix. During scaling in events, the scale set utilizes the allocation strategy to inform the decision on which VMs should be scaled in. For example, when you use `LowestPrice`, the scale set scales in by removing the more expensive VMs first.

## New scale set properties
### skuProfile
The `skuProfile` property represents the umbrella property for all properties related to Instance Mix, including VM sizes and allocation strategy.

### vmSizes
The `vmSizes` property is where you specify the specific VM sizes that you're using as part of your scale set deployment with Instance Mix.

### allocationStrategy
Instance Mix introduces the ability to set allocation strategies for your scale set. The `allocationStrategy` property is where you specify which allocation strategy you'd like to use for your Instance Flexible scale set deployments. There are two options for allocation strategies, `lowestPrice` and `capacityOptimized`. Allocation strategies apply to both Spot and Standard VMs.

#### lowestPrice (default)
This allocation strategy is focused on workloads where cost and cost-optimization are most important. When evaluating what VM split to use, Azure looks at the lowest priced VMs of the VM sizes specified. Azure also considers capacity as part of this allocation strategy. When using `lowestPrice` allocation strategy, the scale set deploys as many of the lowest priced VMs as it can, depending on available capacity, before moving on to the next lowest priced VM size specified.

#### capacityOptimized
This allocation strategy is focused on workloads where attaining capacity is the primary concern. When evaluating what VM size split to deploy in the scale set, Azure looks only at the underlying capacity available. It doesn't take price into account when determining what VMs to deploy. Using `capacityOptimized` can result in the scale set deploying the most expensive, but most readily available VMs. 

## Cost
Following the scale set cost model, usage of Instance Mix is free. You continue to only pay for the underlying resources, like the VM, disk, and networking.

## Limitations
- Instance Mix is currently available in the following regions: West US, West US2, East US, and East US2. 
- Instance Mix is only available for scale sets using Flexible Orchestration Mode.
- Instance Mix is currently only available through ARM template.
- You must have quota for the VM sizes you're requesting with Instance Mix.
- You can specify **up to** five VM sizes with Instance Mix at this time.
- Existing scale sets can't be updated to use Instance Mix. 
- VM sizes can't be changed once the scale set is deployed.
- For REST API deployments, you must have an existing virtual network inside of the resource group that you're deploying your scale set with Instance Mix in.

## Deploy a scale set using Instance Mix
The following example can be used to deploy a scale set using Instance Mix:

### [REST API](#tab/arm-1)
To deploy an Instance Flexible scale set through REST API, use a `PUT` call to and include the following sections in your request body:
```json
PUT https://management.azure.com/subscriptions/{YourSubscriptionId}/resourceGroups/{YourResourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{youScaleSetName}?api-version=2023-09-01
```

In the request body, ensure `sku.name` is set to Mix:
```json
  "sku": {
    "name": "Mix",
    "capacity": {TotalNumberVms}
  },
```
Ensure you reference your existing subnet:
```json
"subnet": {
    "id": "/subscriptions/{YourSubscriptionId}/resourceGroups/{YourResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{YourVnetName}/subnets/default"
},
```
Lastly, be sure to specify the `skuProfile` with **up to five** VM sizes. This sample uses three:
```json
    "skuProfile": {
      "vmSizes": [
        {
          "name": "Standard_D8s_v5"
        },
        {
          "name": "Standard_E16s_v5"
        },
        {
          "name": "Standard_D2s_v5"
        }
      ],
      "allocationStrategy": "lowestPrice"
    },
```

---

## Troubleshooting
| Error Code                                 | Error Message                                                                                               | Troubleshooting options                                                                                                                                                                                                                                                                                                       |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SkuProfileAllocationStrategyInvalid        | Sku Profile’s Allocation Strategy is invalid.                                                               | Ensure that you're using either `CapacityOptimized` or `LowestPrice` as the `allocationStrategy`                                                                                                                                                                                                                             |
| SkuProfileVMSizesCannotBeNullOrEmpty       | Sku Profile VM Sizes cannot be null or empty. Please provide a valid list of VM Sizes and retry.            | Provide at least one VM size in the `skuProfile`.                                                                                                                                                                                                                                                                      |
| SkuProfileHasTooManyVMSizesInRequest       | Too many VM Sizes were specified in the request. Please provide no more than 5 VM Sizes.                    | At this time, you can specify up to five VM sizes with Instance Mix.                                                                                                                                                                                                                                                     |
| SkuProfileVMSizesCannotHaveDuplicates      | Sku Profile contains duplicate VM Size: {duplicateVmSize}. Please remove any duplicates and retry.                       | Check the VM SKUs listed in the `skuProfile` and remove the duplicate VM size.                                                                                                                                                                                                                                             |
| SkuProfileUpdateNotAllowed                 | Virtual Machine Scale Sets with Sku Profile property cannot be updated.                                     | At this time, you can't update the `skuProfile` of a scale set using Instance Mix.                                                                                                                                                                                                                                   |
| SkuProfileScenarioNotSupported             | {propertyName} is not supported on Virtual Machine Scale Sets with Sku Profile                                       | Instance Mix doesn’t support certain scenarios today, like Azure Dedicated Host (`properties.hostGroup`), Capacity Reservations (`properties.virtualMachineProfile.capacityReservation`), and StandbyPools (`properties.standbyPoolProfile`). Adjust the template to ensure you’re not using unsupported properties. |
| SkuNameMustBeMixIfSkuProfileIsSpecified    | Sku name is {skuNameValue}. Virtual Machine Scale Sets with Sku Profile must have the Sku name property set to "Mix" | Ensure that the `sku.name property` is set to `"Mix"`.                                                                                                                                                                                                                                                                        |
| SkuTierMustNotBeSetIfSkuProfileIsSpecified | Sku tier is {skuTierValue}. Virtual Machine Scale Sets with Sku Profile must not have the Sku tier property set.     | `sku.tier` is an optional property for scale sets. With Instance Mix, `sku.tier` must be set to `null` or not specified.                                                                                                                                                                                                           |
| InvalidParameter                           | The value of parameter skuProfile is invalid.                                                               | Your subscription isn't registered for the Instance Mix feature. Follow the enrollment instructions to register for the Preview.                                                                                                                                                                                      |
| FleetRPInternalError                       | An unexpected error occurred while computing the desired sku split.                                         | Instance Mix isn't supported in this region yet. Deploy only in supported regions.                                                                                                                                                                                                                                    |

## FAQs
### Can I use Spot and Standard VMs with Instance Mix?
Yes, you can use both Spot and Standard VMs in your scale set deployments using Instance Mix. To do so, use [Spot Priority Mix](./spot-priority-mix.md) to define a percentage split of Spot and Standard VMs. 

### My region doesn't support Instance Mix today. Will it support Instance Mix in the future?
Instance Mix is rolling out to all Azure regions during Public Preview. Instance Mix is currently available in the following regions: West US, West US2, East US, and East US2.