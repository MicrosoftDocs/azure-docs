---
title: How to get Speech-to-text Session ID and Transcription ID
titleSuffix: Azure Cognitive Services
description: Learn how to get Speech service Speech-to-text Session ID and Transcription ID
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/19/2021
ms.author: alexeyo 
---

# How to get Speech-to-text Session ID and Transcription ID

When opening support cases in connection with [Speech-to-text](speech-to-text.md), customers are often asked to provide a *Session ID* or *Transcription ID* of the problematic transcriptions to debug the issue. This article explains how to get these IDs. 

> [!NOTE]
> * *Session ID* are used in [Online transcription](get-started-speech-to-text.md) and [Translation](speech-translation.md).
> * *Transcription ID* are used in [Batch transcription](batch-transcription.md).

## Getting Session ID for Online transcription and Translation. (Speech SDK).

[Online transcription](get-started-speech-to-text.md) and [Translation](speech-translation.md) are performed with the help of the [Speech SDK](speech-sdk.md). To get the Session ID, you need to:

1. Enable application logging.
1. Find the Session ID inside the log.

If you use [Speech CLI](spx-overview.md), you can also get the Session ID interactively. See details [below](#get-session-id-using-speech-cli).

### Enable logging in the Speech SDK

Enable logging for your application as described in [this article](how-to-use-logging.md).

### Get Session ID from the log

Open the log file your application produced and look for `SessionId:`. The number, that would follow is the Session ID you need. In the log excerpt example below `0b734c41faf8430380d493127bd44631` is the Session ID.

```
[874193]: 218ms SPX_DBG_TRACE_VERBOSE:  audio_stream_session.cpp:1238 [0000023981752A40]CSpxAudioStreamSession::FireSessionStartedEvent: Firing SessionStarted event: SessionId: 0b734c41faf8430380d493127bd44631
```

### Get Session ID using Speech CLI

If you use [Speech CLI](spx-overview.md), then you will see the Session ID in `SESSION STARTED` and `SESSION STOPPED` console messages.

You can also enable logging for your sessions and get the Session ID from the log file as described above. Run the following Speech CLI command to get the information on using logs:

```console
spx help recognize log
```
## Getting Transcription ID for Batch transcription. (REST API).

[Batch transcription](batch-transcription.md) is using [Speech-to-text REST API v3.0](rest-speech-to-text.md#speech-to-text-rest-api-v30). 

The required Transcription ID is the GUID value contained in the main `self` element of the Response body returned by requests, like [Create Transcription](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription).

The example below is the Response body of a `Create Transcription` request. GUID value `537216f8-0620-4a10-ae2d-00bdb423b36f` found in the first `self` element in the Transcription ID.

```json
{
  "self": "https://japaneast.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/537216f8-0620-4a10-ae2d-00bdb423b36f",
  "model": {
    "self": "https://japaneast.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/824bd685-2d45-424d-bb65-c3fe99e32927"
  },
  "links": {
    "files": "https://japaneast.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/537216f8-0620-4a10-ae2d-00bdb423b36f/files"
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
> Use the same technique to determine different IDs required for debugging issues related to [Custom Speech](custom-speech-overview.md), like uploading a dataset using [Create Dataset](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset) request.

> [!NOTE]
> You can also see all existing transcriptions and their Transcription IDs for a given Speech resource by using [Get Transcriptions](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptions) request.
