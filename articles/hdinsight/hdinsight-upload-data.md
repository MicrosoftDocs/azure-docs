---
title: Upload data for Apache Hadoop jobs in HDInsight
description: Learn how to upload and access data for Apache Hadoop jobs in HDInsight using the Azure classic CLI, Azure Storage Explorer, Azure PowerShell, the Hadoop command line, or Sqoop.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdiseo17may2017
ms.topic: conceptual
ms.date: 06/03/2019
---

# Upload data for Apache Hadoop jobs in HDInsight

Azure HDInsight provides a full-featured Hadoop distributed file system (HDFS) over Azure Storage and Azure Data Lake Storage (Gen1 and Gen2). Azure Storage and Data Lake Storage Gen1 and Gen2 are designed as HDFS extensions to provide a seamless experience to customers. They enable the full set of components in the Hadoop ecosystem to operate directly on the data it manages. Azure Storage, Data Lake Storage Gen1, and Gen2 are distinct file systems that are optimized for storage of data and computations on that data. For information about the benefits of using Azure Storage, see [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md), [Use Data Lake Storage Gen1 with HDInsight](hdinsight-hadoop-use-data-lake-store.md), and [Use Data Lake Storage Gen2 with HDInsight](hdinsight-hadoop-use-data-lake-storage-gen2.md).

## Prerequisites

Note the following requirements before you begin:

* An Azure HDInsight cluster. For instructions, see [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md) or [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).
* Knowledge of the following articles:

    - [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md)
    - [Use Data Lake Storage Gen1 with HDInsight](hdinsight-hadoop-use-data-lake-store.md)
    - [Use Data Lake Storage Gen2 with HDInsight](hdinsight-hadoop-use-data-lake-storage-gen2.md)  

## Upload data to Azure Storage

## Utilities
Microsoft provides the following utilities to work with Azure Storage:

