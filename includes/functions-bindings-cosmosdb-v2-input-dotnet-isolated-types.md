---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to process a single document, the Cosmos DB input binding can bind to the following types:

| Type | Description |
| --- | --- |
| JSON serializable types | Functions attempts to deserialize the JSON data of the document into a plain-old CLR object (POCO) type. |

When you want the function to process multiple documents from a query, the Cosmos DB input binding can bind to the following types:

| Type | Description |
| --- | --- |
| `IEnumerable<T>`where `T` is a JSON serializable type | An enumeration of entities returned by the query. Each entry represents one document. | 
| [CosmosClient]<sup>1</sup> | A client connected to the Cosmos DB account. | 
| [Database]<sup>1</sup> | A client connected to the Cosmos DB database. | 
| [Container]<sup>1</sup> | A client connected to the Cosmos DB container. | 

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.CosmosDB 4.4.0 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB/4.4.0) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types).

[CosmosClient]: /dotnet/api/microsoft.azure.cosmos.cosmosclient
[Database]: /dotnet/api/microsoft.azure.cosmos.database
[Container]: /dotnet/api/microsoft.azure.cosmos.container
