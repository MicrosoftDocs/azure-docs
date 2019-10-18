---
title: Migrate Azure media resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure media resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate media resources to global Azure

This article has information that can help you migrate Azure media resources from Azure Germany to global Azure.

## Media Services

In Azure Media Services, you configure your own storage account and all media assets. First, create a new Media Services account in global Azure. Then, reload corresponding media artifacts and perform encoding and streaming under the new Media Services account.

For more information:

- Refresh your knowledge by completing the [Media Services tutorials](https://docs.microsoft.com/azure/media-services/previous/).
- Review the [Media Services overview](../media-services/previous/media-services-overview.md).
- Learn how to [create a Media Services account](../media-services/previous/media-services-portal-create-account.md).

## Media Player

You can select multiple endpoints in Azure Media Player. You can stream your content from Azure Germany endpoints or global Azure endpoints.

For more information, see [Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
