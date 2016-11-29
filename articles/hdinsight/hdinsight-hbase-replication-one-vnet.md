---
title: Configure HBase replication with one virtual network | Microsoft Docs
description: Learn how to configure HBase replication with one virtual network for load balancing, high availability, and zero downtime migration/update from one HDInsight version to another.
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
ms.date: 11/29/2016
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

Cluster replication is done by using a [script action] script located at [Github](https://github.com/Azure/hbase-utils/tree/master/replication). 

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* **A workstation with Azure PowerShell**.
  
    To execute PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See Using the Set-ExecutionPolicy cmdlet.
  
    [!INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]


## Create a virtual network with two HBase clusters.

## Enable replication between HBase tables
Now, you can create a sample HBase table, enable replication, and then test it with some data. The sample table you will use has two column families: Personal and Office. 

In this tutorial, you will make the Europe HBase cluster as the source cluster, and the U.S. HBase cluster as the destination cluster.

Create HBase tables with the same names and column families on both the source and destination clusters, so that the destination cluster knows where to store data it will receive. For more information on using the HBase shell, see [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started].

**To create an HBase table on Contoso-HBase-EU**

1. Switch to the **Contoso-HBase-EU** RDP window.
2. From the desktop, click **Hadoop Command Line**.
3. Change the folder to the HBase home directory:
   
        cd %HBASE_HOME%\bin
4. Open the HBase shell:
   
        hbase shell
5. Create an HBase table:
   
        create 'Contacts', 'Personal', 'Office'
6. Don't close either the RDP session nor the Hadoop Command Line window. You will still need them later in the tutorial.

**To create an HBase table on Contoso-HBase-US**

* Repeat the same steps to create the same table on Contoso-HBase-US.

**To add Contoso-HBase-US as a replication peer**

1. Switch to the **Contso-HBase_EU** RDP window.
2. From the HBase shell window, add the destination cluster (Contoso-HBase-US) as a peer, for example:
   
        add_peer '1', 'zookeeper0.contoso-hbase-us.d4.internal.cloudapp.net,zookeeper1.contoso-hbase-us.d4.internal.cloudapp.net,zookeeper2.contoso-hbase-us.d4.internal.cloudapp.net:2181:/hbase'
   
    In the sample, the domain suffix is *contoso-hbase-us.d4.internal.cloudapp.net*. You need to update it to match your domain suffix of the US HBase cluster. Make sure there is no spaces between the hostnames.

**To configure each column family to be replicated on the source cluster**

1. From the HBase shell window of the **Contso-HBase-EU** RDP session,  configure each column family to be replicated:
   
        disable 'Contacts'
        alter 'Contacts', {NAME => 'Personal', REPLICATION_SCOPE => '1'}
        alter 'Contacts', {NAME => 'Office', REPLICATION_SCOPE => '1'}
        enable 'Contacts'

**To bulk upload data to the HBase table**

A sample data file has been uploaded to a public Azure Blob container with the following URL:

        wasbs://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt

The content of the file:

        8396    Calvin Raji    230-555-0191    5415 San Gabriel Dr.
        16600    Karen Wu    646-555-0113    9265 La Paz
        4324    Karl Xie    508-555-0163    4912 La Vuelta
        16891    Jonathan Jackson    674-555-0110    40 Ellis St.
        3273    Miguel Miller    397-555-0155    6696 Anchor Drive
        3588    Osarumwense Agbonile    592-555-0152    1873 Lion Circle
        10272    Julia Lee    870-555-0110    3148 Rose Street
        4868    Jose Hayes    599-555-0171    793 Crawford Street
        4761    Caleb Alexander    670-555-0141    4775 Kentucky Dr.
        16443    Terry Chander    998-555-0171    771 Northridge Drive

You can upload the same data file into your HBase cluster and import the data from there.

1. Switch to the **Contoso-HBase-EU** RDP window.
2. From the desktop, click **Hadoop Command Line**.
3. Change the folder to the HBase home directory:
   
        cd %HBASE_HOME%\bin
4. upload the data:
   
        hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,Personal:Name, Personal:HomePhone, Office:Address" -Dimporttsv.bulk.output=/tmpOutput Contacts wasbs://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt
   
        hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /tmpOutput Contacts

## Verify that data replication is taking place
You can verify that replication is taking place by scanning the tables from both clusters with the following HBase shell commands:

        Scan 'Contacts'


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
