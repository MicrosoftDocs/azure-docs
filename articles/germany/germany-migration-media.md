---
title: Migrate media resources from Azure Germany to global Azure
description: This article provides information about migrating media resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate Azure media resources to global Azure

This article helps you migrate Azure media resources from Azure Germany to global Azure.

## Media Services

In Azure Media Services, you configure your own storage account and all media assets. First, create a new Media Services account in global Azure. Then, reload corresponding media artifacts and perform encoding and streaming under the new Media Services account.

For more information, see these articles:

- [Media Services overview](../media-services/previous/media-services-overview.md)
- [Create a Media Services account](../media-services/previous/media-services-portal-create-account.md)

## Media Player

In Azure Media Player, you can select multiple endpoints. You can stream your content from Azure Germany endpoints or global Azure endpoints.

For more information, see [Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html).

## Next steps

Refresh your knowledge by completing the [Media Services step-by-step tutorials](https://docs.microsoft.com/azure/media-services/#step-by-step-tutorials).