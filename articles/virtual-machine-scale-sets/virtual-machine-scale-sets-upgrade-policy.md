---
title: Upgrade Policies for Virtual Machine Scale Sets
description: Learn about the different upgrade policies available for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 02/28/2023
ms.reviewer: ju-shim
ms.custom: 

---
# Upgrade Policies for Virtual Machine Scale Sets

Scale sets have an "upgrade policy" that determines how VMs are brought up-to-date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic** - In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- **Rolling** - In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
    - **MaxSurge** True
    - **MaxSurge** False 
- **Manual** - In this mode, when you update the scale set model, nothing happens to existing VMs.
 
To update existing VMs, you must do a "manual upgrade" of each existing VM. You can do this manual upgrade with:

- REST API with [compute/virtualmachinescalesets/updateinstances](/rest/api/compute/virtualmachinescalesets/updateinstances) as follows:

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/manualupgrade?api-version={apiVersion}
    ```

- Azure PowerShell with [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance):
    
    ```powershell
    Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
    ```

- Azure CLI with [az vmss update-instances](/cli/azure/vmss)

    ```azurecli
    az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
    ```

   > [!NOTE]
   > The `az vmss update-instances` command will manually upgrade the selected instance to the latest model. While upgrading, the instance may be restarted.

- You can also use the language-specific [Azure SDKs](https://azure.microsoft.com/downloads/).

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

There is one type of modification to global scale set properties that does not follow the upgrade policy. Changes to the scale set OS and Data disk Profile (such as admin username and password) can only be changed in API version *2017-12-01* or later. These changes only apply to VMs created after the change in the scale set model. To bring existing VMs up-to-date, you must do a "reimage" of each existing VM. You can do this reimage via:

- REST API with [compute/virtualmachinescalesets/reimage](/rest/api/compute/virtualmachinescalesets/reimage) as follows:

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/reimage?api-version={apiVersion}
    ```

- Azure PowerShell with [Set-AzVmssVm](/powershell/module/az.compute/set-azvmssvm):

    ```powershell
    Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
    ```

- Azure CLI with [az vmss reimage](/cli/azure/vmss):

    ```azurecli
    az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
    ```

   > [!NOTE]
   > The `az vmss reimage` command will reimage the selected instance, restoring it to the initial state. The instance may be restarted, and any local data will be lost.

- You can also use the language-specific [Azure SDKs](https://azure.microsoft.com/downloads/).



## Next steps
You can also perform common management tasks on scale sets with the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
