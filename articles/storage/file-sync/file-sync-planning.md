---
title: Plan for an Azure File Sync Deployment
description: Plan for a deployment with Azure File Sync, a service that allows you to cache several Azure file shares locally on an on-premises Windows Server instance or cloud VM.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 09/26/2025
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As an IT administrator, I want to plan for an Azure File Sync deployment so that I can effectively manage on-premises file caching and ensure seamless integration with cloud file shares."
---

# Plan for an Azure File Sync deployment

:::row:::
    :::column:::
        [![Interview and demonstration that introduces Azure File Sync - select to play.](./media/storage-sync-files-planning/azure-file-sync-interview-video-snapshot.png)](https://www.youtube.com/watch?v=nfWLO7F52-s)
    :::column-end:::
    :::column:::
        Azure File Sync is a service that you can use to cache several Azure file shares on an on-premises Windows Server instance or cloud virtual machine (VM).

        This article introduces you to Azure File Sync concepts and features. After you're familiar with Azure File Sync, consider following the [Azure File Sync deployment guide](file-sync-deployment-guide.md) to try out this service.        
    :::column-end:::
:::row-end:::

The files are stored in the cloud in [Azure file shares](../files/storage-files-introduction.md). You can use Azure file shares in the following two ways. Which deployment option you choose changes the aspects that you need to consider as you plan for your deployment.

- **Directly mount an Azure file share by using the Server Message Block (SMB) protocol**: Because Azure Files provides SMB access, you can mount Azure file shares on-premises or in the cloud by using the standard SMB client available in Windows, macOS, and Linux. Because Azure file shares are serverless, deploying for production scenarios doesn't require managing a file server or network-attached storage (NAS) device. This choice means you don't have to apply software patches or swap out physical disks.

- **Cache an Azure file share on-premises by using Azure File Sync**: With Azure File Sync, you can centralize your organization's file shares in Azure Files while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms an on-premises (or cloud) Windows Server instance into a quick cache of your Azure file share.

## Management concepts
In Azure, a *resource* is a manageable item that you create and configure within your Azure subscriptions and resource groups. Resources are offered by *resource providers*, which are management services that deliver specific types of resources. To deploy Azure File Sync, you will work with two key resources:

- **Storage accounts**, offered by the `Microsoft.Storage` resource provider. Storage accounts are top-level resources that represent a shared pool of storage, IOPS, and throughput in which you can deploy **classic file shares** or other storage resources, depending on the storage account kind. All storage resources that are deployed into a storage account share the limits that apply to that storage account. Classic file shares support both the SMB and NFS file sharing protocols, but you can only use Azure File Sync with SMB file shares.
    
    > [!NOTE]
    > Azure Files also supports deploying file shares as a top-level Azure resources through the `Microsoft.FileShares` resource provider, however, these file shares only support the NFS file system protocol aren't supported by Azure File Sync.

- **Storage Sync Services**, offered by the `Microsoft.StorageSync` resource provider. Storage Sync Services act as management containers that enable you to register Windows File Servers and define the sync relationships for Azure File Sync.

### Azure file share management concepts
Classic file shares, or file shares deployed in storage accounts, are the traditional way to deploy file shares for Azure Files. They support all of the key features that Azure Files supports including SMB and NFS, SSD and HDD media tiers, every redundancy type, and in every region. To learn more about classic file shares, see [classic file shares](../files/storage-files-planning.md#classic-file-shares-microsoftstorage).

[!INCLUDE [storage-files-file-share-management-concepts](../../../includes/storage-files-file-share-management-concepts.md)]

### Azure File Sync management concepts
Within a Storage Sync Service, you can deploy:

- **Registered servers**, which represents a Windows File Server with a trust relationship with the Storage Sync Service. Registered servers can be either an individual server or cluster, however a server/cluster can only be registered with only one Storage Sync Service at a time.

- **Sync groups**, which defines the sync relationship between a cloud endpoint and one or more server endpoints. Endpoints within a sync group are kept in sync with each other. If for example, you have two distinct sets of files that you want to manage with Azure File Sync, you would create two sync groups and add different endpoints to each sync group.
    - **Cloud endpoints**, which represent Azure file shares.
    - **Server endpoints**, which represent paths on registered servers that are synced to Azure Files. A registered server can contain multiple server endpoints if their namespaces don't overlap.

> [!IMPORTANT]
> You can make changes to the namespace of any cloud endpoint or server endpoint in the sync group and have your files synced to the other endpoints in the sync group. If you make a change to the cloud endpoint (Azure file share) directly, an Azure File Sync change detection job first needs to discover changes. A change detection job for a cloud endpoint starts only once every 24 hours. For more information, see [Frequently asked questions about Azure Files and Azure File Sync](../files/storage-files-faq.md?toc=/azure/storage/filesync/toc.json#afs-change-detection).

### Count of needed storage sync services

A storage sync service is the root Azure Resource Manager resource for Azure File Sync. It manages synchronization relationships between your Windows Server installations and Azure file shares. Each storage sync service can contain multiple sync groups and multiple registered servers.

Each Windows Server instance can be registered to only one storage sync service. After registration, the server can participate in multiple sync groups within that storage sync service by using a Resource Manager principal to create server endpoints on the server.

When you design Azure File Sync topologies, be sure to isolate data clearly at the level of the storage sync service. For example, if your enterprise requires separate Azure File Sync environments for two distinct business units, and you need strict data isolation between these groups, you should create a dedicated storage sync service for each group. Avoid placing sync groups for both business groups within the same storage sync service, because that configuration wouldn't ensure complete isolation.

For more guidance on data isolation by using separate subscriptions or resource groups in Azure, refer to [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types#resource-scope-and-lifecycle).

## Planning for balanced sync topologies

Before you deploy any resources, it's important to plan what you'll sync on a local server and with which Azure file share. Making a plan helps you determine how many storage accounts, Azure file shares, and sync resources you need. These considerations are relevant even if your data doesn't currently reside on a Windows Server instance or on the server that you want to use long term. The [migration section](#migration) of this article can help you determine appropriate migration paths for your situation.

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## <a name = "windows-file-server-considerations"></a>Considerations for Windows file servers

To enable the sync capability on Windows Server, you must install the Azure File Sync downloadable agent. The Azure File Sync agent provides two main components:

- `FileSyncSvc.exe`, the background Windows service that's responsible for monitoring changes on the server endpoints and initiating sync sessions
- `StorageSync.sys`, a file system filter that enables cloud tiering and fast disaster recovery

### Operating system requirements

Azure File Sync is supported with the following versions of Windows Server:

| Version | RTM Version | Supported editions | Supported deployment options |
|---------|-------------|--------------------|------------------------------|
| Windows Server 2025 | 26100 | Azure, Datacenter, Essentials, Standard, and IoT | Full and Core |
| Windows Server 2022 | 20348 | Azure, Datacenter, Essentials, Standard, and IoT | Full and Core |
| Windows Server 2019 | 17763 | Datacenter, Essentials, Standard, and IoT | Full and Core |
| Windows Server 2016 | 14393 | Datacenter, Essentials, Standard, and Storage Server | Full and Core |

We recommend keeping all servers that you use with Azure File Sync up to date with the latest updates from Windows Update.

### Minimum system resources

Azure File Sync requires a server, either physical or virtual, with all of these attributes:

- At least one CPU.
- A minimum of 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, configure the VM with a minimum of 2,048 MiB of memory.
- A locally attached volume formatted with the NTFS file system.

For most production workloads, we don't recommend configuring a sync server in Azure File Sync with only the minimum requirements.

### Recommended system resources

Just like any server feature or application, the scale of the deployment determines the system resource requirements for Azure File Sync. Larger deployments on a server require greater system resources.

For Azure File Sync, the number of objects across the server endpoints and the churn on the dataset determine scale. A single server can have server endpoints in multiple sync groups. The number of objects listed in the following table accounts for the full namespace that a server is attached to.

For example, *server endpoint A with 10 million objects + server endpoint B with 10 million objects = 20 million objects*. For that example deployment, we would recommend 8 CPUs, 16 GiB of memory for steady state, and (if possible) 48 GiB of memory for the initial migration.

Namespace data is stored in memory for performance reasons. Because of that configuration, bigger namespaces require more memory to maintain good performance. More churn requires more CPUs to process.

The following table provides both the size of the namespace and a conversion to capacity for typical general-purpose file shares, where the average file size is 512 KiB. If your file sizes are smaller, consider adding more memory for the same amount of capacity. Base your memory configuration on the size of the namespace.

| Namespace size - files and directories (millions)  | Typical capacity (TiB)  | CPU cores  | Recommended memory (GiB) |
|---------|---------|---------|---------|
| 3        | 1.4     | 2        | 8 (initial sync)/ 2 (typical churn)      |
| 5        | 2.3     | 2        | 16 (initial sync)/ 4 (typical churn)    |
| 10       | 4.7     | 4        | 32  (initial sync)/ 8 (typical churn)   |
| 30       | 14.0    | 8        | 48 (initial sync)/ 16 (typical churn)   |
| 50       | 23.3    | 16       | 64  (initial sync)/ 32 (typical churn)  |
| 100*     | 46.6    | 32       | 128 (initial sync)/ 32 (typical churn)  |

\*Syncing more than 100 million files & directories isn't recommended. This is a soft limit based on our tested thresholds. For more information, see [Azure File Sync scale targets](./file-sync-scale-targets.md).

> [!TIP]
> Initial synchronization of a namespace is an intensive operation. We recommend allocating more memory until initial sync is complete. This approach isn't required but might speed up initial sync.
>
> Typical churn is 0.5% of the namespace changing per day. For higher levels of churn, consider adding more CPUs.

### Evaluation cmdlet

Before you deploy Azure File Sync, you should evaluate whether it's compatible with your system by using the Azure File Sync evaluation cmdlet. This cmdlet checks for potential problems with your file system and dataset, such as unsupported characters or an unsupported operating system version. These checks cover most (but not all) of the features mentioned in this article. We recommend that you read through the rest of this section carefully to ensure that your deployment goes smoothly.

You can install the evaluation cmdlet by installing the Az PowerShell module. For instructions, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

#### Usage

You can invoke the evaluation tool by performing system checks, dataset checks, or both. To perform both system and dataset checks:

```powershell
Invoke-AzStorageSyncCompatibilityCheck -Path <path>
```

To test only your dataset:

```powershell
Invoke-AzStorageSyncCompatibilityCheck -Path <path> -SkipSystemChecks
```

To test system requirements only:

```powershell
Invoke-AzStorageSyncCompatibilityCheck -ComputerName <computer name> -SkipNamespaceChecks
```

To display the results in a .csv file:

```powershell
$validation = Invoke-AzStorageSyncCompatibilityCheck C:\DATA
$validation.Results | Select-Object -Property Type, Path, Level, Description, Result | Export-Csv -Path C:\results.csv -Encoding utf8
```

### File system compatibility

Azure File Sync is supported only on directly attached NTFS volumes. Direct-attached storage (DAS) on Windows Server means that the Windows Server operating system owns the file system. You can provide DAS by physically attaching disks to the file server, attaching virtual disks to a file server VM (such as a VM hosted by Hyper-V), or even using iSCSI.

Only NTFS volumes are supported. ReFS, FAT, FAT32, and other file systems aren't supported.

The following table shows the interoperability state of NTFS file system features:

| Feature | Support status | Notes |
|---------|----------------|-------|
| Access control lists (ACLs) | Fully supported | Azure File Sync preserves Windows-style discretionary ACLs. Windows Server enforces these ACLs on server endpoints. You can also enforce ACLs when you're directly mounting the Azure file share, but this method requires additional configuration. For more information, see the [Identity](#identity) section later in this article. |
| Hard links | Skipped | |
| Symbolic links | Skipped | |
| Mount points | Partially supported | Mount points might be the root of a server endpoint, but they're skipped if a server endpoint's namespace contains them. |
| Junctions | Skipped | Examples are Distributed File System (DFS) `DfrsrPrivate` and `DFSRoots` folders. |
| Reparse points | Skipped | |
| NTFS compression | Partially supported | Azure File Sync doesn't support server endpoints located on a volume that compresses the system volume information (SVI) directory. |
| Sparse files | Fully supported | Sparse files sync (aren't blocked), but they sync to the cloud as a full file. If the file contents change in the cloud (or on another server), the file is no longer sparse when the change is downloaded. |
| Alternate Data Streams (ADS) | Preserved, but not synced | For example, classification tags that File Classification Infrastructure creates aren't synced. Existing classification tags on files on each of the server endpoints are untouched. |

<a id="files-skipped"></a>Azure File Sync also skips certain temporary files and system folders:

| File/folder | Note |
|-|-|
| `pagefile.sys` | File specific to a system |
| `Desktop.ini` | File specific to a system |
| `thumbs.db` | Temporary file for thumbnails |
| `ehthumbs.db` | Temporary file for media thumbnails |
| `~$*.*` | Office temporary file |
| `*.tmp` | Temporary file |
| `*.laccdb` | Access database locking file|
| `635D02A9D91C401B97884B82B3BCDAEA.*` | Internal sync file|
| `\System Volume Information` | Folder specific to a volume |
| `$RECYCLE.BIN`| Folder |
| `\SyncShareState` | Folder for sync |
| `.SystemShareInformation`  | Folder for sync in an Azure file share |

> [!NOTE]
> Although Azure File Sync supports syncing database files, databases aren't a good workload for sync solutions (including Azure File Sync). The log files and databases need to be synced together, and they can get out of sync for various reasons that could lead to database corruption.

### Free space on your local disk

When you're planning to use Azure File Sync, consider how much free space you need on the local disk for your server endpoint.

With Azure File Sync, you need to account for the following items taking up space on your local disk:

- With cloud tiering enabled:
  - Reparse points for tiered files
  - Azure File Sync metadata database
  - Azure File Sync heatstore
  - Fully downloaded files in your hot cache (if any)
  - Policy requirements for volume free space

- With cloud tiering disabled:
  - Fully downloaded files
  - Azure File Sync heatstore
  - Azure File Sync metadata database

The following example illustrates how to estimate the amount of free space that you need on your local disk. Let's say you installed your Azure File Sync agent on your Azure Windows VM, and you plan to create a server endpoint on disk F. You have 1 million files (and want to tier all of them), 100,000 directories, and a disk cluster size of 4 KiB. The disk size is 1,000 GiB. You want to enable cloud tiering and set your volume free-space policy to 20%.

- NTFS allocates a cluster size for each of the tiered files:

  *1 million files * 4 KiB cluster size = 4,000,000 KiB (4 GiB)*

  To fully benefit from cloud tiering, we recommend that you use smaller NTFS cluster sizes (less than 64 KiB) because each tiered file occupies a cluster. Also, NTFS allocates the space that tiered files occupy. This space doesn't show up in any UI.
- Sync metadata occupies a cluster size per item:

  *(1 million files + 100,000 directories) * 4 KiB cluster size = 4,400,000 KiB (4.4 GiB)*
- Azure File Sync heatstore occupies 1.1 KiB per file:

  *1 million files * 1.1 KiB = 1,100,000 KiB (1.1 GiB)*
- Volume free-space policy is 20%:

  *1000 GiB * 0.2 = 200 GiB*

In this case, Azure File Sync would need about 209,500,000 KiB (209.5 GiB) of space for this namespace. Add this amount to any free space that you think you might need for this disk.

### Failover clustering

Azure File Sync supports Windows Server failover clustering for the **File Server for general use** deployment option. For more information on how to configure the **File Server for general use** role on a failover cluster, see [Deploy a two-node clustered file server](/windows-server/failover-clustering/deploy-two-node-clustered-file-server).

The only scenario that Azure File Sync supports is a Windows Server failover cluster with clustered disks. Failover clustering isn't supported on Scale-Out File Server, Cluster Shared Volumes (CSVs), or local disks.

For sync to work correctly, the Azure File Sync agent must be installed on every node in a failover cluster.

### Data Deduplication

#### Windows Server 2025, Windows Server 2022, Windows Server 2019, and Windows Server 2016

Data Deduplication is supported whether cloud tiering is enabled or disabled on one or more server endpoints on the volume for Windows Server 2025, Windows Server 2022, Windows Server 2019, and Windows Server 2016. Enabling Data Deduplication on a volume with cloud tiering enabled lets you cache more files on-premises without provisioning more storage.

When you enable Data Deduplication on a volume with cloud tiering enabled, deduplication-optimized files within the server endpoint location are tiered similarly to a normal file, based on the policy settings for cloud tiering. After you tier the deduplication-optimized files, the Data Deduplication garbage collection job runs automatically. It reclaims disk space by removing unnecessary chunks that other files on the volume no longer reference.

In some cases where Data Deduplication is installed, the available volume space can increase more than expected after deduplication garbage collection is triggered. The following example describes how volume space works:

1. The free-space policy for cloud tiering is set to 20%.
2. Azure File Sync is notified when free space is low (let's say 19%).
3. Tiering determines that 1% more space needs to be freed, but you want 5% extra, so you tier up to 25% (for example, 30 GiB).
4. The files are tiered until you reach 30 GiB.
5. As part of interoperability with Data Deduplication, Azure File Sync initiates garbage collection at the end of the tiering session.

The volume savings apply only to the server. Your data in the Azure file share isn't deduplicated.

> [!NOTE]
> To support Data Deduplication on volumes with cloud tiering enabled on Windows Server 2019, you must install Windows update [KB4520062 - October 2019](https://support.microsoft.com/help/4520062) or a later monthly rollup update.

#### Windows Server 2012 R2

Azure File Sync doesn't support Data Deduplication and cloud tiering on the same volume on Windows Server 2012 R2. If you enable Data Deduplication on a volume, you must disable cloud tiering.

#### Notes

- If you install Data Deduplication before you install the Azure File Sync agent, a restart is required to support Data Deduplication and cloud tiering on the same volume.
- If you enable Data Deduplication on a volume after you enable cloud tiering, the initial deduplication optimization job optimizes files on the volume that aren't already tiered. This job has the following impact on cloud tiering:
  - The free-space policy continues to tier files according to the free space on the volume by using the heatmap.
  - The date policy skips tiering of files that might be otherwise eligible for tiering because the deduplication optimization job is accessing the files.
- For ongoing deduplication optimization jobs, the Data Deduplication [MinimumFileAgeDays](/powershell/module/deduplication/set-dedupvolume) setting delays cloud tiering with the data policy, if the file isn't already tiered.
  - For example, if the `MinimumFileAgeDays` setting is 7 days and the data policy for cloud tiering is 30 days, the date policy tiers files after 37 days.
  - After Azure File Sync tiers a file, the deduplication optimization job skips the file.
- If a server running Windows Server 2012 R2 with the Azure File Sync agent installed is upgraded to Windows Server 2025, Windows Server 2022, Windows Server 2019, or Windows Server 2016, you must perform the following steps to support Data Deduplication and cloud tiering on the same volume:
  1. Uninstall the Azure File Sync agent for Windows Server 2012 R2 and restart the server.
  1. Download the Azure File Sync agent for the new server operating system version (Windows Server 2025, Windows Server 2022, Windows Server 2019, or Windows Server 2016).
  1. Install the Azure File Sync agent and restart the server.

  The server retains its Azure File Sync configuration settings when the agent is uninstalled and reinstalled.

### Distributed File System

Azure File Sync supports interoperability with DFS Namespaces (DFS-N) and DFS Replication (DFS-R).

#### DFS-N

Azure File Sync is fully supported with the DFS-N implementation. You can install the Azure File Sync agent on one or more file servers to sync data between the server endpoints and the cloud endpoint, and then use DFS-N to provide namespace service. For more information, see [DFS Namespaces overview](/windows-server/storage/dfs-namespaces/dfs-overview) and [DFS Namespaces with Azure Files](../files/files-manage-namespaces.md).

#### DFS-R

Because DFS-R and Azure File Sync are both replication solutions, we recommend replacing DFS-R with Azure File Sync in most cases. But you should use DFS-R and Azure File Sync together in the following scenarios:

- You're migrating from a DFS-R deployment to an Azure File Sync deployment. For more information, see [Migrate a DFS-R deployment to Azure File Sync](file-sync-deployment-guide.md#migrate-a-dfs-r-deployment-to-azure-file-sync).
- Not every on-premises server that needs a copy of your file data can be connected directly to the internet.
- Branch servers consolidate data onto a single hub server, for which you want to use Azure File Sync.

For Azure File Sync and DFS-R to work side by side:

- Azure File Sync cloud tiering must be disabled on volumes with DFS-R replicated folders.
- Server endpoints shouldn't be configured on DFS-R read-only replication folders.
- Only a single server endpoint can overlap with a DFS-R location. Multiple server endpoints overlapping with other active DFS-R locations might lead to conflicts.

For more information, see [DFS Namespaces and DFS Replication overview](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj127250(v=ws.11)).

### Sysprep

Using Sysprep on a server that has the Azure File Sync agent installed isn't supported and can lead to unexpected results. Agent installation and server registration should occur after you deploy the server image and complete Sysprep mini-setup.

### Windows Search

If cloud tiering is enabled on a server endpoint, Windows Search skips files that are tiered and doesn't index them. Windows Search indexes non-tiered files properly.

Windows clients cause recalls when they search the file share if the **Always search file names and contents** setting is enabled on the client machine. This setting is disabled by default.

### Other HSM solutions

You shouldn't use any other hierarchical storage management (HSM) solutions with Azure File Sync.

## Performance and scalability

Because the Azure File Sync agent runs on a Windows Server machine that connects to the Azure file shares, the effective sync performance depends on these factors in your infrastructure:

- Windows Server and the underlying disk configuration
- Network bandwidth between the server and the Azure storage
- File size
- Total dataset size
- Activity on the dataset

Azure File Sync works on the file level. The performance characteristics of a solution based on Azure File Sync is better measured in the number of objects (files and directories) processed per second.

For more information, see [Azure File Sync performance metrics](./file-sync-scale-targets.md#azure-file-sync-performance-metrics) and [Azure File Sync scale targets](./file-sync-scale-targets.md#azure-file-sync-scale-targets)

## Identity

The administrator who registers the server and creates the cloud endpoint must be a member of the management role [Azure File Sync Administrator](/azure/role-based-access-control/built-in-roles/storage#azure-file-sync-administrator), Owner, or Contributor for the storage sync service. You can configure this role under **Access Control (IAM)** on the Azure portal page for the storage sync service.

Azure File Sync works with your standard Active Directory-based identity without any special setup beyond setting up sync. When you're using Azure File Sync, the general expectation is that most accesses go through the Azure File Sync caching servers, rather than through the Azure file share. Because the server endpoints are on Windows Server, and Windows Server supports Active Directory and Windows-style ACLs, you don't need anything beyond ensuring that the Windows file servers registered with the storage sync service are domain joined. Azure File Sync stores ACLs on the files in the Azure file share, and it replicates those ACLs to all server endpoints.

Even though changes made directly to the Azure file share take longer to sync to the server endpoints in the sync group, you might also want to ensure that you can enforce your Active Directory permissions on your file share directly in the cloud. To do this configuration, you must domain join your storage account to your on-premises Active Directory instance, just like how your Windows file servers are domain joined. To learn more about domain joining your storage account to a customer-owned Active Directory instance, see [Overview of Azure Files identity-based authentication for SMB access](../files/storage-files-active-directory-overview.md?toc=/azure/storage/filesync/toc.json).

> [!IMPORTANT]
> Domain joining your storage account to Active Directory isn't required to successfully deploy Azure File Sync. It's an optional step that allows the Azure file share to enforce on-premises ACLs when users mount the Azure file share directly.

## Networks

The Azure File Sync agent communicates with your storage sync service and Azure file share by using the Azure File Sync REST protocol and the FileREST protocol. Both of these protocols always use HTTPS over port 443. SMB is never used to upload or download data between your Windows Server instance and the Azure file share. Because most organizations allow HTTPS traffic over port 443 as a requirement for visiting most websites, a special network configuration is usually not required to deploy Azure File Sync.

> [!IMPORTANT]
> Azure File Sync doesn't support internet routing. Azure File Sync supports the default network routing option, Microsoft routing.

Based on your organization's policy or unique regulatory requirements, you might require more restrictive communication with Azure. Azure File Sync provides several mechanisms for you to configure networks. Based on your requirements, you can:

- Tunnel sync and file upload/download traffic over Azure ExpressRoute or an Azure virtual private network (VPN).
- Make use of Azure Files and Azure network features, such as service endpoints and private endpoints.
- Configure Azure File Sync to support your proxy in your environment.
- Throttle network activity from Azure File Sync.

If you want to communicate with your Azure file share over SMB but port 445 is blocked, consider using SMB over QUIC. This method offers a zero-configuration VPN for SMB access to your Azure file shares through the QUIC transport protocol over port 443. Although Azure Files doesn't directly support SMB over QUIC, you can create a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition VM by using Azure File Sync. To learn more about this option, see [SMB over QUIC](../files/storage-files-networking-overview.md#smb-over-quic).

To learn more about Azure File Sync and networks, see [Networking considerations for Azure File Sync](file-sync-networking-overview.md).

## Encryption

Azure File Sync offers three layers of encryption: encryption on the at-rest storage of Windows Server, encryption in transit between the Azure File Sync agent and Azure, and encryption at rest for your data in the Azure file share.

### Windows Server encryption at rest

Two strategies for encrypting data on Windows Server work generally with Azure File Sync:

- Encryption beneath the file system, such that the file system and all of the data written to it are encrypted
- Encryption within the file format itself

These methods aren't mutually exclusive. You can choose to use them together because the purpose of encryption is different.

To provide encryption beneath the file system, Windows Server provides a BitLocker inbox. BitLocker is fully transparent to Azure File Sync. The primary reasons to use an encryption mechanism like BitLocker are:

- Prevent physical exfiltration of data from your on-premises datacenter by someone stealing the disks
- Prevent sideloading an unauthorized OS to perform unauthorized reads and writes to your data

To learn more, see [BitLocker overview](/windows/security/information-protection/bitlocker/bitlocker-overview).

Partner products that work similarly to BitLocker, in that they sit beneath the NTFS volume, should work fully and transparently with Azure File Sync.

The other main method for encrypting data is to encrypt the file's data stream when the application saves the file. Some applications might do this task natively, but they usually don't.

Example methods for encrypting the file's data stream are Azure Information Protection, Azure Rights Management (Azure RMS), and Active Directory Rights Management Services. The primary reason to use an encryption mechanism like Azure Information Protection or Azure RMS is to prevent exfiltration of data from your file share by people who copy it to alternate locations (like a flash drive) or email it to an unauthorized person. When a file's data stream is encrypted as part of the file format, this file continues to be encrypted on the Azure file share.

Azure File Sync doesn't interoperate with NTFS Encrypted File System or partner encryption solutions that sit above the file system but below the file's data stream.

### Encryption in transit

The Azure File Sync agent communicates with your storage sync service and Azure file share by using the Azure File Sync REST protocol and the FileREST protocol. Both of these protocols always use HTTPS over port 443. Azure File Sync doesn't send unencrypted requests over HTTP.

Azure storage accounts contain a switch for requiring encryption in transit. This switch is enabled by default. Even if the switch at the storage account level is disabled and unencrypted connections to your Azure file shares are possible, Azure File Sync still uses only encrypted channels to access your file share.

The primary reason to disable encryption in transit for the storage account is to support a legacy application that communicates directly with Azure file share. Such an application must be run on an older operating system, such as Windows Server 2008 R2 or an older Linux distribution. If the legacy application connects to the Windows Server cache of the file share, changing this setting has no effect.

We strongly recommend that you enable the encryption of data in transit. For more information about encryption in transit, see [Require secure transfer to ensure secure connections](../common/storage-require-secure-transfer.md?toc=/azure/storage/files/toc.json).

> [!NOTE]
> The Azure File Sync service removed support for TLS 1.0 and 1.1 on August 1, 2020. All supported Azure File Sync agent versions already use TLS 1.2 by default. You might be using an earlier version of TLS if you disabled TLS 1.2 on your server or if you use a proxy.
>
> If you use a proxy, we recommend that you check the proxy configuration. Azure File Sync service regions added after May 1, 2020, support only TLS 1.2. For more information, see the [troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-cloud-tiering?toc=/azure/storage/file-sync/toc.json#tls-12-required-for-azure-file-sync).

### Azure file share encryption at rest

[!INCLUDE [storage-files-encryption-at-rest](../../../includes/storage-files-encryption-at-rest.md)]

## Storage tiers

[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]

## Azure File Sync region availability

For regional availability, see [Product availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table) and search for **Storage Accounts**.

The following regions require you to request access to Azure Storage before you can use Azure File Sync:

- France South
- South Africa West
- UAE Central

To request access for these regions, follow the process in [this article](/troubleshoot/azure/general/region-access-request-process).

## Redundancy

[!INCLUDE [storage-files-redundancy-overview](../../../includes/storage-files-redundancy-overview.md)]

> [!IMPORTANT]
> Geo-redundant and geo-zone-redundant storage can manually fail over storage to the secondary region. We don't recommend this approach (outside a disaster) when you're using Azure File Sync because of the increased likelihood of data loss. If a disaster occurs and you want to initiate a manual failover of storage, you need to open a support case with Microsoft to get Azure File Sync to resume sync with the secondary endpoint.

## Migration

If you have an existing file server in Windows Server 2012 R2 or newer, you can directly install Azure File Sync in place. You don't need to move data to a new server.

If you plan to migrate to a new Windows file server as a part of adopting Azure File Sync, or if your data is currently located on NAS, there are several possible migration approaches to use Azure File Sync with this data. Which migration approach you should choose depends on where your data currently resides.

For detailed guidance, see [Migrate to SMB Azure file shares](../files/storage-files-migration-overview.md?toc=/azure/storage/filesync/toc.json).

## Antivirus

Because antivirus works by scanning files for known malicious code, an antivirus product might cause the recall of tiered files and high egress charges. Tiered files have the secure Windows attribute `FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS` set. We recommend consulting with your software vendor to learn how to configure its solution to skip reading files that have this attribute set. (Many do it automatically.)

The Microsoft antivirus solutions Windows Defender and System Center Endpoint Protection automatically skip reading files that have this attribute set. We tested them and identified one minor issue: when you add a server to an existing sync group, files smaller than 800 bytes are recalled (downloaded) on the new server. These files remain on the new server and aren't tiered because they don't meet the tiering size requirement (more than 64 KiB).

Antivirus vendors can check compatibility between their products and Azure File Sync by using the [Azure File Sync Antivirus Compatibility Test Suite](https://www.microsoft.com/download/details.aspx?id=58322) in the Microsoft Download Center.

## Backup

If you enable cloud tiering, don't use solutions that directly back up the server endpoint or a VM that contains the server endpoint.

Cloud tiering causes only a subset of your data to be stored on the server endpoint. The full dataset resides in your Azure file share. Depending on the backup solution that you use, tiered files are either:

- Skipped and not backed up, because they have the `FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS` attribute set
- Recalled to disk, which results in high egress charges

We recommend using a cloud backup solution to back up the Azure file share directly. For more information, see [About Azure Files backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json). Or ask your backup provider if it supports backing up Azure file shares.

If you prefer to use an on-premises backup solution, perform the backups on a server in the sync group that has cloud tiering disabled. Make sure there are no tiered files.

When you perform a restore, use the volume-level or file-level restore option. Files restored through the file-level restore option are synced to all endpoints in the sync group. Existing files are replaced with the version restored from backup. Volume-level restores don't replace newer file versions in the Azure file share or other server endpoints.

> [!NOTE]
> Bare-metal restore, VM restore, system restore (Windows built-in OS restore), and file-level restore with its tiered version can cause unexpected results. (File-level restore happens when backup software backs up a tiered file instead of a full file.) They aren't currently supported when cloud tiering is enabled.
>
> Volume Shadow Copy Service (VSS) snapshots, including the **Previous Versions** tab, are supported on volumes that have cloud tiering enabled. However, you must enable previous-version compatibility through PowerShell. [Learn how](file-sync-deployment-guide.md#optional-use-self-service-restore-through-previous-versions-and-vss).

## Data classification

If you have data-classification software installed, enabling cloud tiering increased costs for two reasons:

- With cloud tiering enabled, your hottest files are cached locally. Your coolest files are tiered to the Azure file share in the cloud. If your data classification regularly scans all files in the file share, the files tiered to the cloud must be recalled whenever they're scanned.
- If the data classification software uses the metadata in the data stream of a file, the file must be fully recalled for the software to detect the classification.

These increases, in both the number of recalls and the amount of data being recalled, can increase costs.

## Azure File Sync agent update policy

[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Related content

- [Azure File Sync proxy and firewall settings](file-sync-firewall-and-proxy.md)
- [Create an SMB Azure file share](../files/storage-how-to-create-file-share.md?toc=/azure/storage/filesync/toc.json)
- [Deploy Azure File Sync](file-sync-deployment-guide.md)
- [Monitor Azure File Sync](file-sync-monitoring.md)
