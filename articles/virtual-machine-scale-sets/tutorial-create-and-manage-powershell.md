---
title: Tutorial - Create and manage an Azure virtual machine scale set | Microsoft Docs
description: Learn how to use Azure PowerShell to create a virtual machine scale set, along with some common management tasks such as how to start and stop an instance, or change the scale set capacity.
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/18/2018
ms.author: cynthn
ms.custom: mvc

---
# Tutorial: Create and manage a virtual machine scale set with Azure PowerShell
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. Throughout the lifecycle of a virtual machine scale set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create and connect to a virtual machine scale set
> * Select and use VM images
> * View and use specific VM instance sizes
> * Manually scale a scale set
> * Perform common scale set management tasks

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 6.0.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure. 


## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine scale set. Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. In this example, a resource group named *myResourceGroup* is created in the *EastUS* region. 

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName "myResourceGroup" -Location "EastUS"
```
The resource group name is specified when you create or modify a scale set throughout this tutorial.


## Create a scale set
First, set an administrator username and password for the VM instances with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Now create a virtual machine scale set with [New-AzureRmVmss](/powershell/module/azurerm.compute/new-azurermvmss). To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985:

```azurepowershell-interactive
New-AzureRmVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -Location "EastUS" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -Credential $cred
```

It takes a few minutes to create and configure all the scale set resources and VM instances.


## View the VM instances in a scale set
To view a list of VM instances in a scale set, use [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm) as follows:

```azurepowershell-interactive
Get-AzureRmVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

The following example output shows two VM instances in the scale set:

```powershell
ResourceGroupName         Name Location             Sku InstanceID ProvisioningState
-----------------         ---- --------             --- ---------- -----------------
MYRESOURCEGROUP   myScaleSet_0   eastus Standard_DS1_v2          0         Succeeded
MYRESOURCEGROUP   myScaleSet_1   eastus Standard_DS1_v2          1         Succeeded
```

To view additional information about a specific VM instance, add the `-InstanceId` parameter to [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm). The following example views information about VM instance *1*:

```azurepowershell-interactive
Get-AzureRmVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "1"
```


## List connection information
A public IP address is assigned to the load balancer that routes traffic to the individual VM instances. By default, Network Address Translation (NAT) rules are added to the Azure load balancer that forwards remote connection traffic to each VM on a given port. To connect to the VM instances in a scale set, you create a remote connection to an assigned public IP address and port number.

To list the NAT ports to connect to VM instances in a scale set, first get the load balancer object with [Get-AzureRmLoadBalancer](/powershell/module/AzureRM.Network/Get-AzureRmLoadBalancer). Then, view the inbound NAT rules with [Get-AzureRmLoadBalancerInboundNatRuleConfig](/powershell/module/AzureRM.Network/Get-AzureRmLoadBalancerInboundNatRuleConfig):

```azurepowershell-interactive
# Get the load balancer object
$lb = Get-AzureRmLoadBalancer -ResourceGroupName "myResourceGroup" -Name "myLoadBalancer"

# View the list of inbound NAT rules
Get-AzureRmLoadBalancerInboundNatRuleConfig -LoadBalancer $lb | Select-Object Name,Protocol,FrontEndPort,BackEndPort
```

The following example output shows the instance name, public IP address of the load balancer, and port number that the NAT rules forward traffic to:

```powershell
Name             Protocol FrontendPort BackendPort
----             -------- ------------ -----------
myScaleSet3389.0 Tcp             50001        3389
myScaleSet5985.0 Tcp             51001        5985
myScaleSet3389.1 Tcp             50002        3389
myScaleSet5985.1 Tcp             51002        5985
```

The *Name* of the rule aligns with the name of the VM instance as shown in a previous [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm) command. For example, to connect to VM instance *0*, you use *myScaleSet3389.0* and connect to port *50001*. To connect to VM instance *1*, use the value from *myScaleSet3389.1* and connect to port *50002*. To use PowerShell remoting, you connect to the appropriate VM instance rule for *TCP* port *5985*.

