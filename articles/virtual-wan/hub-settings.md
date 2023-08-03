---
title: 'About virtual hub settings'
titleSuffix: Azure Virtual WAN
description: This article answers common questions about virtual hub settings and routing infrastructure units.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/12/2022
ms.author: cherylmc
---

# About virtual hub settings

This article helps you understand the various settings available for virtual hubs. A virtual hub is a Microsoft-managed virtual network that contains various service endpoints to enable connectivity. The virtual hub is the core of your network in a region. Multiple virtual hubs can be created in the same region.

A virtual hub can contain gateways for site-to-site VPN, ExpressRoute, or point-to-site User VPN. For example, when using Virtual WAN, you don't create a site-to-site connection from your on-premises site directly to your VNet. Instead, you create a site-to-site connection to the virtual hub. The traffic always goes through the virtual hub gateway. This means that your VNets don't need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway. For more information about gateways, see [Gateway settings](gateway-settings.md). Note that a virtual hub gateway isn't the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway.

When you create a virtual hub, a virtual hub router is deployed. The virtual hub router, within the Virtual WAN hub, is the central component that manages all routing between gateways and virtual networks (VNets). Routing infrastructure units determine the minimum throughput of the virtual hub router, and the number of virtual machines that can be deployed in VNets that are connected to the Virtual WAN virtual hub.

You can create an empty virtual hub (a virtual hub that doesn't contain any gateways) and then add gateways (S2S, P2S, ExpressRoute, etc.) later, or create the virtual hub and gateways at the same time. Once a virtual hub is created, virtual hub pricing applies, even if you don't create any gateways within the virtual hub. For more information, see [Azure Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).

## <a name="capacity"></a>Virtual hub capacity

By default, the virtual hub router is automatically configured to deploy with a virtual hub capacity of 2 routing infrastructure units. This supports a minimum of 3 Gbps aggregate throughput, and 2000 connected VMs deployed in all virtual networks connected to that virtual hub.

When you deploy a new virtual hub, you can specify additional routing infrastructure units to increase the default virtual hub capacity in increments of 1 Gbps and 1000 VMs. This feature gives you the ability to secure upfront capacity without having to wait for the virtual hub to scale out when more throughput is needed. The scale unit on which the virtual hub is created becomes the minimum capacity. Creating a virtual hub without a gateway takes about 5 - 7 minutes while creating a virtual hub and a gateway can take about 30 minutes to complete. You can view routing infrastructure units, router Gbps, and number of VMs supported, in the Azure portal **Virtual hub** pages for **Create virtual hub** and **Edit virtual hub**.

When increasing the virtual hub capacity, the virtual hub router will continue to support traffic at its current capacity until the scale out is complete. Scaling out the virtual hub router may take up to 25 minutes. 

### Configure virtual hub capacity

Capacity is configured on the **Basics** tab **Virtual hub capacity** setting when you create your virtual hub.

:::image type="content" source="./media/hub-settings/basics-hub.png" alt-text="Screenshot shows capacity.":::

#### Edit virtual hub capacity

Adjust the virtual hub capacity when you need to support additional virtual machines and the aggregate throughput of the virtual hub router.

To add additional virtual hub capacity, go to the virtual hub in the Azure portal. On the **Overview** page, click **Edit virtual hub**. Adjust the **Virtual hub capacity** using the dropdown, then **Confirm**.

### Routing infrastructure unit table

For pricing information, see [Azure Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).

| Routing infrastructure unit | Aggregate throughput<br>Gbps| Number of VMs |
| ---| ---| ---  |
| 2  | 3  | 2000 |
| 3  | 3  | 3000 |
| 4  | 4  | 4000 |
| 5  | 5  | 5000 |
| 6  | 6  | 6000 |
| 7  | 7  | 7000 |
| 8  | 8  | 8000 |
| 9  | 9  | 9000 |
| 10 | 10 | 10000 |
| 11 | 11 | 11000 |
| 12 | 12 | 12000 |
| 13 | 13 | 13000 |
| 14 | 14 | 14000 |
| 15 | 15 | 15000 |
| 16 | 16 | 16000 |
| 17 | 17 | 17000 |
| 18 | 18 | 18000 |
| 19 | 19 | 19000 |
| 20 | 20 | 20000 |
| 21 | 21 | 21000 |
| 22 | 22 | 22000 |
| 23 | 23 | 23000 |
| 24 | 24 | 24000 |
| 25 | 25 | 25000 |
| 26 | 26 | 26000 |
| 27 | 27 | 27000 |
| 28 | 28 | 28000 |
| 29 | 29 | 29000 |
| 30 | 30 | 30000 |
| 31 | 31 | 31000 |
| 32 | 32 | 32000 |
| 33 | 33 | 33000 |
| 34 | 34 | 34000 |
| 35 | 35 | 35000 |
| 36 | 36 | 36000 |
| 37 | 37 | 37000 |
| 38 | 38 | 38000 |
| 39 | 39 | 39000 |
| 40 | 40 | 40000 |
| 41 | 41 | 41000 |
| 42 | 42 | 42000 |
| 43 | 43 | 43000 |
| 44 | 44 | 44000 |
| 45 | 45 | 45000 |
| 46 | 46 | 46000 |
| 47 | 47 | 47000 |
| 48 | 48 | 48000 |
| 49 | 49 | 49000 |
| 50 | 50 | 50000 |

## <a name="routing-preference"></a>Virtual hub routing preference

A Virtual WAN virtual hub connects to virtual networks (VNets) and on-premises sites using connectivity gateways, such as site-to-site (S2S) VPN gateway, ExpressRoute (ER) gateway, point-to-site (P2S) gateway, and SD-WAN Network Virtual Appliance (NVA). The virtual hub router provides central route management and enables advanced routing scenarios using route propagation, route association, and custom route tables. When a virtual hub router makes routing decisions, it considers the configuration of such capabilities.

Previously, there wasn't a configuration option for you to use to influence routing decisions within virtual hub router for prefixes in on-premises sites. These decisions relied on the virtual hub router's built-in route selection algorithm and the options available within gateways to manage routes before they reach the virtual hub router. To influence routing decisions in virtual hub router for prefixes in on-premises sites, you can now adjust the **Hub routing preference**.

For more information, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).

## <a name="gateway"></a>Gateway settings

Each virtual hub can contain multiple gateways (site-to-site, point-to-site User VPN, and ExpressRoute). When you create your virtual hub, you can configure gateways at the same time, or create an empty virtual hub and add the gateway settings later. When you edit a virtual hub, you'll see settings that pertain to gateways. For example, gateway scale units.

Gateway scale units are different than routing infrastructure units. You adjust gateway scale units when you need more aggregated throughput for the gateway itself. You adjust virtual hub infrastructure units when you want the virtual hub router to support more VMs.

For more information about gateway settings, see [Gateway settings](gateway-settings.md).

## <a name="type"></a>Basic and Standard

The virtual WAN type (Basic or Standard) determines the types of resources that can be created within a virtual hub, including the type of gateways that can be created (site-to-site VPN, point-to site User VPN, and ExpressRoute). This setting is configured on the virtual WAN object. For more information, see [Upgrade from Basic to Standard](upgrade-virtual-wan.md).

The following table shows the configurations available for each virtual WAN type:

[!INCLUDE [Basic and Standard](../../includes/virtual-wan-standard-basic-include.md)]

## <a name="router-status"></a>Virtual hub router status

[!INCLUDE [virtual hub router status](../../includes/virtual-wan-hub-router-status.md)]

## Next steps

For virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
