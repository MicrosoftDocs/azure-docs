---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Analyze video and audio files
titleSuffix: Azure Media Services
description: Learn how to analyze audio and video content using AudioAnalyzerPreset and VideoAnalyzerPreset in Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 01/30/2020
ms.author: juliako
---

# Analyze video and audio files with Azure Media Services

Azure Media Services v3 lets you extract insights from your video and audio files with Video Indexer. This article describes the Media Services v3 analyzer presets used to extract those insights. If you want more detailed insights, use Video Indexer directly. To understand when to use Video Indexer vs. Media Services analyzer presets, check out the [comparison document](../video-indexer/compare-video-indexer-with-media-services-presets.md).

To analyze your content using Media Services v3 presets, you create a **Transform** and submit a **Job** that uses one of these presets: [VideoAnalyzerPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#videoanalyzerpreset) or **AudioAnalyzerPreset**. For a tutorial demonstrating how to use **VideoAnalyzerPreset**, see [Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md).

> [!NOTE]
> When using a Video or Audio Analyzer presets, use the Azure portal to set your account to have 10 S3 Media Reserved Units. For more information, see [Scale media processing](media-reserved-units-cli-how-to.md).

## Compliance, Privacy and Security

As an important reminder, you must comply with all applicable laws in your use of Video Indexer, and you may not use Video Indexer or any other Azure service in a manner that violates the rights of others or may be harmful to others. Before uploading any videos, including any biometric data, to the Video Indexer service for processing and storage, You must have all the proper rights, including all appropriate consents, from the individual(s) in the video. To learn about compliance, privacy and security in Video Indexer, the Microsoft [Cognitive Services Terms](https://azure.microsoft.com/support/legal/cognitive-services-compliance-and-privacy/). For Microsoft’s privacy obligations and handling of your data, please review Microsoft’s [Privacy Statement](https://privacy.microsoft.com/PrivacyStatement), the [Online Services Terms](https://www.microsoft.com/licensing/product-licensing/products) (“OST”) and [Data Processing Addendum](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=67) (“DPA”). Additional privacy information, including on data retention, deletion/destruction, is available in the OST and [here](../video-indexer/faq.md). By using Video Indexer, you agree to be bound by the Cognitive Services Terms, the OST, DPA and the Privacy Statement.

## Built-in presets

Media Services currently supports the following built-in analyzer presets:  

|**Preset name**|**Scenario**|**Details**|
|---|---|---|
|[AudioAnalyzerPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#audioanalyzerpreset)|Analyzing audio|The preset applies a predefined set of AI-based analysis operations, including speech transcription. Currently, the preset supports processing content with a single audio track that contains speech in a single language. You can specify the language for the audio payload in the input using the BCP-47 format of 'language tag-region'. Supported languages are English ('en-US' and 'en-GB'), Spanish ('es-ES' and 'es-MX'), French ('fr-FR'), Italian ('it-IT'), Japanese ('ja-JP'), Portuguese ('pt-BR'), Chinese ('zh-CN'), German ('de-DE'), Arabic ('ar-EG' and 'ar-SY'), Russian ('ru-RU'), Hindi ('hi-IN'), and Korean ('ko-KR').<br/><br/> If the language isn't specified or set to null, automatic language detection chooses the first language detected and continues with the selected language for the duration of the file. The automatic language detection feature currently supports English, Chinese, French, German, Italian, Japanese, Spanish, Russian, and Portuguese. It doesn't support dynamically switching between languages after the first language is detected. The automatic language detection feature works best with audio recordings with clearly discernible speech. If automatic language detection fails to find the language, the transcription falls back to English.|
|[VideoAnalyzerPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#videoanalyzerpreset)|Analyzing audio and video|Extracts insights (rich metadata) from both audio and video, and outputs a JSON format file. You can specify whether you only want to extract audio insights when processing a video file. For more information, see [Analyze video](analyze-videos-tutorial-with-api.md).|
|[FaceDetectorPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#facedetectorpreset)|Detecting faces present in video|Describes the settings to be used when analyzing a video to detect all the faces present.|

### AudioAnalyzerPreset

The preset enables you to extract multiple audio insights from an audio or video file. The output includes a JSON file (with all the insights) and VTT file for the audio transcript. This preset accepts a property that specifies the language of the input file in the form of a [BCP47](https://tools.ietf.org/html/bcp47) string. The audio insights include:

* **Audio transcription**: A transcript of the spoken words with timestamps. Multiple languages are supported.
* **Speaker indexing**: A mapping of the speakers and the corresponding spoken words.
* **Speech sentiment analysis**: The output of sentiment analysis performed on the audio transcription.
* **Keywords**: Keywords that are extracted from the audio transcription.

### VideoAnalyzerPreset

The preset enables you to extract multiple audio and video insights from a video file. The output includes a JSON file (with all the insights), a VTT file for the video transcript, and a collection of thumbnails. This preset also accepts a [BCP47](https://tools.ietf.org/html/bcp47) string (representing the language of the video) as a property. The video insights include all the audio insights mentioned above and the following additional items:

* **Face tracking**: The time during which faces are present in the video. Each face has a face ID and a corresponding collection of thumbnails.
* **Visual text**: The text that's detected via optical character recognition. The text is time stamped and also used to extract keywords (in addition to the audio transcript).
* **Keyframes**: A collection of keyframes extracted from the video.
* **Visual content moderation**: The portion of the videos flagged as adult or racy in nature.
* **Annotation**: A result of annotating the videos based on a pre-defined object model

## insights.json elements

The output includes a JSON file (insights.json) with all the insights found in the video or audio. The JSON may contain the following elements:

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
|name|The face name. It can be ‘Unknown #0’, an identified celebrity, or a customer trained person.|
|confidence|The face identification confidence.|
|description|A description of the celebrity. |
|thumbnailId|The ID of the thumbnail of that face.|
|knownPersonId|The internal ID (if it's a known person).|
|referenceId|The Bing ID (if it's a Bing celebrity).|
|referenceType|Currently just Bing.|
|title|The title (if it's a celebrity—for example, "Microsoft's CEO").|
|imageUrl|The image URL, if it's a celebrity.|
|instances|Instances where the face appeared in the given time range. Each instance also has a thumbnailsId. |

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
|SpeakerLongestMonolog|The speaker's longest monolog. If the speaker has silences inside the monolog it's included. Silence at the beginning and the end of the monolog is removed.|
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

The visualContentModeration block contains time ranges which Video Indexer found to potentially have adult content. If visualContentModeration is empty, there's no adult content that was identified.

Videos that are found to contain adult or racy content might be available for private view only. Users can submit a request for a human review of the content, in which case the `IsAdult` attribute will contain the result of the human review.

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

[Tutorial: Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md)
