---
title: Use event hub from Apache Kafka app - Azure Event Hubs | Microsoft Docs
description: This article provides information on Apache Kafka support by Azure Event Hubs. 
services: event-hubs
documentationcenter: .net
author: shvija
manager: timlt

ms.service: event-hubs
ms.topic: article
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: bahariri

---
# Use Azure Event Hubs from Apache Kafka applications
Event Hubs provides a Kafka endpoint that can be used by your existing Kafka based applications as an alternative to running your own Kafka cluster. Event Hubs supports [Apache Kafka protocol 1.0 and later](https://kafka.apache.org/documentation/), and works with your existing Kafka applications, including MirrorMaker.  

## What does Event Hubs for Kafka provide?

The Event Hubs for Kafka feature provides a protocol head on top of Azure Event Hubs that is binary compatible with Kafka versions 1.0 and later for both reading from and writing to Kafka topics. You may start using the Kafka endpoint from your applications with no code change but a minimal configuration change. You update the connection string in configurations to point to the Kafka endpoint exposed by your event hub instead of pointing to your Kafka cluster. Then, you can start streaming events from your applications that use the Kafka protocol into Event Hubs. This integration also supports frameworks like [Kafka Connect](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/connect), which is currently in preview. 

Conceptually Kafka and Event Hubs are nearly identical: they are both partitioned logs built for streaming data. The following table maps concepts between Kafka and Event Hubs.

### Kafka and Event Hub conceptual mapping

| Kafka Concept | Event Hubs Concept|
| --- | --- |
| Cluster | Namespace |
| Topic | Event Hub |
| Partition | Partition|
| Consumer Group | Consumer Group |
| Offset | Offset|

### Key differences between Kafka and Event Hubs

While [Apache Kafka](https://kafka.apache.org/) is software, which you can run wherever you choose, Event Hubs is a cloud service similar to Azure Blob Storage. There are no servers or networks to manage and no brokers to configure. You create a namespace, which is an FQDN in which your topics live, and then create Event Hubs or topics within that namespace. For more information about Event Hubs and namespaces, see [Event Hubs features](event-hubs-features.md#namespace). As a cloud service, Event Hubs uses a single stable virtual IP address as the endpoint, so clients do not need to know about the brokers or machines within a cluster. 

Scale in Event Hubs is controlled by how many throughput units you purchase, with each throughput unit entitling you to 1 MB per second, or 1000 events per second of ingress. By default, Event Hubs scales up throughput units when you reach your limit with the [Auto-Inflate](event-hubs-auto-inflate.md) feature; this feature also works with the Event Hubs for Kafka feature. 

### Security and authentication

Azure Event Hubs requires SSL or TLS for all communication and uses Shared Access Signatures (SAS) for authentication. This requirement is also true for a Kafka endpoint within Event Hubs. For compatibility with Kafka, Event Hubs uses SASL PLAIN for authentication and SASL SSL for transport security. For more information about security in Event Hubs, see [Event Hubs authentication and security](event-hubs-authentication-and-security-model-overview.md).

## Other Event Hubs features available for Kafka

The Event Hubs for Kafka feature enables you to write with one protocol and read with another, so that your current Kafka producers can continue publishing via Kafka, and you can add readers with Event Hubs, such as Azure Stream Analytics or Azure Functions. Additionally, Event Hubs features such as [Capture](event-hubs-capture-overview.md) and [Geo Disaster-Recovery](event-hubs-geo-dr.md) also work with the Event Hubs for Kafka feature.

## Features that are not yet supported 

Here is the list of Kafka features that are not yet supported:

*	Idempotent producer
*	Transaction
*	Compression
*	Size-based retention
*	Log compaction
*	Adding partitions to an existing topic
*	HTTP Kafka API support
*	Kafka Streams

## Next steps

This article provided an introduction to Event Hubs for Kafka. To learn more, see the following links:

- [How to create Kafka enabled Event Hubs](event-hubs-create-kafka-enabled.md)
- [Stream into Event Hubs from your Kafka applications](event-hubs-quickstart-kafka-enabled-event-hubs.md)
- [Mirror a Kafka broker in a Kafka-enabled event hub](event-hubs-kafka-mirror-maker-tutorial.md)
- [Connect Apache Spark to a Kafka-enabled event hub](event-hubs-kafka-spark-tutorial.md)
- [Connect Apache Flink to a Kafka-enabled event hub](event-hubs-kafka-flink-tutorial.md)
- [Integrate Kafka Connect with a Kafka-enabled event hub](event-hubs-kafka-connect-tutorial.md)
- [Connect Akka Streams to a Kafka-enabled event hub](event-hubs-kafka-akka-streams-tutorial.md)
- [Explore samples on our GitHub](https://github.com/Azure/azure-event-hubs-for-kafka)


