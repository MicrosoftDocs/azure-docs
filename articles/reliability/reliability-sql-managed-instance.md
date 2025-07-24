---
title: Reliability in Azure SQL Managed Instance
description: Find out about reliability in Azure SQL Managed Instance, including availability zones and multi-region deployments.
author: MashaMSFT
ms.author: mathoma
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-sql-managed-instance
ms.date: 07/30/2025
zone_pivot_groups: sql-managed-instance-tiers
---

# Reliability in Azure SQL Managed Instance

This article describes reliability support in Azure SQL Managed Instance, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Reliability is a shared responsibility between you and Microsoft. You can use this guide to find out which reliability options fulfill your specific business objectives and uptime goals.

## Production deployment recommendations

For most production deployments of Azure SQL Managed Instance, consider the following recommendations:

- Follow the guidance provided in [High availability and disaster recovery checklist - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/high-availability-disaster-recovery-checklist).

::: zone pivot="business-critical"

- Enable zone redundancy.

::: zone-end

- Configure [automated backups](/azure/azure-sql/managed-instance/automated-backups-overview), and use zone-redundant or geo-redundant storage for backups.

- Plan to regularly test your backups and restore process.

## Reliability architecture overview

::: zone pivot="general-purpose"

General Purpose SQL managed instances run on a single node that's managed by [Azure Service Fabric](/azure/service-fabric/service-fabric-azure-clusters-overview). Whenever the database engine or the operating system is upgraded, or a failure is detected, Azure SQL Managed Instance works with Azure Service Fabric to move the stateless database engine process to another stateless compute node with sufficient free capacity. Database files are stored in Azure Blob Storage, which has built-in redundancy features. Data and log files are detached from the original compute node and attached to the newly initialized database engine process.

::: zone-end

::: zone pivot="business-critical"

Business Critical SQL managed instances use multiple replicas in a cluster. The cluster includes:

- A single *primary* replica that's accessible for read-write customer workloads.
- Up to three *secondary* replicas (compute and storage) that contain copies of data.

The primary replica continually and sequentially pushes changes to the secondary replicas, which ensures that data is persisted on a sufficient number of secondary replicas before committing each transaction. This process guarantees that, if the primary replica or a readable secondary replica become unavailable for any reason, a fully synchronized replica is always available for failover.

Failover between replicas is initiated by Azure SQL Managed Instance, along with [Azure Service Fabric](/azure/service-fabric/service-fabric-azure-clusters-overview). Once a secondary replica becomes the new primary replica, another secondary replica is created to ensure that the cluster has a sufficient number of replicas to maintain quorum. Once failover completes, Azure SQL connections are automatically redirected to the new primary replica (or readable secondary replica based on the connection string).

::: zone-end

### Redundancy

By default, Azure SQL Managed Instance achieves redundancy by spreading compute nodes and data throughout a single datacenter in the primary region. This approach protects your data during both expected and unexpected downtimes, such as:

- Customer initiated [management operations](/azure/azure-sql/managed-instance/management-operations-overview) that result in a brief downtime.
- Service maintenance operations.
- Small-scale network or power failures.
- Issues and datacenter outages that involve the following components:
    - *Rack* where the machines that power your service are running.
    - *Physical machine* that hosts the VM that runs the SQL database engine.
    - *Virtual machine* that runs the SQL database engine.
- Problems with the SQL database engine.
- Potential unplanned localized outages.

To learn more about how Azure SQL Managed Instance provides redundancy, see [Availability through local and zone redundancy - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/high-availability-sla-local-zone-redundancy).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

SQL Managed Instance automatically handles critical servicing tasks, such as patching, backups, Windows and SQL database engine upgrades, and unplanned events such as underlying hardware, software, or network failures. SQL Managed Instance can quickly recover even in the most critical circumstances, ensuring that your data is always available. Most users don't notice that upgrades are performed continuously.

