---
title: Manage Azure CDN caching policy in Azure Media Services
description: This article explains how to manage Azure CDN caching policy in Azure Media Services.
services: media-services,cdn
author: juliako
manager: erikre
ms.assetid: be33aecc-6dbe-43d7-a056-10ba911e0e94
ms.service: azure-media-services
ms.topic: how-to
ms.date: 03/20/2024
ms.author: juliako
---

# Manage Azure CDN caching policy in Azure Media Services

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

Azure Media Services provides HTTP based Adaptive Streaming and progressive download. HTTP based streaming is highly scalable with benefits of caching in proxy and CDN layers and client-side caching. Streaming endpoints provides general streaming capabilities and also configuration for HTTP cache headers. Streaming endpoints sets HTTP Cache-Control: max-age and Expires headers. You can get more information for HTTP cache headers from [W3.org](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).

## Default Caching headers

By default streaming-endpoints apply three day cache headers for on-demand streaming data (actual media fragments/chunks) and manifest(playlist). For live streaming, streaming endpoints apply three day cache headers for data (actual media fragments/chunks) and 2-seconds cache header for manifest(playlist) requests. When live program turns to on-demand (live archive), then on-demand streaming cache headers apply.

## Azure CDN integration

Azure Media Services provides [integrated CDN](https://azure.microsoft.com/updates/azure-media-services-now-fully-integrated-with-azure-cdn/) for streaming-endpoints. Cache-control headers apply in the same way as streaming endpoints to CDN enabled streaming endpoints. Azure CDN uses streaming endpoint configured cache values to define the life time of the internally cached objects and also uses this value to set the delivery cache headers. When using CDN enabled streaming endpoints, it isn't recommended to set small cache values. Setting small values decrease the performance and reduce the benefit of CDN. It isn't allowed to set cache headers smaller than 600 seconds for CDN enabled streaming endpoints.

> [!IMPORTANT]
> Azure Media Services has complete integration with Azure Content Delivery Network. With a single click, you can integrate all the available Azure Content Delivery Network providers to your streaming endpoint including standard and premium products. For more information, see this [announcement](https://azure.microsoft.com/blog/standardstreamingendpoint/).
>
> Data charges from streaming endpoint to CDN only gets disabled if the CDN is enabled over streaming endpoint APIs or using Azure portal's streaming endpoint section. Manual integration or directly creating a CDN endpoint using CDN APIs or portal section doesn't disable the data charges.

## Configuring cache headers with Azure Media Services

You can use Azure portal or Azure Media Services APIs to configure cache header values.

1. To configure cache headers using Azure portal, refer to [How to Manage Streaming Endpoints](/azure/media-services/latest/stream-streaming-endpoint-concept) section Configuring the Streaming Endpoint.
2. Azure Media Services REST API, [StreamingEndpoint](/rest/api/media/operations/streamingendpoint#StreamingEndpointCacheControl).
3. Azure Media Services .NET SDK, [StreamingEndpointCacheControl Properties](/dotnet/api/microsoft.windowsazure.mediaservices.client.streamingendpointcachecontrol).

## Cache configuration precedence order

1. Azure Media Services configured cache value overrides default value.
2. If there's no manual configuration, default values apply.
3. By default 2-seconds cache headers apply to live streaming manifest(playlist) regardless of Azure Media or Azure Storage configuration and overriding of this value isn't available.
