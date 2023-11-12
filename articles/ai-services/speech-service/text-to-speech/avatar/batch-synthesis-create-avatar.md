---
title: Create batch synthesis - Speech service
titleSuffix: Azure AI services
description: Learn how to create text to speech avatar batch synthesis
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/15/2023
ms.author: v-baolianzou
keywords: text to speech avatar batch synthesis
---

# Create batch synthesis for text to speech avatar (preview)

To submit a batch synthesis request, construct the HTTP POST request body following these instructions:

- Set the required `textType` property.
- If the `textType` property is set to `PlainText`, you must also set the `voice` property in the `synthesisConfig`. In the example below, the `textType` is set to `SSML`, so the `speechSynthesis` isn't set.
- Set the required `displayName` property. Choose a name for reference, and it doesn't have to be unique.
- Set the required `talkingAvatarCharacter` and `talkingAvatarStyle` properties. You can find supported avatar characters and styles [here](./avatar-gestures-with-ssml.md#supported-pre-built-avatar-characters-styles-and-gestures).
- Optionally, you can set the `videoFormat`, `backgroundColor`, and other properties. For more information, see [batch synthesis properties](batch-synthesis-avatar-properties.md).

> [!NOTE]
> The maximum JSON payload size accepted is 500 kilobytes.
>
> Each Speech resource can have up to 200 batch synthesis jobs running concurrently.
>
> The maximum length for the output video is currently 20 minutes, with potential increases in the future.

To make an HTTP POST request, use the URI format shown in the following example. Replace `YourSpeechKey` with your Speech resource key, `YourSpeechRegion` with your Speech resource region, and set the request body properties as described above.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSpeechKey" -H "Content-Type: application/json" -d '{
    "displayName": "avatar batch synthesis sample",
    "textType": "SSML",
    "inputs": [
        {
         "text": "<speak version='\''1.0'\'' xml:lang='\''en-US'\''>
                <voice name='\''en-US-JennyNeural'\''>
                    The rainbow has seven colors.
                </voice>
            </speak>"
        }
    ],
    "properties": {
        "talkingAvatarCharacter": "lisa",
        "talkingAvatarStyle": "graceful-sitting"
    }
}'  "https://YourSpeechRegion.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis/talkingavatar"
```

You should receive a response body in the following format:

```json
{
    "textType": "SSML",
    "customVoices": {},
    "properties": {
        "timeToLive": "P31D",
        "outputFormat": "riff-24khz-16bit-mono-pcm",
        "talkingAvatarCharacter": "lisa",
        "talkingAvatarStyle": "graceful-sitting",
        "kBitrate": 2000,
        "customized": false
    },
    "lastActionDateTime": "2023-10-19T12:23:03.348Z",
    "status": "NotStarted",
    "id": "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6",
    "createdDateTime": "2023-10-19T12:23:03.348Z",
    "displayName": "avatar batch synthesis sample"
}
```

The `status` property should progress from `NotStarted` status to `Running` and finally to `Succeeded` or `Failed`. You can periodically call the [GET batch synthesis API](get-batch-synthesis-avatar.md) until the returned status is `Succeeded` or `Failed`.


## Get batch synthesis

To retrieve the status of a batch synthesis job, make an HTTP GET request using the URI as shown in the following example. 

Replace `YourSynthesisId` with your batch synthesis ID, `YourSpeechKey` with your Speech resource key, and `YourSpeechRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X GET "https://YourSpeechRegion.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis/talkingavatar/YourSynthesisId" -H "Ocp-Apim-Subscription-Key: YourSpeechKey"
```

You should receive a response body in the following format:

```json
{
    "textType": "SSML",
    "customVoices": {},
    "properties": {
        "audioSize": 336780,
        "durationInTicks": 25200000,
        "succeededAudioCount": 1,
        "duration": "PT2.52S",
        "billingDetails": {
            "customNeural": 0,
            "neural": 29
        },
        "timeToLive": "P31D",
        "outputFormat": "riff-24khz-16bit-mono-pcm",
        "talkingAvatarCharacter": "lisa",
        "talkingAvatarStyle": "graceful-sitting",
        "kBitrate": 2000,
        "customized": false
    },
    "outputs": {
        "result": "https://cvoiceprodwus2.blob.core.windows.net/batch-synthesis-output/c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6/0001.mp4?SAS_Token",
        "summary": "https://cvoiceprodwus2.blob.core.windows.net/batch-synthesis-output/c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6/summary.json?SAS_Token"
    },
    "lastActionDateTime": "2023-10-19T12:23:06.320Z",
    "status": "Succeeded",
    "id": "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6",
    "createdDateTime": "2023-10-19T12:23:03.350Z",
    "displayName": "avatar batch synthesis sample"
}
```

From the `outputs.result` field, you can download a video file containing the avatar video. The `outputs.summary` field allows you to download the summary and debug details. For more information on batch synthesis results, see [batch synthesis results](batch-synthesis-results-avatar.md).


## List batch synthesis

To list all batch synthesis jobs for your Speech resource, make an HTTP GET request using the URI as shown in the following example.

Replace `YourSpeechKey` with your Speech resource key and `YourSpeechRegion` with your Speech resource region. Optionally, you can set the `skip` and `top` (page size) query parameters in the URL. The default value for `skip` is 0, and the default value for `top` is 100.

```azurecli-interactive
curl -v -X GET "https://YourSpeechRegion.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis/talkingavatar?skip=0&top=2" -H "Ocp-Apim-Subscription-Key: YourSpeechKey"
```

You receive a response body in the following format:

```json
{
    "values": [
        {
            "textType": "PlainText",
            "synthesisConfig": {
                "voice": "en-US-JennyNeural"
            },
            "customVoices": {},
            "properties": {
                "audioSize": 339371,
                "durationInTicks": 25200000,
                "succeededAudioCount": 1,
                "duration": "PT2.52S",
                "billingDetails": {
                    "customNeural": 0,
                    "neural": 29
                },
                "timeToLive": "P31D",
                "outputFormat": "riff-24khz-16bit-mono-pcm",
                "talkingAvatarCharacter": "lisa",
                "talkingAvatarStyle": "graceful-sitting",
                "kBitrate": 2000,
                "customized": false
            },
            "outputs": {
                "result": "https://cvoiceprodwus2.blob.core.windows.net/batch-synthesis-output/8e3fea5f-4021-4734-8c24-77d3be594633/0001.mp4?SAS_Token",
                "summary": "https://cvoiceprodwus2.blob.core.windows.net/batch-synthesis-output/8e3fea5f-4021-4734-8c24-77d3be594633/summary.json?SAS_Token"
            },
            "lastActionDateTime": "2023-10-19T12:57:45.557Z",
            "status": "Succeeded",
            "id": "8e3fea5f-4021-4734-8c24-77d3be594633",
            "createdDateTime": "2023-10-19T12:57:42.343Z",
            "displayName": "avatar batch synthesis sample"
        },
        {
            "textType": "SSML",
            "customVoices": {},
            "properties": {
                "audioSize": 336780,
                "durationInTicks": 25200000,
                "succeededAudioCount": 1,
                "duration": "PT2.52S",
                "billingDetails": {
                    "customNeural": 0,
                    "neural": 29
                },
                "timeToLive": "P31D",
                "outputFormat": "riff-24khz-16bit-mono-pcm",
                "talkingAvatarCharacter": "lisa",
                "talkingAvatarStyle": "graceful-sitting",
                "kBitrate": 2000,
                "customized": false
            },
            "outputs": {
                "result": "https://cvoiceprodwus2.blob.core.windows.net/batch-synthesis-output/c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6/0001.mp4?SAS_Token",
                "summary": "https://cvoiceprodwus2.blob.core.windows.net/batch-synthesis-output/c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6/summary.json?SAS_Token"
            },
            "lastActionDateTime": "2023-10-19T12:23:06.320Z",
            "status": "Succeeded",
            "id": "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6",
            "createdDateTime": "2023-10-19T12:23:03.350Z",
            "displayName": "avatar batch synthesis sample"
        }
    ],
    "@nextLink": "https://{region}.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis/talkingavatar?skip=2&top=2"
}
```

From `outputs.result`, you can download a video file containing the avatar video. From `outputs.summary`, you can access the summary and debug details. For more information, see [batch synthesis results](batch-synthesis-results-avatar.md).

The `values` property in the JSON response lists your synthesis requests. The list is paginated, with a maximum page size of 100. The `@nextLink` property is provided as needed to get the next page of the paginated list.

## Get batch synthesis results file

Once you get a batch synthesis job with `status` of "Succeeded", you can download the video output results. Use the URL from the `outputs.result` property of the [get batch synthesis](get-batch-synthesis-avatar.md) response.

To get the batch synthesis results file, make an HTTP GET request using the URI as shown in the following example. Replace `YourOutputsResultUrl` with the URL from the `outputs.result` property of the [get batch synthesis](./get-batch-synthesis-avatar.md) response. Replace `YourSpeechKey` with your Speech resource key.

```azurecli-interactive 
curl -v -X GET "YourOutputsResultUrl" -H "Ocp-Apim-Subscription-Key: YourSpeechKey" > output.mp4
```

To get the batch synthesis summary file, make an HTTP GET request using the URI as shown in the following example. Replace `YourOutputsResultUrl` with the URL from the `outputs.summary` property of the [get batch synthesis](get-batch-synthesis-avatar.md) response. Replace `YourSpeechKey` with your Speech resource key.

```azurecli-interactive
curl -v -X GET "YourOutputsSummaryUrl" -H "Ocp-Apim-Subscription-Key: YourSpeechKey" > summary.json
```

The summary file contains the synthesis results for each text input. Here's an example summary.json file:

```json
{
  "jobID":  "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6",
  "status":  "Succeeded",
  "results":  [
    {
      "texts":  [
        "<speak version='1.0' xml:lang='en-US'>\n\t\t\t\t<voice name='en-US-JennyNeural'>\n\t\t\t\t\tThe rainbow has seven colors.\n\t\t\t\t</voice>\n\t\t\t</speak>"
      ],
      "status":  "Succeeded",
      "billingDetails":  {
        "Neural":  "29",
        "TalkingAvatarDuration":  "2"
      },
      "videoFileName":  "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6/0001.mp4",
      "TalkingAvatarCharacter":  "lisa",
      "TalkingAvatarStyle":  "graceful-sitting"
    }
  ]
}
```

## Delete batch synthesis

After you have retrieved the audio output results and no longer need the batch synthesis job history, you can delete it. The Speech service retains each synthesis history for up to 31 days or the duration specified by the request's `timeToLive` property, whichever comes sooner. The date and time of automatic deletion, for synthesis jobs with a status of "Succeeded" or "Failed" is calculated as the sum of the `lastActionDateTime` and `timeToLive` properties.

To delete a batch synthesis job, make an HTTP DELETE request using the following URI format. Replace `YourSynthesisId` with your batch synthesis ID, `YourSpeechKey` with your Speech resource key, and `YourSpeechRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X DELETE "https://YourSpeechRegion.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis/talkingavatar/YourSynthesisId" -H "Ocp-Apim-Subscription-Key: YourSpeechKey"
```

If the delete request is successful, the response headers include `HTTP/1.1 204 No Content`.


## Next steps

* [Batch synthesis properties](./batch-synthesis-avatar-properties.md)
* [Introduction to batch synthesis for text to speech avatar](batch-synthesis-avatar-overview.md)
* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
