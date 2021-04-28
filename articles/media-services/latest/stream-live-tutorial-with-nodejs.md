---
title: Stream live with Media Services v3 Node.js
titleSuffix: Azure Media Services
description: Learn how to stream live using Node.js.
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

# Tutorial: Stream live with Media Services using Node.js and TypeScript

> [!NOTE]
> Even though the tutorial uses Node.js examples, the general steps are the same for [REST API](/rest/api/media/liveevents), [CLI](/cli/azure/ams/live-event), or other supported [SDKs](media-services-apis-overview.md#sdks). 

In Azure Media Services, [Live Events](/rest/api/media/liveevents) are responsible for processing live streaming content. A Live Event provides an input endpoint (ingest URL) that you then provide to a live encoder. The Live Event receives live input streams from the live encoder and makes it available for streaming through one or more [Streaming Endpoints](/rest/api/media/streamingendpoints). Live Events also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery. This tutorial shows how to use Node.js to create a **pass-through** type of a live event and broadcast a live stream to it using [OBS Studio](https://obsproject.com/download).

The tutorial shows you how to:

> [!div class="checklist"]
> * Download the sample code described in the topic.
> * Examine the code that configures and performs live streaming.
> * Watch the event with [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) at [https://ampdemo.azureedge.net](https://ampdemo.azureedge.net).
> * Clean up resources.


[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following items are required to complete the tutorial:

- Install [Node.js](https://nodejs.org/en/download/)
- Install [TypeScript](https://www.typescriptlang.org/)
- [Create a Media Services account](./create-account-howto.md).<br/>Make sure to remember the values that you used for the resource group name and Media Services account name.
- Follow the steps in [Access Azure Media Services API with the Azure CLI](./access-api-howto.md) and save the credentials. You will need to use them to access the API and configure your environment variables file.
- Walk through the [Configure and Connect with Node.js](./configure-connect-nodejs-howto.md) how-to first to understand how to use the Node.js client SDK
- Install Visual Studio Code or Visual Studio.
- [Setup your Visual Studio Code environment](https://code.visualstudio.com/Docs/languages/typescript) to support the TypeScript language.

## Additional settings for live streaming software

- A camera or a device (like a laptop) that's used to broadcast an event.
- An on-premises software encoder that encodes your camera stream and sends it to the Media Services live streaming service using the RTMP protocol, see [recommended on-premises live encoders](encode-recommended-on-premises-live-encoders.md). The stream has to be in **RTMP** or **Smooth Streaming** format.  
- For this sample, it is recommended to start with a software encoder like the free [Open Broadcast Software OBS Studio](https://obsproject.com/download) to make it simple to get started.

This sample assumes that you will use OBS Studio to broadcast RTMP to the ingest endpoint. Install OBS Studio first.
Use the following encoding settings in OBS Studio:

- Encoder: NVIDIA NVENC (if available) or x264
- Rate Control: CBR
- Bitrate: 2500 Kbps (or something reasonable for your laptop)
- Keyframe Interval: 2 s, or 1 s for low latency  
- Preset: Low-latency Quality or Performance (NVENC) or "veryfast" using x264
- Profile: high
- GPU: 0 (Auto)
- Max B-frames: 2

> [!TIP]
> Make sure to review [Live streaming with Media Services v3](stream-live-streaming-concept.md) before proceeding.

## Download and configure the sample

Clone the following Git Hub repository that contains the live streaming Node.js sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-node-tutorials.git
 ```

The live streaming sample is located in the [Live](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/Live) folder.

In the [AMSv3Samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples) folder copy the file named "sample.env" to a new file called ".env" to store your environment variable settings that you gathered in the article [Access Azure Media Services API with the Azure CLI](./access-api-howto.md).
Make sure that the file includes the "dot" (.) in front of .env" for this to work with the code sample correctly.

The [.env file](https://github.com/Azure-Samples/media-services-v3-node-tutorials/blob/main/AMSv3Samples/sample.env) contains your AAD Application key and secret along with account name and subscription information required to authenticate SDK access to your Media Services account. The .gitignore file is already configured to prevent publishing this file into your forked repository. Do not allow these credentials to be leaked as they are important secrets for your account.

> [!IMPORTANT]
> This sample uses a unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you'll end up with multiple Live Events in your account. <br/>Make sure to stop the running Live Events. Otherwise, you'll be **billed**! Run the program all the way through to completion to clean-up resources automatically. If the program crashes, or you inadvertently stop the debugger and break out of the program execution, you should double check the portal to confirm that you have not left any live events in the Running or Stand-by states that would result in unwanted billing charges.

## Examine the TypeScript code for live streaming

This section examines functions defined in the [index.ts](https://github.com/Azure-Samples/media-services-v3-node-tutorials/blob/main/AMSv3Samples/Live/index.ts) file of the *Live* project.

The sample creates a unique suffix for each resource so that you don't have name collisions if you run the sample multiple times without cleaning up.

### Start using Media Services SDK for Node.js with TypeScript

To start using Media Services APIs with Node.js, you need to first add the [@azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices) SDK module using the npm package manager

```bash
npm install @azure/arm-mediaservices
```

In the package.json, this is already configured for you, so you just need to run *npm install* to load the modules and dependencies.

1. Open a **command prompt**, browse to the sample's directory.
1. Change directory into the AMSv3Samples folder.

    ```bash
    cd AMSv3Samples
    ```

1. Install the packages used in the *packages.json* file.

    ```bash
    npm install 
    ```

1. Launch Visual Studio Code from the *AMSv3Samples* Folder. (This is required to launch from the folder where the *.vscode* folder and *tsconfig.json* files are located.)

    ```bash
    cd ..
    code .
    ```

Open the folder for *Live*, and open the *index.ts* file in the Visual Studio Code editor.
While in the *index.ts* file, press F5 to launch the debugger.

### Create the Media Services client

The following code snippet shows how to create the Media Services client in Node.js.
Notice that in this code we are first setting the **longRunningOperationRetryTimeout** property of the AzureMediaServicesOptions to 2 seconds to reduce the time it takes to poll for the status of a long running operation on the Azure Resource Management endpoint.  Since most of the operations on Live Events are going to be asynchronous, and could take some time to complete, you should reduce this polling interval on the SDK from the default value of 30 seconds to speed up the time it takes to complete major operations like creating Live Events, Starting and Stopping which are all asynchronous calls. Two seconds is the recommended value for most use case scenarios.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateMediaServicesClient)]

### Create a live event

This section shows how to create a **pass-through** type of Live Event (LiveEventEncodingType set to None). For more information about the other available types of Live Events, see [Live Event types](live-event-outputs-concept.md#live-event-types). In addition to pass-through, you can use a live transcoding Live Event for 720P or 1080P adaptive bitrate cloud encoding.
 
Some things that you might want to specify when creating the live event are:

* The ingest protocol for the Live Event (currently, the RTMP(S) and Smooth Streaming protocols are supported).<br/>You can't change the protocol option while the Live Event or its associated Live Outputs are running. If you require different protocols, create separate Live Event for each streaming protocol.  
* IP restrictions on the ingest and preview. You can define the IP addresses that are allowed to ingest a video to this Live Event. Allowed IP addresses can be specified as either a single IP address (for example '10.0.0.1'), an IP range using an IP address and a CIDR subnet mask (for example, '10.0.0.1/22'), or an IP range using an IP address and a dotted decimal subnet mask (for example, '10.0.0.1(255.255.252.0)').<br/>If no IP addresses are specified and there's no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.<br/>The IP addresses have to be in one of the following formats: IpV4 address with four numbers or CIDR address range.
* When creating the event, you can specify to autostart it. <br/>When autostart is set to true, the Live Event will be started after creation. That means the billing starts as soon as the Live Event starts running. You must explicitly call Stop on the Live Event resource to halt further billing. For more information, see [Live Event states and billing](live-event-states-billing-concept.md).
There are also standby modes available to start the Live Event in a lower cost 'allocated' state that makes it faster to move to a 'Running' state. This is useful for situations like hot pools that need to hand out channels quickly to streamers.
* For an ingest URL to be predictive and easier to maintain in a hardware based live encoder, set the "useStaticHostname" property to true, as well as use a custom unique GUID in the "accessToken". For detailed information, see [Live Event ingest URLs](live-event-outputs-concept.md#live-event-ingest-urls).

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateLiveEvent)]

### Create an Asset to record and archive the live event

In this block of code, you will create an empty Asset to use as the "tape" to record your live event archive to.
When learning these concepts, it is best to think of the "Asset" object as the tape that you would insert into a video tape recorder in the old days. The "Live Output" is the tape recorder machine. The "Live Event" is just the video signal coming into the back of the machine.

Keep in mind tha the Asset, or "tape", can be created at any time. It is just an empty "Asset" that you will hand to the Live Output object, the tape recorder in this analogy.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateAsset)]

### Create the Live Output

In this section, we create a Live Output that uses the Asset name as input to tell where to record the live event to. In addition, we set up the time-shifting (DVR) window to be used in the recording.
The sample code shows how to set up a 1 hour time-shifting window. This will allow clients to play back anywhere in the last hour of the event.  In addition, only the last 1 hour of the live event will remain in the archive. You can extend this to be up to 25 hours long if needed.  Also note that you are able to control the output manifest naming used the HLS and DASH manifests in your URL paths when published.

The Live Output, or "tape recorder" in our analogy, can be created at any time as well. Meaning you can create a Live Output before starting the signal flow, or after. If you need to speed up things, it is often helpful to create it before you start the signal flow.

Live Outputs start on creation and stop when deleted.  When you delete the Live Output, you're not deleting the underlying Asset or content in the asset. Think of it as ejecting the tape. The Asset with the recording will last as long as you like, and when it is ejected (meaning, when the Live Output is deleted) it will be available for on-demand viewing immediately.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateLiveOutput)]


### Get ingest URLs

Once the Live Event is created, you can get ingest URLs that you'll provide to the live encoder. The encoder uses these URLs to input a live stream using the RTMP protocol

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#GetIngestURL)]

### Get the preview URL

Use the previewEndpoint to preview and verify that the input from the encoder is actually being received.

> [!IMPORTANT]
> Make sure that the video is flowing to the Preview URL before continuing.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#GetPreviewURL)]

### Create and manage Live Events and Live Outputs

Once you have the stream flowing into the Live Event, you can begin the streaming event by publishing a Streaming Locator for your client players to use. This will make it available to viewers through the Streaming Endpoint.

You first create the signal by creating the "Live Event".  The signal is not flowing until you start that Live Event and connect your encoder to the input.

To stop the "tape recorder", you call delete on the LiveOutput. This does not actually delete the **contents** of your archive on the tape "Asset", it only deletes the "tape recorder" and stops the archiving. The Asset is always kept with the archived video content until you call delete explicitly on the Asset itself. As soon as you delete the liveOutput, the recorded content of the "Asset" is still available to play back through any already published Streaming Locator URLs. If you wish to remove the ability for a customer to play back the archived content you would first need to remove all locators from the asset and also flush the CDN cache on the URL path if you are using a CDN for delivery. Otherwise the content will live in the CDN's cache for the standard time-to-live setting on the CDN (which could be up to 72 hours.)

#### Create a Streaming Locator to publish HLS and DASH manifests

> [!NOTE]
> When your Media Services account is created, a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of [dynamic packaging](encode-dynamic-packaging-concept.md) and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state.

When you publish the Asset using a Streaming Locator, the Live Event (up to the DVR window length) will continue to be viewable until the Streaming Locator's expiry or deletion, whichever comes first. This is how you make the virtual "tape" recording available for your viewing audience to see live and on-demand. The same URL can be used to watch the live event, DVR window, or the on-demand asset when the recording is complete (when the Live Output is deleted.)

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#CreateStreamingLocator)]

#### Build the paths to the HLS and DASH manifests

The method BuildManifestPaths in the sample shows how to deterministically create the streaming paths to use for DASH or HLS delivery to various clients and player frameworks.

[!code-typescript[Main](../../../media-services-v3-node-tutorials/AMSv3Samples/Live/index.ts#BuildManifestPaths)]

## Watch the event

To watch the event, copy the streaming URL that you got when you ran code described in Create a Streaming Locator. You can use a media player of your choice. [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) is available to test your stream at https://ampdemo.azureedge.net.

Live Event automatically converts events to on-demand content when stopped. Even after you stop and delete the event, users can stream your archived content as a video on demand for as long as you don't delete the asset. An asset can't be deleted if it's used by an event; the event must be deleted first.

### Cleaning up resources in your Media Services account

If you run the application all the way through, it will automatically clean up all of the resources used in the function called "cleanUpResources". Make sure that the application or debugger runs all the way to completion or you may leak resources and end up with running live events in your account. Double check in the Azure portal to confirm that all resources are cleaned up in your Media Services account.  

In the sample code, refer to the **cleanUpResources** method for details.

> [!IMPORTANT]
> Leaving the Live Event running incurs billing costs. Be aware, if the project/program crashes or is closed out for any reason, it could leave the Live Event running in a billing state.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## More developer documentation for Node.js on Azure

- [Azure for JavaScript & Node.js developers](/azure/developer/javascript/)
- [Media Services source code in the @azure/azure-sdk-for-js Git Hub repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)
- [Azure Package Documentation for Node.js developers](/javascript/api/overview/azure/)


## Next steps

[Stream files](stream-files-tutorial-with-api.md)