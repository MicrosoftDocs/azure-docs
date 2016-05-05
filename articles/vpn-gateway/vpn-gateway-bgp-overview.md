<properties
   pageTitle="Overview of BGP with Azure VPN Gateways | Microsoft Azure"
   description="This article provides an overview of BGP with Azure VPN Gateways."
   services="vpn-gateway"
   documentationCenter="na"
   authors="yushwang"
   manager="rossort"
   editor=""
   tags=""/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/26/2016"
   ms.author="yushwang"/>

# Overview of BGP with Azure VPN Gateways

This article provides an overview of BGP (Border Gateway Protocol) support in Azure VPN Gateways.

## About BGP

BGP is the standard routing protocol commonly used in the Internet to exchange routing and reachability information between two or more networks. When used in the context of Azure Virtual Networks, BGP enables the Azure VPN Gateways and your on-premises VPN devices, called BGP peers or neighbors, to exchange "routes" that will inform both gateways on the availability and reachability for those prefixes to go through the gateways or routers involved. BGP can also enable transit routing among multiple networks by propagating routes a BGP gateway learns from one BGP peer to all other BGP peers.
 
### Why use BGP?

BGP is an optional feature you can use with Azure Route-Based VPN gateways. You should also make sure your on-premises VPN devices support BGP before you enable the feature. You can continue to use Azure VPN gateways and your on-premises VPN devices without BGP. It is the equivalent of using static routes (without BGP) *vs.* using dynamic routing with BGP between your networks and Azure.

There are several advantages and new capabilities with BGP:

#### Support automatic and flexible prefix updates

With BGP, you only need to declare a minimum prefix to a specific BGP peer over the IPsec S2S VPN tunnel. It can be as small as a host prefix (/32) of the BGP peer IP address of your on-premises VPN device. You can control which on-premises network prefixes you want to advertise to Azure to allow your Azure Virtual Network to access.
	
You can also advertise a larger prefixes that may include some of your VNet address prefixes, such as default route (0.0.0.0/0) or a large private IP address space (e.g., 10.0.0.0/8). Please note though the prefixes cannot be identical with any one of your VNet prefixes. Those routes identical to your VNet prefixes will be rejected.

#### Support multiple tunnels between a VNet and an on-premises site with automatic failover based on BGP

You can establish multiple connections between your Azure VNet and your on-premises VPN devices in the same location. This capability provides multiple tunnels (paths) between the two networks in an active-active configuration. If one of the tunnels is disconnected, the corresponding routes will be withdrawn via BGP and the traffic will automatically shift to the remaining tunnels.
	
The following diagram shows a simple example of this highly available setup:
	
![Multiple active paths](./media/vpn-gateway-bgp-overview/multiple-active-tunnels.png)

#### Support transit routing between your on-premises networks and multiple Azure VNets

BGP enables multiple gateways to learn and propagate prefixes from different networks, whether they are directly or indirectly connected. This can enable transit routing with Azure VPN gateways between your on-premises sites or across multiple Azure Virtual Networks.
	
The following diagram shows an example of a multi-hop topology with multiple paths that can transit traffic between the two on-premises networks through Azure VPN gateways within the Microsoft Networks:

![Multi-hop transit](./media/vpn-gateway-bgp-overview/full-mesh-transit.png)

## BGP FAQs

#### Is BGP supported on all Azure VPN Gateway SKUs?

No, BGP is supported on Azure **Standard** and **HighPerformance** VPN gateways. **Basic** SKU is NOT supported.

#### Can I use BGP with Azure Policy-Based VPN gateways?

No, BGP is supported on Route-Based VPN gateways only.

#### Can I use private ASNs (Autonomous System Numbers)?

Yes, you can use your own public ASNs or private ASNs for both your on-premises networks and Azure virtual networks.

#### Can I use the same ASN for both on-premises VPN networks and Azure VNets?

