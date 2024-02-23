---
title: Configure Rolling Upgrades on Virtual Machine Scale Sets
description: Learn about how to configure Rolling Upgrades on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 02/06/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Configure Rolling Upgrades on Virtual Machine Scale Sets

> [!IMPORTANT]
> **Rolling Upgrade Policy for Virtual Machine Scale Sets with Flexible Orchestration are currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA).
>
> To use Rolling Upgrade Policy and MaxSurge on Virtual Machine Scale Sets with Flexible Orchestration during the preview, register the following provider features:
> 
>`Register-AzProviderFeature -FeatureName VmssFlexRollingUpgrade -ProviderNamespace Microsoft.Compute`
> 
>`Register-AzProviderFeature -FeatureName MaxSurgeRollingUpgrade -ProviderNamespace Microsoft.Compute`
>
>Upgrade Policies for Virtual Machine Scale Sets with Uniform Orchestration are generally available (GA). 

Rolling Upgrade Policy is the safest way to apply updates to instances in a Virtual Machine Scale Set. Performing updates in batches ensures that your scale set maintains a set number of instances available to take traffic, meaning you don't need to take down your entire workload to make a change. 

Rolling Upgrade Policy is best suited for production workloads.


## Requirements

- If using a Rolling Upgrade Policy, the scale set must have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health. Virtual Machine Scale Sets using Uniform Orchestration can use either a health probe or the Application Health Extension. If using Virtual Machine Scale Sets with Flexible Orchestration, an Application Health Extension is required.

- If using Rolling Upgrades with MaxSurge, new VMs are created using the latest scale set model to replace VMs using the old scale set model. These newly created VMs have new instance Ids and IP addresses. Ensure you have enough quota and address space in your subnet to accommodate these new VMs before enabling MaxSurge. For more information on quotas and limits, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md) 

## Concepts

|Setting | Description |
|---|---|
|**Upgrade Policy Mode** | The Upgrade Policy modes available on Virtual Machine Scale Sets are **Automatic**, **Manual** and **Rolling**. | 
|**Rolling upgrade batch size %** | Specifies how many of the total instances of your scale set you want to be upgraded at one time. <br><br>Example: A batch size of 20% when you have 10 instances in your scale set results in upgrade batches with two instances each. |
|**Pause time between batches (sec)** | Specifies how long you want your scale set to wait between upgrading batches.<br><br> Example: A pause time of 10 seconds means that once a batch is successfully completed, the scale set will wait 10 seconds before moving onto the next batch. |
|**Max unhealthy instance %** | Specifies the total number of instances allowed to be marked as unhealthy before and during the Rolling Upgrade. <br><br>Example: A max unhealthy instance % of 20 means if you have a scale set of 10 instances and more than two instances in the entire scale set report back as unhealthy, the Rolling Upgrade stops. |
| **Max unhealthy upgrade %**| Specifies the total number of instances allowed to be marked as unhealthy after being upgraded. <br><br>Example: A max unhealthy upgrade % of 20 means if you have a scale set of 10 instances and more than two instances in the entire scale set report back as unhealthy after being upgraded, the Rolling Upgrade is canceled. <br><br>Max unhealthy upgrade % is an important setting because it allows the scale set to catch unstable or poor updates before they roll out to the entire scale set. |
|**Prioritize unhealthy instances** | Tells the scale set to upgrade instances marked as unhealthy before upgrading instances marked as healthy. <br><br>Example: If some instances in your scale set that show as failed or unhealthy when a Rolling Upgrade begins, the scale set updates those instances first. |
| **Enable cross-zone upgrade** | Allows the scale set to ignore Availability Zone boundaries when determining batches. |
| **MaxSurge** | MaxSurge is currently in preview for Virtual Machine Scale Sets with Flexible Orchestration and Uniform Orchestration. To use this preview feature, register the provider feature using `Register-AzProviderFeature -FeatureName MaxSurgeRollingUpgrade -ProviderNamespace Microsoft.Compute`.<br><br> With MaxSurge enabled, new instances are created  in batches using the latest scale model. Once the batch of new instances are successfully created and marked as healthy, they begin taking traffic. The scale set then deletes instances in batches matching the old scale set model. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. <br><br>With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances begin taking traffic again, and the next batch begins. This continues until all instances brought up-to-date. |


