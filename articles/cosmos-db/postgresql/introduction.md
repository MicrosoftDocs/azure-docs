---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for PostgreSQL
description: Use Azure Cosmos DB for PostgreSQL to run your PostgreSQL relational data workloads at any scale using your existing skills.
author: jonels-msft
ms.author: jonels
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: overview
ms.date: 02/28/2023
ms.custom: mvc, ignite-2022, build-2023, build-2023-dataai
recommendations: false
---

# What is Azure Cosmos DB for PostgreSQL?

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL is a managed service for PostgreSQL extended
with the [Citus open source](https://github.com/citusdata/citus) superpower of
*distributed tables*. This superpower enables you to build highly scalable
relational apps.  You can start building apps on a single node cluster, the
same way you would with PostgreSQL. As your app's scalability and performance
requirements grow, you can seamlessly scale to multiple nodes by transparently
distributing your tables.

Real-world customer applications built on Azure Cosmos DB for PostgreSQL include software-as-a-service (SaaS) apps, real-time
operational analytics apps, and high throughput transactional apps. These apps
span various verticals such as sales and marketing automation, healthcare,
Internet of Things (IoT) data, finance, logistics, and search.

:::image type="content" source="media/overview/distributed.png" alt-text="Diagram that shows distributed architecture." border="false":::

## Implementation checklist

As you're looking to create applications with Azure Cosmos DB for PostgreSQL, ensure you've
reviewed the following articles:

> [!div class="checklist"]
>
> - Learn how to [build scalable apps](quickstart-build-scalable-apps-overview.md).
> - Connect and query with your [app stack](quickstart-app-stacks-overview.yml).
> - See how the [Azure Cosmos DB for PostgreSQL API](reference-overview.md) extends PostgreSQL, and try [useful diagnostic queries](howto-useful-diagnostic-queries.md).
> - Pick the best [cluster size](howto-scale-initial.md) for your workload.
> - [Monitor](howto-monitoring.md) cluster performance.
> - Ingest data efficiently with [Azure Stream Analytics](howto-ingest-azure-stream-analytics.md)
>   and [Azure Data Factory](howto-ingest-azure-data-factory.md).
>

## Fully managed, resilient database

As Azure Cosmos DB for PostgreSQL is a fully managed service, it has all the features for
worry-free operation in production. Features include:

- automatic high availability
- backups
- built-in pgBouncer
- read-replicas
- easy monitoring
- private endpoints
- encryption
- and more

> [!div class="nextstepaction"]
> [Try the quickstart >](quickstart-create-portal.md)

## Always the latest PostgreSQL features

Azure Cosmos DB for PostgreSQL is powered by the
[Citus](https://github.com/citusdata/citus) open source extension to
PostgreSQL. Because Citus isn't a fork of Postgres, the Citus extension always
supports the latest PostgreSQL major version within a week of release--with
support added to our managed service on Azure at most a few weeks later.

Your apps can use the newest PostgreSQL features and extensions, such as
native partitioning for performance, JSONB support to store and query
unstructured data, and geospatial functionality via the PostGIS extension.
It's the speed you need, on the database you love.

## Start simply, scale seamlessly

A database cluster can begin as a single node, while
having the superpower of distributing tables. At a few dollars a day, it's the
most cost-effective way to experience Azure Cosmos DB for PostgreSQL. Later, if your
application requires greater scale, you can add nodes and rebalance your data.

## Next steps

- [Create a new account](quickstart-create-portal.md) using the Azure portal.
- [Connect to a cluster](quickstart-connect-psql.md) with psql.
- Use the Citus extension to [distribute tables](quickstart-distribute-tables.md).
