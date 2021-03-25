---
title: Live Video Analytics on IoT Edge FAQ - Azure  
description: This article answers commonly asked questions about Live Video Analytics on IoT Edge.
ms.topic: conceptual
ms.date: 12/01/2020
---

# Live Video Analytics on IoT Edge FAQ

This article answers commonly asked questions about Live Video Analytics on Azure IoT Edge.

## General

**What system variables can I use in the graph topology definition?**

| Variable	 |  Description  | 
| --- | --- | 
| [System.DateTime](/dotnet/framework/data/adonet/sql/linq/system-datetime-methods) | Represents an instant in UTC time, typically expressed as a date and time of day in the following format:<br>*yyyyMMddTHHmmssZ* | 
| System.PreciseDateTime | Represents a Coordinated Universal Time (UTC) date-time instance in an ISO8601 file-compliant format with milliseconds, in the following format:<br>*yyyyMMddTHHmmss.fffZ* | 
| System.GraphTopologyName	 | Represents a media graph topology, and holds the blueprint of a graph. | 
| System.GraphInstanceName | 	Represents a media graph instance, holds parameter values, and references the topology. | 

## Configuration and deployment

**Can I deploy the media edge module to a Windows 10 device?**

Yes. For more information, see [Linux containers on Windows 10](/virtualization/windowscontainers/deploy-containers/linux-containers).

## Capture from IP camera and RTSP settings

**Do I need to use a special SDK on my device to send in a video stream?**

No, Live Video Analytics on IoT Edge supports capturing media by using RTSP (Real-Time Streaming Protocol) for video streaming, which is supported on most IP cameras.

**Can I push media to Live Video Analytics on IoT Edge by using Real-Time Messaging Protocol (RTMP) or Smooth Streaming Protocol (such as a Media Services Live Event)?**

No, Live Video Analytics supports only RTSP for capturing video from IP cameras. Any camera that supports RTSP streaming over TCP/HTTP should work. 

**Can I reset or update the RTSP source URL in a graph instance?**

Yes, when the graph instance is in *inactive* state.  

**Is an RTSP simulator available to use during testing and development?**

Yes, an [RTSP simulator](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) edge module is available for use in the quickstarts and tutorials to support the learning process. This module is provided as best-effort and might not always be available. We recommend strongly that you *not* use the simulator for more than a few hours. You should invest in testing with your actual RTSP source before you plan a production deployment.

**Do you support ONVIF discovery of IP cameras at the edge?**

No, we don't support Open Network Video Interface Forum (ONVIF) discovery of devices on the edge.

## Streaming and playback

**Can I play back assets recorded to Azure Media Services from the edge by using streaming technologies such as HLS or DASH?**

Yes. You can stream recorded assets like any other asset in Azure Media Services. To stream the content, you must have a streaming endpoint created and in the running state. Using the standard Streaming Locator creation process will give you access to an Apple HTTP Live Streaming (HLS) or Dynamic Adaptive Streaming over HTTP (DASH, also known as MPEG-DASH) manifest for streaming to any capable player framework. For more information about creating and publishing HLS or DASH manifests, see [dynamic packaging](../latest/dynamic-packaging-overview.md).

**Can I use the standard content protection and DRM features of Media Services on an archived asset?**

Yes. All the standard dynamic encryption content protection and digital rights management (DRM) features are available for use on assets that are recorded from a media graph.

**What players can I use to view content from the recorded assets?**

All standard players that support compliant HLS version 3 or version 4 are supported. In addition, any player that's capable of compliant MPEG-DASH playback is also supported.

Recommended players for testing include:

