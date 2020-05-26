---
title: Azure Quickstart - Create an event hub using the Azure portal
description: In this quickstart, you learn how to create an Azure event hub using Azure portal and then send and receive events using .NET Standard SDK.
services: event-hubs
documentationcenter: ''
author: spelluru

ms.service: event-hubs
ms.topic: quickstart
ms.custom: mvc
ms.date: 05/04/2020
ms.author: spelluru
#Customer intent: How do I stream data and process telemetry from an event hub? 

---

# Quickstart: Create an event hub using Azure portal
Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

In this quickstart, you create an event hub using the [Azure portal](https://portal.azure.com).

## Prerequisites

To complete this quickstart, make sure that you have:

- Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio 2019)](https://www.visualstudio.com/vs) or later.
- [.NET Standard SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. To create a resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the left navigation, click **Resource groups**. Then click **Add**.

   ![Resource groups - Add button](./media/event-hubs-quickstart-portal/resource-groups1.png)

2. For **Subscription**, select the name of the Azure subscription in which you want to create the resource group.
3. Type a unique **name for the resource group**. The system immediately checks to see if the name is available in the currently selected Azure subscription.
4. Select a **region** for the resource group.
5. Select **Review + Create**.

   ![Resource group - create](./media/event-hubs-quickstart-portal/resource-groups2.png)
6. On the **Review + Create** page, select **Create**. 

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its fully qualified domain name, in which you create one or more event hubs. To create a namespace in your resource group using the portal, do the following actions:

1. In the Azure portal, and click **Create a resource** at the top left of the screen.
2. Select **All services** in the left menu, and select **star (`*`)** next to **Event Hubs** in the **Analytics** category. Confirm that **Event Hubs** is added to **FAVORITES** in the left navigational menu. 
    
   ![Search for Event Hubs](./media/event-hubs-quickstart-portal/select-event-hubs-menu.png)
3. Select **Event Hubs** under **FAVORITES** in the left navigational menu, and select **Add** on the toolbar.

   ![Add button](./media/event-hubs-quickstart-portal/event-hubs-add-toolbar.png)
4. On the **Create namespace** page, take the following steps:
    1. Select the **subscription** in which you want to create the namespace.
    2. Select the **resource group** you created in the previous step. 
    3. Enter a **name** for the namespace. The system immediately checks to see if the name is available.
    4. Select a **location** for the namespace.    
    5. Choose the **pricing tier** (Basic or Standard).  
    6. Leave the **throughput units** settings as it is. To learn about throughput units, see [Event Hubs scalability](event-hubs-scalability.md#throughput-units)  
    5. Select **Review + Create** at the bottom of the page.

       ![Create an event hub namespace](./media/event-hubs-quickstart-portal/create-event-hub1.png)
   6. On the **Review + Create** page, review the settings, and select **Create**. Wait for the deployment to complete. 

       ![Review + create page](./media/event-hubs-quickstart-portal/review-create.png)
   7. On the **Deployment** page, select **Go to resource** to navigate to the page for your namespace. 

      ![Deployment complete - go to resource](./media/event-hubs-quickstart-portal/deployment-complete.png)
   8. Confirm that you see the **Event Hubs Namespace** page similar to the following example: 

       ![Home page for the namespace](./media/event-hubs-quickstart-portal/namespace-home-page.png)       

       > [!NOTE]
       > Azure Event Hubs provides you with a Kafka endpoint. This endpoint enables your Event Hubs namespace to natively understand [Apache Kafka](https://kafka.apache.org/intro) message protocol and APIs. With this capability, you can communicate with your event hubs as you would with Kafka topics without changing your protocol clients or running your own clusters. Event Hubs supports [Apache Kafka versions 1.0](https://kafka.apache.org/10/documentation.html) and later. For more information, see [Use Event Hubs from Apache Kafka applications](event-hubs-for-kafka-ecosystem-overview.md).
    
## Create an event hub

To create an event hub within the namespace, do the following actions:

1. On the Event Hubs Namespace page, select **Event Hubs** in the left menu.
1. At the top of the window, click **+ Event Hub**.
   
    ![Add Event Hub - button](./media/event-hubs-quickstart-portal/create-event-hub4.png)
1. Type a name for your event hub, then click **Create**.
   
    ![Create event hub](./media/event-hubs-quickstart-portal/create-event-hub5.png)
4. You can check the status of the event hub creation in alerts. After the event hub is created, you see it in the list of event hubs as shown in the following image:

    ![Event hub created](./media/event-hubs-quickstart-portal/event-hub-created.png)

## Next steps

In this article, you created a resource group, an Event Hubs namespace, and an event hub. For step-by-step instructions to send events to (or) receive events from an event hub, see the **Send and receive events** tutorials: 

- [.NET Core](get-started-dotnet-standard-send-v2.md)
- [Java](get-started-java-send-v2.md)
- [Python](get-started-python-send-v2.md)
- [JavaScript](get-started-node-send-v2.md)
- [Go](event-hubs-go-get-started-send.md)
- [C (send only)](event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](event-hubs-storm-getstarted-receive.md)


[Azure portal]: https://portal.azure.com/
[3]: ./media/event-hubs-quickstart-portal/sender1.png
[4]: ./media/event-hubs-quickstart-portal/receiver1.png
