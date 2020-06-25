---
title: Release notes for the Azure File Sync agent | Microsoft Docs
description: Release notes for the Azure File Sync agent.
services: storage
author: wmgries
ms.service: storage
ms.topic: conceptual
ms.date: 5/19/2020
ms.author: wgries
ms.subservice: files
---

# Release notes for the Azure File Sync agent
Azure File Sync allows you to centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. Your Windows Server installations are transformed into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally (including SMB, NFS, and FTPS). You can have as many caches as you need around the world.

This article provides the release notes for the supported versions of the Azure File Sync agent.

## Supported versions
The following versions are supported for the Azure File Sync agent:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V10.1 Release - [KB4522411](https://support.microsoft.com/en-us/help/4522411)| 10.1.0.0 | June 5, 2020 | Supported - Flighting |
| May 2020 update rollup - [KB4522412](https://support.microsoft.com/help/4522412)| 10.0.2.0 | May 19, 2020 | Supported |
| V10 Release - [KB4522409](https://support.microsoft.com/en-us/help/4522409)| 10.0.0.0 | April 9, 2020 | Supported |
| December 2019 update rollup - [KB4522360](https://support.microsoft.com/help/4522360)| 9.1.0.0 | December 12, 2019 | Supported |
| V9 Release - [KB4522359](https://support.microsoft.com/help/4522359)| 9.0.0.0 | December 2, 2019 | Supported |
| V8 Release - [KB4511224](https://support.microsoft.com/help/4511224)| 8.0.0.0 | October 8, 2019 | Supported |
| July 2019 update rollup - [KB4490497](https://support.microsoft.com/help/4490497)| 7.2.0.0 | July 24, 2019 | Supported - Agent version will expire on September 1, 2020 |
| July 2019 update rollup - [KB4490496](https://support.microsoft.com/help/4490496)| 7.1.0.0 | July 12, 2019 | Supported - Agent version will expire on September 1, 2020 |
| V7 Release - [KB4490495](https://support.microsoft.com/help/4490495)| 7.0.0.0 | June 19, 2019 | Supported - Agent version will expire on September 1, 2020 |
| V6 Release | 6.0.0.0 - 6.3.0.0 | N/A | Not Supported - Agent versions expired on April 21, 2020 |
| V5 Release | 5.0.2.0 - 5.2.0.0 | N/A | Not Supported - Agent versions expired on March 18, 2020 |
| V4 Release | 4.0.1.0 - 4.3.0.0 | N/A | Not Supported - Agent versions expired on November 6, 2019 |
| V3 Release | 3.1.0.0 - 3.4.0.0 | N/A | Not Supported - Agent versions expired on August 19, 2019 |
| Pre-GA agents | 1.1.0.0 - 3.0.13.0 | N/A | Not Supported - Agent versions expired on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

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

- Support for moving the Storage Sync Service and/or storage account to a different Azure Active Directory (AAD) tenant
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
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

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

## Agent version 7.2.0.0
The following release notes are for version 7.2.0.0 of the Azure File Sync agent released July 24, 2019. These notes are in addition to the release notes listed for version 7.0.0.0.

List of issues fixed in this release:  
- Storage Sync Agent (FileSyncSvc) crashes if the proxy configuration is null.
- Server endpoint will start BCDR (error 0x80c80257 - ECS_E_BCDR_IN_PROGRESS) if multiple endpoints on the server have the same name.
- Cloud tiering reliability improvements.

## Agent version 7.1.0.0
The following release notes are for version 7.1.0.0 of the Azure File Sync agent released July 12, 2019. These notes are in addition to the release notes listed for version 7.0.0.0.

List of issues fixed in this release:  
- Accessing or browsing a server endpoint location over SMB is slow on Windows Server 2012 R2. 
- Increased CPU utilization after installing the Azure File Sync v6 agent.
- Cloud tiering telemetry improvements.
- Miscellaneous reliability improvements for cloud tiering and sync.

## Agent version 7.0.0.0
The following release notes are for version 7.0.0.0 of the Azure File Sync agent (released June 19, 2019).

### Improvements and issues that are fixed

- Support for larger file share sizes
	- With the preview of larger Azure file shares, we are increasing our support limits for file sync as well. In this first step, Azure File Sync now supports up to 25 TB and 50 million files in a single, syncing namespace. To apply for the large file share preview, fill in this form https://aka.ms/azurefilesatscalesurvey. 
- Support for firewall and virtual network setting on storage accounts
	- Azure File Sync now supports the firewall and virtual network setting on storage accounts. To configure your deployment to work with the firewall and virtual network setting, see [Configure firewall and virtual network settings](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide?tabs=azure-portal#configure-firewall-and-virtual-network-settings).
- PowerShell cmdlet to immediately sync files changed in the Azure file share
	- To immediately sync files that are changed in the Azure file share, the Invoke-AzStorageSyncChangeDetection PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. This cmdlet is intended for scenarios where some type of automated process is making changes in the Azure file share or the changes are done by an administrator (like moving files and directories into the share). For end-user changes, the recommendation is to install the Azure File Sync agent in an IaaS VM and have end users access the file share through the IaaS VM. This way all changes will quickly sync to other agents without the need to use the Invoke-AzStorageSyncChangeDetection cmdlet. To learn more, see the [Invoke-AzStorageSyncChangeDetection](https://docs.microsoft.com/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) documentation.
- Improved portal experience if you encounter files that are not syncing
	- If you have files that are failing to sync, we now differentiate between transient and persistent errors in the portal. Transient errors usually resolve themselves without the need for admin action. For example, a file that is currently in use will not sync until the file handle is closed. For persistent errors, we now show the number of files impacted by each error. The persistent error count is also displayed in the files not syncing column of all server endpoints in a sync group.
- Improved Azure Backup file-level restore
	- Individual files restored using Azure Backup are now detected and synced to the server endpoint faster.
- Improved cloud tiering recall cmdlet reliability 
	- The Invoke-StorageSyncFileRecall cmdlet now allows customers to specify per file retry count and per file retry delay similar to robocopy. Previously, this cmdlet would recall all tiered files under a given path in random order. With the new -Order parameter, this cmdlet will recall the hottest data first and honor the cloud tiering policy (stop recalling if the date policy is met or the volume free space is met; whichever happens first).
- Support for TLS 1.2 only (TLS 1.0 and 1.1 is disabled)
	- Azure File Sync now supports using TLS 1.2 only on servers that have TLS 1.0 and 1.1 disabled. Prior to this improvement, server registration would fail if TLS 1.0 and 1.1 was disabled on the server.
- Miscellaneous performance and reliability improvements for sync and cloud tiering
	- There are several reliability and performance improvements in this release. Some of them are targeted to make cloud tiering more efficient and Azure File Sync as a whole work better in those situations when you have a bandwidth throttling schedule set.

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
- Tiered files will become inaccessible if the files are not recalled prior to deleting the server endpoint. To restore access to the files, recreate the server endpoint. If 30 days have passed since the server endpoint was deleted or if the cloud endpoint was deleted, tiered files that were not recalled will be unusable.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Agent version 6.3.0.0
The following release notes are for version 6.3.0.0 of the Azure File Sync agent released June 27, 2019. These notes are in addition to the release notes listed for version 6.0.0.0.

List of issues fixed in this release:  
- Accessing or browsing a server endpoint location over SMB is slow on Windows Server 2012 R2 
- Increased CPU utilization after installing the Azure File Sync v6 agent
- Cloud tiering telemetry improvements

## Agent version 6.2.0.0
The following release notes are for version 6.2.0.0 of the Azure File Sync agent released June 13, 2019. These notes are in addition to the release notes listed for version 6.0.0.0.

List of issues fixed in this release:  
- After creating a server endpoint, High CPU usage may occur when background recall is downloading files to the server
- Sync and cloud tiering operations may fail with error ECS_E_SERVER_CREDENTIAL_NEEDED due to token expiration
- Recalling a file may fail if the URL to download the file contains reserved characters 

## Agent version 6.1.0.0
The following release notes are for version 6.1.0.0 of the Azure File Sync agent released May 6, 2019. These notes are in addition to the release notes listed for version 6.0.0.0.

List of issues fixed in this release:  
- Windows Admin Center fails to display the agent version and server endpoint configuration on servers which have Azure File Sync agent version 6.0 installed.

## Agent version 6.0.0.0
The following release notes are for version 6.0.0.0 of the Azure File Sync agent (released April 22, 2019).

### Improvements and issues that are fixed

- Agent auto-update support
  - We have heard your feedback and added an auto-update feature into the Azure File Sync server agent. For more information, see [Azure File Sync agent update policy](https://docs.microsoft.com/azure/storage/files/storage-files-release-notes#azure-file-sync-agent-update-policy).
- Support for Azure file share ACLs
  - Azure File Sync has always supported syncing ACLs between server endpoints but the ACLs were not synced to the cloud endpoint (Azure file share). This release adds support for syncing ACLs between server and cloud endpoints.
- Parallel upload and download sync sessions for a server endpoint 
  - Server endpoints now support uploading and downloading files at the same time. No more waiting for a download to complete so files can be uploaded to the Azure file share. 
- New Cloud Tiering cmdlets to get volume and tiering status
  - Two new, server-local PowerShell cmdlets can now be used to obtain cloud tiering and file recall information. They make logging information from two event channels on the server available:
    - Get-StorageSyncFileTieringResult will list all files and their paths that haven't tiered and reports on the reason why.
    - Get-StorageSyncFileRecallResult reports all file recall events. It lists every file recalled and its path as well as success or error for that recall.
  - By default, both event channels can store up to 1 MB each – you can increase the amount of files reported by increasing the event channel size.
- Support for FIPS mode
  - Azure File Sync now supports enabling FIPS mode on servers which have the Azure File Sync agent installed.
    - Prior to enabling FIPS mode on your server, install the Azure File Sync agent and [PackageManagement module](https://www.powershellgallery.com/packages/PackageManagement/1.1.7.2) on your server. If FIPS is already enabled on the server, [manually download](/powershell/scripting/gallery/how-to/working-with-packages/manual-download) the [PackageManagement module](https://www.powershellgallery.com/packages/PackageManagement/1.1.7.2) to your server.
- Miscellaneous reliability improvements for cloud tiering and sync

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
- Running sysprep on a server which has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

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
- Tiered files will become inaccessible if the files are not recalled prior to deleting the server endpoint. To restore access to the files, recreate the server endpoint. If 30 days have passed since the server endpoint was deleted or if the cloud endpoint was deleted, tiered files that were not recalled will be unusable.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.

## Agent version 5.2.0.0
The following release notes are for version 5.2.0.0 of the Azure File Sync agent released April 4, 2019. These notes are in addition to the release notes listed for version 5.0.2.0.

List of issues fixed in this release:  
- Reliability improvements for offline data transfer and data transfer resume features
- Sync telemetry improvements

## Agent version 5.1.0.0
The following release notes are for version 5.1.0.0 of the Azure File Sync agent released March 7, 2019. These notes are in addition to the release notes listed for version 5.0.2.0.

List of issues fixed in this release:  
- Files may fail to sync with error 0x80c8031d (ECS_E_CONCURRENCY_CHECK_FAILED) if change enumeration is failing on the server
- If a sync session or file receives an error 0x80072f78 (WININET_E_INVALID_SERVER_RESPONSE), sync will now retry the operation
- Files may fail to sync with error 0x80c80203 (ECS_E_SYNC_INVALID_STAGED_FILE)
- High memory usage may occur when recalling files
- Cloud tiering telemetry improvements 

## Agent version 5.0.2.0
The following release notes are for version 5.0.2.0 of the Azure File Sync agent (released February 12, 2019).

### Improvements and issues that are fixed

- Support for Azure Government cloud
  - We have added preview support for the Azure Government cloud. This requires a white-listed subscription and a special agent download from Microsoft. To get access to the preview, please email us directly at [AzureFiles@microsoft.com](mailto:AzureFiles@microsoft.com).
- Support for Data Deduplication
    - Data Deduplication is now fully supported with cloud tiering enabled on Windows Server 2016 and Windows Server 2019. Enabling deduplication on a volume with cloud tiering enabled lets you cache more files on-premises without provisioning more storage.
- Support for offline data transfer (e.g. via Data Box)
    - Easily migrate large amounts of data into Azure File Sync via any means you choose. You can choose Azure Data Box, AzCopy and even third-party migration services. No need to use massive amounts of bandwidth to get your data into Azure, in the case of Data Box – simply mail it there! To learn more, see [Offline Data Transfer Docs](https://aka.ms/AFS/OfflineDataTransfer).
- Improved sync performance
    - Customers with multiple server endpoints on the same volume may have experienced slow sync performance prior to this release. Azure File Sync creates a temporary VSS snapshot once a day on the server to sync files that have open handles. Sync now supports multiple server endpoints syncing on a volume when a VSS sync session is active. No more waiting for a VSS sync session to complete so sync can resume on other server endpoints on the volume.
- Improved monitoring in the portal
    - Charts have been added in the Storage Sync Service portal to view:
        - Number of files synced
        - Size of data transferred
        - Number of files not syncing
        - Size of data recalled
        - Server connectivity status
    - To learn more, see [Monitor Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-monitoring).
- Improved scalability and reliability
    - Maximum number of file system objects (directories and files) in a directory has increased to 1,000,000. Previous limit was 200,000.
    - Sync will try to resume data transfer rather than retransmitting when a transfer is interrupted for large files 

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.
- FIPS mode is not supported and must be disabled. 

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server which has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

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
- Tiered files will become inaccessible if the files are not recalled prior to deleting the server endpoint. To restore access to the files, recreate the server endpoint. If 30 days have passed since the server endpoint was deleted or if the cloud endpoint was deleted, tiered files that were not recalled will be unusable.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
