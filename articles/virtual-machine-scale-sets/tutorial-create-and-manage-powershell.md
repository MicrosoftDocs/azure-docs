---
title: 'Tutorial: Create and manage a Virtual Machine Scale Set with Azure PowerShell'
description: Learn how to use Azure PowerShell to create a Virtual Machine Scale Set, along with some common management tasks such as how to start and stop an instance, or change the scale set capacity.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell

---
# Tutorial: Create and manage a Virtual Machine Scale Set with Azure PowerShell
<<<<<<< HEAD
A Virtual Machine Scale Set allows you to deploy and manage a set of virtual machines. Throughout the lifecycle of a Virtual Machine Scale Set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a resource group
> * Create a Virtual Machine Scale Set
> * Scale out and in
> * Stop, Start and restart VM instances
=======

> [!NOTE]
> This tutorial uses Uniform Orchestration mode. We recommend using Flexible Orchestration for new workloads. For more information, see [Orchesration modes for Virtual Machine Scale Sets in Azure](virtual-machine-scale-sets-orchestration-modes.md).

A Virtual Machine Scale Set allows you to deploy and manage a set of identical, auto-scaling virtual machines. Throughout the lifecycle of a Virtual Machine Scale Set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create and connect to a Virtual Machine Scale Set
> * Select and use VM images
> * View and use specific VM instance sizes
> * Manually scale a scale set
> * Perform common scale set management tasks
>>>>>>> fdaeacd2ccb02d3b63f855b1d0cc6c10e96bb1ce

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az.md](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]



## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a Virtual Machine Scale Set. Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. In this example, a resource group named *myResourceGroup* is created in the *EastUS* region. 

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName "myResourceGroup" -Location "EastUS"
```
The resource group name is specified when you create or modify a scale set throughout this tutorial.


## Create a Virtual Machine Scale Set
First, set an administrator username and password for the VM instances with [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential):

```azurepowershell-interactive
$cred = Get-Credential
```

<<<<<<< HEAD
Now create a Virtual Machine Scale Set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, and allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985:
=======
Now create a Virtual Machine Scale Set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985:
>>>>>>> fdaeacd2ccb02d3b63f855b1d0cc6c10e96bb1ce

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Flexible" `
  -Location "EastUS" `
  -Credential $cred
```

It takes a few minutes to create and configure all the scale set resources and VM instances. To distribute traffic to the individual VM instances, a load balancer is also created.

## View the VM instances in a scale set
To view a list of VM instances in a scale set, use [Get-AzVM](/powershell/module/az.compute/get-azvm) as follows:

```azurepowershell-interactive
Get-AzVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

The following example output shows two VM instances in the scale set:

```powershell
ResourceGroupName                Name Location          VmSize  OsType      ProvisioningState 
-----------------                ---- --------          ------  ------       ----------------- 
myResourceGroup   myScaleSet_instance1   eastus Standard_DS1_v2 Windows         Succeeded     
myResourceGroup   myScaleSet_instance2   eastus Standard_DS1_v2 Windows         Succeeded     
```

To view additional information about a specific VM instance, use [Get-AzVM](/powershell/module/az.compute/get-azvm) and specify the VM name.

```azurepowershell-interactive
Get-AzVM -ResourceGroupName "myResourceGroup" -name "myScaleSet_instance1" 
```
<<<<<<< HEAD
=======
## Allow remote desktop traffic

>[!IMPORTANT]
>Exposing the RDP port 3389 is only recommended for testing. For production environments, we recommend using a VPN or private connection.

To allow access using remote desktop, create a network security group with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) and [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup). For more information, see [Networking for Azure Virtual Machine Scale Sets](virtual-machine-scale-sets-networking.md).

 ```azurepowershell-interactive
 # Get information about the scale set
 $vmss = Get-AzVmss `
             -ResourceGroupName "myResourceGroup" `
             -VMScaleSetName "myScaleSet"

 #Create a rule to allow traffic over port 3389
 $nsgFrontendRule = New-AzNetworkSecurityRuleConfig `
   -Name myFrontendNSGRule `
   -Protocol Tcp `
   -Direction Inbound `
   -Priority 200 `
   -SourceAddressPrefix * `
   -SourcePortRange * `
   -DestinationAddressPrefix * `
   -DestinationPortRange 3389 `
   -Access Allow

 #Create a network security group and associate it with the rule
 $nsgFrontend = New-AzNetworkSecurityGroup `
   -ResourceGroupName  "myResourceGroup" `
   -Location EastUS `
   -Name myFrontendNSG `
   -SecurityRules $nsgFrontendRule

 $vnet = Get-AzVirtualNetwork `
   -ResourceGroupName  "myResourceGroup" `
   -Name myVnet
>>>>>>> fdaeacd2ccb02d3b63f855b1d0cc6c10e96bb1ce

```output
ResourceGroupName      : myresourcegroup
Id                     : /subscriptions/resourceGroups/myresourcegroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_instance1
VmId                   : d27b5fde-d469-4087-b08f-87d0bd8df786
Name                   : myScaleSet_instance1
Type                   : Microsoft.Compute/virtualMachines
Location               : eastus
Tags                   : {}
HardwareProfile        : {VmSize}
NetworkProfile         : {NetworkInterfaces}
OSProfile              : {ComputerName, AdminUsername, WindowsConfiguration, Secrets, AllowExtensionOperations, RequireGuestProvisionSignal}
ProvisioningState      : Succeeded
StorageProfile         : {ImageReference, OsDisk, DataDisks}
VirtualMachineScaleSet : {Id}
TimeCreated            : 11/16/2022 11:02:02 PM
```

## Create a scale set with a specific VM instance size

When you created a scale set at the start of the tutorial, a default VM SKU of *Standard_D1_v2* was provided for the VM instances. You can specify a different VM instance size with the `-VMSize` parameter to specify a VM instance size of *Standard_F1*. 

```azurecli-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Flexible" `
  -VMSize "Standard_F1"
  -Location "EastUS" `
  -Credential $cred
```


