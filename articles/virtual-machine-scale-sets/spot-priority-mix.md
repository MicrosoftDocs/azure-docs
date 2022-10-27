---
title: Get high availability and cost savings with Spot Priority Mix for Virtual Machine Scale Sets
description: Learn how to run a mix of Spot VMs and uninterruptible regular VMs for Virtual Machine Scale Sets to achieve high availability and cost savings.
author: ju-shim
ms.author: jushiman
ms.service: virtual-machine-scale-sets
ms.subservice: spot
ms.workload: infrastructure-services
ms.topic: conceptual
ms.date: 10/12/2022
ms.reviewer: cynthn
---

# Spot Priority Mix for high availability and cost savings (preview)

**Applies to:** :heavy_check_mark: Flexible scale sets 

> [!IMPORTANT]
> **Spot Priority Mix** is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure allows you to have the flexibility of running a mix of uninterruptible regular VMs and interruptible Spot VMs for Virtual Machine Scale Set deployments. You're able to deploy this Spot Priority Mix using Flexible orchestration to easily balance between high-capacity availability and lower infrastructure costs according to your workload requirements. This feature allows you to easily manage your scale set capability to achieve the following:

- Reduce compute infrastructure costs by applying the deep discounts of Spot VMs
- Maintain capacity availability through uninterruptible regular VMs in the scale set deployment
- Provide reassurance that all your VMs won't be taken away simultaneously due to evictions before the infrastructure has time to react and recover the evicted capacity
- Simplify the scale-out and scale-in of compute workloads that require both Spot and regular VMs by letting Azure orchestrate the creation and deletion of VMs

You can configure a custom percentage distribution across Spot and regular VMs. The platform automatically orchestrates each scale-out and scale-in operation to achieve the desired distribution by selecting an appropriate number of VMs to create or delete. You can also optionally configure the number of base regular uninterruptible VMs you would like to maintain in the Virtual Machine Scale Set during any scale operation.

## Template

You can set your Spot Priority Mix by using a template to add the following properties to a scale set with Flexible orchestration using a Spot priority VM profile:

```json
"priorityMixPolicy": {
    "baseRegularPriorityCount": 0,
    "regularPriorityPercentageAboveBase": 50
},
```

**Parameters:**
- `baseRegularPriorityCount` – Specifies a base number of VMs that will be *Regular* priority; if the Scale Set capacity is at or below this number, all VMs will be *Regular* priority.
- `regularPriorityPercentageAboveBase` – Specifies the percentage split of *Regular* and *Spot* priority VMs that will be used when the Scale Set capacity is above the *baseRegularPriorityCount*.

You can refer to this [ARM template example](https://paste.microsoft.com/f84d2f83-f6bf-4d24-aa03-175b0c43da32) for more context.

## Azure portal 

You can set your Spot Priority Mix in the Scaling tab of the Virtual Machine Scale Sets creation process in the Azure portal. The following steps will instruct you on how to access this feature during that process. 

1. Log in to the [Azure portal](https://portal.azure.com) through the [public preview access link](https://aka.ms/SpotMix).
1. In the search bar, search for and select **Virtual machine scale sets**.
1. Select **Create** on the **Virtual machine scale sets** page.
1. In the **Basics** tab, fill out the required fields and select **Flexible** as the **Orchestration** mode.
1. Fill out the **Disks** and **Networking** tabs.
1. In the **Scaling** tab, select the check-box next to *Scale with VMs and Spot VMs* option under the **Scale with VMs and discounted Spot VMs** section.
1. Fill out the **Base VM (uninterruptible) count** and **Instance distribution** fields to configure your priorities.

    :::image type="content" source="./media/spot-priority-mix/scale-with-vms-and-discounted-spot-vms.png" alt-text="Screenshot of the Scale with VMs and discounted Spot VMs section in the Scaling tab within Azure portal.":::

1. Continue through the Virtual Machine Scale Set creation process. 

## Azure CLI

You can set your Spot Priority Mix using Azure CLI by setting the `priority` flag to `Spot` and including the `regular-priority-count` and `regular-priority-percentage` flags.  

```azurecli
az vmss create -n myScaleSet \
		-g myResourceGroup \
		--orchestration-mode flexible \
		--regular-priority-count 2 \
		--regular-priority-percentage 50 \
		--orchestration-mode flexible \
		--instance-count 4 \
		--image Centos \
		--priority Spot \
		--eviction-policy Deallocate \
		--single-placement-group False \
```

## Azure PowerShell

You can set your Spot Priority Mix using Azure PowerShell by setting the `Priority` flag to `Spot` and including the `BaseRegularPriorityCount` and `RegularPriorityPercentage` flags.  

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

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Spot virtual machines](../virtual-machines/spot-vms.md)
