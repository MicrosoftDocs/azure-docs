---
title: Azure Files scalability and performance targets
description: Learn about the scalability and performance targets for Azure storage accounts, Azure Files, and Azure File Sync, including file share capacity, IOPS, throughput, ingress, egress, and operations.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 05/13/2024
ms.author: kendownie
---

# Scalability and performance targets for Azure Files and Azure File Sync

[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) and Network File System (NFS) file system protocols. This article discusses the scalability and performance targets for Azure storage accounts, Azure Files, and Azure File Sync.

The targets listed here might be affected by other variables in your deployment. For example, the performance of I/O for a file might be impacted by your SMB client's behavior and by your available network bandwidth. You should test your usage pattern to determine whether the scalability and performance of Azure Files meet your requirements.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Azure Files scale targets

Azure file shares are deployed into storage accounts, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares. There are therefore three categories to consider: storage accounts, Azure file shares, and individual files.

### Storage account scale targets

Storage account scale targets apply at the storage account level. There are two main types of storage accounts for Azure Files:

- **General purpose version 2 (GPv2) storage accounts**: GPv2 storage accounts allow you to deploy Azure file shares on standard/hard disk-based (HDD-based) hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables. File shares can be deployed into the transaction optimized (default), hot, or cool tiers.

- **FileStorage storage accounts**: FileStorage storage accounts allow you to deploy Azure file shares on premium/solid-state disk-based (SSD-based) hardware. FileStorage accounts can only be used to store Azure file shares; no other storage resources (blob containers, queues, tables, etc.) can be deployed in a FileStorage account.

| Attribute | GPv2 storage accounts (standard) | FileStorage storage accounts (premium) |
|-|-|-|
| Number of storage accounts per region per subscription | 250<sup>1</sup> | 250<sup>1</sup> |
| Maximum storage account capacity | 5 PiB<sup>2</sup> | 100 TiB (provisioned) |
| Maximum number of file shares | Unlimited | Unlimited, total provisioned size of all shares must be less than max than the max storage account capacity |
| Maximum concurrent request rate | 20,000 IOPS<sup>2</sup> | 102,400 IOPS |
| Throughput (ingress + egress) for LRS/GRS<br /><ul><li>Australia East</li><li>Central US</li><li>East Asia</li><li>East US 2</li><li>Japan East</li><li>Korea Central</li><li>North Europe</li><li>South Central US</li><li>Southeast Asia</li><li>UK South</li><li>West Europe</li><li>West US</li></ul> | <ul><li>Ingress: 7,152 MiB/sec</li><li>Egress: 14,305 MiB/sec</li></ul> | 10,340 MiB/sec |
| Throughput (ingress + egress) for ZRS<br /><ul><li>Australia East</li><li>Central US</li><li>East US</li><li>East US 2</li><li>Japan East</li><li>North Europe</li><li>South Central US</li><li>Southeast Asia</li><li>UK South</li><li>West Europe</li><li>West US 2</li></ul> | <ul><li>Ingress: 7,152 MiB/sec</li><li>Egress: 14,305 MiB/sec</li></ul> | 10,340 MiB/sec |
| Throughput (ingress + egress) for redundancy/region combinations not listed in the previous row | <ul><li>Ingress: 2,980 MiB/sec</li><li>Egress: 5,960 MiB/sec</li></ul> | 10,340 MiB/sec |
| Maximum number of virtual network rules | 200 | 200 |
| Maximum number of IP address rules | 200 | 200 |
| Management read operations | 800 per 5 minutes | 800 per 5 minutes |
| Management write operations | 10 per second/1200 per hour | 10 per second/1200 per hour |
| Management list operations | 100 per 5 minutes | 100 per 5 minutes |

<sup>1</sup> With a quota increase, you can create up to 500 storage accounts with standard endpoints per region. For more information, see [Increase Azure Storage account quotas](../../quotas/storage-account-quota-requests.md).
<sup>2</sup> General-purpose version 2 storage accounts support higher capacity limits and higher limits for ingress by request. To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

### Azure file share scale targets

Azure file share scale targets apply at the file share level.

