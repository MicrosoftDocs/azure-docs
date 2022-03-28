---
title: Manage streaming endpoints
description: This article demonstrates how to manage streaming endpoints with Azure Media Services v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.topic: how-to
ms.date: 03/01/2022
ms.author: inhenkel
---

# Manage streaming endpoints with Media Services v3

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

When your Media Services account is created a **default** [Streaming Endpoint](stream-streaming-endpoint-concept.md) is added to your account in the **Stopped** state. To start streaming your content and take advantage of [dynamic packaging](encode-dynamic-packaging-concept.md) and [dynamic encryption](drm-content-protection-concept.md), the streaming endpoint from which you want to stream content has to be in the **Running** state.

This article shows you how to execute the [start](/rest/api/media/streamingendpoints/start) command on your streaming endpoint using different technologies. 

> [!NOTE]
> You are only billed when your Streaming Endpoint is in running state.

## Prerequisites

Review:

* [Media Services concepts](concepts-overview.md)
* [Streaming Endpoint concept](stream-streaming-endpoint-concept.md)
* [Dynamic packaging](encode-dynamic-packaging-concept.md)

## [Portal](#tab/portal/)

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Azure Media Services account.
1. In the left pane, select  **Streaming Endpoints**.
1. Select the streaming endpoint you want to start, and then select **Start**.

## [CLI](#tab/CLI/)

## Use the Azure CLI

```cli
az ams streaming-endpoint start [--account-name]
                                [--ids]
                                [--name]
                                [--no-wait]
                                [--resource-group]
                                [--subscription]
```

For more information, see [az ams streaming-endpoint start](/cli/azure/ams/streaming-endpoint#az-ams-streaming-endpointstart).

## [REST](#tab/rest/)

## Use REST

```rest
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/slitestmedia10/streamingEndpoints/myStreamingEndpoint1/start?api-version=2018-07-01
```

For more information, see:

* The [start a StreamingEndpoint](/rest/api/media/streamingendpoints/start) reference documentation.
* Starting a streaming endpoint is an asynchronous operation.

    For information about how to monitor long-running operations, see [Long-running operations](media-services-apis-overview.md).
* This [Postman collection](https://github.com/Azure-Samples/media-services-v3-rest-postman/blob/master/Postman/Media%20Services%20v3.postman_collection.json) contains examples of multiple REST operations, including on how to start a streaming endpoint.

## [.NET](#tab/net/)

## Use .NET

```csharp
StreamingEndpoint streamingEndpoint = await client.StreamingEndpoints.GetAsync(config.ResourceGroup, config.AccountName, DefaultStreamingEndpointName);

if (streamingEndpoint != null)
{
    if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
    {
        await client.StreamingEndpoints.StartAsync(config.ResourceGroup, config.AccountName, DefaultStreamingEndpointName);
    }
```

See the complete [.NET code sample](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/Streaming/StreamHLSAndDASH/Program.cs#L112).

---
