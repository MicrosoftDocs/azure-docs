---
title: 'Quickstart: create a server group - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to create and query distributed tables on Azure Database for PostgreSQL Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 01/24/2022
#Customer intent: As a developer, I want to provision a hyperscale server group so that I can run queries quickly on large datasets.
---

# Create a Hyperscale (Citus) server group in the Azure portal

Azure Database for PostgreSQL is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. This Quickstart shows you how to create an Azure Database for PostgreSQL - Hyperscale (Citus) server group using the Azure portal. You'll explore distributed data: sharding tables across nodes, ingesting sample data, and running queries that execute on multiple nodes.


Azure Database for PostgreSQL - Hyperscale (Citus) is a managed service that
you use to run, manage, and scale highly available PostgreSQL databases in the
cloud. Its [basic tier](concepts-server-group.md#tiers) is a convenient
deployment option for initial development and testing.

This quickstart shows you how to create a Hyperscale (Citus) basic tier server
group using the Azure portal. You'll create the server group and verify that
you can connect to it to run queries.

[!INCLUDE [azure-postgresql-hyperscale-create-db](../../../includes/azure-postgresql-hyperscale-create-db.md)]

**Next steps**

* [Connect to your server group](quickstart-connect-psql.md) with psql.