## Setting or updating the Rolling Upgrade Policy

Rolling Upgrade Policy can be configured during scale set creation. Because Rolling Upgrade Policy requires successfully monitoring application health and there are specific settings that determine how upgrades are completed, it's suggested to first create your scale set using Manual Upgrade Policy. Once you have confirmed the application health is being successfully reported, update your Upgrade Policy from Manual to Rolling.

### [Portal](#tab/portal1)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select **Rolling - Upgrades roll out in batches with optional pause**. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-policy-portal.png" alt-text="Screenshot showing changing the Upgrade Policy and enabling MaxSurge in the Azure portal.":::


### [PowerShell](#tab/powershell1)
Update an existing Virtual Machine Scale Set using [Update-AzVmss](/powershell/module/az.compute/update-azvmss). 

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Set-AzVmssRollingUpgradePolicy `
   -VirtualMachineScaleSet $VMSS `
   -MaxBatchInstancePercent 20 `
   -MaxUnhealthyInstancePercent 20 `
   -MaxUnhealthyUpgradedInstancePercent 20 `
   -PauseTimeBetweenBatches "PT30S" `
   -EnableCrossZoneUpgrade True `
   -PrioritizeUnhealthyInstance True `
   -MaxSurge True

Update-Azvmss -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet" `
    -UpgradePolicyMode "Rolling" `
    -VirtualMachineScaleSet $vmss
```

### [ARM Template](#tab/template1)

Update the properties section of your ARM template and set the Upgrade Policy to Rolling and various Rolling Upgrade options.  


``` ARM Template
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
            }
        }
    }
```
---


## Get Rolling Upgrade Status

### [Portal](#tab/portal2)

When a Rolling Upgrade is triggered in the Azure portal, a banner appears at the top of your scale set resource informing you that a Rolling Upgrade is in progress. You can click on view details to see the status of the Rolling Upgrade. When all updates are complete, the banner disappears. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-banner.png" alt-text="Screenshot showing banner when a rolling upgrade is taking place.":::

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-status-portal.png" alt-text="Screenshot showing details of the rolling upgrade in the Azure portal.":::

Additionally, you can view exactly what changes are being rolled out in the Activity Log. The Rolling Upgrade event is under **Create or Update Virtual Machine Scale Set**. Select **Change History** to review what is being updated. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-activity-log.png" alt-text="Screenshot showing the rolling upgrade details in the Activity Log.":::


### [CLI](#tab/cli2)

