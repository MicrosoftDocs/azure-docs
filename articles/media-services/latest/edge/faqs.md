---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Frequently asked questions about Live Video Analytics - Azure
titleSuffix: Azure Media Services
description:  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/10/2020
ms.author: juliako

---

# Frequently asked questions about Live Video Analytics

This page answers frequently asked questions about Azure Media Services Live Video Analytics, Media Graphs, and Media Services IoT Edge module.

## General

### What is Media Services media graph?

The Azure Media Services media graph is a logical graph defining media sources, processors, and sinks, along with data interconnections between them for high-scale IP video ingest on the edge or in the cloud. A media graph is also a  blueprint for processing a live stream of video in the cloud or on the edge and running it through a graph of "processors" that can extract information using machine learning models. Processors can extract information from the video and audio and supply it to downstream "sinks".

In the preview release, the following features are supported:

- sources can be RTSP-based IP cameras,
- processors are only supported in media graphs in Media Services on IoT Edge,
- the only supported processor is motion detector.

### What is the difference between Media Services media graph and live events in the API?

#### Live events

Live events are targeted at customers that require:

- broadcast-grade, long-running, large audience events at scale
- enterprise broadcasting, town halls, sports, and Media & Entertainment scenarios  

As such they have built in support for high availability, RTMP(S) and Smooth Streaming ingest, timed-metadata ingest (ID3), and advanced ad-signaling capabilities with SCTE-35 support. Live events can be configured to receive a single bitrate of video and audio and encode the feed into an adaptive bitrate ladder at 1080p or 720p resolution. In addition, Live Events support DVR windows, and with simple live to VOD asset workflows.

#### Media graphs

Media graphs by contrast are built to support high-scale ingest of many IP cameras, with the ability to plug in multiple processors into a pipeline for AI insights generation. Media graphs are not intended to be used for high-scale audience distributions, and are not meant for broadcast-grade encoding. Media graph will enable customers to build custom machine-vision, AI-based applications that power retail shops, automotive, factory automation, security monitoring, smart homes, smart cities and much more. Media graph also supports disconnected and hybrid deployments in Media Services on IoT Edge device with integration into IoT hubs for archiving clips to the cloud.

### What is the similarity between Media Services media graph and live events in the API?

