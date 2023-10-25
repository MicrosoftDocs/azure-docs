---
title: Best practices for disaster recovery with Azure File Sync
description: Learn about best practices for disaster recovery with Azure File Sync, including high availability, data protection, and data redundancy.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/18/2023
ms.author: kendownie
---

# Best practices for disaster recovery with Azure File Sync

For Azure File Sync, there are three main areas to consider for disaster recovery: high availability, data protection/backup, and data redundancy. This article covers each area and helps you decide what configuration to use for your own disaster recovery solution.

In an Azure File Sync deployment, the cloud endpoint always contains a full copy of your data, while the on-premises server can be viewed as a disposable cache of your data. In the event of a server-side disaster, you can recover by provisioning a new server, installing the Azure File Sync agent on it, and setting it up as a new server endpoint.

Due to its hybrid nature, some traditional server backup and disaster recovery strategies won't work with Azure File Sync. For any registered server, Azure File Sync doesn't support:

> [!WARNING]
> Taking any of these actions may lead to issues with sync or broken tiered files that result in eventual data loss. If you've taken one of these actions, contact Azure support to ensure your deployment is healthy.

- Transferring/cloning disk drives (volume) from one server to another while the server endpoint is still active
- Restoring from an operating system backup
- Cloning a server's operating system to another server
- Reverting to a previous virtual machine checkpoint
- Restoring tiered files from on-premises (third party) backup to the server endpoint

## High availability

There are two different strategies you can use to achieve high availability for your on-premises server. You can either configure a failover cluster, or configure a standby server. The deciding factor between either configuration is how much you're willing to invest in your system, and if minimizing the length of time your system is down in the case of a disaster is worth that extra cost.

For a failover cluster, you don't need to take any special steps to use Azure File Sync. For a standby server, you should make the following configurations:

Have a secondary server with different server endpoints that sync to the same sync group as your primary server but don't enable end-user access to the server. This allows all files to sync from the primary server to the standby server. You can consider enabling namespace-only tiering so that only the namespace is downloaded initially. If your primary server fails, you can use DFS-N to quickly reconfigure end-user access to your standby server.

## Data protection/backup

Protecting your actual data is a key component of a disaster recovery solution. There are two main ways to do this with your Azure file shares: you can either back up your data in the cloud or on-premises. We highly recommend you back up your data in the cloud because your cloud endpoint will contain a full copy of your data, while server endpoints might only contain a subset of your data.

### Back up your data in the cloud

You should use [Azure Backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/file-sync/toc.json) as your cloud backup solution. Azure Backup handles backup scheduling, retention, and restores, amongst other things. If you prefer, you could manually take [share snapshots](../files/storage-snapshots-files.md?toc=/azure/storage/file-sync/toc.json) and configure your own scheduling and retention solution, but this isn't ideal. Alternatively, you can use third-party solutions to directly back up your Azure file shares.

If a disaster happens, you can restore from a share snapshot, which is a point in time, read-only copy of your file share. Because these snapshots are read-only, they won't be affected by ransomware. For large datasets in which full share restore operations take a long time, you can enable direct user access to the snapshot so that users can copy the data they need to their local drive while the restore completes.

Snapshots are stored directly in your Azure file share, no matter whether you take them manually or if Azure Backup takes them for you. So you should [enable soft delete](../files/storage-files-prevent-file-share-deletion.md?toc=/azure/storage/file-sync/toc.json) to protect your snapshots against accidental deletion of your file share.

For more information, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md), or contact your backup provider to see if they support backing up Azure file shares.

### Back up your data on-premises

If you enable cloud tiering, don't implement an on-premises backup solution. With cloud tiering enabled, only a subset of your data will be stored locally on your server, the rest of your data is stored in your cloud endpoint. Depending on what backup solution you use for a local backup, tiered files will either be:

- skipped and not backed up (due to their `FILE_ATTRIBUTE_RECALL_ONDATA_ACCESS` attribute), or
- they will be backed up only as a tiered file and might not be accessible upon restore due to changes in the live share, or
- they will be recalled to your disk, which will result in high egress charges.

