---
title: 'Azure ExpressRoute: Configure a scalable gateway'
description: Learn how to configure a scalable ExpressRoute gateway in Azure using the Azure portal. This guide provides step-by-step instructions to set up and manage a scalable gateway for your ExpressRoute connection.
author: mekaylamoore
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 11/06/2025
ms.author: duau
---
# Configure a scalable ExpressRoute gateway

This article shows you how to configure a scalable ExpressRoute gateway using the Azure portal. A scalable gateway allows you to adjust bandwidth and performance for your ExpressRoute connection as your workload needs change.
## Prerequisites

Before you begin, make sure you have:

- An Azure account with an active subscription.
- A virtual network with a gateway subnet that is /26 or larger. This size ensures enough IP address space for gateway scaling and high availability.
- Verified that your region supports the scalable gateway. For region availability, see [About ExpressRoute scalable gateway](scalable-gateway.md#region-availability).

## Create a virtual network gateway

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource**, search for **Virtual Network Gateway**, and select it from the results.

1. On the **Virtual network gateway** page, select **Create**.

1. On the **Create virtual network gateway** page, enter or select the following settings:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | This field is automatically populated after you select your virtual network. |
    | **Instance details** |  |
    | Name | Enter a name for your gateway. This name is for the gateway resource, not the gateway subnet. |
    | Region | Select the region where your virtual network is located. If you want to deploy in an [Azure Extended Zone](../extended-zones/overview.md), select **Deploy to an Azure Extended Zone**. |
    | Gateway type | Select **ExpressRoute**. |
    | SKU | Select **ErGwScale**. For more information about gateway SKUs, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md#gwsku). |
    | Minimum Scale Units | Enter the minimum number of scale units (1-40). For more information, see [About ExpressRoute scalable gateway](scalable-gateway.md). |
    | Maximum Scale Units | Enter the maximum number of scale units (1-40). For more information, see [About ExpressRoute scalable gateway](scalable-gateway.md). |
    | Virtual network | Select your virtual network. |
    | **Public IP address** |  |
    | Public IP address | By default, ExpressRoute gateways use an auto-assigned public IP address. For more information, see [Auto-assigned public IP](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip). |

    > [!IMPORTANT]
    > The ErGwScale SKU doesn't currently support IPsec over ExpressRoute. For more information, see [About IPsec over ExpressRoute private peering](expressroute-about-encryption.md).

1. Select **Review + create** to validate your configuration.

1. After validation passes, select **Create** to begin the deployment.

The deployment can take up to 45 minutes to complete.

:::image type="content" source="media/expressroute-howto-scalablegw/create-scale.png" alt-text="Screenshot of the create page in Azure portal with Scalable Gateway." :::

## Change scale units

After you create your gateway, you can adjust the scale units as your needs change.

1. In the Azure portal, go to your ExpressRoute virtual network gateway.

1. Under **Settings**, select **Configuration**.

1. Adjust the **Minimum Scale Units** or **Maximum Scale Units** values as needed.

1. Select **Save** to apply your changes.

Scale changes can take up to 30 minutes to complete.

:::image type="content" source="media/expressroute-howto-scalablegw/change-scale.png" alt-text="Screenshot of the Configuration page showing Minimum Scale Units and Maximum Scale Units fields." lightbox="./media/expressroute-howto-scalablegw/zoom-scale.png":::

## Next steps

To migrate an existing ExpressRoute gateway to a scalable gateway, see [Migrate to a scalable ExpressRoute gateway](expressroute-howto-gateway-migration-portal.md).
