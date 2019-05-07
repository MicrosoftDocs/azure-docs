---
title: 'Connect on-premises networks to Microsoft Cloud using Global Reach - Azure ExpressRoute | Microsoft Docs'
description: This article explains ExpressRoute Global Reach.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: cherylmc
ms.custom: seodec18

---


# ExpressRoute Global Reach
ExpressRoute is a private and resilient way to connect your on-premises networks to Microsoft Cloud. You can access many Microsoft cloud services such as Azure, Office 365, and Dynamics 365 from your private data center or your corporate network. For example, you may have a branch office in San Francisco with an ExpressRoute circuit in Silicon Valley and another branch office in London with an ExpressRoute circuit in the same city. Both branch offices can have high speed connectivity to Azure resources in US West and UK South. However, the branch offices cannot exchange data directly with each other. In other words, 10.0.1.0/24 can send data to 10.0.3.0/24 and 10.0.4.0/24, but NOT to 10.0.2.0/24.

![without][1]

With **ExpressRoute Global Reach**, you can link ExpressRoute circuits together to make a private network between your on-premises networks. In the above example, with the addition of ExpressRoute Global Reach, your San Francisco office (10.0.1.0/24) can directly exchange data with your London office (10.0.2.0/24) through the existing ExpressRoute circuits and via Microsoft's global network. 

![with][2]

## Use case
ExpressRoute Global Reach is designed to complement your service provider’s WAN implementation and connect your branch offices across the world. For example, if your service provider primarily operates in the United States and has linked all of your branches in the U.S., but the service provider doesn’t operate in Japan and Hong Kong, with ExpressRoute Global Reach you can work with a local service provider and Microsoft will connect your branches there to the ones in the U.S. using ExpressRoute and our global network.

![use case][3]

## Availability 
ExpressRoute Global Reach currently is supported in the following places.

* Australia
* Canada
* France
* Germany
* Hong Kong SAR
* Ireland
* Japan
* Korea
* Netherlands
* Singapore
* Switzerland
* United Kingdom
* United States

Your ExpressRoute circuits must be created at the [ExpressRoute peering locations](expressroute-locations.md) in the above countries or region. To enable ExpressRoute Global Reach between [different geopolitical regions](expressroute-locations.md), your circuits must be Premium SKU.

## Next steps
1. [Learn more about ExpressRoute Global Reach](expressroute-faqs.md)
2. [How to enable ExpressRoute Global Reach](expressroute-howto-set-global-reach.md)
3. [Link ExpressRoute circuit to Azure virtual network](expressroute-howto-linkvnet-arm.md)


<!--Image References-->
[1]: ./media/expressroute-global-reach/1.png "diagram without global reach"
[2]: ./media/expressroute-global-reach/2.png "diagram with global reach"
[3]: ./media/expressroute-global-reach/3.png "use case of global reach"
