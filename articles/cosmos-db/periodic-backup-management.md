---
title: Options for manually managing periodic backups
titleSuffix: Azure Cosmos DB
description: Manually manage your own periodic backups of Azure Cosmos DB using services like Azure Data Factory or features like change feed.
author: kanshiG
ms.author: govindk
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/21/2023
ms.custom: ignite-2022
---

# Options for manually managing periodic backups in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

With Azure Cosmos DB API for NoSQL accounts, you can also maintain your own backups by using one of the following approaches:

## Azure Data Factory

Use [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) to move data periodically to a storage solution of your choice.

## Azure Cosmos DB change feed

Use Azure Cosmos DB [change feed](change-feed.md) to read data periodically for full backups or for incremental changes, and store it in your own storage.

## Next steps

- Learn more about [periodic backup and restore](periodic-backup-restore-introduction.md)
- Learn more about [continuous backup](continuous-backup-restore-introduction.md)
