---
title: About ExpressRoute Metro
description: This article provides an overview of ExpressRoute Metro and how it works.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 05/10/2026
ms.author: duau
ms.custom:
  - references_regions
  - ai-usage
  - sfi-image-nochange
# Customer intent: As a network architect, I want to understand the features and benefits of ExpressRoute Metro, so that I can implement high-resiliency connectivity solutions between our on-premises networks and Azure resources.
---

# About ExpressRoute Metro

ExpressRoute facilitates the creation of private connections between your on-premises networks and Azure workloads in a designated peering locations. These locations are colocation facilities housing Microsoft Enterprise Edge (MSEE) devices, serving as the gateway to Microsoft's network.

Within the peering location, two types of connections can be established:

* **ExpressRoute circuit** - an ExpressRoute circuit consist of two logical connections between your on-premises network and Azure. These connections are made through a pair of physical links provided by an ExpressRoute partner, such as AT&T, Verizon, Megaport, Equinix, among others.

* **ExpressRoute Direct** - ExpressRoute Direct is a dedicated and private connection between your on-premises network and Azure, eliminating the need for partner provider involvement. It enables the direct connection of your routers to the Microsoft global network using dual 10G or 100G Ports.

The standard ExpressRoute configuration is set up with a pair of links to enhance the reliability of your ExpressRoute connection. This setup is designed to provide redundancy and improves the availability of your ExpressRoute connections during hardware failures, maintenance events, or other unforeseen incidents within the peering locations. However, you should note that these redundant connections don't provide resilience against certain events. These events could disrupt or isolate the edge location where the MSEE devices are located. Such disruptions could potentially lead to a complete loss of connectivity from your on-premises networks to your cloud services.

## ExpressRoute Metro

ExpressRoute Metro is a high-resiliency configuration designed to provide multi-site redundancy. This configuration allows you to benefit from a dual-homed setup that facilitates diverse connections to two distinct ExpressRoute peering locations within a city. The high resiliency configuration benefits from the redundancy across the two peering locations to offer higher availability and resilience for your connectivity from your on-premises to resources in Azure.

Key features of ExpressRoute Metro include:

* Dual-homed connections to two distinct ExpressRoute peering locations within the same city.
* Increased availability and resiliency for your ExpressRoute circuits.
* Seamless connectivity from your on-premises environment to Azure resources through an ExpressRoute circuit with the assistance of a connectivity provider or with ExpressRoute Direct (Dual 10G or 100G ports)

The following diagram allows for a comparison between the standard ExpressRoute circuit and a ExpressRoute Metro circuit.

:::image type="content" source="./media/metro/standard-versus-metro.png" alt-text="Diagram of a standard ExpressRoute circuit and a ExpressRoute Metro circuit.":::

