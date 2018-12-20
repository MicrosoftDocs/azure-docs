---
title: Use Azure Data Lake Storage (ADLS) Gen2 with Apache Hadoop in Azure HDInsight
description: Provides an overview of Azure Data Lake Storage Gen2 and how it works with Azure HDInsight.
services: hdinsight,storage
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 11/21/2018
---
# Use Azure Data Lake Storage Gen2 with Apache Hadoop in Azure HDInsight

Azure Data Lake Storage (ADLS) Gen2 takes core features from Azure Data Lake Storage Gen1 such as a Hadoop compatible file system, Azure Active Directory, and POSIX based ACLs and integrates them into Azure Blob Storage. This combination allows you to take advantage of the performance of Azure Data Lake Storage Gen1 while also using Blob Storage’s tiering and data life-cycle management.

## Core functionality of Azure Data Lake Storage Gen2

- Hadoop compatible access: Azure Data Lake Storage Gen2 allows you to manage and access data just as you would with a Hadoop Distributed File System (HDFS). The ABFS driver is available within all Apache Hadoop environments, including Azure HDInsight and Azure Databricks to access data stored in Data Lake Storage Gen2.

- A superset of POSIX permissions: The security model for Data Lake Gen2 supports ACL and POSIX permissions along with some extra granularity specific to Data Lake Storage Gen2. Settings may be configured through admin tools or frameworks like Apache Hive and Apache Spark.

- Cost effective: Data Lake Storage Gen2 offers low-cost storage capacity and transactions. Features such as Azure Blob storage lifecycle help lower costs by adjusting billing rates as data moves through its lifecycle.

- Works with Blob storage tools, frameworks, and apps: Data Lake Storage Gen2 continues to work with a wide array of tools, frameworks, and applications that exist today for Blob storage.

- Optimized driver: The ABFS driver is optimized specifically for big data analytics. The corresponding REST APIs are surfaced through the dfs endpoint, dfs.core.windows.net.

## What's new about Azure Data Lake Storage Gen 2

### Managed identities for secure file access

Azure HDInsight uses managed identities to secure cluster access to files in Azure Data Lake Storage Gen2. Managed identities are a feature of Azure Active Directory that provides Azure services with a set of automatically managed credentials. These credentials can be used to authenticate to any service that supports AD authentication. Using managed identities doesn't require you to store credentials in code or configuration files.

For more information, see [What is managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

### Azure Blob filesystem (ABFS) driver

Apache Hadoop applications natively expect to read and write data from local disk storage. A Hadoop filesystem driver like ABFS enables Hadoop applications to work with cloud storage by emulating regular Hadoop file system operations for the application. The driver then converts those operations into operations that the actual cloud storage platform understands.

Previously, the Hadoop filesystem driver would convert all filesystem operations to Azure Storage REST API calls on the client side and then invoke the REST API. This client-side conversion, however, resulted in multiple REST API calls for a single filesystem operation like a file rename. ABFS has moved some of the Hadoop filesystem logic from the client-side to the server-side and the ADLS Gen2 API now runs in parallel with the Blob API. This migration improves performance because now common Hadoop filesystem operations can be executed with one REST API call.

For more information, see [The Azure Blob Filesystem driver (ABFS): A dedicated Azure Storage driver for Hadoop](../storage/data-lake-storage/abfs-driver.md).

### ADLS Gen 2 URI scheme

ADLS Gen2 uses a new URI scheme for accessing files in Azure storage from HDInsight:

`abfs[s]://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/<PATH>`

The URI scheme provides SSL encrypted access (`abfss://` prefix) and unencrypted access (`abfs://` prefix). We recommend using `abfss` wherever possible, even when accessing data that lives inside the same region in Azure.

`<FILE_SYSTEM_NAME>` identifies the path of the file system Data Lake Storage Gen2.

`<ACCOUNT_NAME>` identifies the Azure Storage account name. A fully qualified domain name (FQDN) is required.

The `<PATH>` is the file or directory HDFS path name.

If values for `<FILE_SYSTEM_NAME>` and `<ACCOUNT_NAME>` aren't specified, the default file system is used. For the files on the default file system, you can use a relative path or an absolute path. For example, the `hadoop-mapreduce-examples.jar` file that comes with HDInsight clusters can be referred to by using one of the following paths:

```
abfss://myfilesystempath@myaccount.dfs.core.windows.net/example/jars/hadoop-mapreduce-examples.jar
abfss:///example/jars/hadoop-mapreduce-examples.jar /example/jars/hadoop-mapreduce-examples.jar
```

> [!Note]
> The file name is `hadoop-examples.jar` in HDInsight versions 2.1 and 1.6 clusters. When working with files outside of HDInsight, most utilities do not recognize the ABFS format and instead expect a basic path format, such as `example/jars/hadoop-mapreduce-examples.jar`.

For more information, see [Use the Azure Data Lake Storage Gen2 URI](../storage/data-lake-storage/introduction-abfs-uri.md).

## Next steps
- [Introduction to Azure Data Lake Storage Gen2](../storage/data-lake-storage/introduction.md)
- [Use Azure Data Lake Storage Gen2 Preview with Azure HDInsight clusters](../storage/data-lake-storage/use-hdi-cluster.md)