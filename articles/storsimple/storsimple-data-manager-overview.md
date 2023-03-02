---
title: Microsoft Azure StorSimple Data Manager overview | Microsoft Docs
description: Learn about the StorSimple Data Manager solution and how you can use this service to write applications that use StorSimple data and other Azure services.
services: storsimple
documentationcenter: NA
author: vidarmsft
manager: syadav
editor: ''

ms.assetid: 
ms.service: storsimple
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 08/18/2022
ms.author: alkohli
---

# StorSimple Data Manager overview

[!INCLUDE [storsimple-8000-eol-banner](../../includes/storsimple-8000-eol-banner-2.md)]

## Overview

Microsoft Azure StorSimple uses cloud storage as an extension of the on-premises solution and automatically tiers data across on-premises storage and the cloud. Data is stored in the cloud in a deduped and compressed format for maximum efficiency. As the data is stored in StorSimple format, it isn't readily consumable by other cloud applications that you may want to use.

The StorSimple Data Manager allows you to copy your StorSimple data to Azure file shares or Azure blob storage. This article focuses on the former.

In some scenarios, Azure blob storage can be the right choice, if file and folder structure, metadata, and backups are not important for you to preserve.
The remainder of this article provides an overview of the StorSimple Data Manager. It also explains how you can use this service to write applications that use StorSimple data and other Azure services in the cloud.

> [!IMPORTANT]
> To learn how to use the Data Manager to migrate and preserve your data, see [StorSimple 8100 and 8600 migration to Azure File Sync](../storage/files/storage-files-migration-storsimple-8000.md).

## Functional overview

The StorSimple Data Manager service identifies StorSimple data in the cloud from a StorSimple 8000 series on-premises device. The StorSimple data in the cloud is deduped, compressed StorSimple format. The Data Manager service provides APIs to extract the StorSimple format data and transform it into other formats such as Azure blobs and Azure Files. This transformed data is then consumed by Azure HDInsight and Azure Media services. The data transformation enables these services to operate on the transformed StorSimple data from StorSimple 8000 series on-premises device. This flow is illustrated in the following diagram.

![High-level diagram](./media/storsimple-data-manager-overview/storsimple-data-manager-overview2.png)


## Data Manager use cases

The primary use case for a Data Manager is the build-in migration service to leave the StorSimple platform.


## Choosing a region

The region of your Data Manager is not very important for copy performance. The Data Manager itself is a orchestrates migrations.
It is far more important to choose the correct region for your job definitions (migration jobs) within your Data Manager. 

Choose a region for your job definition that is either the same or near the region that contains the StorSimple storage account for your StorSimple source volumes. 

## Security considerations

The StorSimple Data Manager needs the service data encryption key to transform from StorSimple format to native format. The service data encryption key is generated when the first device registers with the StorSimple service. For more information on this key, go to [StorSimple security](storsimple-8000-security.md).

The service data encryption key provided as an input is stored in a key vault that is created when you create a Data Manager. The vault resides in the same Azure region as your StorSimple Data Manager. This key is deleted when you delete your Data Manager service.

This key is used by the compute resources to perform the transformation. These compute resources are located in the same Azure region as your job definition. This region may, or may not be the same as the region where you bring up your Data Manager.

If your Data Manager region is different from your job definition region, it is important that you understand what data/metadata resides in each of these regions. The following diagram illustrates the effect of having different regions for Data Manager and job definition.

![Service and job definition in different regions](./media/storsimple-data-manager-overview/data-manager-job-different-regions.png)

## Managing personal information

The StorSimple Data Manager does not collect or display any personal information. For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

## Known limitations

StorSimple Data Manager has different limitations, based on the storage you are moving your data into.
The following items prevent a migration regardless of target storage:

* Only NTFS volumes from your StorSimple appliance are supported.
* The service doesn't work with volumes that are BitLocker encrypted.
* The service can't copy data from a corrupted StorSimple backup.
* Special networking options, such as firewalls or private endpoint-only communication can't be enabled on either the source storage account where StorSimple backups are stored, nor on the target storage account that holds you Azure file shares.

### Target an Azure file share

There are also limitations on what can be stored in Azure file shares. It's important to understand them before a migration.
*File fidelity* refers to the multitude of attributes, timestamps, and data that compose a file. In a migration, file fidelity is a measure of how well the information on the source (StorSimple volume) can be translated (migrated) to the target (Azure file share).
[Azure Files supports a subset](/rest/api/storageservices/set-file-properties) of the [NTFS file properties](/windows/win32/fileio/file-attribute-constants). ACLs, common metadata, and some timestamps will be migrated. The following items won't prevent a migration but will cause per-item issues during a migration:

* Timestamps: File change time won't be set - it is currently read-only over the REST protocol. Last access timestamp on a file won't be moved, it currently isn't a supported attribute on files stored in an Azure file share.
* [Alternate Data Streams](/openspecs/windows_protocols/ms-fscc/b134f29a-6278-4f3f-904f-5e58a713d2c5) can't be stored in Azure file shares. Files holding Alternate Data Streams will be copied, but Alternate Data Streams are stripped from the file in the process.
* Symbolic links, hard links, junctions, and reparse points are skipped during a migration. The migration copy logs will list each skipped item and a reason.
* EFS encrypted files will fail to copy. Copy logs will show the item failed to copy with *Access is denied*.
* Corrupt files are skipped. The copy logs may list different errors for each item that is corrupt on the StorSimple disk: *The request failed due to a fatal device hardware error* or *The file or directory is corrupted or unreadable* or *The access control list (ACL) structure is invalid*.
* A single file can't be larger than 4 TiB or it'll be skipped in the migration.
* File path lengths must be equal to or fewer than 2048 characters. Files and folders with longer paths will be skipped.

### Target an Azure blob container

- Blob transfer limitations:
  - You can't migrate your backup history. Only the latest StorSimple volume backup can be used as a source.
  - File path lengths need to be fewer than 256 characters else the job will fail.
  - Maximum supported file size for a blob is 4.7 TiB.
  - Most recent available backup set will be used.
  - File metadata is not uploaded with the file content.
  - Uploaded blobs are of the Block Blob type. Thus, any uploaded VHD or VHDX can't be used in Azure Virtual Machines.

## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).
