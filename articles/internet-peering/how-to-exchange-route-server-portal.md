---
title: Create or modify an Exchange peering with Route Server - Azure portal
titleSuffix: Internet Peering
description: Create or modify an Exchange peering with Route Server using the Azure portal.
ms.author: halkazwini
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/12/2024

#CustomerIntent: As an administrator, I want to learn how to create or modify an an Exchange peering with Route Server using the Azure portal so I can manage my Exchange peerings.
---

# Create or modify an Exchange peering with Route Server using the Azure portal

In this article, you learn how to create a Microsoft Exchange peering with a route server using the Azure portal. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

## Prerequisites

- Review the [Prerequisites to set up peering with Microsoft](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
- If you already have an Exchange peering with Microsoft that isn't converted to Azure resources, see [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md).
- Associate your public ASN with your Azure subscription. For more information, see [Associate peer ASN to Azure subscription using the Azure portal](howto-subscription-association-portal.md).

## Create and provision an Exchange peering

In this section, you learn how to create an Exchange peering with a route server using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** in the search results.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/internet-peering-portal-search.png" alt-text="Screenshot of searching for internet peerings in the Azure portal." lightbox="./media/how-to-exchange-route-server-portal/internet-peering-portal-search.png":::

1. In the **Peerings** page, select **+ Create** to create a new peering.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/peerings-portal.png" alt-text="Screenshot of internet peerings page in the Azure portal." lightbox="./media/how-to-exchange-route-server-portal/peerings-portal.png":::

1. In the **Basics** tab of **Create a peering**, enter or select your Azure subscription, resource group, name, and ASN of the peering:

    :::image type="content" source="./media/how-to-exchange-route-server-portal/create-peering-basics.png" alt-text="Screenshot of the Basics tab of creating a peering in the Azure portal.":::

    > [!IMPORTANT] 
    > You can only choose an ASN with ValidationState as Approved before you submit a peering request. After submitting a PeerAsn request, wait for about 12 hours for the ASN association to be approved. If the ASN you select is pending validation, you'll see an error message. If you don't see the ASN you needed to choose, check that you selected the correct subscription. If so, check if you have already created PeerAsn. For more information, see [Associate peer ASN to Azure subscription using the Azure portal](howto-subscription-association-portal.md).

1. Select **Next: Configuration** to continue. In the **Configuration** tab, you MUST choose the following required configurations to create a peering for Peering Service Exchange with Route Server:

    - Peering type: **Direct**.
    - Microsoft network: **AS8075 (with exchange route server)**.
    - SKU: **Premium Free**.

1. Select your **Metro**, then select **Create new** to add a connection to your peering.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/create-peering-configuration.png" alt-text="Screenshot of the Configuration tab of creating a peering in the Azure portal.":::

1. In **Direct Peering Connection**, enter or select your peering facility details then select **Save**.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/direct-peering-connection.png" alt-text="Screenshot of creating a direct peering connection.":::

    > [!NOTE] 
    > - Peering connections for Peering Service Exchange with Route Server must have **Peer** as the Session Address Provider.
    > - *Use for Peering Service* is disabled by default. It can be enabled after the exchange provider signs a Peering Service agreement with Microsoft.
  
1. Select **Review + create**. Review the summary and select **Create** after the validation passes.

    Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning begins.

    > [!NOTE]
    > For normal Internet Service Providers (ISP) who are a Microsoft Peering Service partner, customer IP prefixes registration is required. However, in the case of exchange partners with a route server, it is required to register customer ASNs and not prefixes. Same ASN key would be valid for the customer's prefix registration.

1. Open the peering in the Azure portal, and select **Registered ASNs**.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/registered-asn.png" alt-text="Screenshot shows how to go to Registered ASNs from the Peering Overview page in the Azure portal.":::

1. Select **Add registered ASN** to create a new customer Autonomous System Number (ASN) under your exchange subscription.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/register-new-asn.png" alt-text="Screenshot shows how to register an ASN in the Azure portal.":::

1. Select **Save**.

1. In **Registered ASNs**, each ASN has an associated Prefix Key assigned to it. As an exchange provider, you need to provide this Prefix Key to your customer so they can register Peering Service under their subscription.


### <a name=get></a>Verify an Exchange peering

In this section, you learn how to view a peering to verify its configuration and state.

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** in the search results.

1. Select the peering resource that you want to view.

1. Select **Connections** to view the PeerAsn information.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/peering-connections.png" alt-text="Screenshot shows the connections of a peering in the Azure portal." lightbox="./media/how-to-exchange-route-server-portal/peering-connections.png":::

    At the top of the screen, you see a summary of peering connections between your ASN and Microsoft, across different facilities within the metro.

    > [!NOTE] 
    > - **Connection State** corresponds to the state of the peering connection setup. The states displayed in this field follow the state diagram shown in the [Exchange peering walkthrough](walkthrough-exchange-all.md).
    > - **IPv4 Session State** and **IPv6 Session State** correspond to the IPv4 and IPv6 BGP session states respectively.  
    > - When you select a row at the top of the screen, the **Connection** section at the bottom shows details for each connection. Select the arrows to expand **Configuration**, **IPv4 address**, and **IPv6 address**.

## <a name="modify"></a>Modify an Exchange peering

In this section, you learn how to modify an Exchange peering.

1. In the search box at the top of the portal, enter ***peering***. Select **Peerings** in the search results.

1. Select the peering resource that you want to modify.

1. Select **Connections**.

### Add Exchange peering connections

1. Select the **+ Add connections** button to add and configure a new peering connection.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/add-connection.png" alt-text="Screenshot shows how to add a new peering connection in the Azure portal." lightbox="./media/how-to-exchange-route-server-portal/add-connection.png":::

1. In **Exchange Peering Connection**, enter or select the required information and then select **Save**. For more information, see [Create and provision an Exchange peering](#create-and-provision-an-exchange-peering).

    :::image type="content" source="./media/how-to-exchange-route-server-portal/exchange-peering-connection.png" alt-text="Screenshot shows the exchange peering connection page in the Azure portal.":::

### Remove Exchange peering connections

1. Right-click the peering connection you want to delete, and then select **Delete connection**.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/delete-connection.png" alt-text="Screenshot shows how to delete a peering connection in the Azure portal." lightbox="./media/how-to-exchange-route-server-portal/delete-connection.png":::

1. Confirm the delete by entering **yes** and then select **Delete**.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/delete-confirmation.png" alt-text="Screenshot shows the confirmation page to delete a peering connection in the Azure portal.":::

### Add an IPv4 or IPv6 session on Active connections

1. Right-click the peering connection you want to delete, and then select **Edit connection**.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/edit-connection.png" alt-text="Screenshot shows how to edit a peering connection in the Azure portal." lightbox="./media/how-to-exchange-route-server-portal/edit-connection.png":::

1. Modify the **IPv4 address** or **IPv6 address** information, and select **Save**.

    :::image type="content" source="./media/how-to-exchange-route-server-portal/edit-exchange-peering-connection.png" alt-text="Screenshot shows the edit peering connection page in the Azure portal.":::

### Remove an IPv4 or IPv6 session on Active connections

To remove an IPv4 or IPv6 session from an existing connection, contact [Microsoft peering](mailto:peeringexperience@microsoft.com). This operation isn't currently supported using the Azure portal.

## <a name="delete"></a>Deprovision an Exchange peering

To deprovision an Exchange peering, contact [Microsoft peering](mailto:peeringexperience@microsoft.com). This operation isn't currently supported using the Azure portal or PowerShell. 

## Related content

- [Internet peering for Peering Service Exchange with Route Server partner walkthrough](walkthrough-exchange-route-server-partner.md).
- [Convert a legacy Exchange peering to an Azure resource using the Azure portal](howto-legacy-exchange-portal.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).
