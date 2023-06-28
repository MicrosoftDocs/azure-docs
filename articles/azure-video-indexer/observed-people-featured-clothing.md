---
title: Enable featured clothing of an observed person
description: When indexing a video using Azure AI Video Indexer advanced video settings, you can view the featured clothing of an observed person. 
ms.topic: how-to
ms.date: 10/10/2022
ms.author: juliako
---

# Enable featured clothing of an observed person (preview)

When indexing a video using Azure AI Video Indexer advanced video settings, you can view the featured clothing of an observed person. The insight provides information of key items worn by individuals within a video and the timestamp in which the clothing appears. This allows high-quality in-video contextual advertising, where relevant clothing ads are matched with the specific time within the video in which they are viewed.

This article discusses how to view the featured clothing insight and how the featured clothing images are ranked.

## View an intro video

You can view the following short video that discusses how to view and use the featured clothing insight.

> [!VIDEO https://www.microsoft.com/videoplayer/embed//RE5b4JJ]

## Viewing featured clothing

The featured clothing insight is available when indexing your file by choosing the Advanced option -> Advanced video or Advanced video + audio preset (under Video + audio indexing). Standard indexing will not include this insight.

:::image type="content" source="./media/detected-clothing/index-video.png" alt-text="This screenshot represents an indexing video option.":::

The featured clothing images are ranked based on some of the following factors: key moments of the video, general emotions from text or audio. The `id` property indicates the ranking index. For example, `"id": 1` signifies the most important featured clothing.

> [!NOTE]
> The featured clothing currently can only be viewed from the artifact file.  

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

    An example of the featured clothing with `"id": 1`.

    ```
    "instances": [
		{
			"confidence": 0.98,
			"faceBoundingBox": {
				"x": 0.50158,
				"y": 0.10508,
				"width": 0.13589,
				"height": 0.45372
			},
			"fileName": "frame_12147.jpg",
			"frameIndex": 12147,
			"id": 1,
			"opBoundingBox": {
				"x": 0.34141,
				"y": 0.16667,
				"width": 0.28125,
				"height": 0.82083
			},
			"timestamp": "00:08:26.6311250"
		},
    ```
- `featuredclothing.frames.map` – this folder contains images of the best frames that the featured clothing appeared in, corresponding to the `fileName` property in each instance in `featuredclothing.map.json`.  

## Limitations and assumptions 

It's important to note the limitations of featured clothing to avoid or mitigate the effects of false detections of images with low quality or low relevancy.  

- Pre-condition for the featured clothing is that the person wearing the clothes can be found in the observed people insight.  
- If the face of a person wearing the featured clothing wasn't detected, the results won't include the faces bounding box.
- If a person in a video wears more than one outfit, the algorithm selects its best outfit as a single featured clothing image. 
- When posed, the tracks are optimized to handle observed people who most often appear on the front. 
- Wrong detections may occur when people are overlapping.  
- Frames containing blurred people are more prone to low quality results.   

For more information, see the [limitations of observed people](observed-people-tracing.md#limitations-and-assumptions). 

## Next steps 

- [Trace observed people in a video](observed-people-tracing.md)
- [People's detected clothing](detected-clothing.md)
