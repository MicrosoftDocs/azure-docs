---
title: Azure Data Box Disk limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Disk.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 12/29/2022
ms.author: shaas
---
# Azure Data Box Disk limits

Consider these limits as you deploy and operate your Microsoft Azure Data Box Disk solution.

## Data Box service limits

 - Data Box service is available in the Azure regions listed in [Region availability](data-box-disk-overview.md#region-availability).
 - A single storage account is supported with Data Box Disk.
 - Data Box Disk supports a maximum of 512 containers or shares in the cloud. The top-level directories within the user share become containers or Azure file shares in the cloud.

## Data Box Disk performance

When tested with disks connected via USB 3.0, the disk performance was up to 430 MB/s. The actual numbers vary depending upon the file size used. For smaller files, you may see lower performance.

## Azure storage limits

This section describes the limits for Azure Storage service, and the required naming conventions for Azure Files, Azure block blobs, and Azure page blobs, as applicable to the Data Box service. Review the storage limits carefully and follow all the recommendations.

For the latest information on Azure storage service limits and best practices for naming shares, containers, and files, go to:

- [Naming and referencing containers](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata)
- [Naming and referencing shares](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

> [!IMPORTANT]
> If there are any files or directories that exceed the Azure Storage service limits, or don't conform to Azure Files/Blob naming conventions, then these files or directories are not ingested into the Azure Storage via the Data Box service.

## Data copy and upload caveats

- Don't copy data directly into the disks. Copy data to pre-created *BlockBlob*, *PageBlob*, and *AzureFile* folders.
- A folder under the *BlockBlob* and *PageBlob* is a container. For instance, containers are created as *BlockBlob/container* and *PageBlob/container*.
- If a folder has the same name as an existing container, the folder's contents are merged with the container's contents. Files or blobs that aren't already in the cloud are added to the container. If a file or blob has the same name as a file or blob that's already in the container, the existing file or blob is overwritten.
- Every file written into *BlockBlob* and *PageBlob* shares is uploaded as a block blob and page blob respectively. 
- The hierarchy of files is maintained while uploading to the cloud for both blobs and Azure Files. For example, you copied a file at this path: `<container folder>\A\B\C.txt`. This file is uploaded to the same path in cloud.
- Any empty directory hierarchy (without any files) created under *BlockBlob* and *PageBlob* folders isn't uploaded.
- If you don't have long paths enabled on the client, and any path and file name in your data copy exceeds 256 characters, the Data Box Split Copy Tool (DataBoxDiskSplitCopy.exe) or the Data Box Disk Validation tool (DataBoxDiskValidation.cmd) will report failures. To avoid this kind of failure, [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later).
- To improve performance during data uploads, we recommend that you [enable large file shares on the storage account and increase share capacity to 100 TiB](../../articles/storage/files/storage-how-to-create-file-share.md#enable-large-file-shares-on-an-existing-account). Large file shares are only supported for storage accounts with locally redundant storage (LRS).
- If there are any errors when uploading data to Azure, an error log is created in the target storage account. The path to this error log is available in the portal when the upload is complete and you can review the log to take corrective action. Don't delete data from the source without verifying the uploaded data.
- File metadata and NTFS permissions aren't preserved when the data is uploaded to Azure Files. For example, the *Last modified* attribute of the files won't be kept when the data is copied.
- If you specified managed disks in the order, review the following additional considerations:

    - You can only have one managed disk with a given name in a resource group across all the precreated folders and across all the Data Box Disk. This implies that the VHDs uploaded to the precreated folders should have unique names. Make sure that the given name doesn't match an already existing managed disk in a resource group. If VHDs have same names, then only one VHD is converted to managed disk with that name. The other VHDs are uploaded as page blobs into the staging storage account.
    - Always copy the VHDs to one of the precreated folders. If you copy the VHDs outside of these folders or in a folder that you created, the VHDs are uploaded to Azure Storage account as page blobs and not managed disks.
    - Only the fixed VHDs can be uploaded to create managed disks. Dynamic VHDs, differencing VHDs or VHDX files aren't supported.
    - Non VHD files copied to the precreated managed disk folders won't be converted to a managed disk.

## Azure storage account size limits

Here are the limits on the size of data that can be copied into a storage account. Make sure that the data you upload conforms to these limits. 

| Type of data             | Default limit          |
|--------------------------|------------------------|
| block blob, page blob    | For current information about these limits, see [Azure Blob storage scale targets](../storage/blobs/scalability-targets.md#scale-targets-for-blob-storage), [Azure standard storage scale targets](../storage/common/scalability-targets-standard-account.md#scale-targets-for-standard-storage-accounts), and [Azure Files scale targets](../storage/files/storage-files-scale-targets.md). <br /><br /> The limits include data from all the sources, including Data Box Disk.|

## Azure object size limits

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block blob        | 7 TiB                                                  |
| Page blob         | 4 TiB <br> Every file uploaded in page blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> VHD and VHDX are 512 bytes aligned. |
| Azure Files        | 1 TiB                                                      |
| Managed disks     | 4 TiB <br> For more information on size and limits, see: <li>[Scalability targets of Standard SSDs](../virtual-machines/disks-types.md#standard-ssds)</li><li>[Scalability targets of Premium SSDs](../virtual-machines/disks-types.md#standard-hdds)</li><li>[Scalability targets of Standard HDDs](../virtual-machines/disks-types.md#premium-ssds)</li><li>[Pricing and billing of managed disks](../virtual-machines/disks-types.md#billing)</li>

## Azure block blob, page blob, and file naming conventions

[!INCLUDE [data-box-naming-conventions](../../includes/data-box-naming-conventions.md)]

<!--| Entity                                       | Conventions                                                                                                                                                                                                                                                                                                               |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Container names for block blob and page blob <br> Fileshare names for Azure Files | Must be a valid DNS name that is 3 to 63 characters long. <br>  Must start with a letter or number. <br> Can contain only lowercase letters, numbers, and the hyphen (-). <br> Every hyphen (-) must be immediately preceded and followed by a letter or number. <br> Consecutive hyphens are not permitted in names. |
| Directory and file names for Azure files     |<li> Case-preserving, case-insensitive and must not exceed 255 characters in length. </li><li> Cannot end with the forward slash (/). </li><li>If provided, it will be automatically removed. </li><li> Following characters are not allowed: <code>" \\ / : \| < > * ?</code></li><li> Reserved URL characters must be properly escaped. </li><li> Illegal URL path characters are not allowed. Code points like \\uE000 are not valid Unicode characters. Some ASCII or Unicode characters, like control characters (0x00 to 0x1F, \\u0081, etc.), are also not allowed. For rules governing Unicode strings in HTTP/1.1 see RFC 2616, Section 2.2: Basic Rules and RFC 3987. </li><li> Following file names are not allowed: LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, PRN, AUX, NUL, CON, CLOCK$, dot character (.), and two dot characters (..).</li>|
| Blob names for block blob and page blob      | Blob names are case-sensitive and can contain any combination of characters. <br> A blob name must be between 1 to 1,024 characters long. <br> Reserved URL characters must be properly escaped. <br>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory. | -->

## Managed disk naming conventions

| Entity | Conventions                                             |
|-------------------|-----------------------------------------------------------|
| Managed disk names       | <li> The name must be 1 to 80 characters long. </li><li> The name must begin with a letter or number, end with a letter, number or underscore. </li><li> The name may contain only letters, numbers, underscores, periods, or hyphens. </li><li>     The name shouldn't have spaces or `/`.                     |

## Next steps

- Review [Data Box Disk system requirements](data-box-disk-system-requirements.md)
