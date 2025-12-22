---
title: Reliability and High Availability in Azure Database for PostgreSQL
description: Learn how to ensure reliability and availability in Azure Database for PostgreSQL by using zone redundancy, automatic failover, and disaster recovery.
author: gaurikasar
ms.author: gkasar
ms.reviewer: maghan, gbowerman
ms.date: 12/03/2025
ms.service: azure-database-postgresql
ms.topic: concept-article
ms.custom:
  - subject-reliability
---

# High availability (Reliability) in Azure Database for PostgreSQL

This article describes high availability in Azure Database for PostgreSQL, which includes [availability zones](#availability-zone-support) and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Database for PostgreSQL supports high availability by provisioning physically separated primary and standby replicas, either within the same availability zone (zonal) or across availability zones (zone-redundant). This high availability model is designed to ensure that committed data is never lost during failures. In a high availability (HA) setup, data is synchronously committed to both the primary and standby servers. The model is designed so that the database doesn't become a single point of failure in your software architecture. For more information on high availability and availability zone support, see [Availability zone support](#availability-zone-support).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Database for PostgreSQL supports both [zone-redundant and zonal models](availability-zones-service-support.md) for high availability configurations. Both high availability configurations enable automatic failover capability with zero data loss during both planned and unplanned events.

- **Zone-redundant**. Zone redundant high availability deploys a standby replica in a different zone with automatic failover capability. Zone redundancy provides the highest level of availability, but you need to configure application redundancy across zones. For that reason, choose zone redundancy when you want protection from availability zone level failures and when latency across the availability zones is acceptable. While there can be some latency impact on writes and commits due to synchronous replication, it doesn't affect read queries. This impact is specific to your workloads, the SKU type you select, and the region.

  You can choose the region and the availability zones for both primary and standby servers. The standby replica server is provisioned in the chosen availability zone in the same region with a similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs, also known as WAL) are stored on locally redundant storage (LRS) within each availability zone, automatically storing **three** data copies. A zone-redundant configuration provides physical isolation of the entire stack between primary and standby servers.

  :::image type="content" source="~/reusable-content/ce-skilling/azure/media/postgresql/concepts-zone-redundant-high-availability-architecture.png" alt-text="Pictures illustrating redundant high availability architecture." lightbox="~/reusable-content/ce-skilling/azure/media/postgresql/concepts-zone-redundant-high-availability-architecture.png":::

