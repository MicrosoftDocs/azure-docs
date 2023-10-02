---
title: Enable featured clothing of an observed person
description: When indexing a video using Azure AI Video Indexer advanced video settings, you can view the featured clothing of an observed person. 
ms.topic: how-to
ms.date: 08/14/2023
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Enable featured clothing of an observed person

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

When indexing a video using Azure AI Video Indexer advanced video settings, you can view the featured clothing of an observed person. The insight provides moments within the video where key people are prominently featured and clearly visible, including the coordinates of the people, timestamp, and the frame of the shot. This insight allows high-quality in-video contextual advertising, where relevant clothing ads are matched with the specific time within the video in which they're viewed.

This article discusses how to view the featured clothing insight and how the featured clothing images are ranked.

## View an intro video

You can view the following short video that discusses how to view and use the featured clothing insight.

> [!VIDEO https://www.microsoft.com/videoplayer/embed//RE5b4JJ]

## Viewing featured clothing

The featured clothing insight is available when indexing your file by choosing the Advanced option -> Advanced video or Advanced video + audio preset (under Video + audio indexing). Standard indexing doesn't include this insight.

:::image type="content" source="./media/detected-clothing/index-video.png" alt-text="This screenshot represents an indexing video option.":::

The featured clothing images are ranked based on some of the following factors: key moments of the video, duration the person appears, text-based emotions, and audio events. The insights privates the highest ranking frame per scene, which enables you to produce contextual advertisements per scene throughout the video. The JSON file is ranked by the sequence of scenes in the video, with each scene having the top rated frame as the result.

> [!NOTE]
> The featured clothing insight can only be viewed from the artifact file, and the insight is not in the Azure AI Video Indexer website. 

1. In the right-upper corner, select to download the artifact zip file: **Download** -> **Artifact (ZIP)**
1. Open `featuredclothing.zip`. 

The .zip file contains two objects: 

- `featuredclothing.map.json` - the file contains instances of each featured clothing, with the following properties:  

    - `id` – ranking index (`"id": 1` is the most important clothing).  
    - `confidence` – the score of the featured clothing.  
    - `frameIndex` – the best frame of the clothing.  
    - `timestamp` – corresponding to the frameIndex.  
    - `opBoundingBox` – bounding box of the person.  
    - `faceBoundingBox` – bounding box of the person's face, if detected.  
    - `fileName` – where the best frame of the clothing is saved.
    - `sceneID` - the scene where the scene appears.

    An example of the featured clothing with `"sceneID": 1`.

    ```json
    "instances": [
		{
        		"confidence": 0.07,
    			"faceBoundingBox": {},
    			"fileName": "frame_100.jpg",
        		"frameIndex": 100,
        		"opBoundingBox": {
            			"x": 0.09062,
            			"y": 0.4,
    				"width": 0.11302,
            			"height": 0.59722
    				},
       			 "timestamp": "0:00:04",
        		"personName": "Observed Person #1",
        		"sceneId": 1
		}
    ```
- `featuredclothing.frames.map` – this folder contains images of the best frames that the featured clothing appeared in, corresponding to the `fileName` property in each instance in `featuredclothing.map.json`.  

## Limitations and assumptions 

It's important to note the limitations of featured clothing to avoid or mitigate the effects of false detections of images with low quality or low relevancy.  

- Precondition for the featured clothing is that the person wearing the clothes can be found in the observed people insight.  
- If the face of a person wearing the featured clothing isn't detected, the results don't include the faces bounding box.
- If a person in a video wears more than one outfit, the algorithm selects its best outfit as a single featured clothing image. 
- When posed, the tracks are optimized to handle observed people who most often appear on the front. 
- Wrong detections may occur when people are overlapping.  
- Frames containing blurred people are more prone to low quality results.   

For more information, see the [limitations of observed people](observed-people-tracing.md#limitations-and-assumptions). 

## Next steps 

- [Trace observed people in a video](observed-people-tracing.md)
- [People's detected clothing](detected-clothing.md)
