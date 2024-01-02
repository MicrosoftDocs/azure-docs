---
title: Build scalable apps - Azure Cosmos DB for PostgreSQL
description: How to build relational apps that scale
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022, build-2023, build-2023-dataai
ms.topic: quickstart
recommendations: false
ms.date: 10/01/2023
---

# Build scalable apps in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

There are three steps involved in building scalable apps with Azure Cosmos DB for PostgreSQL:

1. Classify your application workload. There are use-case where Azure Cosmos DB for PostgreSQL
   shines: Multitenant SaaS, microservices, real-time operational analytics, and high
   throughput OLTP. Determine whether your app falls into one of these categories.
2. Based on the workload, use [schema-based sharding](concepts-sharding-models.md#schema-based-sharding) or identify the optimal shard key for the distributed
   tables. Classify your tables as reference, distributed, or local. 
3. When using [row-based sharding](concepts-sharding-models.md#row-based-sharding), update the database schema and application queries to make them go fast
   across nodes.

**Next steps**

Before you start building a new app, you must first review a little more about
the architecture of Azure Cosmos DB for PostgreSQL.

> [!div class="nextstepaction"]
> [Fundamental concepts for scaling >](quickstart-build-scalable-apps-concepts.md)
