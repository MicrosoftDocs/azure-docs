---
title: Query data from HDFS-compatible Azure storage - Azure HDInsight
description: Learn how to query data from Azure storage and Azure Data Lake Storage to store results of your analysis.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 04/21/2020
---

# Use Azure storage with Azure HDInsight clusters

You can store data in [Azure Storage](../storage/common/storage-introduction.md), [Azure Data Lake Storage Gen 1](../data-lake-store/data-lake-store-overview.md), or [Azure Data Lake Storage Gen 2](../storage/blobs/data-lake-storage-introduction.md). Or a combination of these options. These storage options enable you to safely delete HDInsight clusters that are used for computation without losing user data.

Apache Hadoop supports a notion of the default file system. The default file system implies a default scheme and authority. It can also be used to resolve relative paths. During the HDInsight cluster creation process, you can specify a blob container in Azure Storage as the default file system. Or with HDInsight 3.6, you can select either Azure Storage or Azure Data Lake Storage Gen 1/ Azure Data Lake Storage Gen 2 as the default files system with a few exceptions. For the supportability of using Data Lake Storage Gen 1 as both the default and linked storage, see [Availability for HDInsight cluster](./hdinsight-hadoop-use-data-lake-store.md#availability-for-hdinsight-clusters).

In this article, you learn how Azure Storage works with HDInsight clusters. To learn how Data Lake Storage Gen 1 works with HDInsight clusters, see [Use Azure Data Lake Storage with Azure HDInsight clusters](hdinsight-hadoop-use-data-lake-store.md). For more information about creating an HDInsight cluster, see [Create Apache Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

> [!IMPORTANT]  
> Storage account kind **BlobStorage** can only be used as secondary storage for HDInsight clusters.

| Storage account kind | Supported services | Supported performance tiers |Not supported performance tiers| Supported access tiers |
|----------------------|--------------------|-----------------------------|---|------------------------|
| StorageV2 (general-purpose v2)  | Blob     | Standard                    |Premium| Hot, Cool, Archive\*   |
| Storage (general-purpose v1)   | Blob     | Standard                    |Premium| N/A                    |
| BlobStorage                    | Blob     | Standard                    |Premium| Hot, Cool, Archive\*   |

We don't recommend that you use the default blob container for storing business data. Deleting the default blob container after each use to reduce storage cost is a good practice. The default container contains application and system logs. Make sure to retrieve the logs before deleting the container.

Sharing one blob container as the default file system for multiple clusters isn't supported.

> [!NOTE]  
> The Archive access tier is an offline tier that has a several hour retrieval latency and isn't recommended for use with HDInsight. For more information, see [Archive access tier](../storage/blobs/storage-blob-storage-tiers.md#archive-access-tier).

## Access files from within cluster

There are several ways you can access the files in Data Lake Storage from an HDInsight cluster. The URI scheme provides unencrypted access (with the *wasb:* prefix) and TLS encrypted access (with *wasbs*). We recommend using *wasbs* wherever possible, even when accessing data that lives inside the same region in Azure.

* **Using the fully qualified name**. With this approach, you provide the full path to the file that you want to access.

    ```
    wasb://<containername>@<accountname>.blob.core.windows.net/<file.path>/
    wasbs://<containername>@<accountname>.blob.core.windows.net/<file.path>/
    ```

* **Using the shortened path format**. With this approach, you replace the path up to the cluster root with:

    ```
    wasb:///<file.path>/
    wasbs:///<file.path>/
    ```

* **Using the relative path**. With this approach, you only provide the relative path to the file that you want to access.

    ```
    /<file.path>/
    ```

### Data access examples

Examples are based on an [ssh connection](./hdinsight-hadoop-linux-use-ssh-unix.md) to the head node of the cluster. The examples use all three URI schemes. Replace `CONTAINERNAME` and `STORAGEACCOUNT` with the relevant values

#### A few hdfs commands

1. Create a file on local storage.

    ```bash
    touch testFile.txt
    ```

1. Create directories on cluster storage.

    ```bash
    hdfs dfs -mkdir wasbs://CONTAINERNAME@STORAGEACCOUNT.blob.core.windows.net/sampledata1/
    hdfs dfs -mkdir wasbs:///sampledata2/
    hdfs dfs -mkdir /sampledata3/
    ```

1. Copy data from local storage to cluster storage.

    ```bash
    hdfs dfs -copyFromLocal testFile.txt  wasbs://CONTAINERNAME@STORAGEACCOUNT.blob.core.windows.net/sampledata1/
    hdfs dfs -copyFromLocal testFile.txt  wasbs:///sampledata2/
    hdfs dfs -copyFromLocal testFile.txt  /sampledata3/
    ```

1. List directory contents on cluster storage.

    ```bash
    hdfs dfs -ls wasbs://CONTAINERNAME@STORAGEACCOUNT.blob.core.windows.net/sampledata1/
    hdfs dfs -ls wasbs:///sampledata2/
    hdfs dfs -ls /sampledata3/
    ```

> [!NOTE]  
> When working with blobs outside of HDInsight, most utilities do not recognize the WASB format and instead expect a basic path format, such as `example/jars/hadoop-mapreduce-examples.jar`.

#### Creating a Hive table

Three file locations are shown for illustrative purposes. For actual execution, use only one of the `LOCATION` entries.

```hql
DROP TABLE myTable;
CREATE EXTERNAL TABLE myTable (
    t1 string,
    t2 string,
    t3 string,
    t4 string,
    t5 string,
    t6 string,
    t7 string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
STORED AS TEXTFILE
LOCATION 'wasbs://CONTAINERNAME@STORAGEACCOUNT.blob.core.windows.net/example/data/';
LOCATION 'wasbs:///example/data/';
LOCATION '/example/data/';
```

## Access files from outside cluster

Microsoft provides the following tools to work with Azure Storage:

| Tool | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) |✔ |✔ |✔ |
| [Azure CLI](../storage/blobs/storage-quickstart-blobs-cli.md) |✔ |✔ |✔ |
| [Azure PowerShell](../storage/blobs/storage-quickstart-blobs-powershell.md) | | |✔ |
| [AzCopy](../storage/common/storage-use-azcopy-v10.md) |✔ | |✔ |

## Identify storage path from Ambari

* To identify the complete path to the configured default store, navigate to:

    **HDFS** > **Configs** and enter `fs.defaultFS` in the filter input box.

* To check if wasb store is configured as secondary storage, navigate to:

    **HDFS** > **Configs** and enter `blob.core.windows.net` in the filter input box.

To obtain the path using Ambari REST API, see [Get the default storage](./hdinsight-hadoop-manage-ambari-rest-api.md#get-the-default-storage).

## Blob containers

To use blobs, you first create an [Azure Storage account](../storage/common/storage-create-storage-account.md). As part of this step, you specify an Azure region where the storage account is created. The cluster and the storage account must be hosted in the same region. The Hive metastore SQL Server database and Apache Oozie metastore SQL Server database must be located in the same region.

Wherever it lives, each blob you create belongs to a container in your Azure Storage account. This container may be an existing blob created outside of HDInsight. Or it may be a container that is created for an HDInsight cluster.

The default Blob container stores cluster-specific information such as job history and logs. Don't share a default Blob container with multiple HDInsight clusters. This action  might corrupt job history. It's recommended to use a different container for each cluster. Put shared data on a linked storage account specified for all relevant clusters rather than the default storage account. For more information on configuring linked storage accounts, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md). However you can reuse a default storage container after the original HDInsight cluster has been deleted. For HBase clusters, you can actually keep the HBase table schema and data by creating a new HBase cluster using the default blob container that is used by a deleted HBase cluster

[!INCLUDE [secure-transfer-enabled-storage-account](../../includes/hdinsight-secure-transfer.md)]

## Use additional storage accounts

While creating an HDInsight cluster, you specify the Azure Storage account you want to associate with it. Also, you can add additional storage accounts from the same Azure subscription or different Azure subscriptions during the creation process or after a cluster has been created. For instructions about adding additional storage accounts, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

> [!WARNING]  
> Using an additional storage account in a different location than the HDInsight cluster is not supported.

## Next steps

In this article, you learned how to use HDFS-compatible Azure storage with HDInsight. This storage allows you to build adaptable, long-term, archiving data acquisition solutions and use HDInsight to unlock the information inside the stored structured and unstructured data.

For more information, see:

* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Get started with Azure Data Lake Storage](../data-lake-store/data-lake-store-get-started-portal.md)
* [Upload data to HDInsight](hdinsight-upload-data.md)
* [Use Azure Storage Shared Access Signatures to restrict access to data with HDInsight](hdinsight-storage-sharedaccesssignature-permissions.md)
* [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](hdinsight-hadoop-use-data-lake-storage-gen2.md)
* [Tutorial: Extract, transform, and load data using Interactive Query in Azure HDInsight](./interactive-query/interactive-query-tutorial-analyze-flight-data.md)
