---
title: Performing manual upgrades on Virtual Machine Scale Sets
description: Learn about how to perform a manual upgrade on Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 03/07/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Performing manual upgrades on Virtual Machine Scale Sets

> [!NOTE]
> Manual upgrade policy is available for both Virtual Machine Scale Sets with Uniform Orchestration and Virtual Machine Scale Sets with Flexible Orchestration. 
>
>**Manual upgrade policy for Virtual Machine Scale Sets with Flexible Orchestration is currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 
 
If you have the upgrade policy set to manual, any changes made to the scale set model won't be applied automatically. You need to manually trigger upgrades on each individual virtual machine. The manual upgrade functionality updates the selected instances according to the virtual machine configuration set in the scale set profile.

### [Portal](#tab/portal)

Select the Virtual Machine Scale Set you want to perform instance upgrades on. In the menu under **Settings**, select **Instances** and select the instances you want to upgrade. Once selected, click the **Upgrade** option. 

If using Virtual Machine Scale Sets with Flexible Orchestration, manual upgrade support using the Portal isn't yet supported. To perform manual upgrades on scale sets with Flexible Orchestration, see the CLI, PowerShell, and REST tabs. 

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/manual-upgrade-1.png" alt-text="Screenshot showing how to perform manual upgrades using the Azure portal.":::


### [CLI](#tab/cli)
Update Virtual Machine Scale Set instances using [az vmss update-instances](/cli/azure/vmss#az-vmss-update-instances). The `--instance-ids` parameter refers to the ID of the instance if using Uniform Orchestration and the instance name if using Flexible Orchestration.  

```azurecli-interactive
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```
### [PowerShell](#tab/powershell)
Update Virtual Machine Scale Set instances using [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance). The `-InstanceId` parameter refers to the ID of the instance if using Uniform Orchestration and the instance name if using Flexible Orchestration. 
    
```azurepowershell-interactive
Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
```

### [REST API](#tab/rest)
Update Virtual Machine Scale Set instances using [update instances](/rest/api/compute/virtualmachinescalesets/updateinstances). The `instanceIds` parameter refers to the ID of the instance if using Uniform Orchestration and the instance name if using Flexible Orchestration. 

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/manualupgrade?api-version={apiVersion}

{
  "instanceIds": [
    "myScaleSet1",
    "myScaleSet2"
  ]
}

```
---


## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
