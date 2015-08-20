<properties 
   pageTitle="Configure Forced Tunneling for Microsoft Azure VPN Gateways | Microsoft Azure"
   description="If you have a virtual network with a cross-premises VPN-gateway, you can redirect or "force" all Internet-bound traffic back to your on-premises location. "
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor="" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/20/2015"
   ms.author="cherylmc" />

# Configure forced tunneling

Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via a site-to-site VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. Without forced tunneling, Internet-bound traffic from your VMs in Azure will always traverse from Azure network infrastructure directly out to the Internet, without the option to allow you to inspect or audit the traffic. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

The following diagram illustrates how forced tunneling works.

![Forced Tunneling](./media/vpn-gateway-about-forced-tunneling/forced-tunnel.png)

In the example above, the Frontend subnet is not forced tunneled. The workloads in the Frontend subnet can continue to accept and respond to customer requests from the Internet directly. The Mid-tier and Backend subnets are forced tunneled. Any outbound connections from these two subnets to the Internet will be forced or redirected back to an on-premises site via one of the S2S VPN tunnels. This allows you to restrict and inspect Internet access from your Virtual Machines or cloud services in Azure, while continuing to enable your multi-tier service architecture required. You also have the option to apply forced tunneling to the entire virtual networks if there are no Internet-facing workloads in your virtual networks.

## Requirements and considerations

Forced tunneling in Azure is configured via virtual network User-Defined routes. Redirecting traffic to an on-premises site is expressed as a Default Route to the Azure VPN gateway. The following section lists the current limitation of the routing table and routes for an Azure Virtual Network:



-  Each virtual network subnet has a built-in, system routing table. The system routing table has the following 3 groups of routes:

	- **Local VNet routes:** Directly to the destination VMs in the same virtual network
	
	- **On premises routes:** To the Azure VPN gateway
	
	- **Default route:** Directly to the Internet. Note that packets destined to the private IP addresses not covered by the previous two routes will be dropped.



-  With the release of User-Defined Routes, you can create a routing table to add a default route, and then associate the routing table to your VNet subnet(s) to enable forced tunneling on those subnets.

- Forced tunneling must be associated with a VNet that has a dynamic routing VPN gateway (not a static gateway). You need to set a "default site" among the cross-premises local sites connected to the virtual network.

- Note that ExpressRoute forced tunneling is not configured via this mechanism, but instead, is enabled by advertising a default route via the ExpressRoute BGP peering sessions. Please see the [ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute/) for more information.

## Configuration overview

The procedure below will help you specify forced tunneling for a virtual network. The configuration steps correspond to the virtual network netcfg file example below. 

In the example, the virtual network "MultiTier-VNet" has 3 subnets: *Frontend*, *Midtier*, and *Backend* subnets, with 4 cross premises connections: *DefaultSiteHQ*, and 3 *Branches*. The procedure steps will set the *DefaultSiteHQ* as the default site connection for forced tunneling, and configure the *Midtier* and *Backend* subnets to use forced tunneling.

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

### Prerequisites

- Azure Subscription

- A configured virtual network. 

- The latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).

## Configure forced tunneling

Use the following procedure to configure forced tunneling.

1. Create a routing table. Use the following cmdlet to create your route table.

		New-AzureRouteTable –Name "MyRouteTable" –Label "Routing Table for Forced Tunneling" –Location "North Europe"

1. Add a default route to the routing table. 

	The cmdlet example below adds a default route to the routing table created in Step 1. Note that the only route supported is the destination prefix of "0.0.0.0/0" to the "VPNGateway" nexthop.
 
		Set-AzureRoute –RouteTableName "MyRouteTable" –RouteName "DefaultRoute" –AddressPrefix "0.0.0.0/0" –NextHopType VPNGateway

1. Associate the routing table to the subnets. 

	After a routing table is created and a route added, use the cmdlet below to add or associate the route table to a VNet subnet. The samples below add the route table "MyRouteTable" to the Midtier and Backend subnets of VNet MultiTier-VNet.

		Set-AzureSubnetRouteTable -VNetName "MultiTier-VNet" -SubnetName "Midtier" -RouteTableName "MyRouteTable"

		Set-AzureSubnetRouteTable -VNetName "MultiTier-VNet" -SubnetName "Backend" -RouteTableName "MyRouteTable"

1. Assign a default site for forced tunneling. 

	In the preceding step, the sample cmdlet scripts created the routing table and associated the route table to two of the VNet subnets. The remaining step is to select a local site among the multi-site connections of the virtual network as the default site or tunnel.

		$DefaultSite = @("DefaultSiteHQ")
		Set-AzureVNetGatewayDefaultSite –VNetName "MultiTier-VNet" –DefaultSite "DefaultSiteHQ"

## Additional PowerShell cmdlets

Below are some additional PowerShell cmdlets that you may find helpful when working with forced tunneling configurations.

**To delete a route table:**

	Remove-AzureRouteTable -RouteTableName <routeTableName>

**To list a route table:**

	Get-AzureRouteTable [-Name <routeTableName> [-DetailLevel <detailLevel>]]

**To delete a route from a route table:**

	Remove-AzureRouteTable –Name <routeTableName>

**To remove a route from a subnet:**

	Remove-AzureSubnetRouteTable –VNetName <virtualNetworkName> -SubnetName <subnetName>

**To list the route table associated with a subnet:**
	
	Get-AzureSubnetRouteTable -VNetName <virtualNetworkName> -SubnetName <subnetName>

**To remove a default site from a VNet VPN gateway:**

	Remove-AzureVnetGatewayDefaultSites -VNetName <virtualNetworkName>

## Next Steps

For information about securing your network traffic. See [What is a Network Security Group](../virtual-network/virtual-networks-nsg.md).

