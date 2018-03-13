---
title: Tutorial - Use a custom VM image in a scale set with Azure PowerShell | Microsoft Docs
description: Learn how to use Azure PowerShell to create a custom VM image that you can use to deploy a virtual machine scale set
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
ms.date: 03/27/2018
ms.author: iainfou
ms.custom: mvc

---
# Tutorial: Create and use a custom image for virtual machine scale sets with Azure PowerShell
When you create a scale set, you specify an image to be used when the VM instances are deployed. To reduce the number of tasks after VM instances are deployed, you can use a custom VM image. This custom VM image includes any required application installs or configurations. Any VM instances created in the scale set use the custom VM image and are ready to serve your application traffic. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create and customize a VM
> * Deprovision and generalize the VM
> * Create a custom VM image from the source VM
> * Deploy a scale set that uses the custom VM image

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.5.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. 


## Create and configure a source VM
First, create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup), then create a VM with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). This VM is then used as the source for a custom VM image. The following example creates a VM named *myCustomVM* in the resource group named *myResourceGroup*. When prompted, enter a username and password to be used as logon credentials for the VM:

```azurepowershell-interactive
# Create a resource a group
New-AzureRmResourceGroup -Name "myResourceGroup" -Location "EastUS"

# Create a Windows Server 2016 Datacenter VM
New-AzureRmVm `
  -ResourceGroupName "myResourceGroup" `
  -Name "myCustomVM" `
  -ImageName "Win2016Datacenter" `
  -OpenPorts 3389
```

To connect to your VM, list the public IP address with  [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) as follows:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName myResourceGroup | Select IpAddress
```

Create a remote connection with the VM. If you use the Azure Cloud Shell, perform this step from a local PowerShell prompt or Remote Desktop Client. Provide your own IP address from the previous command. When prompted, enter the credentials used when you created the VM in the first step:

```powershell
mstsc /v:<IpAddress>
```

To customize your VM, let's install a basic web server. When the VM instance in the scale set would be deployed, it would then have all the required packages to run a web application. Open a local PowerShell prompt on the VM and install the IIS web server with [Install-WindowsFeature](/powershell/module/servermanager/install-windowsfeature) as follows:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

The final step to prepare your VM for use as a custom image is to generalize the VM. Sysprep removes all your personal account information and configurations, and resets the VM to a clean state for future deployments. For more information, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

To generalize the VM, run Sysprep and set the VM for an out-of-the-box experience. When finished, instruct Sysprep to shut down the VM:

```powershell
C:\Windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown
```

The remote connection to the VM is automatically closed when Sysprep completes the process and the VM is shut down.


## Create a custom VM image from the source VM
The source VM now customized with the IIS web server installed. Let's create the custom VM image to use with a scale set.

To create an image, the VM needs to be deallocated. Deallocate the VM with [Stop-AzureRmVm](/powershell/module/azurerm.compute/stop-azurermvm). Then, set the state of the VM as generalized with [Set-AzureRmVm](/powershell/module/azurerm.compute/set-azurermvm) so that the Azure platform knows the VM is ready for use a custom image. You can only create an image from a generalized VM:

```azurepowershell-interactive
Stop-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "myCustomVM" -Force
Set-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "myCustomVM" -Generalized
```

It may take a few minutes to deallocate and generalize the VM.

Now, create an image of the VM with [New-AzureRmImageConfig](/powershell/module/azurerm.compute/new-azurermimageconfig) and [New-AzureRmImage](/powershell/module/azurerm.compute/new-azurermimage). The following example creates an image named *myImage* from your VM:

```azurepowershell-interactive
# Get VM object
$vm = Get-AzureRmVM -Name "myCustomVM" -ResourceGroupName "myResourceGroup"

# Create the VM image configuration based on the source VM
$image = New-AzureRmImageConfig -Location "EastUS" -SourceVirtualMachineId $vm.ID 

