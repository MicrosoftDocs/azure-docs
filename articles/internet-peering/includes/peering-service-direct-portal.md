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

1. Click on a peering connection you want to enable for Peering Service and then, click on the **...** > **Edit connection** button.
    > [!div class="mx-imgBorder"]
    > ![Peering Connection Edit](../media/setup-direct-modify-editconnection.png)
1. Under the section ***Use for Peering Service***, click on **Enabled** and **Save**.
    > [!div class="mx-imgBorder"]
    > ![Peering Connection Enable Peering Service](../media/setup-direct-modify-editconnectionsettings-peering-service.png)
1. In the Overview screen, you will see the deployment details. Once your deployment is complete, click on **Go to resource**.
    > [!div class="mx-imgBorder"]
    > ![Your Deployment is Complete](../media/setup-direct-modify-overview-deployment-complete.png)

1. You will then see under Settings **Registered Prefixes**. Click on **Add Registered Prefix**.
    > [!div class="mx-imgBorder"]
    > ![Registered Prefixes and Connections](../media/setup-direct-modify-add-registered-prefix.png)
1. Register a prefix by selecting a **Name** and a **Prefix** and click **Save**
    > [!div class="mx-imgBorder"]
    >  ![Register a Prefix](../media/setup-direct-modify-register-a-prefix.png) 

1. Once a prefix is created, you will see it in the list of Registered Prefixes. Click on the **Name** of the prefix to see more details.
    > [!div class="mx-imgBorder"]
    > ![Registered Prefixes and Connections](../media/setup-direct-modify-registered-prefixes.png)
1. In the registered prefix page, you will see the full details to include the **Prefix key** for each prefix. This key will need to be provided to the customer allocated this prefix from their provider ISP. The customer can then register their prefix within their subscription with this key.
    > [!div class="mx-imgBorder"]
    > ![Prefix with prefix key](../media/setup-direct-modify-registered-prefix-detail.png)