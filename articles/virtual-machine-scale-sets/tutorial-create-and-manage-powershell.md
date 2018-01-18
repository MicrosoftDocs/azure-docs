---
title: Create and manage Virtual Machine Scale Sets with Azure PowerShell | Microsoft Docs
description: Learn how to create a virtual machine scale set with Azure PowerShell, along with some common management tasks such as how to start and stop an instance, or change the scale set capacity.
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 01/17/2018
ms.author: iainfou
ms.custom: mvc

---
# Create and manage a virtual machine scale set with Azure PowerShell
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. Throughout the lifecycle of a virtual machine scale set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create and connect to a virtual machine scale set
> * Select and use VM images
> * View and use specific VM instance sizes
> * Manually scale a scale set
> * Perform common scale set management tasks

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.1.1 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. 


## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine scale set. Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. In this example, a resource group named *myResourceGroup* is created in the *EastUS* region. 

 ```azurepowershell-interactive 
New-AzureRmResourceGroup -ResourceGroupName "myResourceGroup" -Location "EastUS"
```

The resource group name is specified when you create or modify a scale set throughout this tutorial.


## Create virtual network resources
All VM instances in a scale set connect to a virtual network. This virtual network allows the VM instances to communicate with each other, allow you to connect remotely, and to serve application traffic. To allow external access to your scale set, you also need to create a public IP address.

```azurepowershell-interactive
# Create a virtual network subnet
$subnet = New-AzureRmVirtualNetworkSubnetConfig `
  -Name "mySubnet" `
  -AddressPrefix 10.0.0.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork `
  -ResourceGroupName "myResourceGroup" `
  -Name "myVnet" `
  -Location "EastUS" `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $subnet

# Create a public IP address
$publicIP = New-AzureRmPublicIpAddress `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -AllocationMethod Static `
  -Name "myPublicIP"
```


## Create a load balancer
The VM instances in a scale set are connected to a load balancer. An Azure load balancer is a Layer-4 (TCP, UDP) load balancer that provides high availability by distributing incoming traffic among healthy VMs. To allow remote connectivity to the VM instances, Network Address Translation (NAT) rules are created with [New-AzureRmLoadBalancerInboundNatPoolConfig](/powershell/module/AzureRM.Network/New-AzureRmLoadBalancerInboundNatPoolConfig). The load balancer with the required address pools, IP address assignment, and NAT rules is created with [New-AzureRmLoadBalancer](/powershell/module/AzureRM.Network/New-AzureRmLoadBalancer):

```azurepowershell-interactive
# Create a frontend and backend IP pool
$frontendIP = New-AzureRmLoadBalancerFrontendIpConfig `
  -Name "myFrontEndPool" `
  -PublicIpAddress $publicIP
$backendPool = New-AzureRmLoadBalancerBackendAddressPoolConfig -Name "myBackEndPool"

# Create a Network Address Translation (NAT) pool
$inboundNATPool = New-AzureRmLoadBalancerInboundNatPoolConfig `
  -Name "myRDPRule" `
  -FrontendIpConfigurationId $frontendIP.Id `
  -Protocol TCP `
  -FrontendPortRangeStart 50001 `
  -FrontendPortRangeEnd 50010 `
  -BackendPort 3389

# Create the load balancer
$lb = New-AzureRmLoadBalancer `
  -ResourceGroupName "myResourceGroup" `
  -Name "myLoadBalancer" `
  -Location "EastUS" `
  -FrontendIpConfiguration $frontendIP `
  -BackendAddressPool $backendPool `
  -InboundNatPool $inboundNATPool
```


## Create a scale set
The following example creates a scale set named *myScaleSet* that uses the *Windows Server 2016 Datacenter* platform image. The *vmssConfig* object creates two VM instances in East US, with the credentials as specified in the *adminUsername* and *securePassword* variables. Provide your own credentials and create a scale set as follows:

```azurepowershell-interactive
$adminUsername = "azureuser"
$securePassword = "P@ssword!"
```

You define a scale set with [New-AzureRmVmssConfig](/powershell/module/AzureRM.Compute/New-AzureRmVmssConfig). The configuration details the number of VM instances to create and the VM size, or *SKU*, to use. You also define the `-UpgradePolicyMode`. This policy controls how the VM instances respond when you make an adjustment to the scale set, such as to deploy an application. When the upgrade policy is set to *Automatic*, the VM instances automatically apply the requested changes.

```azurepowershell-interactive
$vmssConfig = New-AzureRmVmssConfig `
    -Location "EastUS" `
    -SkuCapacity 2 `
    -SkuName "Standard_DS2" `
    -UpgradePolicyMode Automatic
```

Add the operating system information to the scale set configuration with [Set-AzureRmVmssStorageProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssStorageProfile). The following example uses the latest Windows Server 2016 Datacenter image for the VM instances:

```azurepowershell-interactive
Set-AzureRmVmssStorageProfile $vmssConfig `
  -ImageReferencePublisher "MicrosoftWindowsServer" `
  -ImageReferenceOffer "WindowsServer" `
  -ImageReferenceSku "2016-Datacenter" `
  -ImageReferenceVersion "latest"
```

Add the credential and naming information to the scale set configuration with [Set-AzureRmVmssOsProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssOsProfile):

```azurepowershell-interactive
Set-AzureRmVmssOsProfile $vmssConfig `
  -AdminUsername $adminUsername `
  -AdminPassword $securePassword `
  -ComputerNamePrefix "myVM"
