---
title: Azure Service Bus messaging - queues, topics, and subscriptions
description: This article provides an overview of Azure Service Bus messaging entities (queue, topics, and subscriptions).
ms.topic: conceptual
ms.custom: devx-track-extended-java
ms.date: 10/11/2022
---

# Service Bus queues, topics, and subscriptions

Azure Service Bus supports reliable message queuing and durable publish/subscribe messaging. The messaging entities that form the core of the messaging capabilities in Service Bus are **queues**, **topics and subscriptions**.

> [!IMPORTANT]
> If you are new to Azure Service Bus, read through [What is Azure Service Bus?](service-bus-messaging-overview.md) before going through this article. 

## Queues

Queues offer **First In, First Out** (FIFO) message delivery to one or more competing consumers. That is, receivers typically receive and process messages in the order in which they were added to the queue. And, only one message consumer receives and processes each message. 

:::image type="content" source="./media/service-bus-messaging-overview/about-service-bus-queue.png" alt-text="Image showing how Service Queues work.":::

A key benefit of using queues is to achieve **temporal decoupling of application components**. In other words, the producers (senders) and consumers (receivers) don't have to send and receive messages at the same time. That's because messages are stored durably in the queue. Furthermore, the producer doesn't have to wait for a reply from the consumer to continue to process and send messages.

A related benefit is **load-leveling**, which enables producers and consumers to send and receive messages at different rates. In many applications, the system load varies over time. However, the processing time required for each unit of work is typically constant. Intermediating message producers and consumers with a queue means that the consuming application only has to be able to handle average load instead of peak load. The depth of the queue grows and contracts as the incoming load varies. This capability directly saves money regarding the amount of infrastructure required to service the application load. As the load increases, more worker processes can be added to read from the queue. Each message is processed by only one of the worker processes. Furthermore, this pull-based load balancing allows for best use of the worker computers even if the worker computers with processing power pull messages at their own maximum rate. This pattern is often termed the **competing consumer** pattern.

Using queues to intermediate between message producers and consumers provides an inherent loose coupling between the components. Because producers and consumers aren't aware of each other, a consumer can be **upgraded** without having any effect on the producer.

### Create queues

You can create queues using one of the following options:

- [Azure portal](service-bus-quickstart-portal.md)
- [PowerShell](service-bus-quickstart-powershell.md)
- [CLI](service-bus-quickstart-cli.md)
- [Azure Resource Manager templates (ARM templates)](service-bus-resource-manager-namespace-queue.md). 

Then, send and receive messages using clients written in programming languages including the following ones:

