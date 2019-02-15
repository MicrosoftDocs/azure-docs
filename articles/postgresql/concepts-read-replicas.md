---
title: Read replicas in Azure Database for PostgreSQL
description: This article describes the read replica feature in Azure Database for PostgreSQL.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 02/01/2019
---

# Read replicas in Azure Database for PostgreSQL

The read replica feature allows you to replicate data from an Azure Database for PostgreSQL server to a read-only server. You can replicate from the master server to up to five replicas within the same Azure region. Replicas are updated asynchronously with the Azure Database for PostgreSQL engine native replication technology.

> [!IMPORTANT]
> The read replica feature is in public preview.

Replicas are new servers that you manage in a way similar to regular Azure Database for PostgreSQL servers. For each read replica, you're billed for the set-up computes in vCores and storage in GB/ month.

To learn how to create and manage replicas, see the [How-to article](howto-read-replicas-portal.md).

## When to use a read replica
The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the master.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the master. This feature isn't targeted at write-intensive workloads.

The read replica feature uses Azure Database for PostgreSQL asynchronous replication. The feature isn't meant for synchronous replication scenarios. There will be a measurable delay between the master and the replica. The data on the replica eventually becomes consistent with the data on the master. Use this feature for workloads that can accommodate this delay.

## Create a replica
The master server must have the `azure.replication_support` parameter set to **REPLICA**. When this parameter is changed, a server restart is required for the change to take effect. (The `azure.replication_support` parameter applies to the General Purpose and Memory Optimized tiers only).

When you start the create replica workflow, a blank Azure Database for PostgreSQL server is created. The new server is filled with the data that was on the master server. The creation time is based on the amount of data on the master and the time since the last weekly full backup. The time can range from a few minutes to several hours.

The read replica feature uses Azure Database for PostgreSQL physical replication, not logical replication. Streaming replication by using replication slots is the default operation mode. When necessary, log shipping is used for catch up.

> [!NOTE]
> If you don't have a storage alert set up on your servers, we recommend that you do so. The alert informs you when a server is approaching its storage limit, which will affect the replication.

Learn how to [create a read replica in the Azure portal](howto-read-replicas-portal.md).

## Connect to a replica
When you create a replica, it doesn't inherit the firewall rules or VNet service endpoint of the master server. These rules must be set up independently for the replica.

The replica inherits its' admin account from the master server. All user accounts on the master server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the master server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for PostgreSQL server. If the server's name is **myreplica**, and the admin username is **myadmin**, you can connect to the replica from `psql` as follows:

```
psql -h myreplica.postgres.database.azure.com -U myadmin@myreplica -d postgres
```

At the prompt, enter the password for the user account.

## Monitor replication
The **Max Lag across Replicas** metric is available in Azure Monitor. This metric is available on the master server only. The metric shows the lag in bytes between the master and the most-lagging replica. 

The **Replica Lag** metric is also provided in Azure Monitor. This metric is available for replicas only. 

The metric is calculated from the `pg_stat_wal_receiver` view:

```SQL
EXTRACT (EPOCH FROM now() - pg_last_xact_replay_timestamp())
```

The Replica Lag metric shows the time since the last replayed transaction. When no transactions are occurring on your master, the metric reflects this time lag.

Set an alert to inform you when the replica lag reaches a value that isn’t acceptable for your workload. 

For additional insight, query the master server directly to get the replication lag in bytes on all replicas.

In Azure Database for PostgreSQL version 10:

```SQL
select pg_wal_lsn_diff(pg_current_wal_lsn(), stat.replay_lsn) 
AS total_log_delay_in_bytes from pg_stat_replication;
```

In Azure Database for PostgreSQL version 9.6 and earlier:

```SQL
select pg_xlog_location_diff(pg_current_xlog_location(), stat.replay_location) 
AS total_log_delay_in_bytes from pg_stat_replication;
```

> [!NOTE]
> If a master or replica server restarts, the time it takes to restart and catch up is reflected in the Replica Lag metric.

## Stop replication
You can stop replication between a master and a replica. The stop action causes the replica to restart and to remove its replication settings. After replication is stopped between a master and a replica server, the replica becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was started. The standalone server doesn't catch up with the master server.

> [!IMPORTANT]
> The standalone server can't be made into a replica again.
> Before you stop replication on a replica server, ensure the replica has all the data that you require.

Learn how to [stop replication on a replica](howto-read-replicas-portal.md).


## Considerations

The following sections summarize considerations about the read replica feature.

### Prerequisite
Before you create a read replica, the `azure.replication_support` parameter must be set to **REPLICA** on the master server. When this parameter is changed, a server restart is required for the change to take effect. The `azure.replication_support` parameter applies to the General Purpose and Memory Optimized tiers only.

### New replica
A read replica is created as a new Azure Database for PostgreSQL server. An existing server can't be made into a replica.

A read replica can only be created in the same Azure region as the master.

You can't create a replica of another read replica.

### Stopped replica
If you stop replication between a master and replica, the replica server restarts to apply the change. The stopped replica becomes a read-write standalone server. The standalone server can't be made into a replica again.

### Replica configuration
A replica server is created by using the same server configuration as the master. The configuration includes the following settings:
- Pricing tier <sup>1, 2</sup>
- Compute generation <sup>1</sup>
- vCores <sup>1</sup>
- Storage <sup>1</sup>
- Back-up retention period <sup>1</sup>
- Back-up redundancy option
- Azure Database for PostgreSQL engine version

<sup><strong>1</strong></sup> After a replica is created, you can change this setting independently from the master server.<br>
<sup><strong>2</strong></sup> After a replica is created, you can't change the value of the pricing tier to or from the Basic tier.

> [!IMPORTANT]
> Before a master server configuration is updated to new values, update the replica configuration to equal or greater values. This action ensures the replica can keep up with any changes made to the master.

Azure Database for PostgreSQL requires the replica server value for the `max_connections` parameter to be greater than or equal to the master value; otherwise, the replica won't start. In Azure Database for PostgreSQL, the `max_connections` parameter value is based on the sku. For more information, see [Limitations in Azure Database for PostgreSQL](concepts-limits.md). 

If you try to update the server values, but don't adhere to the limitations, you can receive an error.

### Master server deleted
When a master server is deleted, all of its read replicas become standalone servers. The replicas are restarted to reflect this change.

## Next steps
Learn how to [create and manage read replicas in the Azure portal](howto-read-replicas-portal.md).
