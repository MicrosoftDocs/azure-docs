---
title: How to get Speech to text Session ID and Transcription ID
titleSuffix: Azure AI services
description: Learn how to get Speech service Speech to text Session ID and Transcription ID
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/29/2022
ms.author: alexeyo 
---

# How to get Speech to text Session ID and Transcription ID

If you use [Speech to text](speech-to-text.md) and need to open a support case, you are often asked to provide a *Session ID* or *Transcription ID* of the problematic transcriptions to debug the issue. This article explains how to get these IDs. 

> [!NOTE]
> * *Session ID* is used in [real-time speech to text](get-started-speech-to-text.md) and [speech translation](speech-translation.md).
> * *Transcription ID* is used in [Batch transcription](batch-transcription.md).

## Getting Session ID

[Real-time speech to text](get-started-speech-to-text.md) and [speech translation](speech-translation.md) use either the [Speech SDK](speech-sdk.md) or the [REST API for short audio](rest-speech-to-text-short.md).

To get the Session ID, when using SDK you need to:

1. Enable application logging.
1. Find the Session ID inside the log.

If you use Speech SDK for JavaScript, get the Session ID as described in [this section](#get-session-id-using-javascript).

If you use [Speech CLI](spx-overview.md), you can also get the Session ID interactively. See details in [this section](#get-session-id-using-speech-cli).

In case of [Speech to text REST API for short audio](rest-speech-to-text-short.md) you need to "inject" the session information in the requests. See details in [this section](#provide-session-id-using-rest-api-for-short-audio).

### Enable logging in the Speech SDK

Enable logging for your application as described in [this article](how-to-use-logging.md).

### Get Session ID from the log

Open the log file your application produced and look for `SessionId:`. The number that would follow is the Session ID you need. In the following log excerpt example `0b734c41faf8430380d493127bd44631` is the Session ID.

```
[874193]: 218ms SPX_DBG_TRACE_VERBOSE:  audio_stream_session.cpp:1238 [0000023981752A40]CSpxAudioStreamSession::FireSessionStartedEvent: Firing SessionStarted event: SessionId: 0b734c41faf8430380d493127bd44631
```
### Get Session ID using JavaScript

If you use Speech SDK for JavaScript, you get Session ID with the help of `sessionStarted` event from the [Recognizer class](/javascript/api/microsoft-cognitiveservices-speech-sdk/recognizer).

See an example of getting Session ID using JavaScript in [this sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/browser/index.html). Look for `recognizer.sessionStarted = onSessionStarted;` and then for `function onSessionStarted`.

### Get Session ID using Speech CLI

If you use [Speech CLI](spx-overview.md), then you'll see the Session ID in `SESSION STARTED` and `SESSION STOPPED` console messages.

You can also enable logging for your sessions and get the Session ID from the log file as described in [this section](#get-session-id-from-the-log). Run the appropriate Speech CLI command to get the information on using logs:

```console
spx help recognize log
```
```console
spx help translate log
```


### Provide Session ID using REST API for short audio

Unlike Speech SDK, [Speech to text REST API for short audio](rest-speech-to-text-short.md) does not automatically generate a Session ID. You need to generate it yourself and provide it within the REST request.

Generate a GUID inside your code or using any standard tool. Use the GUID value *without dashes or other dividers*. As an example we will use `9f4ffa5113a846eba289aa98b28e766f`.

As a part of your REST request use `X-ConnectionId=<GUID>` expression. For our example, a sample request will look like this:
```http
https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&X-ConnectionId=9f4ffa5113a846eba289aa98b28e766f
```
`9f4ffa5113a846eba289aa98b28e766f` will be your Session ID.

> [!WARNING]
> The value of the parameter `X-ConnectionId` should be in the format of GUID without dashes or other dividers. All other formats aren't supported and will be discarded by the Service. 
>
> Example. If the request contains  `X-ConnectionId=9f4ffa51-13a8-46eb-a289-aa98b28e766f` (GUID with dividers) or `X-ConnectionId=Request9f4ffa5113a846eba289aa98b28e766f` (non-GUID) then the value of `X-ConnectionId` will not be accepted by the system, and the Session won't be found in the logs.

## Getting Transcription ID for Batch transcription

[Batch transcription API](batch-transcription.md) is a subset of the [Speech to text REST API](rest-speech-to-text.md). 

The required Transcription ID is the GUID value contained in the main `self` element of the Response body returned by requests, like [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create).

The following is and example response body of a [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) request. GUID value `537216f8-0620-4a10-ae2d-00bdb423b36f` found in the first `self` element is the Transcription ID.

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
> Use the same technique to determine different IDs required for debugging issues related to [Custom Speech](custom-speech-overview.md), like uploading a dataset using [Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create) request.

> [!NOTE]
> You can also see all existing transcriptions and their Transcription IDs for a given Speech resource by using [Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get) request.
