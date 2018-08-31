---
title: Cluster setup for Hadoop, Spark, Kafka, HBase, or R Server - Azure HDInsight
description: Set up Hadoop, Kafka, Spark, HBase, R Server, or Storm clusters for HDInsight from a browser, the Azure classic CLI, Azure PowerShell, REST, or SDK.
keywords: hadoop cluster setup, kafka cluster setup, spark cluster setup, what is cluster in hadoop
services: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 08/27/2018
---
# Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more

[!INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

Learn how to set up and configure clusters in HDInsight with Hadoop, Spark, Kafka, Interactive Query, HBase, ML Services, or Storm. Also, learn how to customize clusters and add security by joining them to a domain.

A Hadoop cluster consists of several virtual machines (nodes) that are used for distributed processing of tasks. Azure HDInsight handles implementation details of installation and configuration of individual nodes, so you only have to provide general configuration information. 

> [!IMPORTANT]
>HDInsight cluster billing starts once a cluster is created and stops when the cluster is deleted. Billing is pro-rated per minute, so you should always delete your cluster when it is no longer in use. Learn how to [delete a cluster.](hdinsight-delete-cluster.md)
>

## Cluster setup methods
The following table shows the different methods you can use to set up an HDInsight cluster.

| Clusters created with | Web browser | Command line | REST API | SDK | 
| --- |:---:|:---:|:---:|:---:|
| [Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md) |✔ |&nbsp; |&nbsp; |&nbsp; |
| [Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md) |✔ |✔ |✔ |✔ |
| [Azure Classic CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md) |&nbsp; |✔ |&nbsp; |&nbsp; |
| [Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md) |&nbsp; |✔ |&nbsp; |&nbsp; |
| [cURL](hdinsight-hadoop-create-linux-clusters-curl-rest.md) |&nbsp; |✔ |✔ |&nbsp; |
| [.NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md) |&nbsp; |&nbsp; |&nbsp; |✔ |
| [Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md) |&nbsp; |✔ |&nbsp; |&nbsp; |

## Quick create: Basic cluster setup
This article walks you through setup in the [Azure portal](https://portal.azure.com), where you can create an HDInsight cluster using *Quick create* or *Custom*. 

![hdinsight create options custom quick create](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-creation-options.png)

Follow instructions on the screen to do a basic cluster setup. Details are provided below for:

* [Resource group name](#resource-group-name)
* [Cluster types and configuration](#cluster-types) 
* [Cluster login and SSH username](#cluster-login-and-ssh-username)
* [Location](#location)

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight 3.3 retirement](hdinsight-component-versioning.md#hdinsight-windows-retirement).
>

## Resource group name 

[Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) helps you work with the resources in your application as a group, referred to as an Azure resource group. You can deploy, update, monitor, or delete all the resources for your application in a single coordinated operation.

## <a name="cluster-types"></a> Cluster types and configuration
Azure HDInsight currently provides the following cluster types, each with a set of components to provide certain functionalities.

> [!IMPORTANT]
> HDInsight clusters are available in various types, each for a single workload or technology. There is no supported method to create a cluster that combines multiple types, such as Storm and HBase on one cluster. If your solution requires technologies that are spread across multiple HDInsight cluster types, an [Azure virtual network](https://docs.microsoft.com/azure/virtual-network) can connect the required cluster types. 
>
>

| Cluster type | Functionality |
| --- | --- |
| [Hadoop](hadoop/apache-hadoop-introduction.md) |Batch query and analysis of stored data |
| [HBase](hbase/apache-hbase-overview.md) |Processing for large amounts of schemaless, NoSQL data |
| [Interactive Query](./interactive-query/apache-interactive-query-get-started.md) |In-memory caching for interactive and faster Hive queries |
| [Kafka](kafka/apache-kafka-introduction.md) | A distributed streaming platform that can be used to build real-time streaming data pipelines and applications |
| [ML Services](r-server/r-server-overview.md) |Various big data statistics, predictive modeling, and machine learning capabilities |
| [Spark](spark/apache-spark-overview.md) |In-memory processing, interactive queries, micro-batch stream processing |
| [Storm](storm/apache-storm-overview.md) |Real-time event processing |


### HDInsight version
Choose the version of HDInsight for this cluster. For more information, see [Supported HDInsight versions](hdinsight-component-versioning.md#supported-hdinsight-versions).

### Enterprise security package

For Hadoop, Spark, and Interactive Query cluster types, you can choose to enable the **Enterprise Security Package**. This package provides option to have a more secure cluster setup by using Apache Ranger and integrating with Azure Active Directory. For more information, see [Enterprise Security Package in Azure HDInsight](./domain-joined/apache-domain-joined-introduction.md).

![hdinsight create options choose enterprise security package](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-creation-enterprise-security-package.png)

For more information on creating domain-joined HDInsight cluster, see [Create domain-joined HDInsight sandbox environment](./domain-joined/apache-domain-joined-configure.md).


## Cluster login and SSH user name
With HDInsight clusters, you can configure two user accounts during cluster creation:

* HTTP user: The default user name is *admin*. It uses the basic configuration on the Azure portal. Sometimes it is called "Cluster user."
* SSH user (Linux clusters): Used to connect to the cluster through SSH. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

The Enterprise security package allows you to integrate HDInsight with Active Directory and Apache Ranger. Multiple users can be created using the Enterprise security package.

## <a name="location"></a>Location (regions) for clusters and storage

You don't need to specify the cluster location explicitly: The cluster is in the same location as the default storage. For a list of supported regions, click the **Region** drop-down list on [HDInsight pricing](https://go.microsoft.com/fwLink/?LinkID=282635&clcid=0x409).

## Storage endpoints for clusters

Although an on-premises installation of Hadoop uses the Hadoop Distributed File System (HDFS) for storage on the cluster, in the cloud you use storage endpoints connected to cluster. HDInsight clusters use either [Azure Data Lake Store](hdinsight-hadoop-use-data-lake-store.md) or [blobs in Azure Storage](hdinsight-hadoop-use-blob-storage.md). Using Azure Storage or Data Lake Store means you can safely delete the HDInsight clusters used for computation while still retaining your data. 

> [!WARNING]
> Using an additional storage account in a different location from the HDInsight cluster is not supported.

During configuration, for the default storage endpoint you specify a blob container of an Azure Storage account or a Data Lake Store. The default storage contains application and system logs. Optionally, you can specify additional linked Azure Storage accounts and Data Lake Store accounts that the cluster can access. The HDInsight cluster and the dependent storage accounts must be in the same Azure location.

![Cluster storage settings: HDFS-compatible storage endpoints](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-cluster-creation-storage.png)

[!INCLUDE [secure-transfer-enabled-storage-account](../../includes/hdinsight-secure-transfer.md)]


### Optional metastores
You can create optional Hive or Oozie metastores. However, not all cluster types support metastores, and Azure SQL Data Warehouse isn't compatible with metastores. 

For more information, see [Use external metadata stores in Azure HDInsight](./hdinsight-use-external-metadata-stores.md).

> [!IMPORTANT]
> When you create a custom metastore, don't use dashes, hyphens, or spaces in the database name. This can cause the cluster creation process to fail.

### <a name="use-hiveoozie-metastore"></a>Hive metastore

If you want to retain your Hive tables after you delete an HDInsight cluster, use a custom metastore. You can then attach the metastore to another HDInsight cluster.

An HDInsight metastore that is created for one HDInsight cluster version cannot be shared across different HDInsight cluster versions. For a list of HDInsight versions, see [Supported HDInsight versions](hdinsight-component-versioning.md#supported-hdinsight-versions).

### Oozie metastore

To increase performance when using Oozie, use a custom metastore. A metastore can also provide access to Oozie job data after you delete your cluster. 

> [!IMPORTANT]
> You cannot reuse a custom Oozie metastore. To use a custom Oozie metastore, you must provide an empty Azure SQL Database when creating the HDInsight cluster.


## Custom cluster setup
Custom cluster setup builds on the Quick create settings, and adds the following options:
- [HDInsight applications](#install-hdinsight-applications-on-clusters)
- [Cluster size](#configure-cluster-size)
- [Script actions](#advanced-settings-script-actions)
- [Virtual network](#advanced-settings-extend-clusters-with-a-virtual-network)

## Install HDInsight applications on clusters

An HDInsight application is an application that users can install on a Linux-based HDInsight cluster. You can use applications provided by Microsoft, third parties, or that you develop yourself. For more information, see [Install third-party Hadoop applications on Azure HDInsight](hdinsight-apps-install-applications.md).

Most of the HDInsight applications are installed on an empty edge node.  An empty edge node is a Linux virtual machine with the same client tools installed and configured as in the head node. You can use the edge node for accessing the cluster, testing your client applications, and hosting your client applications. For more information, see [Use empty edge nodes in HDInsight](hdinsight-apps-use-edge-node.md).

## Configure cluster size

You are billed for node usage for as long as the cluster exists. Billing starts when a cluster is created and stops when the cluster is deleted. Clusters can’t be de-allocated or put on hold.

### Number of nodes for each cluster type
Each cluster type has its own number of nodes, terminology for nodes, and default VM size. In the following table, the number of nodes for each node type is in parentheses.

| Type | Nodes | Diagram |
| --- | --- | --- |
| Hadoop |Head node (2), data node (1+) |![HDInsight Hadoop cluster nodes](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-hadoop-cluster-type-nodes.png) |
| HBase |Head server (2), region server (1+), master/ZooKeeper node (3) |![HDInsight HBase cluster nodes](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-hbase-cluster-type-setup.png) |
| Storm |Nimbus node (2), supervisor server (1+), ZooKeeper node (3) |![HDInsight Storm cluster nodes](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-storm-cluster-type-setup.png) |
| Spark |Head node (2), worker node (1+), ZooKeeper node (3) (free for A1 ZooKeeper VM size) |![HDInsight Spark cluster nodes](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-spark-cluster-type-setup.png) |

For more information, see [Default node configuration and virtual machine sizes for clusters](hdinsight-component-versioning.md#default-node-configuration-and-virtual-machine-sizes-for-clusters) in "What are the Hadoop components and versions in HDInsight?"

The cost of HDInsight clusters is determined by the number of nodes and the virtual machines sizes for the nodes. 

Different cluster types have different node types, numbers of nodes, and node sizes:
* Hadoop cluster type default: 
    * Two *head nodes*  
    * Four *data nodes*
* Storm cluster type default: 
    * Two *Nimbus nodes*
    * Three *ZooKeeper nodes*
    * Four *supervisor nodes* 

If you are just trying out HDInsight, we recommend you use one data node. For more information about HDInsight pricing, see [HDInsight pricing](https://go.microsoft.com/fwLink/?LinkID=282635&clcid=0x409).

> [!NOTE]
> The cluster size limit varies among Azure subscriptions. Contact [Azure billing support](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) to increase the limit.
>

When you use the Azure portal to configure the cluster, the node size is available through the **Node Pricing Tiers** blade. In the portal, you can also see the cost associated with the different node sizes. 

![HDInsight VM node sizes](./media/hdinsight-hadoop-provision-linux-clusters/hdinsight-node-sizes.png)

### Virtual machine sizes 
When you deploy clusters, choose compute resources based on the solution you plan to deploy. The following VMs are used for HDInsight clusters:
* A and D1-4 series VMs: [General-purpose Linux VM sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general)
* D11-14 series VM: [Memory-optimized Linux VM sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory)

To find out what value you should use to specify a VM size while creating a cluster using the different SDKs or while using Azure PowerShell, see [VM sizes to use for HDInsight clusters](../cloud-services/cloud-services-sizes-specs.md#size-tables). From this linked article, use the value in the **Size** column of the tables.

> [!IMPORTANT]
> If you need more than 32 worker nodes in a cluster, you must select a head node size with at least 8 cores and 14 GB of RAM.
>
>

For more information, see [Sizes for virtual machines](../virtual-machines/windows/sizes.md). For information about pricing of the various sizes, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight).   

## Advanced settings: Script actions

You can install additional components or customize cluster configuration by using scripts during creation. Such scripts are invoked via **Script Action**, which is a configuration option that can be used from the Azure portal, HDInsight Windows PowerShell cmdlets, or the HDInsight .NET SDK. For more information, see [Customize HDInsight cluster using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

Some native Java components, like Mahout and Cascading, can be run on the cluster as Java Archive (JAR) files. These JAR files can be distributed to Azure Storage and submitted to HDInsight clusters with Hadoop job submission mechanisms. For more information, see [Submit Hadoop jobs programmatically](hadoop/submit-apache-hadoop-jobs-programmatically.md).

> [!NOTE]
> If you have issues deploying JAR files to HDInsight clusters, or calling JAR files on HDInsight clusters, contact [Microsoft Support](https://azure.microsoft.com/support/options/).
>
> Cascading is not supported by HDInsight and is not eligible for Microsoft Support. For lists of supported components, see [What's new in the cluster versions provided by HDInsight](hdinsight-component-versioning.md).
>
>

Sometimes, you want to configure the following configuration files during the creation process:

* clusterIdentity.xml
* core-site.xml
* gateway.xml
* hbase-env.xml
* hbase-site.xml
* hdfs-site.xml
* hive-env.xml
* hive-site.xml
* mapred-site
* oozie-site.xml
* oozie-env.xml
* storm-site.xml
* tez-site.xml
* webhcat-site.xml
* yarn-site.xml

For more information, see [Customize HDInsight clusters using Bootstrap](hdinsight-hadoop-customize-cluster-bootstrap.md).

## Advanced settings: Extend clusters with a virtual network
If your solution requires technologies that are spread across multiple HDInsight cluster types, an [Azure virtual network](https://docs.microsoft.com/azure/virtual-network) can connect the required cluster types. This configuration allows the clusters, and any code you deploy to them, to directly communicate with each other.

For more information on using an Azure virtual network with HDInsight, see [Extend HDInsight with Azure virtual networks](hdinsight-extend-hadoop-virtual-network.md).

For an example of using two cluster types within an Azure virtual network, see [Use Spark Structured Streaming with Kafka](hdinsight-apache-kafka-spark-structured-streaming.md). For more information about using HDInsight with a virtual network, including specific configuration requirements for the virtual network, see [Extend HDInsight capabilities by using Azure Virtual Network](hdinsight-extend-hadoop-virtual-network.md).

## Troubleshoot access control issues

If you run into issues with creating HDInsight clusters, see [access control requirements](hdinsight-administer-use-portal-linux.md#create-clusters).

## Next steps

- [What are HDInsight, the Hadoop ecosystem, and Hadoop clusters?](hadoop/apache-hadoop-introduction.md)
- [Get started using Hadoop in HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
- [Work in Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
