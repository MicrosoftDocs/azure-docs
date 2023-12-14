---
title: 'Configure forced tunneling for S2S connections - Default Site: PowerShell'
description: Learn how to force tunnel traffic for VPN Gateway site-to-site connections by specifying the Default Site setting - PowerShell. Also learn how to specify Internet-bound traffic routing for specific subnets.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 09/22/2023
ms.author: cherylmc
---
# Configure forced tunneling using Default Site for site-to-site connections

The steps in this article help you configure forced tunneling for site-to-site (S2S) IPsec connections by specifying a Default Site. For information about configuration methods for forced tunneling, including configuring forced tunneling via BGP, see [About forced tunneling for VPN Gateway](about-site-to-site-tunneling.md).

By default, Internet-bound traffic from your VMs goes directly to the Internet. If you want to force all Internet-bound traffic through the VPN gateway to an on-premises site for inspection and auditing, you can do so by configuring **forced tunneling**. After you configure forced tunneling, if desired, you can route Internet-bound traffic directly to the Internet for specified subnets using custom user-defined routes (UDRs).

:::image type="content" source="./media/about-site-to-site-tunneling/tunnel-user-defined-routing.png" alt-text="Diagram shows split tunneling." lightbox="./media/about-site-to-site-tunneling/tunnel-user-defined-routing-high-res.png":::

The following steps help you configure a forced tunneling scenario by specifying a Default Site. Optionally, using custom UDR, you can route traffic by specifying that Internet-bound traffic from the Frontend subnet goes directly to the Internet, rather than to the on-premises site.

* The VNet you create has three subnets: Frontend, Mid-tier, and Backend with four cross-premises connections: DefaultSiteHQ, and three branches.
* You specify the Default Site for your VPN gateway using PowerShell, which forces all Internet traffic back to the on-premises location. The Default Site can't be configured using the Azure portal.
* The Frontend subnet is assigned a UDR to send Internet traffic directly to the Internet, bypassing the VPN gateway. Other traffic is routed normally.
* The Mid-tier and Backend subnets continue to have Internet traffic force tunneled back to the on-premises site via the VPN gateway because a Default Site is specified.

## Create a VNet and subnets

First, create the test environment. You can either use Azure Cloud Shell, or you can run PowerShell locally. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/).

> [!NOTE]
> You may see warnings saying "The output object type of this cmdlet will be modified in a future release". This is expected behavior and you can safely ignore these warnings.

1. Create a resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

   ```azurepowershell-interactive
   New-AzResourceGroup -Name "TestRG1" -Location "EastUS"
   ```

1. Create the virtual network using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).

   ```azurepowershell-interactive
   $vnet = New-AzVirtualNetwork `
   -ResourceGroupName "TestRG1" `
   -Location "EastUS" `
   -Name "VNet1" `
   -AddressPrefix 10.1.0.0/16
   ```

1. Create subnets using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). Create Frontend, Mid-tier, and Backend subnets and a gateway subnet (which must be named *GatewaySubnet*).

   ```azurepowershell-interactive
   $subnetConfigFrontend = Add-AzVirtualNetworkSubnetConfig `
     -Name Frontend `
     -AddressPrefix 10.1.0.0/24 `
     -VirtualNetwork $vnet

   $subnetConfigMid-tier = Add-AzVirtualNetworkSubnetConfig `
     -Name Mid-tier `
     -AddressPrefix 10.1.1.0/24 `
     -VirtualNetwork $vnet

   $subnetConfigBackend = Add-AzVirtualNetworkSubnetConfig `
     -Name Backend `
     -AddressPrefix 10.1.2.0/24 `
     -VirtualNetwork $vnet

   $subnetConfigGW = Add-AzVirtualNetworkSubnetConfig `
     -Name GatewaySubnet `
     -AddressPrefix 10.1.200.0/27 `
     -VirtualNetwork $vnet
   ```

1. Write the subnet configurations to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork), which creates the subnets in the virtual network:

   ```azurepowershell-interactive
   $vnet | Set-AzVirtualNetwork
   ```

## Create local network gateways

