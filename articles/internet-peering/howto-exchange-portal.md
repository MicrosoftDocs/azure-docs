---
title: Create or modify an Exchange peering - Azure portal
titleSuffix: Internet Peering
description: Learn how to create or modify an Exchange peering using the Azure portal.
services: internet-peering
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/13/2024
---

# Create or modify an Exchange peering using the Azure portal

In this article, you learn how to create a Microsoft Exchange peering using the Azure portal. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide by using [PowerShell](howto-exchange-powershell.md).

## Prerequisites

- Review the [Prerequisites to set up peering with Microsoft](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.

- If you already have Exchange peerings with Microsoft that aren't converted to Azure resources, see [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an Exchange peering

As an Internet Exchange Provider, you can create an exchange peering request using the Azure portal:

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** from the search results.

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

    :::image type="content" source="./media/howto-exchange-portal/peering-basics.png" alt-text="Screenshot that shows the Basics tab of creating a peering in the Azure portal." lightbox="./media/howto-exchange-portal/peering-basics.png":::

>[!IMPORTANT] 
>You can only choose an ASN with ValidationState as Approved before you submit a peering request. If you just submitted your PeerAsn request, wait for 12 hours or so for ASN association to be approved. If the ASN you select is pending validation, you'll see an error message. If you don't see the ASN you need to choose, check that you selected the correct subscription. If so, check if you have already created PeerAsn by using **[Associate Peer ASN to Azure subscription](https://go.microsoft.com/fwlink/?linkid=2129592)**.

1. Select **Next: Configuration** to continue.

1. On the **Configuration** tab, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Peering type | Select **Exchange**. |
    | SKU | Select **Basic Free**. |
    | Metro | Select the metro location where you want to set up peering. |

    :::image type="content" source="./media/howto-exchange-portal/peering-configuration-exchange.png" alt-text="Screenshot that shows the Configuration tab of creating an Exchange peering in the Azure portal." lightbox="./media/howto-exchange-portal/peering-configuration-exchange.png":::

    > [!NOTE]
    > - If you already have peering connections with Microsoft in the selected metro location and you're using the portal for the first time to set up peering in that location, your existing peering connections will be listed in the **Peering connections** section as shown. Microsoft will automatically convert these peering connections to an Azure resource so that you can manage them all along with the new connections in one place. For more information, see [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md).
    > - If you want to modify a peering connection setting, select the edit button to go to the **Exchange Peering Connection** page.
    > - If you want to delete a peering connection, select the ellipsis button **...** and then select **Delete**.

1. Select **Review + create**. 

1. Review the settings, and then select **Create**.

## Verify an Exchange peering

1. Go to the **Peering** resource you created in the previous section.

1. Under **Settings**, select **Connections** to see a summary of peering connections between your ASN and Microsoft.

    :::image type="content" source="./media/howto-exchange-portal/peering-connections.png" alt-text="Screenshot that shows the peering connections in the Azure portal." lightbox="./media/howto-exchange-portal/peering-connections.png":::

    - **Connection State** corresponds to the state of the peering connection setup. The states displayed in this field follow the state diagram shown in the [Exchange peering walkthrough](walkthrough-exchange-all.md).
    - **IPv4 Session State** and **IPv6 Session State** correspond to the IPv4 and IPv6 BGP session states, respectively. 

## Modify an Exchange peering

1. Go to the **Peering** resource that you want to modify.

1. Under **Settings**, select **Connections**.

1. Select the ellipsis button **...**, and then select **Edit connection** to modify the settings of a connection. 

    :::image type="content" source="./media/howto-exchange-portal/modify-connection.png" alt-text="Screenshot that shows how to modify an existing peering connection." lightbox="./media/howto-exchange-portal/modify-connection.png":::

1. Update the settings as needed, and then select **Save**.

## Delete an Exchange peering connection

1. Go to the **Peering** resource that you want to delete.

1. Under **Settings**, select **Connections**.

1. Select the ellipsis button **...**, and then select **Delete connection** to delete a connection. 

    :::image type="content" source="./media/howto-exchange-portal/delete-connection.png" alt-text="Screenshot that shows how to delete an existing peering connection." lightbox="./media/howto-exchange-portal/delete-connection.png":::

1. Enter **yes** in the confirmation box, and then select **Delete**.

## Add an Exchange peering connection

1. Go to the **Peering** resource that you want to add a connection to.

1. Under **Settings**, select **Connections**.

1. Select **Add connections** to add a connection. 

    :::image type="content" source="./media/howto-exchange-portal/add-connection.png" alt-text="Screenshot that shows how to add a peering connection." lightbox="./media/howto-exchange-portal/add-connection.png":::

1. Select the peering facility and the connection settings.

    :::image type="content" source="./media/howto-exchange-portal/add-exchange-peering-connection.png" alt-text="Screenshot that shows the Exchange Peering Connection page." lightbox="./media/howto-exchange-portal/add-exchange-peering-connection.png":::

1. Select **Save**.

## Deprovision an Exchange peering

[!INCLUDE [peering-exchange-delete-portal](./includes/delete.md)]

## Related content

- [Create or modify a Direct peering by using the portal](howto-direct-portal.md).
- [Convert a legacy Direct peering to an Azure resource by using the portal](howto-legacy-direct-portal.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).
