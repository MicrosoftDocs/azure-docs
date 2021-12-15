---
title: Troubleshoot data uploads using logs
titleSuffix: Azure Data Box Disk
description: Describes how to use the logs and troubleshoot issues seen when uploading data to Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: troubleshooting
ms.date: 12/14/2021
ms.author: alkohli
---

# Understand logs to troubleshoot data upload issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk and describes the issues you see when you upload data to Azure.

## About upload logs

When the data is uploaded to Azure at the datacenter, copy log (`_copy.xml` or `_error.xml`, depending on the drive log release) and verbose log (`_verbose.xml`) files are generated for each storage account. These logs are uploaded to the same storage account that was used to upload data. 

* The copy/error logs contains descriptions of the events that occurred while copying the data from the disk to the Azure Storage account, and a summary of errors by error category.
* The verbose log contains a complete listing of the copy operation on every blob and file. 

### Identify the log version

There are two versions of the copy/error log and verbose log, with different formats, depending on the XX release. To find out the log release number for both the copy/error log and the accompanying verbose log, check the drive log version in the copy/error log.

| Product release | Search copy/error log for... | Log drive release |
|-----------------|------------------------------|-------------------|
| XXX             | DriveLogVersion              | 2021-08-01        |
| XXX             | DriveLog Version             | 2018-10-01        |

For more information, see the Sample upload logs for log drive release 2021-08-01 and log drive release 2018-10-01. 


## Locate the logs

XXX

### [Log version: 2021-08-01](#tab/log-version-2021-08-01)

Take the following steps to locate **version 2021-08-01** upload logs.

1. When the data upload completes, the Azure portal displays the disk status and the path to the copy logs for the disk.

    ![Screenshot of the Overview pane for a Data Box Disk order with Copy Completed With Errors status. The Disk Status and Copy Log Path for each disk are highlighted.](./media/data-box-disk-troubleshoot-upload/data-box-disk-portal-logs.png)

2. Select and click the COPY LOG PATH for a drive to open the folder with the logs for that drive. A copy log lists all data copy error that occurred. If you selected STOPPED HERE FOR THE EVENING.


### [Log version: 2018-10-01](#tab/log-version-2018-10-01)

Take the following steps to locate **version 2018-10-01**  upload logs.

1. If there are any errors when uploading the data to Azure, the portal displays a path to the folder where the diagnostics logs are located.

    ![Link to logs in the portal](./media/data-box-disk-troubleshoot-upload/data-box-disk-portal-logs.png)

2. Go to **waies**.

    ![error and verbose logs](./media/data-box-disk-troubleshoot-upload/data-box-disk-portal-logs-1.png)

In each case, you see the error logs and the verbose logs. Select each log and download a local copy.

---

## Sample upload logs

INTRO

### [Log version: 2021-08-01](#tab/log-version-2021-08-01)

Each data transfer for a disk generates a copy log. If you chose to save a verbose log when you ordered your Data Box Disk, there’s also a verbose log in the same folder.

## Verbose log

The verbose log is a simple listing of all files that were transferred from the drive, with the following information for each transferred file. The verbose log doesn’t provide summary information.

| Field       | Description                                  |
|-------------|----------------------------------------------|
| CloudFormat | BlockBlob, PageBlob, or AzureFile            |
| Path        | Path to the file within the storage account. |
| Size        | File or blob size.                           |
| crc64       | If cyclic redundancy check 64 (CRC64) was used to verify the integrity of the file during data transfer, the CRC64 hash that was used. Either CRC64 or MD5 is used for Data Box Disk. |
| md5         | If Message Digest Algorithm 5 (MD5) was used to verify the integrity of the file during data transfer, the MD5 hash that was used. Either CRC64 or MD5 is used for Data Box Disk. |

> [!HINT]
> To find out the release number for the verbose log, check the **DriveLogVersion** of the copy log.

#### Sample verbose log: 2021-08-01

