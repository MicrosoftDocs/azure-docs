---
title: On-premises NAS migration to Azure File Sync via Data Box
description: Learn how to migrate files from an on-premises Network Attached Storage (NAS) location to a hybrid cloud deployment by using Azure File Sync via Azure Data Box.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/5/2021
ms.author: kendownie
---

# Use Data Box to migrate from Network Attached Storage (NAS) to a hybrid cloud deployment by using Azure File Sync

This migration article is one of several that apply to the keywords NAS, Azure File Sync, and Azure Data Box. Check if this article applies to your scenario:

> [!div class="checklist"]
> * Data source: Network Attached Storage (NAS)
> * Migration route: NAS &rArr; Data Box &rArr; Azure file share &rArr; sync with Windows Server
> * Caching files on-premises: Yes, the final goal is an Azure File Sync deployment

If your scenario is different, look through the [table of migration guides](storage-files-migration-overview.md#migration-guides).

Azure File Sync works on Direct Attached Storage (DAS) locations. It doesn't support sync to Network Attached Storage (NAS) locations.
So you need to migrate your files. This article guides you through the planning and implementation of that migration.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Migration goals

The goal is to move the shares that you have on your NAS appliance to Windows Server. You'll then use Azure File Sync for a hybrid cloud deployment. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum so that it meets or only slightly exceeds regular maintenance windows.

## Migration overview

The migration process consists of several phases. You'll need to:
- Deploy Azure storage accounts and file shares.
- Deploy an on-premises computer running Windows Server. 
- Configure Azure File Sync.
- Migrate files by using Robocopy.
- Do the cutover.

The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you're returning to this article, use the navigation on the right side of the screen to jump to the migration phase where you left off.

## Phase 1: Determine how many Azure file shares you need

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 3: Determine how many Azure Data Box appliances you need

Start this step only after you've finished the previous phase. Your Azure storage resources (storage accounts and file shares) should be created at this time. When you order your Data Box, you need to specify the storage accounts into which the Data Box is moving data.

In this phase, you need to map the results of the migration plan from the previous phase to the limits of the available Data Box options. These considerations will help you make a plan for which Data Box options to choose and how many of them you'll need to move your NAS shares to Azure file shares.

To determine how many devices you need and their types, consider these important limits:

* Any Azure Data Box appliance can move data into up to 10 storage accounts. 
* Each Data Box option comes with its own usable capacity. See [Data Box options](#data-box-options).

Consult your migration plan to find the number of storage accounts you've decided to create and the shares in each one. Then look at the size of each of the shares on your NAS. Combining this information will allow you to optimize and decide which appliance should be sending data to which storage accounts. Two Data Box devices can move files into the same storage account, but don't split content of a single file share across two Data Boxes.

### Data Box options

For a standard migration, choose one or a combination of these Data Box options: 

* **Data Box Disk**.
  Microsoft will send you between one and five SSD disks that have a capacity of 8 TiB each, for a maximum total of 40 TiB. The usable capacity is about 20 percent less because of encryption and file-system overhead. For more information, see [Data Box Disk documentation](../../databox/data-box-disk-overview.md).
* **Data Box**.
  This option is the most common one. Microsoft will send you a ruggedized Data Box appliance that works similar to a NAS. It has a usable capacity of 80 TiB. For more information, see [Data Box documentation](../../databox/data-box-overview.md).
* **Data Box Heavy**.
  This option features a ruggedized Data Box appliance on wheels that works similar to a NAS. It has a capacity of 1 PiB. The usable capacity is about 20 percent less because of encryption and file-system overhead. For more information, see [Data Box Heavy documentation](../../databox/data-box-heavy-overview.md).

## Phase 4: Provision a suitable Windows Server instance on-premises

While you wait for your Azure Data Box devices to arrive, you can start reviewing the needs of one or more Windows Server instances you'll be using with Azure File Sync.

* Create a Windows Server 2019 instance (at a minimum, Windows Server 2012 R2) as a virtual machine or physical server. A Windows Server failover cluster is also supported.
* Provision or add Direct Attached Storage. (DAS, as opposed to NAS, which isn't supported.)

The resource configuration (compute and RAM) of the Windows Server instance you deploy depends mostly on the number of files and folders you'll be syncing. We recommend a higher performance configuration if you have any concerns.

[Learn how to size a Windows Server instance based on the number of items you need to sync.](../file-sync/file-sync-planning.md#recommended-system-resources)

> [!NOTE]
> The previously linked article includes a table with a range for server memory (RAM). You can use numbers at the lower end of the range for your server, but expect the initial sync to take significantly longer.

## Phase 5: Copy files onto your Data Box

When your Data Box arrives, you need to set it up in the line of sight to your NAS appliance. Follow the setup documentation for the type of Data Box you ordered:

* [Set up Data Box](../../databox/data-box-quickstart-portal.md).
* [Set up Data Box Disk](../../databox/data-box-disk-quickstart-portal.md).
* [Set up Data Box Heavy](../../databox/data-box-heavy-quickstart-portal.md).

Depending on the type of Data Box, Data Box copy tools might be available. At this point, we don't recommend them for migrations to Azure file shares because they don't copy your files to the Data Box with full fidelity. Use Robocopy instead.

When your Data Box arrives, it will have pre-provisioned SMB shares available for each storage account you specified when you ordered it.

* If your files go into a premium Azure file share, there will be one SMB share per premium "File storage" storage account.
* If your files go into a standard storage account, there will be three SMB shares per standard (GPv1 and GPv2) storage account. Only the file shares that end with `_AzFiles` are relevant for your migration. Ignore any block and page blob shares.

Follow the steps in the Azure Data Box documentation:

1. [Connect to Data Box](../../databox/data-box-deploy-copy-data.md).
1. Copy data to Data Box. </br>You can use Robocopy (follow instruction below) or the new [Data Box data copy service](../../databox/data-box-deploy-copy-data-via-copy-service.md).
1. [Prepare your Data Box for upload to Azure](../../databox/data-box-deploy-picked-up.md).

> [!TIP]
> As an alternative to Robocopy, Data Box has created a data copy service. You can use this service to load files onto your Data Box with full fidelity. [Follow this data copy service tutorial](../../databox/data-box-deploy-copy-data-via-copy-service.md) and make sure to set the correct Azure file share target.

Data Box documentation specifies a Robocopy command. That command isn't suitable for preserving the full file and folder fidelity. Use this command instead:

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

## Phase 6: Deploy the Azure File Sync cloud resource

Before you continue with this guide, wait until all of your files have arrived in the correct Azure file shares. The process of shipping and ingesting Data Box data will take time.

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

## Phase 7: Deploy the Azure File Sync agent

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

## Phase 8: Configure Azure File Sync on the Windows Server instance

Your registered on-premises Windows Server instance must be ready and connected to the internet for this process.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

Turn on the cloud tiering feature and select **Namespace only** in the initial download section.

> [!IMPORTANT]
> Cloud tiering is the Azure File Sync feature that allows the local server to have less storage capacity than is stored in the cloud but have the full namespace available. Locally interesting data is also cached locally for fast access performance. Cloud tiering is optional. You can set it individually for each Azure File Sync server endpoint. You need to use this feature if you don't have enough local disk capacity on the Windows Server instance to hold all cloud data and you want to avoid downloading all data from the cloud.

For all Azure file shares / server locations that you need to configure for sync, repeat the steps to create sync groups and to add the matching server folders as server endpoints. Wait until the sync of the namespace is complete. The following section will explain how you can ensure the sync is complete.

> [!NOTE]
> After you create a server endpoint, sync is working. But sync needs to enumerate (discover) the files and folders you moved via Data Box into the Azure file share. Depending on the size of the namespace, it can take a long time before the namespace from the cloud appears on the server.

## Phase 9: Wait for the namespace to fully appear on the server

Before you continue with the next steps of your migration, wait until the server has fully downloaded the namespace from the cloud share. If you start moving files onto the server too early, you risk unnecessary uploads and even file sync conflicts.

To determine if your server has completed the initial download sync, open Event Viewer on your syncing Windows Server instance and use the Azure File Sync telemetry event log.
The telemetry event log is in Event Viewer under Applications and Services\Microsoft\FileSync\Agent.

Search for the most recent 9102 event. 
Event ID 9102 is logged when a sync session completes. In the event text, there's a field for the download sync direction. (`HResult` needs to be zero, and files need to be downloaded.)
 
You want to see two consecutive events of this type, with this content, to ensure that the server has finished downloading the namespace. It's OK if there are other events between the two 9102 events.

## Phase 10: Run Robocopy from your NAS

After your server completes the initial sync of the entire namespace from the cloud share, you can continue with this step. The initial sync must be complete before you continue with this step. See the previous section for details.

In this step, you'll run Robocopy jobs to sync your cloud shares with the latest changes on your NAS that occurred since you forked your shares onto the Data Box.
This Robocopy run might finish quickly or take a while, depending on the amount of churn that happened on your NAS shares.

> [!WARNING]
> Because of regressed Robocopy behavior in Windows Server 2019, the Robocopy `/MIR` switch isn't compatible with tiered target directories. You can't use Windows Server 2019 or Windows 10 client for this phase of the migration. Use Robocopy on an intermediate Windows Server 2016 instance.

Here's the basic migration approach:
 - Run Robocopy from your NAS appliance to sync your Windows Server instance. 
 - Use Azure File Sync to sync the Azure file shares from Windows Server.

Run the first local copy to your Windows Server target folder:

1. Identify the first location on your NAS appliance.
1. Identify the matching folder on the Windows Server instance that already has Azure File Sync configured on it.
1. Start the copy by using Robocopy.

The following Robocopy command will copy only the differences (updated files and folders) from your NAS storage to your Windows Server target folder. The Windows Server instance will then sync them to the Azure file shares. 

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

If you provisioned less storage on your Windows Server instance than your files use on the NAS appliance, you've configured cloud tiering. As the local Windows Server volume becomes full, [cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md) will kick in and tier files that have already successfully synced. Cloud tiering will generate enough space to continue the copy from the NAS appliance. Cloud tiering checks once an hour to determine what has synced and to free up disk space to reach the 99 percent volume free space.

Robocopy might need to move more files than you can store locally on the Windows Server instance. You can expect Robocopy to move faster than Azure File Sync can upload your files and tier them off your local volume. In this situation, Robocopy will fail. We recommend that you work through the shares in a sequence that prevents this scenario. For example, move only shares that fit in the free space available on the Windows Server instance. Or avoid starting Robocopy jobs for all shares at the same time. The good news is that the `/MIR` switch will ensure that only deltas are moved. After a delta has been moved, a restarted job won't need to move the file again.

### Do the cutover

When you run the Robocopy command for the first time, your users and applications will still be accessing files on the NAS and potentially changing them. Robocopy will process a directory and then move on to the next one. A user on the NAS might then add, change, or delete a file on the first directory that won't be processed during the current Robocopy run. This behavior is expected.

The first run is about moving the bulk of the churned data to your Windows Server instance and into the cloud via Azure File Sync. This first copy can take a long time, depending on:

* The upload bandwidth.
* The local network speed and how optimally the number of Robocopy threads matches it.
* The number of items (files and folders) that need to be processed by Robocopy and Azure File Sync.

After the initial run is complete, run the command again.

Robocopy will finish faster the second time you run it for a share. It needs to transport only changes that happened since the last run. You can run repeated jobs for the same share.

When you consider downtime acceptable, you need to remove user access to your NAS-based shares. You can do that in any way that prevents users from changing the file and folder structure and the content. For example, you can point your DFS namespace to a location that doesn't exist or change the root ACLs on the share.

Run Robocopy one last time. It will pick up any changes that have been missed.
How long this final step takes depends on the speed of the Robocopy scan. You can estimate the time (which is equal to your downtime) by measuring the length of the previous run.

Create a share on the Windows Server folder and possibly adjust your DFS-N deployment to point to it. Be sure to set the same share-level permissions that are on your NAS SMB share. If you had an enterprise-class, domain-joined NAS, the user SIDs will automatically match because the users are in Active Directory and Robocopy copies files and metadata at full fidelity. If you have used local users on your NAS, you need to: 
- Re-create these users as Windows Server local users. 
- Map the existing SIDs that Robocopy moved over to your Windows Server instance to the SIDs of your new Windows Server local users.

You've finished migrating a share or group of shares into a common root or volume (depending on your mapping from Phase 1).

You can try to run a few of these copies in parallel. We recommend that you process the scope of one Azure file share at a time.

## Deprecated option: "offline data transfer"

Before Azure File Sync agent version 13 released, Data Box integration was accomplished through a process called "offline data transfer". This process is deprecated. With agent version 13, it was replaced with the much simpler and faster steps described in this article. If you know you want to use the deprecated "offline data transfer" functionality, you can still do so. It is still available by using a specific, [older AFS PowerShell module](https://www.powershellgallery.com/packages/Az.StorageSync/1.4.0):

```powershell
Install-Module Az.StorageSync -RequiredVersion 1.4.0
Import-module Az.StorageSync -RequiredVersion 1.4.0
# Verify the specific version is loaded:
Get-module Az.StorageSync
```
> [!WARNING]
> After May 15, 2022 you will no longer be able to create a server endpoint in the "offline data transfer" mode. Migrations in progress with this method must finish before July 15, 2022. If your migration continues to run with an "offline data transfer" enabled server endpoint, the server will begin to upload remaining files from the server on July 15, 2022 and no longer leverage files transferred with Azure Data Box to the staging share.

## Troubleshooting

The most common problem is for the Robocopy command to fail with "Volume full" on the Windows Server side. Cloud tiering acts once every hour to evacuate content from the local Windows Server disk that has synced. Its goal is to reach your 99 percent free space on the volume.

Let sync progress and cloud tiering free up disk space. You can observe that in File Explorer on your Windows Server instance.

When your Windows Server instance has enough available capacity, run the command again to resolve the problem. Nothing breaks in this situation. You can move forward with confidence. The inconvenience of running the command again is the only consequence.

To troubleshoot Azure File Sync problems, see the article listed in the next section.

## Next steps

There's more to discover about Azure file shares and Azure File Sync. The following articles will help you understand advanced options and best practices. They also provide help with troubleshooting. These articles contain links to the [Azure file share documentation](storage-files-introduction.md) where appropriate.

* [Migration overview](storage-files-migration-overview.md)
* [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
* [Create a file share](storage-how-to-create-file-share.md)
* [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json)