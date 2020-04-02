---
title: Tutorial - Use a custom VM image in a scale set with Azure PowerShell
description: Learn how to use Azure PowerShell to create a custom VM image that you can use to deploy a virtual machine scale set
author: cynthn
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.topic: tutorial
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---
# Tutorial: Create and use a custom image for virtual machine scale sets with Azure PowerShell

When you create a scale set, you specify an image to be used when the VM instances are deployed. To reduce the number of tasks after VM instances are deployed, you can use a custom VM image. This custom VM image includes any required application installs or configurations. Any VM instances created in the scale set use the custom VM image and are ready to serve your application traffic. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create and customize a VM
> * Deprovision and generalize the VM
> * Create a custom VM image from the source VM
> * Deploy a scale set that uses the custom VM image

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az.md](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Create and configure a source VM

>[!NOTE]
> This tutorial walks through the process of creating and using a generalized VM image. Creating a scale set from a specialized VHD is not supported.

First, create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup), then create a VM with [New-AzVM](/powershell/module/az.compute/new-azvm). This VM is then used as the source for a custom VM image. The following example creates a VM named *myCustomVM* in the resource group named *myResourceGroup*. When prompted, enter a username and password to be used as logon credentials for the VM:

```azurepowershell-interactive
# Create a resource a group
New-AzResourceGroup -Name "myResourceGroup" -Location "EastUS"

# Create a Windows Server 2016 Datacenter VM
New-AzVm `
  -ResourceGroupName "myResourceGroup" `
  -Name "myCustomVM" `
  -ImageName "Win2016Datacenter" `
  -OpenPorts 3389
```

To connect to your VM, list the public IP address with  [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) as follows:

```azurepowershell-interactive
Get-AzPublicIpAddress -ResourceGroupName myResourceGroup | Select IpAddress
```

Create a remote connection with the VM. If you use the Azure Cloud Shell, perform this step from a local PowerShell prompt or Remote Desktop Client. Provide your own IP address from the previous command. When prompted, enter the credentials used when you created the VM in the first step:

```powershell
mstsc /v:<IpAddress>
```

To customize your VM, let's install a basic web server. When the VM instance in the scale set would be deployed, it would then have all the required packages to run a web application. Open a local PowerShell prompt on the VM and install the IIS web server with [Install-WindowsFeature](/powershell/module/servermanager/install-windowsfeature) as follows:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

The final step to prepare your VM for use as a custom image is to generalize the VM. Sysprep removes all your personal account information and configurations, and resets the VM to a clean state for future deployments. For more information, see [How to Use Sysprep: An Introduction](https://technet.microsoft.com/library/bb457073.aspx).

To generalize the VM, run Sysprep and set the VM for an out-of-the-box experience. When finished, instruct Sysprep to shut down the VM:

```powershell
C:\Windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown
```

The remote connection to the VM is automatically closed when Sysprep completes the process and the VM is shut down.


## Create a custom VM image from the source VM
The source VM now customized with the IIS web server installed. Let's create the custom VM image to use with a scale set.

To create an image, the VM needs to be deallocated. Deallocate the VM with [Stop-AzVm](/powershell/module/az.compute/stop-azvm). Then, set the state of the VM as generalized with [Set-AzVm](/powershell/module/az.compute/set-azvm) so that the Azure platform knows the VM is ready for use a custom image. You can only create an image from a generalized VM:

```azurepowershell-interactive
Stop-AzVM -ResourceGroupName "myResourceGroup" -Name "myCustomVM" -Force
Set-AzVM -ResourceGroupName "myResourceGroup" -Name "myCustomVM" -Generalized
```

It may take a few minutes to deallocate and generalize the VM.

Now, create an image of the VM with [New-AzImageConfig](/powershell/module/az.compute/new-azimageconfig) and [New-AzImage](/powershell/module/az.compute/new-azimage). The following example creates an image named *myImage* from your VM:

```azurepowershell-interactive
# Get VM object
$vm = Get-AzVM -Name "myCustomVM" -ResourceGroupName "myResourceGroup"

# Create the VM image configuration based on the source VM
$image = New-AzImageConfig -Location "EastUS" -SourceVirtualMachineId $vm.ID 

# Create the custom VM image
New-AzImage -Image $image -ImageName "myImage" -ResourceGroupName "myResourceGroup"
```

## Configure the Network Security Group Rules
Before creating the Scale Set, we need to configure the associating Network Security Group rules to allow access to HTTP, RDP and Remoting 

```azurepowershell-interactive
$rule1 = New-AzNetworkSecurityRuleConfig -Name web-rule -Description "Allow HTTP" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 80

$rule2 = New-AzNetworkSecurityRuleConfig -Name rdp-rule -Description "Allow RDP" -Access Allow -Protocol Tcp -Direction Inbound -Priority 110 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389

$rule3 = New-AzNetworkSecurityRuleConfig -Name remoting-rule -Description "Allow PS Remoting" -Access Allow -Protocol Tcp -Direction Inbound -Priority 120 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 5985

New-AzNetworkSecurityGroup -Name "myNSG" -ResourceGroupName "myResourceGroup" -Location "EastUS" -SecurityRules $rule1,$rule2,$rule3
```

## Create a scale set from the custom VM image
Now create a scale set with [New-AzVmss](/powershell/module/az.compute/new-azvmss) that uses the `-ImageName` parameter to define the custom VM image created in the previous step. To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985. When prompted, provide your own desired administrative credentials for the VM instances in the scale set:

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -SecurityGroupName "myNSG"
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic" `
  -ImageName "myImage"
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Test your scale set
To see your scale set in action, get the public IP address of your load balancer with [Get-AzPublicIpAddress](/powershell/module/az.network/Get-AzPublicIpAddress) as follows:


```azurepowershell-interactive
Get-AzPublicIpAddress `
  -ResourceGroupName "myResourceGroup" `
  -Name "myPublicIPAddress" | Select IpAddress
```

Type the public IP address into your web browser. The default IIS web page is displayed, as shown in the following example:

![IIS running from custom VM image](media/tutorial-use-custom-image-powershell/default-iis-website.png)


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup). The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup" -Force -AsJob
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
