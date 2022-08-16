---
title: People's featured clothing
description: This article gives an overview of a featured clothing images appearing in a video.
ms.topic: conceptual
ms.date: 11/15/2021
ms.author: juliako
---

# People's featured clothing (preview)

Azure Video Indexer enables capturing featured clothing images appearing in a video. The featured clothing images are ranked according to the importance of the person wearing the clothing, key moments of the video, general emotions from text or audio and other features.  

## Common scenarios

The following are some scenarios that benefit from this feature: 

- Ads placement - based on the detected clothing, customer can inject contextual ads that are similar to the clothing detected.  
- Video summarization - customers can create a summary of the most interesting outfits appearing in the video. 

## Viewing featured clothing

This model is included as part of the advanced video/audio preset. 

> [!NOTE]
> The featured clothing currently can be viewed only from the artifact file.  

1. In the right-upper corner, select to download the artifact zip file: **Download** -> **Artifact (ZIP)**
1. Open `featuredclothing.zip`. 

The results contain two objects: 

- `featuredclothing.map.json` - the file contains the instances of each featured clothing, with the following fields:  

    - id – ranking index (`id=1` is the most important clothing).  
    - confidence – the score of the featured clothing.  
    - frameIndex – the best frame of the clothing.  
    - timestamp – corresponding to the frameIndex.  
    - opBoundingBox – bounding box of the person.  
    - faceBoundingBox – bounding box of the person's face, if detected.  
    - fileName – where the best frame of the clothing is saved.  
- `featuredclothing.frames.map` – this folder contains images of the best frames that the featured clothing appeared in, corresponding to the field fileName in each instance in `featuredclothing.map.json`.  

## Limitations and assumptions 

It's important to note the limitations of featured clothing to avoid or mitigate the effects of false detections of images with low quality or low relevancy.  

- Pre-condition for the featured clothing is that the person wearing the clothes can be found in the observed people insight.  
- In case the face of the person wearing the featured clothing wasn't detected, the results won't include the faces bounding box.
- In case that a person wears more than one outfit along the video, the algorithm selects its best outfit as a single featured clothing image. 
- When posed, the tracks are optimized to handle observed people who most often appear on the front. 
- Wrong detections may occur when people are overlapping.  
- If a video contains blurriness: frames containing blurred people are more prone to low quality results.   

For more information, see the [limitations of observed people](observed-people-tracing.md#limitations-and-assumptions). 

## Next steps 

[Trace observed people in a video](observed-people-tracing.md)
