---
title: Track observed people in a video
description: This topic gives an overview of Track observed people in a video concept.
ms.topic: how-to
ms.date: 08/07/2023
ms.author: juliako
---

# Track observed people in a video (preview)

Azure AI Video Indexer detects observed people in videos and provides information such as the location of the person in the video frame and the exact timestamp (start, end) when a person appears. The API returns the bounding box coordinates (in pixels) for each person instance detected, including detection confidence.  
 
Some scenarios where this feature could be useful:

* Post-event analysis—detect and track a person’s movement to better analyze an accident or crime post-event (for example, explosion, bank robbery, incident).  
* Improve efficiency when creating raw data for content creators, like video advertising, news, or sport games (for example, find people wearing a red shirt in a video archive).
* Create a summary out of a long video, like court evidence of a specific person’s appearance in a video, using the same detected person’s ID.
* Learn and analyze trends over time, for example—how customers move across aisles in a shopping mall or how much time they spend in checkout lines.

For example, if a video contains a person, the detect operation will list the person’s appearances together with their coordinates in the video frames. You can use this functionality to determine the person’s path in a video. It also lets you determine whether there are multiple instances of the same person in a video.

The newly added **Observed people tracking** feature is available when indexing your file by choosing the **Advanced option** -> **Advanced video** or **Advanced video + audio** preset (under **Video + audio indexing**). Standard indexing will not include this new advanced model. 

:::image type="content" source="./media/observed-people-tracking/youtube-trailer.png" alt-text="Observed people tracking screenshot":::  
 
When you choose to see **Insights** of your video on the [Video Indexer](https://www.videoindexer.ai/account/login) website, the Observed People Tracking will show up on the page with all detected people thumbnails. You can choose a thumbnail of a person and see where the person appears in the video player. 

The following JSON response illustrates what Video Indexer returns when tracking observed people: 

```json
    {
    ...
    "videos": [
        {
            ...
            "insights": {
                ...
                "observedPeople": [{
                    "id": 1,
                    "thumbnailId": "560f2cfb-90d0-4d6d-93cb-72bd1388e19d",
                    "instances": [
                        {
                            "adjustedStart": "0:00:01.5682333",
                            "adjustedEnd": "0:00:02.7027",
                            "start": "0:00:01.5682333",
                            "end": "0:00:02.7027"
                        }
                    ]
                },
                {
                    "id": 2,
                    "thumbnailId": "9c97ae13-558c-446b-9989-21ac27439da0",
                    "instances": [
                        {
                            "adjustedStart": "0:00:16.7167",
                            "adjustedEnd": "0:00:18.018",
                            "start": "0:00:16.7167",
                            "end": "0:00:18.018"
                        }
                    ]
                },]
            }
            ...
            }
    ]
}
```

## Limitations and assumptions 

For more information, see [Considerations and limitations when choosing a use case](observed-matched-people.md#considerations-and-limitations-when-choosing-a-use-case).

## Next steps

Review [overview](video-indexer-overview.md)
