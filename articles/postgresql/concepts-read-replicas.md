---
title: Read replicas in Azure Database for PostgreSQL
description: This article describes read replicas in Azure Database for PostgreSQL.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/22/2019
---

# Read Replicas in Azure Database for PostgreSQL
The read replica feature allows you to replicate data from an Azure Database for PostgreSQL server (master) to up to five read-only servers (read replicas) within the same Azure region. Read replicas are asynchronously updated using the PostgreSQL engine's native replication technology.

Replicas are new servers that can be managed in similar ways as normal standalone Azure Database for PostgreSQL servers. For each read replica, you are billed for the provisioned compute in vCores and provisioned storage in GB/month.

## When to use read replicas
The read replica feature is targeted at helping improve the performance and scale of read-intensive workloads. For instance, the read workloads could be isolated to the replicas, while write workloads can be directed to the master.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Since replicas are read-only, they do not directly alleviate write-capacity burdens on the master, and so this feature is not targeted at write-intensive workloads.

The read replica feature uses PostgreSQL's asynchronous replication and so is not meant for synchronous replication scenarios. There will be a measurable delay between the master and the replica. The data on the replica becomes eventually consistent with the data on the master. Use this feature for workloads that can accommodate this delay.

## Creating a replica
The master server must have the **azure.replication_support** set to REPLICA. Changing this parameter requires a server restart to take effect. (**Azure.replication_support** parameter applies to General Purpose and Memory Optimized tiers only).

When you initiate the create replica workflow, a blank Azure Database for PostgreSQL server is created. The new server is filled with the data that was on the master server. The time it takes to create the new replica depends on the amount of data on the master and the time since the last weekly full backup. This may range from a few minutes to a few hours.

The read replica feature uses PostgreSQL's physical replication (not logical replication). Streaming replication using replication slots is the default operation mode. When necessary, log shipping is used for catch-up.

> [!NOTE]
> If you do not already have a storage alert set up on your servers we recommend that you do so, to inform you when a server is approaching its storage limit, since this will affect the replication.

[Learn how to create a read replica in the Azure portal](howto-read-replicas-portal.md).

## Connecting to a replica
When you create a replica, it does not inherit the firewall rules or VNet service endpoint of the master server. These rules must be set up independently for the replica.

The replica inherits its admin account from the master server. All user accounts on the master server are replicated to the read replicas. You can only connect to a read replica using the user accounts available on the master server.

You can connect to the replica using its hostname and a valid user account, as you would on a regular Azure Database for PostgreSQL server. For instance, if the server's name is myreplica, and the admin username is myadmin you can connect to it from psql as follows:

```
psql -h myreplica.postgres.database.azure.com -U myadmin@myreplica -d postgres
```
and at the prompt enter the password for the user account.

## Monitoring replication
There is a **Max Lag across Replicas** metric available in Azure Monitor. This metric is available on the master server only. The metric shows the lag time between the master and the most lagging replica. 

We also provide a **Replica Lag** metric in Azure Monitor. This metric is available for replicas only. 

The metric is calculated from the pg_stat_wal_receiver view:

```SQL
EXTRACT (EPOCH FROM now() - pg_last_xact_replay_timestamp())
```
Remember that the Replica Lag metric shows the time since the last replayed transaction. If there are no transactions occurring on your master, the metric reflects this time lag.

We recommend that you set an alert that informs you when the replica lag reaches a value that isn’t acceptable for your workload. 

For additional insight, query the master server directly to get the replication lag in bytes on all replicas.
On PG 10:
```SQL
select pg_wal_lsn_diff(pg_current_wal_lsn(), stat.replay_lsn) 
AS total_log_delay_in_bytes from pg_stat_replication;
```

On PG 9.6 and below:
```SQL
select pg_xlog_location_diff(pg_current_xlog_location(), stat.replay_location) 
AS total_log_delay_in_bytes from pg_stat_replication;
```

> [!NOTE]
> If either a master or replica server restarts, the time it takes to restart and then catch up will be reflected in the Replica Lag metric.

## Stopping replication to a replica
You can choose to stop replication between a master and a replica. This will cause the replica to restart to remove its replication settings. Once replication has been stopped between a master and a replica server, the replica server becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was initiated. This standalone server does not catch up with the master server.

This server cannot be made into a replica again.

Ensure that the replica has all the data you require before you stop replication.

You can [learn how to stop a replica in the how-to documentation](howto-read-replicas-portal.md).


## Considerations

### Preparing for replica
**azure.replication_support** must be set to REPLICA on the master server before you can create a replica. Changing this parameter requires a server restart to take effect. This parameter applies to General Purpose and Memory Optimized tiers only.

### Stopped replicas
When you choose to stop replication between a master and replica, the replica will restart to apply these changes. Afterwards, it cannot be made into a replica again.

### Replicas are new servers
Replicas are created as new Azure Database for PostgreSQL servers. Existing servers cannot be made into replicas.

### Replica server configuration
Replica servers are created using the same server configurations as the master, which includes the following configurations:
- Pricing tier
- Compute generation
- vCores
- Storage
- Backup retention period
- Backup redundancy option
- PostgreSQL engine version

After a replica has been created, the pricing tier (except to and from Basic), compute generation, vCores, storage, and backup retention period can be changed independently from the master server.

> [!IMPORTANT]
> Before a master's server configuration is updated to new values, the replicas' configuration should be updated to equal or greater values. This ensures that the replicas are able to keep up with changes made to the master.

In particular, Postgres requires the replica server value for the parameter max_connections to be greater than or equal to the master’s value otherwise the replica will not start. In Azure Database for PostgreSQL, the max_connections value is set depending on the sku. For more information, read [the limits doc](concepts-limits.md). 

Attempting to do an update that violates this will lead to an error.


### Deleting the master
When a master server is deleted, all its read replicas become standalone servers. The replicas will be restarted to reflect this change.

### Other
- Read replicas can only be created in the same Azure region as the master.
- Creating a replica of a replica is not supported.

## Next steps
- [How to create and manage read replicas in the Azure portal](howto-read-replicas-portal.md).