```

To attach the VM instances in a scale set to the load balancer and virtual network, create a network configuration with [New-AzureRmVmssIpConfig](/powershell/module/AzureRM.Compute/New-AzureRmVmssIpConfig):

```azurepowershell-interactive
$ipConfig = New-AzureRmVmssIpConfig `
  -Name "myIPConfig" `
  -LoadBalancerBackendAddressPoolsId $lb.BackendAddressPools[0].Id `
  -LoadBalancerInboundNatPoolsId $inboundNATPool.Id `
  -SubnetId $vnet.Subnets[0].Id
```

Apply the network configuration to the scale set configuration with [Add-AzureRmVmssNetworkInterfaceConfiguration](/powershell/module/AzureRM.Compute/Add-AzureRmVmssNetworkInterfaceConfiguration):

```azurepowershell-interactive
Add-AzureRmVmssNetworkInterfaceConfiguration `
  -VirtualMachineScaleSet $vmssConfig `
  -Name "network-config" `
  -Primary $true `
  -IPConfiguration $ipConfig
```

Now create a virtual machine scale set with [New-AzureRmVmss](/powershell/module/azurerm.compute/new-azurermvm).

```azurepowershell-interactive
New-AzureRmVmss `
  -ResourceGroupName "myResourceGroup" `
  -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmssConfig
```

It takes a few minutes to create and configure all the scale set resources and VM instances.


## View VM instances in a scale set
To view a list of VM instances in a scale set, use [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm) as follows:

```azurepowershell-interactive
Get-AzureRmVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

The following example output shows two VM instances in the scale set:

```powershell
ResourceGroupName         Name Location          Sku InstanceID ProvisioningState
-----------------         ---- --------          --- ---------- -----------------
MYRESOURCEGROUP   myScaleSet_0   eastus Standard_DS2          0         Succeeded
MYRESOURCEGROUP   myScaleSet_1   eastus Standard_DS2          1         Succeeded
```

To view additional information about a specific VM instance, add the `-InstanceId` parameter to [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm). The following example views information about VM instance *1*:

```azurepowershell-interactive
Get-AzureRmVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "1"
```


## List connection information
A public IP address is assigned to the load balancer that routes traffic to the individual VM instances. By default, Network Address Translation (NAT) rules are added to the Azure load balancer that forwards remote connection traffic to each VM on a given port. To connect to the VM instances in a scale set, you SSH or RDP to an assigned public IP address and port number.

To list the NAT ports to connect to VM instances in a scale set, first get the load balancer object with [Get-AzureRmLoadBalancer](/powershell/module/AzureRM.Network/Get-AzureRmLoadBalancer). Then, view the inbound NAT rules with [Get-AzureRmLoadBalancerInboundNatRuleConfig](/powershell/module/AzureRM.Network/Get-AzureRmLoadBalancerInboundNatRuleConfig):

```azurepowershell-interactive
# Get the load balancer object
$lb = Get-AzureRmLoadBalancer -ResourceGroupName "myResourceGroup" -Name "myLoadBalancer"

# View the list of inbound NAT rules
Get-AzureRmLoadBalancerInboundNatRuleConfig -LoadBalancer $lb | Select-Object Name,Protocol,FrontEndPort,BackEndPort
```

The following example output shows the instance name, public IP address of the load balancer, and port number that the NAT rules forward traffic to:

```powershell
Name        Protocol FrontendPort BackendPort
----        -------- ------------ -----------
myRDPRule.0 Tcp             50001        3389
myRDPRule.1 Tcp             50002        3389
```

The *Name* of the rule aligns with the name of the VM instance as shown in a previous [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm) command. For example, to connect to VM instance *0*, you use *myRDPRule.0* and connect to port *50001*. To connect to VM instance *1*, use the value from *myRDPRule.1* and connect to port *50002*.

View the public IP address of the load balancer with [Get-AzureRmPublicIpAddress](/powershell/module/AzureRM.Network/Get-AzureRmPublicIpAddress):

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" -Name myPublicIP | Select IpAddress
```

Example output:

```powershell
IpAddress
---------
52.168.121.216
```

RDP to your first VM instance. Specify your own public IP address and port number of the required VM instance, as shown from the preceding commands. When prompted, enter the credentials used when you created the scale set (by default in the sample commands, *azureuser* and *P@ssw0rd!*). The following example connects to VM instance *1*:

```powershell
mstsc /v 52.168.121.216:50001
```

Once logged in to the VM instance, you could perform some manual configuration changes as needed. For now, close the RDP connection.


## Understand VM instance images
When you defined a scale set configuration with [Set-AzureRmVmssStorageProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssStorageProfile) in a previous step, you used a Windows Server 2016 Datacenter image. The Azure marketplace includes many images that can be used to create VM instances. To see a list of available publishers, use the [Get-AzureRmVMImagePublisher](/powershell/module/azurerm.compute/get-azurermvmimagepublisher) command.

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

You can use this information to create scale sets that use different platform images. The following example would define a configuration with [Set-AzureRmVmssStorageProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssStorageProfile) that use Windows Server 2016 Datacenter Core.

```powershell
Set-AzureRmVmssStorageProfile $vmssConfig `
  -ImageReferencePublisher "MicrosoftWindowsServer" `
  -ImageReferenceOffer "WindowsServer" `
  -ImageReferenceSku "2016-Datacenter-Server-Core" `
  -ImageReferenceVersion "latest"
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
Get-AzureRmVMSize -Location EastUS
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

You can use this information to create scale sets that use a different VM size. The following example would define a configuration with [New-AzureRmVmssConfig](/powershell/module/AzureRM.Compute/New-AzureRmVmssConfig) that uses the *Standard_F1* VM instance size:

```powershell
$vmssConfig = New-AzureRmVmssConfig `
    -Location "EastUS" `
    -SkuCapacity 2 `
    -SkuName "Standard_F1"
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


## Delete resource group
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name "myResourceGroup" -Force
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
> [Use data disks with scale sets]()
