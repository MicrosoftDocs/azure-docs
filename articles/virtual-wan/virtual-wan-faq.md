---
title: 'Azure Virtual WAN FAQ | Microsoft Docs'
description: See answers to frequently asked questions about Azure Virtual WAN networks, clients, gateways, devices, partners, and connections.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: troubleshooting
ms.date: 07/29/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to read more details about Virtual WAN in a FAQ format.
---

# Virtual WAN FAQ

### Is Azure Virtual WAN in GA?

Yes, Azure Virtual WAN is Generally Available (GA). However, Virtual WAN consists of several features and scenarios. There are feature or scenarios within Virtual WAN where Microsoft applies the Preview tag. In those cases, the specific feature, or the scenario itself, is in Preview. If you do not use a specific preview feature, regular GA support applies. For more information about Preview support, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Does the user need to have hub and spoke with SD-WAN/VPN devices to use Azure Virtual WAN?

Virtual WAN provides many functionalities built into a single pane of glass such as Site/Site-to-site VPN connectivity, User/P2S connectivity, ExpressRoute connectivity, Virtual Network connectivity, VPN ExpressRoute Interconnectivity, VNet-to-VNet transitive connectivity, Centralized Routing, Azure Firewall and Firewall Manager security, Monitoring, ExpressRoute Encryption, and many other capabilities. You do not have to have all of these use-cases to start using Virtual WAN. You can get started with just one use case.

The Virtual WAN architecture is a hub and spoke architecture with scale and performance built in where branches (VPN/SD-WAN devices), users (Azure VPN Clients, openVPN, or IKEv2 Clients), ExpressRoute circuits, Virtual Networks serve as spokes to virtual hub(s). All hubs are connected in full mesh in a Standard Virtual WAN making it easy for the user to use the Microsoft backbone for any-to-any (any spoke) connectivity. For hub and spoke with SD-WAN/VPN devices, users can either manually set it up in the Azure Virtual WAN portal or use the Virtual WAN Partner CPE (SD-WAN/VPN) to set up connectivity to Azure.

