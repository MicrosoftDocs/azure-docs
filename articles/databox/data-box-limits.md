---
title: Azure Data Box limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box components and connections.
services: databox
author: stevenmatthew

ms.service: azure-databox
ms.topic: conceptual
ms.date: 01/25/2022
ms.author: shaas
---
# Azure Data Box limits

Consider these limits as you deploy and operate your Microsoft Azure Data Box. The following table describes these limits for the Data Box.

## Data Box service limits

[!INCLUDE [data-box-service-limits](../../includes/data-box-service-limits.md)]

## Data Box limits

- Data Box can store a maximum of 500 million files for both import and export.
- Data Box supports a maximum of 512 containers or shares in the cloud. The top-level directories within the user share become containers or Azure file shares in the cloud. 
- Data Box usage capacity might be less than 80 TiB because of ReFS metadata space consumption.
- Data Box supports a maximum of 10 client connections at a time on a Network File System (NFS) share.

## Azure storage limits

[!INCLUDE [data-box-storage-limits](../../includes/data-box-storage-limits.md)]

## Data copy and upload caveats

### For import order

Data Box caveats for an import order include:

[!INCLUDE [data-box-data-upload-caveats](../../includes/data-box-data-upload-caveats.md)]

### For export order

Data Box caveats for an export order include:

- Data Box is a Windows-based device and doesn’t support case-sensitive file names. For example, you might have two different files in Azure with names that just differ in casing. Don't use Data Box to export such files as the files are overwritten on the device.
- If you have duplicate tags in input files or tags referring to the same data, the Data Box export might skip or overwrite the files. The number of files and size of data that the Azure portal displays might differ from the actual size of data on the device. 
- Data Box exports data to Windows-based system over the Server Message Block (SMB) protocol and is limited by SMB limitations for files and folders. Files and folders with unsupported names aren't exported.
- There's a 1:1 mapping from prefix to container.
- Maximum filename size is 1,024 characters. Filenames that exceed this length aren't exported. 
- Duplicate prefixes in the *xml* file (uploaded during order creation) are exported. Duplicate prefixes aren't ignored.
- Page blobs and container names are case-sensitive. If the casing is mismatched, the blob and/or container won't be found.
- Data Box currently does not support the scenario where the customer's data is actively changing during export
 

## Azure storage account size limits

[!INCLUDE [data-box-storage-account-size-limits](../../includes/data-box-storage-account-size-limits.md)]

## Azure object size limits

[!INCLUDE [data-box-object-size-limits](../../includes/data-box-object-size-limits.md)]

## Azure block blob, page blob, and file naming conventions

[!INCLUDE [data-box-naming-conventions](../../includes/data-box-naming-conventions.md)]
