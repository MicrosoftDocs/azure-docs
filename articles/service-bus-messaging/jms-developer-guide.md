---
title: Azure Service Bus JMS 2.0 developer guide
description: How to use the Java Message Service (JMS) 2.0 API to communicate with Azure Service Bus
ms.topic: article
ms.date: 01/17/2021
---

# Azure Service Bus JMS 2.0 developer guide

This guide contains detailed information to help you succeed in communicating with Azure Service Bus using the Java Message Service (JMS) 2.0 API.

As a Java developer, if you are new to Azure Service Bus, please consider reading the below articles.

| Getting started | Concepts |
|----------------|-------|
| <ul> <li> [What is Azure Service Bus](service-bus-messaging-overview.md) </li> <li> [Queues, Topics and Subscriptions](service-bus-queues-topics-subscriptions.md) </li> </ul> | <ul> <li> [Azure Service Bus - Premium tier](service-bus-premium-messaging.md) </li> </ul> |

## Java Message Service (JMS) Programming model

The Java Message Service API programming model is as shown below - 

> [!NOTE]
>
>**Azure Service Bus Premium tier** supports JMS 1.1 and JMS 2.0.
> <br> <br>
> **Azure Service Bus - Standard** tier supports limited JMS 1.1 functionality. For more details, please refer to this [documentation](service-bus-java-how-to-use-jms-api-amqp.md).
>

# [JMS 2.0 Programming model](#tab/JMS-20)

:::image type="content" source="./media/jms-developer-guide/JMS20_programmingmodel.png"alt-text="JMS 2.0 Programming model":::

# [JMS 1.1 Programming model](#tab/JMS-11)

:::image type="content" source="./media/jms-developer-guide/JMS11_programmingmodel.png"alt-text="JMS 1.1 Programming model":::


## JMS - Building blocks

The below building blocks are available to communicate with the JMS application.

> [!NOTE]
> The below guide has been adapted from the [Oracle Java EE 6 Tutorial for Java Message Service (JMS)](https://docs.oracle.com/javaee/6/tutorial/doc/bnceh.html)
>
> Referring to this tutorial is recommended for better understanding of the Java Message Service (JMS).
>

### Connection Factory
The connection factory object is used by the client to connect with the JMS provider. The connection factory encapsulates a set of connection configuration parameters that are defined by the administrator.

Each connection factory is an instance of `ConnectionFactory`, `QueueConnectionFactory` or `TopicConnectionFactory` interface.

To simplify connecting with Azure Service Bus, these interfaces are implemented through `ServiceBusJmsConnectionFactory`, `ServiceBusJmsQueueConnectionFactory` and `ServiceBusJmsTopicConnectionFactory` respectively.

### Destination

A destination is the object a client uses to specify the target of the messages it produces and the source of the messages it consumes.

Destinations map to entities in Azure Service Bus - queues, topics and subscriptions.