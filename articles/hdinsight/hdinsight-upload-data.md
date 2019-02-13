---
title: Upload data for Apache Hadoop jobs in HDInsight
description: Learn how to upload and access data for Apache Hadoop jobs in HDInsight using the Azure classic CLI, Azure Storage Explorer, Azure PowerShell, the Hadoop command line, or Sqoop.
keywords: etl hadoop, getting data into hadoop, hadoop load data
services: hdinsight
author: hrasheed-msft
ms.reviewer: jasonh
ms.author: hrasheed
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 02/08/2019
---
# Upload data for Apache Hadoop jobs in HDInsight

Azure HDInsight provides a full-featured Hadoop distributed file system (HDFS) over Azure Storage and Azure Data Lake Storage (Gen1 and Gen2). Azure Storage and Data Lake Storage Gen1 and Gen2 are designed as HDFS extensions to provide a seamless experience to customers. They enable the full set of components in the Hadoop ecosystem to operate directly on the data it manages. Azure Storage, Data Lake Storage Gen1, and Gen2 are distinct file systems that are optimized for storage of data and computations on that data. For information about the benefits of using Azure Storage, see [Use Azure Storage with HDInsight][hdinsight-storage], [Use Data Lake Storage Gen1 with HDInsight](hdinsight-hadoop-use-data-lake-store.md), and [Use Data Lake Storage Gen2 with HDInsight](../storage/blobs/data-lake-storage-use-hdi-cluster.md).

## Prerequisites

Note the following requirements before you begin:

* An Azure HDInsight cluster. For instructions, see [Get started with Azure HDInsight][hdinsight-get-started] or [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).
* Knowledge of the following articles:

    - [Use Azure Storage with HDInsight][hdinsight-storage]
    - [Use Data Lake Storage Gen1 with HDInsight](hdinsight-hadoop-use-data-lake-store.md)
    - [Use Data Lake Storage Gen2 with HDInsight](../storage/blobs/data-lake-storage-use-hdi-cluster.md)  

## Upload data to Azure Storage

### Command-line utilities
Microsoft provides the following utilities to work with Azure Storage:

