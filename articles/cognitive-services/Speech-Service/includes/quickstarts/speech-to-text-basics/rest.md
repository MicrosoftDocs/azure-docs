---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Recognize speech from a file

At a command prompt, run the following cURL command. Insert the following values into the command. Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

```console
# curl
speech_key="YourSubscriptionKey"
region="YourServiceRegion"

curl --location --request POST \
"https://YourServiceRegion.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US" \
--header "Ocp-Apim-Subscription-Key: YourSubscriptionKey" \
--header "Content-Type: audio/wav" \
--data-binary @'YourAudioFile.wav'
```

You should receive a response similar to what is shown here. The `DisplayText` should be the text that was recognized from your audio file.

```console
{
    "RecognitionStatus": "Success",
    "DisplayText": "My voice is my passport, verify me.",
    "Offset": 6600000,
    "Duration": 32100000
}
```

For more information, see [speech-to-text REST API for short audio](../../../rest-speech-to-text.md).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
