---
title: Azure Stack Edge Mini R limits | Microsoft Docs
description: Describes system limits and recommended sizes for the Azure Stack Edge Mini R.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/13/2020
ms.author: alkohli
---

# Azure Stack Edge Mini R limits


Consider these limits as you deploy and operate your Azure Stack Edge Mini R solution.

## Azure Stack Edge service limits

[!INCLUDE [azure-stack-edge-gateway-service-limits](../../includes/azure-stack-edge-gateway-service-limits.md)]

## Azure Stack Edge Mini R device limits

The following table describes the limits for the Azure Stack Edge Mini R device.

| Description | Limit|
|---|---:|
|No. of files per device | 100 million <!--check with devs-->|
|No. of shares per container | 1|
|Maximum no. of share endpoints and REST endpoints per device| 24 |
|Maximum no. of tiered storage accounts per device| 24|
|Maximum file size written to a share| 500 GB|
|Maximum number of resource groups per device| 800|

## Azure storage limits

[!INCLUDE [azure-stack-edge-gateway-storage-limits](../../includes/azure-stack-edge-gateway-storage-limits.md)]

## Data upload caveats

[!INCLUDE [azure-stack-edge-gateway-storage-data-upload-caveats](../../includes/azure-stack-edge-gateway-storage-data-upload-caveats.md)]

## Azure storage account size and object size limits

[!INCLUDE [azure-stack-edge-gateway-storage-acct-limits](../../includes/azure-stack-edge-gateway-storage-acct-limits.md)]

## Azure object size limits

[!INCLUDE [azure-stack-edge-gateway-storage-object-limits](../../includes/azure-stack-edge-gateway-storage-object-limits.md)]

## Next steps

- [Prepare to deploy Azure Stack Edge](azure-stack-edge-gpu-deploy-prep.md)
