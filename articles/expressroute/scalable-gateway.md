---
title: About Scalable Gateway
titleSuffix: Azure ExpressRoute
description: ExpressRoute scalable gateway offers flexible scaling and up to 40-Gbps bandwidth. See how to configure ErGwScale and review supported regions and features.
services: expressroute
author: mekaylamoore
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 06/25/2025
ms.author: mekaylamoore
---

# About ExpressRoute scalable gateway (preview)

The ExpressRoute scalable gateway (ErGwScale) is a new virtual network gateway SKU that provides flexible, high-bandwidth connectivity for your Azure virtual networks. With support for up to 40-Gbps bandwidth and autoscaling capabilities, ErGwScale helps you efficiently manage network performance and scale resources to meet your workload needs. This article explains the features, configuration options, limitations, and performance details of the ErGwScale gateway.

## Autoscaling vs. fixed scale unit

The virtual network gateway infrastructure autoscales between the minimum and maximum scale unit that you configure, based on the bandwidth or flow count utilization. Scale operations might take up to 30 minutes to complete. If you want to achieve a fixed connectivity at a specific bandwidth value, you can configure a fixed scale unit by setting the minimum scale unit and the maximum scale unit to the same value.

## Limitations

* **Basic IP**: ErGwScale doesn't support the Basic IP SKU. You need to use a Standard IP SKU to configure ErGwScale.
* **Minimum and maximum scale units**: You can configure the scale unit for ErGwScale between 1 and 40. The *minimum scale unit* can't be lower than 1 and the *maximum scale unit* can't be higher than 40.
* **Migration scenarios**: You can't migrate from Standard/ErGw1Az or HighPerf/ErGw2Az/UltraPerf/ErGw3Az to ErGwScale in the preview.

### Supported performance per scale unit

| Scale unit | Bandwidth (Gbps) | Packets per second | Connections per second | Maximum VM connections <sup>1</sup> | Maximum number of flows |
|--|--|--|--|--|--|
| 1-10 | 1 | 100,000 | 7,000 | 2,000 | 100,000 |
| 11-40 | 1 | 200,000 | 7,000 | 1,000 | 100,000 |

### Sample performance with scale unit

| Scale unit | Bandwidth (Gbps) | Packets per second | Connections per second | Maximum VM connections <sup>1</sup> | Maximum number of flows |
|--|--|--|--|--|--|
| 10 | 10 | 1,000,000 | 70,000 | 20,000 | 1,000,000 |
| 20 | 20 | 2,000,000 | 140,000 | 30,000 | 2,000,000 |
| 40 | 40 | 8,000,000 | 280,000 | 50,000 | 4,000,000 |

<sup>1</sup> Maximum VM connections scale differently beyond 10 scale units. The first 10 scale units provide capacity for 2,000 VMs per scale unit. Scale units 11 and above provide 1,000 more VM capacity per scale unit.

## Region availability

ErGwScale is available in most regions except the following regions:

* Asia South East
* Belgium Central
* Chile Central
* Europe North
* Europe West
* Germany West Central
* India Central
* India West
* Israel North West
* Japan East
* Malaysia West
* Qatar Central
* Spain Central
* Sweden Central
* Switzerland North
* Taiwan North West
* UK South
* US Central
* US East 2
* US North
* US South
* US South 2
* US South East 3
* US West
* US West 2
* Us West 3

### Pricing

ErGwScale is free of charge during the preview. For information about ExpressRoute pricing, see [Azure ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/#pricing).

## Next steps

- Learn how to [create an ExpressRoute scalable gateway](expressroute-howto-add-gateway-resource-manager.md).
- Learn more about [ExpressRoute gateways](expressroute-about-virtual-network-gateways.md).


