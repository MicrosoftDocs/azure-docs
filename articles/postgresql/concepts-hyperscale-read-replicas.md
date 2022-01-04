---
title: Read replicas - Azure Database for PostgreSQL - Hyperscale (Citus)
description: This article describes the read replica feature in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 08/03/2021
---

# Read replicas in Azure Database for PostgreSQL - Hyperscale (Citus)

The read replica feature allows you to replicate data from a Hyperscale (Citus)
server group to a read-only server group. Replicas are updated
**asynchronously** with PostgreSQL physical replication technology. You can
replicate from the primary server to an unlimited number of replicas.

Replicas are new server groups that you manage similar to regular Hyperscale
(Citus) server groups. For each read replica, you're billed for the provisioned
compute in vCores and storage in GB/ month.

Learn how to [create and manage
replicas](howto-hyperscale-read-replicas-portal.md).

## When to use a read replica

The read replica feature helps to improve the performance and scale of
read-intensive workloads. Read workloads can be isolated to the replicas, while
write workloads can be directed to the primary.

A common scenario is to have BI and analytical workloads use the read replica
as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity
burdens on the primary.

### Considerations

The feature is meant for scenarios where replication lag is acceptable, and is
meant for offloading queries. It isn't meant for synchronous replication
scenarios where replica data is expected to be up to date. There will be a
measurable delay between the primary and the replica. The delay can be minutes
or even hours depending on the workload and the latency between the primary and
the replica.  The data on the replica eventually becomes consistent with the
data on the primary. Use this feature for workloads that can accommodate this
delay. 

## Create a replica

When you start the create replica workflow, a blank Hyperscale (Citus) server
group is created. The new group is filled with the data that was on the primary
server group. The creation time depends on the amount of data on the primary
and the time since the last weekly full backup. The time can range from a few
minutes to several hours.

The read replica feature uses PostgreSQL physical replication, not logical
replication. The default mode is streaming replication using replication slots.
When necessary, log shipping is used to catch up.

Learn how to [create a read replica in the Azure
portal](howto-hyperscale-read-replicas-portal.md).

## Connect to a replica

When you create a replica, it doesn't inherit firewall rules the primary
server group. These rules must be set up independently for the replica.

The replica inherits the admin ("citus") account from the primary server group.
All user accounts are replicated to the read replicas. You can only connect to
a read replica by using the user accounts that are available on the primary
server.

You can connect to the replica's coordinator node by using its hostname and a
valid user account, as you would on a regular Hyperscale (Citus) server group.
For a server named **my replica** with the admin username **citus**, you can
connect to the coordinator node of the replica by using psql:

```bash
psql -h c.myreplica.postgres.database.azure.com -U citus@myreplica -d postgres
```

At the prompt, enter the password for the user account.

## Considerations

This section summarizes considerations about the read replica feature.

### New replicas

A read replica is created as a new Hyperscale (Citus) server group. An existing
server group can't be made into a replica. You can't create a replica of
another read replica.

### Replica configuration

A replica is created by using the same compute, storage, and worker node
settings as the primary. After a replica is created, several settings can be
changed, including storage and backup retention period. Other settings can't be
changed in replicas, such as storage size and number of worker nodes.

Remember to keep replicas strong enough to keep up changes arriving from the
primary. For instance, be sure to upscale compute power in replicas if you
upscale it on the primary.

Firewall rules and parameter settings are not inherited from the primary server
to the replica when the replica is created or afterwards.

### Regions

Hyperscale (Citus) server groups support only same-region replication.

## Next steps

* Learn how to [create and manage read replicas in the Azure
  portal](howto-hyperscale-read-replicas-portal.md).
