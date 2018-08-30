---
title: What is HBase in Azure HDInsight? 
description: An introduction to Apache HBase in HDInsight, a NoSQL database build on Hadoop. Learn about use cases and compare HBase to other Hadoop clusters.
keywords: bigtable,nosql,what is hbase,apache hbase,hbase,habase overview,
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 02/22/2018
ms.author: jasonh

---
# What is HBase in HDInsight: A NoSQL database that provides BigTable-like capabilities for Hadoop
Apache HBase is an open-source, NoSQL database that is built on Hadoop and modeled after Google BigTable. HBase provides random access and strong consistency for large amounts of unstructured and semistructured data in a schemaless database organized by column families.

Data is stored in the rows of a table, and data within a row is grouped by column family. HBase is a schemaless database in the sense that neither the columns nor the type of data stored in them need to be defined before using them. The open-source code scales linearly to handle petabytes of data on thousands of nodes. It can rely on data redundancy, batch processing, and other features that are provided by distributed applications in the Hadoop ecosystem.

[!INCLUDE [hdinsight-price-change](../../../includes/hdinsight-enhancements.md)]

## How is HBase implemented in Azure HDInsight?
HDInsight HBase is offered as a managed cluster that is integrated into the Azure environment. The clusters are configured to store data directly in [Azure Storage](./../hdinsight-hadoop-use-blob-storage.md) or [Azure Data Lake Store](./../hdinsight-hadoop-use-data-lake-store.md), which provides low latency and increased elasticity in performance and cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. HBase and Hadoop are good starting points for big data project in Azure; in particular, they can enable real-time applications to work with large datasets.

The HDInsight implementation leverages the scale-out architecture of HBase to provide automatic sharding of tables, strong consistency for reads and writes, and automatic failover. Performance is enhanced by in-memory caching for reads and high-throughput streaming for writes. HBase cluster can be created inside virtual network. For details, see  [Create HDInsight clusters on Azure Virtual Network](./apache-hbase-provision-vnet.md).

## How is data managed in HDInsight HBase?
Data can be managed in HBase by using the `create`, `get`, `put`, and `scan` commands from the HBase shell. Data is written to the database by using `put` and read by using `get`. The `scan` command is used to obtain data from multiple rows in a table. Data can also be managed using the HBase C# API, which provides a client library on top of the HBase REST API. An HBase database can also be queried by using Hive. For an introduction to these programming models, see [Get started using HBase with Hadoop in HDInsight](./apache-hbase-tutorial-get-started-linux.md). Co-processors are also available, which allow data processing in the nodes that host the database.

> [!NOTE]
> Thrift is not supported by HBase in HDInsight.
>

## Scenarios: Use cases for HBase
The canonical use case for which BigTable (and by extension, HBase) was created was web search. Search engines build indexes that map terms to the web pages that contain them. But there are many other use cases that HBase is suitable for—several of which are itemized in this section.

* Key-value store
  
    HBase can be used as a key-value store, and it is suitable for managing message systems. Facebook uses HBase for their messaging system, and it is ideal for storing and managing Internet communications. WebTable uses HBase to search for and manage tables that are extracted from webpages.
* Sensor data
  
    HBase is useful for capturing data that is collected incrementally from various sources. This includes social analytics, time series, keeping interactive dashboards up-to-date with trends and counters, and managing audit log systems. Examples include Bloomberg trader terminal and the Open Time Series Database (OpenTSDB), which stores and provides access to metrics collected about the health of server systems.
* Real-time query
  
    [Phoenix](http://phoenix.apache.org/) is a SQL query engine for Apache HBase. It is accessed as a JDBC driver, and it enables querying and managing HBase tables by using SQL.
* HBase as a platform
  
    Applications can run on top of HBase by using it as a datastore. Examples include Phoenix, OpenTSDB, Kiji, and Titan. Applications can also integrate with HBase. Examples include Hive, Pig, Solr, Storm, Flume, Impala, Spark, Ganglia, and Drill.

## <a name="next-steps"></a>Next steps
* [Get started using HBase with Hadoop in HDInsight](./apache-hbase-tutorial-get-started-linux.md)
* [Create HDInsight clusters on Azure Virtual Network](./apache-hbase-provision-vnet.md)
* [Configure HBase replication in HDInsight](apache-hbase-replication.md)
* [Use Maven to build Java applications that use HBase with HDInsight (Hadoop)](./apache-hbase-build-java-maven-linux.md)

## <a name="see-also"></a>See also
* [Apache HBase](https://hbase.apache.org/)
* [Bigtable: A Distributed Storage System for Structured Data](http://research.google.com/archive/bigtable.html)




