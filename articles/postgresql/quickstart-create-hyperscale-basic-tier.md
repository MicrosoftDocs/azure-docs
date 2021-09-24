---
title: 'Quickstart: create a basic tier server group - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Get started with the Azure Database for PostgreSQL Hyperscale (Citus) basic tier.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc
ms.topic: quickstart
ms.date: 08/03/2021
#Customer intent: As a developer, I want to provision a hyperscale server group so that I can run queries quickly on large datasets.
---

# Create a Hyperscale (Citus) basic tier server group in the Azure portal

Azure Database for PostgreSQL - Hyperscale (Citus) is a managed service that
you use to run, manage, and scale highly available PostgreSQL databases in the
cloud. Its [basic tier](concepts-hyperscale-tiers.md) is a a convenient
deployment option for initial development and testing.

This quickstart shows you how to create a Hyperscale (Citus) basic tier
server group using the Azure portal. You'll provision the server group
and verify that you can connect to it to run queries.

[!INCLUDE [azure-postgresql-hyperscale-create-basic-tier](../../includes/azure-postgresql-hyperscale-create-basic-tier.md)]

## Next steps

In this quickstart, you learned how to provision a Hyperscale (Citus) server group. You connected to it with psql, created a schema, and distributed data.

- Follow a tutorial to [build scalable multi-tenant
  applications](./tutorial-design-database-hyperscale-multi-tenant.md)
- Determine the best [initial
  size](howto-hyperscale-scale-initial.md) for your server group
