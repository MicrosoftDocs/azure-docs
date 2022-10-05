---
title: Where is Azure Database for PostgreSQL - Hyperscale (Citus)
description: Hyperscale (Citus) is now Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: concept
recommendations: false
ms.date: 10/05/2022
---

# Where is Azure Database for PostgreSQL - Hyperscale (Citus)?

Hyperscale (Citus) is now [Azure Cosmos DB for
PostgreSQL](../../cosmos-db/postgresql/introduction.md). The new service is
backward compatible with Hyperscale (Citus), and adds new features.

Existing Hyperscale (Citus) server groups will be automatically migrated to Azure
Cosmos DB for PostgreSQL clusters, with zero downtime.

> [!NOTE]
>
> The migration will happen October 29th, 2022. During the migration process,
> the cluster may temporarily disappear in the Azure portal for both Hyperscale
> (Citus) and Cosmos DB. There will be no service downtime for users of the
> database, only a possible interruption in the portal user interface.

## What changes?

| What | Changes |
|------|---------|
| Existing features | All features continue to be supported |
| Pricing model | Same pricing as Hyperscale (Citus) |
| System architecture | Some terminology has changed, but the technical architecture remains the same |
| Database connection strings | Connection strings don't change, application code connects the same |
| New features | Cross-region read replicas; data loading from Azure blob storage |

## Next steps

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for PostgreSQL >](../../cosmos-db/postgresql/quickstart-create.md)
