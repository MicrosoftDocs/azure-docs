---
title: Upgrading Live Video Analytics on IoT Edge from 1.0 to 2.0
description: This article covers the differences and the different things to consider when upgrading the Live Video Analytics (LVA) on Azure IoT Edge module.
author: naiteeks
ms.topic: how-to
ms.author: naiteeks
ms.date: 12/14/2020

---

# Upgrading Live Video Analytics on IoT Edge from 1.0 to 2.0

This article covers the differences and the different things to consider when upgrading the Live Video Analytics (LVA) on Azure IoT Edge module.

## Change List

> [!div class="mx-tdCol4BreakAll"]
> |Title|Live Video Analytics 1.0|Live Video Analytics 2.0|Description|
> |-------------|----------|---------|---------|
> |Container Image|mcr.microsoft.com/media/live-video-analytics:1|mcr.microsoft.com/media/live-video-analytics:2|Microsoft Published docker images for Live Video Analytics on Azure IoT Edge|
> |**MediaGraph nodes** |    |   |   |
> |Sources|:::image type="icon" source="./././media/upgrading-lva/check.png"::: RTSP Source </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: IoT Hub Message Source |:::image type="icon" source="./././media/upgrading-lva/check.png"::: RTSP Source </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: IoT Hub Message Source | MediaGraph nodes that act as sources for media ingestion and messages.|
> |Processors|:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion detection processor </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Frame rate filter processor </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Http extension processor </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Grpc extension processor </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Signal gate processor |:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion detection processor </br>:::image type="icon" source="./././media/upgrading-lva/remove.png"::: **Frame rate filter processor**</br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Http extension processor </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Grpc extension processor </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Signal gate processor | MediaGraph nodes that enable you to format the media before sending to AI inference servers.|
> |Sinks|:::image type="icon" source="./././media/upgrading-lva/check.png"::: Asset Sink </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: File Sink </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: IoT Hub message sink|:::image type="icon" source="./././media/upgrading-lva/check.png"::: Asset Sink </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: File Sink </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: IoT Hub message sink| MediaGraph nodes that enable you to store the processed media.|
> |**Supported MediaGraphs** |    |   |   |
> |Topologies|:::image type="icon" source="./././media/upgrading-lva/check.png"::: Continuous Video Recording </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion Analysis and Continuous Video Recording </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: External Analysis and Continuous Video Recording </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Event-based Recording on Motion </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Event-based Recording on AI</br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Event-based Recording on External Event </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion Analysis </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion Analysis followed by AI inferencing |:::image type="icon" source="./././media/upgrading-lva/check.png"::: Continuous Video Recording </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion Analysis and Continuous Video Recording </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: External Analysis and Continuous Video Recording </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Event-based Recording on Motion </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Event-based Recording on AI</br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Event-based Recording on External Event </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion Analysis </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: Motion Analysis followed by AI inferencing </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: **AI Composition** </br>:::image type="icon" source="./././media/upgrading-lva/check.png"::: **Audio and Video Recording** </br>  | MediaGraph topologies that enable you to define the blueprint of a graph, with parameters as placeholders for values.|

## Upgrading the Live Video Analytics on IoT Edge module from 1.0 to 2.0
When upgrading the Live Video Analytics on IoT Edge module, make sure you update the following information.
### Container Image
In your deployment template, look for your Live Video Analytics on IoT Edge module under the `modules` node and update the `image` field as:
```
"image": "mcr.microsoft.com/media/live-video-analytics:2"
```
> [!TIP]
> If you haven't modified the name of the Live Video Analytics on IoT Edge module, look for `lvaEdge` under the module node.

### Topology File changes
In your topology files, make sure **`apiVersion`** is set to 2.0

### MediaGraph node changes


* Audio from your camera source can now be passed downstream along with video. You can pass **audio-only** or **video-only** or **audio and video both** with the help of **`outputSelectors`** to any graph node. For example, if you want to select video only from the RTSP source and pass it downstream, then add the following to the RTSP source node:
    ```
    "outputSelectors": [
      {
        "property": "mediaType",
        "operator": "is",
        "value": "video"
      }
    ```
>[!NOTE]
>The **`outputSelectors`** is an optional property. If this is not used, then the media graph will pass the audio (if enabled) and video from the RTSP camera downstream. 

