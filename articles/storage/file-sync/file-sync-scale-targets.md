---
title: Azure File Sync Scale Targets
description: Learn about the scalability and performance targets for Azure File Sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 11/03/2025
ms.author: kendownie
ms.custom: references_regions
---

# Scalability and performance targets for Azure File Sync

[Azure File Sync](./file-sync-introduction.md) extends [Azure Files](../files/storage-files-introduction.md) to Windows Server, enabling local caching, multi-site sync, and cloud tiering for file shares. This article discusses the scalability and performance targets for Azure File Sync.

Because Azure File Sync uses Azure Files as the backing store for data synced from your on-premises file servers, you should also consider the [scalability and performance targets for Azure Files](../files/storage-files-scale-targets.md?toc=/azure/storage/file-sync/toc.json).

## Azure File Sync scale targets

The following table indicates which targets are soft, representing the Microsoft tested boundary, and hard, indicating an enforced maximum. An Azure File Sync endpoint can scale up to the size of an Azure file share. If the Azure file share size limit is reached, sync won't be able to operate.

| Resource | Target | Hard limit |
|-|-|-|
| Storage Sync Services per subscription | 100 Storage Sync Services | Yes |
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

## Azure File Sync performance metrics

Since the Azure File Sync agent runs on a Windows Server machine that connects to the Azure file shares, the effective sync performance depends upon many factors in your infrastructure, including:

- Windows Server and the underlying disk configuration
- Network bandwidth between the server and Azure storage
- File size
- Total dataset size
- Activity on the dataset

Because Azure File Sync works on the file level, you should measure the performance characteristics of an Azure File Sync-based solution by the number of objects (files and directories) processed per second.

The following table indicates the Azure File Sync performance targets:

| Scenario | Performance |
|-|-|
| Initial cloud change enumeration | 150 objects per second per sync group |
| Upload throughput | 200 objects per second per sync group |
| Namespace download throughput | 400 objects per second per server endpoint |
| Full download throughput | 60 objects per second per server endpoint |

> [!NOTE]
> Actual performance will depend on multiple factors as outlined in the beginning of this section.

As a general guide for your deployment, you should keep a few things in mind:

- Object throughput approximately scales in proportion to the number of sync groups on the server. Splitting data into multiple sync groups on a server yields better throughput, which is also limited by the server and network.
- Object throughput is inversely proportional to the MiB per second throughput. For smaller files, you experience higher throughput in terms of the number of objects processed per second, but lower MiB per second throughput. Conversely, for larger files, you get fewer objects processed per second, but higher MiB per second throughput. The MiB per second throughput is limited by the Azure Files scale targets.
- When many server endpoints in the same sync group are syncing at the same time, they're contending for cloud service resources. As a result, upload performance is impacted. In extreme cases, some sync sessions fail to access the resources, and will fail. However, those sync sessions will resume shortly and eventually succeed once the congestion is reduced.
- If cloud tiering is enabled, you're likely to observe better download performance as only some of the file data is downloaded. Azure File Sync only downloads the data of cached files when they're changed on any of the endpoints. For any tiered or newly created files, the agent doesn't download the file data, and instead only syncs the namespace to all the server endpoints. The agent also supports partial downloads of tiered files as they're accessed by the user.

## See also
- [Planning for an Azure File Sync deployment](./file-sync-planning.md)
- [Scalability and performance targets for Azure Files](../files/storage-files-scale-targets.md?toc=/azure/storage/file-sync/toc.json)
- [Understand Azure Files billing](../files/understanding-billing.md?toc=/azure/storage/file-sync/toc.json)