Both media graph, and live events archive content into a Media Services asset that resides in a storage account container. The archived content uses the CMAF file format and can be delivered instantly through the [dynamic packager](https://docs.microsoft.com/azure/media-services/latest/dynamic-packaging-overview) component of Media Services. All of the features of dynamic packaging and [dynamic encryption](https://docs.microsoft.com/azure/media-services/latest/content-protection-overview) are available for use on the assets recorded by either a media graph or a live event.

## Configuration and deployment

### Can I deploy the media edge module to a Windows IOT device or VM?

No. In the preview release, only Linux VMs or devices are supported.

## IoT Edge configuration

### Are there any tools to make it easier to monitor the Media Services IoT Edge module

Visual Studio Code supports the "Azure IoT Hub Toolkit Extension", which allows you to easily monitor the mediaEdge module endpoints. You can use this tool to quickly start monitoring of the built-in endpoint for "events" and see the motion detection messages that are routed from the edge Media Graph to the cloud.

In addition, you can use this extension to edit the Module Twin for the mediaEdge module to modify the media graph settings.

To check on the health of the IoT Edge device use:

``` bash
sudo iotedge check
```

> [!NOTE]
> You need to make this call on the edge device and not in the CLI for Azure.

### Can I easily change the media graph settings on the Media Services IoT Edge module?

Yes, using the "Azure IoT Hub Toolkit Extension" for Visual Studio Code enables you to quickly edit the Module Twin and update the media graph settings. Changes to the RTSP URL require you to restart the media edge module.

To restart the module, you can use the following CLI command:

```bash
sudo iotedge restart mediaEdge
```

## Analytics processors

### Can I use any analytics processors in the cloud with my media graph?

No. In the preview release, there is no support for using an analytics processor in the cloud. Only the media edge module supports a single analytics processor for motion detection. This is to provide early input into the future capabilities and requirements for the service and to demonstrate how the service will eventually support more custom models in the graph.

### Can I use the motion detection module in the cloud media graph?

No. Currently the motion detection module is only available in the media edge module.

### Can I use the custom AI model in either the media edge or the cloud media graph?

No. The preview release does not support custom AI models at the edge or in the cloud. This is a feature we are considering for the future.

### Can I adjust the sensitivity of the motion detection module on the edge?

Yes. The media edge module's motion detector has a "High", "Medium" and "Low" sensitivity setting that can be controlled by updating the modules media graph and redeploying it to the device.

## IP camera ingest and RTSP settings

### What protocols are supported on ingest to media graph?

In the preview release, only RTSP is supported. Additional protocol support will be considered in future releases.

### Do I need to use a special SDK on my device to send in a video stream?

No. Media graph supports standard RTSP video streaming protocol. Additional protocol support will be considered in future releases.

### Can I also use RTMP or Smooth Streaming ingest like a Media Services live event?

No. Media graph will only support RTSP for ingestion from IP cameras on initial release. Other protocols are under consideration for our road map and we look forward to your feedback during the preview to help prioritize.

### What camera models are supported?

Any camera that supports RTSP streaming should work with the cloud and edge media graph. Please report any issues with RTSP compatibility as bugs on the preview service.

### Can I connect to a secure RTSP camera source in preview?

No. You can only connect to a basic password authenticated camera, or open authentication RTSP camera source in the preview release.

Currently, X.509 certificates are not supported.
When connecting to an RTSP source, you must fill out the credentials section of the media graph RTSP source.

RTSP(S) support will be added in a future release

``` json
    "sources": [
                {
                    "@odata.type": "#Microsoft.Media.MediaGraphRtspSource",
                    "name": "rtspSource",
                    "rtspUrl": "<<YOUR RTSP CAMERA SOURCE URL>>",
                    "credentials": {
                        "username": "<<YOUR CAMERA USER NAME>>",
                        "password": "<<YOUR CAMERA PASSWORD>>"
                    }
                }
            ],
```

### Can I connect to a camera using RTSPS?

Not currently. RTSPS support will be added in a future release.

### Can I reset or update the RTSP source URL on the media edge module after deployment?

Yes. You need to update the value of the RTSP URL in the `mediagraph` property in the manifest for the media edge module. This can be achieved by redeploying the manifest for the media edge module using the Azure IoT Edge CLI, or by editing the Module Twin and saving it back to the device.

The device may require a restart to accept the configuration change.

### Is there a simulated RTSP camera signal available to use during testing and development?

No. In the preview release, we do not support a built-in camera simulator. You must first acquire an IP camera or device that supports RTSP streaming and put it outside of your firewall for access to the Azure cloud media graph.

### Do you support ONVIF discovery of IP cameras at the edge?

No. In the preview release, there is no support for ONVIF discovery of devices on the edge.

## Streaming and playback

### Can archived assets from the edge be played back using Media Services streaming technologies like HLS or DASH?

Yes. The asset archives from the edge can be used like any other asset in Azure Media Services. To stream the content, you must have a [streaming endpoint](https://docs.microsoft.com/azure/media-services/latest/streaming-endpoint-concept) created and in the running state. Using the standard [streaming locator](https://docs.microsoft.com/azure/media-services/latest/streaming-locators-concept) creation process will give you access to an HLS or DASH manifest for streaming to any capable player framework. For details on creating publishing HLS or DASH manifests, see the article [Dynamic Packaging](https://docs.microsoft.com/azure/media-services/latest/dynamic-packaging-overview).

### Can I use the standard content protection and DRM features of Media Services on an archived asset?

Yes. All of the standard [dynamic encryption content protection and DRM features](https://docs.microsoft.com/azure/media-services/latest/content-protection-overview) are available for use on the archived assets from a media graph.

### What players can I use to view content from the archive media graph?

All standard players that support compliant Apple HTTP Live Streaming (HLS) version 3 or version 4 are supported. In addition, any player that is capable of compliant MPEG-DASH playback is also supported.

Recommended players for testing include:

- [Azure Media Player](https://docs.microsoft.com/azure/media-services/latest/use-azure-media-player)
- [HLS.js](https://video-dev.github.io/hls.js/demo/)
- [Video.js](https://videojs.com/)
- [Dash.js](https://github.com/Dash-Industry-Forum/dash.js/wiki)
- [Shaka Player](https://github.com/google/shaka-player)
- [ExoPlayer](https://github.com/google/ExoPlayer)
- [Apple native HTTP Live Streaming](https://developer.apple.com/streaming/)
- Edge, Chrome, or Safari built in HTML5 video player
- Commercial players that support HLS or DASH playback

### What are the limits on streaming a media graph asset?

Streaming a live or archived asset from a media graph uses the same high scale infrastructure and Streaming Endpoint that Media Services supports for on-demand and live streaming for Media & Entertainment, OTT, and broadcast customers. This means that you can quickly and easily enable the Azure CDN, Verizon or Akamai to deliver your content to an audience as small as a few viewers, or up to millions depending on your scenario.

Content can be delivered using both Apple HTTP Live Streaming (HLS) or MPEG-DASH. 

### What should I do if the Azure Media Player shows a network error on playback after a long period of archiving?

If you see the error message "A network error caused the video download to fail part-way. Check your network connection or try again later", you should reset the Azure Media Edge module to restart the archiving.

In preview, the archiver can sometimes stall out after 24 hours of operation and requires a reset.

## Media formats and archive container formats

### What are the basic requirements to ingest and play back video from a media graph?

To ingest and playback a live or archived media graph feed, your RTSP source video stream has to meet the following requirements:

- The video codec must be H.264. HEVC is not supported at preview
- Video only streams are supported
- The stream must conform to the [Real Time Streaming Protocol (RTSP) - RFC 2326](https://www.ietf.org/rfc/rfc2326.txt) specification
- Audio must be AAC-LC or HE-AAC

### What format is the archive written into the asset container?

Media Services uses the CMAF file format [ISO/IEC 23000-19:2018](https://www.iso.org/standard/71975.html) as the track container for video, audio, and metadata archive on disk. In addition the Smooth Streaming manifest file formats are used to describe the track layout, and fragment timestamps.

This format could evolve prior to public release.

## Content protection and encryption

### Can I encrypt the content during delivery?

Yes. Content can be encrypted and protected using Media Services content protection features including AES 128 Envelope (clear key) encryption, or advanced DRM technologies for native iOS, Android or Windows devices using Apple FairPlay, Google Widevine, or Microsoft PlayReady DRM technologies.

For details on content protection see the article [Protect your content by using Media Services dynamic encryption](https://docs.microsoft.com/azure/media-services/latest/content-protection-overview)

## Monitoring and metrics

### Can I monitor the media graph in the cloud and on the edge using Event Grid?

No. In the preview release, Event Grid support is not enabled.

### Can I use Azure Monitor to view the health, metrics, and performance of my media graphs in the cloud or on the edge?

No. In the preview release, Azure Monitor support is not integrated.

## Billing and availability

### Is the media graph metered when in a running state?

During the preview, the media graph is not emitting any billing meters. As we reach public preview, we will be announcing the pricing model for both the cloud media graph and the edge.

### Will I be billed for any other resource utilization when testing media graph in the cloud or edge?

Yes. While the running media graph is not billed during preview, there are additional resources required to be associated with the Azure Media Services account that can incur billable activity. This includes the attached Storage Account and all transactions required for archiving the RTSP video streams, the running Streaming Endpoint, as well as standard data egressed from the Streaming Endpoint for delivery of content to a player. If additional Media Services features are used on the assets that are archived (for example, encoding, audio or video analytics) then standard [Azure Media Services pricing](https://azure.microsoft.com//pricing/details/media-services/) applies.

## Quota and Limitations

### How many media graphs per Media Services account can I deploy?

Currently, a maximum of 50 running media graphs per account.

### How many IoT Edge modules can be run on the Edge device?

Currently, the limit for IoT Edge modules in one Edge runtime is 20.

### How many media graphs are supported on the edge?

A media edge module supports only a single media graph running at a time.

### How long will a media graph stay running on the cloud?

A media graph will run beyond 24-hours but max supported archive is 24-hours. The media graph will not automatically shut off after 24-hours, but performance can be impacted and it could appear to slow down archiving and latency on playback.

### How long can a media graph stay running on the edge?

In the preview release, the edge media graph is capable of running as long as the edge device remains in a healthy state.

### Are there any archive duration limitations when writing from the edge to a cloud asset?

Content is written from the edge to the cloud using CMAF format fragments. The limitation is currently on the size of the manifest that is generated, and then number of fragments in the container. At preview, we are limiting support to 24-hours. In a future release, we will enable support for more advanced edge-to-cloud archiving.

## Next steps

Review:

- [Overview: Getting Started](overview.md)
- [Concept: Media Graph](media-graph-concept.md)
- **Cloud Ingest**
  - [Tutorial: Manage Cloud ingest with Media Graphs](media-graph-cloud-tutorial.md)
- **Edge Ingest**
  - [How-to: Initial setup for Live Video Analytics on IoT Edge](edge-setup.md)
  - Configure your desired scenario:
    - [How to: Manage Edge ingest with Media Graphs](media-graph-edge-ingestion-tutorial.md)
    - [How to: Manage Edge ingest and motion detection with Media Graphs](media-graph-edge-ingestion-motion-detection-tutorial.md)
- **Samples**
  - [Sample: Media Graph swagger examples](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-09-01-preview/examples)
- **Resources**
    - [FAQ: Live Video Analytics](faqs.md)
