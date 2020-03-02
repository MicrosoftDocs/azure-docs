---
title: Reviewing Azure Import/Export job status - v1 | Microsoft Docs
description: Learn how to use the log files created when the import or export job was run to see the status of the Import/Export job.
author: twooley
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/26/2017
ms.author: twooley
ms.subservice: common
---

# Reviewing Azure Import/Export job status with copy log files
When the Microsoft Azure Import/Export service processes drives associated with an import or export job, it writes copy log files to the storage account to or from which you are importing or exporting blobs. The log file contains detailed status about each file that was imported or exported. The URL to each copy log file is returned when you query the status of a completed job; see [Get Job](https://docs.microsoft.com/rest/api/storageimportexport/Jobs/Get) for more information.  

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
 * [Troubleshooting the Azure Import/Export Tool](storage-import-export-tool-troubleshooting-v1.md)
