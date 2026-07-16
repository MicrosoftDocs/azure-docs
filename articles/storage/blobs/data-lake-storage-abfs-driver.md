---
title: "Azure Blob Filesystem driver (ABFS) for Azure Data Lake Storage"
titleSuffix: Azure Storage
description: "Learn how the Azure Blob Filesystem driver (ABFS) provides dedicated Hadoop access to Azure Data Lake Storage. Discover how ABFS improves on WASB"
author: normesta

ms.topic: concept-article
ms.author: normesta
ms.reviewer: jamesbak
ms.date: 07/07/2026
ms.service: azure-data-lake-storage
# Customer intent: As a data engineer, I want to use the Azure Blob File System driver to access Azure Data Lake Storage, so that I can leverage Hadoop tools and frameworks without needing to modify my existing codebase.
---

# The Azure Blob File System driver (ABFS): a dedicated Azure Storage driver for Hadoop

One of the primary access methods for data in Azure Data Lake Storage is via the [Hadoop FileSystem](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/index.html). Data Lake Storage users of Azure Blob Storage can access the Azure Blob File System driver or `ABFS`. ABFS is part of Apache Hadoop and is included in many of the commercial distributions of Hadoop. By using the ABFS driver, many applications and frameworks can access data in Azure Blob Storage without any code explicitly referencing Data Lake Storage.

## Prior capability: the Windows Azure Storage Blob driver

The Windows Azure Storage Blob driver or [WASB driver](https://hadoop.apache.org/docs/current/hadoop-azure/index.html) provided the original support for Azure Blob Storage. This driver performs the complex task of mapping file system semantics (as required by the Hadoop FileSystem interface) to that of the object store style interface exposed by Azure Blob Storage. This driver continues to support this model, providing high-performance access to data stored in blobs. However, it contains a significant amount of code that performs this mapping, which makes it difficult to maintain. Additionally, [FileSystem.rename()](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/filesystem.html#boolean_renamePath_src_Path_d) and [FileSystem.delete()](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/filesystem.html#boolean_deletePath_p_boolean_recursive) applied to directories require the driver to perform a vast number of operations, because object stores lack native directory support. This overhead often leads to degraded performance. The ABFS driver overcomes the inherent deficiencies of WASB.

## How ABFS works

The [Azure Data Lake Storage REST interface](/rest/api/storageservices/data-lake-storage-gen2) supports file system semantics over Azure Blob Storage. Given that the Hadoop file system is also designed to support the same semantics, there's no requirement for a complex mapping in the driver. Thus, the Azure Blob File System driver (or ABFS) is a mere client shim for the REST API.

However, the driver must still perform some functions:

### URI scheme to reference data

Consistent with other file system implementations within Hadoop, the ABFS driver defines its own URI scheme so that resources (directories and files) can be distinctly addressed. The URI scheme is documented in [Use the Azure Data Lake Storage URI](./data-lake-storage-introduction-abfs-uri.md). The structure of the URI is: `abfs[s]://file_system@account_name.dfs.core.windows.net/<path>/<path>/<file_name>`, where `abfss://` uses TLS for encrypted connections.

By using this URI format, standard Hadoop tools and frameworks can reference these resources:

```bash
hdfs dfs -mkdir -p abfs://fileanalysis@myanalytics.dfs.core.windows.net/tutorials/flightdelays/data
hdfs dfs -put flight_delays.csv abfs://fileanalysis@myanalytics.dfs.core.windows.net/tutorials/flightdelays/data/
```

Internally, the ABFS driver translates the resources specified in the URI to files and directories and makes calls to the Azure Data Lake Storage REST API with those references.

### Authentication

The ABFS driver supports two forms of authentication so that the Hadoop application can securely access resources contained within a Data Lake Storage capable account. Authentication requires a storage account with hierarchical namespace enabled. For full details of the available authentication schemes, see the [Azure Storage security guide](security-recommendations.md). The supported authentication schemes are:

- **Shared Key:** This authentication method grants users access to all resources in the account. The key is encrypted and stored in the Hadoop configuration.

- **Microsoft Entra ID OAuth Bearer Token:** The driver acquires and refreshes Microsoft Entra bearer tokens by using either the identity of the end user or a configured service principal. When you use this authentication model, you authorize all access on a per-call basis by using the identity associated with the supplied token, which is evaluated against the assigned POSIX Access Control List (ACL).

   > [!NOTE]
   > Azure Data Lake Storage supports Microsoft Entra ID OAuth 2.0 authentication.

### Configuration

Store all configuration for the ABFS driver in the `core-site.xml` configuration file. On Hadoop distributions that feature [Ambari](https://ambari.apache.org/), you can also manage the configuration by using the web portal or Ambari REST API.

For details about all supported configuration entries, see the [Official Hadoop documentation](https://hadoop.apache.org/docs/stable/).

## Next steps

- [Tutorial: Azure Data Lake Storage, Azure Databricks & Spark](./data-lake-storage-use-databricks-spark.md)
- [Use the Azure Data Lake Storage URI](./data-lake-storage-introduction-abfs-uri.md)
