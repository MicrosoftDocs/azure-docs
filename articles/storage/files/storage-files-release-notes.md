---
title: Release notes for the Azure File Sync agent | Microsoft Docs
description: Release notes for the Azure File Sync agent.
services: storage
author: wmgries
ms.service: storage
ms.topic: article
ms.date: 08/30/2018
ms.author: wgries
ms.component: files
---

# Release notes for the Azure File Sync agent
Azure File Sync allows you to centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. Your Windows Server installations are transformed into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally (including SMB, NFS, and FTPS). You can have as many caches as you need around the world.

This article provides the release notes for the supported versions of the Azure File Sync agent.

## Supported versions
The following versions are supported for the Azure File Sync agent:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| August update rollup | 3.2.0.0 | August 15, 2018 | Supported (recommended version) |
| General availability | 3.1.0.0 | July 19, 2018 | Supported |
| June update rollup | 3.0.13.0 | June 29, 2018 | Agent version will expire on October 1, 2018 |
| Refresh 2 | 3.0.12.0 | May 22, 2018 | Agent version will expire on October 1, 2018 |
| April update rollup | 2.3.0.0 | May 8, 2018 | Agent version will expire on October 1, 2018 |
| March update rollup | 2.2.0.0 | March 12, 2018 | Agent version will expire on October 1, 2018 |
| February update rollup | 2.1.0.0 | February 28, 2018 | Agent version will expire on October 1, 2018 |
| Refresh 1 | 2.0.11.0 | February 8, 2018 | Agent version will expire on October 1, 2018 |
| January update rollup | 1.4.0.0 | January 8, 2018 | Agent version will expire on October 1, 2018 |
| November update rollup | 1.3.0.0 | November 30, 2017 | Agent version will expire on October 1, 2018 |
| October update rollup | 1.2.0.0 | October 31, 2017 | Agent version will expire on October 1, 2018 |
| Initial preview release | 1.1.0.0 | September 26, 2017 | Agent version will expire on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Agent version 3.2.0.0
The following release notes are for version 3.2.0.0 of the Azure File Sync agent released August 15, 2018. These notes are in addition to the release notes listed for version 3.1.0.0.

This release includes the following fix:
- Sync fails with out of memory error (0x8007000e) due to memory leak

## Agent version 3.1.0.0
The following release notes are for version 3.1.0.0 of the Azure File Sync agent (released July 19, 2018).

### Evaluation Tool
Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an AzureRM PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#evaluation-tool) section in the planning guide. 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and Windows Server 2012 R2.
- The agent requires at least 2 GB of physical memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

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
- The server name in the portal is not updated if the server is renamed. To update the server name in the portal, unregister and re-register the server.

### Cloud endpoint
- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group or subscription. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.

## Agent version 3.0.13.0
The following release notes are for version 3.0.13.0 of the Azure File Sync agent released June 29, 2018. These notes are in addition to the release notes listed for version 3.0.12.0.

This release includes the following fix:
- Sync fails if a server is added to an existing sync group if reparse points exist in the server endpoint location on the server.

## Agent version 3.0.12.0
The following release notes are for version 3.0.12.0 of the Azure File Sync agent (released May 22, 2018).

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and Windows Server 2012 R2.
- The agent requires at least 2 GB of physical memory.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

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
 
### Server endpoints
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Don't store an OS or application paging file that's within a server endpoint.
- Tiered files will become unusable if the files are not recalled prior to deleting the server endpoint.
 
### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.

## Agent version 2.3.0.0
The following release notes are for version 2.3.0.0 of the Azure File Sync agent released May 8, 2018. These notes are in addition to the release notes listed for version 2.0.11.0.

This release includes the following fixes:
- Agent updates may hang if the cloud tiering filter driver does not unload.
- Sync performance may decrease when syncing lots of files.

## Agent version 2.2.0.0
The following release notes are for version 2.2.0.0 of the Azure File Sync agent released March 12th, 2018.  These notes are in addition to the release notes listed for version 2.1.0.0 and 2.0.11.0

Installation of v2.1.0.0 for some customers would fail due to the FileSyncSvc not stopping. This update fixes that issue.

