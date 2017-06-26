---
title: High availability with Apache Kafka - Azure HDInsight | Microsoft Docs
description: 'Learn how to ensure high availability with Apache Kafka on Azure HDInsight. Learn how to rebalance partition replicas in Kafka so that they are on different fault domains within the Azure region that contains HDInsight.'
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: ''
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/26/2017
ms.author: larryfr
---
# High availability of your data with Apache Kafka (preview) on HDInsight

Learn how to configure partition replicas for Kafka topics to take advantage of underlying hardware rack configuration. This configuration ensures the availability of data stored in Apache Kafka on HDInsight.

The physical hardware that hosts the virtual machines and managed disks used by Kafka are organized into fault domains and update domains. Resources in the same fault domain are typically placed in the same rack in a data center. They share power, cooling vents, network switches, etc. Update domains are a logical grouping of virtual machines, and are used to stagger reboots, reimaging, and other host-level operations.

To ensure the highest availability of your Kafka data, you should rebalance the partition replicas for your topic across multiple update and fault domains.

## When to rebalance

* Immediately after creating a new Kafka cluster

* When a new topic or partition is created

* When you scale up a cluster

## Replication factor

The replication factor for your topics should be a multiple of the number of fault domains available in the Azure region. For steps on how to find the number of fault domains for your region, see the [Availability sets](../virtual-machines/linux/regions-and-availability.md#availability-sets) documentation.

For example, in a region that provides two fault domains, you would create a topic with a replication-factor of `4`. For an example of creating topics and setting the replication factor, see the [Start with Kafka on HDInsight](hdinsight-apache-kafka-get-started.md) document.

## How to Rebalance partition replicas

Use the [Kafka partition rebalance tool](https://github.com/hdinsight/hdinsight-kafka-tools) to rebalance selected topics. This tool must be ran from an SSH session to the head node of your Kafka cluster.

For more information on connecting to HDInsight using SSH, see the
[Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md) document.

## Next steps

* [Scalability of Kafka on HDInsight](hdinsight-apache-kafka-scalability.md)
* [Mirroring with Kafka on HDInsight](hdinsight-apache-kafka-mirroring.md)