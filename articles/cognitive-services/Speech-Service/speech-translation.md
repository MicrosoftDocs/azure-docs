---
title: Speech Translation overview | Microsoft Docs
description: An overview of the capabilities of Microsoft Speech Translation
services: cognitive-services
author: v-jerkin
manager: chriswendt1

ms.service: cognitive-services
ms.component: speech
ms.topic: article
ms.date: 4/28/2018
ms.author: v-jerkin
---

# Speech Translation overview

The Microsoft Speech API lets you add end-to-end, real-time, multi-language speech translation to applications and tools. The same API can be used for both speech-to-speech and speech-to-text translation.

With the Microsoft Translator Speech API, client applications stream speech audio to the service and receive back a stream of text- and audio-based results, which include the recognized text in the source language and its translation in the target language. Interim translations can be provided until an utterance is complete, at which time a final translation is provided. Optionally, a synthesized audio version of the final translation can be prepared, enabling true speech-to-speech translation.

The Speech Translation API uses a WebSockets protocol to provide a full-duplex communication channel between the client and the server.

## About the technology

The Speech Translation API employs the same technologies that power various Microsoft products and services. This service is already used by thousands of businesses worldwide in their applications and workflows to allow their content to reach a worldwide audience.

Underlying Microsoft's translation engine are two different approaches: statistical machine translation (SMT) and neural machine translation (NMT). The latter, an artificial intelligence approach employing neural networks, is the more modern approach to machine translation. MNT simply provides better translations—not just more accurate, but also more fluent and natural. The key reason for this fluidity is that NMT uses the full context of a sentence to translate words. 

Today, Microsoft has migrated to MNT for the most popular languages, employing SMT only for less-frequently-used languages. All [languages available for speech-to-speech translation](supported-languages.md#speech-translation-speech-to-speech) are powered by MNT. Speech-to-text translation may use SMT or MNT depending on the language pair. If the target language is supported by NMT, the full translation is NMT-powered. If the target language isn't supported by NMT, the translation is a hybrid of NMT and SMT, using English as a "pivot" between the two languages.

The differences between models are internal to the translation engine. End users will notice only the improved translation quality, especially for Chinese, Japanese, and Arabic.

> [!NOTE]
> Interested in learning more about the technology behind Microsoft's translation engine? See [Machine Translation](https://www.microsoft.com/en-us/translator/mt.aspx).