The following sample verbose log has sample file entries for block blob, page blob, and Azure File imports.

```xml
<File CloudFormat="BlockBlob" Path="$root\file26fd6b4bd-25f7-4019-8d0d-baa7355745df.vhd" Size="1024" crc64="14179624636173788226">
</File><File CloudFormat="BlockBlob" Path="$root\file49d220295-9cfd-469e-b69e-5c7c885133df.vhd" Size="1024" crc64="14179624636173788226">
</File>
----------CUT--------------------
<File CloudFormat="AzureFile" Path="e579954d-1f94-40cf-955f-afd39e9ca217\file1876f73ad-6213-43bc-9467-67fe0c794e99.block" Size="1024" crc64="1410470866535975213">
</File><File CloudFormat="AzureFile" Path="05407abe-81c8-4b44-b846-3a2c8c198316\file28d7868be-e6a7-4441-8d09-2b127f7d049e.vhd" Size="1024" crc64="1410470866535975213">
</File><File CloudFormat="AzureFile" Path="eb7666a7-c026-4375-9c08-3dea37a57713\file4448aeaf5-53dc-4bff-b798-4776e367ab5e.vhd" Size="1024" crc64="1410470866535975213">
</File>
----------CUT--------------------
<File CloudFormat="PageBlob" Path="tesdir8b1d0acd-2d37-46dd-96cf-edeb0f772e6b\file1.txt" Size="83886080" crc64="1680234237456714851">
</File><File CloudFormat="PageBlob" Path="tesdirf631630d-8098-4c84-be7b-40f6bbdb73fb\file_size0.txt" Size="0" crc64="0">
</File><File CloudFormat="PageBlob" Path="tesdirf631630d-8098-4c84-be7b-40f6bbdb73fb\Dir1/file_size0.txt" Size="0" crc64="0">
</File>
```

### Copy log

The copy log contains an error entry for each data transfer that resulted in an error, and ends with a summary of validation errors and copy errors that occurred for the drive.

Each error entry contains the following information.

