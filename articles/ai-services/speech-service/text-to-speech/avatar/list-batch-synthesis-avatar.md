---
title: List batch synthesis - Speech service
titleSuffix: Azure AI services
description: Learn how to list Text to speech Avatar batch synthesis
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar batch synthesis
---

# List batch synthesis

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

## Next steps

* [Get started with Text to speech Avatar](get-started-avatar.md)
* [What is Text to speech Avatar](what-is-text-to-speech-avatar.md)
* [Introduction to batch synthesis](introduction-to-batch-synthesis-avatar.md)
* [Create batch synthesis](create-batch-synthesis-avatar.md)
* [Get batch synthesis](get-batch-synthesis-avatar.md)
* [Batch synthesis results](batch-synthesis-results-avatar.md)
* [What is Custom Text to speech Avatar](what-is-custom-tts-avatar.md)
