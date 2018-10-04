---
title: Planning for an Azure File Sync deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
services: storage
author: wmgries
ms.service: storage
ms.topic: article
ms.date: 07/19/2018
ms.author: wgries
ms.component: files
---

# Planning for an Azure File Sync deployment
Use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article describes important considerations for an Azure File Sync deployment. We recommend that you also read [Planning for an Azure Files deployment](storage-files-planning.md). 

## Azure File Sync terminology
Before getting into the details of planning for an Azure File Sync deployment, it's important to understand the terminology.

### Storage Sync Service
The Storage Sync Service is the top-level Azure resource for Azure File Sync. The Storage Sync Service resource is a peer of the storage account resource, and can similarly be deployed to Azure resource groups. A distinct top-level resource from the storage account resource is required because the Storage Sync Service can create sync relationships with multiple storage accounts via multiple sync groups. A subscription can have multiple Storage Sync Service resources deployed.

### Sync group
A sync group defines the sync topology for a set of files. Endpoints within a sync group are kept in sync with each other. If, for example, you have two distinct sets of files that you want to manage with Azure File Sync, you would create two sync groups and add different endpoints to each sync group. A Storage Sync Service can host as many sync groups as you need.  

### Registered server
The registered server object represents a trust relationship between your server (or cluster) and the Storage Sync Service. You can register as many servers to a Storage Sync Service instance as you want. However, a server (or cluster) can be registered with only one Storage Sync Service at a time.

### Azure File Sync agent
The Azure File Sync agent is a downloadable package that enables Windows Server to be synced with an Azure file share. The Azure File Sync agent has three main components: 
- **FileSyncSvc.exe**: The background Windows service that is responsible for monitoring changes on server endpoints, and for initiating sync sessions to Azure.
- **StorageSync.sys**: The Azure File Sync file system filter, which is responsible for tiering files to Azure Files (when cloud tiering is enabled).
- **PowerShell management cmdlets**: PowerShell cmdlets that you use to interact with the Microsoft.StorageSync Azure resource provider. You can find these at the following (default) locations:
    - C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.PowerShell.Cmdlets.dll
    - C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll

### Server endpoint
A server endpoint represents a specific location on a registered server, such as a folder on a server volume. Multiple server endpoints can exist on the same volume if their namespaces do not overlap (for example, `F:\sync1` and `F:\sync2`). You can configure cloud tiering policies individually for each server endpoint. 

You can create a server endpoint via a mountpoint. Note, mountpoints within the server endpoint are skipped.  

You can create a server endpoint on the system volume but, there are two limitations if you do so:
* Cloud tiering cannot be enabled.
* Rapid namespace restore (where the system quickly brings down the entire namespace and then starts to recall content) is not performed.


> [!Note]  
> Only non-removable volumes are supported.  Drives mapped from a remote share are not supported for a server endpoint path.  In addition, a server endpoint may be located on the Windows system volume though cloud tiering is not supported on the system volume.

If you add a server location that has an existing set of files as a server endpoint to a sync group, those files are merged with any other files that are already on other endpoints in the sync group.

### Cloud endpoint
A cloud endpoint is an Azure file share that is part of a sync group. The entire Azure file share syncs, and an Azure file share can be a member of only one cloud endpoint. Therefore, an Azure file share can be a member of only one sync group. If you add an Azure file share that has an existing set of files as a cloud endpoint to a sync group, the existing files are merged with any other files that are already on other endpoints in the sync group.

