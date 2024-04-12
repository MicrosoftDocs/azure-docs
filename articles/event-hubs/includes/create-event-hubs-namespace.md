---
title: Create an Azure Event Hubs namespace (portal)
description: This article shows you how to create an Event Hubs namespace in the Azure portal. 
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 02/29/2024
ms.author: spelluru
---

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, in which you create one or more event hubs. To create a namespace in your resource group using the portal, do the following actions:

1. In the Azure portal, select **All services** in the left menu, and select **star (`*`)** next to **Event Hubs** in the **Analytics** category. Confirm that **Event Hubs** is added to **FAVORITES** in the left navigational menu. 

    :::image type="content" source="./media/create-event-hubs-namespace/select-event-hubs-menu.png" alt-text="Screenshot showing the selection of Event Hubs in the All services page.":::
1. Select **Event Hubs** under **FAVORITES** in the left navigational menu, and select **Create** on the toolbar.

    :::image type="content" source="./media/create-event-hubs-namespace/event-hubs-add-toolbar.png" alt-text="Screenshot showing the selection of Create button on the Event hubs page.":::
1. On the **Create namespace** page, take the following steps:  
   1. Select the **subscription** in which you want to create the namespace.  
   1. Select the **resource group** you created in the previous step.   
   1. Enter a **name** for the namespace. The system immediately checks to see if the name is available.  
   1. Select a **location** for the namespace.
   1. Choose **Basic** for the **pricing tier**. If you plan to use the namespace from **Apache Kafka** apps, use the **Standard** tier. The basic tier doesn't support Apache Kafka workloads. To learn about differences between tiers, see [Quotas and limits](../event-hubs-quotas.md), [Event Hubs Premium](../event-hubs-premium-overview.md), and [Event Hubs Dedicated](../event-hubs-dedicated-overview.md) articles. 
   1. Leave the **throughput units** (for standard tier) or **processing units** (for premium tier) settings as it is. To learn about throughput units or processing units: [Event Hubs scalability](../event-hubs-scalability.md).  
   1. Select **Review + Create** at the bottom of the page.

        :::image type="content" source="./media/create-event-hubs-namespace/create-event-hub1.png" alt-text="Screenshot of the Create Namespace page in the Azure portal.":::
   1. On the **Review + Create** page, review the settings, and select **Create**. Wait for the deployment to complete.       
1. On the **Deployment** page, select **Go to resource** to navigate to the page for your namespace. 

      :::image type="content" source="./media/create-event-hubs-namespace/deployment-complete.png" alt-text="Screenshot of the Deployment complete page with the link to resource.":::
1. Confirm that you see the **Event Hubs Namespace** page similar to the following example:   

      :::image type="content" source="./media/create-event-hubs-namespace/namespace-home-page.png" lightbox="./media/create-event-hubs-namespace/namespace-home-page.png" alt-text="Screenshot of the home page for your Event Hubs namespace in the Azure portal.":::
    
