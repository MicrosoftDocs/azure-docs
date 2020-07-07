---
title: Use AMQP with Java Message Service API & Azure Service Bus
description: How to use the Java Message Service (JMS) with Azure Service Bus and Advanced Message Queuing Protocol (AMQP) 1.0.
ms.topic: article
ms.date: 06/23/2020
ms.custom: seo-java-july2019, seo-java-august2019, seo-java-september2019
---

# Use the Java Message Service (JMS) with Azure Service Bus and AMQP 1.0

Support for **Advanced Message Queuing Protocol (AMQP) 1.0** protocol in Azure Service Bus means that you can use the queuing and publish/subscribe brokered messaging features from a range of platforms using an efficient binary protocol. Furthermore, you can build applications comprised of components built using a mix of languages, frameworks, and operating systems.

This article explains how to use Azure Service Bus messaging features (queues and publish/subscribe topics) from Java applications using the popular **Java Message Service (JMS)** API over the AMQP protocol.

## Get started with Service Bus
This guide assumes that you already have a Service Bus namespace containing a queue named `basicqueue`. If you don't, then you can [create the namespace and queue](service-bus-create-namespace-portal.md) using the [Azure portal](https://portal.azure.com). For more information about how to create Service Bus namespaces and queues, see [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md).

> [!NOTE]
> Partitioned queues and topics also support AMQP. For more information, see [Partitioned messaging entities](service-bus-partitioning.md) and [AMQP 1.0 support for Service Bus partitioned queues and topics](service-bus-partitioned-queues-and-topics-amqp-overview.md).
> 
>

## What JMS features are supported?

Here are the JMS features that are supported in Azure Service Bus.

| Features | Azure Service Bus Standard tier - JMS 1.1 | Azure Service Bus Premium tier - JMS 2.0 (Preview) |
|---|---|---|
| Auto creation of entities over AMQP | Not supported | **Supported** |
| Queues | **Supported** | **Supported** |
| Topics | **Supported** | **Supported** |
| Temporary Queues | Not Supported <br/> (Create a regular queue with *AutoDeleteOnIdle* set instead) | **Supported** |
| Temporary Topics | Not Supported | **Supported** |
| Message Selectors | Not Supported | **Supported** |
| Queue Browsers | Not Supported <br/> (Use the *Peek* functionality of the Service Bus API) | **Supported** |
| Shared Durable Subscriptions | **Supported** | **Supported**|
| Unshared Durable Subscriptions | Not supported | **Supported** |
| Shared Non-durable Subscriptions | Not supported | **Supported** |
| Unshared Non-durable Subscriptions | Not supported | **Supported** |
| Unsubscribe for durable subscriptions | Not supported | **Supported** |
| ReceiveNoWait | Not supported | **Supported** |
| Distributed Transactions | Not supported | Not supported |
| Durable Terminus | Not supported | Not supported |

### Additional caveats for Service Bus Standard tier
Only one **MessageProducer** or **MessageConsumer** is allowed per **Session**. If you need to create multiple **MessageProducers** or **MessageConsumers** in an application, create a dedicated **Session** for each of them.

## Downloading the Java Message Service (JMS) client library

To connect with Azure Service Bus and leverage the Java Message Service (JMS) API over AMQP, the below libraries need to be leveraged. These must be added to the build path using the preferred dependency management tool for your project.

The client library required depends on which pricing tier is used.

### Premium tier - JMS 2.0 over AMQP (Preview)

