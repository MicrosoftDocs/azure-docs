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

Kafka streams provides a simple abstraction layer over the Kafka producer and consumer APIs to help developers get started with real time streaming scenarios faster. The simple library only depends on an **Apache Kafka compatible broker** for the internal messaging layer, and manages a **fault tolerant local state store**. With the transactional API, the Kafka streams library supports rich processing features such as **exactly once processing** and **one record at a time processing**.

Records arriving out of order benefit from **event-time based windowing operations**.

### Topology

### KStream

### KTable

### Stream <-> Table duality

### Created time vs append time

### Window and grace

### States

### Processing guarantees