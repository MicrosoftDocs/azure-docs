---
title: Create Apache Kafka enabled event hub - Azure Event Hubs | Microsoft Docs
description: This article provides a walkthrough for creating an Apache Kafka enabled Azure Event Hubs namespace by using the Azure portal.
services: event-hubs
documentationcenter: .net
author: basilhariri
manager: timlt

ms.service: event-hubs
ms.devlang: dotnet
ms.topic: article
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: bahariri

---

# Create Apache Kafka enabled event hubs

Azure Event Hubs is a Big Data streaming Platform as a Service (PaaS) that ingests millions of events per second, and provides low latency and high throughput for real-time analytics and visualization.

Azure Event Hubs provides you with a Kafka endpoint. This endpoint enables your Event Hubs namespace to natively understand [Apache Kafka](https://kafka.apache.org/intro) message protocol and APIs. With this capability, you can communicate with your event hubs as you would with Kafka topics without changing your protocol clients or running your own clusters. Event Hubs supports [Apache Kafka versions 1.0](https://kafka.apache.org/10/documentation.html) and later.

This article describes how to create an Event Hubs namespace and get the connection string required to connect Kafka applications to Kafka-enabled event hubs.

## Prerequisites

If you do not have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Create a Kafka enabled Event Hubs namespace

1. Sign in to the [Azure portal][Azure portal], and click **Create a resource** at the top left of the screen.

2. Search for Event Hubs and select the options shown here:
    
    ![Search for Event Hubs in the portal](./media/event-hubs-create-kafka-enabled/event-hubs-create-event-hubs.png)
 
3. Provide a unique name and enable Kafka on the namespace. Click **Create**.
    
    ![Create a namespace](./media/event-hubs-create-kafka-enabled/create-kafka-namespace.jpg)
 
4. Once the namespace is created, on the **Settings** tab click **Shared access policies** to get the connection string.

    ![Click Shared access policies](./media/event-hubs-create/create-event-hub7.png)

5. You can choose the default **RootManageSharedAccessKey**, or add a new policy. Click the policy name and copy the connection string. 
    
    ![Select a policy](./media/event-hubs-create/create-event-hub8.png)
 
6. Add this connection string to your Kafka application configuration.

You can now stream events from your applications that use the Kafka protocol into Event Hubs.

## Next steps

To learn more about Event Hubs, visit these links:

* [Stream into Event Hubs from your Kafka applications](event-hubs-quickstart-kafka-enabled-event-hubs.md)
* [Learn about Event Hubs for Kafka](event-hubs-for-kafka-ecosystem-overview.md)
* [Learn about Event Hubs](event-hubs-what-is-event-hubs.md)


[Azure portal]: https://portal.azure.com/
