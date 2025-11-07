---
title: Data migration and protection FAQs for Azure NetApp Files 
description: Answers frequently asked questions (FAQs) about Azure NetApp Files data migration and protection.
ms.service: azure-netapp-files
ms.topic: concept-article
author: b-hchen
ms.author: anfdocs
ms.date: 11/06/2025
# Customer intent: "As a data engineer, I want to migrate data to Azure NetApp Files using file-based copy tools, so that I can efficiently manage and protect my organization's critical data in the cloud."
---
# Data migration and protection FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files data migration and protection.

## General migration FAQs

Learn about options for migrating data to Azure NetApp Files and how data is stored. 

### How do I migrate data to Azure NetApp Files?

Azure NetApp Files provides NFS and SMB volumes. You can use any file-based copy tool to migrate data to the service. To migrate volumes from on-premises ONTAP storage systems, you can also use Azure NetApp Files [migration assistant tool](migrate-volumes.md) for efficient migration with more flexible cutover time. 

When migrating data from ONTAP based storage volumes, ensure Azure NetApp Files is available in the target Azure region. You must validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on-premises storage and the Azure NetApp Files service is supported over [ExpressRoute](../expressroute/expressroute-prerequisites.md). The virtual machine that  the data transfer tool runs on should have access to both the source and destination volumes. 

Create the target Azure NetApp Files volume in the region and availability zone of your choice. For more information, follow the steps in [migrate volumes to Azure NetApp Files](migrate-volumes.md).

For more information about the Azure Files Migration Program, see [Migrate the critical file data you need to power your applications](https://techcommunity.microsoft.com/t5/azure-storage-blog/migrate-the-critical-file-data-you-need-to-power-your/ba-p/3038751). Also, see [Azure Storage migration tools comparison - Unstructured data](../storage/solution-integration/validated-partners/data-management/migration-tools-comparison.md). 

NetApp offers a SaaS-based solution, [NetApp Cloud Sync](https://docs.netapp.com/us-en/occm38/concept_cloud_sync.html). The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use [robocopy](/windows-server/administration/windows-commands/robocopy) in the same manner. These tools can also replicate file or folder permissions. 

Migration of certain structured datasets (such as databases) is best done using database-native tools (for example, SQL Server AOAG, Oracle Data Guard, and so on).

The requirements for data migration from on premises to Azure NetApp Files are as follows: 

- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on premises and the Azure NetApp Files service is supported over ExpressRoute. The virtual machine running that the data transfer tool runs on should have access to both the source and destination volumes. 
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

>[!NOTE]
>[AzCopy](../storage/common/storage-use-azcopy-v10.md) can only be used in migration scenarios where the source *or* target is a storage account, which Azure NetApp Files is not. Azure NetApp Files can be the source OR target in an AzCopy operation, but not both.

>[!NOTE]
>When copying files to Azure NetApp Files, the C Time Stamp updates.  

### Where does Azure NetApp Files store customer data?   

By default, your data stays within the region where you deploy your Azure NetApp Files volumes. However, you can choose to replicate your data on a volume-by-volume basis to available destination regions using [cross-region replication](replication.md).

### How do I create a copy of an Azure NetApp Files volume in another Azure region?
	
Azure NetApp Files provides NFS and SMB volumes. Any file based-copy tool can be used to replicate data between Azure regions. 

The [cross-region replication](replication.md) functionality enables you to asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region. Additionally, you can [create a new volume by using a snapshot of an existing volume](snapshots-restore-new-volume.md).

NetApp offers a SaaS based solution, [NetApp Cloud Sync](https://docs.netapp.com/us-en/occm38/concept_cloud_sync.html). The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](/windows-server/administration/windows-commands/robocopy) in the same manner. These tools can also replicate file or folder permissions. 

The requirements for replicating an Azure NetApp Files volume to another Azure region are as follows: 
- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on premises and Azure NetApp Files volumes, or across Azure regions, is supported via [site-to-site VPN and ExpressRoute](azure-netapp-files-network-topologies.md#hybrid-environments), [Global VNet peering](azure-netapp-files-network-topologies.md#global-or-cross-region-vnet-peering), or [Azure Virtual WAN connections](configure-virtual-wan.md).
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

## Migration assistant

The Azure NetApp Files [migration assistant](migrate-volumes.md)

### Does the Azure NetApp Files migration assistant support bandwidth throttling during data transfers?

Bandwidth throttling can be configured on the remote ONTAP system. For more information, follow the steps in [the ONTAP SnapMirror documentation](https://docs.netapp.com/us-en/ontap/data-protection/snapmirror-global-throttling-concept.html).

### Is migration with Azure Data Box supported?

No. Azure Data Box doesn't support Azure NetApp Files currently. 

### Is migration with Azure Import/Export service supported?

No. Azure Import/Export service does not support Azure NetApp Files currently.

### Is there a specific timeframe for users to provide commands for migration?

Yes, you must enter the commands within a specific timeframe when using the migration assistant. For example, the passphrase is valid only for 60 minutes from the time it's generated; the storage VM peering command is valid only for 10 minutes.

### What happens if I close the migration assistant tool page before the migrating volume workflow is complete?

If you close the migration assistant tool page before the workflow is complete, you won't receive the cluster peering or storage VM peering commands. You will need to restart the workflow to complete it. 

### Are the inputs provided case-sensitive in the migration assistant tool?

Yes, the inputs provided in the migration assistant tool are case-sensitive.

### Can I configure peering with less than six free IP addresses in the subnet?

No. If you want to use the existing subnet, you should clean up the IP addresses on the subnet or use a different subnet.

### Can I enable cool access on a migration volume in the migration assistant tool?

You should only enable cool access if you've finalized migration. Otherwise, use a different volume. Finalizing the migration converts the volume to a regular Azure NetApp Files volume, allowing you to enable cool access.

### Why am I not able to resume migrations after it has been paused from the migration assistant tool?

Select the action icon from the **Migration** tab of the volume, not from the migration assistant view. 

### Are there post-migration steps to be performed on ONTAP systems?

For external ONTAP, you should manually delete the existing peering relationship before creating a new one.

## Next steps  

- [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
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
