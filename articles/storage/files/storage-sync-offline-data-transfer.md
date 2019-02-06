---
title: Use Data Box and other methods for offline ingestion into Azure File Sync.
description: Process and best practices to enable sync compatible bulk migration support.
services: storage
author: fauhse
ms.service: storage
ms.topic: article
ms.date: 01/31/2019
ms.author: fauhse
ms.component: files
---

# Supporting Data Box and other bulk migration methods
The Azure File Sync agent (version 5 and later) supports the bulk migration of files through offline migration tools such as [Azure Data Box](https://azure.microsoft.com/services/storage/databox) and online migration tools (for example, AzCopy).

This article describes the process you should follow to ensure your bulk migration is done in a sync-compatible way. It will describe the best practices that will help you avoid conflict files and preserve your file and folder ACLs once you enable sync.

## Offline data transfer benefits
The main benefits of offline migration when using a Data Box are as follows:

- When migrating files into Azure via an offline bulk transfer process, such as Data Box, you don't have to upload all the files from your server over the network. For large namespaces, this could mean significant savings in network bandwidth and time.
- When you use Azure File Sync, then regardless of the mode of transport used (Data Box, Azure Import, etc.), your live server only uploads the files that have changed since you shipped the data to Azure.
- Azure File Sync ensures that your file and folder ACLs are synced as well - even if the offline bulk migration product does not transport ACLs.
- When using Azure Data Box and Azure File Sync, there is zero downtime. Using Data Box to transfer data in to Azure makes efficient use of network bandwidth while preserving the file fidelity. It also keeps your namespace up-to-date by uploading only the files that have changed since the Data Box was sent.

Most customers will find the benefits of an offline transport method, such as Data Box, most suitable for their needs. However, Azure File Sync supports any bulk migration method (Data Box, third party products or other ways that get files into Azure) when the below steps are followed.

## Plan your offline data transfer
Before you begin, review the following information:

- Complete your bulk migration to one or multiple Azure file shares prior to enabling sync with Azure File Sync.
- If you plan to use Data Box for your bulk migration: Review the [deployment prerequisites for Data Box](../../databox/data-box-deploy-ordered.md#prerequisites).
- Planning your final Azure File Sync topology: [Plan for an Azure File Sync deployment](storage-sync-files-planning.md)
- Select Azure storage account(s) that will hold the file shares you want to sync with. Ensure that your bulk migration happens to temporary staging shares in the same Storage Account(s). Bulk migration can only be enabled utilizing a final- and a staging- share that reside in the same storage account.
- A bulk migration can only be utilized when you create a new sync relationship with a server location. You can't enable a bulk migration with an existing sync relationship.

## Offline data transfer process
This section describes the process of setting up Azure File Sync in a way compatible with bulk migration tools such as Azure Data Box.

![Visualizing process steps that are also explained in detail in a following paragraph](media/storage-sync-files-offline-data-transfer/DataBoxIntegration_1_600.png)

| Step | Detail |
|---|---------------------------------------------------------------------------------------|
| ![Process step 1](media/storage-sync-files-offline-data-transfer/bullet_1.png) | [Order your Data Box](../../databox/data-box-deploy-ordered.md). There are [several offerings within the Data Box family](https://azure.microsoft.com/services/storage/databox/data) to match your needs. Receive your Data Box and follow the Data Box [documentation to copy your data](../../databox/data-box-deploy-copy-data.md#copy-data-to-data-box). Make sure that the data is copied to this UNC path on the Data Box: `\\<DeviceIPAddres>\<StorageAccountName_AzFile>\<ShareName>` where the `ShareName` is the name of the staging share. Send the Data Box back to Azure. |
| ![Process step 2](media/storage-sync-files-offline-data-transfer/bullet_2.png) | Wait until your files show up in the Azure file shares you designated as temporary staging shares. **Do not enable sync to these shares!** |
| ![Process step 3](media/storage-sync-files-offline-data-transfer/bullet_3.png) | Create a new share that is empty for each file share that Data Box created for you. Make sure that this new share is in the same storage account as the Data Box share. [How to create a new Azure file share](storage-how-to-create-file-share.md). |
| ![Process step 4](media/storage-sync-files-offline-data-transfer/bullet_4.png) | [Create a sync group](storage-sync-files-deployment-guide.md#create-a-sync-group-and-a-cloud-endpoint) in a storage sync service and reference the empty share as a cloud endpoint. Repeat this step for every Data Box file share. Review the [Deploy Azure File Sync](storage-sync-files-deployment-guide.md) guide and follow the steps required to set up Azure File Sync. |
| ![Process step 5](media/storage-sync-files-offline-data-transfer/bullet_5.png) | [Add your live server directory as a server endpoint](storage-sync-files-deployment-guide.md#create-a-server-endpoint). Specify in the process that you already moved the files to Azure and reference the staging shares. It is your choice to enable or disable cloud tiering as needed. While creating a server endpoint on your live server, you need to reference the staging share. Enable "Offline Data Transfer" (image below) in the new server endpoint blade and reference the staging share that must reside in the same storage account as the cloud endpoint. The list of available shares is filtered by storage account and shares that are not already syncing. |

![Visualizing the Azure portal user interface for enabling Offline Data Transfer while creating a new server endpoint.](media/storage-sync-files-offline-data-transfer/DataBoxIntegration_2_600.png)

## Syncing the share
Once you have created your server endpoint, sync will commence. For each file that exists on the server, sync will determine if this file also exists in the staging share where Data Box deposited the files and if so, sync will copy the file from the staging share rather than uploading it from the server. If the file doesn't exist in the staging share or a newer version is available on the local server, then sync will upload the file from the local server.

> **Important:**   
> You can only enable the bulk migration mode during the creation of a server endpoint. Once a server endpoint is established, there is currently no way to integrate bulk migrated data from an already syncing server into the namespace.

## ACLs and timestamps on files and folders
Azure File Sync will ensure that file and folder ACLs are synced from the live server even if the bulk migration tool that was used did not transport ACLs initially. This means it is OK for the staging share to not contain any ACLs on files and folders. When you enable the offline data migration feature as you create a new server endpoint, ACLs will be synced at that time for all files on the server. The same is true for create- and modified- timestamps.

## Shape of the namespace
The shape of the namespace is determined by what's on the server when sync is enabled. If files are deleted on the local server after the Data Box "-snapshot" and -migration, then these files won't be brought into the live, syncing namespace. They will still be in the staging share but never copied. That is the desired behavior as sync keeps the namespace according to the live server. The Data Box "snapshot" is just a staging ground for efficient file copy and not the authority for the shape of the live namespace.

## Finishing bulk migration and clean-up
The screenshot below shows the server endpoint properties blade in the Azure portal. In the offline Data Transfer section, you can observe the status of the process. It will either show "In Progress" or "Completed".

After the server completes its initial sync of the entire namespace, it will have finished leveraging the staging file share with the Data Box bulk migrated files. Observe in the server endpoint properties for offline data transfer that the status is changing to "Complete". At this time, you can clean up the staging share to save cost:

1. Hit "Disable offline data transfer" in the server endpoint properties, when the status is "Completed".
2. Consider deleting the staging share to save cost. The staging share is unlikely to contain file and folder ACLs and as such is of limited use. For backup "point in time" purposes, rather create a real [snapshot of the syncing Azure file share](storage-snapshots-files.md). You can [enable Azure Backup to take snapshots]( ../../backup/backup-azure-files.md) on a schedule.

![Visualizing the Azure portal user interface for server endpoint properties where the status and disable controls for Offline Data Transfer are located.](media/storage-sync-files-offline-data-transfer/DataBoxIntegration_3_444.png)

You should only disable this mode when the state is "Completed" or you truly want to abort due to misconfiguration. If you are disabling the mode mid-way a legitimate deployment, files will start to upload from the server, even if your staging share is still available.

> **Important:**   
> After you disable offline data transfer there is no way to enable it again, even if the staging share from the bulk migration is still available.

## Next steps
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Deploy Azure File Sync](storage-sync-files-deployment-guide.md)
