---
title: Determine application type - Azure Cosmos DB for PostgreSQL
description: Identify your application for effective distributed data modeling
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 01/30/2023
---

# Determining application type for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Running efficient queries on a cluster requires that
tables be properly distributed across servers. The recommended distribution
varies by the type of application and its query patterns.

There are broadly two kinds of applications that work well on Azure Cosmos DB
for PostgreSQL. The first step in data modeling is to identify which of them
more closely resembles your application.

## At a Glance

| Multi-Tenant Applications                                 | Real-Time Applications                                |
|-----------------------------------------------------------|-------------------------------------------------------|
| Sometimes dozens or hundreds of tables in schema          | Small number of tables                                |
| Queries relating to one tenant  (company/store) at a time | Relatively simple analytics queries with aggregations |
| OLTP workloads for serving web clients                    | High ingest volume of mostly immutable data           |
| OLAP workloads that serve per-tenant analytical queries   | Often centering around large table of events            |

## Examples and Characteristics

**Multi-Tenant Application**

> These are typically SaaS applications that serve other companies,
> accounts, or organizations. Most SaaS applications are inherently
> relational. They have a natural dimension on which to distribute data
> across nodes: just shard by tenant\_id.
>
> Azure Cosmos DB for PostgreSQL enables you to scale out your database to millions of
> tenants without having to re-architect your application. You can keep the
> relational semantics you need, like joins, foreign key constraints,
> transactions, ACID, and consistency.
>
> -   **Examples**: Websites which host store-fronts for other
>     businesses, such as a digital marketing solution, or a sales
>     automation tool.
> -   **Characteristics**: Queries relating to a single tenant rather
>     than joining information across tenants. This includes OLTP
>     workloads for serving web clients, and OLAP workloads that serve
>     per-tenant analytical queries. Having dozens or hundreds of tables
>     in your database schema is also an indicator for the multi-tenant
>     data model.
>
> Scaling a multi-tenant app with Azure Cosmos DB for PostgreSQL also requires minimal
> changes to application code. We have support for popular frameworks like Ruby
> on Rails and Django.

**Real-Time Analytics**

> Applications needing massive parallelism, coordinating hundreds of cores for
> fast results to numerical, statistical, or counting queries.  By sharding and
> parallelizing SQL queries across multiple nodes, Azure Cosmos DB for PostgreSQL makes it
> possible to perform real-time queries across billions of records in under a
> second.
>
> Tables in real-time analytics data models are typically distributed by
> columns like user\_id, host\_id, or device\_id.
>
> -   **Examples**: Customer-facing analytics dashboards requiring
>     sub-second response times.
> -   **Characteristics**: Few tables, often centering around a big
>     table of device-, site- or user-events and requiring high ingest
>     volume of mostly immutable data. Relatively simple (but
>     computationally intensive) analytics queries involving several
>     aggregations and GROUP BYs.

If your situation resembles either case above, then the next step is to decide
how to shard your data in the cluster. The database administrator\'s
choice of distribution columns needs to match the access patterns of typical
queries to ensure performance.

## Next steps

* [Choose a distribution
  column](howto-choose-distribution-column.md) for tables in your
  application to distribute data efficiently
