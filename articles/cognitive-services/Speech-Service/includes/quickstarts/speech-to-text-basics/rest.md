---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/30/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Recognize speech from a file

At a command prompt, run the following cURL command. Insert the following values into the command. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and replace `YourAudioFile.wav` with the path and name of your audio file.  

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

```console
key="YourSubscriptionKey"
region="YourServiceRegion"
audio_file=@'YourAudioFile.wav'

curl --location --request POST \
"https://$region.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US" \
--header "Ocp-Apim-Subscription-Key: $key" \
--header "Content-Type: audio/wav" \
--data-binary $audio_file
```

You should receive a response similar to what is shown here. The `DisplayText` should be the text that was recognized from your audio file. Up to 30 seconds of audio will be recognized and converted to text.

```console
{
    "RecognitionStatus": "Success",
    "DisplayText": "My voice is my passport, verify me.",
    "Offset": 6600000,
    "Duration": 32100000
}
```

For more information, see [speech-to-text REST API for short audio](../../../rest-speech-to-text-short.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