When an instance is patched or fails over, the downtime isn't usually impactful if you [employ retry logic](/azure/azure-sql/database/develop-overview#resiliency) in your application. You can test your application's resiliency to transient faults by following the guidance in [Test application fault resiliency](/azure/azure-sql/managed-instance/high-availability-sla-local-zone-redundancy#testing-application-fault-resiliency).

## Availability zone support

> [!NOTE]
> Zone redundancy is not currently available for the Next-gen General Purpose service tier.

[!INCLUDE [AZ support description](./includes/reliability-availability-zone-description-include.md)]

When you enable a [zone-redundant](./availability-zones-overview.md#types-of-availability-zone-support) configuration, you can ensure that your SQL managed instance is resilient to a large set of failures, including catastrophic datacenter outages, without any changes to the application logic.

::: zone pivot="general-purpose"

Azure SQL Managed Instance achieves zone redundancy by placing stateless compute nodes in different availability zones, and relies on stateful zone-redundant storage (ZRS) that's attached to whichever node currently contains the active SQL database engine process. In the event of an outage, the SQL database engine process becomes active on one of the stateless compute nodes, which then accesses the data in the stateful storage.

::: zone-end

::: zone pivot="business-critical"

Azure SQL Managed Instance achieves zone redundancy by placing replicas of your SQL managed instance across multiple availability zones. To eliminate a single point of failure, the control ring is also duplicated across multiple zones. The control plane traffic is routed to a load balancer that is also deployed across availability zones. Traffic routing from the control plane to the load balancer is controlled by Azure Traffic Manager.

::: zone-end

### Requirements

To enable zone redundancy, your SQL managed instance **Backup storage redundancy** must use _Zone-redundant_ or _Geo-zone-redundant_ storage.

### Regions supported

Zone redundancy for Azure SQL Managed Instance is supported in select regions. To learn more, see [Supported regions](/azure/azure-sql/managed-instance/region-availability#zone-redundancy).

### Considerations

::: zone pivot="business-critical"

**Latency:** Because zone-redundant instances have replicas in different datacenters with some distance between them, the increased network latency might increase the transaction commit time, and thus impact the performance of some OLTP workloads. Most applications aren't sensitive to this extra latency.

::: zone-end

::: zone pivot="general-purpose"

**Downtime:** A heavy workload might experience some performance degradation during the transition from one compute node to the other since the new database engine process starts with a cold cache.

::: zone-end

### Cost

When you enable zone redundancy, there's an additional cost for your SQL managed instance as well as for zone-redundant backups. For more information, see [Pricing - Azure SQL Managed Instance](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/).

::: zone pivot="business-critical"

You can save money by committing to use compute resources at a discounted rate for a period of time, which includes zone-redundant instances in the Business Critical service tier. For more information, see [Reservations for Azure SQL Managed Instance](/azure/azure-sql/database/reservations-discount-overview#reservations-for-zone-redundant-resources). 

::: zone-end

### Configure availability zone support

This section explains how to configure availability zone support for your SQL managed instances.

- **New and existing instances:** To learn how to configure zone redundancy on new and existing instances, see [Configure zone redundancy - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-zone-redundancy-configure).

  All scaling operations for Azure SQL Managed Instance, including enabling zone redundancy, are online operations and require minimal to no downtime. For more details, see [Duration of management operations](/azure/azure-sql/managed-instance/management-operations-duration).

- **Disable zone redundancy:** You can disable zone redundancy following the same steps to enable zone redundancy. This process is an online operation similar to a regular service tier objective upgrade. At the end of the process, the instance is migrated from a zone-redundant ring to a single-zone ring. 

### Normal operations

The following section describes what to expect when your SQL managed instance is configured to be zone redundant and all availability zones are operational:

::: zone pivot="general-purpose"

- **Traffic routing between zones:** During normal operations, requests are routed to the node that runs your SQL Managed Instance compute layer.

- **Data replication between zones:** Database files are stored in Azure Storage by using zone-redundant storage, which is attached to whichever node currently contains the active SQL Database Engine process.

  All write operations to ZRS are replicated synchronously across all availability zones within the region. When you upload or modify data, the operation isn't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it may result in slightly higher write latency compared to locally redundant storage.

::: zone-end

::: zone pivot="business-critical"

- **Traffic routing between zones:** During normal operations, requests are routed to the primary replica of your SQL managed instance.

- **Data replication between zones:** The primary replica continually and sequentially pushes changes to the secondary replicas in different availability zones, which ensures that data is persisted on a sufficient number of secondary replicas before committing each transaction. Those replicas are located in different availability zones. This process guarantees that, if the primary replica or a readable secondary replica become unavailable for any reason, a fully synchronized replica is always available for failover.

  <!-- Can we say anything about how enabling zone redundancy affects write latency? -->

::: zone-end

### Zone-down experience

The following section describes what to expect when your SQL managed instance is configured to be zone redundant and one or more availability zones are unavailable:

- **Detection and response:** Azure SQL Managed Instance is responsible for detecting and responding to a failure in an availability zone. You don't need to do anything to initiate a zone failover.

- **Notification:** Zone failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of zone-level issues.

- **Active requests:** When an availability zone is unavailable, any requests that are being processed in the faulty availability zone are terminated and must be retried. To make your applications resilient to these types of problems, see the [transient fault handling guidance](#transient-faults).

::: zone pivot="general-purpose"

- **Traffic rerouting:** Azure SQL Managed Instance works with Azure Service Fabric to move the database engine to a suitable stateless compute node that's in a different availability zone and has sufficient free capacity. After failover completes, new connections are automatically redirected to the new primary compute node.

::: zone-end

::: zone pivot="business-critical"

- **Traffic rerouting:** Azure SQL Managed Instance works with Azure Service Fabric to select a suitable replica in another availability zone to become the primary replica. Once a secondary replica becomes the new primary replica, another secondary replica is created to ensure the cluster has a sufficient number of replicas to maintain quorum. After failover completes, new connections are automatically redirected to the new primary replica (or readable secondary replica based on the connection string).

::: zone-end

::: zone pivot="general-purpose"

- **Expected downtime:** There might be a small amount of downtime during an availability zone failover. The downtime is typically less than 2 minutes.

::: zone-end

::: zone pivot="business-critical"

- **Expected downtime:** There might be a small amount of downtime during an availability zone failover. The downtime is typically less than 20 seconds, which your application should tolerate if it's following the [transient fault handling guidance](#transient-faults).

::: zone-end

- **Expected data loss:** There's no data loss expected for committed transactions during an availability zone failover. Inflight transactions need to be retried.

### Failback

When the availability zone recovers, Azure SQL Managed Instance automatically initiates failback by working with Azure Service Fabric to:

- Create replicas in the recovered availability zone.
- Remove any temporary replicas created in the other availability zones.
- Route traffic between your instances as normal.

### Testing for zone failures

Azure SQL Managed Instance platform manages traffic routing, failover, and failback for zone-redundant instances. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes. However, you can validate your application's handling of failures by following the process described in [Test application fault resiliency](/azure/azure-sql/managed-instance/high-availability-sla-local-zone-redundancy#testing-application-fault-resiliency).

## Multi-region support

An individual Azure SQL Managed Instance is deployed within a single region. However, you can deploy a secondary SQL managed instance in a separate Azure region and configure a *failover group*. Failover groups automatically geo-replicate your data and can automatically or manually fail over in the event of a regional failure, based on the failover policy.

This section summarizes key information about failover groups, but it's important to review [Failover groups overview & best practices - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-sql-mi) to learn more about how they work and how to configure them.

### Failover policies

When you create a failover group, you select the [failover policy](/azure/azure-sql/managed-instance/failover-group-sql-mi#failover-policy), which specifies who is responsible for detecting an outage and performing a failover. You can configure customer-managed failover (recommended) or Microsoft-managed failover.

> [!IMPORTANT]
> Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Do not rely on Microsoft-managed failover**, which might only be used in extreme circumstances. A Microsoft-managed failover would likely be initiated for an entire region. It can't be initiated for individual failover groups, SQL managed instances, subscriptions, or customers. Failover might occur at different times for different Azure services. We recommend you use customer-managed failover.

### Region support

You can select any Azure region for the SQL managed instances within the failover group. Due to the high latency of wide area networks, geo-replication uses an asynchronous replication mechanism. To reduce network delays, select regions with low latency connections. To learn more about latency between Azure regions, see [Azure network round-trip latency statistics](/azure/networking/azure-network-latency).

### Cost

When you create multiple SQL managed instances in different regions, you're billed for each SQL managed instance. For more information, see [service pricing information](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/single/).

### Configure multi-region support

To learn how to configure a failover group, see [Configure a failover group for Azure SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-configure-sql-mi).

### Capacity planning and management

During a failover, traffic is redirected to a secondary SQL managed instance. It's important that your secondary SQL managed instance is ready to receive traffic. Create a secondary SQL managed instance with the same service tier, hardware generation, and compute size as the primary instance.

When scaling SQL managed instances in a failover group, follow the guidance in [Scale instances](/azure/azure-sql/managed-instance/failover-group-sql-mi#scale-instances).

### Normal operations

This section describes what to expect when SQL managed instances are configured to use multi-region failover groups and all regions are operational.

- **Traffic routing between regions:** During normal operations, read-write requests go to the single primary instance in the primary region.

  Failover groups also provide a separate read-only listener endpoint. During normal operations, this endpoint connects to the secondary instance to route read-only traffic specified in the connection string.

  To learn more about how failover groups send traffic to each instance, and configuration you can apply to override the default behavior, see [Failover groups overview & best practices - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-sql-mi).

- **Data replication between regions:** By default, data is replicated asynchronously from the primary instance to the secondary SQL managed instance. Because geo-replication is asynchronous, it's possible to have data loss when a failover occurs.

  You can monitor the replication lag to understand the potential data loss during a failover. For more information, see [Disaster recovery checklist](/azure/azure-sql/managed-instance/high-availability-disaster-recovery-checklist).

  If you need to eliminate data loss from asynchronous replication during failovers, you can configure your application to block the calling thread until the last committed transaction has been transmitted and hardened in the transaction log of the secondary database. This approach requires custom development, and it reduces the performance of your application. To learn more, see [Prevent loss of critical data](/azure/azure-sql/managed-instance/failover-group-sql-mi#prevent-loss-of-critical-data).

### Region-down experience

This section describes what to expect when SQL managed instances are configured to use multi-region failover groups and there's an outage in the primary region.

- **Detection and response.** Responsibility for detection and response depends on the failover policy your failover group uses.
  
  - *Customer-managed failover policy:* You're responsible for detecting the failure in a region and triggering a failover to the secondary instance in the failover group.
  
  - *Microsoft-managed failover policy:* The failover group detects a failure in a region and can automatically fail over to the secondary instance in the failover group. However, using a customer managed failover policy is recommended for production workloads so you have control over when the failover occurs.

- **Notification.** Region failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of region-level issues.

- **Active requests.** When a failover group failover occurs, any requests that are being processed are terminated and must be retried. To make your applications resilient to these types of problems, see [transient fault handling guidance](#transient-faults).

- **Expected data loss.** The amount of data loss depends on how you configure your application. For more information, see [Failover groups overview & best practices - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-sql-mi).

- **Expected downtime.** There might be a small amount of downtime during a failover group failover. The downtime is typically less than 60 seconds.

- **Traffic rerouting.** After the failover group completes the failover process, read-write traffic is routed to the new primary instance automatically. If your applications use the failover group's endpoints in their connection strings, they don't need to modify their connection strings after failover.

### Failback

Failover groups don't automatically fail back to the primary region when it's restored, and so it's your responsibility to initiate a failback.

### Testing for region failures

You can test the failover of a failover group by following the steps described in [Test failover](/azure/azure-sql/managed-instance/failover-group-configure-sql-mi#test-failover).

## Backups

Take backups of your databases to protect against a variety of risks, including loss of data. Backups can be restored to recover from accidental data loss, corruption, or other issues. Azure SQL Managed Instance supports automated backups of your databases as well as user-initiated copy-only backups.

Backups aren't same thing as geo-replication for the purpose of redundancy, and they have different purposes. Geo-replication for the purpose of redundancy is different to [Transactional replication](/azure/azure-sql/managed-instance/replication-transactional-overview). 

When you configure automated backups for your SQL managed instance, you can specify how backups should be replicated:

- **Zone redundancy:** If your primary region includes [availability zones](./availability-zones-overview.md), your automated backups can be stored in zone-redundant storage.

- **Geo-redundancy:** If your primary region has a [paired region](./regions-paired.md), you can choose to replicate your automated backups to the paired region by using geo-redundant storage. This capability enables geo-restore of your backups into the paired region.

  In [regions with availability zones and no region pair](./regions-paired.md#nonpaired-regions), you can build a solution to replicate your backups to another region. Consider using user-initiated [copy-only backups](/sql/relational-databases/backup-restore/copy-only-backups-sql-server) and storing them in a storage account that uses [blob object replication](/azure/storage/blobs/object-replication-overview) to replicate to a storage account in another region.

For more information about Azure SQL Managed Instance backup redundancy, see [Backup storage redundancy](/azure/azure-sql/managed-instance/automated-backups-overview#backup-storage-redundancy).

## Reliability during service maintenance

When Azure SQL Managed Instance performs maintenance on your instance, the SQL managed instance remains fully available but can be subject to short reconfigurations. Client applications might observe brief connectivity disruptions when a maintenance event occurs. Your client applications should follow the [transient fault handling guidance](#transient-faults) to minimize the effects.

Azure SQL Managed Instance enables you to specify a maintenance window that's generally used for service upgrades and other maintenance operations. Configuring a maintenance window can help you to minimize any side effects, like automatic failovers, during your business hours. You can also receive advance notification of planned maintenance.

To learn more, see [Maintenance window in Azure SQL Managed Instance](/azure/azure-sql/managed-instance/maintenance-window).

## Service-level agreement

The service-level agreement (SLA) for Azure SQL Managed Instance describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation, including the networking configuration you must use. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Overview of business continuity with Azure SQL Managed Instance](/azure/azure-sql/managed-instance/business-continuity-high-availability-disaster-recover-hadr-overview)
- [High availability and disaster recovery checklist - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/high-availability-disaster-recovery-checklist)
- [Reliability in Azure](./overview.md)
