---
title: Live Video Analytics on IoT Edge FAQs - Azure  
description: This topic gives answers to Live Video Analytics on IoT Edge FAQs.
ms.topic: conceptual
ms.date: 04/27/2020

---

# Frequently asked questions (FAQs)

This topic gives answers to Live Video Analytics on IoT Edge FAQs.

## General

* What are the system variables that can be used in graph topology definition:

|Variable	|Description|
|---|---|
|[System.DateTime](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/linq/system-datetime-methods)|Represents an instant in time, typically expressed as a date and time of day.|
|System.GraphTopologyName	|Represents a media graph topology, holds the blueprint of a graph.|
|System.GraphInstanceName|	Represents a media graph instance, holds parameter values and references the topology.|

## Configuration and deployment

* Can I deploy the media edge module to a Windows IOT device?
    * No. Only Linux devices are supported.

## IP Camera ingest and RTSP settings

* Do I need to use a special SDK on my device to send in a video stream?
    * No. Media graph supports standard RTSP video streaming protocol.
* Can I also use RTMP or Smooth ingest like a Media Services Live Event?
    * No. Media graph only support RTSP for capturing video from IP cameras.
    * Any camera that supports RTSP streaming over TCP/HTTP should work. 
* Can I connect to a secure RTSP camera source?
    * No. You can only connect to a basic password authenticated camera, or open authentication RTSP camera source<!-- in the preview release-->. When connecting to an RTSP source, you must fill out the credentials section of the media graph RTSP source.
* Can I reset or update the RTSP source URL on a graph instance?
    * Yes, when the graph instance is in inactive state.  
* Is there a simulated RTSP camera signal available to use during testing and development?
    * Yes. There is an RTSP simulator edge module available for use in the quick starts and tutorials to support the learning process. This module is provided as best-effort and may not always be available. It is strongly encouraged not to use this for more than a few hours, and you should invest in testing with an IP Camera before making plans for a production deployment.
* Do you support ONVIF discovery of IP cameras at the edge?
    * No, there is no support for ONVIF discovery of devices on the edge.

## Streaming and playback

* Can assets recorded to AMS from the edge be played back using Media Services streaming technologies like HLS or DASH?
    * Yes. The recorded assets can be used like any other asset in Azure Media Services. To stream the content, you must have a Streaming Endpoint created and in the running state. Using the standard Streaming Locator creation process will give you access to an HLS or DASH manifest for streaming to any capable player framework. For details on creating publishing HLS or DASH manifests, see [dynamic packaging](../latest/dynamic-packaging-overview.md).
* Can I use the standard content protection and DRM features of Media Services on an archived asset?
    * Yes. All of the [standard dynamic encryption content protection and DRM features](../latest/content-protection-overview.md) are available for use on the assets recorded from a media graph.
* What players can I use to view content from the recorded assets?
* All standard players that support compliant Apple HTTP Live Streaming (HLS) version 3 or version 4 are supported. In addition, any player that is capable of compliant MPEG-DASH playback is also supported.
    Recommended players for testing include:

    * [Azure Media Player](../latest/use-azure-media-player.md)
    * [HLS.js](https://hls-js.netlify.app/demo/)
    * [Video.js](https://videojs.com/)
    * [Dash.js](https://github.com/Dash-Industry-Forum/dash.js/wiki)
    * [Shaka Player](https://github.com/google/shaka-player)
    * [ExoPlayer](https://github.com/google/ExoPlayer)
    * [Apple native HTTP Live Streaming](https://developer.apple.com/streaming/)
    * Edge, Chrome, or Safari built in HTML5 video player
    * Commercial players that support HLS or DASH playback
* What are the limits on streaming a media graph asset?
    * Streaming a live or recorded asset from a media graph uses the same high scale infrastructure and Streaming Endpoint that Media Services supports for on-demand and live streaming for Media & Entertainment, OTT, and broadcast customers. This means that you can quickly and easily enable the Azure CDN, Verizon or Akamai to deliver your content to an audience as small as a few viewers, or up to millions depending on your scenario.

    Content can be delivered using both Apple HTTP Live Streaming (HLS) or MPEG-DASH.

## Monitoring and metrics

* Can I monitor the media graph on the edge using Event Grid?
    * No. Currently Event Grid is not supported.
* Can I use Azure Monitor to view the health, metrics, and performance of my media graphs in the cloud or on the edge?
    * No.
* Are there any tools to make it easier to monitor the Media Services IoT Edge module?
    * Visual Studio Code supports the "Azure IoT Tools " extension that allows you to easily monitor the LVAEdge module endpoints. You can use this tool to quickly start monitoring the IoT Hub built-in endpoint for "events" and see the inference messages that are routed from the edge device to the cloud. 

    In addition, you can use this extension to edit the Module Twin for the LVAEdge module to modify the media graph settings.

For more information, see the [monitoring and logging](monitoring-logging.md) article.

## Billing and availability

* How is LiveVideo Analytics on IoT Edge billed?
    * Live Video Analytics on IoT Edge billing is generated based number of minutes per active media graph.

## Next steps

[Quickstart: Get started - Live Video Analytics on IoT Edge](get-started-detect-motion-emit-events-quickstart.md)
