---
title: Upload content to an asset CLI
description: The Azure CLI script in this topic shows how to create a Media Services Asset to upload content to.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: 
ms.assetid: 
ms.service: media-services
ms.devlang: azurecli
ms.topic: how-to
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 02/16/2021
ms.author: inhenkel
ms.custom: devx-track-azurecli
---

# Create an Asset

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows how to create a Media Services Asset.  You will use an asset to hold media content for encoding and streaming.  To learn more about Media Services assets, read [Assets in Azure Media Services v3](assets-concept.md)

## Prerequisites

Follow the steps in [Create a Media Services account](./create-account-howto.md) to create the needed Media Services account and resource group to create an asset.

## Methods

## [CLI](#tab/cli/)

[!INCLUDE [Create an asset with CLI](./includes/task-create-asset-cli.md)]

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/media-services/create-asset/Create-Asset.sh "Create an asset")]

## [REST](#tab/rest/)

### Using REST

[!INCLUDE [media-services-cli-instructions.md](./includes/task-create-asset-rest.md)]

### Using cURL

[!INCLUDE [media-services-cli-instructions.md](./includes/task-create-asset-curl.md)]

## [.NET](#tab/net/)

[!INCLUDE [media-services-cli-instructions.md](./includes/task-create-asset-dotnet.md)]

---

## Next steps

[Media Services Overview](media-services-overview.md)
