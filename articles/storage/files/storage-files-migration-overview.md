---
title: Migrate to Azure file shares
description: Learn about migrations to Azure file shares and find your migration guide.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 3/18/2020
ms.author: fauhse
ms.subservice: files
---

# Migrate to Azure file shares

This article covers the basic aspects of a migration to Azure file shares.

Alongside migration basics, this article contains a list of existing, individualized migration guides. These migration guides help you move your files into Azure file shares and are organized by where your data resides today and what deployment model (cloud-only or hybrid) you plan on moving to.

## Migration basics

There are multiple different types of cloud storage available in Azure. A fundamental aspect of a migration of files to Azure is to determine which Azure storage option is right for your data.

Azure file shares are great for general purpose file data. Really anything you use an on-premises SMB or NFS share for. With [Azure File Sync](storage-sync-files-planning.md), you can optionally cache the contents of several Azure file shares on several Windows Servers on-premises.

If you have an application currently running on an on-premises server, then storing files in Azure file shares can be right for you, depending on the application. You can lift the application to run in Azure and use Azure file shares as shared storage. You can also consider [Azure Disks](../../virtual-machines/windows/managed-disks-overview.md) for this scenario. For cloud-born applications that don't depend on the SMB or machine-local access to their data or shared access, object storage, such as [Azure blobs](../blobs/storage-blobs-overview.md), is often the best choice.

The key in any migration is to capture all the applicable file fidelity when migrating your files from their current storage location to Azure. A help in picking the right Azure storage is also the aspect of how much fidelity supported by the Azure storage option and is required by your scenario. General purpose file data traditionally depends on file metadata. Application data might not. There are two basic components to a file:

- **Data stream**: The data stream of a file stores the file content.
- **File metadata**: The file meta data has several sub components:
   * File attributes: Read-only, for instance.
   * File permissions: Referred to as *NTFS permissions* or *file and folder ACLs*.
   * Timestamps: Most notably the *create-* and *last modified-* timestamps.
   * Alternative data stream: A space to store larger amounts of non-standard properties.

File fidelity, in a migration, can therefore be defined as the ability to store all applicable file information on the source, the ability to transfer them with the migration tool and the ability to store them on the target storage of the migration.

