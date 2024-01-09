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

The Upgrade Policy for a Virtual Machine Scale Set determines how VMs are brought up-to-date with the latest scale set model. This includes updates such as changes to the OS version, adding or removing data disks, NIC updates, or other updates that apply to the scale set instances as a whole.  

> [!IMPORTANT]
> Upgrade Policies for Virtual Machine Scale Sets using Flexible Orchestration mode are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 
>
>Upgrade Policies for Virtual Machine Scale Sets using Uniform Orchestration mode are generally available (GA). 

## Upgrade Policy modes

Each Virtual Machine Scale Set has an associated Upgrade Policy that determines how VMs are brought up-to-date with the latest scale set model. The Upgrade Policies available are  **Automatic**, **Manual**, and **Rolling**. The Upgrade Policy you choose can impact the overall service uptime of your Virtual Machine Scale Set. 

Additionally, as your application processes traffic, there can be situations where you might want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be needed to perform additional or different tasks than the other members of the scale set. In these situations, [Instance Protection](virtual-machine-scale-sets-instance-protection.md) provides the additional controls needed to protect these instances from being upgraded along side the other instances in a scale set. 

### Automatic Upgrade Policy
When using an Automatic Upgrade Policy, the scale set makes no guarantees about the order of VMs being brought down. The scale set might take down all VMs at the same time when performing upgrades. 

Automatic Upgrade Policy is best suited for DevTest scenarios where you aren't concerned about the uptime of your instances while making changes to configurations and settings. 

If your scale set is part of a Service Fabric cluster, *Automatic* mode is the only available mode. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

### Manual Upgrade Policy
When using a Manual Upgrade Policy, you choose when to initiate an update to the scale set instances. Nothing happens automatically to the existing VMs when changes occur to the scale set model. New instances added to the scale set use the most update-to-date model available. 

Manual Upgrade policy is best suited for workloads where the instances in the scale set are composed of different configurations and each configuration might require different updates and changes.

### Rolling Upgrade Policy

When using a Rolling Upgrade Policy, the scale set performs updates in batches with an optional pause time in between. When using Rolling Upgrades, users can also configure upgrades to be completed across multiple availability zones at the same time. 

Rolling Upgrade Policy is best suited for Production workloads that require instances be available at all times to take traffic. Rolling Upgrades provides the safest way to upgrade instances to the latest model without compromising availability and uptime. 

When using a Rolling Upgrade Policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health.
 
## Exceptions to Upgrade Policies

Changes to the scale set OS, data disk Profile (such as admin username and password) and [Custom Data](../virtual-machines/custom-data.md) only apply to VMs created after the change in the scale set model. To bring existing VMs up-to-date, manually reimage each instance. 

> [!NOTE]
> Reimaging an instance will restoring it to it's initial state. The instance will be restarted, and any local data will be lost.

### [Portal](#tab/portal4)

In the menu under **Settings**, navigate to **Instances** and select the instances you want to reimage. Once selected, click the **Reimage** option.


:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/reimage-upgrade-1.png" alt-text="Screenshot showing reimaging scale set instances using the Azure portal.":::


### [CLI](#tab/cli4)
To reimage a specific instance using Azure CLI, use the [az vmss reimage](/cli/azure/vmss#az-vmss-reimage) command. The `instance-id` parameter refers to the ID of the instance if using Uniform Orchestration mode and the Instance name if using Flexible Orchestration mode. 

```azurecli-interactive
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
```

### [PowerShell](#tab/powershell4)
To reimage a specific instance using Azure PowerShell, use the [Set-AzVmssVM](/powershell/module/az.compute/set-azvmssvm) command.  The `instanceid` parameter refers to the ID of the instance if using Uniform Orchestration mode and the Instance name if using Flexible Orchestration mode. 

```azurepowershell-interactive
Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
```

### [REST API](#tab/rest4)
To reimage scale set instances using REST, use the [reimage](/rest/api/compute/virtualmachinescalesets/reimage) command. You can specify multiple instances to be reimaged in the request body. 

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/reimage?api-version={apiVersion}
```

**Request Body**
```HTTP
{
  "instanceIds": [
    "myScaleSet1",
    "myScaleSet2"
  ]
}



```
---

## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