# Create the custom VM image
New-AzureRmImage -Image $image -ImageName "myImage" -ResourceGroupName "myResourceGroup"
```


## Create a scale set from the custom VM image
To get started with the scale set deployment, create the supporting network resources and scale set configuration objects as follows:

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

# Create a load balancer health probe on port 80
Add-AzureRmLoadBalancerProbeConfig -Name "myHealthProbe" `
  -LoadBalancer $lb `
  -Protocol TCP `
  -Port 80 `
  -IntervalInSeconds 15 `
  -ProbeCount 2

# Create a load balancer rule to distribute traffic on port 80
Add-AzureRmLoadBalancerRuleConfig `
  -Name "myLoadBalancerRule" `
  -LoadBalancer $lb `
  -FrontendIpConfiguration $lb.FrontendIpConfigurations[0] `
  -BackendAddressPool $lb.BackendAddressPools[0] `
  -Protocol TCP `
  -FrontendPort 80 `
  -BackendPort 80

# Update the load balancer configuration
Set-AzureRmLoadBalancer -LoadBalancer $lb

# Create IP address configurations
$ipConfig = New-AzureRmVmssIpConfig `
  -Name "myIPConfig" `
  -LoadBalancerBackendAddressPoolsId $lb.BackendAddressPools[0].Id `
  -LoadBalancerInboundNatPoolsId $inboundNATPool.Id `
  -SubnetId $vnet.Subnets[0].Id

# Provide your own secure password for use with the VM instances
$securePassword = "P@ssword!"
$adminUsername = "azureuser"

# Create a config object
$vmssConfig = New-AzureRmVmssConfig `
  -Location "EastUS" `
  -SkuCapacity 2 `
  -SkuName "Standard_DS2" `
  -UpgradePolicyMode Automatic

# Set up information for authenticating with the virtual machine
Set-AzureRmVmssOsProfile $vmssConfig `
  -AdminUsername $adminUsername `
  -AdminPassword $securePassword `
  -ComputerNamePrefix "myVM"

# Attach the virtual network to the config object
Add-AzureRmVmssNetworkInterfaceConfiguration `
  -VirtualMachineScaleSet $vmssConfig `
  -Name "network-config" `
  -Primary $true `
  -IPConfiguration $ipConfig
```

To use your custom image, create an object with [Get-AzureRmImage](/powershell/module/AzureRM.Compute/Get-AzureRmImage). Pass the image ID to a scale set storage profile with [Set-AzureRmVmssStorageProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssStorageProfile). Finally, create your scale set with [New-AzureRmVmss](/powershell/module/AzureRM.Compute/New-AzureRmVmss):

```azurepowershell-interactive
# Get image object
$image = Get-AzureRmImage `
  -ResourceGroupName "myResourceGroup" `
  -ImageName "myImage"

# Create a storage profile that references the custom VM image ID
Set-AzureRmVmssStorageProfile $vmssConfig -ImageReferenceId $image.id -OsDiskOsType "Windows"

# Create the scale set
New-AzureRmVmss `
  -ResourceGroupName "myResourceGroup" `
  -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmssConfig
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Test your scale set
To see your scale set in action, get the public IP address of your load balancer with [Get-AzureRmPublicIpAddress](/powershell/module/AzureRM.Network/Get-AzureRmPublicIpAddress) as follows:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" | Select IpAddress
```

Type the public IP address into your web browser. The default IIS web page is displayed, as shown in the following example:

![IIS running from custom VM image](media/tutorial-use-custom-image-powershell/default-iis-website.png)


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup). The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name "myResourceGroup" -Force -AsJob
```


## Next steps
In this tutorial, you learned how to create and use a custom VM image for your scale sets with Azure PowerShell:

> [!div class="checklist"]
> * Create and customize a VM
> * Deprovision and generalize the VM
> * Create a custom VM image
> * Deploy a scale set that uses the custom VM image

Advance to the next tutorial to learn how to deploy applications to your scale set.

> [!div class="nextstepaction"]
> [Deploy applications to your scale sets](tutorial-install-apps-powershell.md)