| Attribute | Standard file shares<sup>1</sup> | Premium file shares |
|-|-|-|
| Minimum size of a file share | No minimum | 100 GiB (provisioned) |
| Provisioned size increase/decrease unit | N/A | 1 GiB |
| Maximum size of a file share | 100 TiB | 100 TiB |
| Maximum number of files in a file share | No limit | No limit |
| Maximum request rate (Max IOPS) | <ul><li>20,000</li><li>1,000 or 100 requests per 100 ms, default</li></ul> | <ul><li>Baseline IOPS: 3000 + 1 IOPS per GiB, up to 102,400</li><li>IOPS bursting: Max (10,000, 3x IOPS per GiB), up to 102,400</li></ul> |
| Throughput (ingress + egress) for a single file share (MiB/sec) | <ul><li>Up to storage account limits</li><li>Up to 60 MiB/sec, default</li></ul> | 100 + CEILING(0.04 * ProvisionedStorageGiB) + CEILING(0.06 * ProvisionedStorageGiB) |
| Maximum number of share snapshots | 200 snapshots | 200 snapshots |
| Maximum object name length<sup>3</sup> (full pathname including all directories, file names, and backslash characters) | 2,048 characters | 2,048 characters |
| Maximum length of individual pathname component<sup>2</sup> (in the path \A\B\C\D, each letter represents a directory or file that is an individual component) | 255 characters | 255 characters |
| Hard link limit (NFS only) | N/A | 178 |
| Maximum number of SMB Multichannel channels | N/A | 4 |
| Maximum number of stored access policies per file share | 5 | 5 |

<sup>1</sup> The limits for standard file shares apply to all three of the tiers available for standard file shares: transaction optimized, hot, and cool.

<sup>2</sup> Azure Files enforces certain [naming rules](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) for directory and file names.

### File scale targets

File scale targets apply to individual files stored in Azure file shares.

| Attribute | Files in standard file shares  | Files in premium file shares  |
|-|-|-|
| Maximum file size | 4 TiB | 4 TiB |
| Maximum concurrent request rate | 1,000 IOPS | Up to 8,000<sup>1</sup> |
| Maximum ingress for a file | 60 MiB/sec | 200 MiB/sec (Up to 1 GiB/s with SMB Multichannel)<sup>2</sup> |
| Maximum egress for a file | 60 MiB/sec | 300 MiB/sec (Up to 1 GiB/s with SMB Multichannel)<sup>2</sup> |
| Maximum concurrent handles for root directory<sup>3</sup> | 10,000 handles | 10,000 handles  |
| Maximum concurrent handles per file and directory<sup>3</sup> | 2,000 handles | 2,000 handles |

<sup>1 Applies to read and write I/Os (typically smaller I/O sizes less than or equal to 64 KiB). Metadata operations, other than reads and writes, may be lower. These are soft limits, and throttling can occur beyond these limits.</sup>

<sup>2 Subject to machine network limits, available bandwidth, I/O sizes, queue depth, and other factors. For details see [SMB Multichannel performance](./smb-performance.md).</sup>