No, you must assign different ASNs between your on-premises networks and your Azure VNets if you are connecting them together with BGP. Azure VPN Gateways have a default ASN of 65515 assigned, whether BGP is enabled for not for your cross-premises connectivity. You can override this default by assigning a different ASN when creating the VPN gateway, or change the ASN after the gateway is created. You will need to assign your on-premises ASNs to the corresponding Azure Local Network Gateways.



#### What address prefixes will Azure VPN gateways advertise to me?

Azure VPN gateway will advertise the following routes to your on-premises BGP devices:

- Your VNet address prefixes
- Address prefixes for each Local Network Gateways connected to the Azure VPN gateway
- Routes learned from other BGP peering sessions connected to the Azure VPN gateway, **except default route or routes overlapped with any VNet prefix**.

#### Can I use BGP with my VNet-to-VNet connections?

Yes, you can use BGP for both cross-premises connections and VNet-to-VNet connections.

#### Can I mix BGP with non-BGP connections for my Azure VPN gateways?

Yes, you can mix both BGP and non-BGP connections for the same Azure VPN gateway.

#### Does Azure VPN gateway support BGP transit routing?

Yes, BGP transit routing is supported, with the exception that Azure VPN gateways will **NOT** advertise default routes to other BGP peers. To enable transit routing across multiple Azure VPN gateways, you must enable BGP on all intermediate VNet-to-VNet connections.

#### Can I have more than one tunnels between Azure VPN gateway and my on-premises network?

Yes, you can establish more than one S2S VPN tunnels between an Azure VPN gateway and your on-premises network. Please note that all these tunnels will be counted against the total number of tunnels for your Azure VPN gateways. For example, if you have two redundant tunnels between your Azure VPN gateway and one of your on-premises network, they will consume 2 tunnels out of the total quota for your Azure VPN gateway (10 for Standard and 30 for HighPerformance).

#### Can I have multiple tunnels between two Azure VNets with BGP?

No, redundant tunnels between a pair of virtual networks are not supported.

#### Can I use BGP for S2S VPN in an ExpressRoute/S2S VPN co-existence configuration?

Not at this time.

#### What address does Azure VPN gateway use for BGP Peer IP?

The Azure VPN gateway will allocate a single IP address from the GatewaySubnet range defined for the virtual network. By default, it is the second last address of the range. For example, if your GatewaySubnet is 10.12.255.0.0/27, ranging from 10.42.255.0.0 to 10.42.255.31, then the BGP Peer IP address on the Azure VPN gateway will be 10.12.255.30. You can find this information when you list the Azure VPN gateway information.

#### What are the requirements for the BGP Peer IP addresses on my VPN device?

Your on-premises BGP peer address **MUST NOT** be the same as the public IP address of your VPN device. Use a different IP address on the VPN device for your BGP Peer IP. It can be an address assigned to the loopback interface on the device. Specify this address in the corresponding Local Network Gateway representing the location.

#### What should I specify as my address prefixes for the Local Network Gateway when I use BGP?

Azure Local Network Gateway specifies the initial address prefixes for the on-premises network. With BGP, you must allocate the host prefix (/32 prefix) of your BGP Peer IP address as the address space for that on-premises network. If your BGP Peer IP is 10.52.255.254, you should specify "10.52.255.254/32" as the localNetworkAddressSpace of the Local Network Gateway representing this on-premises network. This is to ensure that the Azure VPN gateway establishes the BGP session through the S2S VPN tunnel.

#### What should I add to my on-premises VPN device for the BGP peering session?

You should add a host route of the Azure BGP Peer IP address on your VPN device pointing to the IPsec S2S VPN tunnel. For example, if the Azure VPN Peer IP is "10.12.255.30", you should add a host route for "10.12.255.30" with a nexthop interface of the matching IPsec tunnel interface on your VPN device.

## Next steps

See [Getting started with BGP on Azure VPN gateways](./vpn-gateway-bgp-resource-manager-ps.md) for steps to configure BGP for your cross-premises and VNet-to-VNet connections.

