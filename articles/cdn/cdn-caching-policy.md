---
title: Manage Azure CDN caching policy in Azure Media Services | Microsoft Docs
description: This article explains how to manage Azure CDN caching policy in Azure Media Services.
services: media-services,cdn
documentationcenter: .NET
author: juliako
manager: erikre
editor: ''

ms.assetid: be33aecc-6dbe-43d7-a056-10ba911e0e94
ms.service: media-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/04/2017
ms.author: juliako

---
# Manage Azure CDN caching policy in Azure Media Services
Azure Media Services provides HTTP based Adaptive Streaming and progressive download. HTTP based streaming is highly scalable with benefits of caching in proxy and CDN layers as well as client-side caching. Streaming endpoints provides general streaming capabilities and also configuration for HTTP cache headers. Streaming endpoints sets HTTP Cache-Control: max-age and Expires headers. You can get more information for HTTP cache headers from [W3.org](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).

## Default Caching headers
By default streaming-endpoints apply 3 day cache headers for on-demand streaming data (actual media fragments/chunks) and manifest(playlist). For live streaming, streaming endpoints apply 3 day cache headers for data (actual media fragments/chunks) and 2 seconds cache header for manifest(playlist) requests. When live program turns to on-demand (live archive), then on-demand streaming cache headers apply.

## Azure CDN integration
Azure Media Services provides [integrated CDN](https://azure.microsoft.com/updates/azure-media-services-now-fully-integrated-with-azure-cdn/) for streaming-endpoints. Cache-control headers applies in the same way as streaming endpoints to CDN enabled streaming endpoints. Azure CDN uses streaming endpoint configured cache values to define the life time of the internally cached objects and also uses this value to set the delivery cache headers. When using CDN enabled streaming endpoints it is not recommended to set small cache values. Setting small values decrease the performance and reduce the benefit of CDN. It is not allowed to set cache headers smaller than 600 seconds for CDN enabled streaming endpoints.

> [!IMPORTANT]
>Azure Media Services has complete integration with Azure CDN. With a single click, you can integrate all the available Azure CDN providers to your streaming endpoint including standard and premium products. For more information, see this [announcement](https://azure.microsoft.com/blog/standardstreamingendpoint/).
> 
> Data charges from streaming endpoint to CDN only gets disabled if the CDN is enabled over streaming endpoint APIs or using Azure portal's streaming endpoint section. Manual integration or directly creating a CDN endpoint using CDN APIs or portal section doesn't disable the data charges.

## Configuring cache headers with Azure Media Services
You can use Azure portal or Azure Media Services APIs to configure cache header values.

1. To configure cache headers using Azure portal, refer to [How to Manage Streaming Endpoints](../media-services/previous/media-services-portal-manage-streaming-endpoints.md) section Configuring the Streaming Endpoint.
2. Azure Media Services REST API, [StreamingEndpoint](/rest/api/media/operations/streamingendpoint#StreamingEndpointCacheControl).
3. Azure Media Services .NET SDK, [StreamingEndpointCacheControl Properties](https://go.microsoft.com/fwlink/?LinkId=615302).

## Cache configuration precedence order
1. Azure Media Services configured cache value overrides default value.
2. If there is no manual configuration, default values apply.
3. By default 2 seconds cache headers applies to live streaming manifest(playlist) regardless of Azure Media or Azure Storage configuration and overriding of this value is not available.

