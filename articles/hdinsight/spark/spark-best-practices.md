---
title: Apache Spark guidelines on Azure HDInsight
description: Learn guidelines for using Apache Spark in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/12/2023
---

# Apache Spark guidelines

This article provides various guidelines for using Apache Spark on Azure HDInsight.

## How do I run or submit Spark jobs?

| Option | Documents |
|---|---|
| VSCode | [Use Spark & Hive Tools for Visual Studio Code](../hdinsight-for-vscode.md) |
| Jupyter Notebooks | [Tutorial: Load data and run queries on an Apache Spark cluster in Azure HDInsight](./apache-spark-load-data-run-query.md) |
| IntelliJ | [Tutorial: Use Azure Toolkit for IntelliJ to create Apache Spark applications for an HDInsight cluster](./apache-spark-intellij-tool-plugin.md) |
| IntelliJ | [Tutorial: Create a Scala Maven application for Apache Spark in HDInsight using IntelliJ](./apache-spark-create-standalone-application.md) |
| Zeppelin notebooks | [Use Apache Zeppelin notebooks with Apache Spark cluster on Azure HDInsight](./apache-spark-zeppelin-notebook.md) |
| Remote job submission with Livy | [Use Apache Spark REST API to submit remote jobs to an HDInsight Spark cluster](./apache-spark-livy-rest-interface.md) |
|[Apache Oozie](../hdinsight-use-oozie-linux-mac.md)|Oozie is a workflow and coordination system that manages Hadoop jobs.|
|[Apache Livy](./apache-spark-livy-rest-interface.md)|You can use Livy to run interactive Spark shells or submit batch jobs to be run on Spark.|
|[Azure Data Factory for Apache Spark](../../data-factory/transform-data-using-spark.md)|The Spark activity in a Data Factory pipeline executes a Spark program on your own or [on-demand HDInsight cluster.|
|[Azure Data Factory for Apache Hive](../../data-factory/transform-data-using-hadoop-hive.md)|The HDInsight Hive activity in a Data Factory pipeline executes Hive queries on your own or on-demand HDInsight cluster.|

## How do I monitor and debug Spark jobs?

| Option | Documents |
|---|---|
| Azure Toolkit for IntelliJ | [Failure spark job debugging with Azure Toolkit for IntelliJ (preview)](apache-spark-intellij-tool-failure-debug.md) |
| Azure Toolkit for IntelliJ through SSH | [Debug Apache Spark applications locally or remotely on an HDInsight cluster with Azure Toolkit for IntelliJ through SSH](apache-spark-intellij-tool-debug-remotely-through-ssh.md) |
| Azure Toolkit for IntelliJ through VPN | [Use Azure Toolkit for IntelliJ to debug Apache Spark applications remotely in HDInsight through VPN](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md) |
| Job graph on Apache Spark History Server | [Use extended Apache Spark History Server to debug and diagnose Apache Spark applications](./apache-azure-spark-history-server.md) |

## How do I make my Spark jobs run more efficiently?

| Option | Documents |
|---|---|
| IO Cache | [Improve performance of Apache Spark workloads using Azure HDInsight IO Cache (Preview)](./apache-spark-improve-performance-iocache.md) |
| Configuration options | [Optimize Apache Spark jobs](./apache-spark-perf.md) |

## How do I connect to other Azure Services?

| Option | Documents |
|---|---|
| Apache Hive on HDInsight | [Integrate Apache Spark and Apache Hive with the Hive Warehouse Connector](../interactive-query/apache-hive-warehouse-connector.md) |
| Apache HBase on HDInsight | [Use Apache Spark to read and write Apache HBase data](../hdinsight-using-spark-query-hbase.md) |
| Apache Kafka on HDInsight | [Tutorial: Use Apache Spark Structured Streaming with Apache Kafka on HDInsight](../hdinsight-apache-kafka-spark-structured-streaming.md) |
| Azure Cosmos DB | [Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/synapse-link.md) |

## What are my storage options?

| Option | Documents |
|---|---|
| Azure Data Lake Storage Gen2 | [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-storage-gen2.md) |
| Azure Data Lake Storage Gen1 | [Use Azure Data Lake Storage Gen1 with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-storage-gen1.md) |
| Azure Blob Storage | [Use Azure storage with Azure HDInsight clusters](../hdinsight-hadoop-use-blob-storage.md) |

## Next steps

* [Configure Apache Spark settings](apache-spark-settings.md)
* [Optimize Apache Spark jobs in HDInsight](apache-spark-perf.md)
