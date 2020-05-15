---
title: Azure Data Box Disk limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Disk.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 11/05/2019
ms.author: alkohli
---
# Azure Data Box Disk limits


Consider these limits as you deploy and operate your Microsoft Azure Data Box Disk solution.

## Data Box service limits

 - Data Box service is available in the Azure regions listed in [Region availability](data-box-disk-overview.md#region-availability).
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

- Do not copy data directly into the disks. Copy data to pre-created *BlockBlob*,*PageBlob*, and *AzureFile* folders.
- A folder under the *BlockBlob* and *PageBlob* is a container. For instance, containers are created as *BlockBlob/container* and *PageBlob/container*.
- If you have an existing Azure object (such as a blob) in the cloud with the same name as the object that is being copied, Data Box Disk will rename the file as file(1) in the cloud.
- Every file written into *BlockBlob* and *PageBlob* shares is uploaded as a block blob and page blob respectively.
- Any empty directory hierarchy (without any files) created under *BlockBlob* and *PageBlob* folders is not uploaded.
- If there are any errors when uploading data to Azure, an error log is created in the target storage account. The path to this error log is available in the portal when the upload is complete and you can review the log to take corrective action. Do not delete data from the source without verifying the uploaded data.
- File metadata and NTFS permissions are not preserved when the data is uploaded to Azure Files. For example, the *Last modified* attribute of the files will not be kept when the data is copied.
- If you specified managed disks in the order, review the following additional considerations:

    - You can only have one managed disk with a given name in a resource group across all the precreated folders and across all the Data Box Disk. This implies that the VHDs uploaded to the precreated folders should have unique names. Make sure that the given name does not match an already existing managed disk in a resource group. If VHDs have same names, then only one VHD is converted to managed disk with that name. The other VHDs are uploaded as page blobs into the staging storage account.
    - Always copy the VHDs to one of the precreated folders. If you copy the VHDs outside of these folders or in a folder that you created, the VHDs are uploaded to Azure Storage account as page blobs and not managed disks.
    - Only the fixed VHDs can be uploaded to create managed disks. Dynamic VHDs, differencing VHDs or VHDX files are not supported.

## Azure storage account size limits

Here are the limits on the size of the data that is copied into storage account. Make sure that the data you upload conforms to these limits. For the most up-to-date information on these limits, go to [Azure blob storage scale targets](https://docs.microsoft.com/azure/storage/blobs/scalability-targets#scale-targets-for-blob-storage) and [Azure Files scale targets](https://docs.microsoft.com/azure/storage/common/scalability-targets-standard-account#scale-targets-for-standard-storage-accounts).

| Size of data copied into Azure storage account                      | Default limit          |
|---------------------------------------------------------------------|------------------------|
| Block Blob and page blob                                            | 500 TB per storage account. <br> This includes data from all the sources including Data Box Disk.|


## Azure object size limits

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block Blob        | ~ 4.75 TiB                                                 |
| Page Blob         | 8 TiB <br> (Every file uploaded in Page Blob format must be 512 bytes aligned, else the upload fails. <br> Both the VHD and VHDX are 512 bytes aligned.) |
|Azure Files        | 1 TiB <br> Max. size of share is 5 TiB     |
| Managed disks     |4 TiB <br> For more information on size and limits, see: <li>[Scalability targets for managed disks](../virtual-machines/windows/disk-scalability-targets.md#managed-virtual-machine-disks)</li>|


## Azure block blob, page blob, and file naming conventions

| Entity                                       | Conventions                                                                                                                                                                                                                                                                                                               |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Container names for block blob and page blob <br> Fileshare names for Azure Files | Must be a valid DNS name that is 3 to 63 characters long. <br>  Must start with a letter or number. <br> Can contain only lowercase letters, numbers, and the hyphen (-). <br> Every hyphen (-) must be immediately preceded and followed by a letter or number. <br> Consecutive hyphens are not permitted in names. |
| Directory and file names for Azure files     |<li> Case-preserving, case-insensitive and must not exceed 255 characters in length. </li><li> Cannot end with the forward slash (/). </li><li>If provided, it will be automatically removed. </li><li> Following characters are not allowed: <code>" \\ / : \| < > * ?</code></li><li> Reserved URL characters must be properly escaped. </li><li> Illegal URL path characters are not allowed. Code points like \\uE000 are not valid Unicode characters. Some ASCII or Unicode characters, like control characters (0x00 to 0x1F, \\u0081, etc.), are also not allowed. For rules governing Unicode strings in HTTP/1.1 see RFC 2616, Section 2.2: Basic Rules and RFC 3987. </li><li> Following file names are not allowed: LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, PRN, AUX, NUL, CON, CLOCK$, dot character (.), and two dot characters (..).</li>|
| Blob names for block blob and page blob      | Blob names are case-sensitive and can contain any combination of characters. <br> A blob name must be between 1 to 1,024 characters long. <br> Reserved URL characters must be properly escaped. <br>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory. |

## Managed disk naming conventions

| Entity | Conventions                                             |
|-------------------|-----------------------------------------------------------|
| Managed disk names       | <li> The name must be 1 to 80 characters long. </li><li> The name must begin with a letter or number, end with a letter, number or underscore. </li><li> The name may contain only letters, numbers, underscores, periods, or hyphens. </li><li> 	The name should not have spaces or `/`.                                              |

## Next steps

- Review [Data Box Disk system requirements](data-box-disk-system-requirements.md)
