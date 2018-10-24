---
title: Azure Data Box limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box components and connections.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 10/10/2018
ms.author: alkohli
---
# Azure Data Box limits

Consider these limits as you deploy and operate your Microsoft Azure Data Box. The following table describes these limits for the Data Box.


## Data Box service limits

 - Data Box service is available only within US at all the [Azure regions for Azure public cloud](https://azure.microsoft.com/regions/).
 - If using multiple storage accounts with Data Box service, all the storage accounts need to belong to the same Azure region only.
 - We recommend that you use no more than three storage accounts. Using more storage accounts could potentially impact the performance.

## Data Box limits

- Data Box can store a maximum of 500 million files.

## Azure storage limits

This section describes the limits for Azure Storage service, and the required naming conventions for Azure Files, Azure block blobs, and Azure page blobs, as applicable to the Data Box service. Review the storage limits carefully and follow all the recommendations.

For the latest information on Azure storage service limits and best practices for naming shares, containers, and files, go to:

- [Naming and referencing containers](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata)
- [Naming and referencing shares](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

> [!IMPORTANT]
> If there are any files or directories that exceed the Azure Storage service limits, or do not conform to Azure Files/Blob naming conventions, then these files or directories are not ingested into the Azure Storage via the Data Box service.

## Data upload caveats

- Do not copy data directly under any of the precreated shares. You need to create a folder under the share and then copy data to that folder.
- A folder under the *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* is a container. For instance, containers are created as *StorageAccount_BlockBlob/container* and *StorageAccount_PageBlob/container*.
- Each folder created directly under *StorageAccount_AzureFiles* is translated into an Azure File Share.
- If you have an existing Azure object (such as a blob or a file) in the cloud with the same name as the object that is being copied, Data Box will overwrite the file in the cloud.
- Every file written into *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* shares is uploaded as a block blob and page blob respectively.
- Azure blob storage does not support directories. If you create a folder under the *StorageAccount_BlockBlob* folder, then virtual folders are created in the blob name. For Azure Files, the actual directory structure is maintained.
- Any empty directory hierarchy (without any files) created under *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* folders is not uploaded.
- If there are any errors when uploading data to Azure, an error log is created in the target storage account. The path to this error log is available when the upload is complete and you can review the log to take corrective action. Do not delete data from the source without verifying the uploaded data.

## Azure storage account size limits

Here are the limits on the size of the data that is copied into storage account. Make sure that the data you upload conforms to these limits. For the most up-to-date information on these limits, go to [Azure blob storage scale targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets#azure-blob-storage-scale-targets) and [Azure Files scale targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets#azure-files-scale-targets).

| Size of data copied into Azure storage account                      | Default Limit          |
|---------------------------------------------------------------------|------------------------|
| Block blob and page blob                                            | 500 TiB per storage account. <br> This includes data from all the sources including Data Box.|
| Azure File                                                          | 5 TiB per share.<br> All folders under *StorageAccount_AzureFiles* must follow this limit.       |

## Azure object size limits

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default Limit                                             |
|-------------------|-----------------------------------------------------------|
| Block blob        | ~ 4.75 TiB                                                 |
| Page blob         | 8 TiB <br> Every file uploaded in page blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> VHD and VHDX are 512 bytes aligned. |
| Azure File        | 1 TiB                                                      |

## Azure block blob, page blob, and file naming conventions

| Entity                                       | Conventions                                                                                                                                                                                                                                                                                                               |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Container names for block blob and page blob | Must be a valid DNS name that is 3 to 63 characters long. <br>  Must start with a letter or number. <br> Can contain only lowercase letters, numbers, and the hyphen (-). <br> Every hyphen (-) must be immediately preceded and followed by a letter or number. <br> Consecutive hyphens are not permitted in names. |
| Share names for Azure files                  | Same as above                                                                                                                                                                                                                                                                                                             |
| Directory and file names for Azure files     |<li> Case-preserving, case-insensitive and must not exceed 255 characters in length. </li><li> Cannot end with the forward slash (/). </li><li>If provided, it will be automatically removed. </li><li> Following characters are not allowed: `" \ / : | < > * ?`</li><li> Reserved URL characters must be properly escaped. </li><li> Illegal URL path characters are not allowed. Code points like \uE000 are not valid Unicode characters. Some ASCII or Unicode characters, like control characters (0x00 to 0x1F, \u0081, etc.), are also not allowed. For rules governing Unicode strings in HTTP/1.1 see RFC 2616, Section 2.2: Basic Rules and RFC 3987. </li><li> Following file names are not allowed: LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, PRN, AUX, NUL, CON, CLOCK$, dot character (.), and two dot characters (..).</li>|
| Blob names for block blob and page blob      | </li><li>Blob names are case-sensitive and can contain any combination of characters. </li><li>A blob name must be between 1 to 1,024 characters long. </li><li>Reserved URL characters must be properly escaped. </li><li>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory.</li> |
