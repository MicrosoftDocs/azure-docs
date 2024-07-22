---
title: Rolling upgrades with MaxSurge for Virtual Machine Scale Sets (Preview)
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
> Rolling upgrades with MaxSurge for Virtual Machine Scale sets with Uniform Orchestration is in general availability (GA). 
>
> **Rolling upgrades with MaxSurge for Virtual Machine scale Sets with Flexible Orchestration is currently in preview.** 
>
> Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 

Rolling upgrades with MaxSurge can help improve service uptime during upgrade events. 

With MaxSurge enabled, new instances are created  in batches using the latest scale model. Once the batch of new instances are successfully created and marked as healthy, they begin taking traffic. The scale set then deletes instances in batches matching the old scale set model. This continues until all instances are brought up-to-date. 


## How it works

Rolling upgrades with MaxSurge creates new instances with the latest scale set model to replace instances running with the old model. By creating new instances, you can ensure that your scale set capacity doesn't drop below the set instance count during the duration of the upgrade process. 

:::image type="content" source="./media/upgrade-policy/maxsurge-upgrade-2.png" alt-text="Diagram that shows the process of performing a rolling upgrade with MaxSurge.":::

When performing a rolling upgrade without MaxSurge, the instances in the scale set are brought down in place, this ensures the virtual machine names remain the same and existing IP addresses can be reused. However, this type of upgrade reduces the total scale set capacity during the upgrade process and in turn results in less instances available to serve traffic during that upgrade process. 

:::image type="content" source="./media/upgrade-policy/in-place-upgrade-2.png" alt-text="Diagram that shows the process of performing an in place rolling upgrade without MaxSurge.":::

## Configure rolling upgrades with MaxSurge
Enabling or disabling MaxSurge can be done at any point in time. This includes during or after scale set provisioning. When using a rolling upgrade policy, the scale set must also use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md). It's' suggested to first created your scale set with a manual upgrade policy and update the policy to rolling after successfully confirming the application health is being properly reported. 


### [Portal](#tab/portal1)

Select the Virtual Machine Scale Set you want to change the upgrade policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop-down menu, select **Rolling - Upgrades roll out in batches with optional pause**. 

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/rolling-upgrade-policy-portal.png" alt-text="Screenshot showing updating the upgrade policy and enabling MaxSurge in the Azure portal.":::

### [CLI](#tab/cli1)
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
Yes. When using rolling upgrades with MaxSurge, new VMs are created using the latest scale set model to replace VMs using the old scale set model. These newly created virtual machines will count towards your overall core quota. 

### Do MaxSurge upgrades require additional IP addresses? 
Yes. These newly created virtual machines will have new IP addresses and count towards your total allowed IP addresses available per your subscription. 

### Do MaxSurge upgrades require additional subnet space? 
Yes. These newly created virtual machines will have new IP addresses and there needs to be enough space available in the specified subnet to be added.

### What triggers a MaxSurge upgrade? 
Any changes that result in an update to the scale set model will result in a MaxSurge upgrade. This includes upgrades that generally do not require a restart such as adding Data Disks. 

### Can I cancel a MaxSurge upgrade? 
Yes. The process of canceling a MaxSurge upgrade is the same as canceling an in place rolling upgrade. You can stop the upgrade from the Azure Portal, CLI, PowerShell or any other popular SDK. 

### What happens if the newly created virtual machine enters a failed state during a MaxSurge upgrade? 
During an MaxSurge upgrade, new virtual machines are created to replace virtual machines running the old model. If the newly created virtual machine fails to enter a health state, for example, the application health extension fails to report healthy, the newly created virtual machine will be deleted and the rolling upgrade will be canceled. 



## Next steps
Learn how to [set the upgrade policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.

