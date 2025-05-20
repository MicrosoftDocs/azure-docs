---
title: Create a virtual network gateway - PowerShell
titleSuffix: Azure VPN Gateway
description: Learn how to create a virtual network gateway for VPN Gateway connections using PowerShell.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 11/19/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
---

# Create a VPN gateway using PowerShell

This article helps you create an Azure VPN gateway using PowerShell. A VPN gateway is used when creating a VPN connection to your on-premises network. You can also use a VPN gateway to connect virtual networks. For more comprehensive information about some of the settings in this article, see [Create a VPN gateway - portal](tutorial-create-gateway-portal.md).

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram that shows a virtual network and a VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

* The left side of the diagram shows the virtual network and the VPN gateway that you create by using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [site-to-site](tutorial-site-to-site-portal.md) and [point-to-site](point-to-site-about.md) connections. To view different design architectures that you can build, see [VPN gateway design](design.md).

The steps in this article create a virtual network, a subnet, a gateway subnet, and a route-based, zone-redundant active-active mode VPN gateway (virtual network gateway) using the Generation 2 VpnGw2AZ SKU. Once the gateway is created, you can configure connections.

* If you want to create a VPN gateway using the **Basic** SKU instead, see [Create a Basic SKU VPN gateway](create-gateway-basic-sku-powershell.md).
* We recommend that you create an active-active mode VPN gateway when possible. Active-active mode VPN gateways provide better availability and performance than standard mode VPN gateways. For more information about active-active gateways, see [About active-active mode gateways](about-active-active-gateways.md).
* For information about availability zones and zone redundant gateways, see [What are availability zones](/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvpn-gateway%2Ftoc.json&tabs=azure-cli#availability-zones)?

> [!NOTE]
> [!INCLUDE [AZ SKU region support note](../../includes/vpn-gateway-az-regions-support-include.md)]

## Before you begin

These steps require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [About PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## Create a resource group

Create an Azure resource group using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed. If you're running PowerShell locally, open your PowerShell console with elevated privileges and connect to Azure using the `Connect-AzAccount` command.

```azurepowershell-interactive
New-AzResourceGroup -Name TestRG1 -Location EastUS
```

## <a name="vnet"></a>Create a virtual network

If you don't already have a virtual network, create one with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). When you create a virtual network, make sure that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network. If a duplicate address range exists on both sides of the VPN connection, traffic doesn't route the way you might expect it to. Additionally, if you want to connect this virtual network to another virtual network, the address space can't overlap with other virtual network. Take care to plan your network configuration accordingly.

The following example creates a virtual network named **VNet1** in the **EastUS** location:

```azurepowershell-interactive
$virtualnetwork = New-AzVirtualNetwork `
  -ResourceGroupName TestRG1 `
  -Location EastUS `
  -Name VNet1 `
  -AddressPrefix 10.1.0.0/16
```

Create a subnet configuration using the [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet. The FrontEnd subnet isn't used in this exercise. You can substitute your own subnet name.

```azurepowershell-interactive
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name FrontEnd `
  -AddressPrefix 10.1.0.0/24 `
  -VirtualNetwork $virtualnetwork
```

Set the subnet configuration for the virtual network using the [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork) cmdlet.

```azurepowershell-interactive
$virtualnetwork | Set-AzVirtualNetwork
```

## <a name="gwsubnet"></a>Add a gateway subnet

[!INCLUDE [About GatewaySubnet with links](../../includes/vpn-gateway-about-gwsubnet-include.md)]

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

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

## <a name="PublicIP"></a>Request public IP addresses

A VPN gateway must have a public IP address. When you create a connection to a VPN gateway, this is the IP address that you specify. For active-active mode gateways, each gateway instance has its own public IP address resource. You first request the IP address resource, and then refer to it when creating your virtual network gateway. Additionally, for any gateway SKU ending in *AZ*, you must also specify the Zone setting. This example specifies a zone-redundant configuration because it specifies all three regional zones.

The IP address is assigned to the resource when the VPN gateway is created. The only time the public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

Use the following examples to request a static public IP address for each gateway instance.

```azurepowershell-interactive
$gw1pip1 = New-AzPublicIpAddress -Name "VNet1GWpip1" -ResourceGroupName "TestRG1" -Location "EastUS" -AllocationMethod Static -Sku Standard -Zone 1,2,3
```

To create an active-active gateway (recommended), request a second public IP address:

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

Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. Once the gateway is created, you can create connection between your virtual network and your on-premises location. Or, create a connection between your virtual network and another virtual network.

Create a VPN gateway using the [New-AzVirtualNetworkGateway](/powershell/module/az.network/New-azVirtualNetworkGateway) cmdlet. Notice in the examples that both public IP addresses are referenced and the gateway is configured as active-active using the `EnableActiveActiveFeature` switch. In the example, we add the optional `-Debug` switch. If you want to create a gateway using a different SKU, see [About Gateway SKUs](about-gateway-skus.md) to determine the SKU that best fits your configuration requirements.

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

## <a name="viewgwpip"></a>View gateway IP addresses

Each VPN gateway instance is assigned a public IP address resource. To view the IP address associated with the resource, use the [Get-AzPublicIpAddress](/powershell/module/az.network/Get-azPublicIpAddress) cmdlet. Repeat for each gateway instance. Active-active gateways have a different public IP address assigned to each instance.

```azurepowershell-interactive
Get-AzPublicIpAddress -Name VNet1GWpip1 -ResourceGroupName TestRG1
```

## Clean up resources

When you no longer need the resources you created, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to delete the resource group. This deletes the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name TestRG1
```

## Next steps

Once the gateway is created, you can configure connections.

* [Create a site-to-site connection](vpn-gateway-create-site-to-site-rm-powershell.md)
* [Create a point-to-site connection](vpn-gateway-howto-point-to-site-rm-ps.md)
* [Create a connection to another virtual network](vpn-gateway-vnet-vnet-rm-ps.md)
