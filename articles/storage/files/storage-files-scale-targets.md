---
title: Azure Files scalability and performance targets
description: Learn about the scalability and performance targets for Azure Files and Azure File Sync, including file share storage, IOPS, and throughput.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 05/30/2025
ms.author: kendownie
ms.custom: references_regions
---

# Scalability and performance targets for Azure Files and Azure File Sync

[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) and Network File System (NFS) file system protocols. This article discusses the scalability and performance targets for Azure Files and Azure File Sync.

Other variables in your deployment can affect the targets listed in this article. For example, your SMB client's behavior and your available network bandwidth might impact I/O performance. You should test your usage pattern to determine whether the scalability and performance of Azure Files meet your requirements.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v2 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Azure Files scale targets
Azure file shares are deployed into storage accounts, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares. There are therefore three categories to consider: storage accounts, Azure file shares, and individual files.

### Storage account scale targets
Storage account scale targets apply at the storage account level. There are two main types of storage accounts for Azure Files:

- **FileStorage storage accounts**: FileStorage storage accounts allow you to deploy Azure file shares with a provisioned billing model. FileStorage accounts can only be used to store Azure file shares; no other storage resources (blob containers, queues, tables, etc.) can be deployed in a FileStorage account.

- **General purpose version 2 (GPv2) storage accounts**: GPv2 storage accounts allow you to deploy pay-as-you-go file shares on HDD-based hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables.

| Attribute | SSD provisioned v2 | HDD provisioned v2 | SSD provisioned v1 | HDD pay-as-you-go |
|-|-|-|-|-|
| Storage account kind | FileStorage | FileStorage | FileStorage | StorageV2 |
| SKUs | <ul><li>PremiumV2_LRS</li><li>PremiumV2_ZRS</li></ul> | <ul><li>StandardV2_LRS</li><li>StandardV2_ZRS</li><li>StandardV2_GRS</li><li>StandardV2_GZRS</li></ul> | <ul><li>Premium_LRS</li><li>Premium_ZRS</li></ul> | <ul><li>Standard_LRS</li><li>Standard_ZRS</li><li>Standard_GRS</li><li>Standard_GZRS</li></ul> |
| Number of storage accounts per region per subscription | 250 | 250 | 250 | 250 |
| Maximum storage capacity | 256 TiB | 4 PiB | 100 TiB | 5 PiB |
| Maximum number of file shares | 50 | 50 | 1024 (recommended using 50 or fewer) | Unlimited (recommended using 50 or fewer) |
| Maximum IOPS | 102,400 IOPS | 50,000 IOPS | 102,400 IOPS | 20,000 IOPS |
| Maximum throughput | 10,340 MiB / sec | 5,120 MiB / sec | 10,340 MiB / sec | <ul><li>Select regions:<ul><li>Ingress: 7,680 MiB / sec</li><li>Egress: 25,600 MiB / sec</li></ul></li><li>Default:<ul><li>Ingress: 3,200 MiB / sec</li><li>Egress: 6,400 MiB / sec</li></ul></li></ul> |
| Maximum number of virtual network rules | 200 | 200 | 200 | 200 |
| Maximum number of IP address rules | 200 | 200 | 200 | 200 |
| Management read operations | 800 per 5 minutes | 800 per 5 minutes | 800 per 5 minutes | 800 per 5 minutes |
| Management write operations | 10 per second/1200 per hour | 10 per second/1200 per hour | 10 per second/1200 per hour | 10 per second/1200 per hour |
| Management list operations | 100 per 5 minutes | 100 per 5 minutes | 100 per 5 minutes | 100 per 5 minutes |

#### Selected regions with increased maximum throughput for HDD pay-as-you-go
The following regions have an increased maximum throughput for HDD pay-as-you-go storage accounts (StorageV2): 

