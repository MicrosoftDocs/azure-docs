---
title: Query Text-to-speech container endpoint
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

The container provides [REST-based endpoint APIs](../rest-text-to-speech.md). There are many [sample source code projects](https://github.com/Azure-Samples/Cognitive-Speech-TTS) for platform, framework, and language variations available.

With the *Standard Text-to-speech* container, you should rely on the locale and voice of the image tag you downloaded. For example, if you downloaded the `latest` tag the default locale is `en-US` and the `JessaRUS` voice. The `{VOICE_NAME}` argument would then be [`en-US-JessaRUS`](../language-support.md#standard-voices). See the example SSML below:

```xml
<speak version="1.0" xml:lang="en-US">
    <voice name="en-US-JessaRUS">
        This text will get converted into synthesized speech.
    </voice>
</speak>
```

However, for *Custom Text-to-speech* you'll need to obtain the **Voice / model** from the [custom voice portal](https://aka.ms/custom-voice-portal). The custom model name is synonymous with the voice name. Navigate to the **Training** page, and copy the **Voice / model** to use as the `{VOICE_NAME}` argument.
<br><br>
:::image type="content" source="../media/custom-voice/custom-voice-model-voice-name.png" alt-text="Custom voice model - voice name":::

See the example SSML below:

```xml
<speak version="1.0" xml:lang="en-US">
    <voice name="custom-voice-model">
        This text will get converted into synthesized speech.
    </voice>
</speak>
```

Let's construct an HTTP POST request, providing a few headers and a data payload. Replace the `{VOICE_NAME}` placeholder with your own value.

```curl
curl -s -v -X POST http://localhost:5000/speech/synthesize/cognitiveservices/v1 \
 -H 'Accept: audio/*' \
 -H 'Content-Type: application/ssml+xml' \
 -H 'X-Microsoft-OutputFormat: riff-16khz-16bit-mono-pcm' \
 -d '<speak version="1.0" xml:lang="en-US"><voice name="{VOICE_NAME}">This is a test, only a test.</voice></speak>'
```

This command:

* Constructs an HTTP POST request for the `speech/synthesize/cognitiveservices/v1` endpoint.
* Specifies an `Accept` header of `audio/*`
* Specifies a `Content-Type` header of `application/ssml+xml`, for more information, see [request body](../rest-text-to-speech.md#request-body).
* Specifies a `X-Microsoft-OutputFormat` header of `riff-16khz-16bit-mono-pcm`, for more options see [audio output](../rest-text-to-speech.md#audio-outputs).
* Sends the [Speech Synthesis Markup Language (SSML)](../speech-synthesis-markup.md) request given the `{VOICE_NAME}` to the endpoint.