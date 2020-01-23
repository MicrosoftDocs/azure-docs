---
title: Use the Azure portal to create Service Bus topics and subscriptions
description: 'Quickstart: In this quickstart, you learn how to create a Service Bus topic and subscriptions to that topic by using the Azure portal.' 
services: service-bus-messaging
author: spelluru
manager: timlt

ms.service: service-bus-messaging
ms.topic: quickstart
ms.date: 01/16/2020
ms.author: spelluru
# Customer intent: In a retail scenario, how do I update inventory assortment and send a set of messages from the back office to the stores?

---

# Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic
In this quickstart, you use the Azure portal to create a Service Bus topic and then create subscriptions to that topic. 

## What are Service Bus topics and subscriptions?
Service Bus topics and subscriptions support a *publish/subscribe* messaging communication model. When using topics and subscriptions, components of a distributed application do not communicate directly with
each other; instead they exchange messages via a topic, which acts as an intermediary.

![TopicConcepts](./media/service-bus-java-how-to-use-topics-subscriptions/sb-topics-01.png)

In contrast with Service Bus queues, in which each message is processed by a single consumer, topics and subscriptions provide a one-to-many form of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a topic, it is then made available to each subscription to handle/process independently. A subscription to a topic resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to filter or restrict which messages to a topic are received by which topic subscriptions.

Service Bus topics and subscriptions enable you to scale to process a large number of messages across a large number of users and applications.

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topics-three-subscriptions-portal](../../includes/service-bus-create-topics-three-subscriptions-portal.md)]

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps
To learn how to send messages to a topic and receive those messages via a subscription, see the following article: select the programming language in the TOC. 

> [!div class="nextstepaction"]
> [Publish and subscribe for messages](service-bus-dotnet-how-to-use-topics-subscriptions.md)
