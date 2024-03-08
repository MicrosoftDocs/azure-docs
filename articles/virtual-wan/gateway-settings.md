---
title: 'About gateway settings for Virtual WAN'
titleSuffix: Azure Virtual WAN
description: This article answers common questions about Virtual WAN gateway settings.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/28/2023
ms.author: cherylmc

---

# About Virtual WAN gateway settings

This article helps you understand Virtual WAN gateway settings.

## <a name="capacity"></a>Gateway scale units

The gateway scale unit setting lets you pick the aggregate throughput of the gateway in the virtual hub. Each type of gateway scale unit (site-to-site, user-vpn, and ExpressRoute) is configured separately.

Gateway scale units are different than routing infrastructure units. You adjust gateway scale units when you need more aggregated throughput for the gateway itself. You adjust hub infrastructure units when you want the hub router to support more VMs. For more information about hub settings and infrastructure units, see [About virtual hub settings](hub-settings.md).

### <a name="s2s"></a>Site-to-site

Site-to-site VPN gateway scale units are configured on the **Site to site** page of the virtual hub. When configuring scale units, keep the following information in mind:

If you pick 1 scale unit = 500 Mbps, it implies that two instances for redundancy will be created, each having a maximum throughput of 500 Mbps.

For example, if you had five branches, each doing 10 Mbps at the branch, you'll need an aggregate of 50 Mbps at the head end. Planning for aggregate capacity of the Azure VPN gateway should be done after assessing the capacity needed to support the number of branches to the hub.

:::image type="content" source="./media/gateway-settings/site-to-site-hub.png" alt-text="Screenshot shows gateway scale units for site-to-site.":::

### <a name="p2s"></a>Point-to-site (User VPN)

User VPN gateway scale units are configured on the **Point to site** page of the virtual hub. Gateway scale units represent the aggregate capacity of the User VPN gateway. When configuring scale units, keep the following information in mind:

If you select 40 or more gateway scale units, plan your client address pool accordingly. For information about how this setting impacts the client address pool, see [About client address pools](about-client-address-pools.md).

:::image type="content" source="./media/gateway-settings/point-to-site-hub.png" alt-text="Screenshot shows gateway scale units for point-to-site.":::

### <a name="expressroute"></a>ExpressRoute

ExpressRoute gateway scale units are configured on the **ExpressRoute** page of the virtual hub.

:::image type="content" source="./media/gateway-settings/expressroute-hub.png" alt-text="Screenshot shows gateway scale units for ExpressRoute.":::

## <a name="type"></a>Basic and Standard

The virtual WAN type (Basic or Standard) determines the types of resources that can be created within a hub, including the type of gateways that can be created (site-to-site VPN, point-to site User VPN, and ExpressRoute). This setting is configured on the virtual WAN object. For more information, see [Upgrade from Basic to Standard](upgrade-virtual-wan.md).

The following table shows the configurations available for each virtual WAN type:

[!INCLUDE [Basic and Standard](../../includes/virtual-wan-standard-basic-include.md)]

## Next steps

* For current pricing, see [Virtual WAN pricing](https://azure.microsoft.com/pricing/details/virtual-wan/).

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
