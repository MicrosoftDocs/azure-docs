---
title: Azure Data Lake Storage Gen2 overview in HDInsight
description: Overview of Data Lake Storage Gen2 in HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 04/21/2020
---

# Azure Data Lake Storage Gen2 overview in HDInsight

Azure Data Lake Storage Gen2 takes core features from Azure Data Lake Storage Gen1 and integrates them into Azure Blob storage. These features include a file system that is compatible with Hadoop, Azure Active Directory (Azure AD), and POSIX-based access control lists (ACLs). This combination allows you to take advantage of the performance of Azure Data Lake Storage Gen1. While also using the tiering and data life-cycle management of Blob storage.

For more information on Azure Data Lake Storage Gen2, see [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md).

## Core functionality of Azure Data Lake Storage Gen2

* **Access that is compatible with Hadoop:** In Azure Data Lake Storage Gen2, you can manage and access data just as you would with a Hadoop Distributed File System (HDFS). The Azure Blob File System (ABFS) driver is available within all Apache Hadoop environments, including Azure HDInsight and Azure Databricks. Use ABFS to access data stored in Data Lake Storage Gen2.

* **A superset of POSIX permissions:** The security model for Data Lake Gen2 supports ACL and POSIX permissions along with some extra granularity specific to Data Lake Storage Gen2. Settings can be configured through admin tools or frameworks like Apache Hive and Apache Spark.

* **Cost effectiveness:** Data Lake Storage Gen2 offers low-cost storage capacity and transactions. Azure Blob storage life cycles help lower costs by adjusting billing rates as data moves through its life cycle.

* **Compatibility with Blob storage tools, frameworks, and apps:** Data Lake Storage Gen2 continues to work with a wide array of tools, frameworks, and applications for Blob storage.

* **Optimized driver:** The ABFS driver is optimized specifically for big data analytics. The corresponding REST APIs are surfaced through the distributed file system (DFS) endpoint, dfs.core.windows.net.

## What's new for Azure Data Lake Storage Gen 2

### Managed identities for secure file access

Azure HDInsight uses managed identities to secure cluster access to files in Azure Data Lake Storage Gen2. Managed identities are a feature of Azure Active Directory that provides Azure services with a set of automatically managed credentials. These credentials can be used to authenticate to any service that supports Active Directory authentication. Using managed identities doesn't require you to store credentials in code or configuration files.

For more information, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

### Azure Blob File System driver

Apache Hadoop applications natively expect to read and write data from local disk storage. A Hadoop file system driver like ABFS enables Hadoop applications to work with cloud storage. Works by emulating regular Hadoop file system operations. The driver converts those commands received from the application into operations that the actual cloud storage platform understands.

Previously, the Hadoop file system driver converted all file system operations to Azure Storage REST API calls on the client side. And then invoked the REST API. This client-side conversion, however, resulted in multiple REST API calls for a single file system operation like the renaming of a file. ABFS has moved the Hadoop file system logic from the client side to the server side. The Azure Data Lake Storage Gen2 API now runs in parallel with the Blob API. This migration improves performance because now common Hadoop file system operations can be executed with one REST API call.

For more information, see [The Azure Blob Filesystem driver (ABFS): A dedicated Azure Storage driver for Hadoop](../storage/blobs/data-lake-storage-abfs-driver.md).

### URI scheme for Azure Data Lake Storage Gen 2

Azure Data Lake Storage Gen2 uses a new URI scheme to access files in Azure Storage from HDInsight:

`abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/<PATH>`

The URI scheme provides SSL-encrypted access.

`<FILE_SYSTEM_NAME>` identifies the path of the file system Data Lake Storage Gen2.

`<ACCOUNT_NAME>` identifies the Azure Storage account name. A fully qualified domain name (FQDN) is required.

`<PATH>` is the file or directory HDFS path name.

If values for `<FILE_SYSTEM_NAME>` and `<ACCOUNT_NAME>` aren't specified, the default file system is used. For the files on the default file system, use a relative path or an absolute path. For example, the `hadoop-mapreduce-examples.jar` file that comes with HDInsight clusters can be referred to by using one of the following paths:

```
abfs://myfilesystempath@myaccount.dfs.core.windows.net/example/jars/hadoop-mapreduce-examples.jar
abfs:///example/jars/hadoop-mapreduce-examples.jar /example/jars/hadoop-mapreduce-examples.jar
```

> [!NOTE]
> The file name is `hadoop-examples.jar` in HDInsight versions 2.1 and 1.6 clusters. When you're working with files outside of HDInsight, you'll find that most utilities don't recognize the ABFS format but instead expect a basic path format, such as `example/jars/hadoop-mapreduce-examples.jar`.

For more information, see [Use the Azure Data Lake Storage Gen2 URI](../storage/blobs/data-lake-storage-introduction-abfs-uri.md).

## Next steps

* [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md)
* [Introduction to Azure Storage](../storage/common/storage-introduction.md)
* [Azure Data Lake Storage Gen1 overview](./overview-data-lake-storage-gen1.md)