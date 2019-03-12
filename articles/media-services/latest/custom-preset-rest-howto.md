---
title: Encode custom transform using Media Services v3 REST - Azure | Microsoft Docs
description: This topic shows how to use Azure Media Services v3 to encode a custom transform using REST.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 03/11/2019
ms.author: juliako

---

# How to encode with a custom Transform

When encoding with Azure Media Services, you can get started quickly with one of the recommended built-in presets based on industry best practices as demonstrated in the [Streaming files](stream-files-tutorial-with-rest.md#create-a-transform) tutorial. You can also build a custom preset to target your specific scenario or device requirements.

## Prerequisites 

- [Create a Media Services account](create-account-cli-how-to.md). 

    Make sure to remember the resource group name and the Media Services account name. 
- [Configure Postman for Azure Media Services REST API calls](media-rest-apis-with-postman.md).

    Make sure to follow the last step in the topic [Get Azure AD Token](media-rest-apis-with-postman.md#get-azure-ad-token). 

## Considerations

When creating custom presets, the following considerations apply:

* All values for height and width on AVC content must be a multiple of 4.
* In Azure Media Services v3, all of the encoding bit rates are in bits per second. This is different than the REST v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128, but in v3 it would be 128000.

## Define a custom preset

The following **Request body** example defines a custom preset.

```json
{
    "properties": {
        "description": "Basic Transform using a custom encoding preset",
        "outputs": [
            {
                "onError": "StopProcessingJob",
                "relativePriority": "Normal",
                "preset": {
                    "@odata.type": "#Microsoft.Media.StandardEncoderPreset",
                    "codecs": [
				        {
				            "@odata.type": "#Microsoft.Media.AacAudio",
				            "channels": 2,
				            "samplingRate": 48000,
				            "bitrate": 128000,
				            "profile": "AacLc"
				        },
				        {
				            "@odata.type": "#Microsoft.Media.H264Video",
				            "keyFrameInterval": "PT2S",
				            "stretchMode": "AutoSize",
				            "sceneChangeDetection": false,
				            "complexity": "Balanced",
				            "layers": [
				                {
				                    "width": "1280",
				                    "height": "720",
				                    "label": "HD",
				                    "bitrate": 1000000,
				                    "maxBitrate": 1000000,
				                    "bFrames": 3,
				                    "slices": 0,
				                    "adaptiveBFrame": true,
				                    "profile": "Auto",
				                    "level": "auto",
				                    "bufferWindow": "PT5S",
				                    "referenceFrames": 3,
				                    "entropyMode": "Cabac"
				                },
				                {
				                    "width": "640",
				                    "height": "360",
				                    "label": "SD",
				                    "bitrate": 600000,
				                    "maxBitrate": 600000,
				                    "bFrames": 3,
				                    "slices": 0,
				                    "adaptiveBFrame": true,
				                    "profile": "Auto",
				                    "level": "auto",
				                    "bufferWindow": "PT5S",
				                    "referenceFrames": 3,
				                    "entropyMode": "Cabac"
				                }
				            ]
				        },
				        {
				            "@odata.type": "#Microsoft.Media.PngImage",
				            "stretchMode": "AutoSize",
				            "start": "25%",
				            "step": "25%",
				            "range": "80%",
				            "layers": [
				                {
				                    "width": "50%",
				                    "height": "50%"
				                }
				            ]
				        }
				    ],
				    "formats": [
				        {
				            "@odata.type": "#Microsoft.Media.Mp4Format",
				            "filenamePattern": "Video-{Basename}-{Label}-{Bitrate}{Extension}",
				            "outputFiles": []
				        },
				        {
				            "@odata.type": "#Microsoft.Media.PngFormat",
				            "filenamePattern": "Thumbnail-{Basename}-{Index}{Extension}"
				        }
				    ]
                }
            }
        ]
    }
}
```

## Create a transform with the custom preset 

You create a [Transform](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing your videos. In this example, we create a **Transform** that is based on the custom preset we defined earlier. When creating a Transform, you should first use the [Get](https://docs.microsoft.com/rest/api/media/transforms/get) operation to check if one already exists. 

In the Postman's collection that you downloaded, select **Transforms and Jobs**->**Create or Update Transform**.

The **PUT** HTTP request method is similar to:

```
PUT https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/transforms/:transformName?api-version={{api-version}}
```

Select the **Body** tab and replace the body with the json code you [defined earlier](#define-a-custom-preset).

Select **Send**. 

If the Transform has been successfully created, you can submit a job under the transform. The job is the request to Media Services to apply the transform to the given video. For a complete example that shows how to submit a job under a transform, see [Tutorial: Stream video files - REST](stream-files-tutorial-with-rest.md).

## Next steps

See [other REST operations](https://docs.microsoft.com/rest/api/media/)
