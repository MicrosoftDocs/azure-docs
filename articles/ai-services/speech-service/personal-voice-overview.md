---
title: What is personal voice?
titleSuffix: Azure AI services
description: With personal voice (preview), you can get AI generated replication of your voice (or users of your application) in a few seconds.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 11/15/2023
ms.author: eur
ms.custom: references_regions
---

# What is personal voice (preview) for text to speech? 

With personal voice (preview), you can get AI generated replication of your voice (or users of your application) in a few seconds. You provide a one-minute speech sample as the audio prompt, and then use it to generate speech in any of the more than 90 languages supported across more than 100 locales.  

> [!NOTE]
> Personal voice is available in these regions: West Europe, East US, and South East Asia. 
> For supported locales, see [personal voice language support](./language-support.md#personal-voice).

The following table summarizes the difference between custom neural voice pro and personal voice.  
 
| Comparison | Personal voice (preview) | Custom neural voice pro |
|-------|-------------------------|-----|
| Target scenarios | Business customers to build an app to allow their users to create and use their own personal voice in the app. | Professional scenarios like brand and character voices for chat bots, or audio content reading. |
| Training data | Make sure you follow the code of conduct. | Bring your own data. Recording in a professional studio is recommended. |
| Required data size | One minute of human speech. | 300-2000 utterances (about 30 minutes to 3 hours of human speech). |
| Training time | Less than 5 seconds | Approximately 20-40 compute hours. |
| Voice quality | Natural | Highly natural |
| Multilingual support | Yes. The voice is able to speak about 100 languages, with automatic language detection enabled. | Yes. You need to select the "Neural – cross lingual" feature to train a model that speaks a different language from the training data. |
| Availability | The demo on [Speech Studio](https://aka.ms/speechstudio/) is available upon registration. | Access to the API is restricted to eligible customers and approved use cases. Request access through the intake form. You can only train and deploy a CNV Pro model after access is approved. CNV Pro access is limited based on eligibility and usage criteria. Request access through the intake form. |
| Pricing | To be announced later. | Check the pricing details [here](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). |
| RAI requirements | Speaker's verbal statement required. No unapproved use case allowed. | Speaker's verbal statement required. No unapproved use case allowed. |

## Try the demo

The demo in Speech Studio is made available to approved customers. You can apply for access [here](https://aka.ms/customneural).

1. Go to [Speech Studio](https://aka.ms/speechstudio/)
1. Select the **Personal Voice** card.

    :::image type="content" source="./media/personal-voice/personal-voice-home.png" alt-text="Screenshot of the Speech Studio home page with the personal voice card visible." lightbox="./media/personal-voice/personal-voice-home.png":::

1. Select **Request demo access**.

    :::image type="content" source="./media/personal-voice/personal-voice-request-access.png" alt-text="Screenshot of the button to request access to personal voice in Speech Studio." lightbox="./media/personal-voice/personal-voice-request-access.png":::

1. After your access is approved, you can record your own voice and try the voice output samples in different languages. The demo includes a subset of the languages supported by personal voice.

    :::image type="content" source="./media/personal-voice/personal-voice-samples.png" alt-text="Screenshot of the personal voice demo experience in Speech Studio." lightbox="./media/personal-voice/personal-voice-samples.png":::

 
## Get user consent

With the personal voice feature, it's required that every voice be created with explicit consent from the user. A recorded statement from the user is required acknowledging that the customer will create and use their voice.

## Integrate personal voice in your apps

Personal voice creates a voice ID based on the speaker verbal statement file and the audio prompt (a clean human voice sample longer than 60 seconds). The user's voice characteristics are encoded in the voice ID that's used to generate synthesized audio with the text input provided. The voice created can generate speech in any of the 91 languages supported across 100+ locales. A locale tag isn't required. Personal voice uses automatic language detection at the sentence level.  

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

### Responsible AI 

We care about the people who use AI and the people who will be affected by it as much as we care about technology. For more information, see the Responsible AI [transparency notes](/legal/cognitive-services/speech-service/text-to-speech/transparency-note?context=/azure/ai-services/speech-service/context/context).

## Reference documentation

The API reference documentation is made available to approved customers. You can apply for access [here](https://aka.ms/customneural).

## Next steps

- Learn more about custom neural voice pro in the [overview](custom-neural-voice.md).
- Learn more about Speech Studio in the [overview](speech-studio-overview.md).
