---
title: Release notes for the Azure File Sync agent | Microsoft Docs
description: Release notes for the Azure File Sync agent.
services: storage
author: wmgries
ms.service: storage
ms.topic: article
ms.date: 10/10/2018
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
| September update rollup | 3.3.0.0 | September 24, 2018 | Supported (recommended version) |
| August update rollup | 3.2.0.0 | August 15, 2018 | Supported |
| General availability | 3.1.0.0 | July 19, 2018 | Supported |
| June update rollup | 3.0.13.0 | June 29, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| Refresh 2 | 3.0.12.0 | May 22, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| April update rollup | 2.3.0.0 | May 8, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| March update rollup | 2.2.0.0 | March 12, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| February update rollup | 2.1.0.0 | February 28, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| Refresh 1 | 2.0.11.0 | February 8, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| January update rollup | 1.4.0.0 | January 8, 2018 | Not Supported - Agent version expired on October 1, 2018 |
| November update rollup | 1.3.0.0 | November 30, 2017 | Not Supported - Agent version expired on October 1, 2018 |
| October update rollup | 1.2.0.0 | October 31, 2017 | Not Supported - Agent version expired on October 1, 2018 |
| Initial preview release | 1.1.0.0 | September 26, 2017 | Not Supported - Agent version expired on October 1, 2018 |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Agent version 3.3.0.0
The following release notes are for version 3.3.0.0 of the Azure File Sync agent released September 24, 2018. These notes are in addition to the release notes listed for version 3.1.0.0.

This release includes the following fix:
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
- The storage sync service and/or storage account can be moved to a different resource group or subscription within the existing Azure AD tenant. If the storage account is moved, you need to give the Hybrid File Sync Service access to the storage account (see [Ensure Azure File Sync has access to the storage account](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#troubleshoot-rbac)).

    > [!Note]  
    > Azure File Sync does not support moving the subscription to a different Azure AD tenant.

### Cloud tiering
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When you're viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
