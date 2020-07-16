---
title: Table storage output from Azure Stream Analytics
description: This article describes data output options available in Azure Stream Analytics, including Power BI for analysis results.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/15/2020
---

## Table storage output from Azure Stream Analytics

[Azure Table storage](../storage/common/storage-introduction.md) offers highly available, massively scalable storage, so that an application can automatically scale to meet user demand. Table storage is Microsoft's NoSQL key/attribute store, which you can use for structured data with fewer constraints on the schema. Azure Table storage can be used to store data for persistence and efficient retrieval.

The following table lists the property names and their descriptions for creating a table output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this table storage. |
| Storage account |The name of the storage account where you're sending your output. |
| Storage account key |The access key associated with the storage account. |
| Table name |The name of the table. The table gets created if it doesn't exist. |
| Partition key |The name of the output column that contains the partition key. The partition key is a unique identifier for the partition within a table that forms the first part of an entity's primary key. It's a string value that can be up to 1 KB in size. |
| Row key |The name of the output column that contains the row key. The row key is a unique identifier for an entity within a partition. It forms the second part of an entity's primary key. The row key is a string value that can be up to 1 KB in size. |
| Batch size |The number of records for a batch operation. The default (100) is sufficient for most jobs. See the [Table Batch Operation spec](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.table.tablebatchoperation) for more details on modifying this setting. |

## Partitioning
| Azure Table storage | Yes | Any output column.  | Follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md). |
## Output batch size
| Azure Table storage | See [Azure Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#storage-limits). | The default is 100 entities per single transaction. You can configure it to a smaller value as needed. |