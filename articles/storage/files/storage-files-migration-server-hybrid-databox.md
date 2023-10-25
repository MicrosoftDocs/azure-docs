---
title: Migrate data into Azure File Sync with Azure Data Box
description: Migrate bulk data offline that's compatible with Azure File Sync. Avoid file conflicts, and catch up your file share with the latest changes on the server for a zero downtime cloud migration.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 06/01/2021
ms.author: kendownie
---

# Migrate data offline to Azure File Sync with Azure Data Box

This migration article is one of several that apply to the keywords Azure File Sync and Azure Data Box. Check if this article applies to your scenario:

:::row:::
    :::column:::
        :::image type="content" source="media/storage-files-migration-server-hybrid-databox/file-sync-data-box-concept.png" alt-text="A display of three sequential steps described in this migration guide. The column next to the image describes them in detail." lightbox="media/storage-files-migration-server-hybrid-databox/file-sync-data-box-concept-expanded.png":::
    :::column-end:::
    :::column:::
        > [!div class="checklist"]
        > * Data source: Windows Server 2012 R2 or newer where Azure File Sync will be installed and point to the original set of files.
        > * Migration route: Windows Server 2012 R2 or newer &rArr; Data Box &rArr; Azure file share &rArr; sync with Windows Server original file location
        > * Caching files on-premises: Yes, the final goal is an Azure File Sync deployment that syncs the files from where they are now. 
        :::column-end:::
:::row-end:::

Using Azure Data Box is a viable path to move the bulk of the data from your on-premises Windows Server to separate Azure file shares and then, optionally, add Azure File Sync on the original source server.

There are different migration paths available to you, it's important to follow the right one:

* Your data lives on a Windows Server 2012 R2 or newer and you plan to install AFS to that server and sync the original location. In this scenario, you don't want to upload all files and use Data Box instead, then use file sync for ongoing changes. If this is your scenario, then this article describes your migration path.
* You have data on a source where you *will not* or cannot install AFS on. A NAS (Network Attached Storage) for instance or a different server. You will rather create a new, empty server and use Azure File Sync on that server. If that is your scenario, then this isn't the right migration guide for you. Rather check out: [Migrate from NAS via Data Box to Azure File Sync](../files/storage-files-migration-nas-hybrid-databox.md) or find the best guide for your scenario on the [migration overview](../files/storage-files-migration-overview.md) page.
* For all other scenarios, check the [table of Azure file share migration guides](../files/storage-files-migration-overview.md). This overview page provides a good starting point for all migration scenarios.
 
## Migration overview

The migration process consists of several phases. You'll need to:
- Deploy storage accounts and file shares.
- Deploy one or more Azure Data Box devices to move the data from your Windows Server 2012 R2 or newer. 
- Configure Azure File Sync with authoritative upload.

The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you're returning to this article, use the navigation on the right side of the screen to jump to the migration phase where you left off.

## Phase 1: Determine how many Azure file shares you need

With this migration guide, you must continue to use the on-premises direct attached storage (DAS) that contains your files. Data Box will be fed from that location and Azure File Sync will also be set up on that location. NAS (Network Attached Storage) does not work with this migration path.

You determine what syncs by setting up Azure File Sync *sync groups* that each determine where a set of files syncs between. Each sync group has at least one server location, called a *server endpoint* and one Azure file share, called the *cloud endpoint*. 

You can sync sub paths of a set of files to each their own Azure file share. This means setting up several sync groups to cover a set of files completely. The remainder of the section describes your options. If you need to restructure your data, you must do so as a first step, before you continue with this guide, order a Data Box or setup sync. 

> [!CAUTION]
> It's imperative that your file and folder structure is how you want it to be long-term, before you begin the migration. Avoid any unnecessary, folder restructuring during the migration. This will decrease positive effects of using Azure Data Box for initial, bulk transport of files to Azure.

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 3: Determine how many Azure Data Box appliances you need

Start this step only after you've finished the previous phase. Your Azure storage resources (storage accounts and file shares) should be created at this time. When you order your Data Box, you need to specify the storage accounts into which the Data Box is moving data.

In this phase, you need to map the results of the migration plan from the previous phase to the limits of the available Data Box options. These considerations will help you make a plan for which Data Box options to choose and how many of them you'll need to move your NAS shares to Azure file shares.

> [!NOTE]
> DataBox Disk is not supported because it does not preserve file fidelity.

To determine how many devices you need and their types, consider these important limits:

