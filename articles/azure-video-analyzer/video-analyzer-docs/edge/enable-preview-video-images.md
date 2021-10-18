---
title: Enable preview images
description: This article explains how to enable and access preview images when recording video using Azure Video Analyzer
ms.topic: how-to
ms.date: 11/01/2021

---

# Enable preview images when recording video

You can use Azure Video Analyzer to [capture and record video](../video-recording.md) from an RTSP camera. You would be creating a pipeline topology that includes a video sink node, as shown in this [quickstart](detect-motion-record-video-clips-cloud.md) or this [tutorial](use-continuous-video-recording.md). 

If you record video using the Video Analyzer edge module, you can enable the video sink node to periodically generate a set of preview images of different sizes. These images can then be retrieved from the [video resource](../terminology.md#video) in your Video Analyzer account. For example, if your camera generates a video that has a resolution of 1920x1080, then the preview images would have the following sizes:

  * 320 x 180: small
  * 640 x 360: medium
  * 1280 x 720: large

> [!NOTE]
> The preview images will preserve the aspect ratio of video from the camera.

The preview images are generated periodically, the frequency being determined by [`segmentLength`](../playback-recordings-how-to.md#recording-and-playback-latencies). If you are using [event-based recording](record-event-based-live-video.md), you should note that images are generated only when the live pipeline is active and video is being recorded. Each time a set of preview images are generated, they will overwrite the previous set.

> [!NOTE]
> This functionality is currently only available with Video Analyzer Edge module. Further, enabling this has an impact on your Azure storage costs, driven by the frequent transactions to write the images or view them, and the size of the images.

## Enable preview images in the video sink node
To enable preview images, you need to set the appropriate flag in the video sink node of the pipeline topology. Under **videoPublishingOptions**, set **enableVideoPreviewImage** to **true**  

Example:
```
        "sinks": [
        {
          "@type": "#Microsoft.VideoAnalyzer.VideoSink",
          "name": "videoSink",
          "videoName": "{$parameter-for-specifying-unique-videoName-for-each-pipeline}",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
            }
          ],
          "videoPublishingOptions": {
            "enableVideoPreviewImage": "true"
          },
          "videoCreationProperties": {
            "title": "{$parameter-for-specifying-unique-title-for-each-pipeline}",
            "description": "{$parameter-for-specifying-unique-description-for-each-pipeline}k",
            "segmentLength": "PT30S"
          },
          "localMediaCachePath": "/var/lib/videoanalyzer/tmp/",
          "localMediaCacheMaximumSizeMiB": "2048"
        }
      ]
``` 

## Accessing preview images

To acquire the static URLs to the available preview images, a GET request must be called on the video resource with an [authorized bearer token](../playback-recordings-how-to.md#accessing-videos). You will see the URLs listed under **contentUrls** in the response as shown below.

```
      "contentUrls": {
        ...
        "previewImageUrls": {
          "small": "XXXX",
          "medium": "XXXX",
          "large": "XXXX"
         }
       },
    
```

## Next steps

[Event-based recording](record-event-based-live-video.md)

