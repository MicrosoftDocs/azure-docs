---
title: Azure Route Server support for ExpressRoute and Azure VPN
titleSuffix: Azure Route Server
description: Learn how Azure Route Server enables route exchange between network virtual appliances, Azure ExpressRoute gateways, and Azure VPN gateways to create integrated hybrid network topologies.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2025
ms.custom: sfi-image-nochange


#CustomerIntent: As an Azure administrator, I want to understand how Azure Route Server integrates with ExpressRoute and Azure VPN so that I can enable route exchange between on-premises networks and network virtual appliances.
---

# Azure Route Server support for ExpressRoute and Azure VPN

Azure Route Server seamlessly integrates with Azure ExpressRoute and Azure VPN gateways, enabling dynamic route exchange between these gateways and network virtual appliances (NVAs). This integration allows you to create sophisticated hybrid network topologies where on-premises networks connected through different connectivity methods can communicate with each other and with NVAs in Azure.

This article explains how Azure Route Server works with ExpressRoute and VPN gateways, the configuration requirements, and key considerations for implementing these integrated scenarios.

## Integration overview

Azure Route Server provides automated Border Gateway Protocol (BGP) peering with virtual network gateways, eliminating the need for manual BGP configuration. When you enable route exchange (also known as "branch-to-branch" connectivity), Azure Route Server facilitates route sharing between:

- Network virtual appliances and ExpressRoute gateways
- Network virtual appliances and VPN gateways  
- ExpressRoute gateways and VPN gateways (when both are present)

You can enable route exchange using the [Azure portal](configure-route-server.md?tabs=portal#configure-route-exchange-with-virtual-network-gateways), [Azure PowerShell](configure-route-server.md?tabs=powershell#configure-route-exchange-with-virtual-network-gateways), or [Azure CLI](configure-route-server.md?tabs=cli#configure-route-exchange-with-virtual-network-gateways).

[!INCLUDE [downtime note](../../includes/route-server-note-vng-downtime.md)]

## How route exchange works

When you deploy Azure Route Server in a virtual network alongside virtual network gateways and NVAs, route exchange enables these components to share routing information dynamically.

### Default behavior

By default, Azure Route Server doesn't propagate routes between different types of network components. Each component (NVA, ExpressRoute gateway, VPN gateway) only exchanges routes directly with the route server.

### With route exchange enabled

When you enable route exchange ("branch-to-branch" connectivity), Azure Route Server acts as a route reflector, allowing:

- **Network virtual appliances** to learn routes from virtual network gateways
- **Virtual network gateways** to learn routes from network virtual appliances
- **Different gateway types** to exchange routes with each other

> [!IMPORTANT] 
> ExpressRoute circuit-to-circuit connectivity isn't supported through Azure Route Server. Routes from one ExpressRoute circuit aren't advertised to another ExpressRoute circuit connected to the same virtual network gateway. For ExpressRoute-to-ExpressRoute connectivity, consider using [ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md).

### Route exchange scenarios

#### ExpressRoute and network virtual appliance integration

The following diagram shows how an SD-WAN appliance and ExpressRoute gateway exchange routes through Azure Route Server:

:::image type="content" source="./media/expressroute-vpn-support/expressroute-with-route-server.png" alt-text="Diagram showing ExpressRoute gateway and SD-WAN network virtual appliance exchanging routes through Azure Route Server for hybrid connectivity.":::

In this scenario:
- The **SD-WAN appliance** receives routes to *On-premises 2* (connected through ExpressRoute) and virtual network routes from Azure Route Server
- The **ExpressRoute gateway** receives routes to *On-premises 1* (connected through SD-WAN) and virtual network routes from Azure Route Server
- This enables connectivity between the two on-premises locations through Azure

#### ExpressRoute and VPN gateway integration

You can replace the SD-WAN appliance with an Azure VPN gateway to create a fully managed solution. Both Azure VPN and ExpressRoute gateways are fully managed services, so you only need to enable route exchange to establish connectivity between the on-premises networks.

:::image type="content" source="./media/expressroute-vpn-support/expressroute-and-vpn-with-route-server.png" alt-text="Diagram showing ExpressRoute and VPN gateways exchanging routes through Azure Route Server for hybrid connectivity between different on-premises locations.":::

### VPN gateway configuration considerations

For Azure VPN gateways, route learning behavior depends on your BGP configuration:
For Azure VPN gateways, route learning behavior depends on your BGP configuration. BGP-enabled VPN gateways learn on-premises routes dynamically through BGP, provide automatic route updates when network topology changes, and offer enhanced failover and redundancy capabilities. For configuration guidance on BGP-enabled gateways, see [Configure BGP for Azure VPN Gateway](../vpn-gateway/bgp-howto.md). In contrast, VPN gateways without BGP learn routes from local network gateway definitions, require static route configuration for on-premises networks, and need manual updates when topology changes occur. For configuration guidance on non-BGP gateways, see [Create a local network gateway](../vpn-gateway/tutorial-site-to-site-portal.md#LocalNetworkGateway).

Regardless of BGP configuration, VPN gateways advertise learned routes to Azure Route Server when route exchange is enabled.

[!INCLUDE [active-active vpn gateway](../../includes/route-server-note-vpn-gateway.md)]

## Configuration requirements

To configure route exchange, you must have Azure Route Server deployed in the target virtual network. The virtual network should also contain virtual network gateways such as ExpressRoute, VPN, or both types. If you plan to use network virtual appliances, ensure they're configured for BGP peering.

### Key considerations

All gateways must be deployed in the same virtual network as Azure Route Server. The route exchange configuration applies to all gateways within the virtual network. ExpressRoute routes take precedence over VPN routes by default, but you can configure routing preference to influence route selection when multiple paths exist to the same destination. When advertising routes from on-premises networks, avoid using the Azure reserved BGP community `65517:65517`.

## Troubleshooting

When troubleshooting route exchange issues, first verify that route exchange is enabled and BGP sessions are properly established. Use Azure Route Server diagnostics to check routing tables and monitor BGP session states and route advertisements for any anomalies.

## Next steps

- [Azure Route Server frequently asked questions](route-server-faq.md)
- [Configure Azure Route Server](configure-route-server.md)
- [Configure ExpressRoute and VPN coexistence](../expressroute/how-to-configure-coexisting-gateway-portal.md?toc=/azure/route-server/toc.json)
- [Learn about routing preference with Azure Route Server](hub-routing-preference.md)