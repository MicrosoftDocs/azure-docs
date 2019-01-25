---
title: Optimize bulk inserts in Azure Database for PostgreSQL server
description: This article describes how you can optimize bulk insert operations on Azure Database for PostgreSQL server.
author: dianaputnam
ms.author: dianas
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/22/2018
---

# Optimizing bulk inserts and use of transient data on Azure Database for PostgreSQL server 
This article describes how you can optimize bulk insert operations and the use of transient data on an Azure Database for PostgreSQL server.

## Using unlogged tables
For customers that have workload operations that involve transient data or that insert large datasets in bulk, consider using unlogged tables.

Unlogged tables is a PostgreSQL feature that can be used effectively to optimize bulk inserts. PostgreSQL uses Write-Ahead Logging (WAL), which provides atomicity and durability two of the ACID properties by default. Inserting into an unlogged table would mean PostgreSQL would do inserts without writing into the transaction log, which itself is an I/O operation, making these tables considerably faster than ordinary tables.

Below are the options for creating an unlogged table:
- Create a new unlogged table using the syntax: `CREATE UNLOGGED TABLE <tableName>`
- Convert an existing logged table to an unlogged table using the syntax: `ALTER <tableName> SET UNLOGGED`.  This can be reversed by using the syntax: `ALTER <tableName> SET LOGGED`

## Unlogged table tradeoff
Unlogged tables are not crash-safe. An unlogged table is automatically truncated after a crash or subject to an unclean shutdown. The contents of an unlogged table are also not replicated to standby servers. Any indexes created on an unlogged table are automatically unlogged as well.  After the insert operation completes, you may convert the table to logged so the insert is durable.

However, on some customer workloads, we have experienced approximately a 15-20 percent performance improvement when using unlogged tables.

## Next steps
Review your workload for uses of transient data and large bulk inserts.  

Review the following PostgreSQL documentation - [Create Table SQL Commands](https://www.postgresql.org/docs/current/static/sql-createtable.html)