View the public IP address of the load balancer with [Get-AzureRmPublicIpAddress](/powershell/module/AzureRM.Network/Get-AzureRmPublicIpAddress):

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" -Name "myPublicIPAddress" | Select IpAddress
```

Example output:

```powershell
IpAddress
---------
52.168.121.216
```

Create a remote connection to your first VM instance. Specify your public IP address and port number of the required VM instance, as shown from the preceding commands. When prompted, enter the credentials used when you created the scale set (by default in the sample commands, *azureuser* and *P@ssw0rd!*). If you use the Azure Cloud Shell, perform this step from a local PowerShell prompt or Remote Desktop Client. The following example connects to VM instance *1*:

```powershell
mstsc /v 52.168.121.216:50001
```

Once logged in to the VM instance, you could perform some manual configuration changes as needed. For now, close the remote connection.


## Understand VM instance images
The Azure marketplace includes many images that can be used to create VM instances. To see a list of available publishers, use the [Get-AzureRmVMImagePublisher](/powershell/module/azurerm.compute/get-azurermvmimagepublisher) command.

```azurepowershell-interactive
Get-AzureRmVMImagePublisher -Location "EastUS"
```

To view a list of images for a given publisher, use [Get-AzureRmVMImageSku](/powershell/module/azurerm.compute/get-azurermvmimagesku). The image list can also be filtered by `-PublisherName` or `–Offer`. In the following example, the list is filtered for all images with publisher name of *MicrosoftWindowsServer* and an offer that matches *WindowsServer*:

```azurepowershell-interactive
Get-AzureRmVMImageSku -Location "EastUS" -PublisherName "MicrosoftWindowsServer" -Offer "WindowsServer"
```

The following example output shows all of the available Windows Server images:

```powershell
Skus                                  Offer         PublisherName          Location
----                                  -----         -------------          --------
2008-R2-SP1                           WindowsServer MicrosoftWindowsServer eastus
2008-R2-SP1-smalldisk                 WindowsServer MicrosoftWindowsServer eastus
2012-Datacenter                       WindowsServer MicrosoftWindowsServer eastus
2012-Datacenter-smalldisk             WindowsServer MicrosoftWindowsServer eastus
2012-R2-Datacenter                    WindowsServer MicrosoftWindowsServer eastus
2012-R2-Datacenter-smalldisk          WindowsServer MicrosoftWindowsServer eastus
2016-Datacenter                       WindowsServer MicrosoftWindowsServer eastus
2016-Datacenter-Server-Core           WindowsServer MicrosoftWindowsServer eastus
2016-Datacenter-Server-Core-smalldisk WindowsServer MicrosoftWindowsServer eastus
2016-Datacenter-smalldisk             WindowsServer MicrosoftWindowsServer eastus
2016-Datacenter-with-Containers       WindowsServer MicrosoftWindowsServer eastus
2016-Datacenter-with-RDSH             WindowsServer MicrosoftWindowsServer eastus
2016-Nano-Server                      WindowsServer MicrosoftWindowsServer eastus
```

When you created a scale set at the start of the tutorial, a default VM image of *Windows Server 2016 DataCenter* was provided for the VM instances. You can specify a different VM image based on the output from [Get-AzureRmVMImageSku](/powershell/module/azurerm.compute/get-azurermvmimagesku). The following example would create a scale set with the `-ImageName` parameter to specify a VM image of *MicrosoftWindowsServer:WindowsServer:2016-Datacenter-with-Containers:latest*. As it takes a few minutes to create and configure all the scale set resources and VM instances, you don't have to deploy the following scale set:

```azurepowershell-interactive
New-AzureRmVmss `
  -ResourceGroupName "myResourceGroup2" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet2" `
  -VirtualNetworkName "myVnet2" `
  -SubnetName "mySubnet2" `
  -PublicIpAddressName "myPublicIPAddress2" `
  -LoadBalancerName "myLoadBalancer2" `
  -UpgradePolicyMode "Automatic" `
  -ImageName "MicrosoftWindowsServer:WindowsServer:2016-Datacenter-with-Containers:latest" `
  -Credential $cred
