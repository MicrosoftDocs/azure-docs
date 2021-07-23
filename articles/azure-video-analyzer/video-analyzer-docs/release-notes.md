---
title: Azure Video Analyzer release notes - Azure
description: This topic provides release notes of Azure Video Analyzer releases, improvements, bug fixes, and known issues.
ms.topic: conceptual
ms.date: 06/01/2021

---
# Azure Video Analyzer release notes

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Azure+Video+Analyzer+on+IoT+Edge+release+notes%22&locale=en-us` into your RSS feed reader.

This article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

<hr width=100%>

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
* Manage [pipeline topologies](pipeline.md#pipeline-topologies) remotely or locally using [direct method](direct-methods.md) calls

## Next steps

[Overview](overview.md)
