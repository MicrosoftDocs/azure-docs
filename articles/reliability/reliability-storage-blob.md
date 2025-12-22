---
title: Reliability in Azure Blob Storage
description: Learn about resiliency in Azure Blob Storage, including resilience to transient faults, availability zone failures, and region failures.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 08/15/2025
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

[Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview) is an object storage solution for the cloud from Microsoft. It's designed to store massive amounts of unstructured data such as text, binary data, documents, media files, and application backups. As a foundational Azure storage service, Blob Storage provides multiple reliability features to ensure that your data remains available and durable during both planned and unplanned events.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Blob Storage resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also describes how you can use backups to recover from other types of problems, and highlights some key information about the Blob Storage service level agreement (SLA).

> [!NOTE]
> Blob Storage is part of the Azure Storage platform. Some of the capabilities of Blob Storage are common across many Azure Storage services. In this article, we use *Azure Storage* to refer to these features.

## Production deployment recommendations

To learn about how to deploy Blob Storage to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Blob Storage](/azure/well-architected/service-guides/azure-blob-storage) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Storage provides several redundancy options to help you protect your data against different types of failures. Each option provides a specific level of data redundancy, so you can choose the level that best matches your application's requirements.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when you use Blob Storage, implement the following recommendations:

- **Use the Azure Storage client libraries**, which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For more information about retry configuration options, see [Implement a retry policy with .NET](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your blob operations based on blob size and network conditions. Larger blobs require longer timeouts, but smaller operations can use shorter values to detect failures quickly.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Blob Storage provides robust availability zone support through ZRS configurations that automatically distribute your data across multiple availability zones within a region. Unlike locally redundant storage (LRS), ZRS guarantees that Azure synchronously replicates your blob data across multiple availability zones. ZRS ensures that your data remains accessible even if one zone experiences an outage.

Zone redundancy is enabled at the storage account level and applies to all blob containers within that account. You can't set different redundancy levels for individual containers. The redundancy configuration is applied to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring intervention from you or your application.

[!INCLUDE [Storage - Resilience to availability zone failures - Support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Requirements

[!INCLUDE [Storage - Supported regions](includes/storage/reliability-storage-availability-zone-region-support-include.md)]

- **Storage account types:** Zone redundancy is available for both Standard general-purpose v2 and Premium Block Blob storage account types. Block blobs, append blobs, and page blobs all support zone-redundant configurations, but the type of storage account that you use determines which capabilities are available. For more information, see [Supported storage account types](/azure/storage/common/storage-redundancy#supported-storage-account-types).

### Cost

[!INCLUDE [Storage - Cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For more information, see [Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

- **Create a blob storage account with zone redundancy.** To create a new storage account with ZRS, see [Create a storage account](/azure/storage/common/storage-account-create) and select **ZRS**, **geo-zone-redundant storage (GZRS)**, or **read-access geo-redundant storage (RA-GZRS)** as the redundancy option during account creation.

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Behavior when all zones are healthy

This section describes what to expect when a blob storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Behavior when all zones are healthy](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Behavior during a zone failure

This section describes what to expect when a blob storage account is configured for ZRS and there's an availability zone outage.

[!INCLUDE [Storage - Behavior during a zone failure](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting:** If an availability zone goes offline, Azure initiates networking changes like Domain Name System (DNS) repointing. These updates ensure that traffic is rerouted to the remaining healthy availability zones. The service maintains full functionality by using the surviving zones and doesn't require customer intervention.

### Zone recovery

[!INCLUDE [Storage - Zone recovery](includes/storage/reliability-storage-availability-zone-failback-include.md)]

### Test for zone failures

[!INCLUDE [Storage - Test for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Resilience to region-wide failures

[!INCLUDE [Storage - Resilience to region-wide failures](includes/storage/reliability-storage-multi-region-support-include.md)]


### Geo-redundant storage

[!INCLUDE [Storage - Resilience to region-wide failures - RA-GRS addendum](includes/storage/reliability-storage-multi-region-support-read-access-include.md)]

[!INCLUDE [Storage - Resilience to region-wide failures - failover types](includes/storage/reliability-storage-multi-region-support-failover-types-include.md)]

#### Requirements

[!INCLUDE [Storage - Supported regions](includes/storage/reliability-storage-multi-region-region-support-include.md)]

[!INCLUDE [Storage - Requirements](includes/storage/reliability-storage-multi-region-requirements-include.md)]

#### Considerations

When you implement multi-region Blob Storage, consider the following key factors:

[!INCLUDE [Storage - Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Considerations - Secondary region access](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

#### Cost

[!INCLUDE [Storage - Cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For more information, see [Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

#### Configure multi-region support

[!INCLUDE [Storage - Configure multi-region support - Create](includes/storage/reliability-storage-multi-region-configure-create-include.md)]

[!INCLUDE [Storage - Configure multi-region support - Enable/disable](includes/storage/reliability-storage-multi-region-configure-enable-disable-include.md)]

#### Behavior when all regions are healthy

[!INCLUDE [Storage - Behavior when all regions are healthy](includes/storage/reliability-storage-multi-region-normal-operations-include.md)]

#### Behavior during a region failure

[!INCLUDE [Storage - Behavior during a region failure](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

#### Region recovery

[!INCLUDE [Storage - Region recovery](includes/storage/reliability-storage-multi-region-failback-include.md)]

#### Test for region failures

[!INCLUDE [Storage - Test for region failures](includes/storage/reliability-storage-multi-region-testing-include.md)]

### Custom multi-region solutions for resiliency

[!INCLUDE [Storage - Custom multi-region solutions - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

[!INCLUDE [Storage - Custom multi-region solutions - introduction](includes/storage/reliability-storage-multi-region-alternative-introduction-include.md)]

[!INCLUDE [Storage - Custom multi-region solutions - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

**Object replication** provides an extra option for cross-region data replication that provides asynchronous copying of block blobs between storage accounts. Unlike the built-in geo-redundant storage options that use fixed paired regions, object replication allows you to replicate data between storage accounts in any Azure region, including nonpaired regions. This approach gives you full control over source and destination regions, replication policies, and the specific containers and blob prefixes to replicate.

You can configure object replication to replicate all blobs within a container or specific subsets based on blob prefixes and tags. The replication is asynchronous and occurs in the background. You can configure multiple replication policies and even chain replication across multiple storage accounts to create sophisticated multi-region topologies.

Object replication isn't compatible with all storage accounts. For example, it doesn't work with storage accounts that use hierarchical namespaces (also known as *Azure Data Lake Storage Gen2 accounts*).

For more information, see [Object replication for block blobs](/azure/storage/blobs/object-replication-overview) and [Configure object replication](/azure/storage/blobs/object-replication-configure).

## Backup and recovery

Blob Storage provides multiple data protection mechanisms that complement redundancy for comprehensive backup strategies. The service's built-in redundancy protects against infrastructure failures, and extra backup capabilities protect against accidental deletion, corruption, and malicious activities.

**Point-in-time restore (PITR)** allows you to restore block blob data to a previous state within a configured retention period of up to 365 days. Microsoft fully manages this feature. It also provides granular recovery capabilities at the container or blob level. PITR data is stored in the same region as the source account and is accessible even during regional outages if you use geo-redundant configurations.

**Blob versioning** automatically maintains previous versions of blobs when they're modified or deleted. Each version is stored as a separate object and can be accessed independently. Versions are stored in the same region as the current blob and follow the same redundancy configuration as the storage account.

**Soft delete** provides a safety net for accidentally deleted blobs and containers by retaining deleted data for a configurable period. Soft-deleted data remains in the same storage account and region, which makes it immediately available for recovery. For geo-redundant accounts, soft-deleted data is also replicated to the secondary region.

**Blob snapshots** create read-only, point-in-time copies of blobs that you can use for backup and recovery scenarios. Snapshots are stored in the same storage account and follow the same redundancy and geo-replication settings as the base blob.

For cross-region backup requirements, consider using **Azure Backup for blobs**, which provides centralized backup management and can store backup data in regions different from the source data. This service provides operational and vaulted backup options that have configurable retention policies and restore capabilities. For more information, see [Backup for blobs overview](/azure/backup/blob-backup-overview).

[!INCLUDE [Backups include ](includes/reliability-backups-include.md)] 
## Service-level agreement

[!INCLUDE [Storage - Service-level agreement](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [Blob Storage overview](../storage/blobs/storage-blobs-overview.md)
- [Azure Storage redundancy](../storage/common/storage-redundancy.md)
- [Disaster recovery and storage account failover](../storage/common/storage-disaster-recovery-guidance.md)
- [Use geo-redundancy to design highly available applications](../storage/common/geo-redundant-design.md)
- [Change how a storage account is replicated](../storage/common/redundancy-migration.md)

