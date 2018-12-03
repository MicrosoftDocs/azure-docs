---
title: Migrate data from StorSimple 5000-7000 series to Azure File Sync| Microsoft Docs
description: Describes how to migrate data from StorSimple 5000/7000 series to Azure File Sync (AFS).
services: storsimple
documentationcenter: NA
author: alkohli
manager: twooley

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/23/2018 
ms.author: alkohli

---
# Migrate data from StorSimple 5000-7000 series to Azure File Sync

> [!IMPORTANT]
> On July 31, 2019 the StorSimple 5000/7000 series will reach end of support (EOS) status. We recommend that StorSimple 5000/7000 series customers migrate to one of the alternatives described in the document.

Data migration is the process of moving data from one storage location to another. This entails making an exact copy of an organization’s current data from one device to another device—preferably without disrupting or disabling active applications — and then redirecting all input/output (I/O) activity to the new device. 

StorSimple 5000 and 7000 series storage devices will reach the end of service in July 2019. This implies that Microsoft will no longer be able to support the hardware and software for StorSimple 5000/7000 series after July 2019. Customers who are using these devices should migrate their StorSimple data to other hybrid storage solutions on Azure. This article covers the migration of data from a StorSimple 5000/7000 series device to Azure File Sync (AFS).

## Intended audience

This article is intended for information technology (IT) professionals and knowledge workers responsible for deploying and managing StorSimple 5000/7000 series devices in the datacentre. The customers using their StorSimple devices for file server workloads (with Windows Server) may find this migration path particularly appealing. If you believe that the features of Azure File Sync work well for your organization, then this article will help you understand how to move to those solutions from StorSimple.

## Migration considerations

This process works for customers who have configured a Windows file share using a StorSimple volume for storage. Migrating data from StorSimple 5000/7000 to Azure File Sync involves converting that file share location to a [Server Endpoint](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning) and then using locally attached drives as another endpoint which will then become your new location. 

While moving to AFS, the following points should be considered:

