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

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for additional configuration options and suggestions.

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/change-upgrade-policy.png" alt-text="Screenshot showing changing the upgrade policy and enabling MaxSurge in the Azure portal.":::


### [CLI](#tab/cli2)
Update an existing Virtual Machine Scale Set using [az vmss update](/cli/azure/vmss#az-vmss-update).

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for additional configuration options and suggestions.

```azurecli-interactive
az vmss update \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --set upgradePolicy.automatic
```

### [PowerShell](#tab/powershell2)
Update an existing Virtual Machine Scale Set using [Update-AzVmss](/powershell/module/az.compute/update-azvmss). 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for additional configuration options and suggestions.

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Update-Azvmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -UpgradePolicyMode "Manual" -VirtualMachineScaleSet $vmss
```

### [ARM Template](#tab/template2)

Update the properties section of your ARM template with the Upgrade Policy you wish to use. 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for additional configuration options and suggestions.


```ARM
"properties": {
        "upgradePolicy": {
            "mode": "Automatic",
        }
    }
```
---


## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
