---
title: Audio effects detection  
titleSuffix: Azure Video Analyzer
description: Audio Effects Detection is one of Azure Video Analyzer for Media AI capabilities. It can detects a various of acoustics events and classify them into different acoustic categories (such as Gunshot, Screaming, Crowd Reaction and more).
author: Juliako
manager: femila

ms.service: azure-video-analyzer
ms.subservice: azure-video-analyzer-media
ms.topic: article
ms.date: 05/12/2021
ms.author: juliako
---

#  Audio effects detection (preview)

**Audio Effects Detection** is one of Azure Video Analyzer for Media AI capabilities. It can detects a various of acoustics events and classify them into different acoustic categories (such as Gunshot, Screaming, Crowd Reaction and more).
 
Audio Events Detection can be used in many domains. Two examples are:

* Using Audio Effects Detection is the domain of **Public Safety & Justice**. Audio Effects Detection can detect and classify Gunshots, Explosion and Glass-Shattering. Therefore, it can be implemented in a smart-city system or in other public environments that include cameras and microphones. Offering a fast and accurate detection of violence incidents. 
* In the **Media & Entertainment** domain, companies with a large set of video archives can easily improve their accessibility scenarios, by enhancing their video transcription with non-speech effects to provide more context for people who are hard of hearing.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/audio-effects-detection/audio-effects.jpg" alt-text="Audio Effects image":::
<br/>*Example of the Video Analyzer for Media Audio Effects Detection output*

## Supported audio categories  

**Audio Effect Detection** can detect and classify 8 different categories. In the next table, you can find the different categories split in to the different VI presets, divided to **Standard** and **Advanced**. For more information, see [pricing](https://azure.microsoft.com/pricing/details/media-services/).

|Indexing type |Standard indexing| Advanced indexing|
|---|---|---|
|**Preset Name** |**"Audio Only”** <br/>**“Video + Audio”** |**“Advance Audio”**<br/> **“Advance Video + Audio”**|
|**Appear in insights pane**|| V|
|Crowd Reaction |V| V|
| Silence| V| V|
| Gunshot ||V |
| Breaking glass ||V|
| Alarm ringing|| V |
| Siren Wailing|| V |
| Laughter|| V |
| Dog Barking|| V|

## Result formats

The audio effects are retrieved in the insights JSON that includes the category ID, type, name, and set of instances per category along with their specific timeframe and confidence score.

The `name` parameter will be presented in the language in which the JSON was indexed, while the type will always remain the same.

```json
audioEffects: [{
        id: 0,
        type: "Gunshot",
        name: "Gunshot",
        instances: [{
                confidence: 0.649,
                adjustedStart: "0:00:13.9",
                adjustedEnd: "0:00:14.7",
                start: "0:00:13.9",
                end: "0:00:14.7"
            }, {
                confidence: 0.7706,
                adjustedStart: "0:01:54.3",
                adjustedEnd: "0:01:55",
                start: "0:01:54.3",
                end: "0:01:55"
            }
        ]
    }, {
        id: 1,
        type: "CrowdReactions",
        name: "Crowd Reactions",
        instances: [{
                confidence: 0.6816,
                adjustedStart: "0:00:47.9",
                adjustedEnd: "0:00:52.5",
                start: "0:00:47.9",
                end: "0:00:52.5"
            },
			{
                confidence: 0.7314,
                adjustedStart: "0:04:57.67",
                adjustedEnd: "0:05:01.57",
                start: "0:04:57.67",
                end: "0:05:01.57"
            }
        ]
    }
],
```

## How to index Audio Effects

In order to set the index process to include the detection of Audio Effects, the user should chose one of the Advanced presets under “Video + audio indexing” menu as can be seen below.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/audio-effects-detection/index-audio-effect.png" alt-text="Index Audio Effects image":::

## Closed Caption

When Audio Effects are retrieved in the closed caption files, they will be retrieved in square brackets the following structure:

|Type| Example|
|---|---|
|SRT |00:00:00,000  00:00:03,671<br/>[Gunshot]|
|VTT |00:00:00.000  00:00:03.671<br/>[Gunshot]|
|TTML|Confidence: 0.9047 <br/> <p begin="00:00:00.000" end="00:00:03.671">[Gunshot]</p>|
|TXT |[Gunshot]|
|CSV |0.9047,00:00:00.000,00:00:03.671, [Gunshot]|

Audio Effects in closed captions file will be retrieved with the following logic employed:

* `Silence` event type will not be added to the closed captions
* Maximum duration to show an event I 5 seconds
* Minimum timer duration to show an event is 700 milliseconds

## Adding audio effects in closed caption files

Audio effects can be added to the closed captions files supported by Azure Video Analyzer via the [Get video captions API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Captions) by choosing true in the `includeAudioEffects` parameter or via the video.ai portal experience by selecting **Download** -> **Closed Captions** -> **Include Audio Effects**.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/audio-effects-detection/close-caption.jpg" alt-text="Audio Effects in CC":::

> [!NOTE]
> When using [update transcript](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Transcript) from closed caption files or [update custom language model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Language-Model) from closed caption files, audio effects included in those files will be ignored.

## Limitations and assumptions

* The model works on non-speech segments only.
* The model is currently working for a single category at a time. For example, a crying and speech on the background or gunshot + explosion are not supported for now.
* The model is currently not supporting cases when there is a loud music on background.
* Minimal segment length – 2 seconds.

## Next steps

Review [overview](video-indexer-overview.md)
