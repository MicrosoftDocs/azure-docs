---
title: Introduction to Azure File Sync | Microsoft Docs
description: An overview of Azure File Sync, a service that enables you to create and use network file shares in the cloud using the industry standard SMB protocol.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 02/10/2021
ms.author: rogarana
ms.subservice: files
---

# What is Azure File Sync?
Azure File Sync extends your on-premises Windows Server or cloud VM by enabling you to sync file shares to Azure. These files will be stored in Azure file shares in the cloud. Azure file shares can be used in two ways: they can be directly mounted via SMB or NFS, or cached on-premises using Azure File Sync. Caching Azure file shares on-premises enables bottomless storage while maintaining a seamless end-user experience.

## Benefits of Azure File Sync
Azure file shares can be used to:

### Cloud tiering
Cloud tiering, a feature of Azure File Sync, helps reduce your ever-growing storage footprint while maintaining your fast on-premises performance. With cloud tiering enabled, your most frequently accessed files are cached on your local server and your least frequently accessed files are tiered to the cloud. These tiered files can be recalled quickly on-demand, making the user experience seamless while enabling admins to cut down on costs as you only need to store a fraction of your data on-premises. For more details about cloud tiering, see [Cloud tiering overview link]. 

### Multi-site access and sync
Azure File Sync solves complicated distributed access scenarios. For each of your offices, regardless of where they are located, you can provision a local Windows Server as part of your Azure File Sync deployment. Changes made to the server in one office will automatically sync to the servers in all other offices.

Additionally, with the release of Azure Files AD Authentication, Azure Files SMB shares can continue to work with AD hosted on-premises for access control. 

### Business continuity and disaster recovery
Azure File Sync enables business continuity and disaster recovery. Because Azure contains resilient copies of your data, you can quickly recover from a data center disaster. To replace a local Windows Server that is part of an Azure File Sync deployment, all you need to do is provision another Windows Server, install the Azure File Sync agent on it, and then add it to your Azure File Sync deployment. Azure File Sync will then download your file namespace prior to the data so that your server can be up and running quickly.  

## Cloud-side backup
Reduce your on-premises backup spending by taking centralized backups in the cloud using Azure Backup. Azure Backup automates the backup process by scheduling your backups as well as managing their retention. Azure Backup also integrates with your on-premises servers, so when you restore to the cloud, these changes are automatically downloaded on your Windows Servers.  

## Next Steps
* [Learn about the available file share protocols](storage-files-compare-protocols.md)
* [Create Azure file Share](storage-how-to-create-file-share.md)
* [Connect and mount an SMB share on Windows](storage-how-to-use-files-windows.md)
* [Connect and mount an SMB share on Linux](storage-how-to-use-files-linux.md)
* [Connect and mount an SMB share on macOS](storage-how-to-use-files-mac.md)
* [How to create an NFS share](storage-files-how-to-create-nfs-shares.md)
