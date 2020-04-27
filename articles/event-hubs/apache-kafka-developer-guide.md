---
title: Apache Kafka developer guide for Event Hubs
description: This article provides links to articles that describe how to integrate your Kafka applications with Azure Event Hubs.
services: event-hubs
author: spelluru
manager: 
ms.author: spelluru
ms.date: 03/31/2020
ms.topic: article
ms.service: event-hubs
---

# Apache Kafka developer guide for Azure Event Hubs
This article provides links to articles that describe how to integrate your Apache Kafka applications with Azure Event Hubs. 

## Overview
Event Hubs provides a Kafka endpoint that can be used by your existing Kafka based applications as an alternative to running your own Kafka cluster. Event Hubs supports Apache Kafka protocol 1.0 and later, and works with your existing Kafka applications, including MirrorMaker. For more information, see [Event Hubs for Apache Kafka](event-hubs-for-kafka-ecosystem-overview.md)

## Quickstarts
You can find quickstarts in GitHub and in this content set that helps you quickly ramp up on Event Hubs for Kafka.

### Quickstarts in GitHub
See the following quickstarts in the **azure-event-hubs-for-kafka** repo: 

| Client language/framework | Description | 
| ------------------------- | ----------- | 
| [.NET](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/dotnet) | <p>This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in C# using .NET Core 2.0.</p><p>This sample is based on [Confluent's Apache Kafka .NET client](https://github.com/confluentinc/confluent-kafka-dotnet), modified for use with Event Hubs for Kafka.</p> | 
| [Java](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java) | This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in Java. |
| [Node.js](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/node) | <p>This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in Node.</p><p>This sample uses the [node-rdkafka](https://github.com/Blizzard/node-rdkafka) library. </p>| 
| [Python](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/python) | <p>This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in python.</p><p>This sample is based on [Confluent's Apache Kafka Python client](https://github.com/confluentinc/confluent-kafka-python), modified for use with Event Hubs for Kafka.</p>|
| [Go](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/go) | <p>This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in Go.</p><p>This sample is based on [Confluent's Apache Kafka Golang client](https://github.com/confluentinc/confluent-kafka-go), modified for use with Event Hubs for Kafka.</p>| 
| [Sarama kafka Go](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/go-sarama-client) | This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in Go using the [Sarama Kafka client](https://github.com/Shopify/sarama) library. |
| [Kafka](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/kafka-cli) | This quickstart will show how to create and connect to an Event Hubs Kafka endpoint using the CLI that comes bundled with the Apache Kafka distribution.| 
| [Kafkacat](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/kafkacat) | kafkacat is a non-JVM command-line consumer and producer based on librdkafka, popular due to its speed and small footprint. This quickstart contains a sample configuration and several simple sample kafkacat commands. | 
 
### Quickstarts in DOCS
See the quickstart: [Data streaming with Event Hubs using the Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md) in this content set, which provides step-by-step instructions on how to stream into Event Hubs. You learn how to use your producers and consumers to talk to Event Hubs with just a configuration change in your applications. 


## Tutorials 

### Tutorials in GitHub
See the following tutorials on GitHub:

| Tutorial | Description | 
| ------------------------- | ----------- | 
| [Akka](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/akka/java) | This tutorial shows how to connect Akka Streams to Kafka-enabled Event Hubs without changing your protocol clients or running your own clusters. There are two separate tutorials using **Java** and **Scala** programming languages. | 
| [Connect](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/connect) | This document will walk you through integrating Kafka Connect with Azure Event Hubs and deploying basic FileStreamSource and FileStreamSink connectors. While these connectors are not meant for production use, they demonstrate an end-to-end Kafka Connect Scenario where Azure Event Hubs masquerades as a Kafka broker.| 
| [Filebeat](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/filebeat) | This document will walk you through integrating Filebeat and Event Hubs via Filebeat's Kafka output. | 
| [Flink](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/flink) | This tutorial will show how to connect Apache Flink to Kafka-enabled Event Hubs without changing your protocol clients or running your own clusters. | 
| [FluentD](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/fluentd) | This document will walk you through integrating Fluentd and Event Hubs using the `out_kafka` output plugin for Fluentd. |
| [Interop](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/interop) | This tutorial shows you how to exchange events between consumers and producers using different protocols. |
| [Logstash](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/logstash) | This tutorial will walk you through integrating Logstash with Kafka-enabled Event Hubs using Logstash Kafka input/output plugins. | 
| [MirrorMaker](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/mirror-maker) | This tutorial shows how an event hub and Kafka MirrorMaker can integrate an existing Kafka pipeline into Azure by mirroring the Kafka input stream in the Event Hubs service. |
| [NiFi](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/nifi) | This tutorial will show how to connect Apache NiFi to an Event Hubs namespace. | 
| [OAuth](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth) | Quickstarts show you how to create and connect to an Event Hubs Kafka endpoint using an example producer and consumer written in Go and Java programming languages. |
| [Confluent's Schema Registry](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/schema-registry) | This tutorial will walk you through integrating Schema Registry and Event Hubs for Kafka. | 
| [Spark](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/spark) | This tutorial will show how to connect your Spark application to an event hub without changing your protocol clients or running your own Kafka clusters. | 

### Tutorials in DOCS
Also, see the tutorial: [Process Apache Kafka for Event Hubs events using Stream analytics](event-hubs-kafka-stream-analytics.md) in this content set, which shows how to stream data into Event Hubs and process it with Azure Stream Analytics.

## How-to guides
See the following How-to guides in our documentation:

| Article | Description | 
| ------- | ----------- | 
| [Mirror a Kafka broker in an event hub](event-hubs-kafka-mirror-maker-tutorial.md) | Shows how to mirror a Kafka broker in an event hub using Kafka MirrorMaker. |
| [Connect Apache Spark to an event hub](event-hubs-kafka-spark-tutorial.md) | Walks you through connecting your Spark application to Event Hubs for real-time streaming. |
| [Connect Apache Flink to an event hub](event-hubs-kafka-flink-tutorial.md) | Shows you how to connect Apache Flink to an event hub without changing your protocol clients or running your own clusters. |
| [Integrate Apache Kafka Connect with a event hub (Preview)](event-hubs-kafka-connect-tutorial.md) | Walks you through integrating Kafka Connect with an event hub and deploying basic FileStreamSource and FileStreamSink connectors. |
| [Connect Akka Streams to an event hub](event-hubs-kafka-akka-streams-tutorial.md) | Shows you how to connect Akka Streams to an event hub without changing your protocol clients or running your own clusters. |
| [Use the Spring Boot Starter for Apache Kafka with Azure Event Hubs](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub) | Demonstrates how to configure a Java-based Spring Cloud Stream Binder created with the Spring Boot Initializer to use Apache Kafka with Azure Event Hubs. |

## Next steps
Review samples in the GitHub repo [azure-event-hubs-for-kafka](https://github.com/Azure/azure-event-hubs-for-kafka) under quickstart and tutorials folders.

Also, see the following articles:

- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.md)
- [Apache Kafka migration guide for Event Hubs](apache-kafka-migration-guide.md)