- East Asia
- Southeast Asia
- Australia East
- Brazil South
- Canada Central
- China East 2
- China North 3
- North Europe
- West Europe
- France Central
- Germany West Central
- Central India
- Japan East
- Jio India West
- Korea Central
- Norway East
- South Africa North
- Sweden Central
- UAE North
- UK South
- Central US
- East US
- East US 2
- US Gov Virginia
- US Gov Arizona
- North Central US
- South Central US
- West US
- West US 2
- West US 3

### Azure file share scale targets
Azure file share scale targets apply at the file share level.

| Attribute | SSD provisioned v2 | HDD provisioned v2 | SSD provisioned v1 | HDD pay-as-you-go |
|-|-|-|-|-|
| Storage provisioning unit | 1 GiB | 1 GiB | 1 GiB | N/A |
| IOPS provisioning unit | 1 IO / sec | 1 IO / sec | N/A | N/A |
| Throughput provisioning unit | 1 MiB / sec | 1 MiB / sec | N/A | N/A |
| Minimum storage size | 32 GiB (provisioned) | 32 GiB (provisioned) | 100 GiB (provisioned) | 0 bytes |
| Maximum storage size | 256 TiB | 256 TiB | 100 TiB | 100 TiB |
| Maximum number of files | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum IOPS (Data) | 102,400 IOPS (dependent on provisioning) | 50,000 IOPS (dependent on provisioning) | 102,400 IOPS (dependent on provisioning) | 20,000 IOPS |
| Maximum IOPS (Metadata<sup>1</sup>) | Up to 35,000 IOPS | Up to 12,000 IOPS | Up to 35,000 IOPS | Up to 12,000 IOPS |
| Maximum throughput | 10,340 MiB / sec (dependent on provisioning) | 5,120 MiB / sec (dependent on provisioning) | 10,340 MiB / sec (dependent on provisioning) | Up to storage account limits |
| Maximum number of share snapshots | 200 snapshots | 200 snapshots | 200 snapshots | 200 snapshots |
| Maximum filename length<sup>2</sup> (full pathname including all directories, file names, and backslash characters) | 2,048 characters | 2,048 characters | 2,048 characters | 2,048 characters |
| Maximum length of individual pathname component (in the path \A\B\C\D, each letter represents a directory or file that is an individual component) | 255 characters | 255 characters | 255 characters | 255 characters |
| Hard link limit (NFS only) | 178 | N/A | 178 | N/A |
| Maximum number of SMB Multichannel channels | 4 | N/A | 4 | N/A |
| Maximum number of stored access policies per file share | 5 | 5 | 5 | 5 |

