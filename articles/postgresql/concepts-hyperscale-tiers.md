---
title: Basic tier - Hyperscale (Citus) - Azure Database for PostgreSQL
description: The single node basic tier for Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 08/03/2021
---

# Basic tier

The basic tier in Azure Database for PostgreSQL - Hyperscale (Citus) is a
simple way to create a small server group that you can scale later. While
server groups in the standard tier have a coordinator node and at least two
worker nodes, the basic tier runs everything in a single database node.

Other than using fewer nodes, the basic tier has all the features of the
standard tier. Like the standard tier, it supports high availability, read
replicas, and columnar table storage, among other features.

## Choosing basic vs standard tier

The basic tier can be an economical and convenient deployment option for
initial development, testing, and continuous integration. It uses a single
database node and presents the same SQL API as the standard tier. You can test
applications with the basic tier and later [graduate to the standard
tier](howto-hyperscale-scale-grow.md#add-worker-nodes) with confidence that the
interface remains the same.

The basic tier is also appropriate for smaller workloads in production. There
is room to scale vertically *within* the basic tier by increasing the number of
server vCores.

When greater scale is required right away, use the standard tier. Its smallest
allowed server group has one coordinator node and two workers. You can choose
to use more nodes based on your use-case, as described in our [initial
sizing](howto-hyperscale-scale-initial.md) how-to.

## Next steps

* Learn to [provision the basic tier](quickstart-create-hyperscale-basic-tier.md)
* When you're ready, see [how to graduate](howto-hyperscale-scale-grow.md#add-worker-nodes) from the basic tier to the standard tier
* The [columnar storage](concepts-hyperscale-columnar.md) option is available in both the basic and standard tier
