---
title: The ABFS Hadoop Filesystem Driver
description: 
services: storage
keywords: 
author: jamesbak
ms.topic: article
ms.author: jamesbak
manager: jahogg
ms.date: 06/01/2018
ms.service: storage
---

# The ABFS Hadoop Filesystem Driver

One of the primary access methods for data in Azure Data Lake Storage (Preview) is via the [Hadoop Filesystem](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/index.html). ADLS features an associated driver, `ABFS`, that is part of _Apache Hadoop_ **TODO: Check Trademark Usage** and is included in many of the commercial distributions of Hadoop. Using this driver, many applications and frameworks can access data in ADLS without any code explicitly referencing the ADLS service.

## Prior Capability: The WASB Driver
The [WASB driver](https://hadoop.apache.org/docs/current/hadoop-azure/index.html) provided the original support for Azure Storage Blobs. This driver performed the complex task of mapping _file system_ semantics (as required by the Hadoop Filesystem interface) to that of the _object store_ style interface exposed by Azure Blob Storage. This driver continues to support this model, providing high performance access to data stored in Blobs, but contains a significant amount of code performing this mapping making it difficult to maintain. Additionally, some operations such as [FileSystem.rename()](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/filesystem.html#boolean_renamePath_src_Path_d) and [FileSystem.delete()](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/filesystem/filesystem.html#boolean_deletePath_p_boolean_recursive) when applied to directories require the driver to perform a vast number of operations (due to _object stores_ lack of support for directories) which often leads to degraded performance.

Thus, to overcome the inherent design deficiences of WASB, the new ADLS service was implemented with support from the new ABFS driver.

## The ABFS Driver
The [ADLS REST interface](./ADLS_REST_Reference) is designed to support _file system_ semantics. Given that the Hadoop Filesystem is also designed to support the same semantics there is no requirement for a complex mapping in the driver. Thus, the ABFS driver is a mere client shim for the REST API.

However, there are some functions that the driver must still perform:

### URI Scheme to Reference Data
Consistent with other FileSystem implementations within Hadoop, the ABFS driver defines its own URI scheme so that resources (directories and files) may be distinctly addressed. The URI scheme is fully documented [here](./storage-adls-intro-to-uri.md). The structure of the URI is as follows:

<pre>abfs[s]://file_system@account_name.dfs.core.widows.net/&lt;path&gt;/&lt;path&gt;/&lt;file_name&gt;</pre> 

Using the above URI format, standard Hadoop tools and frameworks can be used to reference these resources:

```bash
hdfs dfs -mkdir -p abfs://fileanalysis@myanalytics.dfs.core.windows.net/tutorials/flightdelays/data 
hdfs dfs -put flight_delays.csv abfs://fileanalysis@myanalytics.dfs.core.windows.net/tutorials/flightdelays/data/ 
```

Internally, the ABFS driver translates the resource(s) specified in the URI to files and directories and makes calls to the ADLS REST API with those references.

### Authentication

The ABFS driver supports two forms of authentication so that the Hadoop application may securely access resources contained within an ADLS account. Full details of the available authentication schemes are provided in the [Azure Storage security guide](../common/storage-security-guid.md). They are:

- **Shared Key:** This permits users access to ALL resources in the account. The key is encrypted and stored in Hadoop configuration.

- **(Coming Soon) Azure Active Directory OAuth Bearer Token:** AAD bearer tokens are acquired and refreshed by the driver using either the identity of the end user or a configured _Service Principal_. Using this authentication model, all access is authorized on a per-call basis using the identity associated with the supplied token and evaluated against the assigned _POSIX Access Control List (ACL)_.

### Configuration

All configuration for the ABFS driver is stored in the <code>core-site.xml</code> configuration file. On Hadoop distributions featuring [Ambari](http://ambari.apache.org/), the configuration may also be managed using the web portal or Ambari REST API. 

Details of all supported configuration entries are specified in the **TODO: Update link** [Official Hadoop documentation](http://hadoop.apache.org/docs/current/hadoop-azure/index.html).

### Hadoop Documentation

The ABFS driver is fully documented in the **TODO: Update link** [Official Hadoop documentation](http://hadoop.apache.org/docs/current/hadoop-azure/index.html)

## Next Steps

- [Setup HDInsight Clusters](./storage-adls-create-connect-hdi-cluster.md)
- [Create an Azure Databricks Cluster](./storage-adls-create-databricks.md)
- [Use the Azure Data Lake Storage URI](./storage-adls-intro-to-uri.md)