| Field        | Description                                                                                            |
|--------------|--------------------------------------------------------------------------------------------------------|
| Path         | The destination share within the container or file share.                                              |
| Category     | One of 15 error categories. See [Data upload errors](#data-upload-errors) for log version 2021-08-01.  |
| ErrorCode    | The numeric code for the error.                                                                        |
| ErrorMessage | Describes the error.                                                                                   |

The CopyLog Summary reports:<!--Add definitions?-->

•	DriveLogVersion
•	Drive ID
•	Data copy status
•	Summary of validation errors by error category.
•	Summary of copy errors y error category.

#### Sample copy log: 2021-08-01

The following sample copy log is for a disk that contained imports to Azure Files and Azure Blob storage. 
The copy failed, with no validation errors but with three copy errors. One file share was renamed (ShareRenamed error) and two containers were renamed (ContainerRenamed error) either because the container name didn’t conform to Azure naming conventions or the container name and path exceeded the maximum length in Windows Storage.
HOW TO FOLLOW UP?

```xml
<ErroredEntity Path="New Folder">
  <Category>ShareRenamed</Category>
  <ErrorCode>1</ErrorCode>
  <ErrorMessage>The original container/share/Blob has been renamed to: DataBox-f55763d4-8ef7-458f-b029-f36b51ada34f :from: New Folder :because either name has invalid character(s) or length is not supported</ErrorMessage>
  <Type>Container</Type>
</ErroredEntity>
<ErroredEntity Path="CV">
  <Category>ContainerRenamed</Category>
  <ErrorCode>1</ErrorCode>
  <ErrorMessage>The original container/share/Blob has been renamed to: DataBox-6bcae46f-04c8-4385-8442-3a28b962c930 :from: CV :because either name has invalid character(s) or length is not supported</ErrorMessage>
  <Type>Container</Type>
</ErroredEntity><ErroredEntity Path="New_ShareFolder">
  <Category>ContainerRenamed</Category>
  <ErrorCode>1</ErrorCode>
  <ErrorMessage>The original container/share/Blob has been renamed to: DataBox-96d8e2ee-ffd4-4529-9ec0-f666674b70d9 :from: New_ShareFolder :because either name has invalid character(s) or length is not supported</ErrorMessage>
  <Type>Container</Type>
</ErroredEntity>
<CopyLog Summary="Summary">
  <DriveLogVersion>2021-08-01</DriveLogVersion>
  <DriveId>72a1914a-7fb2-4e34-a135-5c7176c3ee41</DriveId>
  <Status>Failed</Status>
  <TotalFiles_Blobs>60</TotalFiles_Blobs>
  <FilesErrored>0</FilesErrored>
  <Summary>
    <ValidationErrors>
      <None Count="3" />
    </ValidationErrors>
    <CopyErrors>
      <ShareRenamed Count="1" Description="Renamed the share as the original share name does not follow Azure conventions." />
      <ContainerRenamed Count="2" Description="Renamed the container as the original container name does not follow Azure conventions." />
    </CopyErrors>
  </Summary>
</CopyLog>
```

### [Log version: 2018-10-01](#tab/log-version-2018-10-01)

In drive log version 2018-10-01, the data upload produces an error log and a verbose log. Both the logs are in the same format and contain XML descriptions of the events that occurred while copying the data from the disk to the Azure Storage account.

The verbose log contains complete information about the status of the copy operation for every blob or file, whereas the error log contains only the information for blobs or files that encountered errors during the upload.

The error log has the same structure as the verbose log, but filters out successful operations.

### Sample verbose log: 2018-10-01

A sample of the `_verbose.xml` is shown below. In this case, the order has completed successfully with no errors.

```xml

<?xml version="1.0" encoding="utf-8"?>
<DriveLog Version="2018-10-01">
  <DriveId>184020D95632</DriveId>
  <Blob Status="Completed">
    <BlobPath>$root/botetapageblob.vhd</BlobPath>
    <FilePath>\PageBlob\botetapageblob.vhd</FilePath>
    <Length>1073742336</Length>
    <ImportDisposition Status="Created">rename</ImportDisposition>
    <PageRangeList>
      <PageRange Offset="0" Length="4194304" Status="Completed" />
      <PageRange Offset="4194304" Length="4194304" Status="Completed" />
      <PageRange Offset="8388608" Length="4194304" Status="Completed" />
      --------CUT-------------------------------------------------------
      <PageRange Offset="1061158912" Length="4194304" Status="Completed" />
      <PageRange Offset="1065353216" Length="4194304" Status="Completed" />
      <PageRange Offset="1069547520" Length="4194304" Status="Completed" />
      <PageRange Offset="1073741824" Length="512" Status="Completed" />
    </PageRangeList>
  </Blob>
  <Blob Status="Completed">
    <BlobPath>$root/botetablockblob.txt</BlobPath>
    <FilePath>\BlockBlob\botetablockblob.txt</FilePath>
    <Length>19</Length>
    <ImportDisposition Status="Created">rename</ImportDisposition>
    <BlockList>
      <Block Offset="0" Length="19" Status="Completed" />
    </BlockList>
  </Blob>
  <File Status="Completed">
    <FileStoragePath>botetaazurefilesfolder/botetaazurefiles.txt</FileStoragePath>
    <FilePath>\AzureFile\botetaazurefilesfolder\botetaazurefiles.txt</FilePath>
    <Length>20</Length>
    <ImportDisposition Status="Created">rename</ImportDisposition>
    <FileRangeList>
      <FileRange Offset="0" Length="20" Status="Completed" />
    </FileRangeList>
  </File>
  <Status>Completed</Status>
</DriveLog>
```

### Sample error logs: 2018-10-01

For the same order, a sample of the `_error.xml` is shown below.

```xml

<?xml version="1.0" encoding="utf-8"?>
<DriveLog Version="2018-10-01">
  <DriveId>184020D95632</DriveId>
  <Summary>
    <ValidationErrors>
      <None Count="3" />
    </ValidationErrors>
    <CopyErrors>
      <None Count="3" Description="No errors encountered" />
    </CopyErrors>
  </Summary>
  <Status>Completed</Status>
</DriveLog>
```

A sample of the `_error.xml` is shown below where the order completed with errors.

The error file in this case has a `Summary` section and another section that contains all the file level errors. 

The `Summary` contains the `ValidationErrors` and the `CopyErrors`. In this case, 8 files or folders were uploaded to Azure and there were no validation errors. When the data was copied to Azure Storage account, 5 files or folders uploaded successfully. The remaining 3 files or folders were renamed as per the Azure container naming conventions and then uploaded successfully to Azure.

The file level status are in `BlobStatus` that describes any actions taken to upload the blobs. In this case, three containers are renamed because the folders to which the data was copied did not conform with the Azure naming conventions for containers. For the blobs uploaded in those containers, the new container name, path of the blob in Azure, original invalid file path, and the blob size are included.
  
```xml
 <?xml version="1.0" encoding="utf-8"?>
  <DriveLog Version="2018-10-01">
    <DriveId>18041C582D7E</DriveId>
    <Summary>
     <!--Summary for validation and data copy to Azure -->
      <ValidationErrors>
        <None Count="8" />
      </ValidationErrors>
      <CopyErrors>
        <Completed Count="5" Description="No errors encountered" />
        <ContainerRenamed Count="3" Description="Renamed the container as the original container name does not follow Azure conventions." />
      </CopyErrors>
    </Summary>
    <!--List of renamed containers with the new names, new file path in Azure, original invalid file path, and size -->
    <Blob Status="ContainerRenamed">
      <BlobPath>databox-c2073fd1cc379d83e03d6b7acce23a6cf29d1eef/private.vhd</BlobPath>
      <OriginalFilePath>\PageBlob\pageblob test\private.vhd</OriginalFilePath>
      <SizeInBytes>10490880</SizeInBytes>
    </Blob>
    <Blob Status="ContainerRenamed">
      <BlobPath>databox-c2073fd1cc379d83e03d6b7acce23a6cf29d1eef/resource.vhd</BlobPath>
      <OriginalFilePath>\PageBlob\pageblob test\resource.vhd</OriginalFilePath>
      <SizeInBytes>71528448</SizeInBytes>
    </Blob>
    <Blob Status="ContainerRenamed">
      <BlobPath>databox-c2073fd1cc379d83e03d6b7acce23a6cf29d1eef/role.vhd</BlobPath>
      <OriginalFilePath>\PageBlob\pageblob test\role.vhd</OriginalFilePath>
      <SizeInBytes>10490880</SizeInBytes>
    </Blob>
    <Status>CompletedWithErrors</Status>
  </DriveLog>
```

---

## Data upload errors

### [Log version: 2021-08-01](#tab/log-version-2021-08-01)

The errors found in the 2018-10-01 error log are described below.<!--1) In 2021-08-01, the errors have an error category (the name); a numeric error code; and an error message is the description. 2) Are all categories that begin with "UploadError" validation errors?-->

