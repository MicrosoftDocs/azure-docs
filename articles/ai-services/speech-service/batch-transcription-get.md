---
title: Get batch transcription results - Speech service
titleSuffix: Azure AI services
description: With batch transcription, the Speech service transcribes the audio data and stores the results in a storage container. You can then retrieve the results from the storage container.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/29/2022
zone_pivot_groups: speech-cli-rest
ms.custom: devx-track-csharp
---

# Get batch transcription results

To get transcription results, first check the [status](#get-transcription-status) of the transcription job. If the job is completed, you can [retrieve](#get-batch-transcription-results) the transcriptions and transcription report. 

## Get transcription status

::: zone pivot="rest-api"

To get the status of the transcription job, call the [Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get) operation of the [Speech to text REST API](rest-speech-to-text.md).

Make an HTTP GET request using the URI as shown in the following example. Replace `YourTranscriptionId` with your transcription ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/YourTranscriptionId" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/aaa321e9-5a4e-4db1-88a2-f251bbe7b555"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files"
  },
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false,
    "displayFormWordLevelTimestampsEnabled": true,
    "channels": [
      0,
      1
    ],
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked",
    "duration": "PT3S",
    "languageIdentification": {
      "candidateLocales": [
        "en-US",
        "de-DE",
        "es-ES"
      ]
    }
  },
  "lastActionDateTime": "2022-09-10T18:39:09Z",
  "status": "Succeeded",
  "createdDateTime": "2022-09-10T18:39:07Z",
  "locale": "en-US",
  "displayName": "My Transcription"
}
```

The `status` property indicates the current status of the transcriptions. The transcriptions and transcription report will be available when the transcription status is `Succeeded`.


::: zone-end

::: zone pivot="speech-cli"

To get the status of the transcription job, use the `spx batch transcription status` command. Construct the request parameters according to the following instructions:

- Set the `transcription` parameter to the ID of the transcription that you want to get. 

Here's an example Speech CLI command to get the transcription status:

```azurecli-interactive
spx batch transcription status --api-version v3.1 --transcription YourTranscriptionId
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/aaa321e9-5a4e-4db1-88a2-f251bbe7b555"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files"
  },
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false,
    "displayFormWordLevelTimestampsEnabled": true,
    "channels": [
      0,
      1
    ],
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked",
    "duration": "PT3S"
  },
  "lastActionDateTime": "2022-09-10T18:39:09Z",
  "status": "Succeeded",
  "createdDateTime": "2022-09-10T18:39:07Z",
  "locale": "en-US",
  "displayName": "My Transcription"
}
```

The `status` property indicates the current status of the transcriptions. The transcriptions and transcription report will be available when the transcription status is `Succeeded`.

For Speech CLI help with transcriptions, run the following command:

```azurecli-interactive
spx help batch transcription
```

::: zone-end

## Get transcription results

::: zone pivot="rest-api"

The [Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles) operation returns a list of result files for a transcription. A [transcription report](#transcription-report-file) file is provided for each submitted batch transcription job. In addition, one [transcription](#transcription-result-file) file (the end result) is provided for each successfully transcribed audio file.  

Make an HTTP GET request using the "files" URI from the previous response body. Replace `YourTranscriptionId` with your transcription ID, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/YourTranscriptionId/files" -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey"
```

You should receive a response body in the following format:

```json
{
  "values": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files/2dd180a1-434e-4368-a1ac-37350700284f",
      "name": "contenturl_0.json",
      "kind": "Transcription",
      "properties": {
        "size": 3407
      },
      "createdDateTime": "2022-09-10T18:39:09Z",
      "links": {
        "contentUrl": "https://spsvcprodeus.blob.core.windows.net/bestor-c6e3ae79-1b48-41bf-92ff-940bea3e5c2d/TranscriptionData/637d9333-6559-47a6-b8de-c7d732c1ddf3_0_0.json?sv=2021-08-06&st=2022-09-10T18%3A36%3A01Z&se=2022-09-11T06%3A41%3A01Z&sr=b&sp=rl&sig=AobsqO9DH9CIOuGC5ifFH3QpkQay6PjHiWn5G87FcIg%3D"
      }
    },
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files/c027c6a9-2436-4303-b64b-e98e3c9fc2e3",
      "name": "contenturl_1.json",
      "kind": "Transcription",
      "properties": {
        "size": 8233
      },
      "createdDateTime": "2022-09-10T18:39:09Z",
      "links": {
        "contentUrl": "https://spsvcprodeus.blob.core.windows.net/bestor-c6e3ae79-1b48-41bf-92ff-940bea3e5c2d/TranscriptionData/637d9333-6559-47a6-b8de-c7d732c1ddf3_1_0.json?sv=2021-08-06&st=2022-09-10T18%3A36%3A01Z&se=2022-09-11T06%3A41%3A01Z&sr=b&sp=rl&sig=wO3VxbhLK4PhT3rwLpJXBYHYQi5EQqyl%2Fp1lgjNvfh0%3D"
      }
    },
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files/faea9a41-c95c-4d91-96ff-e39225def642",
      "name": "report.json",
      "kind": "TranscriptionReport",
      "properties": {
        "size": 279
      },
      "createdDateTime": "2022-09-10T18:39:09Z",
      "links": {
        "contentUrl": "https://spsvcprodeus.blob.core.windows.net/bestor-c6e3ae79-1b48-41bf-92ff-940bea3e5c2d/TranscriptionData/637d9333-6559-47a6-b8de-c7d732c1ddf3_report.json?sv=2021-08-06&st=2022-09-10T18%3A36%3A01Z&se=2022-09-11T06%3A41%3A01Z&sr=b&sp=rl&sig=gk1k%2Ft5qa1TpmM45tPommx%2F2%2Bc%2FUUfsYTX5FoSa1u%2FY%3D"
      }
    }
  ]
}
```

