---
title: 'Azure ExpressRoute: Prerequisites'
description: This page provides a list of requirements to be met before you can order an Azure ExpressRoute circuit. It includes a checklist.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# ExpressRoute prerequisites & checklist

To connect to Microsoft cloud services using ExpressRoute, ensure the following requirements are met:

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

## Azure account

* A valid and active Microsoft Azure account is required to set up the ExpressRoute circuit. ExpressRoute circuits are resources within Azure subscriptions. An Azure subscription is necessary even if connectivity is limited to non-Azure Microsoft cloud services, such as Microsoft 365.
* An active Microsoft 365 subscription is needed if using Microsoft 365 services. For more information, see the Microsoft 365 specific requirements section of this article.

## Connectivity provider

* Work with an [ExpressRoute connectivity partner](expressroute-locations.md#partners) to connect to the Microsoft cloud. You can set up a connection between your on-premises network and Microsoft in [three ways](expressroute-connectivity-models.md).
* If your provider isn't an ExpressRoute connectivity partner, you can still connect to the Microsoft cloud through a [cloud exchange provider](expressroute-locations.md#connectivity-through-exchange-providers).

## Network requirements

* **Redundancy at each peering location**: Microsoft requires redundant BGP sessions between Microsoft's routers and the peering routers on each ExpressRoute circuit, even with just [one physical connection to a cloud exchange](expressroute-faqs.md#onep2plink).
* **Redundancy for Disaster Recovery**: Microsoft strongly recommends setting up at least two ExpressRoute circuits in different peering locations to avoid a single point of failure.
* **Routing**: Depending on your connection method to the Microsoft Cloud, you or your provider needs to set up and manage the BGP sessions for [routing domains](expressroute-circuit-peerings.md). Some Ethernet connectivity providers or cloud exchange providers might offer BGP management as a value-added service.
* **NAT**: Microsoft only accepts public IP addresses through Microsoft peering. If using private IP addresses in your on-premises network, you or your provider needs to translate them to public IP addresses [using NAT](expressroute-nat.md).
* **QoS**: Skype for Business services (e.g., voice, video, text) requires differentiated QoS treatment. Follow the [QoS requirements](expressroute-qos.md) with your provider.
* **Network Security**: Consider [network security](/azure/cloud-adoption-framework/reference/networking-vdc) when connecting to the Microsoft Cloud via ExpressRoute.

## Microsoft 365 requirements

If you plan to use Microsoft 365 with ExpressRoute, review the following resources for detailed requirements and guidelines:

* [Azure ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute)
* [High availability and failover with ExpressRoute](./designing-for-high-availability-with-expressroute.md)
* [Microsoft 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges)
* [Network planning and performance tuning for Microsoft 365](/microsoft-365/enterprise/network-planning-and-performance)
* [Network and migration planning for Microsoft 365](/microsoft-365/enterprise/network-and-migration-planning)
* [Microsoft 365 integration with on-premises environments](/microsoft-365/enterprise/microsoft-365-integration)
* [Stay up to date with Office 365 IP Address changes](/microsoft-365/enterprise/microsoft-365-ip-web-service)

## Next steps

* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Find an ExpressRoute connectivity provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
* Review [Azure Well-architected Framework for ExpressRoute](/azure/well-architected/services/networking/azure-expressroute) to learn about best practices for designing and implementing ExpressRoute.
* Refer to requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md), and [QoS](expressroute-qos.md).
* Configure your ExpressRoute connection:
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
  * [Configure routing](expressroute-howto-routing-arm.md)
  * [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
