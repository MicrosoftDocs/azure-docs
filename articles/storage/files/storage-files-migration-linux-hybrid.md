---
title: Linux migration to Azure File Sync
description: Learn how to migrate files from a Linux server location to a hybrid cloud deployment with Azure File Sync and Azure file shares.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 03/19/2020
ms.author: fauhse
ms.subservice: files
---

# Migrate from Linux to a hybrid cloud deployment with Azure File Sync

Azure File Sync works on Windows Server instances with direct attached storage (DAS). It does not support sync to and from Linux or a remote Server Message Block (SMB) share.

As a result, transforming your file services into a hybrid deployment makes a migration to Windows Server necessary. This article guides you through the planning and execution of such a migration.

## Migration goals

The goal is to move the shares that you have on your Linux Samba server to a Windows Server instance. Then use Azure File Sync for a hybrid cloud deployment. This migration needs to be done in a way that guarantees the integrity of the production data as well as availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## Migration overview

As mentioned in the Azure Files [migration overview article](storage-files-migration-overview.md), using the correct copy tool and approach is important. Your Linux Samba server is exposing SMB shares directly on your local network. Robocopy, built into Windows Server, is the best way to move your files in this migration scenario.

If you're not running Samba on your Linux server and rather want to migrate folders to a hybrid deployment on Windows Server, you can use Linux copy tools instead of Robocopy. If you do, be aware of the fidelity capabilities in your file copy tool. Review the [migration basics section](storage-files-migration-overview.md#migration-basics) in the migration overview article to learn what to look for in a copy tool.

## Phase 1: Identify how many Azure file shares you need

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Provision a suitable Windows Server instance on-premises

* Create a Windows Server 2019 instance as a virtual machine or physical server. Windows Server 2012 R2 is the minimum requirement. A Windows Server failover cluster is also supported.
* Provision or add direct attached storage (DAS). Network attached storage (NAS) is not supported.

  The amount of storage that you provision can be smaller than what you're currently using on your Linux Samba server, if you use the Azure File Sync [cloud tiering](storage-sync-cloud-tiering.md) feature. However, when you copy your files from the larger Linux Samba server space to the smaller Windows Server volume in a later phase, you'll need to work in batches:

  1. Move a set of files that fits onto the disk.
  2. Let file sync and cloud tiering engage.
  3. When more free space is created on the volume, proceed with the next batch of files. 
    
  You can avoid this batching approach by provisioning the equivalent space on the Windows Server instance that your files occupy on the Linux Samba server. Consider enabling deduplication on Windows. If you don't want to permanently commit this high amount of storage to your Windows Server instance, you can reduce the volume size after the migration and before adjusting the cloud tiering policies. That creates a smaller on-premises cache of your Azure file shares.

The resource configuration (compute and RAM) of the Windows Server instance that you deploy depends mostly on the number of items (files and folders) you'll be syncing. We recommend going with a higher-performance configuration if you have any concerns.