If you decide to use an on-premises backup solution, you should perform backups on a server in the sync group with cloud tiering disabled. When performing a restore, use the volume-level or file-level restore options. Files restored using the file-level restore option will sync to all endpoints in the sync group and existing files will be replaced with the version restored from backup. Volume-level restores won't replace newer file versions in the cloud endpoint or other server endpoints.

[Volume Shadow Copy Service (VSS) snapshots](file-sync-deployment-guide.md#optional-self-service-restore-through-previous-versions-and-vss-volume-shadow-copy-service) (including the **Previous Versions** tab) are supported on volumes with cloud tiering enabled. This allows you to perform self-service restores instead of relying on an admin to perform restores for you. However, you must enable previous version compatibility through PowerShell, which will increase your snapshot storage costs. VSS snapshots don't protect against disasters on the server endpoint itself, so they should only be used alongside cloud-side backups. For details, see [Self Service restore through Previous Versions and VSS](file-sync-deployment-guide.md#optional-self-service-restore-through-previous-versions-and-vss-volume-shadow-copy-service).

## Data redundancy

To ensure a robust disaster recovery solution, add some form of data redundancy to your infrastructure. There are four redundancy offerings for Azure Files: [Locally-redundant storage (LRS)](../files/files-redundancy.md#locally-redundant-storage), [zone-redundant storage (ZRS)](../files/files-redundancy.md#zone-redundant-storage), [geo-redundant storage (GRS)](../files/files-redundancy.md#geo-redundant-storage), and [geo-zone-redundant storage (GZRS)](../files/files-redundancy.md#geo-zone-redundant-storage).

- [Locally-redundant storage (LRS)](../files/files-redundancy.md#locally-redundant-storage): With LRS, every file is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs within the data center, all replicas of a storage account using LRS may be lost or unrecoverable.
- [Zone-redundant storage (ZRS)](../files/files-redundancy.md#zone-redundant-storage): With ZRS, three copies of each file stored, however these copies are physically isolated in three distinct storage clusters in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. A write to storage is not accepted until it is written to the storage clusters in all three availability zones.
- [Geo-redundant storage (GRS)](../files/files-redundancy.md#geo-redundant-storage): With GRS, you have two regions, a primary and secondary region. Files are stored three times within an Azure storage cluster in the primary region. Writes are asynchronously replicated to a Microsoft-defined secondary region. GRS provides six copies of your data spread between two Azure regions.
- [Geo-zone-redundant storage (GZRS)](../files/files-redundancy.md#geo-zone-redundant-storage): You can think of GZRS as if it were like ZRS but with geo-redundancy. With GZRS, files are stored three times across three distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region.

For a robust disaster recovery solution, most customers should consider ZRS. ZRS adds the least amount of extra cost for its added data redundancy benefits and is also the most seamless in the event of an outage. If your organization's policy or regulatory requirements require geo-redundancy for your data, consider either GRS or GZRS.

### Geo-redundancy

If your storage account is configured with either GRS or GZRS replication, Microsoft will initiate the failover of the Storage Sync Service if the primary region is judged to be permanently unrecoverable or unavailable for a long time. No action is required from you in the event of a disaster.

Although you can manually request a failover of your Storage Sync Service to your GRS or GZRS paired region, we don't recommend doing this outside of large-scale regional outages because the process isn't seamless and might incur extra cost. To initiate the process, open a support ticket and request that both your Azure storage accounts that contain your Azure file share and your Storage Sync Service be failed over.

> [!WARNING]
> You must contact support to request your Storage Sync Service be failed over if you are initiating this process manually. Attempting to create a new Storage Sync Service using the same server endpoints in the secondary region might result in extra data staying in your storage account because the previous installation of Azure File Sync won't be cleaned up.

Once a failover occurs, server endpoints will switch over to sync with the cloud endpoint in the secondary region automatically. However, the server endpoints must reconcile with the cloud endpoints. This might result in file conflicts, as the data in the secondary region might not be caught up to the primary.

## Next steps

[Learn about Azure file share backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/file-sync/toc.json)
