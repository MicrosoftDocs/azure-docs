---
title: Copy data to and from WASB into Azure Data Lake Storage Gen1 using Distcp| Microsoft Docs
description: Use Distcp tool to copy data to and from Azure Storage Blobs to Azure Data Lake Storage Gen1
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: ae2e9506-69dd-4b95-8759-4dadca37ea70
ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: nitinme

---
# Use Distcp to copy data between Azure Storage Blobs and Azure Data Lake Storage Gen1
> [!div class="op_single_selector"]
> * [Using DistCp](data-lake-store-copy-data-wasb-distcp.md)
> * [Using AdlCopy](data-lake-store-copy-data-azure-storage-blob.md)
>
>

If you have an HDInsight cluster with access to Azure Data Lake Storage Gen1, you can use Hadoop ecosystem tools like Distcp to copy data **to and from** an HDInsight cluster storage (WASB) into a Data Lake Storage Gen1 account. This article provides instructions on how use the Distcp tool.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Storage Gen1 account**. For instructions on how to create one, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md)
* **Azure HDInsight cluster** with access to a Data Lake Storage Gen1 account. See [Create an HDInsight cluster with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md). Make sure you enable Remote Desktop for the cluster.

## Do you learn fast with videos?
[Watch this video](https://mix.office.com/watch/1liuojvdx6sie) on how to copy data between Azure Storage Blobs and Data Lake Storage Gen1 using DistCp.

## Use Distcp from an HDInsight Linux cluster

An HDInsight cluster comes with the Distcp utility, which can be used to copy data from different sources into an HDInsight cluster. If you have configured the HDInsight cluster to use Data Lake Storage Gen1 as additional storage, the Distcp utility can be used out-of-the-box to copy data to and from a Data Lake Storage Gen1 account as well. In this section, we look at how to use the Distcp utility.

1. From your desktop, use SSH to connect to the cluster. See [Connect to a Linux-based HDInsight cluster](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md). Run the commands from the SSH prompt.

2. Verify whether you can access the Azure Storage Blobs (WASB). Run the following command:

        hdfs dfs –ls wasb://<container_name>@<storage_account_name>.blob.core.windows.net/

    The output should provide a list of contents in the storage blob.

3. Similarly, verify whether you can access the Data Lake Storage Gen1 account from the cluster. Run the following command:

        hdfs dfs -ls adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/

    The output should provide a list of files/folders in the Data Lake Storage Gen1 account.

4. Use Distcp to copy data from WASB to a Data Lake Storage Gen1 account.

        hadoop distcp wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/myfolder

    The command copies the contents of the **/example/data/gutenberg/** folder in WASB to **/myfolder** in the Data Lake Storage Gen1 account.

5. Similarly, use Distcp to copy data from Data Lake Storage Gen1 account to WASB.

        hadoop distcp adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/myfolder wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg

    THe command copies the contents of **/myfolder** in the Data Lake Storage Gen1 account to **/example/data/gutenberg/** folder in WASB.

## Performance considerations while using DistCp

Because DistCp’s lowest granularity is a single file, setting the maximum number of simultaneous copies is the most important parameter to optimize it against Data Lake Storage Gen1. Number of simultaneous copies is controlled by setting the number of mappers (‘m’) parameter on the command line. This parameter specifies the maximum number of mappers that are used to copy data. Default value is 20.

**Example**

	hadoop distcp wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg adl://<data_lake_storage_gen1_account>.azuredatalakestore.net:443/myfolder -m 100

### How do I determine the number of mappers to use?

Here's some guidance that you can use.

* **Step 1: Determine total YARN memory** - The first step is to determine the YARN memory available to the cluster where you run the DistCp job. This information is available in the Ambari portal associated with the cluster. Navigate to YARN and view the Configs tab to see the YARN memory. To get the total YARN memory, multiply the YARN memory per node with the number of nodes you have in your cluster.

* **Step 2: Calculate the number of mappers** - The value of **m** is equal to the quotient of total YARN memory divided by the YARN container size. The YARN container size information is available in the Ambari portal as well. Navigate to YARN and view the Configs tab. The YARN container size is displayed in this window. The equation to arrive at the number of mappers (**m**) is

		m = (number of nodes * YARN memory for each node) / YARN container size

**Example**

Let’s assume that you have a 4 D14v2s nodes in the cluster and you are trying to transfer 10 TB of data from 10 different folders. Each of the folders contains varying amounts of data and the file sizes within each folder are different.

* Total YARN memory - From the Ambari portal you determine that the YARN memory is 96 GB for a D14 node. So, total YARN memory for four node cluster is: 

		YARN memory = 4 * 96GB = 384GB

* Number of mappers - From the Ambari portal you determine that the YARN container size is 3072 for a D14 cluster node. So, number of mappers is:

		m = (4 nodes * 96GB) / 3072MB = 128 mappers

If other applications are using memory, then you can choose to only use a portion of your cluster’s YARN memory for DistCp.

### Copying large datasets

When the size of the dataset to be moved is large (for example, >1 TB) or if you have many different folders, you should consider using multiple DistCp jobs. There is likely no performance gain, but it spreads out the jobs so that if any job fails, you only need to restart that specific job rather than the entire job.

### Limitations

* DistCp tries to create mappers that are similar in size to optimize performance. Increasing the number of mappers may not always increase performance.

* DistCp is limited to only one mapper per file. Therefore, you should not have more mappers than you have files. Since DistCp can only assign one mapper to a file, this limits the amount of concurrency that can be used to copy large files.

* If you have a small number of large files, then you should split them into 256 MB file chunks to give you more potential concurrency. 
 
* If you are copying from an Azure Blob Storage account, your copy job may be throttled on the blob storage side. This degrades the performance of your copy job. To learn more about the limits of Azure Blob Storage, see Azure Storage limits at [Azure subscription and service limits](../azure-subscription-service-limits.md).

## See also
* [Copy data from Azure Storage Blobs to Data Lake Storage Gen1](data-lake-store-copy-data-azure-storage-blob.md)
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Storage Gen1](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md)
