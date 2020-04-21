---
title: Migrate Azure media resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure media resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate media resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

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
