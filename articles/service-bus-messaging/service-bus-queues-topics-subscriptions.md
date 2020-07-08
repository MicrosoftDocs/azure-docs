---
title: Azure Service Bus messaging - queues, topics, and subscriptions
description: This article provides an overview of Azure Service Bus messaging entities (queue, topics, and subscriptions).
ms.topic: article
ms.date: 06/23/2020
---

# Service Bus queues, topics, and subscriptions

Microsoft Azure Service Bus supports a set of cloud-based, message-oriented middleware technologies including reliable message queuing and durable publish/subscribe messaging. These "brokered" messaging capabilities can be thought of as decoupled messaging features that support publish-subscribe, temporal decoupling, and load-balancing scenarios using the Service Bus messaging workload. Decoupled communication has many advantages; for example, clients and servers can connect as needed and perform their operations in an asynchronous fashion.

The messaging entities that form the core of the messaging capabilities in Service Bus are queues, topics and subscriptions, and rules/actions.

## Queues

Queues offer *First In, First Out* (FIFO) message delivery to one or more competing consumers. That is, receivers typically receive and process messages in the order in which they were added to the queue, and only one message consumer receives and processes each message. A key benefit of using queues is to achieve "temporal decoupling" of application components. In other words, the producers (senders) and consumers (receivers) do not have to be sending and receiving messages at the same time, because messages are stored durably in the queue. Furthermore, the producer does not have to wait for a reply from the consumer in order to continue to process and send messages.

A related benefit is "load leveling," which enables producers and consumers to send and receive messages at different rates. In many applications, the system load varies over time; however, the processing time required for each unit of work is typically constant. Intermediating message producers and consumers with a queue means that the consuming application only has to be provisioned to be able to handle average load instead of peak load. The depth of the queue grows and contracts as the incoming load varies. This capability directly saves money with regard to the amount of infrastructure required to service the application load. As the load increases, more worker processes can be added to read from the queue. Each message is processed by only one of the worker processes. Furthermore, this pull-based load balancing allows for optimum use of the worker computers even if the worker computers differ with regard to processing power, as they pull messages at their own maximum rate. This pattern is often termed the "competing consumer" pattern.

Using queues to intermediate between message producers and consumers provides an inherent loose coupling between the components. Because producers and consumers are not aware of each other, a consumer can be upgraded without having any effect on the producer.

### Create queues

You create queues using the [Azure portal](service-bus-quickstart-portal.md), [PowerShell](service-bus-quickstart-powershell.md), [CLI](service-bus-quickstart-cli.md), or [Resource Manager templates](service-bus-resource-manager-namespace-queue.md). You then send and receive messages using a [QueueClient](/dotnet/api/microsoft.azure.servicebus.queueclient) object.

To quickly learn how to create a queue, then send and receive messages to and from the queue, see the [quickstarts](service-bus-quickstart-portal.md) for each method. For a more in-depth tutorial on how to use queues, see [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md).

For a working sample, see the [BasicSendReceiveUsingQueueClient sample](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient) on GitHub.

### Receive modes

You can specify two different modes in which Service Bus receives messages: *ReceiveAndDelete* or *PeekLock*. In the [ReceiveAndDelete](/dotnet/api/microsoft.azure.servicebus.receivemode) mode, the receive operation is single-shot; that is, when Service Bus receives the request from the consumer, it marks the message as being consumed and returns it to the consumer application. **ReceiveAndDelete** mode is the simplest model and works best for scenarios in which the application can tolerate not processing a message if a failure occurs. To understand this scenario, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus marks the message as being consumed, when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In [PeekLock](/dotnet/api/microsoft.azure.servicebus.receivemode) mode, the receive operation becomes two-stage, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives the request, it finds the next message to be consumed, locks it to prevent other consumers from receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling [CompleteAsync](/dotnet/api/microsoft.azure.servicebus.queueclient.completeasync) on the received message. When Service Bus sees the **CompleteAsync** call, it marks the message as being consumed.

If the application is unable to process the message for some reason, it can call the [AbandonAsync](/dotnet/api/microsoft.azure.servicebus.queueclient.abandonasync) method on the received message (instead of [CompleteAsync](/dotnet/api/microsoft.azure.servicebus.queueclient.completeasync)). This method enables Service Bus to unlock the message and make it available to be received again, either by the same consumer or by another competing consumer. Secondly, there is a timeout associated with the lock and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus unlocks the message and makes it available to be received again (essentially performing an [AbandonAsync](/dotnet/api/microsoft.azure.servicebus.queueclient.abandonasync) operation by default).

