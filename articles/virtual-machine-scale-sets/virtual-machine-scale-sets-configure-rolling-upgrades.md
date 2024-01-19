---
title: Configure Rolling Upgrades on Virtual Machine Scale Sets
description: Learn about to configure Rolling Upgrades on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/19/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Configure Rolling Upgrades on Virtual Machine Scale Sets

> [!IMPORTANT]
> **Upgrade Policies for Virtual Machine Scale Sets using Flexible Orchestration mode are currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 
>
>Upgrade Policies for Virtual Machine Scale Sets using Uniform Orchestration mode are generally available (GA). 

Rolling Upgrade Policy is the safest way to apply updates to instances in a Virtual Machine Scale Set. Performing updates in batches ensures that your scale set maintains a set number of instances that are still available to take traffic, meaning you don't need to take down your entire workload to push a change. 

Rolling Upgrade Policy is best suited for Production workloads but can also be useful in Development environments. 


## Requirements
When using a Rolling Upgrade Policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health. 

Virtual Machine Scale Sets using Uniform Orchestration Mode can use either a health probe or the Application Health Extension. If using Virtual Machine Scale Sets with Flexible Orchestration Mode, Application Health Extension is required as Health probes aren't supported on Flexible Orchestration Mode. 

## Exceptions to Rolling Upgrade Policy
When configuring the rolling upgrade batch size, scale sets ensure that upgrades don't occur on multiple fault domains at the same time. Even if you were to select 100% batch size, the actual batch size would be limited to prevent updates occurring in multiple fault domains at once. 

If you wish to bypass this protection, you can override the default fault domain policies using the Rolling Upgrade Policy Override feature.

> [!IMPORTANT]
> Overriding the default behavior of rolling upgrades to ignore fault domains is not suggested for production workloads. By enabling this feature you're forfitting any associated SLAs that would normally come with Rolling Upgrades. 

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName RollingUpgradePolicyOverride -ProviderNamespace Microsoft.Compute
```

## Concepts

|Setting | Description |
|---|---|
|**Upgrade Policy Mode:** | The Upgrade Policy modes available on Virtual Machine Scale sets are Automatic, Manual and Rolling. | 
|**Rolling upgrade batch size %** | Specifies how many of the total instances of your scale set you wish to be upgraded at one time. For example, a batch size of 20% when you have 10 instances in your scale set results in upgrade batches with two instances each. |
|**Pause time between batches (sec)** | Specifies how long you want your scale set to wait between upgrading batches. For example, a pause time of 10 seconds means that once a batch has successfully completed, the scale set will wait 10 seconds before moving onto the next batch. |
|**Max unhealthy instance %** | Specifies the allowed total number of instances marked as unhealthy before and during the Rolling Upgrade. For example, a max unhealthy instance % of 20 means if you have a scale set of 10 instances and more than two instances in the entire scale set report back as unhealthy, the Rolling Upgrade is canceled. |
| **Max unhealthy upgrade %**| Specifies the allowed total number of instances marked as unhealthy after being upgrade. For example, a max unhealthy upgrade % of 20 means if you have a scale set of 10 instances and more than two instances in the entire scale set report back as unhealthy after being upgraded, the Rolling Upgrade is canceled. This is an very important setting because it allows the scale set to catch unstable or poor updates before they roll out to the entire scale set. |
|**Prioritize unhealthy instances** | Tells the scale set to upgrade instances marked as unhealthy before upgrading instances marked as healthy. For example, if you have some instances in your scale set that shows as failed or unhealthy when a Rolling Upgrade begins, the scale set updates those instances ahead of the other instances in the scale set. |
| **Enable cross-zone upgrade** | Allows the scale set to ignore Availability Zone boundaries when determining batches. |
| **MaxSurge** | With MaxSurge enabled, new instances are created in the scale set using the latest scale model in batches. Once the batch of new instances is successfully created and marked as healthy they will begin taking traffic. The scale set will then delete instances matching the old scale set model. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. It's important to ensure you have enough quota in your subscription and region to utilize MaxSurge. <br><br>With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances will begin taking traffic again, and the next batch will begin. This continues until all instances brought up-to-date. Rolling upgrades without MaxSurge doesn't require more quota however, it does result in your scale set having reduced capacity during the upgrade process. |


## Setting or updating the Rolling Upgrade Policy

While you're able to configure the Rolling Upgrade Policy during scale set creation, because using Rolling Upgrade Policy requires a health probe, or an application health extension and there are other settings associated with Rolling Upgrade Policy. It's suggested to first create your scale set using Manual Upgrade Policy and once you have confirmed your health probe or application health extension is properly reporting back your application health, update your Upgrade Policy from Manual to Rolling and update the Policy settings to your desired configuration. 

### [Portal](#tab/portal1)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select **Rolling - Upgrades roll out in batches with optional pause**. 

Configure the properties to best suite your requirements. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-policy-portal.png" alt-text="Screenshot showing changing the Upgrade Policy and enabling MaxSurge in the Azure portal.":::


### [CLI](#tab/cli1)
Update an existing Virtual Machine Scale Set using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurecli-interactive
az vmss update \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --set upgradePolicy.rollingUpgradePolicy.maxSurge=true \
    --max-batch-instance-percent 20 \
    --max-unhealthy-instance-percent 20 \
    --max-unhealthy-upgraded-instance-percent 20 \
    --pause-time-between-batches "PT0S"\
    --prioritize-unhealthy-instances true \
```

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

