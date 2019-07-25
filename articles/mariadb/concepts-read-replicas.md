---
title: Read replicas in Azure Database for MariaDB
description: This article describes read replicas for Azure Database for MariaDB.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 07/12/2019
---

# Read replicas in Azure Database for MariaDB

The read replica feature allows you to replicate data from an Azure Database for MariaDB server to a read-only server. You can replicate from the master server to up to five replicas. Replicas are updated asynchronously using the MariaDB engine's binary log (binlog) file position-based replication technology with global transaction ID (GTID). To learn more about binlog replication, see the [binlog replication overview](https://mariadb.com/kb/en/library/replication-overview/).

> [!IMPORTANT]
> You can create a read replica in the same region as your master server, or in any other Azure region of your choice. Read replicas (same region and cross-region) are currently in public preview.

Replicas are new servers that you manage similar to regular Azure Database for MariaDB servers. For each read replica, you're billed for the provisioned compute in vCores and storage in GB/ month.

To learn more about GTID replication, please see the [MariaDB replication documentation](https://mariadb.com/kb/en/library/gtid/).

## When to use a read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the master.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the master. This feature isn't targeted at write-intensive workloads.

The read replica feature uses asynchronous replication. The feature isn't meant for synchronous replication scenarios. There will be a measurable delay between the master and the replica. The data on the replica eventually becomes consistent with the data on the master. Use this feature for workloads that can accommodate this delay.

Read replicas can enhance your disaster recovery plan. If there is a regional disaster and your master server is unavailable, you can direct your workload to a replica in another region. To do this, first let the replica accept writes by using the stop replication function. You can then redirect your application by updating the connection string. Learn more in the [stop replication](#stop-replication) section.

## Create a replica

If a master server has no existing replica servers, the master will first restart to prepare itself for replication.

When you start the create replica workflow, a blank Azure Database for MariaDB server is created. The new server is filled with the data that was on the master server. The creation time depends on the amount of data on the master and the time since the last weekly full backup. The time can range from a few minutes to several hours.

> [!NOTE]
> If you don't have a storage alert set up on your servers, we recommend that you do so. The alert informs you when a server is approaching its storage limit, which will affect the replication.

Learn how to [create a read replica in the Azure portal](howto-read-replicas-portal.md).

## Connect to a replica

When you create a replica, it doesn't inherit the firewall rules or VNet service endpoint of the master server. These rules must be set up independently for the replica.

The replica inherits the admin account from the master server. All user accounts on the master server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the master server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for MariaDB server. For a server named **myreplica** with the admin username **myadmin**, you can connect to the replica by using the mysql CLI:

```bash
mysql -h myreplica.mariadb.database.azure.com -u myadmin@myreplica -p
```

At the prompt, enter the password for the user account.

## Monitor replication

Azure Database for MariaDB provides the **Replication lag in seconds** metric in Azure Monitor. This metric is available for replicas only.

This metric is calculated using the `seconds_behind_master` metric available in MariaDB's `SHOW SLAVE STATUS` command.

Set an alert to inform you when the replication lag reaches a value that isn’t acceptable for your workload.

## Stop replication

You can stop replication between a master and a replica. After replication is stopped between a master server and a read replica, the replica becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was started. The standalone server doesn't catch up with the master server.

When you choose to stop replication to a replica, it loses all links to its previous master and other replicas. There is no automated failover between a master and its replica.

> [!IMPORTANT]
> The standalone server can't be made into a replica again.
> Before you stop replication on a read replica, ensure the replica has all the data that you require.

Learn how to [stop replication to a replica](howto-read-replicas-portal.md).

## Considerations and limitations

### Pricing tiers

Read replicas are currently only available in the General Purpose and Memory Optimized pricing tiers.

### Master server restart

When you create a replica for a master that has no existing replicas, the master will first restart to prepare itself for replication. Please take this into consideration and perform these operations during an off-peak period.

### New replicas

A read replica is created as a new Azure Database for MariaDB server. An existing server can't be made into a replica. You can't create a replica of another read replica.

### Replica configuration

A replica is created by using the same server configuration as the master. After a replica is created, several settings can be changed independently from the master server: compute generation, vCores, storage, backup retention period, and MariaDB engine version. The pricing tier can also be changed independently, except to or from the Basic tier.

> [!IMPORTANT]
> Before a master server configuration is updated to new values, update the replica configuration to equal or greater values. This action ensures the replica can keep up with any changes made to the master.

### Stopped replicas

If you stop replication between a master server and a read replica, the stopped replica becomes a standalone server that accepts both reads and writes. The standalone server can't be made into a replica again.

### Deleted master and standalone servers

When a master server is deleted, replication is stopped to all read replicas. These replicas become standalone servers. The master server itself is deleted.

### User accounts

Users on the master server are replicated to the read replicas. You can only connect to a read replica using the user accounts available on the master server.

### Server parameters

To prevent data from becoming out of sync and to avoid potential data loss or corruption, some server parameters are locked from being updated when using read replicas.

The following server parameters are locked on both the master and replica servers:
- [`innodb_file_per_table`](https://mariadb.com/kb/en/library/innodb-system-variables/#innodb_file_per_table) 
- [`log_bin_trust_function_creators`](https://mariadb.com/kb/en/library/replication-and-binary-log-system-variables/#log_bin_trust_function_creators)

The [`event_scheduler`](https://mariadb.com/kb/en/library/server-system-variables/#event_scheduler) parameter is locked on the replica servers.

### Other

- Creating a replica of a replica is not supported.
- In-memory tables may cause replicas to become out of sync. This is a limitation of the MariaDB replication technology.
- Ensure the master server tables have primary keys. Lack of primary keys may result in replication latency between the master and replicas.

## Next steps

- Learn how to [create and manage read replicas using the Azure portal](howto-read-replicas-portal.md)
