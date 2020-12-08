---
title: Live Video Analytics on IoT Edge FAQs - Azure  
description: This topic gives answers to Live Video Analytics on IoT Edge FAQs.
ms.topic: conceptual
ms.date: 12/01/2020
---

# Frequently asked questions (FAQs)

This topic gives answers to Live Video Analytics on IoT Edge FAQs.

## General

### What are the system variables that can be used in graph topology definition?

|Variable	|Description|
|---|---|
|[System.DateTime](/dotnet/framework/data/adonet/sql/linq/system-datetime-methods)|Represents an instant in UTC time, typically expressed as a date and time of day (basic representation yyyyMMddTHHmmssZ).|
|System.PreciseDateTime|Represents an UTC date time instance in ISO8601 file compliant format with milliseconds (basic representation yyyyMMddTHHmmss.fffZ).|
|System.GraphTopologyName	|Represents a media graph topology, holds the blueprint of a graph.|
|System.GraphInstanceName|	Represents a media graph instance, holds parameter values and references the topology.|

## Configuration and deployment

### Can I deploy the media edge module to a Windows 10 device?

Yes. See the article on [Linux Containers on Windows 10](/virtualization/windowscontainers/deploy-containers/linux-containers).

## Capture from IP camera and RTSP settings

### Do I need to use a special SDK on my device to send in a video stream?

No. Live Video Analytics on IoT Edge supports capturing media using RTSP video streaming protocol (which is supported on most IP cameras).

### Can I push media to Live Video Analytics on IoT Edge using RTMP or Smooth (like a Media Services Live Event)?

* No. Live Video Analytics only support RTSP for capturing video from IP cameras.
* Any camera that supports RTSP streaming over TCP/HTTP should work. 

### Can I reset or update the RTSP source URL on a graph instance?

Yes, when the graph instance is in inactive state.  

### Is there a RTSP simulator available to use during testing and development?

Yes. There is an [RTSP simulator](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) edge module available for use in the quick starts and tutorials to support the learning process. This module is provided as best-effort and may not always be available. It is strongly encouraged not to use this for more than a few hours. You should invest in testing with your actual RTSP source before making plans for a production deployment.

### Do you support ONVIF discovery of IP cameras at the edge?

No, there is no support for ONVIF discovery of devices on the edge.

## Streaming and playback

### Can assets recorded to AMS from the edge be played back using Media Services streaming technologies like HLS or DASH?

Yes. The recorded assets can be streamed like any other asset in Azure Media Services. To stream the content, you must have a Streaming Endpoint created and in the running state. Using the standard Streaming Locator creation process will give you access to an HLS or DASH manifest for streaming to any capable player framework. For details on creating publishing HLS or DASH manifests, see [dynamic packaging](../latest/dynamic-packaging-overview.md).

### Can I use the standard content protection and DRM features of Media Services on an archived asset?

Yes. All of the standard dynamic encryption content protection and DRM features are available for use on the assets recorded from a media graph.

### What players can I use to view content from the recorded assets?

All standard players that support compliant Apple HTTP Live Streaming (HLS) version 3 or version 4 are supported. In addition, any player that is capable of compliant MPEG-DASH playback is also supported.

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

### What are the limits on streaming a media graph asset?

Streaming a live or recorded asset from a media graph uses the same high scale infrastructure and streaming endpoint that Media Services supports for on-demand and live streaming for Media & Entertainment, OTT, and broadcast customers. This means that you can quickly and easily enable the Azure CDN, Verizon or Akamai to deliver your content to an audience as small as a few viewers, or up to millions depending on your scenario.

Content can be delivered using both Apple HTTP Live Streaming (HLS) or MPEG-DASH.

## Design your AI model 

### I have multiple AI models wrapped in a docker container. How should I use them with Live Video Analytics? 

Solutions are different depending on the communication protocol used by the inferencing server to communicate with Live Video Analytics. Below are some ways of doing this.

#### HTTP protocol:

