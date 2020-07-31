---
title: 'About Virtual WAN pricing'
titleSuffix: Azure Virtual WAN
description: This article describes common Virtual WAN pricing questions
services: virtual-wan
author: reyandap

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: reyandap
ms.custom: references_pricing

---
# About Virtual WAN pricing

Azure Virtual WAN brings multiple network and security services together in a unified framework. It is based on a hub and spoke architecture, where the hubs are Microsoft-managed with various services provided within the hub, such as VPN, ExpressRoute, User VPN (Point-to-site), Firewall, Routing, etc.

Each service in Virtual WAN is priced. Therefore, suggesting a single price is not applicable to Virtual WAN. The [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) provides a mechanism to derive the cost, which is based on the services provisioned in a Virtual WAN. This article discusses commonly asked questions about Virtual WAN pricing.

>[!NOTE]
>For current pricing information, see [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).
>

## <a name="questions"></a>Common pricing questions

### <a name="scale-unit"></a>What is a scale unit?

A **scale unit** provides the unit for aggregate capacity of Site-to-site (S2S), Point-to-site (P2S), and ExpressRoute (ER) in a virtual hub. For example:

* **1 S2S VPN scale unit** implies a total capacity of 500 Mbps VPN gateway (dual instances are deployed for resiliency) in a virtual hub costing $0.361/hour.
* **1 ER scale unit** implies a total of 2 Gbps ER gateway in virtual hub costing $0.42/hr.
* **5 ER scale units** would imply a total of 10 Gbps ER gateway inside a virtual hub VNet priced at $0.42*5/hr. ER increments $0.25/hr from the 6th to 10th scale unit.

### <a name="connection-unit"></a>What is a connection unit?

A **connection unit** applies to any on-premises/non-Microsoft endpoint connecting to Azure gateways. For Site-to-site VPN, this implies branches. For User VPN (Point-to-site), this implies remote users. For ExpressRoute, this implies ExpressRoute circuit connections.<br>For example:

* One branch connection connecting to Azure VPN in a virtual hub costs $0.05/hr. Therefore 100 branch connections connecting to an Azure virtual hub would cost $0.05*100/hr.

* Two ExpressRoute circuit connections connecting to a virtual hub would cost $0.05*2/hr.

* Three remote user connections connecting to the Azure virtual hub P2S gateway would cost $0.03*3/hr.

### <a name="data-transfer"></a>How are data transfer charges calculated?

* Any traffic entering Azure is not charged. Traffic leaving Azure (via VPN, ExpressRoute, or Point-to-site User VPN connections) is subject to the standard [Azure data transfer charges](https://azure.microsoft.com/pricing/details/bandwidth/).

* For data transfer charges between a Virtual WAN  hub, and a remote Virtual WAN hub or VNet in a different region than the source hub, data transfer charges apply for traffic leaving a hub. Example: Traffic leaving an East US hub will be charged $0.02/GB going to a West US hub. There is no charge for traffic entering the West US hub. The following tables show the charges.

The tables below use the following abbreviations:
{NAM: North America}, {EU: Europe}, {MEA: Middle East Africa}, {OC: Oceania (Australia Central and Australia Central 2)}, {LATAM: Latin America} 

**Intra-Continent pricing(*)**

| Intra-Continent| Price ($/GB)|
|---|---|
| NAM to NAM|$0.02 |
| EU to EU |$0.02 |
| ASIA-ASIA (Excluding China)|$0.10 |
| MEA to MEA|$0.16 |
| LATAM-LATAM |$0.16 |
| OC-OC|$0.12 |

**Inter-Continental pricing(*)**

| Inter-Continental| Price ($/GB)|
|---|---|
| FROM NAM to EU or EU to NAM |$0.07 |
| FROM LATAM to anywhere |$0.17 |
| FROM MEA to anywhere |$0.17 |
| FROM OCEANIA to anywhere |$0.12 |
| FROM ASIA (except CHINA) to anywhere |$0.12 |

(*) Some charges may apply starting August 1, 2020.

### <a name="fee"></a>What is the difference between a Standard hub fee and a Standard hub processing fee?

Virtual WAN comes in two flavors:

* A **Basic virtual WAN**, where users can deploy multiple hubs and enjoy VPN Site-to-site connectivity. A Basic virtual WAN does not have advanced capabilities such as fully meshed hubs, ExpressRoute connectivity, User VPN/Point-to-site VPN connectivity, VNet-to-VNet transitive connectivity, VPN and ExpressRoute transit connectivity, or Azure Firewall, etc. There is no base fee or data processing fee for hubs in a Basic virtual WAN.

* A **Standard virtual WAN** provides advanced capabilities, such as fully meshed hubs, ExpressRoute connectivity, User VPN/Point-to-site VPN connectivity, VNet-to-VNet transitive connectivity, VPN and ExpressRoute transit connectivity, Azure Firewall, etc. All of the virtual hub routing is provided by a router that enables multiple services in a virtual hub. There is a base fee for the hub, which is priced at $0.25/hr. There is also a charge for data processing in the virtual hub router for VNet-to-VNet transit connectivity. See the following figure.

 In the **Example** figure below, there are two VNets, VNET 1 and VNET 2. Let's assume there is 1 Gbps data being sent from a VM in VNET 1 to another VM in VNET 2. The following charges apply:

* Virtual Hub base fee $0.25/hr

* Virtual hub data processing fee of $0.02/GB for 1 Gbps

**Example**

   :::image type="content" source="./media/pricing-concepts/figure-1.png" alt-text="Example":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).

* For current pricing, see [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).
