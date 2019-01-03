---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/05/2018
 ms.author: cherylmc
 ms.custom: include file
---

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN vpngateway?

Virtual WAN provides large-scale site-to-site connectivity and is built for throughput, scalability, and ease of use. ExpressRoute and point-to-site connectivity functionality is currently under Preview. CPE branch devices auto-provision and connect into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners. See the [Preferred Parner List](https://go.microsoft.com/fwlink/p/?linkid=2019615).

### Which device providers (Virtual WAN partners) are supported at launch time? 

At this time, many partners support the fully automated Virtual WAN experience. For more information, see [Virtual WAN partners](https://go.microsoft.com/fwlink/p/?linkid=2019615). 

### What are the Virtual WAN partner automation steps?

For partner automation steps, see [Virtual WAN partner automation](../articles/virtual-wan/virtual-wan-configure-automation-providers.md).

### Am I required to use a preferred partner device?

No. You can use any VPN-capable device that adheres to the Azure requirements for IKEv2/IKEv1 IPsec support.

### How do Virtual WAN partners automate connectivity with Azure Virtual WAN?

Software-defined connectivity solutions typically manage their branch devices using a controller, or a device provisioning center. The controller can use Azure APIs to automate connectivity to the Azure Virtual WAN. For more information, see Virtual WAN partner automation.

### Does Virtual WAN change any existing connectivity features?   

There are no changes to existing Azure connectivity features.

### Are there new Resource Manager resources available for Virtual WAN?
  
Yes, Virtual WAN introduces new Resource Manager resources. For more information, please see the [Overview](https://go.microsoft.com/fwlink/p/?LinkId=2004389).

### How many VPN devices can connect to a single Hub?

Up to 1000 connections are supported per virtual hub. Each connection consists of two tunnels that are in an active-active configuration. The tunnels terminate in an Azure Virtual Hub vpngateway.

### Can the on-premises VPN device connect to multiple Hubs?

Yes. Traffic flow when commencing would be from the on-premises device to the closest Microsoft edge and then to the Virtual Hub.

### Is Global VNet peering supported with Azure Virtual WAN? 

 No.

### Can spoke VNets connected to a virtual hub communicate with each other?

Yes. You can directly do VNet peering between spokes that are connected to a virtual hub. For more information, see [Virtual Network Peering](../articles/virtual-network/virtual-network-peering-overview.md).

### Can I deploy and use my favorite network virtual appliance (in an NVA VNet) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance (NVA) VNet to the Azure Virtual WAN. First, connect the network virtual appliance VNet to the hub with a Hub Virtual Network connection. Then, create a Virtual Hub route with a next hop pointing to the Virtual Appliance. You can apply multiple routes to the Virtual Hub Route Table. Any spokes connected to the NVA VNet must additionally be connected to the virtual hub to ensure that the spoke VNet routes are propagated to on-premises systems.

### Can an NVA VNet have a virtual network gateway?

No. The NVA VNet cannot have a virtual network gateway if it is connected to the virtual hub. 

### Is there support for BGP?

Yes, BGP is supported. To ensure that routes from an NVA VNet are advertised appropriately, spokes must disable BGP if they are connected to an NVA VNet, which in turn, is connected to a virtual hub. Additionally, connect the spoke VNets to the virtual hub to ensure spoke VNet routes are propagated to on-premises systems.

### Can I direct traffic using UDR in the virtual hub?

Yes, you can direct traffic to a VNet using Virtual Hub Route Table.

### Is there any licensing or pricing information for Virtual WAN?
 
Yes. See the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### How do new partners that are not listed in your launch partner list get onboarded?

Send an email to azurevirtualwan@microsoft.com. An ideal partner is one that has a device that can be provisioned for IKEv1 or IKEv2 IPsec connectivity.

### Is it possible to construct Azure Virtual WAN with a Resource Manager template?

A simple configuration of one Virtual WAN with one hub and one vpnsite can be created using an [Azure Quick Start Template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network). Virtual WAN is primarily a REST or Portal driven service.

### Is branch-to-branch connectivity allowed in Virtual WAN?

Yes, branch-to-branch connectivity is available in Virtual WAN for VPN and VPN to ExpressRoute. While VPN site-to-site is GA, ExpressRoute and point-to-site are currently in Preview.

### Does Branch to Branch traffic traverse through the Azure Virtual WAN?

Yes.

### How is Virtual WAN different from the existing Azure Virtual Network Gateway?

Virtual Network Gateway VPN is limited to 30 tunnels. For connections, you should use Virtual WAN for large-scale VPN. You can connect up to 1000 branch connections with 2 Gbps in the hub for all regions except the West Central region. For the West Central region, 20 Gbps is available. We will be rolling out 20 Gbps to additional regions in the future. A connection is an active-active tunnel from the on-premises VPN device to the virtual hub. You can have one hub per region, which means you can connect more than 1000 branches across hubs.

### Does this Virtual WAN require ExpressRoute from each site?

No, the Virtual WAN does not require ExpressRoute from each site. It uses standard IPsec site-to-site connectivity via Internet links from the device to an Azure Virtual WAN hub. Your sites may be connected to a provider network using an ExpressRoute circuit. For Sites that are connected using ExpressRoute in Virtual Hub (Under Preview), sites can have branch to branch traffic flow between VPN and ExpressRoute. 

### Is there a network throughput limit when using Azure Virtual WAN?

Number of branches is limited to 1000 connections per hub/region and a total of 2 G in the hub. The exception is West Central US, which has a total of 20 Gbps. We will be rolling 20 Gbps out to other regions in the future.

### Does Virtual WAN allow the on-premises device to utilize multiple ISPs in parallel or is it always a single VPN tunnel?

Yes, you can have active-active tunnels (2 tunnels = 1 Azure Virtual WAN connection) from a single branch depending on the branch device.

### How is traffic routed on the Azure backbone?

The traffic follows the pattern: branch device ->ISP->Microsoft Edge->Microsoft DC->Microsoft edge->ISP->branch device

### In this model, what do you need at each site? Just an internet connection?

Yes. An Internet connection and physical device, preferably from our integrated [partners](https://go.microsoft.com/fwlink/p/?linkid=2019615). You can optionally, manually manage the configuration and connectivity to Azure from your preferred device.
