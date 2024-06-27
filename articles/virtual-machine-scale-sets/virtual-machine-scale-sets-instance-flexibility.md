---
title: Use Multiple Virtual Machine Sizes with Instance Flexibility
description: Use multiple Virtual Machine sizes in a scale set using Instance Flexibility. Optimize deployments using allocation strategies. 
author: brittanyrowe 
ms.author: brittanyrowe
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 06/17/2024
ms.reviewer: jushiman
---

# Use Multiple Virtual Machine Sizes with Instance Flexibility (Preview)
> [!IMPORTANT]
> Instance Flexibility for Virtual Machine Scale Sets with Flexible Orchestration Mode is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Instance Flexibility enables you to specify multiple different Virtual Machine (VM) sizes in your Virtual Machine Scale Set with Flexible Orchestration Mode, and an allocation strategy to further optimize your deployments. 

Instance Flexibility is best suited for workloads that are flexible in compute requirements and can be run on various different sized VMs. Using Instance Flexibility you can:
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
The `sku.tier` property is currently an optional scale set property and will be `null` for Instance Flexibility scenarios.

### sku.capacity
The `sku.capacity` property continues to represent the overall size of the scale set in terms of the total number of VMs.

### scaleInPolicy
The optional scale-in property isn't needed for scale set deployments using Instance Flexibility. During scaling in events, the scale set utilizes the allocation strategy to inform the decision on which VMs should be scaled in. For example, when you use `LowestPrice`, the scale set scales in by removing the more expensive VMs first.

## New scale set properties
### skuProfile
The `skuProfile` property represents the umbrella property for all properties related to Instance Flexibility, including VM sizes and allocation strategy.

### vmSizes
The `vmSizes` property is where you specify the specific VM sizes that you're using as part of your scale set deployment with Instance Flexibility.

### allocationStrategy
Instance Flexibility introduces the ability to set allocation strategies for your scale set. The `allocationStrategy` property is where you specify which allocation strategy you'd like to use for your Instance Flexible scale set deployments. There are two options for allocation strategies, `lowestPrice` and `capacityOptimized`. Allocation strategies apply to both Spot and Standard VMs.

#### lowestPrice (default)
This allocation strategy is focused on workloads where cost and cost-optimization are most important. When evaluating what VM split to use, Azure looks at the lowest priced VMs of the VM sizes specified. Azure also considers capacity as part of this allocation strategy. When using the `lowestPrice` allocation strategy, the scale set deploys as many of the lowest priced VMs as it can, depending on available capacity, before moving on to the next lowest priced VM size specified.

#### capacityOptimized
This allocation strategy is focused on workloads where attaining capacity is the primary concern. When evaluating what VM size split to deploy in the scale set, Azure looks only at the underlying capacity available. It doesn't take price into account when determining what VMs to deploy. Using `capacityOptimized` can result in the scale set deploying the most expensive, but most readily available VMs. 

## Cost
Following the scale set cost model, usage of Instance Flexibility is free. You continue to only pay for the underlying resources, like the VM, disk, and networking.

## Limitations
- Instance Flexibility is currently available in the following regions: West US, West US2, West US3, East US, East US2, CentralUS, South Central US, North Central US, West Europe, North Europe, UK South, and France Central. 
- Instance Flexibility is only available for scale sets using Flexible Orchestration Mode.
- Instance Flexibility is currently only available through ARM template and in the Azure portal.
- You must have quota for the VM sizes you're requesting with Instance Flexibility.
- You can specify **up to** five VM sizes with Instance Flexibility at this time.
- Existing scale sets can't be updated to use Instance Flexibility. 
- VM sizes can't be changed once the scale set is deployed.
- For REST API deployments, you must have an existing virtual network inside of the resource group that you're deploying your scale set with Instance Flexibility in.

## Deploy a scale set using Instance Flexibility
The following example can be used to deploy a scale set using Instance Flexibility:

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

