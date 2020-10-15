---
title: Release notes for the Azure File Sync agent | Microsoft Docs
description: Read the release notes for the Azure File Sync agent, which lets you centralize your organization's file shares in Azure Files.
services: storage
author: wmgries
ms.service: storage
ms.topic: conceptual
ms.date: 10/15/2020
ms.author: wgries
ms.subservice: files
---

# Release notes for the Azure File Sync agent
Azure File Sync allows you to centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. Your Windows Server installations are transformed into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally (including SMB, NFS, and FTPS). You can have as many caches as you need around the world.

This article provides the release notes for the supported versions of the Azure File Sync agent.

## Supported versions
The following Azure File Sync agent versions are supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V11 Release - [KB4539949](https://support.microsoft.com/en-us/help/4539949)| 11.0.0.0 | October 15, 2020 | Supported - Flighting |
| V10.1 Release - [KB4522411](https://support.microsoft.com/en-us/help/4522411)| 10.1.0.0 | June 5, 2020 | Supported |
| May 2020 update rollup - [KB4522412](https://support.microsoft.com/help/4522412)| 10.0.2.0 | May 19, 2020 | Supported |
| V10 Release - [KB4522409](https://support.microsoft.com/en-us/help/4522409)| 10.0.0.0 | April 9, 2020 | Supported |
| December 2019 update rollup - [KB4522360](https://support.microsoft.com/help/4522360)| 9.1.0.0 | December 12, 2019 | Supported - Agent version will expire on February 16, 2021 |
| V9 Release - [KB4522359](https://support.microsoft.com/help/4522359)| 9.0.0.0 | December 2, 2019 | Supported - Agent version will expire on February 16, 2021 |
| V8 Release - [KB4511224](https://support.microsoft.com/help/4511224)| 8.0.0.0 | October 8, 2019 | Supported - Agent version will expire on January 12, 2021 |

## Unsupported versions
The following Azure File Sync agent versions have expired and are no longer supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V7 Release | 7.0.0.0 - 7.2.0.0 | N/A | Not Supported - Agent versions expired on September 1, 2020 |
| V6 Release | 6.0.0.0 - 6.3.0.0 | N/A | Not Supported - Agent versions expired on April 21, 2020 |
| V5 Release | 5.0.2.0 - 5.2.0.0 | N/A | Not Supported - Agent versions expired on March 18, 2020 |
| V4 Release | 4.0.1.0 - 4.3.0.0 | N/A | Not Supported - Agent versions expired on November 6, 2019 |
| V3 Release | 3.1.0.0 - 3.4.0.0 | N/A | Not Supported - Agent versions expired on August 19, 2019 |
| Pre-GA agents | 1.1.0.0 - 3.0.13.0 | N/A | Not Supported - Agent versions expired on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Agent version 11.0.0.0
The following release notes are for version 11.0.0.0 of the Azure File Sync agent (released October 15, 2020).

### Improvements and issues that are fixed
- New cloud tiering modes to control initial download and proactive recall
	- Initial download mode: you can now choose how you want your files to be initially downloaded onto your new server endpoint. Want all your files tiered or as many files as possible downloaded onto your server by last modified timestamp? You can do that! Can't use cloud tiering? You can now opt to avoid tiered files on your system. To learn more, see [Create a server endpoint](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide?tabs=azure-portal%2Cproactive-portal#create-a-server-endpoint) section in the Deploy Azure File Sync documentation.
	- Proactive recall mode: whenever a file is created or modified, you can proactively recall it to servers that you specify within the same sync group. This makes the file readily available for consumption in each server you specified. Have teams across the globe working on the same data? Enable proactive recalling so that when the team arrives the next morning, all the files updated by a team in a different time zone are downloaded and ready to go! To learn more, see [Proactively recall new and changed files from an Azure file share](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide?tabs=azure-portal%2Cproactive-portal#proactively-recall-new-and-changed-files-from-an-azure-file-share) section in the Deploy Azure File Sync documentation.

- Exclude applications from cloud tiering last access time tracking
	You can now exclude applications from last access time tracking. When an application accesses a file, the last access time for the file is updated in the cloud tiering database. Applications that scan the file system like anti-virus cause all files to have the same last access time which impacts when files are tiered.

	To exclude applications from last access time tracking, add the process name to the HeatTrackingProcessNameExclusionList registry setting which is located under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync.

	Example: reg ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync" /v HeatTrackingProcessNameExclusionList /t REG_MULTI_SZ /d "SampleApp.exe\0AnotherApp.exe" /f

    > [!Note]  
    > Data Deduplication and File Server Resource Manager (FSRM) processes are excluded by default (hard coded) and the process exclusion list is refreshed every 5 minutes.

- Miscellaneous performance and reliability improvements
	- Improved change detection performance to detect files that have changed in the Azure file share.
	- Improved sync upload performance.
	- Initial upload is now performed from a VSS snapshot which reduces per-item errors and sync session failures.
	- Sync reliability improvements for certain I/O patterns.
	- Fixed a bug to prevent the sync database from going back-in-time on failover clusters when a failover occurs.
	- Improved recall performance when accessing a tiered file.


### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](storage-sync-files-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](https://docs.microsoft.com/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Agent version 10.1.0.0
The following release notes are for version 10.1.0.0 of the Azure File Sync agent released June 5, 2020. These notes are in addition to the release notes listed for version 10.0.0.0 and 10.0.2.0.

### Improvements and issues that are fixed

- Azure private endpoint support
	- Sync traffic to the Storage Sync Service can now be sent to a private endpoint. This enables tunneling over an ExpressRoute or VPN connection. To learn more, see [Configuring Azure File Sync network endpoints](https://docs.microsoft.com/azure/storage/files/storage-sync-files-networking-endpoints).
- Files Synced metric will now display progress while a large sync is running, rather than at the end.
- Miscellaneous reliability improvements for agent installation, cloud tiering, sync and telemetry

## Agent version 10.0.2.0
The following release notes are for version 10.0.2.0 of the Azure File Sync agent released May 19, 2020. These notes are in addition to the release notes listed for version 10.0.0.0.

Issue fixed in this release:  
- Storage Sync Agent (FileSyncSvc) crashes frequently after installing the Azure File Sync v10 agent.

> [!Note]  
>This release was not flighted to servers that are configured to automatically update when a new version becomes available. To install this update, use Microsoft Update or Microsoft Update Catalog (see [KB4522412](https://support.microsoft.com/help/4522412) for installation instructions).

## Agent version 10.0.0.0
The following release notes are for version 10.0.0.0 of the Azure File Sync agent (released April 9, 2020).

### Improvements and issues that are fixed

- Improved sync progress in the portal
	- With the V10 agent release, the Azure portal will soon begin to show the type of sync session that is running. E.g. initial download, regular download, background recall (fast disaster recovery cases) and similar. 

- Improved cloud tiering portal experience
	- If you have files that are failing to tier or recall, you can now view the tiering errors in the server endpoint properties.
	- Additional cloud tiering information is available for a server endpoint:
		- Local cache size
		- Cache usage efficiency
		- Cloud tiering policy details: volume size, current free space, or the last accessed time of the oldest file in the local cache.
	- These changes will ship in the Azure portal shortly after the initial V10 agent release.

- Support for moving the Storage Sync Service and/or storage account to a different Azure Active Directory tenant
	- Azure File Sync now supports moving the Storage Sync Service and/or storage account to a different resource group, subscription or Azure AD tenant.
	
- Miscellaneous performance and reliability improvements
	- Change detection on the Azure file share may fail if virtual network (VNET) and firewall rules are configured on the storage account.
	- Reduced memory consumption associated with recall. 
	- Improved performance when using the [Invoke-AzStorageSyncChangeDetection](https://docs.microsoft.com/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) cmdlet.
	- Other miscellaneous reliability improvements. 
	
### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](storage-sync-files-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](https://docs.microsoft.com/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Agent version 9.1.0.0
The following release notes are for version 9.1.0.0 of the Azure File Sync agent released December 12, 2019. These notes are in addition to the release notes listed for version 9.0.0.0.

Issue fixed in this release:  
- Sync fails with one of the following errors after upgrading to Azure File Sync agent version 9.0:
	- 0x8e5e044e (JET_errWriteConflict)
	- 0x8e5e0450 (JET_errInvalidSesid)
	- 0x8e5e0442 (JET_errInstanceUnavailable)

## Agent version 9.0.0.0
The following release notes are for version 9.0.0.0 of the Azure File Sync agent (released December 2, 2019).

### Improvements and issues that are fixed

- Self-service restore support
	- Users can now restore their files by using the previous version feature. Prior to the v9 release, the previous version feature was not supported on volumes that had cloud tiering enabled. This feature must be enabled for each volume separately, on which an endpoint with cloud tiering enabled exists. To learn more, see  
[Self-service restore through Previous Versions and VSS (Volume Shadow Copy Service)](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide#self-service-restore-through-previous-versions-and-vss-volume-shadow-copy-service). 
 
- Support for larger file share sizes 
	- Azure File Sync now supports up to 64TiB and 100 million files in a single, syncing namespace.  
 
- Data Deduplication support on Server 2019 
	- Data Deduplication is now supported with cloud tiering enabled on Windows Server 2019. To support Data Deduplication on volumes with cloud tiering, Windows update [KB4520062](https://support.microsoft.com/help/4520062) must be installed. 
 
- Improved minimum file size for a file to tier 
	- The minimum file size for a file to tier is now based on the file system cluster size (double the file system cluster size). For example, by default, the NTFS file system cluster size is 4KB, the resulting minimum file size for a file to tier is 8KB. 
 
- Network connectivity test cmdlet 
	- As part of Azure File Sync configuration, multiple service endpoints must be contacted. They each have their own DNS name that needs to be accessible to the server. These URLs are also specific to the region a server is registered to. Once a server is registered, the connectivity test cmdlet (PowerShell and Server Registration Utility) can be used to test communications with all URLs specific to this server. This cmdlet can help troubleshoot when incomplete communication prevents the server from fully working with Azure File Sync and it can be used to fine tune proxy and firewall configurations.  
 
		To run the network connectivity test, run the following PowerShell commands: 
 
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"  
		Test-StorageSyncNetworkConnectivity
 
- Remove server endpoint improvement when cloud tiering is enabled 
	- As before, removing a server endpoint does not result in removing files in the Azure file share. However, behavior for reparse points on the local server has changed. Reparse points (pointers to files that are not local on the server) are now deleted when removing a server endpoint. The fully cached files will remain on the server. This improvement was made to prevent [orphaned tiered files](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#tiered-files-are-not-accessible-on-the-server-after-deleting-a-server-endpoint) when removing a server endpoint. If the server endpoint is recreated, the reparse points for the tiered files will be recreated on the server.  
 
- Performance and reliability improvements 
	- Reduced recall failures. Recall size is now automatically adjusted based on network bandwidth. 
	- Improved download performance when adding a new server to a sync group. 
	- Reduced files not syncing due to constraint conflicts. 
	- Files fail to tier or are unexpectedly recalled in certain scenarios if the server endpoint path is a volume mount point.
	
### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](storage-sync-files-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The discretionary access control list (DACL) portion of a security descriptor if it's larger than 2 KB. (This issue applies only when you have more than about 40 access control entries (ACEs) on a single item.)
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Tiered files will become inaccessible if the files are not recalled prior to deleting the server endpoint. To restore access to the files, recreate the server endpoint. If 30 days have passed since the server endpoint was deleted or if the cloud endpoint was deleted, tiered files that were not recalled will be unusable. To learn more, see [Tiered files are not accessible on the server after deleting a server endpoint](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#tiered-files-are-not-accessible-on-the-server-after-deleting-a-server-endpoint).
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](https://docs.microsoft.com/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
- Files may fail to tier if the pagefile.sys is located on a volume that has cloud tiering enabled. The pagefile.sys should be located on a volume that has cloud tiering disabled.

## Agent version 8.0.0.0
The following release notes are for version 8.0.0.0 of the Azure File Sync agent (released October 8, 2019).

### Improvements and issues that are fixed

- Restore performance Improvements
	- Faster recovery times for recovery done through Azure Backup. Restored files will sync back down to Azure File Sync servers much faster. 
- Improved cloud tiering portal experience  
	- If you have tiered files that are failing to recall, you can now view the recall errors in the server endpoint properties. Also, the server endpoint health will now show an error and mitigation steps if the cloud tiering filter driver is not loaded on the server.
- Simpler agent installation
	- The Az\AzureRM PowerShell module is no longer required to register the server making installation simpler and fast.
- Miscellaneous performance and reliability improvements

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](storage-sync-files-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The discretionary access control list (DACL) portion of a security descriptor if it's larger than 2 KB. (This issue applies only when you have more than about 40 access control entries (ACEs) on a single item.)
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Tiered files will become inaccessible if the files are not recalled prior to deleting the server endpoint. To restore access to the files, recreate the server endpoint. If 30 days have passed since the server endpoint was deleted or if the cloud endpoint was deleted, tiered files that were not recalled will be unusable. To learn more, see [Tiered files are not accessible on the server after deleting a server endpoint](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#tiered-files-are-not-accessible-on-the-server-after-deleting-a-server-endpoint).
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](https://docs.microsoft.com/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
