---
title: 'About virtual hub settings'
titleSuffix: Azure Virtual WAN
description: This article answers common questions about virtual hub settings and routing infrastructure units.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 08/24/2023
ms.author: cherylmc
---

# About virtual hub settings

This article helps you understand the various settings available for virtual hubs. A virtual hub is a Microsoft-managed virtual network that contains various service endpoints to enable connectivity. The virtual hub is the core of your network in a region. Multiple virtual hubs can be created in the same region.

A virtual hub can contain gateways for site-to-site VPN, ExpressRoute, or point-to-site User VPN. For example, when using Virtual WAN, you don't create a site-to-site connection from your on-premises site directly to your VNet. Instead, you create a site-to-site connection to the virtual hub. The traffic always goes through the virtual hub gateway. This means that your VNets don't need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway. For more information about gateways, see [Gateway settings](gateway-settings.md). A virtual hub gateway isn't the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway.

When you create a virtual hub, a virtual hub router is deployed. The virtual hub router, within the Virtual WAN hub, is the central component that manages all routing between gateways and virtual networks (VNets). Routing infrastructure units determine the throughput of the virtual hub router, and the number of virtual machines that can be deployed in VNets that are connected to the Virtual WAN virtual hub.

You can create an empty virtual hub (a virtual hub that doesn't contain any gateways) and then add gateways (S2S, P2S, ExpressRoute, etc.) later. You can also create the virtual hub and gateways at the same time. Once a virtual hub is created, virtual hub pricing applies, even if you don't create any gateways within the virtual hub. For more information, see [Azure Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).

## <a name="capacity"></a>Virtual hub capacity

By default, the virtual hub router is automatically configured to deploy with a virtual hub capacity of 2 routing infrastructure units. This supports 3-Gbps aggregate throughput and 2,000 connected VMs deployed in all virtual networks connected to that virtual hub.

When you deploy a new virtual hub, you can specify additional routing infrastructure units to increase the default virtual hub capacity in increments of 1-Gbps and 1,000 VMs. This feature gives you the ability to secure upfront capacity without having to wait for the virtual hub to scale out when more throughput is needed. The scale unit on which the virtual hub is created becomes the minimum capacity. Creating a virtual hub without a gateway takes about 5 - 7 minutes while creating a virtual hub and a gateway can take about 30 minutes to complete. You can view routing infrastructure units, router Gbps, and number of VMs supported, in the Azure portal **Virtual hub** pages for **Create virtual hub** and **Edit virtual hub**.

When increasing the virtual hub capacity, the virtual hub router will continue to support traffic at its current capacity until the scale out is complete. It may take up to 25 minutes for the virtual hub router to scale out to additional routing infrastructure units. It's also important to note the following: currently, regardless of the number of routing infrastructure units deployed, traffic may experience performance degradation if more than 1.5 Gbps is sent in a single TCP flow. 

> [!NOTE]
> Regardless of the virtual hub's capacity, the hub can only accept a maximum of 10,000 routes from its connected resources (virtual networks, branches, other virtual hubs, etc).
>

Capacity is configured on the **Basics** tab **Virtual hub capacity** setting when you create your virtual hub.

#### Edit virtual hub capacity

Adjust the virtual hub capacity when you need to support additional virtual machines and the aggregate throughput of the virtual hub router.

To add additional virtual hub capacity, go to the virtual hub in the Azure portal. On the **Overview** page, select **Edit virtual hub**. Adjust the **Virtual hub capacity** using the dropdown, then **Confirm**.

#### Autoscaling
The virtual hub router supports autoscaling based on spoke VM utilization and data processed by the hub router. See [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md#metrics) for more details. As these factors change over time, the autoscaling algorithm dynamically adjusts the number of routing infrastructure units. It ensures the virtual hub router can handle the traffic load by selecting the greater value between the minimum routing infrastructure units you specify and the units required to support the current traffic load.

Autoscaling can help in various scenarios where the hub router requires additional processing capabilities; autoscaling isn't instantaneous however. For improved infrastructure availability and performance, ensure that your minimum provisioned routing infrastructure units (RIUs) match the requirements of your workloads. Autoscaling won't reduce the provisioned RIUs below this minimum.

Also consider:
- The virtual hub router only scales on the data it processes, as clarified in [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md#category-traffic). Review how your Virtual WAN processes data to ensure that resources are provisioned correctly.
- Autoscaling can potentially affect connectivity for Private Endpoints. Review your deployment and adhere to the best practices outlined in [Use Private Link in Virtual WAN](howto-private-link.md#routing-considerations-with-private-link-in-virtual-wan).

### Routing infrastructure unit table

For pricing information, see [Azure Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).

| Routing infrastructure unit | Aggregate throughput (Gbps) | Number of VMs |
|----------------------------|-----------------------------|---------------|
| 2                          | 3                           | 2,000         |
| 3                          | 3                           | 3,000         |
| 4                          | 4                           | 4,000         |
| 5                          | 5                           | 5,000         |
| 6                          | 6                           | 6,000         |
| 7                          | 7                           | 7,000         |
| 8                          | 8                           | 8,000         |
| 9                          | 9                           | 9,000         |
| 10                         | 10                          | 10,000        |
| 11                         | 11                          | 11,000        |
| 12                         | 12                          | 12,000        |
| 13                         | 13                          | 13,000        |
| 14                         | 14                          | 14,000        |
| 15                         | 15                          | 15,000        |
| 16                         | 16                          | 16,000        |
| 17                         | 17                          | 17,000        |
| 18                         | 18                          | 18,000        |
| 19                         | 19                          | 19,000        |
| 20                         | 20                          | 20,000        |
| 21                         | 21                          | 21,000        |
| 22                         | 22                          | 22,000        |
| 23                         | 23                          | 23,000        |
| 24                         | 24                          | 24,000        |
| 25                         | 25                          | 25,000        |
| 26                         | 26                          | 26,000        |
| 27                         | 27                          | 27,000        |
| 28                         | 28                          | 28,000        |
| 29                         | 29                          | 29,000        |
| 30                         | 30                          | 30,000        |
| 31                         | 31                          | 31,000        |
| 32                         | 32                          | 32,000        |
| 33                         | 33                          | 33,000        |
| 34                         | 34                          | 34,000        |
| 35                         | 35                          | 35,000        |
| 36                         | 36                          | 36,000        |
| 37                         | 37                          | 37,000        |
| 38                         | 38                          | 38,000        |
| 39                         | 39                          | 39,000        |
| 40                         | 40                          | 40,000        |
| 41                         | 41                          | 41,000        |
| 42                         | 42                          | 42,000        |
| 43                         | 43                          | 43,000        |
| 44                         | 44                          | 44,000        |
| 45                         | 45                          | 45,000        |
| 46                         | 46                          | 46,000        |
| 47                         | 47                          | 47,000        |
| 48                         | 48                          | 48,000        |
| 49                         | 49                          | 49,000        |
| 50                         | 50                          | 50,000        |

## <a name="routing-preference"></a>Virtual hub routing preference

A Virtual WAN virtual hub connects to virtual networks (VNets) and on-premises sites using connectivity gateways, such as site-to-site (S2S) VPN gateway, ExpressRoute (ER) gateway, point-to-site (P2S) gateway, and SD-WAN Network Virtual Appliance (NVA). The virtual hub router provides central route management and enables advanced routing scenarios using route propagation, route association, and custom route tables. When a virtual hub router makes routing decisions, it considers the configuration of such capabilities.

Previously, there wasn't a configuration option for you to use to influence routing decisions within virtual hub router for prefixes in on-premises sites. These decisions relied on the virtual hub router's built-in route selection algorithm and the options available within gateways to manage routes before they reach the virtual hub router. To influence routing decisions in virtual hub router for prefixes in on-premises sites, you can now adjust the **Hub routing preference**.

For more information, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).

## <a name="gateway"></a>Gateway settings

Each virtual hub can contain multiple gateways (site-to-site, point-to-site User VPN, and ExpressRoute). When you create your virtual hub, you can configure gateways at the same time, or create an empty virtual hub and add the gateway settings later. When you edit a virtual hub, you'll see settings that pertain to gateways. For example, gateway scale units.

Gateway scale units are different than routing infrastructure units. You adjust gateway scale units when you need more aggregated throughput for the gateway itself. You adjust virtual hub infrastructure units when you want the virtual hub router to support more VMs.

For more information about gateway settings, see [Gateway settings](gateway-settings.md).

## <a name="type"></a>Basic and Standard

The virtual WAN type (Basic or Standard) determines the types of resources that can be created within a virtual hub. This includes the type of gateways that can be created (site-to-site VPN, point-to site User VPN, and ExpressRoute). This setting is configured on the virtual WAN object. For more information, see [Upgrade from Basic to Standard](upgrade-virtual-wan.md).

The following table shows the configurations available for each virtual WAN type:

[!INCLUDE [Basic and Standard](../../includes/virtual-wan-standard-basic-include.md)]

## <a name="router-status"></a>Virtual hub router status

[!INCLUDE [virtual hub router status](../../includes/virtual-wan-hub-router-status.md)]

## Next steps

For virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
