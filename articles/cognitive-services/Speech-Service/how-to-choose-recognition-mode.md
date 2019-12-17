---
title: Choosing a speech recognition mode with the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to choose the best recognition mode when using the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/12/2019
ms.author: erhopf
---

# Choosing a speech recognition mode

When performing speech-to-text recognition operations, the [Speech SDK](speech-sdk.md) provides multiple options for processing speech. Conceptually, this is sometimes called the *recognition mode*. This article compares the recognition modes and options to you can make the right choice for your needs.

## About languages

This article uses .NET C# as the examples for the API method names. Some differences in upper/lower case letters may be present when using other languages such as Java, but the same information applies across all supported languages in the [Speech SDK](speech-sdk.md).

## Recognize once

If you want to process each utterance one "sentence" at a time, use `SpeechRecognizer.RecognizeOnceAsync()`. This method will detect a recognized utterance from the input starting at the beginning of detected speech until the next pause (usually a pause marks the end of a sentence or line-of-thought).

At the end of one recognized utterance, the service stops processing audio from that request. The maximum limit for recognition is a sentence duration of 20 seconds.

## Continuous

If you need long-running recognition, use `SpeechRecognizer.StartContinuousRecognition()`, which will start and continue processing all utterances until you call the method `SpeechRecognizer.StopContinuousRecognitionAsync()` or until too much time in silence has passed. A limit of 10 minutes of total speech recognition time per session is enforced by the Speech service.

## Dictation

When using continuous recognition, you can enable dictation processing by using `SpeechConfig.EnableDictation()`. This mode will cause the SpeechRecognizer to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
