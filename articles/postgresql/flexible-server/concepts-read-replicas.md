---
title: Read replicas - Azure Database for PostgreSQL - Flexible Server
description: This article describes the read replica feature in Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: alkuchar
author: sr-msft
ms.date: 10/21/2022
---

# Read replicas in Azure Database for PostgreSQL - Flexible Server Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

> [!NOTE]
> Read replicas for PostgreSQL Flexible Server is currently in preview.

The read replica feature allows you to replicate data from an Azure Database for PostgreSQL server to a read-only replica. Replicas are updated **asynchronously** with the PostgreSQL engine native physical replication technology. Streaming replication by using replication slots is the default operation mode. When necessary, log shipping is used to catch up. You can replicate from the primary server to up to five replicas.

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
> Asynchronous read replicas are not suitable for such heavy write workloads. When evaluating read replicas for your application, monitor the lag on the replica for a full app work load cycle through its peak and non-peak times to access the possible lag and the expected RTO/RPO at various points of the workload cycle.

## Cross-region replication

You can create a read replica in a different region from your primary server. Cross-region replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users.

You can have a primary server in any [Azure Database for PostgreSQL region](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). A primary server can have replicas also in any global region of Azure that supports Azure Database for PostgreSQL. Currently [special Azure regions](/azure/virtual-machines/regions#special-azure-regions) are not supported.

[//]: # (### Paired regions)

[//]: # ()
[//]: # (In addition to the universal replica regions, you can create a read replica in the Azure paired region of your primary server. If you don't know your region's pair, you can learn more from the [Azure Paired Regions article]&#40;../../availability-zones/cross-region-replication-azure.md&#41;.)

[//]: # ()
[//]: # (If you are using cross-region replicas for disaster recovery planning, we recommend you create the replica in the paired region instead of one of the other regions. Paired regions avoid simultaneous updates and prioritize physical isolation and data residency.)

## Create a replica

When you start the create replica workflow, a blank Azure Database for PostgreSQL server is created. The new server is filled with the data that was on the primary server. For creation of replicas in the same region snapshot approach is used, therefore the time of creation doesn't depend on the size of data. Geo-replicas are created using base backup of the primary instance, which is then transmitted over the network therefore time of creation might range from minutes to several hours depending on the primary size. 

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

[//]: # (## Monitor replication)

[//]: # ()
[//]: # (Azure Database for PostgreSQL provides two metrics for monitoring replication. The two metrics are **Max Lag Across Replicas** and **Replica Lag**. To learn how to view these metrics, see the **Monitor a replica** section of the [read replica how-to article]&#40;how-to-read-replicas-portal.md&#41;.)

[//]: # ()
[//]: # (The **Max Lag Across Replicas** metric shows the lag in bytes between the primary and the most-lagging replica. This metric is applicable and available on the primary server only, and will be available only if at least one of the read replica is connected to the primary and the primary is in streaming replication mode. The lag information does not show details when the replica is in the process of catching up with the primary using the archived logs of the primary in a file-shipping replication mode.)

[//]: # ()
[//]: # (The **Replica Lag** metric shows the time since the last replayed transaction. If there are no transactions occurring on your primary server, the metric reflects this time lag. This metric is applicable and available for replica servers only. Replica Lag is calculated from the `pg_stat_wal_receiver` view:)

[//]: # ()
[//]: # (```SQL)

[//]: # (SELECT EXTRACT &#40;EPOCH FROM now&#40;&#41; - pg_last_xact_replay_timestamp&#40;&#41;&#41;;)

[//]: # (```)

[//]: # ()
[//]: # (Set an alert to inform you when the replica lag reaches a value that isn’t acceptable for your workload.)

[//]: # ()
[//]: # (For additional insight, query the primary server directly to get the replication lag in bytes on all replicas.)

[//]: # ()
[//]: # (> [!NOTE])

[//]: # (> If a primary server or read replica restarts, the time it takes to restart and catch up is reflected in the Replica Lag metric.)

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
- During the create, delete and promote operations of replica, primary server will be in upgrading state.
- **Power operations**: You can perform power operations (start/stop) on replica but primary server should be stopped before stopping read replicas and primary server should be started before starting the replicas.
- If server has read replicas then read replicas should be deleted first before deleting the primary server.

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

This section summarizes considerations about the read replica feature.

### New replicas

A read replica is created as a new Azure Database for PostgreSQL server. An existing server can't be made into a replica. You can't create a replica of another read replica.

### Replica configuration

During creation of read replicas firewall rules and data encryption method can be changed. Server parameters and authentication method are inherited from the primary server and cannot be changed during creation. After a replica is created, several settings can be changed including storage, compute, backup retention period, server parameters, authentication method, firewall rules etc.

### Scaling

Scaling vCores or between General Purpose and Memory Optimized:
* PostgreSQL requires several parameters on replicas to be [greater than or equal to the setting on the primary](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN), otherwise the secondary servers will not start. The parameters affected are: max_connections, max_prepared_transactions, max_locks_per_transaction, max_wal_senders, max_worker_processes.
* **Scaling up**: First scale up a replica's compute, then scale up the primary. 
* **Scaling down**: First scale down the primary's compute, then scale down the replica.

## Next steps

* Learn how to [create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md).

[//]: # (* Learn how to [create and manage read replicas in the Azure CLI and REST API]&#40;how-to-read-replicas-cli.md&#41;.)
