---
title: Release notes for the Azure File Sync agent | Microsoft Docs
description: Release notes for the Azure File Sync agent.
services: storage
author: wmgries
ms.service: storage
ms.topic: article
ms.date: 7/12/2019
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
| July 2019 update rollup - [KB4490496](https://support.microsoft.com/help/4490496)| 7.1.0.0 | July 12, 2019 | Supported - [Flighting](https://docs.microsoft.com/azure/storage/files/storage-files-release-notes#automatic-agent-lifecycle-management) |
| V7 Release - [KB4490495](https://support.microsoft.com/help/4490495)| 7.0.0.0 | June 19, 2019 | Supported |
| June 2019 update rollup - [KB4489739](https://support.microsoft.com/help/4489739)| 6.3.0.0 | June 27, 2019 | Supported |
| June 2019 update rollup - [KB4489738](https://support.microsoft.com/help/4489738)| 6.2.0.0 | June 13, 2019 | Supported |
| May 2019 update rollup - [KB4489737](https://support.microsoft.com/help/4489737)| 6.1.0.0 | May 7, 2019 | Supported |
| V6 Release - [KB4489736](https://support.microsoft.com/help/4489736)| 6.0.0.0 | April 21, 2019 | Supported |
| April 2019 update rollup - [KB4481061](https://support.microsoft.com/help/4481061)| 5.2.0.0 | April 4, 2019 | Supported |
| March 2019 update rollup - [KB4481060](https://support.microsoft.com/help/4481060)| 5.1.0.0 | March 7, 2019 | Supported |
| V5 Release - [KB4459989](https://support.microsoft.com/help/4459989)| 5.0.2.0 | February 12, 2019 | Supported |
| January 2019 update rollup - [KB4481059](https://support.microsoft.com/help/4481059)| 4.3.0.0 | January 14, 2019 | Supported |
| December 2018 update rollup - [KB4459990](https://support.microsoft.com/help/4459990)| 4.2.0.0 | December 10, 2018 | Supported |
| December 2018 update rollup | 4.1.0.0 | December 4, 2018 | Supported |
| V4 Release | 4.0.1.0 | November 13, 2018 | Supported |
| September 2018 update rollup | 3.3.0.0 | September 24, 2018 | Supported - Agent version will expire on July 19, 2019 |
| August 2018 update rollup | 3.2.0.0 | August 15, 2018 | Supported - Agent version will expire on July 19, 2019 |
| General availability | 3.1.0.0 | July 19, 2018 | Supported - Agent version will expire on July 19, 2019 |
| Expired agents | 1.1.0.0 - 3.0.13.0 | N/A | Not Supported - Agent versions expired on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

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
	- With the preview of larger Azure file shares, we are increasing our support limits for file sync as well. In this first step, Azure File Sync now supports up to 25TB and 50million files in a single, syncing namespace. To apply for the large file share preview, fill in this form https://aka.ms/azurefilesatscalesurvey. 
- Improved Azure Backup file-level restore
	- Individual files restored using Azure Backup are now detected and synced to the server endpoint faster.
- Improved cloud tiering recall cmdlet reliability 
	- The cloud tiering recall cmdlet (Invoke-StorageSyncFileRecall) now supports per file retry count and retry delay, similar to robocopy.
- Support for TLS 1.2 only (TLS 1.0 and 1.1 is disabled)
	- Azure File Sync now supports using TLS 1.2 only on servers which have TLS 1.0 and 1.1 disabled. Prior to this improvement, server registration would fail if TLS 1.0 and 1.1 was disabled on the server.
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
  - By default, both event channels can store up to 1MB each – you can increase the amount of files reported by increasing the event channel size.
- Support for FIPS mode
  - Azure File Sync now supports enabling FIPS mode on servers which have the Azure File Sync agent installed.
    - Prior to enabling FIPS mode on your server, install the Azure File Sync agent and [PackageManagement module](https://www.powershellgallery.com/packages/PackageManagement/1.1.7.2) on your server. If FIPS is already enabled on the server, [manually download](https://docs.microsoft.com/powershell/gallery/how-to/working-with-packages/manual-download) the [PackageManagement module](https://www.powershellgallery.com/packages/PackageManagement/1.1.7.2) to your server.
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
    - Easily migrate large amounts of data into Azure File Sync via any means you choose. You can choose Azure Data Box, AzCopy and even third party migration services. No need to use massive amounts of bandwidth to get your data into Azure, in the case of Data Box – simply mail it there! To learn more, see [Offline Data Transfer Docs](https://aka.ms/AFS/OfflineDataTransfer).
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

## Agent version 4.3.0.0
The following release notes are for version 4.3.0.0 of the Azure File Sync agent released January 14, 2019. These notes are in addition to the release notes listed for version 4.0.1.0.

List of issues fixed in this release:  
- Files are not tiered after upgrading the Azure File Sync agent to version 4.x.
- AfsUpdater.exe is now supported on Windows Server 2019.
- Miscellaneous reliability improvements for sync. 

## Agent version 4.2.0.0
The following release notes are for version 4.2.0.0 of the Azure File Sync agent released December 10, 2018. These notes are in addition to the release notes listed for version 4.0.1.0.

List of issues fixed in this release:  
- A Stop error 0x3B or Stop error 0x1E may occur when a VSS snapshot is created.  
- A memory leak may occur when cloud tiering is enabled  

## Agent version 4.1.0.0
The following release notes are for version 4.1.0.0 of the Azure File Sync agent released December 4, 2018. These notes are in addition to the release notes listed for version 4.0.1.0.

List of issues fixed in this release:  
- The server may become unresponsive because of a cloud-tiering memory leak.  
- Agent installation fails with the following error: Error 1921. Service 'Storage Sync Agent' (FileSyncSvc) could not be stopped.  Verify that you have sufficient privileges to stop system services.  
- The Storage Sync Agent (FileSyncSvc) service may crash when memory usage is high.  
- Miscellaneous reliability improvements for cloud tiering and sync.

## Agent version 4.0.1.0
The following release notes are for version 4.0.1.0 of the Azure File Sync agent (released November 13, 2018).

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
- A stop error 0x3B or stop error 0x1E may occur when a VSS snapshot is created.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server which has the Azure File Sync agent installed is not supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.
- Data deduplication and cloud tiering aren't supported on the same volume.

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
- The date-based cloud tiering policy setting is used to specify files that should be cached if accessed in a specified number of days. To learn more, see [Cloud Tiering Overview](https://docs.microsoft.com/azure/storage/files/storage-sync-cloud-tiering#afs-force-tiering).
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.

## Agent version 3.3.0.0
The following release notes are for version 3.3.0.0 of the Azure File Sync agent released September 24, 2018. These notes are in addition to the release notes listed for version 3.1.0.0.

List of issues fixed in this release:
- Registered server state is “Appears offline” after the Azure File Sync agent is upgraded to version 3.1 or 3.2.
- Storage Sync Agent (FileSyncSvc) service crashes due to files that have long paths.
- Server registration fails with error: Could not load file or assembly Kailani.Afs.StorageSyncProtocol.V3.

## Agent version 3.2.0.0
The following release notes are for version 3.2.0.0 of the Azure File Sync agent released August 15, 2018. These notes are in addition to the release notes listed for version 3.1.0.0.

This release includes the following fix:
- Sync fails with out of memory error (0x8007000e) due to memory leak

## Agent version 3.1.0.0
The following release notes are for version 3.1.0.0 of the Azure File Sync agent (released July 19, 2018).

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-cmdlet) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and Windows Server 2012 R2.
- The agent requires at least 2 GB of physical memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.
- FIPS mode is not supported and must be disabled. 

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- Don't use File Server Resource Manager (FSRM) or other file screens. File screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server which has the Azure File Sync agent installed is not supported and can lead to unexpected results. Agent installation and server registration should occur after deploying the server image and completing sysprep mini-setup.
- Data deduplication and cloud tiering aren't supported on the same volume.

### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
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
- Tiered files will become unusable if the files are not recalled prior to deleting the server endpoint.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Don't store an OS or application paging file that's within a server endpoint.
- The server name in the portal is not updated if the server is renamed.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
