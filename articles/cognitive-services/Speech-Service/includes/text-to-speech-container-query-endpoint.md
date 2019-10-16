---
title: Query Text-to-speech container endpoint
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/16/2019
ms.author: dapine
---

The container provides [REST-based endpoint APIs](../rest-text-to-speech.md). There are many [sample source code projects](https://azure.microsoft.com/resources/samples/cognitive-speech-tts/) for platform, framework, and language variations available.

Let's construct an HTTP POST request, providing a few headers and a data payload. Replace the `{HOST}` and `{VOICE_NAME}` placeholders with your own values.

With *Standard Text-to-speech* container you should rely on the locale and voice of the image tag you downloaded. For example, if you downloaded the `latest` tag the default locale is `en-US` and the `JessaRUS` voice. The `{VOICE_NAME}` argument would then be `en-US-JessaRUS`.

However, for *Custom Text-to-speech* you'll need to obtain the **Voice / model** from the [Custom Voice portal](https://aka.ms/custom-voice-portal). The custom model name is synonymous with the voice name. Navigate to the **Training** page, and copy the **Voice / model** to use as the `{VOICE_NAME}` argument.

:::image type="content" source="../media/custom-voice/custom-voice-model-voince-name.png" alt-text="Custom voice model - voice name":::

```curl
curl -s -v -X POST {HOST}/speech/synthesize/cognitiveservices/v1 \
 -H 'Accept: audio/*' \
 -H 'Content-Type: application/ssml+xml' \
 -H 'X-Microsoft-OutputFormat: riff-16khz-16bit-mono-pcm' \
 -d '<speak version="1.0" xml:lang="en"><voice name="{VOICE_NAME}">This is a test, only a test.</voice></speak>'
```

This command:

* Constructs an HTTP POST request for the `speech/synthesize/cognitiveservices/v1` endpoint.
* Specifies an `Accept` header of `audio/*`
* Specifies a `Content-Type` header of `application/ssml+xml`, for more information, see [request body](../rest-text-to-speech.md#request-body).
* Specifies a `X-Microsoft-OutputFormat` header of `riff-16khz-16bit-mono-pcm`, for more options see [audio output](../rest-text-to-speech.md#audio-outputs).
* Sends the [Speech Synthesis Markup Language (SSML)](../speech-synthesis-markup.md) request given the `{VOICE_NAME}` to the endpoint.