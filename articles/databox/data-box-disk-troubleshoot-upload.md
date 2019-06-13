---
title: Azure Data Box Disk troubleshooting data upload issues using logs | Microsoft Docs 
description: Describes how to use the logs and troubleshoot issues seen when uploading data to Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 06/12/2019
ms.author: alkohli
---

# Troubleshoot data upload issues in Azure Data Box Disk

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

| Error code | Description                        |Details                                     |
|-------------|------------------------------|--------------------------------------------------------|
|None |  Completed successfully.           | No errors encountered. No action is required.      |
|Completed | Completed successfully.       | No errors encountered. No action is required. |
|Created | Successfully uploaded the blob. | For import disposition, means the blob was created as new. |
|Renamed | Successfully renamed the blob.  |                                                            |
|CompletedWithErrors | Upload completed with errors.| There were some errors during upload. The errors are written to *copylog* file in the storage account where the data was uploaded.  |
|Corrupted | |                      |
|StorageRequestFailed | Azure storage request failed.   |     |
|LeasePresent | Lease is already present on the item. |      |
|StorageRequestForbidden | |        |
|Canceled | {0} was canceled.   | For the blob status in user logs; never used in recovery logs. |
|ManagedDiskCreationTerminalFailure | Could not convert to managed disks. The data was uploaded as page blobs. | Managed disk creation failed. This is a terminal failure. You can manually convert the data in the page blobs in the staging account to managed disks.  |
|DiskConversionNotStartedTierInfoMissing | Could not convert to managed disk as the data was uploaded outside of the precreated folders on the Data Box Disk.    | Since the VHD file was copied outside of the precreated tier folders, a managed disk wasn't created. The file is uploaded as page blob to the staging storage account as specified during order creation. You can convert it manually to a managed disk.|
|InvalidWorkitem | Could not upload the data as it does not conform to Azure naming and limits conventions.   |These are files that didn't conform to Azure naming conventions and could not be uploaded as block blob. They are marked as invalid work item.|
|InvalidPageBlobUploadAsBlockBlob | The invalid page blobs are uploaded as block blobs in a container with prefix `databoxdisk-invalid-pb-`. | |
|InvalidAzureFileUploadAsBlockBlob | The invalid Azure Files are uploaded as block blobs in a  container with prefix `databoxdisk-invalid-af-`.  |  |
|InvalidManagedDiskUploadAsBlockBlob | The invalid managed disk files are uploaded as block blobs in a container with prefix `databoxdisk-invalid-md-`.|   |

## Next steps

- [Open a Support ticket for Data Box Disk issues](data-box-disk-contact-microsoft-support.md).
