---
title: Starter plan preview - Hyperscale (Citus) - Azure Database for PostgreSQL
description: The single node starter plan for Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 3/10/2021
---

# Starter plan (preview)

> [!IMPORTANT]
> The Hyperscale (Citus) starter plan is currently in public preview.  This
> preview version is provided without a service level agreement, and it's not
> recommended for production workloads. Certain features might not be supported
> or might have constrained capabilities.  For more information, see
> [Supplemental Terms of Use for Microsoft Azure
> Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The starter plan in Azure Database for PostgreSQL - Hyperscale (Citus) is a
simple way to create a small server group that you can scale later. While
server groups in the standard plan have a coordinator node and at least two
worker nodes, the starter plan runs everything in a single database node.

Other than using fewer nodes, the starter plan has all the features of the
standard plan. Like the standard plan, it supports high availability, read
replicas, and columnar table storage, among other features.

## Choosing starter vs standard

The starter plan can be an economical and convenient deployment option for
initial development, testing, and continuous integration. It uses a single
database node and presents the same SQL API as the standard plan. You can test
applications with the starter plan and later [graduate to the standard
plan](howto-hyperscale-scale-grow.md#add-worker-nodes) with confidence that the
interface remains the same.

The starter plan is also appropriate for smaller workloads in production (once
it emerges from public preview into general availability). There is room to
scale vertically *within* the starter plan by increasing the number of server
vCores.

When greater scale is required right away, use the standard plan. Its smallest
allowed server group has one coordinator node and two workers. You can choose
to use more nodes based on your use-case, as described in our [initial
sizing](howto-hyperscale-scale-initial.md) how-to.

## Next steps

* Learn to [provision the starter plan](quickstart-create-hyperscale-starter-plan.md)
* When you're ready, see [how to graduate](howto-hyperscale-scale-grow.md#add-worker-nodes) from the starter plan to the standard plan
* The [columnar storage](concepts-hyperscale-columnar.md) option is available in both the starter and standard plan
