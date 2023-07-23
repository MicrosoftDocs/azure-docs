---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/15/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Synthesize to a file

At a command prompt, run the following cURL command. Optionally you can rename `output.mp3` to another output filename.

**Choose your target environment**

# [Windows](#tab/windows)

```terminal
curl --location --request POST "https://%SPEECH_REGION%.tts.speech.microsoft.com/cognitiveservices/v1" ^
--header "Ocp-Apim-Subscription-Key: %SPEECH_KEY%" ^
--header "Content-Type: application/ssml+xml" ^
--header "X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3" ^
--header "User-Agent: curl" ^
--data-raw "<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>my voice is my passport verify me</voice></speak>" --output output.mp3
```

# [Linux](#tab/linux)

```terminal
curl --location --request POST "https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1" \
--header "Ocp-Apim-Subscription-Key: ${SPEECH_KEY}" \
--header 'Content-Type: application/ssml+xml' \
--header 'X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3' \
--header 'User-Agent: curl' \
--data-raw '<speak version='\''1.0'\'' xml:lang='\''en-US'\''>
    <voice xml:lang='\''en-US'\'' xml:gender='\''Female'\'' name='\''en-US-JennyNeural'\''>
        my voice is my passport verify me
    </voice>
</speak>' > output.mp3
```

# [macOS](#tab/macos)

```terminal
curl --location --request POST "https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1" \
--header "Ocp-Apim-Subscription-Key: ${SPEECH_KEY}" \
--header 'Content-Type: application/ssml+xml' \
--header 'X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3' \
--header 'User-Agent: curl' \
--data-raw '<speak version='\''1.0'\'' xml:lang='\''en-US'\''>
    <voice xml:lang='\''en-US'\'' xml:gender='\''Female'\'' name='\''en-US-JennyNeural'\''>
        my voice is my passport verify me
    </voice>
</speak>' > output.mp3
```

* * *

> [!IMPORTANT]
> Make sure that you set the `SPEECH__KEY` and `SPEECH__REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

The provided text should be output to an audio file named output.mp3.

To change the speech synthesis language, replace `en-US-JennyNeural` with another [supported voice](~/articles/ai-services/speech-service/language-support.md#prebuilt-neural-voices). All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice does not speak the language of the input text, the Speech service won't output synthesized audio.

For more information, see [Text to speech REST API](../../../rest-text-to-speech.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