```


## Understand VM instance sizes
A VM instance size, or *SKU*, determines the amount of compute resources such as CPU, GPU, and memory that are made available to the VM instance. VM instances in a scale set need to be sized appropriately for the expected work load.

### VM instance sizes
The following table categorizes common VM sizes into use cases.

| Type                     | Common sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](../virtual-machines/windows/sizes-general.md)         |Dsv3, Dv3, DSv2, Dv2, DS, D, Av2, A0-7| Balanced CPU-to-memory. Ideal for dev / test and small to medium applications and data solutions.  |
| [Compute optimized](../virtual-machines/windows/sizes-compute.md)   | Fs, F             | High CPU-to-memory. Good for medium traffic applications, network appliances, and batch processes.        |
| [Memory optimized](../virtual-machines/windows/sizes-memory.md)    | Esv3, Ev3, M, GS, G, DSv2, DS, Dv2, D   | High memory-to-core. Great for relational databases, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](../virtual-machines/windows/sizes-storage.md)      | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](../virtual-machines/windows/sizes-gpu.md)          | NV, NC            | Specialized VMs targeted for heavy graphic rendering and video editing.       |
| [High performance](../virtual-machines/windows/sizes-hpc.md) | H, A8-11          | Our most powerful CPU VMs with optional high-throughput network interfaces (RDMA). 

### Find available VM instance sizes
To see a list of VM instance sizes available in a particular region, use the [Get-AzureRmVMSize](/powershell/module/azurerm.compute/get-azurermvmsize) command. 

```azurepowershell-interactive
Get-AzureRmVMSize -Location "EastUS"
```

The output is similar to the following condensed example, which shows the resources assigned to each VM size:

```powershell
Name                   NumberOfCores MemoryInMB MaxDataDiskCount OSDiskSizeInMB ResourceDiskSizeInMB
----                   ------------- ---------- ---------------- -------------- --------------------
Standard_DS1_v2                    1       3584                4        1047552                 7168
Standard_DS2_v2                    2       7168                8        1047552                14336
[...]
Standard_A0                        1        768                1        1047552                20480
Standard_A1                        1       1792                2        1047552                71680
[...]
Standard_F1                        1       2048                4        1047552                16384
Standard_F2                        2       4096                8        1047552                32768
[...]
Standard_NV6                       6      57344               24        1047552               389120
Standard_NV12                     12     114688               48        1047552               696320
```

When you created a scale set at the start of the tutorial, a default VM SKU of *Standard_DS1_v2* was provided for the VM instances. You can specify a different VM instance size based on the output from [Get-AzureRmVMSize](/powershell/module/azurerm.compute/get-azurermvmsize). The following example would create a scale set with the `-VmSize` parameter to specify a VM instance size of *Standard_F1*. As it takes a few minutes to create and configure all the scale set resources and VM instances, you don't have to deploy the following scale set:

```azurepowershell-interactive
New-AzureRmVmss `
  -ResourceGroupName "myResourceGroup3" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet3" `
  -VirtualNetworkName "myVnet3" `
  -SubnetName "mySubnet3" `
  -PublicIpAddressName "myPublicIPAddress3" `
  -LoadBalancerName "myLoadBalancer3" `
  -UpgradePolicyMode "Automatic" `
  -VmSize "Standard_F1" `
  -Credential $cred
```


## Change the capacity of a scale set
When you created a scale set, you requested two VM instances. To increase or decrease the number of VM instances in the scale set, you can manually change the capacity. The scale set creates or removes the required number of VM instances, then configures the load balancer to distribute traffic.

First, create a scale set object with [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss), then specify a new value for `sku.capacity`. To apply the capacity change, use [Update-AzureRmVmss](/powershell/module/azurerm.compute/update-azurermvmss). The following example sets the number of VM instances in your scale set to *3*:

```azurepowershell-interactive
# Get current scale set
$vmss = Get-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

# Set and update the capacity of your scale set
$vmss.sku.capacity = 3
Update-AzureRmVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -VirtualMachineScaleSet $vmss 
```

If takes a few minutes to update the capacity of your scale set. To see the number of instances you now have in the scale set, use [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss):

```azurepowershell-interactive
Get-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

The following example output shows that the capacity of the scale set is now *3*:

```powershell
Sku        :
  Name     : Standard_DS2
  Tier     : Standard
  Capacity : 3
```


## Common management tasks
You can now create a scale set, list connection information, and connect to VM instances. You learned how you could use a different OS image for your VM instances, select a different VM size, or manually scale the number of instances. As part of day to day management, you may need to stop, start, or restart the VM instances in your scale set.

### Stop and deallocate VM instances in a scale set
To stop one or more VMs in a scale set, use [Stop-AzureRmVmss](/powershell/module/azurerm.compute/stop-azurermvmss). The `-InstanceId` parameter allows you to specify one or more VMs to stop. If you do not specify an instance ID, all VMs in the scale set are stopped. The following example stops instance *1*:

```azurepowershell-interactive
Stop-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "1"
```

By default, stopped VMs are deallocated and do not incur compute charges. If you wish the VM to remain in a provisioned state when stopped, add the `-StayProvisioned` parameter to the preceding command. Stopped VMs that remain provisioned incur regular compute charges.

### Start VM instances in a scale set
To start one or more VMs in a scale set, use [Start-AzureRmVmss](/powershell/module/azurerm.compute/start-azurermvmss). The `-InstanceId` parameter allows you to specify one or more VMs to start. If you do not specify an instance ID, all VMs in the scale set are started. The following example starts instance *1*:

```azurepowershell-interactive
Start-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "1"
```

### Restart VM instances in a scale set
To restart one or more VMs in a scale set, use [Retart-AzureRmVmss](/powershell/module/azurerm.compute/restart-azurermvmss). The `-InstanceId` parameter allows you to specify one or more VMs to restart. If you do not specify an instance ID, all VMs in the scale set are restarted. The following example restarts instance *1*:

```azurepowershell-interactive
Restart-AzureRmVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "1"
```


## Clean up resources
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name "myResourceGroup" -Force -AsJob
```


## Next steps
In this tutorial, you learned how to perform some basic scale set creation and management tasks with Azure PowerShell:

> [!div class="checklist"]
> * Create and connect to a virtual machine scale set
> * Select and use VM images
> * View and use specific VM sizes
> * Manually scale a scale set
> * Perform common scale set management tasks

Advance to the next tutorial to learn about scale set disks.

> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-powershell.md)
