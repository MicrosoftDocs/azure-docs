---
title: Support for ExpressRoute and Azure VPN
titleSuffix: Azure Route Server
description: Learn about how Azure Route Server exchanges routes between network virtual appliances (NVA), Azure ExpressRoute gateways, and Azure VPN gateways.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2024

#CustomerIntent: As an Azure administrator, I want to deploy Azure Route Server with ExpressRoute and Azure VPN so that routes can be exchanged between the two on-premises networks.
---

# Azure Route Server support for ExpressRoute and Azure VPN

Azure Route Server supports not only third-party network virtual appliances (NVA) in Azure but also seamlessly integrates with ExpressRoute and Azure VPN gateways. You don’t need to configure or manage the BGP peering between the gateway and Azure Route Server. You can enable route exchange between the gateways and Azure Route Server by enabling [branch-to-branch](configure-route-server.md?tabs=portal#configure-route-exchange) in Azure portal. If you prefer, you can use [Azure PowerShell](configure-route-server.md?tabs=powershell#configure-route-exchange) or [Azure CLI](configure-route-server.md?tabs=cli#configure-route-exchange) to enable the route exchange with the Route Server.

[!INCLUDE [downtime note](../../includes/route-server-note-vng-downtime.md)]

## How does it work?

When you deploy an Azure Route Server along with a virtual network gateway and an NVA in a virtual network, by default Azure Route Server doesn’t propagate the routes it receives from the NVA and virtual network gateway between each other. Once you enable **branch-to-branch** in Route Server, the virtual network gateway and the NVA exchange their routes.

> [!IMPORTANT] 
> ExpressRoute branch-to-branch connectivity is not supported. If you have two (or more) ExpressRoute circuits connected to the same ExpressRoute virtual network gateway, routes from one circuit are not advertised to the other. If you want to enable on-premises to on-premises connectivity over ExpressRoute, consider configuring ExpressRoute Global Reach. For more information, see [About Azure ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md).

The following diagram shows an example of using Route Server to exchange routes between an ExpressRoute and SDWAN appliance:

- The SDWAN appliance receives from Azure Route Server the route of *On-premises 2*, which is connected to ExpressRoute circuit, along with the route of the virtual network.

- The ExpressRoute gateway receives from Azure Route Server the route of *On-premises 1*, which is connected to the SDWAN appliance, along with the route of the virtual network.

:::image type="content" source="./media/expressroute-vpn-support/expressroute-with-route-server.png" alt-text="Diagram showing ExpressRoute gateway and SDWAN NVA exchanging routes through Azure Route Server.":::

You can also replace the SDWAN appliance with Azure VPN gateway. Since Azure VPN and ExpressRoute gateways are fully managed, you only need to enable the route exchange for the two on-premises networks to talk to each other. The Azure VPN and ExpressRoute gateway must be deployed in the same virtual network as Route Server in order for BGP peering to be successfully established. 

If you enable BGP on the VPN gateway, the gateway learns *On-premises 1* routes dynamically over BGP. For more information, see [How to configure BGP for Azure VPN Gateway](../vpn-gateway/bgp-howto.md). If you don’t enable BGP on the VPN gateway, the gateway learns *On-premises 1* routes that are defined in the local network gateway of *On-premises 1*. For more information, see [Create a local network gateway](../vpn-gateway/tutorial-site-to-site-portal.md#LocalNetworkGateway). Whether you enable BGP on the VPN gateway or not, the gateway advertises the routes it learns to the Route Server if route exchange is enabled. For more information, see [Configure route exchange](configure-route-server.md?tabs=portal#configure-route-exchange).

[!INCLUDE [active-active vpn gateway](../../includes/route-server-note-vpn-gateway.md)]

:::image type="content" source="./media/expressroute-vpn-support/expressroute-and-vpn-with-route-server.png" alt-text="Diagram showing ExpressRoute and VPN gateways exchanging routes through Azure Route Server.":::

## Considerations
* When the same route is learned over ExpressRoute, Azure VPN or an SDWAN appliance, the ExpressRoute network will be preferred by default. You can configure routing preference to influence Route Server route selection. For more information, see [Routing preference](hub-routing-preference.md).
* If **branch-to-branch** is enabled and your on-premises advertises a route with Azure BGP community 65517:65517, then the ExpressRoute gateway will drop this route. 

## Related content

- [Azure Route Server frequently asked questions (FAQ)](route-server-faq.md).
- [Configure Azure Route Server](quickstart-configure-route-server-powershell.md).
- [Azure ExpressRoute and Azure VPN coexistence](../expressroute/how-to-configure-coexisting-gateway-portal.md?toc=/azure/route-server/toc.json).
