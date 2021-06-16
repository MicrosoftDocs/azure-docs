---
title: Azure Live Video Analytics on IoT Edge release notes - Azure
description: This topic provides release notes of Azure Live Video Analytics on IoT Edge releases, improvements, bug fixes, and known issues.
ms.topic: conceptual
ms.date: 08/19/2020

---
# Azure Live Video Analytics on IoT Edge release notes

[!INCLUDE [redirect to Azure Video Analyzer](./includes/redirect-video-analyzer.md)]

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Live+Video+Analytics+on+IoT+Edge+release+notes%22&locale=en-us` into your RSS feed reader.

This article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

<hr width=100%>

## January 12, 2021

This release tag is for the January 2021 refresh of the module is:

```
mcr.microsoft.com/media/live-video-analytics:2.0.1
```

> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 2 (live-video-analytics:2). So simply redeploying such manifests should update the module on your edge > devices.
### Bug fixes 

* The fields `ActivationSignalOffset`, `MinimumActivationTime`, and `MaximumActivationTime` in Signal Gate processors were incorrectly set as required properties. They are now **optional** properties.
* Fixed a Usage bug that causes the Live Video Analytics on IoT Edge module to crash when deployed in certain regions.

<hr width=100%>

## December 14, 2020
This release is the public preview refresh release of Live Video Analytics on IoT Edge. The release tag is

```
     mcr.microsoft.com/media/live-video-analytics:2.0.0
```
### Module updates
* Added support for using more than one HTTP extension processor and gRPC extension processor per graph topology.
* Added support for [Disk space management for sink nodes](upgrading-lva-module.md#disk-space-management-with-sink-nodes).
* `MediaGraphGrpcExtension` node now supports [extensionConfiguration](grpc-extension-protocol.md) property for using multiple AI models within a single gRPC server.
* Added support of collecting Live Video Analytics module metrics in the [Prometheus format](https://prometheus.io/docs/practices/naming/). Learn more on how to [collect metrics and view in Azure Monitor.](monitoring-logging.md#azure-monitor-collection-via-telegraf) 
* Added the ability to filter output selection. You can pass **audio-only** or **video-only** or **audio and video** both with the help of `outputSelectors` to any graph node. 
* Frame Rate Filter processor is **deprecated**.  
    * Frame rate management is now available within the graph extension processor nodes itself.

### Visual Studio Code extension
* Released [Live Video Analytics on IoT Edge](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.live-video-analytics-edge) - A Visual Studio Code extension to help you manage LVA media graphs. This extension works with **LVA 2.0 module** and offers editing and managing media graphs with a sleek and an easy-to-use graphical interface.
## September 22, 2020

This release tag is for the September 2020 refresh of the module is:

```
mcr.microsoft.com/media/live-video-analytics:1.0.4
```

> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 1 (live-video-analytics:1). So simply redeploying such manifests should update the module on your edge > devices.

### Module updates

* A new graph extension node, [MediaGraphCognitiveServicesVisionExtension](spatial-analysis-tutorial.md) is available to integrate with the [Spatial Analysis](/legal/cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview)(preview) module from Cognitive Services.
* Added support for Linux ARM64 devices - use [manual steps](deploy-iot-edge-device.md) for deploying to such devices.

### Documentation updates

* [Instructions](deploy-azure-stack-edge-how-to.md) are available for using Live Video Analytics on IoT Edge on Azure Stack Edge devices.
* New tutorial on developing scenario-specific computer vision models using [Custom Vision service](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/) and using it to [analyze live video](custom-vision-tutorial.md) in real time.

<hr width=100%>

## August 19, 2020

This release tag is for the August 2020 refresh of the module is:

```
mcr.microsoft.com/media/live-video-analytics:1.0.3
```

> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 1 (live-video-analytics:1). So simply redeploying such manifests should update the module on your edge > devices.

### Module updates

* You can now get high data content transfer performance between Live Video Analytics on IoT Edge and your custom extension using gRPC framework. See [the quickstart](analyze-live-video-use-your-grpc-model-quickstart.md) to get started.
* Broader regional deployment of Live Video Analytics and only the cloud service has been updated.  
* Live Video Analytics is now available in 25 more regions across the globe. Here is the [list](https://azure.microsoft.com/global-infrastructure/services/?products=media-services) of all available regions.  
* The [set up](https://aka.ms/lva-edge/setup-resources-for-samples) for quick starts has been updated as well with new regions support.
    * There is no call to action for anyone who has already setup resources

### Bug fixes 

* Remove the use of a deprecated Azure extension in the setup script

<hr width=100%>

## July 13, 2020

This release tag is for the July 2020 refresh of the module is:

```
mcr.microsoft.com/media/live-video-analytics:1.0.2
```

> [!NOTE]
> In the quickstarts and tutorials, the deployment manifests use a tag of 1 (live-video-analytics:1). So simply redeploying such manifests should update the module on your edge > devices.

### Module updates

* You can now create graph topologies that have an asset sink node and a file sink node downstream of a signal gate processor node. See [the topology](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/evr-motion-assets-files) for an example.

### Bug fixes

* Improvements to validation of desired properties

<hr width=100%>

## June 1, 2020

This release is the first public preview release of Live Video Analytics on IoT Edge. The release tag is

```
     mcr.microsoft.com/media/live-video-analytics:1.0.0
```

### Supported functionalities

* Analyze live video streams using AI modules of your choice and optionally record video on the edge device or in the cloud
* Use on Linux AMD64 operating systems [supported](../../iot-edge/support.md) by IoT Edge
* Deploy and configure the module via the IoT Hub using Azure portal or Visual Studio Code
* Manage [graph topologies and graph instances](media-graph-concept.md#media-graph-topologies-and-instances) remotely or locally through the following direct method calls

    *	GraphTopologyGet
    *	GraphTopologySet
    *	GraphTopologyDelete
    *	GraphTopologyList
    *	GraphInstanceGet
    *	GraphInstanceSet
    *	GraphInstanceDelete
    *	GraphInstanceList

## Next steps

[Overview](overview.md)
