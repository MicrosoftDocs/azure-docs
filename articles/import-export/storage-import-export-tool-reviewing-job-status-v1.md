---
title: Use logs to troubleshoot imports and exports via Azure Import/Export | Microsoft Docs
description: Learn how to review error/copy logs from imports and exports for data copy, upload issues.
author: alkohli
services: storage
ms.service: storage
ms.topic: how-to
ms.date: 12/20/2021
ms.author: alkohli
ms.subservice: common
---

# Use logs to troubleshoot imports and exports via Azure Import/Export

When the Microsoft Azure Import/Export service processes the drives that are associated with an import or export job, it writes copy logs and verbose logs to the storage account that you used for the import or export.

* The copy log reports the events that occurred for all failed copy operations between the disk and the Azure Storage account during the import or export. The copy log ends with a summary of errors by error category.

* The verbose log has a listing of all copy operations that succeeded on every blob and file.

## Locate the logs

When you use the Import/Export service to create an import or export job in Azure Data Box (Preview), you'll view the Import/Export job along with your other **Data Box** resources.

Use the following steps to find out the status of the data copies for an Import/Export job:

[!INCLUDE [storage-import-export-view-jobs-and-drives-preview.md](../../includes/storage-import-export-view-jobs-and-drives-preview.md)]

A copy log is saved automatically. If you chose to save verbose logs when you placed your order, you'll also see the path to the verbose log.

The logs are uploaded to a container (for blob imports and exports) or share (for imports to Azure Files) in the storage account. The container is named `databoxcopylog`. The URLs have these formats:

|Log type   |URL format|
|-----------|----------|
|copy log   |<*storage-account-name*>/databoxcopylog/<*order-name*>_<*device-serial-number*>&#95;CopyLog&#95;<*job-ID*>.xml |
|verbose log|<*storage-account-name*>/databoxcopylog/<*order-name*>_<*device-serial-number*>&#95;VerboseLog&#95;<*job-ID*>.xml|

For export jobs, a manifest file is saved to the disk. *NEEDS VERIFICATION >**If you chose to save a verbose log, the manifest is also saved in the storage account.

STOPPED HERE for interim check-in.







The log file contains detailed status about each file that was imported or exported.

The service returns the URL for each copy log file when you query the status of a completed job. For more information, see [Get Job](/rest/api/storageimportexport/Jobs/Get).  

## Example URLs

The following are example URLs for copy log files for an import job with two drives:  

 `http://myaccount.blob.core.windows.net/ImportExportStatesPath/waies/myjob_9WM35C2V_20130921-034307-902_error.xml`  

 `http://myaccount.blob.core.windows.net/ImportExportStatesPath/waies/myjob_9WM45A6Q_20130921-042122-021_error.xml`  


## Next steps

- [Review hard drive preparation steps for an import job](storage-import-export-data-to-blobs.md#step-1-prepare-the-drives).
- [Contact Microsoft Support](storage-import-export-contact-microsoft-support.md).
