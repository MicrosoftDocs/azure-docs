---
title: What is Azure File Sync?
description: An overview of Azure File Sync, a service that centralizes file shares in Azure Files while maintaining fast local access on Windows servers through cloud tiering and multi-site sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 08/17/2026
ms.author: kendownie
# Customer intent: "As an IT administrator looking to optimize file storage, I want to implement Azure File Sync so that I can centralize my file shares in the cloud while maintaining quick local access and ensuring data resilience across multiple sites."
---

# What is Azure File Sync?

Azure File Sync centralizes your organization's file shares in Azure Files while keeping the flexibility, performance, and compatibility of on-premises Windows file servers. Each registered Windows Server syncs its data to and from a central Azure file share, and can optionally use cloud tiering to cache only the most frequently accessed files locally.

You can have as many server caches as you need across the world — changes on any server sync through the Azure file share to all other servers automatically.

> [!VIDEO https://www.youtube.com/embed/Zm2w8-TRn-o]

## Key benefits

- **Cloud tiering** — Cache only frequently accessed files locally; tier infrequently used files to Azure. The full namespace remains visible and browsable, and tiered files are recalled seamlessly on access. Reduces on-premises storage costs significantly. [Learn more](file-sync-cloud-tiering-overview.md).
- **Multi-site sync** — Keep files consistent across multiple offices without direct server-to-server connectivity. Changes sync through the Azure file share, so every site sees the same data.
- **Disaster recovery** — Recover from a server failure by provisioning a new Windows Server, installing the Azure File Sync agent, and letting the namespace download from Azure. No local backup needed.
- **Cloud-side backup** — Take centralized backups via [Azure Backup](../../backup/azure-file-share-backup-overview.md) with native snapshot capabilities. Reduce on-premises backup infrastructure.
- **Seamless migration** — Move data from on-premises servers to Azure in the background without disrupting users. File structure, permissions, and access patterns remain intact.

## How it works

1. Deploy a [Storage Sync Service](file-sync-deployment-guide.md#deploy-a-storage-sync-service) in Azure.
2. Install the [Azure File Sync agent](file-sync-deployment-guide.md#install-the-azure-file-sync-agent) on one or more Windows servers.
3. Register each server with the Storage Sync Service.
4. Create a sync group linking an Azure file share (cloud endpoint) with a folder on your server (server endpoint).
5. Files sync automatically. Enable cloud tiering to free local disk space.

## Get started

- [Plan for an Azure File Sync deployment](file-sync-planning.md)
- [Deploy Azure File Sync](file-sync-deployment-guide.md)
- [Cloud tiering overview](file-sync-cloud-tiering-overview.md)

## Training and architecture

- [Implement a hybrid file server infrastructure](/training/modules/implement-hybrid-file-server-infrastructure/) (self-paced training)
- [Azure enterprise cloud file share](/azure/architecture/hybrid/azure-files-private) (architecture guidance)
- [Hybrid file services](/azure/architecture/hybrid/hybrid-file-services) (architecture guidance)
