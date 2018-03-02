---
title: Release notes for the Azure File Sync Agent (preview) | Microsoft Docs
description: Release notes for the Azure File Sync Agent (preview)
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: tamram

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/08/2017
ms.author: wgries
---

# Release notes for the Azure File Sync Agent (preview)
The Azure File Sync Agent lets you centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. Your Windows Server installations are transformed into a quick cache of your Azure Files share. You can use any protocol that's available on Windows Server to access your data locally (including SMB, NFS, and FTPS). You can have as many caches as you need around the world.

This article provides the release notes for the supported versions of the Azure File Sync Agent.

## Supported versions
The following versions are supported for the Azure File Sync Agent:

| Version | Release date | Support end date |
|----------------------|--------------|------------------|
| 2.1.0.0 | 2018-02-28 | Current version |
| 2.0.11.0 | 2018-02-08 | Current version |
| 1.1.0.0 | 2017-09-26 | 2018-07-30 |

### Azure File Sync Agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Agent version 2.1.0.0
The following release notes are for agent version 2.1.0 released on February 28th, 2018. These are additive to the release notes below for version 2.0.11.0

Unique changes to this monthly update include:
- Improvement in cluster failover handling.
- Improvement in handling tiered files to be more reliable.
- Allow agent installation on domain controller machines added to a 2008R2 domain environment.
- Fix excessive diagnostics generation on servers with many files.
- Improvement in error handling for session failures.
- Improvement in error handling for file transfer issues.
- Change default interval to run cloud tiering when enabled on server endpoint to one hour. 
- Temporary blocking moving Azure File Sync (Storage Sync Service) resources to a new Azure subscription

## Agent version 2.0.11.0
The following release notes are for version 2.0.11.0 of the Azure File Sync Agent (released February 9, 2018). 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync Agent with Windows Server, see [Planning for an Azure File Sync (preview) deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md).

- The agent installation package (MSI) must be installed with elevated (admin) permissions.
- The agent isn't supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and 2012 R2.
- The agent requires at least 2 GB of physical memory.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync (preview)](storage-sync-files-troubleshoot.md).
- This release adds support for DFS-R. For more information, see the [Planning guide](storage-sync-files-planning.md#distributed-file-system-dfs).
- Don't use File Server Resource Manager (FSRM) or other file screens. File screens can cause endless sync failures when files are blocked because of the file screen.
- The duplication of Registered Servers (including VM cloning) can lead to unexpected results (in particular, sync might never converge).
- Data deduplication and cloud tiering aren't supported on the same volume.
 
### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Paths that are longer than 2,048 characters.
- The discretionary access control list (DACL) portion of a security descriptor if it's larger than 2 K. (This issue applies only when you have more than about 40 access control entries (ACEs) on a single item.)
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data. 
    
    > [!Note]  
    > Azure File Sync always encrypts data in transit, and data can be encrypted at rest in Azure.
 
### Server endpoints
- A server endpoint can be created only on an NTFS volume. Resilient File System (ReFS), FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- A server endpoint can't be on the system volume (for example, C:\MyFolder isn't an acceptable path unless C:\MyFolder is a mount point).
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Deleting a large number (over 10,000) of directories from a server at a single time can cause sync failures. Delete directories in batches of less than 10,000. Make sure the delete operations sync successfully before deleting the next batch.
- This release adds support for the sync root at the root of a volume.
- Don't store an OS or application paging file that's within a server endpoint.
- Changed in this release: added new events to track the total runtime for cloud tiering (EventID 9016), sync upload progress (EventID 9302), and files that didn't sync (EventID 9900).
- Changed in this release: fast DR namespace sync performance is increased dramatically.
 
### Cloud tiering
- Changed from the previous version: new files are tiered within 1 hour (previously 32 hours) subject to the tiering policy setting. We provide a PowerShell cmdlet to tier on-demand. The cmdlet lets you evaluate tiering more efficiently without waiting for the background process.
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
- Changed from the previous version: files are now downloaded as tiered files on other servers provided that the file is new or is already a tiered file.

## Agent version 1.1.0.0
The following release notes are for version 1.1.0.0 of the Azure File Sync Agent (released September 9, 2017, initial preview). 

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync Agent with Windows Server, see [Planning for an Azure File Sync (preview) deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md).

- The agent installation package (MSI) must be installed with elevated (admin) permissions.
- The agent isn't supported on Windows Server Core or Nano Server deployment options.
- The agent is supported only on Windows Server 2016 and 2012 R2.
- The agent requires at least 2 GB of physical memory.

### Interoperability
- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync (preview)](storage-sync-files-troubleshoot.md).
- Don't use FSRM or other file screens. File screens can cause endless sync failures when files are blocked because of the file screen.
- The duplication of Registered Servers (including VM cloning) can lead to unexpected results (in particular, sync might never converge).
- Data deduplication and cloud tiering aren't supported on the same volume.
 
### Sync limitations
The following items don't sync, but the rest of the system continues to operate normally:
- Paths that are longer than 2,048 characters.
- The DACL portion of a security descriptor if it's larger than 2 K. (This issue applies only when you have more than about 40 ACEs on a single item.)
- The SACL portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data. 
    
    > [!Note]  
    > Azure File Sync always encrypts data in transit, and data can be encrypted at rest in Azure.
 
### Server endpoints
- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- A server endpoint can't be on the system volume (for example, C:\MyFolder isn't an acceptable path unless C:\MyFolder is a mount point).
- Failover Clustering is supported only with clustered disks and not with CSVs.
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Deleting a large number (over 10,000) of directories from a server at a single time can cause sync failures. Delete directories in batches of less than 10,000. Make sure the delete operations sync successfully before deleting the next batch.
- A server endpoint at the root of a volume is not currently supported.
- Don't store an OS or application paging file that's within a server endpoint.
 
### Cloud tiering
- To ensure that files can be correctly recalled, the system might not automatically tier new or changed files for up to 32 hours. This process includes first-time tiering after a new server endpoint is configured. We provide a PowerShell cmdlet to tier on-demand. The cmdlet lets you evaluate tiering more efficiently without waiting for the background process.
- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When viewing file properties from an SMB client, the offline attribute might appear to be set incorrectly due to SMB caching of file metadata.
