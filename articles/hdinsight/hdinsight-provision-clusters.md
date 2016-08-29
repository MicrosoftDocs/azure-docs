<properties
   pageTitle="Create Windows-based Hadoop clusters in HDInsight | Microsoft Azure"
   	description="Learn how to create clusters for Azure HDInsight."
   services="hdinsight"
   documentationCenter=""
   tags="azure-portal"
   authors="mumian"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/08/2016"
   ms.author="jgao"/>

# Create Windows-based Hadoop clusters in HDInsight

[AZURE.INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]

A Hadoop cluster consists of several virtual machines (nodes) that are used for distributed processing of tasks on the cluster. Azure abstracts the implementation details of installation and configuration of individual nodes, so you have to provide general configuration information. In this article, you will learn these configuration settings.

>[AZURE.NOTE] The information in this document is specific to Windows-based Azure HDInsight clusters. For information about Linux-based clusters, see [Create Linux-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

## Cluster types##

Currently, HDInsight provides four different types of clusters, each with a set of components to provide certain functionalities.

| Cluster type | Functionality |
| ------------ | ----------------------------- |
| Hadoop       | Query and analysis (batch jobs)     |
| HBase        | NoSQL data storage            |
| Storm        | Real-time event processing |
| Spark (Preview) | In-memory processing, interactive queries, micro-batch stream processing |

Each cluster type has its own number of nodes, terminology for nodes within the cluster, and default VM size for each node type. In the following table, the number of nodes for each node type is in parentheses.

| Type| Nodes (number of nodes)| Diagram|
|-----|------|--------|
|Hadoop| Head node (2), data node (1+)|![HDInsight Hadoop cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Hadoop.roles.png)|
|HBase|Head server (2), region server (1+), master/ZooKeeper node (3)|![HDInsight HBase cluster nodes](./media/hdinsight-provision-clusters/HDInsight.HBase.roles.png)|
|Storm|Nimbus node (2), supervisor server (1+), ZooKeeper node (3)|![HDInsight Storm cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Storm.roles.png)|
|Spark|Head node (2), worker node (1+), ZooKeeper node (3) (free for A1 ZooKeeper VM size)|![HDInsight Spark cluster nodes](./media/hdinsight-provision-clusters/HDInsight.Spark.roles.png)|

> [AZURE.IMPORTANT] If you plan on having more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, then you must select a head node size with at least 8 cores and 14 GB of RAM.

You can add other components such as Hue or R to these basic types by using [Script Actions](#customize-clusters-using-script-action).

## Basic configuration options

The following are the basic configuration options required for creating an HDInsight cluster.

### Cluster name###

Cluster name is used to identify a cluster. Cluster name must be globally unique, and it must follow these naming guidelines:

- The field must be a string that contains between 3 and 63 characters
- The field can contain only letters, numbers, and hyphens.

### Cluster type ###

See [Cluster types](#cluster-types).

### Operating system ###

You can create HDInsight clusters on one of the following two operating systems:

- HDInsight on Linux. HDInsight provides the option of configuring Linux clusters on Azure. Configure a Linux cluster if you are familiar with Linux or Unix, are migrating from an existing Linux-based Hadoop solution, or want easy integration with Hadoop ecosystem components built for Linux. For more information, see [Get started with Hadoop on Linux in HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).

- HDInsight on Windows (Windows Server 2012 R2 Datacenter).

### HDInsight version###

HDInsight version is used to determine the version of HDInsight to use for this cluster. For more information, see [Hadoop cluster versions and components in HDInsight](https://go.microsoft.com/fwLink/?LinkID=320896&clcid=0x409).

### Subscription name###

Each HDInsight cluster is tied to one Azure subscription.

### Resource group name###

With [Azure Resource Manager](../resource-group-overview.md), you can deploy, update, monitor, or delete the resources for your application.

### Credentials

With the HDInsight clusters, you can configure three user accounts during cluster creation.

- [Azure Resource Manager](../resource-group-overview.md) helps you work with the resources in your application as a group, referred to as an Azure resource group. You can deploy, update, monitor, or delete all of the resources for your application in a single, coordinated operation.

- HTTP user. The default user name is *admin* in the basic configuration on the Azure portal. Sometimes the default is called "Cluster user."
- RDP user (Windows clusters). Connect to the cluster by using RDP. When you create the account, you must set an expiration date within 90 days of the day you create the account.
- SSH user (Linux clusters). Connect to the cluster by using SSH. You can create additional SSH user accounts after the cluster is created by following the steps in [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md).

### Data source ###

The original Hadoop distributed file system (HDFS) uses many local disks on the cluster. HDInsight uses Azure Blob storage for data storage. Azure Blob storage is a robust, general-purpose storage solution that integrates seamlessly with HDInsight. Through an HDFS interface, the full set of components in HDInsight can operate directly on structured or unstructured data in Blob storage. If you store data in Blob storage, you can safely delete the HDInsight clusters that are used for computation without losing user data.

During configuration, you must specify an Azure storage account and an Azure Blob storage container on the Azure storage account. Some creation processes require the Azure storage account and the Blob storage container to be created beforehand. The Blob storage container is used as the default storage location by the cluster. Optionally, you can specify additional Azure storage accounts (linked storage) that will be accessible by the cluster. The cluster can also access any Blob storage containers that are configured with full public read access, or public read access for blobs only.  For more information, see [Manage Access to Azure Storage Resources](../storage/storage-manage-access-to-resources.md).

![HDInsight storage](./media/hdinsight-provision-clusters/HDInsight.storage.png)

>[AZURE.NOTE] A Blob storage container provides a grouping of a set of blobs as shown in the following image.

During configuration, you must specify an Azure storage account and an Azure Blob storage container on the Azure storage account. Some creation processes require the Azure storage account and the Blob storage container to be created beforehand. The Blob storage container is used as the default storage location by the cluster. Optionally, you can specify additional Azure storage accounts (linked storage) that the cluster can access. The cluster can also access any Blob containers that are configured with full public read access or public read access for blobs only. For more information, see [Manage Access to Azure Storage Resources](../storage/storage-manage-access-to-resources.md).


![Azure Blob Storage](./media/hdinsight-provision-clusters/Azure.blob.storage.jpg)

We do not recommend the default Blob storage container for storing business data. Deleting the default Blob storage container after each use to reduce storage cost is a good practice. The default container contains application and system logs. Make sure to retrieve the logs before deleting the container.

>[AZURE.WARNING] HDInsight does not support sharing one Blob storage container for multiple clusters.

For more information about secondary Blob storage, see [HDFS-compatible Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md).

In addition to Azure Blob storage, you can also use [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md) as a default storage account for an HBase cluster in HDInsight and as linked storage for all four HDInsight cluster types. For more information, see [Create an HDInsight cluster with Data Lake Store using Azure portal](../data-lake-store/data-lake-store-hdinsight-hadoop-use-portal.md).

### Location (region)###

The HDInsight cluster and its default storage account must be located at the same Azure location.

![Azure regions](./media/hdinsight-provision-clusters/Azure.regions.png)

For a list of supported regions, click the **Region** drop-down list on [HDInsight pricing](https://go.microsoft.com/fwLink/?LinkID=282635&clcid=0x409).

### Node pricing tiers###

Customers are billed for the usage of those nodes for the duration of the cluster’s life. Billing starts when a cluster is created and stops when the cluster is deleted. Clusters can’t be de-allocated or put on hold.

Different cluster types have different node types, numbers of nodes, and node sizes. For example, a Hadoop cluster type has two _head nodes_ and a default of four _data nodes_, while a Storm cluster type has two _nimbus nodes_, three _ZooKeeper nodes_, and a default of four _supervisor nodes_. The cost of HDInsight clusters is determined by the number of nodes and the virtual machine sizes for the nodes. For example, if you know that you will be performing operations that need a lot of memory, you may want to select a compute resource with more memory. For learning purposes, we recommend working with one data node. For more information about HDInsight pricing, see [HDInsight pricing](https://go.microsoft.com/fwLink/?LinkID=282635&clcid=0x409).

>[AZURE.NOTE] The cluster size limit varies among Azure subscriptions. Contact billing support to increase the limit.

>The nodes used by your cluster do not count as virtual machines because the virtual machine images used for the nodes are an implementation detail of the HDInsight service. However, the compute cores used by the nodes do count against the total number of compute cores available to your subscription. You can see the available cores and the number of cores the cluster will use in the summary section of the Node Pricing Tiers blade when creating an HDInsight cluster.

When you configure the cluster with the Azure portal, the node size is available through the __Node Pricing Tier__ blade. You can also see the cost associated with the different node sizes. The following screenshot shows the choices for a Linux-based Hadoop cluster.

![HDInsight vm node sizes](./media/hdinsight-provision-clusters/hdinsight.node.sizes.png)

The following tables show the sizes supported by HDInsight clusters and the capacities they provide.

### Standard tier: A-series###

In the classic deployment model, some VM sizes are slightly different in PowerShell and CLI.

* Standard_A3 is Large
* Standard_A4 is ExtraLarge

|Size |CPU cores|Memory|NICs (max.)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)|
|---|---|---|---|---|---|---|
|Standard_A3\Large|4|7 GB|2|Temporary = 285 GB |8|8x500|
|Standard_A4\ExtraLarge|8|14 GB|4|Temporary = 605 GB |16|16x500|
|Standard_A6|4|28 GB|2|Temporary = 285 GB |8|8x500|
|Standard_A7|8|56 GB|4|Temporary = 605 GB |16|16x500|


### Standard tier: D-series###

|Size |CPU cores|Memory|NICs (max.)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)|
|---|---|---|---|---|---|---|
|Standard_D3 |4|14 GB|4|Temporary (SSD) =200 GB |8|8x500|
|Standard_D4 |8|28 GB|8|Temporary (SSD) =400 GB |16|16x500|
|Standard_D12 |4|28 GB|4|Temporary (SSD) =200 GB |8|8x500|
|Standard_D13 |8|56 GB|8|Temporary (SSD) =400 GB |16|16x500|
|Standard_D14 |16|112 GB|8|Temporary (SSD) =800 GB |32|32x500|


### Standard tier: Dv2-series###

|Size |CPU cores|Memory|NICs (max.)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)|
|---|---|---|---|---|---|---|
|Standard_D3_v2 |4|14 GB|4|Temporary (SSD) =200 GB |8|8x500|
|Standard_D4_v2 |8|28 GB|8|Temporary (SSD) =400 GB |16|16x500|
|Standard_D12_v2 |4|28 GB|4|Temporary (SSD) =200 GB |8|8x500|
|Standard_D13_v2 |8|56 GB|8|Temporary (SSD) =400 GB |16|16x500|
|Standard_D14_v2 |16|112 GB|8|Temporary (SSD) =800 GB |32|32x500|     

For deployment considerations to be aware of when you're planning to use these resources, see [Sizes for virtual machines](../virtual-machines/virtual-machines-windows-sizes.md). For information about pricing of various sizes, see [HDInsight Pricing](https://azure.microsoft.com/pricing/details/hdinsight).   

> [AZURE.IMPORTANT] If you plan on having more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, you must select a head node size with at least 8 cores and 14 GB of RAM.

Billing starts when a cluster is created and stops when the cluster is deleted. For more information about pricing, see [HDInsight pricing details](https://azure.microsoft.com/pricing/details/hdinsight/).


|Size |CPU cores|Memory|NICs (max.)|Max. disk size|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)|
|---|---|---|---|---|---|---|
|Standard_D3_v2 |4|14 GB|4|Temporary (SSD) =200 GB |8|8x500|
|Standard_D4_v2 |8|28 GB|8|Temporary (SSD) =400 GB |16|16x500|
|Standard_D12_v2 |4|28 GB|4|Temporary (SSD) =200 GB |8|8x500|
|Standard_D13_v2 |8|56 GB|8|Temporary (SSD) =400 GB |16|16x500|
|Standard_D14_v2 |16|112 GB|8|Temporary (SSD) =800 GB |32|32x500|    

For deployment considerations to be aware of when you're planning to use these resources, see [Sizes for virtual machines](../virtual-machines/virtual-machines-windows-sizes.md). For information about pricing of the various sizes, see [HDInsight Pricing](https://azure.microsoft.com/pricing/details/hdinsight).  

> [AZURE.IMPORTANT] If you plan on having more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, then you must select a head node size with at least 8 cores and 14 GB of RAM.

 Billing starts when a cluster is created and stops when the cluster is deleted. For more information on pricing, see [HDInsight pricing details](https://azure.microsoft.com/pricing/details/hdinsight/).


## Add more storage

In some cases, you may want to add more storage to the cluster. For example, you might have multiple Azure storage accounts for different geographical regions or for different services, but you want to analyze them all with HDInsight.

For more information about secondary Blob storage, see [Use HDFS-compatible Azure Blob storage with Hadoop in HDInsight](hdinsight-hadoop-use-blob-storage.md). For more information about secondary Data Lake stores, see [Create HDInsight clusters with Data Lake Store using the Azure portal](../data-lake-store/data-lake-store-hdinsight-hadoop-use-portal.md).


## Use a Hive/Oozie metastore

We strongly recommend that you use a custom metastore if you want to keep your Hive tables after you delete your HDInsight cluster for purposes of attaching that metastore to another HDInsight cluster in the future.

> [AZURE.IMPORTANT] HDInsight metastore is not backward compatible. For example, you cannot use a metastore of an HDInsight 3.3 cluster to create an HDInsight 3.2 cluster.

The metastore contains Hive and Oozie metadata, such as Hive tables, partitions, schemas, and columns. The metastore helps you to retain your Hive and Oozie metadata. You don't need to re-create Hive tables or Oozie jobs when you create a new cluster. By default, Hive uses an embedded Azure SQL database to store this information. The embedded database can't preserve the metadata when the cluster is deleted. For example, if you create Hive tables in a cluster created with a Hive metastore, you can see those tables if you delete and re-create the cluster with the same Hive metastore.

Metastore configuration is not available for HBase cluster types.

> [AZURE.IMPORTANT] When you're creating a custom metastore, do not use a database name that contains dashes or hyphens because this can cause the cluster creation process to fail.

## Use Azure Virtual Network

[Azure Virtual Network](https://azure.microsoft.com/documentation/services/virtual-network/) helps you create a secure, persistent network that contains the resources you need for your solution. With a virtual network, you can:

* Connect cloud resources together in a private network (cloud-only).

	![diagram of cloud-only configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-cloud-only.png)

* Connect your cloud resources to your local datacenter network (site-to-site or point-to-site) by using a virtual private network (VPN).

| Site-to-site configuration | Point-to-site configuration |
| -------------------------- | --------------------------- |
| With site-to-site configuration, you can connect to multiple resources from your datacenter to Azure Virtual Network by using a hardware VPN or the Routing and Remote Access Service.<br />![diagram of site-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-site-to-site.png) | With point-to-site configuration, you can connect a specific resource to Azure Virtual Network by using a software VPN.<br />![diagram of point-to-site configuration](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-vnet-point-to-site.png) |

Windows-based clusters require a classic virtual network, while Linux-based clusters require an Azure Resource Manager virtual network. If you do not have the correct type of network, it will not be usable when you create the cluster.

For more information about how HDInsight works with a virtual network, including specific configuration requirements for the virtual network, see [Extend HDInsight capabilities by using Azure Virtual Network](hdinsight-extend-hadoop-virtual-network.md).

## Customize clusters by using HDInsight cluster customization (bootstrap)

Sometimes, you want to configure the following configuration files:

- clusterIdentity.xml
- core-site.xml
- gateway.xml
- hbase-env.xml
- hbase-site.xml
- hdfs-site.xml
- hive-env.xml
- hive-site.xml
- mapred-site
- oozie-site.xml
- oozie-env.xml
- storm-site.xml
- tez-site.xml
- webhcat-site.xml
- yarn-site.xml

To keep the changes through the clusters' lifetime, you can use HDInsight cluster customization during the creation process. You can also use Ambari in Linux-based clusters. For more information, see [Customize HDInsight clusters by using Bootstrap](hdinsight-hadoop-customize-cluster-bootstrap.md).

>[AZURE.NOTE] The Windows-based clusters can't retain the changes due to reimage. For more information,
see [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx). To keep the changes throughout the lifetime of a cluster, you must use HDInsight cluster customization during the creation process.

## Customize clusters by using Script Action

You can install additional components or customize cluster configuration by using scripts during creation. Such scripts are invoked via **Script Action**, which is a configuration option that can be used from the Azure portal, HDInsight Windows PowerShell cmdlets, or the HDInsight .NET SDK. For more information, see [Customize a HDInsight cluster by using Script Action](hdinsight-hadoop-customize-cluster.md).



## Cluster creation methods

In this article, you have learned basic information about creating a Windows-based HDInsight cluster. Use the following table to find specific information about how to create a cluster by using a method that best suits your needs.

| Clusters created with | Web browser | Command line | REST API | SDK | Linux, Mac OS X, or Unix | Windows |
| ------------------------------- |:----------------------:|:--------------------:|:------------------:|:------------:|:-----------------------------:|:------------:|
| [The Azure portal](hdinsight-hadoop-create-windows-clusters-portal.md) | ✔     | &nbsp; | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure CLI](hdinsight-hadoop-create-windows-clusters-cli.md)         | &nbsp; | ✔     | &nbsp; | &nbsp; | ✔      | ✔ |
| [Azure PowerShell](hdinsight-hadoop-create-windows-clusters-powershell.md) | &nbsp; | ✔     | &nbsp; | &nbsp; | ✔ | ✔ |
| [cURL](hdinsight-hadoop-create-linux-clusters-curl-rest.md) | &nbsp; | ✔     | ✔ | &nbsp; | ✔      | ✔ |
| [.NET SDK](hdinsight-hadoop-create-windows-clusters-dotnet-sdk.md) | &nbsp; | &nbsp; | &nbsp; | ✔ | ✔      | ✔ |
| [Azure Resource Manager templates](hdinsight-hadoop-create-windows-clusters-arm-templates.md) | &nbsp; | ✔     | &nbsp; | &nbsp; | ✔      | ✔ |