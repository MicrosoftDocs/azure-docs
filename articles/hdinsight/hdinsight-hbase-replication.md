---
title: Configure HBase replication | Microsoft Docs
description: Learn how to configure HBase replication for load balancing, high availability, zero downtime migration/update from one HDInsight version to another, and disaster recovery.
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
ms.date: 12/09/2016
ms.author: jgao

---
# Configure HBase replication

Learn how to configure HBase replication within one virtual network (VNet) or between two VNets. 

Cluster replication uses a source-push methodology. An HBase cluster can be a source, a destination, or can fulfill both roles at once. Replication is asynchronous, and the goal of replication is eventual consistency. When the source receives an edit to a column family with replication enabled, that edit is propagated to all destination clusters. When data is replicated from one cluster to another, the source cluster and all clusters which have already consumed the data are tracked to prevent replication loops. For more information, 
In this tutorial, you will configure a source-destination replication. For other cluster topologies, see [Apache HBase Reference Guide](http://hbase.apache.org/book.html#_cluster_replication).

Single-VNet HBase replication usage cases:

* Load balance. For example, running scans or MapReduce jobs on the destination cluster and ingesting data on the source cluster.
* High availability.
* Migrate data from one HBase cluster to another.
* Upgrade HDInsight cluster from one version to another.

Two-VNet HBase replication usage cases:

* Disaster recovery.
* Load balance and partition the application.
* High availability.

Cluster replication is done by using [script action](hdinsight-hadoop-customize-cluster-linux.md) scripts located at [Github](https://github.com/Azure/hbase-utils/tree/master/replication). 

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

## Configure the environments

There are three possible configurations:

- Two HBase clusters in one Azure VNet.
- Two HBase clusters in two different VNets in the same region.
- Two HBase clusters in two different VNets in two different regions (geo-replication).

To make it easier to configure the environments, we have created some [Azure Resource Manager templates](../azure-resource-manager/resource-group-overview.md). If you prefer to configure the environments using other methods, see:

- [Create Linux-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Create HBase clusters in Azure Virtual Network](hdinsight-hbase-provision-vnet.md).

### Configure the one-VNet scenario

Click the following image to two HBase clusters in the same VNet. The template is stored in a public Azure Blob container. 

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-hdinsight-hbase-replication-one-vnet%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-hbase-replication/deploy-to-azure.png" alt="Deploy to Azure"></a>

### Configure the two-VNet in the same region scenario

Click the following image to create two VNets with VNet peering and two HBase clusters in the same region. The template is stored in a public Azure Blob container. 

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Fhbaseha%2Fdeploy-hbase-replication-with-two-vnets-peering-in-one-region.json" target="_blank"><img src="./media/hdinsight-hbase-replication/deploy-to-azure.png" alt="Deploy to Azure"></a>

This scenario requires [VNet peering](../virtual-network/virtual-network-peering-overview.md). VNet peering is enabled by the template.   

HBase replication uses IP addresses of the Zookeepers. You must configure static IP addresses for the destination HBase Zookeeper nodes.

**To configure static IP addresses**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. From the left menu, click **Resource Groups**.
3. Click your resource group that contains the destination HBase cluster. This is the resource group you specified when you use the Resource Manager template to create the environment. You can use the filter to narrow down the list. You can see a list of resources which contains the two VNets.
4. Click the VNet that contains the destination HBase cluster. For exmaple xxxx-vnet2. You can see 3 devices with the names starting with **nic-zookeepermode-**. Those devices are the 3 zookeeper VMs.
5. Click one of the Zookeeper VMs.
6. Click **IP configurations**.
7. Click **ipConfig1** from the list.
8. Click **Static**, and write down the actual IP address.  You will need the IP address when you run the script action to enable replication.

  ![HDInsight HBase Replication Zookeeper static IP](./media/hdinsight-hbase-replication/hdinsight-hbase-replication-zookeeper-static-ip.png)

9. Repeat step 6 to set the static IP address for the other two Zookeeper nodes.

### Configure the two-vnet in two different region scenario

Click the following image to create two VNets in two different regions. The template is stored in a public Azure Blob container. 

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Fhbaseha%2Fdeploy-hbase-geo-replication.json" target="_blank"><img src="./media/hdinsight-hbase-replication/deploy-to-azure.png" alt="Deploy to Azure"></a>

Create a VPN gateway between the two VNets.  For the instructions, see [Create a VNet with a Site-to-Site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md).

HBase replication uses IP addresses of the Zookeepers. You must configure static IP addresses for the destination HBase Zookeeper nodes. To configure static IP, see the Configure the one-vnet scenario section in this article.

## Load test data 

When you replicate a cluster, you must specify the tables to replicate.  In this section, you will load some data into the source cluster. In the next section, you will enable replication between the two clusters.

Follow the instructions in [HBase tutorial: Get started using Apache HBase with Linux-based Hadoop in HDInsight](hdinsight-hbase-tutorial-get-started-linux.md) to create a *Contacts* table and insert some data into the table.

## Enable replication

The following steps show how to call the script action script from the Azure portal. For running script action using Azure PowerShell and Azure CLI, see [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

**To enable HBase replication from the Azure portal**
 
1. Sign on to the [Azure portal](https://portal.azure.com). 
2. Open the source HBase cluster.
3. From the cluster menu, click **Script Actions**.
4. Click **Submit New** from the top of the blade.
5. Select or enter the following information:
        
  - **Name**: Enable replication
  - **Bash Script URL**:  https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_enable_replication.sh
  - **Head**: (Selected. And unselect the other node types.
  - **Parameters**: The following sample parameters enables replication for all the existing tables, and copy all the data from the source cluster to the destination cluster:

        -m hn1 -s &lt;source cluster DNS name> -d &lt;destination cluster DNS name> -sp &lt;source cluster Ambari password> -dp &lt;destination cluster Ambari password> -copydata    

6. Click **Create**. The script can take some time especially when the -copydata argument is used.

Required arguments:

|Name|Description|
|----|-----------|
|-s, --src-cluster | Specify the DNS name of the source HBase cluster. For example: -s hbsrccluster, --src-cluster=hbsrccluster |
|-d, --dst-cluster | Specify the DNS name of the destination (replica) HBase cluster. For example: -s dsthbcluster, --src-cluster=dsthbcluster |
|-sp, --src-ambari-password | Specify the admin password for Ambari of source HBase cluster. | 
|-dp, --dst-ambari-password | Specify the admin password for Ambari of destination HBase cluster.|

Optional arguments:

|Name|Description|
|----|-----------|
|-su, --src-ambari-user | Specify the admin username for Ambari of source HBase cluster. The default value is *admin*. |
|-du, --dst-ambari-user | Specify the admin username for Ambari of destination HBase cluster. The default value is *admin*. |
|-t, --table-list | Specify the tables to be replicated. For example: --table-list="table1;table2;table3". If not specified, all existing HBase tables are replicated.|
|-m, --machine | Specify the head node where to run the script acction. The value is either hn1 or hn0. Because hn0 is usually busier, using hn1 is recommended. This option is used when running the $0 script as Script Action from HDInsight portal or Azure Powershell.|
|-ip | This argument is required when enabling replication between two VNets. This argument acts as a switch to utilize the static IPs of zookeeper nodes from replica cluster instead of FQDN names. The static IPs need to be pre-configured before enabling replication. |
|-cp, -copydata | Enable the migration of existing data on the tables where replication gets enabled. |
|-rpm, -replicate-phoenix-meta | Enable the replication on Phoenix system tables. NOTE: This option needs to be used with caution! It is in general advised to recreate phoenix tables on replica cluster before using this script. |
|-h, --help | Display's usage information. |

Detailed explanation of parameters is provided in print_usage() section of following script: [https://github.com/Azure/hbase-utils/blob/master/replication/hdi_enable_replication.sh](https://github.com/Azure/hbase-utils/blob/master/replication/hdi_enable_replication.sh).
 
After the script action is successfully deployed, you can use SSH to connect to the destination HBase cluster, and verify the data has been replicated.

### Replication scenarios

The following list shows you some general usage cases and their parameter settings:

1. **Enable replication on all tables between the two clusters**. This scenario does not require the copy/migration of existing data on the tables, and it does not use Phoenix tables. Use the following parameters:

        -m hn1 -s <source cluster DNS name> -d <destination cluster DNS name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password>  
 
2. **Enable replication on specific tables**. Use the following parameters to enable replication on table1, table2 and table3:

        -m hn1 -s <source cluster DNS name> -d <destination cluster DNS name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -t "table1;table2;table3" 
 
3. **Enable replication on specific tables and copy the existing data**. Use the following parameters to enable replication on table1, table2 and table3:

        -m hn1 -s <source cluster DNS name> -d <destination cluster DNS name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -t "table1;table2;table3" -copydata
 
4. **Enable replication on all tables with replicating phoenix metadata from source to destination**. Phoenix metadata replication is not perfect and should be enabled with caution. 

        -m hn1 -s <source cluster DNS name> -d <destination cluster DNS name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -t "table1;table2;table3" -replicate-phoenix-meta  

## Copy and migrate data

There are two separate script action scripts for copying/migrating data after replication is enabled:

- For small tables (few GB's in size and overall copy is expected to finish in less than 1 hour):

    https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_copy_table.sh
 
- For large tables (expected to take longer than 1 hour to copy):

    https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/nohup_hdi_copy_table.sh

You can follow the same procedure in [Enable replication](#enable-replication) to call the script action with the following parameters:

    -m hn1 -t <table1:start_timestamp:end_timestamp;table2:start_timestamp:end_timestamp;...> -p <replication_peer> [-everythingTillNow]
 
Detailed description of parameters is provided in the print_usage() section of the [script](https://github.com/Azure/hbase-utils/blob/master/replication/hdi_copy_table.sh).


### Scenarios

1. **Copy specific tables (test1, test2 and test3) for all rows edited till now (current timestamp)**:
 
        -m hn1 -t "test1::;test2::;test3::" -p "zk5-hbrpl2;zk1-hbrpl2;zk5-hbrpl2:2181:/hbase-unsecure" -everythingTillNow 
  or

        -m hn1 -t "test1::;test2::;test3::" --replication-peer="zk5-hbrpl2;zk1-hbrpl2;zk5-hbrpl2:2181:/hbase-unsecure" -everythingTillNow 
 
 
2. **Copy specific tables with specified time range**:
  
        -m hn1 -t "table1:0:452256397;table2:14141444:452256397" -p "zk5-hbrpl2;zk1-hbrpl2;zk5-hbrpl2:2181:/hbase-unsecure" 


## Disable replication

To disable replication, you use another script action script located at https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_disable_replication.sh. You can follow the same procedure in [Enable replication](#enable-replication) to call the script action with the following parameters:

    -m hn1 -s <source cluster DNS name> -sp <source cluster Ambari Password> <-all|-t "table1;table2;...">  
 
Detailed explanation of parameters is provided in print_usage() section of the [script](https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_disable_replication.sh).
 

### Scenarios
 
1. **Disable replication on all tables**:
 
        -m hn1 -s <source cluster DNS name> -sp Mypassword\!789 -all 
  or

        --src-cluster=<source cluster DNS name> --dst-cluster=<destination cluster DNS name> --src-ambari-user=&lt;source cluster Ambari username> --src-ambari-password=&lt;source cluster Ambari password>
 
2. **Disable replication on specified tables**(table1, table2 and table3):
  
        -m hn1 -s <source cluster DNS name> -sp &lt;source cluster Ambari password> -t "table1;table2;table3"
 
## Next Steps

In this tutorial, you have learned how to configure HBase replication across two datacenters. To learn more about HDInsight and HBase, see:

* [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started]
* [HDInsight HBase overview][hdinsight-hbase-overview]
* [Create HBase clusters in Azure Virtual Network][hdinsight-hbase-provision-vnet]
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
