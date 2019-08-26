---
title: Stream live with Azure Media Services v3 | Microsoft Docs
description: This tutorial walks you through the steps of streaming live with Media Services v3.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 06/13/2019
ms.author: juliako

---

# Tutorial: Stream live with Media Services

> [!NOTE]
> Even though the tutorial uses the [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.liveevent?view=azure-dotnet) examples, the general steps are the same for [REST API](https://docs.microsoft.com/rest/api/media/liveevents), [CLI](https://docs.microsoft.com/cli/azure/ams/live-event?view=azure-cli-latest), or other supported [SDKs](media-services-apis-overview.md#sdks).

In Azure Media Services, [Live Events](https://docs.microsoft.com/rest/api/media/liveevents) are responsible for processing live streaming content. A Live Event provides an input endpoint (ingest URL) that you then provide to a live encoder. The Live Event receives live input streams from the live encoder and makes it available for streaming through one or more [Streaming Endpoints](https://docs.microsoft.com/rest/api/media/streamingendpoints). Live Events also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery. This tutorial shows how to use .NET Core to create a **pass-through** type of a live event. 

The tutorial shows you how to:    

> [!div class="checklist"]
> * Download the sample app described in the topic
> * Examine the code that performs live streaming
> * Watch the event with [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) at https://ampdemo.azureedge.net
> * Clean up resources

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following are required to complete the tutorial.

- Install Visual Studio Code or Visual Studio.
- [Create a Media Services account](create-account-cli-how-to.md).<br/>Make sure to remember the values that you used for the resource group name and Media Services account name.
- Follow the steps in [Access Azure Media Services API with the Azure CLI](access-api-cli-how-to.md) and save the credentials. You will need to use them to access the API.
- A camera or a device (like laptop) that is used to broadcast an event.
- An on-premises live encoder that converts signals from the camera to streams that are sent to the Media Services live streaming service. The stream has to be in **RTMP** or **Smooth Streaming** format.

> [!TIP]
> Make sure to review [Live streaming with Media Services v3](live-streaming-overview.md) before proceeding. 

## Download and configure the sample

Clone a GitHub repository that contains the streaming .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials.git
 ```

The live streaming sample is located in the [Live](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/Live/MediaV3LiveApp) folder.

Open [appsettings.json](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/appsettings.json) in you downloaded project. Replace the values with credentials that you got from [accessing APIs](access-api-cli-how-to.md).

> [!IMPORTANT]
> This sample uses unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you will end up with multiple Live Events in your account. <br/>Make sure to stop the running Live Events. Otherwise, you will be **billed**!

## Examine the code that performs live streaming

This section examines functions defined in the [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs) file of the *MediaV3LiveApp* project.

The sample creates a unique suffix for each resource so that we don't have name collisions if you run the sample multiple times without cleaning up.

> [!IMPORTANT]
> This sample uses unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you will end up with multiple Live Events in your account. <br/>
> Make sure to stop the running Live Events. Otherwise, you will be **billed**!
 
### Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. In the code you cloned at the beginning of the article, the **GetCredentialsAsync** function creates the ServiceClientCredentials object based on the credentials supplied in local configuration file. 

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CreateMediaServicesClient)]

### Create a live event

This section shows how to create a **pass-through** type of Live Event (LiveEventEncodingType set to None). For more information about the available types of Live Events, see [Live Event types](live-events-outputs-concept.md#live-event-types). 
 
Some things that you might want to specify when creating the live event are:

* Media Services location 
* The streaming protocol for the Live Event (currently, the RTMP and Smooth Streaming protocols are supported).<br/>You cannot change the protocol option while the Live Event or its associated Live Outputs are running. If you require different protocols, you should create separate Live Event for each streaming protocol.  
* IP restrictions on the ingest and preview. You can define the IP addresses that are allowed to ingest a video to this Live Event. Allowed IP addresses can be specified as either a single IP address (for example '10.0.0.1'), an IP range using an IP address and a CIDR subnet mask (for example, '10.0.0.1/22'), or an IP range using an IP address and a dotted decimal subnet mask (for example, '10.0.0.1(255.255.252.0)').<br/>If no IP addresses are specified and there is no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.<br/>The IP addresses have to be in one of the following formats: IpV4 address with 4 numbers, CIDR address range.
* When creating the event, you can specify to auto start it. <br/>When autostart is set to true, the Live Event will be started after creation. That means, the billing starts as soon as the Live Event starts running. You must explicitly call Stop on the Live Event resource to halt further billing. For more information, see [Live Event states and billing](live-event-states-billing.md).
* For an ingest URL to be predictive, set the "vanity" mode. For detailed information, see [Live Event ingest URLs](live-events-outputs-concept.md#live-event-ingest-urls).

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CreateLiveEvent)]

### Get ingest URLs

Once the Live Event is created, you can get ingest URLs that you will provide to the live encoder. The encoder uses these URLs to input a live stream.

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#GetIngestURL)]

### Get the preview URL

Use the previewEndpoint to preview and verify that the input from the encoder is actually being received.

> [!IMPORTANT]
> Make sure that the video is flowing to the Preview URL before continuing!

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#GetPreviewURLs)]

### Create and manage Live Events and Live Outputs

Once you have the stream flowing into the Live Event, you can begin the streaming event by creating an Asset, Live Output, and Streaming Locator. This will archive the stream and make it available to viewers through the Streaming Endpoint. 

#### Create an Asset

Create an Asset for the Live Output to use.

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CreateAsset)]

#### Create a Live Output

Live Outputs start on creation and stop when deleted. When you delete the Live Output, you are not deleting the underlying Asset and content in the asset.

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CreateLiveOutput)]

#### Create a Streaming Locator

> [!NOTE]
> When your Media Services account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of [dynamic packaging](dynamic-packaging-overview.md) and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. 

When you publish the Live Output asset using a Streaming Locator, the Live Event (up to the DVR window length) will continue to be viewable until the Streaming Locator's expiry or deletion, whichever comes first.

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CreateStreamingLocator)]

```csharp

// Get the url to stream the output
ListPathsResponse paths = await client.StreamingLocators.ListPathsAsync(resourceGroupName, accountName, locatorName);

foreach (StreamingPath path in paths.StreamingPaths)
{
    UriBuilder uriBuilder = new UriBuilder();
    uriBuilder.Scheme = "https";
    uriBuilder.Host = streamingEndpoint.HostName;

    uriBuilder.Path = path.Paths[0];
    // Get the URL from the uriBuilder: uriBuilder.ToString()
}
```

### Cleaning up resources in your Media Services account

If you are done streaming events and want to clean up the resources provisioned earlier, follow the following procedure.

* Stop pushing the stream from the encoder.
* Stop the Live Event. Once the Live Event is stopped, it will not incur any charges. When you need to start it again, it will have the same ingest URL so you won't need to reconfigure your encoder.
* You can stop your Streaming Endpoint, unless you want to continue to provide the archive of your live event as an on-demand stream. If the Live Event is in stopped state, it will not incur any charges.

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CleanupLiveEventAndOutput)]

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CleanupLocatorAssetAndStreamingEndpoint)]

The following code shows how to clean up your account of all Live Events:

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/Live/MediaV3LiveApp/Program.cs#CleanupAccount)]   

## Watch the event

To watch the event, copy the streaming URL that you got when you ran code described in Create a Streaming Locator and use a player of your choice. You can use [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) to test your stream at https://ampdemo.azureedge.net. 

Live Event automatically converts events to on-demand content when stopped. Even after you stop and delete the event, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset. An asset cannot be deleted if it is used by an event; the event must be deleted first. 

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier.

Execute the following CLI command:

```azurecli-interactive
az group delete --name amsResourceGroup
```

> [!IMPORTANT]
> Leaving the Live Event running incurs billing costs. Be aware, if the project/program crashes or is closed out for any reason, it could leave the Live Event running in a billing state.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Stream files](stream-files-tutorial-with-api.md)
 
