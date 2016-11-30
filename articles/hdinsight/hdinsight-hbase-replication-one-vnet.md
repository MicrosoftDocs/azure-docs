---
title: Configure HBase replication within one virtual network | Microsoft Docs
description: Learn how to configure HBase replication within one virtual network for load balancing, high availability, and zero downtime migration/update from one HDInsight version to another.
services: hdinsight,virtual-network
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.service: hdinsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/30/2016
ms.author: jgao

---
# Configure HBase repliction within one virtual network

Learn how to configure HBase replication within one virtual network. Some use cases for cluster replication include:

* Load balance. For example, running scans or MapReduce jobs on the secondary and ingesting data on the primary).
* High availability.
* Migrate data from one HBase cluster to another.
* Upgrade HDInsight cluster from one version to another.

Cluster replication uses a source-push methodology. An HBase cluster can be a source, a destination, or can fulfill both roles at once. Replication is asynchronous, and the goal of replication is eventual consistency. When the source receives an edit to a column family with replication enabled, that edit is propagated to all destination clusters. When data is replicated from one cluster to another, the source cluster and all clusters which have already consumed the data are tracked to prevent replication loops. For more information, 
In this tutorial, you will configure a source-destination replication.  For other cluster topologies, see [Apache HBase Reference Guide](http://hbase.apache.org/book.html#_cluster_replication).

Cluster replication is done by using a [script action](hdinsight-hadoop-customize-cluster-linux.md) script located at [Github](https://github.com/Azure/hbase-utils/tree/master/replication). 

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* **A workstation with Azure PowerShell**.
  
    To execute PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See Using the Set-ExecutionPolicy cmdlet.
  
    [!INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

## Create a virtual network with two HBase clusters.


## Load data 

When you replicate a cluster, you must specify what table to replicate.  In this section, you will load some data into the primary cluster. In the next section, you will enable replication between the two clusters.

Follow the instructions in [HBase tutorial: Get started using Apache HBase with Linux-based Hadoop in HDInsight](hdinsight-hbase-tutorial-get-started-linux.md) to create a *Contacts* table and insert some data into the table.


## Enable replication

**To enable HBase replication from the Azure portal**
 
1. Sign on to the Azure portal. 
2. Open the primary HBase cluster.
3. From the cluster menu, click **Script Actions**.
4. Click **Submit New** from the top of the blade.
5. Select or enter the following information:
        
        - Name: “Enable replication”
        - Bash Script URL:  https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_enable_replication.sh
        - Select  "Head", and unselect the other node types.
        - Parameters: -m hn1 -s <primary cluster DNS name> -d <secondary cluster DNS name> -sp <source cluster ambari password> -dp <destination cluster ambari password> -copydata
 
Detailed explanation of parameters is provided in print_usage() section of following script:
https://github.com/Azure/hbase-utils/blob/master/replication/hdi_enable_replication.sh
 
For running a script action using Azure PowerShell, see []().  For running a script action using Azure CLI, see []().
 

## Next Steps
In this tutorial, you have learned how to configure HBase replication across two datacenters. To learn more about HDInsight and HBase, see:

* [HDInsight service page](https://azure.microsoft.com/services/hdinsight/)
* [HDInsight documentation](https://azure.microsoft.com/documentation/services/hdinsight/)
* [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started]
* [HDInsight HBase overview][hdinsight-hbase-overview]
* [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]
* [Analyze real-time Twitter sentiment with HBase][hdinsight-hbase-twitter-sentiment]
* [Analyzing sensor data with Storm and HBase in HDInsight (Hadoop)][hdinsight-sensor-data]

[hdinsight-hbase-geo-replication-vnet]: hdinsight-hbase-geo-replication-configure-vnets.md
[hdinsight-hbase-geo-replication-dns]: ../hdinsight-hbase-geo-replication-configure-VNet.md


[img-vnet-diagram]: ./media/hdinsight-hbase-geo-replication/HDInsight.HBase.Replication.Network.diagram.png

[powershell-install]: powershell-install-configure.md
[hdinsight-hbase-get-started]: hdinsight-hbase-tutorial-get-started.md
[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-hbase-replication-vnet]: hdinsight-hbase-geo-replication-configure-vnets.md
[hdinsight-hbase-replication-dns]: hdinsight-hbase-geo-replication-configure-dns.md
[hdinsight-hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md
[hdinsight-sensor-data]: hdinsight-storm-sensor-data-analysis.md
[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
