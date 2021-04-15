---
title: Introduction to Azure File Sync | Microsoft Docs
description: An overview of Azure File Sync, a service that enables you to create and use network file shares in the cloud using the industry standard SMB protocol.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 04/13/2021
ms.author: rogarana
ms.subservice: files
---

# What is Azure File Sync?
Azure File Sync extends your on-premises Windows Server or cloud virtual machine by enabling you to sync file shares to Azure. These files are stored in Azure file shares in the cloud. Azure file shares can be used in two ways: they can be directly mounted via SMB or NFS, or cached on-premises using Azure File Sync. Caching Azure file shares on-premises enables bottomless storage while maintaining a seamless end-user experience.

## Benefits of Azure File Sync

### Cloud tiering
Cloud tiering can help reduce the footprint of your local storage while maintaining on-premises performance. With cloud tiering enabled, your most frequently accessed files are cached on your local server and your least frequently accessed files are tiered to the cloud. Tiered files can quickly be recalled on-demand, making the experience seamless while enabling you to cut down on costs as you only need to store a fraction of your data on-premises. For more information about cloud tiering, see [Cloud tiering overview](file-sync-cloud-tiering-overview.md). 

### Multi-site access and sync
Azure File Sync is ideal for complicated distributed access scenarios. For each of your offices, wherever they are, you can provision a local Windows Server as part of your Azure File Sync deployment. Changes made to a server in one office automatically sync to the servers in all other offices.

Additionally, with [identity-based authentication](../files/storage-files-active-directory-overview.md?toc=%2fazure%2fstorage%2ffilesync%2ftoc.json), Azure Files SMB shares can continue to work with AD hosted on-premises for access control. 

### Business continuity and disaster recovery
Azure File Sync enables business continuity and disaster recovery. Because Azure contains resilient copies of your data, you can recover from a data center disaster. To replace a local Windows Server that is part of an Azure File Sync deployment, provision another Windows Server, install the Azure File Sync agent on it, and then add it to your Azure File Sync deployment. Azure File Sync will download your file namespace prior to the data so that your server can be up and running.  

## Cloud-side backup
Reduce your on-premises backup spending by taking centralized backups in the cloud using Azure Backup. Azure Backup automates the backup process by scheduling your backups and manages their retention. Azure Backup also integrates with your on-premises servers, so when you restore to the cloud, these changes are automatically downloaded on your Windows Servers.  

## Next Steps
* [Planning for an Azure File Sync deployment](file-sync-planning.md)
* [Cloud tiering overview](file-sync-cloud-tiering-overview.md)
* [Monitor Azure File Sync](file-sync-monitoring.md)