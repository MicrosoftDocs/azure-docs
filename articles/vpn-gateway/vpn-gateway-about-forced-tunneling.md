<properties 
   pageTitle="Configure forced tunneling for Site-to-Site connections using the classic deployment model | Microsoft Azure"
   description="How to redirect or 'force' all Internet-bound traffic back to your on-premises location."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/29/2016"
   ms.author="cherylmc" />

# Configure forced tunneling using the classic deployment model

> [AZURE.SELECTOR]
- [Resource Manager - PowerShell](vpn-gateway-forced-tunneling-rm.md)
- [Classic - PowerShell](vpn-gateway-about-forced-tunneling.md)


Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via a Site-to-Site VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. 

Without forced tunneling, Internet-bound traffic from your VMs in Azure will always traverse from Azure network infrastructure directly out to the Internet, without the option to allow you to inspect or audit the traffic. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

### Deployment models and methods for forced tunneling

Forced tunneling can be configured for both the classic, and the Resource Manager deployment models. See the following table for more information. We update this table as new articles, and additional tools become available for this configuration. When an article is available, we link directly to it from the table.<br><br>

[AZURE.INCLUDE [vpn-gateway-forcedtunnel](../../includes/vpn-gateway-table-forcedtunnel-include.md)] 
<br>

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

>[AZURE.IMPORTANT] There is a change in forced tunneling configurations with Azure VPN gateway. Right now, when you set the default site on the gateway, it will generate a default route in the gateway routing table, and propagated the default route to the entire virtual network.<br><br>For subnets to which you want to enable forced tunneling, you don't need to do anything.<br><br>For subnets to which you do NOT want to enable forced tunneling, you need to add a default route (via user-defined routes) to the subnet routing tables to point to the Internet.<br><br>If you apply forced tunneling to a VNet, or to a number of subnets in a VNet, any VMs in those subnets cannot accept incoming connection requests from the Internet directly. The VMs can initiate connections to the Internet, but those connections will be redirected back to the on-premises site before they can reach the Internet. The traffic will be subject to your on-premises security or proxy settings.


## Requirements and considerations

Forced tunneling to an on-premises site is expressed as a default route (default site) on the Azure VPN gateway. The setting now applies to the entire virtual network (VNet) by default. You should apply user-defined routes to control whether a subnet is forced tunneled or not. For more information about user-defined routing and virtual networks, see [User-defined routes and IP forwarding](../virtual-network/virtual-networks-udr-overview.md).

- Each virtual network subnet has a built-in, system routing table. The system routing table has the following three groups of routes:

	- **Local VNet routes:** Directly to the destination VMs in the same virtual network
	
	- **On-premises routes:** To the Azure VPN gateway
	
	- **Default route:** Directly to the Internet. Packets destined to the private IP addresses not covered by the previous two sets of routes will be dropped.

- Forced tunneling must be associated with a VNet that has a dynamic routing VPN gateway. You need to set a "default site" among the cross-premises local sites connected to the virtual network.

- VMs in the forced tunneled VNet or subnets cannot accept incoming connections directly from the Internet.

- VMs in the forced tunneled VNet or subnets can initiate connections to the Internet, but the traffic will be redirected to your on-premises sites before they reach the Internet. They are also subjected to you on-premises security and proxy settings.

- When VMs in the forced tunneled VNet or subnets try to connect to the PaaS serviced provided by or on Azure, the traffic will be considered Internet traffic because the addresses or endpoints are on Azure public IP address spaces of the corresponding regions. As a result, the communication will also be forced back to the on-premises default site, then come back to the Azure datacenter regions of those services via the Internet. This whole path will introduce a substantial latency for the entire transactions.

- ExpressRoute forced tunneling is not configured via this mechanism, but instead, is enabled by advertising a default route via the ExpressRoute BGP peering sessions. For more information, see the [ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute).


## Configuration overview

In the following example, the Frontend subnet is not forced tunneled. The workloads in the Frontend subnet can continue to accept and respond to customer requests from the Internet directly. The Mid-tier and Backend subnets are forced tunneled. Any outbound connections from these two subnets to the Internet will be forced or redirected back to an on-premises site via one of the S2S VPN tunnels.

This allows you to restrict and inspect Internet access from your virtual machines or cloud services in Azure, while continuing to enable your multi-tier service architecture required. You also can apply forced tunneling to the entire virtual networks if there are no Internet-facing workloads in your virtual networks.


