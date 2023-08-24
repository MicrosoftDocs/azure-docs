---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When working with a single table entity, the Azure Tables input binding can bind to the following types:

| Type | Description |
| --- | --- |
| A JSON serializable type that implements [ITableEntity]  | Functions attempts to deserialize the entity into a plain-old CLR object (POCO) type. The type must implement [ITableEntity] or have a string `RowKey` property and a string `PartitionKey` property. |
| [TableEntity] | _(Preview<sup>1</sup>)_<br/>The entity as a dictionary-like type. |

When working with multiple entities from a query, the Azure Tables input binding can bind to the following types:

| Type | Description |
| --- | --- |
| `IEnumerable<T>` where `T` implements [ITableEntity]  | An enumeration of entities returned by the query. Each entry represents one entity. The type `T` must implement [ITableEntity] or have a string `RowKey` property and a string `PartitionKey` property.|
| [TableClient] | _(Preview<sup>1</sup>)_<br/>A client connected to the table. This offers the most control for processing the table and can be used to write to it if the connection has sufficient permission.|

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.Tables 1.2.0-preview1 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Tables/1.2.0-preview1) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types).

[ITableEntity]: /dotnet/api/azure.data.tables.itableentity
[TableClient]: /dotnet/api/azure.data.tables.tableclient
[TableEntity]: /dotnet/api/azure.data.tables.tableentity
