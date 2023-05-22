---
title: How to enable and use pgvector - Azure Database for PostgreSQL - Flexible Server
description: How to enable and use pgvector on Azure Database for PostgreSQL - Flexible Server
ms.author: avijitgupta
author: AvijitkGupta
ms.reviewer: kabharati
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/09/2023
---

# How to enable and use `pgvector` on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

[!INCLUDE [Introduction to `pgvector`](../../cosmos-db/postgresql/includes/pgvector-introduction.md)]

## Enable extension

To install the extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command from the psql tool to load the packaged objects into your database.

```postgresql
CREATE EXTENSION vector;
```

> [!Note]
> To disable an extension use `drop_extension()`

[!INCLUDE [`pgvector`](../../cosmos-db/postgresql/includes/pgvector-basics.md)]

## Next Steps

Learn more around performance, indexing and limitations using `pgvector`.

> [!div class="nextstepaction"]
> [Optimize performance using pgvector](howto-optimize-performance-pgvector.md)
