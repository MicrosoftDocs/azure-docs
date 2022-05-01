---
title: Server group - Hyperscale (Citus) - Azure Database for PostgreSQL
description: What is a server group in Azure Database for PostgreSQL - Hyperscale (Citus)
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 01/13/2022
---

# Hyperscale (Citus) server group

## Nodes

The Azure Database for PostgreSQL - Hyperscale (Citus) deployment option allows
PostgreSQL servers (called nodes) to coordinate with one another in a "server
group." The server group's nodes collectively hold more data and use more CPU
cores than would be possible on a single server. The architecture also allows
the database to scale by adding more nodes to the server group.

To learn more about the types of Hyperscale (Citus) nodes, see [nodes and
tables](concepts-nodes.md).

### Node status

Hyperscale (Citus) displays the status of nodes in a server group on the
Overview page in the Azure portal. Each node can have one of these status
values:

* **Provisioning**: Initial node provisioning, either as a part of its server
  group provisioning, or when a worker node is added.
* **Available**: Node is in a healthy state.
* **Need attention**: An issue is detected on the node. The node is attempting
  to self-heal. If self-healing fails, an issue gets put in the queue for our
  engineers to investigate.
* **Dropping**: Server group deletion started.
* **Disabled**: The server group's Azure subscription turned into Disabled
  states. For more information about subscription states, see [this
  page](../../cost-management-billing/manage/subscription-states.md).

## Tiers

The basic tier in Azure Database for PostgreSQL - Hyperscale (Citus) is a
simple way to create a small server group that you can scale later. While
server groups in the standard tier have a coordinator node and at least two
worker nodes, the basic tier runs everything in a single database node.

Other than using fewer nodes, the basic tier has all the features of the
standard tier. Like the standard tier, it supports high availability, read
replicas, and columnar table storage, among other features.

### Choosing basic vs standard tier

The basic tier can be an economical and convenient deployment option for
initial development, testing, and continuous integration. It uses a single
database node and presents the same SQL API as the standard tier. You can test
applications with the basic tier and later [graduate to the standard
tier](howto-scale-grow.md#add-worker-nodes) with confidence that the
interface remains the same.

The basic tier is also appropriate for smaller workloads in production. There’s
room to scale vertically *within* the basic tier by increasing the number of
server vCores.

When greater scale is required right away, use the standard tier. Its smallest
allowed server group has one coordinator node and two workers. You can choose
to use more nodes based on your use-case, as described in our [initial
sizing](howto-scale-initial.md) how-to.

#### Tier summary

**Basic tier**

* 2 to 8 vCores, 8 to 32 gigabytes of memory.
* Consists of a single database node, which can be scaled vertically.
* Supports sharding on a single node and can be easily upgraded to a standard tier.
* Economical deployment option for initial development, testing.

**Standard tier**

* 8 to 1000+ vCores, up to 8+ TiB memory
* Distributed Postgres cluster, which consists of a dedicated coordinator
  node and at least two worker nodes.
* Supports Sharding on multiple worker nodes. The cluster can be scaled
  horizontally by adding new worker nodes, and scaled vertically by
  increasing the node vCores.
* Best for performance and scale.

## Next steps

* Learn to [provision the basic tier](quickstart-create-basic-tier.md)
* When you're ready, see [how to graduate](howto-scale-grow.md#add-worker-nodes) from the basic tier to the standard tier
* The [columnar storage](concepts-columnar.md) option is available in both the basic and standard tier
