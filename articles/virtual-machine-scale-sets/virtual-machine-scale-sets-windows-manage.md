<properties
	pageTitle="Manage VMs in a Virtual Machine Scale Set | Microsoft Azure"
	description="Manage virtual machines in a virtual machine scale set using Azure PowerShell."
	services="virtual-machine-scale-sets"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machine-scale-sets"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2016"
	ms.author="davidmu"/>

# Manage virtual machines in a Virtual Machine Scale Set

Use the tasks in this article to manage virtual machine resources in your Virtual Machine Scale Set.

All of the tasks that involve managing a virtual machine in a scale set require that you know the instance ID of the machine that you want to manage. You can use [Azure Resource Explorer](https://resources.azure.com) to find the instance ID of a virtual machine in a scale set. You also use Resource Explorer to verify the status of the tasks that you finish.

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about how to install the latest version of Azure PowerShell, select the subscription that you want to use, and sign in to your Azure account.

## Display information about a virtual machine scale set

You can get general information about a scale set, which is also referred to as the instance view. Or, you can get more specific information, such as information about the resources in the set.

In this command, replace *resource group name* with the name of the resource group that contains the virtual machine scale set, *scale set name* with the name of the virtual machine scale set, and then run it:

    Get-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"

It returns something like this:

    Sku                   : Microsoft.Azure.Management.Compute.Models.Sku
    UpgradePolicy         : Microsoft.Azure.Management.Compute.Models.UpgradePolicy
    VirtualMachineProfile : Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetVMProfile
    ProvisioningState     : Succeeded
    OverProvision         :
    Id                    : /subscriptions/{subscription-id}/resourceGroups/myrg1/providers/Microsoft.Compute/virtualMachineScaleSets/myvmss1
    Name                  : myvmss1
    Type                  : Microsoft.Compute/virtualMachineScaleSets
    Location              : centralus
    Tags                  :

In this command, replace *resource group name* with the name of the resource group that contains the virtual machine scale set, *scale set name* with the name of the virtual machine scale set, and *#* with the instance identifier of the virtual machine that you want to get information about, and then run it:

    Get-AzureRmVmssVM -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #
        
It returns something like this:

    InstanceId         : 1
    Sku                : Microsoft.Azure.Management.Compute.Models.Sku
    LatestModelApplied : True
    InstanceView       :
    HardwareProfile    :
    StorageProfile     : Microsoft.Azure.Management.Compute.Models.StorageProfile
    OsProfile          : Microsoft.Azure.Management.Compute.Models.OSProfile
    NetworkProfile     : Microsoft.Azure.Management.Compute.Models.NetworkProfile
    DiagnosticsProfile :
    AvailabilitySet    :
    ProvisioningState  : Succeeded
    LicenseType        :
    Plan               :
    Resources          :
    Id                 : /subscriptions/{subscription-id}/resourceGroups/myrg1/providers/Microsoft.
                         Compute/virtualMachineScaleSets/myvmss1/virtualMachines/1
    Name               : myvmss1_1
    Type               : Microsoft.Compute/virtualMachineScaleSets/virtualMachines
    Location           : centralus
    Tags               :
        
## Start a virtual machine in a scale set

In this command, replace *resource group name* with the name of the resource group that contains the virtual machine scale set, *scale set name* with the name of the scale set, *#* with the identifier of the virtual machine that you want to start, and then run it:

    Start-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

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

You can start all of the virtual machines in the set by not using the -InstanceId parameter.
    
## Stop a virtual machine in a scale set

In this command, replace *resource group name* with the name of the resource group that contains the virtual machine scale set, *scale set name* with the name of the scale set, *#* with the identifier of the virtual machine that you want to stop, and then run it:

	Stop-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #

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
    
To stop a virtual machine and not deallocate it, use the -StayProvisioned parameter. You can stop all of the virtual machines in the set by not using the -InstanceId parameter.
    
## Restart a virtual machine in a scale set

In this command, replace *resource group name* with the name of the resource group that contains the virtual machine scale set, *scale set name* with the name of the scale set, *#* with the identifier of the virtual machine that you want to restart, and then run it:

	Restart-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name" -InstanceId #
    
You can restart all of the virtual machines in the set by not using the -InstanceId parameter.

## Remove a virtual machine from a scale set

In this command, replace *resource group name* with the name of the resource group that contains the virtual machine scale set, *scale set name* with the name of the scale set, *#* with the identifier of the virtual machine that you want to remove from the scale set, and then run it:  

	Remove-AzureRmVmss -ResourceGroupName "resource group name" –VMScaleSetName "scale set name" -InstanceId #

You can remove the virtual machine scale set all at once by not using the -InstanceId parameter.
