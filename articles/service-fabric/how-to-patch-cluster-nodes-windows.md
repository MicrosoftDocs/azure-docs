---
title: Patch the Windows operating system in your Service Fabric cluster 
description: Here's how to enable automatic OS image upgrades to patch Service Fabric cluster nodes running on Windows.
ms.topic: how-to
ms.date: 03/09/2021
---

# Patch the Windows operating system in your Service Fabric cluster

Getting [automatic OS image upgrades on your Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) is the best practice for keeping your operating system patched in Azure. Virtual Machine Scale Set based automatic OS image upgrades will require silver or greater durability on a scale set.

### Requirements for automatic OS image upgrades by Virtual Machine Scale Sets

-	Service Fabric [durability level](../service-fabric/service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster) is Silver or Gold, and not Bronze.
-	The Service Fabric extension on the scale set model definition must have TypeHandlerVersion 1.1 or above.
-	Durability level should be the same at the Service Fabric cluster and Service Fabric extension on the scale set model definition.
- An additional health probe or use of application health extension for Virtual Machine Scale Sets is not required.

Ensure that durability settings are not mismatched on the Service Fabric cluster and Service Fabric extension, as a mismatch will result in upgrade errors. Durability levels can be modified per the guidelines outlined on [this page](../service-fabric/service-fabric-cluster-capacity.md#changing-durability-levels).

With Bronze durability, automatic OS image upgrade isn't available. While [Patch Orchestration Application](service-fabric-patch-orchestration-application.md) (intended only for non-Azure hosted clusters) is *not recommended* for Silver or greater durability levels, it is your only option to automate Windows updates with respect to Service Fabric upgrade domains.

When using automatic OS image upgrades you should deprecate the use of the Patch Orchestration Application in the case you were using it before.

## Enable auto OS upgrades and disable Windows Update

When enabling automatic OS updates, you'll also need to disable Windows Update in the deployment template. Once you deploy these changes, all machines in the scale set will be reimaged and the scale set will be enabled for automatic updates.

> [!IMPORTANT]
> Service Fabric does not support in-VM upgrades where Windows Updates applies operating system patches without replacing the OS disk.


1. Enable automatic OS image upgrades and disable Windows Updates in the deployment template:
 
    ```json
    "virtualMachineProfile": { 
        "properties": {
          "upgradePolicy": {
            "automaticOSUpgradePolicy": {
              "enableAutomaticOSUpgrade":  true
            }
          }
        }
      }
    ```
    
    ```json
    "virtualMachineProfile": { 
        "osProfile": { 
            "windowsConfiguration": { 
                "enableAutomaticUpdates": false 
            }
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