* Single container (single lvaExtension):  

   In your inferencing server, you can use a single port but different endpoints for different AI models. For example, for a Python sample you can use different `route`s per model as: 

   ```
   @app.route('/score/face_detection', methods=['POST']) 
   … 
   Your code specific to face detection model… 

   @app.route('/score/vehicle_detection', methods=['POST']) 
   … 
   Your code specific to vehicle detection model 
   … 
   ```

   And then in your Live Video Analytics deployment, when you instantiate graphs, set the inference server URL for each instance as: 

   1st instance: inference server URL=`http://lvaExtension:44000/score/face_detection`<br/>
   2nd instance: inference server URL=`http://lvaExtension:44000/score/vehicle_detection`  
    > [!NOTE]
    > Alternatively, you can also also expose your AI models on different ports and call them when you instantiate graphs.  

* Multiple containers: 

   Each container is deployed with a different name. Currently, in the Live Video Analytics documentation set, we showed you how to deploy an extension with the name: **lvaExtension**. Now you can develop two different containers. Each container has the same HTTP interface (meaning same `/score` endpoint). Deploy these two containers with different names and be sure that both are listening on **different ports**. 

   For example, one container with the name `lvaExtension1` is listening for the port `44000`, other container with the name `lvaExtension2` is listening for the port `44001`. 

   In your Live Video Analytics topology, you instantiate two graphs with different inference URLs like: 

   First instance:  inference server URL = `http://lvaExtension1:44001/score`    
   Second instance: inference server URL = `http://lvaExtension2:44001/score`
   
#### GRPC protocol: 

With Live Video Analytics module 1.0, when using a gRPC protocol, the only way would be if the gRPC server exposed different AI models via different ports. In [this example](https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/grpcExtension/topology.json), there is a single port, 44000 that is exposing all the yolo models. In theory the yolo gRPC server could be rewritten to expose some models at 44000, others at 45000, … 

With Live Video Analytics module 2.0, a new property is added to the gRPC extension node. This property is called **extensionConfiguration** which is an optional string that can be used as a part of the gRPC contract. When you have multiple AI models packaged in a single inference server, you will not need to expose a node for every AI model. Instead, for a graph instance, the extension provider (you) can define how to select the different AI models using the **extensionConfiguration** property and during execution, Live Video Analytics will pass this string to the inferencing server which can use this to invoke the desired AI model. 

### I am building a gRPC server around an AI model, and want to be able to support being used by multiple cameras/graph instances. How should I build my server? 

 Firstly, be sure that your server can handle more than one requests at a time. Or be sure that your server works in parallel threads. 

