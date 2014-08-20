<properties linkid="manage-services-hdinsight-hbase-overview" urlDisplayName="HDInsight HBase overview" pageTitle="An overview of HBase in HDInsight | Azure" metaKeywords="" description="An introduction to HBase in HDInsight, use-cases and a comparison with other database solutions ." metaCanonical="" services="hdinsight" documentationCenter="" title="HDInsight HBase overview" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="bradsev" />



# HDInsight HBase overview #
## What is HBase? ##

HBase is an Apache open source NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semi-structured data. It was modeled on Google's BigTable and is a column family-oriented database. The open source code was first released by Mike Cafarella in 2007. It scales linearly to handle petabytes of data on thousands of nodes. It can rely on the data redundancy and batch processing and other features that are provided by the distributed Hadoop ecosystem.

HDInsight HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. HBase and Hadoop are good starting points for big data project in Azure, and, in particular, can enable real-time applications to work with large datasets.

Scale-out architecture
 Automatic sharding of tables
 Strong consistency for reads and writes
 Automatic failover
Performance
 In-memory caching on read
 High throughput streaming writes
APIs
 Get/Put
 Scan
 Coprocessors

## Scenarios ##

### Use case #1: Key value store
Message systems
Content management systems
Examples
Facebook Messages
Twitter-like messages
Webtable – web crawler/indexer

### Use case #2: sensor data

### Use case #3: real-time query
Phoenix – SQL Query over HBase

### Use case #4: HBase as a platform

##<a name="summary"></a>Summary



[hdinsight-versions]: ../hdinsight-component-versioning/

[hdinsight-get-started-30]: ../hdinsight-get-started-30/

[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-use-hive]: ../hdinsight-use-hive/

[hdinsight-storage]: ../hdinsight-use-blob-storage/



[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: ../install-configure-powershell/
[powershell-open]: ../install-configure-powershell/#Install


[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png






