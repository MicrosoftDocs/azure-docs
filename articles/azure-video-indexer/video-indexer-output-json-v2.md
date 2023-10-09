---
title: Examine the Azure AI Video Indexer output
description: This article examines the Azure AI Video Indexer output produced by the Get Video Index API.
ms.topic: article
ms.date: 08/02/2023
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Examine the Azure AI Video Indexer output

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

When a video is indexed, Azure AI Video Indexer produces the JSON content that contains details of the specified video insights. The insights include transcripts, optical character recognition elements (OCRs), faces, topics, and similar details. Each insight type includes instances of time ranges that show when the insight appears in the video. 

For information, see [Azure AI Video Indexer insights](insights-overview.md).

## Root elements of the insights

| Name | Description |
|--|--|
| `accountId` | The playlist's VI account ID. |
| `id` | The playlist's ID. |
| `name` | The playlist's name. |
| `description` | The playlist's description. |
| `userName` | The name of the user who created the playlist. |
| `created` | The playlist's creation time. |
| `privacyMode` | The playlist's privacy mode (`Private` or `Public`). |
| `state` | The playlist's state (`Uploaded`, `Processing`, `Processed`, `Failed`, or `Quarantined`). |
| `isOwned` | Indicates whether the current user created the playlist. |
| `isEditable` | Indicates whether the current user is authorized to edit the playlist. |
| `isBase` | Indicates whether the playlist is a base playlist (a video) or a playlist made of other videos (derived). |
| `durationInSeconds` | The total duration of the playlist. |
| `summarizedInsights` | The produced JSON output contains `Insights` and `SummarizedInsights` elements. We recommend using `Insights` and not using `SummarizedInsights` (which is present for backward compatibility). |
| `videos` | A list of [videos](#videos) that construct the playlist.<br/>If this playlist is constructed of time ranges of other videos (derived), the videos in this list contain only data from the included time ranges. |

```json
{
  ...
  "accountId": "00000000-0000-0000-0000-000000000000",
  "id": "abc3454321",
  "name": "My first video",
  "description": "I am trying VI",
  "userName": "Some name",
  "created": "2018/2/2 18:00:00.000",
  "privacyMode": "Private",
  "state": "Processed",
  "isOwned": true,
  "isEditable": false,
  "isBase": false,
  "durationInSeconds": 120, 
  "summarizedInsights" : null,
  "videos": [{ . . . }]
}
```

> [!TIP]
> The produced JSON output contains `Insights` and `SummarizedInsights` elements. We highly recommend using `Insights` and not using `SummarizedInsights` (which is present for backward compatibility).


## Summary of the insights

This section shows a summary of the insights.


| Attribute | Description |
|--|--|
| `name` | The name of the video. For example: `Azure Monitor`. |
| `id` | The ID of the video. For example: `63c6d532ff`. |
| `privacyMode` | Your breakdown can have one of the following modes: A `Public` video is visible to everyone in your account and anyone who has a link to the video. A `Private` video is visible to everyone in your account. |
| `duration` | The time when an insight occurred, in seconds. |
| `thumbnailVideoId` | The ID of the video from which the thumbnail was taken. |
| `thumbnailId` | The video's thumbnail ID. To get the actual thumbnail, call [Get-Thumbnail](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Thumbnail) and pass it `thumbnailVideoId` and `thumbnailId`. |
| `faces` | Contains zero or more faces. For more information, see [faces](#faces). |
| `keywords` | Contains zero or more keywords. For more information, see [keywords](#keywords). |
| `sentiments` | Contains zero or more sentiments. For more information, see [sentiments](#sentiments). |
| `audioEffects` | Contains zero or more audio effects. For more information, see [audioEffects](#audioeffects-preview). |
| `labels` | Contains zero or more labels. For more information, see [labels](#labels). |
| `brands` | Contains zero or more brands. For more information, see [brands](#brands). |
| `statistics` | For more information, see [statistics](#statistics). |
| `emotions` | Contains zero or more emotions. For more information, see [emotions](#emotions). |
| `topics` | Contains zero or more topics. For more information, see [topics](#topics). |

## videos

| Name | Description |
|--|--|
| `accountId` | The video's VI account ID. |
| `id` | The video's ID. |
| `name` | The video's name. |
| `state` | The video's state (`Uploaded`, `Processing`, `Processed`, `Failed`, or `Quarantined`). |
| `processingProgress` | The progress during processing. For example: `20%`. |
| `failureCode` | The failure code if the video failed to process. For example: `UnsupportedFileType`. |
| `failureMessage` | The failure message if the video failed to process. |
| `externalId` | The video's external ID (if the user specifies one). |
| `externalUrl` | The video's external URL (if the user specifies one). |
| `metadata` | The video's external metadata (if the user specifies one). |
| `isAdult` | Indicates whether the video was manually reviewed and identified as an adult video. |
| `insights` | The insights object. For more information, see [insights](#insights). |
| `thumbnailId` | The video's thumbnail ID. To get the actual thumbnail, call [Get-Thumbnail](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Thumbnail) and pass it the video ID and thumbnail ID. |
| `publishedUrl` | A URL to stream the video. |
| `publishedUrlProxy` | A URL to stream the video on Apple devices. |
| `viewToken` | A short-lived view token for streaming the video. |
| `sourceLanguage` | The video's source language. |
| `language` | The video's actual language (translation). |
| `indexingPreset` | The preset used to index the video. |
| `streamingPreset` | The preset used to publish the video. |
| `linguisticModelId` | The transcript customization (CRIS) model used to transcribe the video. |
| `statistics` | For more information, see [statistics](#statistics). |

```json
{
    "videos": [{
        "accountId": "2cbbed36-1972-4506-9bc7-55367912df2d",
        "id": "142a356aa6",
        "state": "Processed",
        "privacyMode": "Private",
        "processingProgress": "100%",
        "failureCode": "General",
        "failureMessage": "",
        "externalId": null,
        "externalUrl": null,
        "metadata": null,
        "insights": {. . . },
        "thumbnailId": "89d7192c-1dab-4377-9872-473eac723845",
        "publishedUrl": "https://videvmediaservices.streaming.mediaservices.windows.net:443/d88a652d-334b-4a66-a294-3826402100cd/Xamarine.ism/manifest",
        "publishedProxyUrl": null,
        "viewToken": "Bearer=<token>",
        "sourceLanguage": "En-US",
        "language": "En-US",
        "indexingPreset": "Default",
        "linguisticModelId": "00000000-0000-0000-0000-000000000000"
    }],
}
```
### insights

Each insight (for example, transcript lines, faces, or brands) contains a list of unique elements (for example, `face1`, `face2`, `face3`). Each element has its own metadata and a list of its instances, which are time ranges with additional metadata.

A face might have an ID, a name, a thumbnail, other metadata, and a list of its temporal instances (for example, `00:00:05 – 00:00:10`, `00:01:00 - 00:02:30`, and `00:41:21 – 00:41:49`). Each temporal instance can have additional metadata. For example, the metadata can include the face's rectangle coordinates (`20,230,60,60`).

| Version | The code version |
|--|--|
| `sourceLanguage` | The video's source language (assuming one master language), in the form of a [BCP-47](https://tools.ietf.org/html/bcp47) string. |
| `language` | The insights language (translated from the source language), in the form of a [BCP-47](https://tools.ietf.org/html/bcp47) string. |
| `transcript` | The [transcript](#transcript) insight. |
| `ocr` | The [OCR](#ocr) insight. |
| `keywords` | The [keywords](#keywords) insight. |
| `transcripts` | Might contain one or more [transcript](#transcript). |
| `faces` | The [faces](#faces) insight. |
| `labels` | The [labels](#labels) insight. |
| `shots` | The [shots](#shots) insight. |
| `brands` | The [brands](#brands) insight. |
| `audioEffects` | The [audioEffects](#audioeffects-preview) insight. |
| `sentiments` | The [sentiments](#sentiments) insight. |
| `visualContentModeration` | The [visualContentModeration](#visualcontentmoderation) insight. |
| `textualContentModeration` | The [textualContentModeration](#textualcontentmoderation) insight. |
| `emotions` | The [emotions](#emotions) insight. |
| `topics` | The [topics](#topics) insight. |
| `speakers` | The [speakers](#speakers) insight. |

Example:

```json
{
  "version": "0.9.0.0",
  "sourceLanguage": "en-US",
  "language": "es-ES",
  "transcript": ...,
  "ocr": ...,
  "keywords": ...,
  "faces": ...,
  "labels": ...,
  "shots": ...,
  "brands": ...,
  "audioEffects": ...,
  "sentiments": ...,
  "visualContentModeration": ...,
  "textualContentModeration": ...
}
```

#### transcript

| Name | Description |
|--|--|
| `id` | The line ID. |
| `text` | The transcript itself. |
| `confidence` | The confidence level for transcript accuracy. |
| `speakerId` | The ID of the speaker. |
| `language` | The transcript language. It's intended to support transcripts where each line can have a different language. |
| `instances` | A list of time ranges where this line appeared. If the instance is in a transcript, it has only one instance. |

Example:

```json
"transcript":[
{
  "id":1,
  "text":"Well, good morning everyone and welcome to",
  "confidence":0.8839,
  "speakerId":1,
  "language":"en-US",
  "instances":[
     {
    "adjustedStart":"0:00:10.21",
    "adjustedEnd":"0:00:12.81",
    "start":"0:00:10.21",
    "end":"0:00:12.81"
     }
  ]
},
{
  "id":2,
  "text":"ignite 2016. Your mission at Microsoft is to empower every",
  "confidence":0.8944,
  "speakerId":2,
  "language":"en-US",
  "instances":[
     {
    "adjustedStart":"0:00:12.81",
    "adjustedEnd":"0:00:17.03",
    "start":"0:00:12.81",
    "end":"0:00:17.03"
     }
  ]
}
```

#### ocr

| Name | Description |
|--|--|
| `id` | The OCR's line ID. |
| `text` | The OCR's text. |
| `confidence` | The recognition confidence. |
| `language` | The OCR's language. |
| `instances` | A list of time ranges where this OCR appeared. (The same OCR can appear multiple times.) |
| `height` | The height of the OCR rectangle. |
| `top` | The top location, in pixels. |
| `left` | The left location, in pixels. |
| `width` | The width of the OCR rectangle. |
| `angle` | The angle of the OCR rectangle, from `-180` to `180`. A value of `0` means left-to-right horizontal. A value of `90` means top-to-bottom vertical. A value of `180` means right-to-left horizontal. A value of `-90` means bottom-to-top vertical. A value of `30` means from top left to bottom right. |

```json
"ocr": [
    {
      "id": 0,
      "text": "LIVE FROM NEW YORK",
      "confidence": 675.971,
      "height": 35,
      "language": "en-US",
      "left": 31,
      "top": 97,
      "width": 400,
      "angle": 30,
      "instances": [
        {
          "start": "00:00:26",
          "end": "00:00:52"
        }
      ]
    }
  ],
```

#### keywords

| Name | Description |
|--|--|
| `id` | The keyword's ID. |
| `text` | The keyword's text. |
| `confidence` | Recognition confidence in the keyword. |
| `language` | The keyword language (when translated). |
| `instances` | A list of time ranges where this keyword appeared. (A keyword can appear multiple times.) |

```json
{
    id: 0,
    text: "technology",
    confidence: 1,
    language: "en-US",
    instances: [{
            adjustedStart: "0:05:15.782",
            adjustedEnd: "0:05:16.249",
            start: "0:05:15.782",
            end: "0:05:16.249"
    },
    {
            adjustedStart: "0:04:54.761",
            adjustedEnd: "0:04:55.228",
            start: "0:04:54.761",
            end: "0:04:55.228"
    }]
}
```

#### faces

If faces are present, Azure AI Video Indexer uses the Face API on all the video's frames to detect faces and celebrities.

| Name | Description |
|--|--|
| `id` | The face's ID. |
| `name` | The name of the face. It can be `Unknown #0`, an identified celebrity, or a customer-trained person. |
| `confidence` | The level of confidence in face identification. |
| `description` | A description of the celebrity. |
| `thumbnailId` | The ID of the thumbnail of the face. |
| `knownPersonId` | If it's a known person, the internal ID. |
| `referenceId` | If it's a Bing celebrity, the Bing ID. |
| `referenceType` | Currently, just Bing. |
| `title` | If it's a celebrity, the person's title. For example: `Microsoft's CEO`. |
| `imageUrl` | If it's a celebrity, the image URL. |
| `instances` | Instances of where the face appeared in the time range. Each instance also has a `thumbnailsIds` value. |

```json
"faces": [{
    "id": 2002,
    "name": "Xam 007",
    "confidence": 0.93844,
    "description": null,
    "thumbnailId": "00000000-aee4-4be2-a4d5-d01817c07955",
    "knownPersonId": "8340004b-5cf5-4611-9cc4-3b13cca10634",
    "referenceId": null,
    "title": null,
    "imageUrl": null,
    "instances": [{
        "thumbnailsIds": ["00000000-9f68-4bb2-ab27-3b4d9f2d998e",
        "cef03f24-b0c7-4145-94d4-a84f81bb588c"],
        "adjustedStart": "00:00:07.2400000",
        "adjustedEnd": "00:00:45.6780000",
        "start": "00:00:07.2400000",
        "end": "00:00:45.6780000"
    },
    {
        "thumbnailsIds": ["00000000-51e5-4260-91a5-890fa05c68b0"],
        "adjustedStart": "00:10:23.9570000",
        "adjustedEnd": "00:10:39.2390000",
        "start": "00:10:23.9570000",
        "end": "00:10:39.2390000"
    }]
}]
```

#### labels

| Name | Description |
|--|--|
| `id` | The label's ID. |
| `name` | The label's name. For example: `Computer` or `TV`. |
| `language` | The language of the label's name (when translated), in the form of a [BCP-47](https://tools.ietf.org/html/bcp47) string. |
| `instances` | A list of time ranges where this label appeared. (A label can appear multiple times.) Each instance has a confidence field. |


```json
"labels": [
    {
      "id": 0,
      "name": "person",
      "language": "en-US",
      "instances": [
        {
          "confidence": 1.0,
          "start": "00: 00: 00.0000000",
          "end": "00: 00: 25.6000000"
        },
        {
          "confidence": 1.0,
          "start": "00: 01: 33.8670000",
          "end": "00: 01: 39.2000000"
        }
      ]
    },
    {
      "name": "indoor",
      "language": "en-US",
      "id": 1,
      "instances": [
        {
          "confidence": 1.0,
          "start": "00: 00: 06.4000000",
          "end": "00: 00: 07.4670000"
        },
        {
          "confidence": 1.0,
          "start": "00: 00: 09.6000000",
          "end": "00: 00: 10.6670000"
        },
        {
          "confidence": 1.0,
          "start": "00: 00: 11.7330000",
          "end": "00: 00: 20.2670000"
        },
        {
          "confidence": 1.0,
          "start": "00: 00: 21.3330000",
          "end": "00: 00: 25.6000000"
        }
      ]
    }
  ] 
```

#### scenes

| Name | Description |
|--|--|
| `id` | The scene's ID. |
| `instances` | A list of time ranges for this scene. (A scene can have only one instance.) |

```json
"scenes":[  
    {  
      "id":0,
      "instances":[  
          {  
            "start":"0:00:00",
            "end":"0:00:06.34",
            "duration":"0:00:06.34"
          }
      ]
    },
    {  
      "id":1,
      "instances":[  
          {  
            "start":"0:00:06.34",
            "end":"0:00:47.047",
            "duration":"0:00:40.707"
          }
      ]
    },

]
```

#### shots

| Name | Description |
|--|--|
| `id` | The shot's ID. |
| `keyFrames` | A list of keyframes within the shot. Each has an ID and a list of instance time ranges. Each keyframe instance has a `thumbnailId` field, which holds the keyframe's thumbnail ID. |
| `instances` | A list of time ranges for this shot. (A shot can have only one instance.) |

```json
"shots":[  
    {  
      "id":0,
      "keyFrames":[  
          {  
            "id":0,
            "instances":[  
                {  
                  "thumbnailId":"00000000-0000-0000-0000-000000000000",
                  "start":"0:00:00.209",
                  "end":"0:00:00.251",
                  "duration":"0:00:00.042"
                }
            ]
          },
          {  
            "id":1,
            "instances":[  
                {  
                  "thumbnailId":"00000000-0000-0000-0000-000000000000",
                  "start":"0:00:04.755",
                  "end":"0:00:04.797",
                  "duration":"0:00:00.042"
                }
            ]
          }
      ],
      "instances":[  
          {  
            "start":"0:00:00",
            "end":"0:00:06.34",
            "duration":"0:00:06.34"
          }
      ]
    },

]
```

#### brands

Azure AI Video Indexer detects business and product brand names in the speech-to-text transcript and/or video OCR. This information doesn't include visual recognition of brands or logo detection.

| Name | Description |
|--|--|
| `id` | The brand's ID. |
| `name` | The brand's name. |
| `referenceId` | The suffix of the brand's Wikipedia URL. For example, `Target_Corporation` is the suffix of [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation). |
| `referenceUrl` | The brand's Wikipedia URL, if one exists. For example: [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation). |
| `description` | The brand's description. |
| `tags` | A list of predefined tags that were associated with this brand. |
| `confidence` | The confidence value of the Azure AI Video Indexer brand detector (`0`-`1`). |
| `instances` | A list of time ranges for this brand. Each instance has a `brandType` value, which indicates whether this brand appeared in the transcript or in an OCR. |

```json
"brands": [
{
    "id": 0,
    "name": "MicrosoftExcel",
    "referenceId": "Microsoft_Excel",
    "referenceUrl": "http: //en.wikipedia.org/wiki/Microsoft_Excel",
    "referenceType": "Wiki",
    "description": "Microsoft Excel is a sprea..",
    "tags": [],
    "confidence": 0.975,
    "instances": [
    {
        "brandType": "Transcript",
        "start": "00: 00: 31.3000000",
        "end": "00: 00: 39.0600000"
    }
    ]
},
{
    "id": 1,
    "name": "Microsoft",
    "referenceId": "Microsoft",
    "referenceUrl": "http: //en.wikipedia.org/wiki/Microsoft",
    "description": "Microsoft Corporation is...",
    "tags": [
    "competitors",
    "technology"
    ],
    "confidence": 1.0,
    "instances": [
    {
        "brandType": "Transcript",
        "start": "00: 01: 44",
        "end": "00: 01: 45.3670000"
    },
    {
        "brandType": "Ocr",
        "start": "00: 01: 54",
        "end": "00: 02: 45.3670000"
    }
    ]
}
]
```

#### statistics

| Name | Description |
|--|--|
| `CorrespondenceCount` | The number of correspondences in the video. |
| `SpeakerWordCount` | The number of words per speaker. |
| `SpeakerNumberOfFragments` | The number of fragments that the speaker has in a video. |
| `SpeakerLongestMonolog` | The speaker's longest monolog. If the speaker has silence inside the monolog, it's included. Silence at the beginning and the end of the monolog is removed. |
| `SpeakerTalkToListenRatio` | The calculation is based on the time spent on the speaker's monolog (without the silence in between) divided by the total time of the video. The time is rounded to the third decimal point. |

#### audioEffects (preview)

| Name | Description |
|--|--|
| `id` | The audio effect's ID. |
| `type` | The audio effect's type. |
| `name` | The audio effect's type in the language in which the JSON was indexed. |
| `instances` | A list of time ranges where this audio effect appeared. Each instance has a confidence field. |
| `start` + `end` | The time range in the original video. |
| `adjustedStart` + `adjustedEnd` | [Time range versus adjusted time range](concepts-overview.md#time-range-vs-adjusted-time-range). |

```json
audioEffects: [{
 {
        id: 0,
        type: "Laughter",
        name: "Laughter",
        instances: [{
                confidence: 0.8815,
                adjustedStart: "0:00:10.2",
                adjustedEnd: "0:00:11.2",
                start: "0:00:10.2",
                end: "0:00:11.2"
            }, {
                confidence: 0.8554,
                adjustedStart: "0:00:48.26",
                adjustedEnd: "0:00:49.56",
                start: "0:00:48.26",
                end: "0:00:49.56"
            }, {
                confidence: 0.8492,
                adjustedStart: "0:00:59.66",
                adjustedEnd: "0:01:00.66",
                start: "0:00:59.66",
                end: "0:01:00.66"
            }
        ]
    }
],
```

#### sentiments

Sentiments get aggregated by their `sentimentType` field (`Positive`, `Neutral`, or `Negative`). For example: `0-0.1`, `0.1-0.2`.

| Name | Description |
|--|--|
| `id` | The sentiment's ID. |
| `averageScore` | The average of all scores of all instances of that sentiment type. |
| `instances` | A list of time ranges where this sentiment appeared. |
| `sentimentType` | The type can be `Positive`, `Neutral`, or `Negative`. |

```json
"sentiments": [
{
    "id": 0,
    "averageScore": 0.87,
    "sentimentType": "Positive",
    "instances": [
    {
        "start": "00:00:23",
        "end": "00:00:41"
    }
    ]
}, {
    "id": 1,
    "averageScore": 0.11,
    "sentimentType": "Positive",
    "instances": [
    {
        "start": "00:00:13",
        "end": "00:00:21"
    }
    ]
}
]
```

#### visualContentModeration

The `visualContentModeration` transcript contains time ranges that Azure AI Video Indexer found to potentially have adult content. If `visualContentModeration` is empty, no adult content was identified.

Videos that contain adult or racy content might be available for private view only. Users can submit a request for a human review of the content. In that case, the `IsAdult` attribute contains the result of the human review.

| Name | Description |
|--|--|
| `id` | The ID of the visual content moderation. |
| `adultScore` | The adult score (from content moderation). |
| `racyScore` | The racy score (from content moderation). |
| `instances` | A list of time ranges where this visual content moderation appeared. |

## Learn more about visualContentModeration

- [Azure AI services documentation](/azure/ai-services/computer-vision/concept-detecting-adult-content)
- [Transparency note](/legal/cognitive-services/computer-vision/imageanalysis-transparency-note?context=%2Fazure%2Fai-services%2Fcomputer-vision%2Fcontext%2Fcontext#features)  
- [Use cases](/legal/cognitive-services/computer-vision/imageanalysis-transparency-note?context=%2Fazure%2Fai-services%2Fcomputer-vision%2Fcontext%2Fcontext#use-cases) 
- [Capabilities and limitations](/legal/cognitive-services/computer-vision/imageanalysis-transparency-note?context=%2Fazure%2Fai-services%2Fcomputer-vision%2Fcontext%2Fcontext#system-performance-and-limitations-for-image-analysis) 
- [Guidance for integration and responsible use](/legal/cognitive-services/computer-vision/imageanalysis-transparency-note?context=%2Fazure%2Fai-services%2Fcomputer-vision%2Fcontext%2Fcontext#general-guidelines-for-integration-and-responsible-use)
- [Data, privacy, and security](/legal/cognitive-services/computer-vision/imageanalysis-transparency-note?context=%2Fazure%2Fai-services%2Fcomputer-vision%2Fcontext%2Fcontext#recommendations-for-preserving-privacy)

```json
"visualContentModeration": [
{
    "id": 0,
    "adultScore": 0.00069,
    "racyScore": 0.91129,
    "instances": [
    {
        "start": "00:00:25.4840000",
        "end": "00:00:25.5260000"
    }
    ]
},
{
    "id": 1,
    "adultScore": 0.99231,
    "racyScore": 0.99912,
    "instances": [
    {
        "start": "00:00:35.5360000",
        "end": "00:00:35.5780000"
    }
    ]
}
] 
```

#### textualContentModeration 

| Name | Description |
|--|--|
| `id` | The ID of the textual content moderation. |
| `bannedWordsCount` | The number of banned words. |
| `bannedWordsRatio` | The ratio of banned words to the total number of words. |

##### Learn more about textualContentModeration

- [Azure AI services documentation](/azure/ai-services/content-moderator/text-moderation-api)
- [Supported languages](/azure/ai-services/content-moderator/language-support) 
- [Capabilities and limitations](/azure/ai-services/content-moderator/text-moderation-api) 
- [Data, privacy and security](/azure/ai-services/content-moderator/overview#data-privacy-and-security)

#### emotions

Azure AI Video Indexer identifies emotions based on speech and audio cues. 

| Name | Description |
|--|--|
| `id` | The emotion's ID. |
| `type` | The type of an identified emotion: `Joy`, `Sadness`, `Anger`, or `Fear`. |
| `instances` | A list of time ranges where this emotion appeared. |

```json
"emotions": [{
    "id": 0,
    "type": "Fear",
    "instances": [{
      "adjustedStart": "0:00:39.47",
      "adjustedEnd": "0:00:45.56",
      "start": "0:00:39.47",
      "end": "0:00:45.56"
    },
    {
      "adjustedStart": "0:07:19.57",
      "adjustedEnd": "0:07:23.25",
      "start": "0:07:19.57",
      "end": "0:07:23.25"
    }]
  },
  {
    "id": 1,
    "type": "Anger",
    "instances": [{
      "adjustedStart": "0:03:55.99",
      "adjustedEnd": "0:04:05.06",
      "start": "0:03:55.99",
      "end": "0:04:05.06"
    },
    {
      "adjustedStart": "0:04:56.5",
      "adjustedEnd": "0:05:04.35",
      "start": "0:04:56.5",
      "end": "0:05:04.35"
    }]
  },
  {
    "id": 2,
    "type": "Joy",
    "instances": [{
      "adjustedStart": "0:12:23.68",
      "adjustedEnd": "0:12:34.76",
      "start": "0:12:23.68",
      "end": "0:12:34.76"
    },
    {
      "adjustedStart": "0:12:46.73",
      "adjustedEnd": "0:12:52.8",
      "start": "0:12:46.73",
      "end": "0:12:52.8"
    },
    {
      "adjustedStart": "0:30:11.29",
      "adjustedEnd": "0:30:16.43",
      "start": "0:30:11.29",
      "end": "0:30:16.43"
    },
    {
      "adjustedStart": "0:41:37.23",
      "adjustedEnd": "0:41:39.85",
      "start": "0:41:37.23",
      "end": "0:41:39.85"
    }]
  },
  {
    "id": 3,
    "type": "Sad",
    "instances": [{
      "adjustedStart": "0:13:38.67",
      "adjustedEnd": "0:13:41.3",
      "start": "0:13:38.67",
      "end": "0:13:41.3"
    },
    {
      "adjustedStart": "0:28:08.88",
      "adjustedEnd": "0:28:18.16",
      "start": "0:28:08.88",
      "end": "0:28:18.16"
    }]
  }
],
```

#### topics

Azure AI Video Indexer makes an inference of main topics from transcripts. When possible, the second-level [IPTC](https://iptc.org/standards/media-topics/) taxonomy is included. 

| Name | Description |
|--|--|
| `id` | The topic's ID. |
| `name` | The topic's name. For example: `Pharmaceuticals`. |
| `referenceId` | Breadcrumbs that reflect the topic's hierarchy. For example: `HEALTH AND WELLBEING/MEDICINE AND HEALTHCARE/PHARMACEUTICALS`. |
| `confidence` | The confidence score in the range `0`-`1`. Higher is more confident. |
| `language` | The language used in the topic. |
| `iptcName` | The IPTC media code name, if detected. |
| `instances` | Currently, Azure AI Video Indexer doesn't index a topic to time intervals. The whole video is used as the interval. |

```json
"topics": [{
    "id": 0,
    "name": "INTERNATIONAL RELATIONS",
    "referenceId": "POLITICS AND GOVERNMENT/FOREIGN POLICY/INTERNATIONAL RELATIONS",
    "referenceType": "VideoIndexer",
    "confidence": 1,
    "language": "en-US",
    "instances": [{
        "adjustedStart": "0:00:00",
        "adjustedEnd": "0:03:36.25",
        "start": "0:00:00",
        "end": "0:03:36.25"
    }]
}, {
    "id": 1,
    "name": "Politics and Government",
    "referenceType": "VideoIndexer",
    "iptcName": "Politics",
    "confidence": 0.9041,
    "language": "en-US",
    "instances": [{
        "adjustedStart": "0:00:00",
        "adjustedEnd": "0:03:36.25",
        "start": "0:00:00",
        "end": "0:03:36.25"
    }]
}]
. . .
```

#### speakers

| Name | Description |
|--|--|
| `id` | The speaker's ID. |
| `name` | The speaker's name in the form of `Speaker #<number>`. For example: `Speaker #1`. |
| `instances` | A list of time ranges where this speaker appeared. |

```json
"speakers":[
{
  "id":1,
  "name":"Speaker #1",
  "instances":[
     {
    "adjustedStart":"0:00:10.21",
    "adjustedEnd":"0:00:12.81",
    "start":"0:00:10.21",
    "end":"0:00:12.81"
     }
  ]
},
{
  "id":2,
  "name":"Speaker #2",
  "instances":[
     {
    "adjustedStart":"0:00:12.81",
    "adjustedEnd":"0:00:17.03",
    "start":"0:00:12.81",
    "end":"0:00:17.03"
     }
  ]
},

```

## Next steps

Explore the [Azure AI Video Indexer API developer portal](https://api-portal.videoindexer.ai).

For information about how to embed widgets in your application, see [Embed Azure AI Video Indexer widgets into your applications](video-indexer-embed-widgets.md). 
