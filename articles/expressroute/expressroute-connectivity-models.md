---
title: 'Azure ExpressRoute: Connectivity models'
description: Review connectivity between the customer's network, Microsoft Azure, and Microsoft 365 services. Customers can use MPLS providers, cloud exchanges, and Ethernet.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 08/27/2026
ms.author: duau
---

# ExpressRoute connectivity models

You can connect your on-premises network to the Microsoft cloud in four ways: [CloudExchange Colocation](#CloudExchange), [Point-to-point Ethernet Connection](#Ethernet), [Any-to-any (IPVPN) Connection](#IPVPN), and [ExpressRoute Direct](#Direct). Connectivity providers might offer more than one connectivity model. Work with your connectivity provider to pick the model that works best for you.

Most ExpressRoute capabilities and features are the same across all connectivity models. FastPath is the exception. ExpressRoute Direct supports FastPath capabilities that provider circuits don't, including IPv6 FastPath, virtual network peering over FastPath, User-Defined Routes (UDRs) over FastPath, and Private Link and private endpoints. For per-model FastPath support, see [About ExpressRoute FastPath](about-fastpath.md).

:::image type="content" source="./media/expressroute-connectivity-models/expressroute-connectivity-models-diagram.png" alt-text="ExpressRoute connectivity model diagram":::

## <a name="CloudExchange"></a>Colocated at a cloud exchange

If you're colocated in a facility with a cloud exchange, you can request virtual cross-connections to the Microsoft cloud through the colocation provider’s Ethernet exchange. Colocation providers can offer either Layer 2 cross-connections, or managed Layer 3 cross-connections between your infrastructure in the colocation facility and the Microsoft cloud.

## <a name="Ethernet"></a>Point-to-point Ethernet connections

You can connect your on-premises datacenters or offices to the Microsoft cloud through point-to-point Ethernet links. Point-to-point Ethernet providers can offer Layer 2 connections.

## <a name="IPVPN"></a>Any-to-any (IPVPN) networks

You can integrate your WAN with the Microsoft cloud. IPVPN providers (typically MPLS VPN) offer any-to-any connectivity between your branch offices and datacenters. You can interconnect the Microsoft cloud with your WAN so it appears like any other branch office. WAN providers typically offer managed Layer 3 connectivity.

## <a name="Direct"></a>Direct from ExpressRoute sites

You can connect directly into the Microsoft global network at a peering location strategically distributed across the world. [ExpressRoute Direct](expressroute-erdirect-about.md) provides dual 10-Gbps, 100-Gbps, or 400-Gbps connectivity that supports active/active connectivity at scale.

## Related content
* Learn about ExpressRoute connections and routing domains. See [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* Learn about ExpressRoute features. See the [ExpressRoute Technical Overview](expressroute-introduction.md).
* Find a service provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* See the requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md), and [QoS](expressroute-qos.md).
* Configure your ExpressRoute connection.
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md)
  * [Configure routing](expressroute-howto-routing-portal-resource-manager.md)
  * [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
