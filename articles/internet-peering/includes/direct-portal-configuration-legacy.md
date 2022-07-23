---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: halkazwini
---

1. On the **Create a Peering** page, on the **Configuration** tab, fill in the boxes as shown here.

    > [!div class="mx-imgBorder"]
    > ![Create a Peering page Configuration tab](../media/setup-direct-conf-tab.png)

    * For **Peering type**, select **Direct**.
    * For **Microsoft network**, select **AS8075**. Don't select ASN 8069. It's reserved for special applications and only used by [Microsoft peering](mailto:peering@microsoft.com).
    * Select **SKU** as **Basic Free**. Don't select Premium Free because it's reserved for special applications.
    * Select the **Metro** location where you want to convert peering to an Azure resource. If you have peering connections with Microsoft in the selected **Metro** location that aren't converted to an Azure resource, these connections will be listed in the **Peering connections** section as shown. You can now convert these peering connections to an Azure resource.

        > [!div class="mx-imgBorder"]
        > ![Peering connections list](../media/setup-directlegacy-conf-tab.png)

1. If you need to update bandwidth, select the edit button for a line to modify connection settings.

    > [!div class="mx-imgBorder"]
    > ![Edit button](../media/setup-directlegacy-conf-tab-edit.png)

    > [!NOTE]
    > If you want to add additional peering connections with Microsoft in the selected **Metro** location, select **Create new**. For more information, see [Create or modify a Direct peering by using the portal](../howto-direct-portal.md).
    >

1. Select **Review + create**. Notice that the portal runs basic validation of the information you entered. A ribbon at the top displays the message *Running final validation...*.

    > [!div class="mx-imgBorder"]
    > ![Peering Validation tab](../media/setup-direct-review-tab-validation.png)

1. After the message changes to *Validation passed*, verify your information. Submit the request by selecting **Create**. To modify your request, select **Previous** and repeat the steps.

    > [!div class="mx-imgBorder"]
    > ![Peering submission](../media/setup-direct-review-tab-submit.png)

1. After you submit the request, wait for the deployment to finish. If deployment fails, contact [Microsoft peering](mailto:peering@microsoft.com). A successful deployment appears as shown here.

    > [!div class="mx-imgBorder"]
    > ![Peering success](../media/setup-direct-success.png)
