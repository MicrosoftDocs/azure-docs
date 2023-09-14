---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/30/2023
author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Convert text to speech

At a command prompt, run the following command. Insert these values into the command:

- Your Speech resource key
- Your Speech resource region

You might also want to change the following values:

- The `X-Microsoft-OutputFormat` header value, which controls the audio output format. You can find a list of supported audio output formats in the [text to speech REST API reference](../../../rest-text-to-speech.md#audio-outputs).
- The output voice. To get a list of voices available for your Speech service endpoint, see the [Voice List API](../../../rest-text-to-speech.md#get-a-list-of-voices).
- The output file. In this example, we direct the response from the server into a file named `output.mp3`.

```curl
curl --location --request POST 'https://YOUR_RESOURCE_REGION.tts.speech.microsoft.com/cognitiveservices/v1' \
--header 'Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY' \
--header 'Content-Type: application/ssml+xml' \
--header 'X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3' \
--header 'User-Agent: curl' \
--data-raw '<speak version='\''1.0'\'' xml:lang='\''en-US'\''>
    <voice xml:lang='\''en-US'\'' xml:gender='\''Female'\'' name='\''en-US-JennyNeural'\''>
        I am excited to try text to speech
    </voice>
</speak>' > output.mp3
```
