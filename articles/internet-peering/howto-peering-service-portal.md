---
title: Enable Azure Peering Service on a Direct peering - Azure portal
titleSuffix: Internet Peering
description: Learn how to enable Azure Peering Service on a Direct peering using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/12/2024

#CustomerIntent: As an administrator, I want to learn how to enable Azure Peering Service on a Direct peering using the Azure portal so I can manage my Direct peerings.
---

# Enable Azure Peering Service on a Direct peering using the Azure portal

In this article, you learn how to enable [Azure Peering Service](../peering-service/about.md) on a Direct peering using the Azure portal. To learn how to enable Peering Service on a Direct peering using Azure PowerShell, see [Enable Azure Peering Service on a Direct peering using PowerShell](howto-peering-service-powershell.md).

## Prerequisites

- Complete the [Prerequisites to set up peering with Microsoft](prerequisites.md) before you begin configuration.

- A Direct peering in your subscription for which you want to enable Peering Service. If you don't have one, either convert a legacy Direct peering or create a new Direct peering. For more information, see [Convert a legacy Direct peering to an Azure resource](howto-legacy-direct-portal.md) or [Create or modify a Direct peering](howto-direct-portal.md).

## Enable Peering Service on a Direct peering

In this section, you learn how to enable Peering Service on a Direct peering using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** in the search results.

    :::image type="content" source="./media/howto-peering-service-portal/internet-peering-portal-search.png" alt-text="Screenshot of searching for internet peerings in the Azure portal." lightbox="./media/howto-peering-service-portal/internet-peering-portal-search.png":::

1. Select the peering resource that you want to enable Peering Service for its connection.

1. Select **Connections**.

    :::image type="content" source="./media/howto-peering-service-portal/peering-connections.png" alt-text="Screenshot shows the connections of a peering in the Azure portal." lightbox="./media/howto-peering-service-portal/peering-connections.png":::

1. Right-click the peering connection you want to enable Peering Service for, and then select **Edit connection**.

    :::image type="content" source="./media/howto-peering-service-portal/edit-connection.png" alt-text="Screenshot shows how to edit a peering connection in the Azure portal." lightbox="./media/howto-peering-service-portal/edit-connection.png":::

1. Select **Enabled** for **Use for Peering Service**.

    :::image type="content" source="./media/howto-peering-service-portal/edit-direct-peering-connection.png" alt-text="Screenshot shows how to enable Azure Peering Service on a Direct peering connection in the Azure portal.":::

1. Select **Save**.

1. Once the deployment is complete, select **Registered prefixes** to register a prefix to the peering.

    :::image type="content" source="./media/howto-peering-service-portal/add-registered-prefix.png" alt-text="Screenshot shows how to add registered prefixes in the Azure portal." lightbox="./media/howto-peering-service-portal/add-registered-prefix.png":::

1. Enter a name and prefix, then select **Save**.

    :::image type="content" source="./media/howto-peering-service-portal/register-prefix-configure.png" alt-text="Screenshot shows how to register a prefix in the Azure portal.":::
   
    After a prefix is created, you can see it in the list of prefixes in **Registered prefixes** page.

1. Select the prefix you created to see the details, which include the **Prefix key**. This key must be provided to the customer so they can use it to register their prefix in their subscription.

    :::image type="content" source="./media/howto-peering-service-portal/prefix-details.png" alt-text="Screenshot shows the prefix details including the prefix key in the Azure portal.":::

## Modify a Direct peering connection

To modify connection settings, see the **Modify a Direct peering** section in [Create or modify a Direct peering by using the portal](howto-direct-portal.md).

## Related content

- [Internet peering for Azure Peering Service partner walkthrough](walkthrough-peering-service-all.md).
- [Enable Azure Peering Service Voice on a Direct peering by using the Azure portal](howto-peering-service-voice-portal.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).