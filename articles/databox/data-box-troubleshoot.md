---
title: Troubleshoot issues on your Azure Data Box| Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box when uploading data to Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 05/22/2019
ms.author: alkohli
---

# Troubleshoot issues related to Azure Data Box

This article details information on how to troubleshoot issues you may see when using the Azure Data Box.

## Errors during data copy

All the errors that are seen during data copy are summarized in the following sections.

### ERROR_CONTAINER_OR_SHARE_NAME_LENGTH     

**Error description:** The container or share name must be between 3 and 63 characters. 

**Suggested resolution:** The folder under the Data Box (SMB/NFS) share to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the Data Box local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).


### ERROR_CONTAINER_OR_SHARE_NAME_ALPHA_NUMERIC_DASH

**Error description:** The container or share name must consist of only letters, numbers, or hyphens.

**Suggested resolution:** The folder under the Data Box (SMB/NFS) share to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the Data Box local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).

### ERROR_CONTAINER_OR_SHARE_NAME_IMPROPER_DASH

**Error description:** The container names and share names can’t start or end with hyphens and can’t have consecutive hyphens.

**Suggested resolution:** The folder under the Data Box (SMB/NFS) share to which you have copied data becomes an Azure container in your storage account. 

- On the **Connect and copy** page of the Data Box local web UI, download, and review the error files to identify the folder names with issues.
- Change the folder name under the Data Box share to make sure that:

    - The name has between 3 and 63 characters.
    - The names can only have letters, numbers, and hyphens.
    - The names can’t start or end with hyphens.
    - The names can’t have consecutive hyphens.
    - Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`
    - Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`

    For more information, see the Azure naming conventions for [container names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and [share names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names).

### ERROR_CONTAINER_OR_SHARE_NAME_DISALLOWED_FOR_TYPE

**Error description:** Improper container names are specified for managed disk shares.

**Suggested resolution:** For managed disks, within each share, the following folders are created which correspond to containers in your storage account: Premium SSD, Standard HDD, and Standard SSD. These folders correspond to the performance tier for the managed disk.

- Make sure that you copy your page blob data (VHDs) into one of these existing folders. Only data from these existing containers is uploaded to Azure.
- Any other folder that is created at the same level as Premium SSD, Standard HDD, and Standard SSD doesn’t correspond to a valid performance tier and can’t be used.
- Remove files or folders created outside of the performance tiers.

For more information, see [Copy to managed disks](data-box-deploy-copy-data-from-vhds.md#connect-to-data-box).

### ERROR_CONTAINER_OR_SHARE_CAPACITY_EXCEEDED

**Error description:** Azure file share limits a share to 5 TB of data. This limit has exceeded for some shares.

**Suggested resolution:** On the **Connect and copy** page of the Data Box local web UI, download, and review the error files.

Identify the folders that have this issue from the error logs and make sure that the files in that folder are under 5 TB.

### ERROR_BLOB_OR_FILE_NAME_CHARACTER_CONTROL

**Error description:** The blob or file names contain unsupported control characters.

**Suggested resolution:** The blobs or the files that you have copied contain names with unsupported characters.

On the **Connect and copy** page of the local web UI, download, and review the error files.
Remove or rename the files to remove unsupported characters.

For more information, see the Azure naming conventions for [blob names](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).

### ERROR_BLOB_OR_FILE_NAME_CHARACTER_ILLEGAL

**Error description:** The blob or file names contain illegal characters.

**Suggested resolution:** The blobs or the files that you have copied contain names with unsupported characters.

On the **Connect and copy** page of the local web UI, download, and review the error files.
Remove or rename the files to remove unsupported characters.

For more information, see the Azure naming conventions for [blob names](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).


### ERROR_BLOB_OR_FILE_NAME_ENDING

**Error description:** The blob or file names are ending with bad characters.

**Suggested resolution:** The blobs or the files that you have copied contain names with unsupported characters.

On the **Connect and copy** page of the local web UI, download, and review the error files.
Remove or rename the files to remove unsupported characters.

For more information, see the Azure naming conventions for [blob names](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names).


### ERROR_BLOB_OR_FILE_NAME_SEGMENT_COUNT

**Error description:** The blob or file name contains too many path segments.

**Suggested resolution:** The blobs or the files that you have copied exceed the maximum number of path segments. A path segment is the string between consecutive delimiter characters, for example, the forward slash /.

- On the **Connect and copy** page of the local web UI, download, and review the error files.
- Make sure that the [blob names](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) conform to Azure naming conventions.

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
- Make sure that the [blob names](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata#blob-names) and [file names](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) conform to Azure naming conventions.

### ERROR_BLOB_OR_FILE_SIZE_LIMIT

**Error description:** The file size exceeds the maximum file size for upload.

**Suggested resolution:** The blob or the file sizes exceed the maximum limit allowed for upload.

- On the **Connect and copy** page of the local web UI, download, and review the error files.
- Make sure that the blob and file sizes do not exceed the Azure object size limits.

### ERROR_BLOB_OR_FILE_SIZE_ALIGNMENT

**Error description:** The blob or file is incorrectly aligned.

**Suggested resolution:** The page blob share on Data Box only supports files that are 512 bytes aligned (for example, VHD/VHDX). Any data copied to the page blob share is uploaded to Azure as page blobs.

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


## Next steps

- Learn about the [Data Box Blob storage system requirements](data-box-system-requirements-rest.md).
