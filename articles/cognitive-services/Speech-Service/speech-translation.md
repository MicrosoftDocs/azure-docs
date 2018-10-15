---
title: About Speech Translation
description: An overview of the capabilities of Speech Translation
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: erhopf

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 04/28/2018
ms.author: erhopf
---

# About the Speech Translation API

The Microsoft Speech API lets you add end-to-end, real-time, multi-language translation  of speech to your applications, tools, and devices. The same API can be used for both speech-to-speech and speech-to-text translation.

With the Microsoft Translator Speech API, client applications stream speech audio to the service and receive back a stream of results. These results include the recognized text in the source language and its translation in the target language. Interim translations can be provided until an utterance is complete, at which time a final translation is provided.

Optionally, a synthesized audio version of the final translation can be prepared, enabling true speech-to-speech translation.

The Speech Translation API uses a WebSockets protocol to provide a full-duplex communication channel between the client and the server. But you don't need to deal with WebSockets; the Speech SDK handles that for you.

The Speech Translation API employs the same technologies that power various Microsoft products and services. This service is already used by thousands of businesses worldwide in their applications and workflows.

## About the technology

Underlying Microsoft's translation engine are two different approaches: statistical machine translation (SMT) and neural machine translation (NMT). The latter, an artificial intelligence approach employing neural networks, is the more modern approach to machine translation. NMT provides better translations — not just more accurate, but also more fluent and natural. The key reason for this fluidity is that NMT uses the full context of a sentence to translate words.

Today, Microsoft has migrated to NMT for the most popular languages, employing SMT only for less-frequently-used languages. All [languages available for speech-to-speech translation](language-support.md#speech-translation) are powered by NMT. Speech-to-text translation may use SMT or NMT depending on the language pair. If the target language is supported by NMT, the full translation is NMT-powered. If the target language isn't supported by NMT, the translation is a hybrid of NMT and SMT, using English as a "pivot" between the two languages.

The differences between models are internal to the translation engine. End users notice only the improved translation quality, especially for Chinese, Japanese, and Arabic.

> [!NOTE]
> Interested in learning more about the technology behind Microsoft's translation engine? See [Machine Translation](https://www.microsoft.com/en-us/translator/mt.aspx).

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to translate speech in C#](how-to-translate-speech-csharp.md)
* [See how to translate speech in C++](how-to-translate-speech-cpp.md)
* [See how to translate speech in Java](how-to-translate-speech-java.md)
