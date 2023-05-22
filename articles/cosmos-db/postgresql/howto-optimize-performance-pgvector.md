---
title: How to optimize performance when using pgvector - Azure Cosmos DB for PostgreSQL
description: How to optimize performance when using pgvector - Azure Cosmos DB for PostgreSQL
ms.author: adamwolk
author: mulander
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/10/2023
---

# How to optimize performance when using pgvector on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The `pgvector` extension adds an open-source vector similarity search to PostgreSQL.

This article explores the limitations and tradeoffs of [`pgvector`](https://github.com/pgvector/pgvector) and shows how to use partitioning, indexing and search settings to improve performance.

For more on the extension itself, see [basics of `pgvector`](howto-use-pgvector.md). You may also want to refer to the official [README](https://github.com/pgvector/pgvector/blob/master/README.md) of the project.

[!INCLUDE [Performance](includes/pgvector-performance.md)]

## Conclusion

Congratulations, you just learned the tradeoffs, limitations and best practices to achieve the best performance with `pgvector`.