| Error category                      | Error message   |
|-------------------------------------|-----------------|
| `UploadErrorNone`                   |XXX              |
| `UploadErrorWin32`                  |XXX              |
| `UploadErrorCloudHttp`              |XXX              |
| `UploadErrorCloudNetwork`           |XXX              |
| `UploadErrorDataValidataionError`   |XXX              |
| `UploadErrorFilePropertyError`      |XXX              |
| `UploadErrorManagedConversionError` |XXX              |
| `ContainerRenamed`                  |Renamed the container as the original container name does not follow Azure conventions. |
| `ShareRenamed`                      |The share for these files didn’t conform to Azure naming conventions and is renamed. <!--Update name format.-->The new name starts with `databox-` and is suffixed with the SHA1 hash of the original name. |
| `BlobRenamed`                       |These files didn’t conform to Azure naming conventions and were renamed. <!--Update instruction.-->Check the `BlobPath` field for the new name. |
| `FileRenamed`                       |These files didn’t conform to Azure naming conventions and were renamed. <!--Update instruction.-->Check the `FileStoragePath` field for the new name. |
| `DiskRenamed`                       |These files didn’t conform to Azure naming conventions and were renamed. <!--Update instruction.-->Check the `BlobPath` field for the new name. |
| `FileNameTrailsWithSlash`           |XXX              |
| `ExportCloudHttp`                   |XXX              |
| `UploadErrorUnknownType`            |XXX              |


