---
title: Best practices for disaster recovery with Azure File Sync
description: Learn about best practices for disaster recovery with Azure File Sync
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 08/11/2021
ms.author: rogarana
ms.subservice: files
---

# Best practices for disaster recovery with Azure File Sync

For Azure File Sync, there are three main areas to consider for disaster recovery: high availability, data protection/backup, and geo-redundancy. This article covers each area and helps you decide what configuration to use for your own disaster recovery solution.

In an Azure File Sync deployment, the cloud endpoint always contains a full copy of your data, while the on-premises server can be viewed as a disposable cache of your data. In the event of a server-side disaster, you can recover by provisioning a new server, installing the Azure File Sync agent on it, and setting it up as a new server endpoint.

Due to its hybrid nature, some traditional server backup and disaster recovery strategies won't work with Azure File Sync. For any registered server, Azure File Sync doesn't support:

> [!WARNING]
> Taking any of these actions may lead to issues with sync or broken tiered files that result in eventual data loss. If you have taken one of these actions, contact Azure support to ensure your deployment is healthy.

- Transferring disk drives from one server to another
- Restoring from an operating system backup
- Cloning a server's operating system to another server
- Reverting to a previous virtual machine checkpoint
- Restoring files from on-premises backup if cloud tiering is enabled


## High availability

There are two different strategies you may use to achieve high availability for your on-premises server. You can either: configure a failover cluster, or configure a standby server. The deciding factor between either configuration is how much you're willing to invest in your system and if minimizing the length of time your system is down in the case of a disaster is worth that extra cost.

For a failover cluster, you don't need to take any special steps to use Azure File Sync. For a standby server, you should make the following configurations:

Have a secondary server with different server endpoints that sync to the same sync group as your primary server but don't enable end-user access to the server. This allows all files to sync from the primary server to the standby server. You can consider enabling namespace-only tiering so that only the namespace is downloaded initially. If your primary server fails, you can use DFS-N to quickly reconfigure end-user access to your standby server.

## Data protection/backup

Protecting your actual data is a key component of a disaster recovery solution. There are two main ways to do this with your Azure file shares: you can either back up your data in the cloud, or locally. We highly recommend you backup your data in the cloud because your cloud endpoint will contain a full copy of your data, while server endpoints may only contain a subset of your data.

### Back up your data in the cloud

You should use [Azure Backup](../../backup/azure-file-share-backup-overview.md) as your cloud backup solution. Azure Backup handles backup scheduling, retention, and restores, amongst other things. If you prefer, you could manually take [share snapshots](../files/storage-snapshots-files.md?toc=/azure/storage/file-sync/toc.json) and configure your own scheduling and retention solution but, this isn't ideal. Alternatively, you can use third-party solutions to directly back up your Azure file shares.

If a disaster happens, you can restore from a share snapshot, which is a point in time, read-only copy of your file share. Since these snapshots are read-only, they won't be affected by ransomware. For large datasets, in which full share restore operations take a long time, you can enable direct user access to the snapshot so that users can copy the data they need to their local drive, while the restore completes.

Snapshots are stored directly in your Azure file share, whether you take them manually or if Azure Backup takes them for you. So you should [enable soft delete](../files/storage-files-prevent-file-share-deletion.md?toc=/azure/storage/file-sync/toc.json) to protect your snapshots against accidental deletions of your file share.

For more information, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md), or contact your backup provider to see if they support backing up Azure file shares.

### Back up your data locally

If you enable cloud tiering, don't implement an on-premises backup solution. With cloud tiering enabled, only a subset of your data will be stored locally on your server, the rest of your data is stored in your cloud endpoint. Depending on what backup solution you use for a local backup, tiered files will either be: skipped and not backed up (due to their FILE_ATTRIBUTE_RECALL_ONDATA_ACCESS attribute), they will back up only as a tiered file and may not be accessible upon restore due to changes in the live share, or they will be recalled to your disk, which will result in high egress charges.

If you decide to use an on-premises backup solution, backups should be performed on a server in the sync group with cloud tiering disabled. When performing a restore, use the volume-level or file-level restore options. Files restored using the file-level restore option will sync to all endpoints in the sync group and existing files will be replaced with the version restored from backup. Volume-level restores won't replace newer file versions in the cloud endpoint or other server endpoints.

In Azure File Sync agent version 9 and above, [Volume Shadow Copy Service (VSS) snapshots](file-sync-deployment-guide.md#self-service-restore-through-previous-versions-and-vss-volume-shadow-copy-service) (including the **Previous Versions** tab) are supported on volumes with cloud tiering enabled. This allows you to perform self-service restores instead of relying on an admin to perform restores for you. However, you must enable previous version compatibility through PowerShell, which will increase your snapshot storage costs. VSS snapshots don't protect against disasters on the server endpoint itself, so they should only be used alongside cloud-side backups. For details, see [Self Service restore through Previous Versions and VSS](file-sync-deployment-guide.md#self-service-restore-through-previous-versions-and-vss-volume-shadow-copy-service).

## Geo-redundancy

To ensure a robust disaster recovery solution, consider adding geo-redundancy components to your implementation. With Azure file shares, you have two options for this, [geo-redundant storage (GRS)](../common/storage-redundancy.md#geo-redundant-storage) and [geo-zone-redundant storage (GZRS)](../common/storage-redundancy.md#geo-zone-redundant-storage).

[Geo-redundant storage (GRS)](../common/storage-redundancy.md#geo-redundant-storage) copies your data synchronously three times within a single physical location in the primary region using LRS. It then copies your data asynchronously to a single physical location in a secondary region that is hundreds of miles away from the primary region. Geo-zone-redundant storage (GZRS) combines the high availability provided by redundancy across availability zones with protection from regional outages provided by geo-replication. Data in a GZRS storage account is copied across three [Azure availability zones](../../availability-zones/az-overview.md) in the primary region and is also replicated to a secondary geographic region for protection from regional disasters. The main differentiating factor between the two is the price, GZRS will provide more redundancy and safety for your data over GRS but, is more expensive. Neither GRS nor GZRS are compatible with file shares larger than 5-TiB.

If you enable GRS on the storage account containing your cloud endpoint, you need to enable it on your Storage Sync Service as well. This ensures all information about your Azure File Sync topology and the data contained in your cloud endpoint is asynchronously copied to the paired secondary region in the event of a disaster. If you are using GZRS on both your Storage Sync Service and your storage account, the data copy will be synchronous, so your data in the secondary location won't lag behind the primary.

The Azure File Sync service will automatically fail over to the paired region in the event of a region disaster when the Storage Sync Service is using GRS. If you are using Azure File Sync configured with GRS, there is no action required from you in the event of a disaster. Microsoft will initiate the failover for your service if the primary region is judged to be permanently unrecoverable or unavailable for a long time.

Although you can manually request a failover of your Storage Sync Service to your GRS paired region, we don't recommend doing this outside of large-scale regional outages since the process isn't seamless and may incur extra cost. To initiate the process, open a support ticket and request that both your Azure storage accounts that contain your Azure file share and your Storage Sync Service be failed over.

> [!WARNING]
> You must contact support to request your Storage Sync Service be failed over if you are initiating this process manually. If you attempt to create a new Storage Sync Service using the same server endpoints in the secondary region may result in extra data staying in your storage account since the previous installation of Azure File Sync won't be cleaned up.

Once a failover occurs, server endpoints will switch over to sync with the cloud endpoint in the secondary region automatically. However, the server endpoints must reconcile with the cloud endpoints. This may result in file conflicts as the data in the secondary region may not be caught up to the primary.