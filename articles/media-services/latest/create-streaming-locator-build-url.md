---
title: Create a streaming locator and build URLs
description: This article demonstrates how to create a streaming locator and build URLs.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/01/2022
ms.author: inhenkel
---

# Create a streaming locator and build URLs

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

In Azure Media Services, to build a streaming URL, you need to first create a [Streaming Locator](stream-streaming-locators-concept.md). You then concatenate the [Streaming Endpoint](/rest/api/media/streamingendpoints) host name and the **Streaming Locator** path. In this sample, the *default* **Streaming Endpoint** is used. When you first create a Media Service account, this *default* **Streaming Endpoint** will be in a stopped state, so you need to call **Start** to start streaming.

This article demonstrates how to create a streaming locator and build a streaming URL using Java and .NET SDKs.

## Prerequisites

Preview [Dynamic packaging](encode-dynamic-packaging-concept.md)

## Create a streaming locator

## [Portal](#tab/portal/)

[!INCLUDE [task-create-asset-portal](includes/task-create-streaming-locator-portal.md)]

## [.NET](#tab/net/)

## Using .NET

```csharp
/// <summary>
/// Creates a StreamingLocator for the specified asset and with the specified streaming policy name.
/// Once the StreamingLocator is created the output asset is available to clients for playback.
/// </summary>
/// <param name="client">The Media Services client.</param>
/// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
/// <param name="accountName"> The Media Services account name.</param>
/// <param name="assetName">The name of the output asset.</param>
/// <param name="locatorName">The StreamingLocator name (unique in this case).</param>
/// <returns>A task.</returns>
private static async Task<StreamingLocator> CreateStreamingLocatorAsync(
    IAzureMediaServicesClient client,
    string resourceGroup,
    string accountName,
    string assetName,
    string locatorName)
{
    Console.WriteLine("Creating a streaming locator...");
    StreamingLocator locator = await client.StreamingLocators.CreateAsync(
        resourceGroup,
        accountName,
        locatorName,
        new StreamingLocator
        {
            AssetName = assetName,
            StreamingPolicyName = PredefinedStreamingPolicy.ClearStreamingOnly
        });

    return locator;
}

/// <summary>
/// Checks if the streaming endpoint is in the running state,
/// if not, starts it. Then, builds the streaming URLs.
/// </summary>
/// <param name="client">The Media Services client.</param>
/// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
/// <param name="accountName"> The Media Services account name.</param>
/// <param name="locatorName">The name of the StreamingLocator that was created.</param>
/// <param name="streamingEndpoint">The streaming endpoint.</param>
/// <returns>A task.</returns>
private static async Task<IList<string>> GetStreamingUrlsAsync(
    IAzureMediaServicesClient client,
    string resourceGroupName,
    string accountName,
    String locatorName,
    StreamingEndpoint streamingEndpoint)
{
    IList<string> streamingUrls = new List<string>();

    ListPathsResponse paths = await client.StreamingLocators.ListPathsAsync(resourceGroupName, accountName, locatorName);

    foreach (StreamingPath path in paths.StreamingPaths)
    {
        UriBuilder uriBuilder = new UriBuilder
        {
            Scheme = "https",
            Host = streamingEndpoint.HostName,

            Path = path.Paths[0]
        };
        streamingUrls.Add(uriBuilder.ToString());
    }

    return streamingUrls;
}
```

See the full code sample: [EncodingWithMESPredefinedPreset](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/VideoEncoding/Encoding_PredefinedPreset/Program.cs)

---