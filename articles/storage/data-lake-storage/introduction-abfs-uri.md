---
title: Use the Azure Data Lake Storage Gen2 Preview URI
description: Use the Azure Data Lake Storage Gen2 Preview URI
services: storage
keywords: 
author: jamesbak
ms.topic: article
ms.author: jamesbak
ms.date: 06/27/2018
ms.service: storage
ms.component: data-lake-storage-gen2
---

# Use the Azure Data Lake Storage Gen2 URI

The [Hadoop Filesystem](http://www.aosabook.org/en/hdfs.html) driver that is compatible with Azure Data Lake Storage Gen2 Preview is known by its scheme identifier `abfs` (Azure Blob File System). Consistent with other Hadoop Filesystem drivers, the ABFS driver employs a URI format to address files and directories within a Data Lake Storage Gen2 capable account.

## URI syntax

The URI syntax for Data Lake Storage Gen2 is dependent on whether or not your storage account is set up to have Data Lake Storage Gen2 as the default file system.

If the Data Lake Storage Gen2 capable account you wish to address **is not** set as the default file system during account creation, then the shorthand URI syntax is:

<pre>abfs[s]<sup>1</sup>://&lt;file_system&gt;<sup>2</sup>@&lt;account_name&gt;<sup>3</sup>.dfs.core.windows.net/&lt;path&gt;<sup>4</sup>/&lt;file_name&gt;<sup>5</sup></pre>

1. **Scheme identifier**: The `abfs` protocol is used as the scheme identifier. You have the option to connect with or without a secure socket layer (SSL) connection. Use `abfss` to connect with a secure socket layer connection.

2. **File system**: The parent location that holds the files and folders. This is the same as Containers in the Azure Storage Blobs service.

3. **Account name**: The name given to your storage account during creation.

4. **Paths**: A forward slash delimited (`/`) representation of the directory structure.

5. **File name**: The name of the individual file. This parameter is optional if you are addressing a directory.

However, if the account you wish to address is set as the default file system during account creation, then the shorthand URI syntax is:

<pre>/&lt;path&gt;<sup>1</sup>/&lt;file_name&gt;<sup>2</sup></pre>

1. **Path**: A forward slash delimited (`/`) representation of the directory structure.

2. **File Name**: The name of the individual file.


## Next steps

- [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](use-hdi-cluster.md)
