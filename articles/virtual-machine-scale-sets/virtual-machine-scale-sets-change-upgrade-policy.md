---
title: Change the Upgrade Policy on Virtual Machine Scale Sets
description: Learn about to Change the Policy on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/04/2024
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Change the Upgrade Policy on Virtual Machine Scale Sets


The Upgrade Policy for a Virtual Machine Scale Set can be changed at any point in time. 

### [Portal](#tab/portal2)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select the Upgrade Policy you want to enable. 

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/maxsurge-2.png" alt-text="Screenshot showing changing the upgrade policy and enabling MaxSurge in the Azure portal.":::


### [CLI](#tab/cli2)
Update an existing Virtual Machine Scale Set using [az vmss update](/cli/azure/vmss#az-vmss-update) and enable `MaxSurge`. If you don't already have a health probe or the Application Health Extension installed, configure that prior to changing the Upgrade Policy.

```azurecli-interactive
az vmss update \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --set upgradePolicy.rollingUpgradePolicy.maxSurge=true
```

### [PowerShell](#tab/powershell2)
Update an existing Virtual Machine Scale Set using [Set-AzVmssRollingUpgradePolicy](/powershell/module/az.compute/set-azvmssrollingupgradepolicy) and [Update-AzVmss](/powershell/module/az.compute/update-azvmss). If you don't already have a health probe or the Application Health Extension installed, configure that prior to changing the Upgrade Policy.

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Set-AzVmssRollingUpgradePolicy `
    -VirtualMachineScaleSet $vmss `
    -MaxBatchInstancePercent 40 `
    -MaxUnhealthyInstancePercent 35 `
    -MaxUnhealthyUpgradedInstancePercent 30 `
    -PauseTimeBetweenBatches "PT30S" `
    -MaxSurge $true

Update-Azvmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -VirtualMachineScaleSet $vmss
```

### [Template](#tab/template2)

Update the properties section of your ARM template as follows: 

```ARM
"properties": {
    "singlePlacementGroup": false,
        "upgradePolicy": {
            "mode": "Rolling",
            "rollingUpgradePolicy": {
            "maxBatchInstancePercent": 20,
            "maxUnhealthyInstancePercent": 20,
            "maxUnhealthyUpgradedInstancePercent": 20,
            "pauseTimeBetweenBatches": "PT2S",
	        "MaxSurge": "true"
```
---





## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
