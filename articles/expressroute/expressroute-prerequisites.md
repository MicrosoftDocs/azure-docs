---
title: 'Azure ExpressRoute: Prerequisites'
description: This page provides a list of requirements to be met before you can order an Azure ExpressRoute circuit. It includes a checklist.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/15/2023
ms.author: duau
---

# ExpressRoute prerequisites & checklist

To connect to Microsoft cloud services using ExpressRoute, you need to verify that the following requirements listed in the following sections have been met.

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

## Azure account

* A valid and active Microsoft Azure account. This account is required to set up the ExpressRoute circuit. ExpressRoute circuits are resources within Azure subscriptions. An Azure subscription is a requirement even if connectivity is limited to non-Azure Microsoft cloud services, such as Microsoft 365.
* An active Microsoft 365 subscription (if using Microsoft 365 services). For more information, see the Microsoft 365 specific requirements section of this article.

## Connectivity provider

* You can work with an [ExpressRoute connectivity partner](expressroute-locations.md#partners) to connect to the Microsoft cloud. You can set up a connection between your on-premises network and Microsoft in [three ways](expressroute-introduction.md).
* If your provider isn't an ExpressRoute connectivity partner, you can still connect to the Microsoft cloud through a [cloud exchange provider](expressroute-locations.md#connectivity-through-exchange-providers).

## Network requirements

* **Redundancy at each peering location**: Microsoft requires redundant BGP sessions to be set up between Microsoft's routers and the peering routers on each ExpressRoute circuit (even when you have just [one physical connection to a cloud exchange](expressroute-faqs.md#onep2plink)).
* **Redundancy for Disaster Recovery**: Microsoft strongly recommends you set up at least two ExpressRoute circuits in different peering locations to avoid a single point of failure.
* **Routing**: depending on how you connect to the Microsoft Cloud, you or your provider needs to set up and manage the BGP sessions for [routing domains](expressroute-circuit-peerings.md). Some Ethernet connectivity providers or cloud exchange providers may offer BGP management as a value-add service.
* **NAT**: Microsoft only accepts public IP addresses through Microsoft peering. If you're using private IP addresses in your on-premises network, you or your provider needs to translate the private IP addresses to the public IP addresses [using the NAT](expressroute-nat.md).
* **QoS**: Skype for Business has various services (for example; voice, video, text) that require differentiated QoS treatment. You and your provider should follow the [QoS requirements](expressroute-qos.md).
* **Network Security**: consider [network security](/azure/cloud-adoption-framework/reference/networking-vdc) when connecting to the Microsoft Cloud via ExpressRoute.

## Microsoft 365

If you plan to enable Microsoft 365 on ExpressRoute, review the following documents for more information about Microsoft 365 requirements.

* [Azure ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute)
* [Routing with ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute)
* [High availability and failover with ExpressRoute](./designing-for-high-availability-with-expressroute.md)
* [Microsoft 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges)
* [Network planning and performance tuning for Microsoft 365](/microsoft-365/enterprise/network-planning-and-performance)
* [Network and migration planning for Microsoft 365](/microsoft-365/enterprise/network-and-migration-planning)
* [Microsoft 365 integration with on-premises environments](/microsoft-365/enterprise/microsoft-365-integration)
* [Stay up to date with Office 365 IP Address changes](/microsoft-365/enterprise/microsoft-365-ip-web-service)
* ExpressRoute on Office 365 advanced training videos

## Next steps

* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Find an ExpressRoute connectivity provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
* Review [Azure Well-architected Framework for ExpressRoute](/azure/well-architected/services/networking/azure-expressroute) to learn about best practices for designing and implementing ExpressRoute.
* Refer to requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md), and [QoS](expressroute-qos.md).
* Configure your ExpressRoute connection.
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
  * [Configure routing](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)