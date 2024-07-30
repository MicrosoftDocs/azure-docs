---
title: Use logs to troubleshoot imports and exports via Azure Import/Export | Microsoft Docs
description: Learn how to review error/copy logs from imports and exports for data copy, upload issues.
author: v-dalc
services: storage
ms.service: azure-import-export
ms.topic: how-to
ms.date: 03/14/2022
ms.author: alkohli

---

# Use logs to troubleshoot imports and exports via Azure Import/Export

When the Microsoft Azure Import/Export service processes the drives for an import or export job, the service writes copy logs and verbose logs to the storage account that you used. Both logs are saved for each drive.

[!INCLUDE [storage-import-export-verbose-log-copy-log-descriptions.md](../../includes/storage-import-export-verbose-log-copy-log-descriptions.md)]

## Locate the logs

When you use the Import/Export service to create an import or export job in Azure Data Box, you'll view the Import/Export job along with your other **Data Box** resources.

Use the following steps to find out the status of the data copies for an Import/Export job:

[!INCLUDE [storage-import-export-view-jobs-and-drives.md](../../includes/storage-import-export-view-jobs-and-drives.md)]

A copy log is saved automatically. If you chose to save verbose logs when you placed your order, you'll also see the path to the verbose log.

The logs are uploaded to a container (for blob imports and exports) or share (for imports to Azure Files) in the storage account. The container is named `databoxcopylog`. The URLs have these formats:

|Log type   |URL format|
|-----------|----------|
|copy log   |<*storage-account-name*>/databoxcopylog/<*order-name*>_<*device-serial-number*>&#95;CopyLog&#95;<*job-ID*>.xml |
|verbose log|<*storage-account-name*>/databoxcopylog/<*order-name*>_<*device-serial-number*>&#95;VerboseLog&#95;<*job-ID*>.xml|

For export jobs, a manifest file also is saved to the disk.

Each data transfer for a disk generates a copy log. If you chose to save a verbose log when you created the order, there’s also a verbose log in the same folder.

> [!NOTE]
> For your earlier orders, you might find an error log (_error.xml) along with the verbose log in a `waies` container in the storage account. The `DriveLog Version`, shown in the error log summary, will be `2018-10-01`. The log formats differ from those described in this article.

## Review import logs

During an import, the Import/Export service generates a verbose log and a copy log for each disk.

### Verbose log

The verbose log is an optional file that you can enable during ordering. It's a simple listing of all files that were successfully imported from the drive. The verbose log gives the following information for each file. The verbose log doesn’t provide summary information.

| Field       | Description                                  |
|-------------|----------------------------------------------|
| CloudFormat | BlockBlob, PageBlob, or AzureFile.           |
| Path        | Path to the file within the storage account. |
| Size        | File or blob size.                           |
| crc64       | The cyclic redundancy check 64 (CRC64) checksum that was used to verify data integrity during data transfer. |

#### Sample verbose log: import

[!INCLUDE [data-box-disk-sample-verbose-log.md](../../includes/data-box-disk-sample-verbose-log.md)]

### Copy log

The copy log contains an error entry for each file that failed to import or export, with error detail. The copy log ends with a summary of validation and copy errors that occurred during the data transfer.

Each error entry contains the following information.

