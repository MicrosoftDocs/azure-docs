---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about the limitations and known issues with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 01/24/2020
ms.author: normesta
ms.reviewer: jamesbak
---
# Known issues with Azure Data Lake Storage Gen2

This article lists the features and tools that are not yet supported or only partially supported with storage accounts that have a hierarchical namespace (Azure Data Lake Storage Gen2).

<a id="blob-storage-features" />

## Support levels at a glance

These tables describe the level of support for blob service features, tools, and Azure services in Data Lake Storage Gen2. 

The items that appear in this table will change over time as support for Blob features, tools, and Azure services continues to expand.

Review the [Known Issues](#known-issues) section of this article for information about specific issues and workarounds. 

### Blob features

<hr></hr>

:::row:::
   :::column span="":::
      **Blob feature**
   :::column-end:::
   :::column span="":::
      **Support level**
   :::column-end:::
      :::column span="":::
      **Blob feature**
   :::column-end:::
   :::column span="":::
      **Support level**
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Hot access tier](storage-blob-storage-tiers.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
      :::column span="":::
      [Cool access tier](storage-blob-storage-tiers.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Events](data-lake-storage-events.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
   :::column span="":::
      [Metrics (Classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Metrics in Azure Monitor](../common/storage-metrics-in-azure-monitor.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
      :::column span="":::
      [Archive Access Tier](storage-blob-storage-tiers.md)
   :::column-end:::
   :::column span="":::
      Preview
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Lifecycle management policies](storage-lifecycle-management-concepts.md)
   :::column-end:::
   :::column span="":::
      Preview
   :::column-end:::
   :::column span="":::
      [Diagnostic logs](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
   :::column-end:::
   :::column span="":::
      Preview
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Change feed](storage-blob-change-feed.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
      [Account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      Blob container ACL
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
      [Custom domains](storage-custom-domain-name.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Immutable storage](storage-blob-immutable-storage.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
      [Snapshots](storage-blob-snapshots.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Soft Delete](storage-blob-soft-delete.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
      [Static websites](storage-blob-static-website.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      Logging in Azure Monitor
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
      [Premium block blobs](storage-blob-create-account-block-blob.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
:::row-end:::

### Tools

<hr></hr>

:::row:::
   :::column span="":::
      **Tool**
   :::column-end:::
   :::column span="":::
      **Support level**
   :::column-end:::
      :::column span="":::
      **Tool**
   :::column-end:::
   :::column span="":::
      **Support level**
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [PowerShell (Blob)](storage-quickstart-blobs-powershell.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
    :::column span="":::
      [CLI (Blob)](storage-quickstart-blobs-cli.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Blob APIs](storage-quickstart-blobs-dotnet.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
   :::column span="":::
      [File, directory, and ACL APIs](data-lake-storage-directory-file-acl-dotnet.md) 
      :::column-end:::
   :::column span="":::
      Preview
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [PowerShell (Data Lake Storage)](data-lake-storage-directory-file-acl-powershell.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
    :::column span="":::
      [CLI (Data Lake Storage)](data-lake-storage-directory-file-acl-cli.md)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [AzCopy](../common/storage-use-azcopy-v10.md)
   :::column-end:::
   :::column span="":::
      Version-specific support. 
   :::column-end:::
      :::column span="":::
      [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
   :::column-end:::
   :::column span="":::
      Version-specific support.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [blobfuse](storage-how-to-mount-container-linux.md)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
      Third party applications
   :::column-end:::
   :::column span="":::
      Limited support. 
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      File browsing in the Azure portal 
   :::column-end:::
   :::column span="":::
      Limited support.  
   :::column-end:::
   :::column span="":::
   :::column-end:::
   :::column span="":::
   :::column-end:::
:::row-end:::

### Azure services

<hr></hr>

:::row:::
   :::column span="":::
      **Service**
   :::column-end:::
   :::column span="":::
      **Support level**
   :::column-end:::
      :::column span="":::
      **Service**
   :::column-end:::
   :::column span="":::
      **Support level**
   :::column-end:::
:::row-end:::

:::row:::
    :::column span="":::
      [Azure Databricks](https://docs.azuredatabricks.net/data/data-sources/azure/azure-datalake-gen2.html)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
    :::column span="":::
      [Azure Event Hubs capture](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
    :::column span="":::
      [Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/how-to-access-data)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-quick-create-portal)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
   :::column span="":::
      [Data Box](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-migrate-on-premises-hdfs-cluster)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
   :::column span="":::
      [IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [Power BI](https://docs.microsoft.com/power-query/connectors/datalakestorage)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
   :::column span="":::
      [SQL Data Warehouse](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#azure-sql-data-warehouse-polybase)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      [SQL Server Integration Services](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-storage-connection-manager?view=sql-server-2017)
   :::column-end:::
   :::column span="":::
      Generally available
   :::column-end:::
   :::column span="":::
      [Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-howto-index-azure-data-lake-storage)
   :::column-end:::
   :::column span="":::
      Preview
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Azure CDN](https://docs.microsoft.com/azure/cdn/cdn-overview)
   :::column-end:::
   :::column span="":::
      Not yet supported
   :::column-end:::
   :::column span="":::
   :::column-end:::
   :::column span="":::
   :::column-end:::
:::row-end:::

<a id="known-issues" />

## Known issues

### Lifecycle management policies

* The deletion of blob snapshots is not yet supported.  

* There are currently some bugs affecting lifecycle management policies and the archive access tier. 

<a id="diagnostic-logs-notes" />

### Diagnostic logs

Azure Storage Explorer 1.10.x can't be used for viewing diagnostic logs. To view logs, please use AzCopy or SDKs.

<a id="az-copy" />

### AzCopy

Use only the latest version of AzCopy ([AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json)). Earlier versions of AzCopy such as AzCopy v8.1, are not supported.

<a id="storage-explorer" />

### Azure Storage Explorer

Use only versions `1.6.0` or higher.There is currently a storage bug affecting version `1.11.0` that can result in authentication errors in certain scenarios. A fix for the storage bug is being rolled out, but as a workaround, we recommend that you use version `1.10.x` which is available as a [free download](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-relnotes). `1.10.x` is not affected by the storage bug.

<a id="explorer-in-portal" />

### Browsing directories and files in the Azure portal

ACLs are not yet supported.

<a id="third-party-apps" />

### Third party applications

Third party applications that use REST APIs to work will continue to work if you use them with Data Lake Storage Gen2
Applications that call Blob APIs will likely work.

<a id="api-scope-data-lake-client-library" />

### File system support in SDKs

- [.NET](data-lake-storage-directory-file-acl-dotnet.md), [Java](data-lake-storage-directory-file-acl-java.md) and [Python](data-lake-storage-directory-file-acl-python.md), and [JavaScript](data-lake-storage-directory-file-acl-javascript.md) and support are in public preview. Other SDKs are not currently supported.
- Get and set ACL operations are not currently recursive.

### File system support in PowerShell and Azure CLI

- [PowerShell](data-lake-storage-directory-file-acl-powershell.md) and [Azure CLI](data-lake-storage-directory-file-acl-cli.md) support are in public preview.
- Get and set ACL operations are not currently recursive.

<a id="blob-apis-disabled" />

### Blob APIs

Blob APIs and Data Lake Storage Gen2 APIs can operate on the same data.

This section describes issues and limitations with using blob APIs and Data Lake Storage Gen2 APIs to operate on the same data.

* You can't use both Blob APIs and Data Lake Storage APIs to write to the same instance of a file. If you write to a file by using Data Lake Storage Gen2 APIs, then that file's blocks won't be visible to calls to the [Get Block List](https://docs.microsoft.com/rest/api/storageservices/get-block-list) blob API. You can overwrite a file by using either Data Lake Storage Gen2 APIs or Blob APIs. This won't affect file properties.

* When you use the [List Blobs](https://docs.microsoft.com/rest/api/storageservices/list-blobs) operation without specifying a delimiter, the results will include both directories and blobs. If you choose to use a delimiter, use only a forward slash (`/`). This is the only supported delimiter.

* If you use the [Delete Blob](https://docs.microsoft.com/rest/api/storageservices/delete-blob) API to delete a directory, that directory will be deleted only if it's empty. This means that you can't use the Blob API delete directories recursively.

These Blob REST APIs aren't supported:

* [Put Blob (Page)](https://docs.microsoft.com/rest/api/storageservices/put-blob)
* [Put Page](https://docs.microsoft.com/rest/api/storageservices/put-page)
* [Get Page Ranges](https://docs.microsoft.com/rest/api/storageservices/get-page-ranges)
* [Incremental Copy Blob](https://docs.microsoft.com/rest/api/storageservices/incremental-copy-blob)
* [Put Page from URL](https://docs.microsoft.com/rest/api/storageservices/put-page-from-url)
* [Put Blob (Append)](https://docs.microsoft.com/rest/api/storageservices/put-blob)
* [Append Block](https://docs.microsoft.com/rest/api/storageservices/append-block)
* [Append Block from URL](https://docs.microsoft.com/rest/api/storageservices/append-block-from-url)

Unmanaged VM disks are not supported in accounts that have a hierarchical namespace. If you want to enable a hierarchical namespace on a storage account, place unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.








