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

Azure Media Services REST v3 API enables you to analyze audio and video content. To analyze your content you create a **Transform** and submit a **Job** that uses one of these presets: **AudioAnalyzerPreset** or **VideoAnalyzerPreset**. 

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

One of the the main ouputs of the job is insights.json file. The json may contain the following elements:

### Transcript

|Name|Description|
|---|---|
|id|The line ID.|
|text|The transcript itself.|
|language|The transcript language. Intended to support transcript where each line can have a different language.|
|instances|A list of time ranges where this line appeared. In case of transcript, it will have only 1 instance.|

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

### Ocr

|Name|Description|
|---|---|
|id|The OCR line id.|
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

### Keywords

|Name|Description|
|---|---|
|id|The keyword id.|
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

### Faces

|Name|Description|
|---|---|
|id|The face id.|
|name|The face name. It can be ‘Unknown #0’, an identified celebrity or a customer trained person.|
|confidence|The face identification confidence.|
|description|In case of a celebrity, its description ("Satya Nadella was born at..."). |
|thumbnalId|The id of the thumbnail of that face (in VI).|
|knownPersonId|In case of a known person, its internal id.|
|referenceId|In case of a Bing celebrity, its Bing id.|
|referenceType|Currently just Bing.|
|title|In case of a celebrity, its title (for example "Microsoft's CEO").|
|imageUrl|In case of a celebrity, its image url.|
|instances|A list of time ranges where this keyword appeared (a keyword can appear multiple times).|

```json
"Faces": [
    {
      "id": 1002,
      "name": "Satya Nadella",
      "confidence": 0.911,

      "description": "Satya Nadella is Microsoft...",
      "thumbnailId": "12345678-0000-0000-0000-000000000000",
      "knownPersonId": "00000000-0000-0000-0000-000000000000",
      "bingId": 39835678 - 0000 - 0000 - 0000 - 000000000000,
      "title": "Microsoft's CEO",
      "imageUrl": "http://www.bing.com/images/...",
      "instances": [
        {
          "start": "00: 00: 00",
          "end": "00: 00: 26.8000000"
        }
      ]
    },
    {
      "id": 2508,
      "name": "My brother", 
      "confidence": 0.881,
      "description": null,
      "thumbnailId": "87654321-0000-0000-0000-000000000000",
      "knownPersonId": "11111122-0000-0000-0000-000000000000",
      "referenceId": null,
      "referenceType": null,
      "title": null,
      "imageUrl": "http://www.bing.com/images/...",
      "instances": [
        {
          "start": "00: 00: 00",
          "end": "00: 00: 14.6330000"
        },
        {
          "start": "00: 01: 33.3670000",
          "end": "00: 01: 38.3660000"
        }
      ]
    }
  ]
```

### Labels

|Name|Description|
|---|---|
|id|The label id.|
|name|The label name (for example, 'Computer', 'TV').|
|language|The label name language (when translated). BCP-47|
|instances|A list of time ranges where this label appeared (a label can appear multiple times).|

```json
"labels": [
    {
      "id": 0,
      "name": "person",
      "language": "en-US",
      "instances": [
        {
          "start": "00: 00: 00.0000000",
          "end": "00: 00: 25.6000000"
        },
        {
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
          "start": "00: 00: 06.4000000",
          "end": "00: 00: 07.4670000"
        },
        {
          "start": "00: 00: 09.6000000",
          "end": "00: 00: 10.6670000"
        },
        {
          "start": "00: 00: 11.7330000",
          "end": "00: 00: 20.2670000"
        },
        {
          "start": "00: 00: 21.3330000",
          "end": "00: 00: 25.6000000"
        }
      ]
    }
  ] 
```

### Shots

|Name|Description|
|---|---|
|id|The shot id.|
|keyFrames|A list of key frames within the shot (each has an Id and a list of instances time ranges).|
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
              "start": "00: 00: 00.1670000",
              "end": "00: 00: 00.2000000"
            }
          ]
        }
      ],
      "instances": [
        {
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
              "start": "00: 00: 05.2670000",
              "end": "00: 00: 05.3000000"
            }
          ]
        }
      ],
      "instances": [
        {
          "start": "00: 00: 05.2670000",
          "end": "00: 00: 10.3000000"
        }
      ]
    }
  ]
```

### AudioEffects

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

### Sentiments

 Sentiments are aggregated by their score (for example, 0-0.1, 0.1-0.2).

|Name|Description|
|---|---|
|id|The sentiment ID.|
|score|The sentiment score (0 = Negative, 1 = Positive).|
|instances|A list of time ranges where this sentiment appeared.|

```json
"sentiments": [
{
    "id": 0,
    "score": 0.87,
    "instances": [
    {
        "start": "00:00:23",
        "end": "00:00:41"
    }
    ]
}, {
    "id": 1,
    "score": 0.11,
    "instances": [
    {
        "start": "00:00:13",
        "end": "00:00:21"
    }
    ]
}
]
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md)