<sup>3 Azure Files supports 10,000 open handles on the root directory and 2,000 open handles per file and directory within the share. The number of active users supported per share is dependent on the applications that are accessing the share. If your applications aren't opening a handle on the root directory, Azure Files can support more than 10,000 active users per share. However, if you're using Azure Files to store disk images for large-scale virtual desktop workloads, you might run out of handles for the root directory or per file/directory. In this case, you might need to use multiple Azure file shares. For more information, see [Azure Files sizing guidance for Azure Virtual Desktop](#azure-files-sizing-guidance-for-azure-virtual-desktop).</sup>

### Azure Files sizing guidance for Azure Virtual Desktop

A popular use case for Azure Files is storing user profile containers and disk images for Azure Virtual Desktop, using either FSLogix or App attach. In large scale Azure Virtual Desktop deployments, you might run out of handles for the root directory or per file/directory if you're using a single Azure file share. This section describes how handles are consumed by various types of disk images, and provides sizing guidance depending on the technology you're using.

#### FSLogix

If you're using [FSLogix with Azure Virtual Desktop](../../virtual-desktop/fslogix-containers-azure-files.md), your user profile containers are either Virtual Hard Disk (VHD) or Hyper-V Virtual Hard Disk (VHDX) files, and they're mounted in a user context, not a system context. Each user will open a single root directory handle, which should be to the file share. Azure Files can support a maximum of 10,000 users assuming you have the file share (`\\storageaccount.file.core.windows.net\sharename`) + the profile directory (`%sid%_%username%`) + profile container (`profile_%username.vhd(x)`).

If you're hitting the limit of 10,000 concurrent handles for the root directory or users are seeing poor performance, try using an additional Azure file share and distributing the containers between the shares.

> [!WARNING]
> While Azure Files can support up to 10,000 concurrent users from a single file share, it's critical to properly test your workloads against the size and type of file share you've created. Your requirements might vary based on users, profile size, and workload.

For example, if you have 2,400 concurrent users, you'd need 2,400 handles on the root directory (one for each user), which is below the limit of 10,000 open handles. For FSLogix users, reaching the limit of 2,000 open file and directory handles is extremely unlikely. If you have a single FSLogix profile container per user, you'd only consume two file/directory handles: one for the profile directory and one for the profile container file. If users have two containers each (profile and ODFC), you'd need one additional handle for the ODFC file.

#### App attach with CimFS

If you're using [MSIX App attach or App attach](../../virtual-desktop/app-attach-overview.md) to dynamically attach applications, you can use Composite Image File System (CimFS) or VHD/VHDX files for [disk images](../../virtual-desktop/app-attach-overview.md#application-images). Either way, the scale limits are per VM mounting the image, not per user. The number of users is irrelevant when calculating scale limits. When a VM is booted, it mounts the disk image, even if there are zero users.

If you're using App attach with CimFS, the disk images only consume handles on the disk image files. They don't consume handles on the root directory or the directory containing the disk image. However, because a CimFS image is a combination of the .cim file and at least two other files, for every VM mounting the disk image, you'll need one handle each for three files in the directory. So if you have 100 VMs, you'll need 300 file handles.

You might run out of file handles if the number of VMs per app exceeds 2,000. In this case, use an additional Azure file share.

#### App attach with VHD/VHDX

If you're using App attach with VHD/VHDX files, the files are mounted in a system context, not a user context, and they are shared and read-only. More than one handle on the VHDX file can be consumed by a connecting system. To stay within Azure Files scale limits, the number of VMs multiplied by the number of apps must be less than 10,000, and the number of VMs per app can't exceed 2,000. So the constraint is whichever you hit first.

In this scenario, you could hit the per file/directory limit with 2,000 mounts of a single VHD/VHDX. Or, if the share contains multiple VHD/VHDX files, you could hit the root directory limit first. For example, 100 VMs mounting 100 shared VHDX files will hit the 10,000 handle root directory limit.

In another example, 100 VMs accessing 20 apps will require 2,000 root directory handles (100 x 20 = 2,000), which is well within the 10,000 limit for root directory handles. You'll also need a file handle and a directory/folder handle for every VM mounting the VHD(X) image, so 200 handles in this case (100 file handles + 100 directory handles), which is comfortably below the 2,000 handle limit per file/directory.

If you're hitting the limits on maximum concurrent handles for the root directory or per file/directory, use an additional Azure file share.

## Azure File Sync scale targets

The following table indicates which targets are soft, representing the Microsoft tested boundary, and hard, indicating an enforced maximum:

| Resource | Target | Hard limit |
|----------|--------------|------------|
| Storage Sync Services per region | 100 Storage Sync Services | Yes |
| Storage Sync Services per subscription | 15 Storage Sync Services | Yes |
| Sync groups per Storage Sync Service | 200 sync groups | Yes |
| Registered servers per Storage Sync Service | 99 servers | Yes |
| Private endpoints per Storage Sync Service | 100 private endpoints | Yes |
| Cloud endpoints per sync group | 1 cloud endpoint | Yes |
| Server endpoints per sync group | 100 server endpoints | Yes |
| Server endpoints per server | 30 server endpoints | Yes |
| File system objects (directories and files) per sync group | 100 million objects | No |
| Maximum number of file system objects (directories and files) in a directory **(not recursive)** | 5 million objects | Yes |
| Maximum object (directories and files) security descriptor size | 64 KiB | Yes |
| File size | 100 GiB | No |
| Minimum file size for a file to be tiered | Based on file system cluster size (double file system cluster size). For example, if the file system cluster size is 4 KiB, the minimum file size will be 8 KiB. | Yes |

> [!NOTE]
> An Azure File Sync endpoint can scale up to the size of an Azure file share. If the Azure file share size limit is reached, sync won't be able to operate.

## Azure File Sync performance metrics

Since the Azure File Sync agent runs on a Windows Server machine that connects to the Azure file shares, effective sync performance depends upon a number of factors in your infrastructure: Windows Server and the underlying disk configuration, network bandwidth between the server and the Azure storage, file size, total dataset size, and the activity on the dataset. Since Azure File Sync works on the file level, the performance characteristics of an Azure File Sync-based solution should be measured by the number of objects (files and directories) processed per second.

For Azure File Sync, performance is critical in two stages:

1. **Initial one-time provisioning**: To optimize performance on initial provisioning, refer to [Onboarding with Azure File Sync](../file-sync/file-sync-deployment-guide.md#onboarding-with-azure-file-sync) for the optimal deployment details.
2. **Ongoing sync**: After the data is initially seeded in the Azure file shares, Azure File Sync keeps multiple endpoints in sync.

> [!NOTE]
> When many server endpoints in the same sync group are syncing at the same time, they're contending for cloud service resources. As a result, upload performance is impacted. In extreme cases, some sync sessions will fail to access the resources, and will fail. However, those sync sessions will resume shortly and eventually succeed once the congestion is reduced.

## Internal test results

To help you plan your deployment for each of the stages (initial one-time provisioning and ongoing sync), here are the results we observed during internal testing on a system with the following configuration:

| System configuration | Details |
|-|-|
| CPU | 64 Virtual Cores with 64 MiB L3 cache |
| Memory | 128 GiB |
| Disk | SAS disks with RAID 10 with battery backed cache |
| Network | 1 Gbps Network |
| Workload | General Purpose File Server|

### Initial one-time provisioning

| Initial one-time provisioning  | Details |
|-|-|
| Number of objects | 25 million objects |
| Dataset Size | ~4.7 TiB |
| Average File Size | ~200 KiB (Largest File: 100 GiB) |
| Initial cloud change enumeration | 80 objects per second  |
| Upload Throughput | 20 objects per second per sync group |
| Namespace Download Throughput | 400 objects per second |

**Initial cloud change enumeration**: When a new sync group is created, initial cloud change enumeration is the first step that executes. In this process, the system will enumerate all the items in the Azure file share. During this process, there will be no sync activity. No items will be downloaded from cloud endpoint to server endpoint, and no items will be uploaded from server endpoint to cloud endpoint. Sync activity will resume once initial cloud change enumeration completes.

The rate of performance is 80 objects per second. You can estimate the time it will take to complete initial cloud change enumeration by determining the number of items in the cloud share and using the following formulae to get the time in days.

**Time (in days) for initial cloud enumeration = (Number of objects in cloud endpoint)/(80 \* 60 \* 60 \* 24)**

**Initial sync of data from Windows Server to Azure File share:** Many Azure File Sync deployments start with an empty Azure file share because all the data is on the Windows Server. In these cases, the initial cloud change enumeration is fast, and the majority of time is spent syncing changes from the Windows Server into the Azure file share(s).

While sync uploads data to the Azure file share, there's no downtime on the local file server, and administrators can [setup network limits](../file-sync/file-sync-server-registration.md#set-azure-file-sync-network-limits) to restrict the amount of bandwidth used for background data upload.

Initial sync is typically limited by the initial upload rate of 20 files per second per sync group. Customers can estimate the time to upload all their data to Azure using the following formulae to get time in days:

**Time (in days) for uploading files to a sync group = (Number of objects in server endpoint)/(20 \* 60 \* 60 \* 24)**

Splitting your data into multiple server endpoints and sync groups can speed up this initial data upload, because the upload can be done in parallel for multiple sync groups at a rate of 20 items per second each. So, two sync groups would be running at a combined rate of 40 items per second. The total time to complete would be the time estimate for the sync group with the most files to sync.

**Namespace download throughput:** When a new server endpoint is added to an existing sync group, the Azure File Sync agent doesn't download any of the file content from the cloud endpoint. It first syncs the full namespace and then triggers background recall to download the files, either in their entirety or, if cloud tiering is enabled, to the cloud tiering policy set on the server endpoint.

### Ongoing sync

| Ongoing sync  | Details  |
|-|--|
| Number of objects synced | 125,000 objects (~1% churn) |
| Dataset Size | 50 GiB |
| Average File Size | ~500 KiB |
| Upload Throughput | 20 objects per second per sync group |
| Full Download Throughput\* | 60 objects per second |

\*If cloud tiering is enabled, you're likely to observe better performance as only some of the file data is downloaded. Azure File Sync only downloads the data of cached files when they're changed on any of the endpoints. For any tiered or newly created files, the agent doesn't download the file data, and instead only syncs the namespace to all the server endpoints. The agent also supports partial downloads of tiered files as they're accessed by the user.

> [!NOTE]
> These numbers aren't an indication of the performance that you'll experience. The actual performance depends on multiple factors as outlined in the beginning of this section.

As a general guide for your deployment, keep a few things in mind:

- The object throughput approximately scales in proportion to the number of sync groups on the server. Splitting data into multiple sync groups on a server yields better throughput, which is also limited by the server and network.
- The object throughput is inversely proportional to the MiB per second throughput. For smaller files, you'll experience higher throughput in terms of the number of objects processed per second, but lower MiB per second throughput. Conversely, for larger files, you'll get fewer objects processed per second, but higher MiB per second throughput. The MiB per second throughput is limited by the Azure Files scale targets.

## See also

- [Understand Azure Files performance](understand-performance.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
