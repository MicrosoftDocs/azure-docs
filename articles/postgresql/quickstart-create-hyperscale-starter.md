---
title: 'Quickstart: create a starter plan server group - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Get started with the Azure Database for PostgreSQL Hyperscale (Citus) starter plan.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc
ms.topic: quickstart
ms.date: 02/22/2020
#Customer intent: As a developer, I want to provision a hyperscale server group so that I can run queries quickly on large datasets.
---

# Create a Hyperscale (Citus) starter plan server group in the Azure portal

Azure Database for PostgreSQL - Hyperscale (Citus) is a managed service that
you use to run, manage, and scale highly available PostgreSQL databases in the
cloud. Its [starter plan](concepts-hyperscale-starter-plan.md) is a a
convenient deployment option for initial development and testing.

This quickstart shows you how to create a Hyperscale (Citus) starter
plan server group using the Azure portal. You'll provision the server group
and verify that you can connect to it to run queries.

> [!IMPORTANT]
> The Hyperscale (Citus) starter plan is currently in public preview.  This
> preview version is provided without a service level agreement, and it's not
> recommended for production workloads. Certain features might not be supported
> or might have constrained capabilities.  For more information, see
> [Supplemental Terms of Use for Microsoft Azure
> Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [azure-postgresql-hyperscale-create-starter-plan](../../includes/azure-postgresql-hyperscale-create-starter-plan.md)]

## Next steps

In this quickstart, you learned how to provision a Hyperscale (Citus) server group. You connected to it with psql, created a schema, and distributed data.

- Follow a tutorial to [build scalable multi-tenant
  applications](./tutorial-design-database-hyperscale-multi-tenant.md)
- Determine the best [initial
  size](howto-hyperscale-scale-initial.md) for your server group
