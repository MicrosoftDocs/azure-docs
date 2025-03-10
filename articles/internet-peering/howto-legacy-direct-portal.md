﻿---
title: Convert a legacy Direct peering to an Azure resource - Azure portal
titleSuffix: Internet Peering
description: Learn how to convert a legacy Direct peering to an Azure resource using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 03/03/2025
---

# Convert a legacy Direct peering to an Azure resource using the Azure portal

In this article, you learn how to convert an existing legacy Direct peering to an Azure resource by using the Azure portal.

If you prefer, you can complete this guide using [PowerShell](howto-legacy-direct-powershell.md).

## Prerequisites

- Complete the [Prerequisites to set up peering with Microsoft](prerequisites.md) before you begin configuration.

- A legacy Direct peering in your subscription.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Convert a legacy Direct peering

As an Internet Service Provider, you can convert a legacy direct peering connection to an Azure resource using the Azure portal: 

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** from the search results.

    :::image type="content" source="./media/internet-peering-portal-search.png" alt-text="Screenshot of searching for internet peerings in the Azure portal." lightbox="./media/internet-peering-portal-search.png":::

1. On the **Peerings** page, select **+ Create**.

1. On the **Basics** tab of **Create a Peering** page, enter, or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select a resource group or create a new one. |
    | **Instance details** |  |
    | Name | Enter a name for the peering you're creating. |
    | Peer ASN | Select your ASN. |

    :::image type="content" source="./media/create-peering-basics.png" alt-text="Screenshot that shows the Basics tab of creating a peering in the Azure portal." lightbox="./media/create-peering-basics.png":::

    >[!IMPORTANT] 
    >You can only choose an ASN with ValidationState as Approved before you submit a peering request. If you just submitted your Peer ASN request, wait for 12 hours or so for ASN association to be approved. If the ASN you select is pending validation, you'll see an error message. If you don't see the ASN you need to choose, check that you selected the correct subscription. If so, check if you have already created Peer ASN by using **[Associate Peer ASN to Azure subscription](https://go.microsoft.com/fwlink/?linkid=2129592)**.

1.  Select **Next : Configuration >**.

1. On the **Configuration** tab, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Peering type | Select **Direct**. |
    | Microsoft network | Select **AS8075**. |
    | SKU | Select **Basic Free**. Don't select **Premium Free** as it's reserved for special applications. |
    | Metro | Select the metro location where you want to convert a peering to an Azure resource. If you have peering connections with Microsoft in the selected location that aren't converted, you can see them listed in the **Peering connections**. |

    :::image type="content" source="./media/create-peering-configuration-direct.png" alt-text="Screenshot that shows the Configuration tab of creating a peering in the Azure portal." lightbox="./media/create-peering-configuration-direct.png":::

    > [!NOTE]
    > If you want to add additional peering connections with Microsoft in the selected **Metro** location, select **Create new**. For more information, see [Create or modify a Direct peering by using the portal](howto-direct-portal.md).

1. Select **Review + create**. 

1. Review the settings, and then select **Create**.

## Verify a Direct peering

1. Go to the **Peering** resource you created in the previous section.

1. Under **Settings**, select **Connections** to see a summary of peering connections between your ASN and Microsoft.

    :::image type="content" source="./media/direct-peering-connections.png" alt-text="Screenshot that shows the peering connections in the Azure portal." lightbox="./media/direct-peering-connections.png":::

    - **Connection State** corresponds to the state of the peering connection setup. The states displayed in this field follow the state diagram shown in the [Direct peering walkthrough](walkthrough-direct-all.md).
    - **IPv4 Session State** and **IPv6 Session State** correspond to the IPv4 and IPv6 BGP session states, respectively. 

## Related content

- [Create or modify a Direct peering by using the portal](howto-direct-portal.md)
- [Internet peering frequently asked questions (FAQ)](faqs.md)
