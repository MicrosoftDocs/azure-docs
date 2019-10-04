---
title: High availability with Apache Kafka - Azure HDInsight 
description: Learn how to ensure high availability with Apache Kafka on Azure HDInsight. Learn how to rebalance partition replicas in Kafka so that they are on different fault domains within the Azure region that contains HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/01/2018
---
# High availability of your data with Apache Kafka on HDInsight

Learn how to configure partition replicas for Apache Kafka topics to take advantage of underlying hardware rack configuration. This configuration ensures the availability of data stored in Apache Kafka on HDInsight.

## Fault and update domains with Apache Kafka

A fault domain is a logical grouping of underlying hardware in an Azure data center. Each fault domain shares a common power source and network switch. The virtual machines and managed disks that implement the nodes within an HDInsight cluster are distributed across these fault domains. This architecture limits the potential impact of physical hardware failures.

Each Azure region has a specific number of fault domains. For a list of domains and the number of fault domains they contain, see the [Availability sets](../../virtual-machines/windows/availability.md#availability-sets) documentation.

> [!IMPORTANT]  
> Kafka is not aware of fault domains. When you create a topic in Kafka, it may store all partition replicas in the same fault domain. To solve this problem, HDInsight provides the [Kafka partition rebalance tool](https://github.com/hdinsight/hdinsight-kafka-tools).

## When to rebalance partition replicas

To ensure the highest availability of your Kafka data, you should rebalance the partition replicas for your topic at the following times:

* When a new topic or partition is created

* When you scale up a cluster

## Replication factor

> [!IMPORTANT]  
> We recommend using an Azure region that contains three fault domains, and using a replication factor of 3.

If you must use a region that contains only two fault domains, use a replication factor of 4 to spread the replicas evenly across the two fault domains.

For an example of creating topics and setting the replication factor, see the [Start with Apache Kafka on HDInsight](apache-kafka-get-started.md) document.

## How to rebalance partition replicas

Use the [Apache Kafka partition rebalance tool](https://github.com/hdinsight/hdinsight-kafka-tools) to rebalance selected topics. This tool must be ran from an SSH session to the head node of your Kafka cluster.

For more information on connecting to HDInsight using SSH, see the
[Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md) document.

## Next steps

* [Scalability of Apache Kafka on HDInsight](apache-kafka-scalability.md)
* [Mirroring with Apache Kafka on HDInsight](apache-kafka-mirroring.md)
