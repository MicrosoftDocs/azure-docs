---
title: What is Apache HBase in Azure HDInsight? 
description: An introduction to Apache HBase in HDInsight, a NoSQL database build on Hadoop. Learn about use cases and compare HBase to other Hadoop clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: overview
ms.custom: hdinsightactive,hdiseo17may2017,seoapr2020
ms.date: 04/20/2020

#Customer intent: As a developer new to Apache HBase and Apache HBase in Azure HDInsight, I want to have a basic understanding of Microsoft's implementation of Apache HBase in Azure HDInsight so I can decide if I want to use it rather than build my own cluster.
---

# What is Apache HBase in Azure HDInsight

[Apache HBase](https://hbase.apache.org/) is an open-source, NoSQL database that is built on Apache Hadoop and modeled after [Google BigTable](https://cloud.google.com/bigtable/). HBase provides random access and strong consistency for large amounts of data in a schemaless database. The database is organized by column families.

From user perspective, HBase is similar to a database. Data is stored in the rows and columns of a table, and data within a row is grouped by column family. HBase is a schemaless database. The columns and data types can be undefined before using them. The open-source code scales linearly to handle petabytes of data on thousands of nodes. It can rely on data redundancy, batch processing, and other features that are provided by distributed applications in the Hadoop environment.

## How is Apache HBase implemented in Azure HDInsight?

HDInsight HBase is offered as a managed cluster that is integrated into the Azure environment. The clusters are configured to store data directly in [Azure Storage](./../hdinsight-hadoop-use-blob-storage.md), which provides low latency and increased elasticity in performance and cost choices. This property enables customers to build interactive websites that work with large datasets. To build services that store sensor and telemetry data from millions of end points. And to analyze this data with Hadoop jobs. HBase and Hadoop are good starting points for big data project in Azure. The services can enable real-time applications to work with large datasets.

The HDInsight implementation uses the scale-out architecture of HBase to provide automatic sharding of tables. And strong consistency for reads and writes, and automatic failover. Performance is enhanced by in-memory caching for reads and high-throughput streaming for writes. HBase cluster can be created inside virtual network. For details, see  [Create HDInsight clusters on Azure Virtual Network](./apache-hbase-provision-vnet.md).

## How is data managed in HDInsight HBase?

Data can be managed in HBase by using the `create`, `get`, `put`, and `scan` commands from the HBase shell. Data is written to the database by using `put` and read by using `get`. The `scan` command is used to obtain data from multiple rows in a table. Data can also be managed using the HBase C# API, which provides a client library on top of the HBase REST API. An HBase database can also be queried by using [Apache Hive](https://hive.apache.org/). For an introduction to these programming models, see [Get started using Apache HBase with Apache Hadoop in HDInsight](./apache-hbase-tutorial-get-started-linux.md). Coprocessors are also available, which allow data processing in the nodes that host the database.

> [!NOTE]  
> Thrift is not supported by HBase in HDInsight.

## Use cases for Apache HBase

The canonical use case for which BigTable (and by extension, HBase) was created from web search. Search engines build indexes that map terms to the web pages that contain them. But there are many other use cases that HBase is suitable for—several of which are itemized in this section.

|Scenario |Description |
|---|---|
|Key-value store|HBase can be used as a key-value store, and it's suitable for managing message systems. Facebook uses HBase for their messaging system, and it's ideal for storing and managing Internet communications. WebTable uses HBase to search for and manage tables that are extracted from webpages.|
|Sensor data|HBase is useful for capturing data that is collected incrementally from various sources. This data includes social analytics, and time series. And keeping interactive dashboards up to date with trends and counters, and managing audit log systems. Examples include Bloomberg trader terminal and the Open Time Series Database (OpenTSDB). OpenTSDB stores and provides access to metrics collected about the health of server systems.|
|Real-time query|[Apache Phoenix](https://phoenix.apache.org/) is a SQL query engine for Apache HBase. It's accessed as a JDBC driver, and it enables querying and managing HBase tables by using SQL.|
|HBase as a platform|Applications can run on top of HBase by using it as a datastore. Examples include Phoenix, OpenTSDB, `Kiji`, and Titan. Applications can also integrate with HBase. Examples include: [Apache Hive](https://hive.apache.org/), Apache Pig, [Solr](https://lucene.apache.org/solr/), Apache Storm, Apache Flume, [Apache Impala](https://impala.apache.org/), Apache Spark, `Ganglia`, and Apache Drill.|

## Next steps

* [Get started using Apache HBase with Apache Hadoop in HDInsight](./apache-hbase-tutorial-get-started-linux.md)
* [Create HDInsight clusters on Azure Virtual Network](./apache-hbase-provision-vnet.md)
* [Configure Apache HBase replication in HDInsight](apache-hbase-replication.md)
