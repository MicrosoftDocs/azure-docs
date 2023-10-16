---
title: Read replicas - Azure Database for PostgreSQL - Single Server
description: This article describes the read replica feature in Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 06/24/2022
---

# Read replicas in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

The read replica feature allows you to replicate data from an Azure Database for PostgreSQL server to a read-only server. Replicas are updated **asynchronously** with the PostgreSQL engine native physical replication technology. You can replicate from the primary server to up to five replicas.

Replicas are new servers that you manage similar to regular Azure Database for PostgreSQL servers. For each read replica, you're billed for the provisioned compute in vCores and storage in GB/ month.

Learn how to [create and manage replicas](how-to-read-replicas-portal.md).

## When to use a read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the primary. Read replicas can also be deployed on a different region and can be promoted to be a read/write server in the event of a disaster recovery.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the primary.

### Considerations

The feature is meant for scenarios where the lag is acceptable and meant for offloading queries. It isn't meant for synchronous replication scenarios where the replica data is expected to be up-to-date. There will be a measurable delay between the primary and the replica. This can be in minutes or even hours depending on the workload and the latency between the primary and the replica. The data on the replica eventually becomes consistent with the data on the primary. Use this feature for workloads that can accommodate this delay.

> [!NOTE]
> For most workloads read replicas offer near-real-time updates from the primary. However, with persistent heavy write-intensive primary workloads, the replication lag could continue to grow and may never be able to catch-up with the primary. This may also increase storage usage at the primary as the WAL files are not deleted until they are received at the replica. If this situation persists, deleting and recreating the read replica after the write-intensive workloads completes is the option to bring the replica back to a good state with respect to lag.
> Asynchronous read replicas are not suitable for such heavy write workloads. When evaluating read replicas for your application, monitor the lag on the replica for a full app work load cycle thru its peak and non-peak times to access the possible lag and the expected RTO/RPO at various points of the workload cycle.

> [!NOTE]
> Automatic backups are performed for replica servers that are configured with up to 4TB storage configuration.

## Cross-region replication

You can create a read replica in a different region from your primary server. Cross-region replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users.

>[!NOTE]
> Basic tier servers only support same-region replication.

You can have a primary server in any [Azure Database for PostgreSQL region](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). A primary server can have a replica in its paired region or the universal replica regions. The picture below shows which replica regions are available depending on your primary region.

