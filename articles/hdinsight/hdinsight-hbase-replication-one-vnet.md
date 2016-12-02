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
ms.date: 12/02/2016
ms.author: jgao

---
# Configure HBase replication within one virtual network

Learn how to configure HBase replication within one virtual network (VNet). Some use cases for cluster replication include:

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

## Create a virtual network with two HBase clusters

To make it easier to go through this tutorial, we have created an Azure Resource Manager template. Using the template, you create a VNet and two HBase clusters within the VNet. The template is stored in a public Azure Blob container.   Click the following button to open the template in the Azure portal.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-hbase-replication-one-vnet.json" target="_blank"><img src="./media/hdinsight-hbase-replication-one-vnet/deploy-to-azure.png" alt="Deploy to Azure"></a>

If you prefer to configure the environment using other methods, see:

- [Create Linux-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Create HBase clusters in Azure Virtual Network](hdinsight-hbase-provision-vnet.md).

## Load data 

When you replicate a cluster, you must specify the tables to replicate.  In this section, you will load some data into the primary cluster. In the next section, you will enable replication between the two clusters.

Follow the instructions in [HBase tutorial: Get started using Apache HBase with Linux-based Hadoop in HDInsight](hdinsight-hbase-tutorial-get-started-linux.md) to create a *Contacts* table and insert some data into the table.

## Enable replication

The following steps show how to call the script action script from the Azure portal. For running script action using Azure PowerShell and Azure CLI, see [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

**To enable HBase replication from the Azure portal**
 
1. Sign on to the Azure portal. 
2. Open the primary HBase cluster.
3. From the cluster menu, click **Script Actions**.
4. Click **Submit New** from the top of the blade.
5. Select or enter the following information:
        
    - Name: “Enable replication”
    - Bash Script URL:  https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_enable_replication.sh
    - Select  "Head", and unselect the other node types.
    - Parameters: --machine hn1 --src-cluster <primary cluster DNS name> --dst-cluster <secondary cluster DNS name> --src-ambari-password <primary cluster Ambari password> --dst-ambari-password <secondary cluster Ambari password> -copydata

    Set the values in the parameters. The parameters used in the sample enables replication and copy all the HBase tables from primary cluster to the secondary cluster. Detailed explanation of parameters is provided in print_usage() section of following script: [https://github.com/Azure/hbase-utils/blob/master/replication/hdi_enable_replication.sh](https://github.com/Azure/hbase-utils/blob/master/replication/hdi_enable_replication.sh).
 
After the script action is successfully deployed, you can use SSH to connect to the secondary HBase cluster, and verify the data has been replicated.

### Replication scenarios

The following list shows you some general usage cases and their parameter settings:

1. **Enable replication on all tables between the two clusters**. This scenario does not require the copy/migration of existing data on the tables, and it does not use Phoenix tables. Use the following parameters:

  -s <primary cluster DNS name> -d <secondary cluster DNS name> -sp <primary cluster Ambari password> -dp <secondary cluster Ambari password> -m hn0 
 
2. **Enable replication on specific tables**. Use the following parameters to enable replication on table1, table2 and table3:

  -s <primary cluster DNS name> -d <secondary cluster DNS name> -sp <primary cluster Ambari password> -dp <secondary cluster Ambari password> -m hn0 -t "table1;table2;table3" 
 
3. **Enable replication on specific tables and copy the existing data**. Use the following parameters to enable replication on table1, table2 and table3:

  -s <primary cluster DNS name> -d <secondary cluster DNS name> -sp <primary cluster Ambari password> -dp <secondary cluster Ambari password> -m hn0 -t "table1;table2;table3" -copydata
 
4. **Enable replication on all tables with replicating phoenix metadata from primary to secondary**. Phoenix metadata replication is not perfect and should be enabled with caution. 

  -s <primary cluster DNS name> -d <secondary cluster DNS name> -sp <primary cluster Ambari password> -dp <secondary cluster Ambari password> -m hn0 -t "table1;table2;table3" -replicate-phoenix-meta  

## Copy and migrate data

There are two separate script action scripts for copying/migrating data after replication is enabled:

- For small tables (few GB's in size and overall copy is expected to finish in less than 1 hour):

    https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_copy_table.sh
 
- For large tables (expected to take longer than 1 hour to copy):

    https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/nohup_hdi_copy_table.sh

You can follow the same procedure in [Enable replication](#enable-replication) to call the script action with the following parameters:

  -m hn1 -t <table1:start_timestamp:end_timestamp;table2:start_timestamp:end_timestamp;...> -p <replication_peer>  [-everythingTillNow]
 
Detailed description of parameters is provided in the print_usage() section of the [script](https://github.com/Azure/hbase-utils/blob/master/replication/hdi_copy_table.sh).


### Scenarios

1. **Copy specific tables (test1, test2 and test3) for all rows edited till now (current timestamp)**:
 
    -t "test1::;test2::;test3::" -p "zk5-hbrpl2;zk1-hbrpl2;zk5-hbrpl2:2181:/hbase-unsecure" -everythingTillNow -m hn1
  or

    --table-list="test1::;test2::;test3::" --replication-peer="zk5-hbrpl2;zk1-hbrpl2;zk5-hbrpl2:2181:/hbase-unsecure" -everythingTillNow --machine=hn1
 
 
2. **Copy specific tables with specified time range**:
  
    -t "table1:0:452256397;table2:14141444:452256397" -p "zk5-hbrpl2;zk1-hbrpl2;zk5-hbrpl2:2181:/hbase-unsecure" -m hn1


## Disable replication

To disable replication, you use another script action script located at https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_disable_replication.sh. You can follow the same procedure in [Enable replication](#enable-replication) to call the script action with the following parameters:

  -s <primary cluster DNS name> -sp <primary cluster Ambari Password> <-all|-t "table1;table2;...">  -m hn1
 
Detailed explanation of parameters is provided in print_usage() section of the [script](https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_disable_replication.sh).
 

### Scenarios
 
1. **Disable replication on all tables**:
 
    -s <primary cluster DNS name> -sp Mypassword\!789 -all -m hn1
  or

    --src-cluster=<primary cluster DNS name> --dst-cluster=<secondary cluster DNS name> --src-ambari-user=admin --src-ambari-password=Hello\!789
 
2. **Disable replication on specified tables**(table1, table2 and table3):
  
    -s <primary cluster DNS name> -sp MyPassword\!789 -m hn1 -t "table1;table2;table3"
 
## Next Steps

In this tutorial, you have learned how to configure HBase replication across two datacenters. To learn more about HDInsight and HBase, see:

* [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started]
* [HDInsight HBase overview][hdinsight-hbase-overview]
* [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]
* [Analyze real-time Twitter sentiment with HBase][hdinsight-hbase-twitter-sentiment]
* [Analyzing sensor data with Storm and HBase in HDInsight (Hadoop)][hdinsight-sensor-data]

[hdinsight-hbase-geo-replication-vnet]: hdinsight-hbase-geo-replication-configure-vnets.md
[hdinsight-hbase-geo-replication-dns]: ../hdinsight-hbase-geo-replication-configure-VNet.md


[img-vnet-diagram]: ./media/hdinsight-hbase-geo-replication/HDInsight.HBase.Replication.Network.diagram.png

[powershell-install]: powershell-install-configure.md
[hdinsight-hbase-get-started]: hdinsight-hbase-tutorial-get-started-linux.md
[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md
[hdinsight-sensor-data]: hdinsight-storm-sensor-data-analysis.md
[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