In the event that the application crashes after processing the message, but before the **CompleteAsync** request is issued, the message is redelivered to the application when it restarts. This process is often called *At Least Once* processing; that is, each message is processed at least once. However, in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then additional logic is required in the application to detect duplicates, which can be achieved based upon the [MessageId](/dotnet/api/microsoft.azure.servicebus.message.messageid) property of the message, which remains constant across delivery attempts. This feature is known as *Exactly Once* processing.

## Topics and subscriptions

In contrast to queues, in which each message is processed by a single consumer, *topics* and *subscriptions* provide a one-to-many form of communication, in a *publish/subscribe* pattern. Useful for scaling to large numbers of recipients, each published message is made available to each subscription registered with the topic. Messages are sent to a topic and delivered to one or more associated subscriptions, depending on filter rules that can be set on a per-subscription basis. The subscriptions can use additional filters to restrict the messages that they want to receive. Messages are sent to a topic in the same way they are sent to a queue, but messages are not received from the topic directly. Instead, they are received from subscriptions. A topic subscription resembles a virtual queue that receives copies of the messages that are sent to the topic. Messages are received from a subscription identically to the way they are received from a queue.

By way of comparison, the message-sending functionality of a queue maps directly to a topic and its message-receiving functionality maps to a subscription. Among other things, this feature means that subscriptions support the same patterns described earlier in this section with regard to queues: competing consumer, temporal decoupling, load leveling, and load balancing.

### Create topics and subscriptions

Creating a topic is similar to creating a queue, as described in the previous section. You then send messages using the [TopicClient](/dotnet/api/microsoft.azure.servicebus.topicclient) class. To receive messages, you create one or more subscriptions to the topic. Similar to queues, messages are received from a subscription using a [SubscriptionClient](/dotnet/api/microsoft.azure.servicebus.subscriptionclient) object instead of a [QueueClient](/dotnet/api/microsoft.azure.servicebus.queueclient) object. Create the subscription client, passing the name of the topic, the name of the subscription, and (optionally) the receive mode as parameters.

For a full working example, see the [BasicSendReceiveUsingTopicSubscriptionClient sample](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingTopicSubscriptionClient) on GitHub.

### Rules and actions

In many scenarios, messages that have specific characteristics must be processed in different ways. To enable this processing, you can configure subscriptions to find messages that have desired properties and then perform certain modifications to those properties. While Service Bus subscriptions see all messages sent to the topic, you can only copy a subset of those messages to the virtual subscription queue. This filtering is accomplished using subscription filters. Such modifications are called *filter actions*. When a subscription is created, you can supply a filter expression that operates on the properties of the message, both the system properties (for example, **Label**) and custom application properties (for example, **StoreName**.) The SQL filter expression is optional in this case; without a SQL filter expression, any filter action defined on a subscription will be performed on all the messages for that subscription.

For a full working example, see the [TopicSubscriptionWithRuleOperationsSample sample](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/TopicSubscriptionWithRuleOperationsSample) on GitHub.

For more information about possible filter values, see the documentation for the [SqlFilter](/dotnet/api/microsoft.azure.servicebus.sqlfilter) and [SqlRuleAction](/dotnet/api/microsoft.azure.servicebus.sqlruleaction) classes.

## Java message service (JMS) 2.0 entities (Preview)