1. Azure Files currently has a restriction of 5 TB/share. This restriction can be overcome by using Azure File Sync with data spread across multiple Azure File shares. For more information, review the [Data growth pattern for Azure Files deployment](https://docs.microsoft.com/azure/storage/files/storage-files-planning).
2. This migration downloads the entire primary data set to an on-premises device as the data copy is done from the on-premises device. Ensure that you have sufficient bandwidth to accommodate this transfer.
3. This process does not preserve the snapshots that have already been created. It only migrates the primary data. The process also does not preserve the associated bandwidth templates or backup policies. [Use Azure Backup](https://docs.microsoft.com/azure/backup/backup-azure-files) to set up the backup policies after the data is migrated on the Azure File share.
4. StorSimple provides first party hardware. However, with Azure Files/Azure File Sync, you are using your own local Windows Server hardware as the local cache. You must ensure that you have sufficient storage capacity to keep the data set of your choice local. For more information on tiering and setting requisite free space target, review how to [Create a server endpoint when deploying Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide?tabs=portal). 
5. Review the [pricing for Azure File Sync](https://azure.microsoft.com/pricing/details/storage/files/) as it varies from StorSimple. AFS does not have deduplication and compression like StorSimple.

## Migration prerequisites

Here you will find the migration prerequisites for your legacy 5000 or 7000 series device to Azure File Sync.
Before you begin, ensure you have:

- Access to a StorSimple 5000/7000 series device running software version v2.1.1.518 or later. Earlier versions are not supported. The top-right corner of web UI of your StorSimple device should display the software version that is running.  
    If your device is not running v2.1.1.518, please upgrade your system to the required minimal version. For detailed instructions, refer to [Upgrade your system to v2.1.1.518](http://onlinehelp.storsimple.com/111_Appliance/6_System_Upgrade_Guides/Current_(v2.1.1)/000_Software_Patch_Upgrade_Guide_v2.1.1.518).
- Check for any active backup jobs that are running on the source device. This includes the jobs on the StorSimple Data Protection Console host. Wait for the current jobs to complete. 
- Access to a Windows Server host connected to your StorSimple 5000-7000 series device. The host must be running a supported Windows Server version as described in [Azure File Sync interoperability](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning).
- StorSimple volumes are mounted on the host and contain file shares.
- The host has sufficient local storage to hold your locally cached data.
- Owner level access to the Azure subscription that you will use to deploy Azure File Sync. You may experience issues when creating a cloud endpoint for your sync group if you do not have owner or admin level permissions.
- Access to a [general-purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-overview) with an Azure File Share that you want to sync to. For more information, see [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account).
 - How to [Create an Azure File Share](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share#create-file-share-through-the-azure-portal).

## Migration process

Migrating data from StorSimple 5000-7000 to AFS is a two-step process:
1.	Replicate the data from the on-premises file server where the StorSimple volumes are mounted to an Azure Files share.  Replication is done via an AFS agent that you install.
2.	Disconnect the StorSimple device. The local disks then act as the local cache.

### Migration steps

Perform the following steps to migrate the Windows file share configured on StorSimple volumes to an Azure File Sync share. 
1.	Perform these steps on the same Windows Server host where the StorSimple volumes are mounted or use a different system. 
    - [Prepare Windows Server to use with Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide#prepare-windows-server-to-use-with-azure-file-sync).
    - [Install the Azure File Sync agent](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide#install-the-azure-file-sync-agent).
    - [Deploy the Storage Sync service](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide#deploy-the-storage-sync-service). 
    - [Register Windows Server with Storage Sync service](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide#register-windows-server-with-storage-sync-service). 
    - [Create a sync group and a cloud endpoint](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide#create-a-sync-group-and-a-cloud-endpoint). Sync groups need to be made for each Windows file share that needs to be migrated from the host.
    - [Create a server endpoint](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide?tabs=portal#create-a-server-endpoint). Specify the path as the path of the StorSimple volume that contains your file share data. For example, if the StorSimple volume is drive `J`, and your data resides in `J:/<myafsshare>`, then add this path as a server endpoint. Leave the **Tiering** as **Disabled**.
2.	Wait until the file server sync is complete. For each server in a given sync group, make sure:
    - The timestamps for the Last Attempted Sync for both upload and download are recent.
    - The status is green for both upload and download.
    - The **Sync Activity** shows very few or no files remaining to sync.
    - The **Files Not Syncing** is 0 for both upload and download.
    For more information on when the server sync is complete, go to [Troubleshoot Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cportal#how-do-i-know-if-my-servers-are-in-sync-with-each-other). The sync may take several hours to days, depending on your data size and bandwidth. Once the sync is complete, all your data is safely in the Azure File Share. 
3.	Go to the shares on the StorSimple volumes. Select a share, right-click and select **Properties**. Note the share permissions under **Security**. These permissions will need to be manually applied to the new share in the later step.
4.	Depending on whether you use the same Windows Server host or a different one, the next steps will be different.

    Skip this step and go to the next step if you are using a different Windows Server host. If you are using the same Windows File Server for AFS, you will now experience a few minutes of downtime. 
    - **Downtime starts** - Delete the server endpoint that you created in *step 1F*. 
    - Create a new server endpoint with the path where you want the data to reside going forward.
    - Once the server endpoint shows as Healthy (this may take a few minutes), you will see the data in this new location. You can now configure your Windows Server host to serve files from this new location. - **Downtime ends**.
5.	If you are using another Windows File Server for Azure File Sync, then you will not experience any downtime. 
    - Add another server endpoint with the path of the local storage which you are prepared to use as a cache in lieu of the StorSimple device. 
    - You will be able to see the files in the new server in few minutes. You are free to make the switch from your StorSimple device to this new location on the host at any time.

    > [!TIP] 
    > Consider configuring this new file share with the same name and same path as the one it is replacing, to minimize disruption. If using DFS-N, this may require you to make changes in the configuration.
6.	Reconfigure the sharing permissions as noted in *step 3*.

If you experience any issues during the data migration, please [Contact Microsoft Support](storsimple-8000-contact-microsoft-support.md). 



## Next steps

If AFS is not the right solution for you, learn how to [Migrate data from a StorSimple 5000-7000 series to an 8000 series device](storsimple-8000-migrate-from-5000-7000.md).

