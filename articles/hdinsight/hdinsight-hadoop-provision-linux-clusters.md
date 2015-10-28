<<<<<<< HEAD
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
   	ms.date="10/14/2015"
   	ms.author="nitinme"/>


#Create Linux-based clusters in HDInsight

[AZURE.INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

In this document, you will learn about the different ways to create a Linux-based HDInsight cluster on Azure, as well as optional configurations that can be used with your cluster. HDInsight provides Apache Hadoop, Apache Storm, and Apache HBase as services on the Azure cloud platform.

> [AZURE.NOTE] This document provides instructions on the different ways to create a cluster. If you are looking for a quick-start approach to create a cluster, see [Get Started with Azure HDInsight on Linux](../hdinsight-hadoop-linux-get-started.md).

## What is an HDInsight cluster?

A Hadoop cluster consists of several virtual machines (nodes,) which are used for distributed processing of tasks on the cluster. Azure abstracts the implementation details of installation and configuration of individual nodes, so you only have to provide general configuration information.

###Cluster types

There are several types of HDInsight available:

| Cluster type | Use this if you need... |
| ------------ | ----------------------------- |
| Hadoop       | query and analysis (batch jobs)     |
| HBase        | NoSQL data storage            |
| Storm        | Real-time event processing |
| Spark (Windows-only preview) | In-memory processing, interactive queries, micro-batch stream processing |

During configuration, you will select one of these types for the cluster. You can add other technologies such as Hue, Spark, or R to these basic types by using [Script Actions](#scriptaction).

Each cluster type has its own terminology for nodes within the cluster, as well as the number of nodes and the default VM size for each node type:

![HDInsight Hadoop cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Hadoop.roles.png)

Hadoop clusters for HDInsight have two types nodes:

- Head node (2 nodes)
- Data node (at least 1 node)

![HDInsight HBase cluster nodes](./media/hdinsight-provision-clusters/HDInsight.HBase.roles.png)

HBase clusters for HDInsight have three types of nodes:
- Head servers (2 nodes)
- Region servers (at least 1 node)
- Master/Zookeeper nodes (3 nodes)

![HDInsight Storm cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Storm.roles.png)

Storm clusters for HDInsight have three types nodes:
- Nimbus nodes (2 nodes)
- Supervisor servers (at least 1 node)
- Zookeeper nodes (3 nodes)


![HDInsight Spark cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Spark.roles.png)

Spark clusters for HDInsight have three types of nodes:
- Head node (2 nodes)
- Worker node (at least 1 node)
- Zookeeper nodes (3 nodes) (Free for A1 Zookeepers VM size)

###Azure Storage for HDInsight

Each cluster type will also have one or more Azure Storage accounts associated with the cluster. HDInsight uses Azure blobs from these storage accounts as the data store for your cluster. Keeping the data separate from the cluster allows you to delete clusters when they aren't in use, and still preserve your data. You can then use the same storage account for a new cluster if you need to do more analysis. For more information, see [Use Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md).

## <a id="configuration"></a>Basic configuration options

The following sections describe the required configuration options available when creating an HDInsight cluster.

###Cluster name

The cluster name provides a unique identifier for the cluster, and is used as part of the domain name for accessing the cluster over the Internet. For example, a cluster named _mycluster_ will be available over the internet as _mycluster_.azurehdinsight.net.

The cluster name must follow the following guidelines:

- The field must contain a string that is between 3 and 63 characters
- The field can contain only letters, numbers, and hyphens

###Cluster type

Cluster type allows you to select special purpose configurations for the cluster. The following are the types available for Linux-based HDInsight:

| Cluster type | Use this if you need... |
| ------------ | ----------------------------- |
| Hadoop       | query and analysis (batch jobs)     |
| HBase        | NoSQL data storage            |
| Storm        | Real-time event processing |
| Spark (Windows-only preview) | In-memory processing, interactive queries, micro-batch stream processing |

You can add other technologies such as Hue, Spark, or R to these basic types by using [Script Actions](#scriptaction).

###Cluster operating system

You can provision HDInsight clusters on one of the following two operating systems:

- **HDInsight on Windows (Windows Server 2012 R2 Datacenter)**: Select this option if you need to integrate with Windows-based services and technologies that will run on the cluster with Hadoop, or if you are migrating from an existing Windows-based Hadoop distribution.

- **HDInsight on Linux (Ubuntu 12.04 LTS for Linux)**: Select this option if you are familiar with Linux or Unix, migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux. For more information, see [Get started with Hadoop on Linux in HDInsight](hdinsight-hadoop-linux-get-started.md).

> [AZURE.NOTE] Information in this document assumes that you are using a Linux-based HDInsight cluster. For information that is specific to Windows-based clusters, see [Create Windows-based Hadoop clusters in HDInsight](hdinsight-provision-clusters.md).

###Subscription name

If you have multiple Azure subscriptions, use this to select the one you want to use when creating the HDInsight cluster.

###Resource group

Applications are typically made up of many components, for example a web app, database, database server, storage, and 3rd party services. Azure Resource Manager (ARM) enables you to work with the resources in your application as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the resources for your application in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging and production. You can clarify billing for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure Resource Manager Overview](resource-group-overview.md).

###Credentials

There are two types of authentication used with HDInsight clusters:

* __Admin__ or __HTTPs__ user: The admin account for a cluster is primarily used when accessing web or REST services exposed by the cluster. It cannot be used to directly login to the cluster.

* __SSH username__: An SSH user account is used to remotely access the cluster using a [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) client. This is most often used to provide a remote command-line access to the cluster head nodes.

The admin account is secured by a password, and all web communications to the cluster using the admin account should be performed over a secure HTTPS connection.

The SSH user can be authenticated using either a password or a certificate. Certificate authentication is the most secure option, however it requires the creation and maintenance of a public and private certificate pair.

For more information on using SSH with HDInsight, including how to create and use SSH keys, see one of the following articles:

* [For Linux, Unix, or Mac OS X clients - using SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
* [For Windows clients - using SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-windows.md)

###Data source

HDInsight uses Azure Blob Storage as the underlying storage for the cluster. Internally, Hadoop and other software on the cluster sees this storage as a Hadoop Distributed File System (HDFS) compatible system. 

When creating a new cluster, you must either create a new Azure Storage Account, or use an existing one.

> [AZURE.IMPORTANT] The geographic location you select for the storage account will determine the location of the HDInsight cluster, as the cluster must be in the same data center as the default storage account. 
>
> For a list of supported regions, click the **Region** drop-down list on [HDInsight pricing](https://go.microsoft.com/fwLink/?LinkID=282635&clcid=0x409).

####Default storage container

HDInsight will also create a _default storage container_ on the storage account. This is the default storage for the HDInsight cluster. 

By default, this container has the same name as the cluster. For more information on how HDInsight works with Azure Blob Storage, see [Use HDFS-compatible Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md).

>[AZURE.WARNING] Don't share one container for multiple clusters. This is not supported.

###Node size

You can select the size of compute resources used by the cluster. For example, if you know that you will be performing operations that need a lot of memory, you may want to select a compute resource with more memory.

> [AZURE.NOTE] Different cluster types have different node types, number of nodes, and node sizes. For example, a Hadoop cluster type has two _head nodes_ and a default of four _data nodes_, while a Storm cluster type has two _nimbus nodes_, three _zookeeper nodes_, and a default of four _supervisor nodes_.

When using the Azure preview portal to configure the cluster, the Node size is exposed through the __Node Pricing Tier__ blade, and will also display the cost associated with the different node sizes. 

> [AZURE.IMPORTANT] Billing starts once a cluster is created, and only stops when the cluster is deleted. For more information on pricing, see [HDInsight pricing details](https://azure.microsoft.com/en-us/pricing/details/hdinsight/).

##<a id="optionalconfiguration"></a>Optional configuration

The following sections describe optional configuration options, as well as scenarios that would require these configurations.

### HDInsight version

Use this to determine the version of HDInsight used for this cluster. For more information, see [Hadoop cluster versions and components in HDInsight](https://go.microsoft.com/fwLink/?LinkID=320896&clcid=0x409)

### Use Azure virtual networks

An [Azure Virtual Network](http://azure.microsoft.com/documentation/services/virtual-network/) allows you to create a secure, persistent network containing the resources you need for your solution. A virtual network allows you to:

* Connect cloud resources together in a private network (cloud-only).

	![diagram of cloud-only configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-cloud-only.png)

* Connect your cloud resources to your local data-center network (site-to-site or point-to-site) by using a virtual private network (VPN).

    | Site-to-site configuration | Point-to-site configuration |
    | -------------------------- | --------------------------- |
    | Site-to-site configuration allows you to connect multiple resources from your data center to the Azure virtual network by using a hardware VPN or the Routing and Remote Access Service.<br />![diagram of site-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-site-to-site.png) | Point-to-site configuration allows you to connect a specific resource to the Azure virtual network by using a software VPN.<br />![diagram of point-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-point-to-site.png) |

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

The metastore contains Hive and Oozie metadata, such as information about Hive tables, partitions, schemas, and columns. Using the metastore helps you retain your Hive and Oozie metadata, so that you don't have to re-create Hive tables or Oozie jobs when you create a new cluster.

Using the Metastore configuration option allows you to specify an external metastore using SQL Database. This allows the metadata information to be preserved when you delete a cluster, as it is stored externally in the database. For instructions on how to create a SQL database in Azure, see [Create your first Azure SQL Database](sql-database-get-started.md).

###<a id="scriptaction"></a>Script action

You can install additional components or customize cluster configuration by using scripts during cluster provisioning. Such scripts are invoked via **Script Action**. For more information, see [Customize HDInsight cluster using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

> [AZURE.IMPORTANT] Adding additional components after a cluster has been created is not supported, as these components will not be available after a cluster node is reimaged. Components installed through script actions are reinstalled as part of the reimaging process.

### Additional storage

In some cases, you may wish to add additional storage to the cluster. For example, if you have multiple Azure Storage Accounts for different geographical regions, or for different services, but want to analyze them all with HDInsight.

For more information on using secondary blob stores, see [Using Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md).

##<a id="nextsteps"></a><a id="options"></a> Creation methods

In this article, you have learned basic information about creating a Linux-based HDInsight cluster. Use the table below to find specific information on how to create a cluster using a method that best suits your needs:

| Use this to create a cluster... | Using a web browser... | Using a command-line | Using the REST API | Using an SDK | From Linux, Mac OS X, or Unix | From Windows |
| ------------------------------- |:----------------------:|:--------------------:|:------------------:|:------------:|:-----------------------------:|:------------:|
| [Azure preview portal](hdinsight-hadoop-create-linux-clusters-portal.md) | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md)         | &nbsp; | ✔     | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md) | &nbsp; | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔ |
| [cURL](hdinsight-hadoop-create-linux-clusters-curl.md) | &nbsp; | ✔     | ✔ | &nbsp; | ✔      | ✔ |
| [.NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet.md) | &nbsp; | &nbsp; | &nbsp; | ✔ | ✔      | ✔ |



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
=======
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
   	ms.date="10/23/2015"
   	ms.author="nitinme"/>


#Create Linux-based clusters in HDInsight

[AZURE.INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

In this document, you will learn about the different ways to create a Linux-based HDInsight cluster on Azure, as well as optional configurations that can be used with your cluster. HDInsight provides Apache Hadoop, Apache Storm, and Apache HBase as services on the Azure cloud platform.

> [AZURE.NOTE] This document provides instructions on the different ways to create a cluster. If you are looking for a quick-start approach to create a cluster, see [Get Started with Azure HDInsight on Linux](../hdinsight-hadoop-linux-get-started.md).

## What is an HDInsight cluster?

A Hadoop cluster consists of several virtual machines (nodes,) which are used for distributed processing of tasks on the cluster. Azure abstracts the implementation details of installation and configuration of individual nodes, so you only have to provide general configuration information.

###Cluster types

There are several types of HDInsight available:

| Cluster type | Use this if you need... |
| ------------ | ----------------------------- |
| Hadoop       | query and analysis (batch jobs)     |
| HBase        | NoSQL data storage            |
| Storm        | Real-time event processing |
| Spark (Windows-only preview) | In-memory processing, interactive queries, micro-batch stream processing |

During configuration, you will select one of these types for the cluster. You can add other technologies such as Hue, Spark, or R to these basic types by using [Script Actions](#scriptaction).

Each cluster type has its own terminology for nodes within the cluster, as well as the number of nodes and the default VM size for each node type:

> [AZURE.IMPORTANT] If you plan on more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, then you must select a head node size with at least 8 cores and 14GB ram.

![HDInsight Hadoop cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Hadoop.roles.png)

Hadoop clusters for HDInsight have two types nodes:

- Head node (2 nodes)
- Data node (at least 1 node)

![HDInsight HBase cluster nodes](./media/hdinsight-provision-clusters/HDInsight.HBase.roles.png)

HBase clusters for HDInsight have three types of nodes:
- Head servers (2 nodes)
- Region servers (at least 1 node)
- Master/Zookeeper nodes (3 nodes)

![HDInsight Storm cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Storm.roles.png)

Storm clusters for HDInsight have three types nodes:
- Nimbus nodes (2 nodes)
- Supervisor servers (at least 1 node)
- Zookeeper nodes (3 nodes)


![HDInsight Spark cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Spark.roles.png)

Spark clusters for HDInsight have three types of nodes:
- Head node (2 nodes)
- Worker node (at least 1 node)
- Zookeeper nodes (3 nodes) (Free for A1 Zookeepers VM size)

###Azure Storage for HDInsight

Each cluster type will also have one or more Azure Storage accounts associated with the cluster. HDInsight uses Azure blobs from these storage accounts as the data store for your cluster. Keeping the data separate from the cluster allows you to delete clusters when they aren't in use, and still preserve your data. You can then use the same storage account for a new cluster if you need to do more analysis. For more information, see [Use Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md).

## <a id="configuration"></a>Basic configuration options

The following sections describe the required configuration options available when creating an HDInsight cluster.

###Cluster name

The cluster name provides a unique identifier for the cluster, and is used as part of the domain name for accessing the cluster over the Internet. For example, a cluster named _mycluster_ will be available over the internet as _mycluster_.azurehdinsight.net.

The cluster name must follow the following guidelines:

- The field must contain a string that is between 3 and 63 characters
- The field can contain only letters, numbers, and hyphens

###Cluster type

Cluster type allows you to select special purpose configurations for the cluster. The following are the types available for Linux-based HDInsight:

| Cluster type | Use this if you need... |
| ------------ | ----------------------------- |
| Hadoop       | query and analysis (batch jobs)     |
| HBase        | NoSQL data storage            |
| Storm        | Real-time event processing |
| Spark (Windows-only preview) | In-memory processing, interactive queries, micro-batch stream processing |

You can add other technologies such as Hue, Spark, or R to these basic types by using [Script Actions](#scriptaction).

###Cluster operating system

You can provision HDInsight clusters on one of the following two operating systems:

- **HDInsight on Windows (Windows Server 2012 R2 Datacenter)**: Select this option if you need to integrate with Windows-based services and technologies that will run on the cluster with Hadoop, or if you are migrating from an existing Windows-based Hadoop distribution.

- **HDInsight on Linux (Ubuntu 12.04 LTS for Linux)**: Select this option if you are familiar with Linux or Unix, migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux. For more information, see [Get started with Hadoop on Linux in HDInsight](hdinsight-hadoop-linux-get-started.md).

> [AZURE.NOTE] Information in this document assumes that you are using a Linux-based HDInsight cluster. For information that is specific to Windows-based clusters, see [Create Windows-based Hadoop clusters in HDInsight](hdinsight-provision-clusters.md).

###Subscription name

If you have multiple Azure subscriptions, use this to select the one you want to use when creating the HDInsight cluster.

###Resource group

Applications are typically made up of many components, for example a web app, database, database server, storage, and 3rd party services. Azure Resource Manager (ARM) enables you to work with the resources in your application as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the resources for your application in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging and production. You can clarify billing for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure Resource Manager Overview](resource-group-overview.md).

###Credentials

There are two types of authentication used with HDInsight clusters:

* __Admin__ or __HTTPs__ user: The admin account for a cluster is primarily used when accessing web or REST services exposed by the cluster. It cannot be used to directly login to the cluster.

* __SSH username__: An SSH user account is used to remotely access the cluster using a [Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell) client. This is most often used to provide a remote command-line access to the cluster head nodes.

The admin account is secured by a password, and all web communications to the cluster using the admin account should be performed over a secure HTTPS connection.

The SSH user can be authenticated using either a password or a certificate. Certificate authentication is the most secure option, however it requires the creation and maintenance of a public and private certificate pair.

For more information on using SSH with HDInsight, including how to create and use SSH keys, see one of the following articles:

* [For Linux, Unix, or Mac OS X clients - using SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
* [For Windows clients - using SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-windows.md)

###Data source

HDInsight uses Azure Blob Storage as the underlying storage for the cluster. Internally, Hadoop and other software on the cluster sees this storage as a Hadoop Distributed File System (HDFS) compatible system. 

When creating a new cluster, you must either create a new Azure Storage Account, or use an existing one.

> [AZURE.IMPORTANT] The geographic location you select for the storage account will determine the location of the HDInsight cluster, as the cluster must be in the same data center as the default storage account. 
>
> For a list of supported regions, click the **Region** drop-down list on [HDInsight pricing](https://go.microsoft.com/fwLink/?LinkID=282635&clcid=0x409).

####Default storage container

HDInsight will also create a _default storage container_ on the storage account. This is the default storage for the HDInsight cluster. 

By default, this container has the same name as the cluster. For more information on how HDInsight works with Azure Blob Storage, see [Use HDFS-compatible Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md).

>[AZURE.WARNING] Don't share one container for multiple clusters. This is not supported.

###Node size

You can select the size of compute resources used by the cluster. For example, if you know that you will be performing operations that need a lot of memory, you may want to select a compute resource with more memory.

Different cluster types have different node types, number of nodes, and node sizes. For example, a Hadoop cluster type has two _head nodes_ and a default of four _data nodes_, while a Storm cluster type has two _nimbus nodes_, three _zookeeper nodes_, and a default of four _supervisor nodes_.

> [AZURE.IMPORTANT] If you plan on more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, then you must select a head node size with at least 8 cores and 14GB ram.

When using the Azure preview portal to configure the cluster, the Node size is available through the __Node Pricing Tier__ blade, and will also display the cost associated with the different node sizes. 

> [AZURE.IMPORTANT] Billing starts once a cluster is created, and only stops when the cluster is deleted. For more information on pricing, see [HDInsight pricing details](https://azure.microsoft.com/pricing/details/hdinsight/).

##<a id="optionalconfiguration"></a>Optional configuration

The following sections describe optional configuration options, as well as scenarios that would require these configurations.

### HDInsight version

Use this to determine the version of HDInsight used for this cluster. For more information, see [Hadoop cluster versions and components in HDInsight](https://go.microsoft.com/fwLink/?LinkID=320896&clcid=0x409)

### Use Azure virtual networks

An [Azure Virtual Network](http://azure.microsoft.com/documentation/services/virtual-network/) allows you to create a secure, persistent network containing the resources you need for your solution. A virtual network allows you to:

* Connect cloud resources together in a private network (cloud-only).

	![diagram of cloud-only configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-cloud-only.png)

* Connect your cloud resources to your local data-center network (site-to-site or point-to-site) by using a virtual private network (VPN).

    | Site-to-site configuration | Point-to-site configuration |
    | -------------------------- | --------------------------- |
    | Site-to-site configuration allows you to connect multiple resources from your data center to the Azure virtual network by using a hardware VPN or the Routing and Remote Access Service.<br />![diagram of site-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-site-to-site.png) | Point-to-site configuration allows you to connect a specific resource to the Azure virtual network by using a software VPN.<br />![diagram of point-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-point-to-site.png) |

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

The metastore contains Hive and Oozie metadata, such as information about Hive tables, partitions, schemas, and columns. Using the metastore helps you retain your Hive and Oozie metadata, so that you don't have to re-create Hive tables or Oozie jobs when you create a new cluster.

Using the Metastore configuration option allows you to specify an external metastore using SQL Database. This allows the metadata information to be preserved when you delete a cluster, as it is stored externally in the database. For instructions on how to create a SQL database in Azure, see [Create your first Azure SQL Database](sql-database-get-started.md).

###<a id="scriptaction"></a>Script action

You can install additional components or customize cluster configuration by using scripts during cluster provisioning. Such scripts are invoked via **Script Action**. For more information, see [Customize HDInsight cluster using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

> [AZURE.IMPORTANT] Adding additional components after a cluster has been created is not supported, as these components will not be available after a cluster node is reimaged. Components installed through script actions are reinstalled as part of the reimaging process.

### Additional storage

In some cases, you may wish to add additional storage to the cluster. For example, if you have multiple Azure Storage Accounts for different geographical regions, or for different services, but want to analyze them all with HDInsight.

For more information on using secondary blob stores, see [Using Azure Blob storage with HDInsight](../hdinsight-use-blob-storage.md).

##<a id="nextsteps"></a><a id="options"></a> Creation methods

In this article, you have learned basic information about creating a Linux-based HDInsight cluster. Use the table below to find specific information on how to create a cluster using a method that best suits your needs:

| Use this to create a cluster... | Using a web browser... | Using a command-line | Using the REST API | Using an SDK | From Linux, Mac OS X, or Unix | From Windows |
| ------------------------------- |:----------------------:|:--------------------:|:------------------:|:------------:|:-----------------------------:|:------------:|
| [Azure preview portal](hdinsight-hadoop-create-linux-clusters-portal.md) | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md)         | &nbsp; | ✔     | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md) | &nbsp; | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔ |
| [cURL](hdinsight-hadoop-create-linux-clusters-curl.md) | &nbsp; | ✔     | ✔ | &nbsp; | ✔      | ✔ |
| [.NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet.md) | &nbsp; | &nbsp; | &nbsp; | ✔ | ✔      | ✔ |



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
>>>>>>> 067bd7eaa43f7196fdba51ba420d8019d435eeac
