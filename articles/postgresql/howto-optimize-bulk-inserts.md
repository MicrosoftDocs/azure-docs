---
title: Optimize bulk inserts on an Azure Database for PostgreSQL - Single Server
description: This article describes how you can optimize bulk insert operations on an Azure Database for PostgreSQL - Single Server.
author: dianaputnam
ms.author: dianas
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---

# Optimize bulk inserts and use transient data on an Azure Database for PostgreSQL - Single Server 
This article describes how you can optimize bulk insert operations and use transient data on an Azure Database for PostgreSQL server.

## Use unlogged tables
If you have workload operations that involve transient data or that insert large datasets in bulk, consider using unlogged tables.

Unlogged tables is a PostgreSQL feature that can be used effectively to optimize bulk inserts. PostgreSQL uses Write-Ahead Logging (WAL). It provides atomicity and durability, by default. Atomicity, consistency, isolation, and durability make up the ACID properties. 

Inserting into an unlogged table means that PostgreSQL does inserts without writing into the transaction log, which itself is an I/O operation. As a result, these tables are considerably faster than ordinary tables.

Use the following options to create an unlogged table:
- Create a new unlogged table by using the syntax `CREATE UNLOGGED TABLE <tableName>`.
- Convert an existing logged table to an unlogged table by using the syntax `ALTER TABLE <tableName> SET UNLOGGED`.  

To reverse the process, use the syntax `ALTER TABLE <tableName> SET LOGGED`.

## Unlogged table tradeoff
Unlogged tables aren't crash-safe. An unlogged table is automatically truncated after a crash or subject to an unclean shutdown. The contents of an unlogged table also aren't replicated to standby servers. Any indexes created on an unlogged table are automatically unlogged as well. After the insert operation completes, convert the table to logged so that the insert is durable.

Some customer workloads have experienced approximately a 15 percent to 20 percent performance improvement when unlogged tables were used.

## Next steps
Review your workload for uses of transient data and large bulk inserts. See the following PostgreSQL documentation:
 
- [Create Table SQL commands](https://www.postgresql.org/docs/current/static/sql-createtable.html)
