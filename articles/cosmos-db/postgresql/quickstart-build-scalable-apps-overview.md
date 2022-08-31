---
title: Build scalable apps - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to build relational apps that scale
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: quickstart
recommendations: false
ms.date: 08/11/2022
---

# Build scalable apps

Early in the quickstart, we [created a server
group](quickstart-create-portal.md) using the [basic
tier](concepts-server-group.md#tiers). The basic tier is good for apps that a
single node database node (64vcore, 256-GB RAM and 512-GB storage) can handle
for the near future (~6 months). Later, you can add more nodes, rebalance your,
data and scale out seamlessly.

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

Before you start building a new app, you must first review a little more about
the architecture of Hyperscale (Citus).

> [!div class="nextstepaction"]
> [Fundamental concepts for scaling >](quickstart-build-scalable-apps-concepts.md)
