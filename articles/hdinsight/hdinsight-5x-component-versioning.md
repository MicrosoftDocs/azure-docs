---
title: Open-source components and versions - Azure HDInsight 5.x
description: Learn about the open-source components and versions in Azure HDInsight 5.x.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/29/2023
---

# HDInsight 5.x component versions

In this article, you learn about the open-source components and their versions in Azure HDInsight 5.x.

## Preview

On February 27, 2023, we started rolling out a new version of HDInsight: version 5.1. This version is backward compatible with HDInsight 4.0. and 5.0. All new open-source releases will be added as incremental releases on HDInsight 5.1.

All upgraded cluster shapes are supported as part of HDInsight 5.1.

## Open-source components available with HDInsight 5.x

The following table lists the versions of open-source components that are associated with HDInsight 5.x.

| Component        | HDInsight 5.1          |HDInsight 5.0|
|------------------|------------------------|-------------|
| Apache Spark     | 3.3.1  **              | 3.1.3       |
| Apache Hive      | 3.1.2  **              | 3.1.2       |
| Apache Kafka     | 3.2.0  **              | 2.4.1       |
| Apache Hadoop    | 3.3.4  **              | 3.1.1       |
| Apache Tez       | 0.9.1  **              | 0.9.1       |
| Apache Ranger    | 2.3.0 **               | 1.1.0       |
| Apache HBase     | 2.4.11 **              | 2.1.6       |
| Apache Oozie     | 5.2.1  **              | 4.3.1       |
| Apache ZooKeeper | 3.6.3 **               | 3.4.6       |
| Apache Livy      | 0.5. **                | 0.5         |
| Apache Ambari    | 2.7.3  **              | 2.7.3       |
| Apache Zeppelin  | 0.10.1 **              | 0.8.0       |
| Apache Phoenix   | 5.1.2 **               | -           |

** Preview

> [!NOTE]
> We have discontinued Sqoop and Pig add-ons from HDInsight 5.1 version.

### Spark versions supported in Azure HDInsight

Azure HDInsight supports the following Apache Spark versions.

|Apache Spark version on HDInsight|Release date|Release stage|End-of-life announcement date|End of standard support|End of basic support|
|--|--|--|--|--|--|
|2.4|July 8, 2019|End of life announced (EOLA)| February 10, 2023| August 10, 2023|February 10, 2024|
|3.1|March 11, 2022|General availability |-|-|-|
|3.3|Available for preview|-|-|-|-|

### Guide for migrating from Apache Spark 2.4 to Spark 3.x

To learn how to migrate from Spark 2.4 to Spark 3.x, see the [migration guide on the Spark website](https://spark.apache.org/docs/latest/migration-guide.html).

## Next steps

* [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
* [Enterprise Security Package](./enterprise-security-package.md)
* [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