## Change the capacity of a scale set
When you created a scale set, two VM instances were deployed by default. To increase or decrease the number of VM instances in the scale set, you can manually change the capacity. The scale set creates or removes the required number of VM instances, then configures the load balancer to distribute traffic.

First, create a scale set object with [Get-AzVmss](/powershell/module/az.compute/get-azvmss), then specify a new value for `sku.capacity`. To apply the capacity change, use [Update-AzVmss](/powershell/module/az.compute/update-azvmss). The following example sets the number of VM instances in your scale set to *3*:

```azurepowershell-interactive
# Get current scale set
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

# Set and update the capacity of your scale set
$vmss.sku.capacity = 3
Update-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -VirtualMachineScaleSet $vmss 
```

It takes a few minutes to update the capacity of your scale set. To see the number of instances you now have in the scale set, use [Get-Az](/powershell/module/az.compute/get-azvm):

```azurepowershell-interactive
Get-AzVm -ResourceGroupName "myResourceGroup" 
```

The following example output shows that the capacity of the scale set is now *3*:

```powershell
ResourceGroupName                Name Location          VmSize  OsType    ProvisioningState 
-----------------                ---- --------          ------  ------    ----------------- 
myResourceGroup   myScaleSet_instance1   eastus Standard_DS1_v2 Windows       Succeeded     
myResourceGroup   myScaleSet_instance2   eastus Standard_DS1_v2 Windows       Succeeded     
myResourceGroup   myScaleSet_instance3   eastus Standard_DS1_v2 Windows       Succeeded   
```


## Stop and deallocate VM instances in a scale set
To stop all the VM instances in a scale set, use [Stop-AzVmss](/powershell/module/az.compute/stop-azvmss). 

```azurepowershell-interactive
Stop-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

To stop individual VM instances, use [Stop-AzVm](/powershell/module/az.compute/stop-azvm) and specify the instance name.

```powershell-interactive
Stop-AzVM -ResourceGroupName "myResourceGroup" -name "myScaleSet_instance1"
```

By default, stopped VMs are deallocated and don't incur compute charges. If you wish the VM to remain in a provisioned state when stopped, add the `-StayProvisioned` parameter to the preceding command. Stopped VMs that remain provisioned incur regular compute charges.

## Start VM instances in a scale set
To start all the VM instances in a scale set, use [Start-AzVmss](/powershell/module/az.compute/start-azvmss).

```azurepowershell-interactive
Start-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" 
```

To start an individual VM instance in a scale set, use [Start-AzVM](/powershell/module/az.compute/start-azvm) and specify the instance name.

```powershell-interactive
Start-AzVM -ResourceGroupName "myResourceGroup" -name "myScaleSet_instance1"
```

## Restart VM instances in a scale set
To restart all the VMs in a scale set, use [Restart-AzVmss](/powershell/module/az.compute/restart-azvmss). 

```azurepowershell-interactive
Restart-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```
To restart an individual instance, use [Restart-AzVM] and specify the instance name.

```powershell-interactive
Restart-AzVM -ResourceGroupName "myResourceGroup" -name "myScaleSet_instance1"
```

## Clean up resources
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `-Force` parameter confirms that you wish to delete the resources without an extra prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup" -Force -AsJob
```


## Next steps
In this tutorial, you learned how to perform some basic scale set creation and management tasks with Azure PowerShell:

> [!div class="checklist"]
<<<<<<< HEAD
> * Create a resource group
> * Create a scale set
=======
> * Create and connect to a Virtual Machine Scale Set
> * Select and use VM images
>>>>>>> fdaeacd2ccb02d3b63f855b1d0cc6c10e96bb1ce
> * View and use specific VM sizes
> * Manually scale a scale set
> * Perform common scale set management tasks such as stopping, starting and restarting your scale set

Advance to the next tutorial to learn how to connect to your scale set instances.

> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-powershell.md)
