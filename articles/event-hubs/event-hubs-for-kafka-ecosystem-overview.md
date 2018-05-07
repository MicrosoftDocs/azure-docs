---
title: Azure Event Hubs for Kafka Ecosystems | Microsoft Docs
description: Overview and introduction to Kafka enabled Azure Event Hubs
services: event-hubs
documentationcenter: .net
author: djrosanova
manager: timlt
editor: ''

ms.assetid:
ms.service: event-hubs
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/03/2018
ms.author: darosa

---
# Event Hubs for Kafka Ecosystems

Event Hubs for Kafka Ecosystems provides a Kafka endpoint that can be used by your existing Kafka based applications as an alternative to running your own Kafka cluster. Event Hubs for Kafka Ecosystem supports [Apache Kafka 1.0](https://kafka.apache.org/10/documentation.html) and newer client versions and works with your existing Kafka applications, including mirror maker. Change your connection string and start running your Kafka applications on Event Hubs.

## What does Event Hubs for Kafka Ecosystems provide?

Event Hubs for Kafka Ecosystem provides a protocol head on top of Azure Event Hubs that is binary compatible with Kafka versions 1.0 and later for both reading from and writing to Kafka topics. Conceptually Kafka and Event Hubs are nearly identical: they are both partitioned logs built for streaming data. The following table maps concepts between Kafka and Event Hubs.

### Kafka and Event Hub conceptual mapping

| Kafka Concept | Event Hubs Concept|
| --- | --- |
| Cluster | Namespace |
| Topic | Event Hubs |
| Partition | Partition|
| Consumer Group | Consumer Group |
| Offset | Offset|

### Key differences between Kafka and Event Hubs

While [Apache Kafka](https://kafka.apache.org/) is software, which you can run wherever you choose, Event Hubs is a cloud service similar to Azure Blob Storage. There are no servers or networks to manage and no brokers to configure. You create a Namespace, which is an FQDN for your topics to live in and then create Event Hubs or Topics within that Namespace. For more information about Event Hubs and Namespaces, see [What is Event Hubs](https://docs.microsoft.com/azure/event-hubs/event-hubs-what-is-event-hubs). As a cloud service Event Hubs uses a single stable virtual IP address as the endpoint, so clients do not need to know about the brokers or machines within a cluster. 

Scale in Event Hubs is controlled by how many Throughput Units you purchase, with each Throughput Unit entitling you to 1 MBps or 1000 events per second of ingress. By default Event Hubs will scale up Throughput Units when you hit your limit with the [Auto-Inflate](https://docs.microsoft.com/azure/event-hubs/event-hubs-auto-inflate) feature; this feature also works with Event Hubs for Kafka Ecosystems. 

### Security and Authentication

Azure Event Hubs requires SSL or TLS for all communication and uses Share Access Signatures for security. This is also true for the Kafka endpoint within Event Hubs. For compatibility with Kafka, Event Hubs uses SASL PLAIN for authentication and SASL SSL for transport security. For more information about security in Event Hubs, see [Event Hubs authentication and security](https://docs.microsoft.com/azure/event-hubs/event-hubs-authentication-and-security-model-overview).

## Other Event Hubs features available for Kafka

Event Hubs for Kafka Ecosystem allows you to write with one protocol and read with another, so your current Kafka producers can continue publishing via Kafka and you can add readers with Event Hubs like Azure Stream Analytics or Azure Functions. Additionally Event Hubs features like [Capture](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview) and [Geo Disaster-Recovery](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr) also work with Event Hubs for Kafka Ecosystems.

## Features that are not supported in the preview

The following Kafka features for public preview of this integration are not supported in Event Hubs for Kafka Ecosystems.
*	Idempotent producer
*	Transaction
*	Compression
*	Size-based retention
*	Log compaction
*	Adding partitions to an existing topic
*	HTTP Kafka API support
*	Kafka Connect
*	Kafka Streams


This article has given you an introduction to Event Hubs for Kafka Ecosystem. Unleash this power by trying Kafka enabled Event Hubs.

## Next steps

* [How to create Kafka enabled Event Hubs](event-hubs-what-is-event-hubs.md)
* [Stream into Event Hubs from your Kafka applications](event-hubs-what-is-event-hubs.md)
* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)

 
 

