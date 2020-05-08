---
title: Upload data for Apache Hadoop jobs in HDInsight
description: Learn how to upload and access data for Apache Hadoop jobs in HDInsight. Use Azure classic CLI, Azure Storage Explorer, Azure PowerShell, the Hadoop command line, or Sqoop.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdiseo17may2017,seoapr2020
ms.date: 04/27/2020
--- 

# Upload data for Apache Hadoop jobs in HDInsight

HDInsight provides a Hadoop distributed file system (HDFS) over Azure Storage, and Azure Data Lake Storage. This storage includes Gen1 and Gen2. Azure Storage and Data Lake Storage Gen1 and Gen2 are designed as HDFS extensions. They enable the full set of components in the Hadoop environment to operate directly on the data it manages. Azure Storage, Data Lake Storage Gen1, and Gen2 are distinct file systems. The systems are optimized for storage of data and computations on that data. For information about the benefits of using Azure Storage, see [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md). See also, [Use Data Lake Storage Gen1 with HDInsight](hdinsight-hadoop-use-data-lake-store.md), and [Use Data Lake Storage Gen2 with HDInsight](hdinsight-hadoop-use-data-lake-storage-gen2.md).

## Prerequisites

Note the following requirements before you begin:

* An Azure HDInsight cluster. For instructions, see [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md).
* Knowledge of the following articles:
    * [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md)
    * [Use Data Lake Storage Gen1 with HDInsight](hdinsight-hadoop-use-data-lake-store.md)
    * [Use Data Lake Storage Gen2 with HDInsight](hdinsight-hadoop-use-data-lake-storage-gen2.md)  

## Upload data to Azure Storage

### Utilities

Microsoft provides the following utilities to work with Azure Storage:

| Tool | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) |✔ |✔ |✔ |
| [Azure CLI](../storage/blobs/storage-quickstart-blobs-cli.md) |✔ |✔ |✔ |
| [Azure PowerShell](../storage/blobs/storage-quickstart-blobs-powershell.md) | | |✔ |
| [AzCopy](../storage/common/storage-use-azcopy-v10.md) |✔ | |✔ |
| [Hadoop command](#hadoop-command-line) |✔ |✔ |✔ |

> [!NOTE]  
> The Hadoop command is only available on the HDInsight cluster. The command only allows loading data from the local file system into Azure Storage.  

### Hadoop command line

The Hadoop command line is only useful for storing data into Azure storage blob when the data is already present on the cluster head node.

To use the Hadoop command, you must first connect to the headnode using [SSH or PuTTY](hdinsight-hadoop-linux-use-ssh-unix.md).

Once connected, you can use the following syntax to upload a file to storage.

```bash
hadoop fs -copyFromLocal <localFilePath> <storageFilePath>
```

For example, `hadoop fs -copyFromLocal data.txt /example/data/data.txt`

Because the default file system for HDInsight is in Azure Storage, /example/data/data.txt is actually in Azure Storage. You can also refer to the file as:

    wasbs:///example/data/data.txt

or

    wasbs://<ContainerName>@<StorageAccountName>.blob.core.windows.net/example/data/davinci.txt

For a list of other Hadoop commands that work with files, see [https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html)

> [!WARNING]  
> On Apache HBase clusters, the default block size used when writing data is 256 KB. While this works fine when using HBase APIs or REST APIs, using the `hadoop` or `hdfs dfs` commands to write data larger than ~12 GB results in an error. For more information, see [storage exception for write on blob](hdinsight-troubleshoot-hdfs.md#storage-exception-for-write-on-blob).

### Graphical clients

There are also several applications that provide a graphical interface for working with Azure Storage. The following table is a list of a few of these applications:

| Client | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Microsoft Visual Studio Tools for HDInsight](hadoop/apache-hadoop-visual-studio-tools-get-started.md#explore-linked-resources) |✔ |✔ |✔ |
| [Azure Storage Explorer](../storage/blobs/storage-quickstart-blobs-storage-explorer.md) |✔ |✔ |✔ |
| [`Cerulea`](https://www.cerebrata.com/products/cerulean/features/azure-storage) | | |✔ |
| [CloudXplorer](https://clumsyleaf.com/products/cloudxplorer) | | |✔ |
| [CloudBerry Explorer for Microsoft Azure](https://www.cloudberrylab.com/free-microsoft-azure-explorer.aspx) | | |✔ |
| [Cyberduck](https://cyberduck.io/) | |✔ |✔ |

## Mount Azure Storage as Local Drive

See [Mount Azure Storage as Local Drive](https://blogs.msdn.com/b/bigdatasupport/archive/2014/01/09/mount-azure-blob-storage-as-local-drive.aspx).

## Upload using services

### Azure Data Factory

The Azure Data Factory service is a fully managed service for composing data: storage, processing, and movement services into streamlined, adaptable, and reliable data production pipelines.

|Storage type|Documentation|
|----|----|
|Azure Blob storage|[Copy data to or from Azure Blob storage by using Azure Data Factory](../data-factory/connector-azure-blob-storage.md)|
|Azure Data Lake Storage Gen1|[Copy data to or from Azure Data Lake Storage Gen1 by using Azure Data Factory](../data-factory/connector-azure-data-lake-store.md)|
|Azure Data Lake Storage Gen2 |[Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](../data-factory/load-azure-data-lake-storage-gen2.md)|

### Apache Sqoop

Sqoop is a tool designed to transfer data between Hadoop and relational databases. Use it to import data from a relational database management system (RDBMS), such as SQL Server, MySQL, or Oracle. Then into the Hadoop distributed file system (HDFS). Transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS.

For more information, see [Use Sqoop with HDInsight](hadoop/hdinsight-use-sqoop.md).

### Development SDKs

Azure Storage can also be accessed using an Azure SDK from the following programming languages:

* .NET
* Java
* Node.js
* PHP
* Python
* Ruby

For more information on installing the Azure SDKs, see [Azure downloads](https://azure.microsoft.com/downloads/)

## Next steps

Now that you understand how to get data into HDInsight, read the following articles to learn analysis:

* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Submit Apache Hadoop jobs programmatically](hadoop/submit-apache-hadoop-jobs-programmatically.md)
* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
