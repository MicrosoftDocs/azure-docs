<properties urlDisplayName="HDInsight HBase overview" pageTitle="An overview of HBase in HDInsight | Azure" metaKeywords="" description="An introduction to HBase in HDInsight, use-cases and a comparison with other database solutions ." metaCanonical="" services="hdinsight" documentationCenter="" title="HDInsight HBase overview" authors="bradsev" solutions="big-data" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/21/2014" ms.author="bradsev" />



# HDInsight HBase overview #

## What is HBase? ##

HBase is an Apache open source NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data. It was modeled on Google's BigTable and is a column family-oriented database. Data is stored in the rows of a table and data within a row is grouped by column family. HBase is a schema-less database in the sense that neither the columns nor the type of data stored in them need to defined before using them. The open source code was first released by Mike Cafarella in 2007. It scales linearly to handle petabytes of data on thousands of nodes. It can rely on the data redundancy, batch processing and other features that are provided by distributed applications in the Hadoop ecosystem.

## What is Azure HDInsight HBase? ##
HDInsight HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. HBase and Hadoop are good starting points for big data project in Azure, and, in particular, can enable real-time applications to work with large datasets.

The HDInsight implementation leverages the scale-out architecture of HBase to provide automatic sharding of tables, strong consistency for reads and writes, and automatic failover. Performance is enhanced by in-memory caching on read and high throughput streaming writes. Virtual network provisioning is also available for HDInsight HBase. For details, see [Provision HDInsight clusters on Azure Virtual Network][hbase-provision-vnet].

## How is data in HDInsight HBase managed? ##
Data can be managed in HBase using the `create` `get`, `put`, and `scan` commands from the HBase shell. Data is written to the database using `put` and read using the `get` commands. The `scan` command is used to obtain data from multiple rows in a table. Data can also be managed using the HBase C# API, which provides a client library on top of the HBase REST API. An HBase database can also be queried using Hive. For an introduction to these programming models, see [Get started using HBase with Hadoop in HDInsight][hbase-get-started]. Coprocessors are also available that allow processing of data in the nodes hosting the database.
 

## Scenarios: What are the use cases for HBase? ##
The canonical use case for which BigTable, and by extension, HBase was created was web search. Search engines build indexes that map terms to the web pages that contain them. But there are many other use cases that HBase is suitable for, several of which are itemized in this section.

### Use case #1: Key-value store
HBase can be used as a key-value store and is suitable for managing message systems. Facebook uses HBase for their messaging system and it is ideal for storing and managing internet communications. WebTable uses HBase to search for and manage tables extracted from web pages.

### Use case #2: Sensor data
Hase is useful for capturing data that is collected incrementally from various sources. This includes social analytics, time series, keeping interactive dashboards up to date with trends and counters, and managing audit log systems. Examples include Bloomberg trader terminal
and the Open Time Series Database (OpenTSDB) which stores and provides access to metrics collected on the health of server systems.


### Use case #3: Real-time query
[Phoenix](http://phoenix.apache.org/) is a SQL query engine for Apache HBase. It is accessed as a JDBC driver and enables querying and managing HBase tables using SQL. 

### Use case #4: HBase as a platform
Applications can run on top of HBase using it as a datastore. Examples include Phoenix, OpenTSDB, Kiji, and Titan. Applications can also integrate with HBase. Examples include Hive, Pig, Solr, Storm, Flume, Impala, Spark, Ganglia, and Drill.


##<a name="next-steps"></a>Next steps

[Get started using HBase with Hadoop in HDInsight][hbase-get-started]

[Provision HDInsight clusters on Azure Virtual Network][hbase-provision-vnet]

[Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]

[Use Maven to build Java applications that use HBase with HDInsight (Hadoop)][hbase-build-java-maven]

[C# HBase SDK][cs-hbase-sdk]

##<a name="see-also"></a>See also

[Apache HBase](https://hbase.apache.org/)

[Bigtable: A Distributed Storage System for Structured Data](http://research.google.com/archive/bigtable.html)




[hbase-provision-vnet]: ../hdinsight-hbase-provision-vnet/

[hbase-twitter-sentiment]: ../hdinsight-hbase-analyze-twitter-sentiment/

[hbase-build-java-maven]: ../hdinsight-hbase-build-java-maven/

[hdinsight-use-hive]: ../hdinsight-use-hive/

[hdinsight-storage]: ../hdinsight-use-blob-storage/

[hbase-get-started]: http://azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-get-started/

[cs-hbase-sdk]: https://github.com/hdinsight/hbase-sdk-for-net

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/










