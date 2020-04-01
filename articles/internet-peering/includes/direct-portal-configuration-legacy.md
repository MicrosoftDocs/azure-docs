---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: prmitiki
---

1. On the **Create a Peering** page, under **Configuration** tab, fill out the fields as shown below.

    > [!div class="mx-imgBorder"]
    > ![Peering Configuration - Direct](../media/setup-direct-conf-tab.png)

    * For **Peering type**, select *Direct*.
    * For **Microsoft network**, choose *AS8075*. Do not select ASN 8069. It is reserved for special applications and only used by [Microsoft peering](mailto:peering@microsoft.com).
    * Select **SKU** as *Basic Free*. Do not select *Premium Free* since it is reserved for special applications.
    * Choose the **Metro** location for where you want to convert peering to Azure resource. If you have peering connections with Microsoft in the selected **Metro** location that are not converted to Azure resource, then such connections will be listed in the **Peering connections** section as shown below. You can now convert these peering connections to Azure resource.

        > [!div class="mx-imgBorder"]
        > ![Peering Configuration - Direct - Legacy Connections](../media/setup-directlegacy-conf-tab.png)

1. If you need to update bandwidth click the edit button for a line, as highlighted below, to modify connection settings.

    > [!div class="mx-imgBorder"]
    > ![Peering Configuration - Direct Edit](../media/setup-directlegacy-conf-tab-edit.png)

    > [!NOTE]
    > If you want to add additional peering connections with Microsoft in the selected **Metro** location you may do so by clicking **Create new** button. See [Create or modify a Direct peering using the portal](../howto-direct-portal.md) for more info.
    >

1. Click on **Review + create**. Observe that portal runs basic validation of the information you entered. This is displayed in a ribbon on the top, as *Running final validation...*.

    > [!div class="mx-imgBorder"]
    > ![Peering Validation Tab](../media/setup-direct-review-tab-validation.png)

1. After it turns to *Validation Passed*, verify your information and submit the request by clicking **Create**. If you need to modify your request, click on **Previous** and repeat the steps above.

    > [!div class="mx-imgBorder"]
    > ![Peering Submit](../media/setup-direct-review-tab-submit.png)

1. Once you submit the request, wait for it to complete deployment. If deployment fails, contact [Microsoft peering](mailto:peering@microsoft.com). A successful deployment will appear as below.

    > [!div class="mx-imgBorder"]
    > ![Peering Success](../media/setup-direct-success.png)
