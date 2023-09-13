---
title: Multi-tenant monitoring - Azure Cosmos DB for PostgreSQL
description: Multi-tenant metrics tracking summary
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: include
ms.date: 06/05/2023
---

When you enable this feature, accounting is activated for SQL commands such as `INSERT`, `UPDATE`, `DELETE`, and `SELECT`. This accounting is specifically designed for a `single tenant`. A query qualifies to be a single tenant query, if the query planner can restrict the query to a single shard or single tenant.
