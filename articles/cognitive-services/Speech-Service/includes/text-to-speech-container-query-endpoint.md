---
title: Query Text-to-speech container endpoint
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 08/31/2020
ms.author: aahi
---

The container provides [REST-based endpoint APIs](../rest-text-to-speech.md). There are many [sample source code projects](https://github.com/Azure-Samples/Cognitive-Speech-TTS) for platform, framework, and language variations available.

With the Standard or Neural Text-to-speech containers, you should rely on the locale and voice of the image tag you downloaded. For example, if you downloaded the `latest` tag the default locale is `en-US` and the `AriaNeural` voice. The `{VOICE_NAME}` argument would then be [`en-US-AriaNeural`](../language-support.md#neural-voices). See the example SSML below:

```xml
<speak version="1.0" xml:lang="en-US">
    <voice name="en-US-AriaNeural">
        This text will get converted into synthesized speech.
    </voice>
</speak>
```
