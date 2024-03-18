---
title: Get high availability and cost savings with Spot Priority Mix for Virtual Machine Scale Sets
description: Learn how to run a mix of Spot VMs and uninterruptible standard VMs for Virtual Machine Scale Sets to achieve high availability and cost savings.
author: ju-shim
ms.author: jushiman
ms.service: virtual-machine-scale-sets
ms.subservice: spot
ms.topic: conceptual
ms.date: 07/01/2023
ms.reviewer: cynthn
ms.custom: engagement-fy23
---

# Spot Priority Mix for high availability and cost savings

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Flexible scale sets

Azure allows you to have the flexibility of running a mix of uninterruptible standard VMs and interruptible Spot VMs for Virtual Machine Scale Set deployments. You're able to deploy this Spot Priority Mix using Flexible orchestration to easily balance between high-capacity availability and lower infrastructure costs according to your workload requirements. This feature allows you to easily manage your scale set capability to achieve the following goals:

- Reduce compute infrastructure costs by applying the deep discounts of Spot VMs
- Maintain capacity availability through uninterruptible standard VMs in the scale set deployment
- Provide reassurance that all your VMs won't be taken away simultaneously due to evictions before the infrastructure has time to react and recover the evicted capacity
- Simplify the scale-out and scale-in of compute workloads that require both Spot and standard VMs by letting Azure orchestrate the creation and deletion of VMs

## Limitations
Spot Priority Mix is not supported with `singlePlacementMode` enabled on the scale set.

## Configure your mix

You can configure a custom percentage distribution across Spot and standard VMs. The platform automatically orchestrates each scale-out and scale-in operation to achieve the desired distribution by selecting an appropriate number of VMs to create or delete. You can also optionally configure the number of base standard VMs you would like to maintain in the Virtual Machine Scale Set during any scale operation.

The eviction policy of your Spot VMs follows what is set for the Spot VMs in your scale set. *Deallocate* is the default behavior, wherein evicted Spot VMs move to a stop-deallocated state. Alternatively, the Spot eviction policy can be set to *Delete*, wherein the VM and its underlying disks are deleted.

### ARM Template

You can set your Spot Priority Mix by using an ARM template to add the following properties to a scale set with Flexible orchestration using a Spot priority VM profile:

```json
"priorityMixPolicy": {
    "baseRegularPriorityCount": 0,
    "regularPriorityPercentageAboveBase": 50
},
```

**Parameters:**

- `baseRegularPriorityCount` – Specifies a base number of VMs that are standard, *Regular* priority; if the Scale Set capacity is at or below this number, all VMs are *Regular* priority.
- `regularPriorityPercentageAboveBase` – Specifies the percentage split of *Regular* and *Spot* priority VMs that are used when the Scale Set capacity is above the *baseRegularPriorityCount*.

