---
title: Planning for an Azure File Sync deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 01/15/2020
ms.author: rogarana
ms.subservice: files
---

# Planning for an Azure File Sync deployment

:::row:::
    :::column:::
        [![Interview and demo introducing Azure File Sync - click to play!](./media/storage-sync-files-planning/azure-file-sync-interview-video-snapshot.png)](https://www.youtube.com/watch?v=nfWLO7F52-s)
    :::column-end:::
    :::column:::
        Azure File Sync is a service that allows you to cache a number of Azure file shares on an on-premises Windows Server or cloud VM. 
        
        This article introduces you to Azure File Sync concepts and features. Once you are familiar with Azure File Sync, consider following the [Azure File Sync deployment guide](storage-sync-files-deployment-guide.md) to try out this service.        
    :::column-end:::
:::row-end:::

The files will be stored in the cloud in [Azure file shares](storage-files-introduction.md). Azure file shares can be used in two ways: by directly mounting these serverless Azure file shares (SMB) or by caching Azure file shares on-premises using Azure File Sync. Which deployment option you choose changes the aspects you need to consider as you plan for your deployment. 

- **Direct mount of an Azure file share**: Since Azure Files provides SMB access, you can mount Azure file shares on-premises or in the cloud using the standard SMB client available in Windows, macOS, and Linux. Because Azure file shares are serverless, deploying for production scenarios does not require managing a file server or NAS device. This means you don't have to apply software patches or swap out physical disks. 

- **Cache Azure file share on-premises with Azure File Sync**: Azure File Sync enables you to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms an on-premises (or cloud) Windows Server into a quick cache of your Azure file share. 

## Management concepts
An Azure File Sync deployment has three fundamental management objects:

- **Azure file share**: An Azure file share is a serverless cloud file share, which provides the *cloud endpoint* of an Azure File Sync sync relationship. Files in an Azure file share can be accessed directly with SMB or the FileREST protocol, although we encourage you to primarily access the files through the Windows Server cache when the Azure file share is being used with Azure File Sync. This is because Azure Files today lacks an efficient change detection mechanism like Windows Server has, so changes to the Azure file share directly will take time to propagate back to the server endpoints.
- **Server endpoint**: The path on the Windows Server that is being synced to an Azure file share. This can be a specific folder on a volume or the root of the volume. Multiple server endpoints can exist on the same volume if their namespaces do not overlap.
- **Sync group**: The object that defines the sync relationship between a **cloud endpoint**, or Azure file share, and a server endpoint. Endpoints within a sync group are kept in sync with each other. If for example, you have two distinct sets of files that you want to manage with Azure File Sync, you would create two sync groups and add different endpoints to each sync group.

### Azure file share management concepts
[!INCLUDE [storage-files-file-share-management-concepts](../../../includes/storage-files-file-share-management-concepts.md)]

### Azure File Sync management concepts
Sync groups are deployed into **Storage Sync Services**, which are top-level objects that register servers for use with Azure File Sync and contain the sync group relationships. The Storage Sync Service resource is a peer of the storage account resource, and can similarly be deployed to Azure resource groups. A Storage Sync Service can create sync groups that contain Azure file shares across multiple storage accounts and multiple registered Windows Servers.

Before you can create a sync group in a Storage Sync Service, you must first register a Windows Server with the Storage Sync Service. This creates a **registered server** object, which represents a trust relationship between your server or cluster and the Storage Sync Service. To register a Storage Sync Service, you must first install the Azure File Sync agent on the server. An individual server or cluster can be registered with only one Storage Sync Service at a time.

A sync group contains one cloud endpoint, or Azure file share, and at least one server endpoint. The server endpoint object contains the settings that configure the **cloud tiering** capability, which provides the caching capability of Azure File Sync. In order to sync with an Azure file share, the storage account containing the Azure file share must be in the same Azure region as the Storage Sync Service.

### Management guidance
When deploying Azure File Sync, we recommend:

- Deploying Azure file shares 1:1 with Windows file shares. The server endpoint object gives you a great degree of flexibility on how you set up the sync topology on the server-side of the sync relationship. To simplify management, make the path of the server endpoint match the path of the Windows file share. 

- Use as few Storage Sync Services as possible. This will simplify management when you have sync groups that contain multiple server endpoints, since a Windows Server can only be registered to one Storage Sync Service at a time. 

- Paying attention to a storage account's IOPS limitations when deploying Azure file shares. Ideally, you would map file shares 1:1 with storage accounts, however this may not always be possible due to various limits and restrictions, both from your organization and from Azure. When it is not possible to have only one file share deployed in one storage account, consider which shares will be highly active and which shares will be less active to ensure that the hottest file shares don't get put in the same storage account together.

## Windows file server considerations
To enable the sync capability on Windows Server, you must install the Azure File Sync downloadable agent. The Azure File Sync agent provides two main components: `FileSyncSvc.exe`, the background Windows service that is responsible for monitoring changes on the server endpoints and initiating sync sessions, and `StorageSync.sys`, a file system filter that enables cloud tiering and fast disaster recovery.  

### Operating system requirements
Azure File Sync is supported with the following versions of Windows Server:

| Version | Supported SKUs | Supported deployment options |
|---------|----------------|------------------------------|
| Windows Server 2019 | Datacenter, Standard, and IoT | Full and Core |
| Windows Server 2016 | Datacenter, Standard, and Storage Server | Full and Core |
| Windows Server 2012 R2 | Datacenter, Standard, and Storage Server | Full and Core |

Future versions of Windows Server will be added as they are released.

> [!Important]  
> We recommend keeping all servers that you use with Azure File Sync up to date with the latest updates from Windows Update. 

### Minimum system resources
Azure File Sync requires a server, either physical or virtual, with at least one CPU and a minimum of 2 GiB of memory.

> [!Important]  
> If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum of 2048 MiB of memory.

For most production workloads, we do not recommend configuring an Azure File Sync sync server with only the minimum requirements. See [Recommended system resources](#recommended-system-resources) for more information.

### Recommended system resources
Just like any server feature or application, the system resource requirements for Azure File Sync are determined by the scale of the deployment; larger deployments on a server require greater system resources. For Azure File Sync, scale is determined by the number of objects across the server endpoints and the churn on the dataset. A single server can have server endpoints in multiple sync groups and the number of objects listed in the following table accounts for the full namespace that a server is attached to. 

For example, server endpoint A with 10 million objects + server endpoint B with 10 million objects = 20 million objects. For that example deployment, we would recommend 8 CPUs, 16 GiB of memory for steady state, and (if possible) 48 GiB of memory for the initial migration.
 
Namespace data is stored in memory for performance reasons. Because of that, bigger namespaces require more memory to maintain good performance, and more churn requires more CPU to process. 
 
In the following table, we have provided both the size of the namespace as well as a conversion to capacity for typical general purpose file shares, where the average file size is 512 KiB. If your file sizes are smaller, consider adding additional memory for the same amount of capacity. Base your memory configuration on the size of the namespace.

| Namespace size - files & directories (millions)  | Typical capacity (TiB)  | CPU Cores  | Recommended memory (GiB) |
|---------|---------|---------|---------|
| 3        | 1.4     | 2        | 8 (initial sync)/ 2 (typical churn)      |
| 5        | 2.3     | 2        | 16 (initial sync)/ 4 (typical churn)    |
| 10       | 4.7     | 4        | 32  (initial sync)/ 8 (typical churn)   |
| 30       | 14.0    | 8        | 48 (initial sync)/ 16 (typical churn)   |
| 50       | 23.3    | 16       | 64  (initial sync)/ 32 (typical churn)  |
| 100*     | 46.6    | 32       | 128 (initial sync)/ 32 (typical churn)  |

\*Syncing more than 100 million files & directories is not recommended at this time. This is a soft limit based on our tested thresholds. For more information, see [Azure Files scalability and performance targets](storage-files-scale-targets.md#azure-file-sync-scale-targets).

> [!TIP]
> Initial synchronization of a namespace is an intensive operation and we recommend allocating more memory until initial synchronization is complete. This isn't required but, may speed up initial sync. 
> 
> Typical churn is 0.5% of the namespace changing per day. For higher levels of churn, consider adding more CPU. 

- A locally attached volume formatted with the NTFS file system.

### Evaluation cmdlet
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation cmdlet. This cmdlet checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported operating system version. Its checks cover most but not all of the features mentioned below; we recommend you read through the rest of this section carefully to ensure your deployment goes smoothly. 

The evaluation cmdlet can be installed by installing the Az PowerShell module, which can be installed by following the instructions here: [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-Az-ps).

#### Usage  
You can invoke the evaluation tool in a few different ways: you can perform the system checks, the dataset checks, or both. To perform both the system and dataset checks: 

```powershell
Invoke-AzStorageSyncCompatibilityCheck -Path <path>
```

To test only your dataset:
```powershell
Invoke-AzStorageSyncCompatibilityCheck -Path <path> -SkipSystemChecks
```
 
To test system requirements only:
```powershell
Invoke-AzStorageSyncCompatibilityCheck -ComputerName <computer name>
```
 
To display the results in CSV:
```powershell
$errors = Invoke-AzStorageSyncCompatibilityCheck […]
$errors | Select-Object -Property Type, Path, Level, Description | Export-Csv -Path <csv path>
```

### File system compatibility
Azure File Sync is only supported on directly attached, NTFS volumes. Direct attached storage, or DAS, on Windows Server means that the Windows Server operating system owns the file system. DAS can be provided through physically attaching disks to the file server, attaching virtual disks to a file server VM (such as a VM hosted by Hyper-V), or even through ISCSI.

Only NTFS volumes are supported; ReFS, FAT, FAT32, and other file systems are not supported.

The following table shows the interop state of NTFS file system features: 

| Feature | Support status | Notes |
|---------|----------------|-------|
| Access control lists (ACLs) | Fully supported | Windows-style discretionary access control lists are preserved by Azure File Sync, and are enforced by Windows Server on server endpoints. ACLs can also be enforced when directly mounting the Azure file share, however this requires additional configuration. See the [Identity section](#identity) for more information. |
| Hard links | Skipped | |
| Symbolic links | Skipped | |
| Mount points | Partially supported | Mount points might be the root of a server endpoint, but they are skipped if they are contained in a server endpoint's namespace. |
| Junctions | Skipped | For example, Distributed File System DfrsrPrivate and DFSRoots folders. |
| Reparse points | Skipped | |
| NTFS compression | Fully supported | |
| Sparse files | Fully supported | Sparse files sync (are not blocked), but they sync to the cloud as a full file. If the file contents change in the cloud (or on another server), the file is no longer sparse when the change is downloaded. |
| Alternate Data Streams (ADS) | Preserved, but not synced | For example, classification tags created by the File Classification Infrastructure are not synced. Existing classification tags on files on each of the server endpoints are left untouched. |

<a id="files-skipped"></a>Azure File Sync will also skip certain temporary files and system folders:

| File/folder | Note |
|-|-|
| pagefile.sys | File specific to system |
| Desktop.ini | File specific to system |
| thumbs.db | Temporary file for thumbnails |
| ehthumbs.db | Temporary file for media thumbnails |
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
**Windows Server 2016 and Windows Server 2019**   
Data Deduplication is supported on volumes with cloud tiering enabled on Windows Server 2016 and Windows Server 2019. Enabling Data Deduplication on a volume with cloud tiering enabled lets you cache more files on-premises without provisioning more storage. 

When Data Deduplication is enabled on a volume with cloud tiering enabled, Dedup optimized files within the server endpoint location will be tiered similar to a normal file based on the cloud tiering policy settings. Once the Dedup optimized files have been tiered, the Data Deduplication garbage collection job will run automatically to reclaim disk space by removing unnecessary chunks that are no longer referenced by other files on the volume.

Note the volume savings only apply to the server; your data in the Azure file share will not be deduped.

> [!Note]  
> To support Data Deduplication on volumes with cloud tiering enabled on Windows Server 2019, Windows update [KB4520062](https://support.microsoft.com/help/4520062) must be installed and Azure File Sync agent version 9.0.0.0 or newer is required.

**Windows Server 2012 R2**  
Azure File Sync does not support Data Deduplication and cloud tiering on the same volume on Windows Server 2012 R2. If Data Deduplication is enabled on a volume, cloud tiering must be disabled. 

**Notes**
- If Data Deduplication is installed prior to installing the Azure File Sync agent, a restart is required to support Data Deduplication and cloud tiering on the same volume.
- If Data Deduplication is enabled on a volume after cloud tiering is enabled, the initial Deduplication optimization job will optimize files on the volume that are not already tiered and will have the following impact on cloud tiering:
    - Free space policy will continue to tier files as per the free space on the volume by using the heatmap.
    - Date policy will skip tiering of files that may have been otherwise eligible for tiering due to the Deduplication optimization job accessing the files.
- For ongoing Deduplication optimization jobs, cloud tiering with date policy will get delayed by the Data Deduplication [MinimumFileAgeDays](https://docs.microsoft.com/powershell/module/deduplication/set-dedupvolume?view=win10-ps) setting, if the file is not already tiered. 
    - Example: If the MinimumFileAgeDays setting is seven days and cloud tiering date policy is 30 days, the date policy will tier files after 37 days.
    - Note: Once a file is tiered by Azure File Sync, the Deduplication optimization job will skip the file.
- If a server running Windows Server 2012 R2 with the Azure File Sync agent installed is upgraded to Windows Server 2016 or Windows Server 2019, the following steps must be performed to support Data Deduplication and cloud tiering on the same volume:  
    - Uninstall the Azure File Sync agent for Windows Server 2012 R2 and restart the server.
    - Download the Azure File Sync agent for the new server operating system version (Windows Server 2016 or Windows Server 2019).
    - Install the Azure File Sync agent and restart the server.  
    
    Note: The Azure File Sync configuration settings on the server are retained when the agent is uninstalled and reinstalled.

### Distributed File System (DFS)
Azure File Sync supports interop with DFS Namespaces (DFS-N) and DFS Replication (DFS-R).

**DFS Namespaces (DFS-N)**: Azure File Sync is fully supported on DFS-N servers. You can install the Azure File Sync agent on one or more DFS-N members to sync data between the server endpoints and the cloud endpoint. For more information, see [DFS Namespaces overview](https://docs.microsoft.com/windows-server/storage/dfs-namespaces/dfs-overview).
 
**DFS Replication (DFS-R)**: Since DFS-R and Azure File Sync are both replication solutions, in most cases, we recommend replacing DFS-R with Azure File Sync. There are however several scenarios where you would want to use DFS-R and Azure File Sync together:

- You are migrating from a DFS-R deployment to an Azure File Sync deployment. For more information, see [Migrate a DFS Replication (DFS-R) deployment to Azure File Sync](storage-sync-files-deployment-guide.md#migrate-a-dfs-replication-dfs-r-deployment-to-azure-file-sync).
- Not every on-premises server that needs a copy of your file data can be connected directly to the internet.
- Branch servers consolidate data onto a single hub server, for which you would like to use Azure File Sync.

For Azure File Sync and DFS-R to work side by side:

1. Azure File Sync cloud tiering must be disabled on volumes with DFS-R replicated folders.
2. Server endpoints should not be configured on DFS-R read-only replication folders.

For more information, see [DFS Replication overview](https://technet.microsoft.com/library/jj127250).

### Sysprep
Using sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. Agent installation and server registration should occur after deploying the server image and completing sysprep mini-setup.

### Windows Search
If cloud tiering is enabled on a server endpoint, files that are tiered are skipped and not indexed by Windows Search. Non-tiered files are indexed properly.

### Other Hierarchical Storage Management (HSM) solutions
No other HSM solutions should be used with Azure File Sync.

## Identity
Azure File Sync works with your standard AD-based identity without any special setup beyond setting up sync. When you are using Azure File Sync, the general expectation is that most accesses go through the Azure File Sync caching servers, rather than through the Azure file share. Since the server endpoints are located on Windows Server, and Windows Server has supported AD and Windows-style ACLs for a long time, nothing is needed beyond ensuring the Windows file servers registered with the Storage Sync Service are domain joined. Azure File Sync will store ACLs on the files in the Azure file share, and will replicate them to all server endpoints.

Even though changes made directly to the Azure file share will take longer to sync to the server endpoints in the sync group, you may also want to ensure that you can enforce your AD permissions on your file share directly in the cloud as well. To do this, you must domain join your storage account to your on-premises AD, just like how your Windows file servers are domain joined. To learn more about domain joining your storage account to a customer-owned Active Directory, see [Azure Files Active Directory overview](storage-files-active-directory-overview.md).

> [!Important]  
> Domain joining your storage account to Active Directory is not required to successfully deploy Azure File Sync. This is a strictly optional step that allows the Azure file share to enforce on-premises ACLs when users mount the Azure file share directly.

## Networking
The Azure File Sync agent communicates with your Storage Sync Service and Azure file share using the Azure File Sync REST protocol and the FileREST protocol, both of which always use HTTPS over port 443. SMB is never used to upload or download data between your Windows Server and the Azure file share. Because most organizations allow HTTPS traffic over port 443, as a requirement for visiting most websites, special networking configuration is usually not required to deploy Azure File Sync.

Based on your organization's policy or unique regulatory requirements, you may require more restrictive communication with Azure, and therefore Azure File Sync provides several mechanisms for you configure networking. Based on your requirements, you can:

- Tunnel sync and file upload/download traffic over your ExpressRoute or Azure VPN. 
- Make use of Azure Files and Azure Networking features such as service endpoints and private endpoints.
- Configure Azure File Sync to support your proxy in your environment.
- Throttle network activity from Azure File Sync.

To learn more about Azure File Sync and networking, see [Azure File Sync networking considerations](storage-sync-files-networking-overview.md).

## Encryption
When using Azure File Sync, there are three different layers of encryption to consider: encryption on the at-rest storage of Windows Server, encryption in transit between the Azure File Sync agent and Azure, and encryption at rest of your data in the Azure file share. 

### Windows Server encryption at rest 
There are two strategies for encrypting data on Windows Server that work generally with Azure File Sync: encryption beneath the file system such that the file system and all of the data written to it is encrypted, and encryption within the file format itself. These methods are not mutually exclusive; they can be used together if desired since the purpose of encryption is different.

To provide encryption beneath the file system, Windows Server provides BitLocker inbox. BitLocker is fully transparent to Azure File Sync. The primary reason to use an encryption mechanism like BitLocker is to prevent physical exfiltration of data from your on-premises datacenter by someone stealing the disks and to prevent sideloading an unauthorized OS to perform unauthorized reads/writes to your data. To learn more about BitLocker, see [BitLocker overview](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview).

Third-party products that work similarly to BitLocker, in that they sit beneath the NTFS volume, should similarly work fully transparently with Azure File Sync. 

The other main method for encrypting data is to encrypt the file's data stream when the application saves the file. Some applications may do this natively, however this is usually not the case. An example of a method for encrypting the file's data stream is Azure Information Protection (AIP)/Azure Rights Management Services (Azure RMS)/Active Directory RMS. The primary reason to use an encryption mechanism like AIP/RMS is to prevent data exfiltration of data from your file share by people copying it to alternate locations, like to a flash drive, or emailing it to an unauthorized person. When a file's data stream is encrypted as part of the file format, this file will continue to be encrypted on the Azure file share. 

Azure File Sync does not interoperate with NTFS Encrypted File System (NTFS EFS) or third-party encryption solutions that sit above the file system but below the file's data stream. 

### Encryption in transit

> [!NOTE]
> Azure File Sync service will remove support for TLS1.0 and 1.1 on August 1st, 2020. All supported Azure File Sync agent versions already use TLS1.2 by default. Using an earlier version of TLS could occur if TLS1.2 was disabled on your server or a proxy is used. If you are using a proxy, we recommend you check the proxy configuration. Azure File Sync service regions added after 5/1/2020 will only support TLS1.2 and support for TLS1.0 and 1.1 will be removed from existing regions on August 1st, 2020.  For more information, see the [troubleshooting guide](storage-sync-files-troubleshoot.md#tls-12-required-for-azure-file-sync).

Azure File Sync agent communicates with your Storage Sync Service and Azure file share using the Azure File Sync REST protocol and the FileREST protocol, both of which always use HTTPS over port 443. Azure File Sync does not send unencrypted requests over HTTP. 

Azure storage accounts contain a switch for requiring encryption in transit, which is enabled by default. Even if the switch at the storage account level is disabled, meaning that unencrypted connections to your Azure file shares are possible, Azure File Sync will still only used encrypted channels to access your file share.

The primary reason to disable encryption in transit for the storage account is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or older Linux distribution, talking to an Azure file share directly. If the legacy application talks to the Windows Server cache of the file share, toggling this setting will have no effect. 

We strongly recommend ensuring encryption of data in-transit is enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Azure file share encryption at rest
[!INCLUDE [storage-files-encryption-at-rest](../../../includes/storage-files-encryption-at-rest.md)]

## Storage tiers
[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]

### Enable standard file shares to span up to 100 TiB
[!INCLUDE [storage-files-tiers-enable-large-shares](../../../includes/storage-files-tiers-enable-large-shares.md)]

#### Regional availability
[!INCLUDE [storage-files-tiers-large-file-share-availability](../../../includes/storage-files-tiers-large-file-share-availability.md)]

## Azure file sync region availability
Azure File Sync is available in the following regions:

| Azure cloud | Geographic region | Azure region | Region code |
|-------------|-------------------|--------------|-------------|
| Public | Asia | East Asia | `eastasia` |
| Public | Asia | Southeast Asia | `southeastasia` |
| Public | Australia | Australia East | `australiaeast` |
| Public | Australia | Australia Southeast | `australiasoutheast` |
| Public | Brazil | Brazil South | `brazilsouth` |
| Public | Canada | Canada Central | `canadacentral` |
| Public | Canada | Canada East | `canadaeast` |
| Public | Europe | North Europe | `northeurope` |
| Public | Europe | West Europe | `westeurope` |
| Public | France | France Central | `francecentral` |
| Public | France | France South* | `francesouth` |
| Public | India | Central India | `centralindia` |
| Public | India | South India | `southindia` |
| Public | Japan | Japan East | `japaneast` |
| Public | Japan | Japan West | `japanwest` |
| Public | Korea | Korea Central | `koreacentral` |
| Public | Korea | Korea South | `koreasouth` |
| Public | South Africa | South Africa North | `southafricanorth` |
| Public | South Africa | South Africa West* | `southafricawest` |
| Public | UAE | UAE Central* | `uaecentral` |
| Public | UAE | UAE North | `uaenorth` |
| Public | UK | UK South | `uksouth` |
| Public | UK | UK West | `ukwest` |
| Public | US | Central US | `centralus` |
| Public | US | East US | `eastus` |
| Public | US | East US 2 | `eastus2` |
| Public | US | North Central US | `northcentralus` |
| Public | US | South Central US | `southcentralus` |
| Public | US | West Central US | `westcentralus` |
| Public | US | West US | `westus` |
| Public | US | West US 2 | `westus2` |
| US Gov | US | US Gov Arizona | `usgovarizona` |
| US Gov | US | US Gov Texas | `usgovtexas` |
| US Gov | US | US Gov Virginia | `usgovvirginia` |

Azure File Sync supports syncing only with an Azure file share that's in the same region as the Storage Sync Service.

For the regions marked with asterisks, you must contact Azure Support to request access to Azure Storage in those regions. The process is outlined in [this document](https://azure.microsoft.com/global-infrastructure/geographies/).

## Redundancy
[!INCLUDE [storage-files-redundancy-overview](../../../includes/storage-files-redundancy-overview.md)]

> [!Important]  
> Geo-redundant and Geo-zone redundant storage have the capability to manually failover storage to the secondary region. We recommend that you do not do this outside of a disaster when you are using Azure File Sync because of the increased likelihood of data loss. In the event of a disaster where you would like to initiate a manual failover of storage, you will need to open up a support case with Microsoft to get Azure File Sync to resume sync with the secondary endpoint.

## Migration
If you have an existing Windows file server, Azure File Sync can be directly installed in place, without the need to move data over to a new server. If you are planning to migrate to a new Windows file server as a part of adopting Azure File Sync, there are several possible approaches to move data over:

- Create server endpoints for your old file share and your new file share and let Azure File Sync synchronize the data between the server endpoints. The advantage to this approach is that it makes it very easy to oversubscribe the storage on your new file server, since Azure File Sync is cloud tiering aware. When you are ready, you can cut over end users to the file share on the new server and remove the old file share's server endpoint.

- Create a server endpoint only on the new file server, and copy data into from the old file share using `robocopy`. Depending on the topology of file shares on your new server (how many shares you have on each volume, how free each volume is, etc.), you may need to temporarily provision additional storage as it is expected that `robocopy` from your old server to your new server within your on-premises datacenter will complete faster than Azure File Sync will move data into Azure.

It is also possible to use Data Box to migrate data into an Azure File Sync deployment. Most of the time, when customers want to use Data Box to ingest data, they do so because they think it will increase the speed of their deployment or because it will help with constrained bandwidth scenarios. While it's true that using a Data Box to ingest data into your Azure File Sync deployment will decrease bandwidth utilization, it will likely be faster for most scenarios to pursue an online data upload through one of the methods described above. To learn more about how to use Data Box to ingest data into your Azure File Sync deployment, see [Migrate data into Azure File Sync with Azure Data Box](storage-sync-offline-data-transfer.md).

A common mistake customers make when migrating data into their new Azure File Sync deployment is to copy data directly into the Azure file share, rather than on their Windows file servers. Although Azure File Sync will identify all of the new files on the Azure file share, and sync them back to your Windows file shares, this is generally considerably slower than loading data through the Windows file server. When using Azure copy tools, such as AzCopy, it is important to use the latest version. Check the [file copy tools table](storage-files-migration-overview.md#file-copy-tools) to get an overview of Azure copy tools to ensure you can copy all of the important metadata of a file such as timestamps and ACLs.

## Antivirus
Because antivirus works by scanning files for known malicious code, an antivirus product might cause the recall of tiered files. In versions 4.0 and above of the Azure File Sync agent, tiered files have the secure Windows attribute FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS set. We recommend consulting with your software vendor to learn how to configure their solution to skip reading files with this attribute set (many do it automatically). 

Microsoft's in-house antivirus solutions, Windows Defender and System Center Endpoint Protection (SCEP), both automatically skip reading files that have this attribute set. We have tested them and identified one minor issue: when you add a server to an existing sync group, files smaller than 800 bytes are recalled (downloaded) on the new server. These files will remain on the new server and will not be tiered since they do not meet the tiering size requirement (>64kb).

> [!Note]  
> Antivirus vendors can check compatibility between their product and Azure File Sync using the [Azure File Sync Antivirus Compatibility Test Suite](https://www.microsoft.com/download/details.aspx?id=58322), which is available for download on the Microsoft Download Center.

## Backup 
Like antivirus solutions, backup solutions might cause the recall of tiered files. We recommend using a cloud backup solution to back up the Azure file share instead of an on-premises backup product.

If you are using an on-premises backup solution, backups should be performed on a server in the sync group that has cloud tiering disabled. When performing a restore, use the volume-level or file-level restore options. Files restored using the file-level restore option will be synced to all endpoints in the sync group and existing files will be replaced with the version restored from backup.  Volume-level restores will not replace newer file versions in the Azure file share or other server endpoints.

> [!Note]  
> Bare-metal (BMR) restore can cause unexpected results and is not currently supported.

> [!Note]  
> With Version 9 of the Azure File Sync agent, VSS snapshots (including Previous Versions tab) are now supported on volumes which have cloud tiering enabled. However, you must enable previous version compatibility through PowerShell. [Learn how](storage-files-deployment-guide.md).

## Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Next steps
* [Consider firewall and proxy settings](storage-sync-files-firewall-and-proxy.md)
* [Planning for an Azure Files deployment](storage-files-planning.md)
* [Deploy Azure Files](storage-files-deployment-guide.md)
* [Deploy Azure File Sync](storage-sync-files-deployment-guide.md)
* [Monitor Azure File Sync](storage-sync-files-monitoring.md)