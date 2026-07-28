---
title: Configure advertised gateway prefixes for a virtual network - Azure portal
description: Learn how to add, modify, and remove advertised gateway prefixes (summarizedGatewayPrefixes) on a hub virtual network using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 05/25/2026
#customer intent: As a network engineer, I want to configure summarized gateway prefixes on my hub VNet so that I can reduce the number of routes advertised to on-premises over ExpressRoute or VPN Gateway.
---

# Configure advertised gateway prefixes for a virtual network using the Azure portal

In this article, you learn how to add, modify, and remove advertised gateway prefixes on a hub virtual network. Advertised gateway prefixes let you specify summarized CIDR prefixes that Azure hybrid gateways advertise to on-premises networks instead of advertising all individual virtual network and spoke CIDRs.

For more information about this feature, see [Advertised gateway prefixes overview](advertised-gateway-prefixes-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A hub virtual network with a gateway subnet. See [Create a virtual network](quickstart-create-virtual-network.md).

- An ExpressRoute gateway or VPN gateway deployed in the hub virtual network. See [Create a VPN gateway](/azure/vpn-gateway/tutorial-create-gateway-portal) or [Create an ExpressRoute gateway](/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager).

- One or more peered spoke virtual networks (to observe the summarization behavior).

## Add advertised gateway prefixes

Use the following steps to add summarized gateway prefixes to your hub virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual networks**. Select **Virtual networks** from the search results.

1. Select your hub virtual network (the virtual network containing your gateway subnet).

1. In **Settings**, select **Address space**.

1. In the **Advertised gateway prefixes** section, select **+ Add prefix**.

1. Enter the summarized CIDR prefix that covers the address spaces you want to advertise. For example, enter **10.0.0.0/16** to summarize multiple /24 spoke networks.

1. To add more prefixes, repeat the previous step for each IPv4 or IPv6 CIDR prefix.

1. Select **Save**.

> [!NOTE]
> For dual-stack (IPv4 + IPv6) virtual networks, add both IPv4 and IPv6 summarized prefixes explicitly.

## Modify advertised gateway prefixes

Use the following steps to modify existing advertised gateway prefixes.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual networks**. Select **Virtual networks** from the search results.

1. Select your hub virtual network.

1. In **Settings**, select **Address space**.

1. In the **Advertised gateway prefixes** section, modify the CIDR prefix values as needed.

1. Select **Save**.

## Remove advertised gateway prefixes

Use the following steps to remove advertised gateway prefixes and revert to the default advertisement behavior.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual networks**. Select **Virtual networks** from the search results.

1. Select your hub virtual network.

1. In **Settings**, select **Address space**.

1. In the **Advertised gateway prefixes** section, select the delete icon next to the prefix you want to remove.

1. Repeat for each prefix you want to remove.

1. Select **Save**.

> [!NOTE]
> When all advertised gateway prefixes are removed, gateways revert to the default behavior of advertising all hub and peered spoke virtual network address spaces individually.

## Verify configuration

Use the following steps to verify that your summarized prefixes are configured correctly.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual networks**. Select **Virtual networks** from the search results.

1. Select your hub virtual network.

1. In **Settings**, select **Address space**.

1. Verify that the summarized prefixes appear in the **Advertised gateway prefixes** section.

## Related content

- [Advertised gateway prefixes overview](advertised-gateway-prefixes-overview.md)
- [Virtual network peering](virtual-network-peering-overview.md)
- [About ExpressRoute virtual network gateways](/azure/expressroute/expressroute-about-virtual-network-gateways)
- [What is VPN Gateway?](/azure/vpn-gateway/vpn-gateway-about-vpngateways)
