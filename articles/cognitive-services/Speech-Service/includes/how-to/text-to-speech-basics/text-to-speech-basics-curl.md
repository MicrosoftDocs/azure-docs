---
author: v-jaswel
ms.service: cognitive-services
ms.topic: include
ms.date: 10/09/2020
ms.author: v-jawe
---

In this quickstart, you learn how to convert text to speech by using the Speech service and cURL.

For a high-level look at text-to-speech concepts, see the [overview](../../../text-to-speech.md) article.

## Prerequisites

This article assumes that you have an Azure account and a Speech service subscription. If you don't have an account and a subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Convert text to speech

At a command prompt, run the following command. Insert these values into the command:
- Your subscription key for the Speech service
- Your Speech service region

You might also want to change the following values:
- The `X-Microsoft-OutputFormat` header value, which controls the audio output format. You can find a list of supported audio output formats in the [text-to-speech REST API reference](../../../rest-text-to-speech.md#audio-outputs).
- The output voice. To get a list of voices available for your Speech service endpoint, see the next section.
- The output file. In this example, we direct the response from the server into a file named *output.mp3*.

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/text-to-speech.sh":::

## List available voices for your Speech service endpoint

To list the available voices for your Speech service endpoint, run the following command:

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/get-voices.sh" id="request":::

You should receive a response like the following one:

```http
[
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (en-US, ChristopherNeural)",
        "DisplayName": "Christopher",
        "LocalName": "Christopher",
        "ShortName": "en-US-ChristopherNeural",
        "Gender": "Male",
        "Locale": "en-US",
        "LocaleName": "English (United States)",
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
        "DisplayName": "Jenny",
        "LocalName": "Jenny",
        "ShortName": "en-US-JennyNeural",
        "Gender": "Female",
        "Locale": "en-US",
        "LocaleName": "English (United States)",
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
        "DisplayName": "Xiaoxiao",
        "LocalName": "晓晓",
        "ShortName": "zh-CN-XiaoxiaoNeural",
        "Gender": "Female",
        "Locale": "zh-CN",
        "LocaleName": "Chinese (Mandarin, Simplified)",
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA"
    },
    {
        // This response is truncated. The response will include 
        // a complete list of supported languages and specific 
        // details like short name, gender, etc. 
    }
]
```
