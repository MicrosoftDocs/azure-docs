---
title: Use Java Message Service 2.0 API with Azure Service Bus Premium
description: How to use the Java Message Service (JMS) with Azure Service Bus
ms.topic: article
ms.date: 01/10/2024
ms.custom: devx-track-extended-java
---

# Use Java Message Service 2.0 API with Azure Service Bus Premium

This article explains how to use the popular **Java Message Service (JMS) 2.0** API to interact with Azure Service Bus over the Advanced Message Queueing Protocol (AMQP) 1.0 protocol.

> [!NOTE]
> Support for JMS 2.0 API is available only in the premium tier and when you use the **azure-servicebus-jms** library. If you use JMS libraries other than **azure-servicebus-jms** (for example, latest **qpid-jms-client**) against a premium namespace, you observe the JMS 1.1 behavior. The azure-servicebus-jms library doesn't create a vendor lock of any kind as it still takes a dependency on qpid-jms-client. All APIs that work on qpid-jms-client work on azure-servicebus-jms library as well. 
>
>  The azure-servicebus-jms is also an [open-source library](https://github.com/azure/azure-servicebus-jms). The azure-servicebus-jms library was mainly created so that the Service Bus service can distinguish between customers needing the JMS 1.1 behavior (backwards compatibility) versus the JMS 2.0 behavior when working against a premium namespace. The azure-servicebus-jms library also provides some necessary defaults such as prefetch policy values, reconnect policies, Microsoft Entra ID, Managed Identity support, support for Auto Delete on Idle for entities out of the box.
> 
> The following path to the azure-servicebus-jms package is the latest version of the library that is based on the Jakarta Messaging specification (Jakarta.* APIs): Maven Central: [com.azure:azure-servicebus-jms](https://central.sonatype.com/artifact/com.azure/azure-servicebus-jms). And, the following path to the azure-servicebus-jms is the latest version of library before the Jakarta Messaging specification  (javax.* APIs): Maven Central: [com.microsoft.azure:azure-servicebus-jms](https://central.sonatype.com/artifact/com.microsoft.azure/azure-servicebus-jms/versions).

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

To utilize all the features available in the premium tier, add the following library to the build path of the project: [azure-servicebus-jms](https://central.sonatype.com/artifact/com.microsoft.azure/azure-servicebus-jms/1.0.0). This package provides some necessary defaults such as prefetch policy values, reconnect policies, Microsoft Entra ID, and Managed Identity support out of the box.

> [!NOTE]
> To add the [azure-servicebus-jms](https://central.sonatype.com/artifact/com.microsoft.azure/azure-servicebus-jms/1.0.0) to the build path, use the preferred dependency management tool for your project like [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/).

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


