---
title: Azure Data Box Gateway limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Microsoft Azure Data Box Gateway.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 10/20/2020
ms.author: shaas
---

# Azure Data Box Gateway limits

Consider these limits as you deploy and operate your Microsoft Azure Data Box Gateway solution.

## Data Box Gateway service limits

[!INCLUDE [data-box-gateway-service-limits](../../includes/data-box-gateway-service-limits.md)]

## Data Box Gateway device limits

The following table describes the limits for the Data Box Gateway device.

| Description | Value |
|---|---|
|No. of files per device |100 million <br> For every 25 million files that are being added (with maximum limit at 100 million), you should add 2 TB of disk space, 8 GB of RAM, and 4 cores of CPU. |
|No. of shares per device |24 |
|No. of shares per Azure storage container |1 |
|Maximum file size written to a share|For a 2-TB virtual device, maximum file size is 500 GB. <br> The maximum file size increases with the data disk size in the preceding ratio until it reaches a maximum of 5 TB. |

## Azure storage limits

[!INCLUDE [data-box-gateway-storage-limits](../../includes/data-box-gateway-storage-limits.md)]

## Data upload caveats

[!INCLUDE [data-box-gateway-storage-data-upload-caveats](../../includes/data-box-gateway-storage-data-upload-caveats.md)]

## Azure storage account size and object size limits

[!INCLUDE [data-box-gateway-storage-acct-limits](../../includes/data-box-gateway-storage-acct-limits.md)]

## Azure object size limits

[!INCLUDE [data-box-gateway-storage-object-limits](../../includes/data-box-gateway-storage-object-limits.md)]

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
