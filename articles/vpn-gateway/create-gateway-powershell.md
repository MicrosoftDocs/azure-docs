---
title: 'Create a virtual network gateway: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to create a route-based virtual network gateway for a VPN connection to your on-premises network, or to connect virtual networks.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/23/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
---

# Create a VPN gateway using PowerShell

This article helps you create an Azure VPN gateway using PowerShell. A VPN gateway is used when creating a VPN connection to your on-premises network. You can also use a VPN gateway to connect VNets. For more comprehensive information about some of the settings in this article, see [Create a VPN gateway - portal](tutorial-create-gateway-portal.md).

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram that shows a virtual network and a VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

A VPN gateway is one part of a connection architecture to help you securely access resources within a virtual network.

* The left side of the diagram shows the virtual network and the VPN gateway that you create by using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [site-to-site](tutorial-site-to-site-portal.md) and [point-to-site](point-to-site-about.md) connections. To view different design architectures that you can build, see [VPN gateway design](design.md).

The steps in this article create a virtual network, a subnet, a gateway subnet, and a route-based, zone-redundant active-active VPN gateway (virtual network gateway) using the Generation 2 VpnGw2AZ SKU. If you want to create a VPN gateway using the **Basic** SKU instead, see [Create a Basic SKU VPN gateway](create-gateway-basic-sku-powershell.md). Once the gateway creation completes, you can then create connections.

Active-active gateways differ from active-standby gateways in the following ways:

* Active-active gateways have two Gateway IP configurations and two public IP addresses.
* Active-active gateways have active-active setting enabled.
* The virtual network gateway SKU can't be Basic or Standard.

For more information about active-active gateways, see [Highly Available cross-premises and VNet-to-VNet connectivity](vpn-gateway-highlyavailable.md).
For more information about availability zones and zone redundant gateways, see [What are availability zones](/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvpn-gateway%2Ftoc.json&tabs=azure-cli#availability-zones)?

## Before you begin

These steps require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

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
$virtualnetwork = New-AzVirtualNetwork `
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
  -VirtualNetwork $virtualnetwork
```

Set the subnet configuration for the virtual network using the [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork) cmdlet.

```azurepowershell-interactive
$virtualnetwork | Set-AzVirtualNetwork
```

## <a name="gwsubnet"></a>Add a gateway subnet

The gateway subnet contains the reserved IP addresses that the virtual network gateway services use. Use the following examples to add a gateway subnet:

Set a variable for your virtual network.

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

Each VPN gateway must have an allocated public IP address. When you create a connection to a VPN gateway, this is the IP address that you specify. In this exercise, we create an active-active zone-redundant VPN gateway environment. That means that two Standard public IP addresses are required, one for each gateway, and we must also specify the Zone setting. This example specifies a zone-redundant configuration because it specifies all 3 regional zones.

Use the following examples to request a public IP address for each gateway.  The allocation method must be **Static**.

```azurepowershell-interactive
$gw1pip1 = New-AzPublicIpAddress -Name "VNet1GWpip1" -ResourceGroupName "TestRG1" -Location "EastUS" -AllocationMethod Static -Sku Standard -Zone 1,2,3
   ```

```azurepowershell-interactive
$gw1pip2 = New-AzPublicIpAddress -Name "VNet1GWpip2" -ResourceGroupName "TestRG1" -Location "EastUS" -AllocationMethod Static -Sku Standard -Zone 1,2,3
```

## <a name="GatewayIPConfig"></a>Create the gateway IP address configuration

The gateway configuration defines the subnet and the public IP address to use. Use the following example to create your gateway configuration.

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name VNet1 -ResourceGroupName TestRG1
$subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet

$gwipconfig1 = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gw1pip1.Id
$gwipconfig2 = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig2 -SubnetId $subnet.Id -PublicIpAddressId $gw1pip2.Id
```

## <a name="CreateGateway"></a>Create the VPN gateway

Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. Once the gateway is created, you can create a connection between your virtual network and another virtual network. Or, create a connection between your virtual network and an on-premises location.

Create a VPN gateway using the [New-AzVirtualNetworkGateway](/powershell/module/az.network/New-azVirtualNetworkGateway) cmdlet. Notice in the examples that both public IP addresses are referenced and the gateway is configured as active-active. In the example, we add the optional `-Debug` switch.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1 `
-Location "East US" -IpConfigurations $gwipconfig1,$gwipconfig2 -GatewayType "Vpn" -VpnType RouteBased `
-GatewaySku VpnGw2AZ -VpnGatewayGeneration Generation2 -EnableActiveActiveFeature -Debug
```

## <a name="viewgw"></a>View the VPN gateway

You can view the VPN gateway using the [Get-AzVirtualNetworkGateway](/powershell/module/az.network/Get-azVirtualNetworkGateway) cmdlet.

```azurepowershell-interactive
Get-AzVirtualNetworkGateway -Name Vnet1GW -ResourceGroup TestRG1
```

## <a name="viewgwpip"></a>View the public IP addresses

To view the public IP address for your VPN gateway, use the [Get-AzPublicIpAddress](/powershell/module/az.network/Get-azPublicIpAddress) cmdlet. Example:

```azurepowershell-interactive
Get-AzPublicIpAddress -Name VNet1GWpip1 -ResourceGroupName TestRG1
```

## Clean up resources

When you no longer need the resources you created, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to delete the resource group. This deletes the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name TestRG1
```

## Next steps

Once the gateway has finished creating, you can create a connection between your virtual network and another virtual network. Or, create a connection between your virtual network and an on-premises location.

* [Create a site-to-site connection](vpn-gateway-create-site-to-site-rm-powershell.md)<br><br>
* [Create a point-to-site connection](vpn-gateway-howto-point-to-site-rm-ps.md)<br><br>
* [Create a connection to another VNet](vpn-gateway-vnet-vnet-rm-ps.md)