### [Log version: 2018-10-01](#tab/log-version-2018-10-01)

The errors generated when uploading the data to Azure are summarized in the following table. This error set is found in the 2018-10-01 error log.

| Error code | Description                   |
|-------------|------------------------------|
|`None` |  Completed successfully.           |
|`Renamed` | Successfully renamed the blob.   |
|`CompletedWithErrors` | Upload completed with errors. The details of the files in error are included in the log file.  |
|`Corrupted`|CRC computed during data ingestion doesn’t match the CRC computed during upload.  |  
|`StorageRequestFailed` | Azure storage request failed.   |     
|`LeasePresent` | This item is leased and is being used by another user. |
|`StorageRequestForbidden` |Could not upload due to authentication issues. |
|`ManagedDiskCreationTerminalFailure` | Could not upload as managed disks. The files are available in the staging storage account as page blobs. You can manually convert page blobs to managed disks.  |
|`DiskConversionNotStartedTierInfoMissing` | Since the VHD file was copied outside of the precreated tier folders, a managed disk wasn't created. The file is uploaded as page blob to the staging storage account as specified during order creation. You can convert it manually to a managed disk.|
|`InvalidWorkitem` | Could not upload the data as it does not conform to Azure naming and limits conventions.|
|`InvalidPageBlobUploadAsBlockBlob` | Uploaded as block blobs in a container with prefix `databoxdisk-invalid-pb-`.|
|`InvalidAzureFileUploadAsBlockBlob` | Uploaded as block blobs in a container with prefix `databoxdisk-invalid-af`-.|
|`InvalidManagedDiskUploadAsBlockBlob` | Uploaded as block blobs in a container with prefix `databoxdisk-invalid-md`-.|
|`InvalidManagedDiskUploadAsPageBlob` |Uploaded as page blobs in a container with prefix `databoxdisk-invalid-md-`. |
|`MovedToOverflowShare` |Uploaded files to a new share as the original share size exceeded the maximum Azure size limit. The new file share name has the original name suffixed with `-2`.   |
|`MovedToDefaultAzureShare` |Uploaded files that weren’t a part of any folder to a default share. The share name starts with `databox-`. |
|`ContainerRenamed` |The container for these files didn’t conform to Azure naming conventions and is renamed. The new name starts with `databox-` and is suffixed with the SHA1 hash of the original name |
|`ShareRenamed` |The share for these files didn’t conform to Azure naming conventions and is renamed. The new name starts with `databox-` and is suffixed with the SHA1 hash of the original name. |
|`BlobRenamed` |These files didn’t conform to Azure naming conventions and were renamed. Check the `BlobPath` field for the new name. |
|`FileRenamed` |These files didn’t conform to Azure naming conventions and were renamed. Check the `FileStoragePath` field for the new name. |
|`DiskRenamed` |These files didn’t conform to Azure naming conventions and were renamed. Check the `BlobPath` field for the new name. |


## Next steps

- [Open a Support ticket for Data Box Disk issues](data-box-disk-contact-microsoft-support.md).
