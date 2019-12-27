---
title: High availability – Hyperscale (Citus) - Azure Database for PostgreSQL
description: High availability and disaster recovery concepts
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 11/04/2019
---

# High availability in Azure Database for PostgreSQL – Hyperscale (Citus)

High availability (HA) avoids database downtime by maintaining standby replicas
of every node in a server group. If a node goes down, Hyperscale switches
incoming connections from the failed node to its standby. Failover happens
within a few minutes, and promoted nodes always have fresh data through
PostgreSQL synchronous streaming replication.

To take advantage of HA on the coordinator node, database applications need to
detect and retry dropped connections and failed transactions. The newly
promoted coordinator will be accessible with the same connection string.

Recovery can be broken into three stages: detection, failover, and full
recovery.  Hyperscale runs periodic health checks on every node, and after four
failed checks it determines that a node is down. Hyperscale then promotes a
standby to primary node status (failover), and provisions a new standby-to-be.
Streaming replication begins, bringing the new node up-to-date.  When all data
has been replicated, the node has reached full recovery.

### Next steps

- Learn how to [enable high
  availability](howto-hyperscale-high-availability.md) in a Hyperscale server
  group.
