---
title: Create a virtual network in Azure - PowerShell | Microsoft Docs
description: Quickly learn to create a virtual network using PowerShell. A virtual network enables many types of Azure resources to communicate privately with each other.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: 
ms.topic: 
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 01/25/2018
ms.author: jdial
ms.custom: 
---

# Create a virtual network using PowerShell

In this article, you learn how to create a virtual network. You can deploy many types of Azure resources into a virtual network. After creating a virtual network, you deploy two virtual machines into the virtual network and communicate privately between them.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this tutorial requires the Azure PowerShell module version 5.1.1 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/AzureRM.Resources/New-AzureRmResourceGroup). A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location. All Azure resources are created within an Azure location (or region).

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a virtual network

Create a virtual network with [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork):

```azurepowershell-interactive
$virtualNetwork = New-AzureRmVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork `
  -AddressPrefix 10.0.0.0/24
```

All virtual networks have one or more address prefixes assigned to them. The address space is specified in CIDR notation. The address space 10.0.0.0/24 encompasses 10.0.0.0-10.0.0.254. Virtual networks have zero or more subnets within them. Resources are deployed into a subnet in a virtual network. 

Create a subnet configuration with [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnetConfig = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name default `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork
```

All subnets have an address prefix that exists within the virtual network's address prefix. The address prefix is specified in CIDR notation. The subnet address prefix encompasses 10.0.0.0-10.0.0.254, but only the addresses 10.0.0.4-10.0.0.254 are available, because Azure reserves the first four addresses (0-3) and the last address in each subnet. Since the subnet address prefix is the same as the virtual network address prefix, only one subnet can exist in this virtual network.

Write the subnet configuration to the virtual network with [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/Set-AzureRmVirtualNetwork), which creates the subnet:

```azurepowershell-interactive
$virtualNetwork | Set-AzureRmVirtualNetwork
```

## Create virtual machines

A virtual network enables several types of Azure resources to communicate privately with each other. One type of resource you can deploy into a virtual network is a virtual machine. Create two virtual machines in the virtual network so you can validate and understand how communication between virtual machines in a virtual network works in a later step.

Create a virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). When running this step, you are prompted for credentials. The values that you enter are configured as the user name and password for the virtual machine. The location that a virtual machine is created in must be the same location the virtual network exists in. The virtual machine isn't required to be in the same resource group as the virtual machine, though it is in this article.

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroup" `
    -Location "East US" `
    -VirtualNetworkName "myVirtualNetwork" `
    -SubnetName "default" `
    -Name "myVm1"
```
Azure DHCP automatically assigned 10.0.0.4 to the virtual machine because it is the first available address in the *default* subnet. Azure created and assigned a public IP address to the virtual machine. The public IP address is not assigned from within the virtual network or subnet address prefixes. Public IP addresses are assigned from a [pool of addresses assigned to each Azure region](https://www.microsoft.com/download/details.aspx?id=41653). While Azure knows which public IP address is assigned to a virtual machine, the operating system running in a virtual machine has no awareness of any public IP address assigned to it.

Create a second virtual machine. 

```azurepowershell-interactive
New-AzureRmVm `
  -ResourceGroupName "myResourceGroup" `
  -VirtualNetworkName "myVirtualNetwork" `
  -SubnetName "default" `
  -Name "myVm2"
```

Since Azure previously assigned the first usable address of *10.0.0.4* in the subnet to the *myVm1* virtual machine, it assigned *10.0.0.5* to the *myVm2* virtual machine, because it was the next available address in the subnet.

## Connect to virtual machine

Use the [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) command to return the public IP address of a virtual machine. The following example returns the public IP address of the *myVm1* virtual machine:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -Name myVm1 -ResourceGroupName myResourceGroup | Select IpAddress
```

Enter the user name and password you specified when creating the virtual machine, then click **OK**. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection. 

Use the following command to create a remote desktop session with the *myVm1* virtual machine from your local computer. Replace the IP address with the *publicIPAddress* of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```
mstsc /v:<publicIpAddress>
```

## Validate communication

To validate communication with *myVm2*, enter the following command from a command prompt on the *myVm1* virtual machine. Provide the credentials you used when you created the virtual machine, and then complete the connection:

```
mstsc /v:myVm2
```

The remote desktop connection is successful because both virtual machines have private IP addresses assigned from the *default* subnet. You are able to connect to *myVm2* by hostname because Azure automatically provides DNS name resolution for all hosts within a virtual network. 

If you attempt to ping *myVm2* from *myVm1*, ping fails because ping is not allowed through the Windows firewall, by default.

To allow ping to a Windows virtual machine, enter the following command from the Windows virtual machine you want to allow ping to:

```
netsh advfirewall firewall add rule name=Allow-ping protocol=icmpv4 dir=in action=allow"
```

To confirm outbound communication to the Internet, enter the following command:

```
ping bing.com
```

You receive four replies from bing.com. By default, any virtual machine in a virtual network can communicate outbound to the Internet.


## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group and all of the resources it contains. Exit the SSH session to your VM, then delete the resources.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you deployed a default virtual network with one subnet and two virtual machines. To learn how to create a custom virtual network with multiple subnets and perform basic virtual network management tasks, continue to the tutorial for creating a custom virtual network and managing it.


> [!div class="nextstepaction"]
> [Create a custom virtual network and manage it](virtual-networks-create-vnet-arm-pportal.md#powershell)
