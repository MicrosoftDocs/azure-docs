---
title: Read replicas - Azure Cosmos DB for PostgreSQL
description: This article describes the read replica feature in Azure Cosmos DB for PostgreSQL.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 06/05/2023
---

# Read replicas in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The read replica feature allows you to replicate data from a
cluster to a read-only cluster. Replicas are updated
**asynchronously** with PostgreSQL physical replication technology. You can
run to up to five replicas from the primary server.

Replicas are new clusters that you manage similar to regular clusters. For each
read replica, you're billed for the provisioned compute in vCores and storage
in GiB/month. Compute and storage costs for replica clusters are the same as
for regular clusters.

Learn how to [create and manage replicas](howto-read-replicas-portal.md).

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
or even hours, depending on the workload and the latency between primary and
replica.  The data on the replica eventually becomes consistent with the
data on the primary. Use this feature for workloads that can accommodate this
delay. 

## Create a replica

When you start the create replica workflow, a blank cluster
is created. The new cluster is filled with the data that was on the primary
cluster. The creation time depends on the amount of data on the primary
and the time since the last weekly full backup. The time can range from a few
minutes to several hours.

The read replica feature uses PostgreSQL physical replication, not logical
replication. The default mode is streaming replication using replication slots.
When necessary, log shipping is used to catch up.

Learn how to [create a read replica in the Azure
portal](howto-read-replicas-portal.md).

## Connect to a replica

When you create a replica, it doesn't inherit firewall rules the primary
cluster. These rules must be set up independently for the replica.

The replica inherits the admin (`citus`) account from the primary cluster.
All user accounts are replicated to the read replicas. You can only connect to
a read replica by using the user accounts that are available on the primary
server.

You can connect to the replica's coordinator node by using its hostname and a
valid user account, as you would on a regular cluster.
For instance, given a server named **my replica** with the admin username
**citus**, you can connect to the coordinator node of the replica by using
psql:

```bash
psql -h c-myreplica.12345678901234.postgres.cosmos.azure.com -U citus@myreplica -d postgres
```

At the prompt, enter the password for the user account.

## Replica promotion to independent cluster

You can promote a replica to an independent cluster that is readable and
writable. A promoted replica no longer receives updates from its original, and
promotion can't be undone. Promoted replicas can have replicas of their own.

There are two common scenarios for promoting a replica:

1. **Disaster recovery.** If something goes wrong with the primary, or with an
   entire region, you can open another cluster for writes as an emergency
   procedure.
2. **Migrating to another region.** If you want to move to another region,
   create a replica in the new region, wait for data to catch up, then promote
   the replica.  To avoid potentially losing data during promotion, you may want
   to disable writes to the original cluster after the replica catches up.

   You can see how far a replica has caught up using the `replication_lag`
   metric. See [metrics](concepts-monitoring.md#metrics) for more information.

## Considerations

This section summarizes considerations about the read replica feature.

### New replicas

A read replica is created as a new cluster. An existing
cluster can't be made into a replica. You can't create a replica of
another read replica.

### Replica configuration

Replicas inherit compute, storage, and worker node settings from their
primaries. You can change some--but not all--settings on a replica.  For
instance, you can change compute, firewall rules for public access, and private
endpoints for private access. You can't change the storage size or number of
worker nodes.

Remember to keep replicas strong enough to keep up changes arriving from the
primary. For instance, be sure to upscale compute power in replicas if you
upscale it on the primary.

Firewall rules and parameter settings aren't inherited from the primary server
to the replica when the replica is created or afterwards.

### Cross-region replication

Read replicas can be created in the region of the primary cluster, or in
any other [region supported by Azure Cosmos DB for PostgreSQL](resources-regions.md). The
limit of five replicas per cluster counts across all regions, meaning five
total, not five per region.

## Next steps

* Learn how to [create and manage read replicas in the Azure
  portal](howto-read-replicas-portal.md).
