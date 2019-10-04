---
title: High availability in Azure Database for PostgreSQL – Hyperscale (Citus)
description: High availability and disaster recovery concepts
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 10/03/2019
---

# High availability in Azure Database for PostgreSQL – Hyperscale (Citus)

High availability (HA) avoids database downtime by maintaining replicas of
every node in a server group. If a node goes down, Hyperscale switches incoming
connections from the failed node to its replica. Failover happens quickly, and
promoted nodes always have fresh data through PostgreSQL streaming replication.

To take advantage of HA on the coordinator node, database applications need to
detect and retry dropped connections and failed transactions. The newly
promoted coordinator will be accessible with the same connection string.

Recovery can be broken into three stages: detection, failover, and full
recovery.  Hyperscale runs periodic health checks on every node, and after four
failed checks it determines that a node is down. Hyperscale then promotes a
secondary to primary node status (failover), and provisions a new
secondary-to-be. Streaming replication begins to bring the new node up-to-date.
When all data has been replicated, the node has reached full recovery.

For best disaster recovery support, create your server group in an Azure region
that supports multiple availability zones (AZ). When you do, the server group
places secondary servers in a different availability zone from the primaries.
The server group can then survive a zone failure.

## Next steps

- Learn how to [enable high
  availability](howto-hyperscale-high-availability.md) in a Hyperscale server
  group.
