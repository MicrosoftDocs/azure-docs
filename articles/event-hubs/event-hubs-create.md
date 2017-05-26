---
title: Create an Azure event hub | Microsoft Docs
description: Create an Azure Event Hubs namespace and an event hub using the Azure portal
services: event-hubs
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: ff99e327-c8db-4354-9040-9c60c51a2191
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/03/2017
ms.author: jotaub
---

# Create an Event Hubs namespace and an event hub using the Azure portal

## Create an Event Hubs namespace
1. Log on to the [Azure portal][Azure portal], and click **New** at the top left of the screen.
1. Click **Internet of Things**, and then click **Event Hubs**.
   
    ![](./media/event-hubs-create/create-event-hub9.png)
1. In the **Create namespace** blade, enter a namespace name. The system immediately checks to see if the name is available.
   
    ![](./media/event-hubs-create/create-event-hub1.png)
1. After making sure the namespace name is available, choose the pricing tier (Basic or Standard). Also, choose an Azure subscription, resource group, and location in which to create the resource. 
1. Click **Create** to create the namespace.
1. In the Event Hubs namespace list, click the newly-created namespace.      
   
    ![](./media/event-hubs-create/create-event-hub2.png)
1. In the namespace blade, click **Event Hubs**.
   
    ![](./media/event-hubs-create/create-event-hub3.png)

## Create an event hub

1. At the top of the blade, click **Add Event Hub**.
   
    ![](./media/event-hubs-create/create-event-hub4.png)
1. Type a name for your event hub, then click **Create**.
   
    ![](./media/event-hubs-create/create-event-hub5.png)
1. In the list of event hubs, click the newly created event hub name. 
    
    ![](./media/event-hubs-create/create-event-hub6.png)
1. Back in the namespace blade (not the specific event hub blade), click **Shared access policies**, and then click **RootManageSharedAccessKey**.
    
    ![](./media/event-hubs-create/create-event-hub7.png)
1. Click the copy button to copy the **RootManageSharedAccessKey** connection string to the clipboard. Save this connection string to use later in the tutorial.
    
    ![](./media/event-hubs-create/create-event-hub8.png)

Your event hub is now created, and you have the connection strings you need to send and receive events.

## Next steps
To learn more about Event Hubs, visit these links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Event Hubs API overview](event-hubs-api-overview.md)

[Azure portal]: https://portal.azure.com/