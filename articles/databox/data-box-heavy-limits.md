---
title: Azure Data Box Heavy limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Heavy components and connections.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: heavy
ms.topic: article
ms.date: 06/28/2021
ms.author: shaas
---

# Azure Data Box Heavy limits

Consider these limits as you deploy and operate your Azure Data Box Heavy device. The following table describes these limits for the Data Box.


## Data Box Heavy service limits

[!INCLUDE [data-box-service-limits](../../includes/data-box-service-limits.md)]

## Data Box Heavy limits

- Data Box Heavy can store a maximum of 1 billion files per node.
- Data Box Heavy supports a maximum of 512 containers or shares per node in the cloud. The top-level directories within the user share become containers or Azure file shares in the cloud. 

## Azure Storage limits

[!INCLUDE [data-box-storage-limits](../../includes/data-box-storage-limits.md)]

## Data upload caveats

[!INCLUDE [data-box-data-upload-caveats](../../includes/data-box-data-upload-caveats.md)]

## Azure storage account size limits

[!INCLUDE [data-box-storage-account-size-limits](../../includes/data-box-storage-account-size-limits.md)]

## Azure object size limits

[!INCLUDE [data-box-object-size-limits](../../includes/data-box-object-size-limits.md)]

## Azure block blob, page blob, and file naming conventions

[!INCLUDE [data-box-naming-conventions](../../includes/data-box-naming-conventions.md)]
