<properties
   	pageTitle="Create Hadoop, HBase, or Storm clusters on Linux in HDInsight | Microsoft Azure"
   	description="Learn how to create Hadoop, HBase, or Storm clusters on Linux for HDInsight using a browser, the Azure CLI, Azure PowerShell, REST, or through an SDK."
   	services="hdinsight"
   	documentationCenter=""
   	authors="nitinme"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="09/21/2015"
   	ms.author="nitinme"/>


#Create Linux-based clusters in HDInsight

In this document, you will learn about the different ways to create a Linux-based HDInsight cluster on Azure, as well as optional configurations that can be used with your cluster. HDInsight provides Apache Hadoop, Apache Storm, and Apache HBase as services on the Azure cloud platform.

> [AZURE.NOTE] This document provides instructions on the different ways to create a cluster. If you are looking for a quick-start approach to create a cluster, see [Get Started with Azure HDInsight on Linux](../hdinsight-hadoop-linux-get-started.md).

## What is an HDInsight cluster?

HDInsight is an Azure service that provides a variety of open source big data technologies as a service on the Azure platform. The base of any HDInsight cluster is Apache Hadoop, which enables distributed processing of large data. 

A cluster consists of multiple compute instances (called nodes,) and processing is spread across different nodes of a cluster. The cluster has a master/worker architecture with a master node (also called a head node or name node) and any number of worker nodes (also called data nodes). For more information, see <a href="http://go.microsoft.com/fwlink/?LinkId=510084" target="_blank">Apache Hadoop</a>.

![HDInsight Cluster][img-hdi-cluster]


An HDInsight cluster abstracts the Hadoop implementation details so that you don't need to worry about how to communicate with different nodes of a cluster. When you create an HDInsight cluster, Azure provisions compute resources that contain Hadoop and related applications. For more information, see [Introduction to Hadoop in HDInsight](hdinsight-hadoop-introduction.md). The data used by the cluster is stored in Azure Blob storage. For more information, see [Use Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md).

## <a id="configuration"></a>Required configuration

The following sections describe the required configuration options available when creating an HDInsight cluster.

###Cluster name

The cluster name provides a unique identifier for the cluster, and is used as part of the domain name for accessing the cluster over the Internet. For example, a cluster named _mycluster_ will be available over the internet as _mycluster_.azurehdinsight.net.

###Cluster type

Cluster type allows you to select special purpose configurations for the cluster. The following are the types available for Linux-based HDInsight:

| Cluster type | Use this if you need to do... |
| ------------ | ----------------------------- |
| Hadoop       | Batch processing of data      |
| HBase        | NoSQL data storage            |
| Storm        | Real-time stream processing of data |

