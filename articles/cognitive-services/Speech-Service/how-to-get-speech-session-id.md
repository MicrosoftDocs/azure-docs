---
title: How to get Speech-to-text Session ID and Transcription ID
titleSuffix: Azure Cognitive Services
description: Learn how to get Speech service Speech-to-text Session ID and Transcription ID
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/19/2021
ms.author: alexeyo 
---

# How to get Speech-to-text Session ID and Transcription ID

If you use [Speech-to-text](speech-to-text.md) and need to open a support case, you are often asked to provide a *Session ID* or *Transcription ID* of the problematic transcriptions to debug the issue. This article explains how to get these IDs. 

> [!NOTE]
> * *Session ID* is used in [Online transcription](get-started-speech-to-text.md) and [Translation](speech-translation.md).
> * *Transcription ID* is used in [Batch transcription](batch-transcription.md).

## Getting Session ID for Online transcription and Translation. (Speech SDK and REST API for short audio).

[Online transcription](get-started-speech-to-text.md) and [Translation](speech-translation.md) use either the [Speech SDK](speech-sdk.md) or the [REST API for short audio](rest-speech-to-text-short.md).

To get the Session ID, when using SDK you need to:

1. Enable application logging.
1. Find the Session ID inside the log.

If you use [Speech CLI](spx-overview.md), you can also get the Session ID interactively. See details [below](#get-session-id-using-speech-cli).

In case of [Speech-to-text REST API for short audio](rest-speech-to-text-short.md) you need to "inject" the session information in the requests. See details [below](#provide-session-id-using-rest-api-for-short-audio).

### Enable logging in the Speech SDK

Enable logging for your application as described in [this article](how-to-use-logging.md).

### Get Session ID from the log

Open the log file your application produced and look for `SessionId:`. The number, that would follow is the Session ID you need. In the log excerpt example below `0b734c41faf8430380d493127bd44631` is the Session ID.

```
[874193]: 218ms SPX_DBG_TRACE_VERBOSE:  audio_stream_session.cpp:1238 [0000023981752A40]CSpxAudioStreamSession::FireSessionStartedEvent: Firing SessionStarted event: SessionId: 0b734c41faf8430380d493127bd44631
```

### Get Session ID using Speech CLI

If you use [Speech CLI](spx-overview.md), then you will see the Session ID in `SESSION STARTED` and `SESSION STOPPED` console messages.

You can also enable logging for your sessions and get the Session ID from the log file as described above. Run the appropriate Speech CLI command to get the information on using logs:

```console
spx help recognize log
```
```console
spx help translate log
```


### Provide Session ID using REST API for short audio

Unlike Speech SDK, [Speech-to-text REST API for short audio](rest-speech-to-text-short.md) does not automatically generate a Session ID. You need to generate it yourself and provide it within the REST request.

Generate a GUID inside your code or using any standard tool. Use the GUID value *without dashes or other dividers*. As an example we will use `9f4ffa5113a846eba289aa98b28e766f`.

As a part of your REST request use `X-ConnectionId=<GUID>` expression. For our example, a sample request will look like this:
```http
https://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&X-ConnectionId=9f4ffa5113a846eba289aa98b28e766f
```
`9f4ffa5113a846eba289aa98b28e766f` will be your Session ID.

## Getting Transcription ID for Batch transcription

[Batch transcription](batch-transcription.md) uses [Speech-to-text REST API](rest-speech-to-text.md). 

The required Transcription ID is the GUID value contained in the main `self` element of the Response body returned by requests, like [Transcriptions_Create](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create).

The example below is the Response body of a `Create Transcription` request. GUID value `537216f8-0620-4a10-ae2d-00bdb423b36f` found in the first `self` element is the Transcription ID.

```json
{
  "self": "https://japaneast.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/537216f8-0620-4a10-ae2d-00bdb423b36f",
  "model": {
    "self": "https://japaneast.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/824bd685-2d45-424d-bb65-c3fe99e32927"
  },
  "links": {
    "files": "https://japaneast.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/537216f8-0620-4a10-ae2d-00bdb423b36f/files"
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
> Use the same technique to determine different IDs required for debugging issues related to [Custom Speech](custom-speech-overview.md), like uploading a dataset using [Datasets_Create](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create) request.

> [!NOTE]
> You can also see all existing transcriptions and their Transcription IDs for a given Speech resource by using [GetTranscriptions](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/GetTranscriptions) request.
