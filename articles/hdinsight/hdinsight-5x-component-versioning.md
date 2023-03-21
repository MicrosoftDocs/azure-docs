---
title: Open-source components and versions - Azure HDInsight 5.x
description: Learn about the open-source  components and versions in Azure HDInsight 5.x
ms.service: hdinsight
ms.topic: conceptual
ms.date: 03/16/2023
---

# HDInsight 5.x component versions

In this article, you learn about the open-source components and their versions in Azure HDInsight 5.x.

## Public preview

From February 27, 2023 we have started rolling out a new version of HDInsight 5.1, this version is backward compatible with HDInsight 4.0. and 5.0. All new open-source releases added as incremental releases on HDInsight 5.1.

**Only Kafka and HBase clusters are supported now.**

## Open-source components available with HDInsight version 5.x

The Open-source component versions associated with HDInsight 5.1 listed in the following table.

| Component        | HDInsight 5.1 | HDInsight 5.0 |
|------------------|---------------|---------------|
| Apache Spark     | 3.3 *              | 3.1.3         |
| Apache Hive      | 3.1.2 *             | 3.1.2         |
| Apache Kafka     | 3.2.0  **            | 2.4.1         |
| Apache Hadoop with YARN    | 3.3.4 *             | 3.1.1         |
| Apache Tez       | 0.9.1  *            | 0.9.1         |
| Apache Pig       | 0.17.0  *            | 0.16.1        |
| Apache Ranger    |  2.1.0 *            | 1.1.0         |
| Apache HBase     | 2.4.11  **           | -             |
| Apache Sqoop     | 1.5.0  *            | 1.5.0         |
| Apache Oozie     | 5.2.1  *            | 4.3.1         |
| Apache Zookeeper | 3.6.3  *             | 3.4.6         |
| Apache Livy      | 0.7.1  *            | 0.5           |
| Apache Ambari    | 2.7.0  **            | 2.7.0         |
| Apache Zeppelin  | 0.10.0 *             | 0.8.0         |
| Apache Phoenix   | 5.1.2  **             | -       |

\* Under development/Planned

** Public Preview

> [!NOTE]
> ESP isn't supported for Kafka and HBase in this release.

### Spark versions supported in Azure HDInsight

Apache Spark versions supported in Azure HDIinsight 

|Apache Spark version on HDInsight|Release date|Release stage|End of life announcement date|End of standard support|End of basic support|
|--|--|--|--|--|--|
|2.4|July 8, 2019|End of Life Announced (EOLA)| Feb10,2023| Aug 10,2023|Feb 10,2024|
|3.1|March 11,2022|GA |-|-|-|
|3.3|To be announced for Public Preview|-|-|-|-|

### Apache Spark 2.4 to Spark 3.x Migration Guides 

Spark 2.4 to Spark 3.x Migration Guides see [here](https://spark.apache.org/docs/latest/migration-guide.html). 

## HDInsight version 5.0

Starting from June 1, 2022, we have started rolling out a new version of HDInsight 5.0, this version is backward compatible with HDInsight 4.0. All new open-source releases will be added as incremental releases on HDInsight 5.0.


### Spark

:::image type="content" source="./media/hdinsight-release-notes/spark-3-1-for-hdi-5-1.png" alt-text="Screenshot of Spark 3.1 for HDI 5.1":::

> [!NOTE]
> * If you are using Azure User Interface to create a Spark Cluster for HDInsight, you will see from the dropdown list an additional version Spark 3.1.(HDI 5.0) along with the older versions. This version is a renamed version of Spark 3.1.(HDI 4.0) and it is backward compatible.  
> * This is only a UI level change, which doesn’t impact anything for the existing users and users who are already using the ARM template to build their clusters.
> * For backward compatibility, ARM supports creating Spark 3.1 with HDI 4.0 and 5.0 versions which maps to same versions Spark 3.1 (HDI 5.0)
> * Spark 3.1 (HDI 5.0) cluster comes with HWC 2.0 which works well together with Interactive Query (HDI 5.0) cluster.

### Interactive Query

:::image type="content" source="./media/hdinsight-release-notes/interactive-query-3-1-for-hdi-5-1.png" alt-text="Screenshot of interactive query 3.1 for HDI 5.1":::

> [!NOTE]
> * If you are creating an Interactive Query Cluster, you will see from the dropdown list another version as Interactive Query 3.1 (HDI 5.0).
> * If you are going to use Spark 3.1 version along with Hive which require ACID support via Hive Warehouse Connector (HWC). You need to select this version Interactive Query 3.1 (HDI 5.0).

### Kafka 

Current ARM template supports HDI 5.0 for Kafka 2.4.1

`HDI Version '5.0' is supported for clusterType "Kafka" and component Version '2.4'.`

We have fixed the arm templated issue.

### Upcoming version upgrades. 
HDInsight team is working on upgrading other open-source components.

1. Spark 3.2.0
1. Kafka 3.2.1
1. HBase 2.4.11


## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
