---
title: Routing preference
titleSuffix: Azure Route Server
description: Learn about Azure Route Server routing preference feature. 
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 03/28/2023
ms.custom: template-concept
---

# Azure Route Server routing preference

Azure Route Server enables dynamic routing between network virtual appliances (NVAs) and virtual networks (VNets). In addition to supporting third-party NVAs, Route Server also seamlessly integrates with ExpressRoute and VPN gateways. Route Server uses built-in route selection algorithms to make routing decisions to set connection preferences.

When **branch-to-branch** is enabled and Route Server learns multiple routes across site-to-site (S2S) VPN, ExpressRoute and SD-WAN NVAs, for the same on-premises destination route prefix, users can now configure connection preferences to influence Route Server route selection.

## Routing preference configuration

When Route Server has multiple routes to an on-premises destination prefix, Route Server selects the best route(s) in order of preference, as follows:

1. Prefer routes with the longest prefix match (LPM)
1. Prefer static routes over BGP routes
1. Prefer routes based on routing preference configuration:
    * **ExpressRoute**: (This is the default setting): Prefer routes learned through ExpressRoute over routes learned through VPN/SD-WAN connections
    * **VPN/SD-WAN**: Prefer routes learned through VPN/SD-WAN connections over routes learned through ExpressRoute.
    > [!IMPORTANT]
    > Routing preference doesn't allow users to set preference between routes learned over VPN and SD-WAN connections. If the same routes are learned over VPN and SD-WAN connections, Route Server will prefer the route with the shortest BGP AS-PATH.
    * **AS-Path**: Prefer routes with the shortest BGP AS-PATH length, irrespective of the source of the route advertisement. 

## Next steps

- Learn how to [configure Azure Route Server](quickstart-configure-route-server-portal.md).
- Learn how to [monitor Azure Route Server](monitor-route-server.md).