## ExpressRoute Metro locations
| Metro location | Location address | Zone | Local Azure Region | ER Direct | Service Provider |
|--|--|--|--|--|--|
| Amsterdam Metro | Equinix AM5<br>Digital Realty AMS8 | 1 | West Europe | &check; | Colt<br>DE-CIX<br>Digital Realty<br>Equinix<br>euNetworks<br>Eurofiber<br>Megaport<br>NL-IX<br>SURF<br>GTT<sup>1</sup> |
| Atlanta Metro | Equinix AT1<br>Digital Realty ATL14 | 1 | &cross; | &check; |  Equinix<br>Megaport<br>|
| Brussels Metro | Digital Realty BR4<br>LCL Brussels North | 1 | Belgium Central | &cross; | Belnet<br>Colt<br>Eurofiber<br>Megaport<sup>1</sup> |
| Chicago Metro | Equinix CH1<br>CoreSite CH1 | 1 | North Central US | &check; |  Crown Castle<br>Equinix<br>Megaport<br>CenturyLink Cloud Connect<sup>1</sup><br>Digital Realty<sup>1</sup><br>Zayo<sup>1</sup> |
| Copenhagen Metro | Digital Realty CPH1<br>Global Connect Copenhagen | 1 | Denmark East | &check; | GlobalConnect<sup>1</sup><br>Megaport |
| Dallas Metro | Equinix DA6 <br>Digital Realty DFW10 | 1 | &cross; | &check; | Megaport |
| Dublin Metro | Equinix DB3 <br>Digital Realty DUB02 | 1 | North Europe | &check; | Equinix<br>Megaport<br>Colt<sup>1</sup> |
| Hong Kong Metro | Equinix HK1<br>iAdvantage MEGA-i | 2 | East Asia | &check; | Megaport<sup>1</sup><br> |
| Frankfurt Metro |  Digital Realty FRA11<br>Equinix FR7 | 1 | Germany West Central | &check; | DE-CIX<br>Megaport<br>Colt<sup>1</sup><br>Equinix<br> |
| Jakarta Metro | NeutraDC HDC<br>NTT GDC | 2 | Indonesia Central | &check; | DCI Indonesia<br>Telin<sup>1</sup><br>XL Axiata<sup>1</sup> |
| Johannesburg Metro |  Teraco JT1<br>Africa DAta Centres JHB1ADC | 3 | South Africa North | &check; | Equinix<sup>1</sup><br>OpenAccessDC<sup>1</sup> |
| Madrid Metro | Equinix MD2<br>Digital Realty MAD1 | 1 | Spain Central | &check; | Colt<br>DE-CIX<br>Equinix<br>Megaport<br>1-IX.EU<sup>1</sup><br>Telefonica<sup>1</sup> |
| Melbourne Metro | NextDC MEL01<br>Equinix ME1/2 | 2 | Australia Southeast | &check; | Megaport<br>Internet Association of Australia<sup>1</sup> |
| Milan Metro | Irideos Milan<br>Data4Italy Milan | 1 | Italy North | &check; | Colt<br>Equinix<br>Megaport<br>Retelit<sup>1</sup><br>Telecom Italia Sparkle<sup>1</sup><br>Telia Carrier (Arelion)<sup>1</sup> |
| Mumbai Metro |  TATA LVSB<br>Nxtra Data | 2 | West India | &check; |  |
| New York Metro | Equinix NY5<br>165 Halsey Street | 1 | &cross; | &check; |  DE-CIX<br>Megaport |
| Paris Metro | Digital Realty PAR5<br>Equinix PA4  | 1 | France Central | &check; | Megaport |
| Phoenix Metro | EdgeConnex POR01 <br>PhoenixNAP | 1 | West US 3 | &check; | Megaport<sup>1</sup> |
| Oslo Metro |  DigiPlex Ulven <br>Bulk Data IX | 2 |  Norway East | &check; | GlobalConnect<br>Colt<sup>1</sup><br>Telenor Secure Cloud Connect<sup>1</sup> |
| Silicon Valley Metro | Equinix SV10<br>CoreSite SV7 | 1 | West US | &check; | Megaport<br>Equinix<sup>1</sup><br>Zayo<sup>1</sup> |
| Singapore Metro | Global Switch Tai Seng<br>Equinix SG1 | 2 | Southeast Asia | &check; | Colt<br>DE-CIX<br>Equinix<br>IX Reach<br>MegaPOP (Singtel)<br>Megaport<br>Singtel International |
| Stockholm Metro | Equinix SK1<br>Digital Realty STO6 | 1 | Sweden Central | &check; | Telia Carrier (Arelion)<br>GlobalConnect<sup>1</sup><br>Megaport<sup>1</sup> |
| Sydney Metro | Equinix SY2 <br>NextDC S1 | 2 | Australia East | &check; | Megaport |
| Taipei Metro | Chief Telecom<br>Chunghwa Telecom Co. Ltd | 2 | Taiwan North | &check; | Chunghwa Telecom<sup>1</sup> |
| Toronto Metro | Cologix TOR1<br>Allied King West | 1 | Canda Central | &check; | Megaport<sup>1</sup><br>Zayo<sup>1</sup> |
| Vienna Metro |  Digital Realty VIE1<br>NTT GDC | 1 | Austria East | &check; | A1 Telekom Austria<br>Colt<br>Next Layer GMBH<br>Telia Carrier (Arelion) |
| Zurich Metro |  Digital Realty ZUR2<br>Equinix ZH5 | 1 | Switzerland North | &check; | BICS<br>Colt<br>Digital Realty<br>Megaport<br>Swisscom<br>Equinix<sup>1</sup><br>Orange<sup>1</sup> |
| Washington DC Metro | Equinix DC6<br>CoreSite VA3 | 1 | East US<br/>East US 2 | &check; |  Equinix<br>Megaport<br>Zayo<sup>1</sup> |

<sup>1<sup> These service providers will be available in the future. While they are listed under the peering location, circuit creation is expected to fail until the providers become active.

> [!NOTE]
> The naming convention for Metro sites will utilize `City` and `City2` to denote the two unique peering locations within the same metropolitan region. As an illustration, Amsterdam and Amsterdam2 are indicative of the two separate peering locations within the metropolitan area of Amsterdam. In the Azure portal, these locations will be referred to as `Amsterdam Metro`.

## Configure ExpressRoute Metro

### Create an ExpressRoute Metro circuit

You can create an ExpressRoute Metro circuit in the Azure portal in any of the metropolitan areas. Within the portal, specify one of the Metro peering locations and the corresponding service provider supported in that location. For more information, see [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md?pivots=expressroute-preview).

:::image type="content" source="./media/metro/create-metro-circuit.png" alt-text="Screenshot of creating an ExpressRoute Metro circuit.":::

### Create a Metro ExpressRoute Direct

1. A Metro ExpressRoute Direct port can be created in the Azure portal. Within the portal, specify one of the Metro peering locations. For more information, see [Create an ExpressRoute Direct](how-to-expressroute-direct-portal.md).

    :::image type="content" source="./media/metro/create-metro-direct.png" alt-text="Screenshot of creating Metro ExpressRoute Direct ports.":::

1. One you provisioned the Metro ExpressRoute Direct ports, you can download the LOA (Letter of Authorization), obtain the Meet-Me-Room details, and extend your physical cross-connects.

## Migrate from an existing Expressroute circuit to a Metro circuit

If you want to migrate from an existing ExpressRoute circuit, create a new ExpressRoute Metro circuit. Then, follow the steps for [circuit migration](circuit-migration.md) to transition from the existing standard ExpressRoute circuit to the ExpressRoute Metro circuit.

## Next steps

* Review [ExpressRoute partners and peering locations](expressroute-locations.md) to understand the available ExpressRoute partners and peering locations.
* Review [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/) to understand the costs associated with ExpressRoute.
* Review [Design architecture for ExpressRoute resiliency](design-architecture-for-resiliency.md) to understand the design considerations for ExpressRoute.
