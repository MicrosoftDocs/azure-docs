---
title: Azure File Sync agent release notes | Microsoft Docs
description: Azure File Sync release notes
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

# Azure File Sync agent release notes
Azure File Sync (preview) allows you to centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. It does this by transforming your Windows Servers into a quick cache of your Azure File share. You can use any protocol available on Windows Server to access your data locally (including SMB, NFS, and FTPS) and you can have as many caches as you need across the world.

This article covers the release notes for supported versions of the Azure File Sync agent.

## Supported versions
The following versions are supported by Azure File Sync:

| Agent version number | Release date | Supported until |
|----------------------|--------------|------------------|
| 1.1.0.0 | 2017-09-26 | Current version |

### Azure File Sync agent update policy
[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Agent version 1.1.0.0
The following release notes are for agent version 1.1.0.0 which was released on September 9, 2017. This release marks the initial Preview release of Azure File Sync!

### Agent installation and server configuration
For more information on how to install and configure the Azure File Sync agent with a Windows Server, see [Planning for an Azure File Sync (preview) deployment](storage-sync-files-planning.md) and [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md).

- The agent installation package (MSI) must be installed with elevated (admin) permissions.
- Not supported on the Windows Server Core or Nano Server deployment options.
- Supported only on Windows Server 2016 and 2012 R2.
- The agent requires at least 2 GB of physical memory.

### Interoperability
- Anti-virus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync (preview)](storage-sync-files-troubleshoot.md)
- Do not use File Server Resource Manager (or other) file screens: file screens may cause endless sync failures if files are blocked because of the file screen.
- Duplication of a Registered Server (including VM cloning) could lead to unexpected results (in particular, sync may never converge).
- Data Deduplication and cloud tiering are not supported on the same volume.
 
### Sync limitations
The following items do not sync, but the rest of the system will continue to operate normally:
- Paths longer than 2048 characters
- DACL portion of a security descriptor if larger than 2K (this is only an issue if you have more than about 40 Access Control Entries on a single item)
- SACL portion of security descriptor (used for auditing)
- Extended attributes
- Alternate data streams
- Reparse points
- Hard links
- Compression (if set on a server file) will not be preserved when changes sync to that file from other endpoints
- Any file encrypted with EFS (or other user mode encryption) that prevents our service from reading the data 
    
    > [!Note]  
    > Azure File Sync always encrypts data in transit and data can be encrypted at rest in Azure.
 
### Server Endpoints
- A server endpoint may only be created on an NTFS volume. ReFS, FAT, FAT32, and other file systems are not supported by Azure File Sync at this time.
- A server endpoint may not be on the system volume (for example, C:\MyFolder is not an acceptable path unless C:\MyFolder is a mount point).
- Failover Clustering is supported with Clustered Disks only, not with Cluster Shared Volumes (CSVs).
- A server endpoint may not be nested, but can coexist on the same volume in parallel with each other.
- Deleting a large number of directories from a server at once (over 10,000) may cause sync failures - delete directories in batches of less than 10,000 and make sure the delete operations sync successfully before deleting the next batch.
- Not supported at the root of a volume.
- Do not store an OS or application paging file within a server endpoint.
 
### Cloud tiering
- In order to ensure that files can be recalled correctly, the system may not automatically tier new or changed files for up to 32 hours, including first-time tiering after configuring a new Server Endpoint - we provide a PowerShell cmdlet to tier on-demand so you can evaluate tiering more efficiently without waiting for the background process.
- If a tiered file is copied using Robocopy to another location, the resulting file will not be tiered but the offline attribute may be set since Robocopy incorrectly includes that attribute in copy operations.
- When viewing file properties from an SMB client, the offline attribute may appear to be set incorrectly due to SMB caching of file metadata.