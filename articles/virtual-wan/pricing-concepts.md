---
title: 'About Virtual WAN pricing'
titleSuffix: Azure Virtual WAN
description: This article answers common Virtual WAN pricing questions.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/28/2023
ms.author: cherylmc
ms.custom: references_pricing

---

# About Virtual WAN pricing

Azure Virtual WAN is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface. These functionalities include branch connectivity (via connectivity automation from Virtual WAN Partner devices such as SD-WAN or VPN CPE), Site-to-site VPN connectivity, remote user VPN (Point-to-site) connectivity, private (ExpressRoute) connectivity, intra-cloud connectivity (transitive connectivity for virtual networks), VPN ExpressRoute inter-connectivity, routing, Azure Firewall, and encryption for private connectivity.

This article discusses three commonly deployed scenarios with Azure Virtual WAN and typical price estimates for the deployments based on the listed prices. Additionally, there can be many other scenarios where Virtual WAN may be useful.

> [!IMPORTANT]
> The pricing shown in this article is intended to be used for example purposes only.
>
>   * Pricing can change at any point. For current pricing information, see the [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.
>   * Inter-hub (hub-to-hub) charges do not show in the Virtual WAN pricing page because pricing is subject to Inter-Region (Intra/Inter-continental) charges. For more information, see [Azure data transfer charges](https://azure.microsoft.com/pricing/details/bandwidth/).
>   * For virtual hub routing infrastructure unit pricing, see the [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.
>

## <a name="pricing"></a>Pricing components

The following diagram shows the typical data routes in a network involving Virtual WAN, and the different components of pricing per hour and per GB.

:::image type="content" source="./media/pricing-concepts/data-routes.png" alt-text="Diagram of data routes." lightbox="./media/pricing-concepts/data-routes.png":::

| Value | Scenario| Hourly cost | Per GB cost |
| --- | --- | --- | --- |
| 1 | Data transfer from a spoke VNet to a VPN Site-to-Site branch via Standard vWAN hub in East US|Deployment hour ($0.25/hr) + VPN S2S Scale Unit ($0.261/hr) + VPN S2S Connection Unit ($0.05/hr) = $0.561/hr|VNet peering (outbound) ($0.01/GB) + Standard Outbound Zone 1 ($0.087/GB) = $0.097/GB|
| 1'|Data transfer from a VPN Site-to-Site branch to a spoke VNet via Standard vWAN hub in East US|Deployment hour ($0.25/hr) + VPN S2S Scale Unit ($0.261/hr) + VPN S2S Connection Unit ($0.05/hr) = $0.561/hr|VNet peering (inbound) ($0.01/GB) = $0.01/GB|
|2|Data transfer from a VPN Site-to-Site branch via Standard vWAN hub to another VPN Site-to-Site branch in East US|Deployment hour ($0.25/hr) + VPN S2S Scale Unit ($0.261/hr) + VPN S2S Connection Unit (2x$0.05/hr) = $0.611/hr|Standard Outbound Zone 1 ($0.087/GB) = $0.087/GB|
|2'|Data transfer from a VPN Site-to-Site branch via Standard vWAN hub to ExpressRoute connected Data Center/ HQ in East US|Deployment hour ($0.25/hr) + VPN S2S Scale Unit ($0.261/hr) + VPN S2S Connection Unit ($0.05/hr) + ExpressRoute Scale Unit ($0.42/hr) + ExpressRoute Connection Unit ($0.05/hr) = $1.03/hr|ExpressRoute Metered Outbound Zone 1 ($0.025/GB) = $0.025/GB|
|3|Data transfer from a VPN Site-to-Site branch via Standard vWAN hub to ExpressRoute connected Data Center/ HQ in East US|Deployment hour ($0.25/hr) + VPN S2S Scale Unit ($0.261/hr) + VPN S2S Connection Unit ($0.05/hr) + ExpressRoute Scale Unit ($0.42/hr) + ExpressRoute Connection Unit ($0.05/hr) = $1.03/hr|ExpressRoute Metered Outbound Zone 1 ($0.025/GB) = $0.025/GB|
|4|Data transfer from a spoke VNet to ExpressRoute connected Data Center/ HQ via Standard vWAN hub in East US|Deployment hour ($0.25/hr) + ExpressRoute Scale Unit ($0.42/hr) + ExpressRoute Connection Unit ($0.05/hr) = $0.72/hr|VNet peering (outbound) ($0.01/GB) + ExpressRoute Metered Outbound Zone 1 ($0.025/GB) = $0.035/GB|
|4'|Data transfer from ExpressRoute connected Data Center/ HQ to a spoke VNet via Standard vWAN hub in East US|Deployment hour ($0.25/hr) + ExpressRoute Scale Unit ($0.42/hr) + ExpressRoute Connection Unit ($0.05/hr) = $0.72/hr|VNet peering (inbound) ($0.01/GB) = $0.01/GB|
|4"|Data transfer from ExpressRoute connected Data Center/ HQ to a remote spoke VNet via Standard vWAN hub in Europe|Deployment hour (2x$0.25/hr) + ExpressRoute Scale Unit ($0.42/hr) + ExpressRoute Connection Unit ($0.05/hr) = $0.97/hr|VNet peering (inbound) ($0.01/GB) + hub Data Processing (Europe) ($0.02/GB) + Inter-Region data transfer (East US to Europe) ($0.05/GB) = $0.08/GB|
|5|Data transfer from a spoke VNet to another spoke VNet via Standard vWAN hub in East US|Deployment hour ($0.25/hr) = $0.25/hr|VNet peering (outbound + inbound) (2x$0.01/GB) + hub Data Processing ($0.02/GB) = $0. 04/GB|
|6|Data transfer from a spoke VNet connected to a hub in East US to another spoke VNet in Europe (a different region) that is connected to a hub in Europe|Deployment hour (2x$0.25/hr) = $0.50/hr|VNet peering (outbound + inbound) (2x$0.01/GB) + hub Data Processing (2x$0.02/GB) + Inter-Region data transfer (East US to Europe) ($0.05/GB) = $0. 11/GB|
|7|Data transfer from a spoke VNet to a User VPN (Point-to-Site) via Standard vWAN hub in Europe|Deployment hour ($0.25/hr) + VPN P2S Scale Unit ($0.261/hr) + VPN P2S Connection Unit ($0.0125/hr) = $0.524/hr|VNet peering (outbound) ($0.01/GB) + Standard Outbound Zone 1 ($0.087/GB) = $0.097/GB|
|7'|Data transfer from a User VPN (Point-to-Site) to a spoke VNet via Standard vWAN hub in Europe|Deployment hour ($0.25/hr) + VPN P2S Scale Unit ($0.261/hr) + VPN P2S Connection Unit ($0.0125/hr) = $0.524/hr|VNet peering (inbound) ($0.01/GB) = $0.01/GB|
|8|Data transfer from an SD-WAN branch via Network Virtual Appliance in hub in Singapore to another SD-WAN branch in the same region|Standard vWAN hub Deployment hour ($0.25/hr) + NVA Infrastructure Unit ($0.25/hr) = $0.50/hr<br> *Additional third-party licensing charges may apply|Standard Outbound Zone 2 ($0.12/GB) = $0.12/GB|

## <a name="topologies"></a>Common topology scenarios

### <a name="global"></a>Microsoft global backbone WAN

In this scenario, you create fully meshed automatic regional hubs globally, which serve as a Microsoft backbone for traffic connectivity globally. Typical connectivity involves endpoints such as branches (Site-to-Site VPN or SD-WAN), remote users (Point-to-Site VPN), and private circuits (ExpressRoute). This relies on the Microsoft backbone to carry traffic globally.

**Scenario 1 diagram: Microsoft global backbone WAN**

:::image type="content" source="./media/pricing-concepts/global-backbone.png" alt-text="Diagram of Microsoft global backbone WAN." lightbox="./media/pricing-concepts/global-backbone.png":::

#### Alternatives

* You can also choose to have a secured vWAN hub (includes Firewall) to become a central point of routing and security needs for each global region.

### <a name="sdwan"></a>Software-Defined Wide Area Network (SD-WAN)

In this scenario, stores moving to SD-WAN technology use vWAN hubs for automated store termination to access resources on Azure and back on-premises (Data Center). The stores are connected via VPN tunnels to send traffic securely through internet over the hub to the on-premises Data Center or for accessing shared apps on Azure.

**Scenario 2 diagram: Software-Defined Wide Area Network (SD-WAN)**

:::image type="content" source="./media/pricing-concepts/sd-wan.png" alt-text="Diagram of SD-WAN." lightbox="./media/pricing-concepts/sd-wan.png":::

#### Alternatives

* You can choose to use a third-party Network Virtual Appliance in the hub and connect that to the retail stores and centers.

* You can also choose to have a secured vWAN hub (includes Firewall) to become a central point of routing and security needs.

### <a name="remote"></a>Remote user connectivity

In this scenario, remote user sessions terminate on vWAN hubs. These could be remote users and/or Azure Virtual Desktop sessions from virtual networks. Currently, 100k users are supported on each hub.

The following diagram shows Point-to-Site VPN over virtual network connections for encrypted traffic across tunnels between the spoke VNets and vWAN hub. You can also choose to have virtual network peering connections among different spoke VNets for direct connectivity. For example, between shared and VDI spoke VNets.

**Scenario 3 diagram: Remote user connectivity**

:::image type="content" source="./media/pricing-concepts/remote.png" alt-text="Diagram of remote user connectivity." lightbox="./media/pricing-concepts/remote.png":::

## Data flow calculations

> [!IMPORTANT]
> The pricing shown in this article is for example purposes only and is subject to change. For the latest pricing, see the [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.
>

### Microsoft global backbone WAN calculation

In this scenario, we assumed a total of 8-TB data flowing through the global network through the vWAN hubs as shown in the diagram below. The total data transfer costs amount to $600 for this (sum of all the data flow costs in the diagram below, assuming metered charges for ExpressRoute), and the total hub costs (3 scale units + 3 connection units (ER) + 3 hub deployments) amount to $1534.

**Scenario 1 diagram: Microsoft global backbone WAN calculation**

:::image type="content" source="./media/pricing-concepts/global-backbone-pricing.png" alt-text="Diagram of Microsoft backbone pricing." lightbox="./media/pricing-concepts/global-backbone-pricing.png":::

| Value | Calculation |
| --- | --- |
|S2S VPN hub Singapore |(1 S2S VPN scale unit ($0.361/hr) + 1 connection unit ($0.05/hr)) x 730 hours = $300 per month|
|ExpressRoute hub US E |(1 ER scale unit ($0.42/hr) + 1 connection unit ($0.05/hr)) x 730 hours = $343 per month|
|ExpressRoute hub EU|(1 ER scale unit ($0.42/hr) + 1 connection unit ($0.05/hr)) x 730 hours = $343 per month|
|Standard hub deployment cost |3 hubs x 730 hours x $0.25/hr = $548 per month|
|**Total**|**$1534** per month |

### Software-Defined Wide Area Network (SD-WAN) calculation

In this scenario, we assumed a total of 12-TB data flowing through the vWAN hub, as shown in the diagram below in the US East Region. The total data transfer costs amount to $434 (sum of all the data flow costs shown below; includes hub processing charges, peering, bandwidth, metered ER data transfer costs), and the total hub costs (2 scale units + 3 connection units (2 S2S, 1 ER) + 1 hub deployment) amount to $863.

**Scenario 2 diagram: Software-Defined Wide Area Network (SD-WAN) calculation**

:::image type="content" source="./media/pricing-concepts/sd-wan-pricing.png" alt-text="Diagram of SD-WAN pricing." lightbox="./media/pricing-concepts/sd-wan-pricing.png":::

| Value | Calculation |
| --- | --- |
|VPN S2S (branches) |(1 S2S VPN scale unit ($0.361/hr) + 2 connection units (2x$0.05/hr) x 730 hours = $337 per month|
|ExpressRoute hub (HQ) |(1 ER scale unit ($0.42/hr) + 1 connection unit ($0.05/hr) x 730 hours = $343 per month|
|Standard hub deployment cost|1 hub x 730 hours x $0.25/hr = $183 per month|
|**Total**|**$863** per month|

### Remote user connectivity calculation

In this scenario, we assumed a total of 15-TB data flowing through the network in the US East Region. The total data transfer costs amount to $405 (includes hub processing charges, peering, bandwidth, metered ER data transfer charges), and the total hub costs (2 scale units + 2 connection units + 2 hub deployments) amount to $708.

**Scenario 3 diagram: Remote user connectivity calculation**
	
:::image type="content" source="./media/pricing-concepts/remote-pricing.png" alt-text="Diagram of remote user pricing." lightbox="./media/pricing-concepts/remote-pricing.png":::

| Value | Calculation |
| --- | --- |
|ExpressRoute hub (HQ) |(1 ER scale unit ($0.42/hr) + 1 connection unit ($0.05/hr)) x 730 hours = $343 per month |
|Standard hub deployment cost| 2 hubs x 730 hours x $0.25/hr = $365 per month |
|**Total** |**$708** per month |

## Pricing FAQ

> [!IMPORTANT]
> The pricing shown in this article is for example purposes only and is subject to change. For the latest pricing, see the [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/) page.
>

### <a name="scale-unit"></a>What is a scale unit?

A **scale unit** provides the unit for aggregate capacity of Site-to-site (S2S), Point-to-site (P2S), and ExpressRoute (ER) in a virtual hub. For example:

* **1 S2S VPN scale unit** implies a total capacity of 500-Mbps VPN gateway (dual instances are deployed for resiliency) in a virtual hub costing $0.361/hour.

* **1 ER scale unit** implies a total of 2-Gbps ER gateway in virtual hub costing $0.42/hr.

* **5 ER scale units** would imply a total of 10-Gbps ER gateway inside a virtual hub VNet priced at $0.42*5/hr. ER increments $0.25/hr from the 6th to 10th scale unit.

### <a name="connection-unit"></a>What is a connection unit?

A **connection unit** applies to any on-premises/non-Microsoft endpoint connecting to Azure gateways. For Site-to-site VPN, this value implies branches. For User VPN (Point-to-site), this value implies remote users. For ExpressRoute, this value implies ExpressRoute circuit connections.<br>For example:

* One branch connection connecting to Azure VPN in a virtual hub costs $0.05/hr. Therefore, 100 branch connections connecting to an Azure virtual hub would cost $0.05*100/hr.

* Two ExpressRoute circuit connections connecting to a virtual hub would cost $0.05*2/hr.

* Three remote user connections connecting to the Azure virtual hub P2S gateway would cost $0.01*3/hr.

### <a name="data-transfer"></a>How are data transfer charges calculated?

* Any traffic entering Azure isn't charged. Traffic leaving Azure (via VPN, ExpressRoute, or Point-to-site User VPN connections) is subject to the standard [Azure data transfer charges](https://azure.microsoft.com/pricing/details/bandwidth/) or, in the case of ExpressRoute, [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

* Peering charges are applicable when a VNet connected to a vWAN hub sends or receives data. For more information, see [Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).

* For data transfer charges between a Virtual WAN hub, and a remote Virtual WAN hub or VNet in a different region than the source hub, data transfer charges apply for traffic leaving a hub. Example: Traffic leaving an East US hub will be charged $0.02/GB going to a West US hub. There's no charge for traffic entering the West US hub. All hub to hub traffic is subject to Inter-Region (Intra/Inter-continental) charges [Azure data transfer charges](https://azure.microsoft.com/pricing/details/bandwidth/).

### <a name="fee"></a>What is the difference between a Standard hub fee and a Standard hub processing fee?

Virtual WAN comes in two flavors:

* A **Basic virtual WAN**, where users can deploy multiple hubs and use VPN Site-to-site connectivity. A Basic virtual WAN doesn't have advanced capabilities such as fully meshed hubs, ExpressRoute connectivity, User VPN/Point-to-site VPN connectivity, VNet-to-VNet transitive connectivity, VPN and ExpressRoute transit connectivity, or Azure Firewall. There's no base fee or data processing fee for hubs in a Basic virtual WAN.

* A **Standard virtual WAN** provides advanced capabilities, such as fully meshed hubs, ExpressRoute connectivity, User VPN/Point-to-site VPN connectivity, VNet-to-VNet transitive connectivity, VPN and ExpressRoute transit connectivity, and Azure Firewall, etc. All of the virtual hub routing is provided by a router that enables multiple services in a virtual hub. There's a base fee for the hub, which is priced at $0.25/hr. There's also a charge for data processing in the virtual hub router for VNet-to-VNet transit connectivity. The data processing charge in the virtual hub router isn't applicable for branch-to-branch transfers (Scenario 2, 2', 3), or VNet-to-branch transfers via the same vWAN hub (Scenario 1, 1') as shown in the [Pricing Components](#pricing).

## Next steps

* For current pricing, see [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).