<properties 
   pageTitle="Configure forced tunneling for Site-to-Site connections using the Resource Manager deployment model | Microsoft Azure"
   description="How to redirect or 'force' all Internet-bound traffic back to your on-premises location."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/29/2016"
   ms.author="cherylmc" />

# Configure forced tunneling using the Azure Resource Manager deployment model

> [AZURE.SELECTOR]
- [Resource Manager - PowerShell](vpn-gateway-forced-tunneling-rm.md)
- [Classic - PowerShell](vpn-gateway-about-forced-tunneling.md)

Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via a Site-to-Site VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies.

Without forced tunneling, Internet-bound traffic from your VMs in Azure will always traverse from Azure network infrastructure directly out to the Internet, without the option to allow you to inspect or audit the traffic. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches

### Deployment models and methods for forced tunneling

Forced tunneling can be configured for both the classic, and the Resource Manager deployment models. See the following table for more information. We update this table as new articles, and additional tools become available for this configuration. When an article is available, we link directly to it from the table.<br><br>

[AZURE.INCLUDE [vpn-gateway-table-forced-tunneling](../../includes/vpn-gateway-table-forcedtunnel-include.md)] 
<br>

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 


## About forced tunneling


The following diagram illustrates how forced tunneling works. 

![Forced Tunneling](./media/vpn-gateway-forced-tunneling-rm/forced-tunnel.png)

In the example above, the Frontend subnet is not forced tunneled. The workloads in the Frontend subnet can continue to accept and respond to customer requests from the Internet directly. The Mid-tier and Backend subnets are forced tunneled. Any outbound connections from these two subnets to the Internet will be forced or redirected back to an on-premises site via one of the S2S VPN tunnels.

This allows you to restrict and inspect Internet access from your virtual machines or cloud services in Azure, while continuing to enable your multi-tier service architecture required. You also can apply forced tunneling to entire virtual networks if there are no Internet-facing workloads in your virtual networks.

>[AZURE.IMPORTANT] There is a change in forced tunneling configurations with Azure VPN gateway. Right now, when you set the default site on the gateway, it will generate a default route in the gateway routing table, and propagated the default route to the entire virtual network.<br><br>For subnets to which you want to enable forced tunneling, you don't need to do anything.<br><br>For subnets to which you do NOT want to enable forced tunneling, you need to add a default route (via user-defined routes) to the subnet routing tables to point to the Internet.<br><br>If you apply forced tunneling to a VNet, or to a number of subnets in a VNet, any VMs in those subnets cannot accept incoming connection requests from the Internet directly. The VMs can initiate connections to the Internet, but those connections will be redirected back to the on-premises site before they can reach the Internet. The traffic will be subject to your on-premises security or proxy settings.

## Requirements and considerations

Forced tunneling to an on-premises site is expressed as a default route (default site) on the Azure VPN gateway. The setting now applies to the entire virtual network (VNet) by default. You should apply user-defined routes to control whether a subnet is forced tunneled or not. For more information about user-defined routing and virtual networks, see [User-defined routes and IP forwarding](../virtual-network/virtual-networks-udr-overview.md).

- Each virtual network subnet has a built-in, system routing table. The system routing table has the following three groups of routes:

	- **Local VNet routes:** Directly to the destination VMs in the same virtual network
	
	- **On-premises routes:** To the Azure VPN gateway
	
	- **Default route:** Directly to the Internet. Packets destined to the private IP addresses not covered by the previous two sets of routes will be dropped.

- Forced tunneling must be associated with a VNet that has a route-based VPN gateway. You need to set a "default site" among the cross-premises local sites connected to the virtual network.

- VMs in the forced tunneled VNet or subnets cannot accept incoming connections directly from the Internet.

- VMs in the forced tunneled VNet or subnets can initiate connections to the Internet, but that traffic will be redirected to your on-premises sites before they could reach the Internet. They are also subjected to you on-premises security and proxy settings.

- When VMs in the forced tunneled VNet or subnets try to connect to the PaaS serviced provided by or on Azure, that traffic will be considered Internet traffic because the addresses or endpoints are on Azure public IP address spaces of the corresponding regions. As a result, the communication will also be forced back to the on-premises default site, then come back to the Azure datacenter regions of those services via the Internet. This whole path will introduce a substantial latency for the entire transactions.

- ExpressRoute forced tunneling is not configured via this mechanism, but instead, is enabled by advertising a default route via the ExpressRoute BGP peering sessions. For more information, see the [ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute).


## Configuration overview

The following procedure helps you create a resource group and a VNet. You'll then create a VPN gateway and configure forced tunneling. In this procedure, the virtual network "MultiTier-VNet" has 3 subnets: *Frontend*, *Midtier*, and *Backend*, with 4 cross-premises connections: *DefaultSiteHQ*, and 3 *Branches*.

The steps set the *DefaultSiteHQ* as the default site connection for forced tunneling, and configure the Midtier and Backend subnets to use forced tunneling.
	
## Before you begin

Verify that you have the following items before beginning your configuration.

- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

- The latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.


## <a name = "ft"></a> Configure forced tunneling for a virtual network

1. In the PowerShell console, log in to your Azure account. This cmdlet prompts you for the login credentials for your Azure Account. After logging in, it downloads your account settings so they are available to Azure PowerShell.

		Login-AzureRmAccount 

2. Get a list of your Azure subscriptions.

		Get-AzureRmSubscription

2. Specify the subscription that you want to use. 

		Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
		
3. Create a resource group.

		New-AzureRmResourceGroup -Name "ForcedTunneling" -Location "North Europe"

