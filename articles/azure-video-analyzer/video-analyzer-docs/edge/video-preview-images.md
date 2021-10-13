---
title: Enable video preview images
description: This article explains how to enable video preview images when recording to a video sink using Azure Video Analyzer
ms.topic: how-to
ms.date: 11/01/2021

---

# Enable video preview images while recording video

While video is ingested and recording to a video sink node, a set of video preview images of different sizes can be periodically uploaded to an Azure Video Analyzer account's associated storage account.
These images will be one frame from the video resized to 3 different resolutions:

  * 320 x 180 = small
  * 640 x 360 = medium
  * 1280 x 720 = large

The generated preview images preserve the aspect ratio of the source footage resolution, therefore the image resolutions may not match the aforementioned set of resolutions exactly.
Images are only generated and updated while a live pipeline is active and video is being recorded.
If an event-based video recording pipeline is being used, the images will only be generated when there is an event that has triggered recording.
Newly generated images will replace the most recent images in the blob storage.

## Enable video preview images in pipeline topology
To enable video preview images, it must be defined in the video sink node of the pipeline topology.
The video sink node has video publishing options, where the option **enableVideoPreviewImage** can be set to **true**  

Example:
```
        "sinks": [
        {
          "@type": "#Microsoft.VideoAnalyzer.VideoSink",
          "name": "videoSink",
          "videoName": "sample-cvr-video-sink",
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
            "title": "sample-cvr-video-sink",
            "description": "Sample video using CVR video sink",
            "segmentLength": "PT30S"
          },
          "localMediaCachePath": "/var/lib/videoanalyzer/tmp/",
          "localMediaCacheMaximumSizeMiB": "2048"
        }
      ]
``` 

