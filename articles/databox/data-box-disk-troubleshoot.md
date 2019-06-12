---
title: Azure Data Box Disk troubleshooting | Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 06/12/2019
ms.author: alkohli
---

# Troubleshoot validation issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk and describes the validation issues you see when you deploy this solution.

## Validation tool log files

When you validate the data on the disks using the [validation tool](data-box-disk-deploy-copy-data.md#validate-data), an *error.xml* is generated to log any errors. The log file is located in the  `Drive:\DataBoxDiskImport\logs` folder of your drive. A link to the error log is provided when you run validation.

Here is a sample of the error log when the data loaded into the PageBlob folder is not 512-bytes aligned. Any data uploaded to PageBlob must be 512-bytes aligned, for example, a VHD or VHDX.

```xml
<?xml version="1.0" encoding="utf-8"?>
	<ErrorLog Version="2018-10-01">
		<SessionId>session#1</SessionId>
		<ItemType>PageBlob</ItemType>
		<SourceDirectory>D:\Dataset\TestDirectory</SourceDirectory>
		<Errors>
			<Error Code="Not512Aligned">
				<Description>The file is not 512 bytes aligned.</Description>
				<List>
					<File Path="\Practice\myScript.ps1" />
				</List>
				<Count>1</Count>
			</Error>
		</Errors>
		<Warnings />
	</ErrorLog>
```

Here is a sample of the error log when the container name is not valid. The folder that you create under `BlockBlob`, `PageBlob`, or `AzureFile` folders on the disk becomes a container in your Azure Storage account. The name of the container must follow the [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions).

```xml
	<?xml version="1.0" encoding="utf-8"?>
	<ErrorLog Version="2018-10-01">
	  <SessionId>bbsession</SessionId>
	  <ItemType>BlockBlob</ItemType>
	  <SourceDirectory>E:\BlockBlob</SourceDirectory>
	  <Errors>
	    <Error Code="InvalidShareContainerFormat">
	      <List>
	        <Container Name="Azu-reFile" />
	        <Container Name="bbcont ainer1" />
	      </List>
	      <Count>2</Count>
	    </Error>
	  </Errors>
	  <Warnings />
</ErrorLog>
```

## Validation tool errors

The errors contained in the *error.xml* with the corresponding recommended actions are summarized in the following table.

| Error code/Description                       | Recommended actions               |
|--------------------------------------|-----------------------------------|
| `None` <br> Successfully validated the data. | No action is required. |
| `InvalidXmlCharsInPath` <br> Could not create the path as the file path has characters that are not valid.| Having characters that are not valid in the file path will result in the failure of manifest file creation. Remove these characters to proceed.  |
| `OpenFileForReadFailed`<br> Could not open the file.|File read failed due to an error. Details for the error should be in the exception. |
| `Not512Aligned` <br> Could not upload the data as it is not 512 bytes aligned.| Remove the file and retry the validation. Only upload data that is 512 bytes aligned to this folder.  |
| `InvalidBlobPath` <br> Could not upload the data as the upload path is not valid.| |
| `EnumerationError` <br> Could not enumerate the files. | |
| `ShareSizeExceeded` <br> Could not upload the file as it exceeds the available space in the share.|Reduce the size of the data in the share so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `AzureFileSizeExceeded` <br> Could not upload the file as it exceeds the maximum size allowed for Azure Files.| Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation.|
| `BlockBlobSizeExceeded` <br> Could not upload the data as it exceeds the maximum size allowed for a block blob. | Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `ManagedDiskSizeExceeded` <br> Could not upload the data as it exceeds the maximum size allowed for a managed disk. | Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `PageBlobSizeExceeded` <br> Could not upload the data as it exceeds the maximum size allowed for a page blob. | Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `InvalidShareContainerFormat`          |The first folder created under the pre-existing folders on the disk becomes a container in your storage account. This share or container name does not conform to the Azure naming conventions. Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation.   |
| `InvalidBlobNameFormat` <br> Could not upload the data as it does not follow the Azure naming conventions.|Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation. |
| `InvalidFileNameFormat` <br> Could not upload the data as it does not follow the Azure naming conventions. |Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation. |
| `InvalidDiskNameFormat` <br> Could not upload the data as it does not follow the Azure naming conventions. |Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation.       |
| `NotPartOfFileShare` <br> Could not upload the files as the upload path is not valid. Upload the files to a folder in Azure Files.   | Remove the files in error and upload those files to a precreated folder. Retry the validation. |
| `NotFixedVhd` <br> Could not upload as managed disks. The differencing VHDs are not supported.|Remove the differencing VHDs as these are not supported. Retry the validation. |
| `NonVhdFileNotSupportedForManagedDisk` <br> Could not upload as managed disks. The non-VHD files are not supported. |Remove the non-VHD files as these are not supported. Retry the validation. |
| `VhdAsBlockBlob` <br> Could not upload as managed disk. The VHD file is not valid.|Remove the VHDs that are not valid. Retry the validation. |

## Next steps

- Troubleshoot [data upload errors](data-box-disk-troubleshoot-upload.md).
