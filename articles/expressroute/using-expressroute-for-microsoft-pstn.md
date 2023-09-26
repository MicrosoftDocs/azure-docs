---
title: 'Using ExpressRoute for Microsoft PSTN Services'
description:  ExpressRoute circuits can be used for Microsoft PSTN services, including Operator Connect, Azure Communications Gateway, and Azure Communication Services Direct Routing.
author: nslack
ms.service: expressroute
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/06/2023
ms.author: nickslack

---

# Using ExpressRoute for routing traffic to Microsoft PSTN services

An ExpressRoute circuit provides private connectivity to the Microsoft backbone network. ExpressRoute *Microsoft Peering* connects your on-premises networks with public Microsoft services. You can use Microsoft Peering to provide your voice infrastructure endpoints outside Azure with network connectivity to Microsoft PSTN services (in addition to other Microsoft services).

> [!TIP]
> ExpressRoute circuits can also be used for *Private Peering*, which allows you to connect to private endpoints of your IaaS deployment in Azure regions.

For more information about ExpressRoute, see the [Introduction to ExpressRoute][ExR-Intro] article.

You can use ExpressRoute Microsoft Peering to connect to the following Microsoft PSTN services:

* Operator Connect (including Calling, Conferencing and Teams Phone Mobile offers)
* Azure Communications Gateway
* Azure Communication Services Direct Routing

> [!IMPORTANT]
> Operator Connect SIP Trunks do not support encryption when using ExpressRoute Microsoft Peering connectivity. 

In this article, you'll learn about why you might consider using ExpressRoute to connect to these Microsoft PSTN services.

## When to use ExpressRoute Microsoft Peering for Microsoft PSTN services

In certain scenarios, using ExpressRoute Microsoft Peering provides better quality for voice calling than using the internet for your traffic. Microsoft owns one of the largest global networks, and the Microsoft network is optimized to achieve the core objective of offering the best network performance. The Microsoft network uses "cold potato" routing, meaning traffic enters and exits as close as possible to client devices/customer networks to reduce network hops and provide optimal quality of service for voice traffic. The Microsoft network is designed with redundancy and is highly available. For more information about architecture optimization, see [How Microsoft builds its fast and reliable global network][MGN].

### For enterprises managing your own PSTN connectivity

If your PSTN traffic is concentrated in multiple global locations and each location has its own ExpressRoute connection, ExpressRoute Microsoft Peering could be suited to you. This architecture is common for users of Direct Routing who have deployed their own SBCs in sites with ExpressRoute connectivity.

### For Communications Services Providers

We recommend that Communications Services Providers use Peering Service Voice interconnect (sometimes also called MAPSV or MAPS Voice) to connect their networks to the Microsoft network. To configure Peering Service Voice interconnection, follow [Internet peering for Peering Service Voice walkthrough](../internet-peering/walkthrough-communications-services-partner.md).

In some cases, using ExpressRoute Microsoft Peering might be preferable as it allows you to:

* Reuse existing ExpressRoute connectivity to your network instead of creating new Peering Service Voice connectivity.
* Avoid port scarcity at peering locations.
* Segregate your voice traffic on smaller circuits than the minimum 10-Gbps connections supported by Peering Service Voice interconnects.
* Make use of 802.1Q tagging.

Operator Connect providers must ensure the architecture used for network connectivity is compliant with the latest Microsoft Teams *Network Connectivity Specification*. This specification is made available to Operator Connect providers during onboarding.

## Configuring Microsoft Peering for use with Microsoft PSTN services

Multiple Microsoft services (including Microsoft PSTN services, Microsoft 365 services and some Azure PaaS offerings) can be connected via Microsoft Peering. With the use of a *Route Filter*, you can select which service prefixes you want Microsoft to advertise over Microsoft Peering to your on-premises network. To configure a suitable Route Filter for Microsoft PSTN services, follow [Configure route filters for Microsoft Peering][ExRRF], setting *Azure SIP Trunking* as an allowed service community.

All Microsoft PSTN services supported for Microsoft Peering use the 52.120.0.0/15 subnet. The Azure SIP Trunking service community refers to this subnet.

> [!NOTE]
> You must connect to Microsoft cloud services only over public IP addresses that are owned by you or your connectivity provider and you must adhere to all the defined rules. For more information, see the [ExpressRoute prerequisites](./expressroute-prerequisites.md) page.

## Next steps

* [Create ExpressRoute Microsoft Peering][CreatePeering]

<!--Link References-->
[ExR-Intro]: ./expressroute-introduction.md
[CreatePeering]: ./expressroute-howto-routing-portal-resource-manager.md
[MGN]: https://azure.microsoft.com/blog/how-microsoft-builds-its-fast-and-reliable-global-network/
[ExRRF]: ./how-to-routefilter-portal.md