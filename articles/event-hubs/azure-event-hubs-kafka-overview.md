---
title: Introduction to Apache Kafka in Event Hubs on Azure Cloud
description: Learn what Apache Kafka in the Event Hubs service on Azure Cloud is and how to use it to stream data from Apache Kafka applications without setting up a Kafka cluster on your own.
ms.topic: overview
ms.date: 11/16/2023
---

# What is Azure Event Hubs for Apache Kafka

This article explains how you can use Azure Event Hubs to stream data from [Apache Kafka](https://kafka.apache.org) applications without setting up a Kafka cluster on your own.

## Overview

Azure Event Hubs provides an Apache Kafka endpoint on an event hub, which enables users to connect to the event hub using the Kafka protocol. You can often use an event hub's Kafka endpoint from your applications without any code changes. You modify only the configuration, that is, update the connection string in configurations to point to the Kafka endpoint exposed by your event hub instead of pointing to a Kafka cluster. Then, you can start streaming events from your applications that use the Kafka protocol into event hubs, which are equivalent to Kafka topics.

> [!NOTE]
> Event Hubs for Kafka Ecosystems supports [Apache Kafka version 1.0](https://kafka.apache.org/10/documentation.html) and later.

## Apache Kafka and Azure Event Hubs conceptual mapping

Conceptually, Kafka and Event Hubs are very similar. They're both partitioned logs built for streaming data, whereby the client controls which part of the retained log it wants to read. The following table maps concepts between Kafka and Event Hubs.

| Kafka Concept | Event Hubs Concept|
| --- | --- |
| Cluster | Namespace |
| Topic | An event hub |
| Partition | Partition|
| Consumer Group | Consumer Group |
| Offset | Offset|

## Key differences between Apache Kafka and Azure Event Hubs

While [Apache Kafka](https://kafka.apache.org/) is software you typically need to install and operate, Event Hubs is a fully managed, cloud-native service. There are no servers, disks, or networks to manage and monitor and no brokers to consider or configure, ever. You create a namespace, which is an endpoint with a fully qualified domain name, and then you create Event Hubs (topics) within that namespace. 

For more information about Event Hubs and namespaces, see [Event Hubs features](event-hubs-features.md#namespace). As a cloud service, Event Hubs uses a single stable virtual IP address as the endpoint, so clients don't need to know about the brokers or machines within a cluster. Even though Event Hubs implements the same protocol, this difference means that all Kafka traffic for all partitions is predictably routed through this one endpoint rather than requiring firewall access for all brokers of a cluster.   

Scale in Event Hubs is controlled by how many [throughput units (TUs)](event-hubs-scalability.md#throughput-units) or [processing units](event-hubs-scalability.md#processing-units) you purchase. If you enable the [Auto-Inflate](event-hubs-auto-inflate.md) feature for a standard tier namespace, Event Hubs automatically scales up TUs when you reach the throughput limit. This feature also works with the Apache Kafka protocol support. For a premier tier namespace, you can increase the number of processing units assigned to the namespace. 

## Is Apache Kafka the right solution for your workload?

Coming from building applications using Apache Kafka, it's also useful to understand that Azure Event Hubs is part of a fleet of services, which also includes [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md), and [Azure Event Grid](../event-grid/overview.md). 

While some providers of commercial distributions of Apache Kafka might suggest that Apache Kafka is a one-stop-shop for all your messaging platform needs, the reality is that Apache Kafka doesn't implement, for instance, the [competing-consumer](/azure/architecture/patterns/competing-consumers) queue pattern, doesn't have support for  [publish-subscribe](/azure/architecture/patterns/publisher-subscriber) at a level that allows subscribers access to the incoming messages based on server-evaluated rules other than plain offsets, and it has no facilities to track the lifecycle of a job initiated by a message or sidelining faulty messages into a dead-letter queue, all of which are foundational for many enterprise messaging scenarios.

To understand the differences between patterns and which pattern is best covered by which service, see the [Asynchronous messaging options in Azure](/azure/architecture/guide/technology-choices/messaging) guidance. As an Apache Kafka user, you may find that communication paths you have so far realized with Kafka, can be realized with far less basic complexity and yet more powerful capabilities using either Event Grid or Service Bus. 

If you need specific features of Apache Kafka that aren't available through the Event Hubs for Apache Kafka interface or if your implementation pattern exceeds the [Event Hubs quotas](event-hubs-quotas.md), you can also run a [native Apache Kafka cluster in Azure HDInsight](../hdinsight/kafka/apache-kafka-introduction.md).  

## Security and authentication
Every time you publish or consume events from an Event Hubs for Kafka, your client is trying to access the Event Hubs resources. You want to ensure that the resources are accessed using an authorized entity. When using Apache Kafka protocol with your clients, you can set your configuration for authentication and encryption using the SASL mechanisms. When using Event Hubs for Kafka  requires the TLS-encryption (as all data in transit with Event Hubs is TLS encrypted), it can be done specifying the SASL_SSL option in your configuration file. 

Azure Event Hubs provides multiple options to authorize access to your secure resources. 

- OAuth 2.0
- Shared access signature (SAS)

### OAuth 2.0
Event Hubs integrates with Microsoft Entra ID, which provides an **OAuth 2.0** compliant centralized authorization server. With Microsoft Entra ID, you can use Azure role-based access control (Azure RBAC) to grant fine grained permissions to your client identities. You can use this feature with your Kafka clients by specifying **SASL_SSL** for the protocol and  **OAUTHBEARER** for the mechanism. For details about Azure roles and levels for scoping access, see [Authorize access with Microsoft Entra ID](authorize-access-azure-active-directory.md).

```properties
bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=OAUTHBEARER
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required;
sasl.login.callback.handler.class=CustomAuthenticateCallbackHandler
```

> [!NOTE]
> The above configuration properties are for the Java programming language. For **samples** that show how to use OAuth with Event Hubs for Kafka using different programming languages, see [samples on GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth).


### Shared Access Signature (SAS)
Event Hubs also provides the **Shared Access Signatures (SAS)** for delegated access to Event Hubs for Kafka resources. Authorizing access using OAuth 2.0 token-based mechanism provides superior security and ease of use over SAS. The built-in roles can also eliminate the need for ACL-based authorization, which has to be maintained and managed by the user. You can use this feature with your Kafka clients by specifying **SASL_SSL** for the protocol and **PLAIN** for the mechanism. 

```properties
bootstrap.servers=NAMESPACENAME.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
```

> [!IMPORTANT]
> Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md). Here's an example configuration: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";`

> [!NOTE]
> When using SAS authentication with Kafka clients, established connections aren't disconnected when the SAS key is regenerated. 

> [!NOTE]
> [Generated shared access signature tokens](authenticate-shared-access-signature.md#generate-a-shared-access-signature-token) are not supported when using the Event Hubs for Apache Kafka endpoint.

## Samples 
For a **tutorial** with step-by-step instructions to create an event hub and access it using SAS or OAuth, see [Quickstart: Data streaming with Event Hubs using the Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md).

## Other Azure Event Hubs features 

The Event Hubs for Apache Kafka feature is one of three protocols concurrently available on Azure Event Hubs, complementing HTTP and AMQP. You can write with any of these protocols and read with any another, so that your current Apache Kafka producers can continue publishing via Apache Kafka, but your reader can benefit from the native integration with Event Hubs' AMQP interface, such as Azure Stream Analytics or Azure Functions. Conversely, you can readily integrate Azure Event Hubs into AMQP routing networks as a target endpoint, and yet read data through Apache Kafka integrations.  

Additionally, Event Hubs features such as [Capture](event-hubs-capture-overview.md), which enables extremely cost efficient long-term archival via Azure Blob Storage and Azure Data Lake Storage, and [Geo Disaster-Recovery](event-hubs-geo-dr.md) also work with the Event Hubs for Kafka feature.

## Idempotency

Azure Event Hubs for Apache Kafka supports both idempotent producers and idempotent consumers. 

One of the core tenets of Azure Event Hubs is the concept of **at-least once** delivery. This approach ensures that events will always be delivered. It also means that events can be received more than once, even repeatedly, by consumers such as a function. For this reason, it's important that the consumer supports the [idempotent consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html) pattern. 

## Feature differences with Apache Kafka

The goal of Event Hubs for Apache Kafka is to provide access to Azure Event Hubs capabilities to applications that are locked into the Apache Kafka API and would otherwise have to be backed by an Apache Kafka cluster. 

As explained [above](#is-apache-kafka-the-right-solution-for-your-workload), the Azure Messaging fleet provides rich and robust coverage for a multitude of messaging scenarios, and although the following features aren't currently supported through Event Hubs' support for the Apache Kafka API, we point out where and how the desired capability is available.

### Transactions

[Azure Service Bus](../service-bus-messaging/service-bus-transactions.md) has robust transaction support that allows receiving and settling messages and sessions while sending outbound messages resulting from message processing to multiple target entities under the consistency protection of a transaction. The feature set not only allows for exactly once processing of each message in a sequence, but also avoids the risk of another consumer inadvertently reprocessing the same messages as it would be the case with Apache Kafka. Service Bus is the recommended service for transactional message workloads.

### Compression

The client-side [compression](https://cwiki.apache.org/confluence/display/KAFKA/Compression) feature of Apache Kafka compresses a batch of multiple messages into a single message on the producer side and decompresses the batch on the consumer side. The Apache Kafka broker treats the batch as a special message.

Kafka producer application developers can enable message compression by setting the compression.type property. In the public preview, the only compression algorithm supported is gzip. 
     Compression.type = none | gzip
These changes are exposed in the header which then allows the consumer to properly decompress the data. The feature is currently only supported for Apache Kafka traffic producer and consumer traffic and not AMQP or web service. This means that your consumer needs to use the Kafka protocol if your producer configured Kafka compression.

The payload of any Event Hubs event is a byte stream and the content can be compressed with an algorithm of your choosing though in public preview, the only option is gzip. The Apache Avro encoding format supports compression natively.	The benefits of using Kafka compression are through smaller message size, increased payload size you can transmit, and lower message broker resource consumption.  

### Kafka Streams

Kafka Streams is a client library for stream analytics that is part of the Apache Kafka open-source project, but is separate from the Apache Kafka event stream broker. 

The most common reason Azure Event Hubs customers ask for Kafka Streams support is because they're interested in Confluent's "ksqlDB" product. "ksqlDB" is a proprietary shared source project that is [licensed such](https://github.com/confluentinc/ksql/blob/master/LICENSE) that no vendor "offering software-as-a-service, platform-as-a-service, infrastructure-as-a-service, or other similar online services that compete with Confluent products or services" is permitted to use or offer "ksqlDB" support. Practically, if you use ksqlDB, you must either operate Kafka yourself or you must use Confluent’s cloud offerings. The licensing terms might also affect Azure customers who offer services for a purpose excluded by the license.

Standalone and without ksqlDB, Kafka Streams has fewer capabilities than many alternative frameworks and services, most of which have built-in streaming SQL interfaces, and all of which integrate with Azure Event Hubs today:

- [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md)
- [Azure Synapse Analytics (via Event Hubs Capture)](../event-grid/event-hubs-integration.md)
- [Azure Databricks](/azure/databricks/scenarios/databricks-stream-from-eventhubs)
- [Apache Samza](https://samza.apache.org/learn/documentation/latest/connectors/eventhubs)
- [Apache Storm](event-hubs-storm-getstarted-receive.md)
- [Apache Spark](event-hubs-kafka-spark-tutorial.md)
- [Apache Flink](event-hubs-kafka-flink-tutorial.md)
- [Akka Streams](event-hubs-kafka-akka-streams-tutorial.md)

The listed services and frameworks can generally acquire event streams and reference data directly from a diverse set of sources through adapters. Kafka Streams can only acquire data from Apache Kafka and your analytics projects are therefore locked into Apache Kafka. To use data from other sources, you're required to first import data into Apache Kafka with the Kafka Connect framework.

If you must use the Kafka Streams framework on Azure, [Apache Kafka on HDInsight](../hdinsight/kafka/apache-kafka-introduction.md) will provide you with that option. Apache Kafka on HDInsight provides full control over all configuration aspects of Apache Kafka, while being fully integrated with various aspects of the Azure platform, from fault/update domain placement to network isolation to monitoring integration. 

## Next steps
This article provided an introduction to Event Hubs for Kafka. To learn more, see [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md).

For a **tutorial** with step-by-step instructions to create an event hub and access it using SAS or OAuth, see [Quickstart: Data streaming with Event Hubs using the Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md).

Also, see the [OAuth samples on GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth).
