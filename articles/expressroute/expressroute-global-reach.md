---
title: 'About Azure ExpressRoute Global Reach'
description: Learn how Azure ExpressRoute Global Reach can link ExpressRoute circuits together to make a private network between your on-premises networks.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/29/2023
ms.author: duau
ms.custom: references_regions
---

# About ExpressRoute Global Reach

ExpressRoute is a private and resilient way to connect your on-premises networks to the Microsoft Cloud. You can access many Microsoft cloud services such as Azure and Microsoft 365 from your private data center or your corporate network. For example, you may have a branch office in San Francisco with an ExpressRoute circuit in Silicon Valley. You have a second branch office in London with an ExpressRoute circuit also in the same city. Both branch offices have high-speed connectivity to Azure resources in US West and UK South. However, the branch offices can't connect and send data directly with one another. In other words, 10.0.1.0/24 can send data to 10.0.3.0/24 and 10.0.4.0/24 network, but NOT to 10.0.2.0/24 network.

:::image type="content" source="./media/expressroute-global-reach/dual-circuit.png" alt-text="Diagram that shows circuits not linked together with ExpressRoute Global Reach.":::

With **ExpressRoute Global Reach**, you can link ExpressRoute circuits together to make a private network between your on-premises networks. In the above example, with the addition of ExpressRoute Global Reach, your San Francisco office (10.0.1.0/24) can directly exchange data with your London office (10.0.2.0/24) through the existing ExpressRoute circuits and via Microsoft's global network. 

:::image type="content" source="./media/expressroute-global-reach/global-reach.png" alt-text="Diagram that shows circuits linked together with ExpressRoute Global Reach.":::

## Use case

ExpressRoute Global Reach is designed to complement your service provider’s WAN implementation and connect your branch offices across the world. For example, if your service provider primarily operates in the United States and has linked all of your branches in the U.S., but the service provider doesn’t operate in Japan and Hong Kong Special Administrative Region, with ExpressRoute Global Reach you can work with a local service provider and Microsoft to connect your branches there to the ones in the U.S. using ExpressRoute and our global network.

:::image type="content" source="./media/expressroute-global-reach/global-reach-infrastructure.png" alt-text="Diagram that shows a use case for Express Route Global Reach.":::

## Availability

ExpressRoute Global Reach is supported in the following places. 

> [!NOTE] 
> To enable ExpressRoute Global Reach between [different geopolitical regions](expressroute-locations-providers.md#locations), your circuits must be **Premium SKU**.

* Australia
* Canada
* Denmark
* France
* Germany
* Hong Kong SAR
* India
* Ireland
* Japan
* Korea
* Netherlands
* New Zealand
* Norway
* Poland
* Singapore
* South Africa (Johannesburg only)
* Sweden
* Switzerland
* Taiwan
* United Kingdom
* United States

## Next steps

- View the [Global Reach FAQ](expressroute-faqs.md#globalreach).
- Learn how to [enable Global Reach](expressroute-howto-set-global-reach.md).
- Learn how to [link an ExpressRoute circuit to your virtual network](expressroute-howto-linkvnet-arm.md).
