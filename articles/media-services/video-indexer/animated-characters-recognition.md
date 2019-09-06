---
title: Animated character detection with Video Indexer - Azure
titlesuffix: Azure Media Services
description:  
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 09/05/2019
ms.author: juliako
---

# Animated character detection (preview)

Azure Media Services Video Indexer supports detection, grouping, and recognition of characters in animated content via integration with [Cognitive Services custom vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/). The identified characters are available in the "Animated characters" section in the [Video Indexer](https://vi.microsoft.com/) portal and in the JSON file.

```json
"animatedCharacters": [
    {
    "videoId": "e867214582",
    "confidence": 0,
    "thumbnailId": "cac77a37-1c87-46f8-ac90-45815f76d08d",
    "seenDuration": 201.5,
    "seenDurationRatio": 0.3175,
    "isKnownCharacter": true,
    "id": 4,
    "name": "Bunny",
    "appearances": [
        {
            "startTime": "0:00:52.333",
            "endTime": "0:02:02.6",
            "startSeconds": 52.3,
            "endSeconds": 122.6
        },
        {
            "startTime": "0:02:40.633",
            "endTime": "0:03:16.6",
            "startSeconds": 160.6,
            "endSeconds": 196.6
        },
    ]
    },
]
```

The animation recognition are based on integration with [Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) custom vision, meaning that in the beginning the characters are detected namelessly, and as you add names and train the model it will recognize the characters and names them respectively.
This functionality is available both through the portal and through the API.

## Integration with custom vision

The animation detection is done in an integration with Custom Vision.

•	Trial account: Video Indexer uses an internal Custom Vision account to create model and connect it to your Video Indexer account. 
•	Paid account: you connect your Custom Vision account to your Video Indexer account (if you don’t already have one, you need to create an account first).

### How it works

After uploading an animated video with a specific animation model, Video Indexer extracts keyframes, detects animated characters in these frames, groups similar character, and chooses the best sample. Then, it sends the grouped characters o Custom Vision that identifies characters based on the models it was trained on. 

## Start using

There are a few steps you need to take to start using the Animated Character Detection:
    1.	Paid accounts only: connect your Custom vision account
    2.	Create an animated characters model
    3.	Index a video with an animated model
    4.	Tag characters
    5.	Train the model 

Below are detailed instructions for each of the steps.
