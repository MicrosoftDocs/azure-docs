---
title: Azure Data Box Disk troubleshooting data upload issues using logs | Microsoft Docs 
description: Describes how to use the logs and troubleshoot issues seen when uploading data to Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 06/14/2019
ms.author: alkohli
---

# Understand logs to troubleshoot data upload issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk and describes the issues you see when you upload data to Azure.

## Data upload logs

When the data is uploaded to Azure at the datacenter, `_error.xml` and `_verbose.xml` files are generated. These logs are uploaded to the same storage account that was used to upload data. A sample of the `_error.xml` is shown below.
	
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

## Download logs

There are two ways to locate and download the diagnostics logs.

- If there are any errors when uploading the data to Azure, the portal displays a path to the folder where the diagnostics logs are located.

    ![Link to logs in the portal](./media/data-box-disk-troubleshoot-upload/data-box-disk-portal-logs.png)

- Go to the storage account associated with your Data Box order. Go to **Blob service > Browse blobs** and look for the blob corresponding to the storage account. Go to **waies**.

    ![Copy logs 2](./media/data-box-disk-troubleshoot/data-box-disk-copy-logs2.png)

In each case, you see the error logs and the verbose logs. Select each log and download a local copy.


## Data upload errors

The errors generated when uploading the data to Azure are summarized in the following table.

| Error code | Description                        |
|-------------|------------------------------|
|`None` |  Completed successfully.           |
|`Renamed` | Successfully renamed the blob.  |                                                            |
|`CompletedWithErrors` | Upload completed with errors. The details of the files in error are included in the log file.  |
|`Corrupted`|CRC computed during data ingestion doesn’t match the CRC computed during upload.  |  
|`StorageRequestFailed` | Azure storage request failed.   |     |
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
