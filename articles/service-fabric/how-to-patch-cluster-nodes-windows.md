---
title: Patch the Windows operating system in your Service Fabric cluster 
description: Here's how to enable automatic OS image upgrades to patch Service Fabric cluster nodes running on Windows.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Patch the Windows operating system in your Service Fabric cluster

Getting [automatic OS image upgrades on your Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) is the best practice for keeping your operating system patched in Azure. Virtual Machine Scale Set based automatic OS image upgrades will require silver or greater durability on a scale set.

## Requirements for automatic OS image upgrades by Virtual Machine Scale Sets

- Service Fabric [durability level](service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster) is Silver or Gold, and not Bronze.
- The Service Fabric extension on the scale set model definition must have TypeHandlerVersion 1.1 or above.
- Durability level should be the same at the Service Fabric cluster and Service Fabric extension on the scale set model definition.
- An additional health probe or use of application health extension for Virtual Machine Scale Sets is not required.
- Stateless nodetypes are the only exception, which have durability as Bronze, but automatic OS image upgrades can still be configured on them. For more information, see [Deploy an Azure Service Fabric cluster with stateless-only node types](service-fabric-stateless-node-types.md).

Ensure that durability settings are not mismatched on the Service Fabric cluster and Service Fabric extension, as a mismatch will result in upgrade errors. Durability levels can be modified per the guidelines outlined on [this page](service-fabric-cluster-capacity.md#changing-durability-levels).

With Bronze durability, automatic OS image upgrade isn't available. While [Patch Orchestration Application](service-fabric-patch-orchestration-application.md) (intended only for non-Azure hosted clusters) is *not recommended* for Silver or greater durability levels, it is your only option to automate Windows updates with respect to Service Fabric upgrade domains.

If you want to switch from Patch Orchestration Application to automatic OS image upgrade, you must first deprecate the use of Patch Orchestration Application.

## Enable auto OS upgrades and disable Windows Update

When enabling automatic OS updates, you'll also need to disable Windows Update in the deployment template. Once you deploy these changes, all machines in the scale set will be reimaged and the scale set will be enabled for automatic updates.

> [!IMPORTANT]
> Service Fabric does not support in-VM upgrades where Windows Updates applies operating system patches without replacing the OS disk.

> [!NOTE]
> When managed disks are used ensure that Custom Extension script for mapping managed disks to drive letters handles reimage of the VM correctly.  See [Create a Service Fabric cluster with attached data disks](../virtual-machine-scale-sets/virtual-machine-scale-sets-attached-disks.md#create-a-service-fabric-cluster-with-attached-data-disks) for an example script that handles reimage of VMs with managed disks correctly.

1. Enable automatic OS image upgrades and disable Windows Updates in the deployment template:

    ```json
    "properties": {
       "upgradePolicy": {
         "mode": "Automatic",
          "automaticOSUpgradePolicy": {
            "enableAutomaticOSUpgrade": true
          }
        }
    }
    ```
   
    
    ```json
    "osProfile": { 
       "windowsConfiguration": { 
         "enableAutomaticUpdates": false 
        }
    }
    ```

    ```azurepowershell-interactive
    Update-AzVmss -ResourceGroupName $resourceGroupName -VMScaleSetName $scaleSetName -AutomaticOSUpgrade $true -EnableAutomaticUpdate $false
    ```

1. Update the scale set model. After this configuration change, a reimage of all machines is needed to update the scale set model for the change to take effect:

    ```azurepowershell-interactive
    $scaleSet = Get-AzVmssVM -ResourceGroupName $resourceGroupName -VMScaleSetName $scaleSetName
    $instances = foreach($vm in $scaleSet)
    {
        Set-AzVmssVM -ResourceGroupName $resourceGroupName -VMScaleSetName $scaleSetName -InstanceId $vm.InstanceID -Reimage
    }
    ```

## Next steps

Learn how to enable [automatic OS image upgrades on Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md).