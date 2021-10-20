---
author: v-jaswel
ms.service: cognitive-services
ms.topic: include
ms.date: 10/09/2020
ms.author: v-jawe
---

In this quickstart, you learn how to convert text to speech using the Speech service and cURL.

For a high-level look at Text-To-Speech concepts, see the [overview](../../../text-to-speech.md) article.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Convert text to speech

At a command prompt, run the following command. You will need to insert the following values into the command.
- Your Speech service subscription key.
- Your Speech service region.

You might also wish to change the following values.
- The `X-Microsoft-OutputFormat` header value, which controls the audio output format. You can find a list of supported audio output formats in the [text-to-speech REST API reference](../../../rest-text-to-speech.md#audio-outputs).
- The output voice. To get a list of voices available for your Speech endpoint, see the next section.
- The output file. In this example, we direct the response from the server into a file named `output.wav`.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/text-to-speech.sh":::

## List available voices for your Speech endpoint

To list the available voices for your Speech endpoint, run the following command.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/get-voices.sh" id="request":::

You should receive a response like the following one.

```http
[
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)",
        "DisplayName": "Hoda",
        "LocalName": "هدى",
        "ShortName": "ar-EG-Hoda",
        "Gender": "Female",
        "Locale": "ar-EG",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ar-SA, Naayf)",
        "DisplayName": "Naayf",
        "LocalName": "نايف",
        "ShortName": "ar-SA-Naayf",
        "Gender": "Male",
        "Locale": "ar-SA",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (bg-BG, Ivan)",
        "DisplayName": "Ivan",
        "LocalName": "Иван",
        "ShortName": "bg-BG-Ivan",
        "Gender": "Male",
        "Locale": "bg-BG",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        // This response is truncated. The response will include 
        // a complete list of supported languages and specific 
        // details like short name, gender, etc. 
    }
]
```