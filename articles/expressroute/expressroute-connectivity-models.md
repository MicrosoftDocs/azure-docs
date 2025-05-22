---
title: 'Azure ExpressRoute: Connectivity models'
description: Review connectivity between the customer's network, Microsoft Azure, and Microsoft 365 services. Customers can use MPLS providers, cloud exchanges, and Ethernet.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# ExpressRoute connectivity models

ExpressRoute allows you to create a connection between your on-premises network and the Microsoft cloud in four different ways, [CloudExchange Colocation](#CloudExchange), [Point-to-point Ethernet Connection](#Ethernet), [Any-to-any (IPVPN) Connection](#IPVPN), and [ExpressRoute Direct](#Direct). Connectivity providers might offer more than one connectivity models. You can work with your connectivity provider to pick the model that works best for you.
<br><br>

:::image type="content" source="./media/expressroute-connectivity-models/expressroute-connectivity-models-diagram.png" alt-text="ExpressRoute connectivity model diagram":::

## <a name="CloudExchange"></a>Colocated at a cloud exchange

If you're colocated in a facility with a cloud exchange, you can request for virtual cross-connections to the Microsoft cloud through the colocation provider’s Ethernet exchange. Colocation providers can offer either Layer 2 cross-connections, or managed Layer 3 cross-connections between your infrastructure in the colocation facility and the Microsoft cloud.

## <a name="Ethernet"></a>Point-to-point Ethernet connections

You can connect your on-premises datacenters or offices to the Microsoft cloud through point-to-point Ethernet links. Point-to-point Ethernet providers can offer Layer 2 connections.

## <a name="IPVPN"></a>Any-to-any (IPVPN) networks

You can integrate your WAN with the Microsoft cloud. IPVPN providers (typically MPLS VPN) offer any-to-any connectivity between your branch offices and datacenters. The Microsoft cloud can be interconnected to your WAN to make it appear like any other branch office. WAN providers typically offer managed Layer 3 connectivity. ExpressRoute capabilities and features are all identical across all of the connectivity models listed previously.

## <a name="Direct"></a>Direct from ExpressRoute sites

You can connect directly into the Microsoft global network at a peering location strategically distributed across the world. [ExpressRoute Direct](expressroute-erdirect-about.md) provides dual 100-Gbps or 10-Gbps connectivity that supports Active/Active connectivity at scale.

## Next steps
* Learn about ExpressRoute connections and routing domains. See [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* Learn about ExpressRoute features. See the [ExpressRoute Technical Overview](expressroute-introduction.md)
* Find a service provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* Refer to the requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md), and [QoS](expressroute-qos.md).
* Configure your ExpressRoute connection.
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md)
  * [Configure routing](expressroute-howto-routing-portal-resource-manager.md)
  * [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
