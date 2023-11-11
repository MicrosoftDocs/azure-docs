---
title: Get batch synthesis - Speech service
titleSuffix: Azure AI services
description: Learn how to retrieve the status of the text to speech avatar batch synthesis job
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar batch synthesis
---

# Get batch synthesis

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

From the `outputs.result` field, you can download a video file containing the avatar video. The `outputs.summary` field allows you to download the summary and debug details. For more information on batch synthesis results, refer to [batch synthesis results](batch-synthesis-results-avatar.md).

## Next steps

* [Get started with text to speech avatar](get-started-avatar.md)
* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Introduction to batch synthesis](introduction-to-batch-synthesis-avatar.md)
* [Create batch synthesis](create-batch-synthesis-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
