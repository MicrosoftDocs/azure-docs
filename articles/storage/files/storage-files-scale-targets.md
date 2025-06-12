---
title: Azure Files scalability and performance targets
description: Learn about the scalability and performance targets for Azure Files and Azure File Sync, including file share storage, IOPS, and throughput.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 03/11/2025
ms.author: kendownie
ms.custom: references_regions
---

# Scalability and performance targets for Azure Files and Azure File Sync

[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) and Network File System (NFS) file system protocols. This article discusses the scalability and performance targets for Azure Files and Azure File Sync.

Other variables in your deployment can affect the targets listed in this article. For example, your SMB client's behavior and your available network bandwidth might impact I/O performance. You should test your usage pattern to determine whether the scalability and performance of Azure Files meet your requirements.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
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

| Attribute | SSD provisioned v1 | HDD provisioned v2 | HDD pay-as-you-go |
|-|-|-|-|
| Storage account kind | FileStorage | FileStorage | StorageV2 |
| SKUs | <ul><li>Premium_LRS</li><li>Premium_ZRS</li></ul> | <ul><li>StandardV2_LRS</li><li>StandardV2_ZRS</li><li>StandardV2_GRS</li><li>StandardV2_GZRS</li></ul> | <ul><li>Standard_LRS</li><li>Standard_ZRS</li><li>Standard_GRS</li><li>Standard_GZRS</li></ul> |
| Number of storage accounts per region per subscription | 250 | 250 | 250 |
| Maximum storage capacity | 100 TiB | 4 PiB | 5 PiB |
| Maximum number of file shares | 1024 (recommended using 50 or fewer) | 50 | Unlimited (recommended using 50 or fewer) |
| Maximum IOPS | 102,400 IOPS | 50,000 IOPS | 20,000 IOPS |
| Maximum throughput | 10,340 MiB / sec | 5,120 MiB / sec | <ul><li>Select regions:<ul><li>Ingress: 7,680 MiB / sec</li><li>Egress: 25,600 MiB / sec</li></ul></li><li>Default:<ul><li>Ingress: 3,200 MiB / sec</li><li>Egress: 6,400 MiB / sec</li></ul></li></ul> |
| Maximum number of virtual network rules | 200 | 200 | 200 |
| Maximum number of IP address rules | 200 | 200 | 200 |
| Management read operations | 800 per 5 minutes | 800 per 5 minutes | 800 per 5 minutes |
| Management write operations | 10 per second/1200 per hour | 10 per second/1200 per hour | 10 per second/1200 per hour |
| Management list operations | 100 per 5 minutes | 100 per 5 minutes | 100 per 5 minutes |

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

| Attribute | SSD provisioned v1 | HDD provisioned v2 | HDD pay-as-you-go |
|-|-|-|
| Storage provisioning unit | 1 GiB | 1 GiB | N/A |
| IOPS provisioning unit | N/A | 1 IO / sec | N/A |
| Throughput provisioning unit | N/A | 1 MiB / sec | N/A |
| Minimum storage size | 100 GiB (provisioned) | 32 GiB (provisioned) | 0 bytes |
| Maximum storage size | 100 TiB | 256 TiB | 100 TiB |
| Maximum number of files | Unlimited | Unlimited | Unlimited |
| Maximum IOPS (Data) | 102,400 IOPS (dependent on provisioning) | 50,000 IOPS (dependent on provisioning) | 20,000 IOPS |
| Maximum IOPS (Metadata<sup>1</sup>) | Up to 35,000 IOPS | Up to 12,000 IOPS | Up to 12,000 IOPS |
| Maximum throughput | 10,340 MiB / sec (dependent on provisioning) | 5,120 MiB / sec (dependent on provisioning) | Up to storage account limits |
| Maximum number of share snapshots | 200 snapshots | 200 snapshots | 200 snapshots |
| Maximum filename length<sup>2</sup> (full pathname including all directories, file names, and backslash characters) | 2,048 characters | 2,048 characters | 2,048 characters |
| Maximum length of individual pathname component (in the path \A\B\C\D, each letter represents a directory or file that is an individual component) | 255 characters | 255 characters | 255 characters |
| Hard link limit (NFS only) | 178 | N/A | N/A |
| Maximum number of SMB Multichannel channels | 4 | N/A | N/A |
| Maximum number of stored access policies per file share | 5 | 5 | 5 |

