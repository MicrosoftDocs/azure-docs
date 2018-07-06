---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 07/06/2018
 ms.author: cherylmc
 ms.custom: include file
---

### What is the difference between an Azure virtual network gateway (VPN Gateway) and an Azure Virtual WAN vpngateway?

Virtual WAN provides large-scale Site-to-Site connectivity and is built for throughput, scalability, and ease of use. CPE branch devices auto-provision and connect into Azure Virtual WAN. These devices are available from a growing ecosystem of SD-WAN and VPN partners.

### Which device-partners (preferred partners) are supported at launch time? 

At this time,  Citrix and Riverbed support the fully-automated Virtual WAN experience. More partners will be on-boarding in coming months, including: Nokia Nuage, Palo Alto, and Checkpoint. For more information, see [Device Partners](https://aka.ms/virtualwan).

### Am I required to use a preferred partner device?

No. You can use any VPN capable device that adheres to the preview requirements for IKEv2 IPsec support.

### How do preferred providers automate connectivity with Azure Virtual WAN?

Software-defined connectivity solutions typically manage their branch devices using a controller, or a device provisioning center. The controller can use Azure APIs to automate connectivity to the Azure Virtual WAN. For more information about how this works, see [Preferred provider configuration](virtual-wan-configure-vwan-providers.md).

### Are there any  changes to existing features, with Virtual WAN?   

There are no changes to existing Azure connectivity features.

### Are there new Resource Manager resources available for Virtual WAN?
  
Yes, Virtual WAN introduces new Resource Manager resources. For more information, please see the [Overview](https://go.microsoft.com/fwlink/p/?LinkId=2004389).

### Are there any special requirements to join the preview? 

Before you can configure an Azure Virtual WAN, you must first enroll your subscription in the Preview. Otherwise, you will not be able to work with Virtual WAN in the portal. To enroll, send an email to **azurevirtualwan@microsoft.com** with your subscription ID. You will receive an email back once your subscription has been enrolled.

Considerations:

* The Preview is limited to Azure public regions only.
* Up to 100 connections are supported. Each connection is an active-active tunnel terminating in a VPN gateway inside an Azure virtual hub.
* Consider using this preview if:
  * You want to deploy aggregated bandwidth less than a Gbps.
  * You have a VPN device that supports route-based configuration and IKEv2 IPsec connectivity.
  * You want to explore using SD-WAN and operating branch devices from the launch partners (Riverbed and Citrix)<br>*or*<br>
  * You want to set up branch-to-branch and branch to Azure (Site-to-Site) connectivity that includes configuration management of your on-premise device.

### Is Global VNet peering supported with Azure Virtual WAN? 

 No.

### Can I deploy and use my favorite network virtual appliance (in a transit hub) with Azure Virtual WAN?

Yes, you can connect your favorite network virtual appliance transit hub to the Azure Virtual WAN. All spokes connected to the transit must additionally be connected to the Virtual WAN hub.

### Is there support for BGP?

Yes, there is support for BGP. Spokes that are connected to a transit hub that is connected to a Virtual WAN hub must disable BGP to ensure that routes from the transit hub are advertised appropriately.

### Can the transit hub have ExpressRoute or VPN Virtual Network Gateway?
No.

### Is there an ability to direct traffic using UDR in the Virtual Hub?

Routing functionality will be available by GA.

### Can spoke VNets connected to a Virtual WAN Hub communicate with each other?

Yes. A transit hub can be used if spoke VNets need to talk to each other - as well as to sites - on the Virtual WAN. A transit hub can also be used if spoke VNets have more advanced security policy or logging needs. No NAT functionality is required between the spokes. You can also set up VNet peering between the Azure spokes if necessary. For more information, see [Virtual Network Peering](../articles/virtual-network/virtual-network-peering-overview.md).

### Q. Is there any licensing or pricing information for Virtual WAN?
 
A. There is no additional charge. Current [Azure VPN and egress pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) remains in effect during preview.