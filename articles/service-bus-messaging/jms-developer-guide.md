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

---

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

To connect with Azure Service Bus, the connection string is needed as below.

```java
ConnectionFactory factory = new ServiceBusJmsConnectionFactory(SERVICE_BUS_CONNECTION_STRING, null);
```

### JMS Destination

A destination is the object a client uses to specify the target of the messages it produces and the source of the messages it consumes.

Destinations map to entities in Azure Service Bus - queues (in point to point scenarios) and topics (in pub-sub scenarios).

### Connections

A connection encapsulates a virtual connection with a JMS provider. With Azure Service Bus,this represents a stateful connection between the application and Azure Service Bus over AMQP.

A connection is created from the connection factory as shown below.

```java
Connection connection = factory.createConnection();
```

### Sessions

A session is a single-threaded context for producing and consuming messages. It can be utilized to create messages, message producers and consumers, but it also provides a transactional context to allow grouping of sends and receives into an atomic unit of work.

A session can be created from the connection object as shown below.

```java
Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
```

#### Session modes

A session can be created with any of the below modes.

| Session modes | Behavior |
| ----------------- | -------- |
|**Session.AUTO_ACKNOWLEDGE** | The session automatically acknowledges a client's receipt of a message either when the session has successfully returned from a call to receive or when the message listener the session has called to process the message successfully returns.|
|**Session.CLIENT_ACKNOWLEDGE** |The client acknowledges a consumed message by calling the message's acknowledge method.|
|**Session.DUPS_OK_ACKNOWLEDGE**|This acknowledgment mode instructs the session to lazily acknowledge the delivery of messages.| 
|**Session.SESSION_TRANSACTED**|This value may be passed as the argument to the method createSession(int sessionMode) on the Connection object to specify that the session should use a local transaction.| 


### JMSContext

> [!NOTE]
> JMSContext is defined as part of the JMS 2.0 specification.
>

JMSContext combines the functionality provided by the connection and session object. It can be created from the connection factory object.

```java
JMSContext context = connectionFactory.createContext();
```

#### JMSContext modes

Just like the **Session** object, the JMSContext can be created with the same acknowledge modes as mentioned in [Session modes](#session-modes)

### JMS Message Producers

### JMS Message Consumers


### JMS Message Listeners

