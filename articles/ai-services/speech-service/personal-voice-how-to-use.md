---
title: Use personal voice in your application
titleSuffix: Azure AI services
description: Learn how to integrate personal voice in your application.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 1/10/2024
ms.author: eur
ms.custom: references_regions
---

# Use personal voice (preview) in your application

[!INCLUDE [Personal voice preview](./includes/previews/preview-personal-voice.md)]

You can use the [speaker profile ID](./personal-voice-create-voice.md) for your personal voice to synthesize speech in any of the 91 languages supported across 100+ locales. A locale tag isn't required. Personal voice uses automatic language detection at the sentence level. 

## Integrate personal voice in your application

You need to use [speech synthesis markup language (SSML)](./speech-synthesis-markup-voice.md#speaker-profile-id) to use personal voice in your application. SSML is an XML-based markup language that provides a standard way to mark up text for the generation of synthetic speech. SSML tags are used to control the pronunciation, volume, pitch, rate, and other attributes of the speech synthesis output.

- The `speakerProfileId` property in SSML is used to specify the [speaker profile ID](./personal-voice-create-voice.md) for the personal voice.

- The voice name is specified in the `name` property in SSML. For personal voice, the voice name must be one of the supported base model voice names. To get a list of supported base model voice names, use the `BaseModels_List` operation of the custom voice API.
  
  > [!NOTE]
  > The voice names labeled with the `Latest`, such as `DragonLatestNeural` or `PhoenixLatestNeural`, will be updated from time to time; its performance may vary with updates for ongoing improvements. If you would like to use a stable version, select one labeled with a version number, such as `PhoenixV2Neural`.

- `Dragon` is a base model with superior voice cloning similarity compared to `Phoenix`. `Phoenix` is a base model with more accurate pronunciation and lower latency than `Dragon`.  
  
Here's example SSML in a request for text to speech with the voice name and the speaker profile ID. 

```xml
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'>
    <voice name='DragonLatestNeural'> 
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

> [!div class="nextstepaction"]
> [Custom voice API specification - 2023-12-01-preview](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/Speech/TextToSpeech/preview/2023-12-01-preview/texttospeech.json/)

## Next steps

- Learn more about custom neural voice in the [overview](custom-neural-voice.md).
- Learn more about Speech Studio in the [overview](speech-studio-overview.md).
