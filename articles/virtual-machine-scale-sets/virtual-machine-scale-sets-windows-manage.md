---
title: Manage Virtual Machine Scale Sets with Azure PowerShell | Microsoft Docs
description: Common Azure PowerShell cmdlets to manage Virtual Machine Scale Sets, such as how to start and stop an instance, or change the scale set capacity.
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: d35fa77a-de96-4ccd-a332-eb181d1f4273
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/05/2017
ms.author: iainfou

---
# Manage virtual machines in a virtual machine scale set
Use the tasks in this article to manage virtual machines in your virtual machine scale set.

Most of the tasks that involve managing a virtual machine in a scale set require that you know the instance ID of the machine that you want to manage. You can use [Azure Resource Explorer](https://resources.azure.com) to find the instance ID of a virtual machine in a scale set. You also use Resource Explorer to verify the status of the tasks that you finish.

See [How to install and configure Azure PowerShell](/powershell/azure/overview) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.


## View information about a scale set
To view the overall information about a scale set, use [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss). The following example gets information about the scale set named *myScaleSet* in the *myResourceGroup* resource group. Enter your own names as follows:

```powershell
Get-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

The output is similar to the following example:

```
```

## View VMs in a scale set
To view information about a specific VM instance in a scale set, use [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm). The following example gets information about instance *2* in the scale set named *myScaleSet* and in the *myResourceGroup* resource group. Provide your own values for these names:

```powershell
Get-AzureRmVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "2"
```

The output is similar to the following example:

```
```

To view a list of all VMs in a scale set, you can combine [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss) and [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm). The following example gets the information about a scale set named *myScaleSet* in *myResourceGroup), then loops through the number of instances and displays information on each:

```powershell
# Get current scale set
$scaleset = Get-AzureRmVmss `
  -ResourceGroupName myResourceGroup `
  -VMScaleSetName myScaleSet

# Loop through the instanaces in your scale set
for ($i=1; $i -le ($scaleset.Sku.Capacity - 1); $i++) {
    Get-AzureRmVmssVM -ResourceGroupName myResourceGroup `
      -VMScaleSetName myScaleSet `
      -InstanceId $i
}
```


## Stop and start VMs in a scale set
To stop one or more VMs in a scale set, use [Stop-AzureRmVmss](powershell/module/azurerm.compute/stop-azurermvmss). The `-InstanceId` parameter allows you to specify one or more VMs to stop. If you do not specify an instance ID, all VMs in the scale set are stopped. To stop multiple VMs, separate each instance ID with a comma.

The following example stops instances *1* and *3* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your values as follows:

```powershell
Stop-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "1","3"
```

By default, stopped VMs are deallocated and do not incur compute charges. If you wish the VM to remain in a provisioned state when stopped, add the `-StayProvisioned` parameter to the preceding command. Stopped VMs that remain provisioned incur regular compute charges.

In Resource Explorer, we can see that the status of the instance is **deallocated**:

    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "level": "Info",
        "displayStatus": "Provisioning succeeded",
        "time": "2016-03-15T01:25:17.8792929+00:00"
      },
      {
        "code": "PowerState/deallocated",
        "level": "Info",
        "displayStatus": "VM deallocated"
      }
    ]



```powershell
Start-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #
```

In Resource Explorer, we can see that the status of the instance is **running**:

    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "level": "Info",
        "displayStatus": "Provisioning succeeded",
        "time": "2016-03-15T02:10:08.0730839+00:00"
      },
      {
        "code": "PowerState/running",
        "level": "Info",
        "displayStatus": "VM running"
      }
    ]

You can start all the virtual machines in the scale set by not using the -InstanceId parameter.

## Stop a virtual machine in a scale set
Replace the quoted values with the name of your resource group and scale set. Replace *#* with the identifier of the virtual machine that you want to stop and then run it:

    

## Restart a virtual machine in a scale set
Replace the quoted values with the name of your resource group and the scale set. Replace *#* with the identifier of the virtual machine that you want to restart and then run it:

    Restart-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

You can restart all the virtual machines in the set by not using the -InstanceId parameter.

## Remove a virtual machine from a scale set
Replace the quoted values with the name of your resource group and the scale set. Replace *#* with the identifier of the virtual machine that you want to remove and then run it:  

    Remove-AzureRmVmss -ResourceGroupName "resource group name" –VMScaleSetName "scale set name" -InstanceId #

You can remove the virtual machine scale set all at once by not using the -InstanceId parameter.

## Change the capacity of a scale set
You can add or remove virtual machines by changing the capacity of the set. Get the scale set that you want to change, set the capacity to what you want it to be, and then update the scale set with the new capacity. In these commands, replace the quoted values with the name of your resource group and the scale set.

    $vmss = Get-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"
    $vmss.sku.capacity = 5
    Update-AzureRmVmss -ResourceGroupName "resource group name" -Name "scale set name" -VirtualMachineScaleSet $vmss 

If you are removing virtual machines from the scale set, the virtual machines with the highest ids are removed first.

