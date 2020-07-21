---
title: Manage Virtual Machine Scale Sets with Azure PowerShell
description: Common Azure PowerShell cmdlets to manage Virtual Machine Scale Sets, such as how to start and stop an instance, or change the scale set capacity.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: management
ms.date: 05/29/2018
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Manage a virtual machine scale set with Azure PowerShell

Throughout the lifecycle of a virtual machine scale set, you may need to run one or more management tasks. Additionally, you may want to create scripts that automate various lifecycle-tasks. This article details some of the common Azure PowerShell cmdlets that let you perform these tasks.

If you need to create a virtual machine scale set, you can [create a scale set with Azure PowerShell](quick-create-powershell.md).

[!INCLUDE [updated-for-az.md](../../includes/updated-for-az.md)]

## View information about a scale set
To view the overall information about a scale set, use [Get-AzVmss](/powershell/module/az.compute/get-azvmss). The following example gets information about the scale set named *myScaleSet* in the *myResourceGroup* resource group. Enter your own names as follows:

```powershell
Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```


## View VMs in a scale set
To view a list of VM instance in a scale set, use [Get-AzVmssVM](/powershell/module/az.compute/get-azvmssvm). The following example lists all VM instances in the scale set named *myScaleSet* and in the *myResourceGroup* resource group. Provide your own values for these names:

```powershell
Get-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

To view additional information about a specific VM instance, add the `-InstanceId` parameter to [Get-AzVmssVM](/powershell/module/az.compute/get-azvmssvm) and specify an instance to view. The following example views information about VM instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Enter your own names as follows:

```powershell
Get-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "0"
```


## Change the capacity of a scale set
The preceding commands showed information about your scale set and the VM instances. To increase or decrease the number of instances in the scale set, you can change the capacity. The scale set automatically creates or removes the required number of VMs, then configures the VMs to receive application traffic.

First, create a scale set object with [Get-AzVmss](/powershell/module/az.compute/get-azvmss), then specify a new value for `sku.capacity`. To apply the capacity change, use [Update-AzVmss](/powershell/module/az.compute/update-azvmss). The following example updates *myScaleSet* in the *myResourceGroup* resource group to a capacity of *5* instances. Provide your own values as follows:

```powershell
# Get current scale set
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

# Set and update the capacity of your scale set
$vmss.sku.capacity = 5
Update-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -VirtualMachineScaleSet $vmss
```

If takes a few minutes to update the capacity of your scale set. If you decrease the capacity of a scale set, the VMs with the highest instance IDs are removed first.


## Stop and start VMs in a scale set
To stop one or more VMs in a scale set, use [Stop-AzVmss](/powershell/module/az.compute/stop-azvmss). The `-InstanceId` parameter allows you to specify one or more VMs to stop. If you do not specify an instance ID, all VMs in the scale set are stopped. To stop multiple VMs, separate each instance ID with a comma.

The following example stops instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```powershell
Stop-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "0"
```

By default, stopped VMs are deallocated and do not incur compute charges. If you wish the VM to remain in a provisioned state when stopped, add the `-StayProvisioned` parameter to the preceding command. Stopped VMs that remain provisioned incur regular compute charges.


### Start VMs in a scale set
To start one or more VMs in a scale set, use [Start-AzVmss](/powershell/module/az.compute/start-azvmss). The `-InstanceId` parameter allows you to specify one or more VMs to start. If you do not specify an instance ID, all VMs in the scale set are started. To start multiple VMs, separate each instance ID with a comma.

The following example starts instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```powershell
Start-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "0"
```


## Restart VMs in a scale set
To restart one or more VMs in a scale set, use [Restart-AzVmss](/powershell/module/az.compute/restart-azvmss). The `-InstanceId` parameter allows you to specify one or more VMs to restart. If you do not specify an instance ID, all VMs in the scale set are restarted. To restart multiple VMs, separate each instance ID with a comma.

The following example restarts instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```powershell
Restart-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "0"
```


## Remove VMs from a scale set
To remove one or more VMs in a scale set, use [Remove-AzVmss](/powershell/module/az.compute/remove-azvmss). The `-InstanceId` parameter allows you to specify one or more VMs to remove. If you do not specify an instance ID, all VMs in the scale set are removed. To remove multiple VMs, separate each instance ID with a comma.

The following example removes instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```powershell
Remove-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "0"
```


## Next steps
Other common tasks for scale sets include how to [deploy an application](virtual-machine-scale-sets-deploy-app.md), and [upgrade VM instances](virtual-machine-scale-sets-upgrade-scale-set.md). You can also use Azure PowerShell to [configure auto-scale rules](virtual-machine-scale-sets-autoscale-overview.md).
