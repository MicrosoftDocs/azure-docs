<properties
   pageTitle="Azure Storage options for R Server on HDInsight (preview) | Azure"
   description="Learn the different storage options available to users with R Server on HDInsight (preview)"
   services="HDInsight"
   documentationCenter=""
   authors="jeffstokes72"
   manager="paulettem"
   editor="cgronlun"
/>

<tags
   ms.service="HDInsight"
   ms.devlang="R"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-services"
   ms.date="03/28/2016"
   ms.author="jeffstok"
/>

# Azure Storage options for R Server on HDInsight (preview)

R Server on HDInsight (preview) has access to both Azure Blob, and soon Azure Data Lake storage, as means of persisting data, code, result objects from analysis, etc.

When you create a Hadoop cluster in HDInsight, you specify an Azure Storage account. A specific Blob storage container from that account is designated to hold the file system for the cluster you create, i.e. the Hadoop Distributed File System (HDFS).  For the purposes of performance, the HDInsight cluster is created in the same data center as the primary storage account you specify. For more information, see [Use Azure Blob storage with HDInsight](hdinsight-hadoop-use-blob-storage.md "Use Azure Blob storage with HDInsight").   


## Use multiple Azure Blob Storage Accounts

If needed, it is possible to access multiple Azure storage accounts or containers with your HDI cluster. To do so you will need to specify the additional storage accounts in the UI at cluster creation and follow these steps to use them in R.  

1.	Suppose you create an HDInsight cluster with a storage account name of “storage1” with default container “container1”.  You also specify an additional storage account “storage2".  
2.	Now you copy a file “mycsv.csv” to directory “/share” and want to perform analysis on that file.  

    hadoop fs –mkdir /share
    hadoop fs –copyFromLocal myscsv.scv /share  

3.	In R code you set the name node to “default” and set your directory and file to process  

    myNameNode <- "default"
    myPort <- 0

  Location of the data  

    bigDataDirRoot <- "/share"  

  define Spark compute context

    mySparkCluster <- RxSpark(consoleOutput=TRUE)

  set compute context

    rxSetComputeContext(mySparkCluster)

  define HDFS file system

    hdfsFS <- RxHdfsFileSystem(hostName=myNameNode, port=myPort)

  specify the input file in HDFS to analyze

    inputFile <-file.path(bigDataDirRoot,"mycsv.csv")
 
All of the directory and file references point to storage account wasb://container1@storage1.blob.core.windows.net because this is the **default storage account** associated with the HDInsight cluster.

Now suppose you want to process a file called “mySpecial.csv” that is located in directory “/private” of container “container2” on storage account name “storage2”.

In your R code you change the name node reference to the “storage2" storage account.

    myNameNode <- "wasb://container2@storage2.blob.core.windows.net"
    myPort <- 0

  Location of the data

    bigDataDirRoot <- "/private"

  define Spark compute context

    mySparkCluster <- RxSpark(consoleOutput=TRUE)

  set compute context

    rxSetComputeContext(mySparkCluster)

  define HDFS file system

    hdfsFS <- RxHdfsFileSystem(hostName=myNameNode, port=myPort)

  specify the input file in HDFS to analyze

    inputFile <-file.path(bigDataDirRoot,"mySpecial.csv")
 
All of the directory and file references now point to storage account wasb://container2@storage2.blob.core.windows.net because this is the **Name Node** you’ve specified.

Note that you will have to configure the /user/RevoShare/<SSH username> directory on storage account “storage2”:

    hadoop fs -mkdir wasb://container2@storage2.blob.core.windows.net/user
    hadoop fs -mkdir wasb://container2@storage2.blob.core.windows.net/user/RevoShare
    hadoop fs -mkdir wasb://container2@storage2.blob.core.windows.net/user/RevoShare/<RDP username>


## Use Azure Files on the Edge Node 

There is also a convenient data storage option for use on the edge node called [Azure Files](../storage/storage-how-to-use-files-linux.md "Azure Files") that allows you to mount an Azure Storage file share to the Linux file system. This can be handy for storing data files, R scripts, and result objects that may be needed later when it makes sense to use the native file system on the edge node rather than HDFS. A big benefit of using Azure Files is that the file shares can be mounted and used by any system with a supported OS (Win, Linux), e.g. another HDInsight cluster you or someone on your team has, an Azure VM, or even an on-premises system.


## Next steps

Now that you understand how to create a new HDInsight cluster that includes R Server, and the basics of using the R console from an SSH session, use the following to discover other ways of working with R Server on HDInsight.

- [Overview of R Server on Hadoop](hdinsight-hadoop-r-server-overview.md)
- [Get started with R server on Hadoop](hdinsight-hadoop-r-server-get-started.md)
- [Add RStudio Server to HDInsight premium](hdinsight-hadoop-r-server-install-r-studio.md)
- [Compute context options for R Server on HDInsight premium](hdinsight-hadoop-r-server-compute-contexts.md)
