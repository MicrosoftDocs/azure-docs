---
title: Migrate Java Message Service (JMS) applications from ActiveMQ to Azure Service Bus | Microsoft Docs
description: This article explains how to migrate existing JMS applications that interact with Active MQ to interact with Azure Service Bus.
services: service-bus-messaging
documentationcenter: ''
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/07/2020
ms.author: aschhab

---

# Migrate existing Java Message Service (JMS) 2.0 applications from Active MQ to Azure Service Bus

Azure Service Bus supports Java/J2EE and Spring workloads that utilize the Java Message Service (JMS) 2.0 API over the Advanced Message Queueing Protocol (AMQP) protocol.

This guide describes what you should be aware of when you want to modify an existing Java Message Service (JMS) 2.0 application that interacts with a JMS Broker (specifically Apache ActiveMQ or Amazon MQ) to interact with Azure Service Bus.

## Before you start

### Differences between Azure Service Bus and Apache ActiveMQ

Azure Service Bus and Apache ActiveMQ are both message brokers that are functioning as JMS providers for client applications to send messages to and receive messages from. They both enable the point-to-point semantics with **Queues** and publish-subscribe semantics with **Topics** and **Subscriptions**. 

Even so, there are some differences in the two.

| Category | Active MQ | Azure Service Bus |
| --- | --- | --- |
| Application tiering | Clustered monolith | Two-tier <br> (Gateway + Backend) |
| Protocol support | <ul> <li>AMQP</li> <li> STOMP </li> <li> OpenWire </li> </ul> | AMQP |
| Provisioning mode | <ul> <li> IaaS (on-premises) </li> <li> Amazon MQ (managed PaaS) </li> | Managed PaaS |
| Message size | Customer configurable | 1 MB (Premium tier) |
| High Availability | Customer managed | Platform managed |
| Disaster Recovery | Customer managed | Platform managed | 

### Current supported and unsupported features

[!INCLUDE [service-bus-jms-features-list](../../includes/service-bus-jms-feature-list.md)]

### Caveats

The two-tiered nature of Azure Service Bus affords various business continuity capabilities (high availability and disaster recovery). However, there are some considerations when utilizing JMS features.

#### Service upgrades

In case of service bus upgrades and restarts, temporary Queues or Topics will be deleted.

If the application is sensitive to data loss on temporary Queues or Topics, it is recommended to **not** use Temporary Queues or Topics and use durable Queues, Topics and Subscriptions instead.

#### Data migration

As part of migrating/modifying your client applications to interact with Azure Service Bus, the data held in ActiveMQ will not be migrated to Service Bus.

A custom application may be needed to drain the ActiveMQ queues, topics and subscriptions and replay the messages to Service Bus' queues, topics and subscriptions.

#### Authentication and authorization

Role Based Access Control (RBAC) backed by Azure ActiveDirectory is the preferred authentication mechanism for Azure Service Bus.

However, since RBAC is not currently supported due to lack of claim based authentication support by Apache QPID JMS.

For now, authentication is supported only with SAS keys.

## Pre-migration

### Version check

Below are the components utilized while writing the JMS applications and the specific versions that are supported. 

| Components | Version |
|---|---|
| Java Message Service (JMS) API | 1.1 or greater |
| AMQP protocol | 1.0 |

### Ensure that AMQP ports are open

Azure Service Bus supports communication over the AMQP protocol. For this purpose, communication over ports 5671 (AMQP) and 443 (TCP) needs to be enabled. Depending on where the client applications are hosted, you may need a support ticket to allow communication over these ports.

> [!IMPORTANT]
> Azure Service Bus supports **only** AMQP 1.0 protocol.

### Set up enterprise configurations (VNET, Firewall, private endpoint, etc.)

Azure Service Bus enables various enterprise security and high availability features. To learn more about them, follow the below documentation links.

  * [Virtual Network Service Endpoints](service-bus-service-endpoints.md)
  * [Firewall](service-bus-ip-filtering.md)
  * [Service side encryption with customer managed key (BYOK)](configure-customer-managed-key.md)
  * [Private endpoints](private-link-service.md)
  * [Authentication and Authorization](service-bus-authentication-and-authorization.md)

