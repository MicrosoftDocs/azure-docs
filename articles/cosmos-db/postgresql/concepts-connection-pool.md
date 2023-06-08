---
title: Connection pooling – Azure Cosmos DB for PostgreSQL
description: Use PgBouncer to scale client database connections.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 06/06/2023
---

# Connection pooling in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Establishing new connections takes time. That works against most applications,
which request many short-lived connections. We recommend using a connection
pooler, both to reduce idle transactions and reuse existing connections. To
learn more, visit our [blog
post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

You can run your own connection pooler, or use PgBouncer managed by Azure.

## Managed PgBouncer

Connection poolers such as PgBouncer allow more clients to connect to the
coordinator node at once. Applications connect to the pooler, and the pooler
relays commands to the destination database.

When clients connect through PgBouncer, the number of connections that can
actively run in the database doesn't change. Instead, PgBouncer queues excess
connections and runs them when the database is ready.

Azure Cosmos DB for PostgreSQL is now offering a managed instance of PgBouncer for clusters.
It supports up to 2,000 simultaneous client connections. Additionally,
if a cluster has [high availability](concepts-high-availability.md) (HA)
enabled, then so does its managed PgBouncer.

To connect through PgBouncer, follow these steps:

1. Go to the **Connection strings** page for your cluster in the Azure
   portal.
2. Select the checkbox next to **PgBouncer connection strings**. The listed connection
   strings change.
3. Update client applications to connect with the new string.

Azure Cosmos DB for PostgreSQL allows you to configure [the managed PgBouncer parameters](./reference-parameters.md#managed-pgbouncer-parameters) as coordinator node parameters.

## Next steps

Discover more about the [limits and limitations](reference-limits.md)
of Azure Cosmos DB for PostgreSQL.
