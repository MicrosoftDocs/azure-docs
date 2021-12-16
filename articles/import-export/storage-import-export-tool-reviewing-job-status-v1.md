---
title: Review copy logs from imports and exports in Azure Import/Export | Microsoft Docs
description: Learn how to review copy logs from imports and exports to identify upload issues in Azure Import/Export.
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

## Data upload errors

The following errors are found in the copy logs for import job and/or export jobs.

| Error category                      | Error message     | Imports | Exports |
|-------------------------------------|-------------------|---------|---------|
| `UploadErrorWin32`                  |File system error. | Yes     | Yes     |
| `UploadErrorCloudHttp`              |Unsupported blob type. For more information about errors in this category, see [Summary of non-retryable upload errors](../databox/data-box-troubleshoot-data-upload.md#summary-of-non-retryable-upload-errors).| Yes     | Yes     |
| `UploadErrorDataValidationError`   |CRC computed during data ingestion doesn’t match the CRC computed during upload.<!--Verify. Message description for previous release.--> | Yes     | Yes     |
| `UploadErrorFilePropertyError`      |File Last Write time conversion failure. |
| `UploadErrorManagedConversionError` |The size of the blob being imported is invalid. The blob size is <*blob-size*> bytes. Supported sizes are between 20971520 Bytes and 8192 GiB. For more information, see [Summary of non-retryable upload errors](../databox/data-box-troubleshoot-data-upload.md#summary-of-non-retryable-upload-errors). | Yes     | Yes     |
| `UploadErrorUnknownType`            |Unknown error. | Yes     | Yes     |
| `ContainerRenamed`                  |Renamed the container as the original container name does not follow Azure conventions. | No     | Yes     |
| `ShareRenamed`                      |The original container/share/Blob has been renamed to: DataBox-<*GUID*> :from: New Folder :because either name has invalid character(s) or length is not supported| No     | Yes     |
| `BlobRenamed`                       |The original container/share/Blob has been renamed to BlockBlob/DataBox-<*GUID*> :from: <*original  name*> :because either the name has invalid character(s) or the length is not supported.| No     | Yes     |
| `FileRenamed`                       |The original container/share/Blob has been renamed to: AzureFile/DataBox-<*GUID*> :from: <*original name*> :because either the name has invalid character(s) or the length is not supported. | No     | Yes     |
| `DiskRenamed`                       |The original container/share/Blob has been renamed to: ManagedDisk/DataBox-<*GUID*> :from: <*original name*> :because either the name has invalid character(s) or the length is not supported. | No     | Yes     |
| `FileNameTrailsWithSlash`           |Blob name or file name ends with a trailing slash. | Yes     | No     |
| `ExportCloudHttp`                   |Unsupported blob type. | Yes     | Yes     |

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