---
title: Using the HDFS CLI with Azure Data Lake Storage Gen2
description: Introduction to HDFS CLI for Data Lake Storage Gen2
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 12/06/2018
ms.author: normesta
ms.subservice: data-lake-storage-gen2
ms.reviewer: artek
---

# Using the HDFS CLI with Data Lake Storage Gen2

You can access and manage the data in your storage account by using a command line interface just as you would with a [Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). This article provides some examples that will help you get started.

HDInsight provides access to the distributed container that is locally attached to the compute nodes. You can access this container by using the shell that directly interacts with the HDFS and the other file systems that Hadoop supports.

For more information on HDFS CLI, see the [official documentation](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html) and the [HDFS Permissions Guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html)

>[!NOTE]
>If you're using Azure Databricks instead of HDInsight, and you want to interact with your data by using a command line interface, you can use the Databricks CLI to interact with the Databricks file system. See [Databricks CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html).

## Use the HDFS CLI with an HDInsight Hadoop cluster on Linux

First, establish [remote access to services](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-information#remote-access-to-services). If you pick [SSH](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix) the sample PowerShell code would look as follows:

```powershell
#Connect to the cluster via SSH.
ssh sshuser@clustername-ssh.azurehdinsight.net
#Execute basic HDFS commands. Display the hierarchy.
hdfs dfs -ls /
#Create a sample directory.
hdfs dfs -mkdir /samplefolder
```
The connection string can be found at the "SSH + Cluster login" section of the HDInsight cluster blade in Azure portal. SSH credentials were specified at the time of the cluster creation.

>[!IMPORTANT]
>HDInsight cluster billing starts after a cluster is created and stops when the cluster is deleted. Billing is pro-rated per minute, so you should always delete your cluster when it is no longer in use. To learn how to delete a cluster, see our [article on the topic](../../hdinsight/hdinsight-delete-cluster.md). However, data stored in a storage account with Data Lake Storage Gen2 enabled persists even after an HDInsight cluster is deleted.

## Create a container

    hdfs dfs -D "fs.azure.createRemoteFileSystemDuringInitialization=true" -ls abfs://<container-name>@<storage-account-name>.dfs.core.windows.net/

* Replace the `<container-name>` placeholder with the name that you want to give your container.

* Replace the `<storage-account-name>` placeholder with the name of your storage account.

## Get a list of files or directories

    hdfs dfs -ls <path>

Replace the `<path>` placeholder with the URI of the container or container folder.

For example: `hdfs dfs -ls abfs://my-file-system@mystorageaccount.dfs.core.windows.net/my-directory-name`

## Create a directory

    hdfs dfs -mkdir [-p] <path>

Replace the `<path>` placeholder with the root container name or a folder within your container.

For example: `hdfs dfs -mkdir abfs://my-file-system@mystorageaccount.dfs.core.windows.net/`

## Delete a file or directory

    hdfs dfs -rm <path>

Replace the `<path>` placeholder with the URI of the file or folder that you want to delete.

For example: `hdfs dfs -rmdir abfs://my-file-system@mystorageaccount.dfs.core.windows.net/my-directory-name/my-file-name`

## Display the Access Control Lists (ACLs) of files and directories

    hdfs dfs -getfacl [-R] <path>

Example:

`hdfs dfs -getfacl -R /dir`

See [getfacl](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#getfacl)

## Set ACLs of files and directories

    hdfs dfs -setfacl [-R] [-b|-k -m|-x <acl_spec> <path>]|[--set <acl_spec> <path>]

Example:

`hdfs dfs -setfacl -m user:hadoop:rw- /file`

See [setfacl](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#setfacl)

## Change the owner of files

    hdfs dfs -chown [-R] <new_owner>:<users_group> <URI>

See [chown](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#chown)

## Change group association of files

    hdfs dfs -chgrp [-R] <group> <URI>

See [chgrp](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#chgrp)

## Change the permissions of files

    hdfs dfs -chmod [-R] <mode> <URI>

See [chmod](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html#chmod)

You can view the complete list of commands on the [Apache Hadoop 2.4.1 File System Shell Guide](https://hadoop.apache.org/docs/r2.4.1/hadoop-project-dist/hadoop-common/FileSystemShell.html) Website.

## Next steps

* [Use an Azure Data Lake Storage Gen2 capable account in Azure Databricks](./data-lake-storage-quickstart-create-databricks-account.md)

* [Learn about access control lists on files and directories](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control)
