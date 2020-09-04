---
title: Logical replication and logical decoding - Azure Database for PostgreSQL Flexible Server
description: Learn about using logical replication and logical decoding in Azure Database for PostgreSQL Flexible Server
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/21/2020
---

## Logical replication and logical decoding

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview.

PostgreSQL's [logical replication](https://www.postgresql.org/docs/current/logical-replication.html) and [logical decoding](https://www.postgresql.org/docs/current/logicaldecoding.html) features are supported in Azure Database for PostgreSQL - Flexible Server.


# Comparing logical replication and logical decoding
Both logical replication and logical decoding allow you to replicate data out of a Postgres database. They both use the [write-ahead log (WAL)](https://www.postgresql.org/docs/current/wal.html) as a source of changes.

Logical replication allows you to specify a table or set of tables to be replicated. Logical replication is between PostgreSQL instances.

Logical decoding extracts changes across all tables in a database. Logical decoding  However, logical decoding cannot directly send data between PostgreSQL instances. 

Both logical replication and logical decoding are dependent on REPLICA IDENTITY.



## Logical replication
Logical replication 

1. Set the server parameter `wal_level` to `logical`.
2. Confirm that your publisher PostgreSQL instance allows network traffic from your subscriber PostgreSQL instance.


## Logical decoding

## Monitor


## Read replicas
Azure Database for PostgreSQL read replicas are not currently supported for flexible servers.


