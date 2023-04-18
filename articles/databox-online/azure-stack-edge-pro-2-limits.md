---
title: Azure Stack Edge Pro 2 limits for device and service
description: Learn about limits and recommended sizes as you deploy and operate Azure Stack Edge Pro 2, including service limits, device limits, and storage limits.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/09/2022
ms.author: alkohli
---

# Azure Stack Edge Pro 2 limits

Consider these limits as you deploy and operate your Microsoft Azure Stack Edge Pro 2 solution. 

## Azure Stack Edge service limits

[!INCLUDE [data-box-edge-gateway-service-limits](../../includes/data-box-edge-gateway-service-limits.md)]

## Azure Stack Edge Pro 2 device limits

The following table describes the limits for the Azure Stack Edge Pro 2 device.

| Description | Value |
|---|---|
|No. of files per device |100 million |
|No. of shares per container |1 |
|Maximum no. of share endpoints and REST endpoints per device (GPU devices only)| 24 |
|Maximum no. of tiered storage accounts per device (GPU devices only)| 24|
|Maximum file size written to a share| 5 TB |
|Maximum number of resource groups per device| 800 |

## Azure storage limits

[!INCLUDE [data-box-edge-gateway-storage-limits](../../includes/data-box-edge-gateway-storage-limits.md)]

## Data upload caveats

[!INCLUDE [data-box-edge-gateway-storage-data-upload-caveats](../../includes/data-box-edge-gateway-storage-data-upload-caveats.md)]

## Azure storage account size limits

[!INCLUDE [data-box-edge-gateway-storage-acct-limits](../../includes/data-box-edge-gateway-storage-acct-limits.md)]


## Azure object size limits

[!INCLUDE [data-box-edge-gateway-storage-object-limits](../../includes/data-box-edge-gateway-storage-object-limits.md)]

## Next steps

- [Prepare to deploy Azure Stack Edge Pro 2](azure-stack-edge-pro-2-deploy-prep.md)

