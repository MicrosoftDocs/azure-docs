---
title: Read replicas - Azure Database for PostgreSQL - Flexible Server
description: This article describes the read replica feature in Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 10/21/2022
---

# Read replicas in Azure Database for PostgreSQL - Flexible Server Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

> [!NOTE]
> Read replicas for PostgreSQL Flexible Server is currently in preview.

The read replica feature allows you to replicate data from an Azure Database for PostgreSQL server to a read-only replica. Replicas are updated **asynchronously** with the PostgreSQL engine native physical replication technology. Streaming replication by using replication slots is the default operation mode. When necessary, file-based log shipping is used to catch up. You can replicate from the primary server to up to five replicas.

Replicas are new servers that you manage similar to regular Azure Database for PostgreSQL servers. For each read replica, you're billed for the provisioned compute in vCores and storage in GB/ month.

Learn how to [create and manage replicas](how-to-read-replicas-portal.md).

## When to use a read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the primary. Read replicas can also be deployed on a different region and can be promoted to be a read-write server in the event of a disaster recovery.

A common scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the primary.

### Considerations

The feature is meant for scenarios where the lag is acceptable and meant for offloading queries. It isn't meant for synchronous replication scenarios where the replica data is expected to be up-to-date. There will be a measurable delay between the primary and the replica. This can be in minutes or even hours depending on the workload and the latency between the primary and the replica. The data on the replica eventually becomes consistent with the data on the primary. Use this feature for workloads that can accommodate this delay.

> [!NOTE]
> For most workloads read replicas offer near-real-time updates from the primary. However, with persistent heavy write-intensive primary workloads, the replication lag could continue to grow and may never be able to catch-up with the primary. This may also increase storage usage at the primary as the WAL files are not deleted until they are received at the replica. If this situation persists, deleting and recreating the read replica after the write-intensive workloads completes is the option to bring the replica back to a good state with respect to lag.
> Asynchronous read replicas are not suitable for such heavy write workloads. When evaluating read replicas for your application, monitor the lag on the replica for a full app work load cycle through its peak and non-peak times to assess the possible lag and the expected RTO/RPO at various points of the workload cycle.

## Cross-region replication

You can create a read replica in a different region from your primary server. Cross-region replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users.

