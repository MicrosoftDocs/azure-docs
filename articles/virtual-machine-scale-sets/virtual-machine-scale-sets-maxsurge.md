---
title: Rolling upgrades with MaxSurge for Virtual Machine Scale Sets (preview)
description: Learn about how to utilize rolling upgrades with MaxSurge on Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date: 7/19/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Rolling upgrades with MaxSurge on Virtual Machine Scale Sets (Preview)

> [!NOTE]
> Rolling upgrades with MaxSurge for Virtual Machine Scale Sets with Uniform Orchestration is in general availability (GA). 
>
> **Rolling upgrades with MaxSurge for Virtual Machine Scale Sets with Flexible Orchestration is currently in preview.** 
>
> Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 

Rolling upgrades with MaxSurge can help improve service uptime during upgrade events. With MaxSurge enabled, new instances are created in batches using the latest scale model. When the batch of new instances are fully created and healthy, they begin taking traffic. The scale set then deletes instances in batches matching the old scale set model. The process continues until all instances are brought up-to-date. 

## Concepts

> [!NOTE]
> [Automatic OS image upgrades](virtual-machine-scale-sets-automatic-upgrade.md) and [automatic extension upgrades](../virtual-machines/automatic-extension-upgrade.md) automatically inherit the rolling upgrade policy and use it to perform upgrades. 

|Setting | Description |
|---|---|
|**Rolling upgrade batch size %** | Specifies how many of the total instances of your scale set you want to be upgraded at one time. <br><br>Example: A batch size of 20% when you have 10 instances in your scale set results in upgrade batches with two instances each. When using MaxSurge, this results in 2 additional instances being created in each batch. |
|**Pause time between batches (sec)** | Specifies how long you want your scale set to wait between upgrading batches.<br><br> Example: A pause time of 10 seconds means that once a batch is successfully completed, the scale set will wait 10 seconds before moving onto the next batch. |
|**Max unhealthy instance %** | Specifies the total number of instances allowed to be marked as unhealthy before and during the rolling upgrade. <br><br>Example: A max unhealthy instance % of 20 means if you have a scale set of 10 instances and more than two instances in the entire scale set report back as unhealthy, the rolling upgrade stops. |
|**Max unhealthy upgrade %**| Specifies the total number of instances allowed to be marked as unhealthy after being upgraded. <br><br>Example: A max unhealthy upgrade % of 20 means if you have a scale set of 10 instances and more than two instances in the entire scale set report back as unhealthy after being upgraded, the rolling upgrade is canceled. <br><br>Max unhealthy upgrade % is an important setting because it allows the scale set to catch unstable or poor updates before they roll out to the entire scale set. |
|**Prioritize unhealthy instances** | Tells the scale set to upgrade instances marked as unhealthy before upgrading instances marked as healthy. <br><br>Example: If some instances in your scale set that show as failed or unhealthy when a rolling upgrade begins, the scale set updates those instances first. |
|**Enable cross-zone upgrade** | Allows the scale set to ignore Availability Zone boundaries when determining batches. |


## MaxSurge vs in place upgrades

Rolling upgrades with MaxSurge creates new instances with the latest scale set model to replace instances running with the old model. By creating new instances, you can ensure that your scale set capacity doesn't drop below the set instance count during the duration of the upgrade process. 

:::image type="content" source="./media/upgrade-policy/maxsurge-upgrade.png" alt-text="Diagram that shows the process of performing a rolling upgrade with MaxSurge.":::

Rolling upgrades with MaxSurge disabled performs upgrades in place. Meaning the virtual machine undergoing the upgrade will not be available for traffic during the upgrade process. This reduces your scale set capacity during the upgrade process but does not consume any extra quota. 

:::image type="content" source="./media/upgrade-policy/in-place-upgrade.png" alt-text="Diagram that shows the process of performing a rolling upgrade without maxsurge.":::

## Configure rolling upgrades with MaxSurge
Enabling or disabling MaxSurge can be done at any point in time. This includes during or after scale set provisioning. When using a rolling upgrade policy, the scale set must also use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md). It's suggested to create the scale set with a manual upgrade policy and update the policy to rolling after successfully confirming the application health is being properly reported. 


### [Portal](#tab/portal)

Select the Virtual Machine Scale Set you want to change the upgrade policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select **Rolling - Upgrades roll out in batches with optional pause**. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-policy-portal.png" alt-text="Screenshot showing updating the upgrade policy and enabling MaxSurge in the Azure portal.":::

### [CLI](#tab/cli)
Update an existing Virtual Machine Scale Set using [az vmss update](/cli/azure/vmss#az-vmss-update). 

```azurecli-interactive
az vmss update \
	--name myScaleSet \
	--resource-group myResourceGroup \
  --set upgradePolicy.mode=Rolling \
	--max-batch-instance-percent 10 \
	--max-unhealthy-instance-percent 20 \
	--max-unhealthy-upgraded-instance-percent 20 \
	--prioritize-unhealthy-instances true \
	--pause-time-between-batches PT2S \
	--max-surge true 

```

### [PowerShell](#tab/powershell)
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

### [ARM Template](#tab/template)

Update the properties section of your ARM template and set the upgrade policy to rolling and various rolling upgrade options.  


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
## Frequently asked questions 

### Is MaxSurge generally available for Virtual Machine Scale Sets with Uniform Orchestration? 
Yes. All upgrade policies including rolling upgrades with MaxSurge are generally available for Virtual Machine Scale Sets with Uniform Orchestration. 


### Is MaxSurge generally available for Virtual Machine Scale Sets with Flexible Orchestration? 
No. All upgrade policies including rolling upgrades with MaxSurge are in Public Preview for Virtual Machine Scale Sets with Flexible Orchestration. 

### Do MaxSurge upgrades require more quota? 
Yes. When using rolling upgrades with MaxSurge, new virtual machines are created using the latest scale set model to replace virtual machines using the old scale set model. These newly created virtual machines counts towards your overall core quota. 

### Do MaxSurge upgrades require additional IP addresses? 
Yes. These newly created virtual machines have new IP addresses and count towards your total allowed IP addresses available per your subscription. 

### Do MaxSurge upgrades require additional subnet space? 
Yes. These newly created virtual machines have new IP addresses and there needs to be enough space available in the specified subnet to be added.

### What triggers a MaxSurge upgrade? 
Any changes that result in an update to the scale set model result in a MaxSurge upgrade. This includes upgrades that generally don't require a restart such as adding Data Disks. 

### Can I cancel a MaxSurge upgrade? 
Yes. The process of canceling a MaxSurge upgrade is the same as canceling an in place rolling upgrade. You can stop the upgrade from the Azure portal, CLI, PowerShell, or any other SDK. 

### What happens if the newly created virtual machine enters a failed state during a MaxSurge upgrade? 
During a MaxSurge upgrade, new virtual machines are created to replace virtual machines running the old model. If the newly created virtual machine fails to enter a healthy state, that virtual machine is deleted and the rolling upgrade is canceled. 



## Next steps
Learn how to [set the upgrade policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.

