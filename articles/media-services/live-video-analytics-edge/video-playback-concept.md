---
title: Video playback - Azure
description: Placeholder
ms.topic: conceptual
ms.date: 04/27/2020

---
# Video playback 

## Suggested pre-reading 

* [Live Video Analytics on IoT Edge overview](overview.md)
* [Live Video Analytics on IoT Edge terminology](terminology.md)
* [Media graph concept](media-graph-concept.md)

## Overview  

You can use [media graphs](media-graph-concept.md) to record video into an Azure Media Services [asset](terminology.md#asset). In this document, you can learn about the steps you need to take in order to play an asset using existing streaming capabilities of Azure Media Services.

## Streaming endpoint 

You can use Azure Media Services to [stream](terminology.md#streaming) the asset to video players using industry-standard, HTTP-based media streaming protocols like HTTP Live Streaming (HLS) and MPEG-DASH. This conversion of media from recorded content into streaming formats is handled by a [streaming endpoint](../latest/streaming-endpoint-concept.md), which is a resource that you need to provision in your Azure Media Service account.

## Streaming policy 

Azure Media Services offers you different methods to secure your video streams, as discussed in [Protect your content with Media Services dynamic encryption](../latest/content-protection-overview.md) article. At a high level, options for content protection are:

* **In-the-clear streaming** – where no encryption is applied during streaming.
* **Use Advanced Encryption Standard (AES-128)** – and implement a method to deliver the keys for decrypting the video only to authenticated viewers.
* **Use Digital Rights Management (DRM) systems** – to control the use, modification, and delivery of video to devices that enforce these policies.

To achieve content protection, you can define and create a [Streaming Policy](../latest/streaming-policy-concept.md) in your Media Service account, and use it for streaming all assets (assuming all streams have the same requirements for security). You can also use any of the predefined policies (such as Predefined_ClearStreamingOnly).

## Streaming locator  

Once you have a Streaming Endpoint started in your Media Service account, and streaming policy defined, you can proceed to stream recorded media from an asset via HLS or DASH protocols. Web-players and mobile apps need a URL pointing to that HLS or DASH stream. You can build this URL using the [streaming locator](../latest/streaming-locators-concept.md). As discussed in that article, and shown in [Create a streaming locator and build URLs](../latest/create-streaming-locator-build-url.md) sample, the streaming URL is composed out of the streaming endpoint, streaming policy, and the streaming locator.

## Content recorded using file sink  

As described in [media graph file sink](media-graph-concept.md#file-sink), you can use media graphs to record videos to the local file system of the edge device using a file sink in your media graph. The file sink generates [MP4](https://developer.mozilla.org/docs/Web/Media/Formats/Containers#MP4) files, and you can use the HTML5 [&lt;video&gt;](https://developer.mozilla.org/docs/Web/HTML/Element/video) element to play such content. 

## Next steps

[Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/)
<!--
## Next steps

[Playback recording](playback-recording-how-to.md)
-->
