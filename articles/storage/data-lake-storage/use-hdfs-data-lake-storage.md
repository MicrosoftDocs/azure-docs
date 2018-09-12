---
title: Using the HDFS CLI with Azure Data Lake Storage Gen2 Preview
description: Introduction to HDFS CLI for Data Lake Storage Gen2 Preview
services: storage
author: artemuwka
ms.service: storage
ms.topic: article
ms.date: 06/27/2018
ms.author: artek
ms.component: data-lake-storage-gen2
---

# Using the HDFS CLI with Data Lake Storage Gen2

Azure Data Lake Storage Gen2 Preview allows you to manage and access data just as you would with a [Hadoop Distributed File System (HDFS)](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). Whether you have an HDInsight cluster attached or run an Apache Spark job using Azure Databricks to perform analytics on data stored in Azure Data Lake Storage Gen2 you can use command-line interface (CLI) to retrieve and manipulate the loaded data. The rest of the article outlines the options you have while the [Azure Storage team is working on adding support for Azure Storage Explorer and Azure portal](https://azure.microsoft.com/roadmap/).

## HDFS CLI with HDInsight

HDInsight provides access to the distributed file system that is locally attached to the compute nodes. This file system can be accessed by using the shell that directly interacts with the HDFS and other file systems that Hadoop supports. Below are the commonly used commands and the links to useful resources.

>[!IMPORTANT]
>HDInsight cluster billing starts once a cluster is created and stops when the cluster is deleted. Billing is pro-rated per minute, so you should always delete your cluster when it is no longer in use (learn how to [delete a cluster](../../hdinsight/hdinsight-delete-cluster.md)). However, data stored in Azure Data Lake Storage Gen2 persists even after an HDInsight cluster is deleted.

To get a list of files or directories:

    hdfs dfs -ls <args>
To create a directory:

    hdfs dfs -mkdir [-p] <paths>
To delete a file or a directory:

    hdfs dfs -rm [-skipTrash] URI [URI ...]


Let's now take HDInsight Hadoop cluster on Linux as an example. To use the HDFS CLI, you first need to establish [remote access to services](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-information#remote-access-to-services). If you pick [SSH](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix) the sample PowerShell code would look as follows:
```PowerShell
#Connect to the cluster via SSH.
ssh sshuser@clustername-ssh.azurehdinsight.net
#Execute basic HDFS commands. Display the hierarchy.
hdfs dfs -ls /
#Create a sample directory.
hdfs dfs -mkdir /samplefolder
```

The connection string can be found at the "SSH + Cluster login" section of the HDInsight cluster blade in Azure portal. SSH credentials were specified at the time of the cluster creation.

For more information on HDFS CLI, see the [official documentation](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html) and the [HDFS Permissions Guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html).

## HDFS CLI with Azure Databricks

The Databricks provides an easy-to-use CLI built on top of the Databricks REST API. The open-source project is hosted on [GitHub](https://github.com/databricks/databricks-cli). Below are the commonly used commands.

To get a list of files or directories:

    dbfs ls [-l]
To create a directory:

    dbfs mkdirs
To delete a file:

    dbfs rm [-r]

Another way of interacting with Databricks are notebooks. While a notebook has a primary language, you can mix languages by specifying the language magic command %language at the beginning of a cell. Specifically, %sh allows you to execute shell code in your notebook much like in the HDInsight example earlier in this article.

To get a list of files or directories:

    %sh ls <args>
To create a directory:

    %sh mkdir [-p] <paths>
To delete a file or a directory:

    %sh rm [-skipTrash] URI [URI ...]

After starting the Spark cluster in Azure Databricks, you'll create a new notebook. The sample notebook script will look as follows:

    #Execute basic HDFS commands invoking the shell. Display the hierarchy.
    %sh ls /
    #Create a sample directory.
    %sh mkdir /samplefolder

For more information on Databricks CLI, see the [official documentation](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html). For more information on notebooks, see the [notebooks](https://docs.azuredatabricks.net/user-guide/notebooks/index.html) section of the documentation.

## Next steps

- [Create an HDInsight cluster with Azure Data Lake Storage Gen2](./quickstart-create-connect-hdi-cluster.md)
- [Use an Azure Data Lake Storage Gen2 capable account in Azure Databricks](./quickstart-create-databricks-account.md) 