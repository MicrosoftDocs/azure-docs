---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 06/07/2019
 ms.author: cherylmc
 ms.custom: include file
---

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN vpngateway?

Virtual WAN provides large-scale site-to-site connectivity and is built for throughput, scalability, and ease of use. ExpressRoute and point-to-site connectivity functionality is currently under Preview. CPE branch devices autoprovision and connect into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners. See the [Preferred Partner List](https://go.microsoft.com/fwlink/p/?linkid=2019615).

### What is a branch connection to Azure Virtual WAN?

A connection from a branch device into Azure Virtual WAN, composed of two active/active IPsec tunnels.

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

Up to 1,000 connections are supported per virtual hub. Each connection consists of two tunnels that are in an active-active configuration. The tunnels terminate in an Azure Virtual Hub vpngateway.

### Can the on-premises VPN device connect to multiple Hubs?

Yes. Traffic flow when commencing would be from the on-premises device to the closest Microsoft edge and then to the Virtual Hub.

### Is Global VNet peering supported with Azure Virtual WAN? 

 No.

### Can spoke VNets connected to a virtual hub communicate with each other?

Yes. Spoke VNets can communicate directly via Virtual Network Peering. However, we do not support VNets communicating transitively through the hub. For more information, see [Virtual Network Peering](../articles/virtual-network/virtual-network-peering-overview.md).

### Can I deploy and use my favorite network virtual appliance (in an NVA VNet) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance (NVA) VNet to the Azure Virtual WAN. First, connect the network virtual appliance VNet to the hub with a Hub Virtual Network connection. Then, create a Virtual Hub route with a next hop pointing to the Virtual Appliance. You can apply multiple routes to the Virtual Hub Route Table. Any spokes connected to the NVA VNet must additionally be connected to the virtual hub to ensure that the spoke VNet routes are propagated to on-premises systems.

### Can an NVA VNet have a virtual network gateway?

No. The NVA VNet cannot have a virtual network gateway if it is connected to the virtual hub. 

### Is there support for BGP?

Yes, BGP is supported. When you create a VPN site, you can provide the BGP parameters in it. This will imply that any connections created in Azure for that site will be enabled for BGP. Additionally, if you had a VNet with an NVA, and if this NVA VNet was attached to a Virtual WAN hub, in order to ensure that routes from an NVA VNet are advertised appropriately, spokes that are attached to NVA VNet must disable BGP. Additionally, connect these spoke VNets to the virtual hub VNet to ensure spoke VNet routes are propagated to on-premises systems.

### Can I direct traffic using UDR in the virtual hub?

Yes, you can direct traffic to a VNet using Virtual Hub Route Table.

### Is there any licensing or pricing information for Virtual WAN?
 
Yes. See the [Pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.

### How do I calculate price of a hub?
 
You would pay for the service in the hub. For example, 10 branches or on-premises devices requiring to connect to Azure Virtual WAN would imply connecting to VPN end points in the hub. Lets say this is VPN of 1 scale unit = 500 Mbps, this is charged at $0.361/hr. Each connection is charged at $0.08/hr. For 10 connections, the total charge of service/hr would be $0.361 + $.8/hr. Data charges for traffic leaving Azure apply. 

### How do new partners that are not listed in your launch partner list get onboarded?

Send an email to azurevirtualwan@microsoft.com. An ideal partner is one that has a device that can be provisioned for IKEv1 or IKEv2 IPsec connectivity.

### What if a device i am using is not in the Virtual WAN partner list? Can I still use it to connect to Azure Virtual WAN VPN?

Yes as long as the device supports IPsec IKEv1 or IKEv2. Virtual WAN partners automate connectivity from the device to Azure VPN end points. This implies automating steps such as 'branch information upload', 'IPsec and configuration' and 'connectivity'.Since your device is not from a Virtual WAN partner ecosystem, you will need to do the heavy lifting of manually taking the Azure configuration and updating your device to set up IPsec connectivity. 

### Is it possible to construct Azure Virtual WAN with a Resource Manager template?

A simple configuration of one Virtual WAN with one hub and one vpnsite can be created using an [Azure quickstart Template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network). Virtual WAN is primarily a REST or Portal driven service.

### Is branch-to-branch connectivity allowed in Virtual WAN?

Yes, branch-to-branch connectivity is available in Virtual WAN for VPN and VPN to ExpressRoute. While VPN site-to-site is GA, ExpressRoute and point-to-site are currently in Preview.

### Does Branch to Branch traffic traverse through the Azure Virtual WAN?

Yes.

### How is Virtual WAN different from the existing Azure Virtual Network Gateway?

Virtual Network Gateway VPN is limited to 30 tunnels. For connections, you should use Virtual WAN for large-scale VPN. You can connect up to 1,000 branch connections with 20 Gbps in the hub for all regions. A connection is an active-active tunnel from the on-premises VPN device to the virtual hub. You can have one hub per region, which means you can connect more than 1,000 branches across hubs.

### How is Virtual WAN supporting SD-WAN devices?

Virtual WAN partners automate IPsec connectivity to Azure VPN end points. If the Virtual WAN partner is an SD-WAN provider, then it is implied that the SD-WAN controller manages automation and IPsec connectivity to Azure VPN end points. If the SD-WAN device requires its own end point instead of Azure VPN for any proprietary SD-WAN functionality, you can deploy the SD-WAN end point in an Azure VNet and coexist with Azure Virtual WAN.

### Does this Virtual WAN require ExpressRoute from each site?

No, the Virtual WAN does not require ExpressRoute from each site. It uses standard IPsec site-to-site connectivity via Internet links from the device to an Azure Virtual WAN hub. Your sites may be connected to a provider network using an ExpressRoute circuit. For Sites that are connected using ExpressRoute in Virtual Hub (Under Preview), sites can have branch to branch traffic flow between VPN and ExpressRoute. 

### Is there a network throughput limit when using Azure Virtual WAN?

Number of branches is limited to 1000 connections per hub/region and a total of 2 G in the hub. The exception is West Central US, which has a total of 20 Gbps. We will be rolling 20 Gbps out to other regions in the future.

### How many VPN connections does a Virtual WAN hub support?

An Azure Virtual WAN hub can support up to 1,000 S2S connections and 10,000 P2S connections simultaneously.

### What is the total VPN throughput of a VPN tunnel and a connection?

The total VPN throughput of a hub is up to 20 Gbps based on the chosen scale unit. Throughput is shared by all existing connections.

### Does Virtual WAN allow the on-premises device to utilize multiple ISPs in parallel or is it always a single VPN tunnel?

A connection coming into Virtual WAN VPN is always an active-active tunnel (for resiliency within the same hub/region) using a link available at the branch. This link may be an ISP link at the on-premises branch. Virtual WAN does not provide any special logic to set up multiple ISP in parallel; managing failover across ISP at the branch is completely a branch-centric network operation. You can use your favorite SD-WAN solution to do path selection at the branch.

### How is traffic routed on the Azure backbone?

The traffic follows the pattern: branch device ->ISP->Microsoft edge->Microsoft DC (hub VNet)->Microsoft edge->ISP->branch device

### In this model, what do you need at each site? Just an internet connection?

Yes. An Internet connection and physical device that supports IPsec, preferably from our integrated [partners](https://go.microsoft.com/fwlink/p/?linkid=2019615). You can optionally, manually manage the configuration and connectivity to Azure from your preferred device.