Update-Azvmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -UpgradePolicyMode "Rolling" -VirtualMachineScaleSet $vmss
```

### [ARM Template](#tab/template1)

Update the properties section of your ARM template and set the Upgrade Policy to Rolling and various rolling upgrade options.  


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

When a Rolling Upgrade is triggered in the Azure portal, a banner appears at the top of your scale set resource informing you that a Rolling Upgrade is in progress. You can click on view details to see the status of the rolling upgrade. When all updates are complete, the banner disappears. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-banner.png" alt-text="Screenshot showing banner when a rolling upgrade is taking place.":::

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-status-portal.png" alt-text="Screenshot showing details of the rolling upgrade in the Azure portal.":::

Additionally, you can view exactly what changes are being rolled out in the Activity Log. The Rolling Upgrade event is under **Create or Update Virtual Machine Scale Set**. Select **Change History** to review what is being updated. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-activity-log.png" alt-text="Screenshot showing the rolling upgrade details in the Activity Log.":::


### [CLI](#tab/cli2)

You can get the status of a rolling upgrade in progress using [az vmss rolling-upgrade get-latest](/cli/azure/vmss#az-vmss-rolling-upgrade)

```azurecli
az vmss rolling-upgrade get-latest --name myScaleSet --resource-group myResourceGroup

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

You can get the status of a rolling upgrade in progress using [Get-AzVmssRollingUpgrade](/powershell/module/az.compute/get-azvmssrollingupgrade)

```azurepowershell
Get-AzVMssRollingUpgrade -ResourceGroupName myResourceGroup -VMScaleSetName myScaleSet

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
You can cancel a rolling upgrade in progress using the Azure portal by selecting the **view details** in the banner above your scale set. In the pop-up window, you can view the current status and at the bottom will be a **cancel upgrade** option. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-cancel-portal.png" alt-text="Screenshot showing the rolling upgrade details in the Activity Log.":::


### [CLI](#tab/cli3)
You can stop a rolling upgrade in progress using [az vmss rolling-upgrade cancel](/cli/azure/vmss#az-vmss-rolling-upgrade). If you don't see any output after running the command, it means the cancel request was successful.

```azurecli
az vmss rolling-upgrade cancel --name myScaleSet --resource-group myResourceGroup
```

### [PowerShell](#tab/powershell3)
You can stop a rolling upgrade in progress using [Stop-AzVmssRollingUpgrade](/powershell/module/az.compute/stop-azvmssrollingupgrade).

```azurepowershell
Stop-AzVmssRollingUpgrade -ResourceGroupName myResourceGroup -VMScaleSetName myScaleSet

Name      : f78e1b14-720a-4c53-9656-79a43bd10adc
StartTime : 1/12/2024 8:40:46 PM
EndTime   : 1/12/2024 8:45:18 PM
Status    : Succeeded
Error     : 
```
---

## Restart a Rolling Upgrade

If you decide to cancel a Rolling Upgrade, any additional changes that result in the scale set model to also change triggers a new Rolling Upgrade. If you want to restart a Rolling Upgrade that has been canceled, you can use various APIs to trigger a generic model update. This tells the scale set to check if all the instances are up to date with the latest model and if any aren't, a Rolling Upgrade will begin. 

### [CLI](#tab/cli4)
To restart a rolling upgrade after it has been canceled, you need to trigger the scale set to check if the instances in the scale set are up to date with the latest scale set model. You can do this by running [az vmss update](/cli/azure/vmss#az-vmss-update)

```azurecli
az vmss update --name myScaleSet --resource-group myResourceGroup
```

### [PowerShell](#tab/powershell4)
To restart a rolling upgrade after it has been canceled, you need to trigger the scale set to check if the instances in the scale set are up to date with the latest scale set model. You can do this by running [Update-AzVmss](/powershell/module/az.compute/update-azvmss)

```azurepowershell
$VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Update-AzVmss -ResourceGroupName myResourceGroup -Name myScaleSet -VirtualMachineScaleSet $VMSS
```    
---


## Next steps
Learn how to [perform manual upgrades](virtual-machine-scale-sets-perform-manual-upgrades.md) on Virtual Machine Scale Sets. 