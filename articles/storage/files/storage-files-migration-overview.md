---
title: Migration to Azure file shares - Overview
description: Learn about migrations to Azure file shares and find your migration guide.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 3/18/2020
ms.author: fauhse
ms.subservice: files
---

# Overview - Migration to Azure file shares

In this article, you will learn about the basic aspects of a migration to Azure file shares.
Individual migration guides exist, that help you move your files into Azure file shares. These guides are structured by the source your files reside in today and the target deployment (cloud-only or a hybrid deployment) you are planning to move to.

## The basics of any file migration

There are multiple different types of cloud storage available in Azure. Often questions arise around the right type of storage and the choice of Azure file shares versus object storage in Azure blobs. Fundamentally, only Azure file shares support a range of fidelity features that is ideally suited to natively store your general purpose file data in Azure.

The key in any migration is to capture all the applicable file fidelity when migrating your files from their current storage location to Azure. There are two basic components to a file:

1. **Data stream**: The data stream of a file stores the file content.
2. **File metadata**: The file meta data has several sub components:
    * file attributes: read-only, for instance
    * file permissions: referred to as *NTFS permissions* or *file and folder ACLs*
    * timestamps: most notably the *create-* and *last modified-* timestamps
    * alternative data stream: a space to store larger amounts of non-standard properties

File fidelity, in a migration, can therefore be defined as the ability to store all applicable file information on the source, the ability to transfer them with the migration tool and the ability to store them on the target storage of the migration.

The complexity in any file migration project is to match a storage target to your source and use a fidelity preserving copy tool to get your files there.

In that context, it becomes clear what the target storage for general purpose files in Azure is: **[Azure file shares]**. Compared to object storage in Azure blobs, file metadata can be natively stored on files in an Azure file share.
The one aspect of files that cannot be stored in a file share at this time, is the alternative data stream.

**[Learn more about file fidelity in Azure file shares]**

Azure file shares also preserve the file and folder hierarchy. Additionally, they not only allow for NTFS permissions to be stored, but also allowing your AD users (or AAD DS users) to natively access an Azure file share. They use their current identity and get access based on share permissions as well as file and folder ACLs. A behavior not unlike when users connect to an on-premises file share.

* [Learn more about AD authentication for Azure file shares](storage-files-identity-auth-active-directory-enable.md)
* [Learn more about Azure Active Directory Domain Services (AAD DS) authentication for Azure file shares](storage-files-identity-auth-active-directory-domain-service-enable.md)

## Migration guides

The following table lists detailed migration guides.

Navigate it by:
1. Locate the row for the source system your files are currently stored on.
2. Decide if you target a hybrid deployment where you use Azure File Sync to cache the content of one or more Azure file shares on-premises, or if you like to use Azure file shares directly in the cloud. Select the target column that reflects your decision.
3. Within the intersection of source and target, a table cell lists available migration scenarios. Select one of them to directly link to the detailed migration guide.

A scenario without a link does not yet have a published migration guide. Check this table occasionally. New guides are frequently added.

| **Source** | Target: </br>Hybrid deployment | Target: </br>Cloud-only  deployment |
|:---|:--|:--|
| Windows Server 2012 R2 and newer | <ul><li>[Azure File Sync](storage-sync-files-deployment-guide.md)</li><li>[Azure File Sync + DataBox](storage-sync-offline-data-transfer.md)</li><li>Storage Migration Service + Azure File Sync</li></ul> | <ul><li>Azure File Sync</li><li>Azure File Sync + DataBox</li><li>Storage Migration Service + Azure File Sync</li><li>RoboCopy</li></ul> |
| Windows Server 2012 and older | <ul><li>Azure File Sync + DataBox</li><li>Storage Migration Service + Azure File Sync</li></ul> | <ul><li>Storage Migration Service + Azure File Sync</li><li>RoboCopy</li></ul> |
| Network Attached Storage (NAS) | <ul><li>Azure File Sync + RoboCopy</li></ul> | <ul><li>RoboCopy</li></ul> |
| Linux / Samba | <ul><li>RoboCopy + Azure File Sync</li></ul> | <ul><li>RoboCopy</li></ul> |
| StorSimple 8100 / 8600 | <ul><li>[Azure File Sync + 8020 Virtual Appliance](storage-files-migration-storsimple-8000.md)</li></ul> | |
| StorSimple 1200 | <ul><li>[Azure File Sync](storage-files-migration-storsimple-1200.md)</li></ul> | |
| | | |

## Migration Toolbox

### File copy tools

There are several Microsoft and non-Microsoft file copy tools available. In order to choose the right tool for a migration scenario, there are three fundamental questions one must consider:

1. Does the copy tool support the source and the target location for a given file copy? While this requirement appears to be obvious, it is worth looking a layer deeper: Does it support your network path and/or available protocols (for instance REST/SMB/NFS) to and from the source and target storage locations?
2. Does the copy tool preserve the necessary file fidelity that is supported by the source/target location? In some cases, your target storage does not support the same fidelity as your source. You have already made the decision that the target storage is sufficient for your needs, hence the copy tool only needs to match the targets file fidelity capabilities.
3. Does the copy tool have features that make it fit into my migration strategy? For instance, consider if it has options that allow you to minimize your downtime. A good question to ask is: Can I run this copy multiple times on the same, by users actively accessed location? If so, you can reduce the amount of downtime significantly. Compare that to a situation where you can only start the copy when the source stops changing, in order to guarantee a complete copy.

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

This category lists tools that help with planning and executing migrations.

* RoboCopy, from Microsoft Corporation

    One of the most well-rounded copy tools available, comes out-of-the-box with Microsoft Windows.Due to the many options in this tool, the main [RoboCopy documentation](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy) is a helpful source.
    </br></br>

* TreeSize, from JAM Software GmbH

    Azure File Sync primarily scales with the number of items (files and folders) in a sync scope and less so with the total TiB amount. The tool below can be used to determine the number of files and folders on your Windows Server volumes. Furthermore it can be used to create a perspective before an [Azure File Sync deployment](storage-sync-files-deployment-guide.md) - but also after, when cloud tiering is engaged and you like to see not only the number of items but also in which directories your server cache is used the most.
    This tool (tested version 4.4.1) is compatible with cloud tiered files. It will not cause recall of tiered files during its normal operation.
