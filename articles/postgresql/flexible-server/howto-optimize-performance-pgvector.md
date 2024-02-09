---
title: How to optimize performance when using pgvector - Azure Database for PostgreSQL - Flexible Server
description: How to optimize performance when using pgvector - Azure Database for PostgreSQL - Flexible Server
ms.author: adamwolk
author: mulander
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - build-2023
  - ignite-2023
ms.topic: how-to
ms.date: 11/03/2023
---

# How to optimize performance when using `pgvector` on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The `pgvector` extension adds an open-source vector similarity search to PostgreSQL.

This article explores the limitations and tradeoffs of [`pgvector`](https://github.com/pgvector/pgvector) and shows how to use partitioning, indexing and search settings to improve performance.

For more on the extension itself, see [basics of `pgvector`](how-to-use-pgvector.md). You might also want to refer to the official [README](https://github.com/pgvector/pgvector/blob/master/README.md) of the project.

[!INCLUDE [Performance](../../cosmos-db/postgresql/includes/pgvector-performance.md)]

## Next steps

Congratulations, you just learned the tradeoffs, limitations and best practices to achieve the best performance with `pgvector`.

> [!div class="nextstepaction"]
> [Generate vector embeddings with Azure OpenAI on Azure Database for PostgreSQL Flexible Server](./generative-ai-azure-openai.md)
