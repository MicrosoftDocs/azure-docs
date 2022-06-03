---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/31/2022
ms.author: glenga
ms.custom: include file
---

Azure Cosmos DB bindings are only supported for use with the SQL API. Support for Table API is provided by using the [Table storage bindings](../articles/azure-functions/functions-bindings-storage-table.md?tabs=in-process%2Ctable-api%2Cextensionv3#table-api-extension), starting with extension 5.x. For all other Azure Cosmos DB APIs, you should access the database from your function by using the static client for your API, including [Azure Cosmos DB's API for MongoDB](../articles/cosmos-db/mongodb-introduction.md), [Cassandra API](../articles/cosmos-db/cassandra-introduction.md), and [Gremlin API](../articles/cosmos-db/graph-introduction.md).
