---
title: Enable audio effects detection  
description: Audio Effects Detection is one of Azure Video Indexer AI capabilities that detects various acoustics events and classifies them into different acoustic categories (for example, gunshot, screaming, crowd reaction and more).
ms.topic: how-to
ms.date: 01/04/2022
ms.author: juliako
---

# Enable audio effects detection (preview)

**Audio effects detection** is one of Azure Video Indexer AI capabilities that detects various acoustics events and classifies them into different acoustic categories (such as dog barking, crowd reactions, laugher and more).

Some scenarios where this feature is useful:

- Companies with a large set of video archives can easily improve accessibility with audio effects detection. The feature provides more context for persons who are hard of hearing, and enhances video transcription with non-speech effects.
- In the Media & Entertainment domain, the detection feature can improve efficiency when creating raw data for content creators. Important moments in promos and trailers (such as laughter, crowd reactions, gunshot, or explosion) can be identified by using **audio effects detection**.
- In the Public Safety & Justice domain, the feature can detect and classify gunshots, explosions, and glass shattering. It can be implemented in a smart-city system or in other public environments that include cameras and microphones to offer fast and accurate detection of violence incidents. 

## Supported audio categories  

**Audio effect detection** can detect and classify 7 different categories. In the next table, you can find the different categories split in to the different presets, divided to **Standard** and **Advanced**. For more information, see [pricing](https://azure.microsoft.com/pricing/details/media-services/).

|Indexing type |Standard indexing| Advanced indexing|
|---|---|---|
|**Preset Name** |**"Audio Only"** <br/>**"Video + Audio"** |**"Advance Audio"**<br/> **"Advance Video + Audio"**|
|**Appear in insights pane**|| V|
| Crowd Reactions || V|
| Silence| V| V|
| Gunshot or explosion ||V |
| Breaking glass ||V|
| Alarm or siren|| V |
| Laughter|| V |
| Dog barking|| V|

## Result formats

The audio effects are retrieved in the insights JSON that includes the category ID, type, name, and set of instances per category along with their specific timeframe and confidence score.

The `name` parameter will be presented in the language in which the JSON was indexed, while the type will always remain the same.

```json
audioEffects: [{
        id: 0,
        type: "Gunshot or explosion",
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

## How to index audio effects

In order to set the index process to include the detection of audio effects, the user should chose one of the **Advanced** presets under **Video + audio indexing** menu as can be seen below.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/audio-effects-detection/index-audio-effect.png" alt-text="Index Audio Effects image":::

## Closed Caption

When audio effects are retrieved in the closed caption files, they will be retrieved in square brackets the following structure:

|Type| Example|
|---|---|
|SRT |00:00:00,000  00:00:03,671<br/>[Gunshot or explosion]|
|VTT |00:00:00.000  00:00:03.671<br/>[Gunshot or explosion]|
|TTML|Confidence: 0.9047 <br/> `<p begin="00:00:00.000" end="00:00:03.671">[Gunshot or explosion]</p>`|
|TXT |[Gunshot or explosion]|
|CSV |0.9047,00:00:00.000,00:00:03.671, [Gunshot or explosion]|

Audio Effects in closed captions file will be retrieved with the following logic employed:

* `Silence` event type will not be added to the closed captions
* Maximum duration to show an event I 5 seconds
* Minimum timer duration to show an event is 700 milliseconds

## Adding audio effects in closed caption files

Audio effects can be added to the closed captions files supported by Azure Video Indexer via the [Get video captions API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Captions) by choosing true in the `includeAudioEffects` parameter or via the video.ai portal experience by selecting **Download** -> **Closed Captions** -> **Include Audio Effects**.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/audio-effects-detection/close-caption.jpg" alt-text="Audio Effects in CC":::

> [!NOTE]
> When using [update transcript](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Transcript) from closed caption files or [update custom language model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Language-Model) from closed caption files, audio effects included in those files will be ignored.

## Limitations and assumptions

* The audio effects are detected when present in non-speech segments only. 
* The model is optimized for cases where there is no loud background music. 
* Low quality audio may impact the detection results.
* Minimal non-speech section duration is 2 seconds. 
* Music that is characterized with repetitive and/or linearly scanned frequency can be mistakenly classified as Alarm or siren. 
* The model is currently optimized for natural and non-synthetic gunshot and explosions sounds. 
* Door knocks and door slams can sometimes be mistakenly labeled as gunshot and explosions.
* Prolonged shouting and human physical effort sounds can sometimes be mistakenly detected.
* Group of people laughing can sometime be classified as both Laughter and Crowd reactions.

## Next steps

Review [overview](video-indexer-overview.md)
