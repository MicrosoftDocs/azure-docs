---
title: Planning for an Azure File Sync (preview) deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: jgerend

ms.assetid: 297f3a14-6b3a-48b0-9da4-db5907827fb5
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/08/2017
ms.author: wgries
---

# Planning for an Azure File Sync (preview) deployment
Use Azure File Sync (preview) to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article describes important considerations for an Azure File Sync deployment. We recommend that you also read [Planning for an Azure Files deployment](storage-files-planning.md). 

## Azure File Sync terminology
Before getting into the details of planning for an Azure File Sync deployment, it's important to understand the terminology.

### Storage Sync Service
The Storage Sync Service is the top-level Azure resource for Azure File Sync. The Storage Sync Service resource is a peer of the storage account resource, and can similarly be deployed to Azure resource groups. A distinct top-level resource from the storage account resource is required because the Storage Sync Service can create sync relationships with multiple storage accounts via multiple Sync Groups. A subscription can have multiple Storage Sync Service resources deployed.

### Sync Group
A Sync Group defines the sync topology for a set of files. Endpoints within a Sync Group are kept in sync with each other. If, for example, you have two distinct sets of files that you want to manage with Azure File Sync, you would create two Sync Groups and add different endpoints to each Sync Group. A Storage Sync Service can host as many Sync Groups as you need.  

### Registered server
The registered server object represents a trust relationship between your server (or cluster) and the Storage Sync Service. You can register as many servers to a Storage Sync Service instance as you want. However, a server (or cluster) can be registered with only one Storage Sync Service at a time.

### Azure File Sync agent
The Azure File Sync agent is a downloadable package that enables a Windows server to be synced with an Azure file share. The Azure File Sync agent has three main components: 
- **FileSyncSvc.exe**: The background Windows service that is responsible for monitoring changes on Server Endpoints, and for initiating sync sessions to Azure.
- **StorageSync.sys**: The Azure File Sync file system filter, which is responsible for tiering files to Azure Files (when cloud tiering is enabled).
- **PowerShell management cmdlets**: PowerShell cmdlets that you use to interact with the Microsoft.StorageSync Azure resource provider. You can find these at the following (default) locations:
    - C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.PowerShell.Cmdlets.dll
    - C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll

### Server Endpoint
A Server Endpoint represents a specific location on a registered server, such as a folder on a server volume or the root of the volume. Multiple Server Endpoints can exist on the same volume if their namespaces do not overlap (for example, F:\sync1 and F:\sync2). You can configure cloud tiering policies individually for each Server Endpoint. If you add a server location that has an existing set of files as a Server Endpoint to a Sync Group, those files are merged with any other files that are already on other endpoints in the Sync Group.

### Cloud Endpoint
A Cloud Endpoint is an Azure file share that is part of a Sync Group. The entire Azure file share syncs, and an Azure file share can be a member of only one Cloud Endpoint. Therefore, an Azure file share can be a member of only one Sync Group. If you add an Azure file share that has an existing set of files as a Cloud Endpoint to a Sync Group, the existing files are merged with any other files that are already on other endpoints in the Sync Group.

