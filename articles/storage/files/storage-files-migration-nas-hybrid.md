---
title: On-premises NAS migration to Azure File Sync
description: Learn how to migrate SMB file shares from on-premises Network Attached Storage (NAS) to a hybrid cloud deployment with Azure File Sync and Azure file shares.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 01/25/2024
ms.author: kendownie
# Customer intent: As a systems administrator, I want to migrate SMB file shares from on-premises NAS to a Windows Server using Azure File Sync, so that I can enable a hybrid cloud deployment while ensuring data integrity and minimizing downtime during the process.
---

# Migrate from Network Attached Storage (NAS) to a hybrid cloud deployment with Azure File Sync

:heavy_check_mark: **Applies to:** Classic SMB file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** All NFS file shares including file shares created with the Microsoft.FileShares resource provider or classic file shares created with the Microsoft.Storage resource provider

This migration article is one of several involving NAS and Azure File Sync. Check if this article applies to your scenario:

> [!div class="checklist"]
> * Data source: Network Attached Storage (NAS)
> * Migration route: NAS &rArr; Windows Server &rArr; upload and sync with Azure file share(s)
> * Caching files on-premises: Yes, the final goal is an Azure File Sync deployment.

If your scenario is different, look through the [table of migration guides](storage-files-migration-overview.md#migration-guides).

Azure File Sync works on Direct Attached Storage (DAS) locations and doesn't support sync to Network Attached Storage (NAS) locations. This fact makes a migration of your files necessary, and this article guides you through such a migration.

## NAS to Azure File Sync migration goals

The goal is to move the SMB file shares on your NAS appliance to a Windows Server, then use Azure File Sync for a hybrid cloud deployment. Generally, you need to migrate in a way that guarantees the integrity of the production data and its availability during the migration. The latter requirement means keeping downtime to a minimum, so that it fits into or only slightly exceeds regular maintenance windows.

## Migration overview

As mentioned in [Migrate to SMB Azure file shares](storage-files-migration-overview.md), using the correct copy tool and approach is important. Your NAS appliance is exposing SMB shares directly on your local network. You can either use Azure Storage Mover or RoboCopy to move your files.

- Phase 1: [Identify how many Azure file shares you need](#phase-1-identify-how-many-azure-file-shares-you-need)
- Phase 2: [Provision a suitable Windows Server on-premises](#phase-2-provision-a-suitable-windows-server-on-premises)
- Phase 3: [Deploy the Azure File Sync cloud resource](#phase-3-deploy-the-azure-file-sync-cloud-resource)
- Phase 4: [Deploy Azure storage resources](#phase-4-deploy-azure-storage-resources)
- Phase 5: [Deploy the Azure File Sync agent](#phase-5-deploy-the-azure-file-sync-agent)
- Phase 6: [Configure Azure File Sync on the Windows Server](#phase-6-configure-azure-file-sync-on-the-windows-server)
- Phase 7: [Copy data using Azure Storage Mover or RoboCopy](#phase-7-copy-data-using-azure-storage-mover-or-robocopy)
- Phase 8: [User cut-over](#phase-8-user-cut-over)

## Phase 1: Identify how many Azure file shares you need

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Provision a suitable Windows Server on-premises

* Create a Windows Server virtual machine, or deploy a physical server. A Windows Server failover cluster is also supported.
* Provision or add Direct Attached Storage (DAS as compared to NAS, which isn't supported).

    The amount of storage you provision can be smaller than what you're currently using on your NAS appliance. This configuration choice requires that you also make use of Azure File Sync's [cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md) feature.
    However, when you copy your files from the larger NAS space to the smaller Windows Server volume in a later phase, you'll need to work in batches:

    1. Move a set of files that fits onto the disk
    2. Let file sync and cloud tiering engage
    3. When more free space is created on the volume, proceed with the next batch of files. Alternatively, review the RoboCopy command in the [RoboCopy section](#phase-7-copy-data-using-azure-storage-mover-or-robocopy) of this article for use of the new `/LFSM` switch. Using `/LFSM` can significantly simplify your RoboCopy jobs, but it isn't compatible with some other RoboCopy switches you might depend on. Only use the `/LFSM` switch when the migration destination is local storage. It's not supported when the destination is a remote SMB share.
    
    You can avoid this batching approach by provisioning the equivalent space on the Windows Server that your files occupy on the NAS appliance. Consider deduplication on NAS / Windows. If you don't want to permanently commit this high amount of storage to your Windows Server, you can reduce the volume size after the migration and before you adjust the cloud tiering policies. That creates a smaller on-premises cache of your Azure file shares.

The resource configuration (compute and RAM) of the Windows Server you deploy depends mostly on the number of items (files and folders) you're syncing. Use a higher performance configuration if you have any concerns.

[Learn how to size a Windows Server based on the number of items (files and folders) you need to sync.](../file-sync/file-sync-planning.md#recommended-system-resources)

> [!NOTE]
> The previously linked article presents a table with a range for server memory (RAM). You can orient towards the smaller number for your server but expect that initial sync can take significantly more time.

## Phase 3: Deploy the Azure File Sync cloud resource

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

## Phase 4: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 5: Deploy the Azure File Sync agent

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

## Phase 6: Configure Azure File Sync on the Windows Server

Your registered on-premises Windows Server must be ready and connected to the internet for this process.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

> [!IMPORTANT]
> Cloud tiering is the Azure File Sync feature that allows the local server to have less storage capacity than is stored in the cloud, yet have the full namespace available. Locally interesting (hot) data is also cached locally for fast access performance. Cloud tiering is an optional feature per Azure File Sync server endpoint.

> [!WARNING]
> If you provisioned less storage on your Windows server volume(s) than your data used on the NAS appliance, then cloud tiering is mandatory. If you don't turn on cloud tiering, your server won't free up space to store all files. Set your tiering policy, temporarily for the migration, to 99% volume free space. Be sure to return to your cloud tiering settings after the migration is complete, and set it to a more long-term useful level.

Repeat the steps of sync group creation and addition of the matching server folder as a server endpoint for all Azure file shares and server locations that need to be configured for sync.

After the creation of all server endpoints, sync is working. You can create a test file and see it sync up from your server location to the connected Azure file share (as described by the cloud endpoint in the sync group).

Both locations, the server folders and the Azure file shares, are otherwise empty and awaiting data in either location. In the next step, you begin to copy files into the Windows Server for Azure File Sync to move them up to the cloud. If you enable cloud tiering, the server then begins to tier files if you run out of capacity on the local volumes.

## Phase 7: Copy data using Azure Storage Mover or RoboCopy

Now you can use Azure Storage Mover or RoboCopy to copy data from your NAS appliance to your Windows Server, and use Azure File Sync to move the data to Azure file shares. This guide uses RoboCopy for the initial copy. To use Azure Storage Mover instead, see [Migrate to Azure file shares using Azure Storage Mover](migrate-files-storage-mover.md).

Run the first local copy to your Windows Server target folder:

* Identify the first location on your NAS appliance.
* Identify the matching folder on the Windows Server that already has Azure File Sync configured on it.
* Start the copy.

The following RoboCopy command copies files from your NAS storage to your Windows Server target folder. The Windows Server syncs it to the Azure file shares. 

If you provision less storage on your Windows Server than your files take up on the NAS appliance, you configure cloud tiering. As the local Windows Server volume gets full, [cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md) engages and tiers files that are already synced. Cloud tiering generates enough space to continue the copy from the NAS appliance. Cloud tiering checks once an hour to see what is synced and to free up disk space to reach the 99% volume free space.

It's possible that RoboCopy moves files faster than you can sync to the cloud and tier locally, thus running out of local disk space. In this case, RoboCopy fails. Work through the shares in a sequence that prevents this (for example, don't start copy jobs for all shares at the same time, or only move shares that fit on the current amount of free space on the Windows Server).

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

## Phase 8: User cut-over

When you run the RoboCopy command for the first time, your users and applications are still accessing files on the NAS and can potentially change them. It's possible that RoboCopy has processed a directory, moves on to the next, and then a user on the source location (NAS) adds, changes, or deletes a file that will now not be processed in this current RoboCopy run. This behavior is expected.

The first run is about moving the bulk of the data to your Windows Server and into the cloud via Azure File Sync. This first copy can take a long time, depending on:

* your download bandwidth
* the upload bandwidth
* the local network speed and how optimally the number of RoboCopy threads matches it
* the number of items (files and folders) that need to be processed by RoboCopy and Azure File Sync

After the initial run completes, run the command again.

The second time it will finish faster, because it only needs to transport changes that happened since the last run. During this second run, new changes can still accumulate.

Repeat this process until the amount of time it takes to complete a RoboCopy for a specific location is within your acceptable window for downtime.

Next, remove user access to your NAS-based shares. You can do that by any steps that prevent users from changing the file and folder structure and content. An example is to point your DFS-Namespace to a non-existing location, or change the root ACLs on the share.

Run one last RoboCopy round. It picks up any changes that might have been missed. How long this final step takes depends on the speed of the RoboCopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

Create a share on the Windows Server folder. If needed, adjust your DFS-N deployment to point to it. Set the same share-level permissions as on your NAS SMB share. If your NAS was domain-joined, user SIDs automatically match because the users exist in Active Directory and RoboCopy preserves files and metadata at full fidelity. If your NAS used local users instead, re-create those users as Windows Server local users, then map the original SIDs (which RoboCopy preserved) to the new users' SIDs on Windows Server.

You finish migrating a share or group of shares into a common root or volume, depending on your mapping from Phase 1.

You can try to run a few of these copies in parallel. Process one Azure file share at a time.

> [!WARNING]
> After you move all the data from your NAS to the Windows Server and your migration is complete: Return to ***all***  sync groups in the Azure portal, and adjust the cloud tiering volume free space percent value to something better suited for cache utilization, such as 20%.

The cloud tiering volume free space policy applies at the volume level, even when multiple server endpoints share the same volume. If you adjust the policy on only some endpoints and leave others at 99%, sync uses the most restrictive rule and keeps 99% free space, making the local cache ineffective. Adjust all server endpoints on the volume, unless your goal is purely archival access (namespace only with no local caching).

## Troubleshoot common migration issues

The most likely issue you can run into is that the RoboCopy command fails with *"Volume full"* on the Windows Server side. Cloud tiering acts once every hour to evacuate content from the local Windows Server disk that has synced. Its goal is to reach your 99% free space on the volume.

Let sync progress and cloud tiering free up disk space. You can observe that in File Explorer on your Windows Server.

When your Windows Server has sufficient available capacity, rerunning the command will resolve the problem. Nothing breaks when you get into this situation, and you can move forward with confidence. Inconvenience of running the command again is the only consequence.

Check the link in the following section for troubleshooting Azure File Sync issues.

## Next steps

The following articles will help you understand deployment options, best practices, and troubleshooting steps.

* [Azure File Sync overview](../file-sync/file-sync-introduction.md)
* [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md)
* [Azure File Sync troubleshooting](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json)
