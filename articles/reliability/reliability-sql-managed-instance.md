---
title: Reliability in Azure SQL Managed Instance
description: Find out about reliability in Azure SQL Managed Instance, including availability zones and multi-region deployments.
author: MashaMSFT
ms.author: mathoma
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-sql-managed-instance
ms.date: 09/03/2025
zone_pivot_groups: sql-managed-instance-tiers
#Customer intent: As an engineer responsible for business continuity, I want to understand who needs to understand the details about how Azure SQL Managed Instance works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure SQL Managed Instance

This article describes reliability support in Azure SQL Managed Instance, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

SQL Managed Instance is a fully managed platform as a service (PaaS) database engine. It handles most database management functions such as upgrading, patching, backups, and monitoring without user involvement. SQL Managed Instance is a scalable cloud database service that runs on the latest stable version of the SQL Server database engine and a patched operating system with built-in high availability. It provides almost 100% feature compatibility with SQL Server.

## Production deployment recommendations

For most production deployments of SQL Managed Instance, consider the following recommendations:

- Follow the guidance provided in [High availability and disaster recovery (DR) checklist](/azure/azure-sql/managed-instance/high-availability-disaster-recovery-checklist).

- Enable zone redundancy.

- Configure [automated backups](/azure/azure-sql/managed-instance/automated-backups-overview), and use zone-redundant storage (ZRS) or geo-redundant storage (GRS) for backups.

- Plan to regularly test your backups and restore process.

## Reliability architecture overview

::: zone pivot="general-purpose"

General Purpose SQL managed instances run on a single node that [Azure Service Fabric](/azure/service-fabric/service-fabric-azure-clusters-overview) manages. Whenever the database engine or the operating system is upgraded, or a failure is detected, SQL Managed Instance works with Service Fabric to move the stateless database engine process to another stateless compute node that has sufficient free capacity. Database files are stored in Azure Blob Storage, which has built-in redundancy features. Data and log files are detached from the original compute node and attached to the newly initialized database engine process.

::: zone-end

::: zone pivot="business-critical"

Business Critical SQL managed instances use multiple replicas in a cluster. The cluster includes two types of replicas:

- A single *primary replica* that can be accessed for read-write customer workloads

- Up to five *secondary replicas* (compute and storage) that contain copies of data

The primary replica continually and sequentially pushes changes to the secondary replicas, which ensures that data is persisted on a sufficient number of secondary replicas before committing each transaction. This process guarantees that if the primary replica or a readable secondary replica become unavailable, a fully synchronized replica is always available for failover.

SQL Managed Instance and [Service Fabric](/azure/service-fabric/service-fabric-azure-clusters-overview) initiate failover between replicas. After a secondary replica becomes the new primary replica, another secondary replica is created to ensure that the cluster has a sufficient number of replicas to maintain quorum. After failover completes, Azure SQL connections are automatically redirected to the new primary replica, or the readable secondary replica, based on the connection string.

::: zone-end

### Redundancy

By default, SQL Managed Instance achieves redundancy by spreading compute nodes and data throughout a single datacenter in the primary region. This approach protects your data during the following expected and unexpected downtimes:

- Customer-initiated [management operations](/azure/azure-sql/managed-instance/management-operations-overview) that result in a brief downtime

- Service maintenance operations

- Small-scale network or power failures

- Problems and datacenter outages that involve the following components:

    - The *rack* where the machines that power your service are running

    - The *physical machine* that hosts the virtual machine (VM) running the SQL Database Engine.

    - The *VM* that runs the SQL Database Engine

- Problems with the SQL Database Engine

- Potential unplanned localized outages

For more information about how SQL Managed Instance provides redundancy, see [Availability through local and zone redundancy](/azure/azure-sql/managed-instance/high-availability-sla-local-zone-redundancy).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

SQL Managed Instance automatically handles critical servicing tasks, such as patching, backups, and Windows and SQL Database Engine upgrades. It also handles unplanned events such as underlying hardware, software, or network failures. SQL Managed Instance can quickly recover even in the most critical circumstances, which ensures that your data is always available. Most users don't notice that upgrades are performed continuously.

