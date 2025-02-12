---
title: Kafka Streams for Apache Kafka in Event Hubs on Azure Cloud
description: Learn about how to use the Apache Kafka Streams API with Event Hubs service on Azure Cloud.
ms.topic: overview
ms.date: 04/29/2024
---

# Kafka Streams for Azure Event Hubs

This article provides details on how to us the [Kafka Streams](https://kafka.apache.org/documentation/streams/) client library with Azure Event Hubs.

> [!NOTE]
> Kafka Streams functionality is available in **Public Preview** for Event Hubs Premium and Dedicated tiers only.
>

## Overview

Apache Kafka Streams is a Java only client library that provides a framework for processing of streaming data and building real-time applications against the data stored in Kafka topics. All the processing is scoped to the client, while Kafka topics act as the data store for intermediate data, before the output is written to the destination topic.

Event Hubs provides a Kafka endpoint to be used with your existing Kafka client applications as an alternative to running your own Kafka cluster. Event Hubs works with many of your existing Kafka applications. For more information, see [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md).

## Using Kafka Streams with Azure Event Hubs

Azure Event Hubs natively supports both the AMQP and Kafka protocol. However, to ensure compatible Kafka Streams behavior, some of the default configuration parameters have to be updated for Kafka clients.

| Property | Default behavior for Event Hubs | Modified behavior for Kafka streams | Explanation |
| ----- | ---- | ----| ---- |
| `messageTimestampType` | set to `AppendTime` | should be set to `CreateTime` | Kafka Streams relies on creation timestamp rather than append timestamp |
| `message.timestamp.difference.max.ms` | max allowed value is 90 days | Property is used to govern past timestamps only. Future time is set to 1 hour and can't be changed. | This is in line with the Kafka protocol specification |
| `min.compaction.lag.ms` | | max allowed value is two days ||
| Infinite retention topics | | size based truncation of 250 GB for each topic-partition||
| Delete record API for infinite retention topics| | Not implemented. As a workaround, the topic can be updated and a finite retention time can be set.| This will be done in GA |

### Other considerations

Here are some of the other considerations to keep in mind.

  * Kafka streams client applications must be granted management, read, and write permissions for the entire namespaces to be able to create temporary topics for stream processing.
  * Temporary topics and partitions count towards the quota for the given namespace. These should be kept under consideration when provisioning the namespace or cluster.
  * Infinite retention time for "Offset" Store is limited by max message retention time of the SKU. Check [Event Hubs Quotas](event-hubs-quotas.md) for these tier specific values.


These include, updating the topic configuration in the `messageTimestampType` to use the `CreateTime` (that is, Event creation time) instead of the `AppendTime` (that is, log append time).

To override the default behavior (required), the below setting must be set in Azure Resource Manager (ARM).

> [!NOTE]
> Only the specific parts of the ARM template are shown to highlight the configuration that needs to be updated.
>

```json
{
  "parameters": {
    "namespaceName": "contoso-test-namespace",
    "resourceGroupName": "contoso-resource-group",
    "eventHubName": "contoso-event-hub-kafka-streams-test",
    ...
    "parameters": {
      "properties": {
        ...
        "messageTimestampType": "CreateTime",
        "retentionDescription": {
          "cleanupPolicy": "Delete",
          "retentionTimeInHours": -1,
          "tombstoneRetentionTimeInHours": 1
        }
      }
    }
  }
}
```

## Kafka Streams concepts

Kafka streams provides a simple abstraction layer over the Kafka producer and consumer APIs to help developers get started with real time streaming scenarios faster. The light-weight library depends on an **Apache Kafka compatible broker** (like Azure Event Hubs) for the internal messaging layer, and manages a **fault tolerant local state store**. With the transactional API, the Kafka streams library supports rich processing features such as **exactly once processing** and **one record at a time processing**.

Records arriving out of order benefit from **event-time based windowing operations**.

> [!NOTE]
> We recommend familiarizing yourself with [Kafka Streams documentation](https://kafka.apache.org/37/documentation/streams/) and [Kafka Streams core concepts](https://kafka.apache.org/37/documentation/streams/core-concepts).
>

### Streams

A stream is the abstracted representation of a Kafka topic. It consists of an unbounded, continuously updating data set of immutable data records, where each data record is a key-value pair.

### Stream processing topology

A Kafka streams application defines the computational logic through a [DAG (directed acyclic graph)](https://en.wikipedia.org/wiki/Directed_acyclic_graph) represented by a processor [topology](https://javadoc.io/doc/org.apache.kafka/kafka-streams/latest/org/apache/kafka/streams/Topology.html). The processor topology comprises stream processors(nodes in the topology) which represent a processing step, connected by streams(edges in the topology).

Stream processors can be chained to upstream processors or downstream processors, except for certain special cases: 
  * Source processors - These processors don't have any upstream processors and read from one or more streams directly. They can then be chained to downstream processors. 
  * Sink processors - These processors don't have any downstream processors and must write directly to a stream.

Stream processing topology can be defined either with the [Kafka Streams DSL](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html) or with the lower-level [Processor API](https://kafka.apache.org/37/documentation/streams/developer-guide/processor-api.html).


### Stream and Table duality

Streams and tables are 2 different but useful abstractions provided by the [Kafka Streams DSL](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html), modeling both time series and relational data formats that must coexist for stream processing use-cases. 

Kafka extends this further and introduces a duality between streams and tables, where a
  * A **stream** can be considered as a changelog of a **table**, and
  * A **table** can be considered as a snapshot of the latest value of each key in a **stream**.

This duality allows tables and streams to be used interchangeably as required by the use-case.

For example

  * Joining static customer data (modeled as a table) with dynamic transactions (modeled as a stream), and
  * Joining changing portfolio positions in a day traders portfolio (modeled as a stream) with the latest market data feed(modeled as a stream).

### Time

Kafka Streams allows windowing and grace functions to allow for out of order data records to be ingested and still be included in the processing. To ensure that this behavior is deterministic, there are additional notions of time in Kafka streams. These include: 

  * Creation time (also known as 'Event time') - This is the time when the event occurred and the data record was created.
  * Processing time - This is the time when the data record is processed by the stream processing application (or when it's consumed).
  * Append time (also known as 'Creation time') - This is the time when the data is stored and committed to the storage of the Kafka broker. This differs from the creation time because of the time difference between the creation of the event and the actual ingestion by the broker.


 

### Stateful operations

State management enables sophisticated stream processing applications like joining and aggregating data from different streams. This is achieved with state stores provided by Kafka Streams and accessed using [stateful operators in the Kafka Streams DSL](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html#stateful-transformations).

Stateful transformations in the DSL include:
  * [Aggregating](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html#streams-developer-guide-dsl-aggregating)
  * [Joining](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html#streams-developer-guide-dsl-joins)
  * [Windowing (as part of aggregations and joins)](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html#streams-developer-guide-dsl-windowing)
  * [Applying custom processors and transformers](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html#streams-developer-guide-dsl-process), which may be stateful, for Processor API integration

### Window and grace

Windowing operations in the  [Kafka Streams DSL](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html) allow developers to control how records are grouped for a given key for [stateful operations like aggregations and joins](#stateful-operations).

Windowing operations also permit the specification of a **grace period** to provide some flexibility for out-of-order records for a given window. A record that is meant for a given window and arrives after the given window but within the grace period is accepted. Records arriving after the grace period is over are discarded. 

Applications must utilize the windowing and grace period controls to improve fault tolerance for out-of-order records. The appropriate values vary based on the workload and must be identified empirically.


### Processing guarantees

Business and technical users seek to extract key business insights from the output of stream processing workloads, which translate to high transactional guarantee requirements. Kafka streams works together with Kafka transactions to ensure transactional processing guarantees by integrating with the Kafka compatible brokers' (such as Azure Event Hubs) underlying storage system to ensure that offset commits and state store updates are written atomically.

To ensure transactional processing guarantees, the `processing.guarantee` setting in the Kafka Streams configs must be updated from the default value of `at_least_once` to `exactly_once_v2` (for client versions at or after Apache Kafka 2.5) or `exactly_once` (for client versions before Apache Kafka 2.5.x).

## Next steps
This article provided an introduction to Event Hubs for Kafka. To learn more, see [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md).

For a **tutorial** with step-by-step instructions to create an event hub and access it using SAS or OAuth, see [Quickstart: Data streaming with Event Hubs using the Kafka protocol](event-hubs-quickstart-kafka-enabled-event-hubs.md).

Also, see the [OAuth samples on GitHub](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth).
