---
title: Examine the  Video Indexer output produced by v2 API - Azure
titleSuffix: Azure Media Services
description: This topic examines the Azure Media Services Video Indexer output produced by v2 API.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 12/09/2019
ms.author: juliako
---

# Examine the Video Indexer output produced by API

When you call the **Get Video Index** API and the response status is OK, you get a detailed JSON output as the response content. The JSON content contains details of the specified video insights. The insights include: transcripts, OCRs, faces, topics, blocks, etc. Each insight type includes instances of time ranges that show when the insight appears in the video. 

1. To retrieve the JSON file, call [Get Video Index API](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Get-Video-Index?)
1. If you are also interested in specific artifacts, call [Get Video Artifact Download URL API](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Get-Video-Artifact-Download-Url?)

	In the API call, specify the requested artifact type (OCR, Faces, Key frames etc.)

You can also visually examine the video's summarized insights by pressing the **Play** button on the video on the [Video Indexer](https://www.videoindexer.ai/) website. For more information, see [View and edit video insights](video-indexer-view-edit.md).

![Insights](./media/video-indexer-output-json/video-indexer-summarized-insights.png)

This article examines the JSON content returned by the  **Get Video Index** API. 

> [!NOTE]
> Expiration of all the access tokens in Video Indexer is one hour.


## Root elements