When an instance is patched or fails over, the downtime has minimal effect if you [employ retry logic](/azure/azure-sql/database/develop-overview#resiliency) in your application. You can [test your application's resiliency to transient faults](/azure/azure-sql/managed-instance/high-availability-sla-local-zone-redundancy#testing-application-fault-resiliency).

## Availability zone support

::: zone pivot="general-purpose"

> [!NOTE]
> Zone redundancy isn't currently available for the Next-gen General Purpose service tier.

::: zone-end

[!INCLUDE [AZ support description](./includes/reliability-availability-zone-description-include.md)]

When you enable a [zone-redundant](./availability-zones-overview.md#types-of-availability-zone-support) configuration, you can ensure that your SQL managed instance is resilient to a large set of failures, including catastrophic datacenter outages, without any changes to the application logic.

::: zone pivot="general-purpose"

SQL Managed Instance achieves zone redundancy by placing stateless compute nodes in different availability zones. It relies on stateful ZRS that's attached to whichever node currently contains the active SQL Database Engine process. If an outage occurs, the SQL Database Engine process becomes active on one of the stateless compute nodes, which then accesses the data in the stateful storage.

::: zone-end

::: zone pivot="business-critical"

SQL Managed Instance achieves zone redundancy by placing replicas of your SQL managed instance across multiple availability zones. To eliminate a single point of failure, the control ring is also duplicated across multiple zones. The control plane traffic is routed to a load balancer that's also deployed across availability zones. Azure Traffic Manager controls traffic routing from the control plane to the load balancer.

::: zone-end

### Requirements

To enable zone redundancy for your SQL managed instance, set the **Backup storage redundancy** option to *ZRS* or *Geo-zone-redundant storage* (GZRS).

### Region support

Zone redundancy for SQL Managed Instance is supported in select regions. For more information, see [Supported regions](/azure/azure-sql/managed-instance/region-availability#zone-redundancy).

### Cost

When you enable zone redundancy, there's an extra cost for your SQL managed instance and for zone-redundant backups. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/).

::: zone pivot="business-critical"

You can save money by committing to use compute resources at a discounted rate for a period of time, which includes zone-redundant instances in the Business Critical service tier. For more information, see [Reservations for SQL Managed Instance](/azure/azure-sql/database/reservations-discount-overview#reservations-for-zone-redundant-resources). 

::: zone-end

### Configure availability zone support

This section explains how to configure availability zone support for your SQL managed instances:

- **Enable zone redundancy:** To learn how to configure zone redundancy on new and existing instances, see [Configure zone redundancy](/azure/azure-sql/managed-instance/instance-zone-redundancy-configure).

  All scaling operations for SQL Managed Instance, including enabling zone redundancy, are online operations and require minimal to no downtime. For more information, see [Duration of management operations](/azure/azure-sql/managed-instance/management-operations-duration).

- **Disable zone redundancy:** You can disable zone redundancy following the same steps to enable zone redundancy. This process is an online operation similar to a regular service tier objective upgrade. At the end of the process, the instance is migrated from zone-redundant infrastructure to single-zone infrastructure.

### Normal operations

This section describes what to expect when your SQL managed instance is configured to be zone redundant and all availability zones are operational:

::: zone pivot="general-purpose"

- **Traffic routing between zones:** During normal operations, requests are routed to the node that runs your SQL Managed Instance compute layer.

- **Data replication between zones:** Database files are stored in Azure Storage by using ZRS, which is attached to whichever node currently contains the active SQL Database Engine process.

  Write operations are synchronous and aren't considered complete until the data is successfully replicated across all availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it might result in slightly higher write latency compared to locally redundant storage.

::: zone-end

::: zone pivot="business-critical"

- **Traffic routing between zones:** During normal operations, requests are routed to the primary replica of your SQL managed instance.

- **Data replication between zones:** The primary replica continually and sequentially pushes changes to the secondary replicas in different availability zones. This process ensures that data is persisted on a sufficient number of secondary replicas before committing each transaction. Those replicas are located in different availability zones. This process guarantees that, if the primary replica or a readable secondary replica become unavailable for any reason, a fully synchronized replica is always available for failover.

  Because zone-redundant instances have replicas in different datacenters with some distance between them, the increased network latency might increase the transaction commit time. This increase can affect the performance of some Online Transaction Processing (OLTP) workloads. Most applications aren't sensitive to this extra latency.

::: zone-end

### Zone-down experience

This section describes what to expect when your SQL managed instance is configured to be zone redundant and one or more availability zones are unavailable:

- **Detection and response:** SQL Managed Instance is responsible for detecting and responding to a failure in an availability zone. You don't need to do anything to initiate a zone failover.

- **Notification:** Zone failure events can be monitored through [Azure Service Health](/azure/service-health/overview) and [Azure Resource Health](/azure/service-health/resource-health-overview). Set up alerts on these services to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and [Create and configure Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide).

- **Active requests:** When an availability zone is unavailable, any requests that are being processed in the faulty availability zone are terminated and must be retried. To make your applications resilient to these types of problems, see [transient fault handling guidance](#transient-faults).

::: zone pivot="general-purpose"

- **Traffic rerouting:** SQL Managed Instance works with Service Fabric to move the database engine to a suitable stateless compute node that's in a different availability zone and has sufficient free capacity. After failover completes, new connections are automatically redirected to the new primary compute node.

  A heavy workload might experience some performance degradation during the transition from one compute node to the other compute node because the new database engine process starts with a cold cache.

::: zone-end

::: zone pivot="business-critical"

- **Traffic rerouting:** SQL Managed Instance works with Service Fabric to select a suitable replica in another availability zone to become the primary replica. After a secondary replica becomes the new primary replica, another secondary replica is created to ensure that the cluster has a sufficient number of replicas to maintain quorum. After failover completes, new connections are automatically redirected to the new primary replica, or the readable secondary replica, based on the connection string.

::: zone-end

- **Expected downtime:** There might be a small amount of downtime during an availability zone failover. The downtime is typically less than 30 seconds, which your application should tolerate if it follows the [transient fault handling guidance](#transient-faults).

- **Expected data loss:** There's no data loss expected for committed transactions during an availability zone failover. In-progress transactions need to be retried.

### Zone recovery

When the availability zone recovers, SQL Managed Instance works with Service Fabric to restore operations in the recovered zone. No customer intervention is required.

### Testing for zone failures

The SQL Managed Instance platform manages traffic routing, failover, and failback for zone-redundant instances. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes. However, you can [validate your application's handling of failures](/azure/azure-sql/managed-instance/high-availability-sla-local-zone-redundancy#testing-application-fault-resiliency).

## Multi-region support

An individual SQL Managed Instance is deployed within a single region. However, you can deploy a secondary SQL managed instance in a separate Azure region and configure a *failover group*. Failover groups automatically geo-replicate your data and can automatically or manually fail over if a regional failure occurs, based on the failover policy.

This section summarizes key information about failover groups, but it's important to review [Failover groups overview and best practices](/azure/azure-sql/managed-instance/failover-group-sql-mi) to learn more about how they work and how to configure them.

### Failover policies

When you create a failover group, you select the [failover policy](/azure/azure-sql/managed-instance/failover-group-sql-mi#failover-policy), which specifies who is responsible for detecting an outage and performing a failover. You can configure two types of failover policies:

- **Customer-managed failover (recommended):** When you use a customer-managed failover policy, you can decide whether to perform a *failover*, which doesn't incur data loss, or a *forced failover*, which might incur data loss. Forced failover is used as a recovery method during outages when the primary instance can't be accessed.

- **Microsoft-managed failover:** Microsoft-managed failover is only used in exceptional situations to trigger a forced failover.

> [!IMPORTANT]
> Use customer-managed failover options to develop, test, and implement your DR plans. **Don't rely on Microsoft-managed failover**, which might only be used in extreme circumstances. A Microsoft-managed failover is likely initiated for an entire region. It can't be initiated for individual failover groups, SQL managed instances, subscriptions, or customers. Failover might occur at different times for different Azure services. We recommend that you use customer-managed failover.

### Region support

You can select any Azure region for the SQL managed instances within the failover group. Because of the high latency of wide area networks, geo-replication uses an asynchronous replication mechanism. To reduce network delays, select regions that have low latency connections. For more information about latency between Azure regions, see [Azure network round-trip latency statistics](/azure/networking/azure-network-latency).

### Cost

When you create multiple SQL managed instances in different regions, you're billed for each SQL managed instance.

However, if your secondary instance doesn't have any read workloads or applications connected to it, you can save on licensing costs by designating the replica as a standby instance. For more information, see [Configure a license-free standby replica for SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-standby-replica-how-to-configure).

For more information about SQL Managed Instance pricing, see [Service pricing information](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/single/).

### Configure multi-region support

To learn how to configure a failover group, see [Configure a failover group for SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-configure-sql-mi).

### Capacity planning and management

During a failover, traffic is redirected to a secondary SQL managed instance. It's important that your secondary SQL managed instance is ready to receive traffic. Create a secondary SQL managed instance with the same service tier, hardware generation, and compute size as the primary instance.

For more information about scaling SQL managed instances in a failover group, see [Scale instances](/azure/azure-sql/managed-instance/failover-group-sql-mi#scale-instances).

### Normal operations

This section describes what to expect when SQL managed instances are configured to use multi-region failover groups and all regions are operational:

- **Traffic routing between regions:** During normal operations, read-write requests go to the single primary instance in the primary region.

  Failover groups also provide a separate read-only listener endpoint. During normal operations, this endpoint connects to the secondary instance to route read-only traffic specified in the connection string.

  For more information about how failover groups send traffic to each instance and how you can direct traffic to a read-only listener endpoint, see [Failover groups overview and best practices](/azure/azure-sql/managed-instance/failover-group-sql-mi).

- **Data replication between regions:** By default, data is replicated asynchronously from the primary instance to the secondary SQL managed instance.

  Because geo-replication is asynchronous, if you perform a forced failover, it's possible to experience data loss. You can monitor the replication lag to understand the potential data loss during a forced failover. For more information, see [DR checklist](/azure/azure-sql/managed-instance/high-availability-disaster-recovery-checklist).

  If you need to eliminate data loss from asynchronous replication during failovers, configure your application to block the calling thread until it confirms that the last committed transaction has been transmitted and hardened in the transaction log of the secondary database. This approach requires custom development and it degrades the performance of your application. For more information, see [Prevent loss of critical data](/azure/azure-sql/managed-instance/failover-group-sql-mi#prevent-loss-of-critical-data).

### Region-down experience

This section describes what to expect when SQL managed instances are configured to use multi-region failover groups and there's an outage in the primary region:

- **Detection and response:** Responsibility for detection and response depends on the failover policy that your failover group uses.
  
  - *Customer-managed failover policy:* You're responsible for detecting the failure in a region and triggering a failover or forced failover to the secondary instance in the failover group.

    If you perform a failover, SQL Managed Instance waits for data to synchronize to the secondary instance before performing the failover procedure.

    If you perform a forced failover, SQL Managed Instance immediately switches the secondary instance to the primary role without waiting for recent changes to propagate from the primary. This type of failover can incur data loss.
  
  - *Microsoft-managed failover policy:* Microsoft-managed failovers are performed under exceptional circumstances. When Microsoft triggers a failover, the failover group automatically performs a forced failover to the secondary instance in the failover group. However, we recommend using a customer-managed failover policy for production workloads so that you can control when the failover occurs.

- **Notification:** Region failure events can be monitored through Service Health and Resource Health. Set up alerts on these services to receive notifications of region-level problems.

- **Active requests:** When a failover occurs, any requests that are being processed are terminated and must be retried. To make your applications resilient to these types of problems, see [Transient fault handling](#transient-faults).

- **Expected data loss:** The amount of data loss depends on how you configure your application. For more information, see [Failover groups overview and best practices](/azure/azure-sql/managed-instance/failover-group-sql-mi).

- **Expected downtime:** There might be a small amount of downtime during a failover group failover. The downtime is typically less than 60 seconds.

- **Traffic rerouting:** After the failover group completes the failover process, read-write traffic is routed to the new primary instance automatically. If your applications use the failover group's endpoints in their connection strings, they don't need to modify their connection strings after failover.

### Failback

Failover groups don't automatically fail back to the primary region when it's restored, and so it's your responsibility to initiate a failback.

### Testing for region failures

You can [test the failover of a failover group](/azure/azure-sql/managed-instance/failover-group-configure-sql-mi#test-failover).

Testing a failover group is only one part of performing a DR drill. For more information, see [Perform DR drills](/azure/azure-sql/managed-instance/disaster-recovery-drills).

## Backups

Take backups of your databases to protect against various risks, including loss of data. Backups can be restored to recover from accidental data loss, corruption, or other problems. Backups aren't the same thing as geo-replication, and they have different purposes and mitigate different risks.

SQL Managed Instance automatically takes full, differential, and transaction log backups of your databases. For more information about the types of backups, their frequency, restore capabilities, storage costs, and backup encryption, see [Automated backups in SQL Managed Instance](/azure/azure-sql/managed-instance/automated-backups-overview). 

SQL Managed Instance provides built-in automated backups and also supports user-initiated copy-only backups for user databases. For more information, see [Copy-only backups](/sql/relational-databases/backup-restore/copy-only-backups-sql-server).

### Backup replication

When you configure automated backups for your SQL managed instance, you can specify how backups should be replicated. Backups that are configured to be stored on ZRS have a higher level of resiliency. We recommend that you configure your backups to use one of the following storage types:

- ZRS for resiliency within the region, if the region has availability zones

- GZRS to improve the resiliency of your backups across regions if the region has availability zones and is [paired with another region](./regions-paired.md)

- GRS if your region doesn't support availability zones but has a paired region

For more information about different storage types and their capabilities, see [Backup storage redundancy](/azure/azure-sql/managed-instance/automated-backups-overview#backup-storage-redundancy).

### Geo-restore

The geo-restore capability is a basic DR solution that allows you to restore backup copies to a different Azure region. Geo-backup typically requires a significant amount of downtime and data loss. To achieve higher levels of recoverability if a regional disruption occurs, you should [configure failover groups](#multi-region-support).

If you use geo-restore, you need to consider how to make your backups available in your secondary region:

- If your primary region is paired, use GZRS or GRS backup storage to support geo-restore to the paired region.

- If your [primary region isn't paired](./regions-paired.md#nonpaired-regions), you can build a custom solution to replicate your backups to another region. Consider using user-initiated [copy-only backups](/sql/relational-databases/backup-restore/copy-only-backups-sql-server) and storing them in a storage account that uses [blob object replication](/azure/storage/blobs/object-replication-overview) to replicate to a storage account in another region.

## Reliability during service maintenance

When SQL Managed Instance performs maintenance on your instance, the SQL managed instance remains fully available but can be subject to short reconfigurations. Client applications might observe brief connectivity disruptions when a maintenance event occurs. Your client applications should follow the [transient fault handling guidance](#transient-faults) to minimize the effects.

SQL Managed Instance enables you to specify a maintenance window that's generally used for service upgrades and other maintenance operations. Configuring a maintenance window can help you minimize any side effects, like automatic failovers, during your business hours. You can also receive advance notification of planned maintenance.

For more information, see [Maintenance window in SQL Managed Instance](/azure/azure-sql/managed-instance/maintenance-window).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

For SQL Managed Instance, the availability SLA only applies when your Azure virtual network is correctly configured so that it doesn't impede management traffic. This configuration includes subnet size, network security groups (NSGs), user-defined routes (UDRs), DNS configuration, and other resources that affect the management and use of network resources. For more information about the required networking configuration for SQL Managed Instance, see [Network requirements](/azure/azure-sql/managed-instance/connectivity-architecture-overview#network-requirements).

## Related content

- [Overview of business continuity with SQL Managed Instance](/azure/azure-sql/managed-instance/business-continuity-high-availability-disaster-recover-hadr-overview)
- [High availability and disaster recovery checklist](/azure/azure-sql/managed-instance/high-availability-disaster-recovery-checklist)
- [Reliability in Azure](./overview.md)

