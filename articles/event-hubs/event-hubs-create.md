---
title: Create an Azure event hub | Microsoft Docs
description: Create an Azure Event Hubs namespace and an event hub using the Azure portal
services: event-hubs
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 08/16/2018
ms.author: shvija

---

# Create an Event Hubs namespace and an event hub using the Azure portal

## Create an Event Hubs namespace

1. Log on to the [Azure portal][Azure portal], and click **Create a resource** at the top left of the screen.
2. Click **Internet of Things**, and then click **Event Hubs**.
   
    ![](./media/event-hubs-create/create-event-hub9.png)

3. In **Create namespace**, enter a namespace name. The system immediately checks to see if the name is available.  

4. After making sure the namespace name is available, choose the pricing tier (Basic or Standard). Also, choose an Azure subscription, resource group, and location in which to create the resource.
 
5. Click **Create** to create the namespace. You may have to wait a few minutes for the system to fully provision the resources.

    ![](./media/event-hubs-create/create-event-hub1.png)

6. In the portal list of namespaces, click the newly created namespace.

7. Click **Shared access policies**, and then click **RootManageSharedAccessKey**.
    
    ![](./media/event-hubs-create/create-event-hub7.png)

8. Click the copy button to copy the **RootManageSharedAccessKey** connection string to the clipboard. Save this connection string in a temporary location, such as Notepad, to use later.
    
    ![](./media/event-hubs-create/create-event-hub8.png)

## Create an event hub

1. In the Event Hubs namespace list, click the newly created namespace.      
   
    ![](./media/event-hubs-create/create-event-hub2.png) 

2. In the namespace blade, click **Event Hubs**.
   
    ![](./media/event-hubs-create/create-event-hub3.png)

3. At the top of the blade, click **+ Event Hub**.
   
    ![](./media/event-hubs-create/create-event-hub4.png)
4. Type a name for your event hub, then click **Create**. 

Your event hub is now created, and you have the connection strings you need to send and receive events.

## Next steps

To learn more about Event Hubs, visit these links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Event Hubs API overview](event-hubs-api-overview.md)

[Azure portal]: https://portal.azure.com/