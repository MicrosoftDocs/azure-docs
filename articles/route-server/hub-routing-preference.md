---
title: Routing preference (preview)
titleSuffix: Azure Route Server
description: Learn about Azure Route Server routing preference (preview) feature. 
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: concept-article
ms.date: 07/31/2023
---

# Routing preference (preview)

Azure Route Server enables dynamic routing between network virtual appliances (NVAs) and virtual networks (VNets). In addition to supporting third-party NVAs, Route Server also seamlessly integrates with ExpressRoute and VPN gateways. Route Server uses built-in route selection algorithms to make routing decisions to set connection preferences.

When **branch-to-branch** is enabled and Route Server learns multiple routes across site-to-site (S2S) VPN, ExpressRoute and SD-WAN NVAs, for the same on-premises destination route prefix, users can now configure connection preferences to influence Route Server route selection.

> [!IMPORTANT]
> Routing preference is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Routing preference configuration

When Route Server has multiple routes to an on-premises destination prefix, Route Server selects the best route(s) in order of preference, as follows:

1. Prefer routes with the longest prefix match (LPM)
1. Prefer routes based on routing preference configuration:
    - **ExpressRoute**: (default setting): Prefer routes learned through ExpressRoute over routes learned through VPN/SD-WAN connections
    - **VPN/NVA**: Prefer routes learned through VPN/NVA connections over routes learned through ExpressRoute.
    > [!IMPORTANT]
    > Routing preference doesn't allow users to set preference between routes learned over VPN and NVA connections. If the same routes are learned over VPN and NVA connections, Route Server will prefer the route with the shortest BGP AS-PATH.
    - **AS-Path**: Prefer routes with the shortest BGP AS-PATH length, irrespective of the source of the route advertisement.

## Next steps

- Learn how to [configure routing preference](hub-routing-preference-powershell.md)
- Learn how to [create and configure Azure Route Server](quickstart-configure-route-server-portal.md).
- Learn how to [monitor Azure Route Server](monitor-route-server.md).
