---
title: What is the Translator Speech service?
titleSuffix: Azure Cognitive Services
description: Use the Translator Speech service API to add speech to speech and speech to text translation to your applications.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-speech
ms.topic: overview
ms.date: 3/5/2018
ms.author: v-jansko
---

# What is Translator Speech API?

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-translator-speech-deprecation-note.md)]

The Translator Speech API can be used to add end-to-end, real-time, speech translations to applications, tools, or any solution requiring multi-language speech translation regardless of the target OS or development languages. The API can be used for both speech to speech and speech to text translation.

Translator Text API is an Azure service, part of the [Azure Cognitive Services API collection](https://docs.microsoft.com/azure/#pivot=products&panel=cognitive) of machine learning and AI algorithms in the cloud, readily consumable in your development projects.

With the Translator Speech API, client applications stream speech audio to the service and receive back a stream of text- and audio-based results, which include the recognized text in the source language and its translation in the target language. Text results are produced by applying Automatic Speech Recognition (ASR) powered by deep neural networks to the incoming audio stream. Raw ASR output is further improved by a new technique called TrueText to more closely reflect user intent. For example, TrueText removes disfluencies (the hmms and coughs), repeated words, and restores proper punctuation and capitalization. The ability to mask or exclude profanities is also included. The recognition and translation engines are specifically trained to handle conversational speech. 

The Translator Speech service uses silence detection to determine the end of an utterance. After a pause in voice activity, the service will stream back a final result for the completed utterance. The service can also send back partial results, which give intermediate recognitions and translations for an utterance in progress. 

For speech to speech translation, the service provides the ability to synthesize speech (text-to-speech) from the spoken text in the target languages. Text-to-speech audio is created in the format specified by the client. WAV and MP3 formats are available.

The Translator Speech API uses the WebSocket protocol to provide a full-duplex communication channel between the client and the server. 

## About Microsoft Translator
Microsoft Translator is a cloud-based machine translation service. At the core of this service are the [Translator Text API] (https://www.microsoft.com/en-us/translator/translatorapi.aspx) and Translator Speech API which power various Microsoft products and services and are used by thousands of businesses worldwide in their applications and workflows, allowing their content to reach a worldwide audience.

Learn more about the [Microsoft Translator service](https://www.microsoft.com/en-us/translator/home.aspx)

## Microsoft Translator Neural Machine Translation (NMT)
The Translator Speech API uses both the legacy statistical machine translation (SMT) and newer neural machine translation (NMT) to provide translations.

Statistical machine translation has reached a plateau in terms of performance improvement. Translation quality is no longer improving in any significant way for generic systems with SMT. A new AI-based translation technology is gaining momentum based on Neural Networks (NN).

NMT provides better translations not only from a raw translation quality scoring standpoint but also because sound more fluent, more human, than SMT ones. 
The key reason for this fluidity is that NMT uses the full context of a sentence to translate words. SMT only takes the immediate context of a few words before and after each word.

NMT models are at the core of the API and aren't visible to end users. The only noticeable differences are:
* The improved translation quality, especially for languages such as Chinese, Japanese, and Arabic
* The incompatibility with the existing Hub customization features (for use with the Microsoft Translator Text API)

All of the supported speech translation languages are powered by NMT. Therefore, all speech to speech translation uses NMT. 

Speech to text translation may use a combination of NMT and SMT depending on the language pair. If the target language is supported by NMT, the full translation is NMT-powered. If the target language isn't supported by NMT, the translation is a hybrid of NMT and SMT using English as a "pivot" between the two languages. 

View supported languages on [Microsoft.com](https://www.microsoft.com/en-us/translator/languages.aspx). 

Learn more about [how NMT works](https://www.microsoft.com/en-us/translator/mt.aspx#nnt)

## Next steps

> [!div class="nextstepaction"]
> [Sign up](translator-speech-how-to-signup.md)

> [!div class="nextstepaction"]
> [Start coding](quickstarts/csharp.md)

## See also
- [Cognitive Services Documentation page](https://docs.microsoft.com/azure/#pivot=products&panel=cognitive)
- [Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)
- [Solution and pricing information](https://www.microsoft.com/en-us/translator/home.aspx) 