You can get the status of a Rolling Upgrade in progress using [az vmss rolling-upgrade get-latest](/cli/azure/vmss#az-vmss-rolling-upgrade)

```azurecli
az vmss rolling-upgrade get-latest \
    --name myScaleSet \
    --resource-group myResourceGroup

{
  "location": "eastus",
  "policy": {
    "maxBatchInstancePercent": 20,
    "maxSurge": false,
    "maxUnhealthyInstancePercent": 20,
    "maxUnhealthyUpgradedInstancePercent": 20,
    "pauseTimeBetweenBatches": "PT0S",
    "prioritizeUnhealthyInstances": true,
    "rollbackFailedInstancesOnPolicyBreach": false
  },
  "progress": {
    "failedInstanceCount": 0,
    "inProgressInstanceCount": 2,
    "pendingInstanceCount": 0,
    "successfulInstanceCount": 8
  },
  "runningStatus": {
    "code": "RollingForward",
    "lastAction": "Start",
    "lastActionTime": "2024-01-12T20:20:04.1863772+00:00",
    "startTime": "2024-01-12T20:20:04.4363788+00:00"
  },
  "type": "Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades"
}
```

### [PowerShell](#tab/powershell2)

You can get the status of a Rolling Upgrade in progress using [Get-AzVmssRollingUpgrade](/powershell/module/az.compute/get-azvmssrollingupgrade)

```azurepowershell
Get-AzVMssRollingUpgrade `
    -ResourceGroupName myResourceGroup `
    -VMScaleSetName myScaleSet

Policy                                  : 
  MaxBatchInstancePercent               : 20
  MaxUnhealthyInstancePercent           : 20
  MaxUnhealthyUpgradedInstancePercent   : 20
  PauseTimeBetweenBatches               : PT0S
  PrioritizeUnhealthyInstances          : True
  RollbackFailedInstancesOnPolicyBreach : False
  MaxSurge                              : False
RunningStatus                           : 
  Code                                  : RollingForward
  StartTime                             : 1/12/2024 8:20:04 PM
  LastAction                            : Start
  LastActionTime                        : 1/12/2024 8:20:04 PM
Progress                                : 
  SuccessfulInstanceCount               : 8
  FailedInstanceCount                   : 0
  InProgressInstanceCount               : 2
  PendingInstanceCount                  : 0
Type                                    : Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades
Location                                : eastus
Tags                                    : {}
```
---

## Cancel a Rolling Upgrade

### [Portal](#tab/portal3)
You can cancel a Rolling Upgrade in progress using the Azure portal by selecting the **view details** in the banner above your scale set. In the pop-up window, you can view the current status and at the bottom is a **cancel upgrade** option. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-cancel-portal.png" alt-text="Screenshot showing the rolling upgrade details in the Activity Log.":::


### [CLI](#tab/cli3)
You can stop a Rolling Upgrade in progress using [az vmss rolling-upgrade cancel](/cli/azure/vmss#az-vmss-rolling-upgrade). If you don't see any output after running the command, it means the cancel request was successful.

```azurecli
az vmss rolling-upgrade cancel \
    --name myScaleSet \
    --resource-group myResourceGroup
```

### [PowerShell](#tab/powershell3)
You can stop a rolling upgrade in progress using [Stop-AzVmssRollingUpgrade](/powershell/module/az.compute/stop-azvmssrollingupgrade).

```azurepowershell
Stop-AzVmssRollingUpgrade `
    -ResourceGroupName myResourceGroup `
    -VMScaleSetName myScaleSet

Name      : f78e1b14-720a-4c53-9656-79a43bd10adc
StartTime : 1/12/2024 8:40:46 PM
EndTime   : 1/12/2024 8:45:18 PM
Status    : Succeeded
Error     : 
```
---

## Restart a Rolling Upgrade

If you decide to cancel a Rolling Upgrade or the upgrade has stopped due to any policy breach, any more changes that result in another scale set model change trigger a new Rolling Upgrade. If you want to restart a Rolling Upgrade, to trigger a generic model update. This tells the scale set to check if all the instances are up to date with the latest model.

### [CLI](#tab/cli4)
To restart a rolling upgrade after its been canceled, you need to trigger the scale set to check if the instances in the scale set are up to date with the latest scale set model. You can do this by running [az vmss update](/cli/azure/vmss#az-vmss-update)

```azurecli
az vmss update \
    --name myScaleSet \
    --resource-group myResourceGroup
```

### [PowerShell](#tab/powershell4)
To restart a Rolling Upgrade after its been canceled, you need to trigger the scale set to check if the instances in the scale set are up to date with the latest scale set model. You can do this by running [Update-AzVmss](/powershell/module/az.compute/update-azvmss)

```azurepowershell
$VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Update-AzVmss `
    -ResourceGroupName myResourceGroup `
    -Name myScaleSet `
    -VirtualMachineScaleSet $VMSS
```    
---


## Next steps
Learn how to [perform manual upgrades](virtual-machine-scale-sets-perform-manual-upgrades.md) on Virtual Machine Scale Sets. 
