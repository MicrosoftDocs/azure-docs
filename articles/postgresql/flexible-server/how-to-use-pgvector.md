---
title: How to enable and use pgvector - Azure Database for PostgreSQL - Flexible Server
description: How to enable and use pgvector on Azure Database for PostgreSQL - Flexible Server
ms.author: avijitgupta
author: AvijitkGupta
ms.reviewer: kabharati
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - build-2023
  - ignite-2023
ms.topic: how-to
ms.date: 11/03/2023
---

# How to enable and use `pgvector` on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

[!INCLUDE [Introduction to `pgvector`](../../cosmos-db/postgresql/includes/pgvector-introduction.md)]

## Enable extension

Before you can enable `pgvector` on your Flexible Server, you need to add it to your allowlist as described in [how to use PostgreSQL extensions](./concepts-extensions.md#how-to-use-postgresql-extensions) and check if correctly added by running `SHOW azure.extensions;`.

Then you can install the extension, by connecting to your target database and running the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command. You need to repeat the command separately for every database you want the extension to be available in.

```postgresql
CREATE EXTENSION vector;
```

> [!Note]
> To remove the extension from the currently connected database use `DROP EXTENSION vector;`.

[!INCLUDE [`pgvector`](../../cosmos-db/postgresql/includes/pgvector-basics.md)]

## Next Steps

Learn more around performance, indexing and limitations using `pgvector`.

> [!div class="nextstepaction"]
> [Optimize performance using pgvector](howto-optimize-performance-pgvector.md)

> [!div class="nextstepaction"]
> [Generate vector embeddings with Azure OpenAI on Azure Database for PostgreSQL Flexible Server](./generative-ai-azure-openai.md)