## Agent version 2.1.0.0
The following release notes are for version 2.1.0.0 of the Azure File Sync agent released February 28, 2018. These notes are in addition to the release notes listed for version 2.0.11.0.

This release includes the following changes:
- Improvements for cluster failover handling.
- Improvements for the reliable handling of tiered files.
- Support for installing the agent on domain controller machines that are added to a Windows Server 2008 R2 domain environment.
- Fixed in this release: generation of excessive diagnostics on servers with many files.
- Improvements for error handling of session failures.
- Improvements for error handling of file transfer issues.
- Changed in this release: the default interval to run cloud tiering when it's enabled on a server endpoint is now 1 hour. 
- Temporary blocking issue: moving Azure File Sync (Storage Sync Service) resources to a new Azure subscription.

## Agent version 2.0.11.0
The following release notes are for version 2.0.11.0 of the Azure File Sync agent (released February 9, 2018). 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package (MSI) must be installed with elevated (admin) permissions.
- The agent isn't supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and Windows Server 2012 R2.
- The agent requires at least 2 GB of physical memory.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- This release adds support for DFS-R. For more information, see the [Planning guide](storage-sync-files-planning.md#distributed-file-system-dfs).
- Don't use File Server Resource Manager (FSRM) or other file screens. File screens can cause endless sync failures when files are blocked because of the file screen.
- The duplication of Registered Servers (including VM cloning) can lead to unexpected results. In particular, sync might never converge.
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
 
### Server endpoints
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- A server endpoint can't be on the system volume. For example, C:\MyFolder isn't an acceptable path unless C:\MyFolder is a mount point.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- This release adds support for the sync root at the root of a volume.
- Don't store an OS or application paging file that's within a server endpoint.
- Changed in this release: added new events to track the total runtime for cloud tiering (EventID 9016), sync upload progress (EventID 9302), and files that didn't sync (EventID 9900).
- Improved in this release: 
- Fast DR namespace sync performance is increased dramatically.
- Deleting large numbers (over 10,000) of directories does not need to be done in batches with v2*.
 
### Cloud tiering
- Changed from the previous version: new files are tiered within 1 hour (previously 32 hours) subject to the tiering policy setting. We provide a PowerShell cmdlet to tier on demand. You can use the cmdlet to evaluate tiering more efficiently without waiting for the background process.
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
- Changed from the previous version: files are now downloaded as tiered files on other servers provided that the file is new or is already a tiered file.

## Agent version 1.1.0.0
The following release notes are for version 1.1.0.0 of the Azure File Sync agent (released September 9, 2017, initial preview). 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync](storage-sync-files-deployment-guide.md).

- The agent installation package (MSI) must be installed with elevated (admin) permissions.
- The agent isn't supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and 2012 R2.
- The agent requires at least 2 GB of physical memory.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md).
- Don't use FSRM or other file screens. File screens can cause endless sync failures when files are blocked because of the file screen.
- The duplication of Registered Servers (including VM cloning) can lead to unexpected results. In particular, sync might never converge.
- Data deduplication and cloud tiering aren't supported on the same volume.
 
### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Paths that are longer than 2,048 characters.
- The DACL portion of a security descriptor if it's larger than 2 KB. (This issue applies only when you have more than about 40 ACEs on a single item.)
- The SACL portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data. 
    
    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoints
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- A server endpoint can't be on the system volume. For example, C:\MyFolder isn't an acceptable path unless C:\MyFolder is a mount point.
- Failover Clustering is supported only with clustered disks and not with CSVs.
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Deleting a large number (over 10,000) of directories from a server at a single time can cause sync failures. Delete directories in batches of less than 10,000. Make sure the delete operations sync successfully before deleting the next batch.
- A server endpoint at the root of a volume is not currently supported.
- Don't store an OS or application paging file that's within a server endpoint.
 
### Cloud tiering
- To ensure that files can be correctly recalled, the system might not automatically tier new or changed files for up to 32 hours. This process includes first-time tiering after a new server endpoint is configured. We provide a PowerShell cmdlet to tier on demand. You can use the cmdlet to evaluate tiering more efficiently without waiting for the background process.
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
