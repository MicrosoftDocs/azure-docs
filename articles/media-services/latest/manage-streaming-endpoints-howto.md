---

title: Manage streaming endpoints with Azure Media Services v3
description: This article demonstrates how to manage streaming endpoints with Azure Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
writer: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/11/2020
ms.author: juliako

---

# Manage streaming endpoints with  Media Services v3

When your Media Services account is created a **default** [Streaming Endpoint](streaming-endpoint-concept.md) is added to your account in the **Stopped** state. To start streaming your content and take advantage of [dynamic packaging](dynamic-packaging-overview.md) and [dynamic encryption](content-protection-overview.md), the streaming endpoint from which you want to stream content has to be in the **Running** state.

This article shows you how to execute the [start](https://docs.microsoft.com/rest/api/media/streamingendpoints/start) command on your streaming endpoint using different technologies. 
 
> [!NOTE]
> You are only billed when your Streaming Endpoint is in running state.
    
## Prerequisites

Review: 

* [Media Services concepts](concepts-overview.md)
* [Streaming Endpoint concept](streaming-endpoint-concept.md)
* [Dynamic packaging](dynamic-packaging-overview.md)

## Use REST

```rest
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/slitestmedia10/streamingEndpoints/myStreamingEndpoint1/start?api-version=2018-07-01
```

For more information, see: 

* The [start a StreamingEndpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints/start) reference documentation.
* Starting a streaming endpoint is an asynchronous operation. 

    For information about how to monitor long-running operations, see [Long-running operations](media-services-apis-overview.md).
* This [Postman collection](https://github.com/Azure-Samples/media-services-v3-rest-postman/blob/master/Postman/Media%20Services%20v3.postman_collection.json) contains examples of multiple REST operations, including on how to start a streaming endpoint.

## Use the Azure portal 
 
1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Azure Media Services account.
1. In the left pane, select  **Streaming Endpoints**.
1. Select the streaming endpoint you want to start, and then select **Start**.

## Use the Azure CLI

```cli
az ams streaming-endpoint start [--account-name]
                                [--ids]
                                [--name]
                                [--no-wait]
                                [--resource-group]
                                [--subscription]
```

For more information, see [az ams streaming-endpoint start](https://docs.microsoft.com/cli/azure/ams/streaming-endpoint?view=azure-cli-latest#az-ams-streaming-endpoint-start).

## Use SDKs

### Java
    
```java
if (streamingEndpoint != null) {
// Start The Streaming Endpoint if it is not running.
if (streamingEndpoint.resourceState() != StreamingEndpointResourceState.RUNNING) {
    manager.streamingEndpoints().startAsync(config.getResourceGroup(), config.getAccountName(), STREAMING_ENDPOINT_NAME).await();
}
```

See the complete [Java code sample](https://github.com/Azure-Samples/media-services-v3-java/blob/master/DynamicPackagingVODContent/StreamHLSAndDASH/src/main/java/sample/StreamHLSAndDASH.java#L128).

### .NET

```csharp
StreamingEndpoint streamingEndpoint = await client.StreamingEndpoints.GetAsync(config.ResourceGroup, config.AccountName, DefaultStreamingEndpointName);

if (streamingEndpoint != null)
{
    if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
    {
        await client.StreamingEndpoints.StartAsync(config.ResourceGroup, config.AccountName, DefaultStreamingEndpointName);
    }
```

See the complete [.NET code sample](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/master/DynamicPackagingVODContent/StreamHLSAndDASH/Program.cs#L112).

---

## Next steps

* [Media Services v3 OpenAPI Specification (Swagger)](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01)
* [Streaming Endpoint operations](https://docs.microsoft.com/rest/api/media/streamingendpoints)
