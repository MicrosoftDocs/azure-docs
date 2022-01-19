---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: derekolo
ms.service: internet-peering
ms.topic: include
ms.date: 3/18/2020
ms.author: derekol
---

1. Select a peering connection you want to enable for Azure Peering Service. Then select **...** > **Edit connection**.
    > [!div class="mx-imgBorder"]
    > ![Peering connection Edit connection](../media/setup-direct-modify-editconnection.png)
1. Under **Use for Peering Service**, select **Enabled** and then select **Save**.
    > [!div class="mx-imgBorder"]
    > ![Peering connection Enable Peering Service](../media/setup-direct-modify-editconnectionsettings-peering-service.png)
1. On the **Overview** screen, you see the deployment details. After your deployment is finished, select **Go to resource**.
    > [!div class="mx-imgBorder"]
    > ![Your deployment is complete](../media/setup-direct-modify-overview-deployment-complete.png)

1. On the **Registered Prefixes** pane, select **Add registered prefix**.
    > [!div class="mx-imgBorder"]
    > ![Add registered prefix](../media/setup-direct-modify-add-registered-prefix.png)
1. Register a prefix by selecting a **Name** and a **Prefix** and selecting **Save**.
    > [!div class="mx-imgBorder"]
    >  ![Register a prefix](../media/setup-direct-modify-register-a-prefix.png) 

1. After a prefix is created, you see it in the list of **Registered Prefixes**. Select the **Name** of the prefix to see more details.
    > [!div class="mx-imgBorder"]
    > ![Registered prefixes and connections](../media/setup-direct-modify-registered-prefixes.png)
1. On the registered prefix page, you see the full details, which include the **Prefix key** for each prefix. This key must be provided to the customer allocated this prefix from their provider ISP. The customer can then register their prefix within their subscription by using this key.
    > [!div class="mx-imgBorder"]
    > ![Prefix with prefix key](../media/setup-direct-modify-registered-prefix-detail.png)