Client applications connecting to Azure Service Bus Premium and utilizing the [Azure Service Bus JMS library](https://search.maven.org/artifact/com.microsoft.azure/azure-servicebus-jms) can leverage the below entities.

### Queues

Queues in JMS are semantically comparable with the traditional Service Bus queues discussed above.

To create a Queue, utilize the below methods in the `JMSContext` class -

```java
Queue createQueue(String queueName)
```

### Topics

Topics in JMS are semantically comparable with the traditional Service Bus topics discussed above.

To create a Topic, utilize the below methods in the `JMSContext` class -

```java
Topic createTopic(String topicName)
```

### Temporary queues

When a client application requires a temporary entity that exists for the lifetime of the application, it can use Temporary queues. These are utilized in the [Request-Reply](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html) pattern.

To create a temporary queue, utilize the below methods in the `JMSContext` class -

```java
TemporaryQueue createTemporaryQueue()
```

### Temporary topics

Just like Temporary Queues, Temporary Topics exist to enable publish/subscribe through a temporary entity that exists for the lifetime of the application.

To create a temporary topic, utilize the below emthods in the `JMSContext` class -

```java
TemporaryTopic createTemporaryTopic()
```

### Java message service (JMS) subscriptions

While, these are semantically similar to the Subscriptions described above (i.e. exist on a topic and enable publish/subscribe semantics), the Java Message Service spec introduces the concepts of **Shared**, **Unshared**, **Durable** and **Non-durable** attributes for a given subscription.

> [!NOTE]
> The below subscriptions are available in Azure Service Bus Premium tier for Preview for client applications connecting to Azure Service Bus using the [Azure Service Bus JMS library](https://search.maven.org/artifact/com.microsoft.azure/azure-servicebus-jms).
>
> For the Public preview, these subscriptions cannot be created using the Azure portal.
>

#### Shared durable subscriptions

A shared durable subscription is used when all the messages published on a topic are to be received and processed by an application, regardless of whether the application is actively consuming from the subscription at all times.

Since this is a shared subscription, any application that is authenticated to receive from Service Bus can receive from the subscription.

To create a shared durable subscription, use the below methods on the `JMSContext` class -

```java
JMSConsumer createSharedDurableConsumer(Topic topic, String name)

JMSConsumer createSharedDurableConsumer(Topic topic, String name, String messageSelector)
```

The shared durable subscription continues to exist unless deleted using the `unsubscribe` method on the `JMSContext` class.

```java
void unsubscribe(String name)
```

#### Unshared durable subscriptions

Just like a shared durable subscription, an unshared durable subscription is used when all the messages published on a topic are to be received and processed by an application, regardless of whether the application is actively  consuming from the subscription at all times.

However, since this is an unshared subscription, only the application that created the subscription can receive from it.

To create an unshared durable subscription, use the below methods from `JMSContext` class - 

```java
JMSConsumer createDurableConsumer(Topic topic, String name)

JMSConsumer createDurableConsumer(Topic topic, String name, String messageSelector, boolean noLocal)
```

> [!NOTE]
> The `noLocal` feature is currently unsupported and ignored.
>

The unshared durable subscription continues to exist unless deleted using the `unsubscribe` method on the `JMSContext` class.

```java
void unsubscribe(String name)
```

#### Shared non-durable subscriptions

A shared non-durable subscription is used when multiple client applications need to receive and process messages from a single subscription, only until they are actively consuming/receiving from it.

Since the subscription is not durable, it is not persisted. Messages are not received by this subscription when there are no active consumers on it.

To create a shared non-durable subscription, create a `JmsConsumer` as shown in the below methods from the `JMSContext` class -

```java
JMSConsumer createSharedConsumer(Topic topic, String sharedSubscriptionName)

JMSConsumer createSharedConsumer(Topic topic, String sharedSubscriptionName, String messageSelector)
```

The shared non-durable subscription continues to exist until there are active consumers receiving from it.

#### Unshared non-durable subscriptions

An unshared non-durable subscription is used when the client application needs to receive and process message from a subscription, only until it is actively consuming from it. Only one consumer can exist on this subscription, i.e. the client that created the subscription.

Since the subscription is not durable, it is not persisted. Messages are not received by this subscription when there is no active consumer on it.

To create an unshared non-durable subscription, create a `JMSConsumer` as shown in the below methods from the `JMSContext class - 

```java
JMSConsumer createConsumer(Destination destination)

JMSConsumer createConsumer(Destination destination, String messageSelector)

JMSConsumer createConsumer(Destination destination, String messageSelector, boolean noLocal)
```

> [!NOTE]
> The `noLocal` feature is currently unsupported and ignored.
>

The unshared non-durable subscription continues to exist until there is an active consumer receiving from it.

#### Message selectors

Just like **Filters and Actions** exist for regular Service Bus subscriptions, **Message Selectors** exist for JMS Subscriptions.

Message selectors can be set up on each of the JMS subscriptions and exist as a filter condition on the message header properties. Only messages with header properties matching the message selector expression are delivered. A value of null or an empty string indicates that there is no message selector for the JMS Subscription/Consumer.

## Next steps

For more information and examples of using Service Bus messaging, see the following advanced topics:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [Quickstart: Send and receive messages using the Azure portal and .NET](service-bus-quickstart-portal.md)
* [Tutorial: Update inventory using Azure portal and topics/subscriptions](service-bus-tutorial-topics-subscriptions-portal.md)


