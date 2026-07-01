---
title: Apache Kafka developer guide for Event Hubs
description: A comprehensive guide for Kafka developers building applications with Azure Event Hubs, including quickstarts, tutorials, and integration patterns.
ms.date: 12/17/2025
ms.subservice: kafka
ms.topic: article
---

# Apache Kafka developer guide for Azure Event Hubs

This guide helps Kafka developers build and migrate applications to Azure Event Hubs. Whether you're connecting an existing Kafka application or building a new streaming solution, you'll find quickstarts, tutorials, and integration patterns organized by your development journey.

## Prerequisites

Before you start developing, ensure you have:

- An Azure Event Hubs namespace with Kafka enabled (Standard tier or higher)
- Your preferred Kafka client library installed
- Connection string or Microsoft Entra credentials for authentication

For an overview of how Event Hubs works with Kafka, see [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md).

## Get started in 5 minutes

The fastest way to connect to Event Hubs is to modify your existing Kafka client configuration. No code changes required—just update your connection settings.

**Quick start**: [Data streaming with Event Hubs using the Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md) walks you through connecting producers and consumers with just a configuration change.

### Language-specific quickstarts

Choose your language to get a working producer and consumer sample:

| Language | Sample | Client library |
|----------|--------|----------------|
| **Java** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java) | Apache Kafka client |
| **C# / .NET** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/dotnet) | Confluent .NET client |
| **Python** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/python) | Confluent Python client |
| **Node.js** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/node) | node-rdkafka |
| **Go** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/go) | Confluent Go client |
| **Go (Sarama)** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/go-sarama-client) | Sarama client |

### Command-line tools

For testing and debugging, use these CLI tools:

| Tool | Sample | Use case |
|------|--------|----------|
| **Kafka CLI** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/kafka-cli) | Bundled with Apache Kafka distribution |
| **kcat** | [Quickstart](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/kafkacat) | Lightweight, fast CLI based on librdkafka |

## Build streaming pipelines

Once you've connected your application, you can build more sophisticated streaming pipelines. This section covers integrations with popular stream processing frameworks and data integration tools.

### Stream processing frameworks

Connect your stream processing applications to Event Hubs:

| Framework | Tutorial | Description |
|-----------|----------|-------------|
| **Apache Spark** | [Tutorial](event-hubs-kafka-spark-tutorial.md) | Real-time streaming with Spark Structured Streaming |
| **Apache Flink** | [Tutorial](event-hubs-kafka-flink-tutorial.md) | Stateful stream processing with exactly-once semantics |
| **Akka Streams** | [Tutorial](event-hubs-kafka-akka-streams-tutorial.md) | Reactive stream processing for Scala and Java |
| **Azure Stream Analytics** | [Tutorial](event-hubs-kafka-stream-analytics.md) | No-code stream processing with SQL-like queries |
| **Spring Cloud Stream** | [Tutorial](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub) | Spring Boot integration using Kafka binder |

### Data integration with Kafka Connect

Kafka Connect enables you to stream data between Event Hubs and external systems using pre-built connectors:

| Resource | Description |
|----------|-------------|
| [Kafka Connect integration](event-hubs-kafka-connect-tutorial.md) | Deploy and configure Kafka Connect with Event Hubs |
| [Kafka Connect tutorial (GitHub)](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/connect) | End-to-end example with FileStreamSource and FileStreamSink |

### Log aggregation and observability

Centralize logs from your infrastructure into Event Hubs:

| Tool | Tutorial | Description |
|------|----------|-------------|
| **Logstash** | [Tutorial](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/logstash) | Elastic Stack log pipeline |
| **Filebeat** | [Tutorial](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/filebeat) | Lightweight log shipper |
| **FluentD** | [Tutorial](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/fluentd) | Unified logging layer |
| **Apache NiFi** | [Tutorial](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/nifi) | Visual dataflow management |

## Migrate existing Kafka workloads

If you're migrating from an existing Kafka cluster, Event Hubs supports replication and hybrid scenarios.

### Replicate data with MirrorMaker

Use Kafka MirrorMaker to replicate data from an existing Kafka cluster to Event Hubs:

| Resource | Description |
|----------|-------------|
| [Mirror a Kafka broker to Event Hubs](event-hubs-kafka-mirror-maker-tutorial.md) | Step-by-step guide for MirrorMaker setup |
| [MirrorMaker tutorial (GitHub)](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/mirror-maker) | Sample configurations and scripts |

### Migration planning

For a complete migration guide, including configuration mapping and feature differences, see [Apache Kafka migration guide for Event Hubs](apache-kafka-migration-guide.md).

## Advanced scenarios

### Schema management

Manage schemas for your Kafka applications:

| Resource | Description |
|----------|-------------|
| [Azure Schema Registry](schema-registry-overview.md) | Native schema registry built into Event Hubs |
| [Confluent Schema Registry integration](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/schema-registry) | Use Confluent Schema Registry with Event Hubs |

### Authentication with OAuth / Microsoft Entra ID

For production workloads, use Microsoft Entra ID instead of connection strings:

| Resource | Description |
|----------|-------------|
| [OAuth tutorial (GitHub)](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth) | Java and Go samples for OAuth authentication |

### Protocol interoperability

Event Hubs supports multiple protocols. Learn how to exchange events between Kafka and AMQP clients:

| Resource | Description |
|----------|-------------|
| [Interop tutorial (GitHub)](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/interop) | Exchange events between different protocols |

## Configuration reference

For recommended Kafka client configurations when using Event Hubs, see [Apache Kafka client configurations](apache-kafka-configurations.md). This guide covers:

- Required connection settings
- Configurations that differ from Kafka defaults
- Event Hubs-specific constraints
- Troubleshooting common configuration issues

## Get help

- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.yml)
- [GitHub samples repository](https://github.com/Azure/azure-event-hubs-for-kafka)