4. Create a virtual network and specify subnets. 

		$s1 = New-AzureRmVirtualNetworkSubnetConfig -Name "Frontend"      -AddressPrefix "10.1.0.0/24"
		$s2 = New-AzureRmVirtualNetworkSubnetConfig -Name "Midtier"       -AddressPrefix "10.1.1.0/24"
		$s3 = New-AzureRmVirtualNetworkSubnetConfig -Name "Backend"       -AddressPrefix "10.1.2.0/24"
		$s4 = New-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -AddressPrefix "10.1.200.0/28"
		$vnet = New-AzureRmVirtualNetwork -Name "MultiTier-VNet" -Location "North Europe" -ResourceGroupName "ForcedTunneling" -AddressPrefix "10.1.0.0/16" -Subnet $s1,$s2,$s3,$s4

5. Create the local network gateways.

		$lng1 = New-AzureRmLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.111" -AddressPrefix "192.168.1.0/24"
		$lng2 = New-AzureRmLocalNetworkGateway -Name "Branch1" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.112" -AddressPrefix "192.168.2.0/24"
		$lng3 = New-AzureRmLocalNetworkGateway -Name "Branch2" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.113" -AddressPrefix "192.168.3.0/24"
		$lng4 = New-AzureRmLocalNetworkGateway -Name "Branch3" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -GatewayIpAddress "111.111.111.114" -AddressPrefix "192.168.4.0/24"

6. Create the gateway with a default site

	The `-GatewayDefaultSite` is the parameter that allows the forced routing configuration to work, so take care to configure this setting properly. This parameter is available in PowerShell 1.0 or later. This step takes some time to complete, sometimes 45 minutes or more. 

		$pip = New-AzureRmPublicIpAddress -Name "GatewayIP" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -AllocationMethod Dynamic
		$gwsubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet
		$ipconfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name "gwIpConfig" -SubnetId $gwsubnet.Id -PublicIpAddressId $pip.Id

		New-AzureRmVirtualNetworkGateway -Name "Gateway1" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -IpConfigurations $ipconfig -GatewayType Vpn -VpnType RouteBased -GatewayDefaultSite $lng1 -GatewaySku Standard

7. Establish the Site-to-Site VPN connections

		$gateway = Get-AzureRmVirtualNetworkGateway -Name "Gateway1" -ResourceGroupName "ForcedTunneling"
		$lng1 = Get-AzureRmLocalNetworkGateway -Name "DefaultSiteHQ" -ResourceGroupName "ForcedTunneling" 
		$lng2 = Get-AzureRmLocalNetworkGateway -Name "Branch1" -ResourceGroupName "ForcedTunneling" 
		$lng3 = Get-AzureRmLocalNetworkGateway -Name "Branch2" -ResourceGroupName "ForcedTunneling" 
		$lng4 = Get-AzureRmLocalNetworkGateway -Name "Branch3" -ResourceGroupName "ForcedTunneling" 

		New-AzureRmVirtualNetworkGatewayConnection -Name "Connection1" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng1 -ConnectionType IPsec -SharedKey "preSharedKey"
		New-AzureRmVirtualNetworkGatewayConnection -Name "Connection2" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng2 -ConnectionType IPsec -SharedKey "preSharedKey"
		New-AzureRmVirtualNetworkGatewayConnection -Name "Connection3" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng3 -ConnectionType IPsec -SharedKey "preSharedKey"
		New-AzureRmVirtualNetworkGatewayConnection -Name "Connection4" -ResourceGroupName "ForcedTunneling" -Location "North Europe" -VirtualNetworkGateway1 $gateway -LocalNetworkGateway2 $lng4 -ConnectionType IPsec -SharedKey "preSharedKey"		


After this step, forced tunneling is configured and applied to the **entire** VNet. If you want to bypass forced tunneling for certain subnets inside the VNet, use the following instructions:


## <a name = "bypassft"></a>Bypass forced tunneling for a subnet in the forced tunneled virtual network

This section describes the steps to bypass forced tunneling for a subnet, "Frontend" in the forced tunneled VNet created above.

1. Create the routing table and route rule

	This step creates a routing table with a default route to the Internet.

		New-AzureRmRouteTable –Name "MyRoutingTable" -ResourceGroupName "ForcedTunneling" –Location "North Europe"
		$rt = Get-AzureRmRouteTable –Name "MyRouteTable" -ResourceGroupName "ForcedTunneling" 
		Add-AzureRmRouteConfig -Name "DefaultRoute" -AddressPrefix "0.0.0.0/0" -NextHopType Internet -RouteTable $rt
		Set-AzureRmRouteTable -RouteTable $rt

	The default route in the user-defined route will override the default route configured on the VPN gateway. As a result, the subnets this routing table associated with will not be forced tunneled.

2. Associate the routing table to the Frontend subnet

		$vnet = Get-AzureRmVirtualNetwork -Name "MultiTier-Vnet" -ResourceGroupName "ForcedTunneling"
		Set-AzureRmVirtualNetworkSubnetConfig -Name "Frontend" -VirtualNetwork $vnet -AddressPrefix "10.1.1.0/24" -RouteTable $rt
		Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

If you complete both parts of this example, your VNet will have the following configuration:

- The "Midtier" and "Backend" subnets will be forced tunneled. Their Internet-bound traffic will be redirected to the on-premises site, "DefaultSiteHQ", instead of the Internet.

- The "Frontend" subnet is not forced tunneled. It can continue to send traffic to the Internet, or accept incoming connections from the Internet directly.
