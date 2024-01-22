---
title: Reimage a virtual machine in a scale set
description: Learn how to reimage a virtual machine in a scale set
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/22/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy

---


## Reimage a virtual machine

Changes to the scale set OS, data disk Profile (such as admin username and password) and [Custom Data](../virtual-machines/custom-data.md) only apply to virtual machines created after the change in the scale set model. To bring existing virtual machines up-to-date, manually reimage each instance. 

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
Learn how to [set the Upgrade Policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.
