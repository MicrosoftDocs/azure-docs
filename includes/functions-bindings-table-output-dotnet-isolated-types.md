---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write to a single entity, the Azure Tables output binding can bind to the following types:

| Type | Description |
| --- | --- |
| A JSON serializable type that implements [ITableEntity]  | Functions attempts to serialize a plain-old CLR object (POCO) type as the entity. The type must implement [ITableEntity] or have a string `RowKey` property and a string `PartitionKey` property. |

When you want the function to write to multiple entities, the Azure Tables output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single entity types | An array containing multiple entities. Each entry represents one entity. | 

For other output scenarios, create and use types from [Azure.Data.Tables] directly.

[Azure.Data.Tables]: /dotnet/api/azure.data.tables
