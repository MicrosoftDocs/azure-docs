---
title: "How to: Specify source language for speech to text - Speech Service"
titleSuffix: Azure Cognitive Services
description: The Speech SDK allows you to specify the source language when converting speech to text. This article describes how to use the FromConfig and SourceLanguageConfig methods to let the Speech service know the source language and provide a custom model target.
services: cognitive-services
author: susanhu
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: susanhu
---

# Specify source language for speech to text

If you know the source language of the audio that's being passed to the Speech SDK, you can use either the `FromConfig` or `SourceLanguageConfig` to specify the source language and custom language model used for recognition. In this article, you'll learn how to specify the source language in C++ and Java.

## How to specify source language in C++

In this example, the source language is provided explicitly as a parameter using the `FromConfig` method.

```C++
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, "de-DE", audioConfig);
```

In this example, the source language is provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter to `FromConfig` when creating the `recognizer`.

```C++
auto sourceLanguageConfig = SourceLanguageConfig::FromLanguage("de-DE");
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, sourceLanguageConfig, audioConfig);
```

In this example, the source language and custom endpoint are provided using `SourceLanguageConfig`. The `sourceLanguageConfig` is passed as a parameter to `FromConfig` when creating the `recognizer`.

```C++
auto sourceLanguageConfig = SourceLanguageConfig::FromLanguage("de-DE", "The Endpoint Id for custom model of de-DE");
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, sourceLanguageConfig, audioConfig);
```

### How to specify source language in Java

In this example, the source language is provided explicitly when creating a new `SpeechRecognizer`.

```Java
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, "de-DE", audioConfig);
```

In this example, the source language is provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter when creating a new `SpeechRecognizer`.

```Java
SourceLanguageConfig sourceLanguageConfig = SourceLanguageConfig.fromLanguage("de-DE");
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, sourceLanguageConfig, audioConfig);
```

In this example, the source language and custom endpoint are provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter when creating a new `SpeechRecognizer`.

```Java
SourceLanguageConfig sourceLanguageConfig = SourceLanguageConfig.fromLanguage("de-DE", "The Endpoint Id for custom model of de-DE");
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, sourceLanguageConfig, audioConfig);
```

>[!Note]
> `SetSpeechRecognitionLanguage` and `SetEndpointId` are deprecated methods from the `SpeechConfig` class in C++ and Java. The use of these methods are discouraged, and shouldn't be used when constructing a `SpeechRecognizer`.

## Next steps

* [Speech SDK reference documentation](speech-sdk.md)
