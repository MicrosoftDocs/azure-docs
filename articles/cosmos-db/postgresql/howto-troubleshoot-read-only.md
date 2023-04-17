---
title: Troubleshoot read-only access - Azure Cosmos DB for PostgreSQL
description: Learn why a cluster can become read-only, and what to do
keywords: postgresql connection,read only
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 08/03/2021
---

# Troubleshoot read-only access to Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

PostgreSQL can't run on a machine without some free disk space. To maintain
access to PostgreSQL servers, it's necessary to prevent the disk space from
running out.

In Azure Cosmos DB for PostgreSQL, nodes are set to a read-only (RO) state when the disk is
almost full. Preventing writes stops the disk from continuing to fill, and
keeps the node available for reads. During the read-only state, you can take
measures to free more disk space.

Specifically, a node becomes read-only when it has less than
5 GiB of free storage left. When the server becomes read-only, all existing
sessions are disconnected, and uncommitted transactions are rolled back. Any
write operations and transaction commits will fail, while read queries will
continue to work.

## Ways to recover write-access

### On the coordinator node

* [Increase storage
  size](howto-scale-grow.md#increase-storage-on-nodes)
  on the coordinator node, and/or
* Distribute local tables to worker nodes, or drop data. You'll need to run
  `SET SESSION CHARACTERISTICS AS TRANSACTION READ WRITE` after you've
  connected to the database and before you execute other commands.

### On a worker node

* [Increase storage
  size](howto-scale-grow.md#increase-storage-on-nodes)
  on the worker nodes, and/or
* [Rebalance data](howto-scale-rebalance.md) to other nodes, or drop
  some data.
	* You'll need to set the worker node as read-write temporarily. You can
	  connect directly to worker nodes and use `SET SESSION CHARACTERISTICS` as
	  described above for the coordinator node.

## Prevention

We recommend that you set up an alert to notify you when server storage is
approaching the threshold. That way you can act early to avoid getting into the
read-only state. For more information, see the documentation about [recommended
alerts](howto-alert-on-metric.md#suggested-alerts).

## Next steps

* [Set up Azure
  alerts](howto-alert-on-metric.md#suggested-alerts)
  for advance notice so you can take action before reaching the read-only state.
* Learn about [disk
  usage](https://www.postgresql.org/docs/current/diskusage.html) in PostgreSQL
  documentation.
* Learn about [session
  characteristics](https://www.postgresql.org/docs/13/sql-set-transaction.html)
  in PostgreSQL documentation.
