---
title: Connection pooling – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Scaling client database connections
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 08/03/2021
---

# Azure Database for PostgreSQL – Hyperscale (Citus) connection pooling

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

Hyperscale (Citus) is now offering a managed instance of PgBouncer for server
groups. It supports up to 2,000 simultaneous client connections.  To connect
through PgBouncer, follow these steps:

1. Go to the **Connection strings** page for your server group in the Azure
   portal.
2. Enable the checkbox **PgBouncer connection strings**. (The listed connection
   strings will change.)
3. Update client applications to connect with the new string.

## Next steps

Discover more about the [limits and limitations](concepts-hyperscale-limits.md)
of Hyperscale (Citus).
