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
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar batch synthesis
---

# Create batch synthesis

To submit a batch synthesis request, construct the HTTP POST request body following these instructions:

- Set the required `textType` property.
- If the `textType` property is set to `PlainText`, you must also set the `voice` property in the `synthesisConfig`. In the example below, the `textType` is set to `SSML`, so the `speechSynthesis` isn't set.
- Set the required `displayName` property. Choose a name for reference, and it doesn't have to be unique.
- Set the required `talkingAvatarCharacter` and `talkingAvatarStyle` properties. You can find supported avatar characters and styles [here](what-is-text-to-speech-avatar.md).
- Optionally, you can set the `videoFormat`, `backgroundColor`, and other properties. For more information, see [batch synthesis properties](batch-synthesis-properties-avatar.md).

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

## Next steps

* [Get started with text to speech avatar](get-started-avatar.md)
* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Introduction to batch synthesis](introduction-to-batch-synthesis-avatar.md)
* [Create batch synthesis](create-batch-synthesis-avatar.md)
* [Get batch synthesis](get-batch-synthesis-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
