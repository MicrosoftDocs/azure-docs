---
title: Use the Azure portal to create Service Bus topics and subscriptions
description: 'Quickstart: In this quickstart, you learn how to create a Service Bus topic and subscriptions to that topic by using the Azure portal.'
author: spelluru
ms.author: spelluru
ms.date: 11/28/2023
ms.topic: quickstart
ms.custom: mode-ui
#Customer intent: In a retail scenario, how do I update inventory assortment and send a set of messages from the back office to the stores?
---

# Use the Azure portal to create a Service Bus topic and subscriptions to the topic
In this quickstart, you use the Azure portal to create a Service Bus topic and then create subscriptions to that topic. 

## What are Service Bus topics and subscriptions?
Service Bus topics and subscriptions support a *publish/subscribe* messaging communication model. When you use topics and subscriptions, components of a distributed application don't communicate directly with each other; instead they exchange messages via a topic, which acts as an intermediary.

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/sb-topics-01.png" alt-text="Image showing how topics and subscriptions work.":::

In contrast with Service Bus queues, in which each message is processed by a single consumer, topics and subscriptions provide a one-to-many form of communication, using a publish/subscribe pattern. It's possible to register multiple subscriptions to a topic. When a message is sent to a topic, it's then made available to each subscription to handle/process independently. A subscription to a topic resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on subscriptions, which allows you to filter or restrict which messages to a topic are received by which topic subscriptions.

Service Bus topics and subscriptions enable you to scale to process a large number of messages across a large number of users and applications.

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topics-three-subscriptions-portal](./includes/service-bus-create-topics-three-subscriptions-portal.md)]

## Next steps
In this article, you created a Service Bus namespace, a topic in the namespace, and three subscriptions to the topic. To learn how to publish messages to the topic and subscribe for messages from a subscription, see one of the following quickstarts in the **Publish and subscribe for messages** section. 

- [.NET](service-bus-dotnet-how-to-use-topics-subscriptions.md)
- [Java](service-bus-java-how-to-use-topics-subscriptions.md)
- [JavaScript](service-bus-nodejs-how-to-use-topics-subscriptions.md)
- [Python](service-bus-python-how-to-use-topics-subscriptions.md)
- [PHP](service-bus-php-how-to-use-topics-subscriptions.md)