To ensure your migration proceeds as smoothly as possible, identify [the best copy tool for your needs](#migration-toolbox) and match a storage target to your source.

Taking the previous information into account, it becomes clear what the target storage for general purpose files in Azure is: [Azure file shares](storage-files-introduction.md). Compared to object storage in Azure blobs, file metadata can be natively stored on files in an Azure file share.

Azure file shares also preserve the file and folder hierarchy. Additionally:
* NTFS permissions can be stored on files and folders as they are on-premises.
* AD users (or Azure AD DS users) can natively access an Azure file share. 
    They use their current identity and get access based on share permissions as well as file and folder ACLs. A behavior not unlike when users connect to an on-premises file share.
*  The alternative data stream is the primary aspect of file fidelity that currently cannot be stored on a file in an Azure file share.
   It is preserved on-premises when Azure File Sync is involved.

* [Learn more about AD authentication for Azure file shares](storage-files-identity-auth-active-directory-enable.md)
* [Learn more about Azure Active Directory Domain Services (AAD DS) authentication for Azure file shares](storage-files-identity-auth-active-directory-domain-service-enable.md)

## Migration guides

The following table lists detailed migration guides.

Navigate it by:
1. Locate the row for the source system your files are currently stored on.
2. Decide if you target a hybrid deployment where you use Azure File Sync to cache the content of one or more Azure file shares on-premises, or if you like to use Azure file shares directly in the cloud. Select the target column that reflects your decision.
3. Within the intersection of source and target, a table cell lists available migration scenarios. Select one of them to directly link to the detailed migration guide.

A scenario without a link does not yet have a published migration guide. Check this table occasionally for updates. New guides will be published when available.

| Source | Target: </br>Hybrid deployment | Target: </br>Cloud-only  deployment |
|:---|:--|:--|
| | Tool combination:| Tool combination: |
| Windows Server 2012 R2 and newer | <ul><li>[Azure File Sync](storage-sync-files-deployment-guide.md)</li><li>[Azure File Sync + DataBox](storage-sync-offline-data-transfer.md)</li><li>Storage Migration Service + Azure File Sync</li></ul> | <ul><li>Azure File Sync</li><li>Azure File Sync + DataBox</li><li>Storage Migration Service + Azure File Sync</li><li>RoboCopy</li></ul> |
| Windows Server 2012 and older | <ul><li>Azure File Sync + DataBox</li><li>Storage Migration Service + Azure File Sync</li></ul> | <ul><li>Storage Migration Service + Azure File Sync</li><li>RoboCopy</li></ul> |
| Network Attached Storage (NAS) | <ul><li>[Azure File Sync + RoboCopy](storage-files-migration-nas-hybrid.md)</li></ul> | <ul><li>RoboCopy</li></ul> |
| Linux / Samba | <ul><li>[RoboCopy + Azure File Sync](storage-files-migration-linux-hybrid.md)</li></ul> | <ul><li>RoboCopy</li></ul> |
| StorSimple 8100 / 8600 | <ul><li>[Azure File Sync + 8020 Virtual Appliance](storage-files-migration-storsimple-8000.md)</li></ul> | |
| StorSimple 1200 | <ul><li>[Azure File Sync](storage-files-migration-storsimple-1200.md)</li></ul> | |
| | | |

## Migration toolbox

### File copy tools

There are several Microsoft and non-Microsoft file copy tools available. In order to select the right file copy tool for your migration scenario, you must consider three fundamental questions:

* Does the copy tool support the source and the target location for a given file copy? 
    * Does it support your network path and/or available protocols (for instance REST/SMB/NFS) to and from the source and target storage locations?
* Does the copy tool preserve the necessary file fidelity that is supported by the source/target location? In some cases, your target storage does not support the same fidelity as your source. You have already made the decision that the target storage is sufficient for your needs, hence the copy tool only needs to match the targets file fidelity capabilities.
* Does the copy tool have features that make it fit into my migration strategy? 
    * For example, consider if it has options that allow you to minimize your downtime. A good question to ask is: Can I run this copy multiple times on the same, by users actively accessed location? If so, you can reduce the amount of downtime significantly. Compare that to a situation where you can only start the copy when the source stops changing, to guarantee a complete copy.

The following table classifies Microsoft tools and their current suitability for Azure file shares:

| Recommended | Tool | Supports Azure file shares | Preserves file fidelity |
| :-: | :-- | :---- | :---- |
|![Yes, recommended.](media/storage-files-migration-overview/circle-green-checkmark.png)| RoboCopy | Supported. Azure file shares can be mounted as network drives. | Full fidelity* |
|![Yes, recommended.](media/storage-files-migration-overview/circle-green-checkmark.png)| Azure File Sync | Natively integrated into Azure file shares. | Full fidelity* |
|![Yes, recommended.](media/storage-files-migration-overview/circle-green-checkmark.png)| Storage Migration Service (SMS) | Indirectly supported. Azure file shares can be mounted as network drives on an SMS target server. | Full fidelity* |
|![Not fully recommended.](media/storage-files-migration-overview/triangle-yellow-exclamation.png)| Azure DataBox | Supported. | Does not copy metadata. [Can be used in combination with Azure File Sync](storage-sync-offline-data-transfer.md). |
|![Not recommended.](media/storage-files-migration-overview/circle-red-x.png)| AzCopy | Supported. | Does not copy metadata. |
|![Not recommended.](media/storage-files-migration-overview/circle-red-x.png)| Azure Storage Explorer | Supported. | Does not copy metadata. |
|![Not recommended.](media/storage-files-migration-overview/circle-red-x.png)| Azure Data Factory | Supported. | Does not copy metadata. |
|||||

*\* Full fidelity: meets or exceeds Azure file share capabilities.*

### Migration helper tools

This section lists tools that help plan and execute migrations.

* **RoboCopy, from Microsoft Corporation**

    One of the most applicable copy tools to file migrations, comes as part of Microsoft Windows. Due to the many options in this tool, the main [RoboCopy documentation](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy) is a helpful source.

* **TreeSize, from JAM Software GmbH**

    Azure File Sync primarily scales with the number of items (files and folders) and less so with the total TiB amount. The tool can be used to determine the number of files and folders on your Windows Server volumes. Furthermore it can be used to create a perspective before an [Azure File Sync deployment](storage-sync-files-deployment-guide.md) - but also after, when cloud tiering is engaged and you like to see not only the number of items but also in which directories your server cache is used the most.
    This tool (tested version 4.4.1) is compatible with cloud tiered files. It will not cause recall of tiered files during its normal operation.


## Next steps

1. Create a plan for which deployment of Azure file shares (cloud-only or hybrid) you strive for.
2. Review the list of available migration guides to find the detailed guide that matches your source and deployment of Azure file shares.

There is more information available about the Azure Files technologies mentioned in this article:

* [Azure file share overview](storage-files-introduction.md)
* [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
* [Azure File Sync: Cloud tiering](storage-sync-cloud-tiering.md)