|Name|Description|
|---|---|
|accountId|The playlist's VI account ID.|
|id|The playlist's ID.|
|name|The playlist's name.|
|description|The playlist's description.|
|userName|The name of the user who created the playlist.|
|created|The playlist's creation time.|
|privacyMode|The playlist’s privacy mode (Private/Public).|
|state|The playlist’s (uploaded, processing, processed, failed, quarantined).|
|isOwned|Indicates whether the playlist was created by the current user.|
|isEditable|Indicates whether the current user is authorized to edit the playlist.|
|isBase|Indicates whether the playlist is a base playlist (a video) or a playlist made of other videos (derived).|
|durationInSeconds|The total duration of the playlist.|
|summarizedInsights|Contains one [summarizedInsights](#summarizedinsights).
|videos|A list of [videos](#videos) constructing the playlist.<br/>If this playlist of constructed of time ranges of other videos (derived), the videos in this list will contain only data from the included time ranges.|

```json
{
  "accountId": "bca61527-1221-bca6-1527-a90000002000",
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
  "summarizedInsights" : { . . . }
  "videos": [{ . . . }]
}
```

## summarizedInsights

This section shows the summary of the insights.

|Attribute | Description|
|---|---|
|name|The name of the video. For example, Azure Monitor.|
|id|The ID of the video. For example, 63c6d532ff.|
|privacyMode|Your breakdown can have one of the following modes: **Private**, **Public**. **Public** - the video is visible to everyone in your account and anyone that has a link to the video. **Private** - the video is visible to everyone in your account.|
|duration|Contains one duration that describes the time an insight occurred. Duration is in seconds.|
|thumbnailVideoId|The ID of the video from which the thumbnail was taken.
|thumbnailId|The video's thumbnail ID. To get the actual thumbnail, call [Get-Thumbnail](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Video-Thumbnail) and pass it thumbnailVideoId and  thumbnailId.|
|faces|May contain zero or more faces. For more detailed information, see [faces](#faces).|
|keywords|May contain zero or more keywords. For more detailed information, see [keywords](#keywords).|
|sentiments|May contain zero or more sentiments. For more detailed information, see [sentiments](#sentiments).|
|audioEffects| May contain zero or more audioEffects. For more detailed information, see [audioEffects](#audioEffects).|
|labels| May contain zero or more labels. For detailed more information, see [labels](#labels).|
|brands| May contain zero or more brands. For more detailed information, see [brands](#brands).|
|statistics | For more detailed information, see [statistics](#statistics).|
|emotions| May contain zero or more emotions. For More detailed information, see [emotions](#emotions).|
|topics|May contain zero or more topics. The [topics](#topics) insight.|

## videos

|Name|Description|
|---|---|
|accountId|The video's VI account ID.|
|id|The video's ID.|
|name|The video's name.
|state|The video’s state (uploaded, processing, processed, failed, quarantined).|
|processingProgress|The processing progress during processing (for example, 20%).|
|failureCode|The failure code if failed to process (for example, 'UnsupportedFileType').|
|failureMessage|The failure message if failed to process.|
|externalId|The video's external ID (if specified by the user).|
|externalUrl|The video's external url (if specified by the user).|
|metadata|The video's external metadata (if specified by the user).|
|isAdult|Indicates whether the video was manually reviewed and identified as an adult video.|
|insights|The insights object. For more information, see [insights](#insights).|
|thumbnailId|The video's thumbnail ID. To get the actual thumbnail call [Get-Thumbnail](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Video-Thumbnail) and pass it the video ID and thumbnailId.|
|publishedUrl|A url to stream the video.|
|publishedUrlProxy|A url to stream the video from (for Apple devices).|
|viewToken|A short lived view token for streaming the video.|
|sourceLanguage|The video's source language.|
|language|The video's actual language (translation).|
|indexingPreset|The preset used to index the video.|
|streamingPreset|The preset used to publish the video.|
|linguisticModelId|The CRIS model used to transcribe the video.|
|statistics | For more information, see [statistics](#statistics).|

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

Each insight (for example, transcript lines, faces, brands, etc.), contains a list of unique elements (for example, face1, face2, face3), and each element has its own metadata and a list of its instances (which are time ranges with additional optional metadata).

A face might  have an ID, a name, a thumbnail, other metadata, and a list of its temporal instances (for example: 00:00:05 – 00:00:10, 00:01:00 - 00:02:30 and 00:41:21 – 00:41:49.) Each temporal instance can have additional metadata. For example, the face’s rectangle coordinates (20,230,60,60).

|Version|The code version|
|---|---|
|sourceLanguage|The video's source language (assuming one master language). In the form of a [BCP-47](https://tools.ietf.org/html/bcp47) string.|
|language|The insights language (translated from the source language). In the form of a [BCP-47](https://tools.ietf.org/html/bcp47) string.|
|transcript|The [transcript](#transcript) insight.|
|ocr|The [OCR](#ocr) insight.|
|keywords|The [keywords](#keywords) insight.|
|blocks|May contain one or more [blocks](#blocks)|
|faces|The [faces](#faces) insight.|
|labels|The [labels](#labels) insight.|
|shots|The [shots](#shots) insight.|
|brands|The [brands](#brands) insight.|
|audioEffects|The [audioEffects](#audioEffects) insight.|
|sentiments|The [sentiments](#sentiments) insight.|
|visualContentModeration|The [visualContentModeration](#visualcontentmoderation) insight.|
|textualContentModeration|The [textualContentModeration](#textualcontentmoderation) insight.|
|emotions| The [emotions](#emotions) insight.|
|topics|The [topics](#topics) insight.|

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

#### blocks

Attribute | Description
---|---
id|ID of the block.|
instances|A list of time ranges of this block.|

#### transcript

|Name|Description|
|---|---|
|id|The line ID.|
|text|The transcript itself.|
|language|The transcript language. Intended to support transcript where each line can have a different language.|
|instances|A list of time ranges where this line appeared. If the instance is transcript, it will have only 1 instance.|

Example:

```json
"transcript": [
{
    "id": 0,
    "text": "Hi I'm Doug from office.",
    "language": "en-US",
    "instances": [
    {
        "start": "00:00:00.5100000",
        "end": "00:00:02.7200000"
    }
    ]
},
{
    "id": 1,
    "text": "I have a guest. It's Michelle.",
    "language": "en-US",
    "instances": [
    {
        "start": "00:00:02.7200000",
        "end": "00:00:03.9600000"
    }
    ]
}
] 
```

#### ocr

|Name|Description|
|---|---|
|id|The OCR line ID.|
|text|The OCR text.|
|confidence|The recognition confidence.|
|language|The OCR language.|
|instances|A list of time ranges where this OCR appeared (the same OCR can appear multiple times).|
|height|The height of the OCR rectangle|
|top|The top location in px|
|left| The left location in px|
|width|The width of the  OCR rectangle|

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

|Name|Description|
|---|---|
|id|The keyword ID.|
|text|The keyword text.|
|confidence|The keyword's recognition confidence.|
|language|The keyword language (when translated).|
|instances|A list of time ranges where this keyword appeared (a keyword can appear multiple times).|

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

|Name|Description|
|---|---|
|id|The face ID.|
|name|The name of the face. It can be 'Unknown #0, an identified celebrity or a customer trained person.|
|confidence|The face identification confidence.|
|description|A description of the celebrity. |
|thumbnailId|The ID of the thumbnail of that face.|
|knownPersonId|If it is a known person, its internal ID.|
|referenceId|If it is a Bing celebrity, its Bing ID.|
|referenceType|Currently, just Bing.|
|title|If it is a celebrity, its title (for example "Microsoft's CEO").|
|imageUrl|If it is a celebrity, its image url.|
|instances|These are instances of where the face appeared in the given time range. Each instance also has a thumbnailsId. |

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

|Name|Description|
|---|---|
|id|The label ID.|
|name|The label name (for example, 'Computer', 'TV').|
|language|The label name language (when translated). BCP-47|
|instances|A list of time ranges where this label appeared (a label can appear multiple times). Each instance has a confidence field. |


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

|Name|Description|
|---|---|
|id|The scene ID.|
|instances|A list of time ranges of this scene (a scene can only have 1 instance).|

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

|Name|Description|
|---|---|
|id|The shot ID.|
|keyFrames|A list of keyFrames within the shot (each has an ID and a list of instances time ranges). Each keyFrame instance has a thumbnailId field, which holds the keyFrame's thumbnail ID.|
|instances|A list of time ranges of this shot (a shot can only have 1 instance).|

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

Business and product brand names detected in the speech to text transcript and/or Video OCR. This does not include visual recognition of brands or logo detection.

|Name|Description|
|---|---|
|id|The brand ID.|
|name|The brands name.|
|referenceId | The suffix of the brand wikipedia url. For example, "Target_Corporation” is the suffix of [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation).
|referenceUrl | The brand’s Wikipedia url, if exists. For example, [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation).
|description|The brands description.|
|tags|A list of predefined tags that were associated with this brand.|
|confidence|The confidence value of the Video Indexer brand detector (0-1).|
|instances|A list of time ranges of this brand. Each instance has a brandType, which indicates whether this brand appeared in the transcript or in OCR.|

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

|Name|Description|
|---|---|
|CorrespondenceCount|Number of correspondences in the video.|
|SpeakerWordCount|The number of words per speaker.|
|SpeakerNumberOfFragments|The amount of fragments the speaker has in a video.|
|SpeakerLongestMonolog|The speaker's longest monolog. If the speaker has silences inside the monolog it is included. Silence at the beginning and the end of the monolog is removed.| 
|SpeakerTalkToListenRatio|The calculation is based on the time spent on the speaker's monolog (without the silence in between) divided by the total time of the video. The time is rounded to the third decimal point.|

#### <a id="audioEffects"/>audioEffects

|Name|Description|
|---|---|
|id|The audio effect ID.|
|type|The audio effect type (for example, Clapping, Speech, Silence).|
|instances|A list of time ranges where this audio effect appeared.|

```json
"audioEffects": [
{
    "id": 0,
    "type": "Clapping",
    "instances": [
    {
        "start": "00:00:00",
        "end": "00:00:03"
    },
    {
        "start": "00:01:13",
        "end": "00:01:21"
    }
    ]
}
]
```

#### sentiments

Sentiments are aggregated by their sentimentType field (Positive/Neutral/Negative). For example, 0-0.1, 0.1-0.2.

|Name|Description|
|---|---|
|id|The sentiment ID.|
|averageScore |The average of all scores of all instances of that sentiment type - Positive/Neutral/Negative|
|instances|A list of time ranges where this sentiment appeared.|
|sentimentType |The type can be 'Positive', 'Neutral', or 'Negative'.|

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

The visualContentModeration block contains time ranges which Video Indexer found to potentially have adult content. If visualContentModeration is empty, there is no adult content that was identified.

Videos that are found to contain adult or racy content might be available for private view only. Users have the option to submit a request for a human review of the content, in which case the IsAdult attribute will contain the result of the human review.

|Name|Description|
|---|---|
|id|The visual content moderation ID.|
|adultScore|The adult score (from content moderator).|
|racyScore|The racy score (from content moderation).|
|instances|A list of time ranges where this visual content moderation appeared.|

```json
"VisualContentModeration": [
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

|Name|Description|
|---|---|
|id|The textual content moderation ID.|
|bannedWordsCount |The number of banned words.|
|bannedWordsRatio |The ratio from total number of words.|

#### emotions

Video Indexer identifies emotions based on speech and audio cues. The identified emotion could be: joy, sadness, anger, or fear.

|Name|Description|
|---|---|
|id|The emotion ID.|
|type|The emotion moment that was identified based on speech and audio cues. The emotion could be: joy, sadness, anger, or fear.|
|instances|A list of time ranges where this emotion appeared.|

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

Video Indexer makes inference of main topics from transcripts. When possible, the 2nd-level [IPTC](https://iptc.org/standards/media-topics/) taxonomy is included. 

|Name|Description|
|---|---|
|id|The topic ID.|
|name|The topic name, for example: "Pharmaceuticals".|
|referenceId|Breadcrumbs reflecting the topics hierarchy. For example: "Health and wellbeing / Medicine and healthcare / Pharmaceuticals".|
|confidence|The confidence score in the range [0,1]. Higher is more confident.|
|language|The language used in the topic.|
|iptcName|The IPTC media code name, if detected.|
|instances |Currently, Video Indexer does not index a topic to time intervals, so the whole video is used as the interval.|

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

## Next steps

[Video Indexer Developer Portal](https://api-portal.videoindexer.ai)

For information about how to embed widgets in your application, see [Embed Video Indexer widgets into your applications](video-indexer-embed-widgets.md). 

