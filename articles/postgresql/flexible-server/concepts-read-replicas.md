---
title: Read replicas - Azure Database for PostgreSQL - Flexible Server
description: This article describes the read replica feature in Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 11/06/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Read replicas in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The read replica feature allows you to replicate data from an Azure Database for a PostgreSQL server to a read-only replica. Replicas are updated **asynchronously** with the PostgreSQL engine's native physical replication technology. Streaming replication by using replication slots is the default operation mode. When necessary, file-based log shipping is used to catch up. You can replicate from the primary server to up to five replicas.

Replicas are new servers you manage similar to regular Azure Database for PostgreSQL servers. For each read replica, you're billed for the provisioned compute in vCores and storage in GB/ month.

Learn how to [create and manage replicas](how-to-read-replicas-portal.md).

> [!NOTE]  
> Azure Database for PostgreSQL - Flexible Server is currently supporting the following features in Preview:
>
> - Promote to primary server (to maintain backward compatibility, please use promote to independent server and remove from replication, which keeps the former behavior)
> - Virtual endpoints

## When to use a read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the primary. Read replicas can also be deployed on a different region and can be promoted to be a read-write server in the event of a disaster recovery.

A typical scenario is to have BI and analytical workloads use the read replica as the data source for reporting.

Because replicas are read-only, they don't directly reduce write-capacity burdens on the primary.

### Considerations

Read replicas are primarily designed for scenarios where offloading queries is beneficial, and a slight lag is manageable. They are optimized to provide near realtime updates from the primary for most workloads, making them an excellent solution for read-heavy scenarios. However, it's important to note that they are not intended for synchronous replication scenarios requiring up-to-the-minute data accuracy. While the data on the replica eventually becomes consistent with the primary, there may be a delay, which typically ranges from a few seconds to minutes, and in some heavy workload or high-latency scenarios, this could extend to hours. Typically, read replicas in the same region as the primary has less lag than geo-replicas, as the latter often deals with geographical distance-induced latency. For more insights into the performance implications of geo-replication, refer to [Geo-replication](#geo-replication) section. The data on the replica eventually becomes consistent with the data on the primary. Use this feature for workloads that can accommodate this delay.

> [!NOTE]  
> For most workloads, read replicas offer near-real-time updates from the primary. However, with persistent heavy write-intensive primary workloads, the replication lag could continue to grow and might only be able to catch up with the primary. This might also increase storage usage at the primary as the WAL files are only deleted once received at the replica. If this situation persists, deleting and recreating the read replica after the write-intensive workloads are completed, you can bring the replica back to a good state for lag.
> Asynchronous read replicas are not suitable for such heavy write workloads. When evaluating read replicas for your application, monitor the lag on the replica for a complete app workload cycle through its peak and non-peak times to assess the possible lag and the expected RTO/RPO at various points of the workload cycle.

## Geo-replication

A read replica can be created in the same region as the primary server and in a different one. Cross-region replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users.

