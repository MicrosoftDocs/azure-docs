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

### Migration cost summary
Migrations to Azure file shares from StorSimple volumes via Data Transformation jobs in a StorSimple Data Manager resource are free of charge. We want to provide world-class services to you and at times that means an older technology like StorSimple sunsets and requires a migration to a newer, open and future proof technology like SMB file shares in the cloud. That transformation should come at as few costs to you as possible, so we make this transformation free of charge. Please be aware that there are other costs that can or will still occur:
* **Network egress:** Your StorSimple files live in a Storage account within a specific Azure region. If you provision the Azure file shares you migrate to in a storage account that is located in the same Azure region, no egress cost will occur. You can move your files to a storage account in a different region as part of this migration. In that case, egress costs will apply to you.
* **Azure file share transaction:** When files are copied in to an Azure file share (as part of a migration or outside of one) transaction costs to apply as files and metadata are being written into a file share. As a best practice, start your Azure file share on the transaction optimized tier during the migration. Switch to your desired tier after the migration completed. The phases below will call this out at the appropriate point.
* **Changing an Azure file share tier:** Changing the tier of an Azure file share costs transactions. In most cases it will be more cost efficient to follow the advice from the previous point.
* **storage cost:** When this migration starts copying files into an Azure file share, Azure Files storage is consumed and billed. During this time and until you have a chance to deprovision the StorSimple devices and storage accounts, StorSimple cost for storage, backups and appliances will still continue to occur.

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
> When you are deciding how to connect to your StorSimple appliance, consider the following:
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
> Backups must be "played back" to the Azure file shares from oldest to newest, to live data, with Azure file share snapshots taken in between.

If you want to only migrate the live data and have no requirements for backups, you can continue following this guide.
If you only have a very short-term backup retention requirement of say, a month, then you can decide to continue your migration now and only deprovision your StorSimple resources after that period. This would allow you to create as much backup history on the Azure file share side as you need. This is not an approach you should take if you need more than very short-term backup retention.

