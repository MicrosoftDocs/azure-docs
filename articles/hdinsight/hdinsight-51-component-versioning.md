---
title: Open-source components and versions - Azure HDInsight 5.1
description: Learn about the open-source  components and versions in Azure HDInsight 5.1
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/28/2023
---

# HDInsight 5.1 component versions

In this article, you learn about the open-source components and their versions in Azure HDInsight 5.1.

From February 27, 2023 we have started rolling out a new version of HDInsight 5.1, this version is backward compatible with HDInsight 4.0. and 5.0. All new open-source releases added as incremental releases on HDInsight 5.1.

## Open-source components available with HDInsight version 5.1

The Open-source component versions associated with HDInsight 5.1 listed in the following table.

| Component        | HDInsight 5.1 | HDInsight 5.0 |
|------------------|---------------|---------------|
| Apache Spark     | 3.3 **             | 3.1.2         |
| Apache Hive      | 3.1.2 *             | 3.1.2         |
| Apache Kafka     | 3.2.0  **            | 2.4.1         |
| Apache Hadoop with YARN    | 3.3.4 *             | 3.1.1         |
| Apache Tez       | 0.9.1  *            | 0.9.1         |
| Apache Pig       | 0.17.0  *            | 0.16.1        |
| Apache Ranger    |  2.1.0 *            | 1.1.0         |
| Apache HBase     | 2.4.11  **           | -             |
| Apache Sqoop     | 1.5.0  *            | 1.5.0         |
| Apache Oozie     | 5.2.1  *            | 4.3.1         |
| Apache Zookeeper | 3.6.3  **             | 3.4.6         |
| Apache Livy      | 0.7.1  *            | 0.5           |
| Apache Ambari    | 2.7.0  **            | 2.7.0         |
| Apache Zeppelin  | 0.10.0 *             | 0.8.0         |
| Apache Phoenix   | 5.1.2  **             | -       |

\* Under development/Planned

** Public Preview

## Spark versions supported in Azure HDInsight

Apache Spark versions supported in Azure HDIinsight 

|Apache Spark version on HDInsight|Release date|Release stage|End of life announcement date|[End of standard support]()|[End of basic support]()|
|--|--|--|--|--|--|
|2.4|July 8, 2019|End of Life Announced (EOLA)| Feb10,2023| Aug 10,2023|Feb 10,2024|
|3.1|March 11,2022|GA |-|-|-|
|3.3|March 22,2023|Public Preview|-|-|-|

## Apache Spark 2.4 to Spark 3.x Migration Guides 

Spark 2.4 to Spark 3.x Migration Guides see [here](https://spark.apache.org/docs/latest/migration-guide.html). 

## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
