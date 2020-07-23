---
title: Azure Data Box Disk troubleshooting | Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: troubleshooting
ms.date: 06/14/2019
ms.author: alkohli
---

# Use logs to troubleshoot validation issues in Azure Data Box Disk

This article applies to Microsoft Azure Data Box Disk. The article describes how to use the logs to troubleshoot the validation issues you could see when you deploy this solution.

## Validation tool log files

When you validate the data on the disks using the [validation tool](data-box-disk-deploy-copy-data.md#validate-data), an *error.xml* is generated to log any errors. The log file is located in the  `Drive:\DataBoxDiskImport\logs` folder of your drive. A link to the error log is provided when you run validation.

<!--![Validation tool with link to error log](media/data-box-disk-troubleshoot/validation-tool-link-error-log.png)-->

If you run multiple sessions for validation, then one error log is generated per session.

- Here is a sample of the error log when the data loaded into the `PageBlob` folder is not 512-bytes aligned. Any data uploaded to PageBlob must be 512-bytes aligned, for example, a VHD or VHDX. The errors in this file are in the `<Errors>` and warnings in `<Warnings>`.

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

- Here is a sample of the error log when the container name is not valid. The folder that you create under `BlockBlob`, `PageBlob`, or `AzureFile` folders on the disk becomes a container in your Azure Storage account. The name of the container must follow the [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions).

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

| Error code| Description                       | Recommended actions               |
|------------|--------------------------|-----------------------------------|
| `None` | Successfully validated the data. | No action is required. |
| `InvalidXmlCharsInPath` |Could not create a manifest file as the file path has characters that are not valid. | Remove these characters to proceed.  |
| `OpenFileForReadFailed`| Could not process the file. This could be due to an access issue or file system corruption.|Could not read the file due to an error. The error details are in the exception. |
| `Not512Aligned` | This file is not in a valid format for PageBlob folder.| Only upload data that is 512 bytes aligned to `PageBlob` folder. Remove the file from the PageBlob folder or move it to the BlockBlob folder. Retry the validation.|
| `InvalidBlobPath` | File path doesn’t map to a valid blob path in cloud as per the Azure Blob naming conventions.|Follow the Azure naming guidelines to rename the file path. |
| `EnumerationError` | Could not enumerate the file for validation. |There could be multiple reasons for this error. A most likely reason is access to the file. |
| `ShareSizeExceeded` | This file caused the Azure file share size to exceed the Azure limit of 5 TB.|Reduce the size of the data in the share so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `AzureFileSizeExceeded` | File size exceeds the Azure File size limits.| Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation.|
| `BlockBlobSizeExceeded` | File size exceeds the Azure Block Blob size limits. | Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `ManagedDiskSizeExceeded` | File size exceeds the Azure Managed Disk size limits. | Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `PageBlobSizeExceeded` | File size exceeds the Azure Managed Disk size limits. | Reduce the size of the file or the data so that it conforms to the [Azure object size limits](data-box-disk-limits.md#azure-object-size-limits). Retry the validation. |
| `InvalidShareContainerFormat`  |The directory names do not conform to Azure naming conventions for containers or shares.         |The first folder created under the pre-existing folders on the disk becomes a container in your storage account. This share or container name does not conform to the Azure naming conventions. Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation.   |
| `InvalidBlobNameFormat` | File path doesn’t map to a valid blob path in cloud as per the Azure Blob naming conventions.|Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation. |
| `InvalidFileNameFormat` | File path doesn’t map to a valid file path in cloud as per the Azure File naming conventions. |Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation. |
| `InvalidDiskNameFormat` | File path doesn’t map to a valid disk name in cloud as per the Azure Managed Disk naming conventions. |Rename the file so that it conforms to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). Retry the validation.       |
| `NotPartOfFileShare` | The upload path for files is not valid. Upload the files to a folder in Azure Files.   | Remove the files in error and upload those files to a precreated folder. Retry the validation. |
| `NonVhdFileNotSupportedForManagedDisk` | A non-VHD file can’t be uploaded as a managed disk. |Remove the non-VHD files from `ManagedDisk` folder as these are not supported or move these files to a `PageBlob` folder. Retry the validation. |


## Next steps

- Troubleshoot [data upload errors](data-box-disk-troubleshoot-upload.md).
