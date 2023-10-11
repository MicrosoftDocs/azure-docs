---
title: Enable detected clothing feature
description: Azure AI Video Indexer detects clothing associated with the person wearing it in the video and provides information such as the type of clothing detected and the timestamp of the appearance (start, end). The API returns the detection confidence level.
ms.topic: how-to
ms.date: 08/07/2023
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Enable detected clothing feature

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Azure AI Video Indexer detects clothing associated with the person wearing it in the video and provides information such as the type of clothing detected and the timestamp of the appearance (start, end). The API returns the detection confidence level. The clothing types that are detected are long pants, short pants, long sleeves, short sleeves, and skirt or dress.
 
Two examples where this feature could be useful:
 
- Improve efficiency when creating raw data for content creators, like video advertising, news, or sport games (for example, find people wearing a red shirt in a video archive).
- Post-event analysis—detect and track a person’s movement to better analyze an accident or crime post-event (for example, explosion, bank robbery, incident).
 
The newly added clothing detection feature is available when indexing your file by choosing the **Advanced option** -> **Advanced video** or **Advanced video + audio** preset (under Video + audio indexing). Standard indexing won't include this new advanced model.
 
:::image type="content" source="./media/detected-clothing/index-video.png" alt-text="This screenshot represents an indexing video option":::  

When you choose to see **Insights** of your video on the [Azure AI Video Indexer](https://www.videoindexer.ai/) website, the People's detected clothing could be viewed from the **Observed People** tracking insight. When choosing a thumbnail of a person the detected clothing became available.

:::image type="content" source="./media/detected-clothing/observed-people.png" alt-text="Observed people screenshot":::  
 
If you're interested to view People's detected clothing in the Timeline of your video on the Azure AI Video Indexer website, go to **View** -> **Show Insights** and select the All option, or **View** -> **Custom View** and select **Observed People**. 

:::image type="content" source="./media/detected-clothing/observed-person.png" alt-text="Observed person screenshot":::  
 
Searching for a specific clothing to return all the observed people wearing it's enabled using the search bar of either the **Insights** or from the **Timeline** of your video on the Azure AI Video Indexer website.

The following JSON response illustrates what Azure AI Video Indexer returns when tracking observed people having detected clothing associated:

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

As the detected clothing feature uses observed people tracking, the tracking quality is important. For tracking considerations and limitations, see [Considerations and limitations when choosing a use case](observed-matched-people.md#considerations-and-limitations-when-choosing-a-use-case).

- As clothing detection is dependent on the visibility of the person’s body, the accuracy is higher if a person is fully visible.
- There maybe errors when a person is without clothing.
- In this scenario or others of poor visibility, results may be given such as long pants and skirt or dress. 

## Next steps 

[Track observed people in a video](observed-people-tracking.md)