The **zone-redundant** option is only available in [regions that have support for availability zones](/azure/postgresql/flexible-server/overview#azure-regions).

Zone-redundant isn't supported for:
- Burstable compute tier
- Regions with single-zone availability

- **Zonal**. Choose a zonal deployment when you want to achieve the highest level of availability within a single availability zone, but with the lowest network latency. You can choose the region and the availability zone to deploy both your primary database server. A standby replica server is *automatically* provisioned and managed in the *same* availability zone - with similar compute, storage, and network configuration - as the primary server. A zonal configuration protects your databases from node-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is replicated to the standby replica in synchronous mode. if any disruption to the primary server, the server automatically fails over to the standby replica.

  :::image type="content" source="./media/reliability-azure-database-postgresql/same-zone-high-availability-architecture.png" alt-text="Pictures illustrating zonal high availability architecture." lightbox="./media/reliability-azure-database-postgresql/same-zone-high-availability-architecture.png":::

The **zonal** deployment option is available in all [Azure regions](/azure/postgresql/flexible-server/overview#azure-regions) where you can deploy Flexible Server.

> [!NOTE]  
> Both zonal and zone-redundant deployment models architecturally behave the same. Various discussions in the following sections apply to both unless called out otherwise.

### Configure zonal resiliency in the portal

You can configure high availability (HA) in two ways: zone-redundant HA, which places the standby server in a different availability zone for maximum resiliency, or same-zone HA, which deploys the standby server in the same zone as the primary server to minimize latency.

To simplify configuration and ensure zonal resiliency, the portal provides a Zonal Resiliency option with two radio buttons: Enabled and Disabled. Selecting Enabled attempts to create the standby server in a different availability zone (zone-redundant HA mode). If the region doesn't support zone-redundant HA, you can select the fallback checkbox (highlighted in the following image) to enable same-zone HA instead.

:::image type="content" source="media/reliability-azure-database-postgresql/multi-availability-zones.png" alt-text="Screenshot of the zonal resiliency experience in the portal." lightbox="./media/reliability-azure-database-postgresql/multi-availability-zones.png":::

When you select the fallback checkbox, the system creates the standby server in the same zone. If zonal capacity later becomes available, Azure will notify you so you can choose to migrate to a zone-redundant HA configuration using [PITR or read replicas](/azure/postgresql/flexible-server/how-to-configure-high-availability).  If you don't select the checkbox and zonal capacity is unavailable, HA enablement fails. This design enforces zone-redundant HA as the default while providing a controlled fallback for same-zone HA, ensuring workloads eventually achieve full zone resiliency without manual intervention.

### High availability features

- A standby replica is deployed in the same VM configuration - including vCores, storage, and network settings - as the primary server.

- You can add availability zone support for an existing database server.

- You can remove the standby replica by disabling high availability.

- You can choose availability zones for your primary and standby database servers for zone-redundant availability.

- Operations such as stop, start, and restart are performed on both primary and standby database servers at the same time.

- In zone-redundant and zonal models, the primary database server periodically performs automatic backups. At the same time, the standby replica continuously archives the transaction logs in the backup storage. If the region supports availability zones, backup data is stored on zone-redundant storage (ZRS). In regions that don't support availability zones, backup data is stored on local redundant storage (LRS).

- Clients always connect to the end hostname of the primary database server.

- Any changes to the server parameters are also applied to the standby replica.

- You can restart the server to pick up any static server parameter changes.

- Periodic maintenance activities such as minor version upgrades happen at the standby first. To reduce downtime, the standby is promoted to primary so that workloads can keep on while the maintenance tasks are applied on the remaining node.

> [!NOTE]  
> To ensure high availability functions properly, configure the `max_replication_slots` and `max_wal_senders` server parameter values. High availability requires four of each to handle failovers and seamless upgrades. For a high availability setup with five read replicas and 12 logical replication slots, set both `max_replication_slots` and `max_wal_senders` parameter values to 21. This configuration is necessary because each read replica and logical replication slot requires one of each, plus the four needed for high availability to function properly. For more information about `max_replication_slots` and `max_wal_senders` parameters, refer to the [documentation](/azure/postgresql/flexible-server/server-parameters-table-replication-sending-servers).

### Monitor high-availability health

High availability (HA) health status monitoring in Azure Database for PostgreSQL provides a continuous overview of the health and readiness of HA-enabled instances. This monitoring feature applies [Azure's Resource Health Check (RHC)](/azure/service-health/resource-health-overview) framework to detect and alert on any issues that might affect your database's failover readiness or overall availability. By assessing key metrics like connection status, failover state, and data replication health, HA health status monitoring enables proactive troubleshooting and helps maintain your database's uptime and performance.

Use HA health status monitoring to:

- Get real-time insights into the health of both primary and standby replicas, with status indicators that reveal potential issues, such as degraded performance or network blocking.
- Set up alerts for timely notifications on any changes in HA status, so you can take immediate action to address potential disruptions.
- Optimize failover readiness by identifying and addressing issues before they impact database operations.

For a detailed guide on configuring and interpreting HA health statuses, see [High Availability (HA) health status monitoring for Azure Database for PostgreSQL](/azure/postgresql/flexible-server/how-to-monitor-high-availability).

### High availability limitations

- Because of synchronous replication to the standby server, especially with a zone-redundant configuration, applications can experience elevated write and commit latency.

- You can't use the standby replica for read queries.

- Depending on the workload and activity on the primary server, the failover process might take longer than 120 seconds because the standby replica needs to recover before it can be promoted.

- The standby server typically recovers WAL files at 40 MB/s. For larger versions, this rate can increase to as much as 200 MB/s. If your workload exceeds this limit, you can encounter extended time for the recovery to complete either during the failover or after establishing a new standby.

- Restarting the primary database server also restarts the standby replica.

- You can't configure an extra standby.

- You can't schedule customer-initiated management tasks during the managed maintenance window.

- Planned events such as scale computing and scale storage happen on the standby first and then on the primary server. Currently, the server doesn't failover for these planned operations.

- If you configure logical decoding or logical replication on an HA-enabled flexible server: 
    - In **PostgreSQL 16** and earlier, logical replication slots aren't preserved on the standby server after a failover by default.
    - To ensure logical replication continues to function after failover, you need to enable the `pg_failover_slots` extension and configure supporting settings such as `hot_standby_feedback = on`.
    - Starting with **PostgreSQL 17**, slot synchronization is supported natively. If you enable the correct PostgreSQL configurations (`sync_replication_slots`, `hot_standby_feedback`), logical replication slots are preserved automatically after failover, and no extension is required.
    - For setup steps and prerequisites,  refer to the [PG_Failover_Slots extension](/azure/postgresql/flexible-server/concepts-extensions#pg_failover_slots-preview) documentation.

- Configuring availability zones between private (virtual network) and public access with private endpoints isn't supported. You must configure availability zones within a virtual network (spanned across availability zones within a region) or public access with private endpoints.

- You can only configure availability zones within a single region. You can't configure availability zones across regions.

### SLA

- The **Zonal** model offers an uptime for an [SLA for about 99.95%](https://azure.microsoft.com/support/legal/sla/postgresql).

- The **Zone-redundancy** model offers an uptime for an [SLA for about 99.99%](https://azure.microsoft.com/support/legal/sla/postgresql).

### Create an Azure Database for PostgreSQL with availability zone enabled

To learn how to create an Azure Database for PostgreSQL for high availability with availability zones, see [Quickstart: Create an Azure Database for PostgreSQL in the Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal).

### Availability zone redeployment and migration

To learn how to enable or disable high availability configuration in your flexible server in both zone-redundant and zonal deployment models, see [Manage high availability in Flexible Server](/azure/postgresql/flexible-server/how-to-manage-high-availability-portal).

### High availability components and workflow

#### Transaction completion

An application transaction triggers a write and commit that first logs to the WAL on the primary server. The primary server streams these logs to the standby server by using the Postgres streaming protocol. When the standby server storage persists the logs, the primary server acknowledges write completion. The application commits its transaction only after this acknowledgment. This extra round-trip adds latency to your application. The impact percentage depends on the application. This acknowledgment process doesn't wait for the logs to be applied to the standby server. The standby server stays in recovery mode until it's promoted.

#### Health check

Flexible server health monitoring periodically checks the health of both the primary and standby servers. After multiple pings, if health monitoring detects that a primary server isn't reachable, the service initiates an automatic failover to the standby server. The health monitoring algorithm uses multiple data points to avoid false positive situations.

#### Failover modes

Flexible server supports two failover modes, [**Planned failover**](#planned-failover) and [**Unplanned failover**](#unplanned-failover). In both modes, once replication breaks, the standby server runs recovery before promotion as a primary and opens for read/write. With automatic DNS entries updated with the new primary server endpoint, applications can connect to the server by using the same endpoint. A new standby server is established in the background, so that your application can maintain connectivity.

#### High availability status

The system continuously monitors the health of primary and standby servers. It takes appropriate actions to fix issues, including triggering a failover to the standby server. The following table lists the possible high availability statuses:

| **Status** | **Description** |
| --- | --- |
| **Initializing** | In the process of creating a new standby server. |
| **Replicating Data** | After the standby is created, it's catching up with the primary. |
| **Healthy** | Replication is in steady state and healthy. |
| **Failing Over** | The database server is in the process of failing over to the standby. |
| **Removing Standby** | In the process of deleting standby server. |
| **Not Enabled** | High availability isn't enabled. |

> [!NOTE]  
> You can enable high availability during server creation or at a later time. If you enable or disable high availability during the post-create stage, do so when the primary server activity is low.

#### Steady-state operations

PostgreSQL client applications connect to the primary server by using the DB server name. The primary server directly serves application reads. At the same time, the application receives confirmation of commits and writes only after the log data persists on both the primary server and the standby replica. Due to this extra round-trip, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

:::image type="content" source="./media/reliability-azure-database-postgresql/high-availability-steady-state.png" alt-text="Picture showing high availability steady state operation workflow.":::

1. Clients connect to the flexible server and perform write operations.
1. Changes replicate to the standby site.
1. Primary receives an acknowledgment.
1. Writes and commits are acknowledged.

#### Point-in-time restore of high availability servers

For flexible servers configured with high availability, the system replicates log data in real-time to the standby server. Any user errors on the primary server - such as an accidental drop of a table or incorrect data updates - are replicated to the standby replica. So, you can't use the standby to recover from such logical errors. To recover from such errors, you must perform a point-in-time restore from the backup. By using a flexible server's point-in-time restore capability, you can restore to the time before the error occurred. A new database server is restored as a single-zone flexible server with a new user-provided server name for databases configured with high availability. You can use the restored server for several use cases:

- Use the restored server for production and optionally enable high availability with standby replica on either same zone or another zone in the same region.

- If you want to restore an object, export it from the restored database server and import it to your production database server.
- If you want to clone your database server for testing and development purposes or to restore for any other purposes, you can perform the point-in-time restore.

To learn how to do a point-in-time restore of a flexible server, see [Point-in-time restore of a flexible server](/azure/postgresql/flexible-server/how-to-restore-server-portal).

### Failover support

#### Planned failover

Planned downtime events include Azure scheduled periodic software updates and minor version upgrades. You can also use a planned failover to return the primary server to a preferred availability zone. When you configure high availability, these operations first apply to the standby replica while applications continue to access the primary server. Once the process updates the standby replica, it drains primary server connections and triggers a failover that activates the standby replica as the primary server with the same database server name. Client applications reconnect with the same database server name to the new primary server and can resume their operations. The process establishes a new standby server in the same zone as the old primary.

For other user-initiated operations such as scale-compute or scale-storage, the process applies changes on the standby first, then the primary. Currently, the service doesn't fail over to the standby. Hence, while the scale operation runs on the primary server, applications encounter short downtime.

You can also use this feature to failover to the standby server with reduced downtime. For example, your primary server could be in a different availability zone than the application after an unplanned failover. You want to bring the primary server back to the previous zone to colocate with your application.

When you execute this feature, the process first prepares the standby server to ensure it catches up with recent transactions, allowing the application to continue performing reads and writes. The process promotes the standby and severs the connections to the primary. Your application can continue to write to the primary while the process establishes a new standby server in the background. The following table describes the steps involved with planned failover:

| **Step** | **Description** | **App downtime expected?** |
  | --- | --- | --- |
  | 1 | Wait for the standby server to catch up with the primary. | No |
  | 2 | Internal monitoring system initiates the failover workflow. | No |
  | 3 | Application writes are blocked when the standby server is close to the primary log sequence number (LSN). | Yes |
  | 4 | Standby server is promoted to be an independent server. | Yes |
  | 5 | DNS record is updated with the new standby server's IP address. | Yes |
  | 6 | Application reconnects and resumes its read/write with new primary. | No |
  | 7 | A new standby server in another zone is established. | No |
  | 8 | Standby server starts to recover logs (from Azure Blob) that it missed during its establishment. | No |
  | 9 | A steady state between the primary and the standby server is established. | No |
  | 10 | Planned failover process is complete. | No |

Application downtime starts at step 3 and can resume operation after step 5. The rest of the steps happen in the background without affecting application writes and commits.

> [!TIP]  
> With flexible server, you can optionally schedule Azure-initiated maintenance activities by choosing a 60-minute window on a day of your preference when activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades happen during that window. If you don't choose a custom window, the system allocates a one-hour window between 11 PM and 7 AM local time for your server.
> These Azure-initiated maintenance activities also perform on the standby replica for flexible servers that are configured with availability zones.

For a list of possible planned downtime events, see [Planned downtime events](/azure/postgresql/flexible-server/concepts-business-continuity#planned-downtime-events).

#### Unplanned failover

Unplanned downtimes can occur as a result of unforeseen disruptions such as underlying hardware faults, networking issues, and software bugs. If the database server configured with high availability goes down unexpectedly, the process activates the standby replica and clients can resume their operations. If you don't configure high availability (HA), and the restart attempt fails, the process automatically provisions a new database server. While an unplanned downtime can't be avoided, flexible server helps mitigate the downtime by automatically performing recovery operations without requiring human intervention.

For information on unplanned failovers and downtime, including possible scenarios, see [Unplanned downtime mitigation](/azure/postgresql/flexible-server/concepts-business-continuity#unplanned-downtime-mitigation).

#### Failover testing (forced failover)

With a forced failover, you can simulate an unplanned outage scenario while running your production workload and observe your application downtime. You can also use a forced failover when your primary server becomes unresponsive.

A forced failover brings the primary server down and initiates the failover workflow in which the standby promote operation is performed. Once the standby completes the recovery process until the last committed data, it's promoted to be the primary server. DNS records are updated, and your application can connect to the promoted primary server. Your application can continue to write to the primary while a new standby server is established in the background, which doesn't impact the uptime.

The following table describes the steps during forced failover:

| **Step** | **Description** | **App downtime expected?** |
| --- | --- | --- |
| 1 | Primary server stops shortly after receiving the failover request. | Yes |
| 2 | Application encounters downtime as the primary server is down. | Yes |
| 3 | Internal monitoring system detects the failure and initiates a failover to the standby server. | Yes |
| 4 | Standby server enters recovery mode before being fully promoted as an independent server. | Yes |
| 5 | The failover process waits for the standby recovery to complete. | Yes |
| 6 | Once the server is up, the process updates the DNS record with the same hostname but uses the standby's IP address. | Yes |
| 7 | Application can reconnect to the new primary server and resume the operation. | No |
| 8 | A standby server in the preferred zone is established. | No |
| 9 | Standby server starts to recover logs (from Azure Blob) that it missed during its establishment. | No |
| 10 | A steady state between the primary and the standby server is established. | No |
| 11 | Forced failover process is complete. | No |

Application downtime starts after step 1 and continues until step 6 finishes. The other steps run in the background without affecting application writes and commits.

> [!IMPORTANT]  
> The end-to-end failover process includes (a) failing over to the standby server after the primary failure and (b) establishing a new standby server in a steady state. As your application incurs downtime until the failover to the standby is complete, **measure the downtime from your application/client perspective** instead of the overall end-to-end failover process.

#### Considerations when performing forced failovers

- The overall end-to-end operation time can be longer than the actual downtime experienced by the application.

  > [!IMPORTANT]  
  > Always observe the downtime from the application perspective!

- Don't perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, so the new standby server can be fully established.

- Perform a forced failover during a low-activity period to reduce downtime.

#### Best practices for PostgreSQL statistics after failover

After a PostgreSQL failover, maintaining optimal database performance involves understanding the distinct roles of [pg_statistic](https://www.postgresql.org/docs/current/catalog-pg-statistic.html) and the [pg_stat_*](https://www.postgresql.org/docs/current/monitoring-stats.html) tables. The `pg_statistic` table stores optimizer statistics, which are crucial for the query planner. These statistics include data distributions within tables and remain intact after a failover, ensuring that the query planner can continue to optimize query execution effectively based on accurate, historical data distribution information.

In contrast, the `pg_stat_*` tables, which record activity statistics such as the number of scans, tuples read, and updates, reset upon failover. An example of such a table is `pg_stat_user_tables`, which tracks activity for user-defined tables. This reset accurately reflects the new primary's operational state but also means the loss of historical activity metrics that could inform the autovacuum process and other operational efficiencies.

Given this distinction, run `ANALYZE` after a PostgreSQL failover. This action updates the `pg_stat_*` tables, like `pg_stat_user_tables`, with fresh activity statistics, helping the autovacuum process and ensuring that the database performance remains optimal in its new role. This proactive step bridges the gap between preserving essential optimizer statistics and refreshing activity metrics to align with the database's current state.

### Zone-down experience

**Zonal**: To recover from a zone-level failure, you can [perform point-in-time restore](#point-in-time-restore-of-high-availability-servers) by using the backup. You can choose a custom restore point with the latest time to restore the latest data. A new flexible server is deployed in another nonaffected zone. The time taken to restore depends on the previous backup and the volume of transaction logs to recover.

For more information on point-in-time restore, see [Backup and restore in Azure Database for PostgreSQL-Flexible Server](/azure/postgresql/flexible-server/concepts-backup-restore).

**Zone-redundant**: Flexible server automatically fails over to the standby server within 60-120 seconds with zero data loss.

## Configurations without availability zones

Although it's not recommended, you can configure your flexible server without high availability enabled. For flexible servers configured without high availability, the service provides locally redundant storage with three copies of data, zone-redundant backup (in regions where it's supported), and built-in server resiliency to automatically restart a crashed server and relocate the server to another physical node. This configuration offers an uptime [SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/postgresql). During planned or unplanned failover events, if the server goes down, the service maintains the availability of the servers by using the following automated procedure:

1. A new compute Linux VM is provisioned.
1. The storage with data files is mapped to the new virtual machine.
1. PostgreSQL database engine is brought online on the new virtual machine.

The following picture shows the transition between VM and storage failure.

:::image type="content" source="./media/reliability-azure-database-postgresql/availability-without-zone-redundant-ha-architecture.png" alt-text="Diagram that shows availability without zone redundant high availability (HA) in steady state." border="false" lightbox="./media/reliability-azure-database-postgresql/availability-without-zone-redundant-ha-architecture.png":::

## Cross-region disaster recovery and business continuity

If a region-wide disaster occurs, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md).

Flexible server provides features that protect data and mitigate downtime for your mission-critical databases during planned and unplanned downtime events. Built on top of the Azure infrastructure that offers robust resiliency and availability, flexible server offers business continuity features that provide fault-protection, address recovery time requirements, and reduce data loss exposure. As you architect your applications, consider the downtime tolerance - the recovery time objective (RTO), and data loss exposure - the recovery point objective (RPO). For example, your business-critical database requires stricter uptime than a test database.

### Disaster recovery in multi-region geography

#### Geo-redundant backup and restore

Geo-redundant backup and restore give you the ability to restore your server in a different region if a disaster occurs. It also provides at least 99.99999999999999 percent (16 nines) durability of backup objects over a year.

You can only configure geo-redundant backup when you create the server. When you configure the server with geo-redundant backup, the backup data and transaction logs are copied to the paired region asynchronously through storage replication.

For more information on geo-redundant backup and restore, see [geo-redundant backup and restore](/azure/postgresql/flexible-server/concepts-backup-restore#geo-redundant-backup-and-restore).

#### Read replicas

You can deploy cross region read replicas to protect your databases from region-level failures. Read replicas are updated asynchronously by using PostgreSQL's physical replication technology, and they can lag the primary. General purpose and memory optimized compute tiers support read replicas.

For more information on read replica features and considerations, see [Read replicas](/azure/postgresql/flexible-server/concepts-read-replicas).

#### Outage detection, notification, and management

If you configure your server with geo-redundant backup, you can perform geo-restore in the paired region. A new server is provisioned and recovered to the last available data that was copied to this region.

You can also use cross region read replicas. If a region failure occurs, you can perform disaster recovery operation by promoting your read replica to be a standalone read-writeable server. RPO is expected to be up to 5 minutes (data loss possible) except if severe regional failure when the RPO can be close to the replication lag at the time of failure.

For more information on unplanned downtime mitigation and recovery after regional disaster, see [Unplanned downtime mitigation](/azure/postgresql/flexible-server/concepts-business-continuity#unplanned-downtime-mitigation).

## Related content

- [Azure Database for PostgreSQL documentation](/azure/postgresql/)
- [Reliability in Azure](availability-zones-overview.md)
