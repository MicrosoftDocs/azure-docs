---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 07/18/2018
 ms.author: cherylmc
 ms.custom: include file
---

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN vpngateway?

Virtual WAN provides large-scale Site-to-Site connectivity and is built for throughput, scalability, and ease of use. CPE branch devices auto-provision and connect into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners.

### Which device providers (Virtual WAN partners) are supported at launch time? 

At this time, Citrix and Riverbed support the fully automated Virtual WAN experience. For more information, see [Virtual WAN partners](https://aka.ms/virtualwan).

### Am I required to use a preferred partner device?

No. You can use any VPN-capable device that adheres to the Preview requirements for IKEv2 IPsec support.

### How do Virtual WAN partners automate connectivity with Azure Virtual WAN?

Software-defined connectivity solutions typically manage their branch devices using a controller, or a device provisioning center. The controller can use Azure APIs to automate connectivity to the Azure Virtual WAN. For more information, see [Virtual WAN partner automation](../articles/virtual-wan/virtual-wan-configure-automation-providers.md).

### Does Virtual WAN change any existing connectivity features?   

There are no changes to existing Azure connectivity features.

### Are there new Resource Manager resources available for Virtual WAN?
  
Yes, Virtual WAN introduces new Resource Manager resources. For more information, please see the [Overview](https://go.microsoft.com/fwlink/p/?LinkId=2004389).

### Are there any special requirements to join the Preview? 

Before you can configure an Azure Virtual WAN, you must first enroll your subscription in the Preview. To enroll, send an email to <azurevirtualwan@microsoft.com> with your subscription ID. You will receive an email back once your subscription has been enrolled. Until you receive confirmation that your subscription has been enrolled, you will not be able to work with Virtual WAN in the portal.

Considerations:

* The Preview is limited to Azure public regions only.
* Up to 100 connections are supported per virtual hub. Each connection consists of two tunnels that are in an active-active configuration. The tunnels terminate in an Azure Virtual Hub vpngateway.
* Consider using this Preview if:
  * You want to deploy aggregated bandwidth less than 1 Gbps per virtual hub.
  * You have a VPN device that supports route-based configuration and IKEv2 IPsec connectivity.
  * You want to explore using SD-WAN and operating branch devices from the launch partners (Riverbed and Citrix).<br>or<br>You want to set up branch-to-branch and branch to Azure connectivity that includes configuration management of your on-premises device. (Self-configure)

### Is Global VNet peering supported with Azure Virtual WAN? 

 No.

### Can spoke VNets connected to a virtual hub communicate with each other?

Yes. You can directly do VNet peering between spokes that are connected to a virtual hub. For more information, see [Virtual Network Peering](../articles/virtual-network/virtual-network-peering-overview.md).

### Can I deploy and use my favorite network virtual appliance (in an NVA VNet) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance (NVA) VNet to the Azure Virtual WAN, but will require routing capabilities in the hub, which is on our roadmap. All spokes connected to the NVA VNet must additionally be connected to the virtual hub. 

### Can an NVA VNet have a virtual network gateway?

No. The NVA VNet cannot have a virtual network gateway if it is connected to the virtual hub. 

### Is there support for BGP?

Yes, BGP is supported. To ensure that routes from an NVA VNet are advertised appropriately, spokes must disable BGP if they are connected to an NVA VNet which, in turn, is connected to a virtual hub. Additionally, connect the spoke VNets to the virtual hub.

### Can I direct traffic using UDR in the virtual hub?

This is on our roadmap. Stay tuned!

### Is there any licensing or pricing information for Virtual WAN?
 
There is no additional charge during Preview. Current [Azure VPN and egress pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) remains in effect during Preview.

### How do new partners that are not listed in your launch partner list get onboarded?

Send an email to azurevirtualwan@microsoft.com. An ideal partner is one that has a device that can be provisioned for IKEv2 IPSec connectivity.

### Is it possible to construct Azure Virtual WAN with a Resource Manager template?

We are working on it. At the moment, the service is REST and Portal driven.

### Is branch-to-branch connectivity allowed in Virtual WAN?

Yes, branch-to-branch connectivity is available in Virtual WAN.

### Does Branch to Branch traffic traverse through the Azure Virtual WAN?

Yes.

### How is Virtual WAN different from the existing Azure Virtual Network Gateway?

Virtual Network Gateway VPN is limited to 30 tunnels. For connections, you should use Virtual WAN for large-scale VPN. In public preview, this is limited to 100 branch connections with 1 Gbps in the hub.

### Does this Virtual WAN require ExpressRoute from each site?

No, the Virtual WAN does not require ExpressRoute from each site. It uses standard IPsec site-to-site connectivity via Internet links from the device to an Azure Virtual WAN hub.

### Is there a network throughput limit when using Azure Virtual WAN?

In public preview, number of branches is limited to 100 connections per hub/region and a total of 1 G in the hub.

### Does Virtual WAN allow the on-premises device to utilize multiple ISPs in parallel or is it always a single VPN tunnel?

Yes, you can have active-active tunnels (2 tunnels = 1 Azure Virtual WAN connection) from a single branch depending on the branch device.

### How is traffic is routed on the Azure backbone?

The traffic follows the pattern: branch device ->ISP->Microsoft Edge->Microsoft DC->Microsoft edge->ISP->branch device.

### In this model, what do you need at each site? Just an internet connection?

Yes. An Internet connection and physical device, preferably from our integrated partners. Unless you want to manually manage the configuration and connectivity to Azure from your preferred device.