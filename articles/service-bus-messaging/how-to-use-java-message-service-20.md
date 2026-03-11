---
title: Use Java Message Service 2.0 API
description: Explains how to use the Java Message Service (JMS) 2.0 API to interact with Azure Service Bus over the Advanced Message Queueing Protocol (AMQP) 1.0 protocol.
ms.topic: how-to
ms.date: 01/10/2024
ms.custom:
  - devx-track-extended-java
  - sfi-ropc-nochange
---

# Use Java Message Service 2.0 API with Azure Service Bus Premium

This article explains how to use the popular **Java Message Service (JMS) 2.0** API to interact with Azure Service Bus over the Advanced Message Queueing Protocol (AMQP) 1.0 protocol.

## Important notes

- JMS 2.0 API support requires the **Azure Service Bus Premium tier** and the **azure-servicebus-jms** library. Using other JMS libraries (for example, **qpid-jms-client** directly) against a premium namespace results in JMS 1.1 behavior, and some JMS 2.0 features might not work as expected.
- The library is [open source](https://github.com/azure/azure-servicebus-jms) and built on top of **qpid-jms-client** — all qpid-jms-client APIs work with it, so there is no vendor lock-in. It also provides defaults for prefetch policies, reconnect policies, Microsoft Entra ID, Managed Identity support, and Auto Delete on Idle.
- The library is available in two variants for **Jakarta EE** and **Java EE**. See [Jakarta EE and javax support](#jakarta-ee-and-javax-support) for details on which artifact to use.

## Jakarta EE and javax support

The `azure-servicebus-jms` library is available in two variants to support both the legacy Java EE (`javax.jms`) and the newer Jakarta EE (`jakarta.jms`) API namespaces.

| API namespace | Maven artifact | Versions | JMS specification |
|---|---|---|---|
| `jakarta.jms` (Jakarta EE 9+) | [com.azure:azure-servicebus-jms](https://central.sonatype.com/artifact/com.azure/azure-servicebus-jms) | 2.0.0+ | Jakarta Messaging (JMS 2.0) |
| `javax.jms` (Java EE) | [com.microsoft.azure:azure-servicebus-jms](https://central.sonatype.com/artifact/com.microsoft.azure/azure-servicebus-jms/versions) | 1.0.x | JMS 2.0 |

**Which artifact should I use?**

- If your project uses **Jakarta EE 9 or later** (for example, Spring Boot 3.x, Quarkus 3.x, or any framework that imports `jakarta.jms.*`), use the `com.azure` artifact:

    ```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-servicebus-jms</artifactId>
      <version>2.0.0</version>
    </dependency>
    ```

- If your project still uses **Java EE** (imports `javax.jms.*`), continue using the `com.microsoft.azure` artifact:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-servicebus-jms</artifactId>
      <version>1.0.2</version>
    </dependency>
    ```

> [!IMPORTANT]
> Do not mix the two artifacts. Using `com.azure:azure-servicebus-jms` in a project that imports `javax.jms.*` results in compilation errors, and vice versa.

**Migrating from javax to Jakarta**

If you're upgrading your application from Java EE to Jakarta EE:

1. Replace your Maven dependency group ID from `com.microsoft.azure` to `com.azure` and update the version to `2.0.0` or later.
2. Update all `javax.jms.*` imports in your code to `jakarta.jms.*`.
3. The `ServiceBusJmsConnectionFactory` API and configuration remain the same across both variants, so no code changes are needed beyond the import and dependency updates.

## Prerequisites

### Get started with Service Bus

This guide assumes that you already have a Service Bus namespace. If you don't, [create a namespace and a queue](service-bus-quickstart-portal.md#create-a-namespace-in-the-azure-portal) using the [Azure portal](https://portal.azure.com). For more information about how to create Service Bus namespaces and queues, see [Get started with Service Bus queues through the Azure portal](service-bus-quickstart-portal.md).

### Set up a Java Development environment

To develop Java applications, you need to set up the appropriate development environment - 

- Either the JDK (Java Development Kit) or the JRE (Java Runtime Environment) is installed.
- The JDK or JRE is added to the build path and the appropriate system variables.
- A Java IDE is installed to utilize the JDK or JRE. For example, Eclipse or IntelliJ.

To learn more about how to prepare your developer environment for Java on Azure, utilize [this guide](/azure/developer/java/fundamentals/).

## What JMS features are supported?

[!INCLUDE [service-bus-jms-features-list](./includes/service-bus-jms-feature-list.md)]

## Downloading the Java Message Service (JMS) client library

To utilize all the features available in the premium tier, add the **azure-servicebus-jms** library to the build path of your project. This package provides necessary defaults such as prefetch policy values, reconnect policies, Microsoft Entra ID, and Managed Identity support out of the box. Choose the artifact that matches your project's API namespace (see [Jakarta EE and javax support](#jakarta-ee-and-javax-support) for details):

**Jakarta EE (jakarta.jms):**

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-servicebus-jms</artifactId>
  <version>2.0.0</version>
</dependency>
```

**Java EE (javax.jms):**

```xml
<dependency>
  <groupId>com.microsoft.azure</groupId>
  <artifactId>azure-servicebus-jms</artifactId>
  <version>1.0.2</version>
</dependency>
```

> [!NOTE]
> To add the library to the build path, use the preferred dependency management tool for your project like [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/).

## Coding Java applications

Once the dependencies are imported, the Java applications can be written in a JMS provider agnostic manner.

### Connecting to Azure Service Bus using JMS

To connect with Azure Service Bus using JMS clients, you need the **connection string** that is available in the 'Shared Access Policies' in the [Azure portal](https://portal.azure.com) under **Primary Connection String**.

1. Instantiate the `ServiceBusJmsConnectionFactorySettings`

    ```java
    ServiceBusJmsConnectionFactorySettings connFactorySettings = new ServiceBusJmsConnectionFactorySettings();
    connFactorySettings.setConnectionIdleTimeoutMS(20000);
    ```
2. Instantiate the `ServiceBusJmsConnectionFactory` with the appropriate `ServiceBusConnectionString`.

    ```java
    String ServiceBusConnectionString = "<SERVICE_BUS_CONNECTION_STRING_WITH_MANAGE_PERMISSIONS>";
    ConnectionFactory factory = new ServiceBusJmsConnectionFactory(ServiceBusConnectionString, connFactorySettings);
    ```

3. Use the `ConnectionFactory` to either create a `Connection` and then a `Session` 

    ```java
    Connection connection = factory.createConnection();
    Session session = connection.createSession();
    ```
    or a `JMSContext` (for JMS 2.0 clients)

    ```java
    JMSContext jmsContext = factory.createContext();
    ```

    >[!IMPORTANT]
    > Although similarly named, a JMS 'Session' and Service Bus 'Session' is completely independent of each other.
    >
    > In JMS 1.1, Session is an essential building block of the API that allows creation of the `MessageProducer`, `MessageConsumer`, and the `Message` itself. For more details, review the [JMS API programming model](https://docs.oracle.com/javaee/6/tutorial/doc/bnceh.html)
    >
    > In Service Bus, [sessions](message-sessions.md) are service and client side construct to enable FIFO processing on queues and subscriptions.
    >

### Write the JMS application

Once the `Session` or `JMSContext` is instantiated, your application can use the familiar JMS APIs to perform both management and data operations. Refer to the list of [supported JMS features](how-to-use-java-message-service-20.md#what-jms-features-are-supported) to see which APIs are supported. Here are some sample code snippets to get started with JMS -

#### Sending messages to a queue and topic

```java
// Create the queue and topic
Queue queue = jmsContext.createQueue("basicQueue");
Topic topic = jmsContext.createTopic("basicTopic");
// Create the message
Message msg = jmsContext.createMessage();

// Create the JMS message producer
JMSProducer producer = jmsContext.createProducer();

// send the message to the queue
producer.send(queue, msg);
// send the message to the topic
producer.send(topic, msg);
```

#### Receiving messages from a queue

```java
// Create the queue
Queue queue = jmsContext.createQueue("basicQueue");

// Create the message consumer
JMSConsumer consumer = jmsContext.createConsumer(queue);

// Receive the message
Message msg = (Message) consumer.receive();
```

#### Receiving messages from a shared durable subscription on a topic

```java
// Create the topic
Topic topic = jmsContext.createTopic("basicTopic");

// Create a shared durable subscriber on the topic
JMSConsumer sharedDurableConsumer = jmsContext.createSharedDurableConsumer(topic, "sharedDurableConsumer");

// Receive the message
Message msg = (Message) sharedDurableConsumer.receive();
```

## Summary

This guide showcased how Java client applications using Java Message Service (JMS) over AMQP 1.0 can interact with Azure Service Bus.

You can also use Service Bus AMQP 1.0 from other languages, including .NET, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full fidelity using the AMQP 1.0 support in Service Bus.

## Related content

- [Use JMS in Spring to access Azure Service Bus](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus)
- [Use Azure Service Bus with JMS](/azure/developer/java/spring-framework/spring-jms-support)


