---
title: Migrate Java Message Service (JMS) applications from Apache ActiveMQ to Azure Service Bus | Microsoft Docs
description: This article explains how to migrate existing JMS applications that interact with Apache ActiveMQ to interact with Azure Service Bus.
services: service-bus-messaging
documentationcenter: ''
author: spelluru
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 09/27/2021
ms.author: spelluru
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate existing Java Message Service (JMS) 2.0 applications from Apache ActiveMQ to Azure Service Bus

This article discusses how to modify an existing Java Message Service (JMS) 2.0 application that interacts with a JMS Broker to interact with Azure Service Bus instead. In particular, the article covers migrating from Apache ActiveMQ or Amazon MQ.

Azure Service Bus supports Java 2 Platform, Enterprise Edition and Spring workloads that use the JMS 2.0 API over Advanced Message Queueing Protocol (AMQP).

## Before you start

### Differences between Azure Service Bus and Apache ActiveMQ

Azure Service Bus and Apache ActiveMQ are both message brokers, functioning as JMS providers for client applications to send messages to and receive messages from. They both enable the point-to-point semantics with queues, and publish-subscribe semantics with topics and subscriptions. 

Even so, there are some differences between the two, as the following table shows:

| Category | ActiveMQ | Azure Service Bus |
| --- | --- | --- |
| Application tiering | Clustered monolith | Two-tier <br> (gateway + back end) |
| Protocol support | <ul> <li>AMQP</li> <li> STOMP </li> <li> OpenWire </li> </ul> | AMQP |
| Provisioning mode | <ul> <li> Infrastructure as a service (IaaS), on-premises </li> <li> Amazon MQ (managed platform as a service) </li> | Managed platform as a service (PaaS) |
| Message size | Customer configurable | 100 MB (Premium tier) |
| High availability | Customer managed | Platform managed |
| Disaster recovery | Customer managed | Platform managed | 

### Current supported and unsupported features

[!INCLUDE [service-bus-jms-features-list](./includes/service-bus-jms-feature-list.md)]

### Considerations

The two-tiered nature of Azure Service Bus affords various business continuity capabilities (high availability and disaster recovery). However, there are some considerations when you're using JMS features.

#### Service upgrades

In case of service bus upgrades and restarts, temporary queues or topics are deleted. If your application is sensitive to data loss on temporary queues or topics, don't use temporary queues or topics. Use durable queues, topics, and subscriptions instead.

#### Data migration

As part of migrating and modifying your client applications to interact with Azure Service Bus, the data held in ActiveMQ isn't migrated to Service Bus. You might need a custom application to drain the ActiveMQ queues, topics, and subscriptions, and then replay the messages to the queues, topics, and subscriptions of Service Bus.

#### Authentication and authorization

Azure role-based access control (Azure RBAC), backed by Azure Active Directory, is the preferred authentication mechanism for Service Bus. To enable role-based access control, please follow the steps in the [Azure Service Bus JMS 2.0 developer guide](jms-developer-guide.md).

## Pre-migration

### Version check

You use the following components and versions while you're writing the JMS applications: 

| Component | Version |
|---|---|
| Java Message Service (JMS) API | 1.1 or greater |
| AMQP protocol | 1.0 |

### Ensure that AMQP ports are open

Service Bus supports communication over the AMQP protocol. For this purpose, enable communication over ports 5671 (AMQP) and 443 (TCP). Depending on where the client applications are hosted, you might need a support ticket to allow communication over these ports.

> [!IMPORTANT]
> Service Bus supports only AMQP 1.0 protocol.

### Set up enterprise configurations

Service Bus enables various enterprise security and high availability features. For more information, see: 

  * [Virtual network service endpoints](service-bus-service-endpoints.md)
  * [Firewall](service-bus-ip-filtering.md)
  * [Service side encryption with customer managed key (BYOK)](configure-customer-managed-key.md)
  * [Private endpoints](private-link-service.md)
  * [Authentication and authorization](service-bus-authentication-and-authorization.md)

### Monitoring, alerts and tracing

For each Service Bus namespace, you publish metrics onto Azure Monitor. You can use these metrics for alerting and dynamic scaling of resources allocated to the namespace.

