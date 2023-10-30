---
title: Sharding models - Azure Cosmos DB for PostgreSQL
description: What is sharding, and what sharding models are available in Azure Cosmos DB for PostgreSQL
ms.author: adamwolk
author: mulander
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 09/08/2023
---

# Sharding models

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Sharding is a technique used in database systems and distributed computing to horizontally partition data across multiple servers or nodes. It involves breaking up a large database or dataset into smaller, more manageable parts called Shards. A shard contains a subset of the data, and together shards form the complete dataset.

Azure Cosmos DB for PostgreSQL offers two types of data sharding, namely row-based and schema-based. Each option comes with its own [Sharding tradeoffs](#sharding-tradeoffs), allowing you to choose the approach that best aligns with your application's requirements.

## Row-based sharding

The traditional way in which Azure Cosmos DB for PostgreSQL shards tables is the single database, shared schema model also known as row-based sharding, tenants coexist as rows within the same table. The tenant is determined by defining a [distribution column](./concepts-nodes.md#distribution-column), which allows splitting up a table horizontally.

Row-based is the most hardware efficient way of sharding. Tenants are densely packed and distributed among the nodes in the cluster. This approach however requires making sure that all tables in the schema have the distribution column and that all queries in the application filter by it. Row-based sharding shines in IoT workloads and for achieving the best margin out of hardware use.

Benefits:

* Best performance
* Best tenant density per node

Drawbacks:

* Requires schema modifications
* Requires application query modifications
* All tenants must share the same schema

## Schema-based sharding

Available with Citus 12.0 in Azure Cosmos DB for PostgreSQL, schema-based sharding is the shared database, separate schema model, the schema becomes the logical shard within the database. Multitenant apps can use a schema per tenant to easily shard along the tenant dimension. Query changes aren't required and the application only needs a small modification to set the proper search_path when switching tenants. Schema-based sharding is an ideal solution for microservices, and for ISVs deploying applications that can't undergo the changes required to onboard row-based sharding.

Benefits:

* Tenants can have heterogeneous schemas
* No schema modifications required
* No application query modifications required
* Schema-based sharding SQL compatibility is better compared to row-based sharding

Drawbacks:

* Fewer tenants per node compared to row-based sharding

## Sharding tradeoffs

<br />

|| Schema-based sharding | Row-based sharding|
|---|---|---|
|Multi-tenancy model|Separate schema per tenant|Shared tables with tenant ID columns|
|Citus version|12.0+|All versions|
|Extra steps compared to vanilla PostgreSQL|None, only a config change|Use create_distributed_table on each table to distribute & colocate tables by tenant ID|
|Number of tenants|1-10k|1-1 M+|
|Data modeling requirement|No foreign keys across distributed schemas|Need to include a tenant ID column (a distribution column, also known as a sharding key) in each table, and in primary keys, foreign keys|
|SQL requirement for single node queries|Use a single distributed schema per query|Joins and WHERE clauses should include tenant_id column|
|Parallel cross-tenant queries|No|Yes|
|Custom table definitions per tenant|Yes|No|
|Access control|Schema permissions|Schema permissions|
|Data sharing across tenants|Yes, using reference tables (in a separate schema)|Yes, using reference tables|
|Tenant to shard isolation|Every tenant has its own shard group by definition|Can give specific tenant IDs their own shard group via isolate_tenant_to_new_shard|