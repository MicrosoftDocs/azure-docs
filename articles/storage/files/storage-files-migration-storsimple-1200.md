---
title: StorSimple 1200 migration to Azure File Sync
description: Learn how to migrate a StorSimple 1200 series virtual appliance to Azure File Sync.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 03/09/2020
ms.author: fauhse
ms.subservice: files
---

# StorSimple 1200 migration to Azure File Sync

StorSimple 1200 series is a virtual appliance that is run in an on-premises data center. It is possible to migrate the data from this appliance to an Azure File Sync environment. Azure File Sync is the default and strategic long-term Azure service that StorSimple appliances can be migrated to.

StorSimple 1200 series will reach its [end-of-life](https://support.microsoft.com/en-us/lifecycle/search?alpha=StorSimple%201200%20Series) in December 2022.  It is important to begin planning your migration as soon as possible. This article provides the necessary background knowledge and migrations steps for a successful migration to Azure File Sync. 

## Azure File Sync

> [!IMPORTANT]
> Microsoft is committed to assist customers in their migration. Email AzureFilesMigration@microsoft .com for a customized migration plan as well as assistance during the migration.

Azure File Sync is a Microsoft cloud service, based on two main components:

* File synchronization and cloud tiering.
* File shares as native storage in Azure, that can be accessed over multiple protocols like SMB and file REST. An Azure file share is comparable to a file share on a Windows Server, that you can natively mount as a network drive. It supports important file fidelity aspects like attributes, permissions, and timestamps. Unlike with StorSimple, no application/service is required to interpret the files and folders stored in the cloud. The ideal, and most flexible approach to store general purpose file server data as well as some application data, in the cloud.

This article focuses on the migration steps. If before migrating you'd like to learn more about Azure File Sync, we recommend the following articles:

* [Azure File Sync - overview](https://aka.ms/AFS "Overview")
* [Azure File Sync - deployment guide](storage-sync-files-deployment-guide.md)

## Migration goals

The goal is to guarantee the integrity of the production data as well as guaranteeing availability. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

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

```console
Robocopy /MT:32 /UNILOG:<file name> /TEE /B /MIR /COPYALL /DCOPY:DAT <SourcePath> <Dest.Path>
```

Background:

:::row:::
   :::column span="1":::
      /MT
   :::column-end:::
   :::column span="1":::
      Allows for RoboCopy to run multi-threaded. Default is 8, max is 128.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /UNILOG:<file name>
   :::column-end:::
   :::column span="1":::
      Outputs status to LOG file as UNICODE (overwrites existing log).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /TEE
   :::column-end:::
   :::column span="1":::
      Outputs to console window. Used in conjunction with output to a log file.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /B
   :::column-end:::
   :::column span="1":::
      Runs RoboCopy in the same mode a backup application would use. It allows RoboCopy to move files that the current user does not have permissions to.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /MIR
   :::column-end:::
   :::column span="1":::
      Allows to run this RoboCopy command several times, sequentially on the same target / destination. It identifies what has been copied before and omits it. Only changes, additions and "*deletes*" will be processed, that occurred since the last run. If the command wasn't run before, nothing is omitted. This is an excellent option for source locations that are still actively used and changing.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /COPY:copyflag[s]
   :::column-end:::
   :::column span="1":::
      fidelity of the file copy (default is /COPY:DAT), copy flags: D=Data, A=Attributes, T=Timestamps, S=Security=NTFS ACLs, O=Owner info, U=aUditing info
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /COPYALL
   :::column-end:::
   :::column span="1":::
      COPY ALL file info (equivalent to /COPY:DATSOU)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /DCOPY:copyflag[s]
   :::column-end:::
   :::column span="1":::
      fidelity for the copy of directories (default is /DCOPY:DA), copy flags: D=Data, A=Attributes, T=Timestamps
   :::column-end:::
:::row-end:::

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

You can also run into other Azure File Sync issues.
As unlikely as they may be, if that happens, take a look at the **LINK Azure File Sync troubleshooting guide**.

## Relevant links

Migration content:

* [StorSimple 8000 series migration guide](storage-files-migration-storsimple-8000.md)

Azure File Sync content:

* [AFS overview](https://aka.ms/AFS)
* [AFS deployment guide](storage-files-deployment-guide.md)
* [AFS troubleshooting](storage-sync-files-troubleshoot.md)
