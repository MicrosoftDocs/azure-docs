---
title: "Use the Azure Data Lake Storage URI (ABFS)"
titleSuffix: Azure Storage
description: "Learn the ABFS URI syntax for Azure Data Lake Storage to address files and directories in your storage account. Discover how to use the Azure Blob File System driver effectively."
author: normesta

ms.topic: concept-article
ms.author: normesta
ms.date: 07/02/2026
ms.service: azure-data-lake-storage
ms.reviewer: jamesbak
# Customer intent: "As a data engineer, I want to understand the URI syntax for the ABFS scheme in Azure Data Lake Storage, so that I can effectively address files and directories within my storage account."
---

# Use the Azure Data Lake Storage URI (ABFS)

The [Hadoop Filesystem](https://www.aosabook.org/en/hdfs.html) driver that's compatible with Azure Data Lake Storage uses the scheme identifier `abfs` (Azure Blob File System). Like other Hadoop Filesystem drivers, the ABFS driver uses a URI format to address files and directories within a Data Lake Storage enabled account.

<a id="uri-syntax"></a>

## ABFS URI syntax for Azure Data Lake Storage

The Azure Blob File System driver works with the Data Lake Storage endpoint of an account even if that account doesn't have a hierarchical namespace enabled. If the storage account doesn't have a hierarchical namespace, use the following shorthand URI syntax:

<pre>abfs[s]<sup>1</sup>://&lt;file_system&gt;<sup>2</sup>@&lt;account_name&gt;<sup>3</sup>.dfs.core.windows.net/&lt;path&gt;<sup>4</sup>/&lt;file_name&gt;<sup>5</sup></pre>

1. **Scheme identifier**: The `abfs` protocol is used as the scheme identifier. If you add an `s` at the end (abfs<b><i>s</i></b>), the ABFS Hadoop client driver always uses Transport Layer Security (TLS) regardless of the authentication method chosen. If you choose OAuth as your authentication, the client driver always uses TLS even if you specify `abfs` instead of `abfss` because OAuth solely relies on the TLS layer. Finally, if you choose to use the older method of storage account key, the client driver interprets `abfs` to mean that you don't want to use TLS.

2. **File system**: The parent location that holds the files and folders. This location is the same as containers in the Azure Storage Blob service.

3. **Account name**: The name you give to your storage account during creation.

4. **Paths**: A forward slash delimited (`/`) representation of the directory structure.

5. **File name**: The name of the individual file. This parameter is optional if you're addressing a directory.

If the account you want to address has a hierarchical namespace, use the following shorthand URI syntax:

<pre>/&lt;path&gt;<sup>1</sup>/&lt;file_name&gt;<sup>2</sup></pre>

1. **Path**: A forward slash delimited (`/`) representation of the directory structure.

2. **File Name**: The name of the individual file.

## Next steps

- [Use Azure Data Lake Storage with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md?toc=/azure/storage/blobs/toc.json)
