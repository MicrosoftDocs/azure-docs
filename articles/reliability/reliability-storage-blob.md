---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 07/30/2025
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud, designed to store massive amounts of unstructured data such as text, binary data, documents, media files, and application backups. As a foundational Azure storage service, Blob Storage provides multiple reliability features to ensure your data remains available and durable in the face of both planned and unplanned events.

Azure Blob Storage supports built-in redundancy mechanisms that store multiple copies of your data across different fault domains. It provides comprehensive redundancy options including availability zone deployment with zone-redundant storage (ZRS), multi-region protection through geo-redundant configurations, and sophisticated failover capabilities.

This article describes reliability support in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview), and covers both regional resiliency with availability zones and cross-region resiliency through geo-redundant storage.

> [!NOTE]
> Azure Blob Storage is part of the Azure Storage platform. Some of the capabilities of Blob Storage are common across many Azure Storage services. In this document, we use "Azure Storage" to indicate these common capabilities.

## Production deployment recommendations

To learn about how to deploy Azure Blob Storage to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Blob Storage](/azure/well-architected/service-guides/azure-blob-storage) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Storage offers several redundancy options to help you protect your data against different types of failures. Each option provides a specific level of data redundancy, so you can choose the one that best matches your application's requirements.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Blob Storage, implement the following recommendations:

- **Use the Azure Storage client libraries**, which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For detailed retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your blob operations based on blob size and network conditions. Larger blobs require longer timeouts, while smaller operations can use shorter values to detect failures quickly.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Blob Storage provides robust availability zone support through zone-redundant storage (ZRS) configurations that automatically distribute your data across multiple availability zones within a region. Unlike LRS, ZRS guarantees that Azure synchronously replicates your blob data across multiple availability zones. ZRS ensures that your data remains accessible even if one zone experiences an outage.

Zone redundancy is enabled at the storage account level and applies to all blob containers within that account. You cannot configure individual containers for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from you or your application.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

[!INCLUDE [Storage - Availability zone region support](includes/storage/reliability-storage-availability-zone-region-support-include.md)]

### Requirements

