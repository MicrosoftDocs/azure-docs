---
title: StorSimple 1200 migration to Azure File Sync
description: Learn how to migrate a StorSimple 1200 series virtual appliance to Azure File Sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 01/12/2023
ms.author: kendownie
---

# StorSimple 1200 migration to Azure File Sync

StorSimple 1200 series is a virtual appliance that is run in an on-premises data center. It's possible to migrate the data from this appliance to an Azure File Sync environment. Azure File Sync is the default and strategic long-term Azure service that StorSimple appliances can be migrated to. This article provides the necessary background knowledge and migrations steps for a successful migration to Azure File Sync. 

> [!NOTE]
> The StorSimple Service (including the StorSimple Device Manager for 8000 and 1200 series and StorSimple Data Manager) has reached the end of support. The end of support for StorSimple was published in 2019 on the [Microsoft LifeCycle Policy](/lifecycle/products/?terms=storsimple) and [Azure Communications](https://azure.microsoft.com/updates/storsimpleeol/) pages. Additional notifications were sent via email and posted on the Azure portal and in the [StorSimple overview](../../storsimple/storsimple-overview.md). Contact [Microsoft Support](https://azure.microsoft.com/support/create-ticket/) for additional details.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Azure File Sync

Azure File Sync is a Microsoft cloud service, based on two main components:

* File synchronization and cloud tiering.
* File shares as native storage in Azure, that can be accessed over multiple protocols like SMB and file REST. An Azure file share is comparable to a file share on a Windows Server, that you can natively mount as a network drive. It supports important file fidelity aspects like attributes, permissions, and timestamps. Unlike with StorSimple, no application/service is required to interpret the files and folders stored in the cloud. The ideal, and most flexible approach to store general purpose file server data and some application data, in the cloud.

This article focuses on the migration steps. If before migrating you'd like to learn more about Azure File Sync, we recommend the following articles:

* [Azure File Sync - overview](../file-sync/file-sync-planning.md "Overview")
* [Azure File Sync - deployment guide](../file-sync/file-sync-deployment-guide.md)

## Migration goals

The goal is to guarantee the integrity of the production data and guaranteeing availability. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## StorSimple 1200 migration path to Azure File Sync

A local Windows Server is required to run an Azure File Sync agent. The Windows Server can be at a minimum a 2012R2 server but ideally is a Windows Server 2019.

There are numerous, alternative migration paths and it would create too long of an article to document all of them and illustrate why they bear risk or disadvantages over the route we recommend as a best practice in this article.

:::image type="content" source="media/storage-files-migration-storsimple-shared/storsimple-1200-migration-overview.png" alt-text="Migration route overview of the steps further below in this article.":::

The previous image depicts steps that correspond to sections in this article.

### Step 1: Provision your on-premises Windows Server and storage

1. Create a Windows Server 2019 - at a minimum 2012R2 - as a virtual machine or physical server. A Windows Server fail-over cluster is also supported.
2. Provision or add Direct Attached Storage (DAS as compared to NAS, which is not supported). The size of the Windows Server storage must be equal to or larger than the size of the available capacity of your virtual StorSimple 1200 appliance.

### Step 2: Configure your Windows Server storage

In this step, you map your StorSimple storage structure (volumes and shares) to your Windows Server storage structure.
If you plan to make changes to your storage structure, meaning the number of volumes, the association of data folders to volumes, or the subfolder structure above or below your current SMB/NFS shares, then now is the time to take these changes into consideration.
Changing your file and folder structure after Azure File Sync is configured, is cumbersome, and should be avoided.
This article assumes you are mapping 1:1, so you must take your mapping changes into consideration when you follow the steps in this article.

* None of your production data should end up on the Windows Server system volume. Cloud tiering is not supported on system volumes. However, this feature is required for the migration as well as continuous operations as a StorSimple replacement.
* Provision the same number of volumes on your Windows Server as you have on your StorSimple 1200 virtual appliance.
* Configure any Windows Server roles, features, and settings you need. We recommend you opt into Windows Server updates to keep your OS safe and up to date. Similarly, we recommend opting into Microsoft Update to keep Microsoft applications up to date, including the Azure File Sync agent.
* Do not configure any folders or shares before reading the following steps.

### Step 3: Deploy the first Azure File Sync cloud resource

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

### Step 4: Match your local volume and folder structure to Azure File Sync and Azure file share resources

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

### Step 5: Provision Azure file shares

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

#### Storage account settings

There are many configurations you can make on a storage account. The following checklist should be used for your storage account configurations. You can change for instance the networking configuration after your migration is complete. 

> [!div class="checklist"]
> * Large file shares: Enabled - Large file shares improve performance and allow you to store up to 100TiB in a share.
> * Firewall and virtual networks: Disabled - do not configure any IP restrictions or limit storage account access to a specific VNET. The public endpoint of the storage account is used during the migration. All IP addresses from Azure VMs must be allowed. It's best to configure any firewall rules on the storage account after the migration.
> * Private Endpoints: Supported - You can enable private endpoints but the public endpoint is used for the migration and must remain available.

### Step 6: Configure Windows Server target folders

In previous steps, you have considered all aspects that will determine the components of your sync topologies. It is now time, to prepare the server to receive files for upload.

Create **all** folders, that will sync each to its own Azure file share.
It's important that you follow the folder structure you've documented earlier. If for instance, you have decided to sync multiple, local SMB shares together into a single Azure file share, then you need to place them under a common root folder on the volume. Create this target root folder on the volume now.

The number of Azure file shares you have provisioned should match the number of folders you've created in this step + the number of volumes you will sync at the root level.

### Step 7: Deploy the Azure File Sync agent

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

### Step 8: Configure sync

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

> [!WARNING]
> **Be sure to turn on cloud tiering!** This is required if your local server does not have enough space to store the total size of your data in the StorSimple cloud storage. Set your tiering policy, temporarily for the migration, to 99% volume free space.

Repeat the steps of sync group creation and addition of the matching server folder as a server endpoint for all Azure file shares / server locations, that need to be configured for sync.

### Step 9: Copy your files

The basic migration approach is a RoboCopy from your StorSimple virtual appliance to your Windows Server, and Azure File Sync to Azure file shares.

Run the first local copy to your Windows Server target folder:

* Identify the first location on your virtual StorSimple appliance.
* Identify the matching folder on the Windows Server, that already has Azure File Sync configured on it.
* Start the copy using RoboCopy

The following RoboCopy command will recall files from your StorSimple Azure storage to your local StorSimple and then move them over to the Windows Server target folder. The Windows Server will sync it to the Azure file share(s). As the local Windows Server volume gets full, cloud tiering will kick in and tier files that have successfully synced already. Cloud tiering will generate enough space to continue the copy from the StorSimple virtual appliance. Cloud tiering checks once an hour to see what has synced and to free up disk space to reach the 99% volume free space.

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

When you run the RoboCopy command for the first time, your users and applications are still accessing the StorSimple files and folders and potentially change it. It is possible, that RoboCopy has processed a directory, moves on to the next and then a user on the source location (StorSimple) adds, changes, or deletes a file that will now not be processed in this current RoboCopy run. That is fine.

The first run is about moving the bulk of the data back to on-premises, over to your Windows Server and backup into the cloud via Azure File Sync. This can take a long time, depending on:

* your download bandwidth
* the recall speed of the StorSimple cloud service
* the upload bandwidth
* the number of items (files and folders), that need to be processed by either service

Once the initial run is complete, run the command again.

The second time it will finish faster, because it only needs to transport changes that happened since the last run. Those changes are likely local to the StorSimple already, because they are recent. That is further reducing the time because the need for recall from the cloud is reduced. During this second run, still, new changes can accumulate.

Repeat this process until you are satisfied that the amount of time it takes to complete is an acceptable downtime.

When you consider the downtime acceptable and you are prepared to take the StorSimple location offline, then do so now: For example, remove the SMB share so that no user can access the folder or take any other appropriate step that prevents content to change in this folder on StorSimple.

Run one last RoboCopy round. This will pick up any changes, that might have been missed.
How long this final step takes, is dependent on the speed of the RoboCopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

Create a share on the Windows Server folder and possibly adjust your DFS-N deployment to point to it. Be sure to set the same share-level permissions as on your StorSimple SMB share.

You have finished migrating a share / group of shares into a common root or volume. (Depending on what you mapped and decided that needed to go into the same Azure file share.)

You can try to run a few of these copies in parallel. We recommend processing the scope of one Azure file share at a time.

> [!WARNING]
> Once you have moved all the data from you StorSimple to the Windows Server, and your migration is complete: Return to ***all***  sync groups in the Azure portal and adjust the cloud tiering volume free space percent value to something better suited for cache utilization, say 20%. 

The cloud tiering volume free space policy acts on a volume level with potentially multiple server endpoints syncing from it. If you forget to adjust the free space on even one server endpoint, sync will continue to apply the most restrictive rule and attempt to keep 99% free disk space, making the local cache not performing as you might expect. Unless it is your goal to only have the namespace for a volume that only contains rarely accessed, archival data.

## Troubleshoot

The most likely issue you can run into, is that the RoboCopy command fails with *"Volume full"* on the Windows Server side. If that is the case, then your download speed is likely better than your upload speed. Cloud tiering acts once every hour to evacuate content from the local Windows Server disk, that has synced.

Let sync progress and cloud tiering free up disk space. You can observe that in File Explorer on your Windows Server.

When your Windows Server has sufficient available capacity, rerunning the command will resolve the problem. Nothing breaks when you get into this situation and you can move forward with confidence. Inconvenience of running the command again is the only consequence.

You might also run into other Azure File Sync issues. If that happens, see [Azure File Sync troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).

[!INCLUDE [storage-files-migration-robocopy-optimize](../../../includes/storage-files-migration-robocopy-optimize.md)]

---

> [!NOTE]
> Still have questions or encountered any issues?</br>
> We're here to help: :::image type="content" source="media/storage-files-migration-storsimple-8000/storage-files-migration-storsimple-8000-migration-email.png" alt-text="Email address in one word: Azure Files migration at microsoft dot com":::

## Relevant links

Migration content:

* [StorSimple 8000 series migration guide](storage-files-migration-storsimple-8000.md)

Azure File Sync content:

* [Azure File Sync overview](../file-sync/file-sync-planning.md)
* [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md)
* [Azure File Sync troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json)