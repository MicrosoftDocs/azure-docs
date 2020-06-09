---
title: Azure Data Box limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box components and connections.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 06/08/2020
ms.author: alkohli
---
# Azure Data Box limits

Consider these limits as you deploy and operate your Microsoft Azure Data Box. The following table describes these limits for the Data Box.

## Data Box service limits

[!INCLUDE [data-box-service-limits](../../includes/data-box-service-limits.md)]

## Data Box limits

- Data Box can store a maximum of 500 million files for both import and export.
- Data Box supports a maximum of 512 containers or shares in the cloud. The top-level directories within the user share become containers or Azure file shares in the cloud. 
- Data Box usage capacity may be less than 80 TB because of ReFS metadata space consumption.

## Azure storage limits

[!INCLUDE [data-box-storage-limits](../../includes/data-box-storage-limits.md)]

## Data upload caveats

Data Box caveats for an import order include:

[!INCLUDE [data-box-data-upload-caveats](../../includes/data-box-data-upload-caveats.md)]

Data Box caveats for an export order include:

- There is a 1:1 mapping from prefix to container.
- Maximum filename size is 1024 characters files, filenames that exceed this length will not export.
- Duplicate prefixes in the *xml* file are exported (duplicates are not ignored).
- Page blobs and container names are case sensitive, so if the casing is mismatched, the blob and/or container will not be found.

## Azure storage account size limits

[!INCLUDE [data-box-storage-account-size-limits](../../includes/data-box-storage-account-size-limits.md)]

## Azure object size limits

[!INCLUDE [data-box-object-size-limits](../../includes/data-box-object-size-limits.md)]

## Azure block blob, page blob, and file naming conventions

[!INCLUDE [data-box-naming-conventions](../../includes/data-box-naming-conventions.md)]