![Forced Tunneling](./media/vpn-gateway-about-forced-tunneling/forced-tunnel.png)


## Before you begin

Verify that you have the following items before beginning configuration:

- A configured virtual network. 

- The latest version of the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.


## <a name = "ft"></a>Configure forced tunneling

The following procedure will help you specify forced tunneling for a virtual network. The configuration steps correspond to the VNet network configuration file.

	<VirtualNetworkSite name="MultiTier-VNet" Location="North Europe">
     <AddressSpace>
      <AddressPrefix>10.1.0.0/16</AddressPrefix>
        </AddressSpace>
        <Subnets>
          <Subnet name="Frontend">
            <AddressPrefix>10.1.0.0/24</AddressPrefix>
          </Subnet>
          <Subnet name="Midtier">
            <AddressPrefix>10.1.1.0/24</AddressPrefix>
          </Subnet>
          <Subnet name="Backend">
            <AddressPrefix>10.1.2.0/23</AddressPrefix>
          </Subnet>
          <Subnet name="GatewaySubnet">
            <AddressPrefix>10.1.200.0/28</AddressPrefix>
          </Subnet>
        </Subnets>
        <Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="DefaultSiteHQ">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Branch1">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Branch2">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Branch3">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
        </Gateway>
      </VirtualNetworkSite>
	</VirtualNetworkSite>

In this example, the virtual network "MultiTier-VNet" has three subnets: *Frontend*, *Midtier*, and *Backend* subnets, with four cross premises connections: *DefaultSiteHQ*, and three *Branches*. 

The following cmdlets will set the *DefaultSiteHQ* as the default site connection for forced tunneling, and configure the Midtier and Backend subnets to use forced tunneling.

	$DefaultSite = @("DefaultSiteHQ")
	Set-AzureVNetGatewayDefaultSite –VNetName "MultiTier-VNet" –DefaultSite "DefaultSiteHQ"

After adding the default site, forced tunneling is configured and applied to the **entire** VNet. If you want to bypass forced tunneling for certain subnets inside the VNet, use the following instructions:

## <a name = "bypassft"></a>Bypass forced tunneling for a subnet in the forced tunneled VNet

This section describes the steps to bypass forced tunneling for a subnet, "Frontend", in the forced tunneled VNet created above.

1. Create a routing table. Use the following cmdlet to create your route table.

		New-AzureRouteTable –Name "MyRouteTable" –Label "Routing table to bypass forced tunneling" –Location "North Europe"

2. Add a default route to the routing table. 

	The following example adds a default route to the routing table pointing to the Internet.
 
		$rt = $rt = Get-AzureRouteTable -Name MyRouteTable
		Set-AzureRoute –RouteTable $rt –RouteName "DefaultRoute" –AddressPrefix "0.0.0.0/0" –NextHopType Internet

	The default route in the user-defined route will override the default route configured on the VPN gateway. As a result, the subnets this routing table is associated with will not be forced tunneled.

3. Associate the routing table to the subnets. 

	After a routing table is created and a route added, use the following example to add or associate the route table to a VNet subnet. The example adds the route table "MyRouteTable" to the Frontend subnet of VNet MultiTier-VNet.

		Set-AzureSubnetRouteTable -VirtualNetworkName "MultiTier-VNet" -SubnetName "Frontend" -RouteTableName "MyRouteTable"

If you complete both parts of this example, your VNet will have the following configuration:

- The "Midtier" and "Backend" subnets will be forced tunneled. Their Internet-bound traffic will be redirected to the on-premises site, "DefaultSiteHQ", instead of the Internet.

- The "Frontend" subnet is not forced tunneled. It can continue to send traffic to the Internet, or accept incoming connections from the Internet directly.

## Additional PowerShell cmdlets

### To delete a route table

	Remove-AzureRouteTable -Name <routeTableName>

### To list a route table

	Get-AzureRouteTable [-Name <routeTableName> [-DetailLevel <detailLevel>]]

### To delete a route from a route table

	Remove-AzureRouteTable –Name <routeTableName>

### To remove a route from a subnet

	Remove-AzureSubnetRouteTable –VirtualNetworkName <virtualNetworkName> -SubnetName <subnetName>

### To list the route table associated with a subnet
	
	Get-AzureSubnetRouteTable -VirtualNetworkName <virtualNetworkName> -SubnetName <subnetName>

### To remove a default site from a VNet VPN gateway

	Remove-AzureVnetGatewayDefaultSite -VNetName <virtualNetworkName>






