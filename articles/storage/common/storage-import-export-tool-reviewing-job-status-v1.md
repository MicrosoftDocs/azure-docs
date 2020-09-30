---
title: Reviewing Azure Import/Export job status - v1 | Microsoft Docs
description: Learn how to use the log files created by the import or export job to see the status of the job.
author: alkohli
services: storage
ms.service: storage
ms.topic: how-to
ms.date: 01/26/2017
ms.author: alkohli
ms.subservice: common
---

# Reviewing Azure Import/Export job status with copy log files
When the Microsoft Azure Import/Export service processes the drives that are associated with an import or export job, it writes copy log files to the storage account you used to import or export blobs. The log file contains detailed status about each file that was imported or exported. The service returns the URL for each copy log file when you query the status of a completed job. For more information, see [Get Job](https://docs.microsoft.com/rest/api/storageimportexport/Jobs/Get).  

## Example URLs

The following are example URLs for copy log files for an import job with two drives:  

 `http://myaccount.blob.core.windows.net/ImportExportStatesPath/waies/myjob_9WM35C2V_20130921-034307-902_error.xml`  

 `http://myaccount.blob.core.windows.net/ImportExportStatesPath/waies/myjob_9WM45A6Q_20130921-042122-021_error.xml`  

 See [Import/Export service Log File Format](../storage-import-export-file-format-log.md) for the format of copy logs and the full list of status codes.  

## Next steps

 * [Setting Up the Azure Import/Export Tool](storage-import-export-tool-setup-v1.md)   
 * [Preparing hard drives for an import job](../storage-import-export-tool-preparing-hard-drives-import-v1.md)   
 * [Repairing an import job](../storage-import-export-tool-repairing-an-import-job-v1.md)   
 * [Repairing an export job](../storage-import-export-tool-repairing-an-export-job-v1.md)
