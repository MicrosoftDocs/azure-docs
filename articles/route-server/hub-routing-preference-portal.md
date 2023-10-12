---
title: Configure routing preference - Azure portal
titleSuffix: Azure Route Server
description: Learn how to configure routing preference (preview) in Azure Route Server using the Azure portal to influence its route selection.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: how-to
ms.date: 10/11/2023

#CustomerIntent: As an Azure administrator, I want learn how to use routing preference setting so that I can influence route selection in Azure Route Server.
---

# Configure routing preference to influence route selection using the Azure portal

Learn how to use routing preference setting in Azure Route Server to influence its route learning and selection. For more information, see [Routing preference (preview)](hub-routing-preference.md).

> [!IMPORTANT]
> Routing preference is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure route server. If you need to create a Route Server, see [Create and configure Azure Route Server](quickstart-configure-route-server-portal.md).

## Configure routing preference

1. Sign in to [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***route server***. Select **Route Servers** from the search results.

    :::image type="content" source="./media/hub-routing-preference-portal/portal.png" alt-text="Screenshot of searching for Azure Route Server in the Azure portal." lightbox="./media/hub-routing-preference-portal/portal.png":::

1. Select the Route Server that you want to configure.

1. Select **Configuration**.

1. In the **Configuration** page, select **VPN** or **ASPath** to change the routing preference setting from the default setting: **ExpressRoute**.

    :::image type="content" source="./media/hub-routing-preference-portal/routing-preference-configuration.png" alt-text="Screenshot of configuring routing preference of a Route Server in the Azure portal.":::

1. Select **Save**.

## Related content

- [Create and configure Route Server](quickstart-configure-route-server-portal.md)
- [Monitor Azure Route Server](monitor-route-server.md)
- [Azure Route Server FAQ](route-server-faq.md)