* [Azure Media Player](../latest/use-azure-media-player.md)
* [HLS.js](https://hls-js.netlify.app/demo/)
* [Video.js](https://videojs.com/)
* [Dash.js](https://github.com/Dash-Industry-Forum/dash.js/wiki)
* [Shaka Player](https://github.com/google/shaka-player)
* [ExoPlayer](https://github.com/google/ExoPlayer)
* [Apple native HTTP Live Streaming](https://developer.apple.com/streaming/)
* Edge, Chrome, or Safari built-in HTML5 video player
* Commercial players that support HLS or DASH playback

**What are the limits on streaming a media graph asset?**

Streaming a live or recorded asset from a media graph uses the same high-scale infrastructure and streaming endpoint that Media Services supports for on-demand and live streaming for Media & Entertainment, Over the Top (OTT), and broadcast customers. This means that you can quickly and easily enable Azure Content Delivery Network, Verizon, or Akamai to deliver your content to an audience as small as a few viewers or up to millions, depending on your scenario.

You can deliver content by using either Apple HLS or MPEG-DASH.

## Design your AI model 

**I have multiple AI models wrapped in a Docker container. How should I use them with Live Video Analytics?** 

Solutions vary depending on the communication protocol that's used by the inferencing server to communicate with Live Video Analytics. The following sections describe how each protocol works.

*Use the HTTP protocol*:

* Single container (single lvaExtension):  

   In your inferencing server, you can use a single port but different endpoints for different AI models. For example, for a Python sample you can use different `route`s per model, as shown here: 

   ```
   @app.route('/score/face_detection', methods=['POST']) 
   … 
   Your code specific to face detection model… 

   @app.route('/score/vehicle_detection', methods=['POST']) 
   … 
   Your code specific to vehicle detection model 
   … 
   ```

   And then, in your Live Video Analytics deployment, when you instantiate graphs, set the inference server URL for each instance, as shown here: 

   1st instance: inference server URL=`http://lvaExtension:44000/score/face_detection`<br/>
   2nd instance: inference server URL=`http://lvaExtension:44000/score/vehicle_detection`  
   
    > [!NOTE]
    > Alternatively, you can expose your AI models on different ports and call them when you instantiate graphs.  

* Multiple containers: 

   Each container is deployed with a different name. Previously, in the Live Video Analytics documentation set, we showed you how to deploy an extension named *lvaExtension*. Now you can develop two different containers, each with the same HTTP interface, which means they have the same `/score` endpoint. Deploy these two containers with different names, and ensure that both are listening on *different ports*. 

   For example, one container named `lvaExtension1` is listening for the port `44000`, and a second container named `lvaExtension2` is listening for the port `44001`. 

   In your Live Video Analytics topology, you instantiate two graphs with different inference URLs, as shown here: 

   First instance:  inference server URL = `http://lvaExtension1:44001/score`    
   Second instance: inference server URL = `http://lvaExtension2:44001/score`
   
*Use the gRPC protocol*: 

* With Live Video Analytics module 1.0, when you use a general-purpose remote procedure call (gRPC) protocol, the only way to do so is if the gRPC server exposes different AI models via different ports. In [this code example](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/grpcExtensionOpenVINO/2.0/topology.json), a single port, 44000, exposes all the yolo models. In theory, the yolo gRPC server could be rewritten to expose some models at port 44000 and others at port 45000. 

* With Live Video Analytics module 2.0, a new property is added to the gRPC extension node. This property, **extensionConfiguration**, is an optional string that can be used as a part of the gRPC contract. When you have multiple AI models packaged in a single inference server, you don't need to expose a node for every AI model. Instead, for a graph instance, you, as the extension provider, can define how to select the different AI models by using the **extensionConfiguration** property. During execution, Live Video Analytics passes this string to the inferencing server, which can use it to invoke the desired AI model. 

**I'm building a gRPC server around an AI model, and I want to be able to support its use by multiple cameras or graph instances. How should I build my server?** 

 First, be sure that your server can either handle more than one request at a time or work in parallel threads. 

For example, a default number of parallel channels has been set in the following [Live Video Analytics gRPC sample](https://github.com/Azure/live-video-analytics/blob/master/utilities/video-analysis/notebooks/Yolo/yolov3/yolov3-grpc-icpu-onnx/lvaextension/server/server.py): 

```
server = grpc.server(futures.ThreadPoolExecutor(max_workers=3)) 
```

In the preceding gRPC server instantiation, the server can open only three channels at a time per camera, or per graph topology instance. Don't try to connect more than three instances to the server. If you do try to open more than three channels, requests will be pending until an existing channel drops.  

The preceding gRPC server implementation is used in our Python samples. As a developer, you can implement your own server or use the preceding default implementation to increase the worker number, which you set to the number of cameras to use for video feeds. 

To set up and use multiple cameras, you can instantiate multiple graph topology instances, each pointing to the same or a different inference server (for example, the server mentioned in the preceding paragraph). 

**I want to be able to receive multiple frames from upstream before I make an inferencing decision. How can I enable that?** 

Our current [default samples](https://github.com/Azure/live-video-analytics/tree/master/utilities/video-analysis) work in a *stateless* mode. They don't keep the state of the previous calls or even who called. This means that multiple topology instances might call the same inference server, but the server can't distinguish who is calling or the state per caller. 

*Use the HTTP protocol*:

To keep the state, each caller, or graph topology instance, calls the inferencing server by using the HTTP query parameter that's unique to caller. For example, the inference server URL addresses for each instance are shown here:  

1st topology instance= `http://lvaExtension:44000/score?id=1`<br/>
2nd topology instance= `http://lvaExtension:44000/score?id=2`

… 

On the server side, the score route knows who is calling. If ID=1, then it can keep the state separately for that caller or graph topology instance. You can then keep the received video frames in a buffer. For example, use an array, or a dictionary with a DateTime key, and the value is the frame. You can then define the server to process (infer) after *x* number of frames are received. 

*Use the gRPC protocol*: 

With a gRPC extension, each session is for a single camera feed, so there's no need to provide an ID. Now, with the extensionConfiguration property, you can store the video frames in a buffer and define the server to process (infer) after *x* number of frames are received. 

**Do all ProcessMediaStreams on a particular container run the same AI model?** 

No. Start or stop calls from the end user in a graph instance constitute a session, or perhaps there's a camera disconnect or reconnect. The goal is to persist one session if the camera is streaming video. 

* Two cameras sending video for processing creates two sessions. 
* One camera going to a graph that has two gRPC extension nodes creates two sessions. 

Each session is a full duplex connection between Live Video Analytics and the gRPC server, and each session can have a different model or pipeline. 

> [!NOTE]
> In case of a camera disconnect or reconnect, with the camera going offline for a period beyond tolerance limits, Live Video Analytics will open a new session with the gRPC server. There's no requirement for the server to track the state across these sessions. 

Live Video Analytics also adds support for multiple gRPC extensions for a single camera in a graph instance. You can use these gRPC extensions to carry out AI processing sequentially, in parallel, or as a combination of both. 

> [!NOTE]
> Having multiple extensions run in parallel will affect your hardware resources. Keep this in mind as you're choosing the hardware that suits your computational needs. 

**What is the maximum number of simultaneous ProcessMediaStreams?** 

Live Video Analytics applies no limits to this number.  

**How can I decide whether my inferencing server should use CPU or GPU or any other hardware accelerator?** 

Your decision depends on the complexity of the developed AI model and how you want to use the CPU and hardware accelerators. As you're developing the AI model, you can specify what resources the model should use and what actions it should perform. 

**How do I store images with bounding boxes post-processing?** 

Today, we are providing bounding box coordinates as inference messages only. You can build a custom MJPEG streamer that can use these messages and overlay the bounding boxes on the video frames.  

## gRPC compatibility 

**How will I know what the mandatory fields for the media stream descriptor are?** 

Any field that you don't supply a value to is given a [default value, as specified by gRPC](https://developers.google.com/protocol-buffers/docs/proto3#default).  

Live Video Analytics uses the *proto3* version of the protocol buffer language. All the protocol buffer data that's used by Live Video Analytics contracts is available in the [protocol buffer files](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc). 

**How can I ensure that I'm using the latest protocol buffer files?** 

You can obtain the latest protocol buffer files on the [contract files site](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc). Whenever we update the contract files, they'll be in this location. There's no immediate plan to update the protocol files, so look for the package name at the top of the files to know the version. It should read: 

```
microsoft.azure.media.live_video_analytics.extensibility.grpc.v1 
```

Any updates to these files will increment the "v-value" at the end of the name. 

> [!NOTE]
> Because Live Video Analytics uses the proto3 version of the language, the fields are optional, and the version is backward and forward compatible. 

**What gRPC features are available for me to use with Live Video Analytics? Which features are mandatory and which are optional?** 

You can use any server-side gRPC features, provided that the Protocol Buffers (Protobuf) contract is fulfilled. 

## Monitoring and metrics

**Can I monitor the media graph on the edge by using Azure Event Grid?**

Yes. You can consume Prometheus metrics and publish them to your event grid. 

**Can I use Azure Monitor to view the health, metrics, and performance of my media graphs in the cloud or on the edge?**

Yes, we support this approach. To learn more, see [Azure Monitor Metrics overview](../../azure-monitor/essentials/data-platform-metrics.md).

**Are there any tools to make it easier to monitor the Media Services IoT Edge module?**

Visual Studio Code supports the Azure IoT Tools extension, with which you can easily monitor the LVAEdge module endpoints. You can use this tool to quickly start monitoring your IoT hub built-in endpoint for "events" and view the inference messages that are routed from the edge device to the cloud. 

In addition, you can use this extension to edit the module twin for the LVAEdge module to modify the media graph settings.

For more information, see the [monitoring and logging](monitoring-logging.md) article.

## Billing and availability

**How is Live Video Analytics on IoT Edge billed?**

For billing details, see [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/).

## Next steps

[Quickstart: Get started with Live Video Analytics on IoT Edge](get-started-detect-motion-emit-events-quickstart.md)
