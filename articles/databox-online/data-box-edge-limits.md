---
title: Azure Data Box Edge limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 01/31/2019
ms.author: alkohli
---

# Azure Data Box Edge limits (Preview)

Consider these limits as you deploy and operate your Microsoft Azure Data Box Edge solution.

> [!IMPORTANT]
> Data Box Edge is in Preview. Review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution.


## Data Box Edge service limits

[!INCLUDE [Data Box Edge/Data Box Gateway limits](../../includes/data-box-edge-gateway-service-limits.md)]

## Data Box Edge device limits

The following table describes the limits for the Data Box Edge device.

| Description | Value |
|---|---|
|No. of files per device |100 million <br> Limit is ~ 25 million files for every 2 TB of disk space with maximum limit at 100 million |
|No. of shares per device |24 |
|Maximum file size written to a share|For a 2 TB virtual device, maximum file size is 500 GB. <br> The maximum file size increases with the data disk size in the preceding ratio until it reaches a maximum of 5 TB. |

## Azure storage limits

[!INCLUDE [Azure storage limits](../../includes/data-box-edge-gateway-storage-limits.md)]

## Data upload caveats

[!INCLUDE [Data upload caveats](../../includes/data-box-edge-gateway-data-upload-caveats.md)]

## Azure storage account size and object size limits

[!INCLUDE [Azure storage account size and object size limits](../../includes/data-box-edge-gateway-storage-acct-limits.md)]

## Azure object size limits

[!INCLUDE [Azure object size limits](../../includes/data-box-edge-gateway-object-size-limits.md)]

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
