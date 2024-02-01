---
title: Run Spatial Analysis on a local video file
titleSuffix: Azure AI services
description: Use this guide to learn how to run Spatial Analysis on a recorded local video.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 06/28/2022
ms.author: pafarley
---

# Run Spatial Analysis on a local video file

You can use Spatial Analysis with either recorded or live video. Use this guide to learn how to run Spatial Analysis on a recorded local video.

## Prerequisites

* Set up a Spatial Analysis container by following the steps in [Set up the host machine and run the container](spatial-analysis-container.md).

## Analyze a video file

To use Spatial Analysis for recorded video, record a video file and save it as a .mp4 file. Then take the following steps:

1. Create a blob storage account in Azure, or use an existing one. Then update the following blob storage settings in the Azure portal:
    1. Change **Secure transfer required** to **Disabled**
    1. Change **Allow Blob public access** to **Enabled**

1. Navigate to the **Container** section, and either create a new container or use an existing one. Then upload the video file to the container. Expand the file settings for the uploaded file, and select **Generate SAS**. Be sure to set the **Expiry Date** long enough to cover the testing period. Set **Allowed Protocols** to *HTTP* (*HTTPS* is not supported).

1. Select on **Generate SAS Token and URL** and copy the Blob SAS URL. Replace the starting `https` with `http` and test the URL in a browser that supports video playback.

1. Replace `VIDEO_URL` in the deployment manifest for your [Azure Stack Edge device](https://go.microsoft.com/fwlink/?linkid=2142179), [desktop machine](https://go.microsoft.com/fwlink/?linkid=2152270), or [Azure VM with GPU](https://go.microsoft.com/fwlink/?linkid=2152189) with the URL you created, for all of the graphs. Set `VIDEO_IS_LIVE` to `false`, and redeploy the Spatial Analysis container with the updated manifest. See the example below.

The Spatial Analysis module will start consuming video file and will continuously auto replay as well.


```json
"zonecrossing": {
    "operationId" : "cognitiveservices.vision.spatialanalysis-personcrossingpolygon",
    "version": 1,
    "enabled": true,
    "parameters": {
        "VIDEO_URL": "Replace http url here",
        "VIDEO_SOURCE_ID": "personcountgraph",
        "VIDEO_IS_LIVE": false,
      "VIDEO_DECODE_GPU_INDEX": 0,
        "DETECTOR_NODE_CONFIG": "{ \"gpu_index\": 0, \"do_calibration\": true }",
        "SPACEANALYTICS_CONFIG": "{\"zones\":[{\"name\":\"queue\",\"polygon\":[[0.3,0.3],[0.3,0.9],[0.6,0.9],[0.6,0.3],[0.3,0.3]], \"events\": [{\"type\": \"zonecrossing\", \"config\": {\"threshold\": 16.0, \"focus\": \"footprint\"}}]}]}"
    }
   },

```

## Next steps

* [Deploy a People Counting web application](spatial-analysis-web-app.md)
* [Configure Spatial Analysis operations](spatial-analysis-operations.md)
* [Logging and troubleshooting](spatial-analysis-logging.md)
* [Camera placement guide](spatial-analysis-camera-placement.md)
* [Zone and line placement guide](spatial-analysis-zone-line-placement.md)