For more information about the different metrics and how to set up alerts on them, see [Service Bus metrics in Azure Monitor](monitor-service-bus-reference.md). You can also find out more about [client side tracing for data operations](service-bus-end-to-end-tracing.md) and [operational/diagnostic logging for management operations](monitor-service-bus-reference.md#resource-logs).

### Metrics - New Relic

You can correlate which metrics from ActiveMQ map to which metrics in Azure Service Bus. See the following from the New Relic website:

  * [ActiveMQ/Amazon MQ New Relic Metrics](https://docs.newrelic.com/docs/integrations/amazon-integrations/aws-integrations-list/aws-mq-integration)
  * [Azure Service Bus New Relic Metrics](https://docs.newrelic.com/docs/integrations/microsoft-azure-integrations/azure-integrations-list/azure-service-bus-monitoring-integration)

> [!NOTE]
> Currently, New Relic doesn't have direct, seamless integration with ActiveMQ, but they do have metrics available for Amazon MQ. Because Amazon MQ is derived from ActiveMQ, the following table maps the New Relic metrics from Amazon MQ to Azure Service Bus.
>

|Metric grouping| Amazon MQ/ActiveMQ metric | Azure Service Bus metric |
|------------|---------------------------|--------------------------|
|Broker|`CpuUtilization`|`CPUXNS`|
|Broker|`MemoryUsage`|`WSXNS`|
|Broker|`CurrentConnectionsCount`|`activeConnections`|
|Broker|`EstablishedConnectionsCount`|`activeConnections` + `connectionsClosed`|
|Broker|`InactiveDurableTopicSubscribersCount`|Use subscription metrics|
|Broker|`TotalMessageCount`|Use queue/topic/subscription level `activeMessages`|
|Queue/Topic|`EnqueueCount`|`incomingMessages`|
|Queue/Topic|`DequeueCount`|`outgoingMessages`|
|Queue|`QueueSize`|`sizeBytes`|



## Migration

To migrate your existing JMS 2.0 application to interact with Service Bus, follow the steps in the next several sections.

### Export the topology from ActiveMQ and create the entities in Service Bus (optional)

To ensure that client applications can seamlessly connect with Service Bus, migrate the topology (including queues, topics, and subscriptions) from Apache ActiveMQ to Service Bus.

> [!NOTE]
> For JMS applications, you create queues, topics, and subscriptions as a runtime operation. Most JMS providers (message brokers) give you the ability to create these at runtime. That's why this export step is considered optional. To ensure that your application has the permissions to create the topology at runtime, use the connection string with SAS `Manage` permissions.

To do this:

1. Use the [ActiveMQ command line tools](https://activemq.apache.org/activemq-command-line-tools-reference) to export the topology.
1. Re-create the same topology by using an [Azure Resource Manager template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).
1. Run the Azure Resource Manager template.


### Import the maven dependency for Service Bus JMS implementation

To ensure seamless connectivity with Service Bus, add the `azure-servicebus-jms` package as a dependency to the Maven `pom.xml` file, as follows:

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

This part is customized to the application server that is hosting your client applications connecting to ActiveMQ.

#### Spring applications

##### Update the `application.properties` file

If you're using a Spring boot application to connect to ActiveMQ, you want to remove the ActiveMQ-specific properties from the `application.properties` file.

```properties
spring.activemq.broker-url=<ACTIVEMQ BROKER URL>
spring.activemq.user=<ACTIVEMQ USERNAME>
spring.activemq.password=<ACTIVEMQ PASSWORD>
```

Then, add the Service Bus-specific properties to the `application.properties` file.

```properties
azure.servicebus.connection-string=Endpoint=myEndpoint;SharedAccessKeyName=mySharedAccessKeyName;SharedAccessKey=mySharedAccessKey
```

##### Replace `ActiveMQConnectionFactory` with `ServiceBusJmsConnectionFactory`

The next step is to replace the instance of `ActiveMQConnectionFactory` with the `ServiceBusJmsConnectionFactory`.

> [!NOTE] 
> The actual code changes are specific to the application and how dependencies are managed, but the following sample provides the guidance on what should be changed.
>

Previously, you might have been instantiating an object of `ActiveMQConnectionFactory`, as follows:

```java

String BROKER_URL = "<URL of the hosted ActiveMQ broker>";
ConnectionFactory factory = new ActiveMQConnectionFactory(BROKER_URL);

Connection connection = factory.createConnection();
connection.start();

```

Now, you're changing this to instantiate an object of `ServiceBusJmsConnectionFactory`, as follows:

```java

ServiceBusJmsConnectionFactorySettings settings = new ServiceBusJmsConnectionFactorySettings();
String SERVICE_BUS_CONNECTION_STRING = "<Service Bus Connection string>";

ConnectionFactory factory = new ServiceBusJmsConnectionFactory(SERVICE_BUS_CONNECTION_STRING, settings);

Connection connection = factory.createConnection();
connection.start();

```

## Post-migration

Now that you have modified the application to start sending and receiving messages from Service Bus, you should verify that it works as you expect. When that's done, you can proceed to further refine and modernize your application stack.

## Next steps

Use the [Spring Boot Starter for Azure Service Bus JMS](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus) for seamless integration with Service Bus.

To learn more about Service Bus messaging and JMS, see:

* [Service Bus JMS](service-bus-java-how-to-use-jms-api-amqp.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
