---
title: 'Tutorial: Shard data on worker nodes - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: This tutorial shows how to create distributed tables and visualize how their data is distributed with Azure Database for PostgreSQL Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 11/25/2020
---

# Tutorial: Shard data on worker nodes in Azure Database for PostgreSQL – Hyperscale (Citus)

In this tutorial, you use Azure Database for PostgreSQL - Hyperscale (Citus) to learn how to:

> [!div class="checklist"]
> * Create hash-distributed shards
> * See where table shards are placed
> * Run queries faster using worker nodes
> * Create constraints on distributed tables
> * Identify skewed distribution

## Prerequisites

[!INCLUDE azure-postgresql-hyperscale-create-db](../../includes/azure-postgresql-hyperscale-create-db.md)]

## Get started with distributed data

Distributing table rows across multiple PostgreSQL servers is a key technique
for scalable queries in Hyperscale (Citus). Multiple servers (workers) can hold
more data than any individual worker, and in many cases can use worker CPUs in
parallel to execute queries.

In the prerequisites we created a Hyperscale (Citus) server group with two
worker nodes. The coordinator node's metadata tables track workers and
distributed data. We can check the active workers in
[pg_dist_node](reference-hyperscale-metadata#worker-node-table). This and
future SQL commands should be run on the coordinator node with a client such as
psql.

```sql
select nodeid, nodename from pg_dist_node where isactive;
```
```
 nodeid | nodename
--------+-----------
      1 | 10.0.0.21
      2 | 10.0.0.23
(2 rows)
```

Nodenames on Hyperscale (Citus) are internal IP addresses in a virtual network,
and the actual addresses you see may differ.


