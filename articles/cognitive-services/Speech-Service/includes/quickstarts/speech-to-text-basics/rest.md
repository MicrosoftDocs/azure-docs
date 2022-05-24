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

At a command prompt, run the following cURL command. Insert the following values into the command. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and replace `YourAudioFile.wav` with the path and name of your audio file.

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

You should receive a response similar to what is shown here. The `DisplayText` should be the text that was recognized from your audio file.

```console
{
    "RecognitionStatus": "Success",
    "DisplayText": "My voice is my passport, verify me.",
    "Offset": 6600000,
    "Duration": 32100000
}
```

For more information, see [speech-to-text REST API for short audio](../../../rest-speech-to-text-short.md).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Recognize-speech-from-a-file" target="_target">I ran into an issue</a>


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
