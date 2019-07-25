---
title: include file
description: include file
services: functions
author: ggailey777
manager: jeconnoc
ms.service: azure-functions
ms.topic: include
ms.date: 08/22/2018
ms.author: glenga
ms.custom: include file
---

Azure Cosmos DB bindings are only supported for use with the SQL API. For all other Azure Cosmos DB APIs, you should access the database from your function by using the static client for your API, including [Azure Cosmos DB's API for MongoDB](../articles/cosmos-db/mongodb-introduction.md), [Cassandra API](../articles/cosmos-db/cassandra-introduction.md), [Gremlin API](../articles/cosmos-db/graph-introduction.md), and [Table API](../articles/cosmos-db/table-introduction.md).
