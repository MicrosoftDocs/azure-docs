---
title: Routing preference
titleSuffix: Azure Route Server
description: Learn about Azure Route Server routing preference feature to change how the Route Server can learn routes.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 02/07/2025

#CustomerIntent: As an Azure administrator, I want learn about routing preference feature so that I know how to influence route selection in Azure Route Server.
---

# Routing preference

Azure Route Server enables dynamic routing between network virtual appliances (NVAs) and virtual networks (VNets). In addition to supporting third-party NVAs, Route Server also seamlessly integrates with ExpressRoute and VPN gateways. Route Server uses built-in route selection algorithms to make routing decisions to set connection preferences.

You can configure routing preference to influence how Route Server selects routes that it learned across site-to-site (S2S) VPN, ExpressRoute, and SD-WAN NVAs for the same on-premises destination route prefix. 

## Routing preference configuration

When Route Server has multiple routes to an on-premises destination prefix, Route Server selects the best route(s) in order of preference, as follows:

1. Prefer routes with the longest prefix match (LPM)
1. Prefer routes based on routing preference configuration:
    - **ExpressRoute**: (default setting): Prefer routes learned through ExpressRoute over routes learned through VPN/SD-WAN connections
    - **VPN/NVA**: Prefer routes learned through VPN/NVA connections over routes learned through ExpressRoute.
    > [!IMPORTANT]
    > Routing preference doesn't allow users to set preference between routes learned over VPN and NVA connections. If the same routes are learned over VPN and NVA connections, Route Server will prefer the route with the shortest BGP AS path.
    - **AS Path**: Prefer routes with the shortest BGP AS path length, irrespective of the source of the route advertisement.

## Next step

> [!div class="nextstepaction"]
> [Configure routing preference](configure-route-server.md#configure-routing-preference)
