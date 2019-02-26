---
title: Performance optimization for Apache Kafka HDInsight clusters
description: Provides an overview of techniques for optimizing Apache Kafka workloads on Azure HDInsight.
services: hdinsight,storage
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/21/2019
---
# Performance optimization for Apache Kafka HDInsight clusters

This article will highlight some best practices for optimizing the performance of your Apache Kafka workloads in HDInsight through producer and broker configuration. There are different ways of measuring performance, and the optimizations that you apply will depend on your business needs.

## Architecture Overview

Apache Kafka stores records (data) in topics. Records are produced by producers, and consumed by consumers. Producers send records to Kafka brokers which then store the data. Each worker node in your HDInsight cluster is a Kafka broker.

Topics partition records across brokers. When consuming records, you can use up to one consumer per partition to achieve parallel processing of the data.

Replication is employed to duplicate partitions across nodes, protecting against node (broker) outages. A single partition among the group of replicas is designated as the partition leader. Producer traffic is routed to the leader of each node, using the state managed by ZooKeeper.

## Measuring Apache Kafka Performance

Apache Kafka performance has two orthogonal dimensions – throughput and latency. Throughput is the maximum rate at which data can be processed and is usually desired to be as high as possible. Latency is the time it takes for data to be stored or retrieved and is usually desired to be as low as possible. Finding the right balance between throughput, latency and the cost of the application's infrastructure can be challenging. Customer performance requirements normally fall into one of three main types, based on whether they require high throughput, low latency, or both.

* High throughput, low latency - this scenario requires both high throughput and low latency (~100 miliseconds). An example of this type of application is service availability monitoring.
* High throughput, high latency - this scenario requires high throughput (~1.5 GBps) but can tolerate higher latency (< 250 ms). An example of this type of application is telemetry data ingestion for near real-time processes like security and intrusion detection applications.
* Low throughput, low latency - this scenario requires very low latency (< 10 ms) for real-time processing, but can tolerate lower throughput. An example of this type of application is online spelling and grammar checks.

## Batch size

Apache Kafka producers assemble groups of messages (called batches) which are then sent as a unit to be stored in a single storage partition. Batch size means the number of bytes that must be present before that group is transmitted. Increasing the `batch.size` parameter can increase throughput, because it reduces the processing overhead from network and IO requests. Under light load, this may increase Kafka send latency since the producer waits for a batch to be ready. Under heavy load it is recommended to increase the batch size to improve throughput and latency.

## Producer required acknowledgements

The producer required `acks` configuration determines the number of acknowledgments required by the partition leader before a write request is considered completed. This setting affects data reliability and it takes values 0, 1, or -1 (i.e. “all”). Setting `acks = -1` provides stronger guarantees against data loss, but it also results in higher latency and lower throughput. If your application requirements demand higher throughput, try setting `acks = 0` or `acks = 1`.

## Compression

A Kafka producer can be configured to compress messages before sending them to brokers. The `compression.type` setting specifies the compression codec to be used. Supported compression codecs are “gzip,” “snappy,” and “lz4.” Compression is beneficial and should be considered if there is a limitation on disk capacity.

Among the two commonly used compression codecs, “gzip” and “snappy,” “gzip” has a higher compression ratio resulting in lower disk usage at the cost of higher CPU load, whereas “snappy” provides less compression with less CPU overhead. You can decide which codec to use based on broker disk or producer CPU limitations, as “gzip” can compress data 5 times more than “snappy.”

Using data compression will decrease disk usage, but increase CPU usage. The compression will decrease throughput...?

## Broker configurations

### Number of disks

Storage disks have limited IOPS (Input/Output Operations Per Second) and read/write bytes per second. When creating new partitions, Kafka stores each new partition on the disk with fewest existing partitions to balance them across the available disks. Despite this, when processing hundreds of partition replicas on each disk, Kafka can easily saturate the available disk throughput. The tradeoff here is between throughput and cost. If your application requires greater throughput, add more managed disks. Understand the cost implications of increasing storage space for the nodes in your cluster.

### Number of topics and partitions

Kafka producers write to topics. Kafka consumers read from topics. A topic is associated with a log which is data structure on disk. Kafka appends records from a producer(s) to the end of a topic log. A topic log consists of many partitions that are spread over multiple files which can be spread on multiple Kafka cluster nodes. Consumers read from Kafka topics at their cadence and can pick where they are (offset) in the topic log.

Each Kafka partition is a log file on the system, and producer threads can write to multiple logs simultaneously. Similarly, since each consumer thread reads messages from one partition, consuming from multiple partitions is handled in parallel as well. 

Increasing the partition density (the number of partitions per broker) adds an overhead related to metadata operations and per partition request/response between the partition leader and its followers. Even in the absence of data flowing through, partition replicas still fetch data from leaders, which results in extra processing for send and receive requests over the network.

The recommendation for Azure HDInsight is to have a maximum of 1000 partitions per broker, including replicas. Increasing the number of partitions per broker decreases throughput and may also cause topic unavailability. For more information on Kafka partition support, see [the official Apache Kafka blog post on the increase in the number of supported partitions in version 1.1.0](https://blogs.apache.org/kafka/entry/apache-kafka-supports-more-partitions).

### Number of replicas

Higher replication factor results in additional requests between the partition leader and followers. Consequently, a higher replication factor consumes more disk and CPU to handle additional requests, increasing write latency and decreasing throughput.

We recommend that users running Kafka in HDInsight have at least 3s replication. Most Azure regions have 3 fault domains, but in regions with only 2 fault domains, users should use 4x replication.

## Next steps

* [Processing trillions of events per day with Apache Kafka on Azure](https://azure.microsoft.com/en-us/blog/processing-trillions-of-events-per-day-with-apache-kafka-on-azure/)
* [What is Apache Kafka on HDInsight?](https://docs.microsoft.com/en-us/azure/hdinsight/kafka/apache-kafka-introduction)