- [C#](service-bus-dotnet-get-started-with-queues.md)
- [Java](service-bus-java-how-to-use-queues.md)
- [Python](service-bus-python-how-to-use-queues.md)
- [JavaScript](service-bus-nodejs-how-to-use-queues.md). 

### Receive modes

You can specify two different modes in which consumers can receive messages from Service Bus.

- **Receive and delete**. In this mode, when Service Bus receives the request from the consumer, it marks the message as being consumed and returns it to the consumer application. This mode is the simplest model. It works best for scenarios in which the application can tolerate not processing a message if a failure occurs. To understand this scenario, consider a scenario in which the consumer issues the receive request and then crashes before processing it. As Service Bus marks the message as consumed, the application begins consuming messages upon restart. It will miss the message that it consumed before the crash. This process is often called **at-most once** processing.
- **Peek lock**. In this mode, the receive operation becomes two-stage, which makes it possible to support applications that can't tolerate missing messages. 
    1. Finds the next message to be consumed, **locks** it to prevent other consumers from receiving it, and then, return the message to the application. 
    1. After the application finishes processing the message, it requests the Service Bus service to complete the second stage of the receive process. Then, the service **marks the message as consumed**. 

        If the application is unable to process the message for some reason, it can request the Service Bus service to **abandon** the message. Service Bus **unlocks** the message and makes it available to be received again, either by the same consumer or by another competing consumer. Secondly, there's a **timeout** associated with the lock. If the application fails to process the message before the lock timeout expires, Service Bus unlocks the message and makes it available to be received again.

        If the application crashes after it processes the message, but before it requests the Service Bus service to complete the message, Service Bus redelivers the message to the application when it restarts. This process is often called **at-least once** processing. That is, each message is processed at least once. However, in certain situations the same message may be redelivered. If your scenario can't tolerate duplicate processing, add additional logic in your application to detect duplicates. For more information, see [Duplicate detection](duplicate-detection.md), which is known as **exactly once** processing.

        > [!NOTE]
        > For more information about these two modes, see [Settling receive operations](message-transfers-locks-settlement.md#settling-receive-operations).

## Topics and subscriptions

A queue allows processing of a message by a single consumer. In contrast to queues, topics and subscriptions provide a one-to-many form of communication in a **publish and subscribe** pattern. It's useful for scaling to large numbers of recipients. Each published message is made available to each subscription registered with the topic. Publisher sends a message to a topic and one or more subscribers receive a copy of the message. 

:::image type="content" source="./media/service-bus-messaging-overview/about-service-bus-topic.png" alt-text="Image showing a Service Bus topic with three subscriptions.":::

The subscriptions can use additional filters to restrict the messages that they want to receive. Publishers send messages to a topic in the same way that they send messages to a queue. But, consumers don't receive messages directly from the topic. Instead, consumers receive messages from subscriptions of the topic. A topic subscription resembles a virtual queue that receives copies of the messages that are sent to the topic. Consumers receive messages from a subscription identically to the way they receive messages from a queue.

The message-sending functionality of a queue maps directly to a topic and its message-receiving functionality maps to a subscription. Among other things, this feature means that subscriptions support the same patterns described earlier in this section regarding queues: competing consumer, temporal decoupling, load leveling, and load balancing.


### Create topics and subscriptions

Creating a topic is similar to creating a queue, as described in the previous section. You can create topics and subscriptions using one of the following options:

- [Azure portal](service-bus-quickstart-topics-subscriptions-portal.md)
- [PowerShell](service-bus-quickstart-powershell.md)
- [CLI](service-bus-tutorial-topics-subscriptions-cli.md)
- [ARM templates](service-bus-resource-manager-namespace-topic.md). 

Then, send messages to a topic and receive messages from subscriptions using clients written in programming languages including the following ones:

- [C#](service-bus-dotnet-how-to-use-topics-subscriptions.md)
- [Java](service-bus-java-how-to-use-topics-subscriptions.md)
- [Python](service-bus-python-how-to-use-topics-subscriptions.md)
- [JavaScript](service-bus-nodejs-how-to-use-topics-subscriptions.md). 

### Rules and actions

In many scenarios, messages that have specific characteristics must be processed in different ways. To enable this processing, you can configure subscriptions to find messages that have desired properties and then perform certain modifications to those properties. While Service Bus subscriptions see all messages sent to the topic, it's possible to only copy a subset of those messages to the virtual subscription queue. This filtering is accomplished using subscription filters. Such modifications are called **filter actions**. When a subscription is created, you can supply a filter expression that operates on the properties of the message. The properties can be both the system properties (for example, **Label**) and custom application properties (for example, **StoreName**.) The SQL filter expression is optional in this case. Without a SQL filter expression, any filter action defined on a subscription will be done on all the messages for that subscription.

For a full working example, see the [TopicFilters sample](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples/TopicFilters) on GitHub. For more information about filters, see [Topic filters and actions](topic-filters.md).

## Java message service (JMS) 2.0 entities
The following entities are accessible through the Java message service (JMS) 2.0 API.

  * Temporary queues
  * Temporary topics
  * Shared durable subscriptions
  * Unshared durable subscriptions
  * Shared non-durable subscriptions
  * Unshared non-durable subscriptions

Learn more about the [JMS 2.0 entities](java-message-service-20-entities.md) and about how to [use them](how-to-use-java-message-service-20.md).

## Next steps

Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)

Find samples for the older .NET and Java client libraries below:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/)
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus/MessageBrowse)

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]
