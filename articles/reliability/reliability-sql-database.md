---
title: Reliability in Azure SQL Database
description: Find out about reliability in Azure SQL Database, including availability zones and multi-region deployments.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-sql-database
ms.date: 10/08/2025
zone_pivot_groups: sql-database-tiers
---

# Reliability in Azure SQL Database

This article describes reliability support in Azure SQL Database, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

For most production deployments of Azure SQL Database, we recommend that you consider the following minimum configuration:

- Follow the guidance in [High availability and disaster recovery checklist - Azure SQL Database](/azure/azure-sql/database/high-availability-disaster-recovery-checklist).

- Enable zone redundancy. The following service tiers support zone redundancy: 
   - In the [DTU-based purchasing model](/azure/azure-sql/database/service-tiers-dtu), the Premium service tier supports zone redundancy.
   - In the [vCore-based purchasing model](/azure/azure-sql/database/service-tiers-sql-database-vcore), the General Purpose, Business Critical, and Hyperscale service tiers support zone redundancy.

- Configure [automated backups](/azure/azure-sql/database/automated-backups-overview) and use a minimum of zone-redundant storage. Test your backups and restore process regularly.

## Reliability architecture overview

Azure SQL Database runs on the latest stable SQL Server Database Engine of the Windows operating system, including all applicable patches.

By default, Azure SQL Database achieves redundancy by storing three copies of your data in a single datacenter in the primary region. This approach protects your data in the event of a localized failure, such as a small-scale network or power failure, and even during the following events:

- Customer initiated management operations that result in a brief downtime.
- Service maintenance operations.
- Issues and datacenter outages with:
    - Racks, where the machines that power your service are running.
    - Physical machines that host the VM that runs the SQL Database Engine.
- Other problems with the SQL Database Engine.
- Other potential unplanned localized outages.

Azure SQL Database uses Azure Service Fabric to manage the replication of your database.

