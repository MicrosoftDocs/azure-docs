---
title: Subclip a video when encoding with Azure Media Services REST API
description: This topic describes how to subclip a video when encoding with Azure Media Services using REST
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 06/10/2019
ms.author: juliako

---
# Subclip a video when encoding with Media Services - REST

You can trim or subclip a video when encoding it using a [Job](https://docs.microsoft.com/rest/api/media/jobs). This functionality works with any [Transform](https://docs.microsoft.com/rest/api/media/transforms) that is built using either the [BuiltInStandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#builtinstandardencoderpreset) presets, or the [StandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#standardencoderpreset) presets. 

The REST example in this topic creates a job that trims a video as it submits an encoding job. 

## Prerequisites

To complete the steps described in this topic, you have to:

- [Create an Azure Media Services account](create-account-cli-how-to.md).
- [Configure Postman for Azure Media Services REST API calls](media-rest-apis-with-postman.md).
    
    Make sure to follow the last step in the topic [Get Azure AD Token](media-rest-apis-with-postman.md#get-azure-ad-token). 
- Create a Transform and an output Assets. You can see how to create a Transform and an output Assets in the [Encode a remote file based on URL and stream the video - REST](stream-files-tutorial-with-rest.md) tutorial.
- Review the [Encoding concept](encoding-concept.md) topic.

## Create a subclipping job

1. In the Postman collection that you downloaded, select **Transforms and jobs** -> **Create Job with Sub Clipping**.
    
    The **PUT** request looks like this:
    
    ```
    https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/transforms/:transformName/jobs/:jobName?api-version={{api-version}}
    ```
1. Update the value of "transformName" environment variable with your transform name. 
1. Select the **Body** tab and update the "myOutputAsset" with your output Asset name.

    ```
    {
      "properties": {
        "description": "A Job with transform cb9599fb-03b3-40eb-a2ff-7ea909f53735 and single clip.",
       
        "input": {
          "@odata.type": "#Microsoft.Media.JobInputHttp",
          "baseUri": "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/",
          "files": [
          		"Ignite-short.mp4"
          	],
          "start": {
            "@odata.type": "#Microsoft.Media.AbsoluteClipTime",
            "time": "PT10S"
          },
          "end": {
            "@odata.type": "#Microsoft.Media.AbsoluteClipTime",
            "time": "PT40S"
          }
        },
      
        "outputs": [
          {
            "@odata.type": "#Microsoft.Media.JobOutputAsset",
            "assetName": "myOutputAsset"
          }
        ],
        "priority": "Normal"
      }
    }
    ```
1. Press **Send**.

    You see the **Response** with the info about a job that was created and submitted and the job's status. 

## Next steps

[How to encode with a custom transform](custom-preset-rest-howto.md) 
