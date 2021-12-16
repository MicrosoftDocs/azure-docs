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

## Sample logs

This section provides sample verbose logs and copy logs for import and export jobs in Azure Import/Export.

### Sample verbose log: import

The following sample is a copy log for an import to both Azure Files and Azure Blob storage.

[!INCLUDE [data-box-disk-sample-verbose-log.md](../../includes/data-box-disk-sample-verbose-log.md)]

### Sample copy log: import

[!INCLUDE [data-box-disk-sample-copy-log.md](../../includes/data-box-disk-sample-copy-log.md)]

### Sample verbose log: export

In the following sample verbose log, the export job transferred three blobs from Azure Blob storage.

<!--Simplify the Path entries!-->

```xml
<File CloudFormat="BlockBlob" ETag="0x8D804D87F976907" Path="export-ut-invaliddirblobpath/movie/sc%3Aifi/block.blob" Size="4096" crc64="16033727819182370206">
</File><File CloudFormat="BlockBlob" ETag="0x8D804D889880CC6" Path="export-ut-invaliddirblobpath/movie/sc#Aifi/block.blob" Size="4096" crc64="16033727819182370206">
</File><File CloudFormat="BlockBlob" ETag="0x8D804D8F1BC81C0" Path="export-ut-invaliddirblobpath/@GMT-2001.03.30-14.44.00/block.blob" Size="4096" crc64="16033727819182370206">
</File>
```

Each entry in the verbose log for an export has the following fields:

| Field       | Description                                  |
|-------------|----------------------------------------------|
| CloudFormat | BlockBlob, PageBlob, or AzureFile.           |
| Etag        | The entity tag (ETag) for the resource, which is used for concurrency checking during the data transfer. |
| Path        | Path to the file within the storage account. |
| Size        | File or blob size.                           |
| crc64       | Checksum when cyclic redundancy check 64 (CRC64) was used to verify data integrity during data transfer. |
| md5         | Checksum when Message Digest Algorithm 5 (MD5) was used to verify data integrity during data transfer. |

### Sample copy log: export

The following is a sample copy log for an export that encountered three file system errors ( `UploadErrorWin32`) that caused the export of three files to fail. Error 267 indicates the directory name is invalid. Error 123 indicates an incorrect filename, directory name, or volume label syntax.

```xml
<ErroredEntity CloudFormat="BlockBlob" Path="export-ut-invaliddirblobpath/movie/sc:Aifi/block.blob">
  <Category>UploadErrorWin32</Category>
  <ETag>0x8D804D8840B92C9</ETag>
  <ErrorCode>267</ErrorCode>
  <ErrorMessage>File Create failed</ErrorMessage>
  <Type>File</Type>
</ErroredEntity><ErroredEntity CloudFormat="BlockBlob" Path="export-ut-invaliddirblobpath/movie/sc-Aifi/block.blob">
  <Category>UploadErrorWin32</Category>
  <ETag>0x8D804D8AD026B2A</ETag>
  <ErrorCode>123</ErrorCode>
  <ErrorMessage>File Create failed</ErrorMessage>
  <Type>File</Type>
</ErroredEntity><ErroredEntity CloudFormat="BlockBlob" Path="export-ut-invaliddirblobpath/movie/sc*Aifi/block.blob">
  <Category>UploadErrorWin32</Category>
  <ETag>0x8D804D8A858F705</ETag>
  <ErrorCode>123</ErrorCode>
  <ErrorMessage>File Create failed</ErrorMessage>
  <Type>File</Type>
</ErroredEntity><CopyLog Summary="Summary">
  <DriveLogVersion>2021-08-01</DriveLogVersion>
  <DriveId>cb57dbe8-0b67-45e0-ad40-a08fb5305c60</DriveId>
  <Status>Failed</Status>
  <TotalFiles_Blobs>9</TotalFiles_Blobs>
  <FilesErrored>6</FilesErrored>
  <Summary>
    <ValidationErrors>
      <None Count="3" />
    </ValidationErrors>
    <CopyErrors>
      <UploadErrorWin32 Count="3" Description="File Create failed because of UploadErrorWin32 exception" />
    </CopyErrors>
  </Summary>
</CopyLog>
```


## Data transfer errors

The following errors are found in the copy logs for import job and/or export jobs.

| Error category                      | Error message     | Imports | Exports |
|-------------------------------------|-------------------|---------|---------|
| `UploadErrorWin32`                  |File system error. | Yes     | Yes     |
| `UploadErrorCloudHttp`              |Unsupported blob type. For more information about errors in this category, see [Summary of non-retryable upload errors](../databox/data-box-troubleshoot-data-upload.md#summary-of-non-retryable-upload-errors).|Yes |Yes |
| `UploadErrorDataValidationError`   |CRC computed during data ingestion doesn’t match the CRC computed during upload. |Yes |Yes |
| `UploadErrorFilePropertyError`      |File Last Write time conversion failure. |Yes |Yes |
| `UploadErrorManagedConversionError` |The size of the blob being imported is invalid. The blob size is <*blob-size*> bytes. Supported sizes are between 20971520 Bytes and 8192 GiB. For more information, see [Summary of non-retryable upload errors](../databox/data-box-troubleshoot-data-upload.md#summary-of-non-retryable-upload-errors). |Yes |Yes |
| `UploadErrorUnknownType`            |Unknown error. |Yes |Yes |
| `ContainerRenamed`                  |Renamed the container as the original container name does not follow Azure conventions. |No |Yes |
| `ShareRenamed`                      |The original container/share/Blob has been renamed to DataBox-<*GUID*> from <*New Folder*> because either the name has invalid character(s) or the length is not supported |No |Yes |
| `BlobRenamed`                       |The original container/share/Blob has been renamed to BlockBlob/DataBox-<*GUID*> from: <*original name*> because either the name has invalid character(s) or the length is not supported.|No |Yes |
| `FileRenamed`                       |The original container/share/Blob has been renamed to AzureFile/DataBox-<*GUID*> from <*original name*> because either the name has invalid character(s) or the length is not supported. |No |Yes |
| `DiskRenamed`                       |The original container/share/Blob-<*original name*> has been renamed to ManagedDisk/DataBox-<*new name*> because either the name has invalid character(s) or the length is not supported. |No |Yes |
| `FileNameTrailsWithSlash`           |Blob name or file name ends with a trailing slash. |Yes |No |
| `ExportCloudHttp`                   |Unsupported blob type. |Yes |Yes |

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