In this section, create the local network gateways for the sites using [New-AzLocalNetworkGateway](/powershell/module/az.network/new-azlocalnetworkgateway). There's a slight pause between each command as each local network gateway is created. In this example, the `-GatewayIpAddress` values are placeholders. To make a connection, you need to later replace these values with the public IP addresses of the respective on-premises VPN devices.

   ```azurepowershell-interactive
   $lng1 = New-AzLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "TestRG1" -Location "EastUS" -GatewayIpAddress "111.111.111.111" -AddressPrefix "192.168.1.0/24"
   $lng2 = New-AzLocalNetworkGateway -Name "Branch1" -ResourceGroupName "TestRG1" -Location "EastUS" -GatewayIpAddress "111.111.111.112" -AddressPrefix "192.168.2.0/24"
   $lng3 = New-AzLocalNetworkGateway -Name "Branch2" -ResourceGroupName "TestRG1" -Location "EastUS" -GatewayIpAddress "111.111.111.113" -AddressPrefix "192.168.3.0/24"
   $lng4 = New-AzLocalNetworkGateway -Name "Branch3" -ResourceGroupName "TestRG1" -Location "EastUS" -GatewayIpAddress "111.111.111.114" -AddressPrefix "192.168.4.0/24"
   ```

## Create a VPN gateway

In this section, you request a public IP address and create a VPN gateway that's associated to the public IP address object. The public IP address is used when you connect an on-premises or external VPN device to the VPN gateway for cross-premises connections.

1. Request a public IP address for your VPN gateway using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

   ```azurepowershell-interactive
   $gwpip = New-AzPublicIpAddress -Name "GatewayIP" -ResourceGroupName "TestRG1" -Location "EastUS" -AllocationMethod Static -Sku Standard
   ```

1. Create the gateway IP address configuration using [New-AzVirtualNetworkGatewayIpConfig](/powershell/module/az.network/new-azvirtualnetworkgatewayipconfig). This configuration is referenced when you create the VPN gateway.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name "VNet1" -ResourceGroupName "TestRG1"
   $gwsubnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
   $gwipconfig = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $gwsubnet.Id -PublicIpAddressId $gwpip.Id
   ```

1. Create the virtual network gateway with the gateway type "Vpn" using [New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway). Creating a gateway can take 45 minutes or more, depending on the selected gateway SKU that you select.

   In this example, we use the VpnGw2, Generation 2 SKU. If you see ValidateSet errors regarding the GatewaySKU value, verify that you have installed the [latest version of the PowerShell cmdlets](/powershell/azure/). The latest version contains the new validated values for the latest Gateway SKUs.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1" -Location "EastUS" -IpConfigurations $gwipconfig -GatewayType "Vpn" -VpnType "RouteBased" -GatewaySku VpnGw2 -VpnGatewayGeneration "Generation2"
   ```

## Configure forced tunneling - Default Site

Configure forced tunneling by assigning a Default Site to the virtual network gateway. If you don't specify a Default Site, Internet traffic isn't forced through the VPN gateway and will, instead, traverse directly out to the Internet for all subnets (by default).

To assign a Default Site for the gateway, you use the **-GatewayDefaultSite** parameter. Be sure to assign this properly.

1. First, declare the variables that specify the virtual network gateway information and the local network gateway for the Default Site, in this case, DefaultSiteHQ.

   ```azurepowershell-interactive
   $LocalGateway = Get-AzLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "TestRG1"
   $VirtualGateway = Get-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

1. Next, set the virtual network gateway Default Site using [Set-AzVirtualNetworkGatewayDefaultSite](/powershell/module/az.network/set-azvirtualnetworkgatewaydefaultsite).

   ```azure-powershell-interactive
   Set-AzVirtualNetworkGatewayDefaultSite -GatewayDefaultSite $LocalGateway -VirtualNetworkGateway $VirtualGateway
   ```

At this point, all Internet-bound traffic is now configured to be force tunneled to *DefaultSiteHQ*. The on-premises VPN device must be configured using 0.0.0.0/0 as traffic selectors.

* If you want to only configure forced tunneling, and not route Internet traffic directly to the Internet for specific subnets, you can skip to the [Establish Connections](#establish-s2s-vpn-connections) section of this article to create your connections.
* If you want specific subnets to send Internet-bound traffic directly to the Internet, continue with the next sections to configure custom UDRs and assign routes.

## <a name="udr"></a>Route Internet-bound traffic for specific subnets

As an option, if you want Internet-bound traffic to be sent directly to the Internet for specific subnets (rather than to your on-premises network), use the following steps. These steps apply to forced tunneling that has been configured either by specifying a Default Site, or that has been configured via BGP.

### Create route tables and routes

To specify that Internet-bound traffic should go directly to the Internet, create the necessary route table and route. You'll later assign the route table to the Frontend subnet.

1. Create the route tables using [New-AzRouteTable](/powershell/module/az.network/new-azroutetable).

   ```azurepowershell-interactive
   $routeTable1 = New-AzRouteTable `
   -Name 'RouteTable1' `
   -ResourceGroupName "TestRG1" `
   -location "EastUS"
   ```

