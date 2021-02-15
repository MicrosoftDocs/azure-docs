---
title: Azure Service Bus messaging - Java message service entities (preview)
description: This article provides an overview of Azure Service Bus messaging entities accessible through the Java message service API.
ms.topic: article
ms.date: 07/20/2020
---

# Java message service (JMS) 2.0 entities (Preview)

Client applications connecting to Azure Service Bus Premium and utilizing the [Azure Service Bus JMS library](https://search.maven.org/artifact/com.microsoft.azure/azure-servicebus-jms) can leverage the below entities.

## Queues

Queues in JMS are semantically comparable with the traditional [Service Bus queues](service-bus-queues-topics-subscriptions.md#queues).

To create a Queue, utilize the below methods in the `JMSContext` class -

```java
Queue createQueue(String queueName)
```

## Topics

Topics in JMS are semantically comparable with the traditional [Service Bus topics](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions).

To create a Topic, utilize the below methods in the `JMSContext` class -

```java
Topic createTopic(String topicName)
```

## Temporary queues

When a client application requires a temporary entity that exists for the lifetime of the application, it can use Temporary queues. These are utilized in the [Request-Reply](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html) pattern.

To create a temporary queue, utilize the below methods in the `JMSContext` class -

```java
TemporaryQueue createTemporaryQueue()
```

## Temporary topics

Just like Temporary Queues, Temporary Topics exist to enable publish/subscribe through a temporary entity that exists for the lifetime of the application.

To create a temporary topic, utilize the below methods in the `JMSContext` class -

```java
TemporaryTopic createTemporaryTopic()
```

## Java message service (JMS) subscriptions

While, these are semantically similar to the [Subscriptions](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions) (i.e. exist on a topic and enable publish/subscribe semantics), the Java Message Service spec introduces the concepts of **Shared**, **Unshared**, **Durable** and **Non-durable** attributes for a given subscription.

> [!NOTE]
> The below subscriptions are available in Azure Service Bus Premium tier for Preview for client applications connecting to Azure Service Bus using the [Azure Service Bus JMS library](https://search.maven.org/artifact/com.microsoft.azure/azure-servicebus-jms).
>
> For the Public preview, these subscriptions cannot be created using the Azure portal.
>

### Shared durable subscriptions

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

### Unshared durable subscriptions

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

### Shared non-durable subscriptions

A shared non-durable subscription is used when multiple client applications need to receive and process messages from a single subscription, only until they are actively consuming/receiving from it.

Since the subscription is not durable, it is not persisted. Messages are not received by this subscription when there are no active consumers on it.

To create a shared non-durable subscription, create a `JmsConsumer` as shown in the below methods from the `JMSContext` class -

```java
JMSConsumer createSharedConsumer(Topic topic, String sharedSubscriptionName)

JMSConsumer createSharedConsumer(Topic topic, String sharedSubscriptionName, String messageSelector)
```

The shared non-durable subscription continues to exist until there are active consumers receiving from it.

### Unshared non-durable subscriptions

An unshared non-durable subscription is used when the client application needs to receive and process message from a subscription, only until it is actively consuming from it. Only one consumer can exist on this subscription, i.e. the client that created the subscription.

Since the subscription is not durable, it is not persisted. Messages are not received by this subscription when there is no active consumer on it.

To create an unshared non-durable subscription, create a `JMSConsumer` as shown in the below methods from the `JMSContext` class -

```java
JMSConsumer createConsumer(Destination destination)

JMSConsumer createConsumer(Destination destination, String messageSelector)

JMSConsumer createConsumer(Destination destination, String messageSelector, boolean noLocal)
```

> [!NOTE]
> The `noLocal` feature is currently unsupported and ignored.
>

The unshared non-durable subscription continues to exist until there is an active consumer receiving from it.

### Message selectors

Just like **Filters and Actions** exist for regular Service Bus subscriptions, **Message Selectors** exist for JMS Subscriptions.

Message selectors can be set up on each of the JMS subscriptions and exist as a filter condition on the message header properties. Only messages with header properties matching the message selector expression are delivered. A value of null or an empty string indicates that there is no message selector for the JMS Subscription/Consumer.

## Next steps

For more information and examples of using Service Bus messaging, see the following advanced topics:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [Use Java Message Service 2.0 API with Azure Service Bus Premium (Preview)](how-to-use-java-message-service-20.md)



