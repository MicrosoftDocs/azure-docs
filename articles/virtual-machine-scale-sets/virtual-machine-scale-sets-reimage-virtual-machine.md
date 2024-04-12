---
title: Reimage a virtual machine in a scale set
description: Learn how to reimage a virtual machine in a scale set.
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 02/06/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy

---

# Reimage a virtual machine

When updating an instance in a Virtual Machine Scale Set, there are some changes that can't be applied to existing instances without performing a reimage. Reimaging a virtual machine in a Virtual Machine Scale Set replaces the old OS disk with a new OS disk. This allows changes to the OS, data disk profile (such as admin username and password), and [custom data](../virtual-machines/custom-data.md) to be applied. To reimage a set of existing instances in a scale set, you must individually reimage each instance. 

If reimaging a virtual machine using an ephemeral OS disk, the instance is restored it to it's initial state and any local data is lost. For instances using nonephemeral OS disks, the retaining of old OS disk depends on the value of delete option of OS disk. For more information, see [set delete options when creating a virtual machine](../virtual-machines/delete.md)

Reimaging a virtual machine that was created outside of the scale set and later attached can only be reimaged if the virtual machine OS profile matches the OS profile of the scale set. 

## [Portal](#tab/portal)

In the menu under **Settings**, navigate to **Instances** and select the instances you want to reimage. Once selected, click the **Reimage** option.


:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/reimage-upgrade-1.png" alt-text="Screenshot showing reimaging scale set instances using the Azure portal.":::


## [CLI](#tab/cli)
To reimage a specific instance using Azure CLI, use the [az vmss reimage](/cli/azure/vmss#az-vmss-reimage) command. The `instance-id` parameter refers to the ID of the instance if using Uniform Orchestration mode and the Instance name if using Flexible Orchestration mode. 

```azurecli-interactive
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
```

## [PowerShell](#tab/powershell)
To reimage a specific instance using Azure PowerShell, use the [Set-AzVmssVM](/powershell/module/az.compute/set-azvmssvm) command.  The `instanceid` parameter refers to the ID of the instance if using Uniform Orchestration mode and the Instance name if using Flexible Orchestration mode. 

```azurepowershell-interactive
Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
```

## [REST API](#tab/rest)
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
Learn how to [set the Upgrade Policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.
