---
title: Enhance or replace Windows file servers with Azure Files and Azure File Sync
description: Azure Files and Azure File Sync can be useful in enhancing or replacing your Windows file servers. Learn how you can use these technologies to increase flexibility, improve availability and data protection, and reduce TCO.
author: khdownie
ms.service: storage
ms.topic: concepts
ms.date: 03/15/2023
ms.author: kendownie
ms.subservice: files 
---

# Enhance or replace Windows file servers with Azure Files and Azure File Sync

This article explains how you can use Azure Files and Azure File Sync to enhance or replace your on-premises Windows file servers to increase flexibility, improve availability and data protection, and reduce total cost of ownership (TCO) for file shares. Azure Files has its origins in the Windows file server role, making it an excellent choice when migrating Windows file servers to the cloud.

Most customers take one of two approaches:

- Migrate on-premises file servers to a fully managed SMB Azure file share (or multiple file shares).
- Use [Azure File Sync](../file-sync/file-sync-introduction.md) to synchronize existing Windows file servers with SMB Azure file shares. Optionally use cloud tiering to scale file data in the cloud while turning on-premises servers into caches for hot data.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/yes-icon.png) |


## Reduce TCO with fully managed file shares

There's more to file share TCO than the price per GiB of storage. By centralizing your files in Azure, you can reduce TCO in many ways:  

- Achieve better storage utilization by not having to over-provision file share capacity. With Azure Files, you can quickly resize your share without downtime.  

- Eliminate the work associated with hardware procurement, setup, and maintenance. With Azure Files, storage resiliency, redundancy, and maintenance are included, and there are no patches or upgrades to manage.  

- Customers relying on full share replication technologies like DFS-R can reduce costs by centralizing one full copy in an Azure file share and using Azure File Sync for local caching.  

- Differential snapshots and integration with Azure Backup offer economical data protection.  

- Choose between multiple storage tiers, from premium low latency SSD storage to cost-effective cool storage, allowing you to pick the tier that best fits your workload.  

- Azure Files Reservation discounts enable up to 36% savings for pre-committed storage.

To learn more about how Azure file shares are billed and how you can reduce TCO, see [Understand Azure Files billing](understanding-billing.md).

## Broad compatibility with Windows file servers

Most of the core file system and SMB capabilities in the Windows file server role also exist in Azure Files, such as:

- Access control lists (Windows ACLs)
- Active Directory integration
- SMB encryption
- Transparent failover
- File locks
- SMB multichannel

Only a [limited set of features](files-smb-protocol.md#limitations) supported by SMB and NTFS aren't currently supported by Azure Files.

## Hybrid access and flexible deployment
Azure Files is built for hybrid access and offers flexible deployment options, including zero downtime migration from Windows file servers. You can connect to an Azure file share from a variety of clients, or from within Azure VMs or containers. You can connect from anywhere via encrypted SMB 3.x traffic, either over the internet or through VPN. And if you want to maintain local performance, you can use Azure File Sync to cache hot files (or keep a full copy of your share) anywhere you want.

Moving data from Windows file servers to Azure Files is easy, and can happen in the background without interrupting user access. When you migrate to Azure Files, none of your file path links need to break. You can use Windows Server DFS-N functionality and redirect users to Azure Files. If you're adding Azure File Sync to an existing Windows file server, users can continue to access their files through the Windows file server using the same file paths.

Azure File Sync can synchronize and cache your Azure file share anywhere you can install a Windows file server. This means you can use Azure File Sync to create regional caches of your file servers in different Azure regions. You can cache files on-premises, in your data centers, or in third-party clouds. Simply install Azure File Sync on your existing server to connect to an Azure file share and start the synchronization. Learn more in the tutorial [Extend Windows file servers with Azure File Sync](../file-sync/file-sync-extend-servers.md).

## Integrated data protection and redundancy

With Azure Files you benefit from multi-layered security provided by Microsoft across physical data centers, infrastructure, and operations in Azure. We provide several data redundancy options including local, regional, or global. Differential snapshots and snapshot management from Azure Backup simplify data protection, while Azure File Sync offers a variety of [options for disaster recovery](../file-sync/file-sync-disaster-recovery-best-practices.md). You can even protect users from accidentally deleting a file or share via [soft delete](storage-files-enable-soft-delete.md).

Access control works just like your Windows file servers. You can [use identity-based authentication](storage-files-active-directory-overview.md) and integrate SMB Azure file shares with your on-premises Active Directory environment or Azure AD, and control share-level and directory/file-level access as well as administrator privileges.

## See also
- [Migrate to Azure Files](storage-files-migration-overview.md)
- [Azure Files networking considerations](storage-files-networking-overview.md)