To utilize all the preview features available on Azure Service Bus Premium tier utilize the [Azure-servicebus-jms](https://search.maven.org/artifact/com.microsoft.azure/azure-servicebus-jms) library.

### Standard tier - JMS 1.1 over AMQP

To utilize the JMS features supported by Service Bus Standard tier (see [What JMS features are supported?](#what-jms-features-are-supported-?)) utilize the below libraries -

* [Geronimo JMS 1.1 spec](https://search.maven.org/artifact/org.apache.geronimo.specs/geronimo-jms_1.1_spec)
* [Qpid JMS Client](https://search.maven.org/artifact/org.apache.qpid/qpid-jms-client)

> [!NOTE]
> JMS JAR names and versions may have changed. For details, see [Qpid JMS - AMQP 1.0](https://qpid.apache.org/maven.html#qpid-jms-amqp-10).
>

## Coding Java applications

Once the dependencies have been imported, the Java applications can be written in a JMS provider agnostic manner.

Since Azure Service Bus Standard and Premium differ in the dependencies and the number of JMS features they support, the programming model is slightly different for the two.

> [!IMPORTANT]
> The below guide showcases how to connect to Azure Service Bus given a simple application.
>
> Given that most enterprise application architectures may have a custom way to manage dependencies and configurations, use the below as a guide to understand what is needed and adapt to your application appropriately.
>

### Connecting to Azure Service Bus using JMS

To connect with Azure Service Bus using JMS clients, you need the **ConnectionString** which is available in the 'Shared Access Policies' in the [Azure portal](https://portal.azure.com) under **Primary Connection String**.


#### Connecting to Azure Service Bus Premium over JMS 2.0 (Preview)

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

#### Connecting to Azure Service Bus Standard over JMS 1.1

1. Insert Azure Service Bus configuration into JNDI properties file called **servicebus.properties**.
    ```properties
    # servicebus.properties - sample JNDI configuration
    
    # Register a ConnectionFactory in JNDI using the form:
    # connectionfactory.[jndi_name] = [ConnectionURL]
    connectionfactory.SBCF = amqps://[SASPolicyName]:[SASPolicyKey]@[namespace].servicebus.windows.net
    ```

2. Setup JNDI context and configure the ConnectionFactory
    ```java
    ConnectionStringBuilder csb = new ConnectionStringBuilder(connectionString);

    // set up JNDI context
    Hashtable<String, String> hashtable = new Hashtable<>();
    hashtable.put("connectionfactory.SBCF", "amqps://" + csb.getEndpoint().getHost() + "?amqp.idleTimeout=120000&amqp.traceFrames=true");
    hashtable.put("queue.QUEUE", "BasicQueue");
    hashtable.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.qpid.jms.jndi.JmsInitialContextFactory");
    Context context = new InitialContext(hashtable);
    
    ConnectionFactory factory = (ConnectionFactory) context.lookup("SBCF");
    ```
3. Use the `ConnectionFactory` to create a `Connection` and then a `Session`.
    ```java
    Connection connection - factory.createConnection(csb.getSasKeyName(), csb.getSasKey());
    Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
    ```

### Write the JMS application

Once the `Session` or `JMSContext` has been instantiated, your application can leverage the JMS APIs to perform both management and data operations.

Please refer to the list of [supported JMS features](#what-jms-features-are-supported-?) for both Standard and Premium tier.


## JMS Topics vs. Service Bus Topics
Using Azure Service Bus topics and subscriptions through the Java Message Service (JMS) API provides basic send and receive capabilities. It's a convenient choice when porting applications from other message brokers with JMS-compliant APIs, even though Service Bus topics differ from JMS Topics and require a few adjustments. 

Azure Service Bus topics route messages into named, shared, durable subscriptions that are managed through the Azure Resource Management interface, the Azure command-line tools, or through the Azure portal. Each subscription allows for up to 2000 selection rules, each of which may have a filter condition and, for SQL filters, also a metadata transformation action. Each filter condition match selects the input message to be copied into the subscription.  

Receiving messages from subscriptions is identical receiving messages from queues. Each subscription has an associated dead-letter queue and the ability to automatically forward messages to another queue or topics. 

JMS Topics allow clients to dynamically create nondurable and durable subscribers that optionally allow filtering  messages with message selectors. These unshared entities aren't supported by Service Bus. The SQL filter rule syntax for Service Bus is, however, similar to the message selector syntax supported by JMS. 

The JMS Topic publisher side is compatible with Service Bus, as shown in this sample, but dynamic subscribers aren't. The following topology-related JMS APIs aren't supported with Service Bus. 

## Summary
This guide showcased how Java client applications using Java Message Service (JMS) over AMQP 1.0 can interact with Azure Service Bus.

You can also use Service Bus AMQP 1.0 from other languages, including .NET, C, Python, and PHP. Components built using these different languages can exchange messages reliably and at full fidelity using the AMQP 1.0 support in Service Bus.

## Next steps

For more information on Azure Service Bus and details about Java Message Service (JMS) entities check out the links below - 
* [Service Bus - Queues, Topics and Subscriptions](service-bus-queues-topics-subscriptions.md)
* [Service Bus - Java Message Service entities](service-bus-queues-topics-subscriptions.md#Java-Message-Service-(JMS)-Entities-(Preview))
* [AMQP 1.0 support in Azure Service Bus](service-bus-amqp-overview.md)
* [Service Bus AMQP 1.0 Developer's Guide](service-bus-amqp-dotnet.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)

