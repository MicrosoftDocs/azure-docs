---
title: About ExpressRoute Metro (preview)
description: This article provides an overview of ExpressRoute Metro and how it works.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/03/2024
ms.author: duau
ms.custom: references_regions, ai-usage
---

# About ExpressRoute Metro (preview)

> [!IMPORTANT]
> ExpresRoute Metro is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

ExpressRoute facilitates the creation of private connections between your on-premises networks and Azure workloads in a designated peering locations. These locations are colocation facilities housing Microsoft Enterprise Edge (MSEE) devices, serving as the gateway to Microsoft's network.

Within the peering location, two types of connections can be established:

* **ExpressRoute circuit** - an ExpressRoute circuit consist of two logical connections between your on-premises network and Azure. These connections are made through a pair of physical links provided by an ExpressRoute partner, such as AT&T, Verizon, Equinix, among others.

* **ExpressRoute Direct** - ExpressRoute Direct is a dedicated and private connection between your on-premises network and Azure, eliminating the need for partner provider involvement. It enables the direct connection of your routers to the Microsoft global network using dual 10G or 100G Ports.

The standard ExpressRoute configuration is set up with a pair of links to enhance the reliability of your ExpressRoute connection. This setup is designed to provide redundancy and improves the availability of your ExpressRoute connections during hardware failures, maintenance events, or other unforeseen incidents within the peering locations. However, you should note that these redundant connections don't provide resilience against certain events. These events could disrupt or isolate the edge location where the MSEE devices are located. Such disruptions could potentially lead to a complete loss of connectivity from your on-premises networks to your cloud services.

## ExpressRoute Metro

ExpressRoute Metro (preview) is a high-resiliency configuration designed to provide multi-site redundancy. This configuration allows you to benefit from a dual-homed setup that facilitates diverse connections to two distinct ExpressRoute peering locations within a city. The high resiliency configuration benefits from the redundancy across the two peering locations to offer higher availability and resilience for your connectivity from your on-premises to resources in Azure.

Key features of ExpressRoute Metro include:

* Dual-homed connections to two distinct ExpressRoute peering locations within the same city.
* Increased availability and resiliency for your ExpressRoute circuits.
* Seamless connectivity from your on-premises environment to Azure resources through an ExpressRoute circuit with the assistance of a connectivity provider or with ExpressRoute Direct (Dual 10G or 100G ports)

The following diagram allows for a comparison between the standard ExpressRoute circuit and a ExpressRoute Metro circuit.

:::image type="content" source="./media/metro/standard-versus-metro.png" alt-text="Diagram of a standard ExpressRoute circuit and a ExpressRoute Metro circuit.":::

## ExpressRoute Metro locations

| Metro location | Peering locations | Location address | Zone | Local Azure Region | ER Direct | Service Provider |
|--|--|--|--|--|--|--|
| Amsterdam Metro | Amsterdam<br>Amsterdam2 | Equinix AM5<br>Digital Realty AMS8 | 1 | West Europe | &check; | Colt<sup>1</sup><br>Console Connect<sup>1</sup><br>Digital Realty<br>Equinix<sup>1</sup><br>euNetworks<br><br>Megaport<br> |
| Singapore Metro | Singapore<br>Singapore2 | Equinix SG1<br>Global Switch Tai Seng | 2 | Southeast Asia | &check; | Console Connect<sup>1</sup><br>Equinix<sup>1</sup><br>Megaport |
| Zurich Metro | Zurich<br>Zurich2 | Digital Realty ZUR2<br>Equinix ZH5 | 1 | Switzerland North | &check; | Colt<sup>1</sup><br>Digital Realty<sup>1</sup> |

<sup>1<sup> These service providers will be available in the future.

> [!NOTE]
> The naming convention for Metro sites will utilize `City` and `City2` to denote the two unique peering locations within the same metropolitan region. As an illustration, Amsterdam and Amsterdam2 are indicative of the two separate peering locations within the metropolitan area of Amsterdam. In the Azure portal, these locations will be referred to as `Amsterdam Metro`.

## Configure ExpressRoute Metro

### Create an ExpressRoute Metro circuit

You can create an ExpressRoute Metro circuit in the Azure portal in any of the three metropolitan areas. Within the portal, specify one of the Metro peering locations and the corresponding service provider supported in that location. For more information, see [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md?pivots=expressroute-preview).

:::image type="content" source="./media/metro/create-metro-circuit.png" alt-text="Screenshot of creating an ExpressRoute Metro circuit.":::

### Create a Metro ExpressRoute Direct

1. A Metro ExpressRoute Direct port can be created in the Azure portal. Within the portal, specify one of the Metro peering locations. For more information, see [Create an ExpressRoute Direct](how-to-expressroute-direct-portal.md).

    :::image type="content" source="./media/metro/create-metro-direct.png" alt-text="Screenshot of creating Metro ExpressRoute Direct ports.":::

1. One you provisioned the Metro ExpressRoute Direct ports, you can download the LOA (Letter of Authorization), obtain the Meet-Me-Room details, and extend your physical cross-connects.

    :::image type="content" source="./media/metro/generate-letter-of-authorization.png" alt-text="Screenshot of generating letter of authorization.":::

## Next steps

* Review [ExpressRoute partners and peering locations](expressroute-locations.md) to understand the available ExpressRoute partners and peering locations.
* Review [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/) to understand the costs associated with ExpressRoute.
* Review [Design architecture for ExpressRoute resiliency](design-architecture-for-resiliency.md) to understand the design considerations for ExpressRoute.
