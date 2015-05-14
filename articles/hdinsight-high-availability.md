<properties 
	pageTitle="Availability of Hadoop clusters in HDInsight | Microsoft Azure" 
	description="HDInsight deploys highly available and reliable clusters with an addtional head node." 
	services="hdinsight" 
	editor="cgronlun" 
	manager="paulettm" 
	authors="bradsev" 
	documentationCenter=""/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="11/10/2014" 
	ms.author="bradsev"/>


#Availability and reliability of Hadoop clusters in HDInsight

## Introduction ##
A second head node has been added to the Hadoop clusters deployed by Azure HDInsight to increase the availability and reliability of the service needed to manage workloads. Standard implementations of Hadoop clusters typically have a single head node. These clusters are designed to manage the failure of worker nodes smoothly, but any outages of master services running on the head node would cause the cluster to cease to work. 

![Diagram of the highly reliable head nodes in the HDInsight Hadoop implementation.](http://i.imgur.com/jrUmrH4.png)

HDInsight removes this single point of failure with the addition of a secondary head node (Head Node1). [ZooKeeper][zookeeper] nodes (ZKs) have been added and are used for leader election of head nodes and to insure that worker nodes and gateways (GWs) know when to fail over to the secondary head node (Head Node1) when the active head node (Head Node0) becomes inactive.


## How to check on the service status on the active head node ##
To determine which head node is active and to check on the status of the services running on that head node, you must connect to the Hadoop cluster by using the Remote Desktop Protocol (RDP). The ability to remote into the cluster is disabled by default in Azure, so it must first be enabled. For instructions on how to do this in the portal, see [Connect to HDInsight clusters using RDP](hdinsight-administer-use-management-portal.md#rdp).
Once you have remoted into the cluster, double-click on the **Hadoop Service Available Status** icon located on the desktop to obtain status about which head node the Namenode, Jobtracker, Templeton, Oozieservice, Metastore, and Hiveserver2 services are running, or for HDI 3.0, the Namenode, Resource Manager, History Server, Templeton, Oozieservice, Metastore, and Hiveserver2 services.

![](http://i.imgur.com/MYTkCHW.png)


## How to access log files on the secondary head node ##

To access job logs on the secondary head node in the event that it has become the active head node, browsing the JobTracker UI still works as it does for the primary active node. To access JobTracker, you must connect to the Hadoop cluster by using RDP as described in the previous section. Once you have remoted into the cluster, double-click on the **Hadoop Name Node** icon located on the desktop and then click on the **NameNode logs** to get to the directory of logs on the secondary head node.

![](http://i.imgur.com/eL6jzgB.png)


## How to configure the size of the head node ##
The head nodes are allocated as large virtual machines (VMs) by default. This size is adequate for the management of most Hadoop jobs run on the cluster. But there are scenarios that may require extra-large VMs for the head nodes. One example is when the cluster has to manage a large number of small Oozie jobs. 

Extra-large VMs can be configured by using either Azure PowerShell cmdlets or the HDInsight SDK.

The creation and provisioning of a cluster by using Azure PowerShell is documented in [Administer HDInsight using PowerShell](hdinsight-administer-use-powershell.md). The configuration of an extra-large head node requires the addition of the `-HeadNodeVMSize ExtraLarge` parameter to the `New-AzureHDInsightcluster` cmdlet used in this code.

    # Create a new HDInsight cluster in Azure PowerShell
	# Configured with an ExtraLarge head-node VM
    New-AzureHDInsightCluster -Name $clusterName -Location $location -HeadNodeVMSize ExtraLarge -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $containerName  -ClusterSizeInNodes $clusterNodes

For the SDK, the story is similar. The creation and provisioning of a cluster by using the SDK is documented in [Using HDInsight .NET SDK](hdinsight-provision-clusters.md#sdk). The configuration of an extra-large head node requires the addition of the `HeadNodeSize = NodeVMSize.ExtraLarge` parameter to the `ClusterCreateParameters()` method used in this code.

    # Create a new HDInsight cluster with the HDInsight SDK
	# Configured with an ExtraLarge head-node VM
    ClusterCreateParameters clusterInfo = new ClusterCreateParameters()
    {
    Name = clustername,
    Location = location,
    HeadNodeSize = NodeVMSize.ExtraLarge,
    DefaultStorageAccountName = storageaccountname,
    DefaultStorageAccountKey = storageaccountkey,
    DefaultStorageContainer = containername,
    UserName = username,
    Password = password,
    ClusterSizeInNodes = clustersize
    };


**References**	

- [ZooKeeper][zookeeper]
- [Connect to HDInsight clusters using RDP](hdinsight-administer-use-management-portal.md#rdp)
- [Using HDInsight .NET SDK](hdinsight-provision-clusters.md#sdk) 


[zookeeper]: http://zookeeper.apache.org/ 






