---
title: Create Service Bus Topics and Subscriptions in Azure
description: "Quickstart: In this quickstart, you learn how to create a Service Bus topic and subscriptions to that topic by using the Azure portal."
author: spelluru
ms.author: spelluru
ms.date: 02/13/2026
ms.topic: quickstart
ms.custom: mode-ui
#Customer intent: In a retail scenario, how do I update inventory assortment and send a set of messages from the back office to the stores?
---

# Use the Azure portal to create a Service Bus topic and subscriptions to the topic

In this quickstart, you use the Azure portal to create a Service Bus topic and then create subscriptions to that topic. 

## What are Service Bus topics and subscriptions?

Service Bus topics and subscriptions support a *publish/subscribe* communication model. With this pattern, components of a distributed application don't communicate directly with each other. Instead, they exchange messages through a topic, which acts as an intermediary.

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/service-bus-topics-subscriptions.png" alt-text="Diagram that shows how topics and subscriptions work." lightbox="./media/service-bus-java-how-to-use-topics-subscriptions/service-bus-topics-subscriptions.png":::

Service Bus queues deliver each message to a single consumer. In contrast, topics and subscriptions provide one-to-many communication using a publish/subscribe pattern. You can register multiple subscriptions to a single topic. When a message is sent to the topic, each subscription receives its own copy to process independently.

A subscription works like a virtual queue that receives copies of messages sent to the topic. You can also define filter rules on a subscription to control which messages it receives.

Service Bus topics and subscriptions enable you to scale to process a large number of messages across many users and applications.

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topics-three-subscriptions-portal](./includes/service-bus-create-topics-three-subscriptions-portal.md)]

## Next steps
In this article, you created a Service Bus namespace, a topic in the namespace, and three subscriptions to the topic. To learn how to publish messages to the topic and subscribe for messages from a subscription, see one of the following quickstarts in the **Publish and subscribe for messages** section. 

- [.NET](service-bus-dotnet-how-to-use-topics-subscriptions.md)
- [Java](service-bus-java-how-to-use-topics-subscriptions.md)
- [JavaScript](service-bus-nodejs-how-to-use-topics-subscriptions.md)
- [Python](service-bus-python-how-to-use-topics-subscriptions.md)
