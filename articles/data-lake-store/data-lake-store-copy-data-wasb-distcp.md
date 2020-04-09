---
title: Copy data to and from WASB into Azure Data Lake Storage Gen1 using DistCp
description: Use the DistCp tool to copy data to and from Azure Storage blobs to Azure Data Lake Storage Gen1

author: twooley
ms.service: data-lake-store
ms.topic: conceptual
ms.date: 01/03/2020
ms.author: twooley

---

# Use DistCp to copy data between Azure Storage blobs and Azure Data Lake Storage Gen1

> [!div class="op_single_selector"]
> * [Using DistCp](data-lake-store-copy-data-wasb-distcp.md)
> * [Using AdlCopy](data-lake-store-copy-data-azure-storage-blob.md)
>
>

If you have an HDInsight cluster with access to Azure Data Lake Storage Gen1, you can use Hadoop ecosystem tools like DistCp to copy data to and from an HDInsight cluster storage (WASB) into a Data Lake Storage Gen1 account. This article shows how to use the DistCp tool.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Storage Gen1 account**. For instructions on how to create one, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md).
* **Azure HDInsight cluster** with access to a Data Lake Storage Gen1 account. See [Create an HDInsight cluster with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md). Make sure you enable Remote Desktop for the cluster.

## Use DistCp from an HDInsight Linux cluster

An HDInsight cluster comes with the DistCp tool, which can be used to copy data from different sources into an HDInsight cluster. If you've configured the HDInsight cluster to use Data Lake Storage Gen1 as additional storage, you can use DistCp out-of-the-box to copy data to and from a Data Lake Storage Gen1 account. In this section, we look at how to use the DistCp tool.

1. From your desktop, use SSH to connect to the cluster. See [Connect to a Linux-based HDInsight cluster](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md). Run the commands from the SSH prompt.

1. Verify whether you can access the Azure Storage blobs (WASB). Run the following command:

   ```
   hdfs dfs –ls wasb://<container_name>@<storage_account_name>.blob.core.windows.net/
   ```

   The output provides a list of contents in the storage blob.

1. Similarly, verify whether you can access the Data Lake Storage Gen1 account from the cluster. Run the following command:

   ```
   hdfs dfs -ls adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/
   ```

    The output provides a list of files and folders in the Data Lake Storage Gen1 account.

1. Use DistCp to copy data from WASB to a Data Lake Storage Gen1 account.

   ```
   hadoop distcp wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/myfolder
   ```

    The command copies the contents of the **/example/data/gutenberg/** folder in WASB to **/myfolder** in the Data Lake Storage Gen1 account.

1. Similarly, use DistCp to copy data from a Data Lake Storage Gen1 account to WASB.

   ```
   hadoop distcp adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/myfolder wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg
   ```

    The command copies the contents of **/myfolder** in the Data Lake Storage Gen1 account to **/example/data/gutenberg/** folder in WASB.

## Performance considerations while using DistCp

Because the DistCp tool’s lowest granularity is a single file, setting the maximum number of simultaneous copies is the most important parameter to optimize it against Data Lake Storage Gen1. You can control the number of simultaneous copies by setting the number of mappers (‘m’) parameter on the command line. This parameter specifies the maximum number of mappers that are used to copy data. The default value is 20.

Example:

```
 hadoop distcp wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/myfolder -m 100
```

### How to determine the number of mappers to use

Here's some guidance that you can use.

* **Step 1: Determine total YARN memory** - The first step is to determine the YARN memory available to the cluster where you run the DistCp job. This information is available in the Ambari portal associated with the cluster. Navigate to YARN and view the **Configs** tab to see the YARN memory. To get the total YARN memory, multiply the YARN memory per node with the number of nodes you have in your cluster.

* **Step 2: Calculate the number of mappers** - The value of **m** is equal to the quotient of total YARN memory divided by the YARN container size. The YARN container size information is also available in the Ambari portal. Navigate to YARN and view the **Configs** tab. The YARN container size is displayed in this window. The equation to arrive at the number of mappers (**m**) is:

   `m = (number of nodes * YARN memory for each node) / YARN container size`

Example:

Let’s assume that you have four D14v2s nodes in the cluster and you want to transfer 10 TB of data from 10 different folders. Each of the folders contains varying amounts of data and the file sizes within each folder are different.

* Total YARN memory - From the Ambari portal you determine that the YARN memory is 96 GB for a D14 node. So, total YARN memory for four node cluster is:

   `YARN memory = 4 * 96GB = 384GB`

* Number of mappers - From the Ambari portal you determine that the YARN container size is 3072 for a D14 cluster node. So, the number of mappers is:

   `m = (4 nodes * 96GB) / 3072MB = 128 mappers`

If other applications are using memory, you can choose to only use a portion of your cluster’s YARN memory for DistCp.

### Copying large datasets

When the size of the dataset to be moved is large (for example, > 1 TB) or if you have many different folders, consider using multiple DistCp jobs. There's likely no performance gain, but it spreads out the jobs so that if any job fails, you need to only restart that specific job instead of the entire job.

### Limitations

* DistCp tries to create mappers that are similar in size to optimize performance. Increasing the number of mappers may not always increase performance.

* DistCp is limited to only one mapper per file. Therefore, you shouldn't have more mappers than you have files. Because DistCp can assign only one mapper to a file, this limits the amount of concurrency that can be used to copy large files.

* If you have a small number of large files, split them into 256-MB file chunks to give you more potential concurrency.

* If you're copying from an Azure Blob storage account, your copy job may be throttled on the Blob storage side. This degrades the performance of your copy job. To learn more about the limits of Azure Blob storage, see Azure Storage limits at [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md).

## See also

* [Copy data from Azure Storage blobs to Data Lake Storage Gen1](data-lake-store-copy-data-azure-storage-blob.md)
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Storage Gen1](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md)
