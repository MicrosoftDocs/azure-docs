---
title: Speech translation overview - Speech service
titleSuffix: Azure AI services
description: With speech translation, you can add end-to-end, real-time, multi-language translation of speech to your applications, tools, and devices.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 4/22/2024
ms.author: eur
ms.custom: devx-track-csharp
---

# What is speech translation?

In this article, you learn about the benefits and capabilities of translation with Azure AI Speech. The Speech service supports real-time, multi-language speech to speech and speech to text translation of audio streams. 

By using the Speech SDK or Speech CLI, you can give your applications, tools, and devices access to source transcriptions and translation outputs for the provided audio. Interim transcription and translation results are returned as speech is detected, and the final results can be converted into synthesized speech.

For a list of languages supported for speech translation, see [Language and voice support](language-support.md?tabs=speech-translation).

> [!TIP]
> Go to the [Speech Studio](https://aka.ms/speechstudio/speechtranslation) to quickly test and translate speech into other languages of your choice with low latency.

## Core features

The core features of speech translation include:

- [Speech to text translation](#speech-to-text-translation)
- [Speech to speech translation](#speech-to-speech-translation)
- [Multi-lingual speech translation](#multi-lingual-speech-translation-preview)
- [Multiple target languages translation](#multiple-target-languages-translation)

## Speech to text translation

The standard feature offered by the Speech service is the ability to take in an input audio stream in your specified source language, and have it translated and outputted as text in your specified target language. 

## Speech to speech translation

As a supplement to the above feature, the Speech service also offers the option to read aloud the translated text using our large database of pretrained voices, allowing for a natural output of the input speech. 

## Multi-lingual speech translation (Preview)

Multi-lingual speech translation implements a new level of speech translation technology that unlocks various capabilities, including having no specified input language, handling language switches within the same session, and supporting live streaming translations into English. These features enable a new level of speech translation powers that can be implemented into your products. 

- Unspecified input language. Multi-lingual speech translation can receive audio in a wide range of languages, and there's no need to specify what the expected input language is. 
- Language switching. Multi-lingual speech translation allows for multiple languages to be spoken during the same session, and have them all translated into the same target language. There's no need to restart a session when the input language changes or any other actions by you. 
- Transcription. The service outputs a transcription in the specified target language. Source language transcription isn't available yet. 

Some use cases for multi-lingual speech translation include:

- Travel Interpreter. When traveling abroad, multi-lingual speech translation offers the ability to create a solution that allows customers to translate any input audio to and from the local language. This allows them to communicate with the locals and better understand their surroundings. 
- Business Meeting. In a meeting with people who speak different languages, multi-lingual speech translation allows the members of the meeting to all communicate with each other naturally as if there was no language barrier. 

For multi-lingual speech translation, these are the languages the Speech service can automatically detect and switch between from the input: Arabic (ar), Basque (eu), Bosnian (bs), Bulgarian (bg), Chinese Simplified (zh), Chinese Traditional (zhh), Czech (cs), Danish (da), Dutch (nl), English (en), Estonian (et), Finnish (fi), French (fr), Galician (gl), German (de), Greek (el), Hindi (hi), Hungarian (hu), Indonesian (id), Italian (it), Japanese (ja), Korean (ko), Latvian (lv), Lithuanian (lt), Macedonian (mk), Norwegian (nb), Polish (pl), Portuguese (pt), Romanian (ro), Russian (ru), Serbian (sr), Slovak (sk), Slovenian (sl), Spanish (es), Swedish (sv), Thai (th), Turkish (tr), Ukrainian (uk), Vietnamese (vi), and Welsh (cy).

For a list of the supported output (target) languages, see the *Translate to text language* table in the [language and voice support documentation](language-support.md?tabs=speech-translation).

For more information on multi-lingual speech translation, see [the speech translation how to guide](./how-to-translate-speech.md#multi-lingual-speech-translation-without-source-language-candidates) and [speech translation samples on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/translation_samples.cs#L472).

## Multiple target languages translation

In scenarios where you want output in multiple languages, the Speech service directly offers the ability for you to translate the input language into two target languages. This enables them to receive two outputs and share these translations to a wider audience with a single API call. If more output languages are required, you can create a multi-service resource or use separate translation services. 

If you need translation into more than two target languages, you need to either [create a multi-service resource](../multi-service-resource.md) or utilize separate translation services for more languages beyond the second. If you choose to call the speech translation service with a multi-service resource, please note that translation fees apply for each language beyond the second, based on the character count of the translation. 

To calculate the applied translation fee, please refer to [Azure AI Translator pricing](https://azure.microsoft.com/products/ai-services/ai-translator#Pricing). 

### Multiple target languages translation pricing

It's important to note that the speech translation service operates in real-time, and the intermediate speech results are translated to generate intermediate translation results. Therefore, the actual translation amount is greater than the input audio's tokens. You're charged for the speech to text transcription and the text translation for each target language.

For example, let's say that you want text translations from a one-hour audio file to three target languages. If the initial speech to text transcription contains 10,000 characters, you might be charged $2.80. 

> [!WARNING]
> The prices in this example are for illustrative purposes only. Please refer to the [Azure AI Speech pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and [Azure AI Translator pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator/) for the most up-to-date pricing information.

The previous example price of $2.80 was calculated by combining the speech to text transcription and the text translation costs. Here's how the calculation was done: 
- The speech translation list price is $2.50 per hour, covering up to 2 target languages. The price is used as an example of how to calculate costs. See **Pay as You Go** > **Speech translation** > **Standard** in the [Azure AI Speech pricing table](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for the most up-to-date pricing information.
- The cost for the third language translation is 30 cents in this example. The translation list price is $10 per million characters. Since the audio file contains 10,000 characters, the translation cost is $10 * 10,000 / 1,000,000 * 3 = $0.3. The number "3" in this equation represents a weighting coefficient of intermediate traffic, which might vary depending on the languages involved. The price is used as an example of how to calculate costs. See **Pay as You Go** > **Standard translation** > **Text translation** in the [Azure AI Translator pricing table](https://azure.microsoft.com/pricing/details/cognitive-services/translator/) for the most up-to-date pricing information.

## Get started

As your first step, try the [speech translation quickstart](get-started-speech-translation.md). The speech translation service is available via the [Speech SDK](speech-sdk.md) and the [Speech CLI](spx-overview.md).

You find [Speech SDK speech to text and translation samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk) on GitHub. These samples cover common scenarios, such as reading audio from a file or stream, continuous and single-shot recognition and translation, and working with custom models.

## Next steps

* Try the [speech translation quickstart](get-started-speech-translation.md)
* Install the [Speech SDK](speech-sdk.md)
* Install the [Speech CLI](spx-overview.md)
