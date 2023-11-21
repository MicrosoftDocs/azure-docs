---
title: Release notes for Azure File Sync
description: Release notes for Azure File Sync which lets you centralize your organization's file shares in Azure Files.
services: storage
author: wmgries
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 11/3/2023
ms.author: wgries
---

# Release notes for Azure File Sync
Azure File Sync enables centralizing your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of a Windows file server. While some users may opt to keep a full copy of their data locally, Azure File Sync additionally has the ability to transform Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article provides the release notes for Azure File Sync. It is important to note that major releases of Azure File Sync include service and agent improvements (for example, 15.0.0.0). Minor releases of Azure File Sync are typically for agent improvements (for example, 15.2.0.0).

## Supported versions
The following Azure File Sync agent versions are supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V16.0 Release - [KB5013877](https://support.microsoft.com/topic/ffdc8fe2-c653-43c8-8b47-0865267fd520)| 16.0.0.0 | January 30, 2023 | Supported |
| V15.2 Release - [KB5013875](https://support.microsoft.com/topic/9159eee2-3d16-4523-ade4-1bac78469280)| 15.2.0.0 | November 21, 2022 | Supported - Agent version will expire on March 19, 2024 |
| V15.1 Release - [KB5003883](https://support.microsoft.com/topic/45761295-d49a-431e-98ec-4fb3329b0544)| 15.1.0.0 | September 19, 2022 | Supported - Agent version will expire on March 19, 2024 |
| V15 Release - [KB5003882](https://support.microsoft.com/topic/2f93053f-869b-4782-a832-e3c772a64a2d)| 15.0.0.0 | March 30, 2022 | Supported - Agent version will expire on March 19, 2024 |
| V14.1 Release - [KB5001873](https://support.microsoft.com/topic/d06b8723-c4cf-4c64-b7ec-3f6635e044c5)| 14.1.0.0 | December 1, 2021 | Supported - Agent version will expire on January 23, 2024 |
| V14 Release - [KB5001872](https://support.microsoft.com/topic/92290aa1-75de-400f-9442-499c44c92a81)| 14.0.0.0 | October 29, 2021 | Supported - Agent version will expire on January 23, 2024 |

## Unsupported versions
The following Azure File Sync agent versions have expired and are no longer supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V13 Release | 13.0.0.0 | N/A | Not Supported - Agent versions expired on August 8, 2022 |
| V12 Release | 12.0.0.0 - 12.1.0.0 | N/A | Not Supported - Agent versions expired on May 23, 2022 |
| V11 Release | 11.1.0.0 - 11.3.0.0 | N/A | Not Supported - Agent versions expired on March 28, 2022 |
| V10 Release | 10.0.0.0 - 10.1.0.0 | N/A | Not Supported - Agent versions expired on June 28, 2021 |
| V9 Release | 9.0.0.0 - 9.1.0.0 | N/A | Not Supported - Agent versions expired on February 16, 2021 |
| V8 Release | 8.0.0.0 | N/A | Not Supported - Agent versions expired on January 12, 2021 |
| V7 Release | 7.0.0.0 - 7.2.0.0 | N/A | Not Supported - Agent versions expired on September 1, 2020 |
| V6 Release | 6.0.0.0 - 6.3.0.0 | N/A | Not Supported - Agent versions expired on April 21, 2020 |
| V5 Release | 5.0.2.0 - 5.2.0.0 | N/A | Not Supported - Agent versions expired on March 18, 2020 |
| V4 Release | 4.0.1.0 - 4.3.0.0 | N/A | Not Supported - Agent versions expired on November 6, 2019 |
| V3 Release | 3.1.0.0 - 3.4.0.0 | N/A | Not Supported - Agent versions expired on August 19, 2019 |
| Pre-GA agents | 1.1.0.0 - 3.0.13.0 | N/A | Not Supported - Agent versions expired on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Version 16.0.0.0
The following release notes are for Azure File Sync version 16.0.0.0 (released January 30, 2023). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed
- Improved Azure File Sync service availability
	- Azure File Sync is now a zone-redundant service which means an outage in a zone has limited impact while improving the service resiliency to minimize customer impact. To fully leverage this improvement, configure your storage accounts to use zone-redundant storage (ZRS) or Geo-zone redundant storage (GZRS) replication. To learn more about different redundancy options for your storage accounts, see [Azure Files redundancy](../files/files-redundancy.md).
- Immediately run server change enumeration to detect files changes that were missed on the server
	- Azure File Sync uses the [Windows USN journal](/windows/win32/fileio/change-journals) feature on Windows Server to immediately detect files that were changed and upload them to the Azure file share. If files changed are missed due to journal wrap or other issues, the files will not sync to the Azure file share until the changes are detected. Azure File Sync has a server change enumeration job that runs every 24 hours on the server endpoint path to detect changes that were missed by the USN journal. If you don't want to wait until the next server change enumeration job runs, you can now use the Invoke-StorageSyncServerChangeDetection PowerShell cmdlet to immediately run server change enumeration on a server endpoint path.
		
		To immediately run server change enumeration on a server endpoint path, run the following PowerShell commands:
		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Invoke-StorageSyncServerChangeDetection -ServerEndpointPath <path>
		```
	> [!Note]
	> By default, the server change enumeration scan will only check the modified timestamp. To perform a deeper check, use the -DeepScan parameter.

- Bug fix for the PowerShell script FileSyncErrorsReport.ps1

- Miscellaneous reliability and telemetry improvements for cloud tiering and sync

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent installation package is for a specific operating system version. If a server with an Azure File Sync agent installed is upgraded to a newer operating system version, the existing agent must be uninstalled, restart the server and install the agent for the new server operating system (Windows Server 2016, Windows Server 2019, or Windows Server 2022).
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for a list of unsupported characters.
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

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Version 15.2.0.0
The following release notes are for Azure File Sync version 15.2.0.0 (released November 21, 2022). This release contains improvements for the Azure File Sync agent. These notes are in addition to the release notes listed for version 15.0.0.0.

### Improvements and issues that are fixed 

- Fixed a cloud tiering issue in the v15.1 agent that caused the following symptoms:
	- Memory usage is higher after upgrading to v15.1.
	- Storage Sync Agent (FileSyncSvc) service intermittently crashes.
	- Files are failing to recall with error ERROR_INVALID_HANDLE (0x00000006).
- Fixed a health reporting issue with servers configured to use a non-Gregorian calendar.

## Version 15.1.0.0
The following release notes are for Azure File Sync version 15.2.0.0 (released September 19, 2022). This release contains improvements for the Azure File Sync agent. These notes are in addition to the release notes listed for version 15.0.0.0.

### Improvements and issues that are fixed 
- Low disk space mode to prevent running out of disk space when using cloud tiering.
	- Low disk space mode is designed to handle volumes with low free space more effectively. On a server endpoint with cloud tiering enabled, if the free space on the volume reaches below a threshold, Azure File Sync considers the volume to be in Low disk space mode.  
		 
		In this mode, Azure File Sync does two things to free up space on the volume: 
	
		- Files are tiered to the Azure file share more proactively.
		- Tiered files accessed by the user will not be persisted to the disk. 
		
		To learn more, see the [low disk space mode](file-sync-cloud-tiering-overview.md#low-disk-space-mode) section in the Cloud tiering overview documentation.

- Fixed a cloud tiering issue that caused high CPU usage after v15.0 agent is installed. 

- Miscellaneous reliability and telemetry improvements.

## Version 15.0.0.0
The following release notes are for Azure File Sync version 15.0.0.0 (released March 30, 2022). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed
- Reduced transactions when cloud change enumeration job runs 
	- Azure File Sync has a cloud change enumeration job that runs every 24 hours to detect changes made directly in the Azure file share and sync those changes to servers in your sync groups. In the v14 release, we made improvements to reduce the number of transactions when this job runs and in the v15 release we made further improvements. The transaction cost is also more predictable, each job will now produce 1 List transaction per directory, per day.
 
- View Cloud Tiering status for a server endpoint or volume
	- The `Get-StorageSyncCloudTieringStatus` cmdlet will show cloud tiering status for a specific server endpoint or for a specific volume (depending on path specified). The cmdlet will show current policies, current distribution of tiered vs. fully downloaded data, and last tiering session statistics if the server endpoint path is specified. If the volume path is specified, it will show the effective volume free space policy, the server endpoints located on that volume, and whether these server endpoints have cloud tiering enabled.
 
		To get the cloud tiering status for a server endpoint or volume, run the following PowerShell commands:
 		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Get-StorageSyncCloudTieringStatus -Path <server endpoint path or volume>
 		```
- New diagnostic and troubleshooting tool 
	- The Debug-StorageSyncServer cmdlet will diagnose common issues like certificate misconfiguration and incorrect server time. Also, we have simplified Azure File Sync troubleshooting by merging the functionality of some of existing scripts and cmdlets (AFSDiag.ps1, FileSyncErrorsReport.ps1, Test-StorageSyncNetworkConnectivity) into the `Debug-StorageSyncServer` cmdlet.
 
		To run diagnostics on the server, run the following PowerShell commands:
 		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Debug-StorageSyncServer -Diagnose
 		```
		To test network connectivity on the server, run the following PowerShell commands:
		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Debug-StorageSyncServer -TestNetworkConnectivity
		```
		To identify files that are failing to sync on the server, run the following PowerShell commands:
		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Debug-StorageSyncServer -FileSyncErrorsReport
		```
		To collect logs and traces on the server, run the following PowerShell commands:
		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Debug-StorageSyncServer -AFSDiag -OutputDirectory C:\output -KernelModeTraceLevel Verbose -UserModeTraceLevel Verbose
 		```
- Miscellaneous improvements
	- Reliability and telemetry improvements for cloud tiering and sync.

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for a list of unsupported characters.
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

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Version 14.1.0.0
The following release notes are for Azure File Sync version 14.1.0.0 (released December 1, 2021). This release contains improvements for the Azure File Sync agent. These notes are in addition to the release notes listed for version 14.0.0.0.

### Improvements and issues that are fixed 
- Tiered files deleted on Windows Server 2022 are not detected by cloud tiering filter driver
	- This issue occurs because the DeleteFile API on Windows Server 2022 uses the FILE_DISPOSITION_INFORMATION_EX class to delete files. The v14.1 release adds support for detecting tiered files deleted using the FILE_DISPOSITION_INFORMATION_EX class.
    
    > [!Note]  
    > This issue can also impact Windows 2016 and Windows Server 2019 if a tiered file is deleted using the FILE_DISPOSITION_INFORMATION_EX class.

## Version 14.0.0.0
The following release notes are for Azure File Sync version 14.0.0.0 (released October 29, 2021). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed
- Reduced transactions when cloud change enumeration job runs 
	- Azure File Sync has a cloud change enumeration job that runs every 24 hours to detect changes made directly in the Azure file share and sync those changes to servers in your sync groups. We have made improvements to reduce the number of transactions when this job runs.

- Improved server endpoint deprovisioning guidance in the portal
	- When removing a server endpoint via the portal, we now provide step by step guidance based on the reason behind deleting the server endpoint, so that you can avoid data loss and ensure your data is where it needs to be (server or Azure file share). This feature also includes new PowerShell cmdlets (Get-StorageSyncStatus & New-StorageSyncUploadSession) that you can use on your local server to aid you through the deprovisioning process.

- Invoke-AzStorageSyncChangeDetection cmdlet improvements
	- Prior to the v14 release, if you made changes directly in the Azure file share, you could use the Invoke-AzStorageSyncChangeDetection cmdlet to detect the changes and sync them to the servers in your sync group. However, the cmdlet would fail to run if the path specified contained more than 10,000 items. We have improved the Invoke-AzStorageSyncChangeDetection cmdlet and the 10,000 item limit no longer applies when scanning the entire share. To learn more, see the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) documentation.

- Miscellaneous improvements
	- Azure File Sync is now supported in West US 3 region.
	- Fixed a bug that caused the FileSyncErrorsReport.ps1 script to not provide the list of all per-item errors.
	- Reduced transactions when a file consistently fails to upload due to a per-item sync error.
	- Reliability and telemetry improvements for cloud tiering and sync. 

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- A restart is required for servers that have an existing Azure File Sync agent installation if the agent version is less than version 12.0.
- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for a list of unsupported characters.
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

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
