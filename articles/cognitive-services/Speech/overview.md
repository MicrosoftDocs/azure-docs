---
title: Speech service overview | Microsoft Docs
description: An overview of the capabilities and APIs of the Speech service.
services: cognitive-services
author: jerrykindall
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 03/22/2018
ms.author: v-jerkin
---
# Speech service overview

The Speech service, part of Cognitive Services in Microsoft Azure, is a bundle of APIs in the Azure cloud that provide speech-related functionality for applications. These APIs are powered by the familiar, time-tested speech and language technologies used in other Microsoft products, including Cortana and Microsoft Office. Many languages and dialects are supported; see [Supported Languages](supported-languages.md).

|API|Description|
|-|-|
|Speech recognition|Converts continuous human speech to text that can be used as input to your application.|
|text-to-speech|Converts text to audio streams of natural-sounding speech for users of your application.|
|Speaker recognition|Recognizes speaker voiceprints for authentication or identification purposes.|
|Speech translation|Chains speech recognition, text translation, and text-to-speech to provide translations of speech.|

The Speech APIs are available in the following ways.

|Method|Description|
|-|-|
|REST|An HTTP-based API that can be used from any programming language that supports HTTP and JSON. Makes it easy to add the API's basic functionality to your application.|
|SDKs|Libraries for supported programming languages or platforms that deal with the details of the REST API for you, simplifying development&mdash;especially for more complex scenarios.|

[Swagger files](swagger-files.md) are available for all APIs. You can use the definitions in these files to help you build libraries or applications that use the REST APIs.

## Speech recognition API

The speech recognition, or speech-to-text, API transcribes audio streams into text that your application can accept as input. Your application can then, for example, enter the text into a document or act upon it as a command. 

Speech recognition has been optimized for interactive, conversation, and dictation scenarios. The following are common use cases for the speech recognition API.

> [!div class="checklist"]
> * Recognize brief a utterance, such as a command, without interim results
> * Transcribe a long, previously-recorded utterance, such as a voicemail message
> * Transcribe streaming speech in real-time, with partial interim results, for dictation
> * Determine what users want to do based on a spoken natural-language request

The API supports optional interactive speech recognition, with real-time continuous recognition and interim results. It also supports end-of-speech detection, optional automatic capitalization and punctuation, profanity masking, and text normalization.

If your users employ specialized vocabulary, work in noisy environments, or have unusual speech patterns, you can create custom language or acoustic models to improve recognition accuracy.

The speech recognition API integrates with the [Language Understanding](../luis/) service (LUIS), allowing meaning to be extracted from a user's utterances. With LUIS integration, users don't need to memorize a list of supported commands, but can make natural requests in their own words.

## Text to speech API

The text to speech, or speech synthesis, API, converts plain text to natural-sounding speech, delivered to your application as an audio file. Multiple voices, varying in gender or regional accent, are available for many supported languages. The API supports SSML tags, so you can specify exact phonetic pronunciation for troublesome words, as well as speech characteristics (such as emphasis, rate, volume, gender, and pitch) right in the txt.

The following are common use cases for the text to speech API.

> [!div class="checklist"]
> * Speech output as an alternative to the screen for visually-impaired users
> * Voice prompting for in-car applications such as navigation
> * Conversational user interfaces in concert with the speech recognition API

If you need to support an additional dialect or simply want a unique voice for your application, the text to speech API supports custom voice models.

## Speaker recognition API

Every voice has unique characteristics that can be used to identify the speaker, just like a fingerprint. The speaker recognition API creates a "voiceprint" based on a sample of a user's speech&mdash;a process called enrollment. The voiceprint can then be used to identify a speaker. The main use cases of the speaker recognition API are as follows.

> [!div class="checklist"]
> * Authenticate a user based on a combination of their voiceprint and a passphrase
> * Identify individual speakers in a recording based on their voiceprints

## Speech translation API

The speech translation API leverages Microsoft's speech recognition, [text translation](../translator/translator-info-overview), and optionally text to speech services to provide translation of speech. Using neural networks, Microsoft's latest translation engine delivers a more nuanced, fluent, and accurate translation than previous translation technologies for language pairs that support it.

Speech translation can be used to translate streaming audio in near-real-time or to process previously-recorded speech. In the case of streaming translation, the service returns interim results that can be displayed to the user to indicate translation progress.

Use cases for speech translation might include the following.

> [!div class="checklist"]
> * To authenticate a user based on a combination of their voiceprint and a passphrase
> * To identify individual speakers in a recording based on their voiceprints

Using the Microsoft Translator Hub, you can add specialized terminology to the translation service to improve the results for specific scenarios, such as software development or healthcare.

## Next steps

Start you free trial of the Speech service.

> [!div class="nextstepaction"]
> [Free trial](#TODO)

Or learn more about the concepts you should understand before using the Speech APIs.

> [!div class="nextstepaction"]
> [Speech recognition concepts](concepts/speech-recognition-basic-concepts.md)

> [!div class="nextstepaction"]
> [Text to speech concepts](concepts/text-to-speech-basic-concepts.md)

> [!div class="nextstepaction"]
> [Speaker recognition concepts](concepts/speaker-recognition-basic-concepts.md)

> [!div class="nextstepaction"]
> [Speech translation concepts](concepts/speech-translation-basic-concepts.md))

