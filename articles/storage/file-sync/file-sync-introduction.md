---
title: Introduction to Azure File Sync
description: Get an overview of Azure File Sync, a service that enables you to create and use network file shares in the cloud by using the industry-standard SMB protocol.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 06/04/2025
ms.author: kendownie
# Customer intent: "As an IT administrator looking to optimize file storage, I want to implement Azure File Sync so that I can centralize my file shares in the cloud while maintaining quick local access and ensuring data resilience across multiple sites."
---

# What is Azure File Sync?

Azure File Sync is a service for centralizing an organization's file shares in Azure Files while keeping the flexibility, performance, and compatibility of a Windows file server.

Although you can opt to keep a full copy of your data locally, Azure File Sync can transform Windows Server into a quick cache of an Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including Server Message Block (SMB), Network File System (NFS), and File Transfer Protocol over SSL/TLS (FTPS). You can have as many caches as you need across the world.

## Videos

| Introducing Azure File Sync | Azure Files with Sync (Ignite 2019)  |
|-|-|
| [![Screencast of the Introducing Azure File Sync video - select to play.](../files/media/storage-files-introduction/azure-file-sync-video-snapshot.png)](https://www.youtube.com/watch?v=Zm2w8-TRn-o) | [![Screencast of the Azure Files with Sync presentation - select to play.](../files/media/storage-files-introduction/ignite-2018-video.png)](https://www.youtube.com/embed/6E2p28XwovU) |

## Benefits of Azure File Sync

### Cloud tiering

When you enable cloud tiering, the files that you access most frequently are cached on your local server. The files that you access least frequently are tiered to the cloud. You can control how much local disk space is used for caching, and you can quickly recall tiered files on demand.

Cloud tiering can help you cut costs, because you need to store only a fraction of your data on-premises. For more information, see [Cloud tiering overview](file-sync-cloud-tiering-overview.md).

### Multiple-site access and sync

Azure File Sync is ideal for distributed access scenarios. For each of your offices, you can provision a local Windows Server instance as part of your Azure File Sync deployment. Changes made to a server in one office automatically sync to the servers in all other offices.

### Business continuity and disaster recovery

Azure File Sync is backed by Azure Files, which offers several redundancy options for highly available storage. Because Azure contains resilient copies of your data, your local server becomes a disposable caching device.

You can recover from a failed server by adding a new server to your Azure File Sync deployment. Rather than restoring from a local backup, you provision another Windows Server instance, install the Azure File Sync agent on it, and then add it to your Azure File Sync deployment.

Azure File Sync downloads your file namespace before downloading data, so that your server can be up and running as soon as possible. For even faster recovery, you can have a warm standby server as part of your deployment, or you can use Azure File Sync with Windows clustering.

### Cloud-side backup

Reduce your on-premises backup spending by taking centralized backups in the cloud via Azure Backup. SMB Azure file shares have native snapshot capabilities. You can automate the process by using Azure Backup to schedule your backups and manage their retention.

Azure Backup also integrates with your on-premises servers. When you restore to the cloud, the changes are automatically downloaded on your Windows Server instance.

### Migration

Azure File Sync enables seamless migration of your on-premises file data to Azure Files. By syncing your existing file servers with Azure Files in the background, you can move data without disrupting users or changing access patterns. Your file structure and permissions remain intact, and applications continue to operate as expected.

This ability can help you modernize infrastructure, consolidate storage, or retire aging hardware while ensuring continuous availability.

## Training

For self-paced training, see the following modules:

- [Implement a hybrid file server infrastructure](/training/modules/implement-hybrid-file-server-infrastructure/)
- [Extend your on-premises file share capacity using Azure File Sync](/training/modules/extend-share-capacity-with-azure-file-sync/)

## Architecture

For guidance on architecting solutions with Azure Files and Azure File Sync by using established patterns and practices, see the following articles:

- [Azure enterprise cloud file share](/azure/architecture/hybrid/azure-files-private)
- [Hybrid file services](/azure/architecture/hybrid/hybrid-file-services)

## Related content

- [Plan for an Azure File Sync deployment](file-sync-planning.md)
- [Cloud tiering overview](file-sync-cloud-tiering-overview.md)
- [Monitor Azure File Sync](file-sync-monitoring.md)