* In `MediaGraphHttpExtension` and `MediaGraphGrpcExtension` processors, note the following changes:  
    #### Image properties
    * `MediaGraphImageFormatEncoded` is no longer supported. 
      * Instead, use **`MediaGraphImageFormatBmp`** or **`MediaGraphImageFormatJpeg`** or **`MediaGraphImageFormatPng`**. For example,
        ```
        "image": {
                "scale": 
                {
                    "mode": "preserveAspectRatio",
                    "width": "416",
                    "height": "416"
                },
                "format": 
                {
                    "@type": "#Microsoft.Media.MediaGraphImageFormatJpeg"
                }
            }
        ```
        * If you want to use RAW images, use **`MediaGraphImageFormatRaw`**. To use this, update the image node as:
        ```
        "image": {
                "scale": 
                {
                    "mode": "preserveAspectRatio",
                    "width": "416",
                    "height": "416"
                },
                "format": 
                {
                    "@type": "#Microsoft.Media.MediaGraphImageFormatRaw",
                    "pixelFormat": "rgba"
                }
            }
        ```
        >[!NOTE]
        > Possible values of pixelFormat include: `yuv420p`,`rgb565be`, `rgb565le`, `rgb555be`, `rgb555le`, `rgb24`, `bgr24`, `argb`, `rgba`, `abgr`, `bgra`  

    #### extensionConfiguration for Grpc extension processor  
    * In `MediaGraphGrpcExtension` processor, a new property called **`extensionConfiguration`** is available, which is an optional string that can be used as a part of the gRPC contract. This field can be used to pass any data to the inference server and you can define how the inference server uses that data.  
    One use case of this property is when you have multiple AI models packaged in a single inference server. With this property you will not need to expose a node for every AI model. Instead, for a graph instance, as an extension provider, you can define how to select the different AI models using the **`extensionConfiguration`** property and during execution, LVA will pass this string to the inferencing server,  which can use this to invoke the desired AI model.  

    #### AI Composition
    * Live Video Analytics 2.0 now supports using more than one media graph extension processor within a topology. You can pass the media frames from the RTSP camera to different AI models either sequentially, in parallel or in a combination of both. Please see a sample topology showing two AI models being used sequentially.

### Disk Space management with sink nodes
* In your **File sink** node, you can now specify how much disk space the Live Video Analytics on IoT Edge module can use to store the processed images. To do so, add the **`maximumSizeMiB`** field to the FileSink node. A sample File Sink node is as follows:
    ```
    "sinks": [
      {
        "@type": "#Microsoft.Media.MediaGraphFileSink",
        "name": "fileSink",
        "inputs": [
          {
            "nodeName": "signalGateProcessor",
            "outputSelectors": [
              {
                "property": "mediaType",
                "operator": "is",
                "value": "video"
              }
            ]
          }
        ],
        "fileNamePattern": "sampleFiles-${System.DateTime}",
        "maximumSizeMiB":"512",
        "baseDirectoryPath":"/var/media"
      }
    ]
    ```
* In your **Asset sink** node, you can specify how much disk space the Live Video Analytics on IoT Edge module can use to store the processed images. To do so, add the **`localMediaCacheMaximumSizeMiB`** field to the Asset Sink node. A sample Asset Sink node is as follows:
    ```
    "sinks": [
      {
        "@type": "#Microsoft.Media.MediaGraphAssetSink",
        "name": "AssetSink",
        "inputs": [
          {
            "nodeName": "signalGateProcessor",
            "outputSelectors": [
              {
                "property": "mediaType",
                "operator": "is",
                "value": "video"
              }
            ]
          }
        ],
        "assetNamePattern": "sampleAsset-${System.GraphInstanceName}",
        "segmentLength": "PT30S",
        "localMediaCacheMaximumSizeMiB":"200",
        "localMediaCachePath":"/var/lib/azuremediaservices/tmp/"
      }
    ]
    ```
    >[!NOTE]
    >  The **File sink** path is split into base directory path and file name pattern, whereas the **Asset sink** path includes the base directory path.  

### Frame Rate management
* **`MediaGraphFrameRateFilterProcessor`** is deprecated in **Live Video Analytics on IoT Edge 2.0** module.
    * To sample the incoming video for processing, add the **`samplingOptions`** property to the MediaGraph extension processors (`MediaGraphHttpExtension` or `MediaGraphGrpcExtension`)  
     ```
          "samplingOptions": 
          {
            "skipSamplesWithoutAnnotation": "false",  // If true, limits the samples submitted to the extension to only samples which have associated inference(s) 
            "maximumSamplesPerSecond": "20"   // Maximum rate of samples submitted to the extension
          },
    ```
### Module metrics in the Prometheus format using Telegraf
With this release, Telegraf can be used to send metrics to Azure Monitor. From there, the metrics may be directed to Log Analytics or an event hub.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/telemetry-schema/telegraf.png" alt-text="Taxonomy of events":::

You can produce a Telegraf image with a custom configuration easily using docker. Learn more in the [Monitoring and logging](monitoring-logging.md#azure-monitor-collection-via-telegraf) page.

## Next steps

[Get started with Live Video Analytics on IoT Edge](get-started-detect-motion-emit-events-quickstart.md)