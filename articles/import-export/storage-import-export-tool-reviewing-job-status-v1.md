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

Each data transfer for a disk generates a copy log. If you chose to save a verbose log when you created the order, there’s also a verbose log in the same folder.

## Verbose logs

The verbose log is an optional file that you can enable during ordering. It's a simple listing of all files that were successfully imported from the drive, with the following information for each file. The verbose log doesn’t provide summary information.

| Field       | Description                                  |
|-------------|----------------------------------------------|
| CloudFormat | BlockBlob, PageBlob, or AzureFile.           |
| Path        | Path to the file within the storage account. |
| Size        | File or blob size.                           |
| crc64       | The cyclic redundancy check 64 (CRC64) checksum that was used to verify data integrity during data transfer. |

### Sample verbose log: import

[!INCLUDE [data-box-disk-sample-verbose-log.md](../../includes/data-box-disk-sample-verbose-log.md)]

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


## Copy logs

The copy log contains an error entry for each file that failed to import or export, with error detail. The copy log ends with a summary of validation and copy errors that occurred during the data transfer.

Each error entry contains the following information.

| Field        | Description                                               |
|--------------|-----------------------------------------------------------|
| Path         | The destination share within the container or file share. |
| Category     | One of 15 error categories. For more information, see [Data upload errors](#data-transfer-errors). |
| ErrorCode    | The numeric code for the error.                           |
| ErrorMessage | Describes the error.                                      |

The summary at the end of the log (look for `CopyLog Summary`) gives the following information:

*	Drive log version (in this case, 2021-08-01)
*	Drive ID
*	Data copy status
*	Summary of validation errors by error category
*	Summary of copy errors by error category

### Sample copy log: import

[!INCLUDE [data-box-disk-sample-copy-log.md](../../includes/data-box-disk-sample-copy-log.md)]


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


## Next steps

- [Review hard drive preparation steps for an import job](storage-import-export-data-to-blobs.md#step-1-prepare-the-drives).
- [Contact Microsoft Support](storage-import-export-contact-microsoft-support.md).