> [!Important]  
> Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a Cloud Endpoint only once every 24 hours. For more information, see [Azure Files frequently asked questions](storage-files-faq.md#afs-change-detection).

### Cloud tiering 
Cloud tiering is an optional feature of Azure File Sync in which infrequently used or accessed files can be tiered to Azure Files. When a file is tiered, the Azure File Sync file system filter (StorageSync.sys) replaces the file locally with a pointer, or reparse point. The reparse point represents a URL to the file in Azure Files. A tiered file has the "offline" attribute set in NTFS so third-party applications can identify tiered files. When a user opens a tiered file, Azure File Sync seamlessly recalls the file data from Azure Files without the user needing to know that the file is not stored locally on the system. This functionality is also known as Hierarchical Storage Management (HSM).

## Azure File Sync interoperability 
This section covers Azure File Sync interoperability with Windows Server features and roles and third-party solutions.

### Supported versions of Windows Server
Currently, the supported versions of Windows Server by Azure File Sync are:

| Version | Supported SKUs | Supported deployment options |
|---------|----------------|------------------------------|
| Windows Server 2016 | Datacenter and Standard | Full (server with a UI) |
| Windows Server 2012 R2 | Datacenter and Standard | Full (server with a UI) |

Future versions of Windows Server will be added as they are released. Earlier versions of Windows might be added based on user feedback.

> [!Important]  
> We recommend keeping all Windows servers that you use with Azure File Sync up to date with the latest updates from Windows Update. 

### File system features
| Feature | Support status | Notes |
|---------|----------------|-------|
| Access control lists (ACLs) | Fully supported | Windows ACLs are preserved by Azure File Sync, and are enforced by Windows Server on Server Endpoints. Windows ACLs are not (yet) supported by Azure Files if files are accessed directly in the cloud. |
| Hard links | Skipped | |
| Symbolic links | Skipped | |
| Mount points | Partially supported | Mount points might be the root of a Server Endpoint, but they are skipped if they are contained in a Server Endpoint's namespace. |
| Junctions | Skipped | |
| Reparse points | Skipped | |
| NTFS compression | Fully supported | |
| Sparse files | Fully supported | Sparse files sync (are not blocked), but they sync to the cloud as a full file. If the file contents change in the cloud (or on another server), the file is no longer sparse when the change is downloaded. |
| Alternate Data Streams (ADS) | Preserved, but not synced | |

> [!Note]  
> Only NTFS volumes are supported.

### Failover Clustering
Windows Server Failover Clustering is supported by Azure File Sync for the "File Server for general use" deployment option. Failover Clustering is not supported on "Scale-Out File Server for application data" (SOFS) or on Clustered Shared Volumes (CSVs).

> [!Note]  
> The Azure File Sync agent must be installed on every node in a Failover Cluster for sync to work correctly.

### Data Deduplication
For volumes that don't have cloud tiering enabled, Azure File Sync supports Windows Server Data Deduplication being enabled on the volume. Currently, we do not support interoperability between Azure File Sync with cloud tiering enabled and Data Deduplication.

### Antivirus solutions
Because antivirus works by scanning files for known malicious code, an antivirus product might cause the recall of tiered files. Because tiered files have the "offline" attribute set, we recommend consulting with your software vendor to learn how to configure their solution to skip reading offline files. 

The following solutions are known to support skipping offline files:

- [Symantec Endpoint Protection](https://support.symantec.com/en_US/article.tech173752.html)
- [McAfee EndPoint Security](https://kc.mcafee.com/resources/sites/MCAFEE/content/live/PRODUCT_DOCUMENTATION/26000/PD26799/en_US/ens_1050_help_0-00_en-us.pdf) (see "Scan only what you need to" on page 90 of the PDF)
- [Kaspersky Anti-Virus](https://support.kaspersky.com/4684)
- [Sophos Endpoint Protection](https://community.sophos.com/kb/en-us/40102)
- [TrendMicro OfficeScan](https://success.trendmicro.com/solution/1114377-preventing-performance-or-backup-and-restore-issues-when-using-commvault-software-with-osce-11-0#collapseTwo) 

### Backup solutions
Like antivirus solutions, backup solutions might cause the recall of tiered files. We recommend using a cloud backup solution to back up the Azure file share instead of an on-premises backup product.

### Encryption solutions
Support for encryption solutions depends on how they are implemented. Azure File Sync is known to work with:

- BitLocker encryption
- Azure Rights Management Services (Azure RMS) (and legacy Active Directory RMS)

Azure File Sync is known not to work with:

- NTFS Encrypted File System (EFS)

In general, Azure File Sync should support interoperability with encryption solutions that sit below the file system, such as BitLocker, and with solutions that are implemented in the file format, such as BitLocker. No special interoperability has been made for solutions that sit above the file system (like NTFS EFS).

### Other Hierarchical Storage Management (HSM) solutions
No other HSM solutions should be used with Azure File Sync.

## Region availability
Azure File Sync is available only in the following regions in preview:

| Region | Datacenter location |
|--------|---------------------|
| West US | California, USA |
| West Europe | Netherlands |
| South East Asia | Singapore |
| Australia East | New South Wales, Australia |

In preview, we support syncing only with an Azure file share that's in the same region as the Storage Sync Service.

## Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Next steps
* [Planning for an Azure Files deployment](storage-files-planning.md)
* [Deploy Azure Files](storage-files-deployment-guide.md)
* [Deploy Azure File Sync](storage-sync-files-deployment-guide.md)
