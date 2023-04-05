---
title: 'Azure Virtual WAN FAQ | Microsoft Docs'
description: See answers to frequently asked questions about Azure Virtual WAN networks, clients, gateways, devices, partners, and connections.
author: cherylmc
ms.service: virtual-wan
ms.topic: faq
ms.date: 10/13/2022
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to read more details about Virtual WAN in a FAQ format.
---

# Virtual WAN FAQ

### Is Azure Virtual WAN in GA?

Yes, Azure Virtual WAN is Generally Available (GA). However, Virtual WAN consists of several features and scenarios. There are feature or scenarios within Virtual WAN where Microsoft applies the Preview tag. In those cases, the specific feature, or the scenario itself, is in Preview. If you don't use a specific preview feature, regular GA support applies. For more information about Preview support, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Which locations and regions are available?

For information, see [Available locations and regions](virtual-wan-locations-partners.md#locations).

### Does the user need to have hub and spoke with SD-WAN/VPN devices to use Azure Virtual WAN?

Virtual WAN provides many functionalities built into a single pane of glass such as site/site-to-site VPN connectivity, User/P2S connectivity, ExpressRoute connectivity, virtual network connectivity, VPN ExpressRoute Interconnectivity, VNet-to-VNet transitive connectivity, Centralized Routing, Azure Firewall and Firewall Manager security, Monitoring, ExpressRoute Encryption, and many other capabilities. You don't have to have all of these use-cases to start using Virtual WAN. You can get started with just one use case.

The Virtual WAN architecture is a hub and spoke architecture with scale and performance built in where branches (VPN/SD-WAN devices), users (Azure VPN Clients, openVPN, or IKEv2 Clients), ExpressRoute circuits, virtual networks serve as spokes to virtual hub(s). All hubs are connected in full mesh in a Standard Virtual WAN making it easy for the user to use the Microsoft backbone for any-to-any (any spoke) connectivity. For hub and spoke with SD-WAN/VPN devices, users can either manually set it up in the Azure Virtual WAN portal or use the Virtual WAN Partner CPE (SD-WAN/VPN) to set up connectivity to Azure.

Virtual WAN partners provide automation for connectivity, which is the ability to export the device info into Azure, download the Azure configuration and establish connectivity to the Azure Virtual WAN hub. For point-to-site/User VPN connectivity, we support [Azure VPN client](https://go.microsoft.com/fwlink/?linkid=2117554), OpenVPN, or IKEv2 client.

### Can you disable fully meshed hubs in a Virtual WAN?

Virtual WAN comes in two flavors: Basic and Standard. In Basic Virtual WAN, hubs aren't meshed. In a Standard Virtual WAN, hubs are meshed and automatically connected when the virtual WAN is first set up. The user doesn't need to do anything specific. The user also doesn't have to disable or enable the functionality to obtain meshed hubs. Virtual WAN provides you many routing options to steer traffic between any spoke (VNet, VPN, or ExpressRoute). It provides the ease of fully meshed hubs, and also the flexibility of routing traffic per your needs.

### How are Availability Zones and resiliency handled in Virtual WAN?

Virtual WAN is a collection of hubs and services made available inside the hub. The user can have as many Virtual WAN per their need. In a Virtual WAN hub, there are multiple services like VPN, ExpressRoute etc. Each of these services is automatically deployed across Availability Zones (except Azure Firewall), if the region supports Availability Zones. If a region becomes an Availability Zone after the initial deployment in the hub, the user can recreate the gateways, which will trigger an Availability Zone deployment. All gateways are provisioned in a hub as active-active, implying there is resiliency built in within a hub. Users can connect to multiple hubs if they want resiliency across regions.

Currently, Azure Firewall can be deployed to support Availability Zones using Azure Firewall Manager Portal, [PowerShell](/powershell/module/az.network/new-azfirewall#example-6--create-a-firewall-with-no-rules-and-with-availability-zones) or CLI. There is currently no way to configure an existing Firewall to be deployed across availability zones. You'll need to delete and redeploy your Azure Firewall.

While the concept of Virtual WAN is global, the actual Virtual WAN resource is Resource Manager-based and deployed regionally. If the virtual WAN region itself were to have an issue, all hubs in that virtual WAN will continue to function as is, but the user won't be able to create new hubs until the virtual WAN region is available.

### What client does the Azure Virtual WAN User VPN (point-to-site) support?

Virtual WAN supports [Azure VPN client](https://go.microsoft.com/fwlink/?linkid=2117554), OpenVPN Client, or any IKEv2 client. Azure AD authentication is supported with Azure VPN Client.A minimum of Windows 10 client OS version 17763.0 or higher is required. OpenVPN client(s) can support certificate-based authentication. Once cert-based auth is selected on the gateway, you'll see the.ovpn* file to download to your device. IKEv2 supports both certificate and RADIUS authentication.

### For User VPN (point-to-site)- why is the P2S client pool split into two routes?

Each gateway has two instances, the split happens so that each gateway instance can independently allocate client IPs for connected clients and traffic from the virtual network is routed back to the correct gateway instance to avoid inter-gateway instance hop.

### How do I add DNS servers for P2S clients?

There are two options to add DNS servers for the P2S clients. The first method is preferred as it adds the custom DNS servers to the gateway instead of the client.

1. Use the following PowerShell script to add the custom DNS servers. Replace the values for your environment.

   ```powershell
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
   $updatedP2SVpnGateway = Update-AzP2sVpnGateway -ResourceGroupName $rgName -Name $P2SvpnGatewayName -CustomDnsServer $customDnsServers 

   // Re-generate Vpn profile either from PS/Portal for Vpn clients to have the specified dns servers
   ```

2. Or, if you're using the Azure VPN Client for Windows 10, you can modify the downloaded profile XML file and add the **\<dnsservers>\<dnsserver> \</dnsserver>\</dnsservers>** tags before importing it.

   ```powershell
      <azvpnprofile>
      <clientconfig>

          <dnsservers>
              <dnsserver>x.x.x.x</dnsserver>
              <dnsserver>y.y.y.y</dnsserver>
          </dnsservers>
    
      </clientconfig>
      </azvpnprofile>
   ```

### For User VPN (point-to-site)- how many clients are supported?

The table below describes the number of concurrent connections and aggregate throughput of the Point-to-site VPN gateway supported at different scale units.

Scale Unit | Gateway Instances | Supported Concurrent Connections | Aggregate Throughput|
| ---- | ---| ---| ---|
|1|2|500| 0.5 Gbps|
|2|2|500| 1 Gbps|
|3|2|500| 1.5 Gbps |
|4|2|1000| 2 Gbps|
|5|2|1000| 2.5 Gbps|
|6|2|1000| 3 Gbps|
|7|2|5000| 3.5 Gbps|
|8|2|5000| 4 Gbps|
|9|2|5000| 4.5 Gbps|
|10|2|5000| 5 Gbps|
|11|2|10000| 5.5 Gbps|
|12|2|10000| 6 Gbps|
|13|2|10000| 6.5 Gbps|
|14|2|10000| 7 Gbps|
|15|2|10000| 7.5 Gbps|
|16|2|10000| 8 Gbps|
|17|2|10000| 8.5 Gbps|
|18|2|10000| 9 Gbps|
|19|2|10000| 9.5 Gbps|
|20|2|10000| 10 Gbps|
|40|4|20000| 20 Gbps|
|60|6|30000| 30 Gbps|
|80|8|40000| 40 Gbps|
|100|10|50000| 50 Gbps|
|120|12|60000| 60 Gbps|
|140|14|70000| 70 Gbps|
|160|16|80000| 80 Gbps|
|180|18|90000| 90 Gbps|
|200|20|100000| 100 Gbps|

For example, let's say the user chooses 1 scale unit. Each scale unit would imply an active-active gateway deployed and each of the instances (in this case 2) would support up to 500 connections. Since you can get 500 connections * 2 per gateway, it doesn't mean that you plan for 1000 instead of the 500 for this scale unit. Instances may need to be serviced during which connectivity for the extra 500 may be interrupted if you surpass the recommended connection count.

For gateways with scale units greater than 20, additional highly-available pairs of gateway instances are deployed to provide additional capacity for connecting users. Each pair of instances supports up to 10,000 additional users. For example, if you deploy a Gateway with 100 scale units, 5 gateway pairs (10 total instances) are deployed, and up to 50,000 (10,000 users x 5 gateway pairs) concurrent users can connect.

Also, be sure to plan for downtime in case you decide to scale up or down on the scale unit, or change the point-to-site configuration on the VPN gateway.

### What are Virtual WAN gateway scale units?

A scale unit is a unit defined to pick an aggregate throughput of a gateway in Virtual hub. 1 scale unit of VPN = 500 Mbps. 1 scale unit of ExpressRoute = 2 Gbps. Example: 10 scale unit of VPN would imply 500 Mbps * 10 = 5 Gbps.

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN VPN gateway?

Virtual WAN provides large-scale site-to-site connectivity and is built for throughput, scalability, and ease of use. When you connect a site to a Virtual WAN VPN gateway, it's different from a regular virtual network gateway that uses a gateway type 'site-to-site VPN'. When you want to connect remote users to Virtual WAN, you use a gateway type 'point-to-site VPN'. The point-to-site and site-to-site VPN gateways are separate entities in the Virtual WAN hub and must be individually deployed. Similarly, when you connect an ExpressRoute circuit to a Virtual WAN hub, it uses a different resource for the ExpressRoute gateway than the regular virtual network gateway that uses gateway type 'ExpressRoute'.

Virtual WAN supports up to 20-Gbps aggregate throughput both for VPN and ExpressRoute. Virtual WAN also has automation for connectivity with an ecosystem of CPE branch device partners. CPE branch devices have built-in automation that autoprovisions and connects into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners. See the [Preferred partner list](virtual-wan-locations-partners.md).

### How is Virtual WAN different from an Azure virtual network gateway?

A virtual network gateway VPN is limited to 30 tunnels. For connections, you should use Virtual WAN for large-scale VPN. You can connect up to 1,000 branch connections per virtual hub with aggregate of 20 Gbps per hub. A connection is an active-active tunnel from the on-premises VPN device to the virtual hub. You can also have multiple virtual hubs per region, which means you can connect more than 1,000 branches to a single Azure Region by deploying multiple Virtual WAN hubs in that Azure Region, each with its own site-to-site VPN gateway.

### What is the recommended algorithm and Packets per second per site-to-site instance in Virtual WAN hub? How many tunnels is support per instance? What is the max throughput supported in a single tunnel?

Virtual WAN supports 2 active site-to-site VPN gateway instances in a virtual hub. This means there are 2 active-active set of VPN gateway instances in a virtual hub. During maintenance operations, each instance is upgraded one by one due to which a user may experience brief decrease in aggregate throughput of a VPN gateway.

While Virtual WAN VPN supports many algorithms, our recommendation is GCMAES256 for both IPSEC Encryption and Integrity for optimal performance. AES256 and SHA256 are considered less performant and therefore performance degradation such as latency and packet drops can be expected for similar algorithm types.

Packets per second or PPS is a factor of the total # of packets and the throughput supported per instance. This is best understood with an example. Lets say a 1 scale unit 500-Mbps site-to-site VPN gateway instance is deployed in a virtual WAN hub. Assuming a packet size of 1400, expected PPS for that vpn gateway instance *at a maximum* = [(500 Mbps * 1024 * 1024) /8/1400] ~ 47000.

Virtual WAN has concepts of VPN connection, link connection and tunnels. A single VPN connection consists of link connections. Virtual WAN supports up to 4 link connections in a VPN connection. Each link connection consists of two IPsec tunnels that terminate in two instances of an active-active VPN gateway deployed in a virtual hub. The total number of tunnels that can terminate in a single active instance is 1000, which also implies that throughput for 1 instance will be available aggregated across all the tunnels connecting to that instance. Each tunnel also has certain throughput values. In cases of multiple tunnels connected to a lower value scale unit gateway, it's best to evaluate the need per tunnel and plan for a VPN gateway that is an aggregate value for throughput across all tunnels terminating in the VPN instance.

**Values for various scale units supported in Virtual WAN**

[!INCLUDE [values for scale units](../../includes/virtual-wan-tunnels-throuput-instance-include.md)]

### Which device providers (Virtual WAN partners) are supported?

At this time, many partners support the fully automated Virtual WAN experience. For more information, see [Virtual WAN partners](virtual-wan-locations-partners.md).

### What are the Virtual WAN partner automation steps?

For partner automation steps, see [Virtual WAN partner automation](virtual-wan-configure-automation-providers.md).

### Am I required to use a preferred partner device?

No. You can use any VPN-capable device that adheres to the Azure requirements for IKEv2/IKEv1 IPsec support. Virtual WAN also has CPE partner solutions that automate connectivity to Azure Virtual WAN making it easier to set up IPsec VPN connections at scale.

### How do Virtual WAN partners automate connectivity with Azure Virtual WAN?

Software-defined connectivity solutions typically manage their branch devices using a controller, or a device provisioning center. The controller can use Azure APIs to automate connectivity to the Azure Virtual WAN. The automation includes uploading branch information, downloading the Azure configuration, setting up IPsec tunnels into Azure Virtual hubs, and automatically setting up connectivity from the branch device to Azure Virtual WAN. When you have hundreds of branches, connecting using Virtual WAN CPE Partners is easy because the onboarding experience takes away the need to set up, configure, and manage large-scale IPsec connectivity. For more information, see [Virtual WAN partner automation](virtual-wan-configure-automation-providers.md).

### What if a device I'm using isn't in the Virtual WAN partner list? Can I still use it to connect to Azure Virtual WAN VPN?

Yes as long as the device supports IPsec IKEv1 or IKEv2. Virtual WAN partners automate connectivity from the device to Azure VPN end points. This implies automating steps such as 'branch information upload', 'IPsec and configuration' and 'connectivity'. Because your device isn't from a Virtual WAN partner ecosystem, you'll need to do the heavy lifting of manually taking the Azure configuration and updating your device to set up IPsec connectivity.

### How do new partners that aren't listed in your launch partner list get onboarded?

All virtual WAN APIs are OpenAPI. You can go over the documentation [Virtual WAN partner automation](virtual-wan-configure-automation-providers.md) to assess technical feasibility. An ideal partner is one that has a device that can be provisioned for IKEv1 or IKEv2 IPsec connectivity. Once the company has completed the automation work for their CPE device based on the automation guidelines provided above, you can reach out to azurevirtualwan@microsoft.com to be listed here [Connectivity through partners](virtual-wan-locations-partners.md#partners). If you're a customer that would like a certain company solution to be listed as a Virtual WAN partner, have the company contact the Virtual WAN by sending an email to azurevirtualwan@microsoft.com.

### How is Virtual WAN supporting SD-WAN devices?

Virtual WAN partners automate IPsec connectivity to Azure VPN end points. If the Virtual WAN partner is an SD-WAN provider, then it's implied that the SD-WAN controller manages automation and IPsec connectivity to Azure VPN end points. If the SD-WAN device requires its own end point instead of Azure VPN for any proprietary SD-WAN functionality, you can deploy the SD-WAN end point in an Azure VNet and coexist with Azure Virtual WAN.

Virtual WAN supports [BGP Peering](create-bgp-peering-hub-portal.md) and also has the ability to [deploy NVA's into a virtual WAN hub](how-to-nva-hub.md).

### How many VPN devices can connect to a single hub?

Up to 1,000 connections are supported per virtual hub. Each connection consists of four links and each link connection supports two tunnels that are in an active-active configuration. The tunnels terminate in an Azure virtual hub VPN gateway. Links represent the physical ISP link at the branch/VPN device.

### What is a branch connection to Azure Virtual WAN?

A connection from a branch or VPN device into Azure Virtual WAN is a VPN connection that connects virtually the VPN site and the Azure VPN gateway in a virtual hub.

### What happens if the on-premises VPN device only has 1 tunnel to an Azure Virtual WAN VPN gateway?

An Azure Virtual WAN connection is composed of 2 tunnels. A Virtual WAN VPN gateway is deployed in a virtual hub in active-active mode, which implies that there are separate tunnels from on-premises devices terminating on separate instances. This is the recommendation for all users. However, if the user chooses to only have 1 tunnel to one of the Virtual WAN VPN gateway instances, if for any reason (maintenance, patches etc.) the gateway instance is taken offline, the tunnel will be moved to the secondary active instance and the user may experience a reconnect. BGP sessions won't move across instances.

### What happens during a Gateway Reset in a Virtual WAN VPN gateway?

The Gateway Reset button should be used if your on-premises devices are all working as expected, but the site-to-site VPN connection in Azure is in a Disconnected state. Virtual WAN VPN gateways are always deployed in an Active-Active state for high availability. This means there's always more than one instance deployed in a VPN gateway at any point of time. When the Gateway Reset button is used, it reboots the instances in the VPN gateway in a sequential manner so your connections aren't disrupted. There will be a brief gap as connections move from one instance to the other, but this gap should be less than a minute. Additionally, note that resetting the gateways won't change your Public IPs.

This scenario only applies to the S2S connections.

### Can the on-premises VPN device connect to multiple hubs?

Yes. Traffic flow, when commencing, is from the on-premises device to the closest Microsoft network edge, and then to the virtual hub.

### Are there new Resource Manager resources available for Virtual WAN?

Yes, Virtual WAN has new Resource Manager resources. For more information, see the [Overview](virtual-wan-about.md).

### Can I deploy and use my favorite network virtual appliance (in an NVA VNet) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance (NVA) VNet to the Azure Virtual WAN.

### Can I create a Network Virtual Appliance inside the virtual hub?

A Network Virtual Appliance (NVA) can be deployed inside a virtual hub. For steps, see [About NVA's in a Virtual WAN hub](about-nva-hub.md).

### Can a spoke VNet have a virtual network gateway?

No. The spoke VNet can't have a virtual network gateway if it's connected to the virtual hub.

### Is there support for BGP in VPN connectivity?

Yes, BGP is supported. When you create a VPN site, you can provide the BGP parameters in it. This will imply that any connections created in Azure for that site will be enabled for BGP.

### Is there any licensing or pricing information for Virtual WAN?

Yes. See the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### Is it possible to construct Azure Virtual WAN with a Resource Manager template?

A simple configuration of one Virtual WAN with one hub and one vpnsite can be created using an [quickstart template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network). Virtual WAN is primarily a REST or portal driven service.

### Can spoke VNets connected to a virtual hub communicate with each other (V2V Transit)?

Yes. Standard Virtual WAN supports VNet-to-VNet transitive connectivity via the Virtual WAN hub that the VNets are connected to. In Virtual WAN terminology, we refer to these paths as "local Virtual WAN VNet transit" for VNets connected to a Virtual Wan hub within a single region, and "global Virtual WAN VNet transit" for VNets connected through multiple Virtual WAN hubs across two or more regions.

In some scenarios, spoke VNets can also be directly peered with each other using [virtual network peering](../virtual-network/virtual-network-peering-overview.md) in addition to local or global Virtual WAN VNet transit. In this case, VNet Peering takes precedence over the transitive connection via the Virtual WAN hub.

### Is branch-to-branch connectivity allowed in Virtual WAN?

Yes, branch-to-branch connectivity is available in Virtual WAN. Branch is conceptually applicable to VPN site, ExpressRoute circuits, or point-to-site/User VPN users. Enabling branch-to-branch is enabled by default and can be located in WAN **Configuration** settings. This lets VPN branches/users connect to other VPN branches and transit connectivity is also enabled between VPN and ExpressRoute users.

### Does branch-to-branch traffic traverse through the Azure Virtual WAN?

Yes. Branch-to-branch traffic traverses through Azure Virtual WAN.

### Does Virtual WAN require ExpressRoute from each site?

No. Virtual WAN doesn't require ExpressRoute from each site. Your sites may be connected to a provider network using an ExpressRoute circuit. For sites that are connected using ExpressRoute to a virtual hub and IPsec VPN into the same hub, virtual hub provides transit connectivity between the VPN and ExpressRoute user.

### Is there a network throughput or connection limit when using Azure Virtual WAN?

Network throughput is per service in a virtual WAN hub. In each hub, the VPN aggregate throughput is up to 20 Gbps, the ExpressRoute aggregate throughput is up to 20 Gbps, and the User VPN/point-to-site VPN aggregate throughput is up to 200 Gbps. The router in virtual hub supports up to 50 Gbps for VNet-to-VNet traffic flows and assumes a total of 2000 VM workload across all VNets connected to a single virtual hub.

To secure upfront capacity without having to wait for the virtual hub to scale out when more throughput is needed, you can set the minimum capacity or modify as needed. See [About virtual hub settings - hub capacity](hub-settings.md#capacity). For cost implications, see *Routing Infrastructure Unit* cost in the [Azure Virtual WAN Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

When VPN sites connect into a hub, they do so with connections. Virtual WAN supports up to 1000 connections or 2000 IPsec tunnels per virtual hub. When remote users connect into virtual hub, they connect to the P2S VPN gateway, which supports up to 100,000 users depending on the scale unit(bandwidth) chosen for the P2S VPN gateway in the virtual hub.

### Can I use NAT-T on my VPN connections?

Yes, NAT traversal (NAT-T) is supported. The Virtual WAN VPN gateway will NOT perform any NAT-like functionality on the inner packets to/from the IPsec tunnels. In this configuration, ensure the on-premises device initiates the IPsec tunnel.

### How can I configure a scale unit to a specific setting like 20-Gbps?

Go to the VPN gateway inside a hub on the portal, then click on the scale unit to change it to the appropriate setting.

### Does Virtual WAN allow the on-premises device to utilize multiple ISPs in parallel, or is it always a single VPN tunnel?

On-premises device solutions can apply traffic policies to steer traffic across multiple tunnels into the Azure Virtual WAN hub (VPN gateway in the virtual hub).

### What is global transit architecture?

For information, see [Global transit network architecture and Virtual WAN](virtual-wan-global-transit-network-architecture.md).

### How is traffic routed on the Azure backbone?

The traffic follows the pattern: branch device ->ISP->Microsoft network edge->Microsoft DC (hub VNet)->Microsoft network edge->ISP->branch device

### In this model, what do you need at each site? Just an internet connection?

Yes. An internet connection and physical device that supports IPsec, preferably from our integrated [Virtual WAN partners](virtual-wan-locations-partners.md). Optionally, you can manually manage the configuration and connectivity to Azure from your preferred device.

### How do I enable default route (0.0.0.0/0) for a connection (VPN, ExpressRoute, or virtual network)?

A virtual hub can propagate a learned default route to a virtual network/site-to-site VPN/ExpressRoute connection if the flag is 'Enabled' on the connection. This flag is visible when the user edits a virtual network connection, a VPN connection, or an ExpressRoute connection. By default, this flag is disabled when a site or an ExpressRoute circuit is connected to a hub. It's enabled by default when a virtual network connection is added to connect a VNet to a virtual hub.

The default route doesn't originate in the Virtual WAN hub; the default route is propagated if it's already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced-tunneling enabled. A default route doesn't propagate between hubs (inter-hub).

### Is it possible to create multiple virtual WAN hubs in the same region?

Yes. Customers can now create more than one hub in the same region for the same Azure Virtual WAN.

### How does the virtual hub in a virtual WAN select the best path for a route from multiple hubs?

If a virtual hub learns the same route from multiple remote hubs, the order in which it decides is as follows:
1.	Select routes with Longest Prefix Match (LPM).
2.	Prefer static routes learned from the virtual hub route table over BGP routes.
3.	Select best path based on the [Virtual hub routing preference](about-virtual-hub-routing-preference.md) configuration. There are three possible configurations for Virtual hub routing preference and the route preference changes accordingly.

    * **ExpressRoute** (This is the default setting)
        1.	Prefer routes from local virtual hub connections over routes learned from remote virtual hub.
        2. If there are Routes from both ExpressRoute and Site-to-site VPN connections:
              * If all the routes are local to the virtual hub, the routes learned from ExpressRoute connections will be chosen because Virtual hub routing preference is set to ExpressRoute.
              * If all the routes are through remote hubs, Site-to-site VPN will be preferred over ExpressRoute. 
        3.	Prefer routes with the shortest BGP AS-Path length.

    * **VPN**
        1.	Prefer routes from local virtual hub connections over routes learned from remote virtual hub.
        2.	If there are routes from both ExpressRoute and Site-to-site VPN connections, the Site-to-site VPN routes will be chosen.
        3.	Prefer routes with the shortest BGP AS-Path length.

    * **AS Path**
        1.	Prefer routes with the shortest BGP AS-Path length irrespective of the source of the route advertisements. 
         Note: In vWANs with multiple remote virtual hubs, If there is a tie between remote routes and remote site-to-site VPN routes. Remote site-to-site VPN will be preferred.

        2.	Prefer routes from local virtual hub connections over routes learned from remote virtual hub.
        3.	If there are routes from both ExpressRoute and Site-to-site VPN connections:
            *	If all the routes are local to the virtual hub, the routes from ExpressRoute connections will be chosen.
            * If all the routes are through remote virtual hubs, the routes from Site-to-site VPN connections will be chosen.


### Does the Virtual WAN hub allow connectivity between ExpressRoute circuits?

Transit between ER-to-ER is always via Global reach. Virtual hub gateways are deployed in DC or Azure regions. When two ExpressRoute circuits connect via Global reach, there's no need for the traffic to come all the way from the edge routers to the virtual hub DC.

### Is there a concept of weight in Azure Virtual WAN ExpressRoute circuits or VPN connections

When multiple ExpressRoute circuits are connected to a virtual hub, routing weight on the connection provides a mechanism for the ExpressRoute in the virtual hub to prefer one circuit over the other. There is no mechanism to set a weight on a VPN connection. Azure always prefers an ExpressRoute connection over a VPN connection within a single hub.

### Does Virtual WAN prefer ExpressRoute over VPN for traffic egressing Azure

Yes. Virtual WAN prefers ExpressRoute over VPN for traffic egressing Azure. However, you can configure virtual hub routing preference to change the default preference. For steps, see [Configure virtual hub routing preference](howto-virtual-hub-routing-preference.md).

### When a Virtual WAN hub has an ExpressRoute circuit and a VPN site connected to it, what would cause a VPN connection route to be preferred over ExpressRoute?

When an ExpressRoute circuit is connected to a virtual hub, the Microsoft Edge routers are the first node for communication between on-premises and Azure. These edge routers communicate with the Virtual WAN ExpressRoute gateways that, in turn, learn routes from the virtual hub router that controls all routes between any gateways in Virtual WAN. The Microsoft Edge routers process virtual hub ExpressRoute routes with higher preference over routes learned from on-premises.

For any reason, if the VPN connection becomes the primary medium for the virtual hub to learn routes from (e.g failover scenarios between ExpressRoute and VPN), unless the VPN site has a longer AS Path length, the virtual hub will continue to share VPN learned routes with the ExpressRoute gateway. This causes the Microsoft Edge routers to prefer VPN routes over on-premises routes.

### <a name="expressroute-bow-tie"></a>When two hubs (hub 1 and 2) are connected and there's an ExpressRoute circuit connected as a bow-tie to both the hubs, what is the path for a VNet connected to hub 1 to reach a VNet connected in hub 2?

The current behavior is to prefer the ExpressRoute circuit path over hub-to-hub for VNet-to-VNet connectivity. However, this isn't encouraged in a Virtual WAN setup. To resolve this, you can do one of two things:

* Configure multiple ExpressRoute circuits (different providers) to connect to one hub and use the hub-to-hub connectivity provided by Virtual WAN for inter-region traffic flows.

* Configure AS-Path as the Hub Routing Preference for your Virtual Hub. This ensures traffic between the 2 hubs traverses through the Virtual hub router in each hub and uses the hub-to-hub path instead of the ExpressRoute path (which traverses through the Microsoft Edge routers). For more information, see  [Configure virtual hub routing preference](howto-virtual-hub-routing-preference.md).

### When there's an ExpressRoute circuit connected as a bow-tie to a Virtual WAN hub and a non Virtual WAN VNet, what is the path for the non Virtual WAN VNet to reach the Virtual WAN hub? 

The current behavior is to prefer the ExpressRoute circuit path for non Virtual WAN VNet to Virtual WAN connectivity. It is recommended that the customer [create a Virtual Network connection](howto-connect-vnet-hub.md) to directly connect the non Virtual WAN VNet to the Virtual WAN hub. Afterwards, VNet to VNet traffic will traverse through the Virtual WAN router instead of the ExpressRoute path (which traverses through the Microsoft Enterprise Edge routers/MSEE).

### Can hubs be created in different resource groups in Virtual WAN?

Yes. This option is currently available via PowerShell only. The Virtual WAN portal requires that the hubs are in the same resource group as the Virtual WAN resource itself.

### What is the recommended hub address space during hub creation?

The recommended Virtual WAN hub address space is /23. Virtual WAN hub assigns subnets to various gateways (ExpressRoute, site-to-site VPN, point-to-site VPN, Azure Firewall, Virtual hub Router). For scenarios where NVAs are deployed inside a virtual hub, a /28 is typically carved out for the NVA instances. However if the user were to provision multiple NVAs, a /27 subnet may be assigned. Therefore, keeping a future architecture in mind, while Virtual WAN hubs are deployed with a minimum size of /24, the recommended hub address space at creation time for user to input is /23.

### Can you resize or change the address prefixes of a spoke virtual network connected to the Virtual WAN hub?

No. This is currently not possible. To change the address prefixes of a spoke virtual network, remove the connection between the spoke virtual network and the Virtual WAN hub, modify the address spaces of the spoke virtual network, and then re-create the connection between the spoke virtual network and the Virtual WAN hub.  Also, connecting 2 virtual networks with overlapping address spaces to the virtual hub is currently not supported.

### Is there support for IPv6 in Virtual WAN?

IPv6 isn't supported in the Virtual WAN hub and its gateways. If you have a VNet that has IPv4 and IPv6 support and you would like to connect the VNet to Virtual WAN, this scenario not currently supported.

For the point-to-site User VPN scenario with internet breakout via Azure Firewall, you'll likely have to turn off IPv6 connectivity on your client device to force traffic to the Virtual WAN hub. This is because modern devices, by default, use IPv6 addresses.

### What is the recommended API version to be used by scripts automating various Virtual WAN functionalities?

A minimum version of 05-01-2022 (May 1, 2022) is required.

### Are there any Virtual WAN limits?

See the [Virtual WAN limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-wan-limits) section on the Subscription and service limits page.

### What are the differences between the Virtual WAN types (Basic and Standard)?

See [Basic and Standard Virtual WANs](virtual-wan-about.md#basicstandard). For pricing, see the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### Does Virtual WAN store customer data?

No. Virtual WAN doesn't store any customer data.

### Are there any Managed Service Providers that can manage Virtual WAN for users as a service?

Yes. For a list of Managed Service Provider (MSP) solutions enabled via Azure Marketplace, see [Azure Marketplace offers by Azure Networking MSP partners](../networking/networking-partners-msp.md#msp).

### How does Virtual WAN hub routing differ from Azure Route Server in a VNet?

Both Azure Virtual WAN hub and Azure Route Server provide Border Gateway Protocol (BGP) peering capabilities that can be utilized by NVAs (Network Virtual Appliance) to advertise IP addresses from the NVA to the user’s Azure virtual networks. The deployment options differ in the sense that Azure Route Server is typically deployed by a self-managed customer hub VNet whereas Azure Virtual WAN provides a zero-touch fully meshed hub service to which customers connect their various spokes end points (Azure VNet, on-premises branches with site-to-site VPN or SDWAN, remote users with point-to-site/Remote User VPN and Private connections with ExpressRoute) and enjoy BGP Peering for NVAs deployed in spoke VNet along with other vWAN capabilities such as transit connectivity for VNet-to-VNet, transit connectivity between VPN and ExpressRoute, custom/advanced routing, custom route association and propagation, routing intent/policies for no hassle inter-region security, Secure Hub/Azure firewall etc. For more details about Virtual WAN BGP Peering, please see [How to peer BGP with a virtual hub](scenario-bgp-peering-hub.md).

### If I'm using a third-party security provider (Zscaler, iBoss or Checkpoint) to secure my internet traffic, why don't I see the VPN site associated to the third-party security provider in the Azure Portal?

When you choose to deploy a security partner provider to protect Internet access for your users, the third-party security provider creates a VPN site on your behalf. Because the third-party security provider is created automatically by the provider and isn't a user-created VPN site, this VPN site won't show up in the Azure Portal.

For more information regarding the available options third-party security providers and how to set this up, see [Deploy a security partner provider](../firewall-manager/deploy-trusted-security-partner.md).

### Will BGP communities generated by on-premises be preserved in Virtual WAN?

Yes, BGP communities generated by on-premises will be preserved in Virtual WAN. You can use your own public ASNs or private ASNs for your on-premises networks. You can't use the ranges reserved by Azure or IANA:

* ASNs reserved by Azure:
  * Public ASNs: 8074, 8075, 12076
  * Private ASNs: 65515, 65517, 65518, 65519, 65520
  * ASNs reserved by IANA: 23456, 64496-64511, 65535-65551

### In Virtual WAN, what are the estimated performances by ExpressRoute gateway SKU?

[!INCLUDE [ExpressRoute Performance](../../includes/virtual-wan-expressroute-performance.md)]

### <a name="why-am-i-seeing-a-message-and-button-called-update-router-to-latest-software-version-in-portal."></a>Why am I seeing a message and button called "Update router to latest software version" in portal?

Azure-wide Cloud Services-based infrastructure is deprecating. As a result, the Virtual WAN team has been working on upgrading virtual routers from their current Cloud Services infrastructure to Virtual Machine Scale Sets based deployments. This will enable the virtual hub router to now be availability zone aware. If you navigate to your Virtual WAN hub resource and see this message and button, then you can upgrade your router to the latest version by clicking on the button. If you would like to take advantage of new Virtual WAN features, such as [BGP peering with the hub](create-bgp-peering-hub-portal.md), you'll have to update your virtual hub router via Azure Portal. If the button is not visible, please open a support case. 

You’ll only be able to update your virtual hub router if all the resources (gateways/route tables/VNet connections) in your hub are in a succeeded state. Please make sure all your spoke virtual networks are in active/enabled subscriptions and that your spoke virtual networks are not deleted. Additionally, as this operation requires deployment of new virtual machine scale sets based virtual hub routers, you’ll face an expected downtime of 1-2 minutes for VNet-to-VNet traffic through the same hub and 5-7 minutes for all other traffic flows through the hub. Within a single Virtual WAN resource, hubs should be updated one at a time instead of updating multiple at the same time. When the Router Version says “Latest”, then the hub is done updating. There will be no routing behavior changes after this update. 

If you have already configured BGP peering between your Virtual WAN hub and an NVA in a spoke VNet, then you will have to [delete and then recreate the BGP peer](create-bgp-peering-hub-portal.md). Since the virtual hub router's IP addresses change after the upgrade, you will also have to reconfigure your NVA to peer with the virtual hub router's new IP addresses. These IP addresses are represented as the "virtualRouterIps" field in the Virtual Hub's Resource JSON.

If the update fails for any reason, your hub will be auto recovered to the old version to ensure there is still a working setup.

>[!NOTE]
> The user will need to have an **owner** or **contributor** role to see an accurate status of the hub router version. If a user is assigned a **reader** role to the Virtual WAN resource and subscription, then Azure portal will display to that user that the hub router needs to be upgraded to the latest version, even if the hub is already on the latest version. 

### Is there a route limit for OpenVPN clients connecting to an Azure P2S VPN gateway?

The route limit for OpenVPN clients is 1000.

### How is Virtual WAN SLA calculated?

Virtual WAN is a networking-as-a-service platform that has a 99.95% SLA. However, Virtual WAN combines many different components such as Azure Firewall, site-to-site VPN, ExpressRoute, point-to-site VPN, and Virtual WAN Hub/Integrated Network Virtual Appliances.

The SLA for each component is calculated individually. For example, if ExpressRoute has a 10 minute downtime, the availability of ExpressRoute would be calculated as (Maximum Available Minutes - downtime) / Maximum Available Minutes * 100.

## Next steps

* For more information about Virtual WAN, see [About Virtual WAN](virtual-wan-about.md).
