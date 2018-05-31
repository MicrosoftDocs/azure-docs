---
title: Introduction to the Azure Blob File System URI
description: 
services: storage
keywords: 
author: craigshoemaker
ms.topic: article
ms.author: cshoe
manager: twooley
ms.date: 06/01/2018
ms.service: storage
---

# Introduction to the Azure Blob File System URI

Azure Blob File System (BlobFS) adds a filesystem layer on top of Azure Blob Storage. The hierarchical folder structure is made available to the outside world through the URI.

## URI syntax 

The BlobFS file system can be accessed by using the fully qualified URI, for example:

    hdfs://<name_node_host>/<path>

The URI syntax for BlobFS is:

<pre>blobfs[s]<sup>1</sup>://&lt;container_name&gt;<sup>2</sup>@&lt;account_name&gt;<sup>3</sup>.blob.core.windows.net/&lt;path&gt;<sup>4</sup>/&lt;file_name&gt;<sup>5</sup></pre>

1. **Scheme identifier**: The `blobfs` protocol is used as the scheme identifier. You have the option to connect with or without a secure socket layer (SSL) connection.

2. **Container name**: The parent container that holds the files and folders. 

3. **Account name**: The name given to your storage account during creation. The name must be the fully qualified DNS name of the account.

4. **Paths**: A forward slash delimited (`/`) representation of the directory structure.

5. **File name**: The name of the individual file.

The following items are important to consider when using BlobFS:

* **Cluster access**: Since the account name and key are associated with the cluster during creation, you have full access to the files and folders when accessing a cluster.

* **Read-only access to disconnected folders**: Public folders or blobs not connected to a cluster are available only through read-only permissions.
  
  > [!NOTE]
  > You can list all blobs in a folder and retieve folder metadata of a public folder. For more information, see: [Restrict access to containers and blobs](../storage-manage-access-to-resources.md).

The storage accounts that are defined in the creation process and their keys are stored in *%HADOOP_HOME%/conf/core-site.xml* on the cluster nodes. The default behavior of HDInsight is to use the storage accounts defined in the *core-site.xml* file. You can modify this setting using [Ambari](../../hdinsight/hdinsight-hadoop-manage-ambari.md)