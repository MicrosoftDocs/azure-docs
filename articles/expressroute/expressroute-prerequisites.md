---
title: 'Prerequisites - ExpressRoute : Azure | Microsoft Docs'
description: This page provides a list of requirements to be met before you can order an Azure ExpressRoute circuit. It includes a checklist.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: mialdrid
ms.custom: seodec18

---
# ExpressRoute prerequisites & checklist
To connect to Microsoft cloud services using ExpressRoute, you need to verify that the following requirements listed in the following sections have been met.

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

## Azure account
* A valid and active Microsoft Azure account. This account is required to set up the ExpressRoute circuit. ExpressRoute circuits are resources within Azure subscriptions. An Azure subscription is a requirement even if connectivity is limited to non-Azure Microsoft cloud services, such as Office 365 services and Dynamics 365.
* An active Office 365 subscription (if using Office 365 services). For more information, see the Office 365 specific requirements section of this article.

## Connectivity provider

* You can work with an [ExpressRoute connectivity partner](expressroute-locations.md#partners) to connect to the Microsoft cloud. You can set up a connection between your on-premises network and Microsoft in [three ways](expressroute-introduction.md).
* If your provider is not an ExpressRoute connectivity partner, you can still connect to the Microsoft cloud through a [cloud exchange provider](expressroute-locations.md#connectivity-through-exchange-providers).

## Network requirements
* **Redundancy at each peering location**: Microsoft requires redundant BGP sessions to be set up between Microsoft’s routers and the peering routers on each ExpressRoute circuit (even when you have just [one physical connection to a cloud exchange](expressroute-faqs.md#onep2plink)).
* **Redundancy for Disaster Recovery**: Microsoft strongly recommends you set up at least two ExpressRoute circuits in different peering locations to avoid a single point of failure.
* **Routing**: depending on how you connect to the Microsoft Cloud, you or your provider needs to set up and manage the BGP sessions for [routing domains](expressroute-circuit-peerings.md). Some Ethernet connectivity providers or cloud exchange providers may offer BGP management as a value-add service.
* **NAT**: Microsoft only accepts public IP addresses through Microsoft peering. If you are using private IP addresses in your on-premises network, you or your provider needs to translate the private IP addresses to the public IP addresses [using the NAT](expressroute-nat.md).
* **QoS**: Skype for Business has various services (for example; voice, video, text) that require differentiated QoS treatment. You and your provider should follow the [QoS requirements](expressroute-qos.md).
* **Network Security**: consider [network security](../best-practices-network-security.md) when connecting to the Microsoft Cloud via ExpressRoute.

## Office 365
If you plan to enable Office 365 on ExpressRoute, review the following documents for more information about Office 365 requirements.

* [Overview of ExpressRoute for Office 365](https://support.office.com/article/Azure-ExpressRoute-for-Office-365-6d2534a2-c19c-4a99-be5e-33a0cee5d3bd)
* [Routing with ExpressRoute for Office 365](https://support.office.com/article/Routing-with-ExpressRoute-for-Office-365-e1da26c6-2d39-4379-af6f-4da213218408)
* [High availability and failover with ExpressRoute](https://aka.ms/erhighavailability)
* [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2)
* [Network planning and performance tuning for Office 365](https://support.office.com/article/Network-planning-and-performance-tuning-for-Office-365-e5f1228c-da3c-4654-bf16-d163daee8848)
* [Network bandwidth calculators and tools](https://support.office.com/article/Network-and-migration-planning-for-Office-365-f5ee6c33-bcd7-4b0b-b0f8-dc1d9fb8d132)
* [Office 365 integration with on-premises environments](https://support.office.com/article/Office-365-integration-with-on-premises-environments-263faf8d-aa21-428b-aed3-2021837a4b65)
* [ExpressRoute on Office 365 advanced training videos](https://channel9.msdn.com/series/aer/)

## Dynamics 365
If you plan to enable Dynamics 365 on ExpressRoute, review the following documents for more information about Dynamics 365

* [Dynamics 365 and ExpressRoute whitepaper](https://download.microsoft.com/download/B/2/8/B2896B38-9832-417B-9836-9EF240C0A212/Microsoft%20Dynamics%20365%20and%20ExpressRoute.pdf)
* [Dynamics 365 URLs](https://support.microsoft.com/kb/2655102) and [IP address ranges](https://support.microsoft.com/kb/2728473)

## Next steps
* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Find an ExpressRoute connectivity provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
* Refer to requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md), and [QoS](expressroute-qos.md).
* Configure your ExpressRoute connection.
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
  * [Configure routing](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