> [!Important]  
> Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint only once every 24 hours. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync. For more information, see [Azure Files frequently asked questions](storage-files-faq.md#afs-change-detection).

### Cloud tiering 
Cloud tiering is an optional feature of Azure File Sync in which frequently accessed files are cached locally on the server while all other files are tiered to Azure Files based on policy settings. For more information, see [Understanding Cloud Tiering](storage-sync-cloud-tiering.md).

## Azure File Sync system requirements and interoperability 
This section covers Azure File Sync agent system requirements and interoperability with Windows Server features and roles and third-party solutions.

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an AzureRM PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. Note that its checks cover most but not all of the features mentioned below; we recommend you read through the rest of this section carefully to ensure your deployment goes smoothly. 

#### Download Instructions
1. Make sure that you have the latest version of PackageManagement and PowerShellGet installed (this allows you to install preview modules)
    
    ```PowerShell
        Install-Module -Name PackageManagement -Repository PSGallery -Force
        Install-Module -Name PowerShellGet -Repository PSGallery -Force
    ```
 
2. Restart PowerShell
3. Install the modules
    
    ```PowerShell
        Install-Module -Name AzureRM.StorageSync -AllowPrerelease
    ```

#### Usage  
You can invoke the evaluation tool in a few different ways: you can perform the system checks, the dataset checks, or both. To perform both the system and dataset checks: 

```PowerShell
    Invoke-AzureRmStorageSyncCompatibilityCheck -Path <path>
```

To test only your dataset:
```PowerShell
    Invoke-AzureRmStorageSyncCompatibilityCheck -Path <path> -SkipSystemChecks
```
 
To test system requirements only:
```PowerShell
    Invoke-AzureRmStorageSyncCompatibilityCheck -ComputerName <computer name>
```
 
To display the results in CSV:
```PowerShell
    $errors = Invoke-AzureRmStorageSyncCompatibilityCheck […]
    $errors | Select-Object -Property Type, Path, Level, Description | Export-Csv -Path <csv path>
```

### System Requirements
- A server running Windows Server 2012 R2 or Windows Server 2016:

    | Version | Supported SKUs | Supported deployment options |
    |---------|----------------|------------------------------|
    | Windows Server 2016 | Datacenter and Standard | Full (server with a UI) |
    | Windows Server 2012 R2 | Datacenter and Standard | Full (server with a UI) |

    Future versions of Windows Server will be added as they are released. Earlier versions of Windows might be added based on user feedback.

    > [!Important]  
    > We recommend keeping all servers that you use with Azure File Sync up to date with the latest updates from Windows Update. 

- A server with a minimum of 2 GiB of memory.

    > [!Important]  
    > If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory.
    
- A locally attached volume formatted with the NTFS file system.

### File system features
| Feature | Support status | Notes |
|---------|----------------|-------|
| Access control lists (ACLs) | Fully supported | Windows ACLs are preserved by Azure File Sync, and are enforced by Windows Server on server endpoints. Windows ACLs are not (yet) supported by Azure Files if files are accessed directly in the cloud. |
| Hard links | Skipped | |
| Symbolic links | Skipped | |
| Mount points | Partially supported | Mount points might be the root of a server endpoint, but they are skipped if they are contained in a server endpoint's namespace. |
| Junctions | Skipped | For example, Distributed File System DfrsrPrivate and DFSRoots folders. |
| Reparse points | Skipped | |
| NTFS compression | Fully supported | |
| Sparse files | Fully supported | Sparse files sync (are not blocked), but they sync to the cloud as a full file. If the file contents change in the cloud (or on another server), the file is no longer sparse when the change is downloaded. |
| Alternate Data Streams (ADS) | Preserved, but not synced | For example, classification tags created by the File Classification Infrastructure are not synced. Existing classification tags on files on each of the server endpoints are left untouched. |

> [!Note]  
> Only NTFS volumes are supported. ReFS, FAT, FAT32, and other file systems are not supported.

### Files skipped
| File/folder | Note |
|-|-|
| Desktop.ini | File specific to system |
| ethumbs.db$ | Temporary file for thumbnails |
| ~$\*.\* | Office temporary file |
| \*.tmp | Temporary file |
| \*.laccdb | Access DB locking file|
| 635D02A9D91C401B97884B82B3BCDAEA.* | Internal Sync file|
| \\System Volume Information | Folder specific to volume |
| $RECYCLE.BIN| Folder |
| \\SyncShareState | Folder for Sync |

### Failover Clustering
Windows Server Failover Clustering is supported by Azure File Sync for the "File Server for general use" deployment option. Failover Clustering is not supported on "Scale-Out File Server for application data" (SOFS) or on Clustered Shared Volumes (CSVs).

> [!Note]  
> The Azure File Sync agent must be installed on every node in a Failover Cluster for sync to work correctly.

### Data Deduplication
For volumes that don't have cloud tiering enabled, Azure File Sync supports Windows Server Data Deduplication being enabled on the volume. Currently, we do not support interoperability between Azure File Sync with cloud tiering enabled and Data Deduplication.

### Distributed File System (DFS)
Azure File Sync supports interop with DFS Namespaces (DFS-N) and DFS Replication (DFS-R) starting with [Azure File Sync agent 1.2](https://go.microsoft.com/fwlink/?linkid=864522).

**DFS Namespaces (DFS-N)**: Azure File Sync is fully supported on DFS-N servers. You can install the Azure File Sync agent on one or more DFS-N members to sync data between the server endpoints and the cloud endpoint. For more information, see [DFS Namespaces overview](https://docs.microsoft.com/windows-server/storage/dfs-namespaces/dfs-overview).
 
**DFS Replication (DFS-R)**: Since DFS-R and Azure File Sync are both replication solutions, in most cases, we recommend replacing DFS-R with Azure File Sync. There are however several scenarios where you would want to use DFS-R and Azure File Sync together:

- You are migrating from a DFS-R deployment to an Azure File Sync deployment. For more information, see [Migrate a DFS Replication (DFS-R) deployment to Azure File Sync](storage-sync-files-deployment-guide.md#migrate-a-dfs-replication-dfs-r-deployment-to-azure-file-sync).
- Not every on-premises server which needs a copy of your file data can be connected directly to the internet.
- Branch servers consolidate data onto a single hub server, for which you would like to use Azure File Sync.

For Azure File Sync and DFS-R to work side-by-side:

1. Azure File Sync cloud tiering must be disabled on volumes with DFS-R replicated folders.
2. Server endpoints should not be configured on DFS-R read-only replication folders.

For more information, see [DFS Replication overview](https://technet.microsoft.com/library/jj127250).

### Sysprep
Using sysprep on a server which has the Azure File Sync agent installed is not supported and can lead to unexpected results. Agent installation and server registration should occur after deploying the server image and completing sysprep mini-setup.

### Windows Search
If cloud tiering is enabled on a server endpoint, files that are tiered are skipped and not indexed by Windows Search. Non-tiered files are indexed properly.

### Antivirus solutions
Because antivirus works by scanning files for known malicious code, an antivirus product might cause the recall of tiered files. Because tiered files have the "offline" attribute set, we recommend consulting with your software vendor to learn how to configure their solution to skip reading offline files. 

The following solutions are known to support skipping offline files:

- [Windows Defender](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/configure-extension-file-exclusions-windows-defender-antivirus)
    - Windows Defender automatically skips reading files that have the offline attribute set. We have tested Defender and identified one minor issue: when you add a server to an existing sync group, files smaller than 800 bytes are recalled (downloaded) on the new server. These files will remain on the new server and will not be tiered since they do not meet the tiering size requirement (>64kb).
- [System Center Endpoint Protection (SCEP)](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/configure-extension-file-exclusions-windows-defender-antivirus)
    - SCEP works the same as Defender; see above
- [Symantec Endpoint Protection](https://support.symantec.com/en_US/article.tech173752.html)
- [McAfee EndPoint Security](https://kc.mcafee.com/resources/sites/MCAFEE/content/live/PRODUCT_DOCUMENTATION/26000/PD26799/en_US/ens_1050_help_0-00_en-us.pdf) (see "Scan only what you need to" on page 90 of the PDF)
- [Kaspersky Anti-Virus](https://support.kaspersky.com/4684)
- [Sophos Endpoint Protection](https://community.sophos.com/kb/en-us/40102)
- [TrendMicro OfficeScan](https://success.trendmicro.com/solution/1114377-preventing-performance-or-backup-and-restore-issues-when-using-commvault-software-with-osce-11-0#collapseTwo) 

### Backup solutions
Like antivirus solutions, backup solutions might cause the recall of tiered files. We recommend using a cloud backup solution to back up the Azure file share instead of an on-premises backup product.

If you are using an on-premises backup solution, backups should be performed on a server in the sync group which has cloud tiering disabled. When restoring files within the server endpoint location, use the file level restore option. Files restored will be synced to all endpoints in the sync group and existing files will be replaced with the version restored from backup.

> [!Note]  
> Application-aware, volume-level and bare-metal (BMR) restore options can cause unexpected results and are not currently supported. These restore options will be supported in a future release.

### Encryption solutions
Support for encryption solutions depends on how they are implemented. Azure File Sync is known to work with:

- BitLocker encryption
- Azure Information Protection, Azure Rights Management Services (Azure RMS), and Active Directory RMS

Azure File Sync is known not to work with:

- NTFS Encrypted File System (EFS)

In general, Azure File Sync should support interoperability with encryption solutions that sit below the file system, such as BitLocker, and with solutions that are implemented in the file format, such as Azure Information Protection. No special interoperability has been made for solutions that sit above the file system (like NTFS EFS).

### Other Hierarchical Storage Management (HSM) solutions
No other HSM solutions should be used with Azure File Sync.

## Region availability
Azure File Sync is available only in the following regions:

| Region | Datacenter location |
|--------|---------------------|
| Australia East | New South Wales |
| Australia Southeast | Victoria |
| Canada Central | Toronto |
| Canada East | Quebec City |
| Central India | Pune |
| Central US | Iowa |
| East Asia | Hong Kong |
| East US | Virginia |
| East US2 | Virginia |
| North Europe | Ireland |
| South India | Chennai |
| Southeast Asia | Singapore |
| UK South | London |
| UK West | Cardiff |
| West Europe | Netherlands |
| West US | California |

Azure File Sync supports syncing only with an Azure file share that's in the same region as the Storage Sync Service.

### Azure disaster recovery
To protect against the loss of an Azure region, Azure File Sync integrates with the [geo-redundant storage redundancy](../common/storage-redundancy-grs.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) (GRS) option. GRS storage works by using asynchronous block replication between storage in the primary region, with which you normally interact, and storage in the paired secondary region. In the event of a disaster which causes an Azure region to go temporarily or permanently offline, Microsoft will fail over storage to the paired region. 

To support the failover integration between geo-redundant storage and Azure File Sync, all Azure File Sync regions are paired with a secondary region that matches the secondary region used by storage. These pairs are as follows:

| Primary region      | Paired region      |
|---------------------|--------------------|
| Australia East      | Australia Southeast |
| Australia Southeast | Australia East     |
| Canada Central      | Canada East        |
| Canada East         | Canada Central     |
| Central India       | South India        |
| Central US          | East US 2          |
| East Asia           | Southeast Asia     |
| East US             | West US            |
| East US 2           | Central US         |
| North Europe        | West Europe        |
| South India         | Central India      |
| Southeast Asia      | East Asia          |
| UK South            | UK West            |
| UK West             | UK South           |
| West Europe         | North Europe       |
| West US             | East US            |

## Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Next steps
* [Consider firewall and proxy settings](storage-sync-files-firewall-and-proxy.md)
* [Planning for an Azure Files deployment](storage-files-planning.md)
* [Deploy Azure Files](storage-files-deployment-guide.md)
* [Deploy Azure File Sync](storage-sync-files-deployment-guide.md)