The location of each transcription and transcription report files with more details are returned in the response body. The `contentUrl` property contains the URL to the [transcription](#transcription-result-file) (`"kind": "Transcription"`) or [transcription report](#transcription-report-file) (`"kind": "TranscriptionReport"`) file.

If you didn't specify a container in the `destinationContainerUrl` property of the transcription request, the results are stored in a container managed by Microsoft. When the transcription job is deleted, the transcription result data is also deleted.

::: zone-end

::: zone pivot="speech-cli"

The `spx batch transcription list` command returns a list of result files for a transcription. A [transcription report](#transcription-report-file) file is provided for each submitted batch transcription job. In addition, one [transcription](#transcription-result-file) file (the end result) is provided for each successfully transcribed audio file. 

- Set the required `files` flag.
- Set the required `transcription` parameter to the ID of the transcription that you want to get logs.

Here's an example Speech CLI command that gets a list of result files for a transcription:

```azurecli-interactive
spx batch transcription list --api-version v3.1 --files --transcription YourTranscriptionId
```

You should receive a response body in the following format:

```json
{
  "values": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files/2dd180a1-434e-4368-a1ac-37350700284f",
      "name": "contenturl_0.json",
      "kind": "Transcription",
      "properties": {
        "size": 3407
      },
      "createdDateTime": "2022-09-10T18:39:09Z",
      "links": {
        "contentUrl": "https://spsvcprodeus.blob.core.windows.net/bestor-c6e3ae79-1b48-41bf-92ff-940bea3e5c2d/TranscriptionData/637d9333-6559-47a6-b8de-c7d732c1ddf3_0_0.json?sv=2021-08-06&st=2022-09-10T18%3A36%3A01Z&se=2022-09-11T06%3A41%3A01Z&sr=b&sp=rl&sig=AobsqO9DH9CIOuGC5ifFH3QpkQay6PjHiWn5G87FcIg%3D"
      }
    },
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files/c027c6a9-2436-4303-b64b-e98e3c9fc2e3",
      "name": "contenturl_1.json",
      "kind": "Transcription",
      "properties": {
        "size": 8233
      },
      "createdDateTime": "2022-09-10T18:39:09Z",
      "links": {
        "contentUrl": "https://spsvcprodeus.blob.core.windows.net/bestor-c6e3ae79-1b48-41bf-92ff-940bea3e5c2d/TranscriptionData/637d9333-6559-47a6-b8de-c7d732c1ddf3_1_0.json?sv=2021-08-06&st=2022-09-10T18%3A36%3A01Z&se=2022-09-11T06%3A41%3A01Z&sr=b&sp=rl&sig=wO3VxbhLK4PhT3rwLpJXBYHYQi5EQqyl%2Fp1lgjNvfh0%3D"
      }
    },
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files/faea9a41-c95c-4d91-96ff-e39225def642",
      "name": "report.json",
      "kind": "TranscriptionReport",
      "properties": {
        "size": 279
      },
      "createdDateTime": "2022-09-10T18:39:09Z",
      "links": {
        "contentUrl": "https://spsvcprodeus.blob.core.windows.net/bestor-c6e3ae79-1b48-41bf-92ff-940bea3e5c2d/TranscriptionData/637d9333-6559-47a6-b8de-c7d732c1ddf3_report.json?sv=2021-08-06&st=2022-09-10T18%3A36%3A01Z&se=2022-09-11T06%3A41%3A01Z&sr=b&sp=rl&sig=gk1k%2Ft5qa1TpmM45tPommx%2F2%2Bc%2FUUfsYTX5FoSa1u%2FY%3D"
      }
    }
  ]
}
```

The location of each transcription and transcription report files with more details are returned in the response body. The `contentUrl` property contains the URL to the [transcription](#transcription-result-file) (`"kind": "Transcription"`) or [transcription report](#transcription-report-file) (`"kind": "TranscriptionReport"`) file.

By default, the results are stored in a container managed by Microsoft. When the transcription job is deleted, the transcription result data is also deleted.

::: zone-end

### Transcription report file

One transcription report file is provided for each submitted batch transcription job. 

The contents of each transcription result file are formatted as JSON, as shown in this example.

```json
{
  "successfulTranscriptionsCount": 2,
  "failedTranscriptionsCount": 0,
  "details": [
    {
      "source": "https://crbn.us/hello.wav",
      "status": "Succeeded"
    },
    {
      "source": "https://crbn.us/whatstheweatherlike.wav",
      "status": "Succeeded"
    }
  ]
}
```

### Transcription result file

One transcription result file is provided for each successfully transcribed audio file. 

The contents of each transcription result file are formatted as JSON, as shown in this example.

```json
{
  "source": "...",
  "timestamp": "2023-07-10T14:28:16Z",
  "durationInTicks": 25800000,
  "duration": "PT2.58S",
  "combinedRecognizedPhrases": [
    {
      "channel": 0,
      "lexical": "hello world",
      "itn": "hello world",
      "maskedITN": "hello world",
      "display": "Hello world."
    }
  ],
  "recognizedPhrases": [
    {
      "recognitionStatus": "Success",
      "channel": 0,
      "offset": "PT0.76S",
      "duration": "PT1.32S",
      "offsetInTicks": 7600000.0,
      "durationInTicks": 13200000.0,
      "nBest": [
        {
          "confidence": 0.5643338,
          "lexical": "hello world",
          "itn": "hello world",
          "maskedITN": "hello world",
          "display": "Hello world.",
          "displayWords": [
            {
              "displayText": "Hello",
              "offset": "PT0.76S",
              "duration": "PT0.76S",
              "offsetInTicks": 7600000.0,
              "durationInTicks": 7600000.0
            },
            {
              "displayText": "world.",
              "offset": "PT1.52S",
              "duration": "PT0.56S",
              "offsetInTicks": 15200000.0,
              "durationInTicks": 5600000.0
            }
          ]
        },
        {
          "confidence": 0.1769063,
          "lexical": "helloworld",
          "itn": "helloworld",
          "maskedITN": "helloworld",
          "display": "helloworld"
        },
        {
          "confidence": 0.49964225,
          "lexical": "hello worlds",
          "itn": "hello worlds",
          "maskedITN": "hello worlds",
          "display": "hello worlds"
        },
        {
          "confidence": 0.4995761,
          "lexical": "hello worm",
          "itn": "hello worm",
          "maskedITN": "hello worm",
          "display": "hello worm"
        },
        {
          "confidence": 0.49418187,
          "lexical": "hello word",
          "itn": "hello word",
          "maskedITN": "hello word",
          "display": "hello word"
        }
      ]
    }
  ]
}
```

Depending in part on the request parameters set when you created the transcription job, the transcription file can contain the following result properties.

|Property|Description|
|--------|-----------|
|`channel`|The channel number of the results. For stereo audio streams, the left and right channels are split during the transcription. A JSON result file is created for each input audio file.|
|`combinedRecognizedPhrases`|The concatenated results of all phrases for the channel.|
|`confidence`|The confidence value for the recognition.|
|`display`|The display form of the recognized text. Added punctuation and capitalization are included.|
|`displayWords`|The timestamps for each word of the transcription. The `displayFormWordLevelTimestampsEnabled` request property must be set to `true`, otherwise this property is not present.<br/><br/>**Note**: This property is only available with Speech to text REST API version 3.1.|
|`duration`|The audio duration. The value is an ISO 8601 encoded duration.|
|`durationInTicks`|The audio duration in ticks (1 tick is 100 nanoseconds).|
|`itn`|The inverse text normalized (ITN) form of the recognized text. Abbreviations such as "Doctor Smith" to "Dr Smith", phone numbers, and other transformations are applied.|
|`lexical`|The actual words recognized.|
|`locale`|The locale identified from the input the audio. The `languageIdentification` request property must be set, otherwise this property is not present.<br/><br/>**Note**: This property is only available with Speech to text REST API version 3.1.|
|`maskedITN`|The ITN form with profanity masking applied.|
|`nBest`|A list of possible transcriptions for the current phrase with confidences.|
|`offset`|The offset in audio of this phrase. The value is an ISO 8601 encoded duration.|
|`offsetInTicks`|The offset in audio of this phrase in ticks (1 tick is 100 nanoseconds).|
|`recognitionStatus`|The recognition state. For example: "Success" or "Failure".|
|`recognizedPhrases`|The list of results for each phrase.|
|`source`|The URL that was provided as the input audio source. The source corresponds to the `contentUrls` or `contentContainerUrl` request property. The `source` property is the only way to confirm the audio input for a transcription.|
|`speaker`|The identified speaker. The `diarization` and `diarizationEnabled` request properties must be set, otherwise this property is not present.|
|`timestamp`|The creation date and time of the transcription. The value is an ISO 8601 encoded timestamp.|
|`words`|A list of results with lexical text for each word of the phrase. The `wordLevelTimestampsEnabled` request property must be set to `true`, otherwise this property is not present.|


## Next steps

- [Batch transcription overview](batch-transcription.md)
- [Locate audio files for batch transcription](batch-transcription-audio-data.md)
- [Create a batch transcription](batch-transcription-create.md)
- [See batch transcription code samples at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch/)
