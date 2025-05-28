---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
author: 
ms.author: 
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-storage
ms.date: 5/28/2025
ms.update-cycle: 180-days
---

# Reliability in Azure Blob Storage

Azure Blob Storage is a massively scalable object storage service for unstructured data. Reliability is a core design principle for Blob Storage, with features such as redundancy options, availability zone support, and multi-region replication to help you protect your data and maintain business continuity. You can choose from several redundancy tiers to meet your durability and availability requirements, including locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), and read-access geo-redundant storage (RA-GRS).

This article describes reliability and availability zones support in [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Production deployment recommendations

For production workloads, use ZRS, GRS, or RA-GRS redundancy options to maximize data durability and availability. LRS is not recommended for production unless your data can be easily recreated. Enable zone redundancy (ZRS) in regions that support it to protect against datacenter-level failures. For disaster recovery, use GRS or RA-GRS to replicate your data to a secondary region. Review [Azure Storage redundancy options](https://learn.microsoft.com/azure/storage/common/storage-redundancy) for detailed guidance.

## Reliability architecture overview

- **Redundancy:** Azure Blob Storage provides built-in redundancy. LRS replicates data within a single datacenter, ZRS replicates across three availability zones in a region, and GRS/RA-GRS replicate data to a secondary region for geo-disaster recovery. You do not need to configure instance counts; redundancy is managed by Azure.
- **Resource model:** You manage storage accounts, which can be configured with different redundancy options. See [Storage account overview](https://learn.microsoft.com/azure/storage/common/storage-account-overview).
- **Dependencies:** If you use Blob Storage as a backend for other services, ensure those services are also configured for high availability. See [Azure service dependencies](https://learn.microsoft.com/azure/architecture/resiliency/reliability-service-dependencies).

## Transient faults

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.

All cloud-hosted applications should follow the Azure transient fault handling guidance when communicating with any cloud-hosted APIs, databases, and other components. For more information, see [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults).

- Use the [Azure Storage client library retry policies](https://learn.microsoft.com/azure/storage/common/storage-retry-policies) to handle transient errors automatically.
- Implement exponential backoff and consider idempotency for write operations.
- Monitor for repeated transient errors, which may indicate a larger issue.

## Availability zone support

Availability zones are physically separate groups of datacenters within each Azure region. When one zone fails, services can fail over to one of the remaining zones.

For more information on availability zones in Azure, see [What are availability zones?](/azure/reliability/availability-zones-overview)

Azure Blob Storage supports both zonal and zone-redundant models. With ZRS, your data is synchronously replicated across three availability zones in a region, providing resilience against zone failures. LRS is zonal (data is stored in a single zone) and does not provide zone failure protection. Always enable zone redundancy (ZRS) if available in your region. You do not need to deploy resources into specific zones; Azure manages zone distribution for ZRS accounts.

### Region support

Zone-redundant Azure Blob Storage resources can be deployed into any region that supports availability zones. For a list of supported regions, see [Azure regions with availability zones](https://learn.microsoft.com/azure/reliability/availability-zones-service-support#azure-blob-storage).

### Requirements

ZRS is only available in regions that support availability zones. See [ZRS region availability](https://learn.microsoft.com/azure/storage/common/storage-redundancy-zrs#supported-regions). All storage account SKUs support LRS and GRS. ZRS and GZRS are available for general-purpose v2 and block blob storage accounts.

## Considerations

LRS does not protect against datacenter or zone failures. Use ZRS or GRS for higher resiliency. Not all features are available in all redundancy tiers. For example, some advanced features may not be supported with ZRS or GZRS. See [feature support by redundancy option](https://learn.microsoft.com/azure/storage/common/storage-redundancy#feature-support). During a zone outage, your data remains available with ZRS, but some operations may be temporarily restricted.

### Cost

Enabling ZRS or GRS increases storage costs compared to LRS. For details, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

To deploy a new zone-redundant storage account, see [Create a storage account with ZRS](https://learn.microsoft.com/azure/storage/common/storage-redundancy-zrs#how-to-create-a-zrs-account). You cannot convert an existing LRS account to ZRS. You must create a new ZRS account and migrate your data. For migration guidance, see [Migrate data to a new storage account](https://learn.microsoft.com/azure/storage/common/storage-account-move).

### Capacity planning and management

Over-provision storage capacity to handle increased load during failover scenarios. See [Manage capacity by over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

### Normal operations

**Traffic routing between zones:** For ZRS, Azure automatically distributes and manages data across zones. You do not need to manage traffic routing.

**Data replication between zones:** ZRS synchronously replicates data across three zones. Writes are only acknowledged after all zones confirm the write, ensuring no data loss during a zone failure. See [ZRS replication details](https://learn.microsoft.com/azure/storage/common/storage-redundancy-zrs#how-zrs-works).

### Zone-down experience

- **Detection and response:** Microsoft monitors zone health and automatically handles failover for ZRS accounts.
- **Notification:** You can monitor service health via [Azure Service Health](https://learn.microsoft.com/azure/service-health/service-health-overview) and set up alerts.
- **Active requests:** In-flight requests may fail if a zone goes down, but retries will succeed once the platform reroutes traffic.
- **Expected data loss:** With ZRS, no data loss is expected during a zone failure.
- **Expected downtime:** Minimal downtime; the platform reroutes requests to healthy zones.
- **Traffic rerouting:** Azure automatically reroutes traffic to surviving zones for ZRS accounts.

### Failback

When the affected zone recovers, Azure restores full redundancy and resumes normal operations automatically. No customer action is required. Data remains consistent throughout the process.

### Testing for zone failures

You can simulate a zone failure using [Azure Chaos Studio](https://learn.microsoft.com/azure/chaos-studio/chaos-studio-overview). Regularly test your application's response to zone failures to ensure resiliency.

## Multi-region support

Azure Blob Storage supports native multi-region redundancy through GRS and RA-GRS. With these options, your data is asynchronously replicated to a secondary region hundreds of miles away from the primary region. In the event of a regional outage, Microsoft initiates failover to the secondary region.

### Region support

You can select any supported Azure region as the secondary for GRS/RA-GRS. There are no geography or latency constraints, but failover is only available to the paired region. See [Azure region pairs](https://learn.microsoft.com/azure/best-practices-availability-paired-regions).

### Requirements

GRS and RA-GRS are available for general-purpose v2 and block blob storage accounts. All SKUs support LRS and GRS; ZRS and GZRS are available in select regions.

### Considerations

During failover, the secondary region becomes read/write, but some features may be temporarily unavailable. Data replication between regions is asynchronous, so recent writes may not be present in the secondary region at the time of failover. See [Geo-redundant storage failover](https://learn.microsoft.com/azure/storage/common/storage-redundancy-grs#read-access-geo-redundant-storage-ra-grs).

### Cost

Multi-region redundancy (GRS/RA-GRS) incurs higher costs than single-region options. See [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

To deploy a new storage account with GRS or RA-GRS, see [Create a storage account with geo-redundancy](https://learn.microsoft.com/azure/storage/common/storage-redundancy-grs#how-to-create-a-grs-account). You cannot enable GRS on an existing LRS or ZRS account; you must create a new account and migrate data.

### Multi-region capacity planning and management

Over-provision storage and bandwidth to handle failover scenarios. See [Manage capacity by over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

### Normal operations

**Traffic routing between regions:** All requests are served from the primary region unless a failover is initiated.

**Data replication between regions:** Data is asynchronously replicated from the primary to the secondary region. There may be a lag between the two.

### Region-down experience

- **Detection and response:** Microsoft monitors region health and initiates failover if necessary.
- **Notification:** You can monitor failover status in the Azure portal and via [Azure Service Health](https://learn.microsoft.com/azure/service-health/service-health-overview).
- **Active requests:** In-flight requests may fail during failover; retry logic is recommended.
- **Expected data loss:** Some recent writes may be lost due to asynchronous replication.
- **Expected downtime:** There may be a short period of unavailability during failover.
- **Traffic rerouting:** After failover, all requests are served from the secondary region.

### Failback

After the primary region is restored, Microsoft does not automatically fail back. You must manually migrate data if you want to return to the original region. See [Failback guidance](https://learn.microsoft.com/azure/storage/common/storage-account-failover).

### Testing for region failures

You can initiate a [geo-redundant storage account failover](https://learn.microsoft.com/azure/storage/common/storage-account-failover) to test your application's response to regional outages.

### Alternative multi-region approaches

If you need more control or want to use regions not supported by GRS, deploy separate storage accounts in each region and use [Azure Data Factory](https://learn.microsoft.com/azure/data-factory/introduction) or [AzCopy](https://learn.microsoft.com/azure/storage/common/storage-use-azcopy-blobs) to replicate data. For architecture patterns, see [Multi-region web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/multi-region).

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Backups and redundancy](https://learn.microsoft.com/azure/backup/backup-overview).

Azure Blob Storage does not provide traditional backup/restore features, but you can use [Azure Backup](https://learn.microsoft.com/azure/backup/backup-azure-blobs) or [soft delete](https://learn.microsoft.com/azure/storage/blobs/soft-delete-blob-overview) to protect against accidental deletion. Backups are managed by you and can be stored in different regions depending on your configuration.

## Reliability during service maintenance

Azure Blob Storage is a fully managed service. Microsoft performs maintenance operations with minimal impact to availability. No special customer action is required during planned maintenance. For more information, see [Azure maintenance documentation](https://learn.microsoft.com/azure/azure-portal/maintenance-notifications).

## Service-level agreement

The service-level agreement (SLA) for Azure Blob Storage describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [Azure Storage SLA](https://learn.microsoft.com/azure/storage/common/storage-sla).

To meet the SLA, you must use supported redundancy options and follow best practices for high availability. Review the SLA for details on requirements and exclusions.

### Related content

- [Azure Blob Storage documentation](https://learn.microsoft.com/azure/storage/blobs/)
- [Azure Storage redundancy options](https://learn.microsoft.com/azure/storage/common/storage-redundancy)
- [Availability zones overview](/azure/reliability/availability-zones-overview)
- [Azure region pairs](https://learn.microsoft.com/azure/best-practices-availability-paired-regions)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- [Azure Storage SLA](https://learn.microsoft.com/azure/storage/common/storage-sla)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
- [Azure Backup for blobs](https://learn.microsoft.com/azure/backup/backup-azure-blobs)
- [Soft delete for blobs](https://learn.microsoft.com/azure/storage/blobs/soft-delete-blob-overview)
- [Azure Service Health](https://learn.microsoft.com/azure/service-health/service-health-overview)
- [Azure Chaos Studio](https://learn.microsoft.com/azure/chaos-studio/chaos-studio-overview)
- [Multi-region web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/multi-region)
