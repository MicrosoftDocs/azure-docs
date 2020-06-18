---
title: Copy data into Azure Data Lake Storage Gen2 using DistCp| Microsoft Docs
description: Use DistCp tool to copy data to and from Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 12/06/2018
ms.author: normesta
ms.reviewer: stewu
---

# Use DistCp to copy data between Azure Storage Blobs and Azure Data Lake Storage Gen2

You can use [DistCp](https://hadoop.apache.org/docs/stable/hadoop-distcp/DistCp.html) to copy data between a general purpose V2 storage account and a general purpose V2 storage account with hierarchical namespace enabled. This article provides instructions on how use the DistCp tool.

DistCp provides a variety of command-line parameters and we strongly encourage you to read this article in order to optimize your usage of it. This article shows basic functionality while focusing on its use for copying data to a hierarchical namespace enabled account.

## Prerequisites

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* An existing Azure Storage account without Data Lake Storage Gen2 capabilities (hierarchical namespace) enabled.
* An Azure Storage account with Data Lake Storage Gen2 capabilities (hierarchical namespace) enabled. For instructions on how to create one, see [Create an Azure Storage account](../common/storage-account-create.md)
* A container that has been created in the storage account with hierarchical namespace enabled.
* An Azure HDInsight cluster with access to a storage account with the hierarchical namespace feature enabled. See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json). Make sure you enable Remote Desktop for the cluster.

## Use DistCp from an HDInsight Linux cluster

An HDInsight cluster comes with the DistCp utility, which can be used to copy data from different sources into an HDInsight cluster. If you have configured the HDInsight cluster to use Azure Blob Storage and Azure Data Lake Storage together, the DistCp utility can be used out-of-the-box to copy data between as well. In this section, we look at how to use the DistCp utility.

1. Create an SSH session to your HDI cluster. See [Connect to a Linux-based HDInsight cluster](../../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

2. Verify whether you can access your existing general purpose V2 account (without hierarchical namespace enabled).

        hdfs dfs –ls wasbs://<container-name>@<storage-account-name>.blob.core.windows.net/

   The output should provide a list of contents in the container.

3. Similarly, verify whether you can access the storage account with hierarchical namespace enabled from the cluster. Run the following command:

        hdfs dfs -ls abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/

    The output should provide a list of files/folders in the Data Lake storage account.

4. Use DistCp to copy data from WASB to a Data Lake Storage account.

        hadoop distcp wasbs://<container-name>@<storage-account-name>.blob.core.windows.net/example/data/gutenberg abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/myfolder

    The command copies the contents of the **/example/data/gutenberg/** folder in Blob storage to **/myfolder** in the Data Lake Storage account.

5. Similarly, use DistCp to copy data from Data Lake Storage account to Blob Storage (WASB).

        hadoop distcp abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/myfolder wasbs://<container-name>@<storage-account-name>.blob.core.windows.net/example/data/gutenberg

    The command copies the contents of **/myfolder** in the Data Lake Store account to **/example/data/gutenberg/** folder in WASB.

## Performance considerations while using DistCp

Because DistCp's lowest granularity is a single file, setting the maximum number of simultaneous copies is the most important parameter to optimize it against Data Lake Storage. Number of simultaneous copies is equal to the number of mappers (**m**) parameter on the command line. This parameter specifies the maximum number of mappers that are used to copy data. Default value is 20.

**Example**

	hadoop distcp -m 100 wasbs://<container-name>@<storage-account-name>.blob.core.windows.net/example/data/gutenberg abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/myfolder

### How do I determine the number of mappers to use?

Here's some guidance that you can use.

* **Step 1: Determine total memory available to the 'default' YARN app queue** - The first step is to determine the memory available to the 'default' YARN app queue. This information is available in the Ambari portal associated with the cluster. Navigate to YARN and view the Configs tab to see the YARN memory available to the 'default' app queue. This is the total available memory for your DistCp job (which is actually a MapReduce job).

* **Step 2: Calculate the number of mappers** - The value of **m** is equal to the quotient of total YARN memory divided by the YARN container size. The YARN container size information is available in the Ambari portal as well. Navigate to YARN and view the Configs tab. The YARN container size is displayed in this window. The equation to arrive at the number of mappers (**m**) is

		m = (number of nodes * YARN memory for each node) / YARN container size

**Example**

Let's assume that you have a 4x D14v2s cluster and you are trying to transfer 10 TB of data from 10 different folders. Each of the folders contains varying amounts of data and the file sizes within each folder are different.

* **Total YARN memory**: From the Ambari portal you determine that the YARN memory is 96 GB for a D14 node. So, total YARN memory for four node cluster is: 

		YARN memory = 4 * 96GB = 384GB

* **Number of mappers**: From the Ambari portal you determine that the YARN container size is 3,072 MB for a D14 cluster node. So, number of mappers is:

		m = (4 nodes * 96GB) / 3072MB = 128 mappers

If other applications are using memory, then you can choose to only use a portion of your cluster’s YARN memory for DistCp.

### Copying large datasets

When the size of the dataset to be moved is large (for example, >1 TB) or if you have many different folders, you should consider using multiple DistCp jobs. There is likely no performance gain, but it spreads out the jobs so that if any job fails, you only need to restart that specific job rather than the entire job.

### Limitations

* DistCp tries to create mappers that are similar in size to optimize performance. Increasing the number of mappers may not always increase performance.

* DistCp is limited to only one mapper per file. Therefore, you should not have more mappers than you have files. Since DistCp can only assign one mapper to a file, this limits the amount of concurrency that can be used to copy large files.

* If you have a small number of large files, then you should split them into 256 MB file chunks to give you more potential concurrency.
