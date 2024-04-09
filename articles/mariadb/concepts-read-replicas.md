---
title: Read replicas - Azure Database for MariaDB
description: 'Learn about read replicas in Azure Database for MariaDB: choosing regions, creating replicas, connecting to replicas, monitoring replication, and stopping replication.'
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: conceptual
ms.date: 06/24/2022
ms.custom: references_regions
---

# Read replicas in Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

The read replica feature allows you to replicate data from an Azure Database for MariaDB server to a read-only server. You can replicate from the source server to up to five replicas. Replicas are updated asynchronously using the MariaDB engine's binary log (binlog) file position-based replication technology with global transaction ID (GTID). To learn more about binlog replication, see the [binlog replication overview](https://mariadb.com/kb/en/library/replication-overview/).

Replicas are new servers that you manage similar to regular Azure Database for MariaDB servers. For each read replica, you're billed for the provisioned compute in vCores and storage in GB/ month.

To learn more about GTID replication, see the [MariaDB replication documentation](https://mariadb.com/kb/en/library/gtid/).

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## When to use a read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the primary.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the primary. This feature isn't targeted at write-intensive workloads.

The read replica feature uses asynchronous replication. The feature isn't meant for synchronous replication scenarios. There will be a measurable delay between the source and the replica. The data on the replica eventually becomes consistent with the data on the primary. Use this feature for workloads that can accommodate this delay.

## Cross-region replication

You can create a read replica in a different region from your source server. Cross-region replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users.

You can have a source server in any [Azure Database for MariaDB region](https://azure.microsoft.com/global-infrastructure/services/?products=mariadb).  A source server can have a replica in its paired region or the universal replica regions. The picture below shows which replica regions are available depending on your source region.

[![Read replica regions](media/concepts-read-replica/read-replica-regions.png)](media/concepts-read-replica/read-replica-regions.png#lightbox)

### Universal replica regions

You can create a read replica in any of the following regions, regardless of where your source server is located. The supported universal replica regions include:

Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, East Asia, East US, East US 2, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, UK South, UK West, West Europe, West US, West US 2, West Central US.

### Paired regions

In addition to the universal replica regions, you can create a read replica in the Azure paired region of your source server. If you don't know your region's pair, you can learn more from the [Azure Paired Regions article](../availability-zones/cross-region-replication-azure.md).

If you are using cross-region replicas for disaster recovery planning, we recommend you create the replica in the paired region instead of one of the other regions. Paired regions avoid simultaneous updates and prioritize physical isolation and data residency.

However, there are limitations to consider:

* Regional availability: Azure Database for MariaDB is available in France Central, UAE North, and Germany Central. However, their paired regions are not available.

* Uni-directional pairs: Some Azure regions are paired in one direction only. These regions include West India, Brazil South, and US Gov Virginia. 
   This means that a source server in West India can create a replica in South India. However, a source server in South India cannot create a replica in West India. This is because West India's secondary region is South India, but South India's secondary region is not West India.

## Create a replica

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MariaDB servers in the General Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing tiers.

If a source server has no existing replica servers, the source will first restart to prepare itself for replication.

When you start the create replica workflow, a blank Azure Database for MariaDB server is created. The new server is filled with the data that was on the source server. The creation time depends on the amount of data on the source and the time since the last weekly full backup. The time can range from a few minutes to several hours.

> [!NOTE]
> If you don't have a storage alert set up on your servers, we recommend that you do so. The alert informs you when a server is approaching its storage limit, which will affect the replication.

Learn how to [create a read replica in the Azure portal](howto-read-replicas-portal.md).

## Connect to a replica

At creation, a replica inherits the firewall rules of the source server. Afterwards, these rules are independent from the source server.

The replica inherits the admin account from the source server. All user accounts on the source server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the source server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for MariaDB server. For a server named **myreplica** with the admin username **myadmin**, you can connect to the replica by using the mysql CLI:

```bash
mysql -h myreplica.mariadb.database.azure.com -u myadmin@myreplica -p
```

At the prompt, enter the password for the user account.

## Monitor replication

Azure Database for MariaDB provides the **Replication lag in seconds** metric in Azure Monitor. This metric is available for replicas only.

This metric is calculated using the `seconds_behind_master` metric available in MariaDB's `SHOW SLAVE STATUS` command.

Set an alert to inform you when the replication lag reaches a value that isn't acceptable for your workload.

## Stop replication

You can stop replication between a source and a replica. After replication is stopped between a source server and a read replica, the replica becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was started. The standalone server doesn't catch up with the source server.

When you choose to stop replication to a replica, it loses all links to its previous source and other replicas. There is no automated failover between a source and its replica.

> [!IMPORTANT]
> The standalone server can't be made into a replica again.
> Before you stop replication on a read replica, ensure the replica has all the data that you require.

Learn how to [stop replication to a replica](howto-read-replicas-portal.md).

## Failover

There is no automated failover between source and replica servers.

Since replication is asynchronous, there is lag between the source and the replica. The amount of lag can be influenced by a number of factors like how heavy the workload running on the source server is and the latency between data centers. In most cases, replica lag ranges between a few seconds to a couple minutes. You can track your actual replication lag using the metric *Replica Lag*, which is available for each replica. This metric shows the time since the last replayed transaction. We recommend that you identify what your average lag is by observing your replica lag over a period of time. You can set an alert on replica lag, so that if it goes outside your expected range, you can take action.

> [!Tip]
> If you failover to the replica, the lag at the time you delink the replica from the source will indicate how much data is lost.

After you have decided you want to failover to a replica,

1. Stop replication to the replica.

   This step is necessary to make the replica server able to accept writes. As part of this process, the replica server will be delinked from the primary. After you initiate stop replication, the backend process typically takes about 2 minutes to complete. See the [stop replication](#stop-replication) section of this article to understand the implications of this action.

2. Point your application to the (former) replica.

   Each server has a unique connection string. Update your application to point to the (former) replica instead of the primary.

After your application is successfully processing reads and writes, you have completed the failover. The amount of downtime your application experiences will depend on when you detect an issue and complete steps 1 and 2 above.

## Considerations and limitations

### Pricing tiers

Read replicas are currently only available in the General Purpose and Memory Optimized pricing tiers.

> [!NOTE]
> The cost of running the replica server is based on the region where the replica server is running.

### Source server restart

When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

### New replicas

A read replica is created as a new Azure Database for MariaDB server. An existing server can't be made into a replica. You can't create a replica of another read replica.

### Replica configuration

A replica is created by using the same server configuration as the primary. After a replica is created, several settings can be changed independently from the source server: compute generation, vCores, storage, backup retention period, and MariaDB engine version. The pricing tier can also be changed independently, except to or from the Basic tier.

> [!IMPORTANT]
> Before a source server configuration is updated to new values, update the replica configuration to equal or greater values. This action ensures the replica can keep up with any changes made to the primary.

Firewall rules and parameter settings are inherited from the source server to the replica when the replica is created. Afterwards, the replica's rules are independent.

### Stopped replicas

If you stop replication between a source server and a read replica, the stopped replica becomes a standalone server that accepts both reads and writes. The standalone server can't be made into a replica again.

### Deleted source and standalone servers

When a source server is deleted, replication is stopped to all read replicas. These replicas automatically become standalone servers and can accept both reads and writes. The source server itself is deleted.

### User accounts

Users on the source server are replicated to the read replicas. You can only connect to a read replica using the user accounts available on the source server.

### Server parameters

To prevent data from becoming out of sync and to avoid potential data loss or corruption, some server parameters are locked from being updated when using read replicas.

The following server parameters are locked on both the source and replica servers:

* [`innodb_file_per_table`](https://mariadb.com/kb/en/library/innodb-system-variables/#innodb_file_per_table) 
* [`log_bin_trust_function_creators`](https://mariadb.com/kb/en/library/replication-and-binary-log-system-variables/#log_bin_trust_function_creators)

The [`event_scheduler`](https://mariadb.com/kb/en/library/server-system-variables/#event_scheduler) parameter is locked on the replica servers.

To update one of the above parameters on the source server, please delete replica servers, update the parameter value on the primary, and recreate replicas.

### Other

* Creating a replica of a replica is not supported.
* In-memory tables may cause replicas to become out of sync. This is a limitation of the MariaDB replication technology.
* Ensure the source server tables have primary keys. Lack of primary keys may result in replication latency between the source and replicas.

## Next steps

* Learn how to [create and manage read replicas using the Azure portal](howto-read-replicas-portal.md)
* Learn how to [create and manage read replicas using the Azure CLI and REST API](howto-read-replicas-cli.md)
