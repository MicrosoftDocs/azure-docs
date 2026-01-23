---
title: 'Using ExpressRoute for Microsoft PSTN Services'
description:  ExpressRoute circuits can be used for Microsoft PSTN service, Operator Connect.
author: tracsman
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 08/07/2025
ms.author: jonor
manager: tracsman
# Customer intent: "As a network administrator, I want to configure ExpressRoute Microsoft Peering for PSTN services, so that I can ensure reliable and high-quality voice connectivity for my organization’s communication needs."
---

# Using ExpressRoute for routing traffic to Microsoft PSTN services

An ExpressRoute circuit provides private connectivity to the Microsoft backbone network. ExpressRoute *Microsoft Peering* connects your on-premises networks with public Microsoft services. You can use Microsoft Peering to provide your voice infrastructure endpoints outside Azure with network connectivity to Microsoft PSTN services (in addition to other Microsoft services).

> [!TIP]
> ExpressRoute circuits can also be used for *Private Peering*, which allows you to connect to private endpoints of your IaaS deployment in Azure regions.

For more information about ExpressRoute, see the [Introduction to ExpressRoute][ExR-Intro] article.

You can use ExpressRoute Microsoft Peering to offer the following Microsoft PSTN services:

* Operator Connect (including Calling, Conferencing and Teams Phone Mobile offers)

> [!IMPORTANT]
> Encryption support is pending delivery for Express Route PSTN connectivity. 

In this article, you'll learn about why you might consider using ExpressRoute to connect to these Microsoft PSTN services.

## When to use ExpressRoute Microsoft Peering for Microsoft PSTN services

In certain scenarios, using ExpressRoute Microsoft Peering provides better quality for voice calling than using the internet for your traffic. Microsoft owns one of the largest global networks, and the Microsoft network is optimized to achieve the core objective of offering the best network performance. The Microsoft network uses "cold potato" routing, meaning traffic enters and exits as close as possible to client devices/customer networks to reduce network hops and provide optimal quality of service for voice traffic. The Microsoft network is designed with redundancy and is highly available. For more information about architecture optimization, see [How Microsoft builds its fast and reliable global network][MGN].

### For Communications Services Providers

We recommend Communications Services Providers use Microsoft Azure Peering Service Voice interconnect (also known as MAPSV or MAPS Voice) to connect their networks to the Microsoft network. To configure Peering Service Voice interconnection, follow [Internet peering for Peering Service Voice walkthrough](../internet-peering/walkthrough-communications-services-partner.md).

In some cases, using ExpressRoute Microsoft Peering might be preferable as it allows you to:

* Reuse existing ExpressRoute connectivity to your network instead of creating new Peering Service Voice connectivity.
* Avoid port scarcity at peering locations.
* Segregate your voice traffic on smaller circuits than the minimum 10-Gbps connections supported by Peering Service Voice interconnects.
* Make use of 802.1Q tagging.

Operator Connect providers must ensure the architecture used for network connectivity is compliant with the latest Microsoft Teams *Network Connectivity Specification*. This specification is made available to Operator Connect providers during onboarding.

## Configuring Microsoft Peering for use with Microsoft PSTN services

Multiple Microsoft services (including Microsoft PSTN services, Microsoft 365 services and some Azure PaaS offerings) can be connected via Microsoft Peering. With the use of a *Route Filter*, you can select which service prefixes you want Microsoft to advertise over Microsoft Peering to your on-premises network. To configure a suitable Route Filter for Microsoft PSTN services, follow [Configure route filters for Microsoft Peering][ExRRF], setting *Azure SIP Trunking* as an allowed service community. The community reference is Microsoft PSTN services 12076:5250.

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
