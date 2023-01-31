---
title: Release notes
description: This topic provides release notes of Azure Video Analyzer releases, improvements, bug fixes, and known issues.
ms.topic: conceptual
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Azure Video Analyzer release notes

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://learn.microsoft.com/api/search/rss?search=%22Azure+Video+Analyzer+on+IoT+Edge+release+notes%22&locale=en-us` into your RSS feed reader.

This article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

<hr width=100%>

## April 29, 2022

We’re retiring the Video Analyzer preview service, you're advised to **transition your applications off of Video Analyzer by 01 December 2022.**  To minimize disruption to your workloads, transition your application from Video Analyzer per suggestions described in this [guide](./transition-from-video-analyzer.md) before December 01, 2022. After December 1, 2022 your Video Analyzer account will no longer function.

Starting May 2, 2022 you will not be able to create new Video Analyzer accounts.

## November 2, 2021

This release is an update to the Video Analyzer edge module and the Video Analyzer service. The release tag for the edge module is:

```
mcr.microsoft.com/media/video-analyzer:1.1.0
```

> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 1 (video-analyzer:1). So simply redeploying such manifests should update the module on your edge  devices when newer tags are released.

The ARM API version of the Video Analyzer service is:

```
2021-11-01-preview
```

### New functionalities

* When using Video Analyzer with [Computer Vision for spatial analysis](edge/computer-vision-for-spatial-analysis.md) AI service from Cognitive Services, you can generate and view new insights such as the speed, orientation, trail of persons in the live video.
* You can [discover ONVIF-capable devices](edge/camera-discovery.md) in the local subnet of your edge device.
* You can [capture and record live video directly in the cloud](cloud/connect-cameras-to-cloud.md).
  * You can use [low latency streaming](viewing-videos-how-to.md#low-latency-streaming) to view the live video from the RTSP camera with end-to-end latencies of around 2 seconds.
  * You can implement the [Video Analyzer IoT PnP contract](cloud/connect-devices.md) on your RTSP camera to enable video capture from your device to the Video Analyzer service.
* You can [export the desired portion of your recorded video](cloud/export-portion-of-video-as-mp4.md) to an MP4 file.
* You can specify a retention policy for any of your recorded videos, where the service would periodically trim content older than the specified number of days.
* Videos recorded using Video Analyzer edge module can include [preview images](edge/enable-video-preview-images.md) or thumbnails periodically, enabling a better browsing experience.

### Known issues
* When using low latency streaming, only one client can be connected to the service at a time
* When using a gRPC extension module for inferencing with shared memory, both the Video Analyzer edge module and the extension module should run in the same [user and group](https://docs.docker.com/engine/reference/builder/#user)

## October 1, 2021
The Video Analyzer service is now available (in preview) in Australia East. See [here](https://azure.microsoft.com/global-infrastructure/services/?products=video-analyzer&regions=all) for the latest availability information.

A new article has been added to describe how you can [embed the Video Analyzer widget in Power BI](embed-player-in-power-bi.md)

## June 3, 2021

The release tag for the June 2021 refresh of the module is

```
     mcr.microsoft.com/media/video-analyzer:1.0.1
```
> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 1 (video-analyzer:1). So simply redeploying such manifests should update the module on your edge  devices when newer tags are released.

### Module updates
* Supports unicode characters in the credentials for connecting to an RTSP camera
* Updates to enable detailed logs in debug mode

<hr width=100%>

## May 25, 2021

This release is the first public preview release of Azure Video Analyzer. The release tag is

```
mcr.microsoft.com/media/video-analyzer:1.0.0
```

> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 1 (video-analyzer:1). So simply redeploying such manifests should update the module on your edge  devices when newer tags are released.

### Supported functionalities

* Analyze live video streams using AI modules of your choice and optionally record video on the edge device or in the cloud
* Record video along with inference metadata in the cloud
* Trigger events when objects cross a line using your own object detection model
* Track objects detected by your own detection model 
* Use Video Analyzer player widgets (web components) to play back recorded video and inference metadata
* Deploy and configure the module via the IoT Hub using Azure portal or Visual Studio Code
<!--REDIRECT* Manage [pipeline topologies](pipeline.md#pipeline-topologies) remotely or locally using [direct method](direct-methods.md) calls-->

## Next steps

[Overview](overview.md)
