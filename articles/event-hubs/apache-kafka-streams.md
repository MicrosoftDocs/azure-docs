---
title: Kafka Streams for Apache Kafka in Event Hubs on Azure Cloud
description: Learn about how to use the Apache Kafka Streams API with Event Hubs service on Azure Cloud.
ms.topic: overview
ms.date: 04/29/2024
---

# Kafka Streams for Azure Event Hubs

This article provides details on how to us the [Kafka Streams](https://kafka.apache.org/documentation/streams/) client library with Azure Event Hubs.

## Overview

Apache Kafka Streams is a Java only client library that provides a framework for processing of streaming data and building real-time applications against the data stored in Kafka topics. All the processing is scoped to the client, while Kafka topics act as the data store for intermediate data, before the output is written to the destination topic.

Event Hubs provides a Kafka endpoint that can be used by your existing Kafka client applications as an alternative to running your own Kafka cluster. Event Hubs works with many of your existing Kafka applications. For more information, see [Event Hubs for Apache Kafka](azure-event-hubs-kafka-overview.md).

## Kafka Streams concepts

Kafka streams provides a simple abstraction layer over the Kafka producer and consumer APIs to help developers get started with real time streaming scenarios faster. The light-weight library depends on an **Apache Kafka compatible broker** (like Azure Event Hubs) for the internal messaging layer, and manages a **fault tolerant local state store**. With the transactional API, the Kafka streams library supports rich processing features such as **exactly once processing** and **one record at a time processing**.

Records arriving out of order benefit from **event-time based windowing operations**.

> [!NOTE]
> We recommend familiarizing yourself with [Kafka Streams documentation](https://kafka.apache.org/37/documentation/streams/) and [Kafka Streams core concepts](https://kafka.apache.org/37/documentation/streams/core-concepts).
>

### Streams

The stream is the abstracted representation of a Kafka topic. It consists of an unbounded, continously updating data set of immutable data records, where each data record is a key-value pair.

### Stream processing topology

A Kafka streams application defines the computational logic through a [DAG (directed acyclic graph)](https://en.wikipedia.org/wiki/Directed_acyclic_graph) represented by a processor [topology](https://javadoc.io/doc/org.apache.kafka/kafka-streams/latest/org/apache/kafka/streams/Topology.html). The processor topology comprises stream processors(nodes in the topology) which represent a processing step, connected by streams(edges in the topology).

Stream processors can be chained to upstream processors or downstream processors, except for certain special cases - 
  * Source processors - These processors don't have any upstream processors and read from one or more streams directly. They can then be chained to downstream processors. 
  * Sink processors - These processors don't have any downstream processors and must write directly to a stream.

Stream processing topology can be defined either with the [Kafka Streams DSL](https://kafka.apache.org/37/documentation/streams/developer-guide/dsl-api.html) or with the lower-level [Processor API](https://kafka.apache.org/37/documentation/streams/developer-guide/processor-api.html).

### KStream

### KTable

### Stream <-> Table duality

### Created time vs append time

### Window and grace

### States

### Processing guarantees