---
title: Azure Service Bus JMS 2.0 developer guide
description: How to use the Java Message Service (JMS) 2.0 API to communicate with Azure Service Bus
ms.topic: article
ms.custom: devx-track-extended-java
ms.date: 05/02/2023
---

# Azure Service Bus JMS 2.0 developer guide

This guide contains detailed information to help you succeed in communicating with Azure Service Bus using the Java Message Service (JMS) 2.0 API.

As a Java developer, if you're new to Azure Service Bus, please consider reading the below articles.

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

:::image type="content" source="./media/jms-developer-guide/java-message-service-20-programming-model.png "alt-text="Diagram showing JMS 2.0 Programming model." border="false":::

# [JMS 1.1 Programming model](#tab/JMS-11)

:::image type="content" source="./media/jms-developer-guide/java-message-service-11-programming-model.png "alt-text="Diagram showing JMS 1.1 Programming model." border="false":::

---

## JMS - Building blocks

The below building blocks are available to communicate with the JMS application.

> [!NOTE]
> The below guide has been adapted from the [Oracle Java EE 6 Tutorial for Java Message Service (JMS)](https://docs.oracle.com/javaee/6/tutorial/doc/bnceh.html)
>
> Referring to this tutorial is recommended for better understanding of the Java Message Service (JMS).
>

### Connection factory
The connection factory object is used by the client to connect with the JMS provider. The connection factory encapsulates a set of connection configuration parameters that are defined by the administrator.

Each connection factory is an instance of `ConnectionFactory`, `QueueConnectionFactory` or `TopicConnectionFactory` interface.

To simplify connecting with Azure Service Bus, these interfaces are implemented through `ServiceBusJmsConnectionFactory`, `ServiceBusJmsQueueConnectionFactory` and `ServiceBusJmsTopicConnectionFactory` respectively.

> [!IMPORTANT]
> Java applications leveraging JMS 2.0 API can connect to Azure Service Bus using the connection string, or using a `TokenCredential` for leveraging Azure Active Directory (Azure AD) backed authentication. When using Azure AD backed authentication, ensure to [assign roles and permissions](service-bus-managed-service-identity.md#azure-built-in-roles-for-azure-service-bus) to the identity as needed.

# [System Assigned Managed Identity](#tab/system-assigned-managed-identity-backed-authentication)

Create a [system assigned managed identity](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) on Azure, and use this identity to create a `TokenCredential`.

```java
TokenCredential tokenCredential = new DefaultAzureCredentialBuilder().build();
```

The Connection factory can then be instantiated with the below parameters.
   * Token credential - Represents a credential capable of providing an OAuth token.
   * Host - the hostname of the Azure Service Bus Premium tier namespace.
   * ServiceBusJmsConnectionFactorySettings property bag, which contains
      * connectionIdleTimeoutMS - idle connection timeout in milliseconds.
      * traceFrames - boolean flag to collect AMQP trace frames for debugging.
      * *other configuration parameters*

The factory can be created as shown here. The token credential and host are required parameters, but the other properties are optional.

```java
String host = "<YourNamespaceName>.servicebus.windows.net";
ConnectionFactory factory = new ServiceBusJmsConnectionFactory(tokenCredential, host, null); 
```

# [User Assigned Managed Identity](#tab/user-assigned-managed-identity-backed-authentication)

Create a [user assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) on Azure, and use this identity to create a `TokenCredential`.

```java
TokenCredential tokenCredential = new DefaultAzureCredentialBuilder()
                                                .managedIdentityClientId("<clientIDOfUserAssignedIdentity>")
                                                .build();
```

The Connection factory can then be instantiated with the below parameters.
   * Token credential - Represents a credential capable of providing an OAuth token.
   * Host - the hostname of the Azure Service Bus Premium tier namespace.
   * ServiceBusJmsConnectionFactorySettings property bag, which contains
      * connectionIdleTimeoutMS - idle connection timeout in milliseconds.
      * traceFrames - boolean flag to collect AMQP trace frames for debugging.
      * *other configuration parameters*

The factory can be created as shown here. The token credential and host are required parameters, but the other properties are optional.

```java
String host = "<YourNamespaceName>.servicebus.windows.net";
ConnectionFactory factory = new ServiceBusJmsConnectionFactory(tokenCredential, host, null); 
```

# [Service Principal](#tab/service-principal-backed-authentication)

Create a [service principal](authenticate-application.md#register-your-application-with-an-azure-ad-tenant) on Azure, and use this identity to create a `TokenCredential`.

```java
TokenCredential tokenCredential = new new ClientSecretCredentialBuilder()
                .tenantId("")
                .clientId("")
                .clientSecret("")
                .build();;
```

The Connection factory can then be instantiated with the below parameters.
   * Token credential - Represents a credential capable of providing an OAuth token.
   * Host - the hostname of the Azure Service Bus Premium tier namespace.
   * ServiceBusJmsConnectionFactorySettings property bag, which contains
      * connectionIdleTimeoutMS - idle connection timeout in milliseconds.
      * traceFrames - boolean flag to collect AMQP trace frames for debugging.
      * *other configuration parameters*

The factory can be created as shown here. The token credential and host are required parameters, but the other properties are optional.

```java
String host = "<YourNamespaceName>.servicebus.windows.net";
ConnectionFactory factory = new ServiceBusJmsConnectionFactory(tokenCredential, host, null); 
```

# [Connection string authentication](#tab/connection-string-authentication)

The Connection factory can be instantiated with the below parameters.
   * Connection string - the connection string for the Azure Service Bus Premium tier namespace.
   * ServiceBusJmsConnectionFactorySettings property bag, which contains
      * connectionIdleTimeoutMS - idle connection timeout in milliseconds.
      * traceFrames - boolean flag to collect AMQP trace frames for debugging.
      * *other configuration parameters*

The factory can be created as shown here. The connection string is a required parameter, but the other properties are optional.

```java
ConnectionFactory factory = new ServiceBusJmsConnectionFactory(SERVICE_BUS_CONNECTION_STRING, null);
```

---

### JMS destination

A destination is the object a client uses to specify the target of the messages it produces and the source of the messages it consumes.

Destinations map to entities in Azure Service Bus - queues (in point to point scenarios) and topics (in pub-sub scenarios).

### Connections

A connection encapsulates a virtual connection with a JMS provider. With Azure Service Bus, this represents a stateful connection between the application and Azure Service Bus over AMQP.

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

> [!NOTE]
> JMS API doesn't support receiving messages from service bus queues or topics with messaging sessions enabled. 

#### Session modes

A session can be created with any of the below modes.

| Session modes | Behavior |
| ----------------- | -------- |
|**Session.AUTO_ACKNOWLEDGE** | The session automatically acknowledges a client's receipt of a message either when the session has successfully returned from a call to receive or when the message listener the session has called to process the message successfully returns.|
|**Session.CLIENT_ACKNOWLEDGE** |The client acknowledges a consumed message by calling the message's acknowledge method.|
|**Session.DUPS_OK_ACKNOWLEDGE**|This acknowledgment mode instructs the session to lazily acknowledge the delivery of messages.| 
|**Session.SESSION_TRANSACTED**|This value may be passed as the argument to the method createSession(int sessionMode) on the Connection object to specify that the session should use a local transaction.| 

When the session mode isn't specified, the **Session.AUTO_ACKNOWLEDGE** is picked by default.

### JMSContext

> [!NOTE]
> JMSContext is defined as part of the JMS 2.0 specification.
>

JMSContext combines the functionality provided by the connection and session object. It can be created from the connection factory object.

```java
JMSContext context = connectionFactory.createContext();
```

#### JMSContext modes

Just like the **Session** object, the JMSContext can be created with the same acknowledge modes as mentioned in [Session modes](#session-modes).

```java
JMSContext context = connectionFactory.createContext(JMSContext.AUTO_ACKNOWLEDGE);
```

When the mode isn't specified, the **JMSContext.AUTO_ACKNOWLEDGE** is picked by default.

### JMS message producers

A message producer is an object that is created using a JMSContext or a Session and used for sending messages to a destination.

It can be created either as a stand-alone object as below - 

```java
JMSProducer producer = context.createProducer();
```

or created at runtime when a message is needed to be sent.

```java
context.createProducer().send(destination, message);
```

### JMS message consumers

A message consumer is an object that is created by a JMSContext or a Session and used for receiving messages sent to a destination. It can be created as shown below -

```java
JMSConsumer consumer = context.createConsumer(dest);
```

#### Synchronous receives via receive() method

The message consumer provides a synchronous way to receive messages from the destination through the `receive()` method.

If no arguments/timeout is specified or a timeout of '0' is specified, then the consumer blocks indefinitely unless the message arrives, or the connection is broken (whichever is earlier).

```java
Message m = consumer.receive();
Message m = consumer.receive(0);
```

When a non-zero positive argument is provided, the consumer blocks until that timer expires.

```java
Message m = consumer.receive(1000); // time out after one second.
```

#### Asynchronous receives with JMS message listeners

A message listener is an object that is used for asynchronous handling of messages on a destination. It implements the `MessageListener` interface which contains the `onMessage` method where the specific business logic must live.

A message listener object must be instantiated and registered against a specific message consumer using the `setMessageListener` method.

```java
Listener myListener = new Listener();
consumer.setMessageListener(myListener);
```

### Consuming from topics

[JMS Message Consumers](#jms-message-consumers) are created against a [destination](#jms-destination) which may be a queue or a topic.

Consumers on queues are simply client side objects that live in the context of the Session (and Connection) between the client application and Azure Service Bus.

Consumers on topics, however, have 2 parts - 
   * A **client side object** that lives in the context of the Session(or JMSContext), and,
   * A **subscription** that is an entity on Azure Service Bus.

The subscriptions are documented [here](java-message-service-20-entities.md#java-message-service-jms-subscriptions) and can be one of the below - 
   * Shared durable subscriptions
   * Shared non-durable subscriptions
   * Unshared durable subscriptions
   * Unshared non-durable subscriptions

### JMS Queue Browsers

The JMS API provides a `QueueBrowser` object that allows the application to browse the messages in the queue and display the header values for each message.

A Queue Browser can be created using the JMSContext as below.

```java
QueueBrowser browser = context.createBrowser(queue);
```

> [!NOTE]
> JMS API doesn't provide an API to browse a topic.
>
> This is because the topic itself doesn't store the messages. As soon as the message is sent to the topic, it is forwarded to the appropriate subscriptions.
>

### JMS Message selectors

Message selectors can be used by receiving applications to filter the messages that are received. With message selectors, the receiving application offloads the work of filtering messages to the JMS provider (in this case, Azure Service Bus) instead of taking that responsibility itself.

Selectors can be utilized when creating any of the below consumers - 
   * Shared durable subscription
   * Unshared durable subscription
   * Shared non-durable subscription
   * Unshared non-durable subscription
   * Queue browser

## AMQP disposition and Service Bus operation mapping

Here's how an AMQP disposition translates to a Service Bus operation:

```Output
ACCEPTED = 1; -> Complete()
REJECTED = 2; -> DeadLetter()
RELEASED = 3; (just unlock the message in service bus, will then get redelivered)
MODIFIED_FAILED = 4; -> Abandon() which increases delivery count
MODIFIED_FAILED_UNDELIVERABLE = 5; -> Defer()
```

## Summary

This developer guide showcased how Java client applications using Java Message Service (JMS) can connect with Azure Service Bus.

## Next steps

For more information on Azure Service Bus and details about Java Message Service (JMS) entities, check out the links below - 
* [Service Bus - Queues, Topics, and Subscriptions](service-bus-queues-topics-subscriptions.md)
* [Service Bus - Java Message Service entities](service-bus-queues-topics-subscriptions.md#java-message-service-jms-20-entities)
* [AMQP 1.0 support in Azure Service Bus](service-bus-amqp-overview.md)
* [Service Bus AMQP 1.0 Developer's Guide](service-bus-amqp-dotnet.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [Java Message Service API(external Oracle doc)](https://docs.oracle.com/javaee/7/api/javax/jms/package-summary.html)
* [Learn how to migrate from ActiveMQ to Service Bus](migrate-jms-activemq-to-servicebus.md)