[Learn how to size a Windows Server instance based on the number of items (files and folders) you need to sync.](storage-sync-files-planning.md#recommended-system-resources)

> [!NOTE]
> The previously linked article presents a table with a range for server memory (RAM). You can orient toward the smaller number for your server, but expect that initial sync can take significantly more time.

## Phase 3: Deploy the Azure File Sync cloud resource

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

## Phase 4: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 5: Deploy the Azure File Sync agent

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

## Phase 6: Configure Azure File Sync on the Windows Server deployment

Your registered on-premises Windows Server instance must be ready and connected to the internet for this process.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

> [!IMPORTANT]
> Cloud tiering is the Azure File Sync feature that allows the local server to have less storage capacity than is stored in the cloud, yet have the full namespace available. Locally interesting data is also cached locally for fast access performance. Cloud tiering is an optional feature for each Azure File Sync server endpoint.

> [!WARNING]
> If you provisioned less storage on your Windows Server volumes than your data used on the Linux Samba server, then cloud tiering is mandatory. If you don't turn on cloud tiering, your server will not free up space to store all files. Set your tiering policy, temporarily for the migration, to 99 percent free space for a volume. Be sure to return to your cloud tiering settings after the migration is complete, and set the policy to a more useful level for the long term.

Repeat the steps of sync group creation and the addition of the matching server folder as a server endpoint for all Azure file shares and server locations that need to be configured for sync.

After the creation of all server endpoints, sync is working. You can create a test file and see it sync up from your server location to the connected Azure file share (as described by the cloud endpoint in the sync group).

Both locations, the server folders and the Azure file shares, are otherwise empty and awaiting data. In the next step, you'll begin to copy files into the Windows Server instance for Azure File Sync to move them up to the cloud. If you've enabled cloud tiering, the server will then begin to tier files if you run out of capacity on the local volumes.

## Phase 7: Robocopy

The basic migration approach is to use Robocopy to copy files and use Azure File Sync to do the syncing.

Run the first local copy to your Windows Server target folder:

1. Identify the first location on your Linux Samba server.
1. Identify the matching folder on the Windows Server instance that already has Azure File Sync configured on it.
1. Start the copy by using Robocopy.

The following Robocopy command will copy files from your Linux Samba server's storage to your Windows Server target folder. Windows Server will sync it to the Azure file shares. 

If you provisioned less storage on your Windows Server instance than your files take up on the Linux Samba server, then you have configured cloud tiering. As the local Windows Server volume gets full, [cloud tiering](storage-sync-cloud-tiering.md) will start and tier files that have successfully synced already. Cloud tiering will generate enough space to continue the copy from the Linux Samba server. Cloud tiering checks once an hour to see what has synced and to free up disk space to reach the policy of 99 percent free space for a volume.

It's possible that Robocopy moves files faster than you can sync to the cloud and tier locally, causing you to run out of local disk space. Robocopy will then fail. We recommend that you work through the shares in a sequence that prevents the problem. For example, consider not starting Robocopy jobs for all shares at the same time. Or consider moving shares that fit on the current amount of free space on the Windows Server instance. If your Robocopy job does fail, you can always re-run the command as long as you use the following mirror/purge option:

```console
Robocopy /MT:32 /UNILOG:<file name> /TEE /B /MIR /COPYALL /DCOPY:DAT <SourcePath> <Dest.Path>
```

Background:

:::row:::
   :::column span="1":::
      /MT
   :::column-end:::
   :::column span="1":::
      Allows for Robocopy to run multi-threaded. Default is 8, maximum is 128.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /UNILOG:\<file name\>
   :::column-end:::
   :::column span="1":::
      Outputs status to a log file as Unicode (overwrites the existing log).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /TEE
   :::column-end:::
   :::column span="1":::
      Outputs to a console window. Used in conjunction with output to a log file.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /B
   :::column-end:::
   :::column span="1":::
      Runs Robocopy in the same mode that a backup application would use. It allows Robocopy to move files that the current user does not have permissions to.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /MIR
   :::column-end:::
   :::column span="1":::
      Allows running this Robocopy command several times, sequentially, on the same target/destination. It identifies and omits what has been copied before. Only changes, additions, and deletions that occurred since the last run are processed. If the command wasn't run before, nothing is omitted. The **/MIR** flag is an excellent option for source locations that are still actively used and changing.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /COPY:copyflag[s]
   :::column-end:::
   :::column span="1":::
      Fidelity of the file copy (default is /COPY:DAT). Copy flags are: D=data, A=attributes, T=timestamps, S=security=NTFS ACLs, O=owner info, U=auditing info.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /COPYALL
   :::column-end:::
   :::column span="1":::
      COPY ALL file info (equivalent to /COPY:DATSOU).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="1":::
      /DCOPY:copyflag[s]
   :::column-end:::
   :::column span="1":::
      Fidelity for the copy of directories (default is /DCOPY:DA). Copy flags are: D=data, A=attributes, T=timestamps.
   :::column-end:::
:::row-end:::

## Phase 8: User cut-over

When you run the Robocopy command for the first time, your users and applications are still accessing files on the Linux Samba server and potentially changing them. It's possible that Robocopy has processed a directory and moves on to the next, and then a user in the source location (Linux) adds, changes, or deletes a file that now won't be processed in this current Robocopy run. This behavior is expected.

The first run is about moving the bulk of the data to your Windows Server instance and into the cloud via Azure File Sync. This first copy can take a long time, depending on:

* Your download bandwidth.
* The upload bandwidth.
* The local network speed, and the number of how optimally the number of Robocopy threads matches it.
* The number of items (files and folders) that Robocopy and Azure File Sync need to process.

After the initial run is complete, run the command again.

It finishes faster the second time, because it needs to transport only changes that happened since the last run. During this second, run new changes can still accumulate.

Repeat this process until you're satisfied that the amount of time it takes to complete a Robocopy operation for a specific location is within an acceptable window for downtime.

When you consider the downtime acceptable and you're prepared to take the Linux location offline, you can change ACLs on the share root such that users can no longer access the location. Or you can take any other appropriate step that prevents content from changing in this folder on your Linux server.

Run one last Robocopy round. It will pick up any changes that might have been missed. How long this final step takes depends on the speed of the Robocopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

Create a share on the Windows Server folder and possibly adjust your DFS-N deployment to point to it. Be sure to set the same share-level permissions as on your Linux Samba server SMB shares. If you have used local users on your Linux Samba server, you need to re-create these users as Windows Server local users. You also need to map the existing SIDs that Robocopy moved over to your Windows Server instance to the SIDs of your new Windows Server local users. If you used Active Directory accounts and ACLs, Robocopy will move them as is, and no further action is necessary.

You have finished migrating a share or a group of shares into a common root or volume (depending on your mapping from Phase 1).

You can try to run a few of these copies in parallel. We recommend processing the scope of one Azure file share at a time.

> [!WARNING]
> After you've moved all the data from your Linux Samba server to the Windows Server instance, and your migration is complete, return to *all*  sync groups in the Azure portal. Adjust the percentage of free space for cloud tiering volume to something better suited for cache utilization, such as 20 percent. 

The policy for free space in cloud tiering volume acts on a volume level with potentially multiple server endpoints syncing from it. If you forget to adjust the free space on even one server endpoint, sync will continue to apply the most restrictive rule and attempt to keep free disk space at 99 percent. The local cache then might not perform as you expect. The performance might be acceptable if your goal is to have the namespace for a volume that contains only rarely accessed archival data, and you're reserving the rest of the storage space for another scenario.

## Troubleshoot

The most common problem is that the Robocopy command fails with **Volume full** on the Windows Server side. Cloud tiering acts once every hour to evacuate content from the local Windows Server disk that has synced. Its goal is to reach free space of 99 percent on the volume.

Let sync progress and cloud tiering free up disk space. You can observe that in File Explorer on Windows Server.

When your Windows Server instance has enough available capacity, rerunning the command will resolve the problem. Nothing breaks when you get into this situation, and you can move forward with confidence. The inconvenience of running the command again is the only consequence.

Check the link in the following section for troubleshooting Azure File Sync problems.

## Next steps

There's more to discover about Azure file shares and Azure File Sync. The following articles contain advanced options, best practices, and troubleshooting help. These articles link to [Azure file share documentation](storage-files-introduction.md) as appropriate.

* [Azure File Sync overview](https://aka.ms/AFS)
* [Azure File Sync deployment guide](storage-files-deployment-guide.md)
* [Azure File Sync troubleshooting](storage-sync-files-troubleshoot.md)