| Tool | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) |✔ |✔ |✔ |
| [Azure CLI](../storage/blobs/storage-quickstart-blobs-cli.md) |✔ |✔ |✔ |
| [Azure PowerShell](../storage/blobs/storage-quickstart-blobs-powershell.md) | | |✔ |
| [AzCopy](../storage/common/storage-use-azcopy-v10.md) |✔ | |✔ |
| [Hadoop command](#commandline) |✔ |✔ |✔ |


> [!NOTE]  
> The Hadoop command is only available on the HDInsight cluster. The command only allows loading data from the local file system into Azure Storage.  


## <a id="commandline"></a>Hadoop command line
The Hadoop command line is only useful for storing data into Azure storage blob when the data is already present on the cluster head node.

In order to use the Hadoop command, you must first connect to the headnode using [SSH or PuTTY](hdinsight-hadoop-linux-use-ssh-unix.md).

Once connected, you can use the following syntax to upload a file to storage.

```bash
hadoop -copyFromLocal <localFilePath> <storageFilePath>
```

For example, `hadoop fs -copyFromLocal data.txt /example/data/data.txt`

Because the default file system for HDInsight is in Azure Storage, /example/data.txt is actually in Azure Storage. You can also refer to the file as:

    wasbs:///example/data/data.txt

or

    wasbs://<ContainerName>@<StorageAccountName>.blob.core.windows.net/example/data/davinci.txt

For a list of other Hadoop commands that work with files, see [https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html)

> [!WARNING]  
> On Apache HBase clusters, the default block size used when writing data is 256 KB. While this works fine when using HBase APIs or REST APIs, using the `hadoop` or `hdfs dfs` commands to write data larger than ~12 GB results in an error. For more information, see the [storage exception for write on blob](#storageexception) section in this article.

## Graphical clients
There are also several applications that provide a graphical interface for working with Azure Storage. The following table is a list of a few of these applications:

| Client | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Microsoft Visual Studio Tools for HDInsight](hadoop/apache-hadoop-visual-studio-tools-get-started.md#explore-linked-resources) |✔ |✔ |✔ |
| [Azure Storage Explorer](../storage/blobs/storage-quickstart-blobs-storage-explorer.md) |✔ |✔ |✔ |
| [Cerulea](https://www.cerebrata.com/products/cerulean/features/azure-storage) | | |✔ |
| [CloudXplorer](https://clumsyleaf.com/products/cloudxplorer) | | |✔ |
| [CloudBerry Explorer for Microsoft Azure](https://www.cloudberrylab.com/free-microsoft-azure-explorer.aspx) | | |✔ |
| [Cyberduck](https://cyberduck.io/) | |✔ |✔ |


## Mount Azure Storage as Local Drive
See [Mount Azure Storage as Local Drive](https://blogs.msdn.com/b/bigdatasupport/archive/2014/01/09/mount-azure-blob-storage-as-local-drive.aspx).

## Upload using services
### Azure Data Factory
The Azure Data Factory service is a fully managed service for composing data storage, data processing, and data movement services into streamlined, scalable, and reliable data production pipelines.

|Storage type|Documentation|
|----|----|
|Azure Blob storage|[Copy data to or from Azure Blob storage by using Azure Data Factory](../data-factory/connector-azure-blob-storage.md)|
|Azure Data Lake Storage Gen1|[Copy data to or from Azure Data Lake Storage Gen1 by using Azure Data Factory](../data-factory/connector-azure-data-lake-store.md)|
|Azure Data Lake Storage Gen2 |[Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](../data-factory/load-azure-data-lake-storage-gen2.md)|

### <a id="sqoop"></a>Apache Sqoop
Sqoop is a tool designed to transfer data between Hadoop and relational databases. You can use it to import data from a relational database management system (RDBMS), such as SQL Server, MySQL, or Oracle into the Hadoop distributed file system (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS.

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

## Troubleshooting
### <a id="storageexception"></a>Storage exception for write on blob
**Symptoms**: When using the `hadoop` or `hdfs dfs` commands to write files that are ~12 GB or larger on an HBase cluster, you may encounter the following error:

    ERROR azure.NativeAzureFileSystem: Encountered Storage Exception for write on Blob : example/test_large_file.bin._COPYING_ Exception details: null Error Code : RequestBodyTooLarge
    copyFromLocal: java.io.IOException
            at com.microsoft.azure.storage.core.Utility.initIOException(Utility.java:661)
            at com.microsoft.azure.storage.blob.BlobOutputStream$1.call(BlobOutputStream.java:366)
            at com.microsoft.azure.storage.blob.BlobOutputStream$1.call(BlobOutputStream.java:350)
            at java.util.concurrent.FutureTask.run(FutureTask.java:262)
            at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:471)
            at java.util.concurrent.FutureTask.run(FutureTask.java:262)
            at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
            at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
            at java.lang.Thread.run(Thread.java:745)
    Caused by: com.microsoft.azure.storage.StorageException: The request body is too large and exceeds the maximum permissible limit.
            at com.microsoft.azure.storage.StorageException.translateException(StorageException.java:89)
            at com.microsoft.azure.storage.core.StorageRequest.materializeException(StorageRequest.java:307)
            at com.microsoft.azure.storage.core.ExecutionEngine.executeWithRetry(ExecutionEngine.java:182)
            at com.microsoft.azure.storage.blob.CloudBlockBlob.uploadBlockInternal(CloudBlockBlob.java:816)
            at com.microsoft.azure.storage.blob.CloudBlockBlob.uploadBlock(CloudBlockBlob.java:788)
            at com.microsoft.azure.storage.blob.BlobOutputStream$1.call(BlobOutputStream.java:354)
            ... 7 more

**Cause**: HBase on HDInsight clusters default to a block size of 256 KB when writing to Azure storage. While it works for HBase APIs or REST APIs, it results in an error when using the `hadoop` or `hdfs dfs` command-line utilities.

**Resolution**: Use `fs.azure.write.request.size` to specify a larger block size. You can do this on a per-use basis by using the `-D` parameter. The following command is an example using this parameter with the `hadoop` command:

```bash
hadoop -fs -D fs.azure.write.request.size=4194304 -copyFromLocal test_large_file.bin /example/data
```

You can also increase the value of `fs.azure.write.request.size` globally by using Apache Ambari. The following steps can be used to change the value in the Ambari Web UI:

1. In your browser, go to the Ambari Web UI for your cluster. This is `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

    When prompted, enter the admin name and password for the cluster.
2. From the left side of the screen, select **HDFS**, and then select the **Configs** tab.
3. In the **Filter...** field, enter `fs.azure.write.request.size`. This displays the field and current value in the middle of the page.
4. Change the value from 262144 (256 KB) to the new value. For example, 4194304 (4 MB).

    ![Image of changing the value through Ambari Web UI](./media/hdinsight-upload-data/hbase-change-block-write-size.png)

For more information on using Ambari, see [Manage HDInsight clusters using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

## Next steps
Now that you understand how to get data into HDInsight, read the following articles to learn how to perform analysis:

* [Get started with Azure HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Submit Apache Hadoop jobs programmatically](hadoop/submit-apache-hadoop-jobs-programmatically.md)
* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use Apache Pig with HDInsight](hadoop/hdinsight-use-pig.md)
