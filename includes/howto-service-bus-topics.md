---
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 11/25/2018
ms.author: spelluru
---
## What are Service Bus topics and subscriptions?
Service Bus topics and subscriptions support a *publish/subscribe* messaging communication model. When using topics and subscriptions, components of a distributed application do not communicate directly with each other; instead they exchange messages via a topic, which acts as an intermediary.

![TopicConcepts](./media/howto-service-bus-topics/sb-topics-01.png)

In contrast with Service Bus queues, where each message is processed by a single consumer, topics and subscriptions provide a "one-to-many" form of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a topic, it is then made available to each subscription to handle/process independently.

A subscription to a topic resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis. Filter rules enable you to filter or restrict which messages to a topic are received by which topic subscriptions.

Service Bus topics and subscriptions enable you to scale and process a large number of messages across many users and applications.

[Azure portal]: https://portal.azure.com
[create-namespace]: ./media/howto-service-bus-topics/create-namespace.png
[connection-info]: ./media/howto-service-bus-topics/connection-info.png
[connection-string]: ./media/howto-service-bus-topics/connection-string.png


