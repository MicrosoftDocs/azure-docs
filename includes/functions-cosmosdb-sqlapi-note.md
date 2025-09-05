---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/31/2022
ms.author: glenga
ms.custom: include file
---

This table indicates how to connect to the various Azure Cosmos DB APIs from your function code:

| API | Recommendation |
| ---- | ---- |
| [Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/) | Use the [Azure Cosmos DB binding extension](../articles/azure-functions/functions-bindings-cosmosdb-v2.md) |
| [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/) (vCore) | Use the [Azure Cosmos DB for MongoDB binding extension](../articles/azure-functions/functions-bindings-mongodb-vcore.md), which is currently in preview.|
| [Azure Cosmos DB for Table](/azure/cosmos-db/table/) | Use version 5.x or later of the [Azure Tables binding extension](../articles/azure-functions/functions-bindings-storage-table.md).| 
| [Azure Cosmos DB for Apache Cassandra](/azure/cosmos-db/cassandra) | [Use the native client SDK](/azure/cosmos-db/postgresql/howto-connect). |
| Azure Cosmos DB for Apache Gremlin (Graph API) |
| [Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/) | [Use the native client SDK](/azure/cosmos-db/postgresql/howto-connect). |

 supported Azure Cosmos DB bindings are only supported for use with Azure Cosmos DB for NoSQL. Starting with version 5.x of the extension, support for Azure Cosmos DB for Table is provided by using the [Table storage bindings](../articles/azure-functions/functions-bindings-storage-table.md?tabs=in-process%2Ctable-api%2Cextensionv3#table-api-extension). For all other Azure Cosmos DB APIs, you should access the database from your function by using the static client for your API, including [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb-introduction), [Azure Cosmos DB for Cassandra](/azure/cosmos-db/cassandra-introduction), and [Azure Cosmos DB for Apache Gremlin](/azure/cosmos-db/graph-introduction).
