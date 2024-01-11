---
title: Configure Rolling Upgrades on Virtual Machine Scale Sets
description: Learn about to configure Rolling Upgrades on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/04/2024
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Configure Rolling Upgrades on Virtual Machine Scale Sets

Rolling Upgrade Policy is the safest way to apply updates to instances in a Virtual Machine Scale Set. Performing updates in batches ensures that your scale set maintains a set number of instances that are still available to take traffic, meaning you do not need to take down your entire workload to push a change. 

Rolling Upgrade Policy is best suited for Production workloads but can also be useful in Development environments. 

Automatic Guest OS updates? 



## Requirements
When using a Rolling Upgrade Policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health.

## Exceptions to Rolling Upgrade Policy

Instance Protection

Rolling Upgrade batch size % of 100%

## Concepts

**Upgrade Policy Mode:** <br>The Upgrade Policy modes available on Virtual Machine Scale sets are Automatic, Manual and Rolling. 

**Rolling upgrade batch size %:** <br>Specifies how many of the total instances of your scale set you wish to be upgraded at one time. For example, a batch size of 20% when you have 10 instances in your scale set will result in upgrade batches with 2 instances each. 

**Pause time between batches (sec):** Specifies how long you want your scale set to wait between upgrading batches. For example, a pause time of 10 seconds means that once a batch has successfully upgraded and the instances are back to taking traffic again, the scale set will wait 10 seconds before starting the next batch. 

**Max unhealthy instance %:** <br>Specifies the allowed total number of instances marked as unhealthy before and during the Rolling Upgrade. For example, a max unhealthy instance % of 20 means if you have a scale set of 10 instances and more than 2 instances in the entire scale set report back as unhealthy, the Rolling Upgrade will cancel.  

**Max unhealthy upgrade %:**<br> Specifies the allowed total number of instances marked as unhealthy after being upgrade. For example, a max unhealthy upgrade % of 20 means if you have a scale set of 10 instances and more than 2 instances in the entire scale set report back as unhealthy after being upgraded, the Rolling Upgrade will cancel. This is an important setting because it allows the scale set to catch unstable or poor updates before they roll out to the entire scale set. 

**Prioritize unhealthy instances:** <br>Tells the scale set to upgrade instances marked as unhealthy before upgrading instances marked as healthy. For example, if you have some instances in your scale set that show as failed or unhealthy when a Rolling Upgrade begins, the scale set will ensure to update those instances ahead of the other instances in the scale set. 

**Enable cross-zone upgrade:** <br>Allows the scale set to ignore Availability Zone boundaries when determining batches. 

**MaxSurge:** <br>With MaxSurge enabled, new instances are created in the scale set using the latest scale model in batches. Once the batch of new instances is successfully created and marked as healthy, instances matching the old scale set model are deleted. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. It is important to ensure you have enough quota in your subscription and region to utilize MaxSurge. 

With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances will begin taking traffic again, and the next batch will begin. This continues until all instances brought up-to-date. Rolling upgrades without MaxSurge does not require additional quota however, it does result in your scale set having reduced capacity during the upgrade process. 


## Setting the Rolling Upgrade Policy

### [Portal](#tab/portal2)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select **Rolling - Upgrades roll out in batches with optional pause**. 

Configure the properties to best suite your requirements. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-policy-portal.png" alt-text="Screenshot showing changing the upgrade policy and enabling MaxSurge in the Azure portal.":::


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


## Change the Rolling Upgrade Policy Configuration



## Get Rolling Upgrade Status




## Cancel a Rolling Upgrade



## Restart a Rolling Upgrade



## Troubleshooting




-  **Rolling Upgrades with MaxSurge disabled**
    
    With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances will begin taking traffic again, and the next batch will begin. This continues until all instances brought up-to-date. 

-  **Rolling Upgrades with MaxSurge enabled**

    > [!IMPORTANT]
    > Rolling Upgrades with MaxSurge is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 
        
    With MaxSurge enabled, new instances are created in the scale set using the latest scale model in batches. Once the batch of new instances is successfully created and marked as healthy, instances matching the old scale set model are deleted. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. 
