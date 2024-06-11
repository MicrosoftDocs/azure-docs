---
title: 'Create a route-based virtual network gateway: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to create a route-based virtual network gateway for a VPN connection to your on-premises network, or to connect virtual networks.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/07/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
---

# Create a route-based VPN gateway using PowerShell

This article helps you quickly create a route-based Azure VPN gateway using PowerShell. A VPN gateway is used when creating a VPN connection to your on-premises network. You can also use a VPN gateway to connect VNets.

A VPN gateway is just one part of a connection architecture to help you securely access resources within a virtual network.

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram that shows a virtual network and a VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

* The left side of the diagram shows the virtual network and the VPN gateway that you create by using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [site-to-site](tutorial-site-to-site-portal.md) and [point-to-site](point-to-site-about.md) connections. To view different design architectures that you can build, see [VPN gateway design](design.md).

## Before you begin

The steps in this article will create a VNet, a subnet, a gateway subnet, and a route-based VPN gateway (virtual network gateway). Once the gateway creation has completed, you can then create connections. These steps require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Working with Azure PowerShell

[!INCLUDE [powershell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. If you're running PowerShell locally, open your PowerShell console with elevated privileges and connect to Azure using the `Connect-AzAccount` command.

```azurepowershell-interactive
New-AzResourceGroup -Name TestRG1 -Location EastUS
```

## <a name="vnet"></a>Create a virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named **VNet1** in the **EastUS** location:

```azurepowershell-interactive
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName TestRG1 `
  -Location EastUS `
  -Name VNet1 `
  -AddressPrefix 10.1.0.0/16
```

Create a subnet configuration using the [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet.

```azurepowershell-interactive
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name Frontend `
  -AddressPrefix 10.1.0.0/24 `
  -VirtualNetwork $virtualNetwork
```

Set the subnet configuration for the virtual network using the [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork) cmdlet.

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

## <a name="gwsubnet"></a>Add a gateway subnet

The gateway subnet contains the reserved IP addresses that the virtual network gateway services use. Use the following examples to add a gateway subnet:

Set a variable for your VNet.

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -ResourceGroupName TestRG1 -Name VNet1
```

Create the gateway subnet using the [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Add-azVirtualNetworkSubnetConfig) cmdlet.

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.1.255.0/27 -VirtualNetwork $vnet
```

Set the subnet configuration for the virtual network using the [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork) cmdlet.

```azurepowershell-interactive
$vnet | Set-AzVirtualNetwork
```

## <a name="PublicIP"></a>Request a public IP address

A VPN gateway must have an allocated public IP address. When you create a connection to a VPN gateway, this is the IP address that you specify. Use the following example to request a public IP address. Note that if you want to create a VPN gateway using the Basic gateway SKU, use the following values when requesting a public IP address: `-AllocationMethod Dynamic -Sku Basic`.

```azurepowershell-interactive
$gwpip = New-AzPublicIpAddress -Name "VNet1GWIP" -ResourceGroupName "TestRG1" -Location "EastUS" -AllocationMethod Static
```

## <a name="GatewayIPConfig"></a>Create the gateway IP address configuration

The gateway configuration defines the subnet and the public IP address to use. Use the following example to create your gateway configuration:

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name VNet1 -ResourceGroupName TestRG1
$subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
$gwipconfig = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id
```
## <a name="CreateGateway"></a>Create the VPN gateway

Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. Once the gateway has completed, you can create a connection between your virtual network and another VNet. Or, create a connection between your virtual network and an on-premises location. Create a VPN gateway using the [New-AzVirtualNetworkGateway](/powershell/module/az.network/New-azVirtualNetworkGateway) cmdlet.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1 `
-Location "East US" -IpConfigurations $gwipconfig -GatewayType "Vpn" `
-VpnType "RouteBased" -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2"
```

## <a name="viewgw"></a>View the VPN gateway

You can view the VPN gateway using the [Get-AzVirtualNetworkGateway](/powershell/module/az.network/Get-azVirtualNetworkGateway) cmdlet.

```azurepowershell-interactive
Get-AzVirtualNetworkGateway -Name Vnet1GW -ResourceGroup TestRG1
```
## <a name="viewgwpip"></a>View the public IP address

To view the public IP address for your VPN gateway, use the [Get-AzPublicIpAddress](/powershell/module/az.network/Get-azPublicIpAddress) cmdlet.

```azurepowershell-interactive
Get-AzPublicIpAddress -Name VNet1GWIP -ResourceGroupName TestRG1
```

## Clean up resources

When you no longer need the resources you created, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to delete the resource group. This deletes the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name TestRG1
```

## Next steps

Once the gateway has finished creating, you can create a connection between your virtual network and another VNet. Or, create a connection between your virtual network and an on-premises location.

> [!div class="nextstepaction"]
> [Create a site-to-site connection](vpn-gateway-create-site-to-site-rm-powershell.md)<br><br>
> [Create a point-to-site connection](vpn-gateway-howto-point-to-site-rm-ps.md)<br><br>
> [Create a connection to another VNet](vpn-gateway-vnet-vnet-rm-ps.md)
