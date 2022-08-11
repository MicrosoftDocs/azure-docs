---
title: Overview of Azure Database for PostgreSQL - Hyperscale (Citus)
description: A guide to running Hyperscale (Citus) on Azure
ms.author: jonels
author: jonels-msft
ms.custom: mvc
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: overview
recommendations: false
ms.date: 08/11/2022
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD026 -->

# Azure Database for PostgreSQL - Hyperscale (Citus)

## The superpower of distributed tables

<!-- markdownlint-disable MD034 -->

> [!VIDEO https://www.youtube.com/embed/Q30KQ5wRGxU]

<!-- markdownlint-enable MD034 -->

Hyperscale (Citus) is PostgreSQL extended with the superpower of "distributed
tables." This superpower enables you to build highly scalable relational apps.
You can start building apps on a single node server group, the same way you
would with PostgreSQL. As your app's scalability and performance requirements
grow, you can seamlessly scale to multiple nodes by transparently distributing
your tables.

Real-world customer applications built on Citus include SaaS apps, real-time
operational analytics apps, and high throughput transactional apps. These apps
span various verticals such as sales & marketing automation, healthcare,
IOT/telemetry, finance, logistics, and search.

![distributed architecture](../media/overview-hyperscale/distributed.png)

## Implementation checklist

As you're looking to create applications with Hyperscale (Citus), ensure you're
reviewed the following topics:

<!-- markdownlint-disable MD032 -->

> [!div class="checklist"]
> - Learn how to [build scalable apps](quickstart-build-scalable-apps-overview.md)
> - Connect and query with your [app stack](quickstart-app-stacks-overview.md)
> - See how the [Hyperscale (Citus) API](reference-overview.md) extends
>   PostgreSQL, and try [useful diagnostic
>   queries](howto-useful-diagnostic-queries.md)
> - Pick the best [server group size](howto-scale-initial.md) for your workload
> - [Monitor](howto-monitoring.md) server group performance
> - Ingest data efficiently with [Azure Stream Analytics](howto-ingest-azure-stream-analytics.md)
>   and [Azure Data Factory](howto-ingest-azure-data-factory.md)

<!-- markdownlint-enable MD032 -->

## Fully managed, resilient database

As Hyperscale (Citus) is a fully managed service, it has all the features for
worry-free operation in production. Features include:

* automatic high availability
* backups
* built-in pgBouncer
* read-replicas
* easy monitoring
* private endpoints
* encryption
* and more

> [!div class="nextstepaction"]
> [Try the quickstart >](quickstart-create-portal.md)

## Always the latest PostgreSQL features

Hyperscale (Citus) is built around the open-source
[Citus](https://github.com/citusdata/citus) extension to PostgreSQL. Because
Citus is an extension--not a fork--of the underlying database, it always
supports the latest PostgreSQL version within one day of release.

Your apps can use the newest PostgreSQL features and extensions, such as
native partitioning for performance, JSONB support to store and query
unstructured data, and geospatial functionality via the PostGIS extension.
It's the speed you need, on the database you love.

## Start simply, scale seamlessly

The Basic Tier allows you to deploy Hyperscale (Citus) as a single node, while
having the superpower of distributing tables. At a few dollars a day, it's the
most cost-effective way to experience Hyperscale (Citus). Later, if your
application requires greater scale, you can add nodes and rebalance your data.

![graduating to standard tier](../media/overview-hyperscale/graduate.png)

## Next steps

> [!div class="nextstepaction"]
> [Try the quickstart >](quickstart-create-portal.md)
