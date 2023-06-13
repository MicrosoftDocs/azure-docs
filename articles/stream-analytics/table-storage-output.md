---
title: Table storage output from Azure Stream Analytics
description: This article describes Azure Table storage as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/25/2020
---

# Table storage output from Azure Stream Analytics

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
| Batch size |The number of records for a batch operation. The default (100) is sufficient for most jobs. See the [Table Batch Operation spec](/java/api/com.microsoft.azure.storage.table.tablebatchoperation) for more details on modifying this setting. |

## Partitioning

The partition key is any output column. The number of output writers follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md).

## Output batch size

For the maximum message size, see [Azure Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits). The default is 100 entities per single transaction, but you can configure it to a smaller value as needed.

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)