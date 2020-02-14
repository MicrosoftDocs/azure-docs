---
title: Performance optimization for Apache Kafka HDInsight clusters
description: Provides an overview of techniques for optimizing Apache Kafka workloads on Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 12/19/2019
---

# Performance optimization for Apache Kafka HDInsight clusters

This article gives some suggestions for optimizing the performance of your Apache Kafka workloads in HDInsight. The focus is on adjusting producer and broker configuration. There are different ways of measuring performance, and the optimizations that you apply will depend on your business needs.

## Architecture overview

Kafka topics are used to organize records. Records are produced by producers, and consumed by consumers. Producers send records to Kafka brokers, which then store the data. Each worker node in your HDInsight cluster is a Kafka broker.

Topics partition records across brokers. When consuming records, you can use up to one consumer per partition to achieve parallel processing of the data.

Replication is used to duplicate partitions across nodes. This protects against node (broker) outages. A single partition among the group of replicas is designated as the partition leader. Producer traffic is routed to the leader of each node, using the state managed by ZooKeeper.

## Identify your scenario

Apache Kafka performance has two main aspects – throughput and latency. Throughput is the maximum rate at which data can be processed. Higher throughput is usually better. Latency is the time it takes for data to be stored or retrieved. Lower latency is usually better. Finding the right balance between throughput, latency and the cost of the application's infrastructure can be challenging. Your performance requirements will likely match one of the following three common situations, based on whether you require high throughput, low latency, or both:

* High throughput, low latency. This scenario requires both high throughput and low latency (~100 milliseconds). An example of this type of application is service availability monitoring.
* High throughput, high latency. This scenario requires high throughput (~1.5 GBps) but can tolerate higher latency (< 250 ms). An example of this type of application is telemetry data ingestion for near real-time processes like security and intrusion detection applications.
* Low throughput, low latency. This scenario requires low latency (< 10 ms) for real-time processing, but can tolerate lower throughput. An example of this type of application is online spelling and grammar checks.

## Producer configurations

The following sections will highlight some of the most important configuration properties to optimize performance of your Kafka producers. For a detailed explanation of all configuration properties, see [Apache Kafka documentation on producer configurations](https://kafka.apache.org/documentation/#producerconfigs).

### Batch size

Apache Kafka producers assemble groups of messages (called batches) which are sent as a unit to be stored in a single storage partition. Batch size means the number of bytes that must be present before that group is transmitted. Increasing the `batch.size` parameter can increase throughput, because it reduces the processing overhead from network and IO requests. Under light load, increased batch size may increase Kafka send latency as the producer waits for a batch to be ready. Under heavy load, it's recommended to increase the batch size to improve throughput and latency.

### Producer required acknowledgments

The producer required `acks` configuration determines the number of acknowledgments required by the partition leader before a write request is considered completed. This setting affects data reliability and it takes values of `0`, `1`, or `-1`. The value of `-1` means that an acknowledgment must be received from all replicas before the write is completed. Setting `acks = -1` provides stronger guarantees against data loss, but it also results in higher latency and lower throughput. If your application requirements demand higher throughput, try setting `acks = 0` or `acks = 1`. Keep in mind, that not acknowledging all replicas can reduce data reliability.

### Compression

A Kafka producer can be configured to compress messages before sending them to brokers. The `compression.type` setting specifies the compression codec to be used. Supported compression codecs are “gzip,” “snappy,” and “lz4.” Compression is beneficial and should be considered if there's a limitation on disk capacity.

Among the two commonly used compression codecs, `gzip` and `snappy`, `gzip` has a higher compression ratio, which results in lower disk usage at the cost of higher CPU load. The `snappy` codec provides less compression with less CPU overhead. You can decide which codec to use based on broker disk or producer CPU limitations. `gzip` can compress data at a rate five times higher than `snappy`.

Using data compression will increase the number of records that can be stored on a disk. It may also increase CPU overhead in cases where there's a mismatch between the compression formats being used by the producer and the broker. as the data must be compressed before sending and then decompressed before processing.

## Broker settings

The following sections will highlight some of the most important settings to optimize performance of your Kafka brokers. For a detailed explanation of all broker settings, see [Apache Kafka documentation on producer configurations](https://kafka.apache.org/documentation/#producerconfigs).

### Number of disks

Storage disks have limited IOPS (Input/Output Operations Per Second) and read/write bytes per second. When creating new partitions, Kafka stores each new partition on the disk with fewest existing partitions to balance them across the available disks. Despite storage strategy, when processing hundreds of partition replicas on each disk, Kafka can easily saturate the available disk throughput. The tradeoff here is between throughput and cost. If your application requires greater throughput, create a cluster with more managed disks per broker. HDInsight doesn't currently support adding managed disks to a running cluster. For more information on how to configure the number of managed disks, see [Configure storage and scalability for Apache Kafka on HDInsight](apache-kafka-scalability.md). Understand the cost implications of increasing storage space for the nodes in your cluster.

### Number of topics and partitions

Kafka producers write to topics. Kafka consumers read from topics. A topic is associated with a log, which is a data structure on disk. Kafka appends records from a producer(s) to the end of a topic log. A topic log consists of many partitions that are spread over multiple files. These files are, in turn, spread across multiple Kafka cluster nodes. Consumers read from Kafka topics at their cadence and can pick their position (offset) in the topic log.

Each Kafka partition is a log file on the system, and producer threads can write to multiple logs simultaneously. Similarly, since each consumer thread reads messages from one partition, consuming from multiple partitions is handled in parallel as well.

Increasing the partition density (the number of partitions per broker) adds an overhead related to metadata operations and per partition request/response between the partition leader and its followers. Even in the absence of data flowing through, partition replicas still fetch data from leaders, which results in extra processing for send and receive requests over the network.

For Apache Kafka clusters 1.1 and above in HDInsight, we recommend you to have a maximum of 1000 partitions per broker, including replicas. Increasing the number of partitions per broker decreases throughput and may also cause topic unavailability. For more information on Kafka partition support, see [the official Apache Kafka blog post on the increase in the number of supported partitions in version 1.1.0](https://blogs.apache.org/kafka/entry/apache-kafka-supports-more-partitions). For details on modifying topics, see [Apache Kafka: modifying topics](https://kafka.apache.org/documentation/#basic_ops_modify_topic).

### Number of replicas

Higher replication factor results in additional requests between the partition leader and followers. Consequently, a higher replication factor consumes more disk and CPU to handle additional requests, increasing write latency and decreasing throughput.

We recommend that you use at least 3x replication for Kafka in Azure HDInsight. Most Azure regions have three fault domains, but in regions with only two fault domains, users should use 4x replication.

For more information on replication, see [Apache Kafka: replication](https://kafka.apache.org/documentation/#replication) and [Apache Kafka: increasing replication factor](https://kafka.apache.org/documentation/#basic_ops_increase_replication_factor).

## Next steps

* [Processing trillions of events per day with Apache Kafka on Azure](https://azure.microsoft.com/blog/processing-trillions-of-events-per-day-with-apache-kafka-on-azure/)
* [What is Apache Kafka on HDInsight?](apache-kafka-introduction.md)
