---
title: Build scalable apps - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to build relational apps that scale
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 04/28/2022
---

# Build scalable apps

> [!NOTE]
> This article is for you if:
>
> * You are building an app on the [Basic Tier](concepts-server-group.md#tiers)
>   with distributed tables, to be ready for the future. (Later, you can add
>   more nodes and scale out as workload grows.)
> * You are starting with the [Standard Tier](concepts-server-group.md#tiers)
>   and deploying Hyperscale (Citus) across multiple nodes.
> * You are already running on Hyperscale (Citus), but aren't using distributed
>   tables.

This series covers how to build scalable relational apps with Hyperscale (Citus).

If you're building an app that a single node database node (8vcore, 32-GB RAM
and 512-GB storage) can handle for the near future (~6 months), then you can
start with the Hyperscale (Citus) **Basic Tier**. Later, you can add more
nodes, rebalance your, data and scale out seamlessly.

If your app needs requires multiple database nodes in the short term, start
with the Hyperscale (Citus) **Standard Tier**.

> [!TIP]
>
> If you choose the Basic Tier, you can treat Hyperscale (Citus) just like
> standard PostgreSQL, and achieve full feature parity. You don’t need any
> distributed data modeling techniques while building your app. If you decide
> to go that route, you can skip this section.

## Three steps for building highly scalable apps

There are three steps involved in building scalable apps with Hyperscale
(Citus):

1. Classify your application workload. There are use-case where Hyperscale
   (Citus) shines: multi-tenant SaaS, real-time operational analytics, and high
   throughput OLTP. Determine whether your app falls into one of these categories.
2. Based on the workload, identify the optimal shard key for the distributed
   tables. Classify your tables as reference, distributed, or local. 
3. Update the database schema and application queries to make them go fast
   across nodes.

## Next steps

Before you start building a new app, you must first learn a little about the
architecture of Hyperscale (Citus).

> [!div class="nextstepaction"]
> [Fundamental concepts for scaling >](howto-build-scalable-apps-concepts.md)
