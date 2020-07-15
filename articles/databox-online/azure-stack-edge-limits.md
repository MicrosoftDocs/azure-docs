---
title: Azure Stack Edge limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Azure Stack Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/22/2019
ms.author: alkohli
---

# Azure Stack Edge limits

Consider these limits as you deploy and operate your Microsoft Azure Stack Edge solution. 

## Azure Stack Edge service limits

[!INCLUDE [data-box-edge-gateway-service-limits](../../includes/data-box-edge-gateway-service-limits.md)]

## Azure Stack device limits

The following table describes the limits for the Azure Stack Edge device. 

| Description | Value |
|---|---|
|No. of files per device |100 million |
|No. of shares per device |24 |
|No. of shares per container |1 |
|Maximum file size written to a share| 5 TB |

## Azure storage limits

[!INCLUDE [data-box-edge-gateway-storage-limits](../../includes/data-box-edge-gateway-storage-limits.md)]

## Data upload caveats

[!INCLUDE [data-box-edge-gateway-storage-data-upload-caveats](../../includes/data-box-edge-gateway-storage-data-upload-caveats.md)]

## Azure storage account size and object size limits

[!INCLUDE [data-box-edge-gateway-storage-acct-limits](../../includes/data-box-edge-gateway-storage-acct-limits.md)]


## Azure object size limits

[!INCLUDE [data-box-edge-gateway-storage-object-limits](../../includes/data-box-edge-gateway-storage-object-limits.md)]

## Next steps

- [Prepare to deploy Azure Stack Edge](azure-stack-edge-deploy-prep.md)
