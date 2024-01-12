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

Virtual Machine Scale Sets using Uniform Orchestration Mode can use either a health probe or the Application Health Extension. If using Virtual Machine Scale Sets with Flexible Orchestration Mode, Application Health Extension is required as Health probes are not supported on Flexible Orchestration Mode. 

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


## Setting or Updating the Rolling Upgrade Policy

While you are able to configure the Rolling Upgrade Policy during scale set creation, because using Rolling Upgrade Policy requires a health probe or an application health extension and there are multiple additional settings associated with Rolling Upgrade Policy, it is suggested to first create your scale set using Manual Upgrade Policy and once you have confirmed your health probe or application health extension is properly reporting back your application health, update your Upgrade Policy from Manual to Rolling and update the Policy settings to your desired configuration. 

### [Portal](#tab/portal1)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select **Rolling - Upgrades roll out in batches with optional pause**. 

Configure the properties to best suite your requirements. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-policy-portal.png" alt-text="Screenshot showing changing the upgrade policy and enabling MaxSurge in the Azure portal.":::


### [CLI](#tab/cli1)
Update an existing Virtual Machine Scale Set using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurecli-interactive
az vmss update \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --set upgradePolicy.rollingUpgradePolicy.maxSurge=true
```

### [PowerShell](#tab/powershell1)
Update an existing Virtual Machine Scale Set using [Update-AzVmss](/powershell/module/az.compute/update-azvmss). 

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Update-Azvmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -UpgradePolicyMode "Rolling" -VirtualMachineScaleSet $vmss
```

### [ARM Template](#tab/template1)

Update the properties section of your ARM template with the Upgrade Policy you wish to use. 


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

When a Rolling Upgrade is triggered in the Azure Portal, a banner will appear at the top of your scale set resource informing you that a Rolling Upgrade is in progress. You can click on view details to see the status of the rolling upgrade. When all updates are complete, the banner will disappear. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-banner.png" alt-text="Screenshot showing banner when a rolling upgrade is taking place.":::

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-status-portal.png" alt-text="Screenshot showing details of the rolling upgrade in the Azure portal.":::

Additionally, you can view exactly what changes are being rolled out in the Activity Log. The Rolling Upgrade event will be under "Create or Update Virtual Machine Scale Set". Select "Change History" to review what is being updated. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-activity-log.png" alt-text="Screenshot showing the rolling upgrade details in the Activity Log.":::


### [CLI](#tab/cli2)

You can get the status of a rolling upgrade in progress using [az vmss rolling-upgrade get-latest](/cli/azure/vmss#az-vmss-rolling-upgrade)

```azure-cli
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
You can cancel a rolling upgrade in progress using the Azure Portal by selecting the "view details" in the banner above your scale set. In the pop up window, you will see the current status and at the bottom will be a "cancel upgrade". 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-cancel-portal.png" alt-text="Screenshot showing the rolling upgrade details in the Activity Log.":::


### [CLI](#tab/cli3)
You can stop a rolling upgrade in progress using [az vmss rolling-upgrade cancel](/cli/azure/vmss#az-vmss-rolling-upgrade)

```azurecli
az vmss rolling-upgrade cancel --name myScaleSet --resource-group myResourceGroup


```

### [PowerShell](#tab/powershell3)
You can stop a rolling upgrade in progress using [Stop-AzVmssRollingUpgrade](/powershell/module/az.compute/stop-azvmssrollingupgrade)


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

### [Portal](#tab/portal4)


### [CLI](#tab/cli4)

```azurecli
az vmss rolling-upgrade start
```
### [PowerShell](#tab/powershell4)

---

## Troubleshooting



## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).

