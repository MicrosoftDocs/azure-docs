---
title: Azure Files scalability and performance targets
description: Learn about the scalability and performance targets for Azure Files, including the capacity, request rate, and inbound and outbound bandwidth limits.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: rogarana
ms.subservice: files
---

# Azure Files scalability and performance targets

[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. This article discusses the scalability and performance targets for Azure Files and Azure File Sync.

The scalability and performance targets listed here are high-end targets, but may be affected by other variables in your deployment. For example, the throughput for a file may also be limited by your available network bandwidth, not just the servers hosting the Azure Files service. We strongly recommend testing your usage pattern to determine whether the scalability and performance of Azure Files meet your requirements. We are also committed to increasing these limits over time. Please don't hesitate to give us feedback, either in the comments below or on the [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage/category/180670-files), about which limits you would like to see us increase.

## Azure storage account scale targets

The parent resource for an Azure file share is an Azure storage account. A storage account represents a pool of storage in Azure that can be used by multiple storage services, including Azure Files, to store data. Other services that store data in storage accounts are Azure Blob storage, Azure Queue storage, and Azure Table storage. The following targets apply all storage services storing data in a storage account:

[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

> [!Important]  
> General purpose storage account utilization from other storage services affects your Azure file shares in your storage account. For example, if you reach the maximum storage account capacity with Azure Blob storage, you will not be able to create new files on your Azure file share, even if your Azure file share is below the maximum share size.

## Azure Files scale targets

There are three categories of limitations to consider for Azure Files: storage accounts, shares, and files.

For example: With premium file shares, a single share can achieve 100,000 IOPS and a single file can scale up to 5,000 IOPS. So, if you have three files in one share, the maximum IOPS you can get from that share is 15,000.

### Standard storage account limits

See the [Azure storage account scale targets](#azure-storage-account-scale-targets) section for these limits.

### Premium FileStorage account limits

[!INCLUDE [azure-storage-limits-filestorage](../../../includes/azure-storage-limits-filestorage.md)]

> [!IMPORTANT]
> Storage account limits apply to all shares. Scaling up to the max for FileStorage accounts is only achievable if there is only one share per FileStorage account.

### File share and file scale targets

> [!NOTE]
> Standard file shares larger than 5 TiB have certain limitations. 
> For a list of limitations and instructions to enable larger file share sizes, see the [enable larger file shares on standard file shares](storage-files-planning.md#enable-standard-file-shares-to-span-up-to-100-tib) section of the planning guide.

[!INCLUDE [storage-files-scale-targets](../../../includes/storage-files-scale-targets.md)]

[!INCLUDE [storage-files-premium-scale-targets](../../../includes/storage-files-premium-scale-targets.md)]

## Azure File Sync scale targets

Azure File Sync has been designed with the goal of limitless usage, but limitless usage is not always possible. The following table indicates the boundaries of Microsoft's testing and also indicates which targets are hard limits:

[!INCLUDE [storage-sync-files-scale-targets](../../../includes/storage-sync-files-scale-targets.md)]

### Azure File Sync performance metrics

Since the Azure File Sync agent runs on a Windows Server machine that connects to the Azure file shares, the effective sync performance depends upon a number of factors in your infrastructure: Windows Server and the underlying disk configuration, network bandwidth between the server and the Azure storage, file size, total dataset size, and the activity on the dataset. Since Azure File Sync works on the file level, the performance characteristics of an Azure File Sync-based solution is better measured in the number of objects (files and directories) processed per second.

For Azure File Sync, performance is critical in two stages:

1. **Initial one-time provisioning**: To optimize performance on initial provisioning, refer to [Onboarding with Azure File Sync](storage-sync-files-deployment-guide.md#onboarding-with-azure-file-sync) for the optimal deployment details.
2. **Ongoing sync**: After the data is initially seeded in the Azure file shares, Azure File Sync keeps multiple endpoints in sync.

To help you plan your deployment for each of the stages, below are the results observed during the internal testing on a system with a config

| System configuration |  |
|-|-|
| CPU | 64 Virtual Cores with 64 MiB L3 cache |
| Memory | 128 GiB |
| Disk | SAS disks with RAID 10 with battery backed cache |
| Network | 1 Gbps Network |
| Workload | General Purpose File Server|

| Initial one-time provisioning  |  |
|-|-|
| Number of objects | 25 million objects |
| Dataset Size| ~4.7 TiB |
| Average File Size | ~200 KiB (Largest File: 100 GiB) |
| Upload Throughput | 20 objects per second per sync group |
| Namespace Download Throughput* | 400 objects per second |

*When a new server endpoint is created, the Azure File Sync agent does not download any of the file content. It first syncs the full namespace and then triggers background recall to download the files, either in their entirety or, if cloud tiering is enabled, to the cloud tiering policy set on the server endpoint.

| Ongoing sync  |   |
|-|--|
| Number of objects synced| 125,000 objects (~1% churn) |
| Dataset Size| 50 GiB |
| Average File Size | ~500 KiB |
| Upload Throughput | 20 objects per second per sync group |
| Full Download Throughput* | 60 objects per second |

*If cloud tiering is enabled, you are likely to observe better performance as only some of the file data is downloaded. Azure File Sync only downloads the data of cached files when they are changed on any of the endpoints. For any tiered or newly created files, the agent does not download the file data, and instead only syncs the namespace to all the server endpoints. The agent also supports partial downloads of tiered files as they are accessed by the user. 

> [!Note]  
> The numbers above are not an indication of the performance that you will experience. The actual performance will depend on multiple factors as outlined in the beginning of this section.

As a general guide for your deployment, you should keep a few things in mind:

- The object throughput approximately scales in proportion to the number of sync groups on the server. Splitting data into multiple sync groups on a server yields better throughput, which is also limited by the server and network.
- The object throughput is inversely proportional to the MiB per second throughput. For smaller files, you will experience higher throughput in terms of the number of objects processed per second, but lower MiB per second throughput. Conversely, for larger files, you will get fewer objects processed per second, but higher MiB per second throughput. The MiB per second throughput is limited by the Azure Files scale targets.

## See also

- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