### Monitoring, alerts and tracing

Metrics are published for each Service Bus namespace onto Azure Monitor and can be leveraged for alerting and dynamic scaling of resources allocated to the namespace.

Read more about the different metrics and how to setup alerts on them at [Service Bus metrics in Azure Monitor](service-bus-metrics-azure-monitor.md).

Also, read more about [client side tracing for data operations](service-bus-end-to-end-tracing.md) and [operational/diagnostic logging for management operations](service-bus-diagnostic-logs.md)

### Metrics - NewRelic

Below is a handy guide on which metrics from ActiveMQ map to which metrics in Azure Service Bus. The below are referenced from NewRelic.

  * [ActiveMQ/Amazon MQ NewRelic Metrics](https://docs.newrelic.com/docs/integrations/amazon-integrations/aws-integrations-list/aws-mq-integration)
  * [Azure Service Bus NewRelic Metrics](https://docs.newrelic.com/docs/integrations/microsoft-azure-integrations/azure-integrations-list/azure-service-bus-monitoring-integration)

> [!NOTE]
> Currently, NewRelic doesn't have a seamless integration with ActiveMQ directly, but they do have metrics available for Amazon MQ.
> Since Amazon MQ is derived from ActiveMQ,the below guide maps the NewRelic metrics from AmazonMQ to Azure Service Bus.
>

|Metric Grouping| AmazonMQ/Active MQ metric | Azure Service Bus metric |
|------------|---------------------------|--------------------------|
|Broker|`CpuUtilization`|`CPUXNS`|
|Broker|`MemoryUsage`|`WSXNS`|
|Broker|`CurrentConnectionsCount`|`activeConnections`|
|Broker|`EstablishedConnectionsCount`|`activeConnections` + `connectionsClosed`|
|Broker|`InactiveDurableTopicSubscribersCount`|Leverage Subscription metrics|
|Broker|`TotalMessageCount`|Leverage Queue/Topic/Subscription level `activeMessages`|
|Queue/Topic|`EnqueueCount`|`incomingMessages`|
|Queue/Topic|`DequeueCount`|`outgoingMessages`|
|Queue|`QueueSize`|`sizeBytes`|



## Migration

To migrate your existing JMS 2.0 application to interact with Azure Service Bus, the below steps need to be performed.

### Export topology from ActiveMQ and create the entities in Azure Service Bus (optional)

To ensure that the client applications can seamlessly connect with Azure Service Bus, the topology - which includes Queues, Topics and Subscriptions - need to be migrated from **Apache ActiveMQ** to **Azure Service Bus**.

> [!NOTE]
> For Java Message Service (JMS) applications, creation of Queues, Topics and Subscriptions is a runtime operation. Most Java Message Service (JMS) providers (message brokers) offer the functionality to create *Queues*, *Topics* and *Subscriptions* at runtime.
>
> Hence, the above step is optional.
>
> To ensure that your application has the permissions to create the topology at runtime, please ensure that the connection string with ***SAS 'Manage'*** permissions is used.

To do this 
  * Leverage the [ActiveMQ Command Line tools](https://activemq.apache.org/activemq-command-line-tools-reference) to export the topology
  * Recreate the same topology using an [Azure Resource Manager template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md)
  * Execute the Azure Resource Manager template.


### Import the maven dependency for Service Bus JMS implementation

To ensure seamless connectivity with Azure Service Bus, the ***azure-servicebus-jms*** package needs to be added as a dependency to the Maven `pom.xml` file as below.

```xml
<dependencies>
...
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-servicebus-jms</artifactId>
    </dependency>
...
</dependencies>
```

### Application server configuration changes

This part is custom to the application server that is hosting your client applications connecting to Active MQ.

#### Tomcat

Here, we start with the configuration specific to Active MQ as shown in the `/META-INF/context.xml` file.

```XML
<Context antiJARLocking="true">
    <Resource
        name="jms/ConnectionFactory"
        auth="Container"
        type="org.apache.activemq.ActiveMQConnectionFactory"
        description="JMS Connection Factory"
        factory="org.apache.activemq.jndi.JNDIReferenceFactory"
        brokerURL="tcp://localhost:61616"
        brokerName="LocalActiveMQBroker"
        useEmbeddedBroker="false"/>

    <Resource name="jms/topic/MyTopic"
        auth="Container"
        type="org.apache.activemq.command.ActiveMQTopic"
        factory="org.apache.activemq.jndi.JNDIReferenceFactory"
        physicalName="MY.TEST.FOO"/>
    <Resource name="jms/queue/MyQueue"
        auth="Container"
        type="org.apache.activemq.command.ActiveMQQueue"
        factory="org.apache.activemq.jndi.JNDIReferenceFactory"
        physicalName="MY.TEST.FOO.QUEUE"/>
</Context>
```

which can be adapted as below to point to Azure Service Bus

```xml
<Context antiJARLocking="true">
    <Resource
        name="jms/ConnectionFactory"
        auth="Container"
        type="com.microsoft.azure.servicebus.jms.ServiceBusJmsConnectionFactory"
        description="JMS Connection Factory"
        factory="org.apache.qpid.jms.jndi.JNDIReferenceFactory"
        connectionString="<INSERT YOUR SERVICE BUS CONNECTION STRING HERE>"/>

    <Resource name="jms/topic/MyTopic"
        auth="Container"
        type="org.apache.qpid.jms.JmsTopic"
        factory="org.apache.qpid.jms.jndi.JNDIReferenceFactory"
        physicalName="MY.TEST.FOO"/>
    <Resource name="jms/queue/MyQueue"
        auth="Container"
        type="org.apache.qpid.jms.JmsQueue"
        factory="org.apache.qpid.jms.jndi.JNDIReferenceFactory"
        physicalName="MY.TEST.FOO.QUEUE"/>
</Context>
```

#### Spring applications

##### Update `application.properties` file

If using a Spring boot application to connect to ActiveMQ.

Here, the goal is to ***remove*** the ActiveMQ specific properties from the `application.properties` file.

```properties
spring.activemq.broker-url=<ACTIVEMQ BROKER URL>
spring.activemq.user=<ACTIVEMQ USERNAME>
spring.activemq.password=<ACTIVEMQ PASSWORD>
```

Then ***add*** the Service Bus specific properties to the `application.properties` file.

```properties
azure.servicebus.connection-string=Endpoint=myEndpoint;SharedAccessKeyName=mySharedAccessKeyName;SharedAccessKey=mySharedAccessKey
```

##### Replace the ActiveMQConnectionFactory with ServiceBusJmsConnectionFactory

The next step is to replace the instance of ActiveMQConnectionFactory with the ServiceBusJmsConnectionFactory.

> [!NOTE] 
> The actual code changes are specific to the application and how dependencies are managed, but the below sample provides the guidance on ***what*** should be changed.
>

Previously you may be instantiating an object of the the ActiveMQConnectionFactory as below.

```java

String BROKER_URL = "<URL of the hosted ActiveMQ broker>";
ConnectionFactory factory = new ActiveMQConnectionFactory(BROKER_URL);

Connection connection = factory.createConnection();
connection.start();

```

This would be changed to the instantiate an object of the ServiceBusJmsConnectionFactory

```java

ServiceBusJmsConnectionFactorySettings settings = new ServiceBusJmsConnectionFactorySettings();
String SERVICE_BUS_CONNECTION_STRING = "<Service Bus Connection string>";

ConnectionFactory factory = new ServiceBusJmsConnectionFactory(SERVICE_BUS_CONNECTION_STRING, settings);

Connection connection = factory.createConnection();
connection.start();

```

## Post-migration

Now that you have modified the application to starting sending and receiving messages from Azure Service Bus, you should verify that it works as you expect. Once that is done, you can proceed to further refine and modernize your application stack.

## Next steps

Leverage the [Spring Boot Starter for Azure Service Bus JMS](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus) for seamless integration with Azure Service Bus.

To learn more about Service Bus messaging and Java Message Service(JMS), see the following topics:

* [Service Bus JMS](service-bus-java-how-to-use-jms-api-amqp.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
