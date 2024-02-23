---
title: Change the Upgrade Policy on Virtual Machine Scale Sets
description: Learn about to Change the Policy on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 02/06/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Change the Upgrade Policy on Virtual Machine Scale Sets

> [!IMPORTANT]
> **Upgrade Policies for Virtual Machine Scale Sets with Flexible Orchestration are currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA).
>
> If using Rolling Upgrade Policy, see **[Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md)** for more information. 
>
> Upgrade Policies for Virtual Machine Scale Sets with Uniform Orchestration are generally available (GA). 

The Upgrade Policy for a Virtual Machine Scale Set can be changed at any point in time. Depending on your scenario, you may want to use a particular Upgrade Policy when setting up and developing your workload and once you're ready to move to production, change it to another Upgrade Policy mode. 

### [Portal](#tab/portal)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select the Upgrade Policy you want to enable. 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for more configuration options and suggestions.

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/change-upgrade-policy.png" alt-text="Screenshot showing changing the Upgrade Policy and enabling MaxSurge in the Azure portal.":::


### [PowerShell](#tab/powershell)
Update an existing Virtual Machine Scale Set using [Update-AzVmss](/powershell/module/az.compute/update-azvmss) and the `-UpgradePolicyMode` parameter to `"Automatic"` or `"Manual"`.

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for more configuration options and suggestions.

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Update-Azvmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet" `
    -UpgradePolicyMode "Manual" `
    -VirtualMachineScaleSet $vmss
```

### [ARM Template](#tab/template)

Update the properties section of your ARM template with the Upgrade Policy. Set mode to `"Automatic"` or `"Manual"`.

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for more configuration options and suggestions.


```ARM
"properties": {
        "upgradePolicy": {
            "mode": "Automatic",
        }
    }
```
---


## Next steps
Learn how to [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) on Virtual Machine Scale Sets. 
