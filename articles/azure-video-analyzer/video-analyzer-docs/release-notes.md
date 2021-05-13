---
title: Azure Video Analyzer release notes - Azure
description: This topic provides release notes of Azure Video Analyzer releases, improvements, bug fixes, and known issues.
ms.topic: conceptual
ms.date: 05/25/2021

---
# Azure Video Analyzer release notes

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Azure+Video+Analyzer+on+IoT+Edge+release+notes%22&locale=en-us` into your RSS feed reader.

This article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

<hr width=100%>

## May 25, 2021

This release is the first public preview release of Azure Video Analyzer. The release tag is

```
     mcr.microsoft.com/media/azure-video-analyzer:1.0.0
```

### Supported functionalities

* Analyze live video streams using AI modules of your choice and optionally record video on the edge device or in the cloud
* Trigger events when objects cross a line using your own object detection model
* Track objects detected by your own detection model 
* Use Widgets to configure zones of interest and lines in your video along with recorded video playback with bounding boxes overlay
* Deploy and configure the module via the IoT Hub using Azure portal or Visual Studio Code
* Manage [pipeline topologies](pipeline.md#pipeline-topologies) remotely or locally through the following direct method calls

    *	pipelineTopologyGet
    *	pipelineTopologySet
    *	pipelineTopologyDelete
    *	pipelineTopologyList
    *	livePipelineGet
    *	livePipelineSet
    *	livePipelineDelete
    *	livePipelineList

## Next steps

[Overview](overview.md)