---
title: Performing Manual Upgrades on Virtual Machine Scale Sets
description: Learn about to perform a Manual Upgrade on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/04/2024
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Performing Manual Upgrades on Virtual Machine Scale Sets
 
If you have the Upgrade Policy set to manual, you need to trigger manual upgrades of each existing VM to apply changes to the instances based on the updated scale set model. Performing a reimage of a VM will cause it to be restarted. 

### [Portal](#tab/portal1)

Select the Virtual Machine Scale Set you want to perform instance upgrades for. In the menu under **Settings**, select **Instances** and select the instances you want to upgrade. Once selected, click the **Upgrade** option.

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/manual-upgrade-1.png" alt-text="Screenshot showing how to perform manual upgrades using the Azure portal.":::


### [CLI](#tab/cli1)
Update Virtual Machine Scale Set instances using [az vmss update-instances](/cli/azure/vmss#az-vmss-update-instances).

```azurecli-interactive
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```
### [PowerShell](#tab/powershell1)
Update Virtual Machine Scale Set instances using [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance).
    
```azurepowershell-interactive
Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
```

### [REST API](#tab/rest1)
Update Virtual Machine Scale Set instances using [update instances](/rest/api/compute/virtualmachinescalesets/updateinstances).

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/manualupgrade?api-version={apiVersion}
```
---


## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