<sup>1</sup> Metadata IOPS (open/close/delete). See [Monitor Metadata IOPS](analyze-files-metrics.md#monitor-utilization-by-metadata-iops) for guidance.<br>
<sup>2</sup> Azure Files enforces certain [naming rules](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) for directory and file names.

### File scale targets
File scale targets apply to individual files stored in Azure file shares.

| Attribute | SSD provisioned v1 | HDD provisioned v2 | HDD pay-as-you-go |
|-|-|-|
| Maximum file size | 4 TiB | 4 TiB | 4 TiB |
| Maximum data IOPS per file | 8,000 IOPS | 1,000 IOPS | 1,000 IOPS |
| Maximum throughput per file | 1,024 MiB / sec | 60 MiB / sec | 60 MiB / sec |
| Maximum concurrent handles for root directory | 10,000 handles | 10,000 handles | 10,000 handles  |
| Maximum concurrent handles per file and directory | 2,000 handles | 2,000 handles | 2,000 handles |

### Azure Files sizing guidance for Azure Virtual Desktop

A popular use case for Azure Files is storing user profile containers and disk images for Azure Virtual Desktop, using either FSLogix or App attach. In large scale Azure Virtual Desktop deployments, you might run out of handles for the root directory or per file/directory if you're using a single Azure file share. This section describes how various types of disk images consume handles. It also provides sizing guidance based on the technology you're using.

#### FSLogix

If you're using [FSLogix with Azure Virtual Desktop](../../virtual-desktop/fslogix-containers-azure-files.md), your user profile containers are either Virtual Hard Disk (VHD) or Hyper-V Virtual Hard Disk (VHDX) files, and they're mounted in a user context, not a system context. Each user opens a single root directory handle, which should be to the file share. Azure Files can support a maximum of 10,000 users assuming you have the file share (`\\storageaccount.file.core.windows.net\sharename`) + the profile directory (`%sid%_%username%`) + profile container (`profile_%username.vhd(x)`).

If you're hitting the limit of 10,000 concurrent handles for the root directory or users are seeing poor performance, try using an additional Azure file share and distributing the containers between the shares.

> [!WARNING]
> While Azure Files can support up to 10,000 concurrent users from a single file share, it's critical to properly test your workloads against the size and type of file share you're using. Your requirements might vary based on users, profile size, and workload.

For example, if you have 2,400 concurrent users, you'd need 2,400 handles on the root directory (one for each user), which is below the limit of 10,000 open handles. For FSLogix users, reaching the limit of 2,000 open file and directory handles is unlikely. If you have a single FSLogix profile container per user, you'd only consume two file/directory handles: one for the profile directory and one for the profile container file. If users have two containers each (profile and ODFC), you'd need one more handle for the ODFC file.

#### App attach with CimFS

If you're using [MSIX App attach or App attach](../../virtual-desktop/app-attach-overview.md) to dynamically attach applications, you can use Composite Image File System (CimFS) or VHD/VHDX files for [disk images](../../virtual-desktop/app-attach-overview.md#application-images). Either way, the scale limits are per VM mounting the image, not per user. The number of users is irrelevant when calculating scale limits. When a VM is booted, it mounts the disk image, even if there are zero users.

If you're using App attach with CimFS, the disk images only consume handles on the disk image files. They don't consume handles on the root directory or the directory containing the disk image. However, because a CimFS image is a combination of the .cim file and at least two other files, for every VM mounting the disk image, you need one handle each for three files in the directory. So if you have 100 VMs, you need 300 file handles.

You might run out of file handles if the number of VMs per app exceeds 2,000. In this case, use an additional Azure file share.

#### App attach with VHD/VHDX

If you're using App attach with VHD/VHDX files, the files are mounted in a system context, not a user context, and they're shared and read-only. More than one handle on the VHDX file can be consumed by a connecting system. To stay within Azure Files scale limits, the number of VMs multiplied by the number of apps must be less than 10,000, and the number of VMs per app can't exceed 2,000. So the constraint is whichever you hit first.

In this scenario, you could hit the per file/directory limit with 2,000 mounts of a single VHD/VHDX. Or, if the share contains multiple VHD/VHDX files, you could hit the root directory limit first. For example, 100 VMs mounting 100 shared VHDX files will hit the 10,000 handle root directory limit.

In another example, 100 VMs accessing 20 apps require 2,000 root directory handles (100 x 20 = 2,000), which is well within the 10,000 limit for root directory handles. You also need a file handle and a directory/folder handle for every VM mounting the VHD(X) image, so 200 handles in this case (100 file handles + 100 directory handles), which is comfortably below the 2,000 handle limit per file/directory.

If you're hitting the limits on maximum concurrent handles for the root directory or per file/directory, use an additional Azure file share.

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
