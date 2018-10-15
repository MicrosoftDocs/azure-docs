---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure media intelligence | Microsoft Docs
description: When using Azure Media Services, you can analyze your audio and video contnet using AudioAnalyzerPreset and VideoAnalyzerPreset.  
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 04/24/2018
ms.author: juliako
---

# Media intelligence

Azure Media Services REST v3 API enables you to analyze audio and video content. To analyze your content, you create a **Transform** and submit a **Job** that uses one of these presets: **AudioAnalyzerPreset** or **VideoAnalyzerPreset**. 

## AudioAnalyzerPreset

**AudioAnalyzerPreset** enables you to extract multiple audio insights from an audio or video file. The output includes a JSON file (with all the insights) and VTT file for the audio transcript. This preset accepts a property that specifies the language of the input file in the form of a [BCP47](https://tools.ietf.org/html/bcp47) string. The audio insights include:

* Audio transcription – a transcript of the spoken words with timestamps. Multiple languages are supported
* Speaker indexing – a mapping of the speakers and the corresponding spoken words
* Speech sentiment analysis – the output of sentiment analysis performed on the audio transcription
* Keywords – keywords that are extracted from the audio transcription.

## VideoAnalyzerPreset

**VideoAnalyzerPreset** enables you to extract multiple audio and video insights from a video file. The output includes a JSON file (with all the insights), a VTT file for the video transcript, and a collection of thumbnails. This preset also accepts a [BCP47](https://tools.ietf.org/html/bcp47) string (representing the language of the video) as a property. The video insights include all the audio insights mentioned above and the following additional items:

* Face tracking – the time during which faces are present in the video. Each face has a face id and a corresponding collection of thumbnails
* Visual text – the text that is detected via optical character recognition. The text is time stamped and also used to extract keywords (in addition to the audio transcript)
* Keyframes – a collection of keyframes that are extracted from the video
* Visual content moderation – the portion of the videos that have been flagged as adult or racy in nature
* Annotation – a result of annotating the videos based on a pre-defined object model

##  insights.json elements

The output includes a JSON file (insights.json) with all the insights that were found in the video or audio. The json may contain the following elements:

### transcript

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

### ocr

|Name|Description|
|---|---|
|id|The OCR line ID.|
|text|The OCR text.|
|confidence|The recognition confidence.|
|language|The OCR language.|
|instances|A list of time ranges where this OCR appeared (the same OCR can appear multiple times).|

```json
"ocr": [
    {
      "id": 0,
      "text": "LIVE FROM NEW YORK",
      "confidence": 0.91,
      "language": "en-US",
      "instances": [
        {
          "start": "00:00:26",
          "end": "00:00:52"
        }
      ]
    },
    {
      "id": 1,
      "text": "NOTICIAS EN VIVO",
      "confidence": 0.9,
      "language": "es-ES",
      "instances": [
        {
          "start": "00:00:26",
          "end": "00:00:28"
        },
        {
          "start": "00:00:32",
          "end": "00:00:38"
        }
      ]
    }
  ],
```

### faces

|Name|Description|
|---|---|
|id|The face ID.|
|name|The face name. It can be ‘Unknown #0’, an identified celebrity or a customer trained person.|
|confidence|The face identification confidence.|
|description|A description of the celebrity. |
|thumbnalId|The ID of the thumbnail of that face.|
|knownPersonId|If it is a known person, its internal ID.|
|referenceId|If it is a Bing celebrity, its Bing ID.|
|referenceType|Currently just Bing.|
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

### shots

|Name|Description|
|---|---|
|id|The shot ID.|
|keyFrames|A list of key frames within the shot (each has an ID and a list of instances time ranges). Key frames instances have a thumbnailId field with the keyFrame’s thumbnail ID.|
|instances|A list of time ranges of this shot (shots have only 1 instance).|

```json
"Shots": [
    {
      "id": 0,
      "keyFrames": [
        {
          "id": 0,
          "instances": [
            {
	            "thumbnailId": "00000000-0000-0000-0000-000000000000",
              "start": "00: 00: 00.1670000",
              "end": "00: 00: 00.2000000"
            }
          ]
        }
      ],
      "instances": [
        {
	        "thumbnailId": "00000000-0000-0000-0000-000000000000",	
          "start": "00: 00: 00.2000000",
          "end": "00: 00: 05.0330000"
        }
      ]
    },
    {
      "id": 1,
      "keyFrames": [
        {
          "id": 1,
          "instances": [
            {
	            "thumbnailId": "00000000-0000-0000-0000-000000000000",	    
              "start": "00: 00: 05.2670000",
              "end": "00: 00: 05.3000000"
            }
          ]
        }
      ],
      "instances": [
        {
	  "thumbnailId": "00000000-0000-0000-0000-000000000000",
          "start": "00: 00: 05.2670000",
          "end": "00: 00: 10.3000000"
        }
      ]
    }
  ]
```

### statistics

|Name|Description|
|---|---|
|CorrespondenceCount|Number of correspondences in the video.|
|WordCount|The number of words per speaker.|
|SpeakerNumberOfFragments|The amount of fragments the speaker has in a video.|
|SpeakerLongestMonolog|The speaker's longest monolog. If the speaker has silences inside the monolog it is included. Silence at the beginning and the end of the monolog is removed.| 
|SpeakerTalkToListenRatio|The calculation is based on the time spent on the speaker's monolog (without the silence in between) divided by the total time of the video. The time is rounded to the third decimal point.|


### sentiments

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

### labels

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

### keywords

|Name|Description|
|---|---|
|id|The keyword ID.|
|text|The keyword text.|
|confidence|The keyword's recognition confidence.|
|language|The keyword language (when translated).|
|instances|A list of time ranges where this keyword appeared (a keyword can appear multiple times).|

```json
"keywords": [
{
    "id": 0,
    "text": "office",
    "confidence": 1.6666666666666667,
    "language": "en-US",
    "instances": [
    {
        "start": "00:00:00.5100000",
        "end": "00:00:02.7200000"
    },
    {
        "start": "00:00:03.9600000",
        "end": "00:00:12.2700000"
    }
    ]
},
{
    "id": 1,
    "text": "icons",
    "confidence": 1.4,
    "language": "en-US",
    "instances": [
    {
        "start": "00:00:03.9600000",
        "end": "00:00:12.2700000"
    },
    {
        "start": "00:00:13.9900000",
        "end": "00:00:15.6100000"
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
## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md)
