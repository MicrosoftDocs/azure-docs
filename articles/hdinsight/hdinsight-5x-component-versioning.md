---
title: Open-source components and versions - Azure HDInsight 5.x
description: Learn about the open-source components and versions in Azure HDInsight 5.x.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/11/2023
---

# HDInsight 5.x component versions

In this article, you learn about the open-source components and their versions in Azure HDInsight 5.x.

## Preview

On February 27, 2023, we started rolling out a new version of HDInsight: version 5.1. This version is backward compatible with HDInsight 4.0. and 5.0. All new open-source releases will be added as incremental releases on HDInsight 5.1.

All upgraded cluster shapes are supported as part of HDInsight 5.1.

## Open-source components available with HDInsight 5.x

The following table lists the versions of open-source components that are associated with HDInsight 5.x.

| Component        | HDInsight 5.1 | HDInsight 5.0 |
|------------------|---------------|---------------|
| Apache Spark     | 3.3.1  **              | 3.1.3       |
| Apache Hive      | 3.1.2  **              | 3.1.2       |
| Apache Kafka     | 3.2.0  **              | 2.4.1       |
| Apache Hadoop    | 3.3.4  **              | 3.1.1       |
| Apache Tez       | 0.9.1  **              | 0.9.1       |
| Apache Ranger    | 2.3.0 *                | 1.1.0       |
| Apache HBase     | 2.4.11 **              | 2.1.6       |
| Apache Oozie     | 5.2.1  *               | 4.3.1       |
| Apache ZooKeeper | 3.6.3 **               | 3.4.6       |
| Apache Livy      | 0.5. **                | 0.5         |
| Apache Ambari    | 2.7.0  **              | 2.7.0       |
| Apache Zeppelin  | 0.10.1 **              | 0.8.0       |
| Apache Phoenix   | 5.1.2 **               | -           |

\* Under development or planned

** Preview

> [!NOTE]
> Enterprise Security Package (ESP) isn't supported for HDInsight 5.1 clusters.

### Spark versions supported in Azure HDInsight

Azure HDInsight supports the following Apache Spark versions.

|Apache Spark version on HDInsight|Release date|Release stage|End-of-life announcement date|End of standard support|End of basic support|
|--|--|--|--|--|--|
|2.4|July 8, 2019|End of life announced (EOLA)| February 10, 2023| August 10, 2023|February 10, 2024|
|3.1|March 11, 2022|General availability |-|-|-|
|3.3|To be announced for preview|-|-|-|-|

### Guide for migrating from Apache Spark 2.4 to Spark 3.x

To learn how to migrate from Spark 2.4 to Spark 3.x, see the [migration guide on the Spark website](https://spark.apache.org/docs/latest/migration-guide.html).

## HDInsight 5.0

On June 1, 2022, we started rolling out a new version of HDInsight: version 5.0. This version is backward compatible with HDInsight 4.0. All new open-source releases will be added as incremental releases on HDInsight 5.0.

### Spark

:::image type="content" source="./media/hdinsight-release-notes/spark-3-1-for-hdi-5-1.png" alt-text="Screenshot of Spark 3.1 for HDInsight 5.1.":::

If you're using the Azure user interface to create a Spark cluster for HDInsight, the dropdown list contains an additional version along with the older version: Spark 3.1 (HDI 5.0). This version is a renamed version of Spark 3.1 (HDI 4.0), and it's backward compatible.  

This is only a UI-level change. It doesn't affect anything for existing users and for users who are already using the Azure Resource Manager template (ARM template) to build their clusters.

For backward compatibility, Resource Manager supports creating Spark 3.1 with the HDInsight 4.0 and 5.0 versions, which map to the same versions for Spark 3.1 (HDI 5.0).

The Spark 3.1 (HDI 5.0) cluster comes with Hive Warehouse Connector (HWC) 2.0, which works well together with the Interactive Query (HDI 5.0) cluster.

### Interactive Query

:::image type="content" source="./media/hdinsight-release-notes/interactive-query-3-1-for-hdi-5-1.png" alt-text="Screenshot of Interactive Query 3.1 for HDInsight 5.1.":::

If you're creating an Interactive Query cluster, the dropdown list contains another version: Interactive Query 3.1 (HDI 5.0). If you're going to use the Spark 3.1 version along with Hive (which requires ACID support via HWC), you need to select this version.

### Kafka

The current ARM template supports HDInsight 5.0 for Kafka 2.4.1.

HDInsight 5.0 is supported for the Kafka cluster type and component version 2.4.

We fixed the ARM template issue.

### Upcoming version upgrades

The HDInsight team is working on upgrading other open-source components:

* ESP cluster support for all cluster shapes
* Oozie 5.2.1
* HWC 2.1

## Next steps

* [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
* [Enterprise Security Package](./enterprise-security-package.md)
* [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