### [Azure portal](#tab/portal-1)
1. Go to **Virtual machine scale sets**.
2. Select the **Create** button to go to the **Create a virtual machine scale set** view.
3. In the **Basics** tab, fill out the required fields. If the field isn't called out in the next sections, you can set the fields to what works best for your scale set.
4. Ensure that you select a region that Instance Flexibility is supported in.
5. Be sure **Orchestration mode** is set to **Flexible**.
6. In the **Size** section, click **Select up to 5 sizes (preview)** and the **Select a VM size** page appears.
7. Use the size picker to select up to five VM sizes. Once you've selected your VM sizes, click the **Select** button at the bottom of the page to return to the scale set Basics tab.
8. In the **Allocation strategy (preview)** field, select your allocation strategy.
9. You can specify other properties in subsequent tabs, or you can go to **Review + create** and select the **Create** button at the bottom of the page to start your Instance Flexible scale set deployment.

## Troubleshooting
| Error Code                                 | Error Message                                                                                               | Troubleshooting options                                                                                                                                                                                                                                                                                                       |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SkuProfileAllocationStrategyInvalid        | Sku Profile’s Allocation Strategy is invalid.                                                               | Ensure that you're using either `CapacityOptimized` or `LowestPrice` as the `allocationStrategy`                                                                                                                                                                                                                             |
| SkuProfileVMSizesCannotBeNullOrEmpty       | Sku Profile VM Sizes cannot be null or empty. Please provide a valid list of VM Sizes and retry.            | Provide at least one VM size in the `skuProfile`.                                                                                                                                                                                                                                                                      |
| SkuProfileHasTooManyVMSizesInRequest       | Too many VM Sizes were specified in the request. Please provide no more than 5 VM Sizes.                    | At this time, you can specify up to five VM sizes with Instance Flexibility.                                                                                                                                                                                                                                                     |
| SkuProfileVMSizesCannotHaveDuplicates      | Sku Profile contains duplicate VM Size: {duplicateVmSize}. Please remove any duplicates and retry.                       | Check the VM SKUs listed in the `skuProfile` and remove the duplicate VM size.                                                                                                                                                                                                                                             |
| SkuProfileUpdateNotAllowed                 | Virtual Machine Scale Sets with Sku Profile property cannot be updated.                                     | At this time, you can't update the `skuProfile` of a scale set using Instance Flexibility.                                                                                                                                                                                                                                   |
| SkuProfileScenarioNotSupported             | {propertyName} is not supported on Virtual Machine Scale Sets with Sku Profile                                       | Instance Flexibility doesn’t support certain scenarios today, like Azure Dedicated Host (`properties.hostGroup`), Capacity Reservations (`properties.virtualMachineProfile.capacityReservation`), and StandbyPools (`properties.standbyPoolProfile`). Adjust the template to ensure you’re not using unsupported properties. |
| SkuNameMustBeMixIfSkuProfileIsSpecified    | Sku name is {skuNameValue}. Virtual Machine Scale Sets with Sku Profile must have the Sku name property set to "Mix" | Ensure that the `sku.name property` is set to `"Mix"`.                                                                                                                                                                                                                                                                        |
| SkuTierMustNotBeSetIfSkuProfileIsSpecified | Sku tier is {skuTierValue}. Virtual Machine Scale Sets with Sku Profile must not have the Sku tier property set.     | `sku.tier` is an optional property for scale sets. With Instance Flexibility, `sku.tier` must be set to `null` or not specified.                                                                                                                                                                                                           |
| InvalidParameter                           | The value of parameter skuProfile is invalid.                                                               | Your subscription isn't registered for the Instance Flexibility feature. Follow the enrollment instructions to register for the Preview.                                                                                                                                                                                      |
| FleetRPInternalError                       | An unexpected error occurred while computing the desired sku split.                                         | Instance Flexibility isn't supported in this region yet. Deploy only in supported regions.                                                                                                                                                                                                                                    |

## FAQs
### Can I use Spot and Standard VMs with Instance Flexibility?
Yes, you can use both Spot and Standard VMs in your scale set deployments using Instance Flexibility. To do so, use [Spot Priority Mix](./spot-priority-mix.md) to define a percentage split of Spot and Standard VMs. 

## My region doesn't support Instance Flexibility today, will it support Instance Flexibility in the future?
Instance Flexibility is rolling out to all Azure regions during Public Preview. Instance Flexibility is currently available in the following regions: West US, West US2, West US3, East US, East US2, CentralUS, South Central US, North Central US, West Europe, North Europe, UK South, and France Central.