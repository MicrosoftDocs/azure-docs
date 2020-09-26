---
title: StorSimple 8000 series migration to Azure File Sync
description: Learn how to migrate a StorSimple 8100 or 8600 appliance to Azure File Sync.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 09/25/2020
ms.author: fauhse
ms.subservice: files
---

# StorSimple 8100 and 8600 migration to Azure File Sync

The StorSimple 8000 series is represented by either the 8100 or the 8600 physical, on-premises appliances, and their cloud service components. It is possible to migrate the data from either of these appliances to an Azure File Sync environment. Azure File Sync is the default and strategic long-term Azure service that StorSimple appliances can be migrated to.

StorSimple 8000 series will reach its [end-of-life](https://support.microsoft.com/en-us/lifecycle/search?alpha=StorSimple%208000%20Series) in December 2022. It is important to begin planning your migration as soon as possible. This article provides the necessary background knowledge and migrations steps for a successful migration to Azure File Sync. 

## Migration overview

:::row:::
    :::column:::
        [![Interview and demo introducing Azure File Sync - click to play!](./media/storage-sync-files-planning/azure-file-sync-interview-video-snapshot.png)](https://www.youtube.com/watch?v=nfWLO7F52-s)
    :::column-end:::
    :::column:::
        The video shows how you can migrate in 5 simple steps.
        The following article covers the details and best practices in each of these phases to make your migration a success.
        
        1. Preparing your migration
        1. Deploying Azure resources
        1. Create a migration job
        1. Deploy Azure File Sync
        1. User cut-over
   :::column-end:::
:::row-end:::

## Phase 1: Preparing your migration

This section contains the steps you should take at the beginning of your migration from StorSimple volumes to Azure file shares with or without using Azure File Sync for on-premises file caching.

### Inventory
When you begin your migration plan, it's often best to start with taking an inventory of how many StorSimple appliances and volumes you have, that need to be migrated. 
Then you can identify the right migration path:
* StorSimple physical appliances (8000 series) use this migration guide. 
* Virtual appliances, [StorSimple 1200 series, use a different migration guide](storage-files-migration-storsimple-1200.md).

### Direct share access vs. Azure File Sync
Azure file shares open up a whole new world of opportunities for structuring your file services deployment. An Azure file share is just an SMB share in the cloud, that you can setup to have users access directly over the SMB protocol with the familiar Kerberos authentication and existing NTFS permissions (file and folder ACLs) working natively. [Learn more about identity based access to Azure file shares](storage-files-active-directory-overview.md).

An alternative to direct access is a direct replacement of the StorSimple capability to cache the frequently used files on-premises. [Azure File Sync](https://aka.ms/AFS) is the solution that allows you to sync and cache files from an Azure file share on your on-site Windows Server. 

Azure File Sync is a Microsoft cloud service, based on two main components:

* File synchronization and cloud tiering.
* File shares as native storage in Azure, that can be accessed over multiple protocols like SMB and file REST. An Azure file share is comparable to a file share on a Windows Server, that you can natively mount as a network drive. It supports important file fidelity aspects like attributes, permissions, and timestamps. With Azure file shares, there is no longer a need for an application or service to interpret the files and folders stored in the cloud. You can access them natively over familiar protocols and clients like Windows File Explorer. That makes Azure file shares the ideal, and most flexible approach to store general purpose file server data as well as some application data, in the cloud.

This article focuses on the migration steps. If before migrating you'd like to learn more about Azure File Sync, we recommend the following articles:

* [Azure File Sync - overview](https://aka.ms/AFS "Overview")
* [Azure File Sync - deployment guide](storage-sync-files-deployment-guide.md)

### StorSimple Service Data Encryption Key
When you first set up StorSimple, the appliance generated and shared with you a "Service Data Encryption Key" (SDEK) and instructed you to securely store this key.
It is used to encrypt all data in the associated Azure storage account, that the StorSimple appliance stores your files in.

This is a good opportunity to retrieve this key from your records, for all the appliances in the inventory.

If you cannot find the key(s) in your records, you can retrieve the key from the appliance. Each appliance has a unique encryption key.

* File a support request with Microsoft Azure through the Azure portal. The content of the request should have the StorSimple device serial numbers and the request to retrieve the "Service Data Encryption Key". 
* A StorSimple support engineer will contact you with a request for a screen sharing meeting.
* Ensure that before the meeting begins, you connect to your StorSimple appliance [via a serial console](../../storsimple/storsimple-8000-windows-powershell-administration.md#connect-to-windows-powershell-for-storsimple-via-the-device-serial-console) or through a [remote PowerShell session](../../storsimple/storsimple-8000-windows-powershell-administration.md#connect-remotely-to-storsimple-using-windows-powershell-for-storsimple). 

> [!CAUTION]
> When you are deciding how to connect to Windows PowerShell for StorSimple, consider the following:
> * Connecting through an HTTPS session is the most secure and recommended option.
> * Connecting directly to the device serial console is secure, but connecting to the serial console over network switches is not. 
> * HTTP session connections are an option but are **not encrypted** and therefore also not recommended unless used within in a closed, trusted network.

### StorSimple volume backups
StorSimple offers differential backups on the volume level. Azure file shares also have this ability, called share snapshots.

Decide if as part of your migration, you also have an obligation to move any backups.

> [!CAUTION]
> If you must migrate backups from StorSimple volumes, **STOP HERE**.
>
> This migration approach relies on new data transformation service capabilities that currently cannot migrate backups. Support for backup migration will arrive at the end of 2020.
> You can currently only migrate your live data. If you start now, you cannot "bolt-on" your backups later.
> Backups must be "played back" to the Azure file shares from oldest to newest to live data, with Azure file share snapshots in between.

If you want to only migrate the live data and have no requirements for backups, you can continue following this guide.

### Map your existing StorSimple volumes to Azure file shares
[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

### Phase 1 summary
At the end of Phase 1:
* You have a good overview of your StorSimple devices and volumes.
* You are ready to access your data in the cloud directly, by having retrieved your Service Data Encryption key for each StorSimple device.
* You have a plan for not only which volumes need to be migrated, but also how to map your volumes to the appropriate number of Azure file shares and storage accounts.

> [!CAUTION]
> If you must migrate backups from StorSimple volumes, **STOP HERE**.
>
> This migration approach relies on new data transformation service capabilities that currently cannot migrate backups. Support for backup migration will arrive at the end of 2020.
> You can currently only migrate your live data. If you start now, you cannot "bolt-on" your backups later.
> Backups must be "played back" to the Azure file shares from oldest to newest to live data, with Azure file share snapshots in between.

If you want to only migrate the live data and have no requirements for backups, you can continue following this guide.

## Phase 2: Deploying Azure resources

This section discusses considerations around deploying the different resource types that are needed in Azure. Some will hold your data post migration and some are needed solely for the migration. Start deploying resources only, when you know your plan is final - it is often hard or impossible to change certain aspects of your Azure resources later on.

### Deploy storage accounts
You will likely need to deploy several Azure storage accounts. Each one will hold a smaller number of Azure file shares, as per your deployment plan, completed in the previous section of this article. These are the basic settings you should consider adhering to for any new storage account:

##### Subscription
You can use the same subscription you use for your StorSimple deployment or a different one.

##### Resource group
Resource groups are purely assisting in helping with organization and admin management permissions. You can use a single resource group for all Azure resources that replace StorSimple or split them across multiple resource groups, if you have other needs, like department alignment, etc.

##### Storage account name
The name of your storage account will become part of a URL and has certain character limitations. In your naming convention, consider that storage account names have to be unique in the world, allow only lower case letters and numbers, require between 3 to 24 characters, and do not allow special characters like hyphens or underscores.

##### Location
The "Location" or Azure region of a storage account is very important. If you use Azure file sync, all of your storage accounts must be in the same region as your Storage Sync Service resource (see later in this article). The Azure region you pick, should be close or central to your local servers/users. It cannot be changed.

You can pick a different region from where your StorSimple data (storage account) currently resides.

> [!IMPORTANT]
> If you pick a different region from your current, StorSimple storage account location, [egress charges will apply](https://azure.microsoft.com/pricing/details/bandwidth) during the migration, as data will leave the StorSimple region and enter your new storage account region. No bandwidth charges apply if you stay within the same Azure region.

##### Performance
You have the option to pick premium storage (SSD) for Azure file shares or standard storage. Standard storage includes [several tiers for a file share](storage-how-to-create-file-share.md#changing-the-tier-of-an-azure-file-share). Standard storage is the right option for most customers migrating from StorSimple.

Still not sure?
* Choose premium storage if you need the [performance of a premium Azure file share](storage-files-planning.md#understanding-provisioning-for-premium-file-shares).
* Choose standard storage for general purpose file server workloads, including hot data and archive data. Also choose standard storage if the only workload on the share in the cloud will be Azure File Sync. 

##### Account kind
* For standard storage, choose: *"StorageV2 (general purpose v2)"*
* For premium file shares, choose: *"FileStorage"*

##### Replication
There are several replication settings available. Learn more about the different replication types.

Only choose from either of these two:
* "Locally-redundant storage (LRS)"
* "Zone-redundant (ZRS)" - which is not available in all Azure regions.

> [!IMPORTANT]
> Only LRS and ZRS redundancy types are compatible with the the large, 100TiB-capacity Azure file shares.

Globally redundant storage (all variations) are currently not supported. You can switch your redundancy type later, and to GRS when support for it arrives in Azure.

##### Enable 100TiB-capacity file shares

|---------|---------|
|:::image type="content" source="media/storage-files-how-to-create-large-file-share/large-file-shares-advanced-enable.png" alt-text="An image showing the Advanced tab in the Azure portal for the creation of a storage account.":::     | Under the *Advanced* section of the new storage account wizard in the Azure portal, you can enable Large file shares support in this storage account. If this option is not available to you, you most likely selected the wrong redundancy type. Ensure you only select LRS or ZRS for this option to become available. |

Opting for the large, 100TiB-capacity file shares has several benefits:
* Your performance is greatly increased as compared to the smaller, 5TiB-capacity file shares. (e.g. 10x the IOPS)
* Your migration will finish significantly faster.
* You ensure that a file share will have enough capacity to hold all the data you will migrate into it.

### Azure file shares
Once your storage accounts are created, you can navigate into the *"File share"* section of the storage account and deploy the appropriate number of Azure file shares as per your migration plan from Phase 1. These are the basic settings you should consider adhering to for your new file shares in Azure:

|||
|---------|---------|
|:::image type="content" source="media/storage-files-migration-storsimple-8000/storage-files-migration-storsimple-8000-new-share.png" alt-text="An Azure portal screenshot showing the new file share UI.":::     |</br>**Name**</br>Lower case letters, numbers and hyphens are supported.</br></br>**Quota**</br>Quota here is comparable to SMB hard quota on a Windows Server. The best practice is to not set a quota here as your migration and other services will fail when the quota is reached.</br></br>**Tier**</br>Select *Transaction Optimized* for your new file share. During the migration, a lot of transaction will happen and it is more cost efficient to change your tier later to the tier best for your workload. |

### StorSimple Data Manager
The Azure resource that will hold you migration jobs, is called a *"StorSimple Data Manager"*. Click new resource and search for it, then click *Create*.

This is a temporary resource and you will deprovision it after your migration is complete. This is an orchestrator resource. It should be deployed in the same subscription, resource group and region as your StorSimple storage account.

### Azure File Sync
If you want to replace or even improve on the StorSimple functionality, then you likely have considered deploying Azure File Sync. At this point you should prepare an on-premises Windows Server VM (physical servers and fail-over clusters are also supported), with sufficient "Direct Attached Storage (DAS)" capacity. 

> [!IMPORTANT]
> Do not yet setup Azure File Sync (AFS) to cache any of the shares that you will migrate your StorSimple data into. It is best to start with AFS after the migration of a share is complete. Deploying AFS should not start before Phase 4 of a migration.

### Phase 2 summary
At the end of Phase 2, you will have deployed your storage accounts, all Azure file shares across them and also have a StorSimple Data Manager resource. You will use the latter in Phase 3, when you actually configure your migration jobs.

## Phase 3: Create and run a migration job
This section describes how to set up a migration job and carefully map the directories on a StorSimple volume that should be copied into the target Azure file share you select. To get started, navigate to your StorSimple Data Manager, find Job definitions in the menu and select *+Job definition*. The target storage type is the default: *Azure file share*.

![StorSimple 8000 series migration phases overview](media/storage-files-migration-storsimple-8000/storage-files-migration-storsimple-8000-new-job-type.png "A screenshot of the Job definitions Azure portal with a new Job definition dialog opened, that asks for the type of job: Copy to a file share or a blob container")

|  |  |
|---------|:--------|
|![StorSimple 8000 series migration phases overview](media/storage-files-migration-storsimple-8000/storage-files-migration-storsimple-8000-new-job.png "A screenshot of the new job creation form for a Data Transformation Job")     |**Job definition name**</br>This name should be indicative of the set of files you are moving. Giving it a similar name as the Azure file share can be a good practice.</br></br>**Location where the job runs**</br>It is important that you pick a location close to the storage account containing your StorSimple data. It is possible that for your the exact region is not available in the list, in that case, pick a region close to it.</br></br><h3>Source</h3>**Source subscription**</br>Pick the subscription in which you store your StorSimple Data Manager resource.</br></br>**StorSimple resource**</br>Pick your StorSimple Device Manager your appliance is registered with.</br></br>**Service Data Encryption Key**</br>[Check this prior section in this article](#storsimple-service-data-encryption-key), in case you don't have it handy.</br></br>**Device**</br>Select your StorSimple device that hold the volume where you want to either migrate the whole volume or sub-directories into the target Azure file share.</br></br>**Volume**</br>Select the source volume.</br></br><h3>Target</h3>Pick the subscription, storage account and Azure file share as the target of this migration job.|

### Directory Mapping
As part of your migration plan, you may have decided that the folders on a StorSimple volume need to be split across multiple Azure file shares. Very similar to A Windows Server volume having multiple SMB shares, pointing each to their own sub-folder, often on the root level of the volume but sometimes also further down the directory tree.

So it is important to understand that with a migration job, you can accomplish that split by:
1. Defining multiple jobs to migrate the folders on one volume, each will have the same StorSimple volume source but a different Azure file share as the target.
1. Specifying precisely which folders from the StorSimple volume need to be migrated into the specified file share, by using the *Directory mapping* section of the job creation form and following the specific mapping semantics.

> [!IMPORTANT]
> The paths and mapping expressions in this form cannot be validated when the form is submitted. If mappings are specified incorrectly, a job may either fail completely or produce an undesirable result. In some cases another job run can fix omitted folders (because of prior path misspellings) but often you should rather delete the Azure file share, recreate it and also create a new migration ob for the share, such that you can fix the mapping statements.

#### Semantic elements
A mapping is expressed from left to right: [\source path] \> [\target path].

|Semantic character  | Meaning  |
|:-------------------|:---------|
| **\\**             | root level indicator        |
| **\>**             | [source] and [target] mapping operator        |
|**\|**              | separator of two folder mapping instructions.</br>Alternatively, you can omit this character and simply press enter to get the next mapping expression on it’s own line.        |

### Examples
Moves the content of folder “User data” to the root of the target file share:
**\User data > \\**

Moves the entire volume content into a new path on the target file share:
**\ \> \Apps\HR tracker**

Moves the source folder content to into a new path on the target file share:
**\HR resumes-Backup \> \Backups\HR\resumes**

Sorts multiple source locations into a new directory structure:
**\HR\Candidate Tracker\v1.0 > \Apps\Candidate tracker
\HR\Candidates\Resumes > \HR\Candidates\New 
\Archive\HR\Old Resumes > \HR\Candidates\Archived**

### Semantic rules
* Always specify folder paths relative to the root level. 
* Begin each folder path with a root level indicator “\”. 
* Do not include drive letters. 
* When specifying multiple paths, source or target paths cannot overlap:
   Invalid source path overlap example:
    \\folder\1 > \\folder
    \\folder\\1\\2 > \\folder2
   Invalid target path overlap example:
   \\folder > \\
   \\folder2 > \\
</br>
* Source folders that do not exist, will be ignored. 
* Folder structures that do not exist on the target, will be created. 
* Like Windows: folder names are case insensitive but case preserving.

## 4: Accessing your Azure file shares

### Deploy Azure File Sync
### Deploy direct-share-access

## 5: User cut-over







## Retrieve the Service Data Encryption Key

In case you cannot find your Service Data Encryption Key for this appliance in your records, you can use PowerShell to retrieve the key from the appliance.

### Preparing your PowerShell session

You can connect to your StorSimple appliance [via a serial console](../../storsimple/storsimple-8000-windows-powershell-administration.md#connect-to-windows-powershell-for-storsimple-via-the-device-serial-console) or through a [remote PowerShell session](../../storsimple/storsimple-8000-windows-powershell-administration.md#connect-remotely-to-storsimple-using-windows-powershell-for-storsimple). 

> [!CAUTION]
> When you are deciding how to connect to Windows PowerShell for StorSimple, consider the following:
> * Connecting through an HTTPS session is the most secure and recommended option.
> * Connecting directly to the device serial console is secure, but connecting to the serial console over network switches is not. 
> * HTTP session connections are an option but are **not encrypted** and therefore also not recommended unless used within in a closed, trusted network.

### Retrieving the key

```powershell
Get-HcsmServiceDataEncryptionKey
```
Securely note the key. You will need it when specifying any subsequent Data Transformation job.

## Azure File Sync


Azure File Sync is a Microsoft cloud service, based on two main components:

* File synchronization and cloud tiering.
* File shares as native storage in Azure, that can be accessed over multiple protocols like SMB and file REST. An Azure file share is comparable to a file share on a Windows Server, that you can natively mount as a network drive. It supports important file fidelity aspects like attributes, permissions, and timestamps. With Azure file shares, there is no longer a need for an application or service to interpret the files and folders stored in the cloud. You can access them natively over familiar protocols and clients like Windows File Explorer. That makes Azure file shares the ideal, and most flexible approach to store general purpose file server data as well as some application data, in the cloud.

This article focuses on the migration steps. If before migrating you'd like to learn more about Azure File Sync, we recommend the following articles:

* [Azure File Sync - overview](https://aka.ms/AFS "Overview")
* [Azure File Sync - deployment guide](storage-sync-files-deployment-guide.md)

## StorSimple 8000 series migration path to Azure File Sync

A local Windows Server is required to run an Azure File Sync agent. The Windows Server can be at a minimum a 2012R2 server but ideally is a Windows Server 2019.

There are numerous, alternative migration paths and it would create too long of an article to document all of them and illustrate why they bear risk or disadvantages over the route we recommend as a best practice in this article.

![StorSimple 8000 series migration phases overview](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-overview.png "StorSimple 8000 series migration route overview of the phases further below in this article.")

The previous image depicts phases that correspond to sections in this article.
We use a cloud-side migration to avoid unnecessary recall of files to your local StorSimple appliance. This approach avoids impacting local caching behavior or network bandwidth use, either of which can affect your production workloads.
A cloud-side migration is operating on a snapshot (a volume clone) of your data. So your production data is isolated from this process - until cut-over at the end of the migration. Working off of what is essentially a backup, makes the migration safe and easily repeatable, should you run into any difficulties.

## Considerations around existing StorSimple backups

StorSimple allows you to take backups in the form of volume clones. This article uses a new volume clone to migrate your live files.
If you need to migrate backups in addition to your live data, then all the guidance in this article still applies. The only difference is that instead of starting with a new volume clone, you will start with the oldest backup volume clone you need to migrate.

The sequence is as follows:

* Determine the minimum set of volume clones you must migrate. We recommend keeping this list to a minimum if possible, because the more backups you migrate the longer the overall migration process will take.
* When going through the migration process, begin with the oldest volume clone you intend to migrate and on each subsequent migration, use the next oldest.
* When each volume clone migration completes, you must take an Azure file share snapshot. [Azure file share snapshots](storage-snapshots-files.md) are how you keep point-in-time backups of the files and folder structure for your Azure file shares. You will need these snapshots after the migration completes, to ensure you have preserved versions of each of your volume clones as you progress through the migration.
* Ensure that you take Azure file share snapshots for all Azure file shares, that are served by the same StorSimple volume. Volume clones are on the volume level, Azure file share snapshots are on the share level. You must take a share snapshot (on each Azure file share) after the migration of a volume clone is finished.
* Repeat the migration process for a volume clone and taking share snapshots after each volume clone until you get caught up to a snapshot of the live data. The process of migrating a volume clone is described in the phases below. 

If you do not need to move backups at all and can start a new chain of backups on the Azure file share side after the migration of only the live data is done, then that is beneficial to reduce complexity in the migration and amount of time the migration will take. You can make the decision whether or not to move backups and how many for each volume (not each share) you have in StorSimple.

## Phase 1: Get ready

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-1.png)
    :::column-end:::
    :::column:::
        The basis for the migration is a volume clone and a virtual cloud appliance, called a StorSimple 8020.
This phase focuses on deployment of these resources in Azure.
    :::column-end:::
:::row-end:::


### Map your existing namespaces to Azure file shares

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

### Deploy Azure file shares

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

> [!TIP]
> If you need to change the Azure region from the current region your StorSimple data resides in, then provision the Azure file shares in the new region you want to use. You determine the region by selecting it when you provision the storage accounts that hold your Azure file shares. Make sure that also the Azure File Sync resource you will provision below, is in that same, new region.

### Deploy the Azure File Sync cloud resource

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

> [!TIP]
> If you need to change the Azure region from the current region your StorSimple data resides in, then you have provisioned the storage accounts for your Azure file shares in the new region. Make sure that you selected that same region when you deploy this Storage Sync Service.

### Deploy an on-premises Windows Server

* Create a Windows Server 2019 - at a minimum 2012R2 - as a virtual machine or physical server. A Windows Server fail-over cluster is also supported. Don't reuse the server you might have fronting the StorSimple 8100 or 8600.
* Provision or add Direct Attached Storage (DAS as compared to NAS, which is not supported).

It is best practice to give your new Windows Server an equal or larger amount of storage than your StorSimple 8100 or 8600 appliance has locally available for caching. You will use the Windows Server the same way you used the StorSimple appliance, if it has the same amount of storage as the appliance then the caching experience should be similar, if not the same.
You can add or remove storage from your Windows Server at will. This enables you to scale your local volume size and the amount of local storage available for caching.

### Prepare the Windows Server for file sync

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

### Configure Azure File Sync on the Windows Server

Your registered on-premises Windows Server must be ready and connected to the internet for this process.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

> [!WARNING]
> **Be sure to turn on cloud tiering!** Cloud tiering is the AFS feature that allows the local server to have less storage capacity than is stored in the cloud, yet have the full namespace available. Locally interesting data is also cached locally for fast, local access performance. Another reason to turn on cloud tiering at this step is that we do not want to sync file content at this stage, only the namespace should be moving at this time.

## Phase 4: Configure the Azure VM for sync

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-4.png)
    :::column-end:::
    :::column:::
        This phase concerns your Azure VM with the iSCSI mounted, first volume clone(s). During this phase, you will get the VM connected via Azure File Sync and start a first round of moving files from your StorSimple volume clone(s).
        
    :::column-end:::
:::row-end:::

You already have configured your on-premises server that will replace your StorSimple 8100 or 8600 appliance, for Azure File Sync. 

Configuring the Azure VM is an almost identical process, with one additional step. The following steps will guide you through the process.

> [!IMPORTANT]
> It is important that the Azure VM is **not configured with cloud tiering enabled!** You will exchange the volume of this server with newer volume clones throughout the migration. Cloud tiering has no benefit and overhead on CPU usage you should avoid.

1. [Deploy the AFS agent. (see previous section)](#prepare-the-windows-server-for-file-sync)
2. [Getting the VM ready for Azure File Sync.](#get-the-vm-ready-for-azure-file-sync)
3. [Configure sync](#configure-azure-file-sync-on-the-azure-vm)

### Get the VM ready for Azure File Sync

Azure File Sync is used to move the files from the mounted iSCSI StorSimple volumes to the target Azure file shares.
During this migration process, you will mount several volume clones to your VM, under the same drive letter. Azure File Sync must be configured to see the next volume clone you've mounted as a newer version of the files and folders and update the Azure file shares connected via Azure File Sync. 

> [!IMPORTANT]
> For this to work, a registry key must be set on the server before Azure File Sync is configured.

1. Create a new directory on the system drive of the VM. Azure File Sync information will need to be persisted there instead of on the mounted volume clones. For example: `"C:\syncmetadata"`
2. Open regedit and locate the following registry hive: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync`
3. Create a new Key of type String, named: ***MetadataRootPath***
4. Set the full path to the directory you created on the system volume, for example: `C:\syncmetadata"`

### Configure Azure File Sync on the Azure VM

This step is similar to the previous section, that discusses how you configure AFS on the on-premises server.

The difference is, that you must not enable cloud tiering on this server and that you need to make sure that the right folders are connected to the right Azure file shares. Otherwise your naming of Azure file shares and data content won't match and there is no way to rename the cloud resources or local folders without reconfiguring sync.

Refer to the [previous section on how to configure Azure File Sync on a Windows Server](#configure-azure-file-sync-on-the-windows-server).

### Step 4 summary

At this point, you will have successfully configured Azure File Sync on the Azure VM you have mounted your StorSimple volume clone(s) via iSCSI.
Data is now flowing from the Azure VM to the various Azure file shares and from there a fully tired namespace appears on your on-premises Windows Server.

> [!IMPORTANT]
> Ensure there are no changes made or user access granted to the Windows Server at this time.

The initial volume clone data moving through the Azure VM to the Azure file shares can take a long time, potentially weeks. Estimating the time this will take is tricky and depends on many factors. Most notably the speed at which the Azure VM can access files on the StorSimple volumes and how fast Azure File Sync can process the files and folders that need syncing. 

From experience, we can assume that the bandwidth - therefore the actual data size - plays a subordinate role. The time this or any subsequent migration round will take is mostly dependent on the number of items that can be processed per second. So for example 1 TiB with a 100,000 files and folders will most likely finish slower than 1 TiB with only 50,000 files and folders.

## Phase 5: Iterate through multiple volume clones

:::row:::
    :::column:::
        ![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-5.png)
    :::column-end:::
    :::column:::
        As discussed in the previous phase, the initial sync can take a long time. Your users and applications are still accessing the on-premises StorSimple 8100 or 8600 appliance. That means that changes are accumulating, and with every day a larger delta between the live data and the initial volume clone, you are currently migration, forms. In this section, you'll learn how to minimize downtime by using multiple volume clones and telling when sync is done.
    :::column-end:::
:::row-end:::

Unfortunately, the migration process isn't instantaneous. That means that the aforementioned delta to the live data is an unavoidable consequence. The good news is that you can repeat the process of mounting new volume clones. Each volume clone's delta will be progressively smaller. So eventually, a sync will finish in a duration of time that you consider acceptable for taking users and apps offline to cut over to your on-premises Windows server.

Repeat the following steps until sync completes in a fast enough duration that you feel comfortable taking users and apps offline:

1. [Determine sync is complete for a given volume clone.](#determine-when-sync-is-done)
2. [Take a new volume clone(s) and mount it to the 8020 virtual appliance.](#the-next-volume-clones)
3. [Determine when sync is done.](#determine-when-sync-is-done)
4. [Cut-over strategy](#cut-over-strategy)

### The next volume clone(s)

We have discussed taking a volume clone(s) earlier in this article.
This phase has two actions:

1. [Take a volume clone](../../storsimple/storsimple-8000-clone-volume-u2.md#create-a-clone-of-a-volume)
2. [Mount that volume clone (see above)](#use-the-volume-clone)

### Determine when sync is done

When sync is done, you can stop your time measurement and determine if you need to repeat the process of taking a volume clone and mounting it or if the time sync took with the last volume clone was sufficiently small.

In order to determine sync is complete:

1. Open the Event Viewer and navigate to **Applications and Services**
2. Navigate and open **Microsoft\FileSync\Agent\Telemetry**
3. Look for the most recent **event 9102**, which corresponds to a completed sync session
4. Select **Details** and confirm that the **SyncDirection** value is **Upload**
5. Check the **HResult** and confirm it shows **0**. This means that the sync session was successful. If HResult is a non-zero value, then there was an error during sync. If the **PerItemErrorCount** is greater than 0, then some files or folders did not sync properly. It is possible to have an HResult of 0 but a PerItemErrorCount that is greater than 0. At this point, you don't need to worry about the PerItemErrorCount. We will catch these files later. If this error count is significant, thousands of items, contact customer support and ask to be connected to the Azure File Sync product group for direct guidance on best, next phases.
6. Check to see multiple 9102 events with HResult 0 in a row. This indicates that sync is complete for this volume clone.

### Cut-over strategy

1. Determine if sync from a volume clone is fast enough now. (Delta small enough.)
2. Take the StorSimple appliance offline.
3. A final RoboCopy.

Measure the time and determine if sync from a recent volume clone can finish within a time window small enough, that you can afford as downtime in your system.

It is now time disable user access to the StorSimple appliance. No more changes. Downtime has begun.
You need to leave the appliance online and connected but must now prevent changes on it.

In phase 6 you will catch up with any delta in the live data since the last volume clone.

## Phase 6: A final RoboCopy

At this point, there are two differences between your on-premises Windows Server and the StorSimple 8100 or 8600 appliance:

1. There may be files that haven't synced (see **PerItemErrors** from the event log above)
2. The StorSimple appliance has a populated cache vs. the Windows Server just a namespace with no file content stored locally at this time.

![An image illustrating a part of the earlier, overview image that helps focus this subsection of the article.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-6.png)

We can bring the cache of the Windows Server up to the state of the appliance and ensure no file is left behind with a final RoboCopy.

> [!CAUTION]
> It is imperative that the RoboCopy command you follow, is exactly as described below. We only want to copy files that are local and files that haven't moved through the volume clone+sync approach before. We can solve the problems why they didn't sync later, after the migration is complete. (See [Azure File Sync troubleshooting](storage-sync-files-troubleshoot.md#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing). It's most likely unprintable characters in file names that you won't miss when they are deleted.)

RoboCopy command:

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
      Allows for RoboCopy to only consider deltas between source (StorSimple appliance) and target (Windows Server directory).
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

You should run this RoboCopy command for each of the directories on the Windows Server as a target, that you've configured with file sync to an Azure file.

You can run multiple of these commands in parallel.
Once this RoboCopy step is complete, you can allow your users and apps to access the Windows Server like they did the StorSimple appliance before.

Consult the robocopy log file(s) to see if files have been left behind. If issues should exist, in most cases you can resolve them after the migration is complete and your users and apps have been re-homed to your Windows Server. If you need to fix any issues, do so before phase 7.

It is likely needed to create the SMB shares on the Windows Server that you had on the StorSimple data before. You can front-load this step and do it earlier to not lose time here, but you must ensure that before this point, no changes to files occur on the Windows server.

If you have a DFS-N deployment, you can point the DFN-Namespaces to the new server folder locations. If you do not have a DFS-N deployment, and you fronted your 8100 8600 appliance locally with a Windows Server, you can take that server off the domain, and domain join your new Windows Server with AFS to the domain, give it the same server name as the old server, and the same share names, then the cut-over to the new server remains transparent for your users, group policy, or scripts.

## Phase 7: Deprovision

During the last phase you have iterated through multiple volume clones, and eventually were able to cut over user access to the new Windows Server after taking you StorSimple appliance offline.

You can now begin to deprovision unnecessary resources.
Before you begin, it is a best practice to observe your new Azure File Sync deployment in production, for a bit. That gives you options to fix any problems you might encounter.

Once you are satisfied and have observed your AFS deployment for at least a few days, you can begin to deprovision resources in this order:

1. Turn off the Azure VM that we have used to move data from the volume clones to the Azure file shares via file sync.
2. Go to your Storage Sync Service resource in Azure, and unregister the Azure VM. That removes it from all the sync groups.

    > [!WARNING]
    > **ENSURE you pick the right machine.** You've turned the cloud VM off, that means it should show as the only offline server in the list of registered servers. You must not pick the on-premises Windows Server at this step, doing so will unregister it.

3. Delete Azure VM and its resources.
4. Disable the 8020 virtual StorSimple appliance.
5. Deprovision all StorSimple resources in the Azure.
6. Unplug the StorSimple physical appliance from your data center.

Your migration is complete.

> [!IMPORTANT]
> Still having questions or encountered any issues?
> We are here to help: AzureFilesMigration@microsoft .com


## Next steps

Get more familiar with Azure File Sync.
Especially with the flexibility of cloud tiering policies.

If you see in the Azure portal, or from the earlier events, that some files are permanently not syncing, review the troubleshooting guide for steps to resolve these issues.

* [Azure File Sync overview: aka.ms/AFS](https://aka.ms/AFS)
* [Cloud tiering](storage-sync-cloud-tiering.md) 
* [Azure File Sync troubleshooting guide](storage-sync-files-troubleshoot.md)
