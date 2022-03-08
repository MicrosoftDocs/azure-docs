---
title: Azure Stack Edge Pro GPU/Pro FPGA limits | Microsoft Docs
description: Learn about limits and recommended sizes as you deploy and operate Azure Stack Edge Pro GPU/ Pro FPGA, including service limits, device limits, and storage limits.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 10/12/2020
ms.author: alkohli
---

# Azure Stack Edge limits

Consider these limits as you deploy and operate your Microsoft Azure Stack Edge Pro GPU or Azure Stack Edge Pro FPGA solution. 

## Azure Stack Edge service limits

[!INCLUDE [data-box-edge-gateway-service-limits](../../includes/data-box-edge-gateway-service-limits.md)]

## Azure Stack Edge device limits

The following table describes the limits for the Azure Stack Edge device.

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

## Azure storage account size and object size limits

[!INCLUDE [data-box-edge-gateway-storage-acct-limits](../../includes/data-box-edge-gateway-storage-acct-limits.md)]


## Azure object size limits

[!INCLUDE [data-box-edge-gateway-storage-object-limits](../../includes/data-box-edge-gateway-storage-object-limits.md)]

## Next steps

- [Prepare to deploy Azure Stack Edge Pro GPU](azure-stack-edge-gpu-deploy-prep.md)
- [Prepare to deploy Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-prep.md)
