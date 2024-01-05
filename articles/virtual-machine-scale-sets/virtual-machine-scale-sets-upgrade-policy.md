---
title: Manage Upgrade Policies for Virtual Machine Scale Sets
description: Learn about the different upgrade policies available for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/04/2024
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Upgrade Policies for Virtual Machine Scale Sets

The Upgrade Policy for a Virtual Machine Scale Set determines how VMs are brought up-to-date with the latest scale set model. This includes updates such as changes to the OS version, adding or removing data disks, NIC updates, or additional updates that apply to the scale set instances as a whole.  

> [!IMPORTANT]
> Upgrade Policies for Virtual Machine Scale Sets using Flexible Orchestration Mode are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

## Upgrade Policy modes


There are three different modes an Upgrade Policy can be set to. The modes are **Automatic**, **Rolling** and **Manual**. The upgrade mode you choose can impact the overall service uptime of your Virtual Machine Scale Set. 

Additionally, as your application processes traffic, there can be situations where you might want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be needed to perform additional or different tasks than the other members of the scale set. You might require these 'special' VMs not to be modified with the other instances in the scale set. In these situations, [Instance Protection](virtual-machine-scale-sets-instance-protection.md) provides the additional controls needed to protect these instances from the various upgrades discussed in this article.

### Manual
In this mode, you choose when to initiate an update to the scale set instances. Nothing happens automatically to the existing VMs when changes occur to the scale set model. New instances added to the scale set use the most update-to-date model available.

### Automatic 
In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set might take down all VMs at the same time when performing upgrades. If your scale set is part of a Service Fabric cluster, *Automatic* mode is the only available mode. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).
In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set might take down all VMs at the same time when performing upgrades. If your scale set is part of a Service Fabric cluster, *Automatic* mode is the only available mode. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

### Rolling

In this mode, the scale set performs updates in batches with an optional pause time in between. There are two types of Rolling Upgrade Policies that can be configured:

-  **Rolling Upgrades with MaxSurge disabled**
    
    With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances will begin taking traffic again, and the next batch will begin. This continues until all instances brought up-to-date. 

-  **Rolling Upgrades with MaxSurge enabled**

    > [!IMPORTANT]
    > Rolling Upgrades with MaxSurge is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 
        
    With MaxSurge enabled, new instances are created in the scale set using the latest scale model in batches. Once the batch of new instances is successfully created and marked as healthy, instances matching the old scale set model are deleted. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. 


When using a Rolling Upgrade Policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health.
 
## Exceptions to Upgrade Policies

Changes to the scale set OS, data disk Profile (such as admin username and password) and [Custom Data](../virtual-machines/custom-data.md) only apply to VMs created after the change in the scale set model. To bring existing VMs up-to-date, you must do a "reimage" of each existing VM. 

> [!NOTE]
> The Reimage flag will reimage the selected instance, restoring it to the initial state. The instance may be restarted, and any local data will be lost.

### [Portal](#tab/portal4)

Select the Virtual Machine Scale Set you want to perform instance upgrades for. In the menu under **Settings**, select **Instances** and select the instances you want to reimage. Once selected, click the **Reimage** option.


:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/reimage-upgrade-1.png" alt-text="Screenshot showing reimaging scale set instances using the Azure portal.":::


### [CLI](#tab/cli4)
Reimage a Virtual Machine Scale Set instance using [az vmss reimage](/cli/azure/vmss#az-vmss-reimage).

```azurecli-interactive
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
```

### [PowerShell](#tab/powershell4)
Reimage a Virtual Machine Scale Set instance using [Set-AzVmssVM](/powershell/module/az.compute/set-azvmssvm).

```azurepowershell-interactive
Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
```

### [REST API](#tab/rest4)
Reimage a Virtual Machine Scale Set instance using [reimage](/rest/api/compute/virtualmachinescalesets/reimage).

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/reimage?api-version={apiVersion}
```
---

## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