Virtual WAN partners provide automation for connectivity, which is the ability to export the device info into Azure, download the Azure configuration and establish connectivity to the Azure Virtual WAN hub. For Point-to-site/User VPN connectivity, we support [Azure VPN client](https://go.microsoft.com/fwlink/?linkid=2117554), OpenVPN, or IKEv2 client.

### Can you disable fully meshed hubs in a Virtual WAN?

Virtual WAN comes in two flavors: Basic and Standard. In Basic Virtual WAN, hubs are not meshed. In a Standard Virtual WAN, hubs are meshed and automatically connected when the virtual WAN is first set up. The user does not need to do anything specific. The user also does not have to disable or enable the functionality to obtain meshed hubs. Virtual WAN provides you many routing options to steer traffic between any spoke (VNet, VPN, or ExpressRoute). It provides the ease of fully meshed hubs, and also the flexibility of routing traffic per your needs.

### How are Availability Zones and resiliency handled in Virtual WAN?

Virtual WAN is a collection of hubs and services made available inside the hub. The user can have as many Virtual WAN per their need. In a Virtual WAN hub, there are multiple services like VPN, ExpressRoute etc. Each of these services (except the Azure Firewall) is deployed in an Availability Zones region, that is if the region supports Availability Zones. If a region becomes an Availability Zone after the initial deployment in the hub, the user can recreate the gateways, which will trigger an Availability Zone deployment. All gateways are provisioned in a hub as active-active, implying there is resiliency built in within a hub. Users can connect to multiple hubs if they want resiliency across regions.

While the concept of Virtual WAN is global, the actual Virtual WAN resource is Resource Manager-based and deployed regionally. If the virtual WAN region itself were to have an issue, all hubs in that virtual WAN will continue to function as is, but the user will not be able to create new hubs until the virtual WAN region is available.

### What client does the Azure Virtual WAN User VPN (Point-to-site) support?

Virtual WAN supports [Azure VPN client](https://go.microsoft.com/fwlink/?linkid=2117554), OpenVPN Client, or any IKEv2 client. Azure AD authentication is supported with Azure VPN Client.A minimum of Windows 10 client OS version 17763.0 or higher is required.  OpenVPN client(s) can support certificate-based authentication. Once cert-based auth is selected on the gateway, you will see the.ovpn* file to download to your device. IKEv2 supports both certificate and RADIUS authentication. 

### For User VPN (Point-to-site)- Why is the P2S client pool split into two routes?

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
   $updatedP2SVpnGateway = Update-AzP2sVpnGateway -ResourceGroupName $rgName -Name $P2SvpnGatewayName  -CustomDnsServer $customDnsServers 

   // Re-generate Vpn profile either from PS/Portal for Vpn clients to have the specified dns servers
   ```
2. Or, if you are using the Azure VPN Client for Windows 10, you can modify the downloaded profile XML file and add the **\<dnsservers>\<dnsserver> \</dnsserver>\</dnsservers>** tags before importing it.

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

### For User VPN (Point-to-site)- how many clients are supported?

Each User VPN P2S gateway has two instances. Each instance supports up to a certain number of connections as the scale unit changes. Scale unit 1-3 supports 500 connections, scale unit 4-6 supports 1000 connections, scale unit 7-12 supports 5000 connections, and scale unit 13-18 supports up to 10,000 connections.

For example, let's say the user chooses 1 scale unit. Each scale unit would imply an active-active gateway deployed and each of the instances (in this case 2) would support up to 500 connections. Since you can get 500 connections * 2 per gateway, it does not mean that you plan for 1000 instead of the 500 for this scale unit. Instances may need to be serviced during which connectivity for the extra 500 may be interrupted if you surpass the recommended connection count. Also, be sure to plan for downtime in case you decide to scale up or down on the scale unit, or change the point-to-site configuration on the VPN gateway.

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN VPN gateway?

Virtual WAN provides large-scale site-to-site connectivity and is built for throughput, scalability, and ease of use. When you connect a site to a Virtual WAN VPN gateway, it is different from a regular virtual network gateway that uses a gateway type 'VPN'. Similarly, when you connect an ExpressRoute circuit to a Virtual WAN hub, it uses a different resource for the ExpressRoute gateway than the regular virtual network gateway that uses gateway type 'ExpressRoute'. 

Virtual WAN supports up to 20 Gbps aggregate throughput both for VPN and ExpressRoute. Virtual WAN also has automation for connectivity with an ecosystem of CPE branch device partners. CPE branch devices have built-in automation that autoprovisions and connects into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners. See the [Preferred Partner List](virtual-wan-locations-partners.md).

### How is Virtual WAN different from an Azure virtual network gateway?

A virtual network gateway VPN is limited to 30 tunnels. For connections, you should use Virtual WAN for large-scale VPN. You can connect up to 1,000 branch connections per region (virtual hub) with aggregate of 20 Gbps per hub. A connection is an active-active tunnel from the on-premises VPN device to the virtual hub. You can have one hub per region, which means you can connect more than 1,000 branches across hubs.

### What is the recommended Packets per Second limit per IPSEC tunnel?

It is recommended to send around 95,000 PPS with GCMAES256 algorithm for both IPSEC Encryption and Integrity for optimal performance. Though traffic is not blocked if greater than 95,000 PPS are sent, performance degradation such as latency and packet drops can be expected. Please create additional tunnels if greater PPS is required.


### What is a Virtual WAN gateway scale unit?

A scale unit is a unit defined to pick an aggregate throughput of a gateway in Virtual hub. 1 scale unit of VPN = 500 Mbps. 1 scale unit of ExpressRoute = 2 Gbps. Example: 10 scale unit of VPN would imply 500 Mbps * 10 = 5 Gbps

### Which device providers (Virtual WAN partners) are supported?

At this time, many partners support the fully automated Virtual WAN experience. For more information, see [Virtual WAN partners](virtual-wan-locations-partners.md).

### What are the Virtual WAN partner automation steps?

For partner automation steps, see [Virtual WAN partner automation](virtual-wan-configure-automation-providers.md).

### Am I required to use a preferred partner device?

No. You can use any VPN-capable device that adheres to the Azure requirements for IKEv2/IKEv1 IPsec support. Virtual WAN also has CPE partner solutions that automate connectivity to Azure Virtual WAN making it easier to set up IPsec VPN connections at scale.

### How do Virtual WAN partners automate connectivity with Azure Virtual WAN?

Software-defined connectivity solutions typically manage their branch devices using a controller, or a device provisioning center. The controller can use Azure APIs to automate connectivity to the Azure Virtual WAN. The automation includes uploading branch information, downloading the Azure configuration, setting up IPsec tunnels into Azure Virtual hubs, and automatically setting up connectivity form the branch device to Azure Virtual WAN. When you have hundreds of branches, connecting using Virtual WAN CPE Partners is easy because the onboarding experience takes away the need to set up, configure, and manage large-scale IPsec connectivity. For more information, see [Virtual WAN partner automation](virtual-wan-configure-automation-providers.md).

### What if a device I am using is not in the Virtual WAN partner list? Can I still use it to connect to Azure Virtual WAN VPN?

Yes as long as the device supports IPsec IKEv1 or IKEv2. Virtual WAN partners automate connectivity from the device to Azure VPN end points. This implies automating steps such as 'branch information upload', 'IPsec and configuration' and 'connectivity'. Because your device is not from a Virtual WAN partner ecosystem, you will need to do the heavy lifting of manually taking the Azure configuration and updating your device to set up IPsec connectivity.

### How do new partners that are not listed in your launch partner list get onboarded?

All virtual WAN APIs are open API. You can go over the documentation [Virtual WAN partner automation](virtual-wan-configure-automation-providers.md) to assess technical feasibility. An ideal partner is one that has a device that can be provisioned for IKEv1 or IKEv2 IPsec connectivity. Once the company has completed the automation work for their CPE device based on the automation guidelines provided above, you can reach out to azurevirtualwan@microsoft.com to be listed here [Connectivity through partners](virtual-wan-locations-partners.md#partners). If you are a customer that would like a certain company solution to be listed as a Virtual WAN partner, have the company contact the Virtual WAN by sending an email to azurevirtualwan@microsoft.com.

### How is Virtual WAN supporting SD-WAN devices?

Virtual WAN partners automate IPsec connectivity to Azure VPN end points. If the Virtual WAN partner is an SD-WAN provider, then it is implied that the SD-WAN controller manages automation and IPsec connectivity to Azure VPN end points. If the SD-WAN device requires its own end point instead of Azure VPN for any proprietary SD-WAN functionality, you can deploy the SD-WAN end point in an Azure VNet and coexist with Azure Virtual WAN.

### How many VPN devices can connect to a single hub?

Up to 1,000 connections are supported per virtual hub. Each connection consists of four links and each link connection supports two tunnels that are in an active-active configuration. The tunnels terminate in an Azure virtual hub VPN gateway. Links represent the physical ISP link at the branch/VPN device.

### What is a branch connection to Azure Virtual WAN?

A connection from a branch or VPN device into Azure Virtual WAN is a VPN connection that connects virtually the VPN Site and the Azure VPN Gateway in a virtual hub.

### What happens if the on-premises VPN device only has 1 tunnel to an Azure Virtual WAN VPN gateway?

An Azure Virtual WAN connection is composed of 2 tunnels. A Virtual WAN VPN gateway is deployed in a virtual hub in active-active mode, which implies that there are separate tunnels from on-premises devices terminating on separate instances. This is the recommendation for all users. However, if the user chooses to only have 1 tunnel to one of the Virtual WAN VPN gateway instances, if for any reason (maintenance, patches etc.) the gateway instance is taken offline, the tunnel will be moved to the secondary active instance and the user may experience a reconnect. BGP sessions will not move across instances.

### Can the on-premises VPN device connect to multiple hubs?

Yes. Traffic flow, when commencing, is from the on-premises device to the closest Microsoft network edge, and then to the virtual hub.

### Are there new Resource Manager resources available for Virtual WAN?
  
Yes, Virtual WAN has new Resource Manager resources. For more information, please see the [Overview](virtual-wan-about.md).

### Can I deploy and use my favorite network virtual appliance (in an NVA VNet) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance (NVA) VNet to the Azure Virtual WAN.

### Can I create a Network Virtual Appliance inside the virtual hub?

A Network Virtual Appliance (NVA) cannot be deployed inside a virtual hub. However, you can create it in a spoke VNet that is connected to the virtual hub and enable appropriate routing to direct traffic per your needs.

### Can a spoke VNet have a virtual network gateway?

No. The spoke VNet cannot have a virtual network gateway if it is connected to the virtual hub.

### Is there support for BGP in VPN connectivity?

Yes, BGP is supported. When you create a VPN site, you can provide the BGP parameters in it. This will imply that any connections created in Azure for that site will be enabled for BGP.

### Is there any licensing or pricing information for Virtual WAN?

Yes. See the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### Is it possible to construct Azure Virtual WAN with a Resource Manager template?

A simple configuration of one Virtual WAN with one hub and one vpnsite can be created using an [quickstart template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network). Virtual WAN is primarily a REST or portal driven service.

### Can spoke VNets connected to a virtual hub communicate with each other (V2V Transit)?

Yes. Standard Virtual WAN supports VNet-to-VNet transitive connectivity via the Virtual WAN hub that the VNets are connected to. In Virtual WAN terminology, we refer to these paths as “local Virtual WAN VNet transit” for VNets connected to a Virtual Wan hub within a single region, and “global Virtual WAN VNet transit” for VNets connected through multiple Virtual WAN hubs across two or more regions.

In some scenarios, spoke VNets can also be directly peered with each other using [virtual network peering](../virtual-network/virtual-network-peering-overview.md) in addition to local or global Virtual WAN VNet transit. In this case, VNet Peering takes precedence over the transitive connection via the Virtual WAN hub.

### Is branch-to-branch connectivity allowed in Virtual WAN?

Yes, branch-to-branch connectivity is available in Virtual WAN. Branch is conceptually applicable to VPN Site, ExpressRoute circuits, or Point-to-Site/User VPN users. Enabling branch-to-branch is enabled by default and can be located in WAN **Configuration** settings. This lets VPN branches/users connect to other VPN branches and transit connectivity is also enabled between VPN and ExpressRoute users.

### Does branch-to-branch traffic traverse through the Azure Virtual WAN?

Yes. Branch-to-branch traffic traverses through Azure Virtual WAN.

### Does Virtual WAN require ExpressRoute from each site?

No. Virtual WAN does not require ExpressRoute from each site. Your sites may be connected to a provider network using an ExpressRoute circuit. For sites that are connected using ExpressRoute to a virtual hub and IPsec VPN into the same hub, virtual hub provides transit connectivity between the VPN and ExpressRoute user.

### Is there a network throughput or connection limit when using Azure Virtual WAN?

Network throughput is per service in a virtual WAN hub. While you can have as many virtual WANs as you like, each Virtual WAN allows 1 hub per region. In each hub, the VPN Aggregate throughput is up to 20 Gbps, the ExpressRoute aggregate throughput is  up to 20 Gbps and the User VPN/Point-to-site VPN aggregate throughput is up to 20 Gbps. The router in virtual hub supports up to 50 Gbps for VNet-to-VNet traffic flows and assumes a total of 2000 VM workload across all VNets connected to a single virtual hub.

When VPN sites connect into a hub, they do so with connections. Virtual WAN supports up to 1000 connections or 2000 IPsec tunnels per virtual hub. When remote users connect into virtual hub, they connect to the P2S VPN gateway, which supports up to 10,000 users depending on the scale unit(bandwidth) chosen for the P2S VPN gateway in the virtual hub.

### What is the total VPN throughput of a VPN tunnel and a connection?

The total VPN throughput of a hub is up to 20 Gbps based on the chosen scale unit of the VPN gateway. Throughput is shared by all existing connections. Each tunnel in a connection can support up to 1 Gbps.

### Can I use NAT-T on my VPN connections?

Yes, NAT traversal (NAT-T) is supported. The Virtual WAN VPN gateway will NOT perform any NAT-like functionality on the inner packets to/from the IPsec tunnels. In this configuration, ensure the on-premises device initiates the IPsec tunnel.

### I don't see the 20 Gbps setting for the virtual hub in portal. How do I configure that?

Navigate to the VPN gateway inside a hub on the portal, then click on the scale unit to change it to the appropriate setting.

### Does Virtual WAN allow the on-premises device to utilize multiple ISPs in parallel, or is it always a single VPN tunnel?

On-premises device solutions can apply traffic policies to steer traffic across multiple tunnels into the Azure Virtual WAN hub (VPN gateway in the virtual hub).

### What is global transit architecture?

For information about global transit architecture, see [Global transit network architecture and Virtual WAN](virtual-wan-global-transit-network-architecture.md).

### How is traffic routed on the Azure backbone?

The traffic follows the pattern: branch device ->ISP->Microsoft network edge->Microsoft DC (hub VNet)->Microsoft network edge->ISP->branch device

### In this model, what do you need at each site? Just an internet connection?

Yes. An internet connection and physical device that supports IPsec, preferably from our integrated [Virtual WAN partners](virtual-wan-locations-partners.md). Optionally, you can manually manage the configuration and connectivity to Azure from your preferred device.

### How do I enable default route (0.0.0.0/0) for a connection (VPN, ExpressRoute, or Virtual Network)?

A virtual hub can propagate a learned default route to a virtual network/site-to-site VPN/ExpressRoute connection if the flag is 'Enabled' on the connection. This flag is visible when the user edits a virtual network connection, a VPN connection, or an ExpressRoute connection. By default, this flag is disabled when a site or an ExpressRoute circuit is connected to a hub. It is enabled by default when a virtual network connection is added to connect a VNet to a virtual hub.

The default route does not originate in the Virtual WAN hub; the default route is propagated if it is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced-tunneling enabled. A default route does not propagate between hubs (inter-hub).

### How does the virtual hub in a virtual WAN select the best path for a route from multiple hubs?

If a virtual hub learns the same route from multiple remote hubs,  the order in which it decides is as follows:

1. Longest prefix match.
1. Local routes over interhub (Virtual hub assigns 65520-65520 for interhub AS).
1. Static routes over BGP: This is in context to the decision being made by the virtual hub router. However, if the decision maker is the VPN gateway where a site advertises routes via BGP or provides static address prefixes, static routes may be preferred over BGP routes.
1. ExpressRoute (ER) over VPN: ER is preferred over VPN when the context is a local hub. Transit connectivity between ExpressRoute circuits is only available through Global Reach. Therefore, in scenarios where ExpressRoute circuit is connected to one hub and there is another ExpressRoute circuit connected to a different hub with VPN connection, VPN may be preferred for inter-hub scenarios.
1. AS path length.

### Does the Virtual WAN hub allow connectivity between ExpressRoute circuits?

Transit between ER-to-ER is always via Global reach. Virtual hub gateways are deployed in DC or Azure regions. When two ExpressRoute circuits connect via Global reach, there is no need for the traffic to come all the way from the edge routers to the virtual hub DC.

### Is there a concept of weight in Azure Virtual WAN ExpressRoute circuits or VPN connections

When multiple ExpressRoute circuits are connected to a virtual hub, routing weight on the connection provides a mechanism for the ExpressRoute in the virtual hub to prefer one circuit over the other. There is no mechanism to set a weight on a VPN connection. Azure always prefers an ExpressRoute connection over a VPN connection within a single hub.

### Does Virtual WAN prefer ExpressRoute over VPN for traffic egressing Azure

Yes. Virtual WAN prefers ExpressRoute over VPN for traffic egressing Azure.

### When a Virtual WAN hub has an ExpressRoute circuit and a VPN Site connected to it, what would cause a VPN connection route to be preferred over ExpressRoute?

When an ExpressRoute circuit is connected to virtual hub, the Microsoft edge routers are the first node for communication between on-premises and Azure. These edge routers communicate with the Virtual WAN ExpressRoute gateways that, in turn, learn routes from the virtual hub router that controls all routes between any gateways in Virtual WAN. The Microsoft edge routers process virtual hub ExpressRoute routes with higher preference over routes learned from on-premises.

For any reason, if the VPN connection becomes the primary medium for the virtual hub to learn routes from (e.g failover scenarios between ExpressRoute and VPN), unless the VPN Site has a longer AS Path length, the virtual hub will continue to share VPN learned routes with the ExpressRoute gateway. This causes the Microsoft edge routers to prefer VPN routes over on-premises routes.

### When two hubs (hub 1 and 2) are connected and there is an ExpressRoute circuit connected as a bow-tie to both the hubs, what is the path for a VNet connected to hub 1 to reach a VNet connected in hub 2?

The current behavior is to prefer the ExpressRoute circuit path over hub-to-hub for VNet-to-VNet connectivity. However, this is not encouraged in a virtual WAN setup. The Virtual WAN team is working on a fix to enable the preference for hub-to-hub over the ExpressRoute path. The recommendation is for multiple ExpressRoute circuits (different providers) to connect to one hub and use the hub-to-hub connectivity provided by Virtual WAN for inter-region traffic flows.

### Can hubs be created in different resource group in Virtual WAN?

Yes. This option is currently available via PowerShell only. The Virtual WAN portal requires that the hubs are in the same resource group as the Virtual WAN resource itself.

### What is the recommended hub address space during hub creation?

The recommended Virtual WAN hub address space is /23. Virtual WAN hub assigns subnets to various gateways (ExpressRoute, Site-to-site VPN, Point-to-site VPN, Azure Firewall, Virtual hub Router). For scenarios where NVAs are deployed inside a virtual hub, a /28 is typically carved out for the NVA instances. However if the user were to provision multiple NVAs, a /27 subnet may be assigned. Therefore keeping a future architecture in mind, while Virtual WAN hubs are deployed with a minimum size of /24, the recommended hub address space at creation time for user to input is /23.

### Is there support for IPv6 in Virtual WAN?

IPv6 is not supported in the Virtual WAN hub and its gateways. If you have a VNet that has IPv4 and IPv6 support and you would like to connect the VNet to Virtual WAN, this scenario not currently supported.

For the point-to-site User VPN scenario with internet breakout via Azure Firewall, you will likely have to turn off IPv6 connectivity on your client device to force traffic to the Virtual WAN hub. This is because modern devices, by default, use IPv6 addresses.

### What is the recommended API version to be used by scripts automating various Virtual WAN functionalities?

A minimum version of 05-01-2020 (May 1 2020) is required.

### Are there any Virtual WAN limits?

See the [Virtual WAN limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-wan-limits) section on the Subscription and service limits page.

### What are the differences between the Virtual WAN types (Basic and Standard)?

See [Basic and Standard Virtual WANs](virtual-wan-about.md#basicstandard). For pricing, see the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### Does Virtual WAN store customer data?

No. Virtual WAN does not store any customer data.

### Are there any Managed Service Providers that can manage Virtual WAN for users as a service?

Yes. For a list of Managed Service Provider (MSP) solutions enabled via Azure Marketplace, see [Azure Marketplace offers by Azure Networking MSP partners](../networking/networking-partners-msp.md#msp).

### How does Virtual WAN Hub routing differ from Azure Route Server in a VNet?

Azure Route Server provides a Border Gateway Protocol (BGP) peering service that can be used by NVAs (Network Virtual Appliance) to learn routes from the route server in a DIY hub VNet. Virtual WAN routing provides multiple capabilities including VNet-to-VNet transit routing, custom routing, custom route association and propagation, and a zero-touch fully meshed hub service along with connectivity services of ExpressRoute, Site VPN, Remote User/Large Scale P2S VPN, and Secure hub (Azure Firewall) capabilities. When you establish a BGP peering between your NVA and Azure Route Server, you can advertise IP addresses from your NVA to your virtual network. For all advanced routing capabilities such as transit routing, custom routing, etc., you can use Virtual WAN routing.

### If I am using a third-party security provider (ZScalar, iBoss or Checkpoint) to secure my internet traffic why don't I see the VPN site associated to the third-party security provider in Azure Portal?

When you choose to deploy a security partner provider to protect Internet access for your users, the third-party security provider creates a VPN site on your behalf. Because the third-party security provider is created automatically by the provider and is not a user-created VPN site, this VPN site will not show up in Azure Portal.

For more information regarding the available options third-party security providers and how to set this up, please review this [document](../firewall-manager/deploy-trusted-security-partner.md)

## Next steps

* For more information about Virtual WAN, see [About Virtual WAN](virtual-wan-about.md).