For example, in one of [Live Video Analytics GRPC samples](https://github.com/Azure/live-video-analytics/blob/master/utilities/video-analysis/notebooks/Yolo/yolov3/yolov3-grpc-icpu-onnx/lvaextension/server/server.py), there is a default number of parallel channels set. See: 

```
server = grpc.server(futures.ThreadPoolExecutor(max_workers=3)) 
```

In the above gRPC server instantiation, the server can open only three channels per camera (so per graph topology instance) at a time. You should not try to connect more than three instances to the server. If you do try to open more than three channels, requests will be pending until an existing one drops.  

Above gRPC server implementation is used in our Python samples. Developers can implement their own servers or in the above default implementation can increase the worker number set to the number of cameras used to get video feed from. 

To set up and use multiple cameras, developers can instantiate multiple graph topology instance where each instance pointing to same or different inference server (for example, server mentioned in the above paragraph). 

### I want to be able to receive multiple frames from upstream before I make an inferencing decision. How can I enable that? 

Current [default samples](https://github.com/Azure/live-video-analytics/tree/master/utilities/video-analysis) work in "stateless" mode. These sample are not keeping the state of the previous calls and even who called (meaning multiple topology instance may call same inference server, and server will not be able to distinguish who is calling and state per caller) 

#### HTTP protocol

When using HTTP protocol: 

To keep the state, each caller (graph topology instance) will call the inferencing server with HTTP Query parameter unique to caller. For example, inference server URL address for  

1st topology instance= `http://lvaExtension:44000/score?id=1`<br/>
2nd topology instance= `http://lvaExtension:44000/score?id=2`

… 

On the server side, the score route will know who is calling. If ID=1, then it can keep the state separately for that caller (graph topology instance). You can then keep the received video frames in a buffer (for example, array, or a dictionary with DateTime Key, and Value is the frame) and then you can define the server to process (infer) after x frames are received. 

#### GRPC protocol 

When using gRPC protocol: 

With a gRPC extension, each session is for a single camera feed so there is no need to provide an ID. So now with the extensionConfiguration property, you can store the video frames in a buffer and define the server to process(infer) after x frames are received. 

### Do all ProcessMediaStreams on a particular container run the same AI model? 

No.  

Start/stop calls from the end user on a graph instance constitutes a session, or perhaps there is a camera disconnect/reconnect. The goal is to persist one session if the camera is streaming video. 

* Two cameras sending video for processing, creates two sessions. 
* One camera going to a graph that has two gRPCExtension nodes creates two sessions. 

Each session is a full duplex connection between Live Video Analytics and the gRPC Server and each session can have a different model/pipeline. 

> [!NOTE]
> In case of a camera disconnect/reconnect (with camera going offline for a period beyond tolerance limits), Live Video Analytics will open a new session with the gRPC Server. There is no requirement for the server to track state across these sessions. 

Live Video Analytics also added support of multiple gRPC extensions for a single camera in a graph instance. You will be able to use these gRPC extensions to carry out AI processing sequentially or in parallel or even have a combination of both. 

> [!NOTE]
> Having multiple extensions run in parallel will impact your hardware resources and you will have to keep this mind while choosing the hardware that will suit your computational needs. 

### What is the max # of simultaneous ProcessMediaStreams? 

There is no limit that Live Video Analytics applies.  

### How should I decide if my inferencing server should use CPU or GPU or any other hardware accelerator? 

This is completely dependent on how complex the AI model is developed and how the developer wants to use the CPU and hardware accelerators. While developing the AI model, the developers can specify what resources should be used by the model to perform what actions. 

### How do I store images with bounding boxes post processing? 

Today, we are providing bounding box coordinates as inference messages only. Developers can build a custom MJPEG streamer that can use these messages and overlay the bounding boxes over the video frames.  

## gRPC compatibility 

### How will I know what the mandatory fields for the media stream descriptor are? 

Any field value which is not supplied will be given a default [as specified by gRPC](https://developers.google.com/protocol-buffers/docs/proto3#default).  

Live Video Analytics uses **proto3** version of the protocol buffer language. All the protocol buffer data used by Live Video Analytics contracts are available in the protocol buffer files [defined here](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc). 

### How should I ensure that I am using the latest protocol buffer files? 

The latest protocol buffer files can be [obtained here](https://github.com/Azure/live-video-analytics/tree/master/contracts/grpc). Whenever we update the contract files, they will appear in this location. While there is no immediate plan to update the protocol files, look for the package name at the top of the files to know the version. It should read: 

```
microsoft.azure.media.live_video_analytics.extensibility.grpc.v1 
```

Any updates to these files, will increment the “v-value” at the end of the name. 

> [!NOTE]
> Since Live Video Analytics uses proto3 version of the language, the fields are optional, and this makes it backward and forward compatible. 

### What gRPC features are available for me to use with Live Video Analytics? Which features are mandatory and which ones are optional? 

Any server-side gRPC features may be used provided the protobuf contract is fulfilled. 

## Monitoring and metrics

### Can I monitor the media graph on the edge using Event Grid?

Yes. You can consume the prometheus metrics and publish them to event grid. 

### Can I use Azure Monitor to view the health, metrics, and performance of my media graphs in the cloud or on the edge?

Yes. This is supported. Learn more on [How to use Azure Monitor Metrics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics).

### Are there any tools to make it easier to monitor the Media Services IoT Edge module?

Visual Studio Code supports the "Azure IoT Tools " extension that allows you to easily monitor the LVAEdge module endpoints. You can use this tool to quickly start monitoring the IoT Hub built-in endpoint for "events" and see the inference messages that are routed from the edge device to the cloud. 

In addition, you can use this extension to edit the Module Twin for the LVAEdge module to modify the media graph settings.

For more information, see the [monitoring and logging](monitoring-logging.md) article.

## Billing and availability

### How is Live Video Analytics on IoT Edge billed?

See [pricing page](https://azure.microsoft.com/pricing/details/media-services/) for details.

## Next steps

[Quickstart: Get started - Live Video Analytics on IoT Edge](get-started-detect-motion-emit-events-quickstart.md)