You can have a primary server in any [Azure Database for PostgreSQL region](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). A primary server can also have replicas in any global region of Azure that supports Azure Database for PostgreSQL. Currently [special Azure regions](../../virtual-machines/regions.md#special-azure-regions) aren't supported.

### Use paired regions for disaster recovery purposes

While creating replicas in any supported region is possible, there are notable benefits when opting for replicas in paired regions, especially when architecting for disaster recovery purposes:

- **Region Recovery Sequence**: In a geography-wide outage, recovery of one region from every paired set is prioritized, ensuring that applications across paired regions always have a region expedited for recovery.

- **Sequential Updating**: Paired regions' updates are staggered chronologically, minimizing the risk of downtime from update-related issues.

- **Physical Isolation**: A minimum distance of 300 miles is maintained between data centers in paired regions, reducing the risk of simultaneous outages from significant events.

- **Data Residency**: With a few exceptions, regions in a paired set reside within the same geography, meeting data residency requirements.

- **Performance**: While paired regions typically offer low network latency, enhancing data accessibility and user experience, they might not always be the regions with the absolute lowest latency. If the primary objective is to serve data closer to users rather than prioritize disaster recovery, it's crucial to evaluate all available regions for latency. In some cases, a nonpaired region might exhibit the lowest latency. For a comprehensive understanding, you can reference [Azure's round-trip latency figures](../../networking/azure-network-latency.md#round-trip-latency-figures) to make an informed choice.

For a deeper understanding of the advantages of paired regions, refer to [Azure's documentation on cross-region replication](../../reliability/cross-region-replication-azure.md#azure-paired-regions).

## Create a replica

A primary server for Azure Database for PostgreSQL - Flexible Server can be deployed in [any region that supports the service](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=postgresql&regions=all). You can create replicas of the primary server within the same region or across different global Azure regions where Azure Database for PostgreSQL - Flexible Server is available. However, it's important to note that replicas can't be created in [special Azure regions](../../virtual-machines/regions.md#special-azure-regions), regardless of whether they're in-region or cross-region.

When you start the create replica workflow, a blank Azure Database for the PostgreSQL server is created. The new server is filled with the data on the primary server. For the creation of replicas in the same region, a snapshot approach is used. Therefore, the time of creation is independent of the size of the data. Geo-replicas are created using the base backup of the primary instance, which is then transmitted over the network; therefore, the creation time might range from minutes to several hours, depending on the primary size.

In Azure Database for PostgreSQL - Flexible Server, the creation operation of replicas is considered successful only when the entire backup of the primary instance copies to the replica destination and the transaction logs synchronize up to the threshold of a maximum 1-GB lag.

To achieve a successful create operation, avoid making replicas during times of high transactional load. For example, it's best to avoid creating replicas during migrations from other sources to Azure Database for PostgreSQL - Flexible Server or during excessive bulk load operations. If you're migrating data or loading large amounts of data right now, it's best to finish this task first. After completing it, you can then start setting up the replicas. Once the migration or bulk load operation has finished, check whether the transaction log size has returned to its normal size. Typically, the transaction log size should be close to the value defined in the max_wal_size server parameter for your instance. You can track the transaction log storage footprint using the [Transaction Log Storage Used](concepts-monitoring.md#default-metrics) metric, which provides insights into the amount of storage used by the transaction log. By monitoring this metric, you can ensure that the transaction log size is within the expected range and that the replica creation process might be started.

> [!IMPORTANT]  
> Read Replicas are currently supported for the General Purpose and Memory Optimized server compute tiers. The Burstable server compute tier is not supported.

> [!IMPORTANT]  
> When performing replica creation, deletion, and promotion operations, the primary server will enter an **updating state**. During this time, server management operations such as modifying server parameters, changing high availability options, or adding or removing firewalls will be unavailable. It's important to note that the updating state only affects server management operations and does not affect [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations. This means that your database server will remain fully functional and able to accept connections, as well as serve read and write traffic.

Learn how to [create a read replica in the Azure portal](how-to-read-replicas-portal.md).

### Configuration management

When setting up read replicas for Azure Database for PostgreSQL - Flexible Server, it's essential to understand the server configurations that can be adjusted, the ones inherited from the primary, and any related limitations.

**Inherited configurations**

When a read replica is created, it inherits specific server configurations from the primary server. These configurations can be changed either during the replica's creation or after it has been set up. However, specific settings, like geo-backup, won't be replicated to the read replica.

**Configurations during replica creation**

- **Tier, storage size**: For the "promote to primary server" operation, it must be the same as the primary. For the "promote to independent server and remove from replication" operation, it can be the same or higher than the primary.
- **Performance tier (IOPS)**: Adjustable.
- **Data encryption**: Adjustable, include moving from service-managed keys to customer-managed keys.

**Configurations post creation**

- **Firewall rules**: Can be added, deleted, or modified.
- **Tier, storage size**: For the "promote to primary server" operation, it must be the same as the primary. For the "promote to independent server and remove from replication" operation, it can be the same or higher than the primary.
- **Performance tier (IOPS)**: Adjustable.
- **Authentication method**: Adjustable, options include switching from PostgreSQL authentication to Microsoft Entra.
- **Server parameters**: Most are adjustable. However, those [affecting shared memory size](#server-parameters) should align with the primary, especially for potential "promote to primary server" scenarios. For the "promote to independent server and remove from replication" operation, these parameters should be the same or exceed those on the primary.
- **Maintenance schedule**: Adjustable.

**Unsupported features on read replicas**

Certain functionalities are restricted to primary servers and can't be set up on read replicas. These include:
- Backups, including geo-backups.
- High availability (HA)

If your source PostgreSQL server is encrypted with customer-managed keys, please see the [documentation](concepts-data-encryption.md) for additional considerations.

## Connect to a replica

When you create a replica, it does inherit the firewall rules or virtual network service endpoint of the primary server. These rules might be changed during replica creation and at any later point in time.

The replica inherits the admin account from the primary server. All user accounts on the primary server are replicated to the read replicas. You can only connect to a read replica by using the user accounts available on the primary server.

There are two methods to connect to the replica:

* **Direct to the Replica Instance**: You can connect to the replica using its hostname and a valid user account, as you would on a regular Azure Database for PostgreSQL server. For a server named **myreplica** with the admin username **myadmin**, you can connect to the replica by using `psql`:

```bash
psql -h myreplica.postgres.database.azure.com -U myadmin postgres
```

At the prompt, enter the password for the user account.

Furthermore, to ease the connection process, the Azure portal provides ready-to-use connection strings. These can be found in the **Connect** page. They encompass both `libpq` variables as well as connection strings tailored for bash consoles.

* **Via Virtual Endpoints (preview)**: There's an alternative connection method using virtual endpoints, as detailed in [Virtual endpoints](#virtual-endpoints-preview) section. By using virtual endpoints, you can configure the read-only endpoint to consistently point to the replica, regardless of which server currently holds the replica role.

## Promote replicas

"Promote" refers to the process where a replica is commanded to end its replica mode and transition into full read-write operations.

Promotion of replicas can be done in two distinct manners:

**Promote to primary server (preview)**

This action elevates a replica to the role of the primary server. In the process, the current primary server is demoted to a replica role, swapping their roles. For a successful promotion, it's necessary to have a [virtual endpoint](#virtual-endpoints-preview) configured for both the current primary as the writer endpoint, and the replica intended for promotion as the reader endpoint. The promotion will only be successful if the targeted replica is included in the reader endpoint configuration, or if a reader virtual endpoint has yet to be established.

The diagram below illustrates the configuration of the servers prior to the promotion and the resulting state after the promotion operation has been successfully completed.

:::image type="content" source="./media/concepts-read-replica/promote-to-primary-server.png" alt-text="Diagram that shows promote to primary server operation." lightbox="./media/concepts-read-replica/promote-to-primary-server.png":::

**Promote to independent server and remove from replication**

By opting for this, the replica becomes an independent server and is removed from the replication process. As a result, both the primary and the promoted server will function as two independent read-write servers. It should be noted that while virtual endpoints can be configured, they aren't a necessity for this operation. The newly promoted server will no longer be part of any existing virtual endpoints, even if the reader endpoint was previously pointing to it. Thus, it's essential to update your application's connection string to direct to the newly promoted replica if the application should connect to it.

The diagram below illustrates the configuration of the servers before the promotion and the resulting state after the promotion to independent server operation has been successfully completed.

:::image type="content" source="./media/concepts-read-replica/promote-to-independent-server.png" alt-text="Diagram that shows promote to independent server and remove from replication operation." lightbox="./media/concepts-read-replica/promote-to-independent-server.png":::

> [!IMPORTANT]  
> The **Promote to primary server** action is currently in preview. The **Promote to independent server and remove from replication** action is backward compatible with the previous promote functionality.

> [!IMPORTANT]  
> **Server Symmetry**: For a successful promotion using the promote to primary server operation, both the primary and replica servers must have identical tiers and storage sizes. For instance, if the primary has 2vCores and the replica has 4vCores, the only viable option is to use the "promote to independent server and remove from replication" action. Additionally, they need to share the same values for [server parameters that allocate shared memory](#server-parameters).

For both promotion methods, there are more options to consider:

- **Planned**: This option ensures that data is synchronized before promoting. It applies all the pending logs to ensure data consistency before accepting client connections.

- **Forced**: This option is designed for rapid recovery in scenarios such as regional outages. Instead of waiting to synchronize all the data from the primary, the server becomes operational once it processes WAL files needed to achieve the nearest consistent state. If you promote the replica using this option, the lag at the time you delink the replica from the primary will indicate how much data is lost.

> [!IMPORTANT]  
> Promote operation is not automatic. In the event of a primary server failure, the system won't switch to the read replica independently. An user action is always required for the promote operation.

Learn how to [promote replica to primary](how-to-read-replicas-portal.md#promote-replicas) and [promote to independent server and remove from replication](how-to-read-replicas-portal.md#promote-replica-to-independent-server).

### Configuration management

Read replicas are treated as separate servers in terms of control plane configurations. This provides flexibility for read scale scenarios. However, when using replicas for disaster recovery purposes, users must ensure the configuration is as desired.

The promote operation won't carry over specific configurations and parameters. Here are some of the notable ones:

- **PgBouncer**: [The built-in PgBouncer](concepts-pgbouncer.md) connection pooler's settings and status aren't replicated during the promotion process. If PgBouncer was enabled on the primary but not on the replica, it will remain disabled on the replica after promotion. Should you want PgBouncer on the newly promoted server, you must enable it either prior to or following the promotion action.
- **Geo-redundant backup storage**: Geo-backup settings aren't transferred. Since replicas can't have geo-backup enabled, the promoted primary (formerly the replica) won't have it post-promotion. The feature can only be activated at the server's creation time.
- **Server Parameters**: If their values differ on the primary and read replica, they won't be changed during promotion. It's essential to note that parameters influencing shared memory size must have the same values on both the primary and replicas. This requirement is detailed in the [Server parameters](#server-parameters) section.
- **Microsoft Entra authentication**: If the primary had [Microsoft Entra authentication](concepts-azure-ad-authentication.md) configured, but the replica was set up with PostgreSQL authentication, then after promotion, the replica won't automatically switch to Microsoft Entra authentication. It retains the PostgreSQL authentication. Users need to manually configure Microsoft Entra authentication on the promoted replica either before or after the promotion process.
- **High Availability (HA)**: Should you require [HA](concepts-high-availability.md) after the promotion, it must be configured on the freshly promoted primary server, following the role reversal.

## Virtual Endpoints (preview)

Virtual Endpoints are read-write and read-only listener endpoints, that remain consistent irrespective of the current role of the PostgreSQL instance. This means you don't have to update your application's connection string after performing the **promote to primary server** action, as the endpoints will automatically point to the correct instance following a role change.

All operations involving virtual endpoints, whether adding, editing, or removing, are performed in the context of the primary server. In the Azure portal, you manage these endpoints under the primary server page. Similarly, when using tools like the CLI, REST API, or other utilities, commands and actions target the primary server for endpoint management.

Virtual Endpoints offer two distinct types of connection points:

**Writer Endpoint (Read/Write)**: This endpoint always points to the current primary server. It ensures that write operations are directed to the correct server, irrespective of any promote operations users trigger. This endpoint can't be changed to point to a replica.


**Read-Only Endpoint**: This endpoint can be configured by users to point either to a read replica or the primary server. However, it can only target one server at a time. Load balancing between multiple servers isn't supported. You can adjust the target server for this endpoint anytime, whether before or after promotion.

### Virtual Endpoints and Promote Behavior

In the event of a promote action, the behavior of these endpoints remains predictable.
The sections below delve into how these endpoints react to both "Promote to primary server" and "Promote to independent server" scenarios.

| **Virtual endpoint** | **Original target** | **Behavior when "Promote to primary server" is triggered** | **Behavior when "Promote to independent server" is triggered** |
| --- | --- | --- | --- |
| <b> Writer endpoint | Primary | Points to the new primary server. | Remains unchanged. |
| <b> Read-Only endpoint | Replica | Points to the new replica (former primary). | Points to the primary server. |
| <b> Read-Only endpoint | Primary | Not supported. | Remains unchanged. |
#### Behavior when "Promote to primary server" is triggered

- **Writer Endpoint**: This endpoint is updated to point to the new primary server, reflecting the role switch.
- **Read-Only endpoint**
  * **If Read-Only Endpoint Points to Replica**: After the promote action, the read-only endpoint will point to the new replica (the former primary).
  * **If Read-Only Endpoint Points to Primary**: For the promotion to function correctly, the read-only endpoint must be directed at the server intended to be promoted. Pointing to the primary, in this case, isn't supported and must be reconfigured to point to the replica prior to promotion.

#### Behavior when "Promote to the independent server and remove from replication" is triggered

- **Writer Endpoint**: This endpoint remains unchanged. It continues to direct traffic to the server, holding the primary role.
- **Read-Only endpoint**
  * **If Read-Only Endpoint Points to Replica**: The Read-Only endpoint is redirected from the promoted replica to point to the primary server.
  * **If Read-Only Endpoint Points to Primary**: The Read-Only endpoint remains unchanged, continuing to point to the same server.

> [!NOTE]  
> Resetting the admin password on the replica server is currently not supported. Additionally, updating the admin password along with promoting replica operation in the same request is also not supported. If you wish to do this you must first promote the replica server and then update the password on the newly promoted server separately.

Learn how to [create virtual endpoints](how-to-read-replicas-portal.md#create-virtual-endpoints-preview).

## Monitor replication

Read replica feature in Azure Database for PostgreSQL - Flexible Server relies on replication slots mechanism. The main advantage of replication slots is the ability to adjust the number of transaction logs automatically (WAL segments) needed by all replica servers and, therefore, avoid situations when one or more replicas go out of sync because WAL segments that weren't yet sent to the replicas are being removed on the primary. The disadvantage of the approach is the risk of going out of space on the primary in case the replication slot remains inactive for an extended time. In such situations, primary accumulates WAL files causing incremental growth of the storage usage. When the storage usage reaches 95% or if the available capacity is less than 5 GiB, the server is automatically switched to read-only mode to avoid errors associated with disk-full situations.  
Therefore, monitoring the replication lag and replication slots status is crucial for read replicas.

We recommend setting alert rules for storage used or storage percentage, and for replication lags, when they exceed certain thresholds so that you can proactively act, increase the storage size, and delete lagging read replicas. For example, you can set an alert if the storage percentage exceeds 80% usage, and if the replica lag is higher than 1 h. The [Transaction Log Storage Used](concepts-monitoring.md#default-metrics) metric shows you if the WAL files accumulation is the main reason of the excessive storage usage.

Azure Database for PostgreSQL: Flexible Server provides [two metrics](concepts-monitoring.md#replication) for monitoring replication. The two metrics are **Max Physical Replication Lag** and **Read Replica Lag**. To learn how to view these metrics, see the **Monitor a replica** section of the [read replica how-to article](how-to-read-replicas-portal.md#monitor-a-replica).

The **Max Physical Replication Lag** metric shows the lag in bytes between the primary and the most-lagging replica. This metric is applicable and available on the primary server only, and will be available only if at least one of the read replicas is connected to the primary. The lag information is present also when the replica is in the process of catching up with the primary, during replica creation, or when replication becomes inactive.

The **Read Replica Lag** metric shows the time since the last replayed transaction. For instance if no transactions are occurring on your primary server, and the last transaction was replayed 5 seconds ago, then the Read Replica Lag shows 5-second delay. This metric is applicable and available on replicas only.

Set an alert to inform you when the replica lag reaches a value that isn't acceptable for your workload.

For additional insight, query the primary server directly to get the replication lag on all replicas.

> [!NOTE]  
> If a primary server or read replica restarts, the time it takes to restart and catch up is reflected in the Replica Lag metric.

**Replication state**

To monitor the progress and status of the replication and promote operation, refer to the **Replication state** column in the Azure portal. This column is located in the replication page and displays various states that provide insights into the current condition of the read replicas and their link to the primary. For users relying on the ARM API, when invoking the `GetReplica` API, the state appears as ReplicationState in the `replica` property bag.

Here are the possible values:

| **Replication state** | **Description** | **Promote order** | **Read replica creation order** |
| --- | --- | --- | --- |
| <b> Reconfiguring | Awaiting start of the replica-primary link. It might remain longer if the replica or its region is unavailable, for example, due to a disaster. | 1 | N/A |
| <b> Provisioning | The read replica is being provisioned and replication between the two servers has yet to start. Until provisioning completes, you can't connect to the read replica. | N/A | 1 |
| <b> Updating | Server configuration is under preparation following a triggered action like promotion or read replica creation. | 2 | 2 |
| <b> Catchup | WAL files are being applied on the replica. The duration for this phase during promotion depends on the data sync option chosen - planned or forced. | 3 | 3 |
| <b> Active | Healthy state, indicating that the read replica has been successfully connected to the primary. If the servers are stopped but were successfully connected prior, the status remains as active. | 4 | 4 |
| <b> Broken | Unhealthy state, indicating the promote operation might have failed, or the replica is unable to connect to the primary for some reason. | N/A | N/A |

Learn how to [monitor replication](how-to-read-replicas-portal.md#monitor-a-replica).

## Regional Failures and Recovery

Azure facilities across various regions are designed to be highly reliable. However, under rare circumstances, an entire region can become inaccessible due to reasons ranging from network failures to severe scenarios like natural disasters. Azure's capabilities allow for creating applications that are distributed across multiple regions, ensuring that a failure in one region doesn't affect others.

### Prepare for Regional Disasters

Being prepared for potential regional disasters is critical to ensure the uninterrupted operation of your applications and services. If you're considering a robust contingency plan for your Azure Database for PostgreSQL - Flexible Server, here are the key steps and considerations:

1.  **Establish a geo-replicated read replica**: It's essential to have a read replica set up in a separate region from your primary. This ensures continuity in case the primary region faces an outage. More details can be found in the [geo-replication](#geo-replication) section.
2.  **Ensure server symmetry**: The "promote to primary server" action is the most recommended for handling regional outages, but it comes with a [server symmetry](#configuration-management) requirement. This means both the primary and replica servers must have identical configurations of specific settings. The advantages of using this action include:
     * No need to modify application connection strings if you use [virtual endpoints](#virtual-endpoints-preview).
     * It provides a seamless recovery process where, once the affected region is back online, the original primary server automatically resumes its function, but in a new replica role.
3.  **Set up virtual endpoints**: Virtual endpoints allow for a smooth transition of your application to another region if there is an outage. They eliminate the need for any changes in the connection strings of your application.
4.  **Configure the read replica**: Not all settings from the primary server are replicated over to the read replica. It's crucial to ensure that all necessary configurations and features (for example, PgBouncer) are appropriately set up on your read replica. For more information, see the [Configuration management](#configuration-management-1) section.
5.  **Prepare for High Availability (HA)**: If your setup requires high availability, it won't be automatically enabled on a promoted replica. Be ready to activate it post-promotion. Consider automating this step to minimize downtime.
6.  **Regular testing**: Regularly simulate regional disaster scenarios to validate existing thresholds, targets, and configurations. Ensure that your application responds as expected during these test scenarios.
7.  **Follow Azure's general guidance**: Azure provides comprehensive guidance on [reliability and disaster preparedness](../../reliability/overview.md). It's highly beneficial to consult these resources and integrate best practices into your preparedness plan.

Being proactive and preparing in advance for regional disasters ensure the resilience and reliability of your applications and data.

### When outages impact your SLA

In the event of a prolonged outage with Azure Database for PostgreSQL - Flexible Server in a specific region that threatens your application's service-level agreement (SLA), be aware that both the actions discussed below aren't service-driven. User intervention is required for both. It's a best practice to automate the entire process as much as possible and to have robust monitoring in place. For more information about what information is provided during an outage, see the [Service outage](concepts-business-continuity.md#service-outage) page. Only a forced promote is possible in a region down scenario, meaning the amount of data loss is roughly equal to the current lag between the replica and primary. Hence, it's crucial to [monitor the lag](#monitor-replication). Consider the following steps:

**Promote to primary server (preview)**

Use this action if your server fulfills the server symmetry criteria. This option won't require updating the connection strings in your application, provided virtual endpoints are configured. Once activated, the writer endpoint will repoint to the new primary in a different region and the [replication state](#monitor-replication) column in the Azure portal will display "Reconfiguring". Once the affected region is restored, the former primary server will automatically resume, but now in a replica role.

**Promote to independent server and remove from replication**

Suppose your server doesn't meet the [server symmetry](#configuration-management) requirement (for example, the geo-replica has a higher tier or more storage than the primary). In that case, this is the only viable option. After promoting the server, you'll need to update your application's connection strings. Once the original region is restored, the old primary might become active again. Ensure to remove it to avoid incurring unnecessary costs. If you wish to maintain the previous topology, recreate the read replica.

## Considerations

This section summarizes considerations about the read replica feature. The following considerations do apply.

- **Power operations**: [Power operations](how-to-stop-start-server-portal.md), including start and stop actions, can be applied to both the primary and replica servers. However, to preserve system integrity, a specific sequence should be followed. Before stopping the read replicas, ensure the primary server is stopped first. When commencing operations, initiate the start action on the replica servers before starting the primary server.
- If server has read replicas then read replicas should be deleted first before deleting the primary server.
- [In-place major version upgrade](concepts-major-version-upgrade.md) in Azure Database for PostgreSQL requires removing any read replicas currently enabled on the server. Once the replicas have been deleted, the primary server can be upgraded to the desired major version. After the upgrade is complete, you can recreate the replicas to resume the replication process.
- **Storage auto-grow**: When configuring read replicas for an Azure Database for PostgreSQL - Flexible Server, it's essential to ensure that the storage autogrow setting on the replicas matches that of the primary server. The storage autogrow feature allows the database storage to increase automatically to prevent running out of space, which could lead to database outages. To maintain consistency and avoid potential replication issues, if the primary server has storage autogrow disabled, the read replicas must also have storage autogrow disabled. Conversely, if storage autogrow is enabled on the primary server, then any read replica that is created must have storage autogrow enabled from the outset. This synchronization of storage autogrow settings ensures the replication process isn't disrupted by differing storage behaviors between the primary server and its replicas.
- **Premium SSD v2**: As of the current release, if the primary server uses Premium SSD v2 for storage, the creation of read replicas isn't supported.

### New replicas

A read replica is created as a new Azure Database for PostgreSQL server. An existing server can't be made into a replica. You can't create a replica of another read replica, that is, cascading replication isn't supported.

### Resource move

Users can create read replicas in a different resource group than the primary. However, moving read replicas to another resource group after their creation is unsupported. Additionally, moving replica(s) to a different subscription, and moving the primary that has read replica(s) to another resource group or subscription, needs to be supported.

### Promote

Unavailable server states during promotion are described in the [Promote](#promote) section.

#### Unavailable server states during promotion

In the Planned promotion scenario, if the primary or replica server status is anything other than "Available" (for example, "Updating" or "Restarting"), an error is presented. However, using the Forced method, the promotion is designed to proceed, regardless of the primary server's current status, to address potential regional disasters quickly. It's essential to note that if the former primary server transitions to an irrecoverable state during this process, the only recourse will be to recreate the replica.

#### Multiple replicas visibility during promotion in nonpaired regions

When dealing with multiple replicas and if the primary region lacks a [paired region](#use-paired-regions-for-disaster-recovery-purposes), a special consideration must be considered. In the event of a regional outage affecting the primary, any additional replicas won't be automatically recognized by the newly promoted replica. While applications can still be directed to the promoted replica for continued operation, the unrecognized replicas remain disconnected during the outage. These additional replicas will only reassociate and resume their roles once the original primary region has been restored.

### Back up and Restore

When managing backups and restores for your Azure Database for PostgreSQL - Flexible Server, it's essential to keep in mind the current and previous role of the server in different [promotion scenarios](#promote-replicas). Here are the key points to remember:

**Promote to primary server**

1. **No backups are taken from read replicas**: Backups are never taken from read replica servers, regardless of their past role.

1. **Preservation of past backups**: If a server was once a primary and has backups taken during that period, those backups are preserved. They'll be retained up to the user-defined retention period.

1. **Restore Operation Restrictions**: Even if past backups exist for a server that has transitioned to a read replica, restore operations are restricted. You can only initiate a restore operation when the server has been promoted back to the primary role.

For clarity, here's a table illustrating these points:

| **Server role** | **Backup taken** | **Restore allowed** |
| --- | --- | --- |
| Primary | Yes | Yes |
| Read replica | No | No |
| Read replica promoted to primary | Yes | Yes |

**Promote to independent server and remove from replication**

While the server is a read replica, no backups are taken. However, once it's promoted to an independent server, both the promoted server and the primary server will have backups taken, and restores are allowed on both.

### Networking

Read replicas support both, private access via virtual network integration and public access through allowed IP addresses. However, please note that [private endpoint](concepts-networking-private-link.md) is not currently supported.

> [!IMPORTANT]  
> Bi-directional communication between the primary server and read replicas is crucial for the Azure Database for PostgreSQL - Flexible Server setup. There must be a provision to send and receive traffic on destination port 5432 within the Azure virtual network subnet.

The above requirement not only facilitates the synchronization process but also ensures proper functioning of the promote mechanism where replicas might need to communicate in reverse order—from replica to primary—especially during promote to primary operations. Moreover, connections to the Azure storage account that stores Write-Ahead Logging (WAL) archives must be permitted to uphold data durability and enable efficient recovery processes.

For more information about how to configure private access (virtual network integration) for your read replicas and understand the implications for replication across Azure regions and virtual networks within a private networking context, see the [Replication across Azure regions and virtual networks with private networking](concepts-networking-private.md#replication-across-azure-regions-and-virtual-networks-with-private-networking) page.

### Replication slot issues mitigation

In rare cases, high lag caused by replication slots can lead to increased storage usage on the primary server due to accumulated WAL files. If the storage usage reaches 95% or the available capacity falls below 5 GiB, the server automatically switches to read-only mode to prevent disk-full errors.

Since maintaining the primary server's health and functionality is a priority, in such edge cases, the replication slot might be dropped to ensure the primary server remains operational for read and write traffic. So, replication switches to file-based log shipping mode, which could result in a higher replication lag.

It's essential to monitor storage usage and replication lag closely and take necessary actions to mitigate potential issues before they escalate.

### Server parameters

When a read replica is created, it inherits the server parameters from the primary server. This is to ensure a consistent and reliable starting point. However, any changes to the server parameters on the primary server made after creating the read replica aren't automatically replicated. This behavior offers the advantage of individual tuning of the read replica, such as enhancing its performance for read-intensive operations without modifying the primary server's parameters. While this provides flexibility and customization options, it also necessitates careful and manual management to maintain consistency between the primary and its replica when uniformity of server parameters is required.

Administrators can change server parameters on the read replica server and set different values than on the primary server. The only exception is parameters that might affect the recovery of the replica, mentioned also in the "Scaling" section below: `max_connections`, `max_prepared_transactions`, `max_locks_per_transaction`, `max_wal_senders`, `max_worker_processes`. To ensure the read replica's recovery is seamless and it doesn't encounter shared memory limitations, these particular parameters should always be set to values that are either equivalent to or [greater than those configured on the primary server](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN).

### Scale

You're free to scale up and down compute (vCores), changing the service tier from General Purpose to Memory Optimized (or vice versa) and scaling up the storage, but the following caveats do apply.

For compute scaling:

- PostgreSQL requires several parameters on replicas to be [greater than or equal to the setting on the primary](https://www.postgresql.org/docs/current/hot-standby.html#HOT-STANDBY-ADMIN) to ensure that the replica doesn't run out of shared memory during recovery. The parameters affected are: `max_connections`, `max_prepared_transactions`, `max_locks_per_transaction`, `max_wal_senders`, `max_worker_processes`.

- **Scaling up**: First scale up a replica's compute, then scale up the primary.

- **Scaling down**: First scale down the primary's compute, then scale down the replica.

- Compute on the primary must always be equal or smaller than the compute on the smallest replica.

For storage scaling:

- **Scaling up**: First scale up a replica's storage, then scale up the primary.

- Storage size on the primary must be always equal or smaller than the storage size on the smallest replica.

## Related content

- [create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md)
- [Cross-region replication with virtual network](concepts-networking.md#replication-across-azure-regions-and-virtual-networks-with-private-networking)
