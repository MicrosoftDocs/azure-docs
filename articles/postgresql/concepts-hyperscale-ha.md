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

High availability protects against database downtime by maintaining a replica,
called a secondary server, for every node in a Hyperscale (Citus) server group.
Replicas continuously receive the latest data through PostgreSQL streaming
replication. If a node goes down, the server group detects the problem and
promotes the replica to replace the failed node. The failover happens quickly,
so database clients experience minimal interruption of service.

The stages of recovery are detection, failover, and full recovery. After
promoting a secondary to primary node status (failover), Hyperscale will
provision a new secondary and will start streaming replication to bring it up
to date.  Until the replication completes (full recovery), the new primary is
"exposed," meaning has no protection in case it fails again.

When a server group is created in an Azure region that supports multiple
availability zones (AZ), the secondary servers are created in a different
availability zone from the primaries. The multi-AZ spread of servers helps for
disaster recovery.

## The mechanism of streaming replication

TODO

## Next steps

- Learn how to [enable high availability](howto-hyperscale-ha.md) in a
  Hyperscale server group.
