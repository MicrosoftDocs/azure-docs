---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/13/2024
ms.author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Convert speech to text

At a command prompt, run the following command. Insert the following values into the command:
- Your subscription key for the Speech resource
- Your Speech service region
- The path for input audio file

```curl
curl --location --request POST 'https://INSERT_REGION_HERE.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US' \
--header 'Ocp-Apim-Subscription-Key: INSERT_SUBSCRIPTION_KEY_HERE' \
--header 'Content-Type: audio/wav' \
--data-binary @'INSERT_AUDIO_FILE_PATH_HERE'
```

You should receive a response like the following example:

```json
{
    "RecognitionStatus": "Success",
    "DisplayText": "My voice is my passport, verify me.",
    "Offset": 6600000,
    "Duration": 32100000
}
```

For more information, see the [Speech to text REST API reference](../../../rest-speech-to-text.md).