Zone redundancy is available for both Standard general-purpose v2 and Premium Block Blob storage account types. All blob types (block blobs, append blobs, and page blobs) support zone-redundant configurations, but the type of storage account you use determines which capabilities are available. For more information, see [Supported storage account types](/azure/storage/common/storage-redundancy#supported-storage-account-types).

### Cost

[!INCLUDE [Storage - Availability zone cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

- **Create a blob storage account with zone redundancy:** To create a new storage account with zone-redundant storage, see [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, geo-zone-redundant storage (GZRS) or read-access geo-redundant storage (RA-GZRS) as the redundancy option during account creation.

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Normal operations

This section describes what to expect when a blob storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Zone-down experience

This section describes what to expect when a blob storage account is configured for ZRS and there's an availability zone outage.

[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting.** If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing, so that requests are directed to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required.

### Zone recovery

[!INCLUDE [Storage - Zone failback](includes/storage/reliability-storage-availability-zone-failback-include.md)]

### Testing for zone failures

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Multi-region support

[!INCLUDE [Storage - Multi-region support introduction](includes/storage/reliability-storage-multi-region-support-include.md)]

[!INCLUDE [Storage - Multi-region support introduction RA-GRS addendum](includes/storage/reliability-storage-multi-region-support-read-access-include.md)]

[!INCLUDE [Storage - Multi-region support introduction failover types](includes/storage/reliability-storage-multi-region-support-failover-types-include.md)]

### Region support

[!INCLUDE [Storage - Multi-region support region support](includes/storage/reliability-storage-multi-region-region-support-include.md)]

### Requirements

[!INCLUDE [Storage - Multi Region Requirements](includes/storage/reliability-storage-multi-region-requirements-include.md)]

### Considerations

When implementing multi-region Azure Blob Storage, consider the following important factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Secondary region access (read access)](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

### Cost

[!INCLUDE [Storage - Multi Region cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

[!INCLUDE [Storage - Multi Region Configure multi-region support - create](includes/storage/reliability-storage-multi-region-configure-create-include.md)]

[!INCLUDE [Storage - Multi Region Configure multi-region support - enable-disable](includes/storage/reliability-storage-multi-region-configure-enable-disable-include.md)]

### Normal operations

[!INCLUDE [Storage - Multi Region Normal operations](includes/storage/reliability-storage-multi-region-normal-operations-include.md)]

### Region-down experience

[!INCLUDE [Storage - Multi Region Down experience](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

### Failback

[!INCLUDE [Storage - Multi Region Failback](includes/storage/reliability-storage-multi-region-failback-include.md)]

### Testing for region failures

[!INCLUDE [Storage - Multi Region Testing](includes/storage/reliability-storage-multi-region-testing-include.md)]

### Alternative multi-region approaches

[!INCLUDE [Storage - Alternative multi-region approaches - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

[!INCLUDE [Storage - Alternative multi-region approaches - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

**Object replication** provides an additional option for cross-region data replication that provides asynchronous copying of block blobs between storage accounts. Unlike the built-in geo-redundant storage options that use fixed paired regions, object replication allows you to replicate data between storage accounts in any Azure region, including non-paired regions. This approach gives you full control over source and destination regions, replication policies, and the specific containers and blob prefixes to replicate.

Object replication can be configured to replicate all blobs within a container, or specific subsets based on blob prefixes and tags. The replication is asynchronous and happens in the background. You can configure multiple replication policies and even chain replication across multiple storage accounts to create sophisticated multi-region topologies.

Object replication isn't compatible with all storage accounts. For example, object replication doesn't work with storage accounts that use hierarchical namespaces (also called Azure Data Lake Gen2 accounts).

For detailed implementation guidance, see [Object replication for block blobs](/azure/storage/blobs/object-replication-overview) and [Configure object replication](/azure/storage/blobs/object-replication-configure).

## Backups

Azure Blob Storage provides multiple data protection mechanisms that complement redundancy for comprehensive backup strategies. While the service's built-in redundancy protects against infrastructure failures, additional backup capabilities protect against accidental deletion, corruption, and malicious activities.

**Point-in-time restore** allows you to restore block blob data to a previous state within a configured retention period (up to 365 days). This feature is fully managed by Microsoft and provides granular recovery capabilities at the container or blob level. Point-in-time restore data is stored in the same region as the source account and is accessible even during regional outages if using geo-redundant configurations.

**Blob versioning** automatically maintains previous versions of blobs when they are modified or deleted. Each version is stored as a separate object and can be accessed independently. Versions are stored in the same region as the current blob and follow the same redundancy configuration as the storage account.

**Soft delete** provides a safety net for accidentally deleted blobs and containers by retaining deleted data for a configurable period. Soft-deleted data remains in the same storage account and region, making it immediately available for recovery. For geo-redundant accounts, soft-deleted data is also replicated to the secondary region.

**Blob snapshots** create read-only point-in-time copies of blobs that can be used for backup and recovery scenarios. Snapshots are stored in the same storage account and follow the same redundancy and geo-replication settings as the base blob.

For cross-region backup requirements, consider using **Azure Backup for Blobs**, which provides centralized backup management and can store backup data in different regions from the source data. This service provides operational and vaulted backup options with configurable retention policies and restore capabilities. For more information, see [Azure Backup for Blobs overview](/azure/backup/blob-backup-overview).

## Service-level agreement

[!INCLUDE [Storage - SLA](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [Azure Blob Storage overview](/azure/storage/blobs/storage-blobs-overview)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Disaster recovery and storage account failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [Use geo-redundancy to design highly available applications](/azure/storage/common/geo-redundant-design)
- [Change how a storage account is replicated](/azure/storage/common/redundancy-migration)
