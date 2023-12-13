---
title: Troubleshoot issues during data copies to your Azure Data Box, Azure Data Box Heavy
description: Describes how to troubleshoot issues when copying data to Azure Data Box and Azure Data Box Heavy devices.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 03/22/2022
ms.author: shaas
---

# Troubleshoot data copy issues on Azure Data Box and Azure Data Box Heavy

This article describes how to troubleshoot issues when performing data copies or data uploads for an Azure Data Box or Azure Data Box Heavy import order. The article includes the list of possible errors seen when data is copied to the Data Box or uploaded from Data Box.

For help troubleshooting issues with accessing the shares on your device, see [Troubleshoot share connection failure during data copy](data-box-troubleshoot-share-access.md).


> [!NOTE]
> The information in this article applies to import orders only.

## Error classes

The errors in Data Box and Data Box Heavy are summarized as follows:

| Error category        | Description        | Recommended action    |
|----------------------------------------------|---------|--------------------------------------|
| Container or share names<sup>*</sup> | The container or share names do not follow the Azure naming rules.  |Download the error lists. <br> Rename the containers or shares. [Learn more](#container-or-share-name-errors).  |
| Container or share size limit<sup>*</sup> | The total data in containers or shares exceeds the Azure limit.   |Download the error lists. <br> Reduce the overall data in the container or share. [Learn more](#container-or-share-size-limit-errors).|
| Object or file size limit<sup>*</sup> | The object or files in containers or shares exceeds the Azure limit.|Download the error lists. <br> Reduce the file size in the container or share. [Learn more](#object-or-file-size-limit-errors). |    
| Data or file type<sup>*</sup> | The data format or the file type is not supported. |Download the error lists. <br> For page blobs or managed disks, ensure the data is 512-bytes aligned and copied to the pre-created folders. [Learn more](#data-or-file-type-errors). |
| Folder or file internal errors<sup>*</sup> | The file or folder have an internal error. |Download the error lists. <br> Remove the file and copy again. For a folder, modify it by renaming or adding or deleting a file. The error should go away in 30 minutes.  [Learn more](#folder-or-file-internal-errors). |
| General error<sup>*</sup> | Internal exceptions or error paths in the code caused a critical error. | Reboot the device and rerun the **Prepare to Ship** operation. If the error doesn't go away, contact Microsoft Support. [Learn more](#general-errors). |
| Non-critical blob or file errors  | The blob or file names do not follow the Azure naming rules or the file type is not supported. | These blob or files may not be copied or the names may be changed. [Learn how to fix these errors](#non-critical-blob-or-file-errors). |

<sup>*</sup> Errors in this category are critical errors that must be fixed before you can proceed to **Prepare to Ship**.


## Container or share name errors

These errors are related to container and share names.

### ERROR_CONTAINER_OR_SHARE_NAME_LENGTH

**Error description:** The container or share name must be between 3 and 63 characters. 

**Suggested resolution:** The folder under the Data Box or Data Box Heavy share(SMB/NFS) to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the device local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box or Data Box Heavy share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).


### ERROR_CONTAINER_OR_SHARE_NAME_ALPHA_NUMERIC_DASH

**Error description:** The container or share name must consist of only letters, numbers, or hyphens.

**Suggested resolution:** The folder under the Data Box or Data Box Heavy share(SMB/NFS) to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the device local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box or Data Box Heavy share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).

### ERROR_CONTAINER_OR_SHARE_NAME_IMPROPER_DASH

**Error description:** The container names and share names can’t start or end with hyphens and can’t have consecutive hyphens.

**Suggested resolution:** The folder under the Data Box or Data Box Heavy share(SMB/NFS) to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the device local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box or Data Box Heavy share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).
    
### ERROR_FILE_OR_DIRECTORY_NAME_ILLEGAL

**Error description**: The directory or the container names contain illegal characters.

**Suggested resolution**: The directory or the container names that you have copied contain unsupported characters.

- On the Connect and copy page of the local web UI, download, and review the error files to identify the folder names with issues. 
- Rename the directory or containers to ensure that they are compliant with Azure naming conventions.

For more information, see the Azure naming conventions for [directories](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) and [containers](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names).

## Container or share size limit errors

These errors are related to data exceeding the size of data allowed in a container or a share.

### ERROR_CONTAINER_OR_SHARE_CAPACITY_EXCEEDED

**Error description:** Large file shares are not enabled on your storage account(s). 

**Suggested resolution:** To disregard this error, follow these steps:
 
1. In the Data Box local UI, go to the **Connect and Copy** page and go to **Settings**. 

    :::image type="content" source="media/data-box-troubleshoot/icon-connect-copy.png" alt-text="Connect and copy":::

1. Enable and apply **Disregard Large File Share Errors**. 
     
    :::image type="content" source="media/data-box-troubleshoot/icon-connect-copy-settings-2.png" alt-text="Connect and copy settings":::

1. **Enable large file shares** on your storage account(s) in the Azure portal. 

> [!NOTE]
> If large file shares are not enabled for the indicated storage accounts on the Azure portal, the data upload to these storage accounts will fail.
  
## Object or file size limit errors

These errors are related to data exceeding the maximum size of object or the file that is allowed in Azure. 

### ERROR_BLOB_OR_FILE_SIZE_LIMIT

**Error description:** The file size exceeds the maximum file size for upload.

**Suggested resolution:** The blob or the file sizes exceed the maximum limit allowed for upload.

- On the **Connect and copy** page of the local web UI, download, and review the error files.
- Make sure that the blob and file sizes do not exceed the Azure object size limits.

## Data or file type errors

These errors are related to unsupported file type or data type found in the container or share. 

### ERROR_BLOB_OR_FILE_SIZE_ALIGNMENT

**Error description:** The blob or file is incorrectly aligned.

**Suggested resolution:** The page blob share on Data Box or Data Box Heavy only supports files that are 512 bytes aligned (for example, VHD/VHDX). Any data copied to the page blob share is uploaded to Azure as page blobs.

Remove any non-VHD/VHDX data from the page blob share. You can use shares for block blob or Azure files for generic data.

For more information, see [Overview of Page blobs](../storage/blobs/storage-blob-pageblob-overview.md).

### ERROR_BLOB_OR_FILE_TYPE_UNSUPPORTED

**Error description:** An unsupported file type is present in a managed disk share. Only fixed VHDs are allowed.

**Suggested resolution:**

- Make sure that you only upload the fixed VHDs to create managed disks.
- VHDX files or **dynamic** and **differencing** VHDs are not supported.

### ERROR_DIRECTORY_DISALLOWED_FOR_TYPE

**Error description:** A directory is not allowed in any of the pre-existing folders for the managed disks. Only fixed VHDs are allowed in these folders.

**Suggested resolution:** For managed disks, within each share, the following three folders are created which correspond to containers in your storage account: Premium SSD, Standard HDD, and Standard SSD. These folders correspond to the performance tier for the managed disk.

- Make sure that you copy your page blob data (VHDs) into one of these existing folders.
- A folder or directory is not allowed in these existing folders. Remove any folders that you have created inside the pre-existing folders.

For more information, see [Copy to managed disks](data-box-deploy-copy-data-from-vhds.md#connect-to-data-box).

### REPARSE_POINT_ERROR

**Error description:** Symbolic links are not allowed in Linux. 

**Suggested resolution:** The symbolic links are usually links, pipes, and other such files. Either remove the links, or resolve the links and copy the data.

## Folder or file internal errors

**Error description:** The file or folder are in an internal error state.

**Suggested resolution:** If this is a file, remove the file and copy it again. If this is a folder, modify the folder. Either rename the folder or add or delete a file from the folder. The error should clear on its own in 30 minutes. Contact Microsoft Support, if the error persists.

## General errors

General errors are caused by internal exceptions or error paths in the code.

### ERROR_GENERAL

**Error description** This general error is caused by internal exceptions or error paths in the code.

**Suggested resolution:** Reboot the device and rerun the **Prepare to Ship** operation. If the error doesn't go away, [contact Microsoft Support](data-box-disk-contact-microsoft-support.md).

## Non-critical blob or file errors

All the non-critical errors related to names of blobs, files, or containers that are seen during data copy are summarized in the following section. If these errors are present, then the names will be modified to conform to the Azure naming conventions. The corresponding order status for data upload will be **Completed with warnings**.  

### ERROR_BLOB_OR_FILE_NAME_CHARACTER_CONTROL

**Error description:** The blob or file names contain unsupported control characters.

**Suggested resolution:** The blobs or the files that you have copied contain names with unsupported characters.

On the **Connect and copy** page of the local web UI, download, and review the error files.
Remove or rename the files to remove unsupported characters.

For more information, see the Azure naming conventions for [blob names](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).

### ERROR_BLOB_OR_FILE_NAME_CHARACTER_ILLEGAL

**Error description:** The blob or file names contain illegal characters.

**Suggested resolution:** The blobs or the files that you have copied contain names with unsupported characters.

On the **Connect and copy** page of the local web UI, download, and review the error files.
Remove or rename the files to remove unsupported characters.

For more information, see the Azure naming conventions for [blob names](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).


### ERROR_BLOB_OR_FILE_NAME_ENDING

**Error description:** The blob or file names are ending with bad characters.

**Suggested resolution:** The blobs or the files that you have copied contain names with unsupported characters.

On the **Connect and copy** page of the local web UI, download, and review the error files.
Remove or rename the files to remove unsupported characters.

For more information, see the Azure naming conventions for [blob names](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).


### ERROR_BLOB_OR_FILE_NAME_SEGMENT_COUNT

**Error description:** The blob or file name contains too many path segments.

**Suggested resolution:** The blobs or the files that you have copied exceed the maximum number of path segments. A path segment is the string between consecutive delimiter characters, for example, the forward slash /.

- On the **Connect and copy** page of the local web UI, download, and review the error files.
- Make sure that the [blob names](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) conform to Azure naming conventions.

### ERROR_BLOB_OR_FILE_NAME_AGGREGATE_LENGTH

**Error description:** The blob or file name is too long.

**Suggested resolution:** The blob or the file names exceed the maximum length.

- On the **Connect and copy** page of the local web UI, download, and review the error files.
- The blob name must not exceed 1,024 characters.
- Remove or rename the blob or files so that the names don’t exceed 1024 characters.

For more information, see the Azure naming conventions for blob names and file names.

### ERROR_BLOB_OR_FILE_NAME_COMPONENT_LENGTH

**Error description:** One of the segments in the blob or file name is too long.

**Suggested resolution:** One of the path segments in the blob or file name exceeds the maximum numbers of characters. A path segment is the string between consecutive delimiter characters, for example, the forward slash /.

- On the **Connect and copy** page of the local web UI, download, and review the error files.
- Make sure that the [blob names](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) conform to Azure naming conventions.


### ERROR_CONTAINER_OR_SHARE_NAME_DISALLOWED_FOR_TYPE

**Error description:** Improper container names are specified for managed disk shares.

**Suggested resolution:** For managed disks, within each share, the following folders are created which correspond to containers in your storage account: Premium SSD, Standard HDD, and Standard SSD. These folders correspond to the performance tier for the managed disk.

- Make sure that you copy your page blob data (VHDs) into one of these existing folders. Only data from these existing containers is uploaded to Azure.
- Any other folder that is created at the same level as Premium SSD, Standard HDD, and Standard SSD doesn’t correspond to a valid performance tier and can’t be used.
- Remove files or folders created outside of the performance tiers.

For more information, see [Copy to managed disks](data-box-deploy-copy-data-from-vhds.md#connect-to-data-box).


## Non-critical container or share errors

### ERROR_CONTAINER_OR_SHARE_CAPACITY_EXCEEDED
**Error description:**  Large file share errors were disregarded for Data Box. Remember to **enable large file shares** on your storage account(s) in the Azure portal. If you don't enable large file shares on these storage accounts in the portal, the data upload to these accounts will fail.

**Suggested resolution:** Enable Large File Shares on your storage account(s) in the Azure portal. If you don't enable large file shares on these storage accounts in the portal, the data upload to these accounts will fail.

## Next steps

- Learn about the [Data Box Blob storage system requirements](data-box-system-requirements-rest.md).
