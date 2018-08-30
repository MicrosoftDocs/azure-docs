---
title: Backing up Azure Import/Export drive manifests | Microsoft Docs
description: Learn how to have your drive manifests for the Microsoft Azure Import/Export service backed up automatically.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.component: common
---

# Backing up drive manifests for Azure Import/Export jobs

Drive manifests can be automatically backed up to blobs by setting the `BackupDriveManifest` property to `true` in the [Put Job](/rest/api/storageimportexport/jobs#Jobs_CreateOrUpdate) or [Update Job Properties](/rest/api/storageimportexport/jobs#Jobs_Update) REST API operations. By default, the drive manifests are not backed up. The drive manifest backups are stored as block blobs in a container within the storage account associated with the job. By default, the container name is `waimportexport`, but you can specify a different name in the `DiagnosticsPath` property when calling the `Put Job` or `Update Job Properties` operations. The backup manifest blob are named in the following format: `waies/jobname_driveid_timestamp_manifest.xml`.

 You can retrieve the URI of the backup drive manifests for a job by calling the [Get Job](/rest/api/storageimportexport/jobs#Jobs_Get) operation. The blob URI is returned in the `ManifestUri` property for each drive.

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
