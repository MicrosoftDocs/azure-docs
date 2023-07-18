---
title: Enable the matched person insight
description: The topic explains how to use a match observed people feature. These are people that are detected in the video with the corresponding faces ("People" insight).
ms.topic: how-to
ms.date: 12/10/2021
ms.author: juliako
---

# Enable the matched person insight (preview)

[!INCLUDE [Gate notice](./includes/face-limited-access.md)]

Azure AI Video Indexer matches observed people that were detected in the video with the corresponding faces ("People" insight). To produce the matching algorithm, the bounding boxes for both the faces and the observed people are assigned spatially along the video. The API returns the confidence level of each matching.

The following are some scenarios that benefit from this feature:
 
* Improve efficiency when creating raw data for content creators, like video advertising, news, or sport games (for example, find all appearances of a specific person in a video archive).
* Post-event analysis—detect and track specific person’s movement to better analyze an accident or crime post-event (for example, explosion, bank robbery, incident).
* Create a summary out of a long video, to include the parts where the specific person appears. 
 
The **Matched person** feature is available when indexing your file by choosing the
**Advanced** -> **Video + audio indexing** preset. 

> [!NOTE]
> Standard indexing does not include this advanced model.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/matched-person/index-matched-person-feature.png" alt-text="Advanced video or Advanced video + audio preset":::

To view the Matched person on the [Azure AI Video Indexer](https://www.videoindexer.ai/) website, go to **View** -> **Show Insights** -> select the **All** option or **View** -> **Custom View** -> **Mapped Faces**. 

When you choose to see insights of your video on the [Azure AI Video Indexer](https://www.videoindexer.ai/) website, the matched person could be viewed from the **Observed People tracing** insight. When choosing a thumbnail of a person the matched person became available.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/matched-person/from-observed-people.png" alt-text="View matched people from the Observed People insight":::

If you would like to view people's detected clothing in the **Timeline** of your video on the [Video Indexer website](https://www.videoindexer.ai/), go to **View** -> **Show Insights** and select the **All option** or **View** -> **Custom View** -> **Observed People**. 

Searching for a specific person by name, returning all the appearances of the specific person is enables using the search bar of the Insights of your video on the Azure AI Video Indexer. 

## JSON code sample

The following JSON response illustrates what Azure AI Video Indexer returns when tracing observed people having Mapped person associated: 

```json
"observedPeople": [
    {
        "id": 1,
        "thumbnailId": "d09ad62e-e0a4-42e5-8ca9-9a640c686596",
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
                    "length": "short"
                }
            }
        ],
        "matchingFace": {
            "id": 1310,
            "confidence": 0.3819
        },
        "instances": [
            {
                "adjustedStart": "0:00:34.8681666",
                "adjustedEnd": "0:00:36.0026333",
                "start": "0:00:34.8681666",
                "end": "0:00:36.0026333"
            },
            {
                "adjustedStart": "0:00:36.6699666",
                "adjustedEnd": "0:00:36.7367",
                "start": "0:00:36.6699666",
                "end": "0:00:36.7367"
            },
            {
                "adjustedStart": "0:00:37.2038333",
                "adjustedEnd": "0:00:39.6729666",
                "start": "0:00:37.2038333",
                "end": "0:00:39.6729666"
            }
        ]
    }
]
```

## Limitations and assumptions

It's important to note the limitations of Mapped person, to avoid or mitigate the effects of miss matches between people or people who have no matches.
 
**Precondition** for the matching is that the person that showing in the observed faces was detected and can be found in the People insight.  
**Pose**: The tracks are optimized to handle observed people who most often appear on the front.  
**Obstructions**: There is no match between faces and observed people where there are obstruction (people or faces overlapping each other).  
**Spatial allocation per frame**: There is no match where different people appear in the same spatial position relatively to the frame in a short time.

See the limitations of Observed people: [Trace observed people in a video](observed-people-tracing.md)

## Next steps

[Overview](video-indexer-overview.md)
