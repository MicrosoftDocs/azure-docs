---

title: Manage streaming endpoints with Azure Media Services v3
description: This article demonstrates how to manage streaming endpoints with Azure Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
writer: juliako
manager: femila
editor: ''

ms.assetid: 0da34a97-f36c-48d0-8ea2-ec12584a2215
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/11/2020
ms.author: juliako

---

# Manage streaming endpoints with  Media Services v3

When your Media Services account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of [dynamic packaging](dynamic-packaging-overview.md) and [dynamic encryption](content-protection-overview.md), the streaming endpoint from which you want to stream content has to be in the **Running** state.
 
This article shows you how to start your streaming endpoint.
 
> [!NOTE]
> You are only billed when your Streaming Endpoint is in running state.
    
## Prerequisites

Review: 

* [Media Services concepts](concepts-overview.md)
* [Streaming Endpoint concept](streaming-endpoint-concept.md)
* [Dynamic packaging](dynamic-packaging-overview.md)

## Use the Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. On the left, select  **Streaming Endpoints**.
1. Select the streaming endpoint you want to start, click **Start**.

## Use the Java SDK

```java
if (streamingEndpoint != null) {
// Start The Streaming Endpoint if it is not running.
if (streamingEndpoint.resourceState() != StreamingEndpointResourceState.RUNNING) {
    manager.streamingEndpoints().startAsync(config.getResourceGroup(), config.getAccountName(), STREAMING_ENDPOINT_NAME).await();
}
```

The samples [in this repository](https://docs.microsoft.com/samples/azure-samples/media-services-v3-dotnet/azure-media-services-v3-samples-using-net/) shows how to start the default streaming endpoint with .NET.

## Use the .NET SDK

```charp
StreamingEndpoint streamingEndpoint = await client.StreamingEndpoints.GetAsync(config.ResourceGroup, config.AccountName, DefaultStreamingEndpointName);

if (streamingEndpoint != null)
{
    if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
    {
        await client.StreamingEndpoints.StartAsync(config.ResourceGroup, config.AccountName, DefaultStreamingEndpointName);
    }
```

The samples [in this repository](https://docs.microsoft.com/samples/azure-samples/media-services-v3-java/azure-media-services-v3-samples-using-java/) shows how to start the default streaming endpoint with Java.

## Use CLI

```cli
az ams streaming-endpoint start [--account-name]
                                [--ids]
                                [--name]
                                [--no-wait]
                                [--resource-group]
                                [--subscription]
```

For more information, see [az ams streaming-endpoint start](https://docs.microsoft.com/cli/azure/ams/streaming-endpoint?view=azure-cli-latest#az-ams-streaming-endpoint-start).

## Use REST

```rest
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/slitestmedia10/streamingEndpoints/myStreamingEndpoint1/start?api-version=2018-07-01
```

For more information, see 

* [Start a StreamingEndpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints/start)
* [REST sample](https://github.com/Azure-Samples/media-services-v3-rest-postman/blob/master/Postman/Media%20Services%20v3.postman_collection.json)

## Next steps

[Long-running operations](media-services-apis-overview.md)
