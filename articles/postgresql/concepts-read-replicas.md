---
title: Read replicas in Azure Database for PostgreSQL - Single Server
description: This article describes the read replica feature in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/14/2019
---

# Read replicas in Azure Database for PostgreSQL - Single Server

The read replica feature allows you to replicate data from an Azure Database for PostgreSQL server to a read-only server. You can replicate from the master server to up to five replicas. Replicas are updated asynchronously with the PostgreSQL engine native replication technology.

> [!IMPORTANT]
> You can create a read replica in the same region as your master server, or in any other Azure region of your choice. Cross-region replication is currently in public preview.

Replicas are new servers that you manage similar to regular Azure Database for PostgreSQL servers. For each read replica, you're billed for the provisioned compute in vCores and storage in GB/ month.

Learn how to [create and manage replicas](howto-read-replicas-portal.md).

## When to use a read replica
The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the master.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the master. This feature isn't targeted at write-intensive workloads.

The read replica feature uses PostgreSQL asynchronous replication. The feature isn't meant for synchronous replication scenarios. There will be a measurable delay between the master and the replica. The data on the replica eventually becomes consistent with the data on the master. Use this feature for workloads that can accommodate this delay.

Read replicas can enhance your disaster recovery plan. You first need to have a replica in a different Azure region from the master. If there is a region disaster, you can stop replication to that replica and redirect your workload to it. Stopping replication allows the replica to begin accepting writes, as well as reads. Learn more in the [stop replication](#stop-replication) section. 

## Create a replica
The master server must have the `azure.replication_support` parameter set to **REPLICA**. When this parameter is changed, a server restart is required for the change to take effect. (The `azure.replication_support` parameter applies to the General Purpose and Memory Optimized tiers only).

When you start the create replica workflow, a blank Azure Database for PostgreSQL server is created. The new server is filled with the data that was on the master server. The creation time depends on the amount of data on the master and the time since the last weekly full backup. The time can range from a few minutes to several hours.

Every replica is enabled for storage [auto-grow](concepts-pricing-tiers.md#storage-auto-grow). The auto-grow feature allows the replica to keep up with the data replicated to it, and prevent a break in replication caused by out of storage errors.

The read replica feature uses PostgreSQL physical replication, not logical replication. Streaming replication by using replication slots is the default operation mode. When necessary, log shipping is used to catch up.

Learn how to [create a read replica in the Azure portal](howto-read-replicas-portal.md).

## Connect to a replica
When you create a replica, it doesn't inherit the firewall rules or VNet service endpoint of the master server. These rules must be set up independently for the replica.

The replica inherits the admin account from the master server. All user accounts on the master server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the master server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for PostgreSQL server. For a server named **my replica** with the admin username **myadmin**, you can connect to the replica by using psql:

```
psql -h myreplica.postgres.database.azure.com -U myadmin@myreplica -d postgres
```

At the prompt, enter the password for the user account.

## Monitor replication
Azure Database for PostgreSQL provides two metrics for monitoring replication. The two metrics are **Max Lag Across Replicas** and **Replica Lag**. To learn how to view these metrics, see the **Monitor a replica** section of the [read replica how-to article](howto-read-replicas-portal.md).

The **Max Lag Across Replicas** metric shows the lag in bytes between the master and the most-lagging replica. This metric is available on the master server only.

The **Replica Lag** metric shows the time since the last replayed transaction. If there are no transactions occurring on your master server, the metric reflects this time lag. This metric is available for replica servers only. Replica Lag is calculated from the `pg_stat_wal_receiver` view:

```SQL
EXTRACT (EPOCH FROM now() - pg_last_xact_replay_timestamp());
```

Set an alert to inform you when the replica lag reaches a value that isn’t acceptable for your workload. 

For additional insight, query the master server directly to get the replication lag in bytes on all replicas.

In PostgreSQL version 10:

```SQL
select pg_wal_lsn_diff(pg_current_wal_lsn(), stat.replay_lsn) 
AS total_log_delay_in_bytes from pg_stat_replication;
```

In PostgreSQL version 9.6 and earlier:

```SQL
select pg_xlog_location_diff(pg_current_xlog_location(), stat.replay_location) 
AS total_log_delay_in_bytes from pg_stat_replication;
```

> [!NOTE]
> If a master server or read replica restarts, the time it takes to restart and catch up is reflected in the Replica Lag metric.

## Stop replication
You can stop replication between a master and a replica. The stop action causes the replica to restart and to remove its replication settings. After replication is stopped between a master server and a read replica, the replica becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was started. The standalone server doesn't catch up with the master server.

> [!IMPORTANT]
> The standalone server can't be made into a replica again.
> Before you stop replication on a read replica, ensure the replica has all the data that you require.

When you stop replication, the replica loses all links to its previous master and other replicas. There is no automated failover between a master and replica. 

Learn how to [stop replication to a replica](howto-read-replicas-portal.md).


## Considerations

This section summarizes considerations about the read replica feature.

### Prerequisites
Before you create a read replica, the `azure.replication_support` parameter must be set to **REPLICA** on the master server. When this parameter is changed, a server restart is required for the change to take effect. The `azure.replication_support` parameter applies to the General Purpose and Memory Optimized tiers only.

### New replicas
A read replica is created as a new Azure Database for PostgreSQL server. An existing server can't be made into a replica. You can't create a replica of another read replica.

### Replica configuration
A replica is created by using the same server configuration as the master. After a replica is created, several settings can be changed independently from the master server: compute generation, vCores, storage, and backup retention period. The pricing tier can also be changed independently, except to or from the Basic tier.

> [!IMPORTANT]
> Before a master server configuration is updated to new values, update the replica configuration to equal or greater values. This action ensures the replica can keep up with any changes made to the master.

PostgreSQL requires the value of the `max_connections` parameter on the read replica to be greater than or equal to the master value; otherwise, the replica won't start. In Azure Database for PostgreSQL, the `max_connections` parameter value is based on the SKU. For more information, see [Limits in Azure Database for PostgreSQL](concepts-limits.md). 

If you try to update the server values, but don't adhere to the limits, you receive an error.

### max_prepared_transactions
[PostgreSQL requires](https://www.postgresql.org/docs/10/runtime-config-resource.html#GUC-MAX-PREPARED-TRANSACTIONS) the value of the `max_prepared_transactions` parameter on the read replica to be greater than or equal to the master value; otherwise, the replica won't start. If you want to change `max_prepared_transactions` on the master, first change it on the replicas.

### Stopped replicas
If you stop replication between a master server and a read replica, the replica restarts to apply the change. The stopped replica becomes a standalone server that accepts both reads and writes. The standalone server can't be made into a replica again.

### Deleted master and standalone servers
When a master server is deleted, all of its read replicas become standalone servers. The replicas are restarted to reflect this change.

## Next steps
Learn how to [create and manage read replicas in the Azure portal](howto-read-replicas-portal.md).