1. Create routes using the following cmdlets: [GetAzRouteTable](/powershell/module/az.network/get-azroutetable), [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig), and [Set-AzRouteConfig](/powershell/module/az.network/set-azrouteconfig). Create the route for next hop type "Internet" in RouteTable1. This route is assigned later to the Frontend subnet.

   ```azurepowershell-interactive
   Get-AzRouteTable `
      -ResourceGroupName "TestRG1" `
      -Name "RouteTable1" `
      | Add-AzRouteConfig `
      -Name "ToInternet" `
      -AddressPrefix 0.0.0.0/0 `
      -NextHopType "Internet" `
      | Set-AzRouteTable
   ```

### Assign routes

In this section, you assign the route table and routes to the Frontend subnet using the following PowerShell commands: [GetAzRouteTable](/powershell/module/az.network/get-azroutetable), [Set-AzRouteConfig](/powershell/module/az.network/set-azrouteconfig), and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork).

1. Assign the Frontend subnet to the RouteTable1 with route "ToInternet" specifying 0.0.0.0/0 with next hop Internet.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name "VNet1" -ResourceGroupName "TestRG1"
   $routeTable1 = Get-AzRouteTable `
      -ResourceGroupName "TestRG1" `
      -Name "RouteTable1" 
   Set-AzVirtualNetworkSubnetConfig `
      -VirtualNetwork $vnet `
      -Name 'Frontend' `
      -AddressPrefix 10.1.0.0/24 `
      -RouteTable $routeTable1 | `
   Set-AzVirtualNetwork
   ```
  
### Establish S2S VPN connections

Use [New-AzVirtualNetworkGatewayConnection](/powershell/module/az.network/new-azvirtualnetworkgatewayconnection) to establish the S2S connections.

1. Declare your variables.

   ```azurepowershell-interactive
   $gateway = Get-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   $lng1 = Get-AzLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "TestRG1" 
   $lng2 = Get-AzLocalNetworkGateway -Name "Branch1" -ResourceGroupName "TestRG1" 
   $lng3 = Get-AzLocalNetworkGateway -Name "Branch2" -ResourceGroupName "TestRG1" 
   $lng4 = Get-AzLocalNetworkGateway -Name "Branch3" -ResourceGroupName "TestRG1"
   ```

1. Create the connections.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name "Connection1" -ResourceGroupName "TestRG1" -Location "EastUS" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng1 -ConnectionType IPsec -SharedKey "preSharedKey"
   New-AzVirtualNetworkGatewayConnection -Name "Connection2" -ResourceGroupName "TestRG1" -Location "EastUS" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng2 -ConnectionType IPsec -SharedKey "preSharedKey"
   New-AzVirtualNetworkGatewayConnection -Name "Connection3" -ResourceGroupName "TestRG1" -Location "EastUS" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng3 -ConnectionType IPsec -SharedKey "preSharedKey"
   New-AzVirtualNetworkGatewayConnection -Name "Connection4" -ResourceGroupName "TestRG1" -Location "EastUS" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng4 -ConnectionType IPsec -SharedKey "preSharedKey"
   ```

1. To view a connection, use the following example. Modify any necessary values to specify the connection you want to view.

   ```azurepowershell-interactive
   Get-AzVirtualNetworkGatewayConnection -Name "Connection1" -ResourceGroupName "TestRG1"
   ```

## Next steps

For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
