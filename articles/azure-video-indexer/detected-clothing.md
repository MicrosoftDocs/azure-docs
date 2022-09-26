---
title: Enable detected clothing feature
description: Azure Video Indexer detects clothing associated with the person wearing it in the video and provides information such as the type of clothing detected and the timestamp of the appearance (start, end). The API returns the detection confidence level.
ms.topic: how-to
ms.date: 11/15/2021
ms.author: juliako
---

# Enable detected clothing feature (preview)

Azure Video Indexer detects clothing associated with the person wearing it in the video and provides information such as the type of clothing detected and the timestamp of the appearance (start, end). The API returns the detection confidence level.
 
Two examples where this feature could be useful:
 
* Improve efficiency when creating raw data for content creators, like video advertising, news, or sport games (for example, find people wearing a red shirt in a video archive).
* Post-event analysis—detect and track a person’s movement to better analyze an accident or crime post-event (for example, explosion, bank robbery, incident).
 
The newly added clothing detection feature is available when indexing your file by choosing the **Advanced option** -> **Advanced video** or **Advanced video + audio** preset (under Video + audio indexing). Standard indexing will not include this new advanced model.
 
:::image type="content" source="./media/detected-clothing/index-video.png" alt-text="This screenshot represents an indexing video option":::  

When you choose to see **Insights** of your video on the [Azure Video Indexer](https://www.videoindexer.ai/) website, the People's detected clothing could be viewed from the **Observed People** tracing insight. When choosing a thumbnail of a person the detected clothing became available.

:::image type="content" source="./media/detected-clothing/observed-people.png" alt-text="Observed people screenshot":::  
 
If you are interested to view People's detected clothing in the Timeline of your video on the Azure Video Indexer website, go to **View** -> **Show Insights** and select the **All** option or **View** -> **Custom View** and select **Observed People**. 

:::image type="content" source="./media/detected-clothing/observed-person.png" alt-text="Observed person screenshot":::  
 
Searching for a specific clothing to return all the observed people wearing it is enabled using the search bar of either the **Insights** or from the **Timeline** of your video on the Azure Video Indexer website .

The following JSON response illustrates what Azure Video Indexer returns when tracing observed people having detected clothing associated:

```json
"observedPeople": [
    {
        "id": 1,
        "thumbnailId": "68bab0f2-f084-4c2b-859b-a951ed03c209",
        "clothing": [
            {
                "id": 1,
                "type": "sleeve",
                "properties": {
                    "length": "short"
                }
            },
            {
                "id": 2,
                "type": "pants",
                "properties": {
                    "length": "long"
                }
            }
        ],
        "instances": [
            {
                "adjustedStart": "0:00:05.5055",
                "adjustedEnd": "0:00:09.9766333",
                "start": "0:00:05.5055",
                "end": "0:00:09.9766333"
            }
        ]
    },
    {
        "id": 2,
        "thumbnailId": "449bf52d-06bf-43ab-9f6b-e438cde4f217",
        "clothing": [
            {
                "id": 1,
                "type": "sleeve",
                "properties": {
                    "length": "short"
                }
            },
            {
                "id": 2,
                "type": "pants",
                "properties": {
                    "length": "long"
                }
            }
        ],
        "instances": [
            {
                "adjustedStart": "0:00:07.2072",
                "adjustedEnd": "0:00:10.5105",
                "start": "0:00:07.2072",
                "end": "0:00:10.5105"
            }
        ]
    },
]
```

## Limitations and assumptions

It's important to note the limitations of Detected clothing, to avoid or mitigate the effects of false negatives (missed detections).
 
* To optimize the detector results, use video footage from static cameras (although a moving camera or mixed scenes will also give results).
* People are not detected if they appear small (minimum person height is 200 pixels).
* Maximum frame size is HD
* People are not detected if they're not standing or walking.
* Low-quality video (for example, dark lighting conditions) may impact the detection results.
* The recommended frame rate at least 30 FPS.
* Recommended video input should contain up to 10 people in a single frame. The feature could work with more people in a single frame, but the detection result retrieves up to 10 people in a frame with the detection highest confidence.
* People with similar clothes (for example, people wear uniforms, players in sport games) could be detected as the same person with the same ID number.
* Obstructions – there maybe errors where there are obstructions (scene/self or obstructions by other people).
* Pose: The tracks may be split due to different poses (back/front)

## Next steps 

[Trace observed people in a video](observed-people-tracing.md)
