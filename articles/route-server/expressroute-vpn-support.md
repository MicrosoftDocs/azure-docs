---
title: Support for ExpressRoute and Azure VPN
titleSuffix: Azure Route Server
description: Learn about how Azure Route Server exchanges routes between network virtual appliances (NVA), Azure ExpressRoute gateways, and Azure VPN gateways.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: concept-article
ms.date: 08/15/2023
---

# Azure Route Server support for ExpressRoute and Azure VPN

Azure Route Server supports not only third-party network virtual appliances (NVA) running on Azure but also seamlessly integrates with ExpressRoute and Azure VPN gateways. You don’t need to configure or manage the BGP peering between the gateway and Azure Route Server. You can enable route exchange between the gateways and Azure Route Server by enabling [branch-to-branch](quickstart-configure-route-server-portal.md#configure-route-exchange) in Azure portal. If you prefer, you can use [Azure PowerShell](quickstart-configure-route-server-powershell.md#route-exchange) or [Azure CLI](quickstart-configure-route-server-cli.md#configure-route-exchange) to enable the route exchange with the Route Server.

[!INCLUDE [downtime note](../../includes/route-server-note-vng-downtime.md)]

## How does it work?

When you deploy an Azure Route Server along with a virtual network gateway and an NVA in a virtual network, by default Azure Route Server doesn’t propagate the routes it receives from the NVA and virtual network gateway between each other. Once you enable **branch-to-branch** in Route Server, the virtual network gateway and the NVA exchange their routes.

For example, in the following diagram:

* The SDWAN appliance receives from Azure Route Server the route of *On-premises 2*, which is connected to ExpressRoute circuit, along with the route of the virtual network.

* The ExpressRoute gateway receives from Azure Route Server the route of *On-premises 1*, which is connected to the SDWAN appliance, along with the route of the virtual network.

:::image type="content" source="./media/expressroute-vpn-support/expressroute-with-route-server.png" alt-text="Diagram showing ExpressRoute gateway and SDWAN NVA exchanging routes through Azure Route Server.":::

You can also replace the SDWAN appliance with Azure VPN gateway. Since Azure VPN and ExpressRoute gateways are fully managed, you only need to enable the route exchange for the two on-premises networks to talk to each other.

If you enable BGP on the VPN gateway, the gateway learns *On-premises 1* routes dynamically over BGP. For more information, see [How to configure BGP for Azure VPN Gateway](../vpn-gateway/bgp-howto.md). If you don’t enable BGP on the VPN gateway, the gateway learns *On-premises 1* routes that are defined in the local network gateway of *On-premises 1*. For more information, see [Create a local network gateway](../vpn-gateway/tutorial-site-to-site-portal.md#LocalNetworkGateway). Whether you enable BGP on the VPN gateway or not, the gateway advertises the routes it learns to the Route Server if route exchange is enabled. For more information, see [Configure route exchange](quickstart-configure-route-server-portal.md#configure-route-exchange).

> [!IMPORTANT] 
> Azure VPN gateway must be configured in [**active-active**](../vpn-gateway/vpn-gateway-activeactive-rm-powershell.md) mode and have the ASN set to 65515. It's not a requirement to have BGP enabled on the VPN gateway to communicate with the Route Server.

:::image type="content" source="./media/expressroute-vpn-support/expressroute-and-vpn-with-route-server.png" alt-text="Diagram showing ExpressRoute and VPN gateways exchanging routes through Azure Route Server.":::

> [!NOTE] 
> When the same route is learned over ExpressRoute, Azure VPN or an SDWAN appliance, the ExpressRoute network will be preferred.

## Next steps

- Learn more about [Azure Route Server](route-server-faq.md).
- Learn how to [configure Azure Route Server](quickstart-configure-route-server-powershell.md).
- Learn more about [Azure ExpressRoute and Azure VPN coexistence](../expressroute/how-to-configure-coexisting-gateway-portal.md).