| Field        | Description                                               |
|--------------|-----------------------------------------------------------|
| Path         | The destination share within the container or file share. |
| Category     | Identifies the error category. For more information, see [Data transfer errors](#data-transfer-errors). |
| ErrorCode    | The numeric code for the error.                           |
| ErrorMessage | Describes the error.                                      |

The summary at the end of the log (look for `CopyLog Summary`) gives the following information:

*	Drive log version (in this case, `2021-08-01`)
*	Drive ID
*	Data copy status
*	Summary of validation errors by error category
*	Summary of copy errors by error category

#### Sample copy log: import

[!INCLUDE [data-box-disk-sample-copy-log.md](../../includes/data-box-disk-sample-copy-log.md)]

## Review export logs

During an export, the Import/Export service generates a verbose log and a copy log for each data transfer from Azure Storage to a disk. There's also a manifest file, which is saved to the disk.

### Verbose log

The verbose log for an export is a simple listing of all files that were successfully exported from the Azure storage account to the drive. The verbose log gives the following information for each file. The verbose log doesn’t provide summary information.

| Field       | Description                                  |
|-------------|----------------------------------------------|
| CloudFormat | BlockBlob, PageBlob, or AzureFile.           |
| Etag        | The entity tag (ETag) for the resource, which is used for concurrency checking during the data transfer. |
| Path        | Path to the file within the storage account. |
| Size        | File or blob size.                           |
| crc64       | The cyclic redundancy check 64 (CRC64) checksum that was computed while exporting data to disk. |


#### Sample verbose log: export

In the following sample verbose log, the export job successfully transferred three blobs from Azure Blob storage.

```xml
<File CloudFormat="BlockBlob" ETag="0x8D804D87F976907" Path="export-blobs/movie/sc%3Aifi/block.blob" Size="4096" crc64="16033727819182370206">
</File><File CloudFormat="BlockBlob" ETag="0x8D804D889880CC6" Path="export-blobs/movie/sc#Aifi/block.blob" Size="4096" crc64="16033727819182370206">
</File><File CloudFormat="BlockBlob" ETag="0x8D804D8F1BC81C0" Path="export-blobs/@GMT-2001.03.30-14.44.00/block.blob" Size="4096" crc64="16033727819182370206">
</File>
```

### Copy log

The copy log for an export contains an error entry for each file that failed to transfer successfully from Azure Storage to the disk, with error detail. The copy log ends with a summary of validation and copy errors that occurred during the data transfer.

The copy log for an export reports issues such as a data transfer that fail because of a damaged drive or a storage account key that changed during data transfer. For a list of issues, see [Data transfer errors](#data-transfer-errors).

#### Sample copy log: export

The following sample is a copy log for an export that came across three file system errors ( `UploadErrorWin32`) that caused the export of three files to fail. Error **267** indicates the directory name is invalid. Error **123** indicates an incorrect filename, directory name, or volume label syntax.

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

You'll find the following errors in the copy logs for import jobs and/or export jobs.

| Error category                      | Error message     | Imports | Exports |
|-------------------------------------|-------------------|---------|---------|
| `UploadErrorWin32`                  |File system error. | Yes     | Yes     |
| `UploadErrorCloudHttp`              |Unsupported blob type. For more information about errors in this category, see [Summary of upload errors](../databox/data-box-troubleshoot-data-upload.md#summary-of-upload-errors).|Yes |Yes |
| `UploadErrorDataValidationError`    |CRC computed during data ingestion doesn’t match the CRC computed during upload. |Yes |Yes |
| `UploadErrorManagedConversionError` |The size of the blob being imported is invalid. The blob size is <*blob-size*> bytes. Supported sizes are between 20971520 Bytes and 8192 GiB. For more information, see [Summary of upload errors](../databox/data-box-troubleshoot-data-upload.md#summary-of-upload-errors). |Yes |Yes |
| `UploadErrorUnknownType`            |Unknown error. |Yes |Yes |
| `ContainerRenamed`                  |Renamed the container because the original container name doesn't follow [Azure naming conventions](../databox/data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). The original container has been renamed to DataBox-<*GUID*> from <*original container name*>. |No |Yes |
| `ShareRenamed`                      |Renamed the share because the original share name doesn't follow [Azure naming conventions](../databox/data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). The original share has been renamed to DataBox-<*GUID*> from <*original folder name*>. |No |Yes |
| `BlobRenamed`                       |Renamed the blob because the original blob name doesn't follow [Azure naming conventions](../databox/data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). The original blob has been renamed to BlockBlob/DataBox-<*GUID*> from <*original name*>. |No |Yes |
| `FileRenamed`                       |Renamed the file because the original file name doesn't follow [Azure naming conventions](../databox/data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). The original file has been renamed to AzureFile/DataBox-<*GUID*> from <*original name*>. |No |Yes |
| `DiskRenamed`                       |Renamed the managed disk file because the original file name doesn't follow [Azure naming conventions for managed disks](../databox/data-box-disk-limits.md#managed-disk-naming-conventions). The original managed disk file was renamed to ManagedDisk/DataBox-<*GUID*> from <*original name*>. |No |Yes |
| `FileNameTrailsWithSlash`           |Blob name or file name ends with a trailing slash. A blob name or file name that ends with a trailing backslash or forward slash can't be exported to disk. |No |Yes |
| `ExportCloudHttp`                   |Unsupported blob type. |No |Yes |


## Next steps

- [Review hard drive preparation steps for an import job](storage-import-export-data-to-blobs.md#step-1-prepare-the-drives).
- [Contact Microsoft Support](storage-import-export-contact-microsoft-support.md).
