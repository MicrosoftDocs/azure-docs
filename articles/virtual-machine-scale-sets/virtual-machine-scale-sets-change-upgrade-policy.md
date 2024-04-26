---
title: Change the upgrade policy on Virtual Machine Scale Sets
description: Learn how to change the upgrade policy on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 03/07/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Change the upgrade policy on Virtual Machine Scale Sets

> [!NOTE]
> Automatic, manual and rolling upgrade policy is available for Virtual Machine Scale sets with Uniform Orchestration. 
>
>**Only manual upgrade policy is available for Virtual Machine scale Sets with Flexible Orchestration. Manual upgrade policy for Virtual Machine Scale Sets with Flexible Orchestration is currently in preview.**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA).

The upgrade policy for a Virtual Machine Scale Set can be changed at any point in time. Depending on your scenario, you may want to use a particular upgrade policy when setting up and developing your workload and once you're ready to move to production, change it to another upgrade policy mode. 

### [Portal](#tab/portal)

Select the Virtual Machine Scale Set you want to change the upgrade policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select the upgrade policy you want to enable. 

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for more configuration options and suggestions.

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/change-upgrade-policy.png" alt-text="Screenshot showing changing the upgrade policy and enabling MaxSurge in the Azure portal.":::


### [PowerShell](#tab/powershell)
Update an existing Virtual Machine Scale Set using [Update-AzVmss](/powershell/module/az.compute/update-azvmss) and the `-UpgradePolicyMode` to set the upgrade policy mode. 

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for more configuration options and suggestions.

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Update-Azvmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet" `
    -UpgradePolicyMode "Manual" `
    -VirtualMachineScaleSet $vmss
```

### [ARM Template](#tab/template)

Update the properties section of your ARM template with the upgrade policy to set the upgrade policy mode. 

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for more configuration options and suggestions.


```ARM
"properties": {
        "upgradePolicy": {
            "mode": "manual",
        }
    }
```
---


## Next steps
Learn how to [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) on Virtual Machine Scale Sets. 
