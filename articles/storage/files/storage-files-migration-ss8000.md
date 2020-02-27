---
title: StorSimple 8000 series migration to Azure File Sync | Microsoft Docs
description: Learn how to migrate a StorSimple 8100 or 8600 appliance to Azure File Sync.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

# StorSimple 8100 and 8600 migration to Azure File Sync

StorSimple 8000 series encompasses two different physical StorSimple appliances that only differentiate in the amount of local cache size (disk space). This appliance is run in an on-premises data center and acts as a cache to the data stored in Azure.
With the announced end-of-service-life of the StorSimple product line on December 31 2022, the cloud service this appliance is connected to, will stop working.

It is imperative to migrate off of any StorSimple device with ample time to spare.
Azure File Sync is the natural successor technology, with more features and more flexibility than StorSimple offers.

This article provides the necessary background knowledge and migrations steps to make your migration to Azure File Sync a success.

## Azure File Sync

Azure File Sync is a Microsoft cloud service, based on two main components:

* File synchronization and cloud tiering.
* File shares as native storage in Azure, that can be accessed over multiple protocols like SMB, NFS and file REST. An Azure file share is comparable to a file share on a Windows Server, that you can natively mount as a network drive. It supports important file fidelity aspects like attributes, permissions, and timestamps. Unlike with StorSimple, no application/service is required to interpret the files and folders stored in the cloud. The ideal, and most flexible approach to store general purpose file server data as well as some application data, in the cloud.

This article will not focus on an introduction to Azure File Sync, and rather on the migration steps. To learn more about Azure File Sync, we recommend the following two articles:

* [Azure File Sync - overview](https://aka.ms/AFS "Overview")
* Azure File Sync - deployment guide
[Azure File Sync - deployment guide](storage-sync-files-deployment-guide.md)

## Migration goals

The goal in any migration, including this one, is to guarantee the integrity of the production data as well as guaranteeing availability. The latter requires to keep any downtime to a minimum, such that it can fit into or only slightly exceed regular maintenance windows.

## StorSimple 8000 series migration path to Azure File Sync

Once you are familiar with Azure File Sync, you know that a local Windows Server is required to run an Azure File Sync agent. The Windows Server can be at a minimum a 2012R2 server but ideally is a Windows Server 2019.

Migrating from a StorSimple 8100 or 8600 appliance to Azure File Sync requires the migration path to Azure File Sync we describe here. It may seem to you that there are other options, and we can assure you we have evaluated them and they all have drawbacks that go against either of the two main goals of any migration, described in the section above. There are numerous alternatives and it would create too long of an article to document all of them and illustrate why they bear risk or disadvantages over the route we do recommend you take.

![Migration steps overview](media/storage-files-migration-storsimple-shared/ss8000-overview.png "Migration route overview of the steps further below in this article.")

The image above describes multiple steps that correspond to the sections, following below.
At its core, the migration approach chooses a cloud-side migration, to avoid unnecessary recall of files to your local StorSimple appliance, thus avoiding unnecessary use of your network bandwidth or impacting local caching behavior that can affect your production workloads.
A cloud-side migration is operating on a snapshot (a volume clone) of your data. So your production data is isolated from this process - until cut-over at the end of the migration. That makes the migration safe and easily restartable, should you run into any difficulties.

## Considerations around existing StorSimple backups

StorSimple allows to take backups in form of volume clones. The rest of this article uses a new, recent volume clone to migrate your live files.
If you have a requirement that says you need to migrate not just your live production data but also - at least some - backups, then the guidance below still applies, but you are not starting the migration with a new, recent volume clone, but with the oldest backup (volume clone) you need to migrate.

The sequence is as follows:

1. Determine a minimal set of backups (volume clones) you absolutely must migrate. Keeping this list to a minimum is beneficial for the amount of time your migration will take. Therefore, select only the backups you absolutely have to migrate.
2. Move the oldest volume clone first, and sequentially step through more recent ones. The order **is not** arbitrary.
3. When you migrate a volume clone with the steps described later in this article, then you need to take an Azure file share snapshot after each volume clone you moved. [Azure file share snapshots](storage-snapshots-files.md) are the way to keep point-in-time versions (backups) of the files and folder structure in your Azure file share. Don't forget to take the snapshot, or your sequential move of volume clones will not result in restorable versions on the Azure file share side, after the migration is done.
4. Ensure that you take Azure file share snapshots for all Azure file shares, that are severed by the same StorSimple volume. Volume clones are on the volume level, Azure file share snapshots are on the share level.
5. Repeat the process of moving a volume clone and taking share snapshots after each volume clone until you get caught up to the live data and follow the process below with a recent, new volume clone to capture the live data as accurately as possible. If you do not need to move backups at all and can start a new chain of backups on the Azure file share side after the migration is done, then that is beneficial to reduce complexity in the migration and amount of time the migration will take. You can make the decision whether or not to move backups and how many for each volume (not each share) you have in StorSimple.

## Step 1: Getting ready

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/ss8000-step-1.png)
    :::column-end:::
    :::column:::
        The basis for the migration is a volume clone and a virtual cloud appliance, called a StorSimple 8020.
