---
title: Azure Data Box Disk limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Disk.
services: databox
author: stevenmatthew

ms.service: azure-data-box-disk
ms.topic: concept-article
ms.date: 04/08/2026
ms.author: shaas
# Customer intent: As a cloud administrator, I want to understand the limits and requirements for deploying Azure Data Box Disk, so that I can ensure compliance and optimize data transfer to Azure storage.
---
# Azure Data Box Disk limits

The following sections contain limits that should be observed as you deploy and operate your Azure Data Box Disk solution.

## Data Box service limits

 - The Data Box service is available in the Azure regions listed within the [Region availability](data-box-disk-overview.md#region-availability) section of the [Data Box overview](data-box-disk-overview.md) article.
 - Data Box Disk supports a single storage account.
 - Data Box Disk can store a maximum of 100,000 files 
 - Data Box Disk supports a maximum of 512 containers or shares in the cloud. The top-level directories within the user share become containers or Azure file shares in the cloud.

## Data Box Disk performance

Disk throughput performance of up to 430 MB/s was observed when disks are connected via USB 3.0. Actual performance varies depending upon the file size used. For example, smaller files frequently result in lower performance.

## Azure storage limits

This section describes the limits for the Azure Storage service, including required naming conventions for Azure Files, and block and page blobs, as they pertain to the Data Box service. Review the storage limits carefully and follow all recommendations.

For the latest Azure storage service limits, including and best practices for naming shares, containers, and files, refer to:

- [Naming and referencing containers](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).
- [Naming and referencing shares](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata).
- [Block blobs and page blob conventions](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

> [!IMPORTANT]
> Files or directories that exceed Azure Storage service limits or don't conform to Azure file or blob naming conventions aren't ingested into Azure Storage via the Data Box service.

## Data copy and upload caveats

- Azure Data Box doesn't support importing data into Network File System (NFS) Azure file shares. Copying data between source and destination NFS Azure file shares sharing identical names creates a conflict. To resolve this conflict, Data Box renames the source share to *databox`-<GUID>`* and uploads it to the target storage account as a Server Message Block (SMB) Azure file share.
- Don't copy data directly onto the disk root. Copy data to precreated *BlockBlob*, *PageBlob*, and *AzureFile* folders.
- Any folder created within the *BlockBlob* and *PageBlob* folder becomes a container. For instance, containers are created as *BlockBlob/`container`* and *PageBlob/`container`*.
- If a folder shares the same name as an existing container, that folder's contents are merged with the container's contents. Files or blobs that don't already in the cloud are added to the container. If a file or blob shares the same name as a file or blob that already exists within the container, the existing file or blob is overwritten.
- Every file written into *BlockBlob* and *PageBlob* shares is uploaded as a block blob and page blob, respectively.
- Azure blob and file hierarchies are maintained while uploading to the cloud. For example, copying a file with a path of `<container folder>\A\B\C.txt` results in the file uploaded to the same cloud path.
- Any empty directory hierarchy (without any files) created under *BlockBlob* and *PageBlob* folders isn't uploaded.
- Any path and file name exceeding 256 characters in your copy operations lead to failures by the Data Box Split Copy Tool (`DataBoxDiskSplitCopy.exe`) or the Data Box Disk Validation tool (`DataBoxDiskValidation.cmd`) if long paths aren't enabled on the client. To avoid this kind of failure, [enable long paths on your Windows client](/windows/win32/fileio/maximum-file-path-limitation?tabs=cmd#enable-long-paths-in-windows-10-version-1607-and-later).
- Any error generated during upload to Azure generates an error log within the target storage account. The path to this error log is available in the portal after the upload is complete. You must review the log file and take corrective action to avoid data loss. Never delete data from the source without verifying the uploaded data.
- If you specified managed disks in your order, review the following considerations:

    - You can have only one managed disk with a given name in a resource group across the precreated folders, across the Data Box Disk. Therefore, all Virtual Hard Disks (VHD) uploaded to the precreated folders must have unique names. Make sure that the given name doesn't match an existing managed disk within a resource group. If any VHDs share an identical name, only one VHD is converted to a managed disk with that name. All other VHDs are uploaded as page blobs into the staging storage account.
    - Always copy the VHDs to one of the precreated folders. Any VHD copied outside of these folders or into a folder that you create is uploaded to your storage account as a page blob instead of a managed disk.
    - Only fixed VHDs can be uploaded to create managed disks. Operations for Dynamic VHDs, differencing VHDs, or Virtual Hard Disk v2 (VHDX) files aren't supported.
    - Non VHD files copied to the precreated managed disk folders aren't converted to a managed disk.

## Azure storage account size limits

The following table contains the limits pertaining to the size of data that can be copied into a storage account. Ensure that the data you upload complies with these limits. 

| Type of data             | Default limit          |
|--------------------------|------------------------|
| block blob, page blob    | For current information about these limits, see [Azure Blob storage scale targets](../storage/blobs/scalability-targets.md#scale-targets-for-blob-storage), [Azure standard storage scale targets](../storage/common/scalability-targets-standard-account.md#scale-targets-for-standard-storage-accounts-and-disk-access-resources), and [Azure Files scale targets](../storage/files/storage-files-scale-targets.md). <br /><br /> The limits include data from all the sources, including Data Box Disk. |

## Azure object size limits

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block blob        | 7 TiB                                                  |
| Page blob         | 7 TiB <br> Every file uploaded in page blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> VHD and VHDX are 512 bytes aligned. |
| Azure Files        | 4 TiB                                                      |
| Managed disks     | 4 TiB <br> For more information on size and limits, see: <li>[Scalability targets of Standard SSDs](/azure/virtual-machines/disks-types#standard-ssds)</li><li>[Scalability targets of Premium SSDs](/azure/virtual-machines/disks-types#standard-hdds)</li><li>[Scalability targets of Standard HDDs](/azure/virtual-machines/disks-types#premium-ssds)</li><li>[Pricing and billing of managed disks](/azure/virtual-machines/disks-types#billing)</li>

## Azure block blob, page blob, and file naming conventions

[!INCLUDE [data-box-naming-conventions](../../includes/data-box-naming-conventions.md)]

<!--| Entity                                       | Conventions                                                                                                                                                                                                                                                                                                               |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Container names for block blob and page blob <br> Fileshare names for Azure Files | Must be a valid DNS name that is 3 to 63 characters long. <br>  Must start with a letter or number. <br> Can contain only lowercase letters, numbers, and the hyphen (-). <br> Every hyphen (-) must be immediately preceded and followed by a letter or number. <br> Consecutive hyphens are not permitted in names. |
| Directory and file names for Azure files     |<li> Case-preserving, case-insensitive and must not exceed 255 characters in length. </li><li> Cannot end with the forward slash (/). </li><li>If provided, it will be automatically removed. </li><li> Following characters are not allowed: <code>" \\ / : \| < > * ?</code></li><li> Reserved URL characters must be properly escaped. </li><li> Illegal URL path characters are not allowed. Code points like \\uE000 are not valid Unicode characters. Some ASCII or Unicode characters, like control characters (0x00 to 0x1F, \\u0081, etc.), are also not allowed. For rules governing Unicode strings in HTTP/1.1 see RFC 2616, Section 2.2: Basic Rules and RFC 3987. </li><li> Following file names are not allowed: LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, PRN, AUX, NUL, CON, CLOCK$, dot character (.), and two dot characters (..).</li>|
| Blob names for block blob and page blob      | Blob names are case-sensitive and can contain any combination of characters. <br> A blob name must be between 1 to 1,024 characters long. <br> Reserved URL characters must be properly escaped. <br>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory. | -->

## Managed disk naming conventions

| Entity             | Conventions                                               |
|--------------------|-----------------------------------------------------------|
| Managed disk names | <li>The name must be 1 to 80 characters long. </li><li> The name must begin with a letter or number, end with a letter, number, or underscore. </li><li> The name can only contain letters, numbers, underscores, periods, or hyphens. </li><li>The name shouldn't contain spaces or `/`.</li>                            |

## Next steps

- Review [Data Box Disk system requirements](data-box-disk-system-requirements.md)
