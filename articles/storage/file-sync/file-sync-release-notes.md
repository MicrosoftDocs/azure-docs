---
title: Release notes for the Azure File Sync agent | Microsoft Docs
description: Read the release notes for the Azure File Sync agent, which lets you centralize your organization's file shares in Azure Files.
services: storage
author: wmgries
ms.service: storage
ms.topic: conceptual
ms.date: 4/7/2021
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
| V12 Release - [KB4568585](https://support.microsoft.com/topic/b9605f04-b4af-4ad8-86b0-2c490c535cfd)| 12.0.0.0 | March 26, 2021 | Supported - Flighting |
| V11.3 Release - [KB4539953](https://support.microsoft.com/topic/f68974f6-bfdd-44f4-9659-bf2d8a696c26)| 11.3.0.0 | April 7, 2021 | Supported |
| V11.2 Release - [KB4539952](https://support.microsoft.com/topic/azure-file-sync-agent-v11-2-release-february-2021-c956eaf0-cd8e-4511-98c0-e5a1f2c84048)| 11.2.0.0 | February 2, 2021 | Supported |
| V11.1 Release - [KB4539951](https://support.microsoft.com/help/4539951)| 11.1.0.0 | November 4, 2020 | Supported |
| V10.1 Release - [KB4522411](https://support.microsoft.com/help/4522411)| 10.1.0.0 | June 5, 2020 | Supported - Agent version will expire on June 7, 2021 |
| May 2020 update rollup - [KB4522412](https://support.microsoft.com/help/4522412)| 10.0.2.0 | May 19, 2020 | Supported - Agent version will expire on June 7, 2021 |
| V10 Release - [KB4522409](https://support.microsoft.com/help/4522409)| 10.0.0.0 | April 9, 2020 | Supported - Agent version will expire on June 7, 2021 |

## Unsupported versions
The following Azure File Sync agent versions have expired and are no longer supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V9 Release | 9.0.0.0 - 9.1.0.0 | N/A | Not Supported - Agent version expired on February 16, 2021 |
| V8 Release | 8.0.0.0 | N/A | Not Supported - Agent version expired on January 12, 2021 |
| V7 Release | 7.0.0.0 - 7.2.0.0 | N/A | Not Supported - Agent versions expired on September 1, 2020 |
| V6 Release | 6.0.0.0 - 6.3.0.0 | N/A | Not Supported - Agent versions expired on April 21, 2020 |
| V5 Release | 5.0.2.0 - 5.2.0.0 | N/A | Not Supported - Agent versions expired on March 18, 2020 |
| V4 Release | 4.0.1.0 - 4.3.0.0 | N/A | Not Supported - Agent versions expired on November 6, 2019 |
| V3 Release | 3.1.0.0 - 3.4.0.0 | N/A | Not Supported - Agent versions expired on August 19, 2019 |
| Pre-GA agents | 1.1.0.0 - 3.0.13.0 | N/A | Not Supported - Agent versions expired on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Agent version 12.0.0.0
The following release notes are for version 12.0.0.0 of the Azure File Sync agent (released March 26, 2021).

### Improvements and issues that are fixed
- New portal experience to configure network access policy and private endpoint connections
	- You can now use the portal to disable access to the Storage Sync Service public endpoint and to approve, reject and remove private endpoint connections. To configure the network access policy and private endpoint connections, open the Storage Sync Service portal, go to the Settings section and click Network.
 
- Cloud Tiering support for volume cluster sizes larger than 64KiB
	- Cloud Tiering now supports volume cluster sizes up to 2MiB on Server 2019. To learn more, see [What is the minimum file size for a file to tier?](https://docs.microsoft.com/azure/storage/files/storage-sync-choose-cloud-tiering-policies#minimum-file-size-for-a-file-to-tier).
 
- Measure bandwidth and latency to Azure File Sync service and storage account
	- The Test-StorageSyncNetworkConnectivity cmdlet can now be used to measure latency and bandwidth to the Azure File Sync service and storage account. Latency to the Azure File Sync service and storage account is measured by default when running the cmdlet.  Upload and download bandwidth to the storage account is measured when using the "-MeasureBandwidth" parameter.
 
		For example, to measure bandwidth and latency to the Azure File Sync service and storage account, run the following PowerShell commands:
 
 		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Test-StorageSyncNetworkConnectivity -MeasureBandwidth 
		``` 
 
- Improved error messages in the portal when server endpoint creation fails
	- We heard your feedback and have improved the error messages and guidance when server endpoint creation fails.
 
- Miscellaneous performance and reliability improvements
	- Improved change detection performance to detect files that have changed in the Azure file share.
	- Performance improvements for reconciliation sync sessions. 
	- Sync improvements to reduce ECS_E_SYNC_METADATA_KNOWLEDGE_SOFT_LIMIT_REACHED and ECS_E_SYNC_METADATA_KNOWLEDGE_LIMIT_REACHED errors.
	- Fixed a bug that causes data corruption if cloud tiering is enabled and tiered files are copied using Robocopy with the /B parameter.
	- Fixed a bug that can cause files to fail to tier on Server 2019 if Data Deduplication is enabled on the volume.
	- Fixed a bug that can cause AFSDiag to fail to compress files if a file is larger than 2GiB.

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- A restart is required for servers that have an existing Azure File Sync agent installation.
- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](file-sync-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](file-sync-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
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
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](file-sync-troubleshoot.md?tabs=portal1%252cportal#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Agent version 11.3.0.0
The following release notes are for version 11.3.0.0 of the Azure File Sync agent released April 7, 2021. These notes are in addition to the release notes listed for version 11.1.0.0.

### Improvements and issues that are fixed 
Fixed a bug that causes data corruption if cloud tiering is enabled and tiered files are copied using Robocopy with the /B parameter.

## Agent version 11.2.0.0
The following release notes are for version 11.2.0.0 of the Azure File Sync agent released February 2, 2021. These notes are in addition to the release notes listed for version 11.1.0.0.

### Improvements and issues that are fixed 
- If a sync session is canceled due to a high number of per-item errors, sync may go through reconciliation when a new session starts if the Azure File Sync service determines a custom sync session is needed to correct the per-item errors.
- Registering a server using the Register-AzStorageSyncServer cmdlet may fail with "Unhandled Exception" error.
- New PowerShell cmdlet (Add-StorageSyncAllowedServerEndpointPath) to configure allowed server endpoints paths on a server. This cmdlet is useful for scenarios in which the Azure File Sync deployment is managed by a Cloud Solution Provider (CSP) or Service Provider and the customer wants to configure allowed server endpoints paths on a server. When creating a server endpoint, if the path specified is not in the allowlist, the server endpoint creation will fail. Note, this is an optional feature and all supported paths are allowed by default when creating a server endpoint.  

	
	- To add a server endpoint path that’s allowed, run the following PowerShell commands on the server:

	```powershell
	Import-Module 'C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll' -verbose
	Add-StorageSyncAllowedServerEndpointPath -Path <path>
	```  

	- To get the list of supported paths, run the following PowerShell command:
	
	```powershell
	Get-StorageSyncAllowedServerEndpointPath
	```  	
	- To remove a path, run the following PowerShell command:
	
	```powershell
	Remove-StorageSyncAllowedServerEndpointPath -Path <path>
	```  
## Agent version 11.1.0.0
The following release notes are for version 11.1.0.0 of the Azure File Sync agent (released November 4, 2020).

### Improvements and issues that are fixed
- New cloud tiering modes to control initial download and proactive recall
	- Initial download mode: you can now choose how you want your files to be initially downloaded onto your new server endpoint. Want all your files tiered or as many files as possible downloaded onto your server by last modified timestamp? You can do that! Can't use cloud tiering? You can now opt to avoid tiered files on your system. To learn more, see [Create a server endpoint](../file-sync/file-sync-deployment-guide.md?tabs=azure-portal%252cproactive-portal#create-a-server-endpoint) section in the Deploy Azure File Sync documentation.
	- Proactive recall mode: whenever a file is created or modified, you can proactively recall it to servers that you specify within the same sync group. This makes the file readily available for consumption in each server you specified. Have teams across the globe working on the same data? Enable proactive recalling so that when the team arrives the next morning, all the files updated by a team in a different time zone are downloaded and ready to go! To learn more, see [Proactively recall new and changed files from an Azure file share](../file-sync/file-sync-deployment-guide.md?tabs=azure-portal%252cproactive-portal#proactively-recall-new-and-changed-files-from-an-azure-file-share) section in the Deploy Azure File Sync documentation.

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
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](../file-sync/file-sync-planning.md#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md) and [How to deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](../file-sync/file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](../file-sync/file-sync-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](../file-sync/file-sync-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
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
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](../file-sync/file-sync-troubleshoot.md?tabs=portal1%252cportal#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
    > [!Warning]  
    > Robocopy /B switch is not supported with Azure File Sync. Using the Robocopy /B switch with an Azure File Sync server endpoint as the source may lead to file corruption.

## Agent version 10.1.0.0
The following release notes are for version 10.1.0.0 of the Azure File Sync agent released June 5, 2020. These notes are in addition to the release notes listed for version 10.0.0.0 and 10.0.2.0.

### Improvements and issues that are fixed

- Azure private endpoint support
	- Sync traffic to the Storage Sync Service can now be sent to a private endpoint. This enables tunneling over an ExpressRoute or VPN connection. To learn more, see [Configuring Azure File Sync network endpoints](../file-sync/file-sync-networking-endpoints.md).
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
	- Improved performance when using the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) cmdlet.
	- Other miscellaneous reliability improvements. 
	
### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](../file-sync/file-sync-planning.md#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md) and [How to deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](../file-sync/file-sync-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](../file-sync/file-sync-troubleshoot.md#handling-unsupported-characters) for list of unsupported characters.
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
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](../file-sync/file-sync-troubleshoot.md?tabs=portal1%252cportal#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
