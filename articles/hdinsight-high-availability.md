<properties urlDisplayName="HDInsight High Availability" pageTitle="Availability of Hadoop clusters in HDInsight | Azure" metaKeywords="hdinsight, hadoop, hdinsight hadoop, hadoop azure" description="HDInsight deploys highly available and reliable clusters." services="HDInsight" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" title="Availability of Hadoop clusters in HDInsight" authors="bradsev" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="multiple" ms.topic="article" ms.date="01/01/1900" ms.author="bradsev" />


#Availability and reliability of Hadoop clusters in HDInsight

## Introduction ##
A second headnode has been added to the Hadoop clusters deployed by HDInsight to increase the availability and reliability of the service needed to manage workloads. Standard implementations of Hadoop clusters typically have a single headnode. These clusters are designed to manage the failure of worker nodes smoothly, but any outages of master services running on the headnode would cause the cluster to cease to work. 

![](http://i.imgur.com/jrUmrH4.png)

HDInsight removes this single point of failure with the addition of a secondary headnode (Head Node1). [ZooKeeper][zookeeper] nodes (ZKs) have been added and are used for Leader Election of headnodes and to insure that worker nodes and gateways (GWs) know when to fail over to the secondary headnode (Head Node1) when the active headnode (HeadNode0) becomes inactive.


## How to check on the service status on the active headnode ##
To determine which headnode is active and to check on the status of the services running on that head node, you must connect to the Hadoop cluster using the Remote Desktop Protocol (RDP). The ability to remote into the cluster is disabled by default in Azure, so it must be first be enabled. For instructions on how to do this in the portal, see [Connect to HDInsight clusters using RDP](../hdinsight-administer-use-management-portal/#rdp)
Once you have remoted into the cluster, double-click on the **Hadoop Service Available Status** icon located on the desktop to obtain status about which headnode the Namenode, Jobtracker, Templeton, Oozieservice, Metastore, and Hiveserver2 services are running, or for HDI 3.0, the Namenode, Resource Manager, History Server, Templeton, Oozieservice, Metastore and Hiveserver2.

![](http://i.imgur.com/MYTkCHW.png)


## How to access log files on the secondary headnode ##

To access job logs on the secondary headnode in the event that it has become the active headnode, browsing the JobTracker UI still works as it does for the primary active node. To access the Job Tracker, you must connect to the Hadoop cluster using the Remote Desktop Protocol (RDP) as described in the previous section. Once you have remoted into the cluster, double-click on the **Hadoop Name Node** icon located on the desktop and then click on the **NameNode logs** to get to the directory of logs on the secondary headnode.

![](http://i.imgur.com/eL6jzgB.png)


## How to configure the size of the headnode ##
The headnodes are allocated as large VMs by default. This size is adequate for the management of most Hadoop jobs run on the cluster. But there are scenarios that may require that extra large VMs are needed for the headnodes. One example is when the cluster has to manage a large number of small Oozie jobs. 

Extra large VMs can be configured using either Azure PowerShell cmdlets or the HDInsight SDK.

The creation and provisioning of a cluster using PowerShell is documented in [Administer HDInsight using PowerShell](../hdinsight-administer-use-powershell/). The configuration of an extra large headnode requires the addition of the `-HeadNodeVMSize ExtraLarge` parameter to the `New-AzureHDInsightcluster` cmdlet used in this code.

    # Create a new HDInsight cluster in Azure PowerShell
	# Configured with an ExtraLarge Headnode VM
    New-AzureHDInsightCluster -Name $clusterName -Location $location -HeadNodeVMSize ExtraLarge -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $containerName  -ClusterSizeInNodes $clusterNodes

For SDK, the story is similar. The creation and provisioning of a cluster using the SDK is documented in [Using HDInsight .NET SD](../hdinsight-provision-clusters/#sdk). The configuration of an extra large headnode requires the addition of the `HeadNodeSize = NodeVMSize.ExtraLarge` parameter to the `ClusterCreateParameters()` method used in this code.

    # Create a new HDInsight cluster with the HDInsight SDK
	# Configured with an ExtraLarge Headnode VM
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
- [Connect to HDInsight clusters using RDP](../hdinsight-administer-use-management-portal/#rdp)
- [Using HDInsight .NET SDK](../hdinsight-provision-clusters/#sdk) 


[zookeeper]: http://zookeeper.apache.org/ 






