---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/24/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

You also need a *.wav* audio file on your local machine. You can use your own *.wav* file up to 60 seconds or download the [https://crbn.us/whatstheweatherlike.wav](https://crbn.us/whatstheweatherlike.wav) sample file.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Recognize speech from a file

Open a console window and run the following cURL command. Replace *YourAudioFile.wav* with the path and name of your audio file.  

# [Windows](#tab/windows)

```terminal
curl --location --request POST "https://%SPEECH_REGION%.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed" ^
--header "Ocp-Apim-Subscription-Key: %SPEECH_KEY%" ^
--header "Content-Type: audio/wav" ^
--data-binary "@YourAudioFile.wav"
```

# [Linux](#tab/linux)

```terminal
audio_file=@'YourAudioFile.wav'

curl --location --request POST \
"https://${SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed" \
--header "Ocp-Apim-Subscription-Key: ${SPEECH_KEY}" \
--header "Content-Type: audio/wav" \
--data-binary $audio_file
```

# [macOS](#tab/macos)

```terminal
audio_file=@'YourAudioFile.wav'

curl --location --request POST \
"https://${SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed" \
--header "Ocp-Apim-Subscription-Key: ${SPEECH_KEY}" \
--header "Content-Type: audio/wav" \
--data-binary $audio_file
```

* * *

> [!IMPORTANT]
> Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described in [Set environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

You should receive a response similar to what is shown here. The `DisplayText` should be the text that was recognized from your audio file. The command recognizes up to 60 seconds of audio and converts it to text.

```output
{
    "RecognitionStatus": "Success",
    "DisplayText": "My voice is my passport, verify me.",
    "Offset": 6600000,
    "Duration": 32100000
}
```

For more information, see [Speech to text REST API for short audio](../../../rest-speech-to-text-short.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
