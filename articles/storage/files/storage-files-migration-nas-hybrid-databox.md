---
title: On-premises NAS migration to Azure File Sync via Azure DataBox
description: Learn how to migrate files from an on-premises Network Attached Storage (NAS) location to a hybrid cloud deployment with Azure File Sync via Azure DataBox.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 03/5/2021
ms.author: fauhse
ms.subservice: files
---

# Use DataBox to migrate from Network Attached Storage (NAS) to a hybrid cloud deployment with Azure File Sync

This migration article is one of several involving the keywords NAS, Azure File Sync, and Azure DataBox. Check if this article applies to your scenario:

> [!div class="checklist"]
> * Data source: Network Attached Storage (NAS)
> * Migration route: NAS &rArr; DataBox &rArr; Azure file share &rArr; sync with Windows Server
> * Caching files on-premises: Yes, the final goal is an Azure File Sync deployment.

If your scenario is different, look through the [table of migration guides](storage-files-migration-overview.md#migration-guides).

Azure File Sync works on Direct Attached Storage (DAS) locations and does not support sync to Network Attached Storage (NAS) locations.
This fact makes a migration of your files necessary and this article guides you through the planning and execution of such a migration.

## Migration goals

The goal is to move the shares that you have on your NAS appliance to a Windows Server. Then utilize Azure File Sync for a hybrid cloud deployment. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## Migration overview

The migration process consists of several phases. You'll need to deploy Azure storage accounts and file shares, deploy an on-premises Windows Server, configure Azure File Sync, migrate using RoboCopy, and finally, do the cut-over. The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you are returning to this article, use the navigation on the right side to jump to the migration phase where you left off.

## Phase 1: Identify how many Azure file shares you need

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 3: Determine how many Azure DataBox appliances you need

Start this step only, when you have completed the previous phase. Your Azure storage resources (storage accounts and file shares) should be created at this time. During your DataBox order, you need to specify into which storage accounts the DataBox is moving data.

In this phase, you need to map the results of the migration plan from the previous phase to the limits of the available DataBox options. These considerations will help you make a plan for which DataBox options you should choose and how many of them you will need to move your NAS shares to Azure file shares.

To determine how many devices of which type you need, consider these important limits:

* Any Azure DataBox can move data into up to 10 storage accounts. 
* Each DataBox option comes at their own usable capacity. See [DataBox options](#databox-options).

Consult your migration plan for the number of storage accounts you have decided to create and the shares in each one. Then look at the size of each of the shares on your NAS. Combining this information will allow you to optimize and decide which appliance should be sending data to which storage accounts. You can have two DataBox devices move files into the same storage account, but don't split content of a single file share across 2 DataBoxes.

### DataBox options

For a standard migration, one or a combination of these three DataBox options should be chosen: 

* DataBox Disks
  Microsoft will send you one and up to five SSD disks with a capacity of 8 TiB each, for a maximum total of 40 TiB. The usable capacity is about 20% less, due to encryption and file system overhead. For more information, see [DataBox Disks documentation](../../databox/data-box-disk-overview.md).
* DataBox
  This is the most common option. A ruggedized DataBox appliance, that works similar to a NAS, will be shipped to you. It has a usable capacity of 80 TiB. For more information, see [DataBox documentation](../../databox/data-box-overview.md).
* DataBox Heavy
  This option features a ruggedized DataBox appliance on wheels, that works similar to a NAS, with a capacity of 1 PiB. The usable capacity is about 20% less, due to encryption and file system overhead. For more information, see [DataBox Heavy documentation](../../databox/data-box-heavy-overview.md).

## Phase 4: Provision a suitable Windows Server on-premises

While you wait for your Azure DataBox(es) to arrive, you can already start reviewing the needs of one or more Windows Servers you will be using with Azure File Sync.

* Create a Windows Server 2019 - at a minimum 2012R2 - as a virtual machine or physical server. A Windows Server fail-over cluster is also supported.
* Provision or add Direct Attached Storage (DAS as compared to NAS, which is not supported).

The resource configuration (compute and RAM) of the Windows Server you deploy depends mostly on the number of items (files and folders) you will be syncing. A higher performance configuration is recommended if you have any concerns.

[Learn how to size a Windows Server based on the number of items (files and folders) you need to sync.](../file-sync/file-sync-planning.md#recommended-system-resources)

> [!NOTE]
> The previously linked article presents a table with a range for server memory (RAM). You can orient towards the smaller number for your server but expect that initial sync can take significantly more time.

## Phase 5: Copy files onto your DataBox

When your DataBox arrives, you need to set up your DataBox in the line of sight to your NAS appliance. Follow the setup documentation for the DataBox type you ordered.

* [Set up Data Box](../../databox/data-box-quickstart-portal.md)
* [Set up Data Box Disk](../../databox/data-box-disk-quickstart-portal.md)
* [Set up Data Box Heavy](../../databox/data-box-heavy-quickstart-portal.md)

Depending on the DataBox type, there maybe DataBox copy tools available to you. At this point, they are not recommended for migrations to Azure file shares as they do not copy your files with full fidelity to the DataBox. Use RoboCopy instead.

When your DataBox arrives, it will have pre-provisioned SMB shares available for each storage account you specified at the time of ordering it.

* If your files go into a premium Azure file share, there will be one SMB share per premium "File storage" storage account.
* If your files go into a standard storage account, there will be three SMB shares per standard (GPv1 and GPv2) storage account. Only the file shares ending with `_AzFiles` are relevant for your migration. Ignore any block and page blob shares.

Follow the steps in the Azure DataBox documentation:

1. [Connect to Data Box](../../databox/data-box-deploy-copy-data.md)
1. Copy data to Data Box
1. [Prepare your DataBox for departure to Azure](../../databox/data-box-deploy-picked-up.md)

The linked DataBox documentation specifies a RoboCopy command. However, the command is not suitable to preserve the full file and folder fidelity. Use this command instead:

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]


## Phase 6: Deploy the Azure File Sync cloud resource

Before continuing with this guide, wait until all of your files have arrived in the correct Azure file shares. The process of shipping and ingesting DataBox data will take time.

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

## Phase 7: Deploy the Azure File Sync agent

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

## Phase 8: Configure Azure File Sync on the Windows Server

Your registered on-premises Windows Server must be ready and connected to the internet for this process.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

Turn on the cloud tiering feature and select "Namespace only" in the initial download section.

> [!IMPORTANT]
> Cloud tiering is the AFS feature that allows the local server to have less storage capacity than is stored in the cloud, yet have the full namespace available. Locally interesting data is also cached locally for fast access performance. Cloud tiering is an optional feature per Azure File Sync "server endpoint". You need to use this feature if you do not have enough local disk capacity on the Windows Server to hold all cloud data and if you want to avoid downloading all data from the cloud!

Repeat the steps of sync group creation and addition of the matching server folder as a server endpoint for all Azure file shares / server locations, that need to be configured for sync. Wait until sync of the namespace is complete. The following section will detail how you can ensure that.

> [!NOTE]
> After the creation of a server endpoint, sync is working. However, sync needs to enumerate (discover) the files and folders you moved via DataBox into the Azure file share. Depending on the size of the namespace, this can take significant time before the namespace of the cloud starts to appear on the server.

## Phase 9: Wait for the namespace to fully appear on the server

It's imperative that you wait with any next steps of your migration that the server has fully downloaded the namespace from the cloud share. If you start moving files too early onto the server, you can risk unnecessary uploads and even file sync conflicts.

To tell if your server has completed initial download sync, open Event Viewer on your syncing Windows Server and use the Azure File Sync telemetry event log.
The telemetry event log is located in Event Viewer under Applications and Services\Microsoft\FileSync\Agent.

Search for the most recent 9102 event. 
Event ID 9102 is logged once a sync session completes. In the event text there, is a field for the download sync direction. (`HResult` needs to be zero and files downloaded as well).
 
You want to see two consecutive events of this type and content to tell that the server has finished downloading the namespace. It's OK if there are different events firing between two 9102 events.

## Phase 10: Catch-up RoboCopy from your NAS

Once your server has completed initial sync of the entire namespace from the cloud share, you can proceed with this step. It's imperative that this step is complete, before you continue with this step. Check the previous section for details.

In this step, you will run RoboCopy jobs to catch up your cloud shares with the latest changes on your NAS since the time you forked your shares onto the DataBox.
This catch-up RoboCopy may finish quickly or take a while, depending on the amount of churn that happened on your NAS shares.

> [!WARNING]
> Due to a regressed RoboCopy behavior in Windows Server 2019, /MIR switch of RoboCopy is not compatible with a tiered target directory. You must not use Windows Server 2019 or Windows 10 client for this Phase of the migration. Use RoboCopy on an intermediate Windows Server 2016.

The basic migration approach is a RoboCopy from your NAS appliance to your Windows Server, and Azure File Sync to Azure file shares.

Run the first local copy to your Windows Server target folder:

1. Identify the first location on your NAS appliance.
1. Identify the matching folder on the Windows Server, that already has Azure File Sync configured on it.
1. Start the copy using RoboCopy

The following RoboCopy command will copy only the differences (updated files and folders) from your NAS storage to your Windows Server target folder. The Windows Server will then sync them to the Azure file share(s). 

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

If you provisioned less storage on your Windows Server than your files take up on the NAS appliance, then you have configured cloud tiering. As the local Windows Server volume gets full, [cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md) will kick in and tier files that have successfully synced already. Cloud tiering will generate enough space to continue the copy from the NAS appliance. Cloud tiering checks once an hour to see what has synced and to free up disk space to reach the 99% volume free space.
It is possible, that RoboCopy needs to move numerous files, more than you have local storage for on the Windows Server. On average, you can expect RoboCopy to move a lot faster than Azure File Sync can upload your files over and tier them off your local volume. RoboCopy will fail. It is recommended that you work through the shares in a sequence that prevents that. For example, not starting RoboCopy jobs for all shares at the same time, or only moving shares that fit on the current amount of free space on the Windows Server, to mention a few. The good news is that the /MIR switch will only move deltas and once a delta has been moved, a restarted job will not need to move this file again.

### User cut-over

When you run the RoboCopy command for the first time, your users and applications are still accessing files on the NAS and potentially change them. It is possible, that RoboCopy has processed a directory, moves on to the next and then a user on the source location (NAS) adds, changes, or deletes a file that will now not be processed in this current RoboCopy run. This behavior is expected.

The first run is about moving the bulk of the churned data to your Windows Server and into the cloud via Azure File Sync. This first copy can take a long time, depending on:

* the upload bandwidth
* the local network speed and number of how optimally the number of RoboCopy threads matches it
* the number of items (files and folders), that need to be processed by RoboCopy and Azure File Sync

Once the initial run is complete, run the command again.

A second time you run RoboCopy for the same share, it will finish faster, because it only needs to transport changes that happened since the last run. You can run repeated jobs for the same share.

When you consider the downtime acceptable, then you need to remove user access to your NAS-based shares. You can do that by any steps that prevent users from changing the file and folder structure and content. An example is to point your DFS-Namespace to a non-existing location or change the root ACLs on the share.

Run one last RoboCopy round. It will pick up any changes, that might have been missed.
How long this final step takes, is dependent on the speed of the RoboCopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

Create a share on the Windows Server folder and possibly adjust your DFS-N deployment to point to it. Be sure to set the same share-level permissions as on your NAS SMB share. If you had an enterprise-class domain-joined NAS, then the user SIDs will automatically match as the users exist in Active Directory and RoboCopy copies files and metadata at full fidelity. If you have used local users on your NAS, you need to re-create these users as Windows Server local users and map the existing SIDs RoboCopy moved over to your Windows Server to the SIDs of your new, Windows Server local users.

You have finished migrating a share / group of shares into a common root or volume. (Depending on your mapping from Phase 1)

You can try to run a few of these copies in parallel. We recommend processing the scope of one Azure file share at a time.

## Troubleshoot

The most likely issue you can run into, is that the RoboCopy command fails with *"Volume full"* on the Windows Server side. Cloud tiering acts once every hour to evacuate content from the local Windows Server disk, that has synced. Its goal is to reach your 99% free space on the volume.

Let sync progress and cloud tiering free up disk space. You can observe that in File Explorer on your Windows Server.

When your Windows Server has sufficient available capacity, rerunning the command will resolve the problem. Nothing breaks when you get into this situation and you can move forward with confidence. Inconvenience of running the command again is the only consequence.

Check the link in the following section for troubleshooting Azure File Sync issues.

## Next steps

There is more to discover about Azure file shares and Azure File Sync. The following articles help understand advanced options, best practices, and also contain troubleshooting help. These articles link to [Azure file share documentation](storage-files-introduction.md) as appropriate.

* [Migration overview](storage-files-migration-overview.md)
* [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
* [Create a file share](storage-how-to-create-file-share.md)
* [Troubleshoot Azure File Sync](../file-sync/file-sync-troubleshoot.md)