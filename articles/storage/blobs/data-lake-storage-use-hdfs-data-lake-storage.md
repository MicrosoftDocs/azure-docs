---
title: Using the HDFS CLI with Azure Data Lake Storage Gen2 Preview
description: Introduction to HDFS CLI for Data Lake Storage Gen2 Preview
services: storage
author: artemuwka
ms.service: storage
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: artek
ms.component: data-lake-storage-gen2
---

# Using the HDFS CLI with Data Lake Storage Gen2

Azure Data Lake Storage Gen2 Preview allows you to manage and access data just as you would with a [Hadoop Distributed File System (HDFS)](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). Whether you have an HDInsight cluster attached or run an Apache Spark job using Azure Databricks to perform analytics on data stored in an Azure Storage account, you can use command-line interface (CLI) to retrieve and manipulate the loaded data.

## HDFS CLI with HDInsight

HDInsight provides access to the distributed file system that is locally attached to the compute nodes. This file system can be accessed by using the shell that directly interacts with the HDFS and other file systems that Hadoop supports. Below are the commonly used commands and the links to useful resources.

>[!IMPORTANT]
>HDInsight cluster billing starts after a cluster is created and stops when the cluster is deleted. Billing is pro-rated per minute, so you should always delete your cluster when it is no longer in use. To learn how to delete a cluster, see our [article on the topic](../../hdinsight/hdinsight-delete-cluster.md). However, data stored in a storage account with Data Lake Storage Gen2 enabled persists even after an HDInsight cluster is deleted.

### Get a list of files or directories

    hdfs dfs -ls <args>

### Create a directory

    hdfs dfs -mkdir [-p] <paths>

### Delete a file or a directory

    hdfs dfs -rm [-skipTrash] URI [URI ...]

### Use the HDFS CLI with an HDInsight Hadoop cluster on Linux

First, establish [remote access to services](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-information#remote-access-to-services). If you pick [SSH](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix) the sample PowerShell code would look as follows:

```PowerShell
#Connect to the cluster via SSH.
ssh sshuser@clustername-ssh.azurehdinsight.net
#Execute basic HDFS commands. Display the hierarchy.
hdfs dfs -ls /
#Create a sample directory.
hdfs dfs -mkdir /samplefolder
```
The connection string can be found at the "SSH + Cluster login" section of the HDInsight cluster blade in Azure portal. SSH credentials were specified at the time of the cluster creation.

For more information on HDFS CLI, see the [official documentation](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html) and the [HDFS Permissions Guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html). To learn more about the ACLs in Databricks, see the [Secrets CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#secrets-cli). 

## HDFS CLI with Azure Databricks

The Databricks provides an easy-to-use CLI built on top of the Databricks REST API. The open-source project is hosted on [GitHub](https://github.com/databricks/databricks-cli). Below are the commonly used commands.

### Get a list of files or directories

    dbfs ls [-l]

### Create a directory

    dbfs mkdirs

### Delete a file

    dbfs rm [-r]

Another way of interacting with Databricks are notebooks. While a notebook has a primary language, you can mix languages by specifying the language magic command %language at the beginning of a cell. Specifically, %sh allows you to execute shell code in your notebook much like in the HDInsight example earlier in this article.

### Get a list of files or directories

    %sh ls <args>

### Create a directory

    %sh mkdir [-p] <paths>

### Delete a file or a directory

    %sh rm [-skipTrash] URI [URI ...]

After starting the Spark cluster in Azure Databricks, you'll create a new notebook. The sample notebook script will look as follows:

    #Execute basic HDFS commands invoking the shell. Display the hierarchy.
    %sh ls /
    #Create a sample directory.
    %sh mkdir /samplefolder
    #Get the ACL of the newly created directory.
    hdfs dfs -getfacl /samplefolder

For more information on Databricks CLI, see the [official documentation](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html). For more information on notebooks, see the [notebooks](https://docs.azuredatabricks.net/user-guide/notebooks/index.html) section of the documentation.

## Set file and directory level permissions

You set and get access permissions at the file and directory level. Here's a few commands to get you started. 

To learn more about file and directory level permissions for the Azure Data Lake Gen2 filesystem, see [Access control in Azure Data Lake Storage Gen2](storage-data-lake-storage-access-control.md).

### Display the Access Control Lists (ACLs) of files and directories

    hdfs dfs -getfacl [-R] <path>

Example:

`hdfs dfs -getfacl -R /dir`

See [getfacl](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#getfacl)

### Set ACLs of files and directories

    hdfs dfs -setfacl [-R] [-b|-k -m|-x <acl_spec> <path>]|[--set <acl_spec> <path>]

Example:

`hdfs dfs -setfacl -m user:hadoop:rw- /file`

See [setfacl](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#setfacl)

### Change the owner of files

    hdfs dfs -chown [-R] <new_owner>:<users_group> <URI>

See [chown](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#chown)

### Change group association of files

    hdfs dfs -chgrp [-R] <group> <URI>

See [chgrp](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#chgrp)

### Change the permissions of files

    hdfs dfs -chmod [-R] <mode> <URI>

See [chmod](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#chmod)

You can view the complete list of commands on the [Apache Hadoop 2.4.1 File System Shell Guide](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html) Website.

## Next steps

[Use an Azure Data Lake Storage Gen2 capable account in Azure Databricks](./data-lake-storage-quickstart-create-databricks-account.md) 