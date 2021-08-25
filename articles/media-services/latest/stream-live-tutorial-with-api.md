---
title: Stream live with Media Services by using .NET 5.0
titleSuffix: Azure Media Services
description: Learn how to stream live events by using .NET 5.0
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: "mvc, devx-track-csharp"
ms.date: 06/13/2019
ms.author: inhenkel

---

# Tutorial: Stream live with Media Services by using .NET 5.0

In Azure Media Services, [live events](/rest/api/media/liveevents) are responsible for processing live streaming content. A live event provides an input endpoint (ingest URL) that you then provide to a live encoder. The live event receives input streams from the live encoder and makes them available for streaming through one or more [streaming endpoints](/rest/api/media/streamingendpoints). Live events also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery. 

This tutorial shows how to use .NET 5.0 to create a *pass-through* type of a live event. In this tutorial, you will:

> [!div class="checklist"]
> * Download a sample app.
> * Examine the code that performs live streaming.
> * Watch the event with [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) on the [Media Player demo site](https://ampdemo.azureedge.net).
> * Clean up resources.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> Even though the tutorial uses [.NET SDK](/dotnet/api/microsoft.azure.management.media.models.liveevent) examples, the general steps are the same for [REST API](/rest/api/media/liveevents), [CLI](/cli/azure/ams/live-event), or other supported [SDKs](media-services-apis-overview.md#sdks). 

## Prerequisites

You need the following items to complete the tutorial:

- Install [Visual Studio Code for Windows/macOS/Linux](https://code.visualstudio.com/) or [Visual Studio 2019 for Windows or Mac](https://visualstudio.microsoft.com/).
- Install [.NET 5.0 SDK](https://dotnet.microsoft.com/download)
- [Create a Media Services account](./account-create-how-to.md). Be sure to copy the **API Access** details in JSON format or store the values needed to connect to the Media Services account in the *.env* file format used in this sample.
- Follow the steps in [Access the Azure Media Services API with the Azure CLI](./access-api-howto.md) and save the credentials. You'll need to use them to access the API in this sample, or enter them into the *.env* file format. 

You need these additional items for live-streaming software:

- A camera or a device (like a laptop) that's used to broadcast an event.
- An on-premises software encoder that encodes your camera stream and sends it to the Media Services live-streaming service through the Real-Time Messaging Protocol (RTMP). For more information, see [Recommended on-premises live encoders](encode-recommended-on-premises-live-encoders.md). The stream has to be in RTMP or Smooth Streaming format.  

  This sample assumes that you'll use Open Broadcaster Software (OBS) Studio to broadcast RTMP to the ingest endpoint. [Install OBS Studio](https://obsproject.com/download). 

> [!TIP]
> Review [Live streaming with Media Services v3](stream-live-streaming-concept.md) before proceeding. 

## Download and configure the sample

Clone the GitHub repository that contains the live-streaming .NET sample to your machine by using the following command:  

```bash
git clone https://github.com/Azure-Samples/media-services-v3-dotnet.git
```

The live-streaming sample is in the [Live](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Live) folder.

[!INCLUDE [appsettings or .env file](./includes/note-appsettings-or-env-file.md)]

> [!IMPORTANT]
> This sample uses a unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you'll end up with multiple live events in your account.
>
> Be sure to stop the running live events. Otherwise, *you'll be billed*!

## Examine the code that performs live streaming

This section examines functions defined in the [Authentication.cs](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/Common_Utils/Authentication.cs) file (in the Common_Utils folder) and [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/Live/LiveEventWithDVR/Program.cs) file of the *LiveEventWithDVR* project.

The sample creates a unique suffix for each resource so that you don't have name collisions if you run the sample multiple times without cleaning up.


### Start using Media Services APIs with the .NET SDK

Authentication.cs creates a `AzureMediaServicesClient` object using credentials supplied in the local configuration files (appsettings.json or .env).

An `AzureMediaServicesClient` object allows you to start using Media Services APIs with .NET. To create the object, you need to supply credentials for the client to connect to Azure by using Azure Active Directory, which is implemented in `GetCredentailsAsync`. Another option is to use interactive authentication, which is implemented in `GetCredentialsInteractiveAuthAsync`.

[!code-csharp[Main](../../../media-services-v3-dotnet/Common_Utils/Authentication.cs#CreateMediaServicesClientAsync)]

In the code that you cloned at the beginning of the article, the `GetCredentialsAsync` function creates the `ServiceClientCredentials` object based on the credentials supplied in the local configuration file (*appsettings.json*) or through the *.env* environment variables file in the root of the repository.

[!code-csharp[Main](../../../media-services-v3-dotnet/Common_Utils/Authentication.cs#GetCredentialsAsync)]

In the case of interactive authentication, the `GetCredentialsInteractiveAuthAsync` function creates the `ServiceClientCredentials` object based on an interactive authentication and the connection parameters supplied in the local configuration file (*appsettings.json*) or through the *.env* environment variables file in the root of the repository. In that case, AADCLIENTID and AADSECRET are not needed in the configuration or environment variables file.

[!code-csharp[Main](../../../media-services-v3-dotnet/Common_Utils/Authentication.cs#GetCredentialsInteractiveAuthAsync)]


### Create a live event

This section shows how to create a *pass-through* type of live event (`LiveEventEncodingType` set to `None`). For information about the available types, see [Live event types](live-event-outputs-concept.md#live-event-types). In addition to pass-through, you can use a live transcoding event for 720p or 1080p adaptive bitrate cloud encoding.
 
You might want to specify the following things when you're creating the live event:

* **The ingest protocol for the live event**. Currently, the RTMP, RTMPS, and Smooth Streaming protocols are supported. You can't change the protocol option while the live event or its associated live outputs are running. If you need different protocols, create a separate live event for each streaming protocol. 
* **IP restrictions on the ingest and preview**. You can define the IP addresses that are allowed to ingest a video to this live event. Allowed IP addresses can be specified as one of these choices:

  * A single IP address (for example, `10.0.0.1`)
  * An IP range that uses an IP address and a Classless Inter-Domain Routing (CIDR) subnet mask (for example, `10.0.0.1/22`)
  * An IP range that uses an IP address and a dotted decimal subnet mask (for example, `10.0.0.1(255.255.252.0)`)

  If no IP addresses are specified and there's no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set `0.0.0.0/0`. The IP addresses have to be in one of the following formats: IPv4 address with four numbers or a CIDR address range.  
* **Autostart on an event as you create it**. When autostart is set to `true`, the live event will start after creation. That means the billing starts as soon as the live event starts running. You must explicitly call `Stop` on the live event resource to halt further billing. For more information, see [Live event states and billing](live-event-states-billing-concept.md).

  Standby modes are available to start the live event in a lower-cost "allocated" state that makes it faster to move to a running state. This is useful for situations like hot pools that need to hand out channels quickly to streamers.
* **A static host name and a unique GUID**. For an ingest URL to be predictive and easier to maintain in a hardware-based live encoder, set the `useStaticHostname` property to `true`. For detailed information, see [Live event ingest URLs](live-event-outputs-concept.md#live-event-ingest-urls).

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#CreateLiveEvent)]

### Get ingest URLs

After the Live Event is created, you can get ingest URLs that you'll provide to the live encoder. The encoder uses these URLs to input a live stream.

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#GetIngestURL)]

### Get the preview URL

Use `previewEndpoint` to preview and verify that the input from the encoder is being received.

> [!IMPORTANT]
> Make sure that the video is flowing to the preview URL before you continue.

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#GetPreviewURLs)]

### Create and manage live events and live outputs

After you have the stream flowing into the live event, you can begin the streaming event by creating an asset, live output, and streaming locator. This will archive the stream and make it available to viewers through the streaming endpoint.

When you're learning these concepts, it's helpful to think of the asset object as the tape that you would insert into a video tape recorder in the old days. The live output is the tape recorder machine. The live event is just the video signal coming into the back of the machine.

You first create the signal by creating the live event. The signal is not flowing until you start that live event and connect your encoder to the input.

The "tape" can be created at any time. It's just an empty asset that you'll hand to the live output object, the "tape recorder" in this analogy.

The "tape recorder" can also be created at any time. You can create a live output before starting the signal flow, or after. If you need to speed up things, it's sometimes helpful to create the output before you start the signal flow.

To stop the "tape recorder," you call `delete` on `LiveOutput`. This action doesn't delete the *contents* of the "tape" (asset). The asset is always kept with the archived video content until you call `delete` explicitly on the asset itself. 

The next section will walk through the creation of the asset and the live output.

#### Create an asset

Create an asset for the live output to use. In our analogy, this will be the "tape" that we record the live video signal onto. Viewers will be able to see the contents live or on demand from this virtual tape.

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#CreateAsset)]

#### Create a live output

Live outputs start when they're created and stop when they're deleted.  When you delete the live output, you're not deleting the underlying asset or content in the asset. Think of it as ejecting the "tape." The asset with the recording will last as long as you like. When it's ejected (meaning, when the live output is deleted), it will be available for on-demand viewing immediately.

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#CreateLiveOutput)]

#### Create a streaming locator

> [!NOTE]
> When your Media Services account is created, a default streaming endpoint is added to your account in the stopped state. To start streaming your content and take advantage of [dynamic packaging](encode-dynamic-packaging-concept.md) and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the running state.

When you publish the asset by using a streaming locator, the live event (up to the DVR window length) will continue to be viewable until the streaming locator's expiration or deletion, whichever comes first. This is how you make the virtual "tape" recording available for your viewing audience to see live and on demand. The same URL can be used to watch the live event, the DVR window, or the on-demand asset when the recording is complete (when the live output is deleted).

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#CreateStreamingLocator)]

```csharp

// Get the URL to stream the output
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

### Clean up resources in your Media Services account

If you're done streaming events and want to clean up the resources provisioned earlier, use the following procedure:

1. Stop pushing the stream from the encoder.
1. Stop the live event. After the live event is stopped, it won't incur any charges. When you need to start it again, it will have the same ingest URL so you won't need to reconfigure your encoder.
1. Stop your streaming endpoint, unless you want to continue to provide the archive of your live event as an on-demand stream. If the live event is in a stopped state, it won't incur any charges.

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#CleanupLiveEventAndOutput)]

[!code-csharp[Main](../../../media-services-v3-dotnet/Live/LiveEventWithDVR/Program.cs#CleanupLocatorAssetAndStreamingEndpoint)]

## Watch the event

Press **Ctrl+F5** to run the code. This will output streaming URLs that you can use to watch your live event. Copy the streaming URL that you got to create a streaming locator. You can use a media player of your choice. [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) is available to test your stream at the [Media Player demo site](https://ampdemo.azureedge.net).

A live event automatically converts events to on-demand content when it's stopped. Even after you stop and delete the event, users can stream your archived content as a video on demand for as long as you don't delete the asset. An asset can't be deleted if an event is using it; the event must be deleted first.

## Clean up remaining resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts that you created for this tutorial, delete the resource group that you created earlier.

Run the following CLI command:

```azurecli-interactive
az group delete --name amsResourceGroup
```

> [!IMPORTANT]
> Leaving the live event running incurs billing costs. Be aware that if the project or program stops responding or is closed out for any reason, it might leave the live event running in a billing state.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Stream files](stream-files-tutorial-with-api.md)
 