You can refer to this [ARM template example](https://paste.microsoft.com/f84d2f83-f6bf-4d24-aa03-175b0c43da32) for more context.

### [Portal](#tab/portal)

You can set your Spot Priority Mix in the Spot tab of the Virtual Machine Scale Sets creation process in the Azure portal. The following steps instruct you on how to access this feature during that process.

1. Log in to the [Azure portal](https://portal.azure.com).
1. In the search bar, search for and select **Virtual Machine Scale Sets**.
1. Select **Create** on the **Virtual Machine Scale Sets** page.
1. In the **Basics** tab, fill out the required fields, select **Flexible** as the **Orchestration** mode, and select the checkbox for **Run with Azure Spot discount**.
1. In the **Spot** tab, select the check-box next to *Scale with VMs and Spot VMs* option under the **Scale with VMs and discounted Spot VMs** section.
1. Fill out the **Base VM (uninterruptible) count** and **Instance distribution** fields to configure your percentage split between Spot and Standard VMs.
1. Continue through the Virtual Machine Scale Set creation process.

### [Azure CLI](#tab/cli)

You can set your Spot Priority Mix using Azure CLI by setting the `priority` flag to `Spot` and including the `regular-priority-count` and `regular-priority-percentage` flags.

```azurecli
az vmss create -n myScaleSet \
		-g myResourceGroup \
		--orchestration-mode flexible \
		--regular-priority-count 2 \
		--regular-priority-percentage 50 \
		--orchestration-mode flexible \
		--instance-count 4 \
		--image CentOS85Gen2 \
		--priority Spot \
		--eviction-policy Deallocate \
		--single-placement-group False \
```

### [Azure PowerShell](#tab/powershell)

You can set your Spot Priority Mix using Azure PowerShell by setting the `Priority` parameter to `Spot` and including the `BaseRegularPriorityCount` and `RegularPriorityPercentage` parameters.

```azurepowershell
$vmssConfig = New-AzVmssConfig `
            -Location "East US" `
            -SkuCapacity 4 `
            -SkuName Standard_D2_v5 `
            -OrchestrationMode 'Flexible' `
            -EvictionPolicy 'Delete' `
            -PlatformFaultDomainCount 1 `
            -Priority 'Spot' `
            -BaseRegularPriorityCount 2 `
            -RegularPriorityPercentage 50;

New-AzVmss `
            -ResourceGroupName myResourceGroup `
            -Name myScaleSet `
            -VirtualMachineScaleSet $vmssConfig;

```

---

## Updating your Spot Priority Mix
Should your ideal percentage split of Spot and Standard VMs change, you can update your Spot Priority Mix after your scale set has been deployed. Updating your Spot Priority Mix will apply for all scale set actions *after* the change is made, existing VMs will remain as is.

### [Portal](#tab/portal)
You can update your existing Spot Priority Mix in the Configuration tab of the Virtual Machine Scale Set resource page in the Azure portal. The following steps instruct you on how to access this feature during that process. Note: in Portal, you can only update the Spot Priority Mix for scale sets that already have Spot Priority Mix enabled.

You can update your existing Spot Priority Mix in the Configuration tab of the Virtual Machine Scale Set resource page in the Azure portal. The following steps instruct you on how to access this feature during that process. Note: in Portal, you can only update the Spot Priority Mix for scale sets that already have Spot Priority Mix enabled.

1. Navigate to the specific virtual machine scale set that you're adjusting the Spot Priority Mix on.
1. In the left side bar, scroll down to and select **Configuration**.
1. Your current Spot Priority Mix should be visible. Here you can change the **Base VM (uninterruptible) count** and **Instance distribution** of Spot and Standard VMs.
1. Update your Spot Mix as needed.
1. Press the **Save** button to apply your changes.

### [Azure CLI](#tab/cli)

You can update your Spot Priority Mix using Azure CLI by updating the `regular-priority-count` and `regular-priority-percentage` parameters.

```azurecli
az vmss update --resource-group myResourceGroup \
        --name myScaleSet \
        --regular-priority-count 10 \
        --regular-priority-percentage 80 \
```

### [Azure PowerShell](#tab/powershell)

You can update your Spot Priority Mix using Azure PowerShell by updating the `BaseRegularPriorityCount` and `RegularPriorityPercentage` parameters.

```azurepowershell
$vmss = Get-AzVmss `
        -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet"

Update-AzVmss `
        -ResourceGroupName "myResourceGroup" `
        -VirtualMachineScaleSet $vmss
        -VMScaleSetName "myScaleSet" `
        -BaseRegularPriorityCount 10 `
        -RegularPriorityPercentage 80;

```

---

## Examples

The following examples have scenario assumptions, a table of actions, and walk-through of results to help you understand how Spot Priority Mix configuration works.

Some important terminology to notice before referring to these examples:

- **sku.capacity** is the total number of VMs in the Virtual Machine Scale Set
- **Base (standard) VMs** are the number of standard non-Spot VMs, akin to a minimum VM number

### Scenario 1

The following scenario assumptions apply to this example:
- **sku.capacity** is variable, as  Autoscale will add or remove VMs from the scale set
- **Base (standard) VMs:** 10
- **Extra standard VMs:** 0
- **Spot priority VMs:** 0
- **regularPriorityPercentageAboveBase:** 50%
- **Eviction policy:** Delete

| Action                            | sku.capacity | Base (standard) VMs | Extra standard VMs | Spot priority VMs |
|-----------------------------------|-------------|---------------------|--------------------|-------------------|
| Create                            | 10           | 10                  | 0                  | 0                 |
| Scale out                         | 20           | 10                  | 5                  | 5                 |
| Scale out                         | 30           | 10                  | 10                 | 10                |
| Scale out                         | 40           | 10                  | 15                 | 15                |
| Scale out                         | 41           | 10                  | 15                 | 16                |
| Scale out                         | 42           | 10                  | 16                 | 16                |
| Scale in - Evict-Delete (all Spot instances) | 26           | 10                  | 16                 | 0                 |
| Scale out                         | 30           | 10                  | 16                 | 4                 |
| Scale out                         | 42           | 10                  | 16                 | 16                |
| Scale out                         | 44           | 10                  | 17                 | 17                |

Example walk-through:
1. You start out with a Virtual Machine Scale Set with 10 VMs.
    - The `sku.capacity` is variable and doesn't set a starting number of VMs. The Base VMs are set at 10, thus your total starting VMs are just 10 Base (standard) VMs.
1. You then scale-out 5 times, with 50% standard VMs and 50% Spot VMs.
    - Note, because there's a 50/50 split, in the fourth scale-out, there's one more Spot VM than standard VM. Once it's scaled out again (5th scale-out), the 50/50 balance is restored with another standard VM.
1. You then scale in your scale set with the eviction policy being *evict-delete*, which deletes all the Spot VMs.
1. With the scale-out operations mentioned in this scenario, you restore the 50/50 balance in your scale set by only creating Spot VMs.
1. By the last scale-out, your scale set is already balanced, so one of each type of VM is created.

### Scenario 2

The following scenario assumptions apply to this example:
- **sku.capacity** is variable, defined by autoscaler; starting with 20
- **Base (standard) VMs:** 10
- **Extra standard VMs:** 2
- **Spot priority VMs:** 8
- **regularPriorityPercentageAboveBase:** 25%
- **Eviction policy:** Deallocate

| Action                      | sku.capacity | Base (standard) VMs | Extra standard VMs | Spot priority VMs                            |
|-----------------------------|--------------|---------------------|--------------------|----------------------------------------------|
| Create                      | 20           | 10                  | 2                  | 8                                            |
| Scale out                   | 50           | 10                  | 10                 | 30                                           |
| Scale out                   | 110          | 10                  | 25                 | 75                                           |
| Scale In: Stop-Deallocate (10 instances) | 100          | 10                  | 25                 | 75 (65 running VMs, 10 Stop-Deallocated VMs) |
| Scale out                   | 120          | 10                  | 27                 | 83 (73 running VMs, 10 Stop-Deallocated VMs) |

Example walk-through:
1. With the initial creation of the Virtual Machine Scale Set and Spot Priority Mix, you have 20 VMs.
    - 10 of those VMs are the Base (standard) VMs, 2 extra standard VMs, and 8 Spot priority VMs for your 25% *regularPriorityPercentageAboveBase*.
    - Another way to look at this ratio is you have 1 standard VM for every 4 Spot VMs in the scale set.
2. You then scale out twice to create 90 more VMs; 23 standard VMs and 67 Spot VMs.
3. When you scale in by 10 VMs, 10 Spot VMs are *stop-deallocated*, creating an imbalance in your scale set.
4. Your next scale out operation creates another 2 standard VMs and 8 Spot VMs, bringing you closer to your 25% above base ratio.

## Troubleshooting

If Spot Priority Mix isn't available to you, be sure to configure the `priorityMixPolicy` to specify a *Spot* priority in the `virtualMachineProfile`. Without enabling the `priorityMixPolicy` setting, you won't be able to access this Spot feature.

## FAQs
### Q: I changed the Spot Priority Mix settings, why aren't my existing VMs changing?

Spot Priority Mix applies for scale actions on the scale set. Changing the percentage split of Spot and Standard VMs won't rebalance existing scale set. You'll see the actual percentage split change as you scale the scale set.

### Q: Is Spot Priority Mix enabled for Uniform orchestration mode?
Spot Priority Mix is only available on Virtual Machine Scale Sets with Flexible orchestration mode.

### Q: Which regions is Spot Priority Mix enabled in?
Spot VMs, and therefore Spot Priority Mix, are available in all global Azure regions.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Spot virtual machines](../virtual-machines/spot-vms.md)
