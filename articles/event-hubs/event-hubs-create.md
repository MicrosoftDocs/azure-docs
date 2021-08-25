---
title: Azure Quickstart - Create an event hub using the Azure portal
description: In this quickstart, you learn how to create an Azure event hub using Azure portal.
ms.topic: quickstart
ms.date: 05/25/2021
---

# Quickstart: Create an event hub using Azure portal
Azure Event Hubs is a Big Data streaming platform and event ingestion service that can receive and process millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

In this quickstart, you create an event hub using the [Azure portal](https://portal.azure.com).

## Prerequisites

To complete this quickstart, make sure that you have:

- Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. To create a resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left navigation, select **Resource groups**. Then select **Add**.

   ![Resource groups - Add button](./media/event-hubs-quickstart-portal/resource-groups1.png)

1. For **Subscription**, select the name of the Azure subscription in which you want to create the resource group.
1. Type a unique **name for the resource group**. The system immediately checks to see if the name is available in the currently selected Azure subscription.
1. Select a **region** for the resource group.
1. Select **Review + Create**.

   ![Resource group - create](./media/event-hubs-quickstart-portal/resource-groups2.png)
1. On the **Review + Create** page, select **Create**. 

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, in which you create one or more event hubs. To create a namespace in your resource group using the portal, do the following actions:

1. In the Azure portal, and select **Create a resource** at the top left of the screen.
1. Select **All services** in the left menu, and select **star (`*`)** next to **Event Hubs** in the **Analytics** category. Confirm that **Event Hubs** is added to **FAVORITES** in the left navigational menu. 
    
   ![Search for Event Hubs](./media/event-hubs-quickstart-portal/select-event-hubs-menu.png)
1. Select **Event Hubs** under **FAVORITES** in the left navigational menu, and select **Add** on the toolbar.

   ![Add button](./media/event-hubs-quickstart-portal/event-hubs-add-toolbar.png)
1. On the **Create namespace** page, take the following steps:  
   1. Select the **subscription** in which you want to create the namespace.  
   1. Select the **resource group** you created in the previous step.   
   1. Enter a **name** for the namespace. The system immediately checks to see if the name is available.  
   1. Select a **location** for the namespace.
   1. Choose **Basic** for the **pricing tier**. To learn about differences between tiers, see [Quotas and limits](event-hubs-quotas.md), [Event Hubs Premium](event-hubs-premium-overview.md), and [Event Hubs Dedicated](event-hubs-dedicated-overview.md) articles. 
   1. Leave the **throughput units** (for standard tier) or **processing units** (for premium tier) settings as it is. To learn about throughput units or processing units: [Event Hubs scalability](event-hubs-scalability.md).  
   1. Select **Review + Create** at the bottom of the page.
      
      ![Create an event hub namespace](./media/event-hubs-quickstart-portal/create-event-hub1.png)
   1. On the **Review + Create** page, review the settings, and select **Create**. Wait for the deployment to complete. 
      
      ![Review + create page](./media/event-hubs-quickstart-portal/review-create.png)
      
   1. On the **Deployment** page, select **Go to resource** to navigate to the page for your namespace. 
      
      ![Deployment complete - go to resource](./media/event-hubs-quickstart-portal/deployment-complete.png)  
   1. Confirm that you see the **Event Hubs Namespace** page similar to the following example:   
      
      ![Home page for the namespace](./media/event-hubs-quickstart-portal/namespace-home-page.png)       

      > [!NOTE]
      > Azure Event Hubs provides you with a Kafka endpoint. This endpoint enables your Event Hubs namespace to natively understand [Apache Kafka](https://kafka.apache.org/intro) message protocol and APIs. With this capability, you can communicate with your event hubs as you would with Kafka topics without changing your protocol clients or running your own clusters. Event Hubs supports [Apache Kafka versions 1.0](https://kafka.apache.org/10/documentation.html) and later. For more information, see [Use Event Hubs from Apache Kafka applications](event-hubs-for-kafka-ecosystem-overview.md).
    
## Create an event hub

To create an event hub within the namespace, do the following actions:

1. On the Event Hubs Namespace page, select **Event Hubs** in the left menu.
1. At the top of the window, select **+ Event Hub**.
   
    ![Add Event Hub - button](./media/event-hubs-quickstart-portal/create-event-hub4.png)
1. Type a name for your event hub, then select **Create**.
   
    ![Create event hub](./media/event-hubs-quickstart-portal/create-event-hub5.png)

    The **partition count** setting allows you to parallelize consumption across many consumers. For more information, see [Partitions](event-hubs-scalability.md#partitions).

    The **message retention** setting specifies how long the Event Hubs service keeps data. For more information, see [Event retention](event-hubs-features.md#event-retention).
1. You can check the status of the event hub creation in alerts. After the event hub is created, you see it in the list of event hubs.

    ![Event hub created](./media/event-hubs-quickstart-portal/event-hub-created.png)
    
## Next steps

In this article, you created a resource group, an Event Hubs namespace, and an event hub. For step-by-step instructions to send events to (or) receive events from an event hub, see these tutorials: 

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
- [Go](event-hubs-go-get-started-send.md)
- [C (send only)](event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](event-hubs-storm-getstarted-receive.md)


[Azure portal]: https://portal.azure.com/
[3]: ./media/event-hubs-quickstart-portal/sender1.png
[4]: ./media/event-hubs-quickstart-portal/receiver1.png