Redundancy is implemented in different ways for different service tiers of Azure SQL Database. To learn more about how Azure SQL Database provides redundancy, see [Availability through redundancy - Azure SQL Database](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure SQL Database automatically handles critical servicing tasks, such as patching, backups, Windows, and SQL Database Engine upgrades. It also automatically handles unplanned events such as underlying hardware, software, or network failures. Azure SQL Database can quickly recover even in the most critical circumstances, ensuring that your data is always available. Most users don't notice that upgrades are performed continuously.

When a database is patched or fails over, the downtime isn't impactful if you [employ retry logic](/azure/azure-sql/database/develop-overview#resiliency) in your application.

You can test your application's resiliency to transient faults by following the guidance in [Test application fault resiliency](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy#testing-application-fault-resiliency).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

::: zone pivot="general-purpose,premium,business-critical,hyperscale"

You can create a *zone-redundant* single database or elastic pool. Zone redundancy ensures that your database is resilient to a large set of failures, including catastrophic datacenter outages, without any changes to the application logic.

::: zone-end

::: zone pivot="general-purpose"

For the General Purpose service tier, zone redundancy ensures that both the stateless compute components and the stateful data storage components of Azure SQL Database are resilient to an availability zone outage.

::: zone-end

::: zone pivot="premium,business-critical,hyperscale"

For the Premium, Business Critical, and Hyperscale service tiers, zone redundancy places replicas of your Azure SQL Database across multiple Azure availability zones in your primary region. To eliminate a single point of failure, the control ring is also duplicated across multiple availability zones.

::: zone-end

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Requirements

::: zone pivot="basic-standard"

The Basic and Standard service tiers don't support zone redundancy.

Zone redundancy is available to databases in the Business Critical, General Purpose and Hyperscale service tiers of the [vCore-based purchasing model](/azure/azure-sql/database/service-tiers-sql-database-vcore), and only the Premium service tier of the [DTU-based purchasing model](/azure/azure-sql/database/service-tiers-dtu).

::: zone-end

::: zone pivot="general-purpose"

For the General Purpose service tier:

- Zone-redundant configuration is only available when standard-series (Gen5) hardware is selected.
- When using a zone-redundant Azure SQL Database, only specific regions support custom maintenance windows. For more information, see [Azure SQL Database region support for maintenance windows](/azure/azure-sql/database/region-availability#ZR-maintenance-window-availability).

::: zone-end

::: zone pivot="premium,business-critical"

For the Premium and Business Critical service tiers:

- When using a zone-redundant Azure SQL Database, only specific regions support custom maintenance windows. For more information, see [Azure SQL Database region support for maintenance windows](/azure/azure-sql/database/region-availability#ZR-maintenance-window-availability).

::: zone-end

::: zone pivot="hyperscale"

For the Hyperscale service tier:

- When using a zone-redundant Azure SQL Database, only specific regions support custom maintenance windows. For more information, see [Azure SQL Database region support for maintenance windows](/azure/azure-sql/database/region-availability#ZR-maintenance-window-availability).

- You must enable zone-redundant or geo-zone-redundant backup storage.

::: zone-end

::: zone pivot="premium,general-purpose,business-critical,hyperscale"

### Regions supported

::: zone-end

::: zone pivot="premium,general-purpose,business-critical"

For the Premium, General Purpose, and Business Critical service tiers, zone redundancy is available in [all Azure regions that support availability zones](./regions-list.md).

::: zone-end

::: zone pivot="hyperscale"

For the Hyperscale service tier, zone redundancy is available in [all Azure regions that support availability zones](./regions-list.md). However, zone redundancy support for Hyperscale premium-series and premium-series memory optimized hardware is available in [select Azure regions](/azure/azure-sql/database/region-availability#hyperscale-premium-series-availability).

::: zone-end

::: zone pivot="premium,general-purpose,business-critical,hyperscale"

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Considerations

- **Latency:** Because zone-redundant databases have replicas in different datacenters with some distance between them, the increased network latency might increase transaction commit time, and thus impact the performance of some OLTP workloads. Most applications aren't sensitive to this extra latency.

- **`master` database:** When a database with a zone-redundant configuration is created on a logical server, the `master` database associated with the server is automatically made zone-redundant as well. For more information, and to check whether your `master` database is zone-redundant, see [Database zone redundant availability](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy#zone-redundant-availability).

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Cost

::: zone-end

::: zone pivot="general-purpose"

For the General Purpose service tier, there's an additional charge to enable zone redundancy for Azure SQL Database. For more information, see [Pricing - Azure SQL Database](https://azure.microsoft.com/pricing/details/azure-sql-database/single/).

::: zone-end

::: zone pivot="premium,business-critical"

The Premium and Business Critical service tiers provide multiple replicas of your database. When you enable zone redundancy, the replicas are distributed between availability zones. This means that there's no additional cost associated with enabling zone redundancy on your Azure SQL Database when it's in the Premium or Business Critical service tier.

::: zone-end

::: zone pivot="hyperscale"

If you enable multiple replicas of your Hyperscale service tier database, you can enable zone redundancy. When you enable zone redundancy, the replicas are distributed between availability zones. This means that there's no additional cost associated with enabling zone redundancy on your Azure SQL Database when it's in the Hyperscale service tier, assuming you have multiple replicas.

::: zone-end

::: zone pivot="premium,general-purpose,business-critical,hyperscale"

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Configure availability zone support

::: zone-end

::: zone pivot="general-purpose,premium,business-critical"

For the General Purpose, Premium, and Business Critical service tiers:

- **New resources**: You can configure a database to be zone-redundant when you create it. To learn how to create a single Azure Database and configure it with zone redundancy, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).

- **Existing resources:** You can reconfigure an existing database to be zone-redundant. To learn how to reconfigure an existing database with zone redundancy, see [Enable zone redundancy - Azure SQL Database](/azure/azure-sql/database/enable-zone-redundancy).

    All Azure SQL Database scaling operations, including enabling zone redundancy, are online operations and require minimal to no downtime. For more details, see [Dynamically scale database resources with minimal downtime](/azure/azure-sql/database/scale-resources).

- **Disable zone redundancy:** You can disable zone redundancy. This process is an online operation similar to a regular service tier objective upgrade. At the end of the process, the database is migrated from a zone-redundant ring to a single-zone ring.

::: zone-end

::: zone pivot="hyperscale"

For the Hyperscale service tier:

- **New resources:** For Hyperscale databases and elastic pools, zone redundancy must be configured when the database is created. For more information, see [Create a zone-redundant Hyperscale database](/azure/azure-sql/database/hyperscale-create-zone-redundant-database).

- **Migration or disable zone redundancy:** To enable or disable zone redundancy on an existing Hyperscale database or elastic pool, you need to redeploy it. The process adds a secondary replica for high availability, and places it into a different availability zone.

    To learn how to redeploy an existing Hyperscale database with zone redundancy, see [Redeploy a zone-redundant Hyperscale database - Azure SQL Database](/azure/azure-sql/database/enable-zone-redundancy#redeployment-hyperscale)

::: zone-end

::: zone pivot="premium,general-purpose,business-critical,hyperscale"

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Normal operations

This section describes what to expect when databases are configured for zone redundancy and all availability zones are operational.

::: zone-end

::: zone pivot="general-purpose"

For the General Purpose service tier:

- **Traffic routing between zones.** Requests are routed to a node that runs your SQL database compute layer. When zone redundancy is enabled, this node might be located in any availability zone.

- **Data replication between zones** Data and log files are synchronously replicated across availability zones by using zone-redundant storage. Write operations aren't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it may result in slightly higher write latency compared to locally redundant storage.

::: zone-end

::: zone pivot="premium,business-critical"

For the Premium and Business Critical service tiers:

- **Traffic routing between zones.** Replicas are distributed across availability zones, and one of those replicas is designated as the *primary* replica. Requests are routed to your database's primary replica.

- **Data replication between zones.** The primary replica constantly pushes changes to the secondary replicas sequentially to ensure that data is persisted on a sufficient number of secondary replicas before committing each transaction. This process guarantees that, if the primary replica or a readable secondary replica become unavailable for any reason, a fully synchronized replica is always available for failover. When zone redundancy is enabled, those replicas are located in different availability zones. However, it may result in slightly higher write latency due to the network latency in traversing zones.

::: zone-end

::: zone pivot="hyperscale"

For the Hyperscale service tier:

- **Traffic routing between zones.** Database replicas are distributed across availability zones, and one of those replicas is designated as the *primary* replica. Requests are routed to your database's primary replica.

- **Data replication between zones.** The primary database replica pushes changes through a zone-redundant log service, which replicates all changes synchronously across availability zones. Page servers are located in each availability zone and store the database's state. This process guarantees that, if the primary replica or a readable secondary replica become unavailable for any reason, a fully synchronized replica is always available for failover. However, it may result in slightly higher write latency compared to locally redundant storage.

::: zone-end

::: zone pivot="premium,general-purpose,business-critical,hyperscale"

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Zone-down experience

This section describes what to expect when databases are configured for zone redundancy and there's an availability zone outage.

- **Detection and response:** Azure SQL Database is responsible for detecting and responding to a failure in an availability zone. You don't need to do anything to initiate a zone failover.

- **Active requests:** When an availability zone goes offline, any requests that are being processed in the faulty availability zone are terminated and must be retried. To make your applications resilient to these types of problems, see [transient fault handling guidance](#transient-faults).

::: zone-end

::: zone pivot="general-purpose"

- **Traffic rerouting:** For the General Purpose service tier, Azure SQL Database moves the database engine to another stateless compute node that's in a different availability zone and has sufficient free capacity. After failover completes, new connections are automatically redirected to the new primary compute node.

    For more information, see [General Purpose service tier](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy#general-purpose-service-tier-zone-redundant-availability).

::: zone-end

::: zone pivot="premium,business-critical"

- **Traffic rerouting:** For the Premium and Business Critical service tiers, Azure SQL Database selects a replica in another availability zone to become the primary replica. Once a secondary replica becomes the new primary replica, another secondary replica is created to ensure the cluster has a sufficient number of replicas to maintain quorum. After failover completes, new connections are automatically redirected to the new primary replica (or readable secondary replica based on the connection string).

    For more information, see [Premium and Business Critical service tiers](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy#premium-and-business-critical-service-tier-zone-redundant-availability).

::: zone-end

::: zone pivot="hyperscale"

- **Traffic rerouting:** For the Hyperscale service tier, if the primary replica was lost due to the zone outage, Azure SQL Database promotes one of the HA replicas in another zone to be the new primary.

    For more information, see [Hyperscale service tier](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy#hyperscale-service-tier-zone-redundant-availability).

::: zone-end

::: zone pivot="premium,general-purpose,business-critical,hyperscale"

- **Expected downtime:** There might be a small amount of downtime during an availability zone failover. The downtime is typically less than 30 seconds, which your application should tolerate if it's following the [transient fault handling guidance](#transient-faults).

- **Expected data loss:** There is no data loss expected during an availability zone failover.

To view information about availability zone support for other service tiers, be sure to select the appropriate service tier at the beginning of this page.

### Zone recovery

When the availability zone recovers, Azure Service Fabric automatically creates database replicas in the recovered availability zone, removes any temporary replicas created in the other availability zones, and routes traffic between your database as normal. To avoid disruption, the primary replica doesn't automatically return the original zone after the zone recovery.

### Testing for zone failures

Azure SQL Database platform manages traffic routing, failover, and zone recovery procedures for zone-redundant databases. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes. However, you can validate your application's handling of failures and failovers by following the process described in [Test application fault resiliency](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy#testing-application-fault-resiliency).

::: zone-end

## Multi-region support

This section provides an overview of two related but separate features that can be used for multi-region geo-replication of Azure SQL Database:

- [Active geo-replication](/azure/azure-sql/database/active-geo-replication-overview) replicates a single database to a synchronized secondary database.

- [Failover groups](/azure/azure-sql/database/failover-group-sql-db) build on top of active geo-replication by providing the ability to fail over a group of databases.

### [Active geo-replication](#tab/active-geo)

[Active geo-replication](/azure/azure-sql/database/active-geo-replication-overview) creates a continuously synchronized readable secondary database (which is sometimes called *geo-secondary* or *geo-replica*) in any region for a single primary database. Active geo-replication can create secondary databases in the same region, but this doesn't provide protection against a region outage. When you use active geo-replication to achieve geo-redundancy, you locate the secondary database in a different region to the primary database.

### [Failover groups](#tab/failover-groups)

[Failover groups](/azure/azure-sql/database/failover-group-sql-db) build on top of active geo-replication. With failover groups, you can:

- Replicate a set of databases from a single logical server across any combination of Azure regions.
- Perform failover on the databases as a group.
- Use connection endpoints that automatically direct connections to the primary.

---

### Region support

### [Active geo-replication](#tab/active-geo)

[Active geo-replication](/azure/azure-sql/database/active-geo-replication-overview) can be enabled in all Azure regions, and don't require you to use Azure region pairs.

> [!TIP]
> Azure SQL Database follows a safe deployment practice where Azure strives not to deploy updates to paired regions at the same time. If you configure active geo-replication to use nonpaired regions, configure different maintenance windows on the servers in each region to reduce the likelihood that both regions have any connectivity issues due to maintenance at the same time.

### [Failover groups](#tab/failover-groups)

Failover groups can be created across all Azure regions, and don't require you to use Azure region pairs.

> [!TIP]
> If you configure a failover group to use nonpaired regions, consider configuring different maintenance windows on the servers in each region to reduce the likelihood that both regions have any connectivity issues due to maintenance at the same time.

---

### Requirements

### [Active geo-replication](#tab/active-geo)

When using active geo-replication, consider the following requirements:
- Both the primary and geo-secondary must have the same service tier and should have the same compute tier, compute size, and backup storage redundancy.
- Both the primary and geo-secondary should have the same IP firewall rules.

Active geo-replication is supported for databases across different Azure subscriptions.

### [Failover groups](#tab/failover-groups)

When using failover groups, consider the following requirements:
- Secondary databases in a failover group should have the same service tier, compute tier, compute size, IP firewall rules, and backup storage redundancy as the primary database.

---

### Considerations

### [Active geo-replication](#tab/active-geo)

- Active geo-replication is designed to provide failover of a single database. If you need to fail over multiple databases, consider using failover groups instead.

- Because geo-replication is asynchronous, it's possible to have data loss when a failover occurs. If you need to eliminate data loss from asynchronous replication during failovers, you can configure your application to block the calling thread until the last committed transaction has been transmitted and hardened in the transaction log of the secondary database. This approach requires custom development, and it reduces the performance of your application. To learn more, see [Prevent loss of critical data](/azure/azure-sql/database/active-geo-replication-overview#prevent-loss-of-critical-data).

- Review [Active geo-replication](/azure/azure-sql/database/active-geo-replication-overview) to understand how this capability works in more detail.

### [Failover groups](#tab/failover-groups)

::: zone pivot="hyperscale"

- For the Hyperscale service tier, if your primary database has zone redundancy enabled, then secondary databases have zone redundancy enabled automatically.

::: zone-end

::: zone pivot="basic-standard,premium,general-purpose,business-critical"

- Secondary databases don't have zone redundancy enabled by default, but it can be enabled later.

::: zone-end

- Because geo-replication is asynchronous, it's possible to have data loss when a failover occurs. If you need to eliminate data loss from asynchronous replication during failovers, you can configure your application to block the calling thread until the last committed transaction has been transmitted and hardened in the transaction log of the secondary database. This approach requires custom development, and it reduces the performance of your application. To learn more, see [Prevent loss of critical data](/azure/azure-sql/database/active-geo-replication-overview#prevent-loss-of-critical-data).

- Review [Failover groups](/azure/azure-sql/database/failover-group-sql-db) to understand other limitations and considerations.

---

### Cost

Secondary databases are billed as separate databases.

::: zone pivot="basic-standard,premium,general-purpose,business-critical"

If you don't use a secondary database for any read or write workloads, consider whether you can [designate it as a standby replica](/azure/azure-sql/database/standby-replica-how-to-configure) to reduce your costs.

::: zone-end

### Configure multi-region support

### [Active geo-replication](#tab/active-geo)

- **Enable active geo-replication:** To learn how to enable active geo-replication in the Azure portal, see [Configure active geo-replication for Azure SQL Database](/azure/azure-sql/database/active-geo-replication-configure-portal) or [available for other tooling](/azure/azure-sql/database/active-geo-replication-overview).

    After you enable active geo-replication, there's an initial seeding step that can take some time.

- **Disable active geo-replication:** To learn how to disable active geo-replication on a database, see [Remove secondary database](/azure/azure-sql/database/active-geo-replication-configure-portal).

### [Failover groups](#tab/failover-groups)

- **Enable failover groups:** You configure a failover group on a logical server. You can add all the databases in the logical server to the failover group, or you can select a subset of databases to add.

    When you create a failover group, you select the [failover policy](/azure/azure-sql/database/failover-group-sql-db#failover-policy), which specifies who is responsible for detecting an outage and performing a failover. You can configure customer-managed failover (recommended) or Microsoft-managed failover.

    > [!IMPORTANT]
    > Microsoft-initiated failover is triggered by Microsoft. It's likely to happen after a significant delay and is done on a best-effort basis. Failover of databases might happen at a different time to any failover of other Azure services.
    To learn how to configure a failover group, see [Configure a failover group for Azure SQL Database](/azure/azure-sql/database/failover-group-configure-sql-db).

    After you configure the failover group, there's an initial seeding step that can take some time.

- **Disable failover groups:** You can remove an individual database from a failover group, remove an entire failover group, or move a database into a different failover group.

---

### Normal operations

### [Active geo-replication](#tab/active-geo)

This section describes what to expect when a database is configured to use active geo-replication and all regions are operational.

- **Traffic routing between regions:** Your application must be configured to send read-write requests to the primary database. You can optionally send read-only requests to a secondary database, which helps to reduce the impact of read-only workloads on your primary database.

- **Data replication between regions:** Replication between the primary and secondary databases happens asynchronously, which means there can be a delay between a change being applied to the primary database and when it's replicated to the secondary database.

    When you perform a failover, you decide how to handle the possibility of data loss.

### [Failover groups](#tab/failover-groups)

This section describes what to expect when a database is configured within a failover group and all regions are operational.

- **Traffic routing between regions:** Failover groups provide two listener endpoints for you to connect your applications to, for read-write and read-only workloads. You should use the failover group listener endpoints to minimize downtime during failovers.

    During normal operations:

    - The read-write listener endpoint routes all requests to the primary databases.
    - The read-only listener endpoint routes all requests to a readable secondary database.

- **Data replication between regions:** Geo-replication between the primary and secondary databases happens asynchronously, which means there can be a delay between a change being applied to the primary database and when it's replicated to the secondary database.

    When you perform a failover, you decide how to handle the possibility of data loss.

---

### Region-down experience

### [Active geo-replication](#tab/active-geo)

This section describes what to expect when a database is configured to use active geo-replication and there's an outage in your primary region:

- **Detection and response:** You're responsible both for detecting the outage of a database or region and triggering failover.

- **Active requests:** Any active requests during the failover are terminated and must be retried.

- **Expected data loss:** If your primary database is available, you can optionally perform a failover with no data loss. The failover process synchronizes data between the primary and secondary databases before switching roles.

    If your primary database isn't available, you might need to perform a *forced failover*, which will result in data loss. You can estimate the amount of data loss by monitoring the replication lag. For more information, see [Monitor Azure SQL Database with metrics and alerts](/azure/azure-sql/database/monitoring-metrics-alerts#use-metrics-to-monitor-databases-and-elastic-pools).

- **Expected downtime:** Typically there is up to 60 seconds of downtime during a failover. Ensure that your application is [handling transient faults](#transient-faults) so that it can recover from short periods of downtime. Also, the downtime you experience is affected by how quickly your application is reconfigured to connect to the new primary database.

- **Traffic rerouting:** You're responsible for reconfiguring your application to send requests to the new primary database. If you need to have transparent failover, consider using failover groups.

### [Failover groups](#tab/failover-groups)

This section describes what to expect when a database is configured within a failover group and there's an outage in your primary region:

- **Detection and response** depends on the failover policy you use.

    - *Customer-initiated failover:* You're responsible for detecting the outage of a database or region and triggering failover.

    - *Microsoft-initiated failover:* Microsoft triggers failover for all failover groups in the affected region. We only expect to perform this type of failover in exceptional situations. You shouldn't rely on Microsoft-managed failover for most solutions. To learn more, see [Failover policy - Microsoft managed](/azure/azure-sql/database/failover-group-sql-db#microsoft-managed).

- **Active requests:** Any active requests during the failover are terminated and must be retried.

- **Expected data loss** depends on the failover policy you use.

    - *Customer-initiated failover:* If your primary database is available, you can optionally perform a failover with no data loss. The failover process synchronizes data between the primary and secondary databases before switching roles.
    
        If your primary database isn't available, you might need to perform a *forced failover*, which will result in data loss. You can estimate the amount of data loss by monitoring the replication lag. For more information, see [Monitor Azure SQL Database with metrics and alerts](/azure/azure-sql/database/monitoring-metrics-alerts#use-metrics-to-monitor-databases-and-elastic-pools).

    - *Microsoft-initiated failover:* A Microsoft-managed failover is only triggered in exceptional situations. Microsoft-managed failovers are forced failovers, which means that some data loss is expected. You can't control the amount of data loss that you might experience.

- **Expected downtime** depends on the failover policy you use.

    - *Customer-initiated failover:* Typically there is up to 60 seconds of downtime during a failover. Ensure that your application is [handling transient faults](#transient-faults) so that it can recover from short periods of downtime.

    - *Microsoft-initiated failover:* You can specify a *grace period* that specifies how long Microsoft should wait before initiating the failover. The minimum grace period is one hour. However, it's likely to be at least several hours before Microsoft initiates failover.

- **Traffic rerouting:** During failover, Azure SQL Database updates the read-write and read-only listener endpoints to direct traffic to the new primary and secondary databases as required.

    If the new secondary (previously the primary) is not available, the read-only listener endpoint will not be able to connect until the new secondary is available.

---

### Region recovery

### [Active geo-replication](#tab/active-geo)

After the primary region recovers, you can manually perform a failback to the primary region by performing another failover.

### [Failover groups](#tab/failover-groups)

You're responsible for failing back to the primary region if you need to do so. You can manually perform a failback to the primary region by performing a customer-managed failover.

Even if Microsoft initiated the original failover, you're still responsible for failing back to the previous region, if you choose to.

---

### Testing for region failures

You can simulate a region outage by triggering a manual failover at any time. You can trigger a failover (no data loss) or a forced failover.

## Backups

Take backups of your databases to protect against a variety of risks, including loss of data. Backups can be restored to recover from accidental data loss, corruption, or other issues. Backups are separate to zone redundancy, active geo-replication, or failover groups, and they have different purposes. To learn more, see [What are redundancy, replication, and backup?](./concept-redundancy-replication-backup.md)

Azure SQL Database provides automatic backups of your databases. To learn more about the backup frequency, which can affect the amount of data loss if you need to restore from a backup, see [Automated backups in Azure SQL Database](/azure/azure-sql/database/automated-backups-overview).

### Backup storage

You can choose to store your automated backups in locally redundant or zone-redundant storage. If you use a region that's paired, you can choose to replicate your automated backups to the paired region by using geo-redundant storage. This capability enables geo-restore of your backups into the paired region. For more information, see [Automated backups in Azure SQL Database](/azure/azure-sql/database/automated-backups-overview).

If you use a nonpaired region, or if you need to replicate backups to a region other than the paired region, consider exporting the database and storing the exported file in a storage account that uses [blob object replication](/azure/storage/blobs/object-replication-overview) to replicate to a storage account in another region. For more information, see [Export a database](/azure/azure-sql/database/automated-backups-overview#export-a-database).

## Reliability during service maintenance

When Azure SQL Database performs maintenance on your databases and elastic pools, it might automatically fail over your database to use a secondary replica. Client applications might observe brief connectivity disruptions when a failover occurs, and your client applications should follow the [transient fault handling guidance](#transient-faults) to minimize the effects.

Azure SQL Database enables you to specify a maintenance window that's generally used for service upgrades and other maintenance operations. Configuring a maintenance window can help you to minimize any side effects, like automatic failovers, during your business hours. You can also receive advance notification of planned maintenance.

The gateways used for processing connections to Azure SQL Database are automatically maintained by the platform. Upgrades or maintenance operations can also cause brief connectivity disruptions that clients can retry.

To learn more, see [Maintenance window in Azure SQL Database](/azure/azure-sql/database/maintenance-window).

## Service-level agreement

The service-level agreement (SLA) for Azure SQL Database describes the expected availability of the service, and the expected recovery point and recovery time for active geo-replication. It also describes the conditions that must be met to achieve those expectations. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy a zone-redundant database or elastic pool and use a supported service tier, the uptime SLA is higher.

## Related content

- [Overview of business continuity with Azure SQL Database](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview)
- [High availability and disaster recovery checklist - Azure SQL Database](/azure/azure-sql/database/high-availability-disaster-recovery-checklist)
- [Reliability in Azure](./overview.md)
