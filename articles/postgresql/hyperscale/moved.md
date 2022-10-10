---
title: Where is Azure Database for PostgreSQL - Hyperscale (Citus)
description: Hyperscale (Citus) is now Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
recommendations: false
ms.date: 10/10/2022
---

# Where is Azure Database for PostgreSQL - Hyperscale (Citus)?

Hyperscale (Citus) is now [Azure Cosmos DB for
PostgreSQL](../../cosmos-db/postgresql/introduction.md). The new service is
backward compatible with Hyperscale (Citus), and adds new features.

Existing Hyperscale (Citus) server groups will automatically become Azure
Cosmos DB for PostgreSQL clusters, with zero downtime.

> [!NOTE]
>
> The change will happen October 29th, 2022. During this process, the cluster
> may temporarily disappear in the Azure portal for both Hyperscale (Citus) and
> Cosmos DB. There will be no service downtime for users of the database, only
> a possible interruption in the portal administrative interface.

## What remains the same?

* **Exiting features.** All Hyperscale (Citus) features continue to be supported.
* **Pricing model.** Azure Cosmos DB for PostgreSQL has the same pricing as Hyperscale (Citus).
* **System architecture.** Some terminology has changed, but the technical architecture remains the same.
* **Database connection strings.** Connection strings don't change; application code connects the same way.

## What changes?

* **New features.**
  * Cross-region read replicas.
  * Data loading from Azure blob storage.
  * Online tenant isolation.
  * Online table distribution.

## Next steps

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for PostgreSQL >](../../cosmos-db/postgresql/quickstart-create-portal.md)