* Any Azure Data Box appliance can move data into up to 10 storage accounts. 
* Each Data Box option comes with its own usable capacity. See [Data Box options](#data-box-options).

Consult your migration plan to find the number of storage accounts you've decided to create and the shares in each one. Then look at the size of each of the shares on your NAS. Combining this information will allow you to optimize and decide which appliance should be sending data to which storage accounts. Two Data Box devices can move files into the same storage account, but don't split content of a single file share across two Data Boxes.

### Data Box options

For a standard migration, choose one or a combination of these Data Box options: 

* **Data Box**.
  This option is the most common one. Microsoft will send you a ruggedized Data Box appliance that works similar to a NAS. It has a usable capacity of 80 TiB. For more information, see [Data Box documentation](../../databox/data-box-overview.md).
* **Data Box Heavy**.
  This option features a ruggedized Data Box appliance on wheels that works similar to a NAS. It has a capacity of 1 PiB. The usable capacity is about 20 percent less because of encryption and file-system overhead. For more information, see [Data Box Heavy documentation](../../databox/data-box-heavy-overview.md).

> [!NOTE]
> For Data Box and Data Box Heavy, only copying data via SMB is supported. Copying data via the data copy service is not supported because it does not preserve file fidelity.

## Phase 4: Copy files onto your Data Box

When your Data Box arrives, you need to set it up in the line of sight to your NAS appliance. Follow the setup documentation for the type of Data Box you ordered:

* [Set up Data Box](../../databox/data-box-quickstart-portal.md).
* [Set up Data Box Heavy](../../databox/data-box-heavy-quickstart-portal.md).

Depending on the type of Data Box, Data Box copy tools might be available. At this point, we don't recommend them for migrations to Azure file shares because they don't copy your files to the Data Box with full fidelity. Use Robocopy instead.

When your Data Box arrives, it will have pre-provisioned SMB shares available for each storage account you specified when you ordered it.

* If your files go into a premium Azure file share, there will be one SMB share per premium "File storage" storage account.
* If your files go into a standard storage account, there will be three SMB shares per standard (GPv1 and GPv2) storage account. Only the file shares that end with `_AzFiles` are relevant for your migration. Ignore any block and page blob shares.

Follow the steps in the Azure Data Box documentation:

1. [Connect to Data Box](../../databox/data-box-deploy-copy-data.md).
1. Copy data to Data Box.
1. [Prepare your Data Box for upload to Azure](../../databox/data-box-deploy-picked-up.md).

The linked Data Box documentation specifies a Robocopy command. That command isn't suitable for preserving the full file and folder fidelity. Use this command instead:

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

## Phase 5: Deploy the Azure File Sync cloud resource

Before you continue with this guide, wait until all of your files have arrived in the correct Azure file shares. The process of shipping and ingesting Data Box data will take time.

[!INCLUDE [storage-files-migration-deploy-afs-sss](../../../includes/storage-files-migration-deploy-azure-file-sync-storage-sync-service.md)]

## Phase 6: Deploy the Azure File Sync agent

[!INCLUDE [storage-files-migration-deploy-afs-agent](../../../includes/storage-files-migration-deploy-azure-file-sync-agent.md)]

## Phase 7: Configure Azure File Sync on the existing Windows Server

Your registered on-premises Windows Server instance must be ready and connected to the internet for this process.

[!INCLUDE [storage-files-migration-configure-sync](../../../includes/storage-files-migration-configure-sync.md)]

:::row:::
    :::column:::
        [![An Azure portal section of the create server endpoint wizard is shown. A checkbox is highlighted that corresponds to the scenario of seeding the Azure file share with data. Check this box if you connect AFS to the same on-prem location from where you copied onto Data Box before.](media/storage-files-migration-server-hybrid-databox/enable-authoritative-upload-top-checkbox.png)](media/storage-files-migration-server-hybrid-databox/enable-authoritative-upload-top-checkbox-expanded.png#lightbox)
    :::column-end:::
    :::column:::
        Once you are in the **Create server endpoint** wizard, utilize the provided checkbox underneath the folder path. Only make this selection if you have entered a path that points to the same file and folder structure as can be found in the Azure file share (where Data Box moved the files and folders into for this namespace). </br> </br> If there is a mismatch of folder hierarchy, then that will present itself as differences that cannot be automatically resolved. Avoid a mismatch or any investment in the Data Box process will result in zero benefit to you. All data will be deleted in the Azure file share. All data will need to be uploaded from the local server. The directory structures must match to gain the benefit of a bulk-migration with Azure Data Box and a seamless update of the cloud share with the latest changes from the server.
:::column-end:::
:::row-end:::

> [!NOTE]
> Enabling this checkbox will set the **Initial sync** mode to *Authoritatively overwrite files and folders in the Azure file share with content in this server's path.* This option is only available for the first server endpoint in a sync group.

Once you configured authoritative upload for this new server endpoint, you can optionally enable cloud tiering.

Cloud tiering is the Azure File Sync feature that allows the local server to have less storage capacity than is stored in the cloud but have the full namespace available. Locally interesting data is also cached locally for fast access performance. Cloud tiering is optional. You can set it individually for each Azure File Sync server endpoint. Use this feature to achieve a fixed storage footprint on-premises, yet still give users a local performance cache, and store cooler data in the cloud.

Learn more by checking out the [cloud tiering overview](../file-sync/file-sync-cloud-tiering-overview.md) or take a closer look at the different [cloud tiering policies](../file-sync/file-sync-cloud-tiering-policy.md) you can use to fine-tune what is cached / tiered on the local server.

## Complete your migration

After you create a server endpoint, sync is working. But sync needs to enumerate (discover) the files and folders you moved via Azure Data Box into the Azure file share. Depending on the size of the namespace, it can take a long time before the latest server changes are synced to the cloud. Your users are not impacted and can continue to work with the data on the server. This strategy achieves a zero-downtime cloud migration.

For all Azure file shares / server locations that you need to configure for sync, repeat the steps to create sync groups and to add the matching server folders as server endpoints. You used Azure Data Box to move your files into several Azure file shares. Your migration is complete once you have created all the server endpoints that connect your on-premises data to these Azure file shares.

## Next steps

There's more to discover about Azure file shares and Azure File Sync. The following articles will help you understand advanced options and best practices. They also provide help with troubleshooting. These articles contain links to the [Azure file share documentation](storage-files-introduction.md) where appropriate.

* [Migration overview](storage-files-migration-overview.md)
* [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
* [Create a file share](storage-how-to-create-file-share.md)
* [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json)
