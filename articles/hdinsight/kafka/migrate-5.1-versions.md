---
title: Migrate Apache Kafka workloads to Azure HDInsight 5.1
description: Learn how to migrate Apache Kafka workloads on HDInsight 4.0 to HDInsight 5.1.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/16/2023
---

# Migrate Apache Kafka workloads to Azure HDInsight 5.1

Azure HDInsight 5.1 offers the latest open-source components with significant enhancements in performance, connectivity, and security. This document explains how to migrate Apache Kafka workloads on HDInsight 4.0 to HDInsight 5.1. After migrating your workloads to HDInsight 5.1, you can use many of the new features that aren't available on HDInsight 4.0.



## HDInsight 4.0 Kafka migration paths

HDInsight 4.0 supports 2.4.1 HDInsight 5.1 supports versions 3.2.0. Depending on which version of Kafka and which version of HDInsight you would like to run, there are multiple supported migration paths. These paths are explained below and illustrated in the following diagram.

Upgrading the Kafka version on an existing cluster is not supported. After you create a cluster with the version you want, migrate your Kafka clients to use the new cluster.


## Apache Kafka versions

### Apache Kafka 3.2.0
  
If you migrate from Kafka to 3.2.0  you can take advantage of the following new features:


:::image type="content" source="Kafka_3.2.0_improvements.png" alt-text="kafka 3.2.0 improvements" border="false":::


- Support Automated consumer offsets sync across cluster in MM 2.0, making it easier to migrate or failover consumers across clusters. (KIP-545)
- Hint to the partition leader to recover the partition: A new feature that allows the controller to communicate to a newly elected topic partition leader whether it needs to recover its state (KIP-704)
- Supports TLS 1.2 by default for secure communication
- Improved metrics, (KIP-551, KIP-748, KIP-773)
- Configurable backlog size for creating Acceptor: A new configuration that allows setting the size of the SYN backlog for TCP’s acceptor sockets on the brokers (KIP-764)
- Top-level error code field to DescribeLogDirsResponse: A new error code that makes DescribeLogDirs API consistent with other APIs and allows returning other errors besides CLUSTER_AUTHORIZATION_FAILED (KIP-784) 


For a complete list of updates, see [Apache Kafka 3.2.0 release notes](https://archive.apache.org/dist/kafka/3.2.0/RELEASE_NOTES.html).


## Kafka client compatibility [TODO]

New Kafka brokers support older clients. [KIP-35 - Retrieving protocol version](https://cwiki.apache.org/confluence/display/KAFKA/KIP-35+-+Retrieving+protocol+version) introduced a mechanism for dynamically determining the functionality of a Kafka broker and [KIP-97: Improved Kafka Client RPC Compatibility Policy](https://cwiki.apache.org/confluence/display/KAFKA/KIP-97%3A+Improved+Kafka+Client+RPC+Compatibility+Policy) introduced a new compatibility policy and guarantees for the Java client. Previously, a Kafka client had to interact with a broker of the same version or a newer version. Now, newer versions of the Java clients and other clients that support KIP-35 such as `librdkafka` can fall back to older request types or throw appropriate errors if functionality isn't available.

:::image type="content" source="./media/upgrade-threesix-to-four/apache-kafka-client-compatibility.png" alt-text="Upgrade Kafka client compatibility" border="false":::

Note that it does not mean that the client supports older brokers.  For more information, see [Compatibility Matrix](https://cwiki.apache.org/confluence/display/KAFKA/Compatibility+Matrix).

## General migration process

The following migration guidance assumes an Apache Kafka 2.4.0 cluster deployed on HDInsight 4.0 in a single virtual network. The existing broker has some topics and is being actively used by producers and consumers.

To complete the migration, do the following steps:

1. **Deploy a new HDInsight 5.1 cluster and clients for test.** Deploy a new HDInsight 5.1 Kafka cluster. If multiple Kafka cluster versions can be selected, it's recommended to select the latest version. After deployment, set some parameters as needed and create a topic with the same name as your existing environment. Also, set TLS and bring-your-own-key (BYOK) encryption as needed. Then check if it works correctly with the new cluster.

    :::image type="content" source="./media/upgrade-to-fiveone/deploy-new-hdinsight-clusters.png" alt-text="Deploy new HDInsight 4.0 clusters" border="false":::

1. **Switch the cluster for the producer application, and wait until all the queue data is consumed by the current consumers.** When the new HDInsight 5.1 Kafka cluster is ready, switch the existing producer destination to the new cluster. Leave it as it is until the existing Consumer app has consumed all the data from the existing cluster.

    :::image type="content" source="./media/upgrade-to-fiveone/switch-cluster-producer-app.png" alt-text="Switch cluster for producer app" border="false":::

1. **Switch the cluster on the consumer application.** After confirming that the existing consumer application has finished consuming all data from the existing cluster, switch the connection to the new cluster.

    :::image type="content" source="./media/upgrade-to-fiveone/switch-cluster-consumer-app.png" alt-text="Switch cluster on consumer app" border="false":::

1. **Remove the old cluster and test applications as needed.** Once the switch is complete and working properly, remove the old HDInsight 4.0 Kafka cluster and the producers and consumers used in the test as needed.

## Next steps

* [Performance optimization for Apache Kafka HDInsight clusters](apache-kafka-performance-tuning.md)
* [Quickstart: Create Apache Kafka cluster in Azure HDInsight using Azure portal](apache-kafka-get-started.md)