This step focuses on deployment of these resources in Azure.
    :::column-end:::
:::row-end:::

### Deploying a StorSimple 8020 virtual appliance

Deploying a cloud appliance takes several steps. It requires security, networking, and a few other considerations.
The following guide walks you through the [deployment of a fully functional StorSimple 8020 virtual appliance](../../storsimple/storsimple-8000-cloud-appliance-u2.md) in Azure, just as we require in this migration.

This guide contains additional information, not required here.
Follow the guide from the top to including "Step 2: Configure and register the cloud appliance". You do not need to follow the optional "Step 3" or any other parts in this article.

Follow this guide as described and return to this article.

### Determining a volume clone to use

When you are ready to begin the migration, the first step is to take a new volume clone - just as you would for backup - that captures the current state of your StorSimple cloud storage. Do this for each of the StorSimple volumes you have.
If you are in need of moving backups, then the first volume clone you use is not a newly created clone but the oldest volume clone (oldest backup) you need to migrate.
Refer to the section ["Considerations around existing StorSimple backups"](#considerations-around-existing-storsimple-backups) in this article for important, detailed guidance.

Follow the guide: [Create a clone of a volume](../../storsimple/storsimple-8000-clone-volume-u2.md#create-a-clone-of-a-volume)

There is more information in the article linked to above. It is only necessary to follow what's described under the linked-to headline. Then return to this article and follow the next steps.

### Use the volume clone

The last phase of Step 1 is to make the volume clone you've chosen, available on the 8020 virtual appliance in Azure.
To accomplish that, 

**NEED LINK TO ACTUAL SS DOCUMENTATION**

### Step 1 summary

At the end of Step 1, you now have a StorSimple 8020 virtual appliance deployed on an Azure VM, in the same region as your StorSimple cloud storage.
You have also determined a volume clone to use for the initial migration. That volume clone either was recently taken or is the oldest backup volume clone you've determined you must move.

You then mounted the volume clone to the StorSimple 8020 virtual appliance in Azure and have it's data available.

Only proceed to the next step, when this step is complete.

## Step 2: Cloud VM

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/ss8000-step-2.png)
    :::column-end:::
    :::column:::
        After your initial clone is available on the StorSimple 8020 virtual appliance in Azure, it is now time to provision a VM and expose the volume clone (or multiple) to that VM over iSCSI.
    :::column-end:::
:::row-end:::

### Deploy an Azure VM

The Windows Server virtual machine in Azure is just like the StorSimple 8020, a temporary piece of infrastructure that is only necessary during the migration.
The specs of the VM you deploy, depend mostly on the number of items (files and folders) you want to sync. When in doubt, go with a higher spec.

A single Windows Server can sync up to 30 Azure file shares.
The specs you decide on need to encompass every share/path or the root of the StorSimple volume and count the items (files and folders).

The overall size of the data is less of a bottleneck - it is the number of items you need to tailor the machine specs to.

* [Learn how to size a Windows Server based on the number of items (files and folders) you need to sync.](storage-sync-files-planning.md#recommended-system-resources)
* [Learn how to deploy a Windows Sever VM.](../../virtual-machines/windows/quick-create-portal.md)

> [!IMPORTANT]
> Make sure that the VM is deployed in the same Azure region as the StorSimple 8020 virtual appliance. If as part of this migration, you also need to change the region of your cloud data from the region it is stored in today, you can do that at a later step, when you provision Azure file shares.

### Expose the StorSimple 8020 volumes to the VM

In this phase, you are connecting one or several StorSimple volumes from the 8020 virtual appliance over iSCSI to the Windows Server VM you've just provisioned.

1. [Get private IP for the cloud appliance](../../storsimple/storsimple-8000-cloud-appliance-u2.md#get-private-ip-for-the-cloud-appliance)
2. [Connect over iSCSI](../../storsimple/storsimple-8000-deployment-walkthrough-u2.md#step-7-mount-initialize-and-format-a-volume)

You only need to follow the steps in the two sections linked to above.
Return to this article, once you have finished.

### Step 2 summary

At the end of Step 2, you have provisioned a Windows Server VM in the same region as the 8020 virtual StorSimple appliance and exposed all applicable volumes from the 8020 to the Windows Server VM over iSCSI. You should now see file and folder content, when you use File Explorer on the Server VM on the mounted volumes.
Only proceed when you have completed this step for all the volumes that need migration.

## Step 3: Setting up Azure file shares and getting ready for Azure File Sync

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/ss8000-step-3.png)
    :::column-end:::
    :::column:::
        In this step, you will be determining and provisioning a number of Azure file shares, creating a Windows Server on-premises as a StorSimple appliance replacement and configure that server for Azure File Sync. 
    :::column-end:::
:::row-end:::

### Mapping your existing namespaces to Azure file shares

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

### Deploy Azure file shares

[!INCLUDE [storage-files-migration-provision-AzFS](../../../includes/storage-files-migration-provision-AzFS.md)]

> [!TIP]
> If you need to change the Azure region from the current region your StorSimple data resides in, then provision the Azure file shares in the new region you want to use. You determine the region by selecting it when you provision the storage accounts that hold your Azure file shares. Make sure that also the Azure File Sync resource you will provision below, is in that same, new region.

### Deploy the Azure File Sync cloud resource

[!INCLUDE [storage-files-migration-deploy-AFS-sss](../../../includes/storage-files-migration-deploy-AFS-sss.md)]

> [!TIP]
> If you needed to change the Azure region from the current region your StorSimple data resides in, then you have provisioned the storage accounts for your Azure file shares in the new region. Make sure that you selected that same region when you deploy this storage sync service.

### Deploy an on-premises Windows Server

* Create a Windows Server 2019 - at a minimum 2012R2 - as a virtual machine or physical server. A Windows Server fail-over cluster is also supported. Don't reuse the server you might have fronting the StorSimple 8100 or 8600.
* Provision or add Direct Attached Storage (DAS as compared to NAS, which is not supported).

It is best practice to give your new Windows Server an equal or larger amount of storage than your StorSimple 8100 or 8600 appliance has locally available for caching. You will be using the Windows Server in much the same fashion as you used the StorSimple appliance and if that worked well, the same amount of storage (although not a requirement) will guarantee a continued good caching experience.
You can add or remove storage to your Windows Server over time, thus allowing you to grow or shrink local volume sizes to adjust the amount of local storage available for caching.

### Prepare the Windows Server for file sync

[!INCLUDE [storage-files-migration-deploy-AFS-agent](../../../includes/storage-files-migration-deploy-AFS-agent.md)]

### Configure Azure File Sync on the Windows Server

For this, you need your registered, on-premises Windows Server ready, and still internet connected.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

> [!WARNING]
> **Be sure to turn on cloud tiering!** Cloud tiering is the AFS feature that allows the local server to have less storage capacity than is stored in the cloud, yet have the full namespace available. Locally interesting data is also cached locally for fast, local access performance. Another reason to turn on cloud tiering at this step is that we do not want to sync file content at this stage, only the namespace should be moving at this time.

## Step 4: Configuring the Azure VM for sync

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/ss8000-step-4.png)
    :::column-end:::
    :::column:::
        This step concerns your Azure VM with the iSCSI mounted, first volume clone(s). During this step, you will get the VM connected via Azure File Sync and start a first round of moving files from your StorSimple volume clone(s).
        
    :::column-end:::
:::row-end:::

You already have configured your on-premises server that will replace your StorSimple 8100 or 8600 appliance, for Azure File Sync. Configuring the Azure VM is exactly the same, with one additional step. Follow the steps below in sequence. Where the steps are equal to the on-prem Windows Server, a link will point you to a previous section discussing the details that by now you might already be familiar with.

1. [Deploy the AFS agent. (see previous section)](#prepare-the-windows-server-for-file-sync)
2. [Getting the VM ready for Azure File Sync.](#getting-the-vm-ready-for-azure-file-sync)
3. [Configure sync](#configure-azure-file-sync-on-the-azure-vm)

### Getting the VM ready for Azure File Sync

Azure File Sync will be used to move the files from the mounted iSCSI StorSimple volumes to the target Azure file shares.
Over the course of this migration, you will mount several volume clones to the VM, under the same drive letter. Azure File Sync must be configured to see the next volume clone you've mounted as a newer version of the files and folders and update the Azure file shares connected via Azure File Sync. For this to work, a registry key must be set on the server ***before*** Azure File Sync is configured.

1. Create a new directory on the system drive of the VM. Azure File Sync information will need to be persisted there instead of the data volume. For example: `“C:\syncmetadata”`
2. Open regedit and locate the following registry hive: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync`
3. Create a new Key of type String, named: ***MetadataRootPath***
4. Set the full path to the directory you created on the system volume, for example: `C:\syncmetadata”`

### Configure Azure File Sync on the Azure VM

This step is similar to the previous section, that discusses how you configure AFS on the on-premises server.

The difference is, that you do not need to enable cloud tiering on this server and that you need to make sure that the right folders are connected to the right Azure file shares. Otherwise your naming of Azure file shares and data content won't match and there is no way to rename the cloud resources or local folders. YOu have to get this step right or you need to delete all files from the on-prem server (that will sync to the Azure file shares) and setup sync on the Azure VM here again.

Refer to the [previous section on how to configure Azure File Sync on a Windows Server](#configure-azure-file-sync-on-the-windows-server).

### Step 4 summary

At the end of this section, you have successfully configured Azure File Sync on the Azure VM you have mounted your StorSimple volume clone(s) via iSCSI.
Data is not flowing from the Azure VM to the various Azure file shares and from there a fully tired namespace appears on your on-premises Windows Server.

> [!IMPORTANT]
> Ensure there are no changes made or user access granted to the Windows Server at this time.

The initial volume clone data moving through the Azure VM to the Azure file shares can take a long time. Weeks even. Estimating the time this will take is tricky and depends on many factors. Most notably the speed at which the Azure VM can access files on the StorSimple volumes and how fast Azure File Sync can process the files and folders that need syncing. From experience, we can assume that the bandwidth - therefore the actual data size - plays a subordinate role. The time this or any subsequent migration round will take is mostly dependent on the number of items that can be processed per second. So for example 1 TiB with a 100,000 files and folders will most likely finish slower than 1 TiB with only 50,000 files and folders.

## Step 5: Am I done yet?

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/ss8000-step-5.png)
    :::column-end:::
    :::column:::
        As discussed in the previous step, the initial sync can take a long time. Your users and applications are still accessing the on-premises StorSimple 8100 or 8600 appliance. That means that changes are accumulating, and with every day a larger delta between the live data and the initial volume clone, you are currently migration, forms. In this section, you'll learn how to minimize downtime by using multiple volume clones and telling when sync is done.
    :::column-end:::
:::row-end:::

Unfortunately the migration with Azure File Sync from StorSimple volume clones isn't instantaneous. That means that the aforementioned delta to the live data is an unavoidable consequence. The good news is that you can repeat the process of mounting new volume clones. Each clone containing the delta of decreasing mass, meaning eventually sync from a volume clone will finish relatively quickly, within a time window you can take the users and apps offline and cut them over to the on-premises Windows Server.

Follow these steps, several iterations of them, until sync finishes quickly enough to cut over.

1. [Determine sync is complete for a given volume clone.](#determining-when-sync-from-a-volume-clone-is-complete)
2. [Take a new volume clone(s) and mount it to the 8020 virtual appliance.](#the-next-volume-clones)
3. [Determine when sync is done.](#determine-when-sync-is-done)
4. [Cut-over strategy](#cut-over-strategy)

### Determining when sync from a volume clone is complete

The basic indicator for when to take a new

### The next volume clone(s)

We have discussed taking a volume clone(s) earlier in this article.
This phase has two actions:

1. [Take a volume clone](../../storsimple/storsimple-8000-clone-volume-u2.md#create-a-clone-of-a-volume)
2. [Mount that volume clone (see above)](#use-the-volume-clone)

### Determine when sync is done

When sync is done, you can stop your time measurement and determine if you need to repeat the process of taking a volume clone and mounting it or if the time sync took with the last volume clone was sufficiently small.

In order to determine sync is complete:

1. Open the Event Viewer and navigate to "Applications and Services"
2. Navigate and open Microsoft\FileSync\Agent\Telemetry
3. Look for the most recent event 9102, which corresponds to a completed sync session
4. Select Details and confirm that the SyncDirection value is Upload
5. Check the HResult and confirm it shows 0. This means that the sync session was successful. If HResult is a non-zero value, then there was an error during sync. If the PerItemErrorCount is greater than 0, then some files or folders did not sync properly. It is possible to have an HResult of 0 but a PerItemErrorCount that is greater than 0. At this point, you don't need to worry about the PerItemErrorCount. We will catch these files later. If this error count is significant, thousands of items, contact customer support and ask to be connected to the Azure File Sync product group for direct guidance on best, next steps.
6. Check to see multiple 9102 events with HResult 0 in a row. That is your signal for "Sync is complete" for this volume clone.

### Cut-over strategy

1. Determine sync from a volume clone is fast enough now. (delta small enough)
2. Take the StorSimple appliance offline.
3. A final RoboCopy.

Measure the time and determine if sync from a recent volume clone can finish within a time window small enough, that you can afford as downtime in your system.

The big moment of finishing the migration is near.

It is now time to take the StorSimple appliance offline. No more user access. No more changes. Downtime has begun.

Let the device sync any changes that have been made to it to StorSimple in the cloud.
If you do this on a weekend, the sync backlog for your StorSimple should be small.

Take one last volume clone. Mount it as you've done several times before.
The WIndows Server VM in Azure will sync the last delta. No new changes occur during this time on the StorSimple appliance, so this is truly the last round.

See above and determine when sync is complete. Then proceed with the next step below.

## Step 6: A final RoboCopy

When you get to this point, there are two differences between your on-premises Windows Server and the StorSimple 8100 or 8600 appliance:

1. There may be files that haven't synced (see PerItemErrors from the event log above)
2. The StorSimple appliance has a populated cache vs. the Windows Server just a namespace with no file content stored locally at this time.

![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/ss8000-step-6.png)

We can bring the cache of the Windows Server to the state of the appliance and ensure no file is left behind, with a final RoboCopy.

> [!CAUTION]
> It is imperative that the RoboCopy command you follow, is exactly as described below. We only want to copy files that are local and files that haven't moved through the volume clone+sync approach before. We can solve the problems why they didn't sync later, after the migration is complete. (See [Azure File Sync troubleshooting](storage-sync-files-troubleshoot.md#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing). It's most likely unprintable characters in file names that you won't miss when they are deleted.)

RoboCopy command:

```console
Robocopy /MIR /COPYALL /DCOPY:DAT <SourcePath> <Dest.Path>
```

Background:

:::row:::
   :::column span="1":::
      /MIR
   :::column-end:::
   :::column span="1":::
      Allows for RoboCopy to only consider deltas between source (StorSimple appliance) and target (Windows Server directory).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /COPY:copyflag[s]
   :::column-end:::
   :::column span="1":::
      fidelity of the file copy (default is /COPY:DAT), copy flags : D=Data, A=Attributes, T=Timestamps, S=Security=NTFS ACLs, O=Owner info, U=aUditing info
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
      fidelity for the copy of directories (default is /DCOPY:DA), copy flags : D=Data, A=Attributes, T=Timestamps
   :::column-end:::
:::row-end:::

You should run this command for each of the directories on the Windows Server as a target, that you've configured with file sync to an Azure file.

You can run multiple of these commands in parallel.
Once this RoboCopy step is complete, you can allow your users and apps to access the Windows Server like they did the StorSimple appliance before.

It is likely needed to create the SMB shares on the Windows Server that you had on the StorSimple data before. You can front-load this step and do it earlier to not lose time here, but you must ensure that before this point, no user of app changes files on the Windows Server.

If you have a DFS-N deployment, you can point the DFN-Namespaces to the new server folder locations. If you do not have a DFS-N deployment, and you fronted your 8100 8600 appliance locally with a Windows Server, you can take that server off the domain, and domain join your new Windows Server with AFS to the domain, give it the same server name as the old server, and the same share names, then the cut-over to the new server remains transparent for your users, group policy, or scripts.

## Step 7: Deprovisioning

During the last step you have iterated through multiple volume clones, and eventually were able to cut over user access to the new Windows Server after taking you StorSimple appliance offline.

You can now begin to deprovision unnecessary resources.
Before you begin, it is a best practice to observe your new Azure File Sync deployment in production, for a bit. That gives you options. Options to fix a mistake you've made or any problems you might encounter.

Once you are satisfied and have observed your AFS deployment for at least a few days, you can begin to deprovision resources in this order:

1. Turn off the Azure VM that we have used to move data from the volume clones to the Azure file shares via file sync.
2. Go to your storage sync service resource in Azure, and unregister the Azure VM. That removes it from all the sync groups.

> [!WARNING]
> **ENSURE you pick the right machine.** You've turned the cloud VM off, that means it should show as the only offline server in the list of registered servers. It must be avoided, that you accidentally pick the on-premises Windows Server and unregister it in error.

3. Delete Azure VM and its resources.
4. Disable the 8020 virtual StorSimple appliance.
5. Deprovision all StorSimple resources in the Azure.
6. Unplug the StorSimple physical appliance from your data center.

Your migration is complete.

## Next steps

Get more familiar with Azure File Sync.
Especially with the flexibility of cloud tiering policies.

If you see in the Azure portal, or from the earlier events, that some files are permanently not syncing, review the troubleshooting guide for steps to resolve these issues.

* [Azure File Sync overview: aka.ms/AFS](https://aka.ms/AFS)
* [Cloud tiering](storage-sync-cloud-tiering.md) 
* [Azure File Sync troubleshooting guide](storage-sync-files-troubleshoot.md)
