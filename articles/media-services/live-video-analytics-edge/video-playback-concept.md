---
title: Video playback
description: Placeholder
ms.topic: conceptual
ms.date: 04/27/2020

---
# Video playback 

## Suggested pre-reading 

* [Live video analytics on IoT Edge Overview](overview.md)
* [Live video analytics on IoT Edge Terminology](terminology.md)
* [Media Graph Concept](media-graph-concept.md)

## Overview  

You can use [Media Graphs](media-graph-concept.md) to record media into an Azure Media Services [asset](terminology.md#asset). In this document, you can learn about how to play the media, via [streaming](terminology.md#streaming).

## Streaming endpoint 

You can use Azure Media Services to stream the media, that you recorded into Assets, to clients using industry-standard, HTTP-based media streaming protocols like HTTP Live Streaming (HLS) and MPEG-DASH. This conversion of media from recorded content into streaming formats is handled by the so-called [Streaming Endpoint](../latest/streaming-endpoint-concept.md), which is a resource that you need to provision in your Azure Media Service account.

## Streaming policy 

Azure Media Services offers you different methods to secure your video streams, as discussed in [Protect your content with Media Services dynamic encryption](../latest/content-protection-overview.md) article. At a high level, your options for content protection are:

* In-the-clear streaming – where anyone knowing the URL can view your streams.
* Use Advanced Encryption Standard (AES-128) – and implement a method to deliver the keys for decrypting the video only to authenticated viewers.
* Use Digital Rights Management (DRM) systems – such as those used by services like Netflix, Disney+, Apple TV+ etc. to protect their content.

To achieve content protection, you would define and create a [Streaming Policy](../latest/streaming-policy-concept.md) in your Media Service account, and use it for all of the streams (assuming all streams have the same requirements for security).

## Streaming locator  

Once you have a Streaming Endpoint started in your Media Service account, and Streaming Policy defined, you can proceed to stream recorded media from an Asset via HLS or DASH protocols. Web-players and mobile apps need a URL pointing to that HLS or DASH stream – you can get this URL via the [Streaming Locator](../latest/streaming-locators-concept.md). As discussed in that article, and shown in [Create a streaming locator and build URLs](../latest/create-streaming-locator-build-url.md) sample, the streaming URL is built from the Streaming Endpoint, Streaming Policy, and the Streaming Locator.

## Content recorded using file sink  

As described in [Media Graph file sink](media-graph-concept.md#file-sink), you can use Media Graphs to record video into the local file system of the Edge device using the File Sink component. This component generates [MP4](https://developer.mozilla.org/docs/Web/Media/Formats/Containers#MP4) files, and you can use the HTML5 [&lt;video&gt;](https://developer.mozilla.org/docs/Web/HTML/Element/video) element to play such content. 

## Next steps

[Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/)
<!--
## Next steps

[Playback recording](playback-recording-how-to.md)
-->