---
title: Troubleshoot issues on your Azure Data Box| Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box when uploading data to Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 04/23/2019
ms.author: alkohli
---

# Troubleshoot issues related to Azure Data Box

This article details information on how to troubleshoot issues you may see when using the Azure Data Box.


|Error code  |Error description  |Suggested resolution  |
|---------|---------|---------|
|ERROR_CONTAINER_OR_SHARE_NAME_LENGTH     |The container or share name must be between 3 and 63 characters.         | The folder under the Data Box (SMB/NFS) share to which you have copied data becomes an Azure container in your storage account. <br> <ul><li>On the **Connect and copy** page of the Data Box local web UI, download and review the error files to identify the folder names with issues.</li> <li>Change the folder name under the Data Box share to make sure that:</li><ul><li>The name has between 3 and 63 characters.</li><li>The names can only have letters, numbers, and hyphens.</li><li>The names can’t start or end with hyphens.</li>The names can’t have consecutive hyphens.</li></ul><li>Examples of valid names: `my-folder-1`, `my-really-extra-long-folder-111`</li><li>Examples of names that aren’t valid: `my-folder_1`, `my`, `--myfolder`, `myfolder--`, `myfolder!`</li><li>For more information, see the Azure naming conventions for [container names]() and [share names]().</li></ul>|
|ERROR_CONTAINER_OR_SHARE_NAME_ALPHA_NUMERIC_DASH    |The container or share name must consist of only letters, numbers, or hyphens.         |         |
|ERROR_CONTAINER_OR_SHARE_NAME_IMPROPER_DASH     |The container names and share names can’t start or end with hyphens and can’t have consecutive hyphens.         |         |
|ERROR_CONTAINER_OR_SHARE_NAME_DISALLOWED_FOR_TYPE     |Improper container names are specified for managed disk shares.          |For managed disks, within each share, the following folders are created which correspond to containers in your storage account: Premium SSD, Standard HDD, and Standard SSD. These folders correspond to the performance tier for the managed disk. <br><li>Make sure that you copy your page blob data (VHDs) into one of these existing folders. Only data from these existing containers is uploaded to Azure.</li><li>Any other folder that is created at the same level as Premium SSD, Standard HDD, and Standard SSD doesn’t correspond to a valid performance tier and can’t be used.</li><li>Remove files or folders created outside of the performance tiers.</li><br>For more information, see [Copy to managed disks](data-box-deploy-copy-data-from-vhds.md#connect-to-data-box).|
|ERROR_CONTAINER_OR_SHARE_CAPACITY_EXCEEDED     |Azure file share limits a share to 5 TB of data. This limit has exceeded for some shares.         |<li>On the **Connect and copy** page of the Data Box local web UI, download and review the error files.</li><li>Identify the folders that have this issue from the error logs and make sure that the files in that folder are under 5 TB.</li>|
|ERROR_BLOB_OR_FILE_NAME_CHARACTER_CONTROL|The blob or file names contain unsupported control characters. |The blobs or the files that you have copied contain names with unsupported characters.<li>On the **Connect and copy** page of the local web UI, download and review the error files.</li><li>Remove or rename the files to remove unsupported characters.</li><br>For more information, see the Azure naming conventions for [blob names]() and [file names]().|
|ERROR_BLOB_OR_FILE_NAME_CHARACTER_ILLEGAL|The blob or file names contain illegal characters.         |The blobs or the files that you have copied contain names with unsupported characters.<li>On the **Connect and copy** page of the local web UI, download and review the error files.</li><li>Remove or rename the files to remove unsupported characters.</li><br>For more information, see the Azure naming conventions for [blob names]() and [file names]().         |
|ERROR_BLOB_OR_FILE_NAME_ENDING    |The blob or file names are ending with bad characters.         |The blobs or the files that you have copied contain names with unsupported characters.<li>On the **Connect and copy** page of the local web UI, download and review the error files.</li><li>Remove or rename the files to remove unsupported characters.</li><br>For more information, see the Azure naming conventions for [blob names]() and [file names]().         |
|ERROR_BLOB_OR_FILE_NAME_SEGMENT_COUNT    |The blob or file name contains too many path segments.          |         |
|ERROR_BLOB_OR_FILE_NAME_AGGREGATE_LENGTH    |The blob or file name is too long.         |The blob or the file names exceed the maximum length.<ul><li>On the **Connect and copy** page of the local web UI, download and review the error files.</li><li>The blob name must not exceed 1024 characters.</li><li>Remove or rename the blob or files so that the names don’t exceed 1024 characters.</li></ul><br>For more information, see the Azure naming conventions for blob names and file names.|
|ERROR_BLOB_OR_FILE_NAME_COMPONENT_LENGTH   |One of the segments in the blob or file name is too long.         |         |
|ERROR_BLOB_OR_FILE_SIZE_LIMIT    |The file size exceeds the maximum file size for upload.         |         |
|ERROR_BLOB_OR_FILE_SIZE_ALIGNMENT    |The blob or file is incorrectly aligned.         |The page blob share on Data Box only supports files that are 512 bytes aligned (for example, VHD/VHDX). Any data copied to the page blob share is uploaded to Azure as page blobs.<br>Remove any non-VHD/VHDX data from the page blob share. You can use shares for block blob or Azure files for generic data.<br>For more information, see [Overview of Page blobs](../../storage/blobs/storage-blob-pageblob-overview.md).|
|ERROR_BLOB_OR_FILE_TYPE_UNSUPPORTED   |An unsupported file type is present in a managed disk share. Only fixed VHDs are allowed.         |Make sure that you only upload the fixed VHDs to create managed disks. <br>VHDX files or dynamic and differencing VHDs are not supported.|
|ERROR_DIRECTORY_DISALLOWED_FOR_TYPE    |A directory is not allowed in any of the pre-existing folders for the managed disks. Only fixed VHDs are allowed in these folders.         |For managed disks, within each share, the following three folders are created which correspond to containers in your storage account: Premium SSD, Standard HDD, and Standard SSD. These folders correspond to the performance tier for the managed disk.<ul><li>Make sure that you copy your page blob data (VHDs) into one of these existing folders.</li><li>A folder or directory is not allowed in these existing folders. Remove any folders that you have created inside the pre-existing folders.</li></ul>For more information, see [Copy to managed disks](data-box-deploy-copy-data-from-vhds.md#connect-to-data-box).|


## Next steps

- Learn about the [Data Box Blob storage system requirements](data-box-system-requirements-rest.md).
