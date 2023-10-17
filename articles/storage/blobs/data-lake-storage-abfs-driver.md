---
title: The Azure Blob Filesystem driver for Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Learn about the Azure Blob Filesystem driver (ABFS), a dedicated Azure Storage driver for Hadoop. Access data in Azure Data Lake Storage Gen2 using this driver.
author: normesta

ms.topic: conceptual
ms.author: normesta
ms.reviewer: jamesbak
ms.date: 03/09/2023
ms.service: azure-data-lake-storage
---

# The Azure Blob Filesystem driver (ABFS): A dedicated Azure Storage driver for Hadoop

One of the primary access methods for data in Azure Data Lake Storage Gen2 is via the [Hadoop FileSystem](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/index.html). Data Lake Storage Gen2 allows users of Azure Blob Storage access to a new driver, the Azure Blob File System driver or `ABFS`. ABFS is part of Apache Hadoop and is included in many of the commercial distributions of Hadoop. By the ABFS driver, many applications and frameworks can access data in Azure Blob Storage without any code explicitly referencing Data Lake Storage Gen2.

## Prior capability: The Windows Azure Storage Blob driver

The Windows Azure Storage Blob driver or [WASB driver](https://hadoop.apache.org/docs/current/hadoop-azure/index.html) provided the original support for Azure Blob Storage. This driver performed the complex task of mapping file system semantics (as required by the Hadoop FileSystem interface) to that of the object store style interface exposed by Azure Blob Storage. This driver continues to support this model, providing high performance access to data stored in blobs, but contains a significant amount of code performing this mapping, making it difficult to maintain. Additionally, some operations such as [FileSystem.rename()](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/filesystem.html#boolean_renamePath_src_Path_d) and [FileSystem.delete()](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/filesystem.html#boolean_deletePath_p_boolean_recursive) when applied to directories require the driver to perform a vast number of operations (due to object stores lack of support for directories) which often leads to degraded performance. The ABFS driver was designed to overcome the inherent deficiencies of WASB.

## The Azure Blob File System driver

The [Azure Data Lake Storage REST interface](/rest/api/storageservices/data-lake-storage-gen2) is designed to support file system semantics over Azure Blob Storage. Given that the Hadoop file system is also designed to support the same semantics there's no requirement for a complex mapping in the driver. Thus, the Azure Blob File System driver (or ABFS) is a mere client shim for the REST API.

However, there are some functions that the driver must still perform:

### URI scheme to reference data

Consistent with other file system implementations within Hadoop, the ABFS driver defines its own URI scheme so that resources (directories and files) may be distinctly addressed. The URI scheme is documented in [Use the Azure Data Lake Storage Gen2 URI](./data-lake-storage-introduction-abfs-uri.md). The structure of the URI is: `abfs[s]://file_system@account_name.dfs.core.windows.net/<path>/<path>/<file_name>`

By using this URI format, standard Hadoop tools and frameworks can be used to reference these resources:

```bash
hdfs dfs -mkdir -p abfs://fileanalysis@myanalytics.dfs.core.windows.net/tutorials/flightdelays/data
hdfs dfs -put flight_delays.csv abfs://fileanalysis@myanalytics.dfs.core.windows.net/tutorials/flightdelays/data/
```

Internally, the ABFS driver translates the resource(s) specified in the URI to files and directories and makes calls to the Azure Data Lake Storage REST API with those references.

### Authentication

The ABFS driver supports two forms of authentication so that the Hadoop application may securely access resources contained within a Data Lake Storage Gen2 capable account. Full details of the available authentication schemes are provided in the [Azure Storage security guide](security-recommendations.md). They are:

- **Shared Key:** This permits users access to ALL resources in the account. The key is encrypted and stored in Hadoop configuration.

- **Microsoft Entra ID OAuth Bearer Token:** Microsoft Entra bearer tokens are acquired and refreshed by the driver using either the identity of the end user or a configured Service Principal. Using this authentication model, all access is authorized on a per-call basis using the identity associated with the supplied token and evaluated against the assigned POSIX Access Control List (ACL).

   > [!NOTE]
   > Azure Data Lake Storage Gen2 supports only Azure AD v1.0 endpoints.

### Configuration

All configuration for the ABFS driver is stored in the <code>core-site.xml</code> configuration file. On Hadoop distributions featuring [Ambari](https://ambari.apache.org/), the configuration may also be managed using the web portal or Ambari REST API.

Details of all supported configuration entries are specified in the [Official Hadoop documentation](https://hadoop.apache.org/docs/stable/hadoop-azure/abfs.html).

### Hadoop documentation

The ABFS driver is fully documented in the [Official Hadoop documentation](https://hadoop.apache.org/docs/stable/hadoop-azure/abfs.html)

## Next steps

- [Create an Azure Databricks Cluster](./data-lake-storage-use-databricks-spark.md)
- [Use the Azure Data Lake Storage Gen2 URI](./data-lake-storage-introduction-abfs-uri.md)