### Map your existing StorSimple volumes to Azure file shares
[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

### Number of storage accounts
Your migration will likely benefit from a deployment of multiple storage accounts, that each hold a smaller number of Azure file shares. Consider this:

If you have highly active shares (shares used by many users and/or applications), then two Azure file shares might reach the performance limit of a storage account.

A best practice is to deploy storage accounts with one file share each. You can pool multiple Azure file shares into the same storage account, in case you have archival shares in them.

These considerations apply more to [direct cloud access](#direct-share-access-vs-azure-file-sync) (through an Azure VM or service) than to Azure File Sync. If you plan to use Azure File Sync only on these shares, then grouping several into a single Azure storage account is fine. Just also consider you might want to lift and shift an app into the cloud, that would then directly access a file share. Or you could start using a service in Azure that would also benefit from having higher IO per Second and throughput numbers available. 

If you've made a list of your shares, you should map each share to the storage account that it will reside in.

> [!IMPORTANT]
> Make sure you decide on an Azure region and then each storage account and Azure File Sync resource match that same region you've selected.

### Phase 1 summary
At the end of Phase 1:
* You have a good overview of your StorSimple devices and volumes.
* You are ready to access your StorSimple volumes in the cloud, by having retrieved your Service Data Encryption key for each StorSimple device.
* You have a plan for not only which volumes need to be migrated, but also how to map your volumes to the appropriate number of Azure file shares and storage accounts.

> [!CAUTION]
> If you must migrate backups from StorSimple volumes, **STOP HERE**.
>
> This migration approach relies on new data transformation service capabilities that currently cannot migrate backups. Support for backup migration will arrive at the end of 2020.
> You can currently only migrate your live data. If you start now, you cannot "bolt-on" your backups later.
> Backups must be "played back" to the Azure file shares from oldest to newest to live data, with Azure file share snapshots in between.

If you want to only migrate the live data and have no requirements for backups, you can continue following this guide.

## Phase 2: Deploying Azure storage and migration resources

This section discusses considerations around deploying the different resource types that are needed in Azure. Some will hold your data post migration and some are needed solely for the migration. Start deploying resources only, when you know your plan is final - it is often hard or impossible to change certain aspects of your Azure resources later on.

### Deploy storage accounts
You will likely need to deploy several Azure storage accounts. Each one will hold a smaller number of Azure file shares, as per your deployment plan, completed in the previous section of this article. These are the basic settings you should consider adhering to for any new storage account:

##### Subscription
You can use the same subscription you use for your StorSimple deployment or a different one. The only limitation is that your subscription must be in the same AAD tenant as the StorSimple subscription. Consider moving the StorSimple subscription to the correct tenant before starting a migration. You can only move the entire subscription, individual StorSimple resources cannot be moved to a different tenant or subscription.

##### Resource group
Resource groups are assisting with organization of resources and admin management permissions. You can use a single resource group for all Azure resources that replace StorSimple or split them across multiple resource groups.

##### Storage account name
The name of your storage account will become part of a URL and has certain character limitations. In your naming convention, consider that storage account names have to be unique in the world, allow only lower case letters and numbers, require between 3 to 24 characters, and do not allow special characters like hyphens or underscores. See also: [Azure storage resource naming rules](../../azure-resource-manager/management/resource-name-rules.md#microsoftstorage).

##### Location
The "Location" or Azure region of a storage account is very important. If you use Azure file sync, all of your storage accounts must be in the same region as your Storage Sync Service resource (see later in this article). The Azure region you pick, should be close or central to your local servers/users. It cannot be changed.

You can pick a different region from where your StorSimple data (storage account) currently resides.

> [!IMPORTANT]
> If you pick a different region from your current, StorSimple storage account location, [egress charges will apply](https://azure.microsoft.com/pricing/details/bandwidth) during the migration. Data will leave the StorSimple region and enter your new storage account region. No bandwidth charges apply if you stay within the same Azure region.

> [!IMPORTANT]
> Make sure you decide on an Azure region and then each storage account and Azure File Sync resource match that same region you've selected.

##### Performance
You have the option to pick premium storage (SSD) for Azure file shares or standard storage. Standard storage includes [several tiers for a file share](storage-how-to-create-file-share.md#changing-the-tier-of-an-azure-file-share). Standard storage is the right option for most customers migrating from StorSimple.

Still not sure?
* Choose premium storage if you need the [performance of a premium Azure file share](storage-files-planning.md#understanding-provisioning-for-premium-file-shares).
* Choose standard storage for general purpose file server workloads, including hot data and archive data. Also choose standard storage if the only workload on the share in the cloud will be Azure File Sync.

##### Account kind
* For standard storage, choose: *StorageV2 (general purpose v2)*
* For premium file shares, choose: *FileStorage*

##### Replication
There are several replication settings available. Learn more about the different replication types.

Only choose from either of these two:
* *Locally-redundant storage (LRS)*
* *Zone-redundant storage (ZRS)* - which is not available in all Azure regions.

> [!IMPORTANT]
> Only LRS and ZRS redundancy types are compatible with the the large, 100TiB-capacity Azure file shares.

Globally redundant storage (all variations) are currently not supported. You can switch your redundancy type later, and to GRS when support for it arrives in Azure.

##### Enable 100TiB-capacity file shares

:::row:::
    :::column:::
<<<<<<< HEAD
        :::image type="content" source="media/storage-files-how-to-create-large-file-share/large-file-shares-advanced-enable.png" alt-text="An image showing the Advanced tab in the Azure portal for the creation of a storage account.":::
=======
        ![Illustration that shows it's now time to provision a VM and expose the volume clone (or multiple) to that VM over iSCSI.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-2.png)
>>>>>>> 1aed82e0b20f5c1823c6093c210ddf3a1826854a
    :::column-end:::
    :::column:::
        Under the *Advanced* section of the new storage account wizard in the Azure portal, you can enable *Large file shares* support in this storage account. If this option is not available to you, you most likely selected the wrong redundancy type. Ensure you only select LRS or ZRS for this option to become available.
    :::column-end:::
:::row-end:::

Opting for the large, 100TiB-capacity file shares has several benefits:
* Your performance is greatly increased as compared to the smaller, 5TiB-capacity file shares. (for example: ten times the IOPS)
* Your migration will finish significantly faster.
* You ensure that a file share will have enough capacity to hold all the data you will migrate into it.
* Future growth is covered.

### Azure file shares
Once your storage accounts are created, you can navigate into the *"File share"* section of the storage account and deploy the appropriate number of Azure file shares as per your migration plan from Phase 1. These are the basic settings you should consider adhering to for your new file shares in Azure:

:::row:::
    :::column:::
        :::image type="content" source="media/storage-files-migration-storsimple-8000/storage-files-migration-storsimple-8000-new-share.png" alt-text="An Azure portal screenshot showing the new file share UI.":::
    :::column-end:::
    :::column:::
        </br>**Name**</br>Lower case letters, numbers and hyphens are supported.</br></br>**Quota**</br>Quota here is comparable to SMB hard quota on a Windows Server. The best practice is to not set a quota here as your migration and other services will fail when the quota is reached.</br></br>**Tier**</br>Select *Transaction Optimized* for your new file share. During the migration, a lot of transactions will happen and it is more cost efficient to change your tier later to the tier best suited to your workload.
    :::column-end:::
:::row-end:::

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

:::row:::
    :::column:::
<<<<<<< HEAD
        ![StorSimple 8000 series migration phases overview](media/storage-files-migration-storsimple-8000/storage-files-migration-storsimple-8000-new-job.png "A screenshot of the new job creation form for a Data Transformation Job")
=======
        ![Illustration that shows the need to  determine and provision a number of Azure file shares and create a Windows Server on-premises as a StorSimple appliance replacement.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-3.png)
>>>>>>> 1aed82e0b20f5c1823c6093c210ddf3a1826854a
    :::column-end:::
    :::column:::
        **Job definition name**</br>This name should be indicative of the set of files you are moving. Giving it a similar name as the Azure file share can be a good practice.</br></br>**Location where the job runs**</br>It is important that you pick a location close to the storage account containing your StorSimple data. It is possible that for your StorSimple deployment the exact region is not available in the list. In that case, pick a region close to it.</br></br><h3>Source</h3>**Source subscription**</br>Pick the subscription in which you store your StorSimple Device Manager resource.</br></br>**StorSimple resource**</br>Pick your StorSimple Device Manager your appliance is registered with.</br></br>**Service Data Encryption Key**</br>Check this [prior section in this article](#storsimple-service-data-encryption-key), in case you can't locate the key in your records.</br></br>**Device**</br>Select your StorSimple device that holds the volume where you want to either migrate.</br></br>**Volume**</br>Select the source volume. Later you'll decide if you want to migrate the whole volume or sub-directories into the target Azure file share.</br></br><h3>Target</h3>Pick the subscription, storage account and Azure file share as the target of this migration job.
    :::column-end:::
:::row-end:::

> [!IMPORTANT]
> The latest volume backup will be used to perform the migration. Ensure at least one volume backup is present or the job will fail. Also ensure that the latest backup you have is fairly recent, to keep the delta to the live share as small as possible. It could be worth manually triggering and completing another volume backup **before** running the job you just created.

### Directory Mapping
This is optional for your migration job. If you leave it empty, **all** the files and folders on the root of your StorSimple volume will be moved into the root of your target Azure file share. In most cases, storing an entire volume's content in an Azure file share is not the best approach. It's often better to split a volume's content across multiple file shares in Azure. If you haven't made a plan already, check out this section first: [Map your StorSimple volume to Azure file shares](#map-your-existing-storsimple-volumes-to-azure-file-shares)

As part of your migration plan, you may have decided that the folders on a StorSimple volume need to be split across multiple Azure file shares. If that is the case, you can accomplish that split by:
1. Defining multiple jobs to migrate the folders on one volume, each will have the same StorSimple volume source but a different Azure file share as the target.
1. Specifying precisely which folders from the StorSimple volume need to be migrated into the specified file share, by using the *Directory mapping* section of the job creation form and following the specific [mapping semantics](#semantic-elements).

> [!IMPORTANT]
> The paths and mapping expressions in this form cannot be validated when the form is submitted. If mappings are specified incorrectly, a job may either fail completely or produce an undesirable result. In some cases another job run can fix omitted folders (because of prior path misspellings) but often you should rather delete the Azure file share, recreate it and also create a new migration job for the share, such that you can fix the mapping statements.

#### Semantic elements
A mapping is expressed from left to right: [\source path] \> [\target path].

|Semantic character          | Meaning  |
|:---------------------------|:---------|
| **\\**                     | root level indicator        |
| **\>**                     | [source] and [target] mapping operator        |
|**\|** or RETURN (new line) | separator of two folder mapping instructions.</br>Alternatively, you can omit this character and simply press enter to get the next mapping expression on it’s own line.        |

### Examples
Moves the content of folder “User data” to the root of the target file share:
``` console
\User data > \\
```
Moves the entire volume content into a new path on the target file share:
``` console
\ \> \Apps\HR tracker
```
Moves the source folder content to into a new path on the target file share:
``` console
\HR resumes-Backup \> \Backups\HR\resumes
```
Sorts multiple source locations into a new directory structure:
``` console
\HR\Candidate Tracker\v1.0 > \Apps\Candidate tracker
\HR\Candidates\Resumes > \HR\Candidates\New
\Archive\HR\Old Resumes > \HR\Candidates\Archived
```

### Semantic rules
* Always specify folder paths relative to the root level. 
* Begin each folder path with a root level indicator “\”. 
* Do not include drive letters. 
* When specifying multiple paths, source or target paths cannot overlap:</br>
   Invalid source path overlap example:</br>
    *\\folder\1 > \\folder*</br>
    *\\folder\\1\\2 > \\folder2*</br>
   Invalid target path overlap example:</br>
   *\\folder > \\*</br>
   *\\folder2 > \\*</br>
* Source folders that do not exist, will be ignored. 
* Folder structures that do not exist on the target, will be created. 
* Like Windows: folder names are case insensitive but case preserving.

> [!NOTE]
> contents of the "*\System Volume Information*" folder and the "*$Recycle.Bin*" on your StorSimple volume will be not be copied by the transformation job.

### Phase 3 summary


## Phase 4: Accessing your Azure file shares

There are two main strategies for accessing your Azure file shares:

* **Azure File Sync:** [How to deploy Azure File Sync](#deploy-azure-file-sync) to an on-premises Windows Server. AFS has all the advantages of a local cache, just like StorSimple, only better.
* **Direct share access:** [How to deploy direct-share-access](#deploy-direct-share-access). Use this strategy if your access scenario for a given Azure file share will not benefit from local caching or you have no longer an ability to host an on-premises Windows Server. Here, your users and apps will continue to access SMB shares over the SMB protocol, but these shares are no longer on an on-premises server, but directly in the cloud.

<<<<<<< HEAD
In the previous section: [Direct share access vs. Azure File Sync](#direct-share-access-vs-azure-file-sync). located in Phase 1 of this guide, you've already made the decisions what to use for which Azure file share. 
=======
:::row:::
    :::column:::
        ![Illustration that shows how you'll get the VM connected via Azure File Sync and start a first round of moving files from your StorSimple volume clone(s).](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-4.png)
    :::column-end:::
    :::column:::
        This phase concerns your Azure VM with the iSCSI mounted, first volume clone(s). During this phase, you will get the VM connected via Azure File Sync and start a first round of moving files from your StorSimple volume clone(s).
        
    :::column-end:::
:::row-end:::
>>>>>>> 1aed82e0b20f5c1823c6093c210ddf3a1826854a

The remainder of this section focuses on deployment instructions.

### Deploy Azure File Sync

> [!IMPORTANT]
> Azure File Sync (AFS) should be deployed only **after** your migration jobs to an Azure file share have completed.

If you start sync to an Azure file share before or during the migration of files and folders from StorSimple, then it is possible, that your server will be behind, and presents you with an incomplete namespace for some time. Eventually it will catch up but it will make it hard to tell when the time has come Phase 4: User cut-over. So it is always better to start syncing an Azure file share after the migration job(s) have finished and there are no more cloud-side changes to the share.

If you want to get a head-start, you can deploy your Windows Server, it's storage, install the Azure File Sync agent, deploy the Storage Sync Service Azure resource and register the server with it. All of this while or even before you are migrating into your Azure file shares. Just don't set up any share to sync before you finish making changes to the Azure file share.

#### Deploy the Azure File Sync cloud resource

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

> [!TIP]
> If you need to change the Azure region from the current region your StorSimple data resides in, then you have provisioned the storage accounts for your Azure file shares in the new region. Make sure that you selected that same region when you deploy this Storage Sync Service.

#### Deploy an on-premises Windows Server

* Create a Windows Server 2019 - at a minimum 2012R2 - as a virtual machine or physical server. A Windows Server fail-over cluster is also supported. Don't reuse the server you might have fronting the StorSimple 8100 or 8600.
* Provision or add Direct Attached Storage (DAS as compared to NAS, which is not supported).

It is best practice to give your new Windows Server an equal or larger amount of storage than your StorSimple 8100 or 8600 appliance has locally available for caching. You will use the Windows Server the same way you used the StorSimple appliance, if it has the same amount of storage as the appliance then the caching experience should be similar, if not the same.
You can add or remove storage from your Windows Server at will. This enables you to scale your local volume size and the amount of local storage available for caching.

#### Prepare the Windows Server for file sync

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

#### Configure Azure File Sync on the Windows Server

Your registered on-premises Windows Server must be ready and connected to the internet for this process.

> [!WARNING]
> Your StorSimple migration of files and folders into the Azure file share must be complete **before you proceed**. Make sure there are no more changes done to the file share.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

> [!WARNING]
> **Be sure to turn on cloud tiering!** Cloud tiering is the AFS feature that allows the local server to have less storage capacity than is stored in the cloud, yet have the full namespace available. Locally interesting data is also cached locally for fast, local access performance. Another reason to turn on cloud tiering at this step is that we do not want to sync file content at this stage, only the namespace should be moving at this time.

### Deploy direct-share-access

:::row:::
    :::column:::
<<<<<<< HEAD
        [![Step by step guide and demo for how to securely expose Azure file shares directly to information workers and apps - click to play!](./media/storage-sync-files-planning/azure-file-sync-interview-video-snapshot.png)](https://www.youtube.com/watch?v=nfWLO7F52-s)
=======
        ![Illustration that shows how to minimize downtime by using multiple volume clones and telling when sync is done.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-5.png)
>>>>>>> 1aed82e0b20f5c1823c6093c210ddf3a1826854a
    :::column-end:::
    :::column:::
        This videos is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five, simple steps.</br>
        The video references dedicated documentation for some topics:
* [Identity overview](storage-files-active-directory-overview.md)
* [How to domain join a storage account](storage-files-identity-auth-active-directory-enable.md)
* [Networking overview for Azure file shares](storage-files-networking-overview.md)
* [How to configure public and private endpoints](storage-files-networking-endpoints.md)
* [How to configure a S2S VPN](storage-files-configure-s2s-vpn.md)
* [How to configure a Windows P2S VPN](storage-files-configure-p2s-vpn-windows.md)
* [How to configure a Linux P2S VPN](storage-files-configure-p2s-vpn-linux.md)
* [How to configure DNS forwarding](storage-files-networking-dns.md)
* [Configure DFS-N](https://aka.ms/AzureFiles/Namespaces)
   :::column-end:::
:::row-end:::

### Phase 4 summary
In this phase you've created and run multiple *Data Transformation Service* (DTS) jobs in your *StorSimple Data Manager*. Those jobs have migrated your files and folders and possibly sorted them into more Azure file shares than you have StorSimple volumes.
Furthermore, you've decided and deployed either Azure File Sync or prepared your network and storage accounts for direct-share-access.

## 5: User cut-over
This phase is all about wrapping up your migration:
* Plan your downtime.
* Catch-up with any changes your users and apps produced on the StorSimple side while the *Data Transformation* (DTS) jobs in Phase 3 have been running. 
* Fail your users over to the new Windows Server with Azure File Sync or the Azure file shares via direct-share-access.

### Plan your downtime
This migration approach requires some downtime for your users and apps. Maybe a weekend works for your access patterns. The goal is to keep downtime to a minimum and the following considerations help with that:

* Keep your StorSimple volumes available while running your DTS migration jobs.
* When you finished running your DTS job(s) for a share, it's time to remove user access (at least write access) from the StorSimple volumes/shares. A final RoboCopy will catch up your Azure file share, then you can cut-over your users. From where to where you run this RoboCopy depends on what you chose (Azure File Sync / direct-share-access). The upcoming section on RoboCopy covers that.
* Once you completed the RoboCopy catch-up, you are ready to expose the new location to your users. Either the Azure file share directly or an SMB share on a Windows Server with AFS. Often a DFS-N deployment will help accomplish a cut-over quickly, and efficiently. It will keep your existing share addresses consistent and simply re-point to a new location, containing your migrated files and folders.

### Determine when your namespace has fully synced to your server

When you use Azure File Sync for an Azure file share, it is important that you determine your entire namespace has finished downloading to the server **BEFORE** you start any local RoboCopy. The time that takes varies by the number of items in the Azure file share. You can use two different ways to determine that your namespace has fully arrived on the server:

#### Azure portal
You can tell from the Azure portal, when your namespace has arrived fully on the server, such that you can proceed with a local RoboCopy.
* Navigate to the Azure portal, identify the sync group and server endpoint and observe the Sync status. 
* The interesting direction is download: If the server endpoint is newly provisioned, it will show "*Initial sync*" indicating the namespace is still coming down.
Once that changes to anything but *Initial sync*, your namespace will be fully populated on the server and you are good to proceed with a local RoboCopy.

#### Windows Server log
You can also tell from a Windows Server, when your namespace has arrived fully on the server, such that you can proceed with a local RoboCopy.

1. Open the *Event Viewer* and navigate to **Applications and Services**.
1. Navigate and open **Microsoft\FileSync\Agent\Telemetry**.
1. Look for the most recent **event 9102**, which corresponds to a completed sync session.
1. Select **Details** and confirm that you are looking at an event where the **SyncDirection** value is **Download**.
1. For the time where your namespace has completed download to the server, there will be a single event with **Scenario**, value **"FullGhostedSync"** and **HResult** = **0**.
1. Should you miss that event, you can also look for other **9102 events** with **SyncDirection** = **Download** and **Scenario** = **"RegularSync"**. Finding one of these events also indicates that the namespace has finished downloading and sync progressed to regular sync sessions, whether there is anything to sync or not, at this time.

### A final RoboCopy
At this point, there are differences between your on-premises Windows Server and the StorSimple 8100 or 8600 appliance:

1. You need to catch up with the changes that users/apps produced on the StorSimple side while the migration was ongoing.
1. There may be files that got left behind by the DTS job, due to invalid characters in file names or other reasons. At this point you want to copy them to the AFS enabled Windows Server and you fix them later. When these files are fixed, they will then start to sync. If you don't use AFS for a particular share, you'd be better off renaming the files with invalid characters on the StorSimple volume and then run the RoboCopy directly against the Azure file share. The DTS job run has a copy log column, where you can retrieve a list of files that have failed and the reason for them failing. That number should generally be small, if it is not: fixing these issues on the StorSimple volumes and restarting a migration job might be the best course of action.
1. For cases where you use Azure File Sync: The StorSimple appliance has a populated cache vs. the Windows Server just a namespace with no file content stored locally at this time. So the final RoboCopy can help jump-start your local AFS cache by pulling over locally cached file content as much as is available and can fit on the AFS server.

<<<<<<< HEAD
> [!WARNING]
> You **must not start the RoboCopy** before the server has the namespace for an Azure file share downloaded fully!
> Checkout: "[Determine when your namespace has fully downloaded to your server](#determine-when-your-namespace-has-fully-synced-to-your-server)"
=======
In phase 6 you will catch up with any delta in the live data since the last volume clone.

## Phase 6: A final RoboCopy

At this point, there are two differences between your on-premises Windows Server and the StorSimple 8100 or 8600 appliance:

1. There may be files that haven't synced (see **PerItemErrors** from the event log above)
2. The StorSimple appliance has a populated cache vs. the Windows Server just a namespace with no file content stored locally at this time.

![Illustration that shows how the cache of the Windows Server was brought up to the state of the appliance and ensures no file is left behind with a final RoboCopy.](media/storage-files-migration-storsimple-shared/storsimple-8000-migration-phase-6.png)

We can bring the cache of the Windows Server up to the state of the appliance and ensure no file is left behind with a final RoboCopy.
>>>>>>> 1aed82e0b20f5c1823c6093c210ddf3a1826854a

 > [!CAUTION]
> The RoboCopy command below contains best-practice parameters. You only want to copy files that were changed after the DTS job last ran and files that haven't moved through the Data Transformation Service jobs before. You can solve the problems why they didn't move later on the server, after the migration is complete. (See [Azure File Sync troubleshooting](storage-sync-files-troubleshoot.md#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing). It's most likely unprintable characters in file names that you won't miss when they are deleted.)

RoboCopy command:

```console
Robocopy /MT:16 /UNILOG:<file name> /TEE /B /MIR /COPYALL /DCOPY:DAT <SourcePath> <Dest.Path>
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

When you configure source and target locations of the RoboCopy command, make sure you review the structure of source and target to ensure they match. You might have used the directory mapping feature of the migration job (DTS job) and so your root-directory structure might be different than on your StorSimple volume. You might need multiple RoboCopy jobs, one for each sub-directory. Since this RoboCopy command uses /MIR - it will not move files that are the same (tiered files for instance), but if you get source and target path wrong, /MIR also purges directory structures on your Windows Server / Azure file share, that are not present on the StorSimple source path. So they must match exactly for the RoboCopy job to reach it's intended goal of just updating your migrated content with the latest changes made while the migration ongoing. 

Consult the RoboCopy log file to see if files have been left behind. If issues should exist, fix them and rerun the same RoboCopy command. If you need to fix any issues, do so before deprovisioning any StorSimple resources.

If you don't use Azure File Sync to cache the particular Azure file share in question, but rather opted for direct-share-access:
1. [Mount your Azure file share](storage-how-to-use-files-windows.md#mount-the-azure-file-share) as a network drive to a local Windows machine.
1. Perform the RoboCopy between your StorSimple and the mounted Azure file share. If files don't copy, fix up their names on the StorSimple side to remove invalid characters and retry RoboCopy. The previously listed RoboCopy command can be run multiple times w/o causing unnecessary recall to StorSimple.

### User cut-over

If you use Azure File Sync, you likely need to create the SMB shares on that AFS enabled Windows Server that match the shares you had on the StorSimple volumes. You can front-load this step and do it earlier to not lose time here, but you must ensure that before this point, nobody has access to cause changes to the Windows Server.

If you have a DFS-N deployment, you can point the DFN-Namespaces to the new server folder locations. If you do not have a DFS-N deployment, and you fronted your 8100 / 8600 appliance locally with a Windows Server, you can take that server off the domain, and domain join your new Windows Server with AFS to the domain, give it the same server name as the old server, and the same share names, then the cut-over to the new server remains transparent for your users, group policy, or scripts.

[Learn more about DFS-N](https://aka.ms/AzureFiles/Namespaces)

## Deprovision

> [!CAUTION]
> Deprovisioning resources always means a **loss of configuration and data** that **cannot be undone**.
> Stop and confirm your migration is complete and nothing and no one depends on these resources, before you proceed.

Only proceed, when you are certain that you:
* ...don't need any more files / folders from StorSimple.
* ...don't need StorSimple volume backups.

Before you begin, it is a best practice to observe your new Azure File Sync deployment in production, for a bit. That gives you options to fix any problems you might encounter.

Once you are satisfied and have observed your AFS deployment for at least a few days, you can begin to deprovision resources in this order:

1. Deprovision your StorSimple Data Manager resource in the Azure.
   All of your DTS jobs will be deleted with it. You won't be able to easily get at the copy logs anymore. If they are important for your records, retrieve them beforehand.
1. Unregister the StorSimple physical appliances your have finished migrating.
   If you have any doubt, stop and think this through. Deprovisioning resources always means a loss of configuration and data that cannot be undone.
1. If there are no more registered devices left in a StorSimple Device Manager, you can proceed to remove that Device Manager resource itself.
1. It is now time to delete the StorSimple storage account in Azure. Again, stop and confirm your migration is complete and nothing and no one depends on this data, before you proceed.
1. Unplug the StorSimple physical appliance from your data center.
1. If you own the StorSimple appliance, you are free to PC Recycle it. 
   If your device is leased, inform the lessor and return the device as appropriate.

Your migration is complete.

> [!NOTE]
> Still having questions or encountered any issues?</br>
> We are here to help: AzureFilesMigration@microsoft .com


## Next steps

* Get more familiar with [Azure File Sync: aka.ms/AFS](https://aka.ms/AFS).
* Understand the flexibility of [cloud tiering](storage-sync-cloud-tiering.md) policies.
* [Enable Azure Backup](../../backup/backup-afs.md#configure-backup-from-the-file-share-pane) on your Azure file shares to schedule snapshots and define backup retention schedules.
* If you see in the Azure portal that some files are permanently not syncing, review the [troubleshooting guide](storage-sync-files-troubleshoot.md) for steps to resolve these issues.
