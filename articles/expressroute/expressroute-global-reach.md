---
title: 'About Azure ExpressRoute Global Reach'
description: Learn how Azure ExpressRoute Global Reach can link ExpressRoute circuits together to make a private network between your on-premises networks.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
ms.custom: references_regions
---

# About ExpressRoute Global Reach

ExpressRoute provides a private and resilient connection between your on-premises networks and the Microsoft Cloud, allowing access to services like Azure and Microsoft 365 from your data center or corporate network. For instance, you might have a branch office in San Francisco with an ExpressRoute circuit in Silicon Valley, and another branch office in London with an ExpressRoute circuit there. Both offices can connect to Azure resources in US West and UK South, but they can't directly communicate with each other. For example, the 10.0.1.0/24 network can send data to the 10.0.3.0/24 and 10.0.4.0/24 networks, but not to the 10.0.2.0/24 network.

:::image type="content" source="./media/expressroute-global-reach/dual-circuit.png" alt-text="Diagram showing circuits not linked together with ExpressRoute Global Reach.":::

With **ExpressRoute Global Reach**, you can link ExpressRoute circuits to create a private network between your on-premises networks. In the previous example, with ExpressRoute Global Reach, your San Francisco office (10.0.1.0/24) can directly exchange data with your London office (10.0.2.0/24) through the existing ExpressRoute circuits and Microsoft's global network.

:::image type="content" source="./media/expressroute-global-reach/global-reach.png" alt-text="Diagram showing circuits linked together with ExpressRoute Global Reach.":::

## Use case

ExpressRoute Global Reach complements your service provider’s WAN implementation by connecting your branch offices worldwide. For example, if your service provider operates primarily in the United States and connects all your U.S. branches, but doesn't operate in Japan and Hong Kong SAR, you can use ExpressRoute Global Reach to work with a local service provider and Microsoft to connect your branches in Japan and Hong Kong SAR to branches in the U.S. using ExpressRoute and Microsoft's global network.

:::image type="content" source="./media/expressroute-global-reach/global-reach-infrastructure.png" alt-text="Diagram that shows a use case for Express Route Global Reach.":::

## Availability

ExpressRoute Global Reach is available in the following locations:

> [!NOTE]
> To enable ExpressRoute Global Reach between [different geopolitical regions](expressroute-locations-providers.md#locations), your circuits must be **Premium SKU**.

- Australia
- Canada
- Denmark
- France
- Germany
- Hong Kong SAR
- India
- Ireland
- Japan
- Korea
- Netherlands
- New Zealand
- Norway
- Poland
- Singapore
- South Africa (Johannesburg only)
- Sweden
- Switzerland
- Taiwan
- United Kingdom
- United States

## Next steps

- View the [Global Reach FAQ](expressroute-faqs.md#globalreach).
- Learn how to [enable Global Reach](expressroute-howto-set-global-reach.md).
- Learn how to [link an ExpressRoute circuit to your virtual network](expressroute-howto-linkvnet-arm.md).
