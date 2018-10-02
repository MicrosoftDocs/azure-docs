---
title: Azure Storage solutions for ML Services on HDInsight - Azure 
description: Learn about the different storage options available with ML Services on HDInsight
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 06/27/2018
---
# Azure Storage solutions for ML Services on Azure HDInsight

ML Services on HDInsight can use a variety of storage solutions to persist data, code, or objects that contain results from analysis. These include the following options:

- [Azure Blob](https://azure.microsoft.com/services/storage/blobs/)
- [Azure Data Lake Storage](https://azure.microsoft.com/services/data-lake-store/)
- [Azure File storage](https://azure.microsoft.com/services/storage/files/)

You also have the option of accessing multiple Azure storage accounts or containers with your HDInsight cluster. Azure File storage is a convenient data storage option for use on the edge node that enables you to mount an Azure Storage file share to, for example, the Linux file system. But Azure File shares can be mounted and used by any system that has a supported operating system such as Windows or Linux. 

When you create a Hadoop cluster in HDInsight, you specify either an **Azure storage** account or a **Data Lake store**. A specific storage container from that account holds the file system for the cluster that you create (for example, the Hadoop Distributed File System). For more information and guidance, see:

- [Use Azure storage with HDInsight](../hdinsight-hadoop-use-blob-storage.md)
- [Use Data Lake Store with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-store.md)

## Use Azure Blob storage accounts with ML Services cluster

If you specified more than one storage account when creating your ML Services cluster, the following instructions explain how to use a secondary account for data access and operations on an ML Services cluster. Assume the following storage accounts and container: **storage1** and a default container called **container1**, and **storage2** with **container2**.

> [!WARNING]
> For performance purposes, the HDInsight cluster is created in the same data center as the primary storage account that you specify. Using a storage account in a different location than the HDInsight cluster is not supported.

### Use the default storage with ML Services on HDInsight

1. Using an SSH client, connect to the edge node of your cluster. For information on using SSH with HDInsight clusters, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).
  
2. Copy a sample file, mysamplefile.csv, to the /share directory. 

        hadoop fs –mkdir /share
        hadoop fs –copyFromLocal mycsv.scv /share  

3. Switch to R Studio or another R console, and write R code to set the name node to **default** and location of the file you want to access.  

        myNameNode <- "default"
        myPort <- 0

    	#Location of the data:  
        bigDataDirRoot <- "/share"  

    	#Define Spark compute context:
        mySparkCluster <- RxSpark(nameNode=myNameNode, consoleOutput=TRUE)

    	#Set compute context:
        rxSetComputeContext(mySparkCluster)

    	#Define the Hadoop Distributed File System (HDFS) file system:
        hdfsFS <- RxHdfsFileSystem(hostName=myNameNode, port=myPort)

    	#Specify the input file to analyze in HDFS:
        inputFile <-file.path(bigDataDirRoot,"mysamplefile.csv")

All the directory and file references point to the storage account `wasb://container1@storage1.blob.core.windows.net`. This is the **default storage account** that's associated with the HDInsight cluster.

### Use the additional storage with ML Services on HDInsight

Now, suppose you want to process a file called mysamplefile1.csv that's located in the  /private directory of **container2** in **storage2**.

In your R code, point the name node reference to the **storage2** storage account.

	myNameNode <- "wasb://container2@storage2.blob.core.windows.net"
	myPort <- 0

	#Location of the data:
	bigDataDirRoot <- "/private"

	#Define Spark compute context:
	mySparkCluster <- RxSpark(consoleOutput=TRUE, nameNode=myNameNode, port=myPort)

	#Set compute context:
	rxSetComputeContext(mySparkCluster)

	#Define HDFS file system:
	hdfsFS <- RxHdfsFileSystem(hostName=myNameNode, port=myPort)

	#Specify the input file to analyze in HDFS:
	inputFile <-file.path(bigDataDirRoot,"mysamplefile1.csv")

All of the directory and file references now point to the storage account `wasb://container2@storage2.blob.core.windows.net`. This is the **Name Node** that you’ve specified.

You have to configure the /user/RevoShare/<SSH username> directory on **storage2** as follows:


	hadoop fs -mkdir wasb://container2@storage2.blob.core.windows.net/user
	hadoop fs -mkdir wasb://container2@storage2.blob.core.windows.net/user/RevoShare
	hadoop fs -mkdir wasb://container2@storage2.blob.core.windows.net/user/RevoShare/<RDP username>

## Use an Azure Data Lake Store with ML Services cluster 

To use Data Lake Store with your HDInsight cluster, you need to give your cluster access to each Azure Data Lake Store that you want to use. For instructions on how to use the Azure portal to create a HDInsight cluster with an Azure Data Lake Store account as the default storage or as an additional store, see [Create an HDInsight cluster with Data Lake Store using Azure portal](../../data-lake-store/data-lake-store-hdinsight-hadoop-use-portal.md).

You then use the store in your R script much like you did a secondary Azure storage account as described in the previous procedure.

### Add cluster access to your Azure Data Lake Stores
You access a Data Lake store by using an Azure Active Directory (Azure AD) Service Principal that's associated with your HDInsight cluster.

1. When you create your HDInsight cluster, select **Cluster AAD Identity** from the **Data Source** tab.

2. In the **Cluster AAD Identity** dialog box, under **Select AD Service Principal**, select **Create new**.

After you give the Service Principal a name and create a password for it, click **Manage ADLS Access** to associate the Service Principal with your Data Lake Store.

It’s also possible to add cluster access to one or more Data Lake Store accounts following cluster creation. Open the Azure portal entry for a Data Lake Store and go to **Data Explorer > Access > Add**. 

### How to access the Data Lake store from ML Services on HDInsight

Once you’ve given access to a Data Lake Store, you can use the store in ML Services cluster on HDInsight the way you would a secondary Azure storage account. The only difference is that the prefix **wasb://** changes to **adl://** as follows:


	# Point to the ADL store (e.g. ADLtest)
	myNameNode <- "adl://rkadl1.azuredatalakestore.net"
	myPort <- 0

	# Location of the data (assumes a /share directory on the ADL account)
	bigDataDirRoot <- "/share"  

	# Define Spark compute context
	mySparkCluster <- RxSpark(consoleOutput=TRUE, nameNode=myNameNode, port=myPort)

	# Set compute context
	rxSetComputeContext(mySparkCluster)

	# Define HDFS file system
	hdfsFS <- RxHdfsFileSystem(hostName=myNameNode, port=myPort)

	# Specify the input file in HDFS to analyze
	inputFile <-file.path(bigDataDirRoot,"mysamplefile.csv")

The following commands are used to configure the Data Lake Store account with the RevoShare directory and add the sample .csv file from the previous example:


	hadoop fs -mkdir adl://rkadl1.azuredatalakestore.net/user
	hadoop fs -mkdir adl://rkadl1.azuredatalakestore.net/user/RevoShare
	hadoop fs -mkdir adl://rkadl1.azuredatalakestore.net/user/RevoShare/<user>

	hadoop fs -mkdir adl://rkadl1.azuredatalakestore.net/share

	hadoop fs -copyFromLocal /usr/lib64/R Server-7.4.1/library/RevoScaleR/SampleData/mysamplefile.csv adl://rkadl1.azuredatalakestore.net/share

	hadoop fs –ls adl://rkadl1.azuredatalakestore.net/share


## Use Azure File storage with ML Services on HDInsight

There is also a convenient data storage option for use on the edge node called [Azure Files]((https://azure.microsoft.com/services/storage/files/). It enables you to mount an Azure Storage file share to the Linux file system. This option can be handy for storing data files, R scripts, and result objects that might be needed later, especially when it makes sense to use the native file system on the edge node rather than HDFS. 

A major benefit of Azure Files is that the file shares can be mounted and used by any system that has a supported OS such as Windows or Linux. For example, it can be used by another HDInsight cluster that you or someone on your team has, by an Azure VM, or even by an on-premises system. For more information, see:

- [How to use Azure File storage with Linux](../../storage/files/storage-how-to-use-files-linux.md)
- [How to use Azure File storage on Windows](../../storage/files/storage-dotnet-how-to-use-files.md)


## Next steps

* [Overview of ML Services cluster on HDInsight](r-server-overview.md)
* [Get started with ML Services cluster on Hadoop](r-server-get-started.md)
* [Compute context options for ML Services cluster on HDInsight](r-server-compute-contexts.md)

