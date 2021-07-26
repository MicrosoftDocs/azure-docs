---
title: Stream live with Media Services by using Node.js and TypeScript
titleSuffix: Azure Media Services
description: Learn how to stream live events by using Node.js, TypeScript, and OBS Studio.
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
ms.custom: "mvc, devx-track-nodejs"
ms.date: 04/15/2021
ms.author: inhenkel

---

# Tutorial: Stream live with Media Services by using Node.js and TypeScript

In Azure Media Services, [live events](/rest/api/media/liveevents) are responsible for processing live streaming content. A live event provides an input endpoint (ingest URL) that you then provide to a live encoder. The live event receives input streams from the live encoder and makes them available for streaming through one or more [streaming endpoints](/rest/api/media/streamingendpoints). Live events also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery. 

This tutorial shows how to use Node.js and TypeScript to create a *pass-through* type of a live event and broadcast a live stream to it by using [OBS Studio](https://obsproject.com/download).

In this tutorial, you will:

> [!div class="checklist"]
> * Download sample code.
> * Examine the code that configures and performs live streaming.
> * Watch the event with [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) on the [Media Player demo site](https://ampdemo.azureedge.net).
> * Clean up resources.


[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> Even though the tutorial uses Node.js examples, the general steps are the same for [REST API](/rest/api/media/liveevents), [CLI](/cli/azure/ams/live-event), or other supported [SDKs](media-services-apis-overview.md#sdks). 

## Prerequisites

You need the following items to complete the tutorial:

- Install [Node.js](https://nodejs.org/en/download/).
- Install [TypeScript](https://www.typescriptlang.org/).
- [Create a Media Services account](./create-account-howto.md). Remember the values that you use for the resource group name and Media Services account name.
- Follow the steps in [Access the Azure Media Services API with the Azure CLI](./access-api-howto.md) and save the credentials. You'll need them to access the API and configure your environment variables file.
- Walk through the [Configure and connect with Node.js](./configure-connect-nodejs-howto.md) article to understand how to use the Node.js client SDK.
- Install Visual Studio Code or Visual Studio.
- [Set up your Visual Studio Code environment](https://code.visualstudio.com/Docs/languages/typescript) to support the TypeScript language.

You need these additional items for live-streaming software:

- A camera or a device (like a laptop) that's used to broadcast an event.
- An on-premises software encoder that encodes your camera stream and sends it to the Media Services live-streaming service through the Real-Time Messaging Protocol (RTMP). For more information, see [Recommended on-premises live encoders](encode-recommended-on-premises-live-encoders.md). The stream has to be in RTMP or Smooth Streaming format.

  This sample assumes that you'll use Open Broadcaster Software (OBS) Studio to broadcast RTMP to the ingest endpoint. [Install OBS Studio](https://obsproject.com/download). 

  Use the following encoding settings in OBS Studio:

  - Encoder: NVIDIA NVENC (if available) or x264
  - Rate control: CBR
  - Bit rate: 2,500 Kbps (or something reasonable for your computer)
  - Keyframe interval: 2 s, or 1 s for low latency  
  - Preset: Low-latency Quality or Performance (NVENC) or "veryfast" using x264
  - Profile: high
  - GPU: 0 (Auto)
  - Max B-frames: 2

> [!TIP]
> Review [Live streaming with Media Services v3](stream-live-streaming-concept.md) before proceeding.

## Download and configure the sample

Clone the GitHub repository that contains the live-streaming Node.js sample to your machine by using the following command:  

```bash
git clone https://github.com/Azure-Samples/media-services-v3-node-tutorials.git
```

The live-streaming sample is in the [Live](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/Live) folder.

In the [AMSv3Samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples) folder, copy the file named *sample.env* to a new file called *.env* to store your environment variable settings that you gathered in the article [Access the Azure Media Services API with the Azure CLI](./access-api-howto.md).
Make sure that the file name includes the dot (.) in front of "env" so it can work with the code sample correctly.

The [.env file](https://github.com/Azure-Samples/media-services-v3-node-tutorials/blob/main/AMSv3Samples/sample.env) contains your Azure Active Directory (Azure AD) application key and secret. It also contains the account name and subscription information required to authenticate SDK access to your Media Services account. The *.gitignore* file is already configured to prevent publishing this file into your forked repository. Don't allow these credentials to be leaked, because they're important secrets for your account.

> [!IMPORTANT]
> This sample uses a unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you'll end up with multiple live events in your account. 
>
> Be sure to stop the running live events. Otherwise, *you'll be billed*! Run the program all the way to completion to clean up resources automatically. If the program stops, or you inadvertently stop the debugger and break out of the program execution, you should double check the portal to confirm that you haven't left any live events in the running or standby state that would result in unwanted billing charges.

## Examine the TypeScript code for live streaming

This section examines functions defined in the [index.ts](https://github.com/Azure-Samples/media-services-v3-node-tutorials/blob/main/AMSv3Samples/Live/index.ts) file of the *Live* project.

The sample creates a unique suffix for each resource so that you don't have name collisions if you run the sample multiple times without cleaning up.

### Start using the Media Services SDK for Node.js with TypeScript

To start using Media Services APIs with Node.js, you need to first add the [@azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices) SDK module by using the npm package manager:

```bash
npm install @azure/arm-mediaservices
```

In the *package.json* file, this is already configured for you. You just need to run `npm install` to load the modules and dependencies:

1. Open a command prompt and browse to the sample's directory.
1. Change directory into the *AMSv3Samples* folder:

    ```bash
    cd AMSv3Samples
    ```

1. Install the packages used in the *packages.json* file:

    ```bash
    npm install 
    ```

1. Open Visual Studio Code from the *AMSv3Samples* folder. (This is required to start from the folder where the *.vscode* folder and *tsconfig.json* files are located.)

    ```bash
    cd ..
    code .
    ```

Open the folder for *Live*, and open the *index.ts* file in the Visual Studio Code editor.

While you're in the *index.ts* file, select the F5 key to open the debugger.

### Create the Media Services client

The following code snippet shows how to create the Media Services client in Node.js.

In this code, you're changing the `longRunningOperationRetryTimeout` property of `AzureMediaServicesOptions` from the default value of 30 seconds to 2 seconds. This change reduces the time it takes to poll for the status of a long-running operation on the Azure Resource Manager endpoint. It will shorten the time to complete major operations like creating live events, starting, and stopping, which are all asynchronous calls. We recommend a value of 2 seconds for most scenarios.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateMediaServicesClient)]

### Create a live event

This section shows how to create a *pass-through* type of live event (`LiveEventEncodingType` set to `None`). For information about the available types, see [Live event types](live-event-outputs-concept.md#live-event-types). In addition to pass-through, you can use a live encoding event for 720p or 1080p adaptive bitrate cloud encoding.
 
You might want to specify the following things when you're creating the live event:

* **The ingest protocol for the live event**. Currently, the RTMP, RTMPS, and Smooth Streaming protocols are supported. You can't change the protocol option while the live event or its associated live outputs are running. If you need different protocols, create a separate live event for each streaming protocol.  
* **IP restrictions on the ingest and preview**. You can define the IP addresses that are allowed to ingest a video to this live event. Allowed IP addresses can be specified as one of these choices:

  * A single IP address (for example, `10.0.0.1`)
  * An IP range that uses an IP address and a Classless Inter-Domain Routing (CIDR) subnet mask (for example, `10.0.0.1/22`)
  * An IP range that uses an IP address and a dotted decimal subnet mask (for example, `10.0.0.1(255.255.252.0)`)

  If no IP addresses are specified and there's no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set `0.0.0.0/0`. The IP addresses have to be in one of the following formats: IPv4 address with four numbers or a CIDR address range.
* **Autostart on an event as you create it**. When autostart is set to `true`, the live event will start after creation. That means the billing starts as soon as the live event starts running. You must explicitly call `Stop` on the live event resource to halt further billing. For more information, see [Live event states and billing](live-event-states-billing-concept.md).

  Standby modes are available to start the live event in a lower-cost "allocated" state that makes it faster to move to a running state. This is useful for situations like hot pools that need to hand out channels quickly to streamers.
* **A static host name and a unique GUID**. For an ingest URL to be predictive and easier to maintain in a hardware-based live encoder, set the `useStaticHostname` property to `true`. For `accessToken`, use a custom, unique GUID. For detailed information, see [Live event ingest URLs](live-event-outputs-concept.md#live-event-ingest-urls).

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateLiveEvent)]

### Create an asset to record and archive the live event

In the following block of code, you create an empty asset to use as the "tape" to record your live event archive to.

When you're learning these concepts, it's helpful to think of the asset object as the tape that you would insert into a video tape recorder in the old days. The live output is the tape recorder machine. The live event is just the video signal coming into the back of the machine.

Keep in mind that the asset, or "tape," can be created at any time. You'll hand the empty asset to the live output object, the "tape recorder" in this analogy.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateAsset)]

### Create the live output

In this section, you create a live output that uses the asset name as input to tell where to record the live event to. In addition, you set up the time-shifting (DVR) window to be used in the recording.

The sample code shows how to set up a 1-hour time-shifting window. This window will allow clients to play back anything in the last hour of the event. In addition, only the last 1 hour of the live event will remain in the archive. You can extend this window to be up to 25 hours if needed.  Also note that you can control the output manifest naming that the HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming over HTTP (DASH) manifests use in your URL paths when published.

The live output, or "tape recorder" in our analogy, can be created at any time as well. You can create a live output before starting the signal flow, or after. If you need to speed up things, it's often helpful to create the output before you start the signal flow.

Live outputs start when they're created and stop when they're deleted.  When you delete the live output, you're not deleting the underlying asset or content in the asset. Think of it as ejecting the "tape." The asset with the recording will last as long as you like. When it's ejected (meaning, when the live output is deleted), it will be available for on-demand viewing immediately.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateLiveOutput)]


### Get ingest URLs

After the live event is created, you can get ingest URLs that you'll provide to the live encoder. The encoder uses these URLs to input a live stream by using the RTMP protocol.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#GetIngestURL)]

### Get the preview URL

Use `previewEndpoint` to preview and verify that the input from the encoder is being received.

> [!IMPORTANT]
> Make sure that the video is flowing to the preview URL before you continue.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#GetPreviewURL)]

### Create and manage live events and live outputs

After you have the stream flowing into the live event, you can begin the streaming event by publishing a streaming locator for your client players to use. This will make it available to viewers through the streaming endpoint.

You first create the signal by creating the live event. The signal is not flowing until you start that live event and connect your encoder to the input.

To stop the "tape recorder," you call `delete` on `LiveOutput`. This action doesn't delete the *contents* of your archive on the "tape" (asset). It only deletes the "tape recorder" and stops the archiving. The asset is always kept with the archived video content until you call `delete` explicitly on the asset itself. As soon as you delete `LiveOutput`, the recorded content of the asset is still available to play back through any published streaming locator URLs. 

If you want to remove the ability of a client to play back the archived content, you first need to remove all locators from the asset. You also flush the content delivery network (CDN) cache on the URL path, if you're using a CDN for delivery. Otherwise, the content will live in the CDN's cache for the standard time-to-live setting on the CDN (which might be up to 72 hours).

#### Create a streaming locator to publish HLS and DASH manifests

> [!NOTE]
> When your Media Services account is created, a default streaming endpoint is added to your account in the stopped state. To start streaming your content and take advantage of [dynamic packaging](encode-dynamic-packaging-concept.md) and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the running state.

When you publish the asset by using a streaming locator, the live event (up to the DVR window length) will continue to be viewable until the streaming locator's expiration or deletion, whichever comes first. This is how you make the virtual "tape" recording available for your viewing audience to see live and on demand. The same URL can be used to watch the live event, the DVR window, or the on-demand asset when the recording is complete (when the live output is deleted).

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateStreamingLocator)]

#### Build the paths to the HLS and DASH manifests

The method `BuildManifestPaths` in the sample shows how to deterministically create the streaming paths to use for HLS or DASH delivery to various clients and player frameworks.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#BuildManifestPaths)]

## Watch the event

To watch the event, copy the streaming URL that you got when you ran the code to create a streaming locator. You can use a media player of your choice. [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) is available to test your stream at the [Media Player demo site](https://ampdemo.azureedge.net).

A live event automatically converts events to on-demand content when it's stopped. Even after you stop and delete the event, users can stream your archived content as a video on demand for as long as you don't delete the asset. An asset can't be deleted if an event is using it; the event must be deleted first.

## Clean up resources in your Media Services account

If you run the application all the way through, it will automatically clean up all of the resources used in the `cleanUpResources` function. Make sure that the application or debugger runs all the way to completion, or you might leak resources and end up with running live events in your account. Double check in the Azure portal to confirm that all resources are cleaned up in your Media Services account. 

In the sample code, refer to the `cleanUpResources` method for details.

> [!IMPORTANT]
> Leaving the live event running incurs billing costs. Be aware that if the project or program stops responding or is closed out for any reason, it might leave the live event running in a billing state.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## More developer documentation for Node.js on Azure

- [Azure for JavaScript and Node.js developers](/azure/developer/javascript/)
- [Media Services source code in the @azure/azure-sdk-for-js GitHub repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)
- [Azure package documentation for Node.js developers](/javascript/api/overview/azure/)


## Next steps

[Stream files](stream-files-tutorial-with-api.md)