---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write to a single document, the Cosmos DB output binding can bind to the following types:

| Type | Description |
| --- | --- |
| JSON serializable types | An object representing the JSON content of a document. Functions attempts to serialize a plain-old CLR object (POCO) type into JSON data. |

When you want the function to write to multiple documents, the Cosmos DB output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is JSON serializable type | An array containing multiple documents. Each entry represents one document. | 

For other output scenarios, create and use a [CosmosClient] with other types from [Microsoft.Azure.Cosmos] directly. See [Register Azure clients](../articles/azure-functions/dotnet-isolated-process-guide.md#register-azure-clients) for an example of using dependency injection to create a client type from the Azure SDK.

[Microsoft.Azure.Cosmos]: /dotnet/api/microsoft.azure.cosmos
[CosmosClient]: /dotnet/api/microsoft.azure.cosmos.cosmosclient
