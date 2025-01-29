---
title: Create or modify a Direct peering - Azure portal
titleSuffix: Internet Peering
description: Learn how to create or modify a Direct peering using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/13/2024
---

# Create or modify a Direct peering using the Azure portal

In this article, you learn how to create a Microsoft Direct peering for an Internet Service Provider or Internet Exchange Provider using the Azure portal. This article also shows how to check the status of the resource, update it, or delete it.

If you prefer, you can complete this guide by using Azure [PowerShell](howto-direct-powershell.md).

## Prerequisites

- Review the [Prerequisites to set up peering with Microsoft](prerequisites.md) and the [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.

- If you already have Direct peering connections with Microsoft that aren't converted to Azure resources, see [Convert a legacy Direct peering to an Azure resource by using the portal](howto-legacy-direct-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a Direct peering

As an Internet Service Provider or Internet Exchange Provider, you can create a new direct peering using the Azure portal:

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

    :::image type="content" source="./media/howto-direct-portal/peering-basics.png" alt-text="Screenshot that shows the Basics tab of creating a peering in the Azure portal." lightbox="./media/howto-direct-portal/peering-basics.png":::

    >[!IMPORTANT]
    >You can only choose an ASN with ValidationState as Approved before you submit a peering request. If you just submitted your PeerAsn request, wait for 12 hours or so for ASN association to be approved. If the ASN you select is pending validation, you'll see an error message. If you don't see the ASN you need to choose, check that you selected the correct subscription. If so, check if you have already created PeerAsn by using **[Associate Peer ASN to Azure subscription](https://go.microsoft.com/fwlink/?linkid=2129592)**.

1. Select **Next: Configuration** to continue.

1. On the **Configuration** tab, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Peering type | Select **Direct**. |
    | Microsoft network | Select **AS8075**. |
    | SKU | Select **Basic Free**. Don't select **Premium Free** as it's reserved for special applications. |
    | Metro | Select the metro location where you want to convert a peering to an Azure resource. If you have peering connections with Microsoft in the selected location that aren't converted, you can see them listed in the **Peering connections**. |

    :::image type="content" source="./media/howto-direct-portal/peering-configuration.png" alt-text="Screenshot that shows the Configuration tab of creating a peering in the Azure portal." lightbox="./media/howto-direct-portal/peering-configuration.png":::

    > [!NOTE]
    > - If you want to add additional peering connections with Microsoft in the selected **Metro** location, select **Create new** in **Peering connections** section. For more information, see [Create or modify a Direct peering by using the portal](howto-direct-portal.md).
    > - If you want to modify a peering connection setting, select the edit button to go to the **Direct Peering Connection** page.
    > - If you want to delete a peering connection, select the ellipsis button **...** and then select **Delete**.

1. Select **Review + create**. 

1. Review the settings, and then select **Create**.

## View a Direct peering

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** from the search results.

1. Select the **Peering** resource that you want to view.

1. Under **Settings**, select **Connections** to see a summary of peering connections between your ASN and Microsoft.

    :::image type="content" source="./media/howto-direct-portal/peering-connections.png" alt-text="Screenshot that shows the peering connections in the Azure portal." lightbox="./media/howto-direct-portal/peering-connections.png":::

    - **Connection State** corresponds to the state of the peering connection setup. The states displayed in this field follow the state diagram shown in the [Direct peering walkthrough](walkthrough-direct-all.md).
    - **IPv4 Session State** and **IPv6 Session State** correspond to the IPv4 and IPv6 BGP session states, respectively.

## Modify a Direct peering connection

1. Go to the **Peering** resource that you want to modify.

1. Under **Settings**, select **Connections**.

1. Select the ellipsis button **...**, and then select **Edit connection** to modify the settings of a connection. 

    :::image type="content" source="./media/howto-direct-portal/modify-connection.png" alt-text="Screenshot that shows how to modify an existing peering connection." lightbox="./media/howto-direct-portal/modify-connection.png":::

1. Update the settings as needed, and then select **Save**.

## Delete a Direct peering connection

1. Go to the **Peering** resource that you want to delete.

1. Under **Settings**, select **Connections**.

1. Select the ellipsis button **...**, and then select **Delete connection** to delete a connection. 

    :::image type="content" source="./media/howto-direct-portal/delete-connection.png" alt-text="Screenshot that shows how to delete an existing peering connection." lightbox="./media/howto-direct-portal/delete-connection.png":::

1. Enter **yes** in the confirmation box, and then select **Delete**.

## Add a Direct peering connection

1. Go to the **Peering** resource that you want to add a connection to.

1. Under **Settings**, select **Connections**.

1. Select **Add connections** to add a connection. 

    :::image type="content" source="./media/howto-direct-portal/add-connection.png" alt-text="Screenshot that shows how to add a peering connection." lightbox="./media/howto-direct-portal/add-connection.png":::

1. Select the peering facility and the connection settings.

    :::image type="content" source="./media/howto-direct-portal/add-direct-peering-connection.png" alt-text="Screenshot that shows the Direct Peering Connection page." lightbox="./media/howto-direct-portal/add-direct-peering-connection.png":::

1. Select **Save**.

## Deprovision a Direct peering

[!INCLUDE [peering-direct-delete-portal](./includes/delete.md)]

## Related content

- [Create or modify Exchange peering by using the portal](howto-exchange-portal.md)
- [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md)
- [Internet peering frequently asked questions (FAQ)](faqs.md)
