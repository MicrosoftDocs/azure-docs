---
title: Use personal voice in your application
titleSuffix: Azure AI services
description: Learn how to integrate personal voice in your application.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 11/15/2023
ms.author: eur
ms.custom: references_regions
---

# Use personal voice (preview) in your application

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

You can use the [speaker profile ID](./personal-voice-create-voice.md) for your personal voice to synthesize speech in any of the 91 languages supported across 100+ locales. A locale tag isn't required. Personal voice uses automatic language detection at the sentence level. 

## Integrate personal voice in your application

You need to use speech synthesis markup language (SSML) to use personal voice in your application. SSML is an XML-based markup language that provides a standard way to mark up text for the generation of synthetic speech. SSML tags are used to control the pronunciation, volume, pitch, rate, and other attributes of the speech synthesis output.

The `speakerProfileId` property is used to specify the [speaker profile ID](./personal-voice-create-voice.md) for the personal voice.

Here's example SSML in a request for text to speech with the voice name and the speaker profile ID. 

```xml
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'>
    <voice xml:lang='en-US' xml:gender='Male' name='PhoenixV2Neural'> 
    <mstts:ttsembedding speakerProfileId='your speaker profile ID here'> 
    I'm happy to hear that you find me amazing and that I have made your trip planning easier and more fun. 我很高兴听到你觉得我很了不起，我让你的旅行计划更轻松、更有趣。Je suis heureux d'apprendre que vous me trouvez incroyable et que j'ai rendu la planification de votre voyage plus facile et plus amusante.  
    </mstts:ttsembedding> 
    </voice> 
</speak> 
```

You can use the SSML via the [Speech SDK](./get-started-text-to-speech.md), [REST API](rest-text-to-speech.md), or [batch synthesis API](batch-synthesis.md).

* **Real-time speech synthesis**: Use the [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md) to convert text to speech.

* **Asynchronous synthesis of long audio**: Use the [batch synthesis API](batch-synthesis.md) (Preview) to asynchronously synthesize text to speech files longer than 10 minutes (for example, audio books or lectures). Unlike synthesis performed via the Speech SDK or Speech to text REST API, responses aren't returned in real-time. The expectation is that requests are sent asynchronously, responses are polled for, and synthesized audio is downloaded when the service makes it available.

## Reference documentation

The API reference documentation is made available to approved customers. You can apply for access [here](https://aka.ms/customneural).

## Next steps

- Learn more about custom neural voice in the [overview](custom-neural-voice.md).
- Learn more about Speech Studio in the [overview](speech-studio-overview.md).