Other technologies such as Hue, Spark, or R can be added to these basic types through the use of [Script Actions](#scriptaction).

###Cluster operating system

You can create HDInsight clusters using either Ubuntu (a Linux distribution,) or Windows. The information in this document is specific to Linux-based clusters. For information on Windows-based clusters, see [Create Windows-based Hadoop clusters in HDInsight](hdinsight-provision-clusters.md).

###Credentials

There are two types of authentication used with HDInsight clusters:

* __Admin__ or __HTTPs__ authentication: The admin account for a cluster is primarily used when accessing web or REST services exposed by the cluster. It cannot be used to directly login to the cluster.

* __SSH__: An SSH user account is used to remotely access the cluster using a [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) client. This is most often used to provide a remote command-line to the cluster head nodes, however it can also be used to proxy web traffic from your local computer to the cluster.

The admin account is secured by a password, and all web communications to the cluster using the admin account should be performed over a secure HTTPS connection.

The SSH user can be authenticated using either a password or a certificate. Certificate authentication is the most secure option, however it requires the creation and maintenance of a public and private certificate pair.

For more information on using SSH with HDInsight, including how to create and use SSH keys, see one of the following articles:

* [For Linux, Unix, or Mac OS X clients - using SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
* [For Windows clients - using SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-windows.md)

###Resource group

Resources created using the Azure Resource Manager are contained in a _resource group_. A group can contain multiple resources, and allows you to perform management operations on all resources in the group as a single unit.

###Data source

HDInsight uses Azure Blob Storage as the underlying storage for the cluster. Internally, Hadoop and other software on the cluster sees this storage as a Hadoop Distributed File System (HDFS) compatible system. 

When creating a new cluster, you must either create a new Azure Storage Account, or use an existing one. 

####Default storage container

HDInsight will also create a _default storage container_ on the storage account. This is used as the default storage for the HDInsight cluster. 

By default, this container is named the same as the cluster. For more information on how HDInsight works with Azure Blob Storage, see [Use HDFS-compatible Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md).

###Node size

You can select the size of compute resources used by the cluster. For example, if you know that you will be performing operations that need a lot of memory, you may want to select a compute resource with more memory.

When using the Azure preview portal to configure the cluster, the Node size is exposed through the __Node Pricing Tier__ blade, and will also display the cost associated with the different node sizes. For more information on pricing, see [HDInsight pricing details](https://azure.microsoft.com/en-us/pricing/details/hdinsight/).

##<a id="optionalconfiguration"></a>Optional configuration

The following sections describe optional configuration options, as well as scenarios that would require these configurations.

### Use Azure virtual networks

An [Azure Virtual Network](http://azure.microsoft.com/documentation/services/virtual-network/) allows you to create a secure, persistent network containing the resources you need for your solution. A virtual network allows you to:

* Connect cloud resources together in a private network (cloud-only).

	![diagram of cloud-only configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-cloud-only.png)

* Connect your cloud resources to your local data-center network (site-to-site or point-to-site) by using a virtual private network (VPN).

	Site-to-site configuration allows you to connect multiple resources from your data center to the Azure virtual network by using a hardware VPN or the Routing and Remote Access Service.

	![diagram of site-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-site-to-site.png)

	Point-to-site configuration allows you to connect a specific resource to the Azure virtual network by using a software VPN.

	![diagram of point-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-point-to-site.png)

For more information on Virtual Network features, benefits, and capabilities, see the [Azure Virtual Network overview](http://msdn.microsoft.com/library/azure/jj156007.aspx).

> [AZURE.NOTE] You must create the Azure virtual network before creating a cluster. For more information, see [How to create a Virtual Network](virtual-networks-create-vnet.md).
>
> Azure HDInsight only supports location-based Virtual Networks, and does not currently work with Affinity Group-based Virtual Networks. Use Azure PowerShell cmdlet Get-AzureVNetConfig to check whether an existing Azure virtual network is location-based. If your virtual network is not location-based, you have the following options:
>
> - Export the existing Virtual Network configuration and then create a new Virtual Network. All new Virtual Networks are by default, location-based.
> - Migrate to a location-based Virtual Network.  See [Migrate existing services to regional scope](http://azure.microsoft.com/blog/2014/11/26/migrating-existing-services-to-regional-scope/).
>
> It is highly recommended to designate a single subnet for one cluster.
>
> Currently (8/25/2015,) you can only create one Linux-based cluster in an Azure Virtual Network.
>
> You cannot use a v1 (Classic,) Azure Virtual Network with Linux-based HDInsight. The Virtual Network must be v2 (Azure Resource Manager,) in order for it to be listed as an option during the HDInsight cluster creation process in the Azure preview portal, or to be usable when creating a cluster from the Azure CLI or Azure PowerShell.
>
> If you have resources on a v1 network, and you wish to make HDInsight directly accessible to those resources through a virtual network, see [Connecting classic VNets to new VNets](../virtual-network/virtual-networks-arm-asm-s2s.md) for information on how to connect a v2 Virtual Network to a v1 Virtual Network. Once this connection is established, you can create the HDInsight cluster in the v2 Virtual Network.

### Metastore

The metastore contains information about Hive tables, partitions, schemas, columns, etc. This information is used by Hive to locate where data is stored in Hadoop Distributed File System (HDFS), or Azure Blob storage for HDInsight. By default, Hive uses an embedded database to store this information.

By default, Azure will create a metastore for the cluster, however you can specify an external metastore using SQL Database. This allows the metadata information to be preserved when you delete a cluster, as it is stored externally in the database. For instructions on how to create a SQL database in Azure, see [Create your first Azure SQL Database](sql-database-get-started.md).

##<a id="scriptaction"></a>Script action

You can install additional components or customize cluster configuration by using scripts during cluster provisioning. Such scripts are invoked via **Script Action**. For more information, see [Customize HDInsight cluster using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

> [AZURE.IMPORTANT] Adding additional components after a cluster has been created is not supported, as these components will not be available after a cluster node is reimaged. Components installed through script actions are reinstalled as part of the reimaging process.

### Additional storage

In some cases, you may wish to add additional storage to the cluster. For example, if you have multiple Azure Storage Accounts for different geographical regions, or for different services, but want to analyze them all with HDInsight.

For more information on using secondary blob stores, see [Using Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md).

## <a id="options"></a> Options for creating an Linux-based cluster

You can create an Linux-based HDInsight cluster using a web portal, command-line tools, or SDKs. The following table provides information on the different methods available.

| Use this to create a cluster... | Using a web browser... | Using a command-line | Using the REST API | Using an SDK | From Linux, Mac OS X, or Unix | From Windows |
| ------------------------------- |:----------------------:|:--------------------:|:------------------:|:------------:|:-----------------------------:|:------------:|
| [Azure preview portal](hdinsight-hadoop-create-linux-cluster-portal.md) | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure CLI](hdinsight-hadoop-create-linux-cluster-azure-cli.md)         | &nbsp; | ✔     | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure PowerShell](hdinsight-hadoop-create-linux-cluster-azure-powershell.md) | &nbsp; | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔ |
| [cURL](hdinsight-hadoop-create-linux-cluster-curl.md) | &nbsp; | ✔     | ✔ | &nbsp; | ✔      | ✔ |
| [.NET SDK](hdinsight-hadoop-create-linux-cluster-dotnet.md) | &nbsp; | &nbsp; | &nbsp; | ✔ | ✔      | ✔ |










##<a id="nextsteps"></a> Next steps
In this article, you have learned several ways to provision an HDInsight Hadoop cluster on Linux. To learn more, see the following articles:

- [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md): Get to know the nuances of working with an HDInsight cluster on Linux.
- [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md): Learn how to monitor and manage your Linux-based Hadoop on HDInsight cluster by using Ambari Web or the Ambari REST API.
- [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md): Learn about the different ways to run MapReduce jobs on a cluster.
- [Use Hive with HDInsight](hdinsight-use-hive.md): Learn about the different ways of running a Hive query on a cluster.
- [Use Pig with HDInsight](hdinsight-use-pig.md): Learn about the different ways of running a Pig job on a cluster.
- [Use Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md): Learn how HDInsight uses Azure Blob storage to store data for HDInsight clusters.
- [Upload data to HDInsight](hdinsight-upload-data.md): Learn how to work with data stored in an Azure Blob storage for an HDInsight cluster.


[hdinsight-use-mapreduce]: ../hdinsight-use-mapreduce/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-sdk-documentation]: http://msdn.microsoft.com/library/dn479185.aspx


[hdinsight-customize-cluster]: ../hdinsight-hadoop-customize-cluster/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-powershell-reference]: https://msdn.microsoft.com/library/dn858087.aspx

[azure-management-portal]: https://manage.windowsazure.com/

[azure-command-line-tools]: ../xplat-cli/
[azure-create-storageaccount]: ../storage-create-storage-account/

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[hdi-remote]: http://azure.microsoft.com/documentation/articles/hdinsight-administer-use-management-portal/#rdp


[Powershell-install-configure]: ../install-configure-powershell/

[image-hdi-customcreatecluster]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.png
[image-hdi-customcreatecluster-clusteruser]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.ClusterUser.png
[image-hdi-customcreatecluster-storageaccount]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.StorageAccount.png
[image-hdi-customcreatecluster-addonstorage]: ./media/hdinsight-get-started/HDI.CustomCreateCluster.AddOnStorage.png

[azure-preview-portal]: https://portal.azure.com


[image-cli-account-download-import]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.CLIAccountDownloadImport.png
[image-cli-clustercreation]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.CLIClusterCreation.png
[image-cli-clustercreation-config]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.CLIClusterCreationConfig.png
[image-cli-clusterlisting]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.CLIListClusters.png "List and show clusters"

[image-hdi-ps-provision]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.ps.provision.png
[image-hdi-ps-config-provision]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.ps.config.provision.png

[img-hdi-cluster]: ./media/hdinsight-hadoop-provision-linux-clusters/HDI.Cluster.png

  [89e2276a]: /documentation/articles/hdinsight-use-sqoop/ "Use Sqoop with HDInsight"
