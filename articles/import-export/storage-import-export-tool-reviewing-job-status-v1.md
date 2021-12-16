---
title: Review copy logs from imports and exports in Azure Import/Export | Microsoft Docs
description: Learn how to review error/copy logs from imports and exports for data copy, upload issues.
author: alkohli
services: storage
ms.service: storage
ms.topic: how-to
ms.date: 12/16/2021
ms.author: alkohli
ms.subservice: common
---

# Review copy logs from imports and exports via Azure Import/Export

When the Microsoft Azure Import/Export service processes the drives that are associated with an import or export job, it writes copy log files to the storage account you used to import or export blobs. 

The log file contains detailed status about each file that was imported or exported. 

The service returns the URL for each copy log file when you query the status of a completed job. For more information, see [Get Job](/rest/api/storageimportexport/Jobs/Get).

## Locate the logs

To locate the logs for the job, do the following steps.

[!INCLUDE [data-box-disk-locate-logs.md](../../includes/data-box-disk-locate-logs.md)]

## Sample verbose log: imports

The following sample is a copy log for an import to both Azure Files and Azure Blob storage.

[!INCLUDE [data-box-disk-sample-verbose-log.md](../../includes/data-box-disk-sample-verbose-log.md)]

## Sample copy log: imports

[!INCLUDE [data-box-disk-sample-copy-log.md](../../includes/data-box-disk-sample-copy-log.md)]


<!--## Example URLs

The following are example URLs for copy log files for an import job with two drives:  

 `http://myaccount.blob.core.windows.net/ImportExportStatesPath/waies/myjob_9WM35C2V_20130921-034307-902_error.xml`  

 `http://myaccount.blob.core.windows.net/ImportExportStatesPath/waies/myjob_9WM45A6Q_20130921-042122-021_error.xml`  

--> 

## Next steps

<!--* [Setting Up the Azure Import/Export Tool](storage-import-export-tool-setup-v1.md) ARCHIVED-->
 * [Preparing hard drives for an import job](storage-import-export-data-to-blobs.md#step-1-prepare-the-drives)   
<!--* [Repairing an import job](./storage-import-export-tool-repairing-an-import-job-v1.md)-->  
<!--* [Repairing an export job](./storage-import-export-tool-repairing-an-export-job-v1.md)-->