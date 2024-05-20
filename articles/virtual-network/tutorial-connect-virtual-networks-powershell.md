---
title: Connect virtual networks with VNet peering - Azure PowerShell
description: In this article, you learn how to connect virtual networks with virtual network peering, using Azure PowerShell.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.tgt_pltfrm: virtual-network
ms.date: 04/15/2024
ms.author: allensu
ms.custom: devx-track-azurepowershell
# Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.
---

# Connect virtual networks with virtual network peering using PowerShell

You can connect virtual networks to each other with virtual network peering. Once virtual networks are peered, resources in both virtual networks are able to communicate with each other, with the same latency and bandwidth as if the resources were in the same virtual network. 

In this article, you learn how to:

* Create two virtual networks

* Connect two virtual networks with a virtual network peering

* Deploy a virtual machine (VM) into each virtual network

* Communicate between VMs

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create virtual networks

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named **test-rg** in the **eastus** location.

```azurepowershell-interactive
$resourceGroup = @{
    Name = "test-rg"
    Location = "EastUS"
}
New-AzResourceGroup @resourceGroup
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named **vnet-1** with the address prefix **10.0.0.0/16**.

```azurepowershell-interactive
$vnet1 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS"
    Name = "vnet-1"
    AddressPrefix = "10.0.0.0/16"
}
$virtualNetwork1 = New-AzVirtualNetwork @vnet1
```

Create a subnet configuration with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet configuration with a **10.0.0.0/24** address prefix:

```azurepowershell-interactive
$subConfig = @{
    Name = "subnet-1"
    AddressPrefix = "10.0.0.0/24"
    VirtualNetwork = $virtualNetwork1
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subConfig
```

Write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork), which creates the subnet:

```azurepowershell-interactive
$virtualNetwork1 | Set-AzVirtualNetwork
```

Create a virtual network with a **10.1.0.0/16** address prefix and one subnet:

```azurepowershell-interactive
# Create the virtual network.
$vnet2 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS"
    Name = "vnet-2"
    AddressPrefix = "10.1.0.0/16"
}
$virtualNetwork2 = New-AzVirtualNetwork @vnet2

# Create the subnet configuration.
$subConfig = @{
    Name = "subnet-1"
    AddressPrefix = "10.1.0.0/24"
    VirtualNetwork = $virtualNetwork2
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subConfig

# Write the subnet configuration to the virtual network.
$virtualNetwork2 | Set-AzVirtualNetwork
```

## Peer virtual networks

Create a peering with [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering). The following example peers **vnet-1** to **vnet-2**.

```azurepowershell-interactive
$peerConfig1 = @{
    Name = "vnet-1-to-vnet-2"
    VirtualNetwork = $virtualNetwork1
    RemoteVirtualNetworkId = $virtualNetwork2.Id
}
Add-AzVirtualNetworkPeering @peerConfig1
```

In the output returned after the previous command executes, you see that the **PeeringState** is **Initiated**. The peering remains in the **Initiated** state until you create the peering from **vnet-2** to **vnet-1**. Create a peering from **vnet-2** to **vnet-1**.

```azurepowershell-interactive
$peerConfig2 = @{
    Name = "vnet-2-to-vnet-1"
    VirtualNetwork = $virtualNetwork2
    RemoteVirtualNetworkId = $virtualNetwork1.Id
}
Add-AzVirtualNetworkPeering @peerConfig2
```

In the output returned after the previous command executes, you see that the **PeeringState** is **Connected**. Azure also changed the peering state of the **vnet-1-to-vnet-2** peering to **Connected**. Confirm that the peering state for the **vnet-1-to-vnet-2** peering changed to **Connected** with [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering).

```azurepowershell-interactive
$peeringState = @{
    ResourceGroupName = "test-rg"
    VirtualNetworkName = "vnet-1"
}
Get-AzVirtualNetworkPeering @peeringState | Select PeeringState
```

Resources in one virtual network cannot communicate with resources in the other virtual network until the **PeeringState** for the peerings in both virtual networks is **Connected**.

## Create virtual machines

Create a VM in each virtual network so that you can communicate between them in a later step.

### Create the first VM

Create a VM with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM named **vm-1** in the **vnet-1** virtual network. The `-AsJob` option creates the VM in the background, so you can continue to the next step. When prompted, enter the user name and password for the virtual machine.

```azurepowershell-interactive
$vm1 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS"
    VirtualNetworkName = "vnet-1"
    SubnetName = "subnet-1"
    ImageName = "Win2019Datacenter"
    Name = "vm-1"
}
New-AzVm @vm1 -AsJob
```

### Create the second VM

```azurepowershell-interactive
$vm2 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS"
    VirtualNetworkName = "vnet-2"
    SubnetName = "subnet-1"
    ImageName = "Win2019Datacenter"
    Name = "vm-2"
}
New-AzVm @vm2
```

The VM takes a few minutes to create. Don't continue with the later steps until Azure creates **vm-2** and returns output to PowerShell.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Communicate between VMs

You can connect to a VM's public IP address from the internet. Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to return the public IP address of a VM. The following example returns the public IP address of the **vm-1** VM:

```azurepowershell-interactive
$ipAddress = @{
    ResourceGroupName = "test-rg"
    Name = "vm-1"
}
Get-AzPublicIpAddress @ipAddress | Select IpAddress
```

Use the following command to create a remote desktop session with the **vm-1** VM from your local computer. Replace `<publicIpAddress>` with the IP address returned from the previous command.

```
mstsc /v:<publicIpAddress>
```

A Remote Desktop Protocol (.rdp) file is created and opened. Enter the user name and password (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM), and then click **OK**. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection.

On **vm-1**, enable the Internet Control Message Protocol (ICMP) through the Windows Firewall so you can ping this VM from **vm-2** in a later step, using PowerShell:

```powershell
New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
```

**Though ping is used to communicate between VMs in this article, allowing ICMP through the Windows Firewall for production deployments is not recommended.**

To connect to **vm-2**, enter the following command from a command prompt on **vm-1**:

```
mstsc /v:10.1.0.4
```

You enabled ping on **vm-1**. You can now ping **vm-1** by IP address from a command prompt on **vm-2**.

```
ping 10.0.0.4
```

You receive four replies. Disconnect your RDP sessions to both **vm-1** and **vm-2**.

## Clean up resources

When no longer needed, use [Remove-AzResourcegroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name test-rg -Force
```

## Next steps

In this article, you learned how to connect two networks in the same Azure region, with virtual network peering. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region) and in [different Azure subscriptions](create-peering-different-subscriptions.md), as well as create [hub and spoke network designs](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke#virtual-network-peering) with peering. To learn more about virtual network peering, see [Virtual network peering overview](virtual-network-peering-overview.md) and [Manage virtual network peerings](virtual-network-manage-peering.md).

You can [connect your own computer to a virtual network](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) through a VPN, and interact with resources in a virtual network, or in peered virtual networks. For reusable scripts to complete many of the tasks covered in the virtual network articles, see [script samples](powershell-samples.md).