You can have a primary server in any [Azure Database for PostgreSQL region](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). A primary server can have replicas also in any global region of Azure that supports Azure Database for PostgreSQL. Currently [special Azure regions](../../virtual-machines/regions.md#special-azure-regions) are not supported.

[//]: # (### Paired regions)

[//]: # ()
[//]: # (In addition to the universal replica regions, you can create a read replica in the Azure paired region of your primary server. If you don't know your region's pair, you can learn more from the [Azure Paired Regions article]&#40;../../availability-zones/cross-region-replication-azure.md&#41;.)

[//]: # ()
[//]: # (If you are using cross-region replicas for disaster recovery planning, we recommend you create the replica in the paired region instead of one of the other regions. Paired regions avoid simultaneous updates and prioritize physical isolation and data residency.)

## Create a replica

When you start the create replica workflow, a blank Azure Database for PostgreSQL server is created. The new server is filled with the data that was on the primary server. For creation of replicas in the same region snapshot approach is used, therefore the time of creation doesn't depend on the size of data. Geo-replicas are created using base backup of the primary instance, which is then transmitted over the network therefore time of creation might range from minutes to several hours depending on the primary size. 

In Azure Database for PostgreSQL - Flexible Server, the create operation of replicas is considered successful only when the entire backup of the primary instance has been copied to the replica destination along with the transaction logs have been synchronized up to the threshold of maximum 1GB lag.

To ensure the success of the create operation, it's recommended to avoid creating replicas during periods of high transactional load. For example, it's best to avoid creating replicas during migrations from other sources to Azure Database for PostgreSQL - Flexible Server, or during excessive bulk load operations. If you are currently in the process of performing a migration or bulk load operation, it's recommended that you wait until the operation has completed before proceeding with the creation of replicas. Once the migration or bulk load operation has finished, check whether the transaction log size has returned to its normal size. Typically, the transaction log size should be close to the value defined in the max_wal_size server parameter for your instance. You can track the transaction log storage footprint using the [Transaction Log Storage Used](concepts-monitoring.md#list-of-metrics) metric, which provides insights into the amount of storage used by the transaction log. By monitoring this metric, you can ensure that the transaction log size is within the expected range and that the replica creation process might be started. 

> [!IMPORTANT]
> Read Replicas are currently supported for the General Purpose and Memory Optimized server compute tiers, Burstable server compute tier is not supported.

> [!IMPORTANT]
> When performing replica creation, deletion, and promotion operations, the primary server will enter an updating state. During this time, server management operations such as modifying server parameters, changing high availability options, or adding or removing firewalls will be unavailable. It's important to note that the updating state only affects server management operations and does not impact [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations. This means that your database server will remain fully functional and able to accept connections, as well as serve read and write traffic.

Learn how to [create a read replica in the Azure portal](how-to-read-replicas-portal.md).

If your source PostgreSQL server is encrypted with customer-managed keys, please see the [documentation](concepts-data-encryption.md) for additional considerations.

## Connect to a replica

When you create a replica, it does inherit the firewall rules or VNet service endpoint of the primary server. These rules might be changed during creation of replica as well as in any later point in time.

The replica inherits the admin account from the primary server. All user accounts on the primary server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the primary server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for PostgreSQL server. For a server named **myreplica** with the admin username **myadmin**, you can connect to the replica by using psql:

```bash
psql -h myreplica.postgres.database.azure.com -U myadmin postgres
```

At the prompt, enter the password for the user account.

## Monitor replication
Read replica feature in Azure Database for PostgreSQL - Flexible Server relies on replication slots mechanism. The main advantage of replication slots is the ability to automatically adjust the number of transaction logs (WAL segments) needed by all replica servers and therefore avoid situations when one or more replicas going out of sync because WAL segments that were not yet sent to the replicas are being removed on the primary. The disadvantage of the approach is the risk of going out of space on the primary in case replication slot remains inactive for a long period of time. In such situations primary will accumulate WAL files causing incremental growth of the storage usage. When the storage usage reaches 95% or if the available capacity is less than 5 GiB, the server is automatically switched to read-only mode to avoid errors associated with disk-full situations. 
Therefore, monitoring the replication lag and replication slots status is crucial for read replicas.

We recommend setting alert rules for storage used or storage percentage, as well as for replication lags, when they exceed certain thresholds so that you can proactively act, increase the storage size and delete lagging read replicas. For example, you can set an alert if the storage percentage exceeds 80% usage, as well on the replica lag being higher than 1h. The [Transaction Log Storage Used](concepts-monitoring.md#list-of-metrics) metric will show you if the WAL files accumulation is the main reason of the excessive storage usage. 

Azure Database for PostgreSQL - Flexible Server provides [two metrics](concepts-monitoring.md#replication) for monitoring replication. The two metrics are **Max Physical Replication Lag** and **Read Replica Lag**. To learn how to view these metrics, see the **Monitor a replica** section of the [read replica how-to article](how-to-read-replicas-portal.md#monitor-a-replica).

The **Max Physical Replication Lag** metric shows the lag in bytes between the primary and the most-lagging replica. This metric is applicable and available on the primary server only, and will be available only if at least one of the read replicas is connected to the primary. The lag information is present also when the replica is in the process of catching up with the primary, during replica creation, or when replication becomes inactive.

The **Read Replica Lag** metric shows the time since the last replayed transaction. For instance if there are no transactions occurring on your primary server, and the last transaction was replayed 5 seconds ago, then the Read Replica Lag will show 5 second delay. This metric is applicable and available on replicas only. 

Set an alert to inform you when the replica lag reaches a value that isn’t acceptable for your workload.

For additional insight, query the primary server directly to get the replication lag on all replicas.  

> [!NOTE]
> If a primary server or read replica restarts, the time it takes to restart and catch up is reflected in the Replica Lag metric.

## Promote replicas

You can stop the replication between a primary and a replica by promoting one or more replicas at any time. The promote action causes the replica to apply all the pending logs and promotes the replica to be an independent, standalone read-writeable server. The data in the standalone server is the data that was available on the replica server at the time the replication is stopped. Any subsequent updates at the primary are not propagated to the replica. However, replica server may have accumulated logs that are not applied yet. As part of the promote process, the replica applies all the pending logs before accepting client connections.

>[!NOTE]
> Resetting admin password on replica server is currently not supported. Additionally, updating admin password along with promote replica operation in the same request is also not supported. If you wish to do this you must first promote the replica server then update the password on the newly promoted server separately.

### Considerations

- Before you stop replication on a read replica, check for the replication lag to ensure the replica has all the data that you require. 
- As the read replica has to apply all pending logs before it can be made a standalone server, RTO can be higher for write heavy workloads when the stop replication happens as there could be a significant delay on the replica. Please pay attention to this when planning to promote a replica.
- The promoted replica server cannot be made into a replica again.
- If you promote a replica to be a standalone server, you cannot establish replication back to the old primary server. If you want to go back to the old primary region, you can either establish a new replica server with a new name (or) delete the old primary and create a replica using the old primary name.
- If you have multiple read replicas, and if you promote one of them to be your primary server, other replica servers are still connected to the old primary. You may have to recreate replicas from the new, promoted server.

When you promote a replica, the replica loses all links to its previous primary and other replicas.

Learn how to [promote a replica](how-to-read-replicas-portal.md#promote-replicas).

## Failover to replica

In the event of a primary server failure, it is **not** automatically failed over to the read replica.

Since replication is asynchronous, there could be a considerable lag between the primary and the replica(s). The amount of lag is influenced by a number of factors such as the type of workload running on the primary server and the latency between the primary and the replica server. In typical cases with nominal write workload, replica lag is expected between a few seconds to few minutes. However, in  cases where the primary runs very heavy write-intensive workload and the replica is not catching up fast enough, the lag can be much higher. 

[//]: # (You can track the replication lag for each replica using the *Replica Lag* metric. This metric shows the time since the last replayed transaction at the replica. We recommend that you identify the average lag by observing the replica lag over a period of time. You can set an alert on replica lag, so that if it goes outside your expected range, you will be notified to take action.)

> [!Tip]
> If you failover to the replica, the lag at the time you delink the replica from the primary will indicate how much data is lost.

Once you have decided you want to failover to a replica,

1. Promote replica<br/>
   This step is necessary to make the replica server to become a standalone server and be able to accept writes. As part of this process, the replica server will be delinked from the primary. Once you initiate promotion, the backend process typically takes few minutes to apply any residual logs that were not yet applied and to open the database as a read-writeable server. See the [Promote replicas](#promote-replicas) section of this article to understand the implications of this action.

2. Point your application to the (former) replica<br/>
   Each server has a unique connection string. Update your application connection string to point to the (former) replica instead of the primary.

Once your application is successfully processing reads and writes, you have completed the failover. The amount of downtime your application experiences, will depend on when you detect an issue and complete steps 1 and 2 above.

### Disaster recovery

When there is a major disaster event such as availability zone-level or regional failures, you can perform disaster recovery operation by promoting your read replica. From the UI portal, you can navigate to the read replica server. Then select the replication tab, and you can promote the replica to become an independent server. 

[//]: # (Alternatively, you can use the [Azure CLI]&#40;/cli/azure/postgres/server/replica#az-postgres-server-replica-stop&#41; to stop and promote the replica server.)

## Considerations

This section summarizes considerations about the read replica feature. The following considerations do apply.

- **Power operations**: Power operations (start/stop) are currently not supported for any node, either replica or primary, in the replication cluster.
- If server has read replicas then read replicas should be deleted first before deleting the primary server.
- [In-place major version upgrade](concepts-major-version-upgrade.md) in Azure Database for PostgreSQL requires removing any read replicas that are currently enabled on the server. Once the replicas have been deleted, the primary server can be upgraded to the desired major version. After the upgrade is complete, you can recreate the replicas to resume the replication process.

### New replicas

A read replica is created as a new Azure Database for PostgreSQL server. An existing server can't be made into a replica. You can't create a replica of another read replica.

### Replica configuration

During creation of read replicas firewall rules and data encryption method can be changed. Server parameters and authentication method are inherited from the primary server and cannot be changed during creation. After a replica is created, several settings can be changed including storage, compute, backup retention period, server parameters, authentication method, firewall rules etc.

### Replication slot issues mitigation

In rare cases, high lag caused by replication slots can lead to an increase in storage usage on the primary server due to the accumulation of WAL files. If the storage usage reaches 95% or the available capacity falls below 5 GiB, the server automatically switches to read-only mode to prevent disk-full errors.

Since maintaining the primary server's health and functionality is a priority, in such edge cases, the replication slot may be dropped to ensure the primary server remains operational for read and write traffic. Consequently, replication will switch to file-based log shipping mode, which could result in a higher replication lag.

It is essential to monitor storage usage and replication lag closely, and take necessary actions to mitigate potential issues before they escalate.

### Server parameters

You are free to change server parameters on your read replica server and set different values than on the primary server. The only exception are parameters that might affect recovery of the replica, mentioned also in the "Scaling" section below: max_connections, max_prepared_transactions, max_locks_per_transaction, max_wal_senders, max_worker_processes. Please ensure these parameters ale always [greater than or equal to the setting on the primary](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN) to ensure that the standby does not run out of shared memory during recovery.

### Scaling

You are free to scale up and down compute (vCores), changing the service tier from General Purpose to Memory Optimized (or vice versa) as well as scaling up the storage, but the following caveats do apply.

For compute scaling: 

* PostgreSQL requires several parameters on replicas to be [greater than or equal to the setting on the primary](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN) to ensure that the standby does not run out of shared memory during recovery. The parameters affected are: max_connections, max_prepared_transactions, max_locks_per_transaction, max_wal_senders, max_worker_processes.

* **Scaling up**: First scale up a replica's compute, then scale up the primary.

* **Scaling down**: First scale down the primary's compute, then scale down the replica.

* Compute on the primary must always be equal or smaller than the compute on the smallest replica.

 
For storage scaling:

* **Scaling up**: First scale up a replica's storage, then scale up the primary.

* Storage size on the primary must be always equal or smaller than the storage size on the smallest replica.

## Next steps

* Learn how to [create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md).
* Learn about [Cross-region replication with VNET](concepts-networking.md#replication-across-azure-regions-and-virtual-networks-with-private-networking).

[//]: # (* Learn how to [create and manage read replicas in the Azure CLI and REST API]&#40;how-to-read-replicas-cli.md&#41;.)
