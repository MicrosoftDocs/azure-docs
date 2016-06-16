<properties
   pageTitle="Copy data to and from WASB into Data Lake Store using Distcp| Microsoft Azure"
   description="Use Distcp tool to copy data to and from Azure Storage Blobs to Data Lake Store"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="05/11/2016"
   ms.author="nitinme"/>

# Use Distcp to copy data between Azure Storage Blobs and Data Lake Store

Once you have created an HDInsight cluster that has access to a Data Lake Store account, you can use Hadoop ecosystem tools like Distcp to copy data **to and from** an HDInsight cluster storage (WASB) into a Data Lake Store account. This article provides instructions on how to achieve this.

##Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).
- **Azure HDInsight cluster** with access to a Data Lake Store account. See [Create an HDInsight cluster with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md). Make sure you enable Remote Desktop for the cluster.

## Do you learn fast with videos?

[Watch this video](https://mix.office.com/watch/1liuojvdx6sie) on how to copy data between Azure Storage Blobs and Data Lake Store using DistCp.

## Use Distcp from Remote Desktop (Windows cluster) or SSH (Linux cluster)

An HDInsight cluster comes with the Distcp utility, which can be used to copy data from different sources into an HDInsight cluster. If you have configured the HDInsight cluster to use Data Lake Store as an additional storage, the Distcp utility can be used out-of-the-box to copy data to and from a Data Lake Store account as well. In this section we look at how to use the Distcp utility.

1. If you have a Windows cluster, remote into an HDInsight cluster that has access to a Data Lake Store account. For instructions, see [Connect to clusters using RDP](../hdinsight/hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp). From the cluster Desktop, open the Hadoop command line.

	If you have a Linux cluster, use SSH to connect to the cluster. See [Connect to a Linux-based HDInsight cluster](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md#connect-to-a-linux-based-hdinsight-cluster). Run the commands from the SSH prompt.

3. Verify whether you can access the Azure Storage Blobs (WASB). Run the following command:

		hdfs dfs –ls wasb://<container_name>@<storage_account_name>.blob.core.windows.net/

	This should provide a list of contents in the storage blob.

4. Similarly, verify whether you can access the Data Lake Store account from the cluster. Run the following command:

		hdfs dfs -ls adl://<data_lake_store_account>.azuredatalakestore.net:443/

	This should provide a list of files/folders in the Data Lake Store account.

5. Use Distcp to copy data from WASB to a Data Lake Store account.

		hadoop distcp wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg adl://<data_lake_store_account>.azuredatalakestore.net:443/myfolder

	This will copy the contents of the **/example/data/gutenberg/** folder in WASB to **/myfolder** in the Data Lake Store account.

6. Similarly, use Distcp to copy data from Data Lake Store account to WASB.

		hadoop distcp adl://<data_lake_store_account>.azuredatalakestore.net:443/myfolder wasb://<container_name>@<storage_account_name>.blob.core.windows.net/example/data/gutenberg

	This will copy the contents of **/myfolder** in the Data Lake Store account to **/example/data/gutenberg/** folder in WASB.

## See also

- [Copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-azure-storage-blob.md)
- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
