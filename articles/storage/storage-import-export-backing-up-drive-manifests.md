---
title: Backing up drive manifests | MicrosoftDocs
description: Learn how to automatically have your drive manifests for the Microsoft Azure Import-Export Service backed up.
author: renashahmsft
manager: aungoo
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: 594abd80-b834-4077-a474-d8a0f4b7928a
ms.service: storage
ms.workload: storage 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2015
ms.author: renash

---

# Backing Up Drive Manifests
Drive manifests can be automatically backed up to blobs by setting the `BackupDriveManifest` property to `true` in the [Put Job](../importexport/Put-Job.md) or [Update Job Properties](../importexport/Update-Job-Properties.md) operations. By default the drive manifests are not backed up. The drive manifest backups are stored as block blobs in a container within the storage account associated with the job. By default, the container name is `waimportexport`, but you can specify a different name in the `ImportExportStatesPath` property when calling the `Put Job` or `Update Job Properties` operations. The backup manifest blob are named in the following format: `waies/jobname_driveid_timestamp_manifest.xml`.  
  
 You can retrieve the URI of the backup drive manifests for a job by calling the [Get Job](../importexport/Get-Job3.md) operation. The blob URI is returned in the `ManifestUri` property for each drive.  
  
## See Also  
 [Using the Import/Export Service REST API](../importexport/Using-the-Azure-Import-Export-Service-REST-API.md)