[ :::image type="content" source="media/concepts-read-replica/read-replica-regions.png" alt-text="Read replica regions":::](media/concepts-read-replica/read-replica-regions.png#lightbox)

### Universal replica regions

You can always create a read replica in any of the following regions, regardless of where your primary server is located. These are the universal replica regions:

Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, East Asia, East US, East US 2, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, UK South, UK West, West Europe, West US, West US 2, West Central US.

### Paired regions

In addition to the universal replica regions, you can create a read replica in the Azure paired region of your primary server. If you don't know your region's pair, you can learn more from the [Azure Paired Regions article](../../availability-zones/cross-region-replication-azure.md).

If you are using cross-region replicas for disaster recovery planning, we recommend you create the replica in the paired region instead of one of the other regions. Paired regions avoid simultaneous updates and prioritize physical isolation and data residency.

There are limitations to consider:

* Uni-directional pairs: Some Azure regions are paired in one direction only. These regions include West India, Brazil South. 
   This means that a primary server in West India can create a replica in South India. However, a primary server in South India cannot create a replica in West India. This is because West India's secondary region is South India, but South India's secondary region is not West India.

## Create a replica

When you start the create replica workflow, a blank Azure Database for PostgreSQL server is created. The new server is filled with the data that was on the primary server. The creation time depends on the amount of data on the primary and the time since the last weekly full backup. The time can range from a few minutes to several hours.

Every replica is enabled for storage [auto-grow](concepts-pricing-tiers.md#storage-auto-grow). The auto-grow feature allows the replica to keep up with the data replicated to it, and prevent a break in replication caused by out of storage errors.

The read replica feature uses PostgreSQL physical replication, not logical replication. Streaming replication by using replication slots is the default operation mode. When necessary, log shipping is used to catch up.

Learn how to [create a read replica in the Azure portal](how-to-read-replicas-portal.md).

If your source PostgreSQL server is encrypted with customer-managed keys, please see the [documentation](concepts-data-encryption-postgresql.md) for additional considerations.

## Connect to a replica

When you create a replica, it doesn't inherit the firewall rules or VNet service endpoint of the primary server. These rules must be set up independently for the replica.

The replica inherits the admin account from the primary server. All user accounts on the primary server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the primary server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for PostgreSQL server. For a server named **my replica** with the admin username **myadmin**, you can connect to the replica by using psql:

```bash
psql -h myreplica.postgres.database.azure.com -U myadmin@myreplica -d postgres
```

At the prompt, enter the password for the user account.

## Monitor replication

Azure Database for PostgreSQL provides two metrics for monitoring replication. The two metrics are **Max Lag Across Replicas** and **Replica Lag**. To learn how to view these metrics, see the **Monitor a replica** section of the [read replica how-to article](how-to-read-replicas-portal.md).

The **Max Lag Across Replicas** metric shows the lag in bytes between the primary and the most-lagging replica. This metric is applicable and available on the primary server only, and will be available only if at least one of the read replica is connected to the primary and the primary is in streaming replication mode. The lag information does not show details when the replica is in the process of catching up with the primary using the archived logs of the primary in a file-shipping replication mode.

The **Replica Lag** metric shows the time since the last replayed transaction. If there are no transactions occurring on your primary server, the metric reflects this time lag. This metric is applicable and available for replica servers only. Replica Lag is calculated from the `pg_stat_wal_receiver` view:

```SQL
SELECT EXTRACT (EPOCH FROM now() - pg_last_xact_replay_timestamp());
```

Set an alert to inform you when the replica lag reaches a value that isn’t acceptable for your workload.

For additional insight, query the primary server directly to get the replication lag in bytes on all replicas.

> [!NOTE]
> If a primary server or read replica restarts, the time it takes to restart and catch up is reflected in the Replica Lag metric.

## Stop replication / Promote replica

You can stop the replication between a primary and a replica at any time. The stop action causes the replica to restart and promotes the replica to be an independent, standalone read-writeable server. The data in the standalone server is the data that was available on the replica server at the time the replication is stopped. Any subsequent updates at the primary are not propagated to the replica. However, replica server may have accumulated logs that are not applied yet. As part of the restart process, the replica applies all the pending logs before accepting client connections.

>[!NOTE]
> Resetting admin password on replica server is currently not supported. Additionally, updating admin password along with promote replica operation in the same request is also not supported. If you wish to do this you must first promote the replica server then update the password on the newly promoted server separately.

### Considerations

- Before you stop replication on a read replica, check for the replication lag to ensure the replica has all the data that you require. 
- As the read replica has to apply all pending logs before it can be made a standalone server, RTO can be higher for write heavy workloads when the stop replication happens as there could be a significant delay on the replica. Please pay attention to this when planning to promote a replica.
- The promoted replica server cannot be made into a replica again.
- If you promote a replica to be the primary server, you cannot establish replication back to the old primary server. If you want to go back to the old primary region, you can either establish a new replica server with a new name (or) delete the old primary and create a replica using the old primary name.
- If you have multiple read replicas, and if you promote one of them to be your primary server, other replica servers are still connected to the old primary. You may have to recreate replicas from the new, promoted server.

When you stop replication, the replica loses all links to its previous primary and other replicas.

Learn how to [stop replication to a replica](how-to-read-replicas-portal.md).

## Failover to replica

In the event of a primary server failure, it is **not** automatically failed over to the read replica.

Since replication is asynchronous, there could be a considerable lag between the primary and the replica. The amount of lag is influenced by a number of factors such as the type of workload running on the primary server and the latency between the primary and the replica server. In typical cases with nominal write workload, replica lag is expected between a few seconds to few minutes. However, in  cases where the primary runs very heavy write-intensive workload and the replica is not catching up fast enough, the lag can be much higher. You can track the replication lag for each replica using the metric *Replica Lag*. This metric shows the time since the last replayed transaction at the replica. We recommend that you identify the average lag by observing the replica lag over a period of time. You can set an alert on replica lag, so that if it goes outside your expected range, you will be notified to take action.

> [!Tip]
> If you failover to the replica, the lag at the time you delink the replica from the primary will indicate how much data is lost.

Once you have decided you want to failover to a replica,

1. Stop replication to the replica<br/>
   This step is necessary to make the replica server to become a standalone server and be able to accept writes. As part of this process, the replica server will restart and be delinked from the primary. Once you initiate stop replication, the backend process typically takes few minutes to apply any residual logs that were not yet applied and to open the database as a read-writeable server. See the [stop replication](#stop-replication--promote-replica) section of this article to understand the implications of this action.

2. Point your application to the (former) replica<br/>
   Each server has a unique connection string. Update your application connection string to point to the (former) replica instead of the primary.

Once your application is successfully processing reads and writes, you have completed the failover. The amount of downtime your application experiences will depend on when you detect an issue and complete steps 1 and 2 above.

### Disaster recovery

When there is a major disaster event such as availability zone-level or regional failures, you can perform disaster recovery operation by promoting your read replica. From the UI portal, you can navigate to the read replica server. Then select the replication tab, and you can stop the replica to promote it to be an independent server. Alternatively, you can use the [Azure CLI](/cli/azure/postgres/server/replica#az-postgres-server-replica-stop) to stop and promote the replica server.

## Considerations

This section summarizes considerations about the read replica feature.

### Prerequisites

Read replicas and [logical decoding](concepts-logical.md) both depend on the Postgres write ahead log (WAL) for information. These two features need different levels of logging from Postgres. Logical decoding needs a higher level of logging than read replicas.

To configure the right level of logging, use the Azure replication support parameter. Azure replication support has three setting options:

* **Off** - Puts the least information in the WAL. This setting is not available on most Azure Database for PostgreSQL servers.  
* **Replica** - More verbose than **Off**. This is the minimum level of logging needed for [read replicas](concepts-read-replicas.md) to work. This setting is the default on most servers.
* **Logical** - More verbose than **Replica**. This is the minimum level of logging for logical decoding to work. Read replicas also work at this setting.

### New replicas

A read replica is created as a new Azure Database for PostgreSQL server. An existing server can't be made into a replica. You can't create a replica of another read replica.

### Replica configuration

A replica is created by using the same compute and storage settings as the primary. After a replica is created, several settings can be changed including storage and backup retention period.

Firewall rules, virtual network rules, and parameter settings are not inherited from the primary server to the replica when the replica is created or afterwards.

### Scaling

Scaling vCores or between General Purpose and Memory Optimized:
* PostgreSQL requires the `max_connections` setting on a secondary server to be [greater than or equal to the setting on the primary](https://www.postgresql.org/docs/current/hot-standby.html), otherwise the secondary will not start.
* In Azure Database for PostgreSQL, the maximum allowed connections for each server is fixed to the compute sku since connections occupy memory. You can learn more about the [mapping between max_connections and compute skus](concepts-limits.md).
* **Scaling up**: First scale up a replica's compute, then scale up the primary. This order will prevent errors from violating the `max_connections` requirement.
* **Scaling down**: First scale down the primary's compute, then scale down the replica. If you try to scale the replica lower than the primary, there will be an error since this violates the `max_connections` requirement.

Scaling storage:
* All replicas have storage auto-grow enabled to prevent replication issues from a storage-full replica. This setting cannot be disabled.
* You can also manually scale up storage, as you would do on any other server

### Basic tier

Basic tier servers only support same-region replication.

### max_prepared_transactions

[PostgreSQL requires](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PREPARED-TRANSACTIONS) the value of the `max_prepared_transactions` parameter on the read replica to be greater than or equal to the primary value; otherwise, the replica won't start. If you want to change `max_prepared_transactions` on the primary, first change it on the replicas.

### Stopped replicas

If you stop replication between a primary server and a read replica, the replica restarts to apply the change. The stopped replica becomes a standalone server that accepts both reads and writes. The standalone server can't be made into a replica again.

### Deleted primary and standalone servers

When a primary server is deleted, all of its read replicas become standalone servers. The replicas are restarted to reflect this change.

## Next steps

* Learn how to [create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md).
* Learn how to [create and manage read replicas in the Azure CLI and REST API](how-to-read-replicas-cli.md).
