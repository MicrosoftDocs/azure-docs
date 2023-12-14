---
title: Text to speech overview - Speech service
titleSuffix: Azure AI services
description: Get an overview of the benefits and capabilities of the text to speech feature of the Speech service.
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 09/25/2022
ms.author: eur
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech
---

# What is text to speech?

In this overview, you learn about the benefits and capabilities of the text to speech feature of the Speech service, which is part of Azure AI services.

Text to speech enables your applications, tools, or devices to convert text into humanlike synthesized speech. The text to speech capability is also known as speech synthesis. Use humanlike prebuilt neural voices out of the box, or create a custom neural voice that's unique to your product or brand. For a full list of supported voices, languages, and locales, see [Language and voice support for the Speech service](language-support.md?tabs=tts).

## Core features

Text to speech includes the following features:

| Feature | Summary | Demo |
| --- | --- | --- |
| Prebuilt neural voice (called *Neural* on the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | Highly natural out-of-the-box voices. Create an Azure account and Speech service subscription, and then use the [Speech SDK](./get-started-text-to-speech.md) or visit the [Speech Studio portal](https://speech.microsoft.com/portal) and select prebuilt neural voices to get started. Check the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). | Check the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery) and determine the right voice for your business needs. |
| Custom neural voice (called *Custom Neural* on the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | Easy-to-use self-service for creating a natural brand voice, with limited access for responsible use. Create an Azure account and Speech service subscription (with the S0 tier), and [apply](https://aka.ms/customneural) to use the custom neural feature. After you've been granted access, visit the [Speech Studio portal](https://speech.microsoft.com/portal) and select **Custom voice** to get started. Check the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). | Check the [voice samples](https://aka.ms/customvoice). |

### More about neural text to speech features

The text to speech feature of the Speech service on Azure has been fully upgraded to the neural text to speech engine. This engine uses deep neural networks to make the voices of computers nearly indistinguishable from the recordings of people. With the clear articulation of words, neural text to speech significantly reduces listening fatigue when users interact with AI systems.

The patterns of stress and intonation in spoken language are called _prosody_. Traditional text to speech systems break down prosody into separate linguistic analysis and acoustic prediction steps that are governed by independent models. That can result in muffled, buzzy voice synthesis.

Here's more information about neural text to speech features in the Speech service, and how they overcome the limits of traditional text to speech systems:

* **Real-time speech synthesis**: Use the [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md) to convert text to speech by using [prebuilt neural voices](language-support.md?tabs=tts) or [custom neural voices](custom-neural-voice.md).

* **Asynchronous synthesis of long audio**: Use the [batch synthesis API](batch-synthesis.md) (Preview) to asynchronously synthesize text to speech files longer than 10 minutes (for example, audio books or lectures). Unlike synthesis performed via the Speech SDK or Speech to text REST API, responses aren't returned in real-time. The expectation is that requests are sent asynchronously, responses are polled for, and synthesized audio is downloaded when the service makes it available.

* **Prebuilt neural voices**: Microsoft neural text to speech capability uses deep neural networks to overcome the limits of traditional speech synthesis with regard to stress and intonation in spoken language. Prosody prediction and voice synthesis happen simultaneously, which results in more fluid and natural-sounding outputs. Each prebuilt neural voice model is available at 24kHz and high-fidelity 48kHz. You can use neural voices to:

  - Make interactions with chatbots and voice assistants more natural and engaging.
  - Convert digital texts such as e-books into audiobooks.
  - Enhance in-car navigation systems.

  For a full list of platform neural voices, see [Language and voice support for the Speech service](language-support.md?tabs=tts).

* **Fine-tuning text to speech output with SSML**: Speech Synthesis Markup Language (SSML) is an XML-based markup language that's used to customize text to speech outputs. With SSML, you can adjust pitch, add pauses, improve pronunciation, change speaking rate, adjust volume, and attribute multiple voices to a single document.

  You can use SSML to define your own lexicons or switch to different speaking styles. With the [multilingual voices](https://techcommunity.microsoft.com/t5/azure-ai/azure-text-to-speech-updates-at-build-2021/ba-p/2382981), you can also adjust the speaking languages via SSML. To fine-tune the voice output for your scenario, see [Improve synthesis with Speech Synthesis Markup Language](speech-synthesis-markup.md) and [Speech synthesis with the Audio Content Creation tool](how-to-audio-content-creation.md).

* **Visemes**: [Visemes](how-to-speech-synthesis-viseme.md) are the key poses in observed speech, including the position of the lips, jaw, and tongue in producing a particular phoneme. Visemes have a strong correlation with voices and phonemes.

  By using viseme events in Speech SDK, you can generate facial animation data. This data can be used to animate faces in lip-reading communication, education, entertainment, and customer service. Viseme is currently supported only for the `en-US` (US English) [neural voices](language-support.md?tabs=tts).

> [!NOTE]
> We plan to retire the traditional/standard voices and non-neural custom voice in 2024. After that, we'll no longer support them. 
> 
> If your applications, tools, or products are using any of the standard voices and custom voices, you must migrate to the neural version. For more information, see [Migrate to neural voices](migration-overview-neural-voice.md).

## Get started

To get started with text to speech, see the [quickstart](get-started-text-to-speech.md). Text to speech is available via the [Speech SDK](speech-sdk.md), the [REST API](rest-text-to-speech.md), and the [Speech CLI](spx-overview.md).

> [!TIP]
> To convert text to speech with a no-code approach, try the [Audio Content Creation](how-to-audio-content-creation.md) tool in [Speech Studio](https://aka.ms/speechstudio/audiocontentcreation).

## Sample code

Sample code for text to speech is available on GitHub. These samples cover text to speech conversion in most popular programming languages:

* [Text to speech samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
* [Text to speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Custom neural voice

In addition to prebuilt neural voices, you can create and fine-tune custom neural voices that are unique to your product or brand. All it takes to get started is a handful of audio files and the associated transcriptions. For more information, see [Get started with custom neural voice](professional-voice-create-project.md).

## Pricing note

### Billable characters
When you use the text to speech feature, you're billed for each character that's converted to speech, including punctuation. Although the SSML document itself is not billable, optional elements that are used to adjust how the text is converted to speech, like phonemes and pitch, are counted as billable characters. Here's a list of what's billable:

* Text passed to the text to speech feature in the SSML body of the request
* All markup within the text field of the request body in the SSML format, except for `<speak>` and `<voice>` tags
* Letters, punctuation, spaces, tabs, markup, and all white-space characters
* Every code point defined in Unicode

For detailed information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

> [!IMPORTANT]
> Each Chinese character is counted as two characters for billing, including kanji used in Japanese, hanja used in Korean, or hanzi used in other languages.  

### Model training and hosting time for custom neural voice

Custom neural voice training and hosting are both calculated by hour and billed per second. For the billing unit price, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Custom neural voice (CNV) training time is measured by ‘compute hour’ (a unit to measure machine running time). Typically, when training a voice model, two computing tasks are running in parallel. So, the calculated compute hours will be longer than the actual training time. On average, it takes less than one compute hour to train a CNV Lite voice; while for CNV Pro, it usually takes 20 to 40 compute hours to train a single-style voice, and around 90 compute hours to train a multi-style voice. The CNV training time is billed with a cap of 96 compute hours. So in the case that a voice model is trained in 98 compute hours, you will only be charged with 96 compute hours. 

Custom neural voice (CNV) endpoint hosting is measured by the actual time (hour). The hosting time (hours) for each endpoint is calculated at 00:00 UTC every day for the previous 24 hours. For example, if the endpoint has been active for 24 hours on day one, it will be billed for 24 hours at 00:00 UTC the second day. If the endpoint is newly created or has been suspended during the day, it will be billed for its accumulated running time until 00:00 UTC the second day. If the endpoint is not currently hosted, it will not be billed. In addition to the daily calculation at 00:00 UTC each day, the billing is also triggered immediately when an endpoint is deleted or suspended. For example, for an endpoint created at 08:00 UTC on December 1, the hosting hour will be calculated to 16 hours at 00:00 UTC on December 2 and 24 hours at 00:00 UTC on December 3. If the user suspends hosting the endpoint at 16:30 UTC on December 3, the duration (16.5 hours) from 00:00 to 16:30 UTC on December 3 will be calculated for billing.

## Reference docs

* [Speech SDK](speech-sdk.md)
* [REST API: Text to speech](rest-text-to-speech.md)

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the transparency notes to learn about responsible AI use and deployment in your systems. 

* [Transparency note and use cases for custom neural voice](/legal/cognitive-services/speech-service/custom-neural-voice/transparency-note-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)  
* [Characteristics and limitations for using custom neural voice](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)   
* [Limited access to custom neural voice](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=/azure/ai-services/speech-service/context/context) 
* [Guidelines for responsible deployment of synthetic voice technology](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-guidelines-responsible-deployment-synthetic?context=/azure/ai-services/speech-service/context/context)   
* [Disclosure for voice talent](/legal/cognitive-services/speech-service/disclosure-voice-talent?context=/azure/ai-services/speech-service/context/context)   
* [Disclosure design guidelines](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-disclosure-guidelines?context=/azure/ai-services/speech-service/context/context)   
* [Disclosure design patterns](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-disclosure-patterns?context=/azure/ai-services/speech-service/context/context)   
* [Code of Conduct for Text to speech integrations](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=/azure/ai-services/speech-service/context/context)   
* [Data, privacy, and security for custom neural voice](/legal/cognitive-services/speech-service/custom-neural-voice/data-privacy-security-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)

## Next steps

* [Text to speech quickstart](get-started-text-to-speech.md)
* [Get the Speech SDK](speech-sdk.md)
