---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to process a single document, the Cosmos DB trigger can bind to the following types:

| Type | Description |
| --- | --- |
| JSON serializable types | Functions tries to deserialize the JSON data of the document from the Cosmos DB change feed into a plain-old CLR object (POCO) type. |

When you want the function to process a batch of documents, the Cosmos DB trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `IEnumerable<T>`where `T` is a JSON serializable type | An enumeration of entities included in the batch. Each entry represents one document from the Cosmos DB change feed. | 
