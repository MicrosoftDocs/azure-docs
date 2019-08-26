---
title: Query data from HDFS-compatible Azure storage - Azure HDInsight
description: Learn how to query data from Azure storage and Azure Data Lake Storage to store results of your analysis.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/23/2019
---

# Use Azure storage with Azure HDInsight clusters

To analyze data in HDInsight cluster, you can store the data either in [Azure Storage](../storage/common/storage-introduction.md), [Azure Data Lake Storage Gen 1](../data-lake-store/data-lake-store-overview.md)/[Azure Data Lake Storage Gen 2](../storage/blobs/data-lake-storage-introduction.md), or a combination. These storage options enable you to safely delete HDInsight clusters that are used for computation without losing user data.

Apache Hadoop supports a notion of the default file system. The default file system implies a default scheme and authority. It can also be used to resolve relative paths. During the HDInsight cluster creation process, you can specify a blob container in Azure Storage as the default file system, or with HDInsight 3.6, you can select either Azure Storage or Azure Data Lake Storage Gen 1/ Azure Data Lake Storage Gen 2  as the default files system with a few exceptions. For the supportability of using Data Lake Storage Gen 1 as both the default and linked storage, see [Availability for HDInsight cluster](./hdinsight-hadoop-use-data-lake-store.md#availability-for-hdinsight-clusters).

In this article, you learn how Azure Storage works with HDInsight clusters. To learn how Data Lake Storage Gen 1 works with HDInsight clusters, see [Use Azure Data Lake Storage with Azure HDInsight clusters](hdinsight-hadoop-use-data-lake-store.md). For more information about creating an HDInsight cluster, see [Create Apache Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

Azure storage is a robust, general-purpose storage solution that integrates seamlessly with HDInsight. HDInsight can use a blob container in Azure Storage as the default file system for the cluster. Through a Hadoop distributed file system (HDFS) interface, the full set of components in HDInsight can operate directly on structured or unstructured data stored as blobs.

> [!WARNING]  
> Storage account kind **BlobStorage** can only be used as secondary storage for HDInsight clusters.

| Storage account kind | Supported services | Supported performance tiers | Supported access tiers |
|----------------------|--------------------|-----------------------------|------------------------|
| StorageV2 (general-purpose v2)  | Blob     | Standard                    | Hot, Cool, Archive\*   |
| Storage (general-purpose v1)   | Blob     | Standard                    | N/A                    |
| BlobStorage                    | Blob     | Standard                    | Hot, Cool, Archive\*   |

We do not recommend that you use the default blob container for storing business data. Deleting the default blob container after each use to reduce storage cost is a good practice. The default container contains application and system logs. Make sure to retrieve the logs before deleting the container.

Sharing one blob container as the default file system for multiple clusters is not supported.

> [!NOTE]  
> The Archive access tier is an offline tier that has a several hour retrieval latency and is not recommended for use with HDInsight. For more information, see [Archive access tier](../storage/blobs/storage-blob-storage-tiers.md#archive-access-tier).

If you choose to secure your storage account with the **Firewalls and virtual networks** restrictions on **Selected networks**, be sure to enable the exception **Allow trusted Microsoft services...** so that HDInsight can access your storage account.

## HDInsight storage architecture
The following diagram provides an abstract view of the HDInsight storage architecture of using Azure Storage:

![Hadoop clusters use the HDFS API to access and store structured and unstructured data in Blob storage.](./media/hdinsight-hadoop-use-blob-storage/HDI.WASB.Arch.png "HDInsight Storage Architecture")

HDInsight provides access to the distributed file system that is locally attached to the compute nodes. This file system can be accessed by using the fully qualified URI, for example:

    hdfs://<namenodehost>/<path>

In addition, HDInsight allows you to access data that is stored in Azure Storage. The syntax is:

    wasb://<containername>@<accountname>.blob.core.windows.net/<path>

Here are some considerations when using Azure Storage account with HDInsight clusters.

* **Containers in the storage accounts that are connected to a cluster:** Because the account name and key are associated with the cluster during creation, you have full access to the blobs in those containers.

* **Public containers or public blobs in storage accounts that are NOT connected to a cluster:** You have read-only permission to the blobs in the containers.
  
> [!NOTE]  
> Public containers allow you to get a list of all blobs that are available in that container and get container metadata. Public blobs allow you to access the blobs only if you know the exact URL. For more information, see [Manage access to containers and blobs](../storage/blobs/storage-manage-access-to-resources.md).

* **Private containers in storage accounts that are NOT connected to a cluster:** You can't access the blobs in the containers unless you define the storage account when you submit WebHCat jobs. This is explained later in this article.

The storage accounts that are defined in the creation process and their keys are stored in `%HADOOP_HOME%/conf/core-site.xml` on the cluster nodes. The default behavior of HDInsight is to use the storage accounts defined in the core-site.xml file. You can modify this setting using [Apache Ambari](./hdinsight-hadoop-manage-ambari.md).

Multiple WebHCat jobs, including Apache Hive, MapReduce, Apache Hadoop streaming, and Apache Pig, can carry a description of storage accounts and metadata with them. (This currently works for Pig with storage accounts, but not for metadata.) For more information, see [Using an HDInsight Cluster with Alternate Storage Accounts and Metastores](https://social.technet.microsoft.com/wiki/contents/articles/23256.using-an-hdinsight-cluster-with-alternate-storage-accounts-and-metastores.aspx).

Blobs can be used for structured and unstructured data. Blob containers store data as key/value pairs, and there is no directory hierarchy. However the slash character ( / ) can be used within the key name to make it appear as if a file is stored within a directory structure. For example, a blob's key may be *input/log1.txt*. No actual *input* directory exists, but due to the presence of the slash character in the key name, it has the appearance of a file path.

## <a id="benefits"></a>Benefits of Azure Storage
The implied performance cost of not colocating compute clusters and storage resources is mitigated by the way the compute clusters are created close to the storage account resources inside the Azure region, where the high-speed network makes it efficient for the compute nodes to access the data inside Azure storage.

There are several benefits associated with storing the data in Azure storage instead of HDFS:

* **Data reuse and sharing:** The data in HDFS is located inside the compute cluster. Only the applications that have access to the compute cluster can use the data by using HDFS APIs. The data in Azure storage can be accessed either through the HDFS APIs or through the [Blob Storage REST APIs](https://docs.microsoft.com/rest/api/storageservices/Blob-Service-REST-API). Thus, a larger set of applications (including other HDInsight clusters) and tools can be used to produce and consume the data.

* **Data archiving:** Storing data in Azure storage enables the HDInsight clusters used for computation to be safely deleted without losing user data.

* **Data storage cost:** Storing data in DFS for the long term is more costly than storing the data in Azure storage because the cost of a compute cluster is higher than the cost of Azure storage. In addition, because the data does not have to be reloaded for every compute cluster generation, you are also saving data loading costs.

* **Elastic scale-out:** Although HDFS provides you with a scaled-out file system, the scale is determined by the number of nodes that you create for your cluster. Changing the scale can become a more complicated process than relying on the elastic scaling capabilities that you get automatically in Azure storage.

* **Geo-replication:** Your Azure storage can be geo-replicated. Although this gives you geographic recovery and data redundancy, a failover to the geo-replicated location severely impacts your performance, and it may incur additional costs. So our recommendation is to choose the geo-replication wisely and only if the value of the data is worth the additional cost.

Certain MapReduce jobs and packages may create intermediate results that you don't really want to store in Azure storage. In that case, you can elect to store the data in the local HDFS. In fact, HDInsight uses DFS for several of these intermediate results in Hive jobs and other processes.

> [!NOTE]  
> Most HDFS commands (for example, `ls`, `copyFromLocal` and `mkdir`) still work as expected. Only the commands that are specific to the native HDFS implementation (which is referred to as DFS), such as `fschk` and `dfsadmin`, show different behavior in Azure storage.

## Address files in Azure storage
The URI scheme for accessing files in Azure storage from HDInsight is:

```config
wasb://<BlobStorageContainerName>@<StorageAccountName>.blob.core.windows.net/<path>
```

The URI scheme provides unencrypted access (with the *wasb:* prefix) and SSL encrypted access (with *wasbs*). We recommend using *wasbs* wherever possible, even when accessing data that lives inside the same region in Azure.

The `<BlobStorageContainerName>` identifies the name of the blob container in Azure storage.
The `<StorageAccountName>` identifies the Azure Storage account name. A fully qualified domain name (FQDN) is required.

If neither `<BlobStorageContainerName>` nor `<StorageAccountName>` has been specified, the default file system is used. For the files on the default file system, you can use a relative path or an absolute path. For example, the *hadoop-mapreduce-examples.jar* file that comes with HDInsight clusters can be referred to by using one of the following:

```config
wasb://mycontainer@myaccount.blob.core.windows.net/example/jars/hadoop-mapreduce-examples.jar
wasb:///example/jars/hadoop-mapreduce-examples.jar
/example/jars/hadoop-mapreduce-examples.jar
```

> [!NOTE]  
> The file name is `hadoop-examples.jar` in HDInsight versions 2.1 and 1.6 clusters.

The path is the file or directory HDFS path name. Because containers in Azure storage are key-value stores, there is no true hierarchical file system. A slash character ( / ) inside a blob key is interpreted as a directory separator. For example, the blob name for *hadoop-mapreduce-examples.jar* is:

```bash
example/jars/hadoop-mapreduce-examples.jar
```

> [!NOTE]  
> When working with blobs outside of HDInsight, most utilities do not recognize the WASB format and instead expect a basic path format, such as `example/jars/hadoop-mapreduce-examples.jar`.

##  Blob containers
To use blobs, you first create an [Azure Storage account](../storage/common/storage-create-storage-account.md). As part of this, you specify an Azure region where the storage account is created. The cluster and the storage account must be hosted in the same region. The Hive metastore SQL Server database and Apache Oozie metastore SQL Server database must also be located in the same region.

Wherever it lives, each blob you create belongs to a container in your Azure Storage account. This container may be an existing blob that was created outside of HDInsight, or it may be a container that is created for an HDInsight cluster.

The default Blob container stores cluster-specific information such as job history and logs. Don't share a default Blob container with multiple HDInsight clusters. This might corrupt job history. It is recommended to use a different container for each cluster and put shared data on a linked storage account specified in deployment of all relevant clusters rather than the default storage account. For more information on configuring linked storage accounts, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md). However you can reuse a default storage container after the original HDInsight cluster has been deleted. For HBase clusters, you can actually retain the HBase table schema and data by creating a new HBase cluster using the default blob container that is used by an HBase cluster that has been deleted.

[!INCLUDE [secure-transfer-enabled-storage-account](../../includes/hdinsight-secure-transfer.md)]

## Interacting with Azure storage

Microsoft provides the following tools to work with Azure Storage:

| Tool | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) |✔ |✔ |✔ |
| [Azure CLI](../storage/blobs/storage-quickstart-blobs-cli.md) |✔ |✔ |✔ |
| [Azure PowerShell](../storage/blobs/storage-quickstart-blobs-powershell.md) | | |✔ |
| [AzCopy](../storage/common/storage-use-azcopy-v10.md) |✔ | |✔ |

## Use additional storage accounts

While creating an HDInsight cluster, you specify the Azure Storage account you want to associate with it. In addition to this storage account, you can add additional storage accounts from the same Azure subscription or different Azure subscriptions during the creation process or after a cluster has been created. For instructions about adding additional storage accounts, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

> [!WARNING]  
> Using an additional storage account in a different location than the HDInsight cluster is not supported.

## Next steps

In this article, you learned how to use HDFS-compatible Azure storage with HDInsight. This allows you to build scalable, long-term, archiving data acquisition solutions and use HDInsight to unlock the information inside the stored structured and unstructured data.

For more information, see:

* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Get started with Azure Data Lake Storage](../data-lake-store/data-lake-store-get-started-portal.md)
* [Upload data to HDInsight](hdinsight-upload-data.md)
* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use Apache Pig with HDInsight](hadoop/hdinsight-use-pig.md)
* [Use Azure Storage Shared Access Signatures to restrict access to data with HDInsight](hdinsight-storage-sharedaccesssignature-permissions.md)
* [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](hdinsight-hadoop-use-data-lake-storage-gen2.md)