<sup>1</sup> Metadata IOPS (open/close/delete). See [Monitor Metadata IOPS](analyze-files-metrics.md#monitor-utilization-by-metadata-iops) for guidance.<br>
<sup>2</sup> Scaling to 35,000 IOPS for SSD file shares requires [registering for the metadata caching feature](smb-performance.md#register-for-the-metadata-caching-feature).<br>
<sup>3</sup> Azure Files enforces certain [naming rules](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) for directory and file names.

### File scale targets
File scale targets apply to individual files stored in Azure file shares.

| Attribute | SSD provisioned v2 | HDD provisioned v2 | SSD provisioned v1 | HDD pay-as-you-go |
|-|-|-|-|-|
| Maximum file size | 4 TiB | 4 TiB | 4 TiB | 4 TiB |
| Maximum data IOPS per file | 8,000 IOPS | 1,000 IOPS | 8,000 IOPS | 1,000 IOPS |
| Maximum throughput per file | 1,024 MiB / sec | 60 MiB / sec | 1,024 MiB / sec | 60 MiB / sec |
| Maximum concurrent handles for root directory | 10,000 handles | 10,000 handles | 10,000 handles | 10,000 handles |
| Maximum concurrent handles per file and directory | 2,000 handles | 2,000 handles | 2,000 handles | 2,000 handles |

\* The maximum number of concurrent handles per file and directory is a soft limit for SSD SMB file shares. If you need to scale beyond this limit, you can [enable metadata caching](smb-performance.md#register-for-the-metadata-caching-feature), and register for [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview).

### Azure Files sizing guidance for Azure Virtual Desktop

A popular use case for Azure Files is storing user profile containers and disk images for Azure Virtual Desktop. See [Azure Files guidance for virtual desktop workloads](virtual-desktop-workloads.md) for more information.

## Azure File Sync scale targets

The following table indicates which targets are soft, representing the Microsoft tested boundary, and hard, indicating an enforced maximum:

| Resource | Target | Hard limit |
|----------|--------------|------------|
| Storage Sync Services per region | 100 Storage Sync Services | Yes |
| Storage Sync Services per subscription | 15 Storage Sync Services | Yes |
| Sync groups per Storage Sync Service | 200 sync groups | Yes |
| Registered servers per Storage Sync Service | 100 servers | Yes |
| Private endpoints per Storage Sync Service | 100 private endpoints | Yes |
| Cloud endpoints per sync group | One cloud endpoint | Yes |
| Server endpoints per sync group | 100 server endpoints | Yes |
| Server endpoints per server | 30 server endpoints | Yes |
| File system objects (directories and files) per sync group | 100 million objects | No |
| Maximum number of file system objects (directories and files) in a directory **(not recursive)** | 5 million objects | No |
| Maximum object (directories and files) security descriptor size | 64 KiB | Yes |
| File size | 100 GiB | No |
| Minimum file size for a file to be tiered | Based on file system cluster size (double file system cluster size). For example, if the file system cluster size is 4 KiB, the minimum file size is 8 KiB. | Yes |

> [!NOTE]
> An Azure File Sync endpoint can scale up to the size of an Azure file share. If the Azure file share size limit is reached, sync won't be able to operate.

## Azure File Sync performance metrics

Since the Azure File Sync agent runs on a Windows Server machine that connects to the Azure file shares, the effective sync performance depends upon many factors in your infrastructure, including:

- Windows Server and the underlying disk configuration
- Network bandwidth between the server and Azure storage
- File size
- Total dataset size
- Activity on the dataset

Because Azure File Sync works on the file level, you should measure the performance characteristics of an Azure File Sync-based solution by the number of objects (files and directories) processed per second.

The following table indicates the Azure File Sync performance targets:

| Scenario  | Performance |
|-|-|
| Initial cloud change enumeration | 150 objects per second per sync group  |
| Upload Throughput | 200 objects per second per sync group |
| Namespace Download Throughput | 400 objects per second per server endpoint |
| Full Download Throughput | 60 objects per second per server endpoint |

> [!NOTE]
> The actual performance will depend on multiple factors as outlined in the beginning of this section.

As a general guide for your deployment, you should keep a few things in mind:

- Object throughput approximately scales in proportion to the number of sync groups on the server. Splitting data into multiple sync groups on a server yields better throughput, which is also limited by the server and network.
- Object throughput is inversely proportional to the MiB per second throughput. For smaller files, you experience higher throughput in terms of the number of objects processed per second, but lower MiB per second throughput. Conversely, for larger files, you get fewer objects processed per second, but higher MiB per second throughput. The MiB per second throughput is limited by the Azure Files scale targets.
- When many server endpoints in the same sync group are syncing at the same time, they're contending for cloud service resources. As a result, upload performance is impacted. In extreme cases, some sync sessions fail to access the resources, and will fail. However, those sync sessions will resume shortly and eventually succeed once the congestion is reduced.
- If cloud tiering is enabled, you're likely to observe better download performance as only some of the file data is downloaded. Azure File Sync only downloads the data of cached files when they're changed on any of the endpoints. For any tiered or newly created files, the agent doesn't download the file data, and instead only syncs the namespace to all the server endpoints. The agent also supports partial downloads of tiered files as they're accessed by the user.

## See also

- [Understand Azure Files performance](understand-performance.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
