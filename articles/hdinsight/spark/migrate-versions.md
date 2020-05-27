---
title: Migrate Apache Spark 2.1 or 2.2 workloads to 2.3 or 2.4 - Azure HDInsight
description: Learn how to migrate Apache Spark 2.1 and 2.2 to 2.3 or 2.4.
author: ashishthaps1
ms.author: ashishth
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/20/2020
---

# Migrate Apache Spark 2.1 and 2.2 workloads to 2.3 and 2.4

This document explains how to migrate Apache Spark workloads on Spark 2.1 and 2.2 to 2.3 or 2.4.

As discussed in the [Release Notes](../hdinsight-release-notes.md#upcoming-changes), starting July 1, 2020, the following cluster configurations will not be supported and customers will not be able to create new clusters with these configurations:
 - Spark 2.1 and 2.2 in an HDInsight 3.6 Spark cluster
 - Spark 2.3 in an HDInsight 4.0 Spark cluster

Existing clusters in these configurations will run as-is without support from Microsoft. If you are on Spark 2.1 or 2.2 on HDInsight 3.6, move to Spark 2.3 on HDInsight 3.6 by June 30 2020 to avoid potential system/support interruption. If you are on Spark 2.3 on an HDInsight 4.0 cluster, move to Spark 2.4 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.

For general information about migrating an HDInsight cluster from 3.6 to 4.0, see [Migrate HDInsight cluster to a newer version](../hdinsight-upgrade-cluster.md). For general information about migrating to a newer version of Apache Spark, see [Apache Spark: Versioning Policy](https://spark.apache.org/versioning-policy.html).

## Guidance on Spark version upgrades on HDInsight

| Upgrade scenario | Mechanism | Things to consider | Spark Hive integration |
|------------------|-----------|--------------------|------------------------|
|HDInsight 3.6 Spark 2.1 to HDInsight 3.6 Spark 2.3| Recreate clusters with HDInsight Spark 2.3 | Review the following articles: <br> [Apache Spark: Upgrading From Spark SQL 2.2 to 2.3](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-22-to-23) <br><br> [Apache Spark: Upgrading From Spark SQL 2.1 to 2.2](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-21-to-22) | No Change |
|HDInsight 3.6 Spark 2.2 to HDInsight 3.6 Spark 2.3 | Recreate clusters with HDInsight Spark 2.3 | Review the following articles: <br> [Apache Spark: Upgrading From Spark SQL 2.2 to 2.3](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-22-to-23) | No Change |
| HDInsight 3.6 Spark 2.1 to HDInsight 4.0 Spark 2.4 | Recreate clusters with HDInsight 4.0 Spark 2.4 | Review the following articles: <br> [Apache Spark: Upgrading From Spark SQL 2.3 to 2.4](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-23-to-24) <br><br> [Apache Spark: Upgrading From Spark SQL 2.2 to 2.3](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-22-to-23) <br><br> [Apache Spark: Upgrading From Spark SQL 2.1 to 2.2](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-21-to-22) | Spark Hive Integration has changed in HDInsight 4.0. <br><br> In HDInsight 4.0, Spark and Hive use independent catalogs for accessing SparkSQL or Hive tables. A table created by Spark lives in the Spark catalog. A table created by Hive lives in the Hive catalog. This behavior is different than HDInsight 3.6 where Hive and Spark shared common catalog. Hive and Spark Integration in HDInsight 4.0 relies on Hive Warehouse Connector (HWC). HWC works as a bridge between Spark and Hive. Learn about Hive Warehouse Connector. <br> In HDInsight 4.0 if you would like to Share the metastore between Hive and Spark, you can do so by changing the property metastore.catalog.default to hive in your Spark cluster. You can find this property in Ambari Advanced spark2-hive-site-override. It’s important to understand that sharing of metastore only works for external hive tables, this will not work if you have internal/managed hive tables or ACID tables. <br><br>Read [Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0](../interactive-query/apache-hive-migrate-workloads.md) for more information.<br><br> |
| HDInsight 3.6 Spark 2.2 to HDInsight 4.0 Spark 2.4 | Recreate clusters with HDInsight 4.0 Spark 2.4 | Review the following articles: <br> [Apache Spark: Upgrading From Spark SQL 2.3 to 2.4](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-23-to-24) <br><br> [Apache Spark: Upgrading From Spark SQL 2.2 to 2.3](https://spark.apache.org/docs/latest/sql-migration-guide-upgrade.html#upgrading-from-spark-sql-22-to-23) | Spark Hive Integration has changed in HDInsight 4.0. <br><br> In HDInsight 4.0, Spark and Hive use independent catalogs for accessing SparkSQL or Hive tables. A table created by Spark lives in the Spark catalog. A table created by Hive lives in the Hive catalog. This behavior is different than HDInsight 3.6 where Hive and Spark shared common catalog. Hive and Spark Integration in HDInsight 4.0 relies on Hive Warehouse Connector (HWC). HWC works as a bridge between Spark and Hive. Learn about Hive Warehouse Connector. <br> In HDInsight 4.0 if you would like to Share the metastore between Hive and Spark, you can do so by changing the property metastore.catalog.default to hive in your Spark cluster. You can find this property in Ambari Advanced spark2-hive-site-override. It’s important to understand that sharing of metastore only works for external hive tables, this will not work if you have internal/managed hive tables or ACID tables. <br><br>Read [Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0](../interactive-query/apache-hive-migrate-workloads.md) for more information.|

## Next steps

* [Migrate HDInsight cluster to a newer version](../hdinsight-upgrade-cluster.md)
* [Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0](../interactive-query/apache-hive-migrate-workloads.md)
