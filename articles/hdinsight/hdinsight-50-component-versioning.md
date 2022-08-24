---
title: Open-source components and versions - Azure HDInsight 5.0
description: Learn about the open-source  components and versions in Azure HDInsight 5.0.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/25/2022
---

# HDInsight 5.0 component versions

In this article, you learn about the open-source components and their versions in Azure HDInsight 5.0.

Starting June 1, 2022, we have started rolling out a new  version of HDInsight 5.0, this is backward compatible with HDInsight 4.0. All new open-source releases will be added as incremental releases on HDInsight 5.0.

## Open-source components available with HDInsight version 5.0

The Open-source component versions associated with HDInsight 5.0 are listed in the following table.

| Component              | HDInsight 5.0 |
|------------------------|---------------|
|Apache Spark | 3.1 |
|Apache Interactive Query |3.1 |
|Apache Hive | 3.1.2 |
|Apache Kafka | 2.4 |
|Apache Hadoop and YARN |3.1.1 |
|Apache Tez | 0.9.1 |
|Apache Pig	| 0.16.0 |
|Apache Ranger | 1.1.0 |
|Apache Sqoop | 1.5.0 |
|Apache Oozie | 4.3.1 |
|Apache Zookeeper | 3.4.6 |
|Apache Livy | 0.5 |
|Apache Ambari | 2.7.0 |
|Apache Zeppelin | 0.8.0 |

This table lists certain HDInsight 4.0 cluster types that have retired or will be retired soon.

| Cluster Type                    | Framework version | Support expiration date      | Retirement date |
|---------------------------------|-------------------|------------------------------|-----------------|
| HDInsight 4.0 Spark             | 2.3               | June 30, 2020                | June 30, 2020   |
| HDInsight 4.0 Kafka             | 1.1               | Dec 31, 2020                 | Dec 31, 2020    |
| HDInsight 4.0 Kafka             | 2.1.0             | Sep 30, 2022                 | Oct 1, 2022     |

## Spark

:::image type="content" source="./media/hdinsight-release-notes/spark-3-1-for-hdi-5-0.png" alt-text="Screenshot of Spark 3.1 for HDI 5.0":::

> [!NOTE]
> * If you are using Azure User Interface to create a Spark Cluster for HDInsight, you will see from the dropdown list an additional version Spark 3.1.(HDI 5.0) along with the older versions. This version is a renamed version of Spark 3.1.(HDI 4.0) and it is backward compatible.  
> * This is only an UI level change, which doesn’t impact anything for the existing users and users who are already using the ARM template to build their clusters.  For backward compatibility, ARM supports creating spark 4.0 and 5.0 for 3.1 version which maps to same versions spark 3.1 (5.0)

## Interactive Query

:::image type="content" source="./media/hdinsight-release-notes/interactive-query-3-1-for-hdi-5-0.png" alt-text="Screenshot of interactive query 3.1 for HDI 5.0":::

> [!NOTE]
> * If you are creating an Interactive Query Cluster, you will see from the dropdown list an other version as Interactive Query 3.1 (HDI 5.0).
> * If you are going to use Spark 3.1 version along with Hive which require ACID support, you need to select this version Interactive Query 3.1 (HDI 5.0).

## Kafka 

**Known Issue**  – Current ARM template supports only 4.0 even though it shows 5.0 image in portal Cluster creation may fail with the following error message if you select version 5.0 in the UI.

`HDI Version'5.0" is not supported for clusterType ''Kafka" and component Version ‘2.4'.,Cluster component version is not applicable for HDI version: 5.0 cluster type: KAFKA (Code: BadRequest)`

We are working on this issue, and a fix will be rolled out shortly.


## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
