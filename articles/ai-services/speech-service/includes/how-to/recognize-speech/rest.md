---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/14/2022
author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Convert speech to text

At a command prompt, run the following command. Insert the following values into the command:
- Your subscription key for the Speech service.
- Your Speech service region.
- The path for input audio files. You can generate audio files by using [text to speech](../../../get-started-text-to-speech.md).

```curl
curl --location --request POST 'https://INSERT_REGION_HERE.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_AUDIO_FILE_PATH_HERE'
```

You should receive a response with a JSON body like the following one:

```json
{
    "RecognitionStatus": "Success",
    "DisplayText": "My voice is my passport, verify me.",
    "Offset": 6600000,
    "Duration": 32100000
}
```

For more information, see the [Speech to text REST API reference](../../../rest-speech-to-text.md).
