---
title: Upload content to an asset CLI
description: The Azure CLI script in this topic shows how to create a Media Services Asset to upload content to.
services: media-services
author: IngridAtMicrosoft
manager: femila 
ms.service: media-services
ms.topic: how-to
ms.date: 03/01/2022
ms.author: inhenkel
---

# Create an Asset

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows how to create a Media Services Asset.  You will use an asset to hold media content for encoding and streaming.  To learn more about Media Services assets, read [Assets in Azure Media Services v3](assets-concept.md)

## Prerequisites

Follow the steps in [Create a Media Services account](./account-create-how-to.md) to create the needed Media Services account and resource group to create an asset.

## Methods

Use the following methods to create a Media Services asset.

## [Portal](#tab/portal/)

Creating assets in the portal is as simple as uploading a file.

[!INCLUDE [task-create-asset-portal](includes/task-create-asset-portal.md)]

## [CLI](#tab/cli/)

[!INCLUDE [Create an asset with CLI](./includes/task-create-asset-cli.md)]

## [REST](#tab/rest/)

### Using REST

[!INCLUDE [create an asset writh REST](./includes/task-create-asset-rest.md)]

### Using cURL

[!INCLUDE [create an asset with CURL](./includes/task-create-asset-curl.md)]

## [.NET](#tab/net/)

[!INCLUDE [Create an asset with .NET](./includes/task-create-asset-dotnet.md)]

---