| Tool | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) |✔ |✔ |✔ |
| [Azure Classic CLI](https://docs.microsoft.com/cli/azure/install-classic-cli) |✔ |✔ |✔ |
| [Azure PowerShell](https://docs.microsoft.com/powershell/module/Az.Storage) | | |✔ |
| [AzCopy][azure-azcopy] |✔ | |✔ |
| [Hadoop command](#commandline) |✔ |✔ |✔ |


> [!NOTE]  
> The Hadoop command is only available on the HDInsight cluster. The command only allows loading data from the local file system into Azure Storage.  

## Azure CLI
The Azure command-line interface (CLI) is Microsoft's cross-platform command-line experience for managing Azure resources. Use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or [install it on macOS, Linux, or Windows](https://docs.microsoft.com/cli/azure/install-azure-cli).  Open a command prompt, bash, or other shell to enter the following commands:

1. Use the following command to interactively log in to Azure:

    ```cli
    az login
    ```

    When prompted, enter the user name and password for your subscription.

2. Use the following command to list the storage accounts for your subscription:

    ```cli
    az storage account list

    REM List all storage accounts for a given resource group.
    az storage account list --resource-group <resource-group>

    REM Returns only the storage account names for a given resource group.
    az storage account list --resource-group <resource-group> --query "[].{StorageAccountName:name}" --output table
    ```

    Note the storage account that contains the blob you want to work with for later use.

3. Replace the parameters with actual values and then use the following command to list the primary and secondary keys for a storage account:

    ```cli
    az storage account keys list --account-name <storage-account-name>

    REM Returns primary key only for given storage account.
    az storage account keys list --account-name <storage-account-name> --query "[0].{PrimaryKey:value}" --output table
    ```

    Note the primary key for later use.

4. Replace the parameters with actual values and then use the following command to list containers in a storage account:

    ```cli
    az storage container list --account-name <storage-account-name> --account-key <primary-key>

    REM Return only container names for given storage account.
    az storage container list --account-name <storage-account-name>  --account-key <primary-key> --query "[].{StorageContainerName:name}" --output table
    ```

    Note the storage container name for later use.

5. Replace the parameters with actual values and then use the following command to upload a file to a storage blob:  

    ```cli
    az storage blob upload --container-name <container-name> --file <source-blob-name> --name <dest-blob-name> --account-name <storage-account-name> --account-key <primary-key>
    ```

6. Replace the parameters with actual values and then use the following command to list blobs in a given container:

    ```cli
    az storage blob list --container-name <container-name> --account-name <storage-account-name> --account-key <primary-key>

    REM Returns names only for files that start with foo.
    az storage blob list --container-name <container-name> --prefix foo --query "[].{Name:name}" --output table  --account-name <storage-account-name> --account-key <primary-key>
    ```

7. Replace the parameters with actual values and then use the following command to download a blob to a file path:

    ```cli
    az storage blob download --container-name <container-name> --file <dest-blob-name> --name <source-blob-name> --account-name <storage-account-name> --account-key <primary-key>
    ```

## <a id="xplatcli"></a>Azure Classic CLI
The Azure Classic command-line interface (CLI) is Microsoft's cross-platform command-line experience for managing Azure resources. Use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or [install it on macOS, Linux, or Windows](https://docs.microsoft.com/cli/azure/install-classic-cli?).  Open a command prompt, bash, or other shell to enter the following commands:

1. Use the following command to interactively log in to Azure:

    ```cli
    azure login
    ```

    When prompted, enter the user name and password for your subscription.

2. Use the following command to list the storage accounts for your subscription:

    ```cli
    azure storage account list

    REM List all storage accounts for a given resource group.
    azure storage account list --resource-group <resource-group>
    ```

    Note the storage account that contains the blob you want to work with for later use.

3. Replace the parameters with actual values and then use the following command to list the primary and secondary keys for a storage account:

    ```cli
    azure storage account keys list --resource-group <resource-group> <storage-account-name>
    ```

    Note the primary key for later use.

4. Replace the parameters with actual values and then use the following command to list containers in a storage account:

    ```cli
    azure storage container list --account-name <storage-account-name> --account-key <primary-key>
    ```

    Note the storage container name for later use.

5. Replace the parameters with actual values and then use the following command to upload a file to a storage blob:  

    ```cli
    azure storage blob upload --container <container-name> --file <source-blob-name> --blob <dest-blob-name> --account-name <storage-account-name> --account-key <primary-key>
    ```

6. Replace the parameters with actual values and then use the following command to list blobs in a given container:

    ```cli
    azure storage blob list --container <container-name> --account-name <storage-account-name> --account-key <primary-key>

    REM Returns only files that start with foo.
    azure storage blob list --container <container-name> --prefix foo --account-name <storage-account-name> --account-key <primary-key>
    ```

7. Replace the parameters with actual values and then use the following command to download a blob to a file path:

    ```cli
    azure storage blob download --container <container-name> --blob <source-blob-name> --destination <dest-blob-name> --account-name <storage-account-name> --account-key <primary-key>
    ```
    
> [!NOTE]  
> If you use **bash** and always work with the same storage account, you can set the following environment variables instead of specifying the account and key for every command:
>
> * **AZURE\_STORAGE\_ACCOUNT**: The storage account name
> * **AZURE\_STORAGE\_ACCESS\_KEY**: The storage account key

## <a id="powershell"></a>Azure PowerShell
Azure PowerShell is a scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For information about configuring your workstation to run Azure PowerShell, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az).


[!INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-powershell.md)]

1. Open the Azure PowerShell console as instructed in [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview).

2. Use the following command to interactively log in to Azure:

    ```powershell
    Connect-AzAccount
    ```
    
    When prompted, enter the user name and password for your subscription.

3. Use the following command to list the storage accounts for your subscription:

    ```powershell
    Get-AzStorageAccount

    # List all storage accounts for a given resource group.
    Get-AzStorageAccount -ResourceGroupName <resource-group>
   ```

    Note the storage account that contains the blob you want to work with for later use.

4. Replace the parameters with actual values and then use the following command to list the primary and secondary keys for a storage account:

    ```powershell
    Get-AzStorageAccountKey -ResourceGroupName <resource-group> -AccountName <storage-account-name>

    # store key in variable
    $StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -AccountName $StorageAccountName)[0].Value
    ```

    Note the primary key for later use.

5. Replace the parameters with actual values and then use the following command to create an Azure Storage context:

    ```powershell
    $StorageContext = New-AzStorageContext -StorageAccountName <storage-account-name> -StorageAccountKey <primary-key>
    ```

    `$StorageContext` will be used in additional steps.
 
6. Use the following command to list containers for the given storage context:

    ```powershell
    Get-AzStorageContainer -Context $StorageContext | Format-List

    # Alternative
    (Get-AzStorageContainer -Context $StorageContext).Name
    ```

    Note the storage container name for later use.

7. Replace the parameters with actual values and then use the following command to upload a file to a storage blob for the given storage context:  

    ```powershell
    Set-AzStorageBlobContent -Context $StorageContext -Container <container-name> -File <source-blob-name> -Blob <dest-blob-name>
    ```

8. Replace the parameters with actual values and then use the following command to list blobs in a given container for the given storage context:

    ```powershell
    Get-AzStorageBlob -Context $StorageContext -Container <container-name>

    # Returns names only for files that start with foo.
    Get-AzStorageBlob -Context $StorageContext -Container <container-name> -Blob 'Foo*'
    ```

9. Replace the parameters with actual values and then use the following command to download a blob to a file path for the given storage context:

    ```powershell
    Get-AzStorageBlobContent -Context $StorageContext -Container <container-name> -Blob <source-blob-name> -Destination <dest-blob-path>
    ```

For example PowerShell scripts created to work with HDInsight, see [HDInsight tools](https://github.com/blackmist/hdinsight-tools).

## <a id="azcopy"></a>AzCopy
AzCopy is a command-line tool that is designed to simplify the task of transferring data into and out of an Azure Storage account. You can use it as a standalone tool or incorporate this tool in an existing application. [Download AzCopy][azure-azcopy-download].

The AzCopy syntax is:

```command
AzCopy <Source> <Destination> [filePattern [filePattern...]] [Options]
```

For more information, see [AzCopy - Uploading/Downloading files for Azure Blobs][azure-azcopy].

Azcopy on Linux preview is available.  See [Announcing AzCopy on Linux Preview](https://blogs.msdn.microsoft.com/windowsazurestorage/2017/05/16/announcing-azcopy-on-linux-preview/).

## <a id="commandline"></a>Hadoop command line
The Hadoop command line is only useful for storing data into Azure storage blob when the data is already present on the cluster head node.

In order to use the Hadoop command, you must first connect to the headnode using one of the following methods:

* **Windows-based HDInsight**: [Connect using Remote Desktop](hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp)
* **Linux-based HDInsight**: Connect using [SSH or PuTTY](hdinsight-hadoop-linux-use-ssh-unix.md).

Once connected, you can use the following syntax to upload a file to storage.

```bash
hadoop -copyFromLocal <localFilePath> <storageFilePath>
```

For example, `hadoop fs -copyFromLocal data.txt /example/data/data.txt`

Because the default file system for HDInsight is in Azure Storage, /example/data.txt is actually in Azure Storage. You can also refer to the file as:

    wasb:///example/data/data.txt

or

    wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/example/data/davinci.txt

For a list of other Hadoop commands that work with files, see [https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html)

> [!WARNING]  
> On Apache HBase clusters, the default block size used when writing data is 256 KB. While this works fine when using HBase APIs or REST APIs, using the `hadoop` or `hdfs dfs` commands to write data larger than ~12 GB results in an error. For more information, see the [storage exception for write on blob](#storageexception) section in this article.

## Graphical clients
There are also several applications that provide a graphical interface for working with Azure Storage. The following table is a list of a few of these applications:

| Client | Linux | OS X | Windows |
| --- |:---:|:---:|:---:|
| [Microsoft Visual Studio Tools for HDInsight](hadoop/apache-hadoop-visual-studio-tools-get-started.md#explore-linked-resources) |✔ |✔ |✔ |
| [Azure Storage Explorer](https://storageexplorer.com/) |✔ |✔ |✔ |
| [Cerulea](https://www.cerebrata.com/products/cerulean/features/azure-storage) | | |✔ |
| [CloudXplorer](http://clumsyleaf.com/products/cloudxplorer) | | |✔ |
| [CloudBerry Explorer for Microsoft Azure](https://www.cloudberrylab.com/free-microsoft-azure-explorer.aspx) | | |✔ |
| [Cyberduck](https://cyberduck.io/) | |✔ |✔ |

### Visual Studio Tools for HDInsight
For more information, see [Navigate the linked resources](hadoop/apache-hadoop-visual-studio-tools-get-started.md#explore-linked-resources).

### <a id="storageexplorer"></a>Azure Storage Explorer
Azure Storage Explorer is a useful tool for inspecting and altering the data in blobs. It is a free, open-source tool that can be downloaded from [https://azure.microsoft.com/features/storage-explorer/](https://azure.microsoft.com/features/storage-explorer/). The source code is available from this link as well.

The following steps are for the first time execution of Azure Storage Explorer.

1. Run Azure Storage Explorer.

2. From the **Connect to Azure Storage** window, ensure **Add an Azure Account** is selected and select your Azure environment from the drop-down list.

3. Select **Sign in...**.

    ![HDI.AzureStorageExplorer][image-azure-storage-explorer]

4. Complete the authentication steps.

5. From the menu bar, navigate to **View** > **Explorer**.

6. From the **Explorer** view, navigate to **\<Your Subscription>** > **Storage Accounts** > **\<Your Storage Account>** > **Blob Containers** > **\<Your Blob Container>**.

7. From the tool bar, select the upload icon and then **Upload files...**.

    ![Tool bar with upload icon highlighted](./media/hdinsight-upload-data/toolbar.png)

8. Select the file to upload. Then select **Upload** to upload the file to the root of the storage container. If you want to upload the file to a specific path, enter the path in the **Upload to folder (optional)** text box and then select **Upload**.

    ![File upload dialog](./media/hdinsight-upload-data/fileupload.png)

Once the file has finished uploading, you can use it from jobs on the HDInsight cluster.

## Mount Azure Storage as Local Drive
See [Mount Azure Storage as Local Drive](https://blogs.msdn.com/b/bigdatasupport/archive/2014/01/09/mount-azure-blob-storage-as-local-drive.aspx).

## Upload using services
### Azure Data Factory
The Azure Data Factory service is a fully managed service for composing data storage, data processing, and data movement services into streamlined, scalable, and reliable data production pipelines.

Azure Data Factory can be used to move data into Azure Storage, or to create data pipelines that directly use HDInsight features such as Hive and Pig.

For more information, see the [Azure Data Factory documentation](https://azure.microsoft.com/documentation/services/data-factory/).

### <a id="sqoop"></a>Apache Sqoop
Sqoop is a tool designed to transfer data between Hadoop and relational databases. You can use it to import data from a relational database management system (RDBMS), such as SQL Server, MySQL, or Oracle into the Hadoop distributed file system (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS.

For more information, see [Use Sqoop with HDInsight][hdinsight-use-sqoop].

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

1. In your browser, go to the Ambari Web UI for your cluster. This is https://CLUSTERNAME.azurehdinsight.net, where **CLUSTERNAME** is the name of your cluster.

    When prompted, enter the admin name and password for the cluster.
2. From the left side of the screen, select **HDFS**, and then select the **Configs** tab.
3. In the **Filter...** field, enter `fs.azure.write.request.size`. This displays the field and current value in the middle of the page.
4. Change the value from 262144 (256 KB) to the new value. For example, 4194304 (4 MB).

![Image of changing the value through Ambari Web UI](./media/hdinsight-upload-data/hbase-change-block-write-size.png)

For more information on using Ambari, see [Manage HDInsight clusters using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

## Next steps
Now that you understand how to get data into HDInsight, read the following articles to learn how to perform analysis:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Submit Apache Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Use Apache Hive with HDInsight][hdinsight-use-hive]
* [Use Apache Pig with HDInsight][hdinsight-use-pig]

[azure-management-portal]: https://porta.azure.com


[azure-storage-client-library]: /develop/net/how-to-guides/blob-storage/

[azure-azcopy-download]:../storage/common/storage-use-azcopy.md
[azure-azcopy]:../storage/common/storage-use-azcopy.md

[hdinsight-use-sqoop]:hadoop/hdinsight-use-sqoop.md

[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-adls-gen1]: hdinsight-hadoop-use-data-lake-store.md
[hdinsight-adls-gen2]: ../storage/data-lake-storage/use-hdi-cluster.md
[hdinsight-submit-jobs]:hadoop/submit-apache-hadoop-jobs-programmatically.md
[hdinsight-get-started]:hadoop/apache-hadoop-linux-tutorial-get-started.md

[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-use-pig]:hadoop/hdinsight-use-pig.md

[sqldatabase-create-configure]: ../sql-database-create-configure.md

[apache-sqoop-guide]: https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html

[Powershell-install-configure]: /powershell/azureps-cmdlets-docs


[image-azure-storage-explorer]: ./media/hdinsight-upload-data/HDI.AzureStorageExplorer.png
[image-ase-addaccount]: ./media/hdinsight-upload-data/HDI.ASEAddAccount.png
[image-ase-blob]: ./media/hdinsight-upload-data/HDI.ASEBlob.png
