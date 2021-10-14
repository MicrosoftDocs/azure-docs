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
Newly generated images will replace the most recent images in the blob storage container.

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

## Access images in storage account
In the storage account associated with your Video Analyzer,
1. Navigate to **Containers**
1. Select the container titled with the asset associated with the video sink. <!-- how can container name be linked to specific video?? -->
1. Select the **images** folder
1. Select the **latest** folder.

The files, **small.jpg**, **medium.jpg**, and **large.jpg**, representing the 3 different dimensions can be accessed and downloaded.  

> [!div class="mx-imgBorder"]
> :::image type="content" source="./edge/media/video-preview-images/images-sizes-storage-account.png" alt-text="Three different image sizes":::

To view the timestamp at which the images were generated, select one of the images and the value for **timestamp** will be listed under **Metadata**.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./edge/media/video-preview-images/image-timestamp.png" alt-text="Image timestamp":::



