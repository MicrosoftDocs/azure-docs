---
title: Azure Data Box Disk limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 09/04/2018
ms.author: alkohli
---
# Azure Data Box Disk limits (Preview)


Consider these limits as you deploy and operate your Microsoft Azure Data Box Disk solution. 

> [!IMPORTANT] 
> Azure Data Box Disk is in Preview. Review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 


## Data Box service limits

 - Data Box service is available only in US, EU, Canada, and Australia in all the Azure regions for Azure public cloud.
 - A single storage account is supported with Data Box Disk.

## Data Box Disk performance

When tested with disks connected via USB 3.0, the disk performance was up to 430 MB/s. The actual numbers vary depending upon the file size used. For smaller files, you may see lower performance.

## Azure storage limits

This section describes the limits for Azure Storage service, and the required naming conventions for Azure Files, Azure block blobs, and Azure page blobs, as applicable to the Data Box service. Review the storage limits carefully and follow all the recommendations.

For the latest information on Azure storage service limits and best practices for naming shares, containers, and files, go to:

- [Naming and referencing containers](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata)
- [Naming and referencing shares](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

> [!IMPORTANT]
> If there are any files or directories that exceed the Azure Storage service limits, or do not conform to Azure Files/Blob naming conventions, then these files or directories are not ingested into the Azure Storage via the Data Box service.

## Data upload caveats

- Do not copy data directly into the disks. Copy data to pre-created *BlockBlob* and *PageBlob* folders.
- A folder under the *BlockBlob* and *PageBlob* is a container. For instance, containers are created as *BlockBlob/container* and *PageBlob/container*.
- If you have an existing Azure object (such as a blob) in the cloud with the same name as the object that is being copied, Data Box Disk will overwrite the file in the cloud.
- Every file written into *BlockBlob* and *PageBlob* shares is uploaded as a block blob and page blob respectively.
- Any empty directory hierarchy (without any files) created under *BlockBlob* and *PageBlob* folders is not uploaded.
- If there are any errors when uploading data to Azure, an error log is created in the target storage account. The path to this error log is available in the portal when the upload is complete and you can review the log to take corrective action. Do not delete data from the source without verifying the uploaded data.

## Azure storage account size limits

Here are the limits on the size of the data that is copied into storage account. Make sure that the data you upload conforms to these limits. For the most up-to-date information on these limits, go to [Azure blob storage scale targets](https://docs.microsoft.com/en-us/azure/storage/common/storage-scalability-targets#azure-blob-storage-scale-targets) and [Azure Files scale targets](https://docs.microsoft.com/en-us/azure/storage/common/storage-scalability-targets#azure-files-scale-targets).

| Size of data copied into Azure storage account                      | Default limit          |
|---------------------------------------------------------------------|------------------------|
| Block Blob and page blob                                            | 500 TB per storage account. <br> This includes data from all the sources including Data Box Disk.|


## Azure object size limits

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block Blob        | ~ 8 TB                                                 |
| Page Blob         | 1 TB <br> (Every file uploaded in Page Blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> The VHD and VHDX are 512 bytes aligned.) |


## Azure block blob and page blob naming conventions

| Entity                                       | Conventions                                                                                                                                                                                                                                                                                                               |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Container names for block blob and page blob | Must be a valid DNS name that is 3 to 63 characters long. <br>  Must start with a letter or number. <br> Can contain only lowercase letters, numbers, and the hyphen (-). <br> Every hyphen (-) must be immediately preceded and followed by a letter or number. <br> Consecutive hyphens are not permitted in names. |
| Blob names for block blob and page blob      | Blob names are case-sensitive and can contain any combination of characters. <br> A blob name must be between 1 to 1,024 characters long. <br> Reserved URL characters must be properly escaped. <br>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory. |


## Next steps
* Review [Data Box system requirements](data-box-system-requirements.md)
