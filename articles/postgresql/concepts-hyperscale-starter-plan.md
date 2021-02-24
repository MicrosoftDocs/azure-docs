---
title: Starter plan preview - Hyperscale (Citus) - Azure Database for PostgreSQL
description: The single node starter plan for Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 2/22/2021
---

# Starter plan (preview)

> [!IMPORTANT]
> The Hyperscale (Citus) starter plan is currently in public preview.  This
> preview version is provided without a service level agreement, and it's not
> recommended for production workloads. Certain features might not be supported
> or might have constrained capabilities.  For more information, see
> [Supplemental Terms of Use for Microsoft Azure
> Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The starter plan for Azure Database for PostgreSQL - Hyperscale (Citus) is a
simple way to create a small server group that you can scale later. Traditional
Hyperscale (Citus) server groups have a coordinator node and at least two
worker nodes, while the starter plan runs everything in a single database node.

The starter plan is more than just easily scalable. Like all Hyperscale (Citus)
server groups, it supports columnar table storage for analytic and data
warehousing workloads.

## Next steps

* Learn to [provision the starter plan](quickstart-create-hyperscale-starter-plan.md)
* When you're ready, see [how to graduate](howto-hyperscale-scale-grow.md#add-worker-nodes) from the starter plan to the standard plan
* The [columnar storage](concepts-hyperscale-columnar.md) option is available in both the starter and standard plan
