---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 06/23/2020
 ms.author: cherylmc
 ms.custom: include file
---
### Does the user need to have hub and spoke with SD-WAN/VPN devices to use Azure Virtual WAN?

Virtual WAN provides many functionalities built into a single pane of glass such as Site/Site-to-site VPN connectivity, User/P2S connectivity, ExpressRoute connectivity, Virtual Network connectivity, VPN ExpressRoute Interconnectivity, VNET to VNET transitive connectivity, Centralized Routing, Azure firewall and firewall manager security, Monitoring, ExpressRoute Encryption and many other capabilities. You do not have to have all of these use cases to start using Virtual WAN. You can simply get started with just one use case. The Virtual WAN architecture is a hub and spoke architecture with scale and performance built-in where branches (VPN/SD-WAN devices), users (Azure VPN Clients, openVPN or IKEv2 Clients), ExpressRoute circuits, Virtual Networks serve as spokes to Virtual Hub(s). All hubs are connected in full mesh in a Standard Virtual WAN making it easy for the user to use the Microsoft backbone for any-to-any (any spoke) connectivity. For hub and spoke with SD-WAN/VPN devices, users can either manually set it up in the Azure Virtual WAN portal or use the Virtual WAN Partner CPE (SD-WAN/VPN) to set up connectivity to Azure. Virtual WAN partners provide automation for connectivity which is the ability to export the device info into Azure, download the Azure configuration and establish connectivity to the Azure Virtual WAN hub. For Point-to-site/User VPN connectivity, we support [Azure VPN client](https://go.microsoft.com/fwlink/?linkid=2117554), OpenVPN or IKEv2 client. 

### What client does the Azure Virtual WAN User VPN (Point-to-site) support?

Virtual WAN supports [Azure VPN client](https://go.microsoft.com/fwlink/?linkid=2117554), OpenVPN Client, or any IKEv2 client. Azure AD authentication is supported with Azure VPN Client.A minimum of Windows 10 client OS version 17763.0 or higher is required.  OpenVPN client(s) can support certificate based authentication. Once cert-based auth is selected on the gateway, you will see the .ovpn file to download to your device. Both certificate and RADIUS auth is supported with IKEv2. 

### For User VPN (Point-to-site)- Why is the P2S client pool split into two routes?

Each gateway has two instances, the split happens so that each gateway instance can independently allocate client IPs for connected clients and traffic from the virtual network is routed back to the correct gateway instance to avoid inter-gateway instance hop.

### How do I add DNS servers for P2S clients?

There are two options to add DNS servers for the P2S clients. The first method is preferred as it adds the custom DNS servers to the gateway instead of the client.

1. Use the following powershell script to add the custom DNS servers. Please replace the values for your environment.
```
// Define variables
$rgName = "testRG1"
$virtualHubName = "virtualHub1"
$P2SvpnGatewayName = "testP2SVpnGateway1"
$vpnClientAddressSpaces = 
$vpnServerConfiguration1Name = "vpnServerConfig1"
$vpnClientAddressSpaces = New-Object string[] 2
$vpnClientAddressSpaces[0] = "192.168.2.0/24"
$vpnClientAddressSpaces[1] = "192.168.3.0/24"
$customDnsServers = New-Object string[] 2
$customDnsServers[0] = "7.7.7.7"
$customDnsServers[1] = "8.8.8.8"
$virtualHub = $virtualHub = Get-AzVirtualHub -ResourceGroupName $rgName -Name $virtualHubName
$vpnServerConfig1 = Get-AzVpnServerConfiguration -ResourceGroupName $rgName -Name $vpnServerConfiguration1Name

// Specify custom dns servers for P2SVpnGateway VirtualHub while creating gateway
createdP2SVpnGateway = New-AzP2sVpnGateway -ResourceGroupName $rgname -Name $P2SvpnGatewayName -VirtualHub $virtualHub -VpnGatewayScaleUnit 1 -VpnClientAddressPool $vpnClientAddressSpaces -VpnServerConfiguration $vpnServerConfig1 -CustomDnsServer $customDnsServers

// Specify custom dns servers for P2SVpnGateway VirtualHub while updating existing gateway
$P2SVpnGateway = Get-AzP2sVpnGateway -ResourceGroupName $rgName -Name $P2SvpnGatewayName
$updatedP2SVpnGateway = Update-AzP2sVpnGateway -ResourceGroupName $rgName -Name $P2SvpnGatewayName  -CustomDnsServer $customDnsServers 

// Re-generate Vpn profile either from PS/Portal for Vpn clients to have the specified dns servers
```
2. Or, if you are using the Azure VPN Client for Windows 10, you can modify the downloaded profile XML file and add the **\<dnsservers>\<dnsserver> \</dnsserver>\</dnsservers>** tags before importing it.

```
<azvpnprofile>
<clientconfig>

	<dnsservers>
		<dnsserver>x.x.x.x</dnsserver>
        <dnsserver>y.y.y.y</dnsserver>
	</dnsservers>
    
</clientconfig>
</azvpnprofile>
```

### For User VPN (Point-to-site)- how many clients are supported?

Each User VPN P2S gateway has two instances and each instance supports upto certain users as the scale unit changes. Scale unit 1-3 supports 500 connections, Scale unit 4-6 supports 1000 connections, Scale unit 7-12 supports 5000 connections and Scale unit 13-20 supports upto 10,000 connections. As an example, lets say the user chooses 1 scale unit. Each scale unit would imply an active-active gateway deployed and each of the instances (in this case 2) would support upto 500 connections. Since you can get 500 connections * 2 per gateway, it does not mean you plan for 1000 instead of  the 500 for this scale unit as instances may need to be serviced during which connectivity for the extra 500 may be interrupted if you surpass the recommended connection count. Also, be sure to plan for downtime in case you decide to scale up or down on the scale unit or change the point-to-site configuration on the VPN gateway.

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN VPN gateway?

Virtual WAN provides large-scale site-to-site connectivity and is built for throughput, scalability, and ease of use. When you connect a site to a Virtual WAN VPN gateway, it is different from a regular virtual network gateway that uses a gateway type 'VPN'. Similarly, when you connect an ExpressRoute circuit to a Virtual WAN hub, it uses a different resource for the ExpressRoute gateway than the regular virtual network gateway that uses gateway type 'ExpressRoute'. Virtual WAN supports up to 20 Gbps aggregate throughput both for VPN and ExpressRoute. Virtual WAN also has automation for connectivity with an ecosystem of CPE branch device partners. CPE branch devices have built-in automation that auto-provisions and connects into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners. See the [Preferred Partner List](../articles/virtual-wan/virtual-wan-locations-partners.md).

### How is Virtual WAN different from an Azure virtual network gateway?

A virtual network gateway VPN is limited to 30 tunnels. For connections, you should use Virtual WAN for large-scale VPN. You can connect up to 1,000 branch connections per region (virtual hub) with aggregate of 20 Gbps per hub. A connection is an active-active tunnel from the on-premises VPN device to the virtual hub. You can have one hub per region, which means you can connect more than 1,000 branches across hubs.

### What is a Virtual WAN Gateway Scale Unit
A scale unit is an unit defined to pick an aggregate throughput of a gateway in Virtual hub. 1 scale unit of VPN = 500 Mbps . 1 scale unit of ExpressRoute = 2 Gbps. Example : 10 scale unit of VPN would imply 500 Mbps * 10 = 5 Gbps

### Which device providers (Virtual WAN partners) are supported?

At this time, many partners support the fully automated Virtual WAN experience. For more information, see [Virtual WAN partners](../articles/virtual-wan/virtual-wan-locations-partners.md). 

### What are the Virtual WAN partner automation steps?

For partner automation steps, see [Virtual WAN partner automation](../articles/virtual-wan/virtual-wan-configure-automation-providers.md).

### Am I required to use a preferred partner device?

No. You can use any VPN-capable device that adheres to the Azure requirements for IKEv2/IKEv1 IPsec support. Virtual WAN also has CPE partner solutions that automate connectivity to Azure Virtual WAN making it easier to set up IPsec VPN connections at scale.

### How do Virtual WAN partners automate connectivity with Azure Virtual WAN?

Software-defined connectivity solutions typically manage their branch devices using a controller, or a device provisioning center. The controller can use Azure APIs to automate connectivity to the Azure Virtual WAN. The automation includes uploading branch information, downloading the Azure configuration, setting up IPSec tunnels into Azure Virtual hubs, and automatically setting up connectivity form the branch device to Azure Virtual WAN. When you have hundreds of branches, connecting using Virtual WAN CPE Partners is easy because the onboarding experience takes away the need to set up, configure, and manage large-scale IPsec connectivity. For more information, see [Virtual WAN partner automation](../articles/virtual-wan/virtual-wan-configure-automation-providers.md).

### What if a device I am using is not in the Virtual WAN partner list? Can I still use it to connect to Azure Virtual WAN VPN?

Yes as long as the device supports IPsec IKEv1 or IKEv2. Virtual WAN partners automate connectivity from the device to Azure VPN end points. This implies automating steps such as 'branch information upload', 'IPsec and configuration' and 'connectivity'.Since your device is not from a Virtual WAN partner ecosystem, you will need to do the heavy lifting of manually taking the Azure configuration and updating your device to set up IPsec connectivity.

### How do new partners that are not listed in your launch partner list get onboarded?

All virtual WAN APIs are open API. You can go over the documentation [Virtual WAN partner automation](../articles/virtual-wan/virtual-wan-configure-automation-providers.md) to assess technical feasibility. An ideal partner is one that has a device that can be provisioned for IKEv1 or IKEv2 IPsec connectivity. Once the company has completed the automation work for their CPE device based on the automation guidelines provides above, you can reach out to azurevirtualwan@microsoft.com to be listed here [Connectivity through partners]( ../articles/virtual-wan/virtual-wan-locations-partners.md#partners). If you are a customer that would like a certain company solution to be listed as a Virtual WAN partner, please have the company contact the Virtual WAN by sending an email to azurevirtualwan@microsoft.com.

### How is Virtual WAN supporting SD-WAN devices?

Virtual WAN partners automate IPsec connectivity to Azure VPN end points. If the Virtual WAN partner is an SD-WAN provider, then it is implied that the SD-WAN controller manages automation and IPsec connectivity to Azure VPN end points. If the SD-WAN device requires its own end point instead of Azure VPN for any proprietary SD-WAN functionality, you can deploy the SD-WAN end point in an Azure VNet and coexist with Azure Virtual WAN.

### Does Virtual WAN change any existing connectivity features?

There are no changes to existing Azure connectivity features.

### Are there new Resource Manager resources available for Virtual WAN?
  
Yes, Virtual WAN introduces new Resource Manager resources. For more information, please see the [Overview](../articles/virtual-wan/virtual-wan-about.md).

### How many VPN devices can connect to a single hub?

Up to 1,000 connections are supported per virtual hub. Each connection consists of four links and each link connection supports two tunnels that are in an active-active configuration. The tunnels terminate in an Azure virtual hub vpngateway.

### Can the on-premises VPN device connect to multiple Hubs?

Yes. Traffic flow, when commencing, is from the on-premises device to the closest Microsoft network edge, and then to the virtual hub.

### Can I deploy and use my favorite network virtual appliance (in an NVA VNet) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance (NVA) VNet to the Azure Virtual WAN. First, connect the network virtual appliance VNet to the hub with a Hub Virtual Network connection. Then, create a virtual hub route with a next hop pointing to the Virtual Appliance. You can apply multiple routes to the virtual hub Route Table. Any spokes connected to the NVA VNet must additionally be connected to the virtual hub to ensure that the spoke VNet routes are propagated to on-premises systems.

### Can I create a Network Virtual Appliance inside the virtual hub?

A Network Virtual Appliance (NVA) cannot be deployed inside a virtual hub. However, you can create it in a spoke VNet that is connected to the virtual hub and enable a route in the hub to direct traffic for destination VNet via the NVA IP address (of the NIC).

### Can a spoke VNet have a virtual network gateway?

No. The spoke VNet cannot have a virtual network gateway if it is connected to the virtual hub.

### Is there support for BGP?

Yes, BGP is supported. When you create a VPN site, you can provide the BGP parameters in it. This will imply that any connections created in Azure for that site will be enabled for BGP. Additionally, if you had a VNet with an NVA, and if this NVA VNet was attached to a Virtual WAN hub, in order to ensure that routes from an NVA VNet are advertised appropriately, spokes that are attached to NVA VNet must disable BGP. Additionally, connect these spoke VNets to the virtual hub VNet to ensure spoke VNet routes are propagated to on-premises systems.

### Can I direct traffic using UDR in the virtual hub?

Yes, you can direct traffic to a VNet using a virtual hub route table. This allows you to set routes for destination VNets in Azure via a specific IP address (typically of the NVA NIC).

### Is there any licensing or pricing information for Virtual WAN?

Yes. See the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### How do I calculate price of a hub?

* You would pay for the services in the hub. For example, lets say you have 10 branches or on-premises devices requiring to connect to Azure Virtual WAN would imply connecting to VPN end points in the hub. Lets say this is VPN of 1 scale unit = 500 Mbps, this is charged at $0.361/hr. Each connection is charged at $0.05/hr. For 10 connections, the total charge of service/hr would be $0.361 + $.5/hr. Data charges for traffic leaving Azure apply.

* There is additional hub charge. See the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

* If you had ExpressRoute gateway due to ExpressRoute circuits connecting to a virtual hub, then you would pay for the scale unit price. Each scale unit in ER is 2 Gbps and each connection unit is charged at the same rate as the VPN Connection unit.

* If you had Spoke VNETs connected to the hub, peering charges at the Spoke VNETs still apply. 

### Is it possible to construct Azure Virtual WAN with a Resource Manager template?

A simple configuration of one Virtual WAN with one hub and one vpnsite can be created using an [quickstart template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network). Virtual WAN is primarily a REST or portal driven service.

### Is Global VNet peering supported with Azure Virtual WAN? 

You can connect a VNet in a different region than your virtual WAN.

### Can spoke VNets connected to a virtual hub communicate with each other (V2V Transit)?

Yes. Standard Virtual WAN supports Vnet to Vnet transitive connectivity via the Virtual WAN hub that the Vnets are connected to. In Virtual WAN terminology, we refer to these paths as “local Virtual WAN VNet transit” for VNets connected to a Virtual Wan Hub within a single region, and “global Virtual WAN VNet transit” for VNets connected through multiple Virtual WAN Hubs across two or more regions. VNet transit supports up to 3 Gbps of throughput during public preview. Throughput will expanded when global transit goes GA.

NOTE:
Currently V2V transit preview requires a VPN GW to be deployed in a Virtual Hub to trigger the routing elements to be launched. This VPN GW is not used for the V2V transit path. This is a known limitation and will be removed at the time of V2V GA. 
You can delete the VPN Gateway in the hub(s) after it is fully launched as it is not needed for V2V transit functionality. 

For some scenarios, spoke Vnets can also be directly peered with each other using [Virtual Network Peering](../articles/virtual-network/virtual-network-peering-overview.md) in addition to local or global Virtual WAN VNet transit. In this case, Vnet Peering takes precedence over the transitive connection via the Virtual WAN hub. 

### What is a branch connection to Azure Virtual WAN?

A connection from a branch device into Azure Virtual WAN supports up to four links. A link is the physical connectivity link at the branch location (for example: ATT, Verizon etc.). Each link connection is composed of two active/active IPsec tunnels.

### Is branch-to-branch connectivity allowed in Virtual WAN?

Yes, branch-to-branch connectivity is available in Virtual WAN for VPN and VPN to ExpressRoute.

### Does branch-to-branch traffic traverse through the Azure Virtual WAN?

Yes.

### Does Virtual WAN require ExpressRoute from each site?

No, the Virtual WAN does not require ExpressRoute from each site. It uses standard IPsec site-to-site connectivity via internet links from the device to an Azure Virtual WAN hub. Your sites may be connected to a provider network using an ExpressRoute circuit. For Sites that are connected using ExpressRoute in a virtual hub, sites can have branch to branch traffic flow between VPN and ExpressRoute.

### Is there a network throughput limit when using Azure Virtual WAN?

Number of branches is limited to 1000 connections per hub/region and a total of 20 Gbps in the hub. You can have 1 hub per region.

### How many VPN connections does a Virtual WAN hub support?

An Azure Virtual WAN hub can support up to 1,000 S2S connections, 10,000 P2S connections, and 4 ExpressRoute connections simultaneously.

### What is the total VPN throughput of a VPN tunnel and a connection?

The total VPN throughput of a hub is up to 20 Gbps based on the chosen scale unit. Throughput is shared by all existing connections. Each tunnel in a connection can support up to 1 Gbps.

### I don't see the 20 Gbps setting for the virtual hub in the portal. How do I configure that?

Navigate to the VPN gateway inside a hub on the portal and click on the scale unit to change it to the appropriate setting.

### Does Virtual WAN allow the on-premises device to utilize multiple ISPs in parallel, or is it always a single VPN tunnel?
On-premises device solutions can apply traffic policies to steer traffic across multiple tunnels into Azure.


### What is global transit architecture?

For information about global transit architecture, see [Global transit network architecture and Virtual WAN](../articles/virtual-wan/virtual-wan-global-transit-network-architecture.md).

### How is traffic routed on the Azure backbone?

The traffic follows the pattern: branch device ->ISP->Microsoft network edge->Microsoft DC (hub VNet)->Microsoft network edge->ISP->branch device

### In this model, what do you need at each site? Just an internet connection?

Yes. An internet connection and physical device that supports IPsec, preferably from our integrated [Virtual WAN partners](../articles/virtual-wan/virtual-wan-locations-partners.md). Optionally, you can manually manage the configuration and connectivity to Azure from your preferred device.

### How do I enable default route (0.0.0.0/0) in a connection (VPN, ExpressRoute, or Virtual Network):

A virtual hub can propagate a learned default route to a virtual network/site-to-site VPN/ExpressRoute connection if the flag is 'Enabled' on the connection. This flag is visible when the user edits a virtual network connection, a VPN connection, or an ExpressRoute connection. By default, this flag is disabled when a site or an ExpressRoute circuit is connected to a hub. It is enabled by default when a virtual network connection is added to connect a VNet to a virtual hub. The default route does not originate in the Virtual WAN hub; the default route is propagated if it is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced-tunneling enabled.

### How does the virtual hub in a Virtual WAN select the best path for a route from multiple hubs

If a Virtual Hub learns the same route from multiple remote hubs,  the order in which it decides is as follows
1. Longest prefix match
2. Local routes over interhub
3. Static routes over BGP
4. ExpressRoute (ER) over VPN
5. AS path length

Transit between ER to ER is always via Global reach due to which if the request comes in via ER in one hub and there is a VPN and ER in a remote hub, VPN will be preferred over ER from a remote hub to reach an end point connected via VPN or ER in the remote hub


### Is there support for IPv6 in Virtual WAN?

IPv6 is not supported in Virtual WAN hub and its gateways.If you have a VNET that has IPv6 support and you would like to connect the VNET to Virtual WAN, this scenario is also not supported. 

### What are the differences between the Virtual WAN types (Basic and Standard)?

The 'Basic' WAN type lets you create a basic hub (SKU = Basic). A 'Standard' WAN type lets you create standard hub (SKU = Standard). Basic hubs are limited to site-to-site VPN functionality. Standard hubs let you have ExpressRoute, User VPN (P2S), full mesh hub, and VNet-to-VNet transit through the hubs. You pay a base charge of $0.25/hr for standard hubs and a data processing fee for transiting through the hubs during VNet-to-VNet connectivity, as well as data processing for hub to hub traffic. For more information, see [Basic and Standard virtual WANs](../articles/virtual-wan/virtual-wan-about.md#basicstandard). For pricing, see the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.
