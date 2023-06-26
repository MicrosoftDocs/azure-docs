---
title: 'About BGP with VPN Gateway'
titleSuffix: Azure VPN Gateway
description: Learn about Border Gateway Protocol (BGP) in Azure VPN, the standard internet protocol to exchange routing and reachability information between networks.
author: cherylmc
ms.service: vpn-gateway
ms.topic: article
ms.date: 05/02/2023
ms.author: cherylmc
---
# About BGP and VPN Gateway

This article provides an overview of BGP (Border Gateway Protocol) support in Azure VPN Gateway.

BGP is the standard routing protocol commonly used in the Internet to exchange routing and reachability information between two or more networks. When used in the context of Azure Virtual Networks, BGP enables the Azure VPN gateways and your on-premises VPN devices, called BGP peers or neighbors, to exchange "routes" that will inform both gateways on the availability and reachability for those prefixes to go through the gateways or routers involved. BGP can also enable transit routing among multiple networks by propagating routes a BGP gateway learns from one BGP peer to all other BGP peers.

## <a name="why"></a>Why use BGP?

BGP is an optional feature you can use with Azure Route-Based VPN gateways. You should also make sure your on-premises VPN devices support BGP before you enable the feature. You can continue to use Azure VPN gateways and your on-premises VPN devices without BGP. It's the equivalent of using static routes (without BGP) *vs.* using dynamic routing with BGP between your networks and Azure.

There are several advantages and new capabilities with BGP:

### <a name="prefix"></a>Support automatic and flexible prefix updates

With BGP, you only need to declare a minimum prefix to a specific BGP peer over the IPsec S2S VPN tunnel. It can be as small as a host prefix (/32) of the BGP peer IP address of your on-premises VPN device. You can control which on-premises network prefixes you want to advertise to Azure to allow your Azure Virtual Network to access.

You can also advertise larger prefixes that may include some of your VNet address prefixes, such as a large private IP address space (for example, 10.0.0.0/8). Note though the prefixes can't be identical with any one of your VNet prefixes. Those routes identical to your VNet prefixes will be rejected.

### <a name="multitunnel"></a>Support multiple tunnels between a VNet and an on-premises site with automatic failover based on BGP

You can establish multiple connections between your Azure VNet and your on-premises VPN devices in the same location. This capability provides multiple tunnels (paths) between the two networks in an active-active configuration. If one of the tunnels is disconnected, the corresponding routes will be withdrawn via BGP, and the traffic automatically shifts to the remaining tunnels.

The following diagram shows a simple example of this highly available setup:

:::image type="content" source="./media/vpn-gateway-bgp-overview/multiple-active-tunnels.png" alt-text="Diagram showing multiple active paths." lightbox="./media/vpn-gateway-bgp-overview/multiple-active-tunnels.png":::

### <a name="transitrouting"></a>Support transit routing between your on-premises networks and multiple Azure VNets

BGP enables multiple gateways to learn and propagate prefixes from different networks, whether they're directly or indirectly connected. This can enable transit routing with Azure VPN gateways between your on-premises sites or across multiple Azure Virtual Networks.

The following diagram shows an example of a multi-hop topology with multiple paths that can transit traffic between the two on-premises networks through Azure VPN gateways within the Microsoft Networks:

:::image type="content" source="./media/vpn-gateway-bgp-overview/full-mesh-transit.png" alt-text="Diagram showing multi-hop transit." lightbox="./media/vpn-gateway-bgp-overview/full-mesh-transit.png":::

## <a name="faq"></a>BGP FAQ

See the VPN Gateway [BGP FAQ](vpn-gateway-vpn-faq.md#bgp) for frequently asked questions.

## Next steps

See [How to configure BGP for Azure VPN Gateway](bgp-howto.md) for steps to configure BGP for your cross-premises and VNet-to-VNet connections.