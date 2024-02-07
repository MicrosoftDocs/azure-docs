---
title: Data migration and protection FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about Azure NetApp Files data migration and protection.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 08/31/2023
---
# Data migration and protection FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files data migration and protection.

## How do I migrate data to Azure NetApp Files?
Azure NetApp Files provides NFS and SMB volumes. You can use any file-based copy tool to migrate data to the service. 

For more information about the Azure File Migration Program, see [Migrate the critical file data you need to power your applications](https://techcommunity.microsoft.com/t5/azure-storage-blog/migrate-the-critical-file-data-you-need-to-power-your/ba-p/3038751).  Also, see [Azure Storage migration tools comparison - Unstructured data](../storage/solution-integration/validated-partners/data-management/migration-tools-comparison.md). 

NetApp offers a SaaS-based solution, [NetApp Cloud Sync](https://cloud.netapp.com/cloud-sync-service). The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](/windows-server/administration/windows-commands/robocopy) in the same manner. These tools can also replicate file or folder permissions. 

Migration of certain structured datasets (such as databases) is best done using database-native tools (for example, SQL Server AOAG, Oracle Data Guard, and so on).

The requirements for data migration from on premises to Azure NetApp Files are as follows: 

- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on premises and the Azure NetApp Files service is supported over ExpressRoute.
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

>[!NOTE]
>[AzCopy](../storage/common/storage-use-azcopy-v10.md) can only be used in migration scenarios where the source *or* target is a storage account, which Azure NetApp Files is not. Azure NetApp Files can be the source OR target in an AzCopy operation, but not both.

## Where does Azure NetApp Files store customer data?   

By default, your data stays within the region where you deploy your Azure NetApp Files volumes. However, you can choose to replicate your data on a volume-by-volume basis to available destination regions using [cross-region replication](cross-region-replication-introduction.md).

## How do I create a copy of an Azure NetApp Files volume in another Azure region?
	
Azure NetApp Files provides NFS and SMB volumes.  Any file based-copy tool can be used to replicate data between Azure regions. 

The [cross-region replication](cross-region-replication-introduction.md) functionality enables you to asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region.  Additionally, you can [create a new volume by using a snapshot of an existing volume](snapshots-restore-new-volume.md).

NetApp offers a SaaS based solution, [NetApp Cloud Sync](https://cloud.netapp.com/cloud-sync-service).  The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](/windows-server/administration/windows-commands/robocopy) in the same manner.  These tools can also replicate file or folder permissions. 

The requirements for replicating an Azure NetApp Files volume to another Azure region are as follows: 
- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on premises and Azure NetApp Files volumes, or across Azure regions, is supported via [site-to-site VPN and ExpressRoute](azure-netapp-files-network-topologies.md#hybrid-environments), [Global VNet peering](azure-netapp-files-network-topologies.md#global-or-cross-region-vnet-peering), or [Azure Virtual WAN connections](configure-virtual-wan.md).
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

## Is migration with Azure Data Box supported?

No. Azure Data Box does not support Azure NetApp Files currently. 

## Is migration with Azure Import/Export service supported?

No. Azure Import/Export service does not support Azure NetApp Files currently.

## Next steps  

- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Azure Data Box](../databox/index.yml)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
