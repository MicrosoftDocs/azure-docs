---
title: How to get speech to text session ID and transcription ID
titleSuffix: Azure AI services
description: Learn how to get speech to text session ID and transcription ID
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 1/21/2024
ms.author: alexeyo 
---

# How to get speech to text session ID and transcription ID

If you use [speech to text](speech-to-text.md) and need to open a support case, you're often asked to provide a *Session ID* or *Transcription ID* of the problematic transcriptions to debug the issue. This article explains how to get these IDs. 

> [!NOTE]
> * *Session ID* is used in [real-time speech to text](get-started-speech-to-text.md) and [speech translation](speech-translation.md).
> * *Transcription ID* is used in [batch transcription](batch-transcription.md).

## Getting Session ID

[Real-time speech to text](get-started-speech-to-text.md) and [speech translation](speech-translation.md) use either the [Speech SDK](speech-sdk.md) or the [REST API for short audio](rest-speech-to-text-short.md).

To get the Session ID, when using SDK you need to:

1. Enable application logging.
1. Find the Session ID inside the log.

If you use Speech SDK for JavaScript, get the Session ID as described in [this section](#get-session-id-using-javascript).

If you use [Speech CLI](spx-overview.md), you can also get the Session ID interactively. See details in [this section](#get-session-id-using-speech-cli).

With the [speech to text REST API for short audio](rest-speech-to-text-short.md), you need to inject the session information in the requests. See details in [this section](#provide-session-id-using-rest-api-for-short-audio).

### Enable logging in the Speech SDK

Enable logging for your application as described in [this article](how-to-use-logging.md).

### Get Session ID from the log

Open the log file your application produced and look for `SessionId:`. The number that would follow is the Session ID you need. In the following log excerpt example, `0b734c41faf8430380d493127bd44631` is the Session ID.

```
[874193]: 218ms SPX_DBG_TRACE_VERBOSE:  audio_stream_session.cpp:1238 [0000023981752A40]CSpxAudioStreamSession::FireSessionStartedEvent: Firing SessionStarted event: SessionId: 0b734c41faf8430380d493127bd44631
```
### Get Session ID using JavaScript

If you use Speech SDK for JavaScript, you get Session ID with the help of `sessionStarted` event from the [Recognizer class](/javascript/api/microsoft-cognitiveservices-speech-sdk/recognizer).

See an example of getting Session ID using JavaScript in [this sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/browser/index.html). Look for `recognizer.sessionStarted = onSessionStarted;` and then for `function onSessionStarted`.

### Get Session ID using Speech CLI

If you use [Speech CLI](spx-overview.md), then you see the Session ID in `SESSION STARTED` and `SESSION STOPPED` console messages.

You can also enable logging for your sessions and get the Session ID from the log file as described in [this section](#get-session-id-from-the-log). Run the appropriate Speech CLI command to get the information on using logs:

```console
spx help recognize log
```
```console
spx help translate log
```


### Provide Session ID using REST API for short audio

Unlike Speech SDK, [Speech to text REST API for short audio](rest-speech-to-text-short.md) doesn't automatically generate a Session ID. You need to generate it yourself and provide it within the REST request.

Generate a GUID inside your code or using any standard tool. Use the GUID value *without dashes or other dividers*. As an example we'll use `9f4ffa5113a846eba289aa98b28e766f`.

As a part of your REST request use `X-ConnectionId=<GUID>` expression. For our example, a sample request looks like this:
```http
https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&X-ConnectionId=9f4ffa5113a846eba289aa98b28e766f
```
`9f4ffa5113a846eba289aa98b28e766f` is your Session ID.

> [!WARNING]
> The value of the parameter `X-ConnectionId` should be in the format of GUID without dashes or other dividers. All other formats aren't supported and will be discarded by the Service. 
>
> Example. If the request contains expressions like these:
>
> - `X-ConnectionId=9f4ffa51-13a8-46eb-a289-aa98b28e766f` (GUID with dividers)
> - `X-ConnectionId=Request9f4ffa5113a846eba289aa98b28e766f` (non-GUID)
> - `X-ConnectionId=5948f700d2a811ee`  (non-GUID)
>
>then the value of `X-ConnectionId` will not be accepted by the system, and the Session won't be found in the logs.

## Getting Transcription ID for Batch transcription

[Batch transcription API](batch-transcription.md) is a subset of the [Speech to text REST API](rest-speech-to-text.md). 

The required Transcription ID is the GUID value contained in the main `self` element of the Response body returned by requests, like [Transcriptions_Create](/rest/api/speechtotext/transcriptions/create).

The following is and example response body of a [Transcriptions_Create](/rest/api/speechtotext/transcriptions/create) request. GUID value `537216f8-0620-4a10-ae2d-00bdb423b36f` found in the first `self` element is the Transcription ID.

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/537216f8-0620-4a10-ae2d-00bdb423b36f",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/824bd685-2d45-424d-bb65-c3fe99e32927"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/537216f8-0620-4a10-ae2d-00bdb423b36f/files"
  },
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false,
    "channels": [
      0,
      1
    ],
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked"
  },
  "lastActionDateTime": "2021-11-19T14:09:51Z",
  "status": "NotStarted",
  "createdDateTime": "2021-11-19T14:09:51Z",
  "locale": "ru-RU",
  "displayName": "transcriptiontest"
}
```
> [!NOTE]
> Use the same technique to determine different IDs required for debugging issues related to [custom speech](custom-speech-overview.md), like uploading a dataset using [Datasets_Create](/rest/api/speechtotext/datasets/create) request.

> [!NOTE]
> You can also see all existing transcriptions and their Transcription IDs for a given Speech resource by using [Transcriptions_Get](/rest/api/speechtotext/transcriptions/get) request.
