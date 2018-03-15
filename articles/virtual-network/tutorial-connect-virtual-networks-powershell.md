---
title: Connect virtual networks with virtual network peering - PowerShell | Microsoft Docs
description: Learn how to connect virtual networks with virtual network peering.
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
ms.date: 03/06/2018
ms.author: jdial
ms.custom:
---

# Connect virtual networks with virtual network peering using PowerShell

You can connect virtual networks to each other with virtual network peering. Once virtual networks are peered, resources in both virtual networks are able to communicate with each other, with the same latency and bandwidth as if the resources were in the same virtual network. This article covers creation and peering of two virtual networks. You learn how to:

> [!div class="checklist"]
> * Create two virtual networks
> * Create a peering between virtual networks
> * Test peering

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. 

## Create virtual networks

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

Create a virtual network with [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork). The following example creates a virtual network named *myVirtualNetwork1* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$virtualNetwork1 = New-AzureRmVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork1 `
  -AddressPrefix 10.0.0.0/16
```

Create a subnet configuration with [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig). The following example creates a subnet configuration with a 10.0.0.0/24 address prefix:

```azurepowershell-interactive
$subnetConfig = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Subnet1 `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork1
```

Write the subnet configuration to the virtual network with [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/Set-AzureRmVirtualNetwork), which creates the subnet:

```azurepowershell-interactive
$virtualNetwork1 | Set-AzureRmVirtualNetwork
```

Create a virtual network with a 10.1.0.0/16 address prefix and one subnet:

```azurepowershell-interactive
# Create the virtual network.
$virtualNetwork2 = New-AzureRmVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork2 `
  -AddressPrefix 10.1.0.0/16

# Create the subnet configuration.
$subnetConfig = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Subnet1 `
  -AddressPrefix 10.1.0.0/24 `
  -VirtualNetwork $virtualNetwork2

# Write the subnet configuration to the virtual network.
$virtualNetwork2 | Set-AzureRmVirtualNetwork
```

The address prefix for the *myVirtualNetwork2* virtual network does not overlap with the address prefix of the *myVirtualNetwork1* virtual network. You cannot peer virtual networks with overlapping address prefixes.

## Peer virtual networks

Create a peering with [Add-AzureRmVirtualNetworkPeering](/powershell/module/azurerm.network/add-azurermvirtualnetworkpeering). The following example peers *myVirtualNetwork1* to *myVirtualNetwork2*.

```azurepowershell-interactive
Add-AzureRmVirtualNetworkPeering `
  -Name myVirtualNetwork1-myVirtualNetwork2 `
  -VirtualNetwork $virtualNetwork1 `
  -RemoteVirtualNetworkId $virtualNetwork2.Id
```

In the output returned after the previous command executes, you see that the **PeeringState** is *Initiated*. The peering remains in the *Initiated* state until you create the peering from *myVirtualNetwork2* to *myVirtualNetwork1*. Create a peering from *myVirtualNetwork2* to *myVirtualNetwork1*. 

```azurepowershell-interactive
Add-AzureRmVirtualNetworkPeering `
  -Name myVirtualNetwork2-myVirtualNetwork1 `
  -VirtualNetwork $virtualNetwork2 `
  -RemoteVirtualNetworkId $virtualNetwork1.Id
```

In the output returned after the previous command executes, you see that the **PeeringState** is *Connected*. Azure also changed the peering state of the *myVirtualNetwork1-myVirtualNetwork2* peering to *Connected*. Confirm that the peering state for the *myVirtualNetwork1-myVirtualNetwork2* peering changed to *Connected* with [Get-AzureRmVirtualNetworkPeering](/powershell/module/azurerm.network/get-azurermvirtualnetworkpeering).

```azurepowershell-interactive
Get-AzureRmVirtualNetworkPeering `
  -ResourceGroupName myResourceGroup `
  -VirtualNetworkName myVirtualNetwork1 `
  | Select PeeringState
```

Resources in one virtual network cannot communicate with resources in the other virtual network until the **PeeringState** for the peerings in both virtual networks is *Connected*. 

Peerings are between two virtual networks, but are not transitive. So, for example, if you also wanted to peer *myVirtualNetwork2* to *myVirtualNetwork3*, you need to create an additional peering between virtual networks *myVirtualNetwork2* and *myVirtualNetwork3*. Even though *myVirtualNetwork1* is peered with *myVirtualNetwork2*, resources within *myVirtualNetwork1* could only access resources in *myVirtualNetwork3* if *myVirtualNetwork1* was also peered with *myVirtualNetwork3*. 

Before peering production virtual networks, it's recommended that you thoroughly familiarize yourself with the [peering overview](virtual-network-peering-overview.md), [managing peering](virtual-network-manage-peering.md), and [virtual network limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). Though this article illustrates a peering between two virtual networks in the same subscription and location, you can also peer virtual networks in [different regions](#register) and [different Azure subscriptions](create-peering-different-subscriptions.md#powershell). You can also create [hub and spoke network designs](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering) with peering.

## Test peering

To test network communication between virtual machines in different virtual networks through a peering, deploy a virtual machine to each subnet and then communicate between the virtual machines. 

### Create virtual machines

Create a virtual machine in each virtual network so you can validate communication between them in a later step.

Create a virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a virtual machine named *myVm1* in the *myVirtualNetwork1* virtual network. The `-AsJob` option creates the virtual machine in the background, so you can continue to the next step. When prompted, enter the user name and password you want to log in to the virtual machine with.

```azurepowershell-interactive
New-AzureRmVm `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -VirtualNetworkName "myVirtualNetwork1" `
  -SubnetName "Subnet1" `
  -ImageName "Win2016Datacenter" `
  -Name "myVm1" `
  -AsJob
```

Azure automatically assigns 10.0.0.4 as the private IP address of the virtual machine, because 10.0.0.4 is the first available IP address in *Subnet1* of *myVirtualNetwork1*. 

Create a virtual machine in the *myVirtualNetwork2* virtual network.

```azurepowershell-interactive
New-AzureRmVm `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -VirtualNetworkName "myVirtualNetwork2" `
  -SubnetName "Subnet1" `
  -ImageName "Win2016Datacenter" `
  -Name "myVm2"
```

The virtual machine takes a few minutes to create. Though not in the returned output, Azure assigned 10.1.0.4 as the private IP address of the virtual machine, because 10.1.0.4 is the first available IP address in *Subnet1* of *myVirtualNetwork2*. 

Do not continue with later steps until Azure creates the virtual machine and returns output to PowerShell.

### Test virtual machine communication

You can connect to a virtual machine's public IP address from the Internet. Use [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) to return the public IP address of a virtual machine. The following example returns the public IP address of the *myVm1* virtual machine:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress `
  -Name myVm1 `
  -ResourceGroupName myResourceGroup | Select IpAddress
```

Use the following command to create a remote desktop session with the *myVm1* virtual machine from your local computer. Replace `<publicIpAddress>` with the IP address returned from the previous command.

```
mstsc /v:<publicIpAddress>
```

A Remote Desktop Protocol (.rdp) file is created, downloaded to your computer, and opened. Enter the user name and password (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the virtual machine), and then click **OK**. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection.

From a command prompt, enable ping through the Windows firewall so you can ping this virtual machine from *myVm2* in a later step.

```
netsh advfirewall firewall add rule name=Allow-ping protocol=icmpv4 dir=in action=allow
```

Though ping is used in this article for testing, allowing ICMP through the Windows Firewall for production deployments is not recommended.

To connect to the *myVm2* virtual machine, enter the following command from a command prompt on the *myVm1* virtual machine:

```
mstsc /v:10.1.0.4
```

Since you enabled ping on *myVm1*, you can now ping it by IP address from a command prompt on the *myVm2* virtual machine:

```
ping 10.0.0.4
```

You receive four replies. If you ping by the virtual machine's name (*myVm1*), instead of its IP address, ping fails, because *myVm1* is an unknown host name. Azure's default name resolution works between virtual machines in the same virtual network, but not between virtual machines in different virtual networks. To resolve names across virtual networks, you must [deploy your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md) or use [Azure DNS private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Disconnect your RDP sessions to both *myVm1* and *myVm2*.

## Clean up resources

When no longer needed, use [Remove-AzureRmResourcegroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

**<a name="register"></a>Register for the global virtual network peering preview**

Peering virtual networks in the same region is generally available. Peering virtual networks in different regions is currently in preview. See [Virtual network updates](https://azure.microsoft.com/updates/?product=virtual-network) for available regions. To peer virtual networks across regions, you must first register for the preview, by completing the following steps (within the subscription each virtual network you want to peer is in):

1. Register the subscription that each virtual network you want to peer is in for the preview by entering the following commands:

    ```powershell-interactive
    Register-AzureRmProviderFeature `
      -FeatureName AllowGlobalVnetPeering `
      -ProviderNamespace Microsoft.Network
    
    Register-AzureRmResourceProvider `
      -ProviderNamespace Microsoft.Network
    ```
2. Confirm that you are registered for the preview by entering the following command:

    ```powershell-interactive    
    Get-AzureRmProviderFeature `
      -FeatureName AllowGlobalVnetPeering `
      -ProviderNamespace Microsoft.Network
    ```

    If you attempt to peer virtual networks in different regions before the **RegistrationState** output you receive after entering the previous command is **Registered** for both subscriptions, peering fails.

## Next steps

In this article, you learned how to connect two networks with virtual network peering. You can [connect your own computer to a virtual network](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) through a VPN, and interact with resources in a virtual network, or in peered virtual networks.

Continue to script samples for reusable scripts to complete many of the tasks covered in the virtual network articles.

> [!div class="nextstepaction"]
> [Virtual network script samples](../networking